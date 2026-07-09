/*
  reveal.js — fades sections in as they scroll into view.
  Uses IntersectionObserver (built into every modern browser, no library).
  Anything with class "reveal" starts hidden and gets "is-visible" added
  when ~15% of it enters the viewport. CSS does the actual animation.
*/
(function () {
  "use strict";

  var els = document.querySelectorAll(".reveal");
  if (!els.length) return;

  // If the browser is ancient or the user prefers reduced motion,
  // just show everything immediately.
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!("IntersectionObserver" in window) || reduce) {
    els.forEach(function (el) { el.classList.add("is-visible"); });
    return;
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target); // animate once, then leave it alone
      }
    });
  }, { threshold: 0.15 });

  els.forEach(function (el) { io.observe(el); });
})();
