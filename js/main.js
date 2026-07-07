/* Yam studio · Landing v2 — JS mínimo (vanilla, sin librerías) */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var revealItems = Array.prototype.slice.call(document.querySelectorAll('.reveal'));

  /* 1. Reveal sutil (respeta prefers-reduced-motion) */
  function showItem(el) {
    el.classList.add('is-visible');
    revealItems = revealItems.filter(function (item) {
      return item !== el;
    });
  }

  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealItems.slice().forEach(showItem);
  } else {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            observer.unobserve(entry.target);
            showItem(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    revealItems.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* Refuerzo del reveal por si el observer no llega a disparar:
     chequeo liviano por posición, colgado del mismo listener de scroll. */
  function checkReveal() {
    if (!revealItems.length) {
      return;
    }
    var limit = window.innerHeight * 0.9;
    revealItems.slice().forEach(function (el) {
      if (el.getBoundingClientRect().top < limit) {
        showItem(el);
      }
    });
  }

  /* 2. Navbar: se solidifica a crema al scrollear */
  var nav = document.getElementById('nav');

  function onScroll() {
    if (nav) {
      if (window.scrollY > 40) {
        nav.classList.add('is-solid');
      } else {
        nav.classList.remove('is-solid');
      }
    }
    checkReveal();
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('load', checkReveal);
  onScroll();

  /* 3. WhatsApp placeholder: el número está PENDIENTE.
     TODO: reemplazar por el link real de WhatsApp: https://wa.me/54XXXXXXXXXX
     Mientras el href sea "#" (o data-wa esté vacío), el botón no redirige
     ni rompe la página. Cuando se pegue el link real, este preventDefault
     deja de aplicar automáticamente. */
  var waLinks = document.querySelectorAll('[data-wa]');

  Array.prototype.forEach.call(waLinks, function (link) {
    link.addEventListener('click', function (event) {
      var wa = link.getAttribute('data-wa');
      var href = link.getAttribute('href');
      if (!wa && (!href || href === '#')) {
        event.preventDefault();
      }
    });
  });
})();
