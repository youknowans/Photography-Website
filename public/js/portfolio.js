// Builds the portfolio grid from PHOTOS using DOM calls (no innerHTML), and
// only accepts plain filenames so a typo can never point outside /images.
(function () {
  var grid = document.getElementById('plate-grid');
  if (!grid || typeof PHOTOS === 'undefined') return;
  var SAFE = /^[A-Za-z0-9._-]+\.webp$/;

  PHOTOS.forEach(function (p) {
    if (!SAFE.test(p.file)) return;
    var a = document.createElement('a');
    a.className = 'plate';
    a.href = '/images/large/' + p.file;
    a.setAttribute('data-large', '/images/large/' + p.file);
    a.setAttribute('data-tags', String(p.category || ''));
    a.setAttribute('data-caption', String(p.alt || ''));   // shown in the lightbox
    a.setAttribute('data-place', String(p.place || ''));
    a.setAttribute('data-settings', String(p.settings || ''));

    var img = document.createElement('img');
    img.src = '/images/thumb/' + p.file;
    img.alt = p.alt || p.place || '';
    img.loading = 'lazy';
    img.decoding = 'async';

    // Tell the layout the photo's shape (width / height) so its tile is the
    // right size before the image arrives. Older photos.js files have no w/h,
    // so fall back to measuring the image once it has loaded.
    if (p.w > 0 && p.h > 0) {
      img.width = p.w;
      img.height = p.h;
      a.style.setProperty('--r', (p.w / p.h).toFixed(4));
    } else {
      img.addEventListener('load', function () {
        if (img.naturalWidth && img.naturalHeight) {
          a.style.setProperty('--r', (img.naturalWidth / img.naturalHeight).toFixed(4));
        }
      });
    }
    a.appendChild(img);
    grid.appendChild(a);
  });
})();
