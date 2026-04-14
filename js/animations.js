/* ===== SCROLL REVEAL (IntersectionObserver) ===== */
(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    document.querySelectorAll('[data-animate]').forEach(function (el) {
      el.classList.add('is-visible');
    });
    return;
  }

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.08,
      rootMargin: '0px 0px -20px 0px',
    }
  );

  function initObserver() {
    var elements = document.querySelectorAll('[data-animate]');

    elements.forEach(function (el) {
      var rect = el.getBoundingClientRect();
      var inViewport = rect.top < window.innerHeight && rect.bottom > 0;

      if (inViewport) {
        // 이미 화면 안에 있는 요소 — 딜레이 후 즉시 표시
        var delay = parseInt(el.dataset.delay || '0', 10);
        setTimeout(function () {
          el.classList.add('is-visible');
        }, delay);
      } else {
        observer.observe(el);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initObserver);
  } else {
    initObserver();
  }
})();
