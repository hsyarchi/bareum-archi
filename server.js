const http = require('http');
const https = require('https');
const tls = require('tls');
const fs = require('fs');
const path = require('path');

// .env 파일이 있으면 환경변수로 자동 로드
(function loadDotEnv() {
  try {
    const envPath = path.join(__dirname, '.env');
    if (fs.existsSync(envPath)) {
      const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);
      lines.forEach((line) => {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) return;
        const eqIdx = trimmed.indexOf('=');
        if (eqIdx > 0) {
          const key = trimmed.slice(0, eqIdx).trim();
          const val = trimmed.slice(eqIdx + 1).trim().replace(/^['"]|['"]$/g, '');
          if (!process.env[key]) process.env[key] = val;
        }
      });
    }
  } catch (_) {}
})();

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = __dirname;
const CONSULT_FILE = path.join(PUBLIC_DIR, 'data', 'consultations.json');
const UPLOAD_DIR = path.join(PUBLIC_DIR, 'data', 'uploads');
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'hsyarchi@naver.com';
const NAVER_SMTP_USER = process.env.NAVER_SMTP_USER || 'hsyarchi';
const NAVER_SMTP_PASS = process.env.NAVER_SMTP_PASS || '';
const LAW_OC = 'hsyarchi';
const LAW_MST = '286993'; // 법률 제21820호 특정건축물 정리에 관한 특별조치법 (2026.12.17 시행)
const FALLBACK_LAW_FILE = path.join(PUBLIC_DIR, 'data', 'special-act-286993.json');
const VWORLD_KEY = 'A564E0B3-7DB8-4729-9F2F-FB07F8AB08DF';

let lawCache = {
  data: null,
  fetchedAt: 0,
  source: null
};

const ordinanceCache = new Map();

function extractLocalGovFromAddress(addressText, pnu) {
  const addr = String(addressText || '').replace(/\s+/g, ' ').trim();
  const cleanPnu = String(pnu || '').trim();
  const prefix5 = cleanPnu.slice(0, 5);
  const prefix2 = cleanPnu.slice(0, 2);

  const sidoMap = {
    '서울': '서울특별시', '서울시': '서울특별시', '서울특별시': '서울특별시',
    '부산': '부산광역시', '부산시': '부산광역시', '부산광역시': '부산광역시',
    '대구': '대구광역시', '대구시': '대구광역시', '대구광역시': '대구광역시',
    '인천': '인천광역시', '인천시': '인천광역시', '인천광역시': '인천광역시',
    '광주': '광주광역시', '광주시': '광주광역시', '광주광역시': '광주광역시',
    '대전': '대전광역시', '대전시': '대전광역시', '대전광역시': '대전광역시',
    '울산': '울산광역시', '울산시': '울산광역시', '울산광역시': '울산광역시',
    '세종': '세종특별자치시', '세종시': '세종특별자치시', '세종특별자치시': '세종특별자치시',
    '경기': '경기도', '경기도': '경기도',
    '강원': '강원특별자치도', '강원도': '강원특별자치도', '강원특별자치도': '강원특별자치도',
    '충북': '충청북도', '충청북도': '충청북도',
    '충남': '충청남도', '충청남도': '충청남도',
    '전북': '전북특별자치도', '전라북도': '전북특별자치도', '전북특별자치도': '전북특별자치도',
    '전남': '전라남도', '전라남도': '전라남도',
    '경북': '경상북도', '경상북도': '경상북도',
    '경남': '경상남도', '경상남도': '경상남도',
    '제주': '제주특별자치도', '제주도': '제주특별자치도', '제주특별자치도': '제주특별자치도'
  };

  // 1) 일반 주소에서 시/도 + 시/군/구 (+ 행정구) 추출
  const m = addr.match(/(서울특별시|서울시|서울|부산광역시|부산시|부산|대구광역시|대구시|대구|인천광역시|인천시|인천|광주광역시|광주시|광주|대전광역시|대전시|대전|울산광역시|울산시|울산|세종특별자치시|세종시|세종|경기도|경기|강원특별자치도|강원도|강원|충청북도|충북|충청남도|충남|전북특별자치도|전라북도|전북|전라남도|전남|경상북도|경북|경상남도|경남|제주특별자치도|제주도|제주)\s+([가-힣]+(?:시|군|구))?(?:\s+([가-힣]+구))?/);
  if (m) {
    const sido = sidoMap[m[1]] || m[1];
    const sigungu = m[2] || '';
    const subGu = m[3] || '';
    const localGovName = [sido, sigungu, subGu].filter(Boolean).join(' ');
    const queries = [];
    if (sigungu) {
      queries.push(`${sido} ${sigungu} 건축 조례`);
      queries.push(`${sigungu} 건축 조례`);
    }
    queries.push(`${sido} 건축 조례`);

    let muniCode = 'custom_region';
    if (sigungu === '구리시' || prefix5 === '41310') muniCode = 'guri';
    else if (sigungu === '동대문구' || prefix5 === '11230') muniCode = 'seoul_ddm';
    else if (sido === '서울특별시') muniCode = 'seoul_general';
    else if (sido === '경기도') muniCode = 'gyeonggi_general';

    return { sido, sigungu, subGu, localGovName, searchQueries: queries, muniCode };
  }

  // 2) 시/도 생략하고 시/군/구만 입력한 경우 (예: "구리시 ...", "동대문구 ...", "남양주시 ...")
  const mSigungu = addr.match(/^([가-힣]{2,6}(?:시|군|구))(?:\s|$)/);
  if (mSigungu) {
    const sigungu = mSigungu[1];
    let sido = '';
    if (sigungu === '구리시' || prefix5 === '41310') sido = '경기도';
    else if (sigungu === '동대문구' || prefix5 === '11230') sido = '서울특별시';
    else if (prefix2 === '11') sido = '서울특별시';
    else if (prefix2 === '41') sido = '경기도';

    const localGovName = [sido, sigungu].filter(Boolean).join(' ');
    const queries = [`${sigungu} 건축 조례`];
    if (sido) {
      queries.unshift(`${sido} ${sigungu} 건축 조례`);
      queries.push(`${sido} 건축 조례`);
    }
    let muniCode = 'custom_region';
    if (sigungu === '구리시') muniCode = 'guri';
    else if (sigungu === '동대문구') muniCode = 'seoul_ddm';
    else if (sido === '서울특별시') muniCode = 'seoul_general';
    else if (sido === '경기도') muniCode = 'gyeonggi_general';

    return { sido, sigungu, subGu: '', localGovName, searchQueries: queries, muniCode };
  }

  // 3) PNU 법정동코드 기반 폴백
  if (prefix5 === '41310') {
    return { sido: '경기도', sigungu: '구리시', subGu: '', localGovName: '경기도 구리시', searchQueries: ['구리시 건축 조례', '경기도 건축 조례'], muniCode: 'guri' };
  }
  if (prefix5 === '11230') {
    return { sido: '서울특별시', sigungu: '동대문구', subGu: '', localGovName: '서울특별시 동대문구', searchQueries: ['서울특별시 동대문구 건축 조례', '서울특별시 건축 조례'], muniCode: 'seoul_ddm' };
  }
  if (prefix2 === '11') {
    return { sido: '서울특별시', sigungu: '', subGu: '', localGovName: '서울특별시', searchQueries: ['서울특별시 건축 조례'], muniCode: 'seoul_general' };
  }
  if (prefix2 === '41') {
    return { sido: '경기도', sigungu: '', subGu: '', localGovName: '경기도', searchQueries: ['경기도 건축 조례'], muniCode: 'gyeonggi_general' };
  }

  return { sido: '', sigungu: '', subGu: '', localGovName: '', searchQueries: [], muniCode: 'building_act' };
}

