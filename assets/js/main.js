/* Sun For Joy: menu en live open/dicht-status (tijdzone Amsterdam) */
(function () {
  var btn = document.querySelector('.menu-btn');
  var nav = document.getElementById('nav');
  if (btn && nav) {
    btn.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  var HOURS = window.SFJ_HOURS; // [zo, ma, di, wo, do, vr, za] -> ["08:00","18:00"] of null
  if (!HOURS) return;
  var DAGEN = ['zondag', 'maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag'];

  function nowAmsterdam() {
    var parts = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Europe/Amsterdam', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false
    }).formatToParts(new Date());
    var map = {};
    parts.forEach(function (p) { map[p.type] = p.value; });
    var wd = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(map.weekday);
    return { day: wd, min: parseInt(map.hour, 10) % 24 * 60 + parseInt(map.minute, 10) };
  }
  function toMin(t) { var a = t.split(':'); return +a[0] * 60 + +a[1]; }
  function fmt(t) { return t.replace(':', '.'); }

  function status() {
    var n = nowAmsterdam();
    var h = HOURS[n.day];
    if (h && n.min >= toMin(h[0]) && n.min < toMin(h[1])) {
      return { open: true, text: 'Nu open tot ' + fmt(h[1]), today: n.day };
    }
    if (h && n.min < toMin(h[0])) {
      return { open: false, text: 'Vandaag open vanaf ' + fmt(h[0]), today: n.day };
    }
    for (var i = 1; i <= 7; i++) {
      var d = (n.day + i) % 7;
      if (HOURS[d]) {
        var when = i === 1 ? 'morgen' : DAGEN[d];
        return { open: false, text: 'Gesloten, ' + when + ' open vanaf ' + fmt(HOURS[d][0]), today: n.day };
      }
    }
    return { open: false, text: 'Gesloten', today: n.day };
  }

  function render() {
    var s = status();
    document.querySelectorAll('[data-status]').forEach(function (el) {
      el.textContent = s.text;
      el.classList.toggle('is-open', s.open);
    });
    document.querySelectorAll('[data-today-hours]').forEach(function (el) {
      var h = HOURS[s.today];
      el.textContent = h ? fmt(h[0]) + ' – ' + fmt(h[1]) : 'Gesloten';
    });
    document.querySelectorAll('.hours tr[data-day]').forEach(function (tr) {
      tr.classList.toggle('vandaag', +tr.getAttribute('data-day') === s.today);
    });
  }
  render();
  setInterval(render, 60000);
})();
