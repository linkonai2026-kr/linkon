/* ===== MAIN.JS ===== */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    initNav();
    initMobileMenu();
    initSmoothScroll();
    initTeaserTabs();
    initNotifyForms();
  });

  /* ===== 1. 네비게이션 스크롤 ===== */
  function initNav() {
    var nav = document.getElementById('nav');
    if (!nav) return;

    function updateNav() {
      nav.classList.toggle('nav--scrolled', window.scrollY > 60);
    }

    window.addEventListener('scroll', updateNav, { passive: true });
    updateNav(); // 초기 실행
  }

  /* ===== 2. 모바일 햄버거 메뉴 ===== */
  function initMobileMenu() {
    var hamburger = document.getElementById('hamburger');
    var drawer    = document.getElementById('drawer');
    var overlay   = document.getElementById('nav-overlay');
    if (!hamburger || !drawer || !overlay) return;

    function openMenu() {
      hamburger.classList.add('is-open');
      drawer.classList.add('is-open');
      overlay.classList.add('is-visible');
      hamburger.setAttribute('aria-expanded', 'true');
      drawer.setAttribute('aria-hidden', 'false');
      overlay.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
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
      var isOpen = hamburger.classList.contains('is-open');
      isOpen ? closeMenu() : openMenu();
    });

    overlay.addEventListener('click', closeMenu);

    // ESC 키로 닫기
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && drawer.classList.contains('is-open')) {
        closeMenu();
        hamburger.focus();
      }
    });

    // 드로어 내 링크 클릭 시 닫기
    drawer.querySelectorAll('.nav__drawer-link, .nav__drawer-cta').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });
  }

  /* ===== 3. 부드러운 스크롤 ===== */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        var targetId = link.getAttribute('href');
        if (targetId === '#') return;

        var target = document.querySelector(targetId);
        if (!target) return;

        e.preventDefault();

        var navHeight = parseInt(getComputedStyle(document.documentElement)
          .getPropertyValue('--nav-height')) || 68;

        var top = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;

        window.scrollTo({ top: top, behavior: 'smooth' });
      });
    });
  }

  /* ===== 4. Coming Soon 티저 탭 ===== */
  function initTeaserTabs() {
    var tabs   = document.querySelectorAll('.teaser-tab');
    var panels = document.querySelectorAll('.teaser-panel');
    if (!tabs.length || !panels.length) return;

    var autoTimer = null;
    var tabIds = ['rion', 'taxon'];
    var currentIndex = 0;

    function switchTab(tabId) {
      tabs.forEach(function (tab) {
        var isActive = tab.dataset.tab === tabId;
        tab.classList.toggle('active', isActive);
        tab.setAttribute('aria-pressed', String(isActive));
      });

      panels.forEach(function (panel) {
        var isActive = panel.id === 'panel-' + tabId;
        panel.classList.toggle('active', isActive);
        if (isActive) {
          // 애니메이션 리셋
          panel.style.animation = 'none';
          panel.offsetHeight; // reflow
          panel.style.animation = '';
        }
      });

      currentIndex = tabIds.indexOf(tabId);
    }

    function startAutoRotation() {
      stopAutoRotation();
      autoTimer = setInterval(function () {
        currentIndex = (currentIndex + 1) % tabIds.length;
        switchTab(tabIds[currentIndex]);
      }, 4000);
    }

    function stopAutoRotation() {
      if (autoTimer) {
        clearInterval(autoTimer);
        autoTimer = null;
      }
    }

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        stopAutoRotation();
        switchTab(tab.dataset.tab);
        // 사용자가 클릭한 후 5초 뒤 자동 재시작
        setTimeout(startAutoRotation, 5000);
      });
    });

    // 페이지가 화면에 보일 때만 자동 로테이션
    var teaserSection = document.getElementById('coming-soon');
    if (teaserSection && 'IntersectionObserver' in window) {
      var sectionObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          entry.isIntersecting ? startAutoRotation() : stopAutoRotation();
        });
      }, { threshold: 0.3 });
      sectionObserver.observe(teaserSection);
    } else {
      startAutoRotation();
    }
  }

  /* ===== 5. 출시 알림 폼 ===== */
  function initNotifyForms() {
    document.querySelectorAll('.notify-form').forEach(function (form) {
      var input   = form.querySelector('.notify-form__input');
      var success = form.querySelector('.notify-form__success');
      var service = form.dataset.service || 'service';

      form.addEventListener('submit', function (e) {
        e.preventDefault();

        var email = input.value.trim();

        if (!isValidEmail(email)) {
          input.style.color = 'var(--taxon-primary)';
          input.focus();
          setTimeout(function () { input.style.color = ''; }, 1200);
          return;
        }

        // localStorage에 저장
        try {
          var key = 'linkon_notify_' + service;
          var existing = JSON.parse(localStorage.getItem(key) || '[]');
          if (!existing.includes(email)) {
            existing.push(email);
            localStorage.setItem(key, JSON.stringify(existing));
          }
        } catch (err) {
          // localStorage 사용 불가 시 무시
        }

        // 성공 메시지
        success.textContent = '감사합니다! 출시 시 알려드리겠습니다. 🎉';
        input.value = '';
        form.querySelector('.notify-form__row').style.opacity = '0.5';

        setTimeout(function () {
          success.textContent = '';
          form.querySelector('.notify-form__row').style.opacity = '';
        }, 5000);
      });
    });
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

})();
