/* =========================================================================
   Shop-Check — 3-step guided funnel:
   1) Speed test (Google PageSpeed) with a plain-language result
   2) Load-time revenue potential (load time carried over from step 1)
   3) Recap + lead capture (posts to analyse-handler.php)
   Vanilla JS, progressive enhancement.
   ========================================================================= */
(function () {
  'use strict';

  // Google-API-Key (PageSpeed Insights). Client-seitig sichtbar (bei PSI ok);
  // in der Google Console auf die Domain + PSI-API beschränken.
  var PSI_API_KEY = 'AIzaSyAUsA622upsm9xLu_RPLIwrL_VWcLNKqyY';

  var wrap = document.getElementById('shopCheck');
  if (!wrap) return;

  var state = { url: '', score: null, grade: '', lcp: null, revenue: 10000, yearly: 0 };

  var euro = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
  var num = new Intl.NumberFormat('de-DE');
  function secStr(s) { return s.toFixed(1).replace('.', ',') + ' s'; }

  /* ---------- Step navigation ---------- */
  var steps = wrap.querySelectorAll('.wizard__step');
  var progressBar = document.getElementById('progressBar');
  var TOTAL = steps.length || 3;
  function goTo(n) {
    steps.forEach(function (s) {
      s.classList.toggle('is-active', s.getAttribute('data-step') === String(n));
    });
    if (progressBar) progressBar.style.width = Math.round((n / TOTAL) * 100) + '%';
    var top = wrap.getBoundingClientRect().top + window.scrollY - 90;
    window.scrollTo({ top: top, behavior: 'smooth' });
  }
  wrap.addEventListener('click', function (e) {
    var back = e.target.closest('.wback');
    if (back) goTo(parseInt(back.getAttribute('data-back'), 10));
  });

  /* ---------- STEP 1: Speed check ---------- */
  var form = document.getElementById('speedForm');
  var input = document.getElementById('speedUrl');
  var submit = document.getElementById('speedSubmit');
  var status = document.getElementById('speedStatus');
  var result = document.getElementById('speedResult');
  var ring = document.getElementById('gaugeRing');
  var scoreNum = document.getElementById('speedScoreNum');
  var gradeEl = document.getElementById('speedGrade');
  var plainEl = document.getElementById('speedPlain');
  var metrics = document.getElementById('speedMetrics');
  var CIRC = 2 * Math.PI * 52;
  ring.style.strokeDasharray = CIRC.toFixed(1);
  ring.style.strokeDashoffset = CIRC.toFixed(1);

  function colorFor(s) { return s >= 90 ? '#3f9973' : s >= 50 ? '#d9a441' : '#c2593f'; }
  function gradeFor(s) {
    if (s >= 90) return 'Blitzschnell';
    if (s >= 70) return 'Ganz ordentlich';
    if (s >= 50) return 'Ausbaufähig';
    return 'Zu langsam';
  }
  function plainFor(s, lcp) {
    var l = lcp ? secStr(lcp) : null;
    if (s >= 90) return 'Top! Dein Shop lädt richtig schnell' + (l ? ' — der Hauptinhalt ist schon nach ' + l + ' da.' : '.');
    if (l) return 'Dein Shop zeigt den Hauptinhalt erst nach ' + l + '. Schnelle Shops schaffen das in unter 2,5 s — jede Sekunde Wartezeit kostet dich Kund:innen.';
    return 'Dein Shop ist langsamer als nötig — das kostet dich Kund:innen. Da geht deutlich mehr.';
  }

  function animateScore(s) {
    var c = colorFor(s);
    ring.style.stroke = c;
    ring.style.strokeDashoffset = (CIRC * (1 - s / 100)).toFixed(1);
    scoreNum.style.color = c;
    var cur = 0, step = Math.max(1, Math.round(s / 30));
    var t = setInterval(function () { cur = Math.min(s, cur + step); scoreNum.textContent = cur; if (cur >= s) clearInterval(t); }, 24);
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var url = input.value.trim();
    if (!url) { input.focus(); return; }
    if (!/^https?:\/\//i.test(url)) url = 'https://' + url;
    state.url = url;

    submit.disabled = true;
    status.className = 'form-hint';
    status.textContent = 'Ich teste ' + url + ' … das dauert 10–30 Sekunden.';
    result.hidden = true;

    var api = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed'
      + '?url=' + encodeURIComponent(url)
      + '&strategy=mobile&category=performance'
      + (PSI_API_KEY ? '&key=' + PSI_API_KEY : '');

    fetch(api)
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (!data.lighthouseResult) throw new Error('no result');
        var lh = data.lighthouseResult;
        var score = Math.round(lh.categories.performance.score * 100);
        var a = lh.audits || {};
        var lcpMs = a['largest-contentful-paint'] && a['largest-contentful-paint'].numericValue;
        var lcp = lcpMs ? lcpMs / 1000 : null;
        state.score = score; state.grade = gradeFor(score); state.lcp = lcp;

        gradeEl.textContent = state.grade;
        gradeEl.style.color = colorFor(score);
        plainEl.textContent = plainFor(score, lcp);

        metrics.innerHTML = '';
        [['Ladezeit Hauptinhalt (LCP)', 'largest-contentful-paint'],
         ['Layout-Stabilität (CLS)', 'cumulative-layout-shift'],
         ['Reaktionszeit (TBT)', 'total-blocking-time'],
         ['Erster Inhalt (FCP)', 'first-contentful-paint']].forEach(function (m) {
          if (a[m[1]] && a[m[1]].displayValue) {
            var li = document.createElement('li');
            li.className = 'metric';
            li.innerHTML = '<span class="metric__label">' + m[0] + '</span><span class="metric__value">' + a[m[1]].displayValue + '</span>';
            metrics.appendChild(li);
          }
        });

        result.hidden = false;
        animateScore(score);
        status.textContent = '';
        var next = document.getElementById('toStep2');
        if (next) { next.hidden = false; next.disabled = false; }
      })
      .catch(function () {
        status.className = 'form-hint is-error';
        status.innerHTML = 'Ich konnte den Shop nicht automatisch messen (URL erreichbar?). '
          + 'Du kannst trotzdem <button type="button" id="skipToRoi" class="linklike">weiter zum Umsatz-Rechner</button>.';
        var skip = document.getElementById('skipToRoi');
        if (skip) skip.addEventListener('click', function () { enterStep2(); });
      })
      .finally(function () { submit.disabled = false; });
  });

  var toStep2 = document.getElementById('toStep2');
  if (toStep2) toStep2.addEventListener('click', enterStep2);

  /* ---------- STEP 2: ROI ---------- */
  var revenue = document.getElementById('roiRevenue');
  var revenueOut = document.getElementById('roiRevenueOut');
  var amountEl = document.getElementById('roiAmount');
  var noteEl = document.getElementById('roiNote');
  var lcpEcho = document.getElementById('lcpEcho');
  var TARGET = 2, LOSS = 0.07, CAP = 0.5;

  function computeRoi() {
    var rev = parseFloat(revenue.value);
    var t = state.lcp || 4;
    state.revenue = rev;
    revenueOut.textContent = num.format(rev) + ' €';
    var extra = Math.max(0, t - TARGET);
    var frac = Math.min(CAP, extra * LOSS);
    var yearly = rev * 12 * (frac / (1 - frac || 1));
    state.yearly = Math.round(yearly);
    amountEl.textContent = euro.format(state.yearly);
    noteEl.textContent = extra <= 0
      ? 'Deine Ladezeit ist bereits top — weiter so!'
      : 'Rund ' + Math.round(frac * 100) + ' % mehr Conversions sind realistisch, wenn dein Shop auf ~' + TARGET + ' s kommt.';
  }
  revenue.addEventListener('input', computeRoi);

  function enterStep2() {
    lcpEcho.textContent = state.lcp ? secStr(state.lcp) : 'unbekannt';
    computeRoi();
    goTo(2);
  }

  /* ---------- STEP 3: recap + lead ---------- */
  var toStep3 = document.getElementById('toStep3');
  var recap = document.getElementById('recap');
  var leadForm = document.getElementById('leadForm');
  var leadShop = document.getElementById('lf-shop');
  var leadStatus = document.getElementById('leadStatus');
  var leadSubmit = document.getElementById('leadSubmit');

  if (toStep3) toStep3.addEventListener('click', function () {
    var chips = [];
    if (state.score !== null) chips.push('<span class="recap__chip">Speed: <strong>' + state.score + '/100</strong> · ' + state.grade + '</span>');
    if (state.yearly > 0) chips.push('<span class="recap__chip recap__chip--accent">Potenzial: <strong>' + euro.format(state.yearly) + ' / Jahr</strong></span>');
    recap.innerHTML = chips.join('');
    leadShop.value = state.url || '';
    goTo(3);
  });

  if (leadForm) leadForm.addEventListener('submit', function (e) {
    e.preventDefault();
    if (leadForm.website.value) return;
    if (!leadForm.checkValidity()) { leadForm.reportValidity(); return; }
    leadSubmit.disabled = true;
    leadStatus.className = 'form-hint';
    leadStatus.textContent = 'Wird gesendet …';
    fetch(leadForm.action, { method: 'POST', body: new FormData(leadForm) })
      .then(function (r) { if (!r.ok) throw new Error('bad'); return r.json().catch(function () { return {}; }); })
      .then(function () {
        leadForm.reset();
        leadStatus.className = 'form-hint is-success';
        leadStatus.textContent = 'Danke! Ich schaue mir deinen Shop an und melde mich mit deinem Video innerhalb von 24 Stunden.';
      })
      .catch(function () {
        leadStatus.className = 'form-hint is-error';
        leadStatus.innerHTML = 'Es gab ein Problem beim Senden. Schreib mir direkt an <a href="mailto:info@mikaschieferdecker.de" style="color:var(--accent);">info@mikaschieferdecker.de</a>.';
      })
      .finally(function () { leadSubmit.disabled = false; });
  });
})();
