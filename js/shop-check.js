/* =========================================================================
   Shop-Check — three interactive tools:
   1) Live speed check (Google PageSpeed Insights API)
   2) Load-time revenue (ROI) calculator
   3) Shop self-test quiz
   Vanilla JS, progressive enhancement.
   ========================================================================= */
(function () {
  'use strict';

  /* ============ 1) LIVE SPEED-CHECK ============ */
  // Kostenlosen Google-API-Key hier eintragen (console.cloud.google.com →
  // "PageSpeed Insights API" aktivieren → API-Key erstellen). Ohne Key
  // funktioniert der Test oft trotzdem, ist aber stärker limitiert.
  var PSI_API_KEY = '';

  (function speedCheck() {
    var form = document.getElementById('speedForm');
    if (!form) return;
    var input = document.getElementById('speedUrl');
    var submit = document.getElementById('speedSubmit');
    var status = document.getElementById('speedStatus');
    var result = document.getElementById('speedResult');
    var ring = document.getElementById('gaugeRing');
    var scoreNum = document.getElementById('speedScoreNum');
    var verdict = document.getElementById('speedVerdict');
    var metrics = document.getElementById('speedMetrics');
    var CIRC = 2 * Math.PI * 52;

    ring.style.strokeDasharray = CIRC.toFixed(1);
    ring.style.strokeDashoffset = CIRC.toFixed(1);

    function colorFor(score) {
      if (score >= 90) return '#3f9973';
      if (score >= 50) return '#d9a441';
      return '#c2593f';
    }
    function verdictFor(score) {
      if (score >= 90) return 'Stark! Dein Shop lädt schon richtig schnell.';
      if (score >= 50) return 'Solide — aber da geht noch einiges. Ein paar Stellschrauben bringen spürbar mehr Speed.';
      return 'Hier liegt bares Geld auf der Straße: Deutlich zu langsam, das kostet dich Conversions.';
    }

    function animateScore(score) {
      var color = colorFor(score);
      ring.style.stroke = color;
      ring.style.strokeDashoffset = (CIRC * (1 - score / 100)).toFixed(1);
      scoreNum.style.color = color;
      var cur = 0;
      var step = Math.max(1, Math.round(score / 30));
      var t = setInterval(function () {
        cur = Math.min(score, cur + step);
        scoreNum.textContent = cur;
        if (cur >= score) clearInterval(t);
      }, 24);
      verdict.textContent = verdictFor(score);
    }

    function metricRow(label, value) {
      var li = document.createElement('li');
      li.className = 'metric';
      li.innerHTML = '<span class="metric__label">' + label + '</span><span class="metric__value">' + value + '</span>';
      return li;
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var url = input.value.trim();
      if (!url) { input.focus(); return; }
      if (!/^https?:\/\//i.test(url)) url = 'https://' + url;

      submit.disabled = true;
      status.className = 'form-hint';
      status.textContent = 'Analysiere ' + url + ' … das dauert 10–30 Sekunden.';
      result.hidden = true;

      var api = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed'
        + '?url=' + encodeURIComponent(url)
        + '&strategy=mobile&category=performance'
        + (PSI_API_KEY ? '&key=' + PSI_API_KEY : '');

      fetch(api)
        .then(function (r) { return r.json(); })
        .then(function (data) {
          if (!data.lighthouseResult) throw new Error(data.error ? data.error.message : 'no result');
          var lh = data.lighthouseResult;
          var score = Math.round(lh.categories.performance.score * 100);
          var a = lh.audits || {};
          metrics.innerHTML = '';
          [['Largest Contentful Paint', 'largest-contentful-paint'],
           ['Cumulative Layout Shift', 'cumulative-layout-shift'],
           ['Total Blocking Time', 'total-blocking-time'],
           ['First Contentful Paint', 'first-contentful-paint']].forEach(function (m) {
            if (a[m[1]] && a[m[1]].displayValue) metrics.appendChild(metricRow(m[0], a[m[1]].displayValue));
          });
          result.hidden = false;
          animateScore(score);
          status.textContent = '';
        })
        .catch(function () {
          status.className = 'form-hint is-error';
          status.innerHTML = 'Konnte den Shop nicht automatisch messen (URL erreichbar?). '
            + 'Fordere gern die <a href="/shop-analyse.html" style="color:var(--accent);text-decoration:underline;">vollständige Analyse</a> an.';
        })
        .finally(function () { submit.disabled = false; });
    });
  })();

  /* ============ 2) ROI / LADEZEIT-RECHNER ============ */
  (function roi() {
    var revenue = document.getElementById('roiRevenue');
    if (!revenue) return;
    var load = document.getElementById('roiLoad');
    var revenueOut = document.getElementById('roiRevenueOut');
    var loadOut = document.getElementById('roiLoadOut');
    var amountEl = document.getElementById('roiAmount');
    var noteEl = document.getElementById('roiNote');

    var euro = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
    var num = new Intl.NumberFormat('de-DE');

    var TARGET = 2;       // Ziel-Ladezeit in Sekunden
    var LOSS_PER_SEC = 0.07;
    var CAP = 0.5;

    function compute() {
      var rev = parseFloat(revenue.value);
      var t = parseFloat(load.value);
      revenueOut.textContent = num.format(rev) + ' €';
      loadOut.textContent = t.toFixed(1).replace('.', ',') + ' s';

      var extra = Math.max(0, t - TARGET);
      var lostFraction = Math.min(CAP, extra * LOSS_PER_SEC);
      // zusätzlich möglicher Jahresumsatz, wenn auf Zielzeit optimiert
      var yearly = rev * 12 * (lostFraction / (1 - lostFraction || 1));
      amountEl.textContent = euro.format(Math.round(yearly));
      if (extra <= 0) {
        noteEl.textContent = 'Deine Ladezeit ist bereits im grünen Bereich — top!';
      } else {
        noteEl.textContent = 'Rund ' + Math.round(lostFraction * 100) + ' % mehr Conversions sind realistisch, wenn dein Shop auf ~' + TARGET + ' s kommt.';
      }
    }
    revenue.addEventListener('input', compute);
    load.addEventListener('input', compute);
    compute();
  })();

  /* ============ 3) SHOP-SELBSTTEST QUIZ ============ */
  (function quiz() {
    var form = document.getElementById('quizForm');
    if (!form) return;
    var list = document.getElementById('quizList');
    var result = document.getElementById('quizResult');
    var scoreNum = document.getElementById('quizScoreNum');
    var verdict = document.getElementById('quizVerdict');
    var tips = document.getElementById('quizTips');

    var questions = [
      { q: 'Lädt dein Shop auf dem Handy in unter 3 Sekunden?', tip: 'Performance optimieren — Bilder, Apps und Theme-Code verschlanken.' },
      { q: 'Hast du einen klaren Call-to-Action „above the fold"?', tip: 'Ein eindeutiger Button/Nutzen direkt oben, ohne Scrollen.' },
      { q: 'Zeigst du Trust-Signale (Bewertungen, Siegel, Versandinfos)?', tip: 'Sozialen Beweis und Sicherheit sichtbar platzieren.' },
      { q: 'Ist dein Checkout in maximal 3 Schritten erledigt?', tip: 'Checkout verkürzen und Ablenkung reduzieren.' },
      { q: 'Sind deine Produktbilder optimiert (WebP, passende Größe)?', tip: 'Bilder komprimieren und in modernen Formaten ausliefern.' },
      { q: 'Nutzt du SEO-Grundlagen (Titel, Meta, strukturierte Daten)?', tip: 'On-Page-SEO und strukturierte Daten ergänzen.' },
      { q: 'Hast du in den letzten 3 Monaten deine Conversion-Rate gemessen?', tip: 'Tracking einrichten und regelmäßig auswerten.' }
    ];

    questions.forEach(function (item, i) {
      var li = document.createElement('li');
      li.className = 'quiz__q';
      li.innerHTML =
        '<span class="quiz__qtext">' + item.q + '</span>' +
        '<span class="quiz__opts" role="radiogroup" aria-label="Antwort">' +
          '<label class="quiz__opt"><input type="radio" name="q' + i + '" value="1"><span>Ja</span></label>' +
          '<label class="quiz__opt"><input type="radio" name="q' + i + '" value="0"><span>Nein</span></label>' +
        '</span>';
      list.appendChild(li);
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var good = 0, answered = 0, missing = [];
      questions.forEach(function (item, i) {
        var sel = form.querySelector('input[name="q' + i + '"]:checked');
        if (sel) { answered++; if (sel.value === '1') good++; else missing.push(item.tip); }
      });
      if (answered < questions.length) {
        var firstUnanswered = questions.findIndex(function (item, i) { return !form.querySelector('input[name="q' + i + '"]:checked'); });
        var el = form.querySelector('input[name="q' + firstUnanswered + '"]');
        if (el) el.focus();
        return;
      }
      var score = Math.round((good / questions.length) * 100);
      scoreNum.textContent = score;
      var color = score >= 71 ? '#3f9973' : score >= 41 ? '#d9a441' : '#c2593f';
      scoreNum.style.color = color;
      verdict.textContent = score >= 71
        ? 'Solide Basis! Mit gezielten Optimierungen holst du noch mehr raus.'
        : score >= 41
          ? 'Luft nach oben. Ein paar Baustellen bremsen deine Conversions.'
          : 'Dringender Handlungsbedarf — hier liegt viel Potenzial brach.';
      if (missing.length) {
        tips.innerHTML = '<p class="quiz__tipshead">Deine wichtigsten Baustellen:</p><ul class="quiz__tips">'
          + missing.map(function (t) { return '<li>' + t + '</li>'; }).join('') + '</ul>';
      } else {
        tips.innerHTML = '<p class="quiz__tipshead">Chapeau — bei dir läuft schon vieles richtig!</p>';
      }
      result.hidden = false;
      result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  })();
})();