function formatJoNo(raw) {
  if (!raw) return '';
  const s = String(raw).trim();
  if (/^\d{6}$/.test(s)) {
    const mainNum = parseInt(s.slice(0, 4), 10);
    const subNum = parseInt(s.slice(4, 6), 10);
    return subNum > 0 ? `제${mainNum}조의${subNum}` : `제${mainNum}조`;
  }
  const clean = s.replace(/^0+/, '') || s;
  const noJo = clean.replace(/^[제\s]+/, '').replace(/조$/, '');
  return `제${noJo}조`;
}

function parseOrdinanceFineRules(joArr, ordinanceName, govInfo) {
  const articles = [];
  let annualCount = 1;
  let maxAnnualCount = 2;
  let smallResDiscountRate = 0.5;
  let ordinanceDiscountRate = 0.5;
  let tempPermitRate = null;
  let tempReportRate = null;
  let workStructureRate = null;
  let elasticRates = null;

  for (const j of joArr) {
    const rawTitle = String(j['조제목'] || '').trim();
    const rawContent = Array.isArray(j['조내용']) ? j['조내용'].join('\n') : String(j['조내용'] || '').trim();

    // 이행강제금과 직접 관련 없는 특별회계/위원회/지도원/포상금 등 배제
    if (rawTitle.includes('특별회계') || rawTitle.includes('위원회') || rawTitle.includes('지도원') || rawTitle.includes('포상금')) {
      continue;
    }

    const isFineTitle = rawTitle.includes('이행강제금') || rawTitle.includes('탄력적 운영');
    const isFineContent = (rawTitle.includes('부과') || rawContent.includes('이행강제금의 부과') || rawContent.includes('부과 횟수') || rawContent.includes('제115조의2') || rawContent.includes('제115조의3') || rawContent.includes('별표 15')) && !rawTitle.includes('특별회계');

    if (!isFineTitle && !isFineContent) continue;

    const rawJoNo = Array.isArray(j['조문번호']) ? j['조문번호'][0] : String(j['조문번호'] || '');
    const cleanJoNo = formatJoNo(rawJoNo);
    const cleanTitle = rawTitle.replace(/^제\s*[\d의\s]+조\s*/, '').replace(/^\((.*)\)$/, '$1').trim() || rawTitle;

    articles.push({
      joNo: cleanJoNo,
      title: cleanTitle,
      content: rawContent,
      text: rawContent
    });

    // 1) 연간 부과 횟수 파싱 (예: "1년에 1회", "1년에 2회 이내")
    if (/1년에\s*1회/.test(rawContent) || /연\s*1회/.test(rawContent)) {
      annualCount = 1;
      maxAnnualCount = 1;
    } else if (/1년에\s*2회/.test(rawContent) || /연\s*2회/.test(rawContent)) {
      annualCount = 1;
      maxAnnualCount = 2;
    }

    // 2) 가설건축물 / 공작물 조례 부과율 파싱 (예: 시가표준액의 100분의 3, 100분의 2, 100분의 1)
    const mTempPermit = rawContent.match(/축조허가[^:\n]*:\s*시가표준액의\s*100분의\s*(\d+)/);
    if (mTempPermit) tempPermitRate = Number(mTempPermit[1]) / 100;

    const mTempReport = rawContent.match(/축조신고[^:\n]*가설건축물[^:\n]*:\s*시가표준액의\s*100분의\s*(\d+)/);
    if (mTempReport) tempReportRate = Number(mTempReport[1]) / 100;

    const mWork = rawContent.match(/옹벽\s*등\s*공작물[^:\n]*[:은]?\s*(?:.*?)시가표준액의\s*100분의\s*(\d+)/);
    if (mWork) workStructureRate = Number(mWork[1]) / 100;

    // 3) 탄력적 운영 비율 (영 제115조의3제1항 단서: 건폐율/용적률/무허가/미신고 조례 완화율)
    if (rawTitle.includes('탄력적 운영') || rawContent.includes('제115조의3')) {
      const mBcr = rawContent.match(/건폐율[^:\n]*:\s*100분의\s*(\d+)/);
      const mFar = rawContent.match(/용적률[^:\n]*:\s*100분의\s*(\d+)/);
      const mUnperm = rawContent.match(/허가를\s*받지[^:\n]*:\s*100분의\s*(\d+)/);
      const mUnrep = rawContent.match(/신고를\s*하지[^:\n]*:\s*100분의\s*(\d+)/);
      elasticRates = {
        bcr: mBcr ? Number(mBcr[1]) / 100 : null,
        far: mFar ? Number(mFar[1]) / 100 : null,
        unpermitted: mUnperm ? Number(mUnperm[1]) / 100 : null,
        unreported: mUnrep ? Number(mUnrep[1]) / 100 : null
      };
    }
  }

  const joSummaryParts = [];
  if (articles.length > 0) {
    const joNums = articles.map((a) => `${a.joNo}(${a.title || '이행강제금'})`).join(' · ');
    joSummaryParts.push(`${joNums} 적용`);
  }
  joSummaryParts.push(`연간 부과: 연 ${annualCount}회 원칙${maxAnnualCount > 1 ? ` (중대위반 시 최대 연 ${maxAnnualCount}회)` : ''}`);
  joSummaryParts.push('소규모 주거용 1/2 감경');
  if (workStructureRate != null) {
    joSummaryParts.push(`미신고 공작물 시가표준액의 ${Math.round(workStructureRate * 100)}%`);
  }
  if (tempPermitRate != null || tempReportRate != null) {
    joSummaryParts.push(`가설건축물 조례 부과율(${tempPermitRate ? Math.round(tempPermitRate * 100) + '%' : ''}${tempReportRate ? '·' + Math.round(tempReportRate * 100) + '%' : ''})`);
  }

  const localGovName = govInfo.localGovName || [govInfo.sido, govInfo.sigungu].filter(Boolean).join(' ') || '건축법 기준';

  return {
    ok: true,
    hasOrdinance: articles.length > 0,
    muniCode: govInfo.muniCode,
    sido: govInfo.sido,
    sigungu: govInfo.sigungu,
    localGovName,
    ordinanceName: `「${ordinanceName}」`,
    annualCount,
    maxAnnualCount,
    smallResDiscountRate,
    ordinanceDiscountRate,
    tempPermitRate,
    tempReportRate,
    workStructureRate,
    elasticRates,
    summaryText: joSummaryParts.join(' · '),
    articles
  };
}

