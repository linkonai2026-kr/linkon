/* ===== MAIN.JS ===== */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    initNav();
    initMobileMenu();
    initSmoothScroll();
    initAboutDiagram();
    initTeaserTabs();
    initNotifyForms();
    initCountUp();
  });

  function getTranslation(key, fallback) {
    if (window.LinkonI18n && typeof window.LinkonI18n.t === 'function') {
      return window.LinkonI18n.t(key);
    }

    return fallback || key;
  }

  /* ===== 1. Navigation ===== */
  function initNav() {
    var nav = document.getElementById('nav');
    if (!nav) return;

    function updateNav() {
      nav.classList.toggle('nav--scrolled', window.scrollY > 60);
    }

    window.addEventListener('scroll', updateNav, { passive: true });
    updateNav();
  }

  /* ===== 2. Mobile Menu ===== */
  function initMobileMenu() {
    var hamburger = document.getElementById('hamburger');
    var drawer = document.getElementById('drawer');
    var overlay = document.getElementById('nav-overlay');
    if (!hamburger || !drawer || !overlay) return;

    function getFocusableEls() {
      return Array.prototype.slice.call(
        drawer.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')
      ).filter(function (el) { return !el.closest('[hidden]'); });
    }

    function openMenu() {
      hamburger.classList.add('is-open');
      drawer.classList.add('is-open');
      overlay.classList.add('is-visible');
      hamburger.setAttribute('aria-expanded', 'true');
      drawer.setAttribute('aria-hidden', 'false');
      overlay.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      var focusable = getFocusableEls();
      if (focusable.length) focusable[0].focus();
    }

    function closeMenu() {
      hamburger.classList.remove('is-open');
      drawer.classList.remove('is-open');
      overlay.classList.remove('is-visible');
      hamburger.setAttribute('aria-expanded', 'false');
      drawer.setAttribute('aria-hidden', 'true');
      overlay.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    hamburger.addEventListener('click', function () {
      if (hamburger.classList.contains('is-open')) {
        closeMenu();
        hamburger.focus();
      } else {
        openMenu();
      }
    });

    overlay.addEventListener('click', closeMenu);

    /* Focus trap inside drawer */
    drawer.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        closeMenu();
        hamburger.focus();
        return;
      }
      if (event.key !== 'Tab') return;
      var focusable = getFocusableEls();
      if (!focusable.length) return;
      var first = focusable[0];
      var last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && drawer.classList.contains('is-open')) {
        closeMenu();
        hamburger.focus();
      }
    });

    drawer.querySelectorAll('.nav__drawer-link, .nav__drawer-cta').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });
  }

  /* ===== 3. Smooth Scroll ===== */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function (event) {
        var targetId = link.getAttribute('href');
        if (targetId === '#') return;

        var target = document.querySelector(targetId);
        if (!target) return;

        event.preventDefault();

        var navEl = document.getElementById('nav');
        var navHeight = navEl ? navEl.offsetHeight : 68;

        var top = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;
        window.scrollTo({ top: top, behavior: 'smooth' });
      });
    });
  }

  /* ===== 4. About Diagram ===== */
  function initAboutDiagram() {
    var diagram = document.querySelector('.service-diagram');
    if (!diagram) return;

    var nodes = Array.prototype.slice.call(diagram.querySelectorAll('[data-service-node]'));
    var panels = Array.prototype.slice.call(diagram.querySelectorAll('[data-service-panel]'));

    function activateService(service) {
      nodes.forEach(function (node) {
        var isActive = node.getAttribute('data-service-node') === service;
        node.classList.toggle('is-active', isActive);
        node.setAttribute('aria-pressed', String(isActive));
      });

      panels.forEach(function (panel) {
        var isActive = panel.getAttribute('data-service-panel') === service;
        panel.classList.toggle('is-active', isActive);
        panel.hidden = !isActive;
      });

      diagram.setAttribute('data-active-service', service);
    }

    nodes.forEach(function (node) {
      var service = node.getAttribute('data-service-node');

      node.addEventListener('mouseenter', function () {
        activateService(service);
      });

      node.addEventListener('focus', function () {
        activateService(service);
      });

      node.addEventListener('click', function () {
        activateService(service);
      });
    });

    activateService(diagram.getAttribute('data-active-service') || 'vion');
  }

  /* ===== 5. Coming Soon Tabs ===== */
  function initTeaserTabs() {
    var tabs = Array.prototype.slice.call(document.querySelectorAll('.teaser-tab'));
    var panels = Array.prototype.slice.call(document.querySelectorAll('.teaser-panel'));
    if (!tabs.length || !panels.length) return;

    var autoTimer = null;
    var resumeTimer = null;
    var currentIndex = tabs.findIndex(function (tab) {
      return tab.classList.contains('active');
    });

    if (currentIndex < 0) currentIndex = 0;

    function switchTab(tabId, shouldFocus) {
      tabs.forEach(function (tab, index) {
        var isActive = tab.dataset.tab === tabId;
        tab.classList.toggle('active', isActive);
        tab.setAttribute('aria-selected', String(isActive));
        tab.tabIndex = isActive ? 0 : -1;

        if (isActive) {
          currentIndex = index;
          if (shouldFocus) {
            tab.focus();
          }
        }
      });

      panels.forEach(function (panel) {
        var isActive = panel.id === 'panel-' + tabId;
        panel.classList.toggle('active', isActive);
        panel.hidden = !isActive;

        if (isActive) {
          panel.style.animation = 'none';
          panel.offsetHeight;
          panel.style.animation = '';
        }
      });
    }

    function stopAutoRotation() {
      if (autoTimer) {
        window.clearInterval(autoTimer);
        autoTimer = null;
      }
      if (resumeTimer) {
        window.clearTimeout(resumeTimer);
        resumeTimer = null;
      }
    }

    function startAutoRotation() {
      stopAutoRotation();
      autoTimer = window.setInterval(function () {
        currentIndex = (currentIndex + 1) % tabs.length;
        switchTab(tabs[currentIndex].dataset.tab, false);
      }, 4200);
    }

    function pauseAndResume() {
      stopAutoRotation();
      resumeTimer = window.setTimeout(startAutoRotation, 5000);
    }

    tabs.forEach(function (tab, index) {
      tab.addEventListener('click', function () {
        switchTab(tab.dataset.tab, false);
        pauseAndResume();
      });

      tab.addEventListener('keydown', function (event) {
        var targetIndex = index;

        if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
          targetIndex = (index + 1) % tabs.length;
        } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
          targetIndex = (index - 1 + tabs.length) % tabs.length;
        } else if (event.key === 'Home') {
          targetIndex = 0;
        } else if (event.key === 'End') {
          targetIndex = tabs.length - 1;
        } else {
          return;
        }

        event.preventDefault();
        switchTab(tabs[targetIndex].dataset.tab, true);
        pauseAndResume();
      });
    });

    switchTab(tabs[currentIndex].dataset.tab, false);

    var teaserSection = document.getElementById('coming-soon');
    if (teaserSection && 'IntersectionObserver' in window) {
      var sectionObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            startAutoRotation();
          } else {
            stopAutoRotation();
          }
        });
      }, { threshold: 0.3 });

      sectionObserver.observe(teaserSection);
    } else {
      startAutoRotation();
    }
  }

  /* ===== 6. Notify Forms ===== */
  function initNotifyForms() {
    document.querySelectorAll('.notify-form').forEach(function (form) {
      var input = form.querySelector('.notify-form__input');
      var success = form.querySelector('.notify-form__success');
      var row = form.querySelector('.notify-form__row');
      var submitBtn = form.querySelector('[type="submit"]');
      var service = form.dataset.service || 'service';

      function showError(msg) {
        input.setAttribute('aria-invalid', 'true');
        input.classList.add('is-error');
        success.textContent = msg;
        success.dataset.visible = 'true';
        success.dataset.type = 'error';
        input.focus();
      }

      function clearError() {
        input.removeAttribute('aria-invalid');
        input.classList.remove('is-error');
        success.textContent = '';
        success.dataset.visible = 'false';
        success.dataset.type = '';
      }

      input.addEventListener('input', function () {
        if (input.classList.contains('is-error')) clearError();
      });

      form.addEventListener('submit', function (event) {
        event.preventDefault();

        var email = input.value.trim();

        if (!isValidEmail(email)) {
          showError(getTranslation('notify.error', '올바른 이메일 주소를 입력해 주세요.'));
          return;
        }

        clearError();

        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.dataset.originalText = submitBtn.textContent;
          submitBtn.textContent = getTranslation('notify.loading', '처리 중...');
        }
        if (row) row.style.opacity = '0.6';

        window.setTimeout(function () {
          try {
            var key = 'linkon_notify_' + service;
            var existing = JSON.parse(localStorage.getItem(key) || '[]');
            if (!existing.includes(email)) {
              existing.push(email);
              localStorage.setItem(key, JSON.stringify(existing));
            }
          } catch (err) {
            /* localStorage unavailable */
          }

          success.textContent = getTranslation('notify.success', '감사합니다. 출시 소식을 가장 먼저 전해드릴게요.');
          success.dataset.visible = 'true';
          success.dataset.type = 'success';
          input.value = '';
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = submitBtn.dataset.originalText || '출시 알림 받기';
          }
          if (row) row.style.opacity = '';

          window.setTimeout(function () {
            success.textContent = '';
            success.dataset.visible = 'false';
            success.dataset.type = '';
          }, 5000);
        }, 600);
      });
    });

    document.addEventListener('linkon:langchange', function () {
      document.querySelectorAll('.notify-form__success[data-visible="true"][data-type="success"]').forEach(function (el) {
        el.textContent = getTranslation('notify.success', '감사합니다. 출시 소식을 가장 먼저 전해드릴게요.');
      });
    });
  }

  /* ===== 7. Count Up ===== */
  function initCountUp() {
    var numbers = Array.prototype.slice.call(document.querySelectorAll('.stat-number[data-countup]'));
    if (!numbers.length) return;

    function formatValue(element, value) {
      var suffix = element.getAttribute('data-suffix') || '';
      return String(value) + suffix;
    }

    function setStartValues() {
      numbers.forEach(function (element) {
        if (element.dataset.counted === 'true') {
          element.textContent = formatValue(element, element.getAttribute('data-countup'));
          return;
        }

        element.textContent = formatValue(element, 0);
      });
    }

    function animateValue(element, delay) {
      var target = parseInt(element.getAttribute('data-countup') || '0', 10);
      var duration = 1400;
      var startTime = null;

      window.setTimeout(function () {
        function tick(timestamp) {
          if (!startTime) startTime = timestamp;

          var progress = Math.min((timestamp - startTime) / duration, 1);
          var eased = 1 - Math.pow(1 - progress, 3);
          var currentValue = Math.round(target * eased);

          element.textContent = formatValue(element, currentValue);

          if (progress < 1) {
            window.requestAnimationFrame(tick);
          } else {
            element.textContent = formatValue(element, target);
            element.dataset.counted = 'true';
          }
        }

        window.requestAnimationFrame(tick);
      }, delay);
    }

    function revealCounts() {
      numbers.forEach(function (element, index) {
        if (element.dataset.counted === 'true') return;
        animateValue(element, index * 120);
      });
    }

    setStartValues();

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      numbers.forEach(function (element) {
        element.textContent = formatValue(element, element.getAttribute('data-countup'));
        element.dataset.counted = 'true';
      });
      return;
    }

    var statsSection = document.querySelector('.about-stats');
    if (!statsSection || !('IntersectionObserver' in window)) {
      revealCounts();
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          revealCounts();
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.45
    });

    observer.observe(statsSection);

    document.addEventListener('linkon:langchange', setStartValues);
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
})();
