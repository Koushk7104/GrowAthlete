/* Runs in <head> so the theme and the .js class are set before first paint. */
(function () {
  var r = document.documentElement;
  r.classList.add('js');
  try { var t = localStorage.getItem('ga-theme'); if (t) r.setAttribute('data-theme', t); } catch (e) {}
})();
