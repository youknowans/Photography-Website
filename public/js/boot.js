// Runs in <head> before first paint: marks JS as available (so the fade-in
// styles only apply when scripts work) and restores the saved theme without a flash.
(function () {
  var root = document.documentElement;
  root.classList.add('js');
  try {
    if (localStorage.getItem('ansaff-theme') === 'dark') root.setAttribute('data-theme', 'dark');
  } catch (e) { /* storage blocked: default light theme */ }
})();