async function fetchLocalOrdinanceByAddress(addressText, pnu) {
  const govInfo = extractLocalGovFromAddress(addressText, pnu);
  if (!govInfo.searchQueries || govInfo.searchQueries.length === 0) {
    return {
      ok: true,
      hasOrdinance: false,
      muniCode: 'building_act',
      sido: '',
      sigungu: '',
      localGovName: govInfo.localGovName || '건축법 법정 기준',
      ordinanceName: '「건축법」 제80조 및 동법 시행령 제115조의2([별표 15])',
      annualCount: 1,
      maxAnnualCount: 2,
      smallResDiscountRate: 0.5,
      ordinanceDiscountRate: 1.0,
      source: 'building-act-default',
      summaryText: '주소 미입력 또는 해당 지자체 별도 조례 미확인 시 「건축법」 제80조 및 시행령 [별표 15] 법정 기준(연 1~2회 이내 부과 · 소규모 주거 60㎡ 이하 50% 감경)으로 산출합니다.',
      articles: []
    };
  }

  const cacheKey = `${govInfo.localGovName}:${govInfo.muniCode}`;
  const now = Date.now();
  if (ordinanceCache.has(cacheKey)) {
    const cached = ordinanceCache.get(cacheKey);
    if (now - cached.fetchedAt < 3600 * 1000) {
      return cached.data;
    }
  }

  for (const qStr of govInfo.searchQueries) {
    try {
      const searchUrl = `https://www.law.go.kr/DRF/lawSearch.do?OC=${encodeURIComponent(LAW_OC)}&target=ordin&type=JSON&display=30&query=${encodeURIComponent(qStr)}`;
      const searchRes = await httpsGetJson(searchUrl, 6000);
      const rawList = searchRes?.OrdinSearch?.law;
      if (!rawList) continue;
      const list = Array.isArray(rawList) ? rawList : [rawList];

      // 가장 정확히 일치하는 건축 조례 선택
      const normTarget = qStr.replace(/\s+/g, '');
      let matched = list.find((it) => String(it['자치법규명'] || '').replace(/\s+/g, '') === normTarget);
      if (!matched) {
        matched = list.find((it) => {
          const nm = String(it['자치법규명'] || '');
          return nm.endsWith('건축 조례') || nm.endsWith('건축조례');
        });
      }
      if (!matched || !matched['자치법규일련번호']) continue;

      const mst = matched['자치법규일련번호'];
      const detailUrl = `https://www.law.go.kr/DRF/lawService.do?OC=${encodeURIComponent(LAW_OC)}&target=ordin&MST=${encodeURIComponent(mst)}&type=JSON`;
      const detailRes = await httpsGetJson(detailUrl, 6000);
      const rawJo = detailRes?.LawService?.조문?.조 || [];
      const joArr = Array.isArray(rawJo) ? joArrFromRaw(rawJo) : [];

      const parsedRules = parseOrdinanceFineRules(joArr, matched['자치법규명'], govInfo);
      // 자치구 조례에 이행강제금 조항이 없고 상위 광역시·도 조례에 위임된 경우 다음 검색어(예: 서울특별시 건축 조례) 계속 탐색
      if (!parsedRules.articles || parsedRules.articles.length === 0) {
        continue;
      }

      parsedRules.mst = mst;
      parsedRules.effectiveDate = matched['시행일자'] || '';
      parsedRules.agencyName = govInfo.localGovName || matched['지자체기관명'] || `${govInfo.sido} ${govInfo.sigungu}`.trim();
      parsedRules.source = 'moleg-ordin-live';

      ordinanceCache.set(cacheKey, { fetchedAt: now, data: parsedRules });
      return parsedRules;
    } catch (_) {
      // 다음 검색어로 폴백
    }
  }

  // 해당 지자체 조례가 없거나 조회되지 않는 경우: 「건축법」 제80조 및 동법 시행령 제115조의2 법정 기준 적용
  const fallbackData = {
    ok: true,
    hasOrdinance: false,
    muniCode: govInfo.muniCode || 'building_act',
    sido: govInfo.sido,
    sigungu: govInfo.sigungu,
    localGovName: govInfo.localGovName || '건축법 법정 기준',
    ordinanceName: '「건축법」 제80조 및 동법 시행령 제115조의2([별표 15])',
    agencyName: govInfo.localGovName || '건축법 법정 기준',
    annualCount: 1,
    maxAnnualCount: 2,
    smallResDiscountRate: 0.5,
    ordinanceDiscountRate: 1.0,
    source: 'building-act-fallback',
    summaryText: `${govInfo.localGovName ? govInfo.localGovName + ' 관할 ' : ''}별도 건축조례 이행강제금 특례 조항이 확인되지 않아 「건축법」 제80조 및 동법 시행령 제115조의2([별표 15]) 법정 기준으로 계산합니다.`,
    articles: []
  };
  return fallbackData;
}

