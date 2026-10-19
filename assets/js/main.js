/* Sun For Joy: menu, live open/dicht (tijdzone Amsterdam), zonneboog, zonsondergang,
   kuurplanner en huidtype-test. Geen cookies, geen externe verzoeken. */
(function () {
  'use strict';
  var TZ = 'Europe/Amsterdam';
  var LAT = 52.272, LNG = 4.973; // Abcoude
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- menu ---------- */
  var btn = document.querySelector('.menu-btn');
  var nav = document.getElementById('nav');
  if (btn && nav) {
    btn.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  /* ---------- hulpfuncties ---------- */
  var DAGEN = ['zondag', 'maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag'];
  function partsAmsterdam(d) {
    var p = new Intl.DateTimeFormat('en-GB', { timeZone: TZ, weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(d);
    var m = {}; p.forEach(function (x) { m[x.type] = x.value; });
    return { day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(m.weekday), min: (parseInt(m.hour, 10) % 24) * 60 + parseInt(m.minute, 10) };
  }
  function toMin(t) { var a = t.split(':'); return +a[0] * 60 + +a[1]; }
  function fmtMin(m) { var h = Math.floor(m / 60), mm = m % 60; return (h < 10 ? '0' : '') + h + '.' + (mm < 10 ? '0' : '') + mm; }
  function fmt(t) { return t.replace(':', '.'); }
  function eur(x) { return new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(x); }

  /* Zonsondergang (algoritme zoals SunCalc / NOAA), resultaat in minuten na middernacht Amsterdamse tijd */
  function sunsetMinutes(now) {
    var rad = Math.PI / 180, dayMs = 86400000, J1970 = 2440588, J2000 = 2451545, e = rad * 23.4397;
    var lw = rad * -LNG, phi = rad * LAT;
    var d = now.valueOf() / dayMs - 0.5 + J1970 - J2000;
    var n = Math.round(d - 0.0009 - lw / (2 * Math.PI));
    var ds = 0.0009 + lw / (2 * Math.PI) + n;
    var M = rad * (357.5291 + 0.98560028 * ds);
    var C = rad * (1.9148 * Math.sin(M) + 0.02 * Math.sin(2 * M) + 0.0003 * Math.sin(3 * M));
    var L = M + C + rad * 102.9372 + Math.PI;
    var dec = Math.asin(Math.sin(e) * Math.sin(L));
    var w = Math.acos((Math.sin(rad * -0.833) - Math.sin(phi) * Math.sin(dec)) / (Math.cos(phi) * Math.cos(dec)));
    var a = 0.0009 + (w + lw) / (2 * Math.PI) + n;
    var Jset = J2000 + a + 0.0053 * Math.sin(M) - 0.0069 * Math.sin(2 * L);
    var set = new Date((Jset + 0.5 - J1970) * dayMs);
    return partsAmsterdam(set).min;
  }

  /* ---------- openingstijden ---------- */
  var HOURS = window.SFJ_HOURS; // [zo..za] -> ["08:00","18:00"] of null
  if (HOURS) {
    var arcFill = document.querySelector('.arc-fill');
    var arcSun = document.querySelector('.arc-sun');
    var arcGlow = document.querySelector('.arc-glow');
    var todayCard = document.querySelector('.today');
    var shownF = 0;

    function nextOpening(n) {
      for (var i = 1; i <= 7; i++) {
        var d = (n.day + i) % 7;
        if (HOURS[d]) return { when: i === 1 ? 'morgen' : DAGEN[d], from: fmt(HOURS[d][0]) };
      }
      return null;
    }

    function state() {
      var now = new Date();
      var n = partsAmsterdam(now);
      var h = HOURS[n.day];
      var s = { open: false, f: 0, n: n, h: h, sunset: sunsetMinutes(now) };
      if (h) {
        var o = toMin(h[0]), c = toMin(h[1]);
        if (n.min >= o && n.min < c) { s.open = true; s.f = (n.min - o) / (c - o); s.text = 'Nu open tot ' + fmt(h[1]); }
        else if (n.min < o) { s.f = 0; s.text = 'Vandaag open vanaf ' + fmt(h[0]); }
        else { s.f = 1; }
      }
      if (!s.text) {
        var nx = nextOpening(n);
        s.text = nx ? 'Gesloten, ' + nx.when + ' open vanaf ' + nx.from : 'Gesloten';
      }
      return s;
    }

    function sunline(s) {
      var ss = s.sunset, h = s.h, nowM = s.n.min;
      var nx = nextOpening(s.n);
      if (!h) return 'Buiten gaat de zon vandaag om ' + fmtMin(ss) + ' onder. ' + (nx ? 'Bij ons schijnt hij ' + nx.when + ' weer.' : '');
      var c = toMin(h[1]);
      if (nowM < ss) {
        if (ss < c) return 'Buiten gaat de zon vandaag om ' + fmtMin(ss) + ' onder. Bij ons schijnt hij tot ' + fmt(h[1]) + '.';
        return 'Buiten gaat de zon vandaag om ' + fmtMin(ss) + ' onder. Bij ons schijnt hij ook als het regent.';
      }
      if (nowM < c) return 'Buiten is de zon al onder. Bij ons schijnt hij nog tot ' + fmt(h[1]) + '.';
      return 'Buiten en binnen is de zon onder. ' + (nx ? 'Bij ons schijnt hij ' + nx.when + ' weer vanaf ' + nx.from + '.' : '');
    }

    function placeSun(f) {
      if (!arcSun) return;
      var th = Math.PI * (1 - f);
      var x = 110 + 96 * Math.cos(th), y = 110 - 96 * Math.sin(th);
      arcSun.setAttribute('cx', x.toFixed(1)); arcSun.setAttribute('cy', y.toFixed(1));
      arcGlow.setAttribute('cx', x.toFixed(1)); arcGlow.setAttribute('cy', y.toFixed(1));
      arcFill.style.strokeDashoffset = (100 - f * 100).toFixed(2);
    }

    function animateTo(f) {
      if (!arcSun) return;
      if (reduce) { placeSun(f); shownF = f; return; }
      var from = shownF, t0 = null, dur = 1600;
      function step(t) {
        if (!t0) t0 = t;
        var k = Math.min(1, (t - t0) / dur); k = 1 - Math.pow(1 - k, 3);
        placeSun(from + (f - from) * k);
        if (k < 1) requestAnimationFrame(step); else shownF = f;
      }
      requestAnimationFrame(step);
    }

    function render(first) {
      var s = state();
      document.querySelectorAll('[data-status]').forEach(function (el) {
        el.textContent = s.text; el.classList.toggle('is-open', s.open);
      });
      document.querySelectorAll('[data-today-hours]').forEach(function (el) {
        el.textContent = s.h ? fmt(s.h[0]) + ' – ' + fmt(s.h[1]) : 'Gesloten';
      });
      document.querySelectorAll('[data-open-time]').forEach(function (el) { el.textContent = s.h ? fmt(s.h[0]) : ''; });
      document.querySelectorAll('[data-close-time]').forEach(function (el) { el.textContent = s.h ? fmt(s.h[1]) : 'Vandaag gesloten'; });
      document.querySelectorAll('[data-sunline]').forEach(function (el) { el.textContent = sunline(s); });
      document.querySelectorAll('.hours tr[data-day]').forEach(function (tr) {
        tr.classList.toggle('vandaag', +tr.getAttribute('data-day') === s.n.day);
      });
      if (todayCard) todayCard.classList.toggle('is-dicht', !s.open);
      if (first) animateTo(s.f); else { placeSun(s.f); shownF = s.f; }
    }
    render(true);
    setInterval(function () { render(false); }, 60000);
  }

  /* ---------- kuurplanner ---------- */
  var PRICES = window.SFJ_PRICES || {};
  document.querySelectorAll('[data-calc]').forEach(function (box) {
    var form = box.querySelector('form');
    function val(name) { var el = form.querySelector('[name=' + name + ']:checked') || form.querySelector('[name=' + name + ']'); return el.value; }
    function set(name, v) {
      var r = form.querySelectorAll('[name=' + name + ']');
      if (r.length > 1) r.forEach(function (x) { x.checked = x.value === v; }); else r[0].value = v;
    }
    function update() {
      var bank = val('bank'), min = +val('min'), pw = +val('pw'), wk = +val('wk');
      var rate = PRICES[bank] || 0, sessie = rate * min, n = pw * wk;
      box.querySelector('[data-out=min]').textContent = min;
      box.querySelector('[data-out=pw]').textContent = pw + 'x';
      box.querySelector('[data-out=wk]').textContent = wk;
      box.querySelector('[data-res=total]').textContent = eur(sessie * n);
      box.querySelector('[data-res=sessie]').textContent = eur(sessie);
      box.querySelector('[data-res=week]').textContent = eur(sessie * pw);
      box.querySelector('[data-res=n]').textContent = n;
      var tip;
      if (bank === 'collageen' && wk >= 10 && pw >= 2) tip = 'Dit is een volledige collageenkuur. De eerste veranderingen zie je meestal na ongeveer vijftien sessies.';
      else if (bank === 'collageen') tip = 'Voor het huideffect van collageen volg je minimaal tien weken twee tot drie sessies per week.';
      else if (pw === 3) tip = 'Houd minstens 48 uur tussen twee sessies, bijvoorbeeld maandag, woensdag en vrijdag.';
      else tip = 'Hoeveel minuten je zont, hangt af van je huidtype en het zonadvies bij de bank.';
      box.querySelector('[data-res=tip]').textContent = tip;
    }
    form.addEventListener('input', update);
    form.addEventListener('change', update);
    box.querySelectorAll('[data-preset]').forEach(function (b) {
      b.addEventListener('click', function () {
        var p = b.getAttribute('data-preset');
        if (p === 'start') { set('bank', 'zonnebank'); set('min', '5'); set('pw', '1'); set('wk', '4'); }
        if (p === 'kuur') { set('bank', 'collageen'); set('min', '10'); set('pw', '3'); set('wk', '10'); }
        if (p === 'kuur2') { set('bank', 'collageen'); set('min', '10'); set('pw', '2'); set('wk', '10'); }
        update();
      });
    });
    update();
  });

  /* ---------- huidtype-test ---------- */
  var TYPES = [
    { t: 'Huidtype 1: zeer lichte huid', x: 'Je huid verbrandt snel en wordt nauwelijks bruin. Voor dit huidtype is de zonnebank niet geschikt, ook niet kort. Voor jou is je huid beschermen in de zon het belangrijkst.' },
    { t: 'Huidtype 2: lichte huid', x: 'Je huid is gevoelig, maar kan langzaam kleur opbouwen. Kies de kortste tijd uit het zonadvies voor huidtype 2, neem minstens 48 uur rust tussen twee sessies en bouw heel geleidelijk op. Dat geldt voor de zonnebank en de collageenbank, want allebei bruinen ze met UV.' },
    { t: 'Huidtype 3: licht getinte huid', x: 'Je huid wordt goed bruin en verbrandt soms. Volg het zonadvies voor huidtype 3: begin kort en bouw in stappen op naar de maximale tijd. Neem minstens 48 uur rust tussen twee sessies.' },
    { t: 'Huidtype 4: getinte huid', x: 'Je huid wordt snel bruin en verbrandt zelden. Volg het zonadvies voor huidtype 4. Ook jouw huid heeft rust nodig: houd minstens 48 uur tussen twee sessies.' }
  ];
  document.querySelectorAll('[data-htest]').forEach(function (box) {
    var form = box.querySelector('form'), res = box.querySelector('.htest-result');
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var sum = 0, burn = 0;
      for (var i = 0; i < 5; i++) {
        var c = form.querySelector('[name=q' + i + ']:checked');
        if (!c) { form.querySelector('[name=q' + i + ']').focus(); return; }
        sum += +c.value; if (i === 4) burn = +c.value;
      }
      var type = sum <= 3 ? 0 : sum <= 7 ? 1 : sum <= 11 ? 2 : 3;
      if (burn === 0) type = 0;
      res.querySelector('[data-htype]').textContent = 'Jouw uitslag';
      res.querySelector('[data-htitle]').textContent = TYPES[type].t;
      res.querySelector('[data-htext]').textContent = TYPES[type].x;
      res.classList.toggle('type1', type === 0);
      form.hidden = true; res.hidden = false;
      res.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
    });
    box.querySelector('[data-hreset]').addEventListener('click', function () {
      form.reset(); res.hidden = true; form.hidden = false;
      form.querySelector('input').focus();
    });
  });
})();
