// ================================
// script.js — Core site logic for Acumen Watches
// - Mobile nav toggle
// - Smooth scrolling for anchor links
// - Reveal-on-scroll using IntersectionObserver
// - Lazy image loading fallback
// - Back-to-top button
// - Active link highlighting
// - Small utilities (debounce, format currency)
// ================================

(function () {
  'use strict';

  /* ---------- Utilities ---------- */
  function debounce(fn, wait = 100) {
    let t;
    return function (...args) {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, args), wait);
    };
  }

  function qs(selector, ctx = document) { return ctx.querySelector(selector); }
  function qsa(selector, ctx = document) { return Array.from(ctx.querySelectorAll(selector)); }

  /* ---------- DOM Ready ---------- */
  document.addEventListener('DOMContentLoaded', () => {
    initNav();
    initSmoothScroll();
    initRevealOnScroll();
    initLazyImages();
    initBackToTop();
    initActiveLinksOnScroll();
    setFooterYears();
  });

  /* ---------- NAVIGATION (mobile toggle + accessibility) ---------- */
  function initNav() {
    const toggle = qs('.menu-toggle');
    const nav = qs('.nav');
    if (!toggle || !nav) return;

    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      nav.classList.toggle('open');
      // Manage focus for accessibility
      if (!expanded) {
        // trap focus to nav links
        const firstLink = nav.querySelector('a');
        firstLink?.focus();
      } else {
        toggle.focus();
      }
    });

    // close nav when clicking outside on mobile
    document.addEventListener('click', (e) => {
      if (!nav.classList.contains('open')) return;
      const target = e.target;
      if (!nav.contains(target) && !toggle.contains(target)) {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });

    // keyboard support: ESC closes nav
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---------- SMOOTH SCROLL for internal anchors ---------- */
  function initSmoothScroll() {
    // All internal links starting with #
    const links = qsa('a[href^="#"]');
    links.forEach(link => {
      // If link is only '#' or empty, ignore
      const href = link.getAttribute('href');
      if (!href || href === '#') return;

      link.addEventListener('click', (e) => {
        const target = document.querySelector(href);
        if (!target) return; // allow normal behavior
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - getHeaderOffset();
        window.scrollTo({ top, behavior: 'smooth' });
        // update focus for accessibility
        target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
      });
    });

    function getHeaderOffset() {
      const header = qs('.main-header');
      if (!header) return 0;
      return header.offsetHeight + 8; // small gap
    }
  }

  /* ---------- REVEAL ON SCROLL (IntersectionObserver) ---------- */
  function initRevealOnScroll() {
    const elements = qsa('.reveal, .fade-up, .fade-left, .fade-right, .fade-zoom');
    if (!elements.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          entry.target.classList.add('active');
          // if element should animate once, unobserve
          if (entry.target.dataset.once !== 'false') {
            observer.unobserve(entry.target);
          }
        }
      });
    }, { threshold: 0.15 });

    elements.forEach(el => observer.observe(el));
  }

  /* ---------- LAZY IMAGES (JS fallback) ---------- */
  function initLazyImages() {
    // Prefer native loading="lazy" in HTML. This is a fallback for older browsers.
    const lazyImgs = qsa('img[data-src], img[data-srcset]');
    if (!lazyImgs.length) return;

    if ('IntersectionObserver' in window) {
      const imgObserver = new IntersectionObserver((entries, imgObserver) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) img.src = img.dataset.src;
            if (img.dataset.srcset) img.srcset = img.dataset.srcset;
            img.removeAttribute('data-src');
            img.removeAttribute('data-srcset');
            img.addEventListener('load', () => img.classList.add('loaded'));
            imgObserver.unobserve(img);
          }
        });
      }, { rootMargin: '200px 0px' });

      lazyImgs.forEach(img => imgObserver.observe(img));
    } else {
      // Fallback: load all
      lazyImgs.forEach(img => {
        if (img.dataset.src) img.src = img.dataset.src;
        if (img.dataset.srcset) img.srcset = img.dataset.srcset;
        img.classList.add('loaded');
      });
    }
  }

  /* ---------- BACK TO TOP BUTTON ---------- */
  function initBackToTop() {
    // create button
    let btn = qs('#backToTop');
    if (!btn) {
      btn = document.createElement('button');
      btn.id = 'backToTop';
      btn.title = 'Back to top';
      btn.innerHTML = '↑';
      btn.className = 'back-to-top';
      document.body.appendChild(btn);
    }

    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    function toggle() {
      if (window.scrollY > window.innerHeight / 2) btn.classList.add('visible');
      else btn.classList.remove('visible');
    }

    window.addEventListener('scroll', debounce(toggle, 100));
    toggle();
  }

  /* ---------- ACTIVE LINK HIGHLIGHT on scroll ---------- */
  function initActiveLinksOnScroll() {
    const sections = qsa('main [id], header + section[id], section[id]');
    const navLinks = qsa('.nav a');
    if (!sections.length || !navLinks.length) return;

    const sectionMap = sections.map(s => ({ id: s.id, top: () => s.getBoundingClientRect().top + window.scrollY }));

    function onScroll() {
      const scrollPos = window.scrollY + (qs('.main-header')?.offsetHeight || 60) + 20;
      let currentId = '';
      for (let i = 0; i < sectionMap.length; i++) {
        const s = sectionMap[i];
        if (scrollPos >= s.top()) currentId = s.id;
      }

      navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (!href || href.charAt(0) !== '#') {
          // also support full path links to pages
          const linkPath = link.getAttribute('href')?.split('/').pop();
          if (linkPath && linkPath === window.location.pathname.split('/').pop()) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
          return;
        }

        const id = href.replace('#', '');
        if (id === currentId) link.classList.add('active');
        else link.classList.remove('active');
      });
    }

    window.addEventListener('scroll', debounce(onScroll, 80));
    onScroll();
  }

  /* ---------- FOOTER YEAR FALLBACK ---------- */
  function setFooterYears() {
    const yearEls = qsa('[id^="year"]');
    if (!yearEls.length) return;
    const y = new Date().getFullYear();
    yearEls.forEach(el => el.textContent = y);
  }

  /* ---------- Format helpers (optional) ---------- */
  function formatCurrency(value, currency = 'USD') {
    try {
      return new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(value);
    } catch (e) {
      return '$' + Number(value).toFixed(2);
    }
  }

  // Expose small utilities if needed elsewhere
  window.Acumen = window.Acumen || {};
  window.Acumen.utils = { debounce, qs, qsa, formatCurrency };

})();