function joArrFromRaw(rawJo) {
  return Array.isArray(rawJo) ? rawJo : (rawJo ? [rawJo] : []);
}

function httpsGetJson(url, timeoutMs = 6000, extraHeaders = {}) {
  return new Promise((resolve, reject) => {
    const headers = Object.assign({
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      'Referer': 'http://localhost:3000/'
    }, extraHeaders);

    const req = https.get(url, { timeout: timeoutMs, headers }, (res) => {
      if (res.statusCode < 200 || res.statusCode >= 300) {
        res.resume();
        return reject(new Error(`HTTP ${res.statusCode}`));
      }
      let raw = '';
      res.setEncoding('utf8');
      res.on('data', (chunk) => { raw += chunk; });
      res.on('end', () => {
        try {
          resolve(JSON.parse(raw));
        } catch (err) {
          reject(err);
        }
      });
    });
    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy(new Error('Request timeout'));
    });
  });
}

async function fetchMolegLawJson(oc, mst) {
  const apiUrl = `https://www.law.go.kr/DRF/lawService.do?OC=${encodeURIComponent(oc)}&target=law&MST=${encodeURIComponent(mst)}&type=JSON`;
  const parsed = await httpsGetJson(apiUrl, 6000);
  if (!parsed || !parsed['법령']) {
    throw new Error('Invalid MOLEG JSON structure');
  }
  return parsed;
}

function normalizeAddressQuery(raw) {
  let s = String(raw || '').trim();
  // 괄호로 병기된 부가 주소가 있으면 앞쪽 주소를 우선 추출할 수 있도록 공백 정리
  s = s.replace(/\s+/g, ' ');
  // '제기동67-155' -> '제기동 67-155', '판교역로166' -> '판교역로 166'
  s = s.replace(/([가-힣0-9]+(?:동|리|로|길|가))(\d)/g, '$1 $2');
  // '67-155번지' -> '67-155', '532번지' -> '532'
  s = s.replace(/(\d+(?:-\d+)?)번지\b/g, '$1');
  return s.trim();
}

function buildPnuFromBcodeAndJibun(bcode, jibunText) {
  const cleanBcode = String(bcode || '').trim();
  if (!/^\d{10}$/.test(cleanBcode)) return '';
  const cleanJibun = normalizeAddressQuery(jibunText);
  const m = cleanJibun.match(/(?:^|\s)(산\s*)?(\d+)(?:-(\d+))?\s*$/);
  if (!m) return '';
  const san = m[1] ? '2' : '1';
  const bon = String(m[2]).padStart(4, '0');
  const bu = String(m[3] || '0').padStart(4, '0');
  return `${cleanBcode}${san}${bon}${bu}`;
}

async function searchVworldAddress(query) {
  const normalized = normalizeAddressQuery(query);
  // 괄호 병기 주소 예: "서울 동대문구 제기로4나길 31 (서울 동대문구 제기동 67-155)" 처리
  const withoutParen = normalizeAddressQuery(normalized.replace(/\([^)]*\)/g, ' '));
  const searchQuery = withoutParen || normalized;
  const q = encodeURIComponent(searchQuery);

  const roadUrl = `https://api.vworld.kr/req/search?service=search&request=search&version=2.0&crs=EPSG:4326&size=15&page=1&query=${q}&type=address&category=road&format=json&errorformat=json&key=${VWORLD_KEY}`;
  const parcelUrl = `https://api.vworld.kr/req/search?service=search&request=search&version=2.0&crs=EPSG:4326&size=15&page=1&query=${q}&type=address&category=parcel&format=json&errorformat=json&key=${VWORLD_KEY}`;

  const [roadRes, parcelRes] = await Promise.all([
    httpsGetJson(roadUrl, 6000).catch(() => null),
    httpsGetJson(parcelUrl, 6000).catch(() => null)
  ]);

  const items = [];
  const byPnu = new Map();

  function collectItems(resObj, defaultCategory) {
    const list = resObj?.response?.result?.items;
    if (!Array.isArray(list)) return;
    for (const it of list) {
      const pnu = String(it.id || '').trim();
      if (!pnu) continue;
      const road = (it.address?.road || '').trim();
      const parcel = (it.address?.parcel || '').trim();
      const bldnm = (it.address?.bldnm || '').trim();
      const zipcode = (it.address?.zipcode || '').trim();

      if (byPnu.has(pnu)) {
        const existing = byPnu.get(pnu);
        if (!existing.road && road) existing.road = road;
        if (!existing.parcel && parcel) existing.parcel = parcel;
        if (!existing.bldnm && bldnm) existing.bldnm = bldnm;
        if (!existing.zipcode && zipcode) existing.zipcode = zipcode;
        continue;
      }

      const entry = {
        pnu,
        category: it.address?.category || defaultCategory,
        road,
        parcel,
        bldnm,
        zipcode
      };
      byPnu.set(pnu, entry);
      items.push(entry);
    }
  }

  // 동/리/가 + 지번 형태이면 지번(parcel) 검색 결과를 우선 배치
  const isParcelQuery = /(?:동|리|가)\s+(?:산\s*)?\d/.test(searchQuery) && !/(?:로|길)\s+\d/.test(searchQuery);
  if (isParcelQuery) {
    collectItems(parcelRes, 'parcel');
    collectItems(roadRes, 'road');
  } else {
    collectItems(roadRes, 'road');
    collectItems(parcelRes, 'parcel');
  }

  return items;
}

