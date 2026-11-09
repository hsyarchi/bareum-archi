/* =========================================================
   바름 · 형선윤건축사사무소 — 공통 스크립트
   (헤더/푸터 렌더, 메뉴, 스크롤 효과, FAQ, 카운트다운, 영업시간, 법제처 Open API 연동 자가진단, 상담 신청서)
   ========================================================= */
(function () {
  "use strict";
  var S = window.SITE || {};
  var page = document.body.getAttribute("data-page") || "";
  var tel = (S.phone || "").replace(/[^0-9]/g, "");

  var LOGO_SVG =
    '<svg viewBox="0 0 40 40" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">' +
    '<path d="M20 4.5 34.5 14.2V33a2.5 2.5 0 0 1-2.5 2.5H8A2.5 2.5 0 0 1 5.5 33V14.2Z" fill="none" stroke="#0E5E57" stroke-width="3.2" stroke-linejoin="round"/>' +
    '<path d="M12.5 23.2l5.2 5.2L28.6 17.5" fill="none" stroke="#E39B3A" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round"/>' +
    "</svg>";

  var NAV = [
    { id: "home", href: "index.html", label: "홈" },
    { id: "bulbup", href: "bulbup.html", label: "불법건축물 양성화", badge: "한시" },
    { id: "admin", href: "admin.html", label: "건축행정" },
    { id: "apt", href: "apt.html", label: "아파트 행위허가" }
  ];

  function logoHTML() {
    return (
      '<a class="logo" href="index.html" aria-label="' + S.brandFull + " " + S.company + ' 홈">' +
      LOGO_SVG +
      '<span class="logo-text"><span class="logo-title">' + S.brand + "<b>.</b></span>" +
      '<span class="logo-sub">' + S.company + "</span></span></a>"
    );
  }

  /* ---------- Header & Mobile Drawer ---------- */
  var headerMount = document.getElementById("site-header");
  if (headerMount) {
    var links = NAV.map(function (n) {
      return (
        '<li><a id="nav-' + n.id + '" href="' + n.href + '"' + (page === n.id ? ' class="is-active" aria-current="page"' : "") + ">" +
        n.label + (n.badge ? '<span class="nav-badge">' + n.badge + "</span>" : "") + "</a></li>"
      );
    }).join("");
    headerMount.outerHTML =
      '<header class="site-header" id="siteHeader"><div class="container header-inner">' +
      logoHTML() +
      '<button class="menu-btn" id="menuBtn" aria-label="메뉴 열기" aria-expanded="false" aria-controls="mobileDrawer"><i class="fa-solid fa-bars"></i></button>' +
      '<nav class="nav desktop-nav" id="siteNav" aria-label="주 메뉴"><ul class="nav-links">' + links + "</ul>" +
      '<div class="header-actions">' +
      (S.kakaoChat ? '<a class="header-kakao" id="header-kakao" href="' + S.kakaoChat + '" target="_blank" rel="noopener"><i class="fa-solid fa-comment"></i><span>카톡 상담</span></a>' : "") +
      '<a class="header-phone" id="header-phone" href="tel:' + tel + '"><i class="fa-solid fa-phone-volume"></i><span>' + S.phone + "</span></a>" +
      '<a class="btn btn--primary btn--sm" id="header-consult" href="consult.html">무료 상담 신청</a>' +
      "</div></nav></div></header>" +
      '<div class="mobile-drawer" id="mobileDrawer" aria-hidden="true">' +
      '<div class="mobile-drawer__overlay" id="drawerOverlay"></div>' +
      '<div class="mobile-drawer__content">' +
      '<div class="mobile-drawer__head">' + logoHTML() +
      '<button class="mobile-drawer__close" id="drawerClose" aria-label="메뉴 닫기"><i class="fa-solid fa-xmark"></i></button>' +
      '</div>' +
      '<ul class="mobile-drawer__links">' + links + '</ul>' +
      '<div class="mobile-drawer__actions">' +
      (S.kakaoChat ? '<a class="btn btn--kakao btn--block" href="' + S.kakaoChat + '" target="_blank" rel="noopener"><i class="fa-solid fa-comment"></i> 카카오톡 1:1 상담</a>' : "") +
      '<a class="btn btn--primary btn--block btn--shine" href="consult.html"><i class="fa-solid fa-comment-dots"></i> 무료 상담 신청</a>' +
      '<a class="btn btn--ghost btn--block" href="tel:' + tel + '"><i class="fa-solid fa-phone"></i> ' + S.phone + ' 전화 상담</a>' +
      '</div>' +
      '<div class="mobile-drawer__foot">' +
      '<span>대표 건축사 <strong>' + S.ceo + '</strong> (자격 제' + S.license + '호)</span>' +
      '<span>' + S.company + ' · ' + S.slogan + '</span>' +
      '</div>' +
      '</div></div>';
  }

  /* ---------- Footer ---------- */
  var footerMount = document.getElementById("site-footer");
  if (footerMount) {
    footerMount.outerHTML =
      '<footer class="site-footer"><div class="container">' +
      '<div class="footer-top">' +
      '<div class="footer-brand">' + logoHTML() +
      '<p class="footer-desc">' + S.slogan + ". 불법건축물 양성화·용도변경·건축허가·아파트 행위허가까지, 대표 건축사가 검토부터 도면·접수·완료까지 직접 진행합니다.</p>" +
      '<a class="footer-about" href="about.html">회사소개</a></div>' +
      '<div class="footer-links"><h4>서비스</h4>' +
      '<a href="bulbup.html">불법건축물 양성화</a><a href="admin.html">건축행정 (용도변경·허가·신고)</a>' +
      '<a href="apt.html">아파트 행위허가</a><a href="consult.html">무료 상담 신청</a></div>' +
      '<div class="footer-contact"><h4>상담·문의</h4>' +
      '<div><a class="footer-tel" href="tel:' + tel + '">' + S.phone + "</a></div>" +
      '<div><a href="mailto:' + S.email + '">' + S.email + "</a></div>" +
      "<div>" + S.address + " (" + S.addressJibun + ")</div>" +
      "<div>평일 " + S.hours[1][0] + "–" + S.hours[1][1] + " · 주말 " + S.hours[6][0] + "–" + S.hours[6][1] + "</div></div>" +
      "</div>" +
      '<div class="footer-mid">' +
      "<span>상호 <strong>" + S.company + "</strong></span>" +
      "<span>대표 <strong>" + S.ceo + "</strong></span>" +
      "<span>사업자등록번호 <strong>" + S.bizNo + "</strong></span>" +
      "<span>건축사 자격번호 <strong>제" + S.license + "호</strong></span>" +
      "</div>" +
      '<div class="footer-bottom"><span>&copy; ' + new Date().getFullYear() + " " + S.company + ". All rights reserved.</span>" +
      "<span>" + S.brandFull + " · " + S.slogan + "</span></div>" +
      "</div></footer>" +
      '<div class="fab" aria-label="빠른 연결">' +
      '<a class="fab__consult" href="consult.html" title="무료 상담 신청" aria-label="무료 상담 신청"><i class="fa-solid fa-comment-dots"></i></a>' +
      (S.kakaoChat ? '<a class="fab__kakao" href="' + S.kakaoChat + '" target="_blank" rel="noopener" title="카카오톡 1:1 상담" aria-label="카카오톡 1:1 상담"><i class="fa-solid fa-comment"></i></a>' : "") +
      '<a class="fab__phone" href="tel:' + tel + '" title="전화 연결" aria-label="전화 연결"><i class="fa-solid fa-phone"></i></a>' +
      '<button class="fab__top" id="fabTop" title="맨 위로" aria-label="맨 위로"><i class="fa-solid fa-arrow-up"></i></button>' +
      "</div>" +
      '<div class="mobile-bar">' +
      (S.kakaoChat ? '<a class="mobile-bar__consult" style="background:#FEE500;color:#191919;" href="' + S.kakaoChat + '" target="_blank" rel="noopener"><i class="fa-solid fa-comment"></i> 카카오톡</a>' : '<a class="mobile-bar__consult" href="consult.html"><i class="fa-solid fa-comment-dots"></i> 무료 상담</a>') +
      '<a class="mobile-bar__call" href="tel:' + tel + '"><i class="fa-solid fa-phone"></i> 전화 연결</a>' +
      "</div>";
  }

  /* ---------- Fill [data-site] ---------- */
  document.querySelectorAll("[data-site]").forEach(function (el) {
    var k = el.getAttribute("data-site");
    if (S[k] != null) el.textContent = S[k];
  });
  document.querySelectorAll("[data-site-tel]").forEach(function (el) { el.setAttribute("href", "tel:" + tel); });
  document.querySelectorAll("[data-site-mail]").forEach(function (el) { el.setAttribute("href", "mailto:" + S.email); });
  document.querySelectorAll("[data-map]").forEach(function (el) {
    var q = encodeURIComponent(S.mapQuery || S.address);
    el.setAttribute("href", el.getAttribute("data-map") === "kakao" ? "https://map.kakao.com/?q=" + q : "https://map.naver.com/p/search/" + q);
    el.setAttribute("target", "_blank");
    el.setAttribute("rel", "noopener");
  });

  /* ---------- Header scroll + FAB top ---------- */
  var header = document.getElementById("siteHeader");
  var fabTop = document.getElementById("fabTop");
  function onScroll() {
    var y = window.scrollY;
    if (header) header.classList.toggle("is-scrolled", y > 8);
    if (fabTop) fabTop.classList.toggle("is-show", y > 600);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  if (fabTop) fabTop.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });

  /* ---------- Mobile drawer menu ---------- */
  var menuBtn = document.getElementById("menuBtn");
  var drawer = document.getElementById("mobileDrawer");
  var drawerClose = document.getElementById("drawerClose");
  var drawerOverlay = document.getElementById("drawerOverlay");
  if (menuBtn && drawer) {
    function setDrawer(open) {
      drawer.classList.toggle("is-open", open);
      drawer.setAttribute("aria-hidden", open ? "false" : "true");
      document.body.classList.toggle("menu-open", open);
      menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
    }
    menuBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      setDrawer(!drawer.classList.contains("is-open"));
    });
    if (drawerClose) {
      drawerClose.addEventListener("click", function () { setDrawer(false); });
    }
    if (drawerOverlay) {
      drawerOverlay.addEventListener("click", function () { setDrawer(false); });
    }
    drawer.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () { setDrawer(false); });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && drawer.classList.contains("is-open")) setDrawer(false);
    });
  }

  /* ---------- Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-in"); });
  }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll(".faq-q").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var item = btn.closest(".faq-item");
      var open = item.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", open);
    });
  });

  /* ---------- APT page tabs (전유부 / 공용부) ---------- */
  var aptTabs = document.querySelectorAll(".apt-tab");
  if (aptTabs.length) {
    var switchAptTab = function (tab) {
      var targetId = tab.getAttribute("aria-controls");
      var panel = document.getElementById(targetId);
      if (!panel) return;

      aptTabs.forEach(function (t) {
        t.classList.remove("is-active");
        t.setAttribute("aria-selected", "false");
      });
      document.querySelectorAll(".apt-tab-panel").forEach(function (p) {
        p.classList.remove("is-active");
        p.hidden = true;
      });

      tab.classList.add("is-active");
      tab.setAttribute("aria-selected", "true");
      panel.classList.add("is-active");
      panel.hidden = false;

      panel.querySelectorAll(".reveal").forEach(function (el) {
        el.classList.add("is-in");
      });
    };

    aptTabs.forEach(function (tab) {
      tab.addEventListener("click", function () { switchAptTab(tab); });
    });

    // Check URL param ?tab=public or #public
    var searchParams = new URLSearchParams(location.search);
    if (searchParams.get("tab") === "public" || location.hash === "#public") {
      var pubTab = document.getElementById("tabPublic");
      if (pubTab) switchAptTab(pubTab);
    }
  }

  /* ---------- Countdown to law start ---------- */
  var start = new Date(S.lawStart).getTime();
  var end = new Date(S.lawEnd).getTime();
  var cds = document.querySelectorAll(".js-countdown");
  var labels = document.querySelectorAll(".js-cd-label");
  function pad(n) { return n < 10 ? "0" + n : "" + n; }
  function tick() {
    var now = Date.now();
    var target = now < start ? start : end;
    var diff = Math.max(0, target - now);
    var d = Math.floor(diff / 86400000);
    var h = Math.floor((diff % 86400000) / 3600000);
    var m = Math.floor((diff % 3600000) / 60000);
    var s = Math.floor((diff % 60000) / 1000);
    cds.forEach(function (c) {
      var set = function (k, v) { var el = c.querySelector('[data-cd="' + k + '"]'); if (el) el.textContent = v; };
      set("d", d); set("h", pad(h)); set("m", pad(m)); set("s", pad(s));
    });
    labels.forEach(function (l) {
      l.textContent = now < start ? "신고 접수 시작까지" : now < end ? "신고 기간 종료까지" : "신고 기간 종료";
    });
    document.querySelectorAll(".js-dday").forEach(function (el) {
      el.textContent = now < start ? "D-" + (d + 1) : now < end ? "접수 중" : "종료";
    });
  }
  if (cds.length || document.querySelector(".js-dday")) { tick(); setInterval(tick, 1000); }

  /* ---------- Office hours ---------- */
  var DAYS = ["일", "월", "화", "수", "목", "금", "토"];
  var hoursBody = document.getElementById("hoursBody");
  var today = new Date().getDay();
  if (hoursBody && S.hours) {
    var order = [1, 2, 3, 4, 5, 6, 0];
    hoursBody.innerHTML = order.map(function (i) {
      var h = S.hours[i];
      return '<tr class="' + (i === today ? "is-today" : "") + '"><td>' + DAYS[i] + "요일</td><td>" + (h ? h[0] + " – " + h[1] : "휴무") + "</td></tr>";
    }).join("");
  }
  document.querySelectorAll(".js-open-state").forEach(function (el) {
    var h = S.hours && S.hours[today];
    var now = new Date();
    var cur = now.getHours() * 60 + now.getMinutes();
    var toMin = function (t) { var p = t.split(":"); return +p[0] * 60 + +p[1]; };
    var open = h && cur >= toMin(h[0]) && cur < toMin(h[1]);
    el.classList.toggle("is-closed", !open);
    el.innerHTML = '<span class="dot"></span>' + (open ? "지금 상담 가능 · " + h[1] + "까지" : h ? "상담 시간 외 · 오늘 " + h[0] + "–" + h[1] : "오늘 휴무");
  });

  /* ---------- MOLEG Law Open API Integration (법제처 국가법령정보센터) ---------- */
  var lawApiBar = document.getElementById("lawApiStatusBar");
  var lawViewer = document.getElementById("lawApiViewer");
  var lawViewerBody = document.getElementById("lawViewerBody");
  var btnToggleLawViewer = document.getElementById("btnToggleLawViewer");
  var btnCloseLawViewer = document.getElementById("btnCloseLawViewer");
  var btnRefreshLawApi = document.getElementById("btnRefreshLawApi");

  function escHtml(str) {
    return String(str == null ? "" : str).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function renderLawArticles(lawObj, sourceLabel) {
    if (!lawObj || !lawViewerBody) return;
    var info = lawObj["기본정보"] || {};
    var lawName = info["법령명_한글"] || "특정건축물 정리에 관한 특별조치법";
    var pubNo = info["공포번호"] || "21820";
    var pubDate = info["공포일자"] || "20260616";
    var efDate = info["시행일자"] || "20261217";
    var fmtDate = function (d) {
      return String(d).replace(/^(\d{4})(\d{2})(\d{2})$/, "$1.$2.$3");
    };

    var badgeTextEl = document.getElementById("lawApiBadgeText");
    var titleEl = document.getElementById("lawApiTitle");
    var subEl = document.getElementById("lawApiSub");
    var viewerMeta = document.getElementById("lawViewerMeta");

    if (badgeTextEl) {
      badgeTextEl.textContent = sourceLabel === "moleg-openapi-live" ? "법제처 Open API 실시간 연동 완료" : "법제처 Open API 연동 완료";
    }
    if (titleEl) {
      titleEl.textContent = "「" + lawName + "」 (법률 제" + pubNo + "호 · 공포 " + fmtDate(pubDate) + " · 시행 " + fmtDate(efDate) + ")";
    }
    if (subEl) {
      subEl.textContent = "소관부처: 국토교통부 · 법령일련번호: " + ((S.lawApi && S.lawApi.mst) || "286993");
    }
    if (viewerMeta) {
      viewerMeta.textContent = "국가법령정보센터 Open API 실시간 수신 데이터 · 공포번호 제" + pubNo + "호 · 시행일 " + fmtDate(efDate);
    }

    var jomuns = (lawObj["조문"] && lawObj["조문"]["조문단위"]) || [];
    if (!Array.isArray(jomuns)) jomuns = [jomuns];

    var html = jomuns.map(function (j) {
      var head = escHtml(j["조문내용"] || ("제" + j["조문번호"] + "조"));
      var hangs = j["항"] || [];
      if (!Array.isArray(hangs)) hangs = [hangs];
      var hangHtml = hangs.map(function (h) {
        var hText = h["항내용"] ? "<p>" + escHtml(h["항내용"]) + "</p>" : "";
        var hos = h["호"] || [];
        if (!Array.isArray(hos)) hos = [hos];
        var hoHtml = "";
        if (hos.length) {
          hoHtml = "<ul>" + hos.map(function (ho) {
            var moks = ho["목"] || [];
            if (!Array.isArray(moks)) moks = [moks];
            var mokHtml = "";
            if (moks.length) {
              mokHtml = "<ul>" + moks.map(function (m) {
                return "<li>" + escHtml(m["목내용"] || "") + "</li>";
              }).join("") + "</ul>";
            }
            return "<li>" + escHtml(ho["호내용"] || "") + mokHtml + "</li>";
          }).join("") + "</ul>";
        }
        return hText + hoHtml;
      }).join("");
      return '<div class="law-article"><h4>' + head + "</h4>" + hangHtml + "</div>";
    }).join("");

    var buchik = lawObj["부칙"] && lawObj["부칙"]["부칙단위"];
    if (buchik) {
      var bArr = Array.isArray(buchik) ? buchik : [buchik];
      bArr.forEach(function (b) {
        var lines = [];
        if (Array.isArray(b["부칙내용"])) {
          b["부칙내용"].forEach(function (item) {
            if (Array.isArray(item)) lines = lines.concat(item);
            else lines.push(item);
          });
        }
        if (lines.length) {
          html += '<div class="law-article"><h4>' + escHtml(lines[0]) + "</h4>" +
            lines.slice(1).map(function (ln) { return "<p>" + escHtml(ln) + "</p>"; }).join("") +
            "</div>";
        }
      });
    }

    lawViewerBody.innerHTML = html || "<p>조문 데이터가 없습니다.</p>";
  }

  function loadMolegLawData(refresh) {
    if (!lawApiBar) return;
    var apiCfg = S.lawApi || {};
    var endpoint = (apiCfg.endpoint || "/api/law/special-act") +
      "?mst=" + encodeURIComponent(apiCfg.mst || "286993") +
      (refresh ? "&refresh=1" : "");

    if (btnRefreshLawApi && refresh) {
      btnRefreshLawApi.disabled = true;
      btnRefreshLawApi.innerHTML = '<i class="fa-solid fa-rotate fa-spin"></i> <span>동기화 중</span>';
    }

    fetch(endpoint)
      .then(function (r) {
        if (!r.ok) throw new Error("API status " + r.status);
        return r.json();
      })
      .then(function (res) {
        if (res && res.law) {
          renderLawArticles(res.law, res.source);
        } else if (res && res["법령"]) {
          renderLawArticles(res["법령"], "moleg-openapi-cached");
        }
      })
      .catch(function () {
        var fallbackUrl = (S.lawApi && S.lawApi.fallbackUrl) || "data/special-act-286993.json";
        return fetch(fallbackUrl)
          .then(function (r) { return r.json(); })
          .then(function (d) {
            if (d && d["법령"]) renderLawArticles(d["법령"], "moleg-openapi-cached");
          })
          .catch(function () {});
      })
      .then(function () {
        if (btnRefreshLawApi && refresh) {
          btnRefreshLawApi.disabled = false;
          btnRefreshLawApi.innerHTML = '<i class="fa-solid fa-rotate"></i> <span>API 동기화</span>';
        }
      });
  }

  if (lawApiBar) {
    loadMolegLawData(false);
    if (btnToggleLawViewer && lawViewer) {
      btnToggleLawViewer.addEventListener("click", function () {
        var open = lawViewer.classList.toggle("is-open");
        lawViewer.setAttribute("aria-hidden", open ? "false" : "true");
        btnToggleLawViewer.setAttribute("aria-expanded", open ? "true" : "false");
      });
    }
    if (btnCloseLawViewer && lawViewer) {
      btnCloseLawViewer.addEventListener("click", function () {
        lawViewer.classList.remove("is-open");
        lawViewer.setAttribute("aria-hidden", "true");
        if (btnToggleLawViewer) btnToggleLawViewer.setAttribute("aria-expanded", "false");
      });
    }
    if (btnRefreshLawApi) {
      btnRefreshLawApi.addEventListener("click", function () {
        loadMolegLawData(true);
      });
    }
  }

  /* ---------- Self-check (법률 제21820호 특정건축물 정리에 관한 특별조치법 기준 자가진단) ---------- */
  var check = document.getElementById("selfCheck");
  if (check) {
    var qs = check.querySelectorAll(".check__q");
    var answers = {};
    var meter = document.getElementById("checkMeter");
    var status = document.getElementById("checkStatus");
    var desc = document.getElementById("checkDesc");
    var prog = document.getElementById("checkProgress");
    var cta = document.getElementById("checkCta");
    var lawListEl = document.getElementById("checkLawList");
    var resetBtn = document.getElementById("checkResetBtn");

    var LAW_EVAL_RULES = {
      date: {
        title: "완공 시점 요건",
        art: "제3조제1항 본문·제3호",
        evalSub: function (v, sub) {
          if (v === "ok") return { badge: "적합", cls: "ok", text: "2023년 12월 31일 당시 사실상 완공 요건 충족 (제3조제1항)" };
          if (v === "bad") return { badge: "제외", cls: "bad", text: "2024년 1월 1일 이후 완공분은 특별법 적용 제외 (일반 추인·원상복구 검토 필요)" };
          return { badge: "확인필요", cls: "unk", text: "건축물대장·항공사진·과세대장 등으로 2023.12.31 이전 완공 여부 확인 필요" };
        }
      },
      vtype: {
        title: "위반 유형 및 특례",
        art: "제2조제1항제1호·제6조·제7조",
        evalSub: function (v, sub) {
          if (sub === "ext") return { badge: "적합·주차면제", cls: "ok", text: "무단 증축·대수선 (제2조제1항제1호가목) · 추가 부설주차장 설치 의무 면제 대상 (제7조제1항 본문)" };
          if (sub === "unapproved") return { badge: "적합·주차면제", cls: "ok", text: "사용승인 미필 건축물 (제2조제1항제1호나목) · 추가 부설주차장 설치 의무 면제 대상 (제7조제1항 본문)" };
          if (sub === "split") return { badge: "심의·주차주의", cls: "warn", text: "세대·가구·호수 증가 대수선(방 쪼개기): 피난·방화·소방시설 기준 준수(제6조제1항제3호) 및 부설주차장 설치·비용납부 필요(제7조제1항 단서, 전세사기피해주택·조례 완화 예외)" };
          if (sub === "usechange") return { badge: "심의·주차주의", cls: "warn", text: "무단 용도변경·근생 주택 사용(제2조제1항제1호다목·제3조제1항제3호): 2023.12.31 이전 주택 사용 입증 + 피난·방화·소방(제6조제1항제3호) 및 부설주차장 기준(제7조제1항 단서) 충족 필요" };
          return { badge: "확인필요", cls: "unk", text: "건축물대장 및 현황 실측을 통해 위반 유형(증축·대수선·용도변경) 분류 필요" };
        }
      },
      use: {
        title: "주거용 면적 비율",
        art: "제2조제1항제2호",
        evalSub: function (v) {
          if (v === "ok") return { badge: "적합", cls: "ok", text: "연면적 100분의 50 이상 주거용인 ‘주거용 특정건축물’ 요건 충족 (제2조제1항제2호)" };
          if (v === "bad") return { badge: "제외", cls: "bad", text: "연면적 중 주거용 비율 50% 미만 건축물은 특별법 대상 제외 (일반 용도변경·추인 검토)" };
          return { badge: "확인필요", cls: "unk", text: "위반 증축 면적을 포함한 전체 연면적 대비 주거용 사용 비율(50% 이상) 산정 필요" };
        }
      },
      size: {
        title: "대상 건축물 규모",
        art: "제3조제1항제1호~제3호·부칙 제4조",
        evalSub: function (v, sub) {
          if (sub === "multi85") return { badge: "적합", cls: "ok", text: "다세대주택 세대당 전용면적 85㎡ 이하 요건 충족 (무단 증축·대수선 포함, 제3조제1항제1호)" };
          if (sub === "single165") return { badge: "적합", cls: "ok", text: "단독주택 연면적 165㎡ 이하 요건 충족 (무단 증축·대수선 포함, 제3조제1항제2호가목 본문)" };
          if (sub === "single330") return { badge: "조례확인", cls: "warn", text: "단독주택 연면적 165㎡ 초과 ~ 330㎡ 이하: 관할 지자체 조례 제정 시 적용 가능 (제3조제1항제2호가목 단서·부칙 제4조)" };
          if (sub === "dada660") return { badge: "적합", cls: "ok", text: "다가구주택 연면적 660㎡ 이하 요건 충족 (무단 증축·대수선 포함, 제3조제1항제2호나목)" };
          if (v === "bad") return { badge: "초과", cls: "bad", text: "법 제3조제1항 규모 기준 초과 (초과분 일부 철거·조정 후 신고 가능 여부 검토 필요)" };
          return { badge: "확인필요", cls: "unk", text: "건축물대장 면적 + 미승인 증축·대수선 실측 면적 합산 검토 필요" };
        }
      },
      zone: {
        title: "적용 제외 구역 여부",
        art: "제3조제2항제1호~제8호",
        evalSub: function (v, sub) {
          if (v === "ok") return { badge: "적합", cls: "ok", text: "도시·군계획시설 부지, 개발제한구역, 군사보호구역, 접도구역, 보전산지 등 적용 제외 구역 미해당 (제3조제2항)" };
          if (sub === "zone_proviso") return { badge: "단서예외", cls: "warn", text: "제3조제2항 단서 예외: 개발제한·군사보호구역 지정 전 건축물, 국방부장관 적용 결정, 도시개발·정비사업 지장 없는 건축물로 소명 시 적용 가능" };
          if (v === "bad") return { badge: "제외구역", cls: "bad", text: "제3조제2항 적용 제외 구역 해당 (단, 구역 지정 시점 및 사업 지장 여부 정밀 재검토 권장)" };
          return { badge: "확인필요", cls: "unk", text: "토지이음(토지이용계획확인원)으로 제3조제2항 8대 적용 제외 구역 해당 여부 조회 필요" };
        }
      },
      history: {
        title: "과거 양성화 이력·소유권",
        art: "제3조제3항",
        evalSub: function (v, sub) {
          if (sub === "hist_none") return { badge: "적합", cls: "ok", text: "종전 특별조치법 사용승인 이력 없음 — 적용 제한 없음 (제3조제3항)" };
          if (sub === "hist_changed") return { badge: "적합(소유권변동)", cls: "ok", text: "종전 특별조치법 사용승인 이후 소유권이 변동된 건축물로 이번 특별법 적용 가능 (제3조제3항)" };
          if (v === "bad") return { badge: "적용제외", cls: "bad", text: "종전 특별조치법 사용승인서 취득 후 소유권 변동이 없는 건축물은 적용 제외 (제3조제3항)" };
          return { badge: "확인필요", cls: "unk", text: "건축물대장 변동 이력 및 등기부등본으로 과거 특별조치법 승인·소유권 변동 여부 확인 필요" };
        }
      },
      cond: {
        title: "사용승인 심의 기준",
        art: "제6조제1항제1호~제4호",
        evalSub: function (v, sub) {
          if (v === "ok") return { badge: "적합", cls: "ok", text: "대지 권원·3m 이상 도로 접합·구조안전·방화·일조권 및 과태료·이행강제금 납부 기준 충족 (제6조제1항)" };
          if (sub === "cond_warn") return { badge: "특례·조건부", cls: "warn", text: "제6조제1항 단서 활용: 집합건물 구분소유자 결의(제1호), 소방 지장 없음 인정 시 3m 도로·건축선 완화(제2호 단서), 과태료·이행강제금 1년 내 완납 조건부 승인(제4호 단서) 가능" };
          if (v === "bad") return { badge: "보완필수", cls: "bad", text: "타인 대지 사용승낙 확보 또는 구조보강 선행 없이는 건축위원회 심의 통과 곤란 (제6조제1항제1·2호)" };
          return { badge: "확인필요", cls: "unk", text: "건축사 현장조사서 작성 단계에서 대지 경계·도로 너비(3m)·구조안전·소방 지장 여부 점검 필요" };
        }
      }
    };

    qs.forEach(function (q) {
      var key = q.getAttribute("data-q");
      q.querySelectorAll("button").forEach(function (b) {
        b.addEventListener("click", function () {
          q.querySelectorAll("button").forEach(function (x) {
            x.classList.remove("is-on", "is-bad", "is-warn");
            x.setAttribute("aria-pressed", "false");
          });
          var v = b.getAttribute("data-v");
          var sub = b.getAttribute("data-sub") || "";
          b.classList.add("is-on");
          if (v === "bad") b.classList.add("is-bad");
          if (v === "warn") b.classList.add("is-warn");
          b.setAttribute("aria-pressed", "true");
          answers[key] = { v: v, sub: sub, label: b.textContent.trim() };
          update();
        });
      });
    });

    if (resetBtn) {
      resetBtn.addEventListener("click", function () {
        answers = {};
        qs.forEach(function (q) {
          q.querySelectorAll("button").forEach(function (x) {
            x.classList.remove("is-on", "is-bad", "is-warn");
            x.setAttribute("aria-pressed", "false");
          });
        });
        update();
      });
    }

    function update() {
      var total = qs.length;
      var keys = Object.keys(answers);
      var n = keys.length;
      var bad = keys.filter(function (k) { return answers[k].v === "bad"; }).length;
      var warn = keys.filter(function (k) { return answers[k].v === "warn"; }).length;
      var unk = keys.filter(function (k) { return answers[k].v === "unk"; }).length;
      var ok = keys.filter(function (k) { return answers[k].v === "ok"; }).length;

      if (prog) prog.textContent = "법령 요건 진단 " + n + " / " + total;
      if (meter) {
        meter.style.width = (bad ? Math.max(10, (ok / total) * 35) : ((ok + warn * 0.8 + unk * 0.5) / total) * 100) + "%";
      }

      if (lawListEl) {
        if (n === 0) {
          lawListEl.innerHTML =
            '<div class="check__law-item">' +
            '<span class="check__law-badge check__law-badge--unk">대기</span>' +
            "<div>왼쪽 문항을 선택하시면 <b>법률 제21820호 조문별 해당 여부 및 특례·주의사항</b>이 실시간으로 표시됩니다.</div>" +
            "</div>";
        } else {
          var order = ["date", "vtype", "use", "size", "zone", "history", "cond"];
          lawListEl.innerHTML = order
            .filter(function (k) { return !!answers[k]; })
            .map(function (k) {
              var ans = answers[k];
              var rule = LAW_EVAL_RULES[k];
              if (!rule) return "";
              var res = rule.evalSub(ans.v, ans.sub);
              return (
                '<div class="check__law-item">' +
                '<span class="check__law-badge check__law-badge--' + res.cls + '">' + escHtml(res.badge) + "</span>" +
                "<div><b>[" + escHtml(rule.art) + "]</b> " + escHtml(res.text) + "</div>" +
                "</div>"
              );
            }).join("");
        }
      }

      var summaryLines = [];
      ["date", "vtype", "use", "size", "zone", "history", "cond"].forEach(function (k) {
        if (answers[k] && LAW_EVAL_RULES[k]) {
          var r = LAW_EVAL_RULES[k];
          var ev = r.evalSub(answers[k].v, answers[k].sub);
          summaryLines.push("- " + r.title + " (" + r.art + "): " + answers[k].label + " → [" + ev.badge + "]");
        }
      });

      if (bad > 0) {
        status.textContent = "현재 선택 기준으로는 특별법 제외 요건이 있습니다";
        desc.textContent = "다만 위반 부분 일부 조정(면적 축소), 제3조제2항 단서 소명, 또는 일반 건축법 추인(사용승인) 등 대안이 있을 수 있으니 건축사 정밀 검토를 권장합니다.";
        cta.innerHTML = '대안 및 정밀 검토 문의하기 <i class="fa-solid fa-arrow-right"></i>';
      } else if (n < total) {
        status.textContent = "7가지 법령 요건을 모두 선택해 주세요 (" + n + "/" + total + ")";
        desc.textContent = "법률 제21820호 「특정건축물 정리에 관한 특별조치법」 제2조·제3조·제6조·제7조 조문을 실시간으로 대조하고 있습니다.";
        cta.innerHTML = '진단 결과로 무료 상담 신청 <i class="fa-solid fa-arrow-right"></i>';
      } else if (warn > 0 && unk === 0) {
        status.textContent = "양성화 가능 대상이나, 특례·심의 요건 사전 대비가 필요합니다";
        desc.textContent = "방 쪼개기·근생 전환(소방·주차장 기준), 단독주택 조례 면적(165~330㎡), 제한구역 단서 예외 또는 조건부 승인 요건을 건축사가 사전에 설계도서로 준비해야 합니다.";
        cta.innerHTML = '특례·심의 맞춤 상담 신청 <i class="fa-solid fa-arrow-right"></i>';
      } else if (unk > 0) {
        status.textContent = "양성화 가능성이 높으며, 미확인 항목만 대장으로 확인하면 됩니다";
        desc.textContent = "‘모르겠음’으로 선택하신 항목은 주소만 알려주시면 건축물대장·토지이용계획·항공사진으로 대표 건축사가 무료로 확인해 드립니다.";
        cta.innerHTML = '미확인 항목 무료 조회 신청 <i class="fa-solid fa-arrow-right"></i>';
      } else {
        status.textContent = "특정건축물 특별조치법(법률 제21820호) 양성화 적격 대상입니다!";
        desc.textContent = "법 제3조 적용범위 및 제6조 사용승인 기준에 부합합니다. 건축사 설계도서·현장조사서(제4조)를 미리 준비하시면 시행 즉시 접수할 수 있습니다.";
        cta.innerHTML = '양성화 신고 준비 상담 신청 <i class="fa-solid fa-arrow-right"></i>';
      }

      if (cta) {
        if (summaryLines.length) {
          var memoText = "[법률 제21820호 특정건축물 특별조치법 자가진단 결과]\n" + summaryLines.join("\n");
          cta.setAttribute("href", "consult.html?cat=양성화&memo=" + encodeURIComponent(memoText));
        } else {
          cta.setAttribute("href", "consult.html?cat=양성화");
        }
      }
    }
    update();
  }

  /* ---------- Enforcement Fine Calculator (건축법 제80조 · 시행령 제115조의2 이행강제금 산정 계산기) ---------- */
  var calcBox = document.getElementById("fineCalc");
  if (calcBox) {
    var CFG = window.FINE_CALC_CONFIG || {};
    var MUNICIPALITIES = CFG.municipalities || {};
    var STRUCTURE_NOTES = CFG.structureNotes || {
      "샤시/파이프조(간이·베란다)": "샤시/철파이프/천막 간이구조 (구조지수 0.16) — 베란다·차양·비가림 간이 증축 기준",
      "조립식패널조(샌드위치패널)": "조립식패널조/컨테이너조 (구조지수 0.38) — 샌드위치패널 옥상·수평 증축 및 임시창고 기준",
      "경량철골조(강파이프)": "경량철골조 (구조지수 0.52) — 경량H형강·철골 창고 및 간이 공작물 기준",
      "벽돌조(조적조·블록)": "벽돌·블록 조적조 (구조지수 0.60) — 노후 단독·다가구주택 수평·옥탑 증축에 흔한 구조",
      "일반철골조(H형강)·목구조": "일반철골조(S조)·목구조 (구조지수 0.80) — 상가·근생 증축 또는 목구조 다락·증축에 해당",
      "철근콘크리트조(RC)": "철근콘크리트조 (구조지수 1.00) — 내구성·구조지수가 가장 높아 시가표준액 단가가 높게 산정됨"
    };
    var BUILDING_STD_BASE_BY_STRUCTURE = CFG.buildingStdBaseByStructure || {
      "샤시/파이프조(간이·베란다)": { annex_aged: 29750, temp_warehouse: 3530, old_20y: 52000, mid_10y: 82000, new_5y: 120000 },
      "조립식패널조(샌드위치패널)": { annex_aged: 70720, temp_warehouse: 14140, old_20y: 123000, mid_10y: 195000, new_5y: 285000 },
      "경량철골조(강파이프)": { annex_aged: 96720, temp_warehouse: 25095, old_20y: 168000, mid_10y: 266000, new_5y: 390000 },
      "벽돌조(조적조·블록)": { annex_aged: 111600, temp_warehouse: 45000, old_20y: 194000, mid_10y: 307000, new_5y: 450000 },
      "일반철골조(H형강)·목구조": { annex_aged: 148800, temp_warehouse: 68000, old_20y: 259000, mid_10y: 410000, new_5y: 600000 },
      "철근콘크리트조(RC)": { annex_aged: 106830, temp_warehouse: 95000, old_20y: 316900, mid_10y: 385000, new_5y: 644000 }
    };

    // 1) 조례 자동 검토 및 건물 기본 정보 요소
    var muniNoteTextEl = document.getElementById("calcMuniNoteText");
    var ordinanceDetailsEl = document.getElementById("calcOrdinanceDetails");
    var ordinanceSummaryTitleEl = document.getElementById("calcOrdinanceSummaryTitle");
    var ordinanceArticleBodyEl = document.getElementById("calcOrdinanceArticleBody");
    var evidenceDetailsEl = document.getElementById("calcEvidenceDetails");
    var evidenceSummaryEl = document.getElementById("calcEvidenceSummary");
    var evidenceBodyEl = document.getElementById("calcEvidenceBody");
    var useRadios = calcBox.querySelectorAll('input[name="calcUseType"]');
    var structureSelect = document.getElementById("calcStructure");
    var structureHintEl = document.getElementById("calcStructureHint");
    var ageFactorSelect = document.getElementById("calcAgeFactor");

    // 2) 주소 검색 및 가격·면적 입력 요소
    var addrInput = document.getElementById("calcAddrInput");
    var openPostcodeBtn = document.getElementById("btnOpenPostcode");
    var closePostcodeBtn = document.getElementById("btnClosePostcode");
    var postcodeWrap = document.getElementById("calcPostcodeWrap");
    var postcodeLayer = document.getElementById("calcPostcodeLayer");
    var searchBtn = document.getElementById("btnSearchLandPrice");
    var landInfoEl = document.getElementById("calcLandPriceInfo");
    var candidatesEl = document.getElementById("calcAddrCandidates");

    var costInput = document.getElementById("calcUnitCost");
    var costLabel = document.getElementById("calcUnitCostText");
    var costErrorEl = document.getElementById("calcUnitCostError");
    var areaInput = document.getElementById("calcArea");
    var pyeongText = document.getElementById("calcPyeongText");
    var areaErrorEl = document.getElementById("calcAreaError");

    // 3) 위반 유형 라디오 및 기타(별표 15) 세부 선택 요소
    var vtypeRadios = calcBox.querySelectorAll('input[name="calcViolationType"]');
    var otherRatePanel = document.getElementById("calcOtherRatePanel");
    var otherPresetSelect = document.getElementById("calcOtherPresetSelect");
    var customRateWrap = document.getElementById("calcCustomRateWrap");
    var customRateInput = document.getElementById("calcCustomRateInput");
    var otherRateBadge = document.getElementById("calcOtherRateBadge");

    // 4) 감경 및 특례 조건 체크박스 요소
    var chkSmallRes = document.getElementById("chkSmallResDiscount");
    var cardSmallRes = document.getElementById("cardSmallResDiscount");
    var badgeSmallResHint = document.getElementById("badgeSmallResHint");
    var chkOrdinance = document.getElementById("chkOrdinanceDiscount");
    var cardOrdinance = document.getElementById("cardOrdinanceDiscount");
    var badgeOrdinanceHint = document.getElementById("badgeOrdinanceHint");

    // 5) 우측 결과 출력(Output) 요소 및 초기화 버튼
    var btnResetCalc = document.getElementById("btnResetCalc");
    var btnResetCalcForm = document.getElementById("btnResetCalcForm");
    var muniBadgeEl = document.getElementById("calcMuniBadge");
    var resMetaBadgeEl = document.getElementById("calcResMetaBadge");
    var finalHeroLabelEl = document.getElementById("calcFinalHeroLabel");
    var finalWonEl = document.getElementById("calcFinalWon");
    var finalManwonNoteEl = document.getElementById("calcFinalManwonNote");
    var annualMetaLabelEl = document.getElementById("calcAnnualMetaLabel");
    var annualWonEl = document.getElementById("calcAnnualWon");
    var cumulative3YNoteEl = document.getElementById("calcCumulative3YNote");
    var effectiveRateTagEl = document.getElementById("calcEffectiveRateTag");
    var formulaTextEl = document.getElementById("calcFormulaText");
    var tdMunicipalityEl = document.getElementById("tdMunicipality");
    var tdUnitPriceEl = document.getElementById("tdUnitPrice");
    var tdAreaEl = document.getElementById("tdArea");
    var tdBaseAmountEl = document.getElementById("tdBaseAmount");
    var tdViolationRateEl = document.getElementById("tdViolationRate");
    var tdDiscountRateEl = document.getElementById("tdDiscountRate");
    var tdRoundingNoteEl = document.getElementById("tdRoundingNote");
    var tdFinalAmountEl = document.getElementById("tdFinalAmount");
    var consultBtn = document.getElementById("calcConsultBtn");

    // 주소 문자열에서 실제 관할 지자체명(예: 서울특별시 동대문구, 경기도 구리시 등) 추출 헬퍼
    function extractLocalGovNameFromText(rawText) {
      var s = String(rawText || "").replace(/\s+/g, " ").trim();
      if (!s) return "";
      var sidoMap = {
        "서울": "서울특별시", "서울시": "서울특별시", "서울특별시": "서울특별시",
        "부산": "부산광역시", "부산시": "부산광역시", "부산광역시": "부산광역시",
        "대구": "대구광역시", "대구시": "대구광역시", "대구광역시": "대구광역시",
        "인천": "인천광역시", "인천시": "인천광역시", "인천광역시": "인천광역시",
        "광주": "광주광역시", "광주시": "광주광역시", "광주광역시": "광주광역시",
        "대전": "대전광역시", "대전시": "대전광역시", "대전광역시": "대전광역시",
        "울산": "울산광역시", "울산시": "울산광역시", "울산광역시": "울산광역시",
        "세종": "세종특별자치시", "세종시": "세종특별자치시", "세종특별자치시": "세종특별자치시",
        "경기": "경기도", "경기도": "경기도",
        "강원": "강원특별자치도", "강원도": "강원특별자치도", "강원특별자치도": "강원특별자치도",
        "충북": "충청북도", "충청북도": "충청북도",
        "충남": "충청남도", "충청남도": "충청남도",
        "전북": "전북특별자치도", "전라북도": "전북특별자치도", "전북특별자치도": "전북특별자치도",
        "전남": "전라남도", "전라남도": "전라남도",
        "경북": "경상북도", "경상북도": "경상북도",
        "경남": "경상남도", "경상남도": "경상남도",
        "제주": "제주특별자치도", "제주도": "제주특별자치도", "제주특별자치도": "제주특별자치도"
      };
      var m = s.match(/(서울특별시|서울시|서울|부산광역시|부산시|부산|대구광역시|대구시|대구|인천광역시|인천시|인천|광주광역시|광주시|광주|대전광역시|대전시|대전|울산광역시|울산시|울산|세종특별자치시|세종시|세종|경기도|경기|강원특별자치도|강원도|강원|충청북도|충북|충청남도|충남|전북특별자치도|전라북도|전북|전라남도|전남|경상북도|경북|경상남도|경남|제주특별자치도|제주도|제주)\s+([가-힣]+(?:시|군|구))?(?:\s+([가-힣]+구))?/);
      if (m) {
        var sido = sidoMap[m[1]] || m[1];
        return [sido, m[2] || "", m[3] || ""].filter(Boolean).join(" ");
      }
      var m2 = s.match(/^([가-힣]{2,6}(?:시|군|구))(?:\s|$)/);
      if (m2) {
        if (m2[1] === "구리시") return "경기도 구리시";
        if (m2[1] === "동대문구") return "서울특별시 동대문구";
        return m2[1];
      }
      return "";
    }

    // 토지 1㎡당 개별공시지가 구간별 지방세법 『위치지수』 산정 함수
    function getLocationIndexFromLandPrice(landPriceWon) {
      var p = Number(landPriceWon) || 0;
      if (p <= 0) return 1.07;
      if (p <= 50000) return 0.80;
      if (p <= 100000) return 0.83;
      if (p <= 200000) return 0.86;
      if (p <= 300000) return 0.89;
      if (p <= 500000) return 0.92;
      if (p <= 800000) return 0.95;
      if (p <= 1200000) return 0.98;
      if (p <= 2000000) return 1.00;
      if (p <= 3000000) return 1.04;
      if (p <= 4000000) return 1.07;
      if (p <= 5000000) return 1.10;
      if (p <= 7000000) return 1.14;
      if (p <= 10000000) return 1.18;
      if (p <= 15000000) return 1.22;
      return 1.26;
    }

    var calcState = {
      isCalculated: false,
      municipality: "building_act",
      localGovName: "",
      hasOrdinance: false,
      annualCount: 1,
      maxAnnualCount: 2,
      useType: "residential", // residential | non_residential
      structure: "샤시/파이프조(간이·베란다)",
      ageFactor: "annex_aged",
      landPriceWon: 0,
      locationIndex: 1.07,
      unitPriceWon: 0,
      area: 0,
      vtype: "unpermitted",
      vrate: 1.0,
      vlabel: "무허가/미신고 증축·신축",
      smallResDiscount: true,
      ordinanceDiscount: true,
      searchedAddr: "",
      stdrYear: "",
      liveOrdinance: null
    };

    function getCurrentMuniConfig() {
      var ord = calcState.liveOrdinance;
      var govName =
        (ord && ord.localGovName && ord.localGovName !== "관할 지자체" ? ord.localGovName : "") ||
        extractLocalGovNameFromText(calcState.searchedAddr) ||
        extractLocalGovNameFromText(addrInput ? addrInput.value : "") ||
        calcState.localGovName ||
        (calcState.isCalculated ? "건축법 법정 기준" : "주소 조회 대기");

      if (ord && ord.ok) {
        var hasOrd = ord.hasOrdinance !== false;
        return {
          id: ord.muniCode || calcState.municipality || "building_act",
          name: govName,
          shortName: govName,
          hasOrdinance: hasOrd,
          ordinanceRef: ord.ordinanceName || (hasOrd ? "「" + govName + " 건축 조례」" : "「건축법」 제80조 및 시행령 [별표 15]"),
          defaultAnnualCount: ord.annualCount || 1,
          maxAnnualCount: ord.maxAnnualCount || 2,
          smallResDiscountRate: ord.smallResDiscountRate != null ? ord.smallResDiscountRate : 0.5,
          ordinanceDiscountRate: hasOrd ? (ord.ordinanceDiscountRate != null ? ord.ordinanceDiscountRate : 0.5) : 1.0,
          defaultLocationIndex: 1.07,
          note: ord.summaryText || ""
        };
      }

      var baseCfg = MUNICIPALITIES[calcState.municipality] || {};
      var fallbackName = (baseCfg.name && baseCfg.name.indexOf("기타") === -1) ? baseCfg.name : govName;
      return {
        id: calcState.municipality || "building_act",
        name: fallbackName,
        shortName: fallbackName,
        hasOrdinance: calcState.hasOrdinance,
        ordinanceRef: baseCfg.ordinanceRef || "「건축법」 제80조 및 동법 시행령 제115조의2([별표 15])",
        defaultAnnualCount: calcState.annualCount || 1,
        maxAnnualCount: calcState.maxAnnualCount || 2,
        smallResDiscountRate: 0.5,
        ordinanceDiscountRate: calcState.hasOrdinance ? 0.5 : 1.0,
        defaultLocationIndex: 1.07,
        note: baseCfg.note || "주소를 입력·조회하면 해당 주소지의 관할 지자체 건축조례를 자동 연동하며, 별도 조례가 없을 경우 건축법 기준을 반영합니다."
      };
    }

    function updateMuniBanner() {
      var m = getCurrentMuniConfig();
      if (muniNoteTextEl) {
        var statusTag = "";
        if (calcState.liveOrdinance && calcState.liveOrdinance.ok) {
          if (m.hasOrdinance) {
            statusTag = '<span class="tag tag--amber" style="margin-right:6px;font-size:.73rem;">' + escHtml(m.shortName) + ' 조례 자동연동</span>';
          } else {
            statusTag = '<span class="tag" style="margin-right:6px;font-size:.73rem;">건축법 법정 기준 적용</span>';
          }
        }
        muniNoteTextEl.innerHTML = statusTag + "<b>" + escHtml(m.ordinanceRef) + " (" + escHtml(m.shortName) + "):</b> " + escHtml(m.note || "");
      }
      if (badgeOrdinanceHint) {
        if (m.hasOrdinance) {
          badgeOrdinanceHint.textContent = m.shortName + " 조례 · 50% 감경";
        } else {
          badgeOrdinanceHint.textContent = "별도 지자체 조례 없음 (건축법 기준 적용)";
        }
      }
    }

    // 판단 근거를 요구할 때 별도로 노출되는 상세 아코디언 렌더링 함수
    function renderEvidenceDetails(rawOrd, addressContext) {
      if (!evidenceDetailsEl || !evidenceBodyEl) return;
      var ord = (rawOrd && rawOrd.ordinance) ? rawOrd.ordinance : rawOrd;
      evidenceDetailsEl.style.display = "block";

      var m = getCurrentMuniConfig();
      var effStr = ord && ord.effectiveDate && String(ord.effectiveDate).length === 8
        ? " · 시행 " + String(ord.effectiveDate).slice(0, 4) + "." + String(ord.effectiveDate).slice(4, 6) + "." + String(ord.effectiveDate).slice(6, 8)
        : "";

      var ordTitle = (ord && ord.ordinanceName) || (m.hasOrdinance ? "「" + m.shortName + " 건축 조례」" : "「건축법」 제80조 및 시행령 [별표 15]");
      var govName = m.shortName || calcState.localGovName || "관할 지자체";

      // 1) 조례 검토 내역 및 조문
      var artsHtml = "";
      var arts = ord && Array.isArray(ord.articles) ? ord.articles : [];
      if (arts.length > 0) {
        artsHtml = arts.map(function (a) {
          var joHeader = escHtml(a.joNo || "") + (a.title ? " (" + escHtml(a.title) + ")" : "");
          var bodyTxt = a.text || a.content || "";
          var lines = String(bodyTxt).split(/\n+/).map(function (ln) {
            return "<p style='margin:2px 0;font-size:.78rem;color:var(--ink);'>" + escHtml(ln.trim()) + "</p>";
          }).join("");
          return (
            '<div style="margin-bottom:8px;padding-bottom:6px;border-bottom:1px dashed var(--line);">' +
            '<b style="display:block;margin-bottom:3px;color:var(--teal-800);">' + joHeader + '</b>' +
            lines +
            '</div>'
          );
        }).join("");
      } else {
        artsHtml = "<p style='margin:0;font-size:.78rem;color:var(--ink);'>" +
          escHtml((ord && ord.summaryText) || "해당 지자체 별도 조례 특례가 확인되지 않아 「건축법」 제80조 및 동법 시행령 제115조의2([별표 15]) 법정 기준으로 적용합니다.") +
          "</p>";
      }

      // 2) 토지 개별공시지가 및 위치지수 산정 근거
      var landYear = calcState.stdrYear || (new Date().getFullYear());
      var landWonFormatted = calcState.landPriceWon > 0 ? formatCommaInt(calcState.landPriceWon) + "원/㎡" : "기준가 적용";
      var unitPriceFormatted = formatCommaInt(calcState.unitPriceWon) + "원/㎡";
      var landPriceBlock =
        '<div class="calc-evidence-block">' +
        '<div class="calc-evidence-block__title"><i class="fa-solid fa-landmark"></i> 토지 공시지가 및 건물 시가표준액 산정 근거</div>' +
        '<div class="calc-evidence-block__content">' +
        '토지 개별공시지가(' + escHtml(String(landYear)) + '): <b>' + landWonFormatted + '</b> → ' +
        '지방세법 위치지수 <b>[' + calcState.locationIndex + ']</b> 적용 → ' +
        '산출된 1㎡당 건물 시가표준액: <b>' + unitPriceFormatted + '</b>' +
        '</div>' +
        '</div>';

      // 3) 연 2회 부과 판단 기준 (건축법 제80조제5항)
      var biannualBlock =
        '<div class="calc-evidence-block calc-evidence-block--amber">' +
        '<div class="calc-evidence-block__title"><i class="fa-solid fa-circle-exclamation"></i> 연간 반복 부과(최대 연 2회) 법적 판단 기준</div>' +
        '<div class="calc-evidence-block__content">' +
        '이행강제금은 원칙적으로 시정명령일 기준 <b>연 1회</b> 부과되나, ' +
        '<b>① 시정명령 불이행 지속</b>, <b>② 영리 목적 무단 용도변경·증축 또는 상습 위반(가구·세대수 증가 방쪼개기 등)</b>, ' +
        '<b>③ 관할 지자체 건축조례에서 규정한 경우</b>에는 <b>1년에 최대 2회까지</b> 반복 부과될 수 있습니다.' +
        '</div>' +
        '</div>';

      // 1번 조례 블록
      var ordBlock =
        '<div class="calc-evidence-block">' +
        '<div class="calc-evidence-block__title"><i class="fa-solid fa-book-open"></i> ' + escHtml(ordTitle) + ' (' + escHtml(govName) + effStr + ')</div>' +
        '<div class="calc-evidence-block__content">' + artsHtml + '</div>' +
        '</div>';

      evidenceBodyEl.innerHTML = ordBlock + landPriceBlock + biannualBlock;
    }

    // 법제처 자치법규 API 조회 결과를 UI 및 산정 상태에 반영하는 함수
    function applyOrdinanceReview(rawOrd, addressContext) {
      var ord = (rawOrd && rawOrd.ordinance) ? rawOrd.ordinance : rawOrd;
      if (!ord) return;
      ord.ok = true;
      calcState.liveOrdinance = ord;

      var extractedGov = extractLocalGovNameFromText(addressContext) || ord.localGovName || "";
      if (extractedGov && extractedGov !== "관할 지자체") {
        calcState.localGovName = extractedGov;
        ord.localGovName = extractedGov;
      }

      calcState.hasOrdinance = ord.hasOrdinance !== false;
      calcState.municipality = ord.muniCode || (calcState.hasOrdinance ? "custom_region" : "building_act");
      calcState.annualCount = ord.annualCount || 1;
      calcState.maxAnnualCount = ord.maxAnnualCount || 2;

      // 지자체 조례 유무 및 용도에 따른 조례 감경 체크박스 자동 연동
      if (!calcState.hasOrdinance) {
        if (chkOrdinance) chkOrdinance.checked = false;
      } else if (calcState.municipality === "guri" && calcState.useType === "non_residential") {
        if (chkOrdinance) chkOrdinance.checked = false;
      } else if (calcState.useType === "residential" && chkOrdinance) {
        chkOrdinance.checked = true;
      }

      // 판단 근거 영역 렌더링
      renderEvidenceDetails(ord, addressContext || calcState.searchedAddr);

      // 하위 호환
      if (ordinanceSummaryTitleEl) {
        var effStrLegacy = ord.effectiveDate && String(ord.effectiveDate).length === 8
          ? " · 시행 " + String(ord.effectiveDate).slice(0, 4) + "." + String(ord.effectiveDate).slice(4, 6) + "." + String(ord.effectiveDate).slice(6, 8)
          : "";
        if (calcState.hasOrdinance && ord.ordinanceName) {
          ordinanceSummaryTitleEl.innerHTML =
            '<i class="fa-solid fa-book-open"></i> <b>' + escHtml(ord.ordinanceName) + "</b> 이행강제금 조문 검토 내역 보기 (" +
            escHtml(calcState.localGovName) + effStrLegacy + ")";
        }
      }

      updateMuniBanner();
    }

    function fetchOrdinanceByQuery(queryText) {
      if (!queryText) return;
      fetch("/api/law/local-ordinance?address=" + encodeURIComponent(queryText))
        .then(function (r) { return r.json(); })
        .then(function (res) {
          if (res && (res.ok || res.ordinance)) {
            applyOrdinanceReview(res.ordinance || res, queryText);
            applyAutoBuildingUnitPrice();
            updateCalc();
          }
        })
        .catch(function () {});
    }

    // 구조·용도·증축형태·위치지수(토지 개별공시지가 연동) 기반 『1㎡당 건축물 시가표준액』 자동 산정
    function computeAutoBuildingUnitPrice() {
      var structMap = BUILDING_STD_BASE_BY_STRUCTURE[calcState.structure] || BUILDING_STD_BASE_BY_STRUCTURE["샤시/파이프조(간이·베란다)"];
      var baseAt107 = structMap[calcState.ageFactor] || structMap.annex_aged || 29750;
      var locRatio = (calcState.locationIndex || 1.07) / 1.07;
      var useMultiplier = calcState.useType === "non_residential" ? 1.25 : 1.0;

      // 지방세법 시가표준액 산정 테이블 보정 (부속·간이증축 및 가설·공작물 구조·용도별 기준단가)
      if (calcState.municipality === "guri" && calcState.ageFactor === "annex_aged" && calcState.useType === "non_residential") {
        if (calcState.structure === "철근콘크리트조(RC)") return 124800;
        if (calcState.structure === "조립식패널조(샌드위치패널)") return 95900;
      }
      if (calcState.municipality === "guri" && calcState.ageFactor === "annex_aged" && calcState.useType === "residential" && calcState.structure === "샤시/파이프조(간이·베란다)") {
        return 26400;
      }
      if (calcState.ageFactor === "temp_warehouse") {
        if (calcState.structure === "조립식패널조(샌드위치패널)") {
          return calcState.useType === "non_residential" ? 16520 : 5120;
        }
        if (calcState.structure === "샤시/파이프조(간이·베란다)") {
          return calcState.useType === "non_residential" ? 4130 : 5120;
        }
        if (calcState.structure === "경량철골조(강파이프)") {
          return 29335;
        }
      }

      var computed = Math.round((baseAt107 * locRatio * useMultiplier) / 10) * 10;
      return Math.max(1000, computed);
    }

    function applyAutoBuildingUnitPrice() {
      var autoUnit = computeAutoBuildingUnitPrice();
      calcState.unitPriceWon = autoUnit;
      if (costInput) {
        costInput.value = formatCommaInt(autoUnit);
      }
    }

    // 천 단위 콤마 포맷 유틸리티
    function formatCommaInt(n) {
      var num = Math.round(Number(n) || 0);
      return num.toLocaleString("ko-KR");
    }

    function formatCommaDecimal(strOrNum) {
      var raw = String(strOrNum == null ? "" : strOrNum).replace(/[^0-9.]/g, "");
      if (!raw) return "";
      var parts = raw.split(".");
      var intPart = parts[0] ? Number(parts[0]).toLocaleString("ko-KR") : "0";
      if (parts.length > 1) {
        return intPart + "." + parts[1].slice(0, 3);
      }
      return intPart;
    }

    function parseCleanNumber(val) {
      var cleaned = String(val == null ? "" : val).replace(/,/g, "").trim();
      var num = parseFloat(cleaned);
      return isNaN(num) ? 0 : num;
    }

    // 소수점 반올림 후 10원 단위 미만 절사(원단위 절사)
    function roundAndTruncate10Won(val) {
      var rounded = Math.round(Number(val) || 0);
      var truncated = Math.floor(rounded / 10) * 10;
      return {
        rounded: rounded,
        truncated: Math.max(0, truncated),
        cutWon: Math.max(0, rounded - truncated)
      };
    }

    function formatFullAddress(addrObj, fallbackText) {
      if (!addrObj) return fallbackText || "";
      var parcel = (addrObj.parcel || "").trim();
      var road = (addrObj.road || "").trim();
      var bld = (addrObj.bldnm || "").trim();
      var main = parcel || road || fallbackText || "";
      if (road && parcel && road !== parcel) {
        main = parcel + " (" + road + (bld ? " · " + bld : "") + ")";
      } else if (bld && main.indexOf(bld) === -1) {
        main = main + " (" + bld + ")";
      }
      return main;
    }

    function resolveViolationRateAndLabel() {
      var checkedRadio = calcBox.querySelector('input[name="calcViolationType"]:checked');
      if (!checkedRadio) {
        return { vtype: "unpermitted", vrate: 1.0, vlabel: "무허가/미신고 증축·신축" };
      }
      var vtype = checkedRadio.value;
      if (vtype !== "other") {
        return {
          vtype: vtype,
          vrate: parseFloat(checkedRadio.getAttribute("data-vrate")) || 1.0,
          vlabel: checkedRadio.getAttribute("data-vlabel") || "무허가/미신고 증축·신축"
        };
      }

      // 기타 일반 위반 (시행령 별표 15 기준)
      var presetVal = otherPresetSelect ? otherPresetSelect.value : "0.3";
      var rate = 0.3;
      var label = "기타 일반 위반 (별표 15)";
      if (presetVal === "custom") {
        var customPct = Math.min(100, Math.max(1, parseFloat(customRateInput && customRateInput.value) || 30));
        rate = customPct / 100;
        label = "기타 위반 (별표 15 직접입력 " + customPct + "%)";
      } else {
        rate = parseFloat(presetVal) || 0.3;
        var opt = otherPresetSelect && otherPresetSelect.options[otherPresetSelect.selectedIndex];
        var optName = (opt && opt.getAttribute("data-name")) || "기타 일반 위반";
        label = optName;
      }
      if (otherRateBadge) {
        otherRateBadge.textContent = "별표 15 기준 (" + Math.round(rate * 100) + "%)";
      }
      return { vtype: "other", vrate: rate, vlabel: label };
    }

    function validateInputs() {
      var costRaw = costInput ? costInput.value.trim() : "";
      var areaRaw = areaInput ? areaInput.value.trim() : "";
      var unitWon = parseCleanNumber(costRaw);
      var area = parseCleanNumber(areaRaw);

      var isCostEmpty = (costRaw === "");
      var isAreaEmpty = (areaRaw === "");

      if (costInput && costErrorEl) {
        if (isCostEmpty) {
          costInput.classList.remove("is-invalid");
          costErrorEl.style.display = "none";
        } else if (unitWon <= 0) {
          costInput.classList.add("is-invalid");
          costErrorEl.style.display = "block";
          costErrorEl.textContent = "1㎡당 건축물 시가표준액은 0원보다 큰 숫자를 입력해 주세요.";
        } else if (unitWon < 1000) {
          costInput.classList.add("is-invalid");
          costErrorEl.style.display = "block";
          costErrorEl.textContent = "단위 확인: 원(₩) 단위로 입력해 주세요 (예: 29,750).";
        } else {
          costInput.classList.remove("is-invalid");
          costErrorEl.style.display = "none";
        }
      }

      if (areaInput && areaErrorEl) {
        if (isAreaEmpty) {
          areaInput.classList.remove("is-invalid");
          areaErrorEl.style.display = "none";
        } else if (area <= 0) {
          areaInput.classList.add("is-invalid");
          areaErrorEl.style.display = "block";
          areaErrorEl.textContent = "위반 면적은 0㎡보다 큰 숫자를 입력해 주세요.";
        } else if (area > 10000) {
          areaInput.classList.add("is-invalid");
          areaErrorEl.style.display = "block";
          areaErrorEl.textContent = "위반 면적이 10,000㎡를 초과합니다. 입력 단위를 확인해 주세요.";
        } else {
          areaInput.classList.remove("is-invalid");
          areaErrorEl.style.display = "none";
        }
      }

      var isReady = (!isCostEmpty && unitWon >= 1000 && !isAreaEmpty && area > 0 && area <= 10000);
      return {
        unitWon: Math.max(0, unitWon),
        area: Math.max(0, area),
        isReady: isReady
      };
    }

    function updateSmallResBadge(area) {
      if (!badgeSmallResHint || !cardSmallRes) return;
      if (calcState.useType === "non_residential") {
        badgeSmallResHint.textContent = "비주거용 선택됨 (주거용 전용 특례)";
        cardSmallRes.classList.add("is-disabled-hint");
      } else {
        cardSmallRes.classList.remove("is-disabled-hint");
        if (area > 0 && area <= 60) {
          badgeSmallResHint.textContent = "현재 " + area + "㎡ (60㎡ 이하 감경 대상 해당)";
        } else if (area > 60 && area <= 85) {
          badgeSmallResHint.textContent = "현재 " + area + "㎡ (구법 85㎡ 이하 해당 시 적용)";
        } else {
          badgeSmallResHint.textContent = "주거용 · 60㎡(구법 85㎡) 이하 대상";
        }
      }
    }

    function updateCalc() {
      var valid = validateInputs();
      var unitWon = valid.unitWon;
      var area = valid.area;
      var py = (area * 0.3025).toFixed(1);

      calcState.unitPriceWon = unitWon;
      calcState.area = area;

      var muniCfg = getCurrentMuniConfig();
      var vInfo = resolveViolationRateAndLabel();
      calcState.vtype = vInfo.vtype;
      calcState.vrate = vInfo.vrate;
      calcState.vlabel = vInfo.vlabel;

      calcState.smallResDiscount = !!(chkSmallRes && chkSmallRes.checked);
      calcState.ordinanceDiscount = !!(chkOrdinance && chkOrdinance.checked);

      if (cardSmallRes) cardSmallRes.classList.toggle("is-checked", calcState.smallResDiscount);
      if (cardOrdinance) cardOrdinance.classList.toggle("is-checked", calcState.ordinanceDiscount);

      updateSmallResBadge(area);
      updateMuniBanner();

      // [기본값 / 초기화 대기 상태] 유효한 단가 및 면적이 없거나 아직 계산을 실행하지 않은 경우
      if (!valid.isReady) {
        calcState.isCalculated = false;

        if (pyeongText) {
          pyeongText.style.display = "none";
        }
        if (costLabel) {
          costLabel.textContent = "";
        }
        if (muniBadgeEl) {
          muniBadgeEl.textContent = calcState.searchedAddr ? (muniCfg.shortName + " · 연 " + calcState.annualCount + "회 부과") : "주소 조회 대기";
        }
        if (resMetaBadgeEl) {
          resMetaBadgeEl.textContent = calcState.searchedAddr
            ? (calcState.structure + " · " + calcState.searchedAddr)
            : "주소 또는 면적 입력 시 자동 산정";
        }
        if (finalHeroLabelEl) {
          finalHeroLabelEl.textContent = "1회 부과 예정 금액 (원단위 절사)";
        }
        if (finalWonEl) {
          finalWonEl.textContent = "—";
        }
        if (finalManwonNoteEl) {
          finalManwonNoteEl.textContent = "주소를 조회하거나 면적을 입력하면 1회 부과 예정액이 산출됩니다.";
        }
        if (annualMetaLabelEl) {
          annualMetaLabelEl.textContent = "연간 반복 부과: 주소 조회 시 조례 연동";
        }
        if (annualWonEl) {
          annualWonEl.textContent = "—";
        }
        if (cumulative3YNoteEl) {
          cumulative3YNoteEl.textContent = "주소·면적 입력 시 연간 누적 및 과태료가 산정됩니다.";
        }
        if (effectiveRateTagEl) {
          effectiveRateTagEl.textContent = "시가표준액 대비 실효율 —";
        }
        if (formulaTextEl) {
          formulaTextEl.textContent = "주소를 조회하거나 단가와 면적을 입력하시면 산출 공식이 표시됩니다.";
        }

        if (tdMunicipalityEl) tdMunicipalityEl.textContent = muniCfg.shortName || "주소 조회 대기";
        if (tdUnitPriceEl) tdUnitPriceEl.textContent = unitWon > 0 ? formatCommaInt(unitWon) + "원 / ㎡" : "—";
        if (tdAreaEl) tdAreaEl.textContent = area > 0 ? formatCommaDecimal(area) + "㎡" : "—";
        if (tdBaseAmountEl) tdBaseAmountEl.textContent = "— 원";
        if (tdViolationRateEl) tdViolationRateEl.textContent = "—";
        if (tdDiscountRateEl) tdDiscountRateEl.textContent = "—";
        if (tdRoundingNoteEl) tdRoundingNoteEl.textContent = "—";
        if (tdFinalAmountEl) tdFinalAmountEl.textContent = "— 원";

        // 기본값/대기 상태에서는 결과가 저장되지 않도록 순수한 상담 신청 링크를 유지
        if (consultBtn) {
          consultBtn.setAttribute("href", "consult.html?cat=양성화" + (calcState.searchedAddr ? "&address=" + encodeURIComponent(calcState.searchedAddr) : ""));
          consultBtn.innerHTML = '<i class="fa-solid fa-comments"></i> 양성화 무료 상담 신청 <i class="fa-solid fa-arrow-right"></i>';
        }
        return;
      }

      // [실제 계산 상태]
      calcState.isCalculated = true;

      if (pyeongText) {
        pyeongText.style.display = "inline-block";
        pyeongText.textContent = "약 " + py + "평";
      }
      if (costLabel) {
        var manwon = (unitWon / 10000).toFixed(unitWon % 10000 === 0 ? 0 : 2);
        costLabel.textContent = "약 " + Number(manwon).toLocaleString("ko-KR") + "만원 / ㎡";
      }

      // [핵심 산정 공식: 건축법 제80조 및 동법 시행령 제115조의2]
      // 1) 기본 산정가액 = (1㎡당 건축물 시가표준액 × 50%) × 위반면적(㎡)
      var baseAmountRaw = (unitWon * 0.5) * area;
      var baseAmountRounded = Math.round(baseAmountRaw);

      // 2) 위반 유형별 부과비율 적용
      var afterViolationRaw = baseAmountRaw * calcState.vrate;

      // 3) 감경률 산정 (소규모 주거 50% 감경 × 지자체 조례 50% 감경)
      var discountMultiplier = 1.0;
      var discountLabels = [];
      if (calcState.smallResDiscount) {
        discountMultiplier *= (muniCfg.smallResDiscountRate || 0.5);
        discountLabels.push("소규모 주거 50%");
      }
      if (calcState.ordinanceDiscount && muniCfg.hasOrdinance !== false) {
        discountMultiplier *= (muniCfg.ordinanceDiscountRate || 0.5);
        discountLabels.push("조례 감경 50%");
      }

      // 4) 1회 부과 예정 금액 (소수점 반올림 후 10원 단위 미만 절사)
      var rawFinal = afterViolationRaw * discountMultiplier;
      var finalCalc = roundAndTruncate10Won(rawFinal);
      var finalWon = finalCalc.truncated;
      var finalManwon = (finalWon / 10000).toFixed(finalWon < 100000 ? 1 : 0);

      // 5) 연간 누적 예상 금액 (연 1회 및 연 2회) 및 3년·5회분(양성화 과태료 기준) 누적액
      var annualWon = finalWon * calcState.annualCount;
      var biannualWon = finalWon * 2;
      var cumulative3YWon = annualWon * 3;
      var specialAct5TimesWon = finalWon * 5;

      // 상단 관할 지자체명 배지 및 메타 배지 업데이트 ("관할 지자체" 대신 실제 지자체명 표시)
      var useLabel = calcState.useType === "residential" ? "주거용 건축물" : "비주거용 건축물";
      var govDisplayName = muniCfg.shortName || calcState.localGovName || "건축법 법정 기준";
      if (muniBadgeEl) {
        muniBadgeEl.textContent = govDisplayName + " · 연 " + calcState.annualCount + "회 부과";
      }
      if (resMetaBadgeEl) {
        var addrMeta = calcState.searchedAddr ? " · " + calcState.searchedAddr : "";
        resMetaBadgeEl.textContent = useLabel + " · " + calcState.structure + addrMeta;
      }
      if (finalHeroLabelEl) {
        finalHeroLabelEl.textContent = "1회 부과 예정 금액 (원단위 절사)";
      }

      // 메인 1회 부과 예정 금액 출력
      if (finalWonEl) {
        finalWonEl.textContent = formatCommaInt(finalWon);
      }
      if (finalManwonNoteEl) {
        var cutInfo = finalCalc.cutWon > 0
          ? " (산출원금 " + formatCommaInt(finalCalc.rounded) + "원에서 10원 미만 " + finalCalc.cutWon + "원 절사)"
          : " (소수점 반올림 및 10원 미만 절사 적용 · 1회 부과 기준)";
        finalManwonNoteEl.textContent = "약 " + Number(finalManwon).toLocaleString("ko-KR") + "만원" + cutInfo;
      }

      // 연간 누적 예상 금액 카드 업데이트
      if (annualMetaLabelEl) {
        annualMetaLabelEl.textContent = "연간 반복 부과: 연 " + calcState.annualCount + "회 기준";
      }
      if (annualWonEl) {
        annualWonEl.textContent = formatCommaInt(annualWon);
      }
      if (cumulative3YNoteEl) {
        cumulative3YNoteEl.innerHTML =
          "미시정 시 3년 누적: <b>" + formatCommaInt(cumulative3YWon) + "원</b> · " +
          "양성화 특별법 과태료(5회분): <b>" + formatCommaInt(specialAct5TimesWon) + "원</b>";
      }

      // 산출 근거 공식 디버깅/참고용 영역 업데이트
      var effectiveStdPct = (0.5 * calcState.vrate * discountMultiplier * 100);
      var effectiveStdPctStr = Number(effectiveStdPct.toFixed(2)) + "%";
      if (effectiveRateTagEl) {
        effectiveRateTagEl.textContent = "시가표준액 대비 실효율 " + effectiveStdPctStr;
      }
      if (formulaTextEl) {
        var vratePct = Math.round(calcState.vrate * 1000) / 10;
        var rawFormatted = Number(rawFinal.toFixed(1)).toLocaleString("ko-KR");
        formulaTextEl.textContent =
          "(" + formatCommaInt(unitWon) + "원/㎡ × 50% × 부과율 " + vratePct + "%) × " +
          area + "㎡ × 감경 " + discountMultiplier + " = " + rawFormatted + "원 → " + formatCommaInt(finalWon) + "원";
      }

      // 단계별 산출 근거 상세 테이블 업데이트
      if (tdMunicipalityEl) {
        var ordRefShort = muniCfg.ordinanceRef ? " · " + muniCfg.ordinanceRef : "";
        tdMunicipalityEl.textContent = govDisplayName + " (연 " + calcState.annualCount + "회 부과" + ordRefShort + ")";
      }
      if (tdUnitPriceEl) {
        var locTag = calcState.landPriceWon > 0
          ? " (공시지가 " + formatCommaInt(calcState.landPriceWon) + "원 → 위치지수 " + calcState.locationIndex + ")"
          : " (위치지수 " + calcState.locationIndex + " 기준)";
        tdUnitPriceEl.textContent = formatCommaInt(unitWon) + "원 / ㎡" + locTag;
      }
      if (tdAreaEl) {
        var ageOpt = ageFactorSelect && ageFactorSelect.options[ageFactorSelect.selectedIndex];
        var ageShort = ageOpt ? ageOpt.text.split("(")[0].trim() : "";
        tdAreaEl.textContent = formatCommaDecimal(area) + "㎡ (약 " + py + "평)" + (ageShort ? " · " + ageShort : "");
      }
      if (tdBaseAmountEl) {
        tdBaseAmountEl.textContent = formatCommaInt(baseAmountRounded) + "원";
      }
      if (tdViolationRateEl) {
        var vPct = Math.round(calcState.vrate * 1000) / 10;
        var stdEffectivePct = Math.round(0.5 * calcState.vrate * 1000) / 10;
        tdViolationRateEl.textContent = calcState.vlabel + " · " + vPct + "% (시가표준액의 " + stdEffectivePct + "%)";
      }
      if (tdDiscountRateEl) {
        if (discountLabels.length === 0) {
          tdDiscountRateEl.textContent = "감경 미적용 · 100% 부과 (×1.0)";
        } else {
          var totalDiscPct = Math.round((1 - discountMultiplier) * 100);
          var applyPct = Math.round(discountMultiplier * 100);
          tdDiscountRateEl.textContent =
            discountLabels.join(" + ") + " → 총 " + totalDiscPct + "% 감경 (적용률 " + applyPct + "% · ×" + discountMultiplier + ")";
        }
      }
      if (tdRoundingNoteEl) {
        tdRoundingNoteEl.textContent = finalCalc.cutWon > 0
          ? "반올림 " + formatCommaInt(finalCalc.rounded) + "원 → 10원 미만 절사"
          : "소수점 반올림 및 10원 미만 절사 (원단위 절사)";
      }
      if (tdFinalAmountEl) {
        tdFinalAmountEl.textContent = formatCommaInt(finalWon) + "원";
      }

      // 상담 신청 버튼 쿼리스트링 연동 (사용자가 산출한 실제 결과만 전달)
      if (consultBtn) {
        var discSummary = discountLabels.length ? discountLabels.join(", ") : "감경 미적용";
        var addrPart = calcState.searchedAddr ? "조회 주소: " + calcState.searchedAddr + " / " : "";
        var landPart = calcState.landPriceWon > 0
          ? "토지 개별공시지가: " + formatCommaInt(calcState.landPriceWon) + "원/㎡(위치지수 " + calcState.locationIndex + ") / "
          : "";
        var memo =
          "[건축법 제80조·시행령 제115조의2 이행강제금 산정 결과] " +
          "관할 지자체: " + govDisplayName + " (" + (muniCfg.ordinanceRef || "") + " · 연 " + calcState.annualCount + "회) / " +
          addrPart +
          landPart +
          "용도·구조: " + useLabel + " · " + calcState.structure + " / " +
          "1㎡당 건물 시가표준액: " + formatCommaInt(unitWon) + "원 / " +
          "위반면적: " + area + "㎡(약 " + py + "평) / " +
          "위반유형: " + calcState.vlabel + "(" + (Math.round(calcState.vrate * 1000) / 10) + "%) / " +
          "감경조건: " + discSummary + " / " +
          "1회 부과 예정액: " + formatCommaInt(finalWon) + "원 / 연간 예상액: " + formatCommaInt(annualWon) + "원";
        var href = "consult.html?cat=양성화" +
          (calcState.searchedAddr ? "&address=" + encodeURIComponent(calcState.searchedAddr) : "") +
          "&memo=" + encodeURIComponent(memo);
        consultBtn.setAttribute("href", href);
        consultBtn.innerHTML = '<i class="fa-solid fa-file-invoice-dollar"></i> 이 산출 근거로 건축사 정밀 상담 신청 <i class="fa-solid fa-arrow-right"></i>';
      }
    }

    // [초기화 기능] 계산기 모든 입력값, 선택 옵션, 산출 결과 및 브라우저 임시 저장(draft) 초기화
    function resetCalculator() {
      // 1) 주소 입력 및 주소 검색/조례 상태 초기화
      if (addrInput) addrInput.value = "";
      calcState.searchedAddr = "";
      calcState.landPriceWon = 0;
      calcState.locationIndex = 1.07;
      calcState.stdrYear = "";
      calcState.liveOrdinance = null;
      calcState.municipality = "building_act";
      calcState.localGovName = "";
      calcState.hasOrdinance = false;
      calcState.annualCount = 1;
      calcState.maxAnnualCount = 2;

      if (landInfoEl) {
        landInfoEl.className = "calc-land-info";
        landInfoEl.innerHTML =
          '<i class="fa-solid fa-location-dot"></i> ' +
          '<span>주소를 입력하거나 <b>주소 찾기</b>로 선택하면 해당 필지의 관할 지자체 조례 및 공시지가가 자동 반영됩니다.</span>';
      }
      if (candidatesEl) {
        candidatesEl.style.display = "none";
        candidatesEl.innerHTML = "";
      }
      if (postcodeWrap) {
        postcodeWrap.style.display = "none";
      }
      if (evidenceDetailsEl) {
        evidenceDetailsEl.style.display = "none";
        evidenceDetailsEl.removeAttribute("open");
      }
      if (evidenceBodyEl) {
        evidenceBodyEl.innerHTML = "";
      }

      // 2) 위반 유형 선택 초기화 (기본 무허가/미신고 증축 100%)
      vtypeRadios.forEach(function (r) {
        r.checked = (r.value === "unpermitted");
        var card = r.closest(".calc-vtype-card");
        if (card) card.classList.toggle("is-checked", r.checked);
      });
      calcState.vtype = "unpermitted";
      calcState.vrate = 1.0;
      calcState.vlabel = "무허가/미신고 증축·신축";
      if (otherRatePanel) otherRatePanel.style.display = "none";
      if (otherPresetSelect) otherPresetSelect.value = "0.3";
      if (customRateWrap) customRateWrap.style.display = "none";

      // 3) 구조, 단가, 면적 초기화
      if (structureSelect) structureSelect.value = "샤시/파이프조(간이·베란다)";
      calcState.structure = "샤시/파이프조(간이·베란다)";
      if (structureHintEl) {
        structureHintEl.textContent = "선택 구조: 샤시/철파이프조(구조지수 0.16) — 조립식패널조(0.38)·RC조(1.00)와 시가표준액 단가가 다르게 산정됩니다.";
      }
      if (ageFactorSelect) ageFactorSelect.value = "annex_aged";
      calcState.ageFactor = "annex_aged";

      if (costInput) {
        costInput.value = "";
        costInput.classList.remove("is-invalid");
      }
      if (costErrorEl) costErrorEl.style.display = "none";
      if (costLabel) costLabel.textContent = "";

      if (areaInput) {
        areaInput.value = "";
        areaInput.classList.remove("is-invalid");
      }
      if (areaErrorEl) areaErrorEl.style.display = "none";
      if (pyeongText) {
        pyeongText.textContent = "약 0평";
        pyeongText.style.display = "none";
      }

      // 4) 용도 및 감경 체크박스 초기화
      useRadios.forEach(function (r) {
        r.checked = (r.value === "residential");
        var pill = r.closest(".calc-radio-pill");
        if (pill) pill.classList.toggle("is-checked", r.checked);
      });
      calcState.useType = "residential";

      if (chkSmallRes) chkSmallRes.checked = true;
      calcState.smallResDiscount = true;
      if (cardSmallRes) cardSmallRes.classList.add("is-checked");

      if (chkOrdinance) chkOrdinance.checked = true;
      calcState.ordinanceDiscount = true;
      if (cardOrdinance) cardOrdinance.classList.add("is-checked");

      // 5) 임시 저장소(draft) 초기화 (기본값이나 이전 시뮬레이션 데이터가 상담 신청 폼에 남지 않도록)
      try {
        localStorage.removeItem("barum_consult_draft");
      } catch (e) {}

      updateCalc();
    }

    function renderAddressCandidates(cands, activePnu) {
      if (!candidatesEl) return;
      if (!Array.isArray(cands) || cands.length <= 1) {
        candidatesEl.style.display = "none";
        candidatesEl.innerHTML = "";
        return;
      }
      candidatesEl.style.display = "flex";
      var headHtml =
        '<div class="calc-cand-title">' +
        '<span><i class="fa-solid fa-list-check"></i> 검색된 전체 주소 선택 (' + cands.length + '건)</span>' +
        '<span>주소를 클릭하면 해당 필지의 공시지가 및 관할 지자체 조례가 적용됩니다</span>' +
        "</div>";

      var listHtml = cands.map(function (c) {
        var isAct = c.pnu === activePnu;
        var parcelText = c.parcel || "";
        var roadText = c.road || "";
        var bldText = c.bldnm ? " (" + c.bldnm + ")" : "";
        var primaryLine = parcelText
          ? '<span class="calc-cand-tag">지번</span>' + escHtml(parcelText + bldText)
          : '<span class="calc-cand-tag calc-cand-tag--road">도로명</span>' + escHtml(roadText + bldText);
        var secondaryLine = (parcelText && roadText && parcelText !== roadText)
          ? '<span class="calc-cand-btn__sub"><span class="calc-cand-tag calc-cand-tag--road">도로명</span>' + escHtml(roadText) + "</span>"
          : "";

        var fullDisplay = formatFullAddress(c, parcelText || roadText);
        return (
          '<button type="button" class="calc-cand-btn' + (isAct ? " is-active" : "") + '" ' +
          'data-pnu="' + escHtml(c.pnu) + '" ' +
          'data-parcel="' + escHtml(parcelText) + '" ' +
          'data-road="' + escHtml(roadText) + '" ' +
          'data-bldnm="' + escHtml(c.bldnm || "") + '" ' +
          'data-full="' + escHtml(fullDisplay) + '">' +
          '<span class="calc-cand-btn__main">' +
          '<span class="calc-cand-btn__addr">' + primaryLine + "</span>" +
          secondaryLine +
          "</span>" +
          '<span class="calc-cand-pick">' + (isAct ? "선택됨" : "선택") + "</span>" +
          "</button>"
        );
      }).join("");

      candidatesEl.innerHTML = headHtml + listHtml;
    }

    function ensureDaumPostcode(cb) {
      if (window.daum && window.daum.Postcode) {
        return cb();
      }
      var s = document.createElement("script");
      s.src = "https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
      s.onload = cb;
      document.head.appendChild(s);
    }

    function openPostcode(initialQuery) {
      if (!postcodeWrap || !postcodeLayer) return;
      var q = typeof initialQuery === "string" ? initialQuery.trim() : (addrInput ? addrInput.value.trim() : "");
      ensureDaumPostcode(function () {
        postcodeWrap.style.display = "block";
        new window.daum.Postcode({
          width: "100%",
          height: "100%",
          oncomplete: function (data) {
            var jibunAddr = data.jibunAddress || data.autoJibunAddress || "";
            var roadAddr = data.roadAddress || data.autoRoadAddress || "";
            var bcode = data.bcode || "";
            var bldName = data.buildingName || "";
            var fullSelected = formatFullAddress(
              { parcel: jibunAddr, road: roadAddr, bldnm: bldName },
              data.address || jibunAddr || roadAddr
            );

            if (addrInput) {
              addrInput.value = fullSelected;
            }
            postcodeWrap.style.display = "none";

            lookupLandPrice({
              query: jibunAddr || roadAddr || data.address || "",
              bcode: bcode,
              jibun: jibunAddr,
              road: roadAddr,
              bldnm: bldName
            });
          }
        }).embed(postcodeLayer, {
          q: q,
          autoClose: false
        });
      });
    }

    function lookupLandPrice(opts) {
      var params = typeof opts === "string" ? { query: opts } : (opts || {});
      var q = (params.query != null ? params.query : (addrInput && addrInput.value) || "").trim();
      var pnu = (params.pnu || "").trim();
      var bcode = (params.bcode || "").trim();
      var jibun = (params.jibun || "").trim();
      var road = (params.road || "").trim();
      var bldnm = (params.bldnm || "").trim();

      if (!q && !pnu && !jibun) {
        if (landInfoEl) {
          landInfoEl.classList.add("is-error");
          landInfoEl.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i><span>조회할 건물 주소를 입력하거나 <b>주소 찾기</b> 버튼을 눌러 전체 주소를 선택해 주세요.</span>';
        }
        if (addrInput) addrInput.focus();
        return;
      }

      if (searchBtn) {
        searchBtn.disabled = true;
        searchBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> <span>조회 중</span>';
      }
      if (landInfoEl) {
        landInfoEl.classList.remove("is-error");
        landInfoEl.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i><span>입력하신 주소의 개별공시지가 및 관할 지자체 건축조례를 조회하고 있습니다...</span>';
      }

      var qs = [];
      if (q) qs.push("query=" + encodeURIComponent(q));
      if (pnu) qs.push("pnu=" + encodeURIComponent(pnu));
      if (bcode) qs.push("bcode=" + encodeURIComponent(bcode));
      if (jibun) qs.push("jibun=" + encodeURIComponent(jibun));
      if (road) qs.push("road=" + encodeURIComponent(road));
      if (bldnm) qs.push("bldnm=" + encodeURIComponent(bldnm));

      var apiUrl = "/api/vworld/land-price?" + qs.join("&");

      fetch(apiUrl)
        .then(function (r) { return r.json(); })
        .then(function (res) {
          if (!res || !res.ok || !res.latest) {
            throw new Error((res && res.error) || "개별공시지가 정보를 찾을 수 없습니다.");
          }
          var latest = res.latest;
          var addrObj = res.address || {};
          var fallbackParcel = (latest.ldCodeNm ? latest.ldCodeNm + " " + (latest.mnnmSlno || "") : "").trim();
          var displayAddr = formatFullAddress(addrObj, fallbackParcel || q);

          calcState.landPriceWon = Number(latest.pblntfPclnd) || 0;
          calcState.locationIndex = getLocationIndexFromLandPrice(calcState.landPriceWon);
          calcState.searchedAddr = displayAddr;
          calcState.stdrYear = latest.stdrYear;

          var extractedGov = extractLocalGovNameFromText(displayAddr) || extractLocalGovNameFromText(latest.ldCodeNm);
          if (extractedGov) {
            calcState.localGovName = extractedGov;
          }

          // 1) 서버에서 함께 검토된 관할 지자체 건축조례가 있으면 즉시 반영
          if (res.ordinance) {
            applyOrdinanceReview(res.ordinance, displayAddr);
          } else {
            fetchOrdinanceByQuery(displayAddr);
          }

          if (addrInput && displayAddr) {
            addrInput.value = displayAddr;
          }

          applyAutoBuildingUnitPrice();

          var ordLabel = (res.ordinance && res.ordinance.ordinanceName)
            ? res.ordinance.ordinanceName + " (" + (calcState.localGovName || "") + ")"
            : (calcState.hasOrdinance ? "「" + calcState.localGovName + " 건축 조례」" : "건축법 법정 기준");

          if (landInfoEl) {
            landInfoEl.classList.remove("is-error");
            landInfoEl.innerHTML =
              '<i class="fa-solid fa-circle-check"></i>' +
              "<span>선택 주소: <b>" + escHtml(displayAddr) + "</b> · <b>" + escHtml(ordLabel) + "</b> 자동 연동</span>";
          }

          renderEvidenceDetails(res.ordinance, displayAddr);
          renderAddressCandidates(res.candidates || [], res.pnu);
          updateCalc();
        })
        .catch(function (err) {
          // 공시지가 조회 실패 시에도 입력된 주소로 지자체 조례 조회는 수행
          if (q) fetchOrdinanceByQuery(q);
          if (landInfoEl) {
            landInfoEl.classList.add("is-error");
            landInfoEl.innerHTML =
              '<i class="fa-solid fa-circle-exclamation"></i>' +
              "<span><b>조회 안내:</b> " + escHtml(err.message) + " [주소 찾기] 버튼으로 전체 주소를 선택해 주세요.</span>";
          }
          if (q && postcodeWrap && postcodeWrap.style.display === "none") {
            openPostcode(q);
          }
        })
        .then(function () {
          if (searchBtn) {
            searchBtn.disabled = false;
            searchBtn.innerHTML = '<i class="fa-solid fa-magnifying-glass"></i> <span>주소·조례 조회</span>';
          }
        });
    }

    // 이벤트 바인딩: 건물 용도, 주요 구조, 행위시기·경과연수 변경 시 건물 시가표준액 자동 재산출
    useRadios.forEach(function (r) {
      r.addEventListener("change", function () {
        useRadios.forEach(function (x) {
          var lbl = x.closest(".calc-radio-pill");
          if (lbl) lbl.classList.toggle("is-checked", x.checked);
        });
        calcState.useType = r.value;
        if (calcState.useType === "non_residential" && chkSmallRes && chkSmallRes.checked) {
          chkSmallRes.checked = false;
        } else if (calcState.useType === "residential" && chkSmallRes && !chkSmallRes.checked && calcState.area <= 85) {
          chkSmallRes.checked = true;
        }
        if (calcState.useType === "non_residential" && calcState.municipality === "guri" && chkOrdinance) {
          chkOrdinance.checked = false;
        }
        applyAutoBuildingUnitPrice();
        updateCalc();
      });
    });

    if (structureSelect) {
      structureSelect.addEventListener("change", function () {
        calcState.structure = structureSelect.value;
        if (structureHintEl) {
          structureHintEl.textContent = "선택 구조: " + (STRUCTURE_NOTES[calcState.structure] || calcState.structure);
        }
        applyAutoBuildingUnitPrice();
        updateCalc();
      });
    }

    if (ageFactorSelect) {
      ageFactorSelect.addEventListener("change", function () {
        calcState.ageFactor = ageFactorSelect.value || "annex_aged";
        applyAutoBuildingUnitPrice();
        updateCalc();
      });
    }

    // 이벤트 바인딩: 2) 주소 검색 및 공시지가·조례 조회
    if (openPostcodeBtn) {
      openPostcodeBtn.addEventListener("click", function () {
        if (postcodeWrap && postcodeWrap.style.display === "block") {
          postcodeWrap.style.display = "none";
        } else {
          openPostcode(addrInput ? addrInput.value : "");
        }
      });
    }
    if (closePostcodeBtn && postcodeWrap) {
      closePostcodeBtn.addEventListener("click", function () {
        postcodeWrap.style.display = "none";
      });
    }
    if (searchBtn) {
      searchBtn.addEventListener("click", function () {
        lookupLandPrice({ query: addrInput ? addrInput.value : "" });
      });
    }
    if (addrInput) {
      addrInput.addEventListener("input", function () {
        var typedGov = extractLocalGovNameFromText(addrInput.value);
        if (typedGov) {
          calcState.localGovName = typedGov;
          updateCalc();
        }
      });
      addrInput.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
          e.preventDefault();
          lookupLandPrice({ query: addrInput.value });
        }
      });
    }
    if (candidatesEl) {
      candidatesEl.addEventListener("click", function (e) {
        var b = e.target.closest("[data-pnu]");
        if (b) {
          var selectedPnu = b.getAttribute("data-pnu") || "";
          var selectedParcel = b.getAttribute("data-parcel") || "";
          var selectedRoad = b.getAttribute("data-road") || "";
          var selectedBld = b.getAttribute("data-bldnm") || "";
          var selectedFull = b.getAttribute("data-full") || selectedParcel || selectedRoad;
          if (addrInput && selectedFull) {
            addrInput.value = selectedFull;
          }
          lookupLandPrice({
            query: selectedParcel || selectedRoad || (addrInput ? addrInput.value : ""),
            pnu: selectedPnu,
            jibun: selectedParcel,
            road: selectedRoad,
            bldnm: selectedBld
          });
        }
      });
    }

    // 이벤트 바인딩: 1㎡당 건축물 시가표준액 입력 (직접 수정 시 실시간 천 단위 콤마 포맷)
    if (costInput) {
      costInput.addEventListener("input", function () {
        var digits = costInput.value.replace(/[^0-9]/g, "");
        if (digits.length > 10) digits = digits.slice(0, 10);
        costInput.value = digits ? Number(digits).toLocaleString("ko-KR") : "";
        updateCalc();
      });
      costInput.addEventListener("blur", function () {
        var num = parseCleanNumber(costInput.value);
        if (num > 0) costInput.value = formatCommaInt(num);
      });
    }

    calcBox.querySelectorAll("[data-set-cost]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var val = parseInt(btn.getAttribute("data-set-cost"), 10) || 29750;
        if (costInput) {
          costInput.value = formatCommaInt(val);
          costInput.classList.remove("is-invalid");
          if (costErrorEl) costErrorEl.style.display = "none";
          if (areaInput && !areaInput.value.trim()) {
            areaInput.value = "11";
            areaInput.classList.remove("is-invalid");
            if (areaErrorEl) areaErrorEl.style.display = "none";
          }
          updateCalc();
        }
      });
    });

    // 이벤트 바인딩: 위반 면적 입력 (소수점 3자리 허용 및 천 단위 콤마 포맷)
    if (areaInput) {
      areaInput.addEventListener("input", function () {
        var raw = areaInput.value.replace(/[^0-9.]/g, "");
        var firstDot = raw.indexOf(".");
        if (firstDot !== -1) {
          raw = raw.slice(0, firstDot + 1) + raw.slice(firstDot + 1).replace(/\./g, "").slice(0, 3);
        }
        var parts = raw.split(".");
        var intFormatted = parts[0] ? Number(parts[0]).toLocaleString("ko-KR") : "";
        areaInput.value = parts.length > 1 ? intFormatted + "." + parts[1] : intFormatted;
        updateCalc();
      });
    }

    calcBox.querySelectorAll("[data-add]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var add = parseFloat(btn.getAttribute("data-add")) || 0;
        if (areaInput) {
          var nextArea = Math.round((parseCleanNumber(areaInput.value) + add) * 1000) / 1000;
          areaInput.value = formatCommaDecimal(nextArea);
          areaInput.classList.remove("is-invalid");
          if (areaErrorEl) areaErrorEl.style.display = "none";
          updateCalc();
        }
      });
    });
    calcBox.querySelectorAll("[data-reset]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        if (costInput && !costInput.value.trim()) {
          applyAutoBuildingUnitPrice();
          if (costInput) costInput.classList.remove("is-invalid");
          if (costErrorEl) costErrorEl.style.display = "none";
        }
        if (areaInput) {
          areaInput.value = btn.getAttribute("data-reset") || "11";
          areaInput.classList.remove("is-invalid");
          if (areaErrorEl) areaErrorEl.style.display = "none";
          updateCalc();
        }
      });
    });

    // 이벤트 바인딩: 3) 위반 유형 라디오 버튼 + 별표 15 기타 위반 세부 설정
    vtypeRadios.forEach(function (r) {
      r.addEventListener("change", function () {
        vtypeRadios.forEach(function (x) {
          var card = x.closest(".calc-vtype-card");
          if (card) card.classList.toggle("is-checked", x.checked);
        });
        if (otherRatePanel) {
          otherRatePanel.style.display = r.value === "other" && r.checked ? "block" : "none";
        }
        updateCalc();
      });
    });

    if (otherPresetSelect) {
      otherPresetSelect.addEventListener("change", function () {
        if (customRateWrap) {
          customRateWrap.style.display = otherPresetSelect.value === "custom" ? "block" : "none";
        }
        updateCalc();
      });
    }
    if (customRateInput) {
      customRateInput.addEventListener("input", function () {
        updateCalc();
      });
    }

    // 이벤트 바인딩: 4) 감경 및 특례 체크박스
    if (chkSmallRes) {
      chkSmallRes.addEventListener("change", function () {
        if (chkSmallRes.checked && calcState.useType === "non_residential") {
          calcState.useType = "residential";
          useRadios.forEach(function (r) {
            r.checked = r.value === "residential";
            var lbl = r.closest(".calc-radio-pill");
            if (lbl) lbl.classList.toggle("is-checked", r.checked);
          });
        }
        updateCalc();
      });
    }
    if (chkOrdinance) {
      chkOrdinance.addEventListener("change", function () {
        updateCalc();
      });
    }

    // 이벤트 바인딩: 5) 초기화 버튼 (결과 대시보드 헤더 및 입력폼 하단)
    if (btnResetCalc) {
      btnResetCalc.addEventListener("click", resetCalculator);
    }
    if (btnResetCalcForm) {
      btnResetCalcForm.addEventListener("click", resetCalculator);
    }

    // 초기 로드 시 대기 상태(— 원, 주소 조회 대기)로 렌더링 (임의의 지자체/더미 금액 자동 저장 방지)
    updateCalc();
  }

  /* ---------- Consult form (상담 신청서) ---------- */
  var form = document.getElementById("consultForm");
  if (form) {
    var $ = function (id) { return document.getElementById(id); };
    var esc = function (s) {
      return String(s).replace(/[&<>"']/g, function (c) {
        return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
      });
    };
    var card = form.closest(".form-card");
    var chips = form.querySelectorAll("#catChips .chip");
    var catInput = $("fCategory");
    var msg = $("fMessage");
    var msgCount = $("msgCount");
    var phoneInput = $("fPhone");
    var fileInput = $("fFiles");
    var dropzone = $("dropzone");
    var fileListEl = $("fileList");
    var files = [];
    var MAX_FILES = 5, MAX_SIZE = 10 * 1024 * 1024;

    /* category chips (radio group) */
    function selectCat(btn, focus) {
      chips.forEach(function (c) {
        var on = c === btn;
        c.setAttribute("aria-checked", on ? "true" : "false");
        c.tabIndex = on ? 0 : -1;
      });
      catInput.value = btn ? btn.getAttribute("data-cat") : "";
      if (btn) $("fieldCategory").classList.remove("has-error");
      if (focus && btn) btn.focus();
    }
    chips.forEach(function (c, i) {
      c.tabIndex = i === 0 ? 0 : -1;
      c.addEventListener("click", function () { selectCat(c); });
      c.addEventListener("keydown", function (e) {
        var k = e.key, n = chips.length, j = -1;
        if (k === "ArrowRight" || k === "ArrowDown") j = (i + 1) % n;
        if (k === "ArrowLeft" || k === "ArrowUp") j = (i - 1 + n) % n;
        if (j > -1) { e.preventDefault(); selectCat(chips[j], true); }
      });
    });

    /* prefill from query string: ?cat=양성화&type=주차장 증설&memo=... */
    var params = new URLSearchParams(location.search);
    var qCat = params.get("cat");
    var qType = params.get("type");
    var qMemo = params.get("memo");
    var qAddress = params.get("address");
    var qName = params.get("name");
    var qPhone = params.get("phone");
    if (qCat) {
      var match = Array.prototype.filter.call(chips, function (c) { return c.getAttribute("data-cat") === qCat; })[0];
      selectCat(match || null);
    }
    if (qAddress && $("fAddress") && !$("fAddress").value) $("fAddress").value = qAddress;
    if (qName && $("fName") && !$("fName").value) $("fName").value = qName;
    if (qPhone && phoneInput && !phoneInput.value) phoneInput.value = qPhone;
    if (qType && msg && !msg.value) msg.value = "[" + qType + "] ";
    if (qMemo && msg) {
      msg.value = (msg.value ? msg.value + "\n\n" : "") + qMemo;
    }

    /* message counter */
    function countMsg() { if (msgCount) msgCount.textContent = msg.value.length; }
    msg.addEventListener("input", countMsg);
    countMsg();

    /* draft auto-save & restore */
    var DRAFT_KEY = "barum_consult_draft";
    var draftNotice = $("draftNotice");
    var btnDraftReset = $("btnDraftReset");

    function saveDraft() {
      try {
        var d = {
          cat: catInput.value,
          address: $("fAddress").value,
          type: $("fType").value,
          role: $("fRole").value,
          message: msg.value,
          name: $("fName").value,
          phone: phoneInput.value,
          email: $("fEmail").value,
          time: $("fTime").value
        };
        if (d.address || d.message || d.name || d.phone) {
          localStorage.setItem(DRAFT_KEY, JSON.stringify(d));
        }
      } catch (err) {}
    }

    function restoreDraft() {
      try {
        var raw = localStorage.getItem(DRAFT_KEY);
        if (!raw) return;
        var d = JSON.parse(raw);
        if (!d) return;

        var restored = false;
        if (!qCat && d.cat) {
          var match = Array.prototype.filter.call(chips, function (c) { return c.getAttribute("data-cat") === d.cat; })[0];
          if (match) { selectCat(match); restored = true; }
        }
        if (!$("fAddress").value && d.address) { $("fAddress").value = d.address; restored = true; }
        if (!$("fType").value && d.type) { $("fType").value = d.type; restored = true; }
        if (!$("fRole").value && d.role) { $("fRole").value = d.role; restored = true; }
        if (!msg.value && d.message) { msg.value = d.message; countMsg(); restored = true; }
        if (!$("fName").value && d.name) { $("fName").value = d.name; restored = true; }
        if (!phoneInput.value && d.phone) { phoneInput.value = d.phone; restored = true; }
        if (!$("fEmail").value && d.email) { $("fEmail").value = d.email; restored = true; }
        if (d.time) { $("fTime").value = d.time; }

        if (restored && draftNotice) {
          draftNotice.style.display = "flex";
        }
      } catch (err) {}
    }

    if (btnDraftReset) {
      btnDraftReset.addEventListener("click", function () {
        try { localStorage.removeItem(DRAFT_KEY); } catch (e) {}
        if (draftNotice) draftNotice.style.display = "none";
        form.reset();
        selectCat(null);
        countMsg();
      });
    }

    restoreDraft();

    var draftTimer = null;
    form.addEventListener("input", function () {
      clearTimeout(draftTimer);
      draftTimer = setTimeout(saveDraft, 400);
    });
    form.addEventListener("change", function () {
      clearTimeout(draftTimer);
      draftTimer = setTimeout(saveDraft, 400);
    });

    /* phone auto format */
    phoneInput.addEventListener("input", function () {
      var d = phoneInput.value.replace(/[^0-9]/g, "").slice(0, 12);
      var out = d;
      if (/^02/.test(d)) {
        out = d.length > 9 ? d.replace(/^(02)(\d{4})(\d{0,4}).*/, "$1-$2-$3") : d.replace(/^(02)(\d{0,3})(\d{0,4}).*/, "$1-$2-$3");
      } else if (/^050/.test(d)) {
        out = d.replace(/^(\d{4})(\d{0,4})(\d{0,4}).*/, "$1-$2-$3");
      } else {
        out = d.length > 10 ? d.replace(/^(\d{3})(\d{4})(\d{0,4}).*/, "$1-$2-$3") : d.replace(/^(\d{3})(\d{0,3})(\d{0,4}).*/, "$1-$2-$3");
      }
      phoneInput.value = out.replace(/-+$/, "");
    });

    /* files */
    function fmtSize(b) { return b > 1048576 ? (b / 1048576).toFixed(1) + "MB" : Math.max(1, Math.round(b / 1024)) + "KB"; }
    function renderFiles() {
      fileListEl.innerHTML = files.map(function (f, i) {
        var icon = /pdf$/i.test(f.name) ? "fa-file-pdf" : "fa-file-image";
        return '<div class="file-item"><i class="fa-solid ' + icon + '"></i><span>' + esc(f.name) + "</span><small>" + fmtSize(f.size) +
          '</small><button type="button" data-rm="' + i + '" aria-label="' + esc(f.name) + ' 삭제"><i class="fa-solid fa-xmark"></i></button></div>';
      }).join("");
    }
    function addFiles(list) {
      var rejected = [];
      Array.prototype.forEach.call(list, function (f) {
        var okType = /^image\//.test(f.type) || /\.pdf$/i.test(f.name);
        if (!okType) rejected.push(f.name + " (지원하지 않는 형식)");
        else if (f.size > MAX_SIZE) rejected.push(f.name + " (10MB 초과)");
        else if (files.length >= MAX_FILES) rejected.push(f.name + " (최대 5개)");
        else if (!files.some(function (x) { return x.name === f.name && x.size === f.size; })) files.push(f);
      });
      renderFiles();
      if (rejected.length) alert("다음 파일은 첨부되지 않았습니다.\n\n" + rejected.join("\n") + "\n\n큰 파일은 이메일로 보내주세요.");
    }
    fileInput.addEventListener("change", function () { addFiles(fileInput.files); fileInput.value = ""; });
    fileListEl.addEventListener("click", function (e) {
      var b = e.target.closest("[data-rm]");
      if (b) { files.splice(+b.getAttribute("data-rm"), 1); renderFiles(); }
    });
    ["dragenter", "dragover"].forEach(function (ev) {
      dropzone.addEventListener(ev, function (e) { e.preventDefault(); dropzone.classList.add("is-drag"); });
    });
    ["dragleave", "drop"].forEach(function (ev) {
      dropzone.addEventListener(ev, function (e) { e.preventDefault(); dropzone.classList.remove("is-drag"); });
    });
    dropzone.addEventListener("drop", function (e) { if (e.dataTransfer) addFiles(e.dataTransfer.files); });

    /* validation */
    var rules = [
      { field: "fieldCategory", el: chips[0], test: function () { return !!catInput.value; } },
      { field: "fieldAddress", el: $("fAddress"), test: function () { return $("fAddress").value.trim().length >= 4; } },
      { field: "fieldMessage", el: msg, test: function () { return msg.value.replace(/^\[[^\]]*\]\s*/, "").trim().length >= 10; } },
      { field: "fieldName", el: $("fName"), test: function () { return $("fName").value.trim().length >= 2; } },
      { field: "fieldPhone", el: phoneInput, test: function () { var d = phoneInput.value.replace(/[^0-9]/g, ""); return d.length >= 9 && d.length <= 12 && /^0/.test(d); } },
      { field: "fieldEmail", el: $("fEmail"), test: function () { var v = $("fEmail").value.trim(); return !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); } },
      { field: "fieldAgree", el: $("fAgree"), test: function () { return $("fAgree").checked; } }
    ];
    function validate() {
      var firstBad = null;
      rules.forEach(function (r) {
        var ok = r.test();
        $(r.field).classList.toggle("has-error", !ok);
        if (r.el && r.el.setAttribute && r.el.tagName !== "BUTTON") r.el.setAttribute("aria-invalid", ok ? "false" : "true");
        if (!ok && !firstBad) firstBad = r;
      });
      return firstBad;
    }
    rules.forEach(function (r) {
      if (!r.el || r.el.tagName === "BUTTON") return;
      var ev = r.el.type === "checkbox" ? "change" : "input";
      r.el.addEventListener(ev, function () {
        if ($(r.field).classList.contains("has-error") && r.test()) {
          $(r.field).classList.remove("has-error");
          r.el.setAttribute("aria-invalid", "false");
        }
      });
    });

    /* submit */
    function collect() {
      return [
        ["상담 분야", catInput.value],
        ["건물 주소", $("fAddress").value.trim()],
        ["건물 종류", $("fType").value],
        ["신청인 구분", $("fRole").value],
        ["성함", $("fName").value.trim()],
        ["연락처", phoneInput.value.trim()],
        ["이메일", $("fEmail").value.trim()],
        ["연락 희망 시간", $("fTime").value],
        ["첨부 파일", files.length ? files.map(function (f) { return f.name; }).join(", ") : ""]
      ];
    }
    function readFileAsDataURL(file) {
      return new Promise(function (resolve) {
        var reader = new FileReader();
        reader.onload = function () {
          resolve({
            name: file.name,
            type: file.type || "application/octet-stream",
            size: file.size || 0,
            dataUrl: reader.result
          });
        };
        reader.onerror = function () { resolve(null); };
        reader.readAsDataURL(file);
      });
    }

    function showSuccess(rows, mode, serverRes) {
      try { localStorage.removeItem(DRAFT_KEY); if (draftNotice) draftNotice.style.display = "none"; } catch (e) {}
      var displayRows = rows.filter(function (r) { return r[1]; }).slice(0, 6);
      if (serverRes && serverRes.id) {
        displayRows.unshift(["접수 번호", serverRes.id]);
      }
      $("successSummary").innerHTML = displayRows.map(function (r) { return "<div><span>" + r[0] + "</span><b>" + esc(r[1]) + "</b></div>"; }).join("");
      var actions = $("successActions");
      var body = rows.filter(function (r) { return r[1]; }).map(function (r) { return r[0] + ": " + r[1]; }).join("\n") +
        "\n\n[상황 설명]\n" + msg.value.trim() + (files.length ? "\n\n※ 첨부 파일은 이 메일에 직접 첨부해 주세요." : "");
      var href = "mailto:" + S.email + "?subject=" + encodeURIComponent("[상담 신청] " + catInput.value + " - " + $("fName").value.trim()) +
        "&body=" + encodeURIComponent(body);

      if (mode === "sent") {
        $("successTitle").textContent = "상담 신청이 접수되었습니다";
        $("successDesc").innerHTML = "신청 내역이 정상적으로 접수되었습니다.<br>건축사가 검토 후 남겨주신 연락처로 빠르게 연락드리겠습니다.";
        actions.innerHTML =
          '<a class="btn btn--accent" id="success-call" href="tel:' + tel + '"><i class="fa-solid fa-phone"></i> ' + esc(S.phone) + "</a>" +
          '<a class="btn btn--ghost" id="success-home" href="index.html"><i class="fa-solid fa-house"></i> 홈으로</a>';
      } else if (mode === "mail") {
        $("successTitle").textContent = "신청서가 준비되었습니다";
        $("successDesc").innerHTML = "아래 <b>이메일로 보내기</b>를 누르시면 접수가 완료됩니다.<br>메일 앱이 열리지 않으면 전화로 연락 주세요.";
        actions.innerHTML =
          '<a class="btn btn--primary btn--shine" id="success-mail" href="' + href + '"><i class="fa-solid fa-envelope"></i> 이메일로 보내기</a>' +
          '<a class="btn btn--accent" id="success-call" href="tel:' + tel + '"><i class="fa-solid fa-phone"></i> ' + esc(S.phone) + "</a>" +
          '<a class="btn btn--ghost" id="success-home" href="index.html"><i class="fa-solid fa-house"></i> 홈으로</a>';
      }
      form.style.display = "none";
      var box = $("consultSuccess");
      box.classList.add("is-show");
      box.focus({ preventScroll: true });
      card.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var bad = validate();
      if (bad) {
        if (bad.el) bad.el.focus();
        $(bad.field).scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }
      var rows = collect();
      if (!S.formEndpoint) { showSuccess(rows, "mail"); return; }

      var btn = $("consultSubmit");
      var label = btn.innerHTML;
      card.classList.add("is-sending");
      btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> 전송 중…';

      if (S.formEndpoint.indexOf("/api/consult") !== -1) {
        Promise.all(files.map(readFileAsDataURL))
          .then(function (encodedFiles) {
            var payload = {
              category: catInput.value,
              address: $("fAddress").value.trim(),
              buildingType: $("fType").value,
              role: $("fRole").value,
              name: $("fName").value.trim(),
              phone: phoneInput.value.trim(),
              email: $("fEmail").value.trim(),
              contactTime: $("fTime").value,
              message: msg.value.trim(),
              files: encodedFiles.filter(Boolean)
            };
            return fetch(S.formEndpoint, {
              method: "POST",
              headers: { "Content-Type": "application/json", "Accept": "application/json" },
              body: JSON.stringify(payload)
            });
          })
          .then(function (res) {
            if (!res.ok) throw new Error(res.status);
            return res.json();
          })
          .then(function (data) {
            showSuccess(rows, "sent", data);
          })
          .catch(function () {
            alert("전송 중 문제가 발생했습니다. 이메일 방식으로 전환합니다.");
            showSuccess(rows, "mail");
          })
          .then(function () {
            card.classList.remove("is-sending");
            btn.innerHTML = label;
          });
        return;
      }

      var fd = new FormData();
      rows.forEach(function (r) { if (r[1] && r[0] !== "첨부 파일") fd.append(r[0], r[1]); });
      fd.append("상황 설명", msg.value.trim());
      fd.append("_subject", "[상담 신청] " + catInput.value + " - " + $("fName").value.trim());
      files.forEach(function (f) { fd.append("files", f, f.name); });

      fetch(S.formEndpoint, { method: "POST", body: fd, headers: { Accept: "application/json" } })
        .then(function (res) { if (!res.ok) throw new Error(res.status); showSuccess(rows, "sent"); })
        .catch(function () {
          alert("전송 중 문제가 발생했습니다. 이메일 방식으로 전환합니다.");
          showSuccess(rows, "mail");
        })
        .then(function () { card.classList.remove("is-sending"); btn.innerHTML = label; });
    });
  }
})();
