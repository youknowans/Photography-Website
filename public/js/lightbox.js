// Lightbox with prev/next. Click a .plate to open; arrows, buttons, or
// swipe to move between the photos currently visible (filters respected);
// Esc, backdrop click, or the close button dismisses it.
document.addEventListener('DOMContentLoaded', function () {
  const box = document.createElement('div');
  box.className = 'lightbox';
  box.setAttribute('role', 'dialog');
  box.setAttribute('aria-modal', 'true');
  box.innerHTML =
    '<button class="lightbox-close" aria-label="Close">&times;</button>' +
    '<button class="lightbox-nav lightbox-prev" aria-label="Previous photo">&lsaquo;</button>' +
    '<img alt="">' +
    '<button class="lightbox-nav lightbox-next" aria-label="Next photo">&rsaquo;</button>';
  document.body.appendChild(box);

  const img = box.querySelector('img');
  let plates = [], index = -1, opener = null;

  function show(i) {
    if (!plates.length) return;
    index = (i + plates.length) % plates.length;
    const p = plates[index];
    img.src = p.getAttribute('data-large') || p.href;
    img.alt = p.querySelector('img').alt;
    box.classList.toggle('single', plates.length < 2);
  }
  function open(plate) {
    plates = Array.prototype.slice.call(document.querySelectorAll('.plate:not([hidden])'));
    opener = plate;
    show(plates.indexOf(plate));
    box.setAttribute('open', '');
    box.querySelector('.lightbox-close').focus();
  }
  function close() {
    box.removeAttribute('open');
    img.src = '';
    if (opener) opener.focus();
  }

  document.addEventListener('click', function (e) {
    const plate = e.target.closest('.plate');
    if (plate) { e.preventDefault(); open(plate); return; }
    if (!box.hasAttribute('open')) return;
    if (e.target.closest('.lightbox-prev')) show(index - 1);
    else if (e.target.closest('.lightbox-next')) show(index + 1);
    else if (e.target === box || e.target.closest('.lightbox-close')) close();
  });

  document.addEventListener('keydown', function (e) {
    if (!box.hasAttribute('open')) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowLeft') show(index - 1);
    else if (e.key === 'ArrowRight') show(index + 1);
  });

  // swipe on touch devices
  let startX = null;
  box.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; }, { passive: true });
  box.addEventListener('touchend', function (e) {
    if (startX === null) return;
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 40) show(dx < 0 ? index + 1 : index - 1);
    startX = null;
  });
});
