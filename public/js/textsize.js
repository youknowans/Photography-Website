// Resizable text. Steps the --text-scale CSS variable. The saved value is
// treated as untrusted: it must parse as a number and is clamped to a safe range.
(function () {
  var KEY = 'ansaff-text-scale';
  var MIN = 0.85, MAX = 1.4, STEP = 0.1;
  var scale = 1;

  try {
    var saved = parseFloat(localStorage.getItem(KEY));
    if (isFinite(saved)) scale = Math.min(MAX, Math.max(MIN, saved));
  } catch (e) { /* storage blocked */ }

  function apply() {
    document.documentElement.style.setProperty('--text-scale', scale.toFixed(2));
    try { localStorage.setItem(KEY, scale.toFixed(2)); } catch (e) { /* ignore */ }
  }
  apply();

  document.addEventListener('DOMContentLoaded', function () {
    var dec = document.querySelector('[data-text-dec]');
    var inc = document.querySelector('[data-text-inc]');
    var reset = document.querySelector('[data-text-reset]');
    if (dec) dec.addEventListener('click', function () { scale = Math.max(MIN, +(scale - STEP).toFixed(2)); apply(); });
    if (inc) inc.addEventListener('click', function () { scale = Math.min(MAX, +(scale + STEP).toFixed(2)); apply(); });
    if (reset) reset.addEventListener('click', function () { scale = 1; apply(); });
  });
})();
