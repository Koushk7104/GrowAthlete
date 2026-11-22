/* Sports arena: one looping, sport-specific scene at a time. Tap the field to celebrate. */
(function () {
  var GA = window.GA, $ = GA.$;
  var stage = $('#arena-stage');
  if (!stage) return;

  var ball = {
    football: '<circle r="22" fill="#fff" stroke="var(--ink)" stroke-width="2.5"/><polygon points="0,-9 8.5,-3 5,7 -5,7 -8.5,-3" fill="var(--ink)"/><path d="M0 -9V-22M8.5 -3L21 -7M5 7L12 18M-5 7L-12 18M-8.5 -3L-21 -7" stroke="var(--ink)" stroke-width="2" fill="none"/>',
    basketball: '<circle r="22" fill="#fff" stroke="var(--ink)" stroke-width="2.5"/><path d="M0 -22V22M-22 0H22M-15 -15C-6 -6 -6 6 -15 15M15 -15C6 -6 6 6 15 15" stroke="var(--ink)" stroke-width="2" fill="none"/>',
    volleyball: '<circle r="22" fill="#fff" stroke="var(--ink)" stroke-width="2.5"/><path d="M0 -22C0 -8 -8 -2 -21 0M0 -22C8 -19 15 -12 17 -3M21 6C10 4 2 8 -3 21M-19 -10C-8 -9 0 -4 3 7" stroke="var(--ink)" stroke-width="2" fill="none"/>'
  };

  var scenes = {
    Football: {
      cheer: 'Goal!', line: 'Football: a lofted shot into the corner.',
      svg: '<line class="sc-line" x1="0" y1="224" x2="800" y2="224"/>' +
        '<path class="sc-dash" d="M90 200Q400 10 735 190"/>' +
        '<g class="fb-net"><path class="sc-ink" stroke-width="4" d="M700 224V118H792V224"/>' +
        '<path class="sc-line" d="M716 118V224M732 118V224M748 118V224M764 118V224M780 118V224M700 138H792M700 158H792M700 178H792M700 198H792"/></g>' +
        '<g style="transform:translate(90px,202px)"><g class="fb-x"><g class="fb-y"><g class="fb-spin">' + ball.football + '</g></g></g></g>'
    },
    Basketball: {
      cheer: 'Swish!', line: 'Basketball: dribble, rise, and shoot.',
      svg: '<line class="sc-line" x1="0" y1="224" x2="800" y2="224"/>' +
        '<line class="sc-ink" x1="662" y1="164" x2="662" y2="224"/><rect class="sc-ink" x="654" y="64" width="10" height="100" rx="3" fill="#fff"/>' +
        '<line class="sc-acc" x1="584" y1="120" x2="654" y2="120" stroke="var(--accent)" stroke-width="5" stroke-linecap="round"/>' +
        '<path class="sc-line" d="M588 120L600 166H638L650 120M594 138H644M598 152H640"/>' +
        '<g style="transform:translate(140px,200px)"><g class="bb"><g class="bb-spin">' + ball.basketball + '</g></g></g>'
    },
    Volleyball: {
      cheer: 'Point!', line: 'Volleyball: a rally over the net.',
      svg: '<line class="sc-line" x1="0" y1="224" x2="800" y2="224"/>' +
        '<line class="sc-ink" x1="400" y1="96" x2="400" y2="224"/>' +
        '<path class="sc-line" d="M400 100H320M400 100H480M400 118H320M400 118H480M400 136H320M400 136H480M400 154H320M400 154H480"/>' +
        '<g style="transform:translate(150px,202px)"><g class="vx"><g class="vy"><g class="spin-s">' + ball.volleyball + '</g></g></g></g>'
    },
    Badminton: {
      cheer: 'Smash!', line: 'Badminton: a fast rally with the shuttle.',
      svg: '<line class="sc-line" x1="0" y1="224" x2="800" y2="224"/>' +
        '<line class="sc-ink" x1="400" y1="124" x2="400" y2="224"/><path class="sc-line" d="M400 128H330M400 128H470M400 146H330M400 146H470M400 164H330M400 164H470"/>' +
        '<g class="sc-ink" transform="translate(110 176)"><ellipse rx="15" ry="22" fill="none"/><line x1="0" y1="22" x2="0" y2="46"/></g>' +
        '<g class="sc-ink" transform="translate(690 176)"><ellipse rx="15" ry="22" fill="none"/><line x1="0" y1="22" x2="0" y2="46"/></g>' +
        '<g style="transform:translate(150px,190px)"><g class="vx"><g class="by"><g class="shuttle"><path d="M-5 -3L-15 -26H15L5 -3Z" fill="#fff" stroke="var(--ink)" stroke-width="2.5" stroke-linejoin="round"/><circle r="7" fill="var(--accent)" stroke="var(--ink)" stroke-width="2.5"/></g></g></g></g>'
    },
    Athletics: {
      cheer: 'Personal best!', line: 'Athletics: four lanes, one finish line.',
      svg: (function () {
        var s = '', y, i, runs = [['var(--accent)', 3.1], ['var(--ink)', 3.5], ['var(--ink)', 3.9], ['var(--ink)', 4.3]];
        for (i = 0; i < 4; i++) {
          y = 24 + i * 52;
          s += '<rect x="40" y="' + y + '" width="720" height="48" fill="' + (i % 2 ? '#fff' : '#EEF0F4') + '"/>';
        }
        s += '<line class="sc-line" x1="70" y1="20" x2="70" y2="236"/><path d="M730 20V236" stroke="var(--ink)" stroke-width="5" stroke-dasharray="8 8"/>';
        for (i = 0; i < 4; i++) {
          y = 24 + i * 52 + 24;
          s += '<g style="transform:translate(78px,' + y + 'px)"><g class="run" style="animation-duration:' + runs[i][1] + 's;animation-delay:-' + (i * .4) + 's">' +
            '<rect x="-38" y="-5" width="24" height="2.5" rx="1.2" fill="' + runs[i][0] + '" opacity=".35"/><rect x="-30" y="1" width="18" height="2.5" rx="1.2" fill="' + runs[i][0] + '" opacity=".35"/>' +
            '<g class="bob"><circle r="11" fill="' + runs[i][0] + '"/></g></g></g>';
        }
        return s;
      })()
    }
  };
  var names = Object.keys(scenes), cur = 'Football', timer = null, userPicked = false;
  var tabs = $('#arena-tabs');
  tabs.innerHTML = names.map(function (n) { return '<button class="chip sp" role="tab" type="button" data-s="' + n + '" aria-selected="' + (n === cur) + '">' + GA.sportIcon(n) + n + '</button>'; }).join('');

  function show(n) {
    cur = n;
    $('#arena-svg').innerHTML = scenes[n].svg;
    $('#arena-line').textContent = scenes[n].line;
    var a = $('#arena-link'); a.href = 'scout.html?sport=' + encodeURIComponent(n); a.firstChild.textContent = 'Scout ' + n.toLowerCase() + ' athletes ';
    GA.$$('#arena-tabs .chip').forEach(function (c) { c.setAttribute('aria-selected', c.dataset.s === n); });
  }
  function auto() {
    if (GA.reduce || timer) return;
    timer = setInterval(function () { if (!document.hidden && !userPicked) show(names[(names.indexOf(cur) + 1) % names.length]); }, 7000);
  }
  tabs.addEventListener('click', function (e) { var b = e.target.closest('.chip'); if (!b) return; userPicked = true; show(b.dataset.s); });
  stage.addEventListener('click', function (e) { GA.confetti(e.clientX, e.clientY); GA.toast(scenes[cur].cheer); });
  show(cur); auto();
})();
