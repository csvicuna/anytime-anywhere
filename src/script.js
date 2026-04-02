/* ═══════════════════════════════════════════════════
   ANYTIME ANYWHERE MEDITATION · M. Llorente
   script.js
   ═══════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── CUSTOM CURSOR ── */
  const cursor     = document.getElementById('cursor');
  const cursorRing = document.getElementById('cursorRing');

  if (cursor && cursorRing && window.matchMedia('(hover: hover)').matches) {
    document.body.classList.add('no-touch');
    let mx = 0, my = 0, rx = 0, ry = 0;

    document.addEventListener('mousemove', (e) => {
      mx = e.clientX; my = e.clientY;
      cursor.style.transform = `translate(${mx - 4.5}px, ${my - 4.5}px)`;
    });

    // Lagged ring follow
    function animateRing() {
      rx += (mx - rx) * 0.11;
      ry += (my - ry) * 0.11;
      cursorRing.style.transform = `translate(${rx - 17}px, ${ry - 17}px)`;
      requestAnimationFrame(animateRing);
    }
    animateRing();

    // Expand on interactive elements
    const interactives = document.querySelectorAll('a, button, .pill, .benefit-card, .testi-card');
    interactives.forEach((el) => {
      el.addEventListener('mouseenter', () => cursorRing.classList.add('expanded'));
      el.addEventListener('mouseleave', () => cursorRing.classList.remove('expanded'));
    });
  }

  /* ── NAV SCROLL EFFECT ── */
  const nav = document.getElementById('mainNav');
  if (nav) {
    const onScroll = () => {
      nav.classList.toggle('is-scrolled', window.scrollY > 60);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // run once on load
  }

  /* ── MOBILE NAV TOGGLE ── */
  const burger    = document.getElementById('navBurger');
  const navLinks  = document.getElementById('navLinks');
  const overlay   = document.getElementById('navOverlay');

  if (burger && navLinks) {
    burger.addEventListener('click', toggleNav);
    overlay && overlay.addEventListener('click', closeNav);

    function toggleNav() {
      const open = navLinks.classList.toggle('open');
      burger.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', open);
      document.body.style.overflow = open ? 'hidden' : '';
      overlay && (overlay.style.display = open ? 'block' : 'none');
    }
    function closeNav() {
      navLinks.classList.remove('open');
      burger.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      overlay && (overlay.style.display = 'none');
    }

    // Close on nav link click (mobile)
    navLinks.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', closeNav);
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeNav();
    });
  }

  /* ── SMOOTH SCROLL ── */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const navH = nav ? nav.offsetHeight : 0;
      const top  = target.getBoundingClientRect().top + window.scrollY - navH - 20;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ── SCROLL REVEAL ── */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    revealEls.forEach((el) => observer.observe(el));
  } else {
    // Fallback: show all
    revealEls.forEach((el) => el.classList.add('visible'));
  }

  /* ── CONTACT FORM ── */
  const form       = document.getElementById('contactForm');
  const submitBtn  = document.getElementById('submitBtn');

  if (form && submitBtn) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name   = document.getElementById('fName')?.value.trim()   || '';
      const email  = document.getElementById('fEmail')?.value.trim()  || '';
      const reason = document.getElementById('fReason')?.value        || '';
      const time   = document.getElementById('fTime')?.value          || '';
      const msg    = document.getElementById('fMsg')?.value.trim()    || '';

      // Basic validation
      if (!name || !email) {
        showFormFeedback('Please enter your name and email.', 'error');
        return;
      }
      if (!isValidEmail(email)) {
        showFormFeedback('Please enter a valid email address.', 'error');
        return;
      }

      const subject = encodeURIComponent('Session Request — Anytime Anywhere Meditation');
      const body    = encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\nReason: ${reason}\nPreferred time: ${time}\n\nMessage:\n${msg}`
      );

      window.location.href = `mailto:hola@mllorente.com?subject=${subject}&body=${body}`;
      showFormFeedback('Opening your email client… We\'ll get back to you within 24 hours.', 'success');
    });
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function showFormFeedback(message, type) {
    let el = document.getElementById('formFeedback');
    if (!el) {
      el = document.createElement('p');
      el.id = 'formFeedback';
      el.style.cssText = 'margin-top:1rem;font-size:0.8rem;text-align:center;transition:opacity 0.3s';
      submitBtn.parentNode.insertAdjacentElement('afterend', el);
    }
    el.textContent = message;
    el.style.color = type === 'error' ? '#c0665a' : '#6b8c6e';
    el.style.opacity = '1';
    setTimeout(() => { el.style.opacity = '0'; }, 5000);
  }

  /* ── PARALLAX (subtle, hero image only) ── */
  const heroImg = document.querySelector('.hero__img');
  if (heroImg && window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      if (y < window.innerHeight * 1.2) {
        heroImg.style.transform = `translateY(${y * 0.12}px)`;
      }
    }, { passive: true });
  }

  /* ── ACTIVE NAV LINK HIGHLIGHTING ── */
  const sections  = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav__links a[href^="#"]');
  if (sections.length && navAnchors.length) {
    const highlight = () => {
      let current = '';
      sections.forEach((sec) => {
        if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
      });
      navAnchors.forEach((a) => {
        a.style.color = a.getAttribute('href') === `#${current}`
          ? 'var(--sand)'
          : '';
      });
    };
    window.addEventListener('scroll', highlight, { passive: true });
    highlight();
  }

  /* ── YEAR IN FOOTER ── */
  const yearEl = document.getElementById('currentYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

})();
