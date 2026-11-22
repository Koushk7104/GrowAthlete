(function () {
  var GA = window.GA;
  GA.$('#hspark').innerHTML = GA.spark([58.9, 57.7, 57.1, 56.4, 55.8], 'down', 300, 90);
  GA.$('#bspark').innerHTML = GA.spark([4, 6, 7, 10, 13], 'up', 220, 70);
  GA.marquee(GA.$('#marq'));
  GA.tilt(GA.$('#stage'), GA.$('#hcard'), 12);
})();
