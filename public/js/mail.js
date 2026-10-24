// Builds mailto: links at load time from data attributes, so the address is
// never written out in the page source for scrapers to harvest.
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('a[data-mail]').forEach(function (a) {
    var addr = a.getAttribute('data-user') + '@' + a.getAttribute('data-domain');
    var subject = a.getAttribute('data-subject');
    a.href = 'mailto:' + addr + (subject ? '?subject=' + encodeURIComponent(subject) : '');
  });
});