async function fetchNedLandPricePage(pnu, pageNo) {
  const url1 = `https://api.vworld.kr/ned/data/getIndvdLandPriceAttr?pnu=${encodeURIComponent(pnu)}&format=json&numOfRows=10&pageNo=${pageNo}&key=${VWORLD_KEY}&domain=http://localhost:3000`;
  let data = await httpsGetJson(url1, 6000, { Referer: 'http://localhost:3000/' }).catch(() => null);
  if (!data || data?.indvdLandPrices?.resultCode === 'INCORRECT_KEY') {
    const url2 = `https://api.vworld.kr/ned/data/getIndvdLandPriceAttr?pnu=${encodeURIComponent(pnu)}&format=json&numOfRows=10&pageNo=${pageNo}&key=${VWORLD_KEY}&domain=https://www.vworld.kr`;
    data = await httpsGetJson(url2, 6000, { Referer: 'https://www.vworld.kr/' }).catch(() => null);
  }
  return data;
}

function normalizePriceFields(fields, fallbackPnu) {
  if (!fields) return [];
  const arr = Array.isArray(fields) ? fields : [fields];
  return arr
    .map((f) => ({
      pnu: f.pnu || fallbackPnu,
      stdrYear: String(f.stdrYear || ''),
      stdrMt: String(f.stdrMt || '01'),
      pblntfPclnd: Number(f.pblntfPclnd || 0),
      pblntfDe: f.pblntfDe || '',
      ldCodeNm: f.ldCodeNm || '',
      mnnmSlno: f.mnnmSlno || '',
      stdLandAt: f.stdLandAt || 'N'
    }))
    .filter((f) => f.pblntfPclnd > 0);
}

async function fetchVworldLandPriceByPnu(pnu) {
  // 1차: VWorld 개별공시지가 속성조회 (getIndvdLandPriceAttr) - numOfRows 최대 10건이므로 마지막 페이지(최신 연도) 조회
  const firstData = await fetchNedLandPricePage(pnu, 1);
  const totalCount = Number(firstData?.indvdLandPrices?.totalCount || 0);
  let allItems = normalizePriceFields(firstData?.indvdLandPrices?.field, pnu);

  if (totalCount > 10) {
    const lastPage = Math.ceil(totalCount / 10);
    const pagesToFetch = [];
    if (lastPage > 2) pagesToFetch.push(lastPage - 1);
    if (lastPage > 1) pagesToFetch.push(lastPage);

    const pageResults = await Promise.all(
      pagesToFetch.map((p) => fetchNedLandPricePage(pnu, p))
    );
    for (const pr of pageResults) {
      allItems = allItems.concat(normalizePriceFields(pr?.indvdLandPrices?.field, pnu));
    }
  }

  // 연도별 중복 제거 후 최신 연도순 정렬
  const byYear = new Map();
  for (const item of allItems) {
    const key = `${item.stdrYear}-${item.stdrMt}`;
    byYear.set(key, item);
  }
  const sorted = Array.from(byYear.values()).sort(
    (a, b) => Number(b.stdrYear) - Number(a.stdrYear) || Number(b.stdrMt) - Number(a.stdrMt)
  );

  if (sorted.length > 0) {
    return sorted;
  }

  // 2차 폴백: VWorld 연속지적도 공시지가 레이어 (LP_PA_CBND_BUBUN) 조회
  const fallbackUrl = `https://api.vworld.kr/req/data?service=data&request=GetFeature&data=LP_PA_CBND_BUBUN&key=${VWORLD_KEY}&domain=http://localhost:3000&format=json&attrFilter=pnu:=:${encodeURIComponent(pnu)}`;
  const fbData = await httpsGetJson(fallbackUrl, 6000, { Referer: 'http://localhost:3000/' }).catch(() => null);
  const feat = fbData?.response?.result?.featureCollection?.features?.[0]?.properties;
  if (feat && Number(feat.jiga) > 0) {
    return [{
      pnu: feat.pnu || pnu,
      stdrYear: String(feat.gosi_year || new Date().getFullYear()),
      stdrMt: String(feat.gosi_month || '01').padStart(2, '0'),
      pblntfPclnd: Number(feat.jiga),
      pblntfDe: '',
      ldCodeNm: feat.addr || '',
      mnnmSlno: feat.jibun || '',
      stdLandAt: 'N'
    }];
  }

  return [];
}

// --- 무료 상담 신청 이메일 발송 헬퍼 (1. 네이버 SMTP 직접 발송, 2. FormSubmit 릴레이) ---
function encodeMimeWord(str) {
  return '=?UTF-8?B?' + Buffer.from(String(str || ''), 'utf8').toString('base64') + '?=';
}

