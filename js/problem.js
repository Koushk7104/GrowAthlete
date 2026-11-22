(function () {
  var GA = window.GA, $ = GA.$;
  var ms = $('#mstage'), items = GA.$$('.item', ms), verified = {};
  function caption() {
    var on = ms.classList.contains('merged'), n = Object.keys(verified).length;
    $('#m-before').setAttribute('aria-pressed', !on); $('#m-after').setAttribute('aria-pressed', on);
    $('#m-count').textContent = on ? n + ' of 6 verified. Click an item to verify it.' : 'Six places, none searchable.';
    $('#m-cap').innerHTML = on ? (n === 6 ? '<strong>One verified record.</strong> Anyone can check it, from any city, in seconds.' : '<strong>One record, being verified.</strong> Click each item to confirm it.') : '<strong>Scattered and unverifiable.</strong> A scout would need to know the athlete personally.';
  }
  function setMerge(on) { ms.classList.toggle('merged', on); caption(); }
  $('#m-before').addEventListener('click', function () { setMerge(false); });
  $('#m-after').addEventListener('click', function () { setMerge(true); });
  ms.addEventListener('click', function (e) {
    var it = e.target.closest('.item'); if (!it) return;
    if (!ms.classList.contains('merged')) { setMerge(true); return; }
    if (verified[it.dataset.i]) return;
    verified[it.dataset.i] = true; it.classList.add('ok');
    var p = $('.v', it); p.className = 'pill good v'; p.innerHTML = GA.tick + 'Verified';
    caption();
    if (Object.keys(verified).length === 6) { var r = ms.getBoundingClientRect(); GA.confetti(r.left + r.width / 2, r.top + r.height / 2); }
  });
  caption();

  var gaps = [
    ['No single identity for athletes', 'Achievements are scattered across school certificates, WhatsApp photos, local news clippings and coach references. Scouts, sponsors and academies cannot discover them easily.', 'One verified sports resume per athlete, with every achievement and result in a single trusted place.'],
    ['Talent is invisible beyond the metros', 'Athletes in tier-2, tier-3 and rural areas lack exposure, network and personal branding. Selection still depends on connections, not data.', 'Equal exposure for rural and urban athletes. A profile reaches the same scouts no matter where the athlete lives.'],
    ['No career roadmap', 'Most athletes do not know which tournaments matter, how to approach sponsors, or how to apply for trials, scholarships and academies. Careers end early for lack of guidance.', 'Opportunities in one place, with career guidance and mentorship planned as the next layer.'],
    ['Scouting and sponsorship are manual', 'Brands, clubs and academies struggle to find sport-specific athletes, verify performance data and track consistency and growth. Current scouting is manual, expensive and slow.', 'Structured, searchable, verified data that makes data-driven scouting and sponsorship matching possible.'],
    ['Athletes are treated as one-time winners', 'There is nowhere to track progress over years, injuries and recovery, or performance trends. One bad season and an athlete is forgotten.', 'Long-term athlete lifecycle tracking, so the whole career is visible and not only the last result.']
  ];
  $('#acc').innerHTML = gaps.map(function (g, i) {
    return '<div class="acc-i" data-open="' + (i === 0) + '"><button class="acc-b" type="button" aria-expanded="' + (i === 0) + '"><span class="n">0' + (i + 1) + '</span>' + g[0] + '<span class="pm" aria-hidden="true">+</span></button>' +
      '<div class="acc-p"><div><div class="acc-in"><div class="pain"><h4>The gap</h4><p>' + g[1] + '</p></div><div class="gain"><h4>With GrowAthlete</h4><p>' + g[2] + '</p></div></div></div></div></div>';
  }).join('');
  GA.accordion($('#acc'));
})();
