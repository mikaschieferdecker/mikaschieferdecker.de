/* =========================================================================
   Mika Schieferdecker — Portfolio interactions
   Vanilla JS, no dependencies. Everything is progressive enhancement.
   ========================================================================= */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Mobile menu ---------- */
    var menuToggle = document.getElementById('menuToggle');
  var nav = document.querySelector('.header__col--center');
  var header = document.getElementById('siteHeader');
  var backdrop = document.getElementById('navBackdrop');
  if (menuToggle && nav) {
    var scrollY = 0;

    var closeMenu = function () {
      nav.classList.remove('is-open');
      if (header) header.classList.remove('menu-open');
      if (backdrop) backdrop.classList.remove('is-open');
      document.body.classList.remove('no-scroll');
      document.body.style.top = '';
      window.scrollTo(0, scrollY);
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Menü öffnen');
    };

    menuToggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      if (header) header.classList.toggle('menu-open', open);
      if (backdrop) backdrop.classList.toggle('is-open', open);
      menuToggle.setAttribute('aria-expanded', String(open));
      menuToggle.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen');

      if (open) {
        scrollY = window.scrollY;
        document.body.style.top = -scrollY + 'px';
        document.body.classList.add('no-scroll');
      } else {
        document.body.classList.remove('no-scroll');
        document.body.style.top = '';
        window.scrollTo(0, scrollY);
      }
    });

    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) closeMenu();
    });
    if (backdrop) {
      backdrop.addEventListener('click', closeMenu);
    }
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });
  }


  /* ---------- Nav dropdown (Leistungen) ---------- */
  var dropdownItems = document.querySelectorAll('.nav__item--has-dropdown');
  if (dropdownItems.length) {
    dropdownItems.forEach(function (item) {
      var toggle = item.querySelector('.nav__dropdown-toggle');
      if (!toggle) return;
      toggle.addEventListener('click', function (e) {
        e.stopPropagation();
        var open = item.classList.toggle('is-open');
        toggle.setAttribute('aria-expanded', String(open));
      });
    });
    // Klick außerhalb schließt offene Dropdowns (Desktop)
    document.addEventListener('click', function (e) {
      if (e.target.closest('.nav__item--has-dropdown')) return;
      dropdownItems.forEach(function (item) {
        if (!item.classList.contains('is-open')) return;
        item.classList.remove('is-open');
        var t = item.querySelector('.nav__dropdown-toggle');
        if (t) t.setAttribute('aria-expanded', 'false');
      });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      dropdownItems.forEach(function (item) {
        item.classList.remove('is-open');
        var t = item.querySelector('.nav__dropdown-toggle');
        if (t) t.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Header: shadow + hide-on-scroll-down ---------- */
  var header = document.getElementById('siteHeader');
  if (header) {
    var lastY = window.scrollY;
    var ticking = false;
    var onScroll = function () {
      var y = window.scrollY;
      header.classList.toggle('is-scrolled', y > 8);
      if (y > 400 && y > lastY + 4) {
        header.classList.add('is-hidden');
      } else if (y < lastY - 4) {
        header.classList.remove('is-hidden');
      }
      lastY = y;
      ticking = false;
    };
    window.addEventListener('scroll', function () {
      if (!ticking) { window.requestAnimationFrame(onScroll); ticking = true; }
    }, { passive: true });
  }

  /* ---------- Prozess-Timeline (scroll-gefüllte Linie) ---------- */
  var processWrap = document.querySelector('[data-process]');
  if (processWrap) {
    var pTrack = processWrap.querySelector('[data-process-track]');
    var pProgress = processWrap.querySelector('[data-process-progress]');
    var pBadges = [].slice.call(processWrap.querySelectorAll('[data-process-badge]'));

    if (pTrack && pProgress && pBadges.length) {
      var pFirstCenter = 0, pTotalHeight = 0;

      var measureProcess = function () {
        var wrapRect = processWrap.getBoundingClientRect();
        var firstRect = pBadges[0].getBoundingClientRect();
        var lastRect = pBadges[pBadges.length - 1].getBoundingClientRect();
        pFirstCenter = firstRect.top - wrapRect.top + firstRect.height / 2;
        var lastCenter = lastRect.top - wrapRect.top + lastRect.height / 2;
        pTotalHeight = lastCenter - pFirstCenter;
        pTrack.style.top = pFirstCenter + 'px';
        pTrack.style.height = pTotalHeight + 'px';
        pProgress.style.top = pFirstCenter + 'px';
      };

      var updateProcess = function () {
        if (reduceMotion) {
          pProgress.style.height = pTotalHeight + 'px';
          pBadges.forEach(function (b) { b.classList.add('is-active'); });
          return;
        }
        var triggerY = window.innerHeight * 0.55;
        var firstRect = pBadges[0].getBoundingClientRect();
        var lastRect = pBadges[pBadges.length - 1].getBoundingClientRect();
        var firstY = firstRect.top + firstRect.height / 2;
        var lastY = lastRect.top + lastRect.height / 2;
        var raw = lastY === firstY ? 0 : (triggerY - firstY) / (lastY - firstY);
        var pct = Math.max(0, Math.min(1, raw));
        pProgress.style.height = (pct * pTotalHeight) + 'px';
        pBadges.forEach(function (b) {
          var r = b.getBoundingClientRect();
          var center = r.top + r.height / 2;
          b.classList.toggle('is-active', center <= triggerY);
        });
      };

      var pTicking = false;
      var onProcessScroll = function () {
        if (!pTicking) {
          window.requestAnimationFrame(function () { updateProcess(); pTicking = false; });
          pTicking = true;
        }
      };

      measureProcess();
      updateProcess();
      window.addEventListener('scroll', onProcessScroll, { passive: true });
      window.addEventListener('resize', function () { measureProcess(); updateProcess(); });
    }
  }

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var io = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.1 });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Count-up numbers (Zahlen-Band) ---------- */
  var counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    var setFinal = function (el) {
      el.textContent = el.getAttribute('data-count') + (el.getAttribute('data-suffix') || '');
    };
    var runCount = function (el) {
      var target = parseFloat(el.getAttribute('data-count')) || 0;
      var suffix = el.getAttribute('data-suffix') || '';
      var dur = 1400, start = null;
      var tick = function (ts) {
        if (!start) start = ts;
        var p = Math.min(1, (ts - start) / dur);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased) + suffix;
        if (p < 1) requestAnimationFrame(tick); else el.textContent = target + suffix;
      };
      requestAnimationFrame(tick);
    };
    if (reduceMotion || !('IntersectionObserver' in window)) {
      counters.forEach(setFinal);
    } else {
      var cio = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { runCount(e.target); obs.unobserve(e.target); }
        });
      }, { threshold: 0.4 });
      counters.forEach(function (el) { cio.observe(el); });
    }
  }

  /* ---------- Filter bars (Projekte & Blog) ---------- */
  document.querySelectorAll('.filters').forEach(function (bar) {
    var scope = bar.closest('section') || document;
    var btns = bar.querySelectorAll('.filter');
    var items = scope.querySelectorAll('[data-cat]');
    if (!btns.length || !items.length) return;
    bar.addEventListener('click', function (e) {
      var btn = e.target.closest('.filter');
      if (!btn) return;
      var cat = btn.getAttribute('data-filter');
      btns.forEach(function (b) {
        var active = b === btn;
        b.classList.toggle('is-active', active);
        b.setAttribute('aria-pressed', String(active));
      });
      items.forEach(function (p) {
        var cats = (p.getAttribute('data-cat') || '').split(/\s+/);
        var show = cat === 'all' || cats.indexOf(cat) !== -1;
        p.classList.toggle('is-hidden', !show);
      });
    });
  });

  /* ---------- Vorher/Nachher-Slider ---------- */
  document.querySelectorAll('[data-ba]').forEach(function (ba) {
    var range = ba.querySelector('.ba__range');
    var before = ba.querySelector('.ba__before');
    var handle = ba.querySelector('.ba__handle');
    if (!range || !before || !handle) return;
    var apply = function (v) {
      before.style.clipPath = 'inset(0 ' + (100 - v) + '% 0 0)';
      handle.style.left = v + '%';
    };
    range.addEventListener('input', function () { apply(range.value); });
    apply(range.value || 50);
  });

  /* ---------- Contact form → mailto ---------- */
  var form = document.getElementById('contactForm');
  var hint = document.getElementById('formHint');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      var name = form.name.value.trim();
      var email = form.email.value.trim();
      var message = form.message.value.trim();
      var subject = encodeURIComponent('Projektanfrage von ' + name);
      var body = encodeURIComponent(
        message + '\n\n—\n' + name + '\n' + email
      );
      window.location.href =
        'mailto:mika@mikaschieferdecker.de?subject=' + subject + '&body=' + body;
      if (hint) hint.textContent = 'Dein E-Mail-Programm sollte sich geöffnet haben. Danke!';
    });
  }

  /* ---------- Cookie consent ---------- */
  var banner = document.getElementById('cookieBanner');
  var scrim = document.getElementById('cookieScrim');
  var settingsBtn = document.getElementById('cookieSettings');
  if (banner && scrim) {
    var CONSENT_KEY = 'cookie-consent';

    var readConsent = function () {
      try { return localStorage.getItem(CONSENT_KEY); } catch (e) { return null; }
    };
    window.cookieConsent = readConsent();

    // Google Analytics (GA4) — lädt NUR nach "Alle akzeptieren", weil GA
    // Cookies setzt. Trage unten deine Mess-ID ein (Format G-XXXXXXXXXX).
    var GA_ID = 'G-X9YFN6NS35';
    var analyticsLoaded = false;
    var loadAnalytics = function () {
      if (analyticsLoaded || !GA_ID || GA_ID.indexOf('XXXX') !== -1) return;
      analyticsLoaded = true;
      var sc = document.createElement('script');
      sc.async = true;
      sc.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
      document.head.appendChild(sc);
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () { window.dataLayer.push(arguments); };
      window.gtag('js', new Date());
      window.gtag('config', GA_ID, { anonymize_ip: true });
    };
    if (window.cookieConsent === 'all') loadAnalytics();

    var onKey = function (e) {
      // Banner is intentionally not dismissible via Escape — a choice is required.
      if (e.key !== 'Tab') return;
      var f = banner.querySelectorAll('a[href], button');
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };

    var scrollY = 0;
    var lockScroll = function () {
      scrollY = window.scrollY || window.pageYOffset || 0;
      document.body.style.top = -scrollY + 'px';
      document.body.classList.add('no-scroll');
    };
    var unlockScroll = function () {
      document.body.classList.remove('no-scroll');
      document.body.style.top = '';
      window.scrollTo(0, scrollY);
    };

    var showBanner = function () {
      banner.hidden = false;
      scrim.hidden = false;
      lockScroll();
      window.requestAnimationFrame(function () {
        banner.classList.add('is-visible');
        scrim.classList.add('is-visible');
      });
      // Move focus into the dialog itself (not a button) so no button shows
      // a focus ring on open; keyboard users can still Tab to the actions.
      banner.focus();
      document.addEventListener('keydown', onKey);
    };

    var hideBanner = function () {
      banner.classList.remove('is-visible');
      scrim.classList.remove('is-visible');
      document.removeEventListener('keydown', onKey);
      unlockScroll();
      window.setTimeout(function () {
        banner.hidden = true;
        scrim.hidden = true;
      }, reduceMotion ? 0 : 320);
    };

    var setConsent = function (value) {
      try { localStorage.setItem(CONSENT_KEY, value); } catch (e) {}
      window.cookieConsent = value;
      if (value === 'all') loadAnalytics();
      hideBanner();
      // preventScroll: the settings link lives in the footer — focusing it
      // without this would scroll the page down to it.
      if (settingsBtn) settingsBtn.focus({ preventScroll: true });
    };

    banner.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-consent]');
      if (btn) setConsent(btn.getAttribute('data-consent'));
    });
    // The scrim intentionally has no click handler: clicking outside must NOT
    // dismiss the banner — the user has to pick one of the two buttons.
    if (settingsBtn) {
      settingsBtn.addEventListener('click', function (e) { e.preventDefault(); showBanner(); });
    }

    // Defer the banner until the first user interaction (scroll / click /
    // touch / key) so the initial page load stays light and fast. A timeout
    // fallback makes sure it still appears for users who just read.
    if (!window.cookieConsent) {
      var deferEvents = ['scroll', 'pointerdown', 'keydown', 'touchstart', 'wheel'];
      var fired = false;
      var fallbackTimer;
      var triggerBanner = function () {
        if (fired) return;
        fired = true;
        deferEvents.forEach(function (ev) { window.removeEventListener(ev, triggerBanner); });
        window.clearTimeout(fallbackTimer);
        showBanner();
      };
      deferEvents.forEach(function (ev) {
        window.addEventListener(ev, triggerBanner, { passive: true });
      });
      fallbackTimer = window.setTimeout(triggerBanner, 4000);
    }
  }
})();
