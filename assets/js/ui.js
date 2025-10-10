// ================================
// ui.js — Core UI interactions and component behavior
// - Responsive navigation menu and hamburger toggle
// - Modal handling (open/close)
// - Tabs and accordions
// - Sliders (hero + testimonials)
// - Scroll-to-top button
// ================================

(function () {
  'use strict';

  const { qs, qsa, debounce } = window.Acumen.utils;

  /* ---------- Responsive Navigation ---------- */
  function initNavigation() {
    const menuBtn = qs('.menu-toggle');
    const nav = qs('.nav-menu');
    if (!menuBtn || !nav) return;

    menuBtn.addEventListener('click', () => {
      nav.classList.toggle('active');
      menuBtn.classList.toggle('open');
      document.body.classList.toggle('no-scroll');
    });

    // Close menu when clicking a link
    qsa('.nav-menu a').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('active');
        menuBtn.classList.remove('open');
        document.body.classList.remove('no-scroll');
      });
    });
  }

  /* ---------- Modal Windows ---------- */
  function initModals() {
    const modalTriggers = qsa('[data-modal]');
    const modals = qsa('.modal');

    modalTriggers.forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = trigger.dataset.modal;
        const modal = qs(`#${targetId}`);
        if (modal) {
          modal.classList.add('active');
          document.body.classList.add('no-scroll');
        }
      });
    });

    modals.forEach(modal => {
      const closeBtn = modal.querySelector('.modal-close');
      if (closeBtn) {
        closeBtn.addEventListener('click', () => closeModal(modal));
      }
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal(modal);
      });
    });

    function closeModal(modal) {
      modal.classList.remove('active');
      document.body.classList.remove('no-scroll');
    }
  }

  /* ---------- Tabs ---------- */
  function initTabs() {
    const tabContainers = qsa('.tabs');
    if (!tabContainers.length) return;

    tabContainers.forEach(container => {
      const tabs = qsa('.tab', container);
      const panels = qsa('.tab-panel', container);

      tabs.forEach(tab => {
        tab.addEventListener('click', () => {
          const target = tab.dataset.tab;

          tabs.forEach(t => t.classList.remove('active'));
          panels.forEach(p => p.classList.remove('active'));

          tab.classList.add('active');
          qs(`.tab-panel[data-panel="${target}"]`, container)?.classList.add('active');
        });
      });
    });
  }

  /* ---------- Accordion ---------- */
  function initAccordions() {
    const accordions = qsa('.accordion');
    accordions.forEach(acc => {
      const items = qsa('.accordion-item', acc);
      items.forEach(item => {
        const header = qs('.accordion-header', item);
        header.addEventListener('click', () => {
          item.classList.toggle('open');
        });
      });
    });
  }

  /* ---------- Sliders (Hero & Testimonials) ---------- */
  function initSliders() {
    const sliders = qsa('.slider');
    sliders.forEach(slider => {
      const slides = qsa('.slide', slider);
      const nextBtn = qs('.slider-next', slider);
      const prevBtn = qs('.slider-prev', slider);
      let current = 0;

      function showSlide(index) {
        slides.forEach((s, i) => s.classList.toggle('active', i === index));
      }

      if (nextBtn) {
        nextBtn.addEventListener('click', () => {
          current = (current + 1) % slides.length;
          showSlide(current);
        });
      }
      if (prevBtn) {
        prevBtn.addEventListener('click', () => {
          current = (current - 1 + slides.length) % slides.length;
          showSlide(current);
        });
      }

      // Auto-slide
      setInterval(() => {
        current = (current + 1) % slides.length;
        showSlide(current);
      }, 7000);

      showSlide(current);
    });
  }

  /* ---------- Scroll to Top ---------- */
  function initScrollTop() {
    const btn = qs('.scroll-top');
    if (!btn) return;

    window.addEventListener('scroll', debounce(() => {
      btn.classList.toggle('visible', window.scrollY > 300);
    }, 50));

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- Initialize All UI Components ---------- */
  document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initModals();
    initTabs();
    initAccordions();
    initSliders();
    initScrollTop();
  });

  // Expose
  window.Acumen.ui = {
    initNavigation,
    initModals,
    initTabs,
    initAccordions,
    initSliders,
    initScrollTop
  };
})();
