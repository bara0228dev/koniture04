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
