/* ========================================
   ZAROBBY – script.js
   ======================================== */

(function () {
  'use strict';

  /* ── NAVBAR SCROLL ── */
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── HAMBURGER MENU ── */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
  });

  // Close mobile menu on link click
  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target)) {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
    }
  });

  /* ── REVEAL ON SCROLL ── */
  const revealEls = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));

  /* ── PORTFOLIO MODAL ── */
  const showMoreBtn = document.getElementById('showMoreBtn');
  const portfolioModal = document.getElementById('portfolioModal');
  const modalClose = document.getElementById('modalClose');

  const openModal = () => {
    portfolioModal.classList.add('open');
    document.body.style.overflow = 'hidden';
    portfolioModal.focus();
  };

  const closeModal = () => {
    portfolioModal.classList.remove('open');
    document.body.style.overflow = '';
  };

  showMoreBtn.addEventListener('click', openModal);
  modalClose.addEventListener('click', closeModal);

  portfolioModal.addEventListener('click', (e) => {
    if (e.target === portfolioModal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && portfolioModal.classList.contains('open')) {
      closeModal();
    }
  });

  /* ── SMOOTH SCROLL for anchor links ── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 72; // navbar height
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ── COUNTER ANIMATION ── */
  const counters = document.querySelectorAll('.sp-num[data-count]');

  const animateCounter = (el) => {
    const target = parseInt(el.dataset.count);
    const duration = 1500;
    const start = performance.now();

    const tick = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      el.textContent = Math.round(ease * target);
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  };

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => counterObserver.observe(el));

  /* ── LAZY LOAD IMAGES with fade-in ── */
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');
  lazyImages.forEach(img => {
    img.style.transition = 'opacity 0.4s ease';
    img.style.opacity = '0';
    img.addEventListener('load', () => {
      img.style.opacity = '1';
    });
    // If already cached / loaded
    if (img.complete && img.naturalWidth > 0) {
      img.style.opacity = '1';
    }
  });

  /* ── FLOATING CARDS PARALLAX (desktop) ── */
  if (window.innerWidth > 768) {
    const floatingCards = document.querySelectorAll('.floating-card');
    const hero = document.querySelector('.hero');

    if (hero && floatingCards.length) {
      window.addEventListener('mousemove', (e) => {
        const rect = hero.getBoundingClientRect();
        if (e.clientY < rect.bottom) {
          const x = (e.clientX / window.innerWidth - 0.5) * 12;
          const y = (e.clientY / window.innerHeight - 0.5) * 8;
          floatingCards.forEach((card, i) => {
            const factor = (i % 2 === 0) ? 1 : -1;
            card.style.transform = `translate(${x * factor * 0.4}px, ${y * factor * 0.4}px)`;
          });
        }
      });
    }
  }

  /* ── ACTIVE NAV LINK HIGHLIGHT ── */
  const sections = document.querySelectorAll('section[id]');
  const navLinkEls = document.querySelectorAll('.nav-links a');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinkEls.forEach(a => {
          a.style.color = '';
          if (a.getAttribute('href') === '#' + entry.target.id) {
            a.style.color = 'var(--accent)';
          }
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(sec => sectionObserver.observe(sec));

  /* ── PORTFOLIO IMAGE FALLBACK ── */
  // Ensure placeholder shows if screenshot API fails
  document.querySelectorAll('.portfolio-img').forEach(img => {
    img.addEventListener('error', function () {
      this.style.display = 'none';
      const placeholder = this.parentElement.querySelector('.portfolio-placeholder');
      if (placeholder) placeholder.style.display = 'flex';
    });
  });

})();
