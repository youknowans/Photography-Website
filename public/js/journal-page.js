// Builds the Journal grid from ENTRIES with DOM calls (no innerHTML).
(function () {
  var grid = document.getElementById('journal-grid');
  if (!grid || typeof ENTRIES === 'undefined') return;

  if (!ENTRIES.length) {
    var empty = document.createElement('p');
    empty.className = 'empty-state';
    empty.textContent = 'The first journal entries are on their way.';
    grid.replaceWith(empty);
    return;
  }

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text) n.textContent = text;
    return n;
  }

  ENTRIES.forEach(function (e) {
    if (typeof e.href !== 'string' || e.href.indexOf('/posts/') !== 0) return;
    var a = el('a', 'entry-card');
    a.href = e.href;
    a.setAttribute('data-tags', String(e.tag || ''));

    if (e.src && /^[A-Za-z0-9._-]+\.webp$/.test(e.src)) {
      var frame = el('div', 'frame');
      var img = document.createElement('img');
      img.src = '/images/thumb/' + e.src;
      img.alt = '';
      img.loading = 'lazy';
      frame.appendChild(img);
      a.appendChild(frame);
    }
    var tag = String(e.tag || '');
    a.appendChild(el('span', 'entry-tag', tag.charAt(0).toUpperCase() + tag.slice(1)));
    a.appendChild(el('h3', '', e.title));
    if (e.teaser) a.appendChild(el('p', '', e.teaser));
    grid.appendChild(a);
  });
})();
