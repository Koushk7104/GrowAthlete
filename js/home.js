(function () {
  var GA = window.GA, $ = GA.$, A = window.GA_ATHLETES, esc = GA.esc;
  var enc = encodeURIComponent;

  /* Hero search sends people to the scout view with the query filled in */
  $('#search').addEventListener('submit', function (e) {
    e.preventDefault();
    var q = $('#q').value.trim();
    location.href = 'scout.html' + (q ? '?q=' + enc(q) : '');
  });
  $('#quick').innerHTML = ['Football', 'Athletics', 'Badminton', 'Kabaddi', 'Volleyball', 'Basketball'].map(function (s) {
    return '<a class="chip" href="scout.html?sport=' + enc(s) + '">' + s + '</a>';
  }).join('');

  /* Product window rows: the five most improved sample athletes */
  var ranked = A.slice().sort(function (p, r) {
    var ip = Math.abs(p.tr[p.tr.length - 1] - p.tr[0]) / p.tr[0], ir = Math.abs(r.tr[r.tr.length - 1] - r.tr[0]) / r.tr[0];
    return ir - ip;
  }).slice(0, 5);
  $('#winrows').innerHTML = ranked.map(function (x) {
    var v = x.ach.filter(function (k) { return k[1]; }).length;
    return '<a class="trow" href="scout.html?q=' + enc(x.n) + '" style="text-decoration:none"><span class="who"><span class="av">' + GA.initials(x.n) + '</span><span>' + esc(x.n) + '</span></span>' +
      '<span class="mut hide-s">' + x.s + ' · ' + x.c + '</span><span class="mut hide-s">' + esc(x.stat) + '</span><span class="pill good">' + GA.tick + v + ' verified</span></a>';
  }).join('');

  /* Athlete cards: athletes mixed with a few editorial tiles */
  function pin(x, i, n) {
    return '<a class="pin" href="scout.html?q=' + enc(x.n) + '" style="--i:' + n + '">' + GA.cover(x, i) +
      '<div class="pin-body"><div><div class="nm">' + esc(x.n) + '</div><p class="pin-meta">' + x.s + ' · ' + x.a + ' · ' + x.c + '</p></div>' +
      '<span class="pill good">' + GA.tick + x.ach.filter(function (k) { return k[1]; }).length + ' verified</span></div></a>';
  }
  function tile(c, h, big, link, href, n) {
    return '<a class="pin text" href="' + href + '" style="--i:' + n + '"><div class="pin-cover" style="--c:var(' + c + ');--h:' + h + 'px"><div class="big">' + big + '</div><span class="link">' + link + ' <i>→</i></span></div></a>';
  }
  var parts = [], n = 0;
  A.forEach(function (x, i) {
    parts.push(pin(x, i, n++));
    if (i === 1) parts.push(tile('--p3', 210, '30M+ athletes have no verified profile', 'See the gap', 'problem.html', n++));
    if (i === 5) parts.push(tile('--p2', 180, 'Search by sport, region and progress', 'Try the scout view', 'scout.html', n++));
    if (i === 8) parts.push(tile('--p5', 200, 'Build your sports resume in a minute', 'Open the builder', 'product.html', n++));
  });
  $('#wall').innerHTML = parts.join('');

  /* Roles masonry */
  var roles = [
    ['Athletes', '--p1', 230, ['Create a verified digital sports profile', 'Showcase achievements, stats and highlights', 'Gain visibility among scouts and sponsors']],
    ['Coaches and academies', '--p4', 190, ['Discover talent through structured profiles', 'Track performance and progress', 'Recruit players efficiently']],
    ['Sponsors and brands', '--p3', 250, ['Identify emerging talent for endorsements', 'Collaborate based on performance and reach']],
    ['Scouts and organisations', '--p2', 200, ['Access a centralised athlete database', 'Scout across regions and sports with data']],
    ['The sports community', '--p5', 220, ['Follow athlete journeys and opportunities', 'Build a connected ecosystem beyond cricket']]
  ];
  $('#roles').innerHTML = roles.map(function (r, i) {
    return '<a class="pin text reveal" href="ecosystem.html" style="--i:' + i + '"><div class="pin-cover" style="--c:var(' + r[1] + ');--h:' + r[2] + 'px;gap:1rem"><div class="big" style="max-width:none">' + r[0] + '</div>' +
      '<ul style="margin:0;padding-left:1.1rem;font-size:.95rem;display:grid;gap:.3rem;font-weight:500">' + r[3].map(function (t) { return '<li>' + t + '</li>'; }).join('') + '</ul><span class="link">Learn more <i>→</i></span></div></a>';
  }).join('');

  GA.marquee($('#marq'));

  /* Sports grid */
  $('#sportgrid').innerHTML = window.GA_SPORTS.map(function (s, i) {
    return '<a href="scout.html?sport=' + enc(s) + '" style="--c:var(--p' + (i % 6 + 1) + ')">' + s + '</a>';
  }).join('');

  /* FAQ */
  var Q = [
    ['What is GrowAthlete?', 'A sports technology platform that creates verified digital profiles for athletes, so they can show their skills, achievements, performance data and career journey in one place, and be found by coaches, academies, scouts, sponsors and sports organisations.'],
    ['Is it only for cricket?', 'No. GrowAthlete supports 20+ sports, including football, athletics, badminton, volleyball, kabaddi and basketball, from grassroots to national level.'],
    ['Who is it for?', 'Athletes, coaches and academies, sponsors and brands, scouts and sports organisations, and the wider sports community.'],
    ['Does it work outside big cities?', 'That is the point. Most real talent comes from tier-2, tier-3 and rural India, and a profile gives those athletes the same visibility as anyone else.'],
    ['How are achievements verified?', 'Entries on a profile are confirmed so scouts and sponsors can rely on them. The verification in this demo site is simulated.'],
    ['Can sponsors and brands use it?', 'Yes. Sponsors can identify emerging talent for endorsements and collaborate based on verified performance and audience reach.'],
    ['What can coaches and academies do?', 'Discover athletes through structured profiles, track performance and progress over seasons, and recruit players more efficiently.'],
    ['Does it track more than medals?', 'Yes. Profiles are built to hold progress over years, including performance trends, injuries and recovery, so one bad season does not erase a career.'],
    ['Will career guidance be available?', 'A career guidance and mentorship layer is planned for a later stage, after identity, discovery and opportunity matching.'],
    ['How do I get access?', 'Join the waitlist and tell us your role and sport. We will invite you as profiles open for your sport and region.']
  ];
  $('#faq').innerHTML = Q.map(function (q, i) {
    return '<div class="acc-i card" data-open="false"><button class="acc-b" type="button" aria-expanded="false">' + q[0] + '<span class="pm" aria-hidden="true">+</span></button><div class="acc-p"><div><p class="faq-a">' + q[1] + '</p></div></div></div>';
  }).join('');
  GA.accordion($('#faq'));

  /* Showcase tabs and sparklines */
  GA.$$('[data-spark]').forEach(function (el) {
    el.innerHTML = GA.spark(el.dataset.spark.split(',').map(Number), el.dataset.better, +el.dataset.w, +el.dataset.h);
  });
  var tabs = GA.$$('#stabs .chip');
  function pick(i) {
    tabs.forEach(function (t, j) { t.setAttribute('aria-selected', i === j); t.tabIndex = i === j ? 0 : -1; document.getElementById('sp' + j).hidden = i !== j; });
  }
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { pick(i); });
    t.addEventListener('keydown', function (e) {
      var n = e.key === 'ArrowRight' ? (i + 1) % tabs.length : e.key === 'ArrowLeft' ? (i + tabs.length - 1) % tabs.length : -1;
      if (n > -1) { e.preventDefault(); pick(n); tabs[n].focus(); }
    });
  });
})();
