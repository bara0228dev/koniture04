// 내 컴퓨터에서 파일을 바로 열었을 때(file://)도 페이지 이동이 되도록
// "폴더/" 형태의 링크 끝에 index.html을 붙여 줍니다. 웹에 올리면 아무 동작도 하지 않습니다.
if (location.protocol === "file:") {
  document.querySelectorAll('a[href]').forEach(function (a) {
    var href = a.getAttribute("href");
    if (/^(https?:|sms:|tel:|mailto:|#)/.test(href)) return;
    if (href === "./" || href === "../" || href.endsWith("/")) {
      a.setAttribute("href", href + "index.html");
    }
  });
}

// ───────── 문자 상담 (모든 페이지 공통) ─────────
// 모든 페이지가 이 파일을 불러오기 때문에 문자 상담 기능도 여기에 함께 들어 있습니다. 지우지 마세요.
(function () {
  var PHONE = '01058500228';
  var PHONE_LABEL = '010-5850-0228';
  var BODY = [
    '[코니처 문자 상담]',
    '1. 브랜드/가구명(예: 시스템행거, 드레스룸) : ',
    '2. 출발 지역 → 도착 지역 : ',
    '3. 이전 거리(같은 집 안 이동이면 방간이동) : ',
    '4. 엘리베이터 사용 가능 여부(층수) : ',
    '5. 희망 날짜 : ',
    '',
    '※ 가구 사진을 함께 보내주세요.'
  ].join('\n');

  var isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  var smsHref = 'sms:' + PHONE + '?&body=' + encodeURIComponent(BODY);

  var bar = document.querySelector('.sms-bar');
  if (bar) {
    var barLink = bar.querySelector('a');
    if (barLink) barLink.textContent = '문자 상담 신청하기';
    if (!bar.querySelector('.hours')) {
      var hours = document.createElement('p');
      hours.className = 'hours';
      hours.textContent = '상담 07~18시 · 사진 보내주시면 견적 안내';
      bar.appendChild(hours);
    }
  }

  var modal = document.createElement('div');
  modal.className = 'sms-modal';
  modal.innerHTML =
    '<div class="box" role="dialog" aria-modal="true" aria-label="문자 상담 번호">' +
    '<p class="small">휴대폰 문자로 사진과 함께 보내주세요</p>' +
    '<p class="num">' + PHONE_LABEL + '</p>' +
    '<button type="button" class="btn copy">번호 복사</button>' +
    '<p class="small" style="margin-top:12px">상담 07~18시 · 수도권 출장</p>' +
    '<button type="button" class="close">닫기</button></div>';
  document.body.appendChild(modal);

  var copyBtn = modal.querySelector('.copy');
  var closeBtn = modal.querySelector('.close');
  var lastFocus = null;

  function openModal() {
    lastFocus = document.activeElement;
    copyBtn.textContent = '번호 복사';
    modal.classList.add('open');
    closeBtn.focus();
  }
  function closeModal() {
    modal.classList.remove('open');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  function fallbackCopy(text) {
    var t = document.createElement('textarea');
    t.value = text;
    t.setAttribute('readonly', '');
    t.style.position = 'fixed';
    t.style.opacity = '0';
    document.body.appendChild(t);
    t.select();
    var ok = false;
    try { ok = document.execCommand('copy'); } catch (err) {}
    document.body.removeChild(t);
    return ok;
  }

  modal.addEventListener('click', function (e) {
    if (e.target === modal || e.target === closeBtn) closeModal();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
  });
  copyBtn.addEventListener('click', function () {
    var done = function (ok) { copyBtn.textContent = ok ? '복사했어요' : '번호를 직접 선택해 복사해 주세요'; };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(PHONE_LABEL).then(function () { done(true); }, function () { done(fallbackCopy(PHONE_LABEL)); });
    } else {
      done(fallbackCopy(PHONE_LABEL));
    }
  });

  document.querySelectorAll('a[href^="sms:"]').forEach(function (el) {
    el.setAttribute('href', smsHref);
    el.addEventListener('click', function (e) {
      if (isMobile) return;
      e.preventDefault();
      openModal();
    });
  });
})();