function sendNaverSmtpMail(record, savedFiles) {
  return new Promise((resolve, reject) => {
    const fromEmail = NAVER_SMTP_USER.includes('@') ? NAVER_SMTP_USER : `${NAVER_SMTP_USER}@naver.com`;
    const toEmail = ADMIN_EMAIL;
    const subject = `[바름건축 상담신청] (${record.category || '일반'}) ${record.name} - ${record.phone}`;
    const boundary = '----=_BareumPart_' + Date.now();

    const textBody = [
      `■ 바름건축 무료 상담 신청서 (${record.id})`,
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `• 접수일시: ${record.createdAtKST}`,
      `• 상담분야: ${record.category || '-'}`,
      `• 성함: ${record.name || '-'}`,
      `• 연락처: ${record.phone || '-'}`,
      `• 이메일: ${record.email || '-'}`,
      `• 연락 희망 시간: ${record.contactTime || '-'}`,
      `• 건물 주소: ${record.address || '-'}`,
      `• 건물 종류: ${record.buildingType || '-'}`,
      `• 신청인 구분: ${record.role || '-'}`,
      `• 첨부 파일: ${savedFiles.length ? savedFiles.map((f) => f.originalName).join(', ') : '없음'}`,
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      ``,
      `[상황 설명 및 문의 내용]`,
      `${record.message || ''}`
    ].join('\r\n');

    const parts = [
      `From: ${encodeMimeWord('바름건축 홈페이지')} <${fromEmail}>`,
      `To: <${toEmail}>`,
      ...(record.email ? [`Reply-To: <${record.email}>`] : []),
      `Subject: ${encodeMimeWord(subject)}`,
      `MIME-Version: 1.0`,
      `Content-Type: multipart/mixed; boundary="${boundary}"`,
      ``,
      `--${boundary}`,
      `Content-Type: text/plain; charset="UTF-8"`,
      `Content-Transfer-Encoding: base64`,
      ``,
      Buffer.from(textBody, 'utf8').toString('base64').replace(/(.{76})/g, '$1\r\n')
    ];

    for (const f of savedFiles) {
      if (!f.base64) continue;
      parts.push(
        `--${boundary}`,
        `Content-Type: ${f.mimeType || 'application/octet-stream'}; name="${encodeMimeWord(f.originalName)}"`,
        `Content-Disposition: attachment; filename="${encodeMimeWord(f.originalName)}"`,
        `Content-Transfer-Encoding: base64`,
        ``,
        String(f.base64).replace(/(.{76})/g, '$1\r\n')
      );
    }
    parts.push(`--${boundary}--`, ``);
    const rawMime = parts.join('\r\n');

    const socket = tls.connect(465, 'smtp.naver.com', { servername: 'smtp.naver.com', timeout: 10000 });
    let step = 0;
    let buf = '';

    const sendLine = (line) => socket.write(line + '\r\n');

    socket.on('timeout', () => {
      socket.destroy();
      reject(new Error('SMTP 연결 시간 초과'));
    });
    socket.on('error', (err) => reject(err));
    socket.on('data', (chunk) => {
      buf += chunk.toString('utf8');
      const lines = buf.split('\r\n');
      buf = lines.pop();
      for (const line of lines) {
        if (!line) continue;
        if (line.length >= 4 && line[3] === '-') continue; // multi-line response continuation
        const code = parseInt(line.slice(0, 3), 10);
        if (code >= 400) {
          socket.end();
          return reject(new Error(`SMTP Error (${code}): ${line}`));
        }
        if (step === 0 && code === 220) {
          step = 1;
          sendLine('EHLO bareum-archi.local');
        } else if (step === 1 && code === 250) {
          step = 2;
          sendLine('AUTH LOGIN');
        } else if (step === 2 && code === 334) {
          step = 3;
          sendLine(Buffer.from(NAVER_SMTP_USER, 'utf8').toString('base64'));
        } else if (step === 3 && code === 334) {
          step = 4;
          sendLine(Buffer.from(NAVER_SMTP_PASS, 'utf8').toString('base64'));
        } else if (step === 4 && code === 235) {
          step = 5;
          sendLine(`MAIL FROM:<${fromEmail}>`);
        } else if (step === 5 && code === 250) {
          step = 6;
          sendLine(`RCPT TO:<${toEmail}>`);
        } else if (step === 6 && code === 250) {
          step = 7;
          sendLine('DATA');
        } else if (step === 7 && code === 354) {
          step = 8;
          socket.write(rawMime + '\r\n.\r\n');
        } else if (step === 8 && code === 250) {
          step = 9;
          sendLine('QUIT');
          socket.end();
          resolve({ ok: true });
        }
      }
    });
  });
}

