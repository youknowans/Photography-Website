// Tab filtering for Portfolio categories and Journal tags.
//   <div data-filter-group data-filter-target="[data-tags]"> <button data-filter="travel">...
// Items carry data-tags="travel lifestyle". Tabs with nothing in them are hidden
// (and the whole bar stays hidden until at least two categories are in use).
// The grid fades out, swaps, and fades back in (instant under reduced motion).
document.addEventListener('DOMContentLoaded', function () {
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.querySelectorAll('[data-filter-group]').forEach(function (group) {
    var items = document.querySelectorAll(group.getAttribute('data-filter-target'));
    var buttons = group.querySelectorAll('button[data-filter]');
    var grid = items.length ? items[0].parentElement : null;

    function tagsOf(item) { return (item.getAttribute('data-tags') || '').split(/\s+/); }

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
