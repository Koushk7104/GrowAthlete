(function () {
  var GA = window.GA, $ = GA.$, $$ = GA.$$;
  var chk = '<svg aria-hidden="true"><use href="#i-check"/></svg>';

  /* Roles */
  var R = [
    { k: 'Athletes', h: 'Get seen for what you have done', l: 'Build a professional sports identity that travels further than your district.', pts: ['Create a verified digital sports profile', 'Showcase achievements, statistics and highlights', 'Gain visibility among scouts, academies and sponsors', 'Build personal sports branding and career opportunities'], d: 'Example athlete dashboard', m: [['Profile views this month', 72, '128'], ['Verified achievements', 75, '3 of 4'], ['Academy shortlists', 40, '2']] },
    { k: 'Coaches and academies', h: 'Recruit with structure', l: 'Find and follow talent using profiles that all say the same things in the same way.', pts: ['Discover talented athletes using structured profiles', 'Track athlete performance and progress', 'Recruit players efficiently'], d: 'Example academy roster', m: [['Athletes followed', 60, '24'], ['Improving this season', 80, '17'], ['Trial invites sent', 35, '6']] },
    { k: 'Sponsors and brands', h: 'Back talent early', l: 'Find emerging athletes before they are famous, with the data to back the decision.', pts: ['Identify emerging sports talent for endorsements', 'Collaborate based on performance and audience reach', 'Work with athletes whose results are verified'], d: 'Example sponsor matches', m: [['Match: Kabaddi, Tier-3', 88, '88%'], ['Match: Athletics, U-20', 74, '74%'], ['Match: Football, U-19', 61, '61%']] },
    { k: 'Scouts and organisations', h: 'Scout by data, across regions', l: 'One searchable database in place of scattered local trials and word of mouth.', pts: ['Access a centralised database of athletes', 'Conduct data-driven talent scouting across regions and sports', 'Compare athletes on consistent, verified metrics'], d: 'Example regional scan', m: [['Regions covered', 70, '12'], ['Sports in scope', 55, '6'], ['Verified profiles matched', 82, '41']] }
  ];
  $('#tabs').innerHTML = R.map(function (r, i) { return '<button class="chip" role="tab" id="t' + i + '" aria-controls="p' + i + '" aria-selected="' + (i === 0) + '" tabindex="' + (i ? -1 : 0) + '" type="button">' + r.k + '</button>'; }).join('');
  $('#panels').innerHTML = R.map(function (r, i) {
    return '<div class="panel" role="tabpanel" id="p' + i + '" aria-labelledby="t' + i + '"' + (i ? ' hidden' : '') + '><div class="card big"><h2 style="font-size:clamp(1.7rem,3vw,2.3rem)">' + r.h + '</h2><p class="lede" style="font-size:1.05rem">' + r.l + '</p><ul class="ticks">' + r.pts.map(function (p) { return '<li>' + chk + '<span>' + p + '</span></li>'; }).join('') + '</ul></div>' +
      '<div class="card dash"><h4><span>' + r.d + '</span><span>Illustrative</span></h4>' + r.m.map(function (m) { return '<div class="bar"><span>' + m[0] + ': <b style="color:var(--ink)">' + m[2] + '</b></span><i><b data-w="' + m[1] + '"></b></i></div>'; }).join('') + '</div></div>';
  }).join('');
  function fill(p) { $$('[data-w]', p).forEach(function (b) { b.style.width = '0'; }); requestAnimationFrame(function () { setTimeout(function () { $$('[data-w]', p).forEach(function (b) { b.style.width = b.dataset.w + '%'; }); }, 80); }); }
  var tabs = $$('#tabs .chip');
  function pick(i) { tabs.forEach(function (t, j) { t.setAttribute('aria-selected', i === j); t.tabIndex = i === j ? 0 : -1; $('#p' + j).hidden = i !== j; }); fill($('#p' + i)); }
  tabs.forEach(function (t, i) { t.addEventListener('click', function () { pick(i); }); t.addEventListener('keydown', function (e) { var n = e.key === 'ArrowRight' ? (i + 1) % tabs.length : e.key === 'ArrowLeft' ? (i + tabs.length - 1) % tabs.length : -1; if (n > -1) { e.preventDefault(); pick(n); tabs[n].focus(); } }); });
  fill($('#p0'));

  /* Flywheel */
  var W = [
    ['Athletes', 'Athletes join and build profiles', 'Every athlete, from grassroots to national level, starts with a profile of their results, stats and highlights.'],
    ['Verify', 'Achievements get verified', 'Results are confirmed so that a claim on a profile can be trusted by someone who has never met the athlete.'],
    ['Discover', 'Scouts and academies discover talent', 'Structured, searchable profiles let coaches, academies and scouts find sport-specific athletes across regions.'],
    ['Opportunity', 'Opportunities reach the right athletes', 'Trials, scholarships, academy seats and sponsorships are matched to the athletes who fit them.'],
    ['Stories', 'Success stories attract more athletes', 'Visible pathways show athletes in small towns that a profile leads somewhere, which brings the next wave in.']
  ];
  var nodes = $('#nodes'), svgNS = 'http://www.w3.org/2000/svg', cx = 230, cy = 230, r = 150, idx = 0;
  W.forEach(function (w, i) {
    var a = -Math.PI / 2 + i * 2 * Math.PI / W.length, x = cx + r * Math.cos(a), y = cy + r * Math.sin(a);
    var g = document.createElementNS(svgNS, 'g'); g.setAttribute('class', 'node'); g.setAttribute('tabindex', '0'); g.setAttribute('role', 'button'); g.setAttribute('aria-label', w[1]);
    g.innerHTML = '<circle cx="' + x + '" cy="' + y + '" r="36"/><text x="' + x + '" y="' + (y + 4) + '">' + w[0] + '</text>';
    g.addEventListener('click', function () { show(i); }); g.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); show(i); } });
    nodes.appendChild(g);
  });
  var gs = $$('.node', nodes);
  function show(i) {
    idx = i; gs.forEach(function (g, j) { g.classList.toggle('on', i === j); });
    $('#fly-info').innerHTML = '<h4><span>Stage ' + (i + 1) + ' of 5</span></h4><h3 style="font-size:1.5rem">' + W[i][1] + '</h3><p style="color:var(--ink-soft)">' + W[i][2] + '</p><div class="prog">' + W.map(function (_, j) { return '<i class="' + (j <= i ? 'on' : '') + '"></i>'; }).join('') + '</div>';
  }
  show(0);
  if (!GA.reduce) setInterval(function () { if (!document.hidden && !$('#fly-info').matches(':hover')) show((idx + 1) % W.length); }, 4200);

  /* Career ladder */
  var L = [
    { n: 'School and club', pain: 'Results live on paper and in group chats. Only your own coach knows how good you are.', gain: 'Start a profile early. Log every meet and season so a record exists before anyone asks for one.' },
    { n: 'District', pain: 'Selection depends on who attends the trial and who knows them.', gain: 'Verified district results and coach confirmation travel with you, so selectors can check without a phone call.' },
    { n: 'State', pain: 'Talent from small towns competes for the same few spots with no visibility to state-level scouts.', gain: 'Search and filters surface athletes by sport, region and progress, not by connections.' },
    { n: 'National', pain: 'Academies and federations compare athletes using inconsistent paperwork.', gain: 'Consistent metrics and multi-season trends make shortlisting faster and fairer.' },
    { n: 'Professional', pain: 'One injury or one bad season and a career is forgotten. Brands cannot verify reach or results.', gain: 'The full career, including recovery and consistency, plus sponsorship matching based on verified data.' }
  ];
  var cur = 0, timer = null;
  $('#steps').innerHTML = L.map(function (s, i) { return '<button class="step" role="tab" type="button" data-i="' + i + '" aria-selected="' + (i === 0) + '"><i>' + (i + 1) + '</i>' + s.n + '</button>'; }).join('');
  function go() {
    var s = L[cur];
    $$('#steps .step').forEach(function (b, i) { b.setAttribute('aria-selected', i === cur); });
    $('#lpanel').innerHTML = '<div class="prog" aria-hidden="true">' + L.map(function (_, i) { return '<i class="' + (i <= cur ? 'on' : '') + '"></i>'; }).join('') + '</div><h3>' + s.n + ' level</h3>' +
      '<div class="two"><div class="pain"><h4>The gap</h4><p>' + s.pain + '</p></div><div class="gain"><h4>With GrowAthlete</h4><p>' + s.gain + '</p></div></div>';
  }
  function stop() { clearInterval(timer); timer = null; $('#play').textContent = '▶ Play the journey'; }
  $('#steps').addEventListener('click', function (e) { var b = e.target.closest('.step'); if (b) { stop(); cur = +b.dataset.i; go(); } });
  $('#steps').addEventListener('keydown', function (e) { if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); stop(); cur = (cur + (e.key === 'ArrowDown' ? 1 : L.length - 1)) % L.length; go(); $$('#steps .step')[cur].focus(); } });
  $('#play').addEventListener('click', function () {
    if (timer) { stop(); return; }
    cur = 0; go(); this.textContent = '❚❚ Pause';
    timer = setInterval(function () { if (cur < L.length - 1) { cur++; go(); } else { stop(); GA.toast('From school to professional, on one profile'); } }, 2200);
  });
  go();
})();
