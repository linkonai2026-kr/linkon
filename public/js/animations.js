/* ===== SCROLL REVEAL (IntersectionObserver) ===== */
(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var serviceCards = Array.prototype.slice.call(
    document.querySelectorAll('.services-grid .service-card[data-animate]')
  );
  var serviceCardsRevealed = false;

  function revealServiceCards() {
    if (serviceCardsRevealed || !serviceCards.length) return;
    serviceCardsRevealed = true;

    serviceCards.forEach(function (card, index) {
      window.setTimeout(function () {
        card.classList.add('is-visible');
      }, index * 100);
      observer.unobserve(card);
    });
  }

  if (prefersReducedMotion) {
    document.querySelectorAll('[data-animate]').forEach(function (el) {
      el.classList.add('is-visible');
    });
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;

        if (entry.target.classList.contains('service-card')) {
          revealServiceCards();
          return;
        }

        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.08,
      rootMargin: '0px 0px -24px 0px'
    }
  );

  function initObserver() {
    var elements = document.querySelectorAll('[data-animate]');

    elements.forEach(function (el) {
      if (el.classList.contains('service-card')) {
        observer.observe(el);
        return;
      }

      var rect = el.getBoundingClientRect();
      var inViewport = rect.top < window.innerHeight && rect.bottom > 0;

      if (inViewport) {
        var delay = parseInt(el.dataset.delay || '0', 10);
        window.setTimeout(function () {
          el.classList.add('is-visible');
        }, delay);
      } else {
        observer.observe(el);
      }
    });

    if (serviceCards.length) {
      var firstCard = serviceCards[0];
      var cardRect = firstCard.getBoundingClientRect();
      var cardsInViewport = cardRect.top < window.innerHeight && cardRect.bottom > 0;

      if (cardsInViewport) {
        revealServiceCards();
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initObserver);
  } else {
    initObserver();
  }
})();
