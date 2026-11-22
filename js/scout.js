(function () {
  var GA = window.GA, $ = GA.$, A = window.GA_ATHLETES, esc = GA.esc, ini = GA.initials;
  A.forEach(function (x) { x.ver = x.ach.filter(function (k) { return k[1]; }).length; x.imp = Math.abs(x.tr[x.tr.length - 1] - x.tr[0]) / x.tr[0]; });
  var tierName = { 1: 'Tier-1', 2: 'Tier-2', 3: 'Tier-3' };
  var F = { sport: 'All', tier: 0, age: 25, sort: 'imp', q: '' }, short = {}, cmp = [];
  var sports = ['All'].concat(Array.from(new Set(A.map(function (x) { return x.s; }))));
  $('#f-sport').innerHTML = sports.map(function (s) { return '<button class="chip" type="button" aria-pressed="' + (s === 'All') + '">' + s + '</button>'; }).join('');

  /* Pre-fill from links like scout.html?q=nashik or ?sport=Kabaddi */
  try {
    var qs = new URLSearchParams(location.search);
    if (qs.get('q')) { F.q = qs.get('q'); $('#f-q').value = F.q; }
    if (qs.get('sport') && sports.indexOf(qs.get('sport')) > -1) {
      F.sport = qs.get('sport');
      GA.$$('#f-sport .chip').forEach(function (c) { c.setAttribute('aria-pressed', c.textContent === F.sport); });
    }
  } catch (e) {}

  function render() {
    var q = F.q.trim().toLowerCase();
    var list = A.filter(function (x) {
      return (F.sport === 'All' || x.s === F.sport) && (!F.tier || x.t === F.tier) && x.a <= F.age &&
        (!q || (x.n + ' ' + x.c + ' ' + x.st).toLowerCase().indexOf(q) > -1);
    });
    list.sort(function (p, r) { return F.sort === 'imp' ? r.imp - p.imp : F.sort === 'ver' ? r.ver - p.ver : p.a - r.a; });
    $('#f-count').textContent = 'Showing ' + list.length + ' of ' + A.length + ' sample athletes';
    $('#grid').innerHTML = list.length ? list.map(function (x, n) {
      var i = A.indexOf(x), inC = cmp.indexOf(i) > -1;
      return '<article class="pin" style="--i:' + n + '">' + GA.cover(x, i) + '<div class="pin-body"><div><div class="nm">' + x.n + '</div><p class="pin-meta">' + x.s + ' · ' + x.a + ' · ' + x.c + '</p></div>' +
        GA.spark(x.tr, x.b, 220, 48) +
        '<div class="row-f"><span class="pill ' + (x.ver ? 'good' : '') + '">' + x.ver + ' of ' + x.ach.length + ' verified</span><span class="pill">' + tierName[x.t] + '</span></div>' +
        '<div class="row-f"><button class="btn btn-line btn-sm" data-open="' + i + '" type="button">View</button>' +
        '<button class="star" data-c="' + i + '" aria-pressed="' + inC + '" type="button">' + (inC ? 'Comparing' : 'Compare') + '</button>' +
        '<button class="star" data-s="' + i + '" aria-pressed="' + !!short[i] + '" type="button">' + (short[i] ? 'Saved' : 'Save') + '</button></div></div></article>';
    }).join('') : '<div class="empty" style="column-span:all"><h3>No athletes match these filters</h3><p style="margin-top:.5rem">Clear the search, raise the age limit, or set the city tier to All.</p></div>';
    var ids = Object.keys(short).filter(function (k) { return short[k]; });
    var tray = $('#tray'); tray.hidden = !ids.length && cmp.length < 2;
    tray.innerHTML = (ids.length ? '<b>Shortlist (' + ids.length + ')</b>' + ids.map(function (k) { return '<button class="chip" data-s="' + k + '" type="button" aria-label="Remove ' + A[k].n + '">' + esc(A[k].n) + ' ×</button>'; }).join('') : '') +
      (cmp.length === 2 ? '<button class="btn btn-primary btn-sm" data-cmp type="button" style="margin-left:auto">Compare ' + esc(A[cmp[0]].n.split(' ')[0]) + ' and ' + esc(A[cmp[1]].n.split(' ')[0]) + '</button>' : '');
  }

  $('#f-sport').addEventListener('click', function (e) { var b = e.target.closest('.chip'); if (!b) return; F.sport = b.textContent; GA.$$('#f-sport .chip').forEach(function (c) { c.setAttribute('aria-pressed', c === b); }); render(); });
  $('#f-q').addEventListener('input', function (e) { F.q = e.target.value; render(); });
  $('#f-tier').addEventListener('change', function (e) { F.tier = +e.target.value; render(); });
  $('#f-age').addEventListener('input', function (e) { F.age = +e.target.value; $('#f-age-o').textContent = e.target.value; render(); });
  $('#f-sort').addEventListener('change', function (e) { F.sort = e.target.value; render(); });

  var dlg = $('#dlg');
  function shortlist(i) { short[i] = !short[i]; GA.toast(short[i] ? A[i].n + ' added to shortlist' : A[i].n + ' removed'); render(); if (dlg.open && dlg.dataset.k === 'p') openProfile(i); }
  function openProfile(i) {
    var x = A[i]; dlg.dataset.k = 'p';
    $('#dlg-body').innerHTML = '<div class="dlg-top"><div class="pc-head"><div class="av">' + ini(x.n) + '</div><div><div class="pc-name">' + x.n + (x.ver ? ' <span class="pill good">Verified</span>' : '') + '</div><p class="pc-meta">' + x.s + ' · ' + x.a + ' · ' + x.c + ', ' + x.st + '</p></div></div><button class="icon-btn" data-close type="button" aria-label="Close">×</button></div>' +
      '<div class="kv"><div><strong style="font-size:.95rem">' + x.stat + '</strong><span>Headline stat</span></div><div><strong>' + x.tr.length + '</strong><span>Seasons logged</span></div><div><strong>' + tierName[x.t] + '</strong><span>City tier</span></div></div>' +
      '<h4>Progress over seasons</h4>' + GA.spark(x.tr, x.b, 480, 100) +
      '<h4>Achievements</h4><ul class="alist">' + x.ach.map(function (k) { return '<li><span class="t">' + k[0] + '</span><span class="pill ' + (k[1] ? 'good' : 'warn') + '">' + (k[1] ? GA.tick + 'Verified' : 'Pending') + '</span></li>'; }).join('') + '</ul>' +
      '<div class="dlg-actions"><button class="btn btn-primary" data-s="' + i + '" type="button">' + (short[i] ? 'Remove from shortlist' : 'Shortlist') + '</button><button class="btn btn-line" data-contact="' + i + '" type="button">Request contact</button></div>';
    if (!dlg.open) dlg.showModal();
  }
  function openCompare() {
    var a = A[cmp[0]], b = A[cmp[1]]; dlg.dataset.k = 'c';
    function bar(label, va, vb, fmt, i) { var m = Math.max(va, vb) || 1, w = (i ? vb : va) / m * 100, win = (i ? vb : va) >= (i ? va : vb); return '<div class="bar' + (win ? ' win' : '') + '"><span>' + label + ': <b style="color:var(--ink)">' + fmt(i ? vb : va) + '</b></span><i><b data-w="' + w.toFixed(0) + '"></b></i></div>'; }
    function col(x, i) { return '<div><div class="pc-name">' + x.n + '</div><p class="pc-meta">' + x.s + ' · ' + x.c + '</p><div class="st" style="font:700 .95rem var(--font)">' + x.stat + '</div>' + GA.spark(x.tr, x.b, 220, 56) +
      bar('Improvement', a.imp, b.imp, function (v) { return '+' + (v * 100).toFixed(0) + '%'; }, i) + bar('Verified achievements', a.ver, b.ver, function (v) { return v; }, i) + bar('Seasons logged', a.tr.length, b.tr.length, function (v) { return v; }, i) + '<span class="pill">Age ' + x.a + ' · ' + tierName[x.t] + '</span></div>'; }
    $('#dlg-body').innerHTML = '<div class="dlg-top"><h3>Side by side</h3><button class="icon-btn" data-close type="button" aria-label="Close">×</button></div><div class="cmp">' + col(a, 0) + col(b, 1) + '</div>';
    if (!dlg.open) dlg.showModal();
    requestAnimationFrame(function () { setTimeout(function () { GA.$$('#dlg-body [data-w]').forEach(function (el) { el.style.width = el.dataset.w + '%'; }); }, 60); });
  }
  function toggleCmp(i) {
    var k = cmp.indexOf(i);
    if (k > -1) cmp.splice(k, 1); else { if (cmp.length === 2) cmp.shift(); cmp.push(i); }
    render();
  }
  $('#grid').addEventListener('click', function (e) {
    var o = e.target.closest('[data-open]'), s = e.target.closest('[data-s]'), c = e.target.closest('[data-c]');
    if (s) shortlist(+s.dataset.s); else if (c) toggleCmp(+c.dataset.c); else if (o) openProfile(+o.dataset.open);
  });
  $('#tray').addEventListener('click', function (e) { var s = e.target.closest('[data-s]'); if (s) shortlist(+s.dataset.s); if (e.target.closest('[data-cmp]')) openCompare(); });
  dlg.addEventListener('click', function (e) {
    if (e.target === dlg || e.target.closest('[data-close]')) dlg.close();
    var s = e.target.closest('[data-s]'), c = e.target.closest('[data-contact]');
    if (s) shortlist(+s.dataset.s);
    if (c) GA.toast('Demo only: contact request for ' + A[+c.dataset.contact].n);
  });
  render();
})();
