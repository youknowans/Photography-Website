// Tab filtering for Portfolio categories and Journal tags.
//   <div data-filter-group data-filter-target="[data-tags]"> <button data-filter="travel">...
// Items carry data-tags="travel lifestyle". Tabs with nothing in them are hidden
// (and the whole bar stays hidden until at least two categories are in use).
// The grid fades out, swaps, and fades back in (instant under reduced motion).
document.addEventListener('DOMContentLoaded', function () {
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.querySelectorAll('[data-filter-group]').forEach(function (group) {
    var items = document.querySelectorAll(group.getAttribute('data-filter-target'));
    var grid = items.length ? items[0].parentElement : null;

    function tagsOf(item) { return (item.getAttribute('data-tags') || '').split(/\s+/); }

    // Add a tab for every tag in use that has no button yet, A to Z after the
    // hand-written ones. 'street-photography' is shown as 'Street photography'.
    var have = {};
    group.querySelectorAll('button[data-filter]').forEach(function (b) { have[b.getAttribute('data-filter')] = true; });
    var found = [];
    items.forEach(function (i) {
      tagsOf(i).forEach(function (t) {
        if (/^[a-z0-9-]+$/.test(t) && !have[t]) { have[t] = true; found.push(t); }
      });
    });
    found.sort().forEach(function (t) {
      var b = document.createElement('button');
      b.setAttribute('data-filter', t);
      b.setAttribute('aria-pressed', 'false');
      var label = t.replace(/-/g, ' ');
      b.textContent = label.charAt(0).toUpperCase() + label.slice(1);
      group.appendChild(b);
    });
    var buttons = group.querySelectorAll('button[data-filter]');

    // hide tabs that would be empty
    var visibleTabs = 0;
    buttons.forEach(function (btn) {
      var v = btn.getAttribute('data-filter');
      if (v === 'all') return;
      var count = Array.prototype.filter.call(items, function (i) { return tagsOf(i).indexOf(v) !== -1; }).length;
      btn.hidden = count === 0;
      if (count) visibleTabs++;
    });
    if (visibleTabs < 2) {   // one category would just duplicate "All"
      var bar = group.closest('.subheader');
      if (bar) bar.hidden = true;
      return;
    }

    function applyFilter(value) {
      items.forEach(function (item) {
        item.hidden = !(value === 'all' || tagsOf(item).indexOf(value) !== -1);
      });
    }

    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (btn.getAttribute('aria-pressed') === 'true') return;
        buttons.forEach(function (b) { b.setAttribute('aria-pressed', 'false'); });
        btn.setAttribute('aria-pressed', 'true');
        var value = btn.getAttribute('data-filter');

        if (!grid || reduced) { applyFilter(value); return; }
        grid.classList.add('is-filtering');
        setTimeout(function () {
          applyFilter(value);
          requestAnimationFrame(function () { grid.classList.remove('is-filtering'); });
        }, 220);
      });
    });
  });
});
