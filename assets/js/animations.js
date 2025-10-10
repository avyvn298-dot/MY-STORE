// ================================
// animations.js — Advanced animation and parallax control
// - Scroll-triggered parallax effects
// - Element fade, scale, and rotation animations
// - Smooth reveal chaining between sections
// - Interaction-based micro-animations (hover, focus)
// ================================

(function () {
  'use strict';

  const { debounce, qs, qsa } = window.Acumen.utils;

  /* ---------- Scroll-based Parallax ---------- */
  function initParallax() {
    const elements = qsa('[data-parallax]');
    if (!elements.length) return;

    function updateParallax() {
      const scrollY = window.scrollY;
      elements.forEach(el => {
        const speed = parseFloat(el.dataset.parallax) || 0.3;
        const offset = el.getBoundingClientRect().top + scrollY;
        const translateY = (scrollY - offset) * speed;
        el.style.transform = `translateY(${translateY}px)`;
      });
    }

    window.addEventListener('scroll', debounce(updateParallax, 10));
    updateParallax();
  }

  /* ---------- Sequential Section Reveal ---------- */
  function initSequentialReveal() {
    const sections = qsa('.section-reveal');
    if (!sections.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const children = qsa('.reveal-child', entry.target);
          children.forEach((child, i) => {
            setTimeout(() => {
              child.classList.add('visible');
            }, i * 150);
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    sections.forEach(section => observer.observe(section));
  }

  /* ---------- Micro Interactions (hover/focus) ---------- */
  function initMicroInteractions() {
    const interactive = qsa('[data-hover-effect]');
    interactive.forEach(el => {
      const type = el.dataset.hoverEffect;
      switch (type) {
        case 'tilt':
          addTiltEffect(el);
          break;
        case 'glow':
          addGlowEffect(el);
          break;
        default:
          addBasicHover(el);
      }
    });
  }

  function addTiltEffect(el) {
    const strength = parseFloat(el.dataset.tiltStrength) || 10;
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * strength;
      const rotateY = ((x - centerX) / centerX) * -strength;
      el.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = 'rotateX(0) rotateY(0)';
    });
  }

  function addGlowEffect(el) {
    el.addEventListener('mouseenter', () => {
      el.classList.add('glow');
    });
    el.addEventListener('mouseleave', () => {
      el.classList.remove('glow');
    });
  }

  function addBasicHover(el) {
    el.addEventListener('mouseenter', () => {
      el.style.transform = 'scale(1.05)';
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = 'scale(1)';
    });
  }

  /* ---------- Header Fade / Blur on Scroll ---------- */
  function initHeaderEffects() {
    const header = qs('.main-header');
    if (!header) return;

    function updateHeader() {
      const scrolled = window.scrollY;
      header.style.backdropFilter = scrolled > 50 ? 'blur(8px)' : 'none';
      header.style.background = scrolled > 50 ? 'rgba(20,20,20,0.6)' : 'transparent';
    }

    window.addEventListener('scroll', debounce(updateHeader, 20));
    updateHeader();
  }

  /* ---------- Smooth Fade-In for Images ---------- */
  function initImageFade() {
    const imgs = qsa('img.fade-in');
    imgs.forEach(img => {
      if (img.complete) {
        img.classList.add('visible');
      } else {
        img.addEventListener('load', () => img.classList.add('visible'));
      }
    });
  }

  /* ---------- Initialize All Animations ---------- */
  document.addEventListener('DOMContentLoaded', () => {
    initParallax();
    initSequentialReveal();
    initMicroInteractions();
    initHeaderEffects();
    initImageFade();
  });

  // Expose if needed
  window.Acumen.animations = {
    initParallax,
    initSequentialReveal,
    initMicroInteractions,
    initHeaderEffects,
    initImageFade
  };

})();