function sendFormSubmitRelay(record) {
  return new Promise((resolve) => {
    const payload = JSON.stringify({
      _subject: `[바름건축 상담신청] (${record.category || '일반'}) ${record.name} - ${record.phone}`,
      _template: 'table',
      _captcha: 'false',
      접수번호: record.id,
      접수일시: record.createdAtKST,
      상담분야: record.category || '-',
      성함: record.name || '-',
      연락처: record.phone || '-',
      이메일: record.email || '-',
      연락희망시간: record.contactTime || '-',
      건물주소: record.address || '-',
      건물종류: record.buildingType || '-',
      신청인구분: record.role || '-',
      첨부파일: record.files && record.files.length ? record.files.map((f) => f.name).join(', ') : '없음',
      상황설명: record.message || ''
    });

    const req = https.request(
      `https://formsubmit.co/ajax/${encodeURIComponent(ADMIN_EMAIL)}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Content-Length': Buffer.byteLength(payload),
          'User-Agent': 'Mozilla/5.0 (BareumArchi-Server/1.0)',
          'Origin': 'http://localhost:3000',
          'Referer': 'http://localhost:3000/consult.html'
        },
        timeout: 20000
      },
      (res) => {
        let data = '';
        res.on('data', (c) => (data += c));
        res.on('end', () => {
          try {
            const parsed = JSON.parse(data || '{}');
            const isOk = parsed.success === 'true' || parsed.success === true;
            resolve({ ok: isOk, message: parsed.message || '' });
          } catch (_) {
            resolve({ ok: false, message: '응답 파싱 실패' });
          }
        });
      }
    );
    req.on('error', (e) => resolve({ ok: false, message: e.message }));
    req.on('timeout', () => {
      req.destroy();
      resolve({ ok: false, message: '타임아웃' });
    });
    req.write(payload);
    req.end();
  });
}

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const server = http.createServer(async (req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  let reqPath = decodeURI(parsedUrl.pathname);

  // 1. VWorld 개별공시지가 조회 API 엔드포인트
  if (reqPath === '/api/vworld/land-price') {
    const query = (parsedUrl.searchParams.get('query') || '').trim();
    const bcode = (parsedUrl.searchParams.get('bcode') || '').trim();
    const jibunParam = (parsedUrl.searchParams.get('jibun') || '').trim();
    const roadParam = (parsedUrl.searchParams.get('road') || '').trim();
    const bldnmParam = (parsedUrl.searchParams.get('bldnm') || '').trim();
    let targetPnu = (parsedUrl.searchParams.get('pnu') || '').trim();

    if (!query && !targetPnu && !jibunParam) {
      res.writeHead(400, { 'Content-Type': 'application/json; charset=UTF-8' });
      return res.end(JSON.stringify({ ok: false, error: '주소를 입력하거나 [주소 찾기] 버튼으로 주소를 선택해 주세요.' }));
    }

    try {
      // Daum 우편번호 API 등에서 법정동코드(bcode)와 지번(jibun)이 전달된 경우 19자리 PNU 직접 생성
      if (!targetPnu && bcode && (jibunParam || query)) {
        targetPnu = buildPnuFromBcodeAndJibun(bcode, jibunParam || query);
      }

      let candidates = [];
      const searchTarget = query || jibunParam || roadParam;
      if (searchTarget) {
        candidates = await searchVworldAddress(searchTarget);
        if (!targetPnu && candidates.length > 0) {
          targetPnu = candidates[0].pnu;
        }
      }

      if (!targetPnu) {
        res.writeHead(404, { 'Content-Type': 'application/json; charset=UTF-8' });
        return res.end(JSON.stringify({
          ok: false,
          error: '입력하신 주소로 필지(PNU)를 찾을 수 없습니다. [주소 찾기] 버튼을 눌러 전체 주소를 선택해 주세요.'
        }));
      }

      const prices = await fetchVworldLandPriceByPnu(targetPnu);
      if (!prices.length) {
        res.writeHead(404, { 'Content-Type': 'application/json; charset=UTF-8' });
        return res.end(JSON.stringify({
          ok: false,
          pnu: targetPnu,
          candidates,
          error: '해당 주소지의 개별공시지가 데이터가 존재하지 않습니다. 인근 지번을 선택하거나 직접 입력해 주세요.'
        }));
      }

      const fallbackParcel = jibunParam || `${prices[0].ldCodeNm} ${prices[0].mnnmSlno}`.trim();
      let selectedAddr = candidates.find((c) => c.pnu === targetPnu);
      if (selectedAddr) {
        if (!selectedAddr.road && roadParam) selectedAddr.road = roadParam;
        if (!selectedAddr.parcel && fallbackParcel) selectedAddr.parcel = fallbackParcel;
        if (!selectedAddr.bldnm && bldnmParam) selectedAddr.bldnm = bldnmParam;
      } else {
        selectedAddr = {
          pnu: targetPnu,
          road: roadParam || '',
          parcel: fallbackParcel,
          bldnm: bldnmParam || ''
        };
        if (selectedAddr.parcel || selectedAddr.road) {
          candidates.unshift(selectedAddr);
        }
      }

      // 해당 주소지의 관할 지자체 건축조례(이행강제금 부과 규정) 자동 조회 및 파싱
      const fullAddrForOrdinance = prices[0]?.ldCodeNm || selectedAddr.parcel || selectedAddr.road || fallbackParcel || query;
      const ordinance = await fetchLocalOrdinanceByAddress(fullAddrForOrdinance, targetPnu).catch(() => null);

      res.writeHead(200, {
        'Content-Type': 'application/json; charset=UTF-8',
        'Cache-Control': 'no-cache'
      });
      return res.end(JSON.stringify({
        ok: true,
        pnu: targetPnu,
        address: selectedAddr,
        latest: prices[0],
        history: prices.slice(0, 5),
        ordinance,
        candidates
      }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json; charset=UTF-8' });
      return res.end(JSON.stringify({
        ok: false,
        error: '개별공시지가 조회 중 오류가 발생했습니다: ' + err.message
      }));
    }
  }

  // 1-2. 주소 또는 지자체명 기반 자치법규(건축조례 이행강제금 조항) 단독 조회 API
  if (reqPath === '/api/law/local-ordinance') {
    const addr = (parsedUrl.searchParams.get('address') || parsedUrl.searchParams.get('query') || '').trim();
    const pnu = (parsedUrl.searchParams.get('pnu') || '').trim();
    try {
      const ordinance = await fetchLocalOrdinanceByAddress(addr, pnu);
      res.writeHead(200, {
        'Content-Type': 'application/json; charset=UTF-8',
        'Cache-Control': 'no-cache'
      });
      return res.end(JSON.stringify(Object.assign({ ok: true, ordinance }, ordinance)));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json; charset=UTF-8' });
      return res.end(JSON.stringify({ ok: false, error: err.message }));
    }
  }

  // 2. 법제처 국가법령정보센터 Open API 연동 엔드포인트
  if (reqPath === '/api/law/special-act') {
    const oc = LAW_OC;
    const mst = parsedUrl.searchParams.get('mst') || LAW_MST;
    const forceRefresh = parsedUrl.searchParams.get('refresh') === '1';
    const now = Date.now();

    if (!forceRefresh && lawCache.data && (now - lawCache.fetchedAt < 3600 * 1000)) {
      res.writeHead(200, {
        'Content-Type': 'application/json; charset=UTF-8',
        'Cache-Control': 'no-cache'
      });
      return res.end(JSON.stringify({
        ok: true,
        source: lawCache.source,
        mst,
        fetchedAt: new Date(lawCache.fetchedAt).toISOString(),
        law: lawCache.data['법령']
      }));
    }

    try {
      const liveData = await fetchMolegLawJson(oc, mst);
      lawCache = {
        data: liveData,
        fetchedAt: Date.now(),
        source: 'moleg-openapi-live'
      };
      try {
        fs.mkdirSync(path.dirname(FALLBACK_LAW_FILE), { recursive: true });
        fs.writeFileSync(FALLBACK_LAW_FILE, JSON.stringify(liveData, null, 2), 'utf8');
      } catch (_) {}

      res.writeHead(200, {
        'Content-Type': 'application/json; charset=UTF-8',
        'Cache-Control': 'no-cache'
      });
      return res.end(JSON.stringify({
        ok: true,
        source: 'moleg-openapi-live',
        mst,
        fetchedAt: new Date(lawCache.fetchedAt).toISOString(),
        law: liveData['법령']
      }));
    } catch (apiErr) {
      try {
        const fallbackRaw = fs.readFileSync(FALLBACK_LAW_FILE, 'utf8');
        const fallbackData = JSON.parse(fallbackRaw);
        lawCache = {
          data: fallbackData,
          fetchedAt: Date.now(),
          source: 'moleg-openapi-cached'
        };
        res.writeHead(200, {
          'Content-Type': 'application/json; charset=UTF-8',
          'Cache-Control': 'no-cache'
        });
        return res.end(JSON.stringify({
          ok: true,
          source: 'moleg-openapi-cached',
          mst,
          fetchedAt: new Date(lawCache.fetchedAt).toISOString(),
          law: fallbackData['법령']
        }));
      } catch (readErr) {
        res.writeHead(500, { 'Content-Type': 'application/json; charset=UTF-8' });
        return res.end(JSON.stringify({ ok: false, error: apiErr.message }));
      }
    }
  }

  // 3. 무료 상담 신청 접수 엔드포인트 (자체 저장 + 이메일 자동 발송)
  if (reqPath === '/api/consult') {
    if (req.method === 'OPTIONS') {
      res.writeHead(204, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Accept'
      });
      return res.end();
    }

    if (req.method === 'GET') {
      try {
        const list = fs.existsSync(CONSULT_FILE)
          ? JSON.parse(fs.readFileSync(CONSULT_FILE, 'utf8') || '[]')
          : [];
        res.writeHead(200, { 'Content-Type': 'application/json; charset=UTF-8', 'Cache-Control': 'no-cache' });
        return res.end(JSON.stringify({ ok: true, count: list.length, items: list }));
      } catch (e) {
        res.writeHead(500, { 'Content-Type': 'application/json; charset=UTF-8' });
        return res.end(JSON.stringify({ ok: false, error: e.message }));
      }
    }

    if (req.method === 'POST') {
      let rawBody = '';
      req.on('data', (chunk) => {
        rawBody += chunk;
        if (rawBody.length > 60 * 1024 * 1024) {
          req.destroy();
        }
      });

      req.on('end', async () => {
        try {
          const body = JSON.parse(rawBody || '{}');
          const now = new Date();
          const id = 'CS-' + now.getTime();
          const kstDate = new Date(now.getTime() + 9 * 3600 * 1000).toISOString().replace('T', ' ').slice(0, 19);

          fs.mkdirSync(path.dirname(CONSULT_FILE), { recursive: true });
          fs.mkdirSync(UPLOAD_DIR, { recursive: true });

          const savedFiles = [];
          const rawFiles = Array.isArray(body.files) ? body.files : [];
          for (let i = 0; i < rawFiles.length; i++) {
            const f = rawFiles[i];
            if (!f || !f.name || !f.dataUrl) continue;
            const match = String(f.dataUrl).match(/^data:([^;]+);base64,(.+)$/);
            if (!match) continue;
            const mimeType = match[1];
            const b64 = match[2];
            const safeName = String(f.name).replace(/[^a-zA-Z0-9가-힣._-]/g, '_');
            const diskName = `${id}_${i + 1}_${safeName}`;
            const diskPath = path.join(UPLOAD_DIR, diskName);
            fs.writeFileSync(diskPath, Buffer.from(b64, 'base64'));
            savedFiles.push({
              originalName: f.name,
              savedName: diskName,
              mimeType,
              size: f.size || 0,
              base64: b64
            });
          }

          const record = {
            id,
            createdAt: now.toISOString(),
            createdAtKST: kstDate,
            category: body.category || '',
            address: body.address || '',
            buildingType: body.buildingType || '',
            role: body.role || '',
            name: body.name || '',
            phone: body.phone || '',
            email: body.email || '',
            contactTime: body.contactTime || '',
            message: body.message || '',
            files: savedFiles.map((sf) => ({
              name: sf.originalName,
              savedName: sf.savedName,
              size: sf.size
            }))
          };

          let existing = [];
          if (fs.existsSync(CONSULT_FILE)) {
            try {
              existing = JSON.parse(fs.readFileSync(CONSULT_FILE, 'utf8') || '[]');
            } catch (_) {
              existing = [];
            }
          }
          existing.unshift(record);
          fs.writeFileSync(CONSULT_FILE, JSON.stringify(existing, null, 2), 'utf8');

          // 이메일 발송 시도 (1순위: 네이버 SMTP 직접 발송, 2순위: FormSubmit 이메일 릴레이)
          let emailSent = false;
          let mailMethod = 'saved-only';
          let mailNote = '';

          if (NAVER_SMTP_PASS) {
            try {
              await sendNaverSmtpMail(record, savedFiles);
              emailSent = true;
              mailMethod = 'naver-smtp';
            } catch (smtpErr) {
              mailNote = smtpErr.message;
            }
          }

          if (!emailSent) {
            try {
              const relayRes = await sendFormSubmitRelay(record);
              if (relayRes && relayRes.ok) {
                emailSent = true;
                mailMethod = 'formsubmit-relay';
              } else if (relayRes && relayRes.message) {
                mailNote = relayRes.message;
              }
            } catch (relayErr) {
              mailNote = relayErr.message;
            }
          }

          console.log(`[상담신청 접수 완료] ${id} | ${record.category} | ${record.name} (${record.phone}) | 이메일전송:${emailSent} (${mailMethod})`);

          res.writeHead(200, { 'Content-Type': 'application/json; charset=UTF-8' });
          return res.end(JSON.stringify({
            ok: true,
            id,
            saved: true,
            emailSent,
            mailMethod,
            mailNote
          }));
        } catch (err) {
          res.writeHead(400, { 'Content-Type': 'application/json; charset=UTF-8' });
          return res.end(JSON.stringify({ ok: false, error: err.message }));
        }
      });
      return;
    }
  }

  if (reqPath === '/' || reqPath === '') reqPath = '/index.html';

  const filePath = path.join(PUBLIC_DIR, reqPath);

  // Directory traversal guard
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=UTF-8' });
    return res.end('403 Forbidden');
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=UTF-8' });
      return res.end('404 Not Found');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache'
    });
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
