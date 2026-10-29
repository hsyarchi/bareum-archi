/* =========================================================
   바름 · 형선윤건축사사무소 — 공통 스크립트
   (헤더/푸터 렌더, 메뉴, 스크롤 효과, FAQ, 카운트다운, 영업시간, 자가진단, 상담 신청서)
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

  /* ---------- Self-check (양성화 대상 자가진단) ---------- */
  var check = document.getElementById("selfCheck");
  if (check) {
    var qs = check.querySelectorAll(".check__q");
    var answers = {};
    var meter = document.getElementById("checkMeter");
    var status = document.getElementById("checkStatus");
    var desc = document.getElementById("checkDesc");
    var prog = document.getElementById("checkProgress");
    var cta = document.getElementById("checkCta");

    qs.forEach(function (q) {
      var key = q.getAttribute("data-q");
      q.querySelectorAll("button").forEach(function (b) {
        b.addEventListener("click", function () {
          q.querySelectorAll("button").forEach(function (x) { x.classList.remove("is-on", "is-bad"); x.setAttribute("aria-pressed", "false"); });
          var v = b.getAttribute("data-v");
          b.classList.add("is-on");
          if (v === "bad") b.classList.add("is-bad");
          b.setAttribute("aria-pressed", "true");
          answers[key] = v;
          update();
        });
      });
    });

    function update() {
      var total = qs.length;
      var vals = Object.keys(answers).map(function (k) { return answers[k]; });
      var n = vals.length;
      var bad = vals.filter(function (v) { return v === "bad"; }).length;
      var unk = vals.filter(function (v) { return v === "unk" || v === "warn"; }).length;
      var ok = vals.filter(function (v) { return v === "ok"; }).length;
      prog.textContent = "진행 " + n + " / " + total;
      meter.style.width = (bad ? Math.max(8, (ok / total) * 40) : ((ok + unk * 0.5) / total) * 100) + "%";

      if (bad) {
        status.textContent = "현재 기준으로는 특별법 대상이 아닐 수 있어요";
        desc.textContent = "다만 일반 추인(사용승인)이나 원상복구·부분 정리 등 다른 방법이 있을 수 있습니다. 주소만 알려주시면 가능한 방법을 함께 찾아드립니다.";
        cta.innerHTML = '다른 방법 문의하기 <i class="fa-solid fa-arrow-right"></i>';
      } else if (n < total) {
        status.textContent = "질문에 답하면 결과가 표시됩니다";
        desc.textContent = "5가지 질문으로 특별법 적용 가능성을 간단히 살펴봅니다. 정확한 판단은 건축물대장·현장 확인이 필요합니다.";
        cta.innerHTML = '바로 상담 신청 <i class="fa-solid fa-arrow-right"></i>';
      } else if (unk) {
        status.textContent = "가능성이 있어요. 몇 가지만 확인하면 됩니다";
        desc.textContent = "'모르겠음' 항목은 건축물대장과 토지이용계획으로 확인할 수 있습니다. 주소를 남겨주시면 대신 확인해 드립니다.";
        cta.innerHTML = '대신 확인 요청하기 <i class="fa-solid fa-arrow-right"></i>';
      } else {
        status.textContent = "양성화 신고 대상일 가능성이 높습니다";
        desc.textContent = "건축위원회 심의(구조·피난·소방·주차) 요건을 미리 검토하면 승인 가능성을 높일 수 있습니다. 지금 준비를 시작해 보세요.";
        cta.innerHTML = '양성화 상담 신청 <i class="fa-solid fa-arrow-right"></i>';
      }
    }
    update();
  }

  /* ---------- Fine & Penalty Calculator (양성화 모의 계산기) ---------- */
  var calcBox = document.getElementById("fineCalc");
  if (calcBox) {
    var typeBtns = calcBox.querySelectorAll("#calcTypeGroup button");
    var paidBtns = calcBox.querySelectorAll("#calcPaidGroup button");
    var areaInput = document.getElementById("calcArea");
    var pyeongText = document.getElementById("calcPyeongText");
    var costSlider = document.getElementById("calcUnitCost");
    var costLabel = document.getElementById("calcUnitCostText");
    var annualFineEl = document.getElementById("calcAnnualFine");
    var specialFineEl = document.getElementById("calcSpecialFine");
    var deductNoteEl = document.getElementById("calcDeductNote");
    var consultBtn = document.getElementById("calcConsultBtn");

    var calcState = {
      type: "multi",
      rate: 0.5,
      cost: 100,
      area: 15,
      paid: 0
    };

    function updateCalc() {
      var a = Math.max(1, parseFloat(areaInput.value) || 0);
      var c = parseInt(costSlider.value, 10) || 100;
      var py = (a * 0.3025).toFixed(1);
      if (pyeongText) pyeongText.textContent = "약 " + py + "평";
      if (costLabel) costLabel.textContent = c + "만원 / ㎡";

      // 연간 이행강제금 (건축법 제80조): 위반면적 * 1㎡당 시가표준액 * 0.5 * 소형주택 감경계수
      var annual = Math.round(a * c * 0.5 * calcState.rate);
      var deduct = calcState.paid * annual;
      var special = Math.max(0, annual - deduct);

      if (annualFineEl) annualFineEl.textContent = annual.toLocaleString();
      if (specialFineEl) specialFineEl.textContent = special.toLocaleString();

      if (deductNoteEl) {
        if (calcState.paid >= 5) {
          deductNoteEl.textContent = "기납부 5회 이상(약 " + deduct.toLocaleString() + "만원 이상) 차감 반영 · 과태료 0원 예상";
        } else if (calcState.paid > 0) {
          deductNoteEl.textContent = "기납부 " + calcState.paid + "회(약 " + deduct.toLocaleString() + "만원) 차감 반영";
        } else {
          deductNoteEl.textContent = "기납부 0회 차감 적용";
        }
      }

      if (consultBtn) {
        var typeName = calcState.type === "multi" ? "다세대/빌라" : calcState.type === "dada" ? "다가구주택" : calcState.type === "single" ? "단독주택" : "근린생활시설";
        var paidLabel = calcState.paid >= 5 ? "5회 이상 납부" : calcState.paid > 0 ? calcState.paid + "회 납부" : "미납(0회)";
        var memo = "[" + typeName + " 양성화 모의계산] 위반면적 " + a + "㎡ (약 " + py + "평) / 기납부: " + paidLabel + " / 연간 예상이행강제금 약 " + annual.toLocaleString() + "만원 / 특별법 예상과태료 실부담 약 " + special.toLocaleString() + "만원";
        consultBtn.setAttribute("href", "consult.html?cat=양성화&memo=" + encodeURIComponent(memo));
      }
    }

    typeBtns.forEach(function (b) {
      b.addEventListener("click", function () {
        typeBtns.forEach(function (x) { x.classList.remove("is-on"); x.setAttribute("aria-pressed", "false"); });
        b.classList.add("is-on");
        b.setAttribute("aria-pressed", "true");
        calcState.type = b.getAttribute("data-type");
        calcState.rate = parseFloat(b.getAttribute("data-rate")) || 0.5;
        var defaultCost = parseInt(b.getAttribute("data-cost"), 10);
        if (defaultCost && costSlider) { costSlider.value = defaultCost; }
        updateCalc();
      });
    });

    paidBtns.forEach(function (b) {
      b.addEventListener("click", function () {
        paidBtns.forEach(function (x) { x.classList.remove("is-on"); x.setAttribute("aria-pressed", "false"); });
        b.classList.add("is-on");
        b.setAttribute("aria-pressed", "true");
        calcState.paid = parseInt(b.getAttribute("data-paid"), 10) || 0;
        updateCalc();
      });
    });

    if (areaInput) areaInput.addEventListener("input", updateCalc);
    if (costSlider) costSlider.addEventListener("input", updateCalc);

    calcBox.querySelectorAll("[data-add]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var add = parseInt(btn.getAttribute("data-add"), 10) || 0;
        if (areaInput) {
          areaInput.value = (parseFloat(areaInput.value) || 0) + add;
          updateCalc();
        }
      });
    });
    calcBox.querySelectorAll("[data-reset]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        if (areaInput) {
          areaInput.value = btn.getAttribute("data-reset") || "15";
          updateCalc();
        }
      });
    });

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
    function showSuccess(rows, mode) {
      try { localStorage.removeItem(DRAFT_KEY); if (draftNotice) draftNotice.style.display = "none"; } catch (e) {}
      var summary = rows.filter(function (r) { return r[1]; }).slice(0, 6);
      $("successSummary").innerHTML = summary.map(function (r) { return "<div><span>" + r[0] + "</span><b>" + esc(r[1]) + "</b></div>"; }).join("");
      var actions = $("successActions");
      if (mode === "mail") {
        var body = rows.filter(function (r) { return r[1]; }).map(function (r) { return r[0] + ": " + r[1]; }).join("\n") +
          "\n\n[상황 설명]\n" + msg.value.trim() + (files.length ? "\n\n※ 첨부 파일은 이 메일에 직접 첨부해 주세요." : "");
        var href = "mailto:" + S.email + "?subject=" + encodeURIComponent("[상담 신청] " + catInput.value + " - " + $("fName").value.trim()) +
          "&body=" + encodeURIComponent(body);
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

      var fd = new FormData();
      rows.forEach(function (r) { if (r[1] && r[0] !== "첨부 파일") fd.append(r[0], r[1]); });
      fd.append("상황 설명", msg.value.trim());
      fd.append("_subject", "[상담 신청] " + catInput.value + " - " + $("fName").value.trim());
      files.forEach(function (f) { fd.append("files", f, f.name); });

      var btn = $("consultSubmit");
      var label = btn.innerHTML;
      card.classList.add("is-sending");
      btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> 전송 중…';
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
