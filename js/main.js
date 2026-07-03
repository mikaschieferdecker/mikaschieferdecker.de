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
var nav = document.querySelector('.nav');
var header = document.getElementById('siteHeader');
if (menuToggle && nav) {
  var scrollY = 0;

  var closeMenu = function () {
    nav.classList.remove('is-open');
    if (header) header.classList.remove('menu-open');
    document.body.classList.remove('no-scroll');
    document.body.style.top = '';
    window.scrollTo(0, scrollY);
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Menü öffnen');
  };

  menuToggle.addEventListener('click', function () {
    var open = nav.classList.toggle('is-open');
    if (header) header.classList.toggle('menu-open', open);
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
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();
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

  /* ---------- Project filters ---------- */
  var filters = document.querySelectorAll('.filter');
  var projects = document.querySelectorAll('.project');
  if (filters.length && projects.length) {
    filters.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var cat = btn.getAttribute('data-filter');
        filters.forEach(function (b) {
          var active = b === btn;
          b.classList.toggle('is-active', active);
          b.setAttribute('aria-pressed', String(active));
        });
        projects.forEach(function (p) {
          var cats = p.getAttribute('data-cat') || '';
          var show = cat === 'all' || cats.indexOf(cat) !== -1;
          p.classList.toggle('is-hidden', !show);
        });
      });
    });
  }

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
})();
