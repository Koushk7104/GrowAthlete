/* Shared behaviour: header/footer, page transitions, reveal, counters, tilt, spotlight, toast, confetti, helpers. */
(function () {
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var page = document.body.getAttribute('data-page') || 'home';

  var GA = window.GA = {
    $: $, $$: $$, reduce: reduce,
    esc: function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); },
    initials: function (n) { var p = n.trim().split(/\s+/).filter(Boolean); return ((p[0] || '?')[0] + (p.length > 1 ? p[p.length - 1][0] : '')).toUpperCase(); },
    tick: '<svg width="13" height="13" aria-hidden="true"><use href="#i-check"/></svg>'
  };

  /* Sparkline. Improving always trends upward. Line draws itself via CSS. */
  var sid = 0;
  GA.spark = function (trend, better, w, h) {
    var min = Math.min.apply(null, trend), max = Math.max.apply(null, trend), pad = 8, id = 'sg' + (++sid);
    var pts = trend.map(function (v, i) {
      var t = max === min ? .5 : (v - min) / (max - min);
      if (better === 'down') t = 1 - t;
      return [pad + i * (w - pad * 2) / (trend.length - 1), h - pad - t * (h - pad * 2)];
    });
    var line = pts.map(function (p) { return p[0].toFixed(1) + ',' + p[1].toFixed(1); }).join(' ');
    var last = pts[pts.length - 1];
    return '<svg class="spark" viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-label="Performance trend over ' + trend.length + ' seasons, improving">' +
      '<polygon class="ar" points="' + pad + ',' + h + ' ' + line + ' ' + last[0] + ',' + h + '" fill="var(--accent)" fill-opacity=".12"/>' +
      '<polyline class="ln" pathLength="1" points="' + line + '" fill="none" stroke="var(--accent)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<circle class="dt" cx="' + last[0] + '" cy="' + last[1] + '" r="5" fill="var(--accent)"/></svg>';
  };

  /* Pin cover: flat pastel block, height varies to make the masonry wall */
  var SPORT_C = { Athletics: 1, Football: 2, Badminton: 4, Kabaddi: 6, Volleyball: 5, Basketball: 3 }, HEIGHTS = [210, 150, 250, 180, 235, 165, 215, 190, 260, 155, 225, 175];
  GA.cover = function (x, i) {
    return '<div class="pin-cover" style="--c:var(--p' + (SPORT_C[x.s] || 1) + ');--h:' + HEIGHTS[i % HEIGHTS.length] + 'px"><span class="pill" style="background:rgba(255,255,255,.7);color:var(--ink)">' + x.s + '</span><div class="big">' + x.stat + '</div></div>';
  };

  /* Toast */
  var toastEl = document.createElement('div'); toastEl.className = 'toast'; toastEl.setAttribute('role', 'status'); document.body.appendChild(toastEl);
  var toastT;
  GA.toast = function (m) { toastEl.textContent = m; toastEl.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove('show'); }, 2600); };

  /* Confetti */
  GA.confetti = function (x, y) {
    if (reduce) return;
    var c = $('#confetti');
    if (!c) { c = document.createElement('canvas'); c.id = 'confetti'; c.setAttribute('aria-hidden', 'true'); document.body.appendChild(c); }
    c.width = innerWidth; c.height = innerHeight;
    var g = c.getContext('2d'), cols = ['#E60023', '#F9A9B4', '#111111', '#FFFFFF'];
    x = x == null ? innerWidth / 2 : x; y = y == null ? innerHeight / 3 : y;
    var ps = Array.apply(null, Array(90)).map(function () { var a = Math.random() * Math.PI * 2, v = 4 + Math.random() * 9; return { x: x, y: y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 5, s: 4 + Math.random() * 5, r: Math.random() * 6, c: cols[(Math.random() * cols.length) | 0], l: 1 }; });
    (function f() {
      g.clearRect(0, 0, c.width, c.height);
      ps.forEach(function (p) { p.x += p.vx; p.y += p.vy; p.vy += .3; p.vx *= .99; p.r += .2; p.l -= .011; g.save(); g.globalAlpha = Math.max(p.l, 0); g.translate(p.x, p.y); g.rotate(p.r); g.fillStyle = p.c; g.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2); g.restore(); });
      ps = ps.filter(function (p) { return p.l > 0; });
      if (ps.length) requestAnimationFrame(f); else g.clearRect(0, 0, c.width, c.height);
    })();
  };

  /* Header + footer */
  var NAV = [['index.html', 'home', 'Home'], ['product.html', 'product', 'Product'], ['scout.html', 'scout', 'Scout'], ['problem.html', 'problem', 'The gap'], ['ecosystem.html', 'ecosystem', 'Ecosystem'], ['join.html', 'join', 'Join']];
  var sprite = '<svg width="0" height="0" style="position:absolute" aria-hidden="true"><symbol id="i-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12.5l5 5L20 6.5"/></symbol><symbol id="i-x" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></symbol><symbol id="i-shield" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l8 3v6c0 4.5-3.2 8-8 9-4.8-1-8-4.5-8-9V6l8-3z"/><path d="M8.5 12l2.5 2.5 4.5-5"/></symbol><symbol id="i-chart" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 20h18"/><path d="M5 16l4-5 4 3 6-8"/><path d="M15 6h4v4"/></symbol><symbol id="i-globe" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/></symbol><symbol id="i-hand" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l4-4 4 2 4-2 6 5-6 6-3-2-3 2-6-5z"/></symbol><symbol id="i-route" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="5" cy="19" r="2"/><circle cx="19" cy="5" r="2"/><path d="M7 19h6a4 4 0 000-8h-2a4 4 0 010-8h6"/></symbol><symbol id="i-menu" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></symbol><symbol id="i-search" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></symbol></svg>';
  var mark = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 18l6-6 4 4 6-8"/></svg>';
  var hdr = $('#site-header');
  if (hdr) {
    hdr.outerHTML = '<header class="site" id="hdr"><div class="wrap"><div class="nav"><a class="logo" href="index.html" aria-label="GrowAthlete home"><i>' + mark + '</i><span>Grow<b>Athlete</b></span></a>' +
      '<nav class="links" id="links" aria-label="Main">' + NAV.map(function (n) { return '<a href="' + n[0] + '"' + (n[1] === page ? ' class="on" aria-current="page"' : '') + '>' + n[2] + '</a>'; }).join('') + '</nav>' +
      '<a class="btn btn-primary btn-sm" href="join.html">Get early access</a>' +
      '<button class="icon-btn burger" id="burger" type="button" aria-label="Open menu" aria-expanded="false"><svg><use href="#i-menu"/></svg></button></div></div></header>';
  }
  var ftr = $('#site-footer');
  if (ftr) {
    ftr.outerHTML = '<footer><div class="wrap"><div class="fgrid"><div><a class="logo" href="index.html" style="margin-bottom:1rem"><i>' + mark + '</i><span>Grow<b>Athlete</b></span></a><p style="max-width:24rem">India has talent everywhere, but no system to identify, verify and grow athletes at scale. GrowAthlete fixes that.</p></div>' +
      '<div><h4>Product</h4><ul><li><a href="product.html">Profile builder</a></li><li><a href="scout.html">Scout view</a></li><li><a href="ecosystem.html">Career path</a></li></ul></div>' +
      '<div><h4>Company</h4><ul><li><a href="problem.html">The gap</a></li><li><a href="ecosystem.html">Ecosystem</a></li><li><a href="join.html">Contact</a></li></ul></div></div>' +
      '<div class="fbot"><span>© 2026 GrowAthlete</span><span>Verified digital profiles for 20+ sports.</span></div></div></footer>';
  }
  document.body.insertAdjacentHTML('afterbegin', sprite + '<div class="backdrop" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div><div class="progress" id="progress"></div><div class="curtain cover" id="curtain" aria-hidden="true"><span>GrowAthlete</span></div>');

  var header = $('#hdr');
  $('#burger') && $('#burger').addEventListener('click', function () {
    var o = header.classList.toggle('open'); this.setAttribute('aria-expanded', o);
  });

  /* Scroll: header state + progress bar */
  var prog = $('#progress');
  function onScroll() {
    var y = scrollY, h = document.documentElement.scrollHeight - innerHeight;
    if (header) header.classList.toggle('scrolled', y > 8);
    prog.style.transform = 'scaleX(' + (h > 0 ? Math.min(y / h, 1) : 0) + ')';
  }
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* Page transitions */
  var cur = $('#curtain');
  /* Reveal the page. A timer backs up requestAnimationFrame, which pauses in background tabs */
  var opened = false;
  function openCurtain() { if (!opened) { opened = true; cur.className = 'curtain done'; } }
  requestAnimationFrame(function () { requestAnimationFrame(openCurtain); });
  setTimeout(openCurtain, 350);
  addEventListener('pageshow', function (e) { if (e.persisted) cur.className = 'curtain done'; });
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href]');
    if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button || a.target || a.hasAttribute('download')) return;
    var u = a.getAttribute('href');
    if (!/^[\w-]+\.html(#.*)?$/.test(u) || reduce) return;
    if (u.split('#')[0] === location.pathname.split('/').pop() && u.indexOf('#') > -1) return;
    e.preventDefault();
    cur.className = 'curtain'; void cur.offsetWidth; cur.classList.add('in');
    setTimeout(function () { location.href = u; }, 460);
  });

  /* Reveal on scroll, counters, spotlight, tilt */
  GA.observe = function (root) {
    var els = $$('.reveal:not(.in)', root);
    if (!('IntersectionObserver' in window)) { els.forEach(function (el) { el.classList.add('in'); }); return; }
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }); }, { threshold: .1 });
    els.forEach(function (el) { io.observe(el); });
    /* Fallback for browsers or panes where IntersectionObserver callbacks are delayed */
    var ticking = false;
    function check() {
      ticking = false;
      els.forEach(function (el) { if (!el.classList.contains('in') && el.getBoundingClientRect().top < innerHeight * .92) el.classList.add('in'); });
    }
    function req() { if (!ticking) { ticking = true; requestAnimationFrame(check); } }
    addEventListener('scroll', req, { passive: true }); addEventListener('resize', req); req();
  };
  GA.observe(document);
  function countUp(el) {
    var end = +el.dataset.count, suf = el.dataset.suffix || '', t0 = null;
    function f(t) { if (!t0) t0 = t; var p = Math.min((t - t0) / 1300, 1); el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))) + suf; if (p < 1) requestAnimationFrame(f); }
    requestAnimationFrame(f);
  }
  GA.counters = function (root) {
    if (reduce || !('IntersectionObserver' in window)) return;
    var co = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { countUp(e.target); co.unobserve(e.target); } }); }, { threshold: .6 });
    $$('[data-count]', root).forEach(function (el) { co.observe(el); });
  };
  GA.counters(document);
  document.addEventListener('pointermove', function (e) {
    var s = e.target.closest && e.target.closest('.spot'); if (!s) return;
    var r = s.getBoundingClientRect(); s.style.setProperty('--mx', (e.clientX - r.left) + 'px'); s.style.setProperty('--my', (e.clientY - r.top) + 'px');
  });
  GA.tilt = function (stage, card, deg) {
    if (reduce || !matchMedia('(hover: hover)').matches) return;
    stage.addEventListener('pointermove', function (e) {
      var r = card.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      card.style.transform = 'rotateY(' + (x * deg) + 'deg) rotateX(' + (-y * deg * .8) + 'deg)';
    });
    stage.addEventListener('pointerleave', function () { card.style.transform = ''; });
  };
  GA.marquee = function (el) { var h = window.GA_SPORTS.map(function (s) { return '<span>' + s + '</span>'; }).join(''); el.innerHTML = h + h; };
  GA.accordion = function (root) {
    root.addEventListener('click', function (e) {
      var b = e.target.closest('.acc-b'); if (!b) return;
      var it = b.closest('.acc-i'), open = it.dataset.open !== 'true';
      $$('.acc-i', root).forEach(function (x) { x.dataset.open = 'false'; $('.acc-b', x).setAttribute('aria-expanded', 'false'); });
      it.dataset.open = open; b.setAttribute('aria-expanded', open);
    });
  };
})();
