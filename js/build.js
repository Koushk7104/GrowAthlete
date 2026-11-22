(function () {
  var GA = window.GA, $ = GA.$, esc = GA.esc;
  var P = [
    { name: 'Priya Verma', sport: 'Athletics', city: 'Nashik', age: 19, ach: ['Gold, 400m, State School Games', 'Finalist, Inter-University Meet'] },
    { name: 'Arjun Rawat', sport: 'Football', city: 'Dehradun', age: 17, ach: ['Top scorer, State U-17 League', 'Subroto Cup quarter-finalist'] },
    { name: 'Rohit Yadav', sport: 'Kabaddi', city: 'Rohtak', age: 20, ach: ['Best Raider, Inter-College Kabaddi', 'State team, 2 seasons'] },
    { name: 'Meera Nair', sport: 'Badminton', city: 'Kochi', age: 18, ach: ['Silver, State U-19 Singles', 'Junior Nationals quarter-finalist'] }
  ];
  var B = { name: '', sport: '', city: '', age: 19, ach: [] }, celebrated = false;

  function load(p, firstVerified) {
    B.name = p.name; B.sport = p.sport; B.city = p.city; B.age = p.age;
    B.ach = p.ach.map(function (t, i) { return { t: t, s: i === 0 && firstVerified ? 'ok' : 'no' }; });
    $('#b-name').value = B.name; $('#b-sport').value = B.sport; $('#b-city').value = B.city; $('#b-age').value = B.age; $('#b-age-o').textContent = B.age;
    celebrated = false; render();
  }
  function render() {
    $('#p-av').textContent = GA.initials(B.name);
    $('#p-name').textContent = B.name.trim() || 'Your name';
    $('#p-meta').textContent = B.sport + ' · ' + B.age + ' · ' + (B.city.trim() || 'Your city');
    var ver = B.ach.filter(function (a) { return a.s === 'ok'; }).length;
    var badge = $('#p-badge'); badge.textContent = ver ? 'Verified' : 'Unverified'; badge.className = 'pill' + (ver ? ' good' : '');
    $('#p-list').innerHTML = B.ach.length ? B.ach.map(function (a, i) {
      var st = a.s === 'ok' ? '<span class="pill good">' + GA.tick + 'Verified</span>' : a.s === 'wait' ? '<span class="pill warn"><span class="spin"></span>Checking</span>' : '<button class="btn btn-line btn-sm" data-v="' + i + '" type="button">Request verification</button>';
      return '<li><span class="t">' + esc(a.t) + '</span>' + st + '<button class="icon-btn" style="width:2rem;height:2rem" data-x="' + i + '" type="button" aria-label="Remove achievement">×</button></li>';
    }).join('') : '<li><span class="t" style="color:var(--ink-soft)">No achievements yet. Add your first one on the left.</span></li>';
    var score = (B.name.trim() ? 15 : 0) + 10 + (B.city.trim() ? 10 : 0) + 5 + Math.min(B.ach.length, 3) * 10 + Math.min(ver, 3) * 10;
    $('#p-score').textContent = score + '%'; $('#p-bar').style.width = score + '%'; $('#p-meter').setAttribute('aria-valuenow', score);
    $('#p-hint').textContent = score >= 100 ? 'Maximum strength. You are fully discoverable.' : score >= 80 ? 'Strong. Scouts searching ' + B.sport + ' can shortlist you.' : score >= 55 ? 'Getting there. Verify your achievements to rank higher in search.' : 'Add more detail and achievements so scouts can find you.';
    if (score >= 100 && !celebrated) { celebrated = true; var r = $('#pc').getBoundingClientRect(); GA.confetti(r.left + r.width / 2, r.top + 80); }
  }

  $('#b-name').addEventListener('input', function (e) { B.name = e.target.value; render(); });
  $('#b-city').addEventListener('input', function (e) { B.city = e.target.value; render(); });
  $('#b-sport').addEventListener('change', function (e) { B.sport = e.target.value; render(); });
  $('#b-age').addEventListener('input', function (e) { B.age = +e.target.value; $('#b-age-o').textContent = e.target.value; render(); });
  function add() { var i = $('#b-ach'), v = i.value.trim(); if (!v) { i.focus(); return; } if (B.ach.length >= 6) { GA.toast('Demo limit: 6 achievements'); return; } B.ach.push({ t: v, s: 'no' }); i.value = ''; render(); }
  $('#b-add').addEventListener('click', add);
  $('#b-ach').addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); add(); } });
  $('#p-list').addEventListener('click', function (e) {
    var v = e.target.closest('[data-v]'), x = e.target.closest('[data-x]');
    if (v) { var a = B.ach[+v.dataset.v]; a.s = 'wait'; render(); setTimeout(function () { a.s = 'ok'; render(); GA.toast('Verified: ' + a.t); }, GA.reduce ? 200 : 1100); }
    if (x) { B.ach.splice(+x.dataset.x, 1); render(); }
  });
  $('#presets').addEventListener('click', function (e) {
    var b = e.target.closest('[data-p]'); if (!b) return;
    GA.$$('#presets .chip').forEach(function (c) { c.setAttribute('aria-pressed', c === b); });
    load(P[+b.dataset.p], true);
  });
  $('#p-copy').addEventListener('click', function () {
    var link = 'growathlete.example/' + (B.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'your-name');
    var done = function () { GA.toast('Demo link copied: ' + link); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(link).then(done, done); else done();
  });
  GA.tilt($('#pc'), $('#pc'), 4);
  var first = $('#presets .chip'); first.setAttribute('aria-pressed', 'true');
  load(P[0], true);
})();
