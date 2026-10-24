// Motion: fade pages in/out between navigations, and fade photos/cards in
// as they scroll into view. Everything here is decorative: without JS the
// page just renders normally, and reduced-motion users get instant states.
(function () {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --- page in/out -------------------------------------------------------
  function ready() { document.body.classList.add('is-ready'); }
  document.addEventListener('DOMContentLoaded', ready);
  window.addEventListener('pageshow', ready);          // back/forward cache

  document.addEventListener('click', function (e) {
    const a = e.target.closest('a[href]');
    if (!a || reduced) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || a.target === '_blank') return;
    if (a.closest('.plate') || a.hasAttribute('download')) return;
    const href = a.getAttribute('href') || '';
    if (/^(#|mailto:|tel:|javascript:)/.test(href)) return;
    if (a.origin !== window.location.origin) return;               // same-site pages only
    if (a.pathname === window.location.pathname && a.hash) return; // in-page anchor
    e.preventDefault();
    document.body.classList.remove('is-ready');
    setTimeout(function () { window.location.href = a.href; }, 220);
  });

  // --- reveal on scroll ---------------------------------------------------
  document.addEventListener('DOMContentLoaded', function () {
    const items = document.querySelectorAll('.plate, .entry-card');
    if (!('IntersectionObserver' in window) || reduced) {
      items.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-visible'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    items.forEach(function (el) { io.observe(el); });

    // fade each image once its bytes have actually arrived
    document.querySelectorAll('.plate img, .entry-card img').forEach(function (im) {
      if (im.complete) im.classList.add('is-loaded');
      else im.addEventListener('load', function () { im.classList.add('is-loaded'); });
    });
  });
})();
