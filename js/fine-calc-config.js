/* =========================================================
   건축법 제80조 및 동법 시행령 제115조의2([별표 15]) · 지방세법 제4조제2항 기반
   지자체별 조례 데이터(부과 횟수, 감경률, 조례 특례 부과율) 및 구조·용도·행위연도별 시가표준액 설정 파일
   - 개인정보 및 특정 지번 사례는 노출하지 않으며, 법령 및 지자체 건축조례 기준만 관리합니다.
   ========================================================= */
window.FINE_CALC_CONFIG = {
  version: "2026.11",
  legalBasis: {
    mainAct: "「건축법」 제80조(이행강제금) 제1항·제3항·제5항",
    decree: "「건축법 시행령」 제115조의2 및 [별표 15] 위반건축물 부과기준",
    taxAct: "「지방세법」 제4조제2항 및 행정안전부 『건축물 시가표준액 조정기준』"
  },

  // 1. 관할 지자체별 조례 설정 (연간 부과 횟수, 조례 감경율, 소규모 주거 기준, 조례 조문 등)
  municipalities: {
    seoul_ddm: {
      id: "seoul_ddm",
      name: "서울특별시 동대문구 (서울특별시 건축 조례 제45조)",
      shortName: "서울 동대문구",
      ordinanceRef: "「서울특별시 건축 조례」 제45조(이행강제금의 부과)",
      defaultAnnualCount: 1,
      maxAnnualCount: 2,
      smallResAreaLimit: 60,
      legacyResAreaLimit: 85,
      smallResDiscountRate: 0.5,
      ordinanceDiscountRate: 0.5,
      nonResOrdinanceDefault: false,
      defaultLocationIndex: 1.07,
      workStructureRate: 0.01, // 조례 제45조제2항: 공작물 축조신고 미필 시가표준액의 1/100 이하
      note: "「서울특별시 건축 조례」 제45조에 따라 연면적 60㎡(구법 85㎡) 이하 주거용 건축물 및 소규모 주거 위반에 1/2 감경이 적용되며, 연 2회 이내 범위에서 부과합니다."
    },
    guri: {
      id: "guri",
      name: "경기도 구리시 (구리시 건축 조례 제37조·제38조)",
      shortName: "경기도 구리시",
      ordinanceRef: "「구리시 건축 조례」 제37조(이행강제금의 부과) · 제38조(탄력적 운영)",
      defaultAnnualCount: 1, // 조례 제37조제2항: 1년에 1회 부과·징수
      maxAnnualCount: 1,
      smallResAreaLimit: 60,
      legacyResAreaLimit: 85,
      smallResDiscountRate: 0.5, // 조례 제37조제1항: 주거용 건축물 1/2 부과
      ordinanceDiscountRate: 0.5, // 가설 비가림 등 조례 특례 감경 50%
      nonResOrdinanceDefault: false, // 비주거용(근생·위락·창고 등)은 감경 미적용
      defaultLocationIndex: 1.00,
      tempPermitRate: 0.03, // 조례 제37조제3항제1호: 미허가 가설건축물 시가표준액의 3%
      tempReportRate: 0.02, // 조례 제37조제3항제2호: 미신고 가설건축물 시가표준액의 2%
      workStructureRate: 0.02, // 조례 제37조제3항제5호: 미신고 공작물 시가표준액의 2% (별표15 3% 이하)
      elasticRates: { bcr: 0.6, far: 0.6, unpermitted: 0.7, unreported: 0.6 },
      note: "「구리시 건축 조례」 제37조에 따라 시정명령일 기준 연 1회 부과하며, 주거용 건축물은 1/2 감경(제1항), 비주거용(근생·위락·일반창고 등)은 감경 없이 산정합니다."
    },
    seoul_general: {
      id: "seoul_general",
      name: "서울특별시 일반 자치구 (서울특별시 건축 조례 제45조)",
      shortName: "서울특별시",
      ordinanceRef: "「서울특별시 건축 조례」 제45조(이행강제금의 부과)",
      defaultAnnualCount: 1,
      maxAnnualCount: 2,
      smallResAreaLimit: 60,
      legacyResAreaLimit: 85,
      smallResDiscountRate: 0.5,
      ordinanceDiscountRate: 0.5,
      nonResOrdinanceDefault: false,
      defaultLocationIndex: 1.10,
      workStructureRate: 0.01,
      note: "「서울특별시 건축 조례」 제45조에 따라 연 2회 이내 범위에서 부과하며, 소규모 주거용(60㎡ 이하) 1/2 감경 및 공작물(시가표준액의 1% 이하) 규정을 적용합니다."
    },
    gyeonggi_general: {
      id: "gyeonggi_general",
      name: "경기도 일반 시·군 (관할 시·군 건축 조례)",
      shortName: "경기도 시·군",
      ordinanceRef: "관할 시·군 건축 조례 (법 제80조제1항·제5항 위임)",
      defaultAnnualCount: 1,
      maxAnnualCount: 2,
      smallResAreaLimit: 60,
      legacyResAreaLimit: 85,
      smallResDiscountRate: 0.5,
      ordinanceDiscountRate: 0.5,
      nonResOrdinanceDefault: false,
      defaultLocationIndex: 1.00,
      note: "경기도 각 시·군 건축조례에 따라 원칙적으로 연 1회(최대 2회) 부과하며, 주소 검색 시 해당 시·군의 자치법규 조문을 실시간으로 조회하여 적용합니다."
    },
    custom_region: {
      id: "custom_region",
      name: "전국 기타 지자체 (주소 검색 시 관할 건축조례 자동 연동)",
      shortName: "관할 지자체",
      ordinanceRef: "관할 시·군·구 건축 조례",
      defaultAnnualCount: 1,
      maxAnnualCount: 2,
      smallResAreaLimit: 60,
      legacyResAreaLimit: 85,
      smallResDiscountRate: 0.5,
      ordinanceDiscountRate: 0.5,
      nonResOrdinanceDefault: false,
      defaultLocationIndex: 1.00,
      note: "주소를 입력하거나 검색하면 법제처 자치법규 정보에서 해당 지자체의 건축조례(이행강제금 부과 횟수·감경·가설/공작물 부과율)를 자동으로 검토하여 적용합니다."
    }
  },

  // 2. 위반 유형 및 부과비율 설정 (건축법 제80조제1항제1호·제2호 및 시행령 [별표 15])
  violationTypes: {
    unpermitted: {
      id: "unpermitted",
      title: "무허가 / 미신고 무단 증축·신축",
      shortTitle: "무단 증축·신축",
      statutoryRate: 1.0,
      effectiveStdRate: 0.50,
      lawRef: "건축법 제80조제1항제1호 (허가·신고 미필 건축·증축 · 100%)",
      desc: "건축허가·신고 없이 무단 증축·신축·개축한 경우 (시가표준액×50%×100%)"
    },
    far: {
      id: "far",
      title: "용적률 초과 무단 증축·건축",
      shortTitle: "용적률 초과",
      statutoryRate: 0.9,
      effectiveStdRate: 0.45,
      lawRef: "건축법 제80조제1항제1호 (용적률 초과 · 90%)",
      desc: "법정 용적률 한도를 초과하여 수직·수평 증축한 경우 (시가표준액×50%×90%)"
    },
    bcr: {
      id: "bcr",
      title: "건폐율 초과 무단 증축·건축",
      shortTitle: "건폐율 초과",
      statutoryRate: 0.8,
      effectiveStdRate: 0.40,
      lawRef: "건축법 제80조제1항제1호 (건폐율 초과 · 80%)",
      desc: "법정 건폐율 한도를 초과하여 1층·베란다·부속건물 등을 수평 증축한 경우 (시가표준액×50%×80%)"
    },
    height: {
      id: "height",
      title: "일조권·높이제한 위반 증축",
      shortTitle: "높이제한 위반",
      statutoryRate: 0.7,
      effectiveStdRate: 0.35,
      lawRef: "건축법 제80조제1항제1호 (높이제한 위반 · 70%)",
      desc: "정북방향 일조권 사선제한 또는 최고높이 제한을 위반한 경우 (시가표준액×50%×70%)"
    },
    other: {
      id: "other",
      title: "무단 용도변경 · 불법 가설건축물 · 공작물 · 대수선 ([별표 15])",
      shortTitle: "용도변경·가설·공작물(별표15)",
      statutoryRate: 0.1,
      effectiveStdRate: 0.05,
      lawRef: "건축법 시행령 제115조의2제2항 및 [별표 15] · 지자체 건축조례",
      desc: "부설주차장 용도변경, 근생/판매→위락·다중이용 용도변경, 가설건축물(창고·컨테이너·비가림), 공작물 등"
    }
  },

  // 3. 시행령 [별표 15] 및 지자체 건축조례 세부 위반 항목
  otherSubTypes: [
    {
      value: "1.0_parking",
      rate: 1.0,
      name: "불법 용도변경 [부설주차장 → 근생(소매점)·주거 등]",
      lawRef: "건축법 제19조·주차장법 위반 (시가표준액×50%×100%)"
    },
    {
      value: "1.0_temp_warehouse",
      rate: 1.0,
      name: "불법 가설건축물 [임시창고·임시사무실·컨테이너·천막]",
      lawRef: "건축법 제20조 위반 가설건축물 축조 (시가표준액×50%×100%)"
    },
    {
      value: "0.5",
      rate: 0.5,
      name: "불법 가설건축물 [비가림시설] / 가구수 증가 대수선(방 쪼개기)",
      lawRef: "건축법 시행령 [별표 15] 가설·대수선 (시가표준액×50%×50%)"
    },
    {
      value: "0.3",
      rate: 0.3,
      name: "일반 무단 대수선 / 조경·대지안의 공지 위반",
      lawRef: "건축법 시행령 [별표 15] 제1호의2~제9호 (시가표준액×50%×30%)"
    },
    {
      value: "0.1",
      rate: 0.1,
      name: "허가·신고 없는 무단 용도변경 [근생/판매 → 위락·다중이용 등]",
      lawRef: "건축법 시행령 [별표 15] 제2호 용도변경 (시가표준액×50%×10%)"
    },
    {
      value: "0.03",
      rate: 0.03,
      name: "신고 없는 불법 공작물 축조 [옹벽·세차장·햇빛가리개 등]",
      lawRef: "건축법 제83조·시행령 [별표 15] 제12·13호 공작물 (시가표준액×50%×3%)"
    },
    {
      value: "custom",
      rate: 0.3,
      name: "기타 위반 (직접 부과비율 % 입력)",
      lawRef: "건축법 시행령 [별표 15] 사용자 지정 비율"
    }
  ],

  // 4. 주요 구조 및 행위시기(경과연수)별 1㎡당 건축물 시가표준액 기준표 (위치지수 1.07 기준, 단위: 원/㎡)
  structureNotes: {
    "샤시/파이프조(간이·베란다)": "샤시/철파이프/천막 간이구조 (구조지수 0.16) — 베란다 샤시·연립 파이프증축·비가림시설 등 경량 간이구조 기준",
    "조립식패널조(샌드위치패널)": "조립식패널조/컨테이너조 (구조지수 0.38) — 샌드위치패널 수평·옥상 증축 및 가설 임시창고·컨테이너 기준",
    "경량철골조(강파이프)": "경량철골조 (구조지수 0.52) — 경량H형강·철골 구조물 및 공작물(비가림·햇빛가리개 등) 기준",
    "벽돌조(조적조·블록)": "벽돌·블록 조적조 (구조지수 0.60) — 노후 단독·다가구주택 수평·옥탑 증축에 흔한 구조",
    "일반철골조(H형강)·목구조": "일반철골조(S조)·목구조 (구조지수 0.80) — 상가·근생 증축 또는 목구조 다락·증축에 해당",
    "철근콘크리트조(RC)": "철근콘크리트조 (구조지수 1.00) — 근린생활시설·판매시설·위락시설·주거용 본체 기준"
  },

  buildingStdBaseByStructure: {
    "샤시/파이프조(간이·베란다)": {
      annex_aged: 29750,
      temp_warehouse: 3530,
      old_20y: 52000,
      mid_10y: 82000,
      new_5y: 120000
    },
    "조립식패널조(샌드위치패널)": {
      annex_aged: 70720,
      temp_warehouse: 14140,
      old_20y: 123000,
      mid_10y: 195000,
      new_5y: 285000
    },
    "경량철골조(강파이프)": {
      annex_aged: 96720,
      temp_warehouse: 25095,
      old_20y: 168000,
      mid_10y: 266000,
      new_5y: 390000
    },
    "벽돌조(조적조·블록)": {
      annex_aged: 111600,
      temp_warehouse: 45000,
      old_20y: 194000,
      mid_10y: 307000,
      new_5y: 450000
    },
    "일반철골조(H형강)·목구조": {
      annex_aged: 148800,
      temp_warehouse: 68000,
      old_20y: 259000,
      mid_10y: 410000,
      new_5y: 600000
    },
    "철근콘크리트조(RC)": {
      annex_aged: 106830,
      temp_warehouse: 95000,
      old_20y: 316900,
      mid_10y: 385000,
      new_5y: 644000
    }
  }
};
