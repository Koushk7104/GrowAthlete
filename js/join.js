(function () {
  var GA = window.GA, $ = GA.$;
  var jr = $('#j-role'), form = $('#join-form');
  jr.addEventListener('click', function (e) { var b = e.target.closest('.chip'); if (!b) return; GA.$$('.chip', jr).forEach(function (c) { c.setAttribute('aria-pressed', c === b); }); });
  var ENDPOINT = ''; // Set to your form service URL to store sign-ups.
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var n = $('#j-name').value.trim(), m = $('#j-email').value.trim(), msg = $('#j-msg');
    if (!n || !/^\S+@\S+\.\S+$/.test(m)) { msg.style.color = 'var(--warn)'; msg.textContent = 'Please enter your name and a valid email.'; return; }
    var role = $('.chip[aria-pressed="true"]', jr).textContent, sport = $('#j-sport').value.trim();
    function ok() {
      form.style.display = 'none'; msg.textContent = '';
      $('#done-h').textContent = 'You are on the list, ' + n.split(' ')[0];
      $('#done-p').textContent = 'We will invite you as profiles open' + (sport ? ' for ' + sport : '') + '.';
      $('#done').classList.add('show'); form.reset();
      var r = $('#done').getBoundingClientRect(); GA.confetti(r.left + r.width / 2, r.top + 60);
    }
    if (!ENDPOINT) { ok(); return; }
    fetch(ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: n, email: m, role: role, sport: sport }) })
      .then(function (r) { if (!r.ok) throw 0; ok(); })
      .catch(function () { msg.style.color = 'var(--warn)'; msg.textContent = 'Something went wrong. Please try again.'; });
  });
  $('#again').addEventListener('click', function () { $('#done').classList.remove('show'); form.style.display = 'grid'; });
})();
