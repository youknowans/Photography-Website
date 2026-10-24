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

    var img = document.createElement('img');
    img.src = '/images/thumb/' + p.file;
    img.alt = p.alt || p.place || '';
    img.loading = 'lazy';
    img.decoding = 'async';
    a.appendChild(img);
    grid.appendChild(a);
  });
})();
