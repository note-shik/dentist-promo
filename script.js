/* ═══════════════════════════════════════════
   Pearl Dental Studio — Scripts
   Premium Dental Clinic Website
   ═══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Loader ── */
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('hidden'), 1600);
  });
  // Fallback
  setTimeout(() => loader.classList.add('hidden'), 3000);


  /* ── Custom Cursor ── */
  const cursor = document.getElementById('cursor');
  const glow = document.getElementById('cursorGlow');

  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches && cursor && glow) {
    let mx = 0, my = 0, gx = 0, gy = 0;

    document.addEventListener('mousemove', e => {
      mx = e.clientX;
      my = e.clientY;
    });

    (function tick() {
      cursor.style.left = mx + 'px';
      cursor.style.top = my + 'px';
      gx += (mx - gx) * 0.1;
      gy += (my - gy) * 0.1;
      glow.style.left = gx + 'px';
      glow.style.top = gy + 'px';
      requestAnimationFrame(tick);
    })();

    document.querySelectorAll('a, button, .service-card, .gallery-item').forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.classList.add('hovering');
        glow.classList.add('hovering');
      });
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('hovering');
        glow.classList.remove('hovering');
      });
    });
  }


  /* ── Nav Scroll Effect ── */
  const nav = document.getElementById('nav');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
    lastScroll = y;
  }, { passive: true });


  /* ── Mobile Nav ── */
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');
  const mobileClose = document.getElementById('mobileClose');

  hamburger.addEventListener('click', () => mobileNav.classList.add('open'));
  mobileClose.addEventListener('click', () => mobileNav.classList.remove('open'));


  /* ── Scroll Reveal ── */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


  /* ── Animated Counters ── */
  function animateCounter(element, target) {
    const duration = 2000;
    const start = performance.now();
    const startVal = 0;

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out expo
      const eased = 1 - Math.pow(1 - progress, 4);
      const current = Math.floor(startVal + (target - startVal) * eased);
      element.textContent = current.toLocaleString();
      if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  }

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const card = entry.target;
        const numEl = card.querySelector('.stat-number');
        const target = parseInt(numEl.dataset.target, 10);
        animateCounter(numEl, target);
        card.classList.add('counted');
        statsObserver.unobserve(card);
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.stat-card').forEach(card => statsObserver.observe(card));


  /* ── Testimonials Slider ── */
  const track = document.getElementById('testimonialsTrack');
  const cards = track ? track.querySelectorAll('.testimonial-card') : [];
  const prevBtn = document.getElementById('sliderPrev');
  const nextBtn = document.getElementById('sliderNext');
  const dotsContainer = document.getElementById('sliderDots');

  let currentSlide = 0;
  let slidesPerView = 1;
  let totalSlides = cards.length;
  let maxSlide = 0;
  let autoplayInterval;

  function calcSlidesPerView() {
    const w = window.innerWidth;
    if (w >= 960) return 3;
    if (w >= 600) return 2;
    return 1;
  }

  function updateSlider() {
    slidesPerView = calcSlidesPerView();
    maxSlide = Math.max(0, totalSlides - slidesPerView);
    if (currentSlide > maxSlide) currentSlide = maxSlide;

    const cardWidth = cards[0].offsetWidth + 20; // gap
    track.style.transform = `translateX(-${currentSlide * cardWidth}px)`;

    // Update dots
    if (dotsContainer) {
      dotsContainer.innerHTML = '';
      for (let i = 0; i <= maxSlide; i++) {
        const dot = document.createElement('button');
        dot.className = 'slider-dot' + (i === currentSlide ? ' active' : '');
        dot.setAttribute('aria-label', `Slide ${i + 1}`);
        dot.addEventListener('click', () => {
          currentSlide = i;
          updateSlider();
          resetAutoplay();
        });
        dotsContainer.appendChild(dot);
      }
    }
  }

  function nextSlide() {
    currentSlide = currentSlide >= maxSlide ? 0 : currentSlide + 1;
    updateSlider();
  }

  function prevSlide() {
    currentSlide = currentSlide <= 0 ? maxSlide : currentSlide - 1;
    updateSlider();
  }

  function startAutoplay() {
    autoplayInterval = setInterval(nextSlide, 5000);
  }

  function resetAutoplay() {
    clearInterval(autoplayInterval);
    startAutoplay();
  }

  if (track && cards.length > 0) {
    updateSlider();
    startAutoplay();

    if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); resetAutoplay(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); resetAutoplay(); });

    window.addEventListener('resize', () => updateSlider());

    // Touch support
    let touchStartX = 0;
    let touchEndX = 0;

    track.addEventListener('touchstart', e => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    track.addEventListener('touchend', e => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) { nextSlide(); } else { prevSlide(); }
        resetAutoplay();
      }
    }, { passive: true });
  }


  /* ── Gallery Lightbox ── */
  const lightbox = document.getElementById('lightbox');
  const lightboxContent = document.getElementById('lightboxContent');
  const lightboxClose = document.getElementById('lightboxClose');

  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      const placeholder = item.querySelector('.gallery-placeholder');
      if (placeholder) {
        const clone = placeholder.cloneNode(true);
        clone.style.minHeight = '400px';
        clone.style.borderRadius = 'var(--radius-lg)';
        lightboxContent.innerHTML = '';
        lightboxContent.appendChild(clone);
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener('click', () => {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
    });
  }

  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        lightbox.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  // ESC to close lightbox
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (lightbox && lightbox.classList.contains('open')) {
        lightbox.classList.remove('open');
        document.body.style.overflow = '';
      }
      if (mobileNav && mobileNav.classList.contains('open')) {
        mobileNav.classList.remove('open');
      }
    }
  });


  /* ── Smooth Parallax on Hero Orbs ── */
  const heroOrbs = document.querySelectorAll('.hero-orb');
  if (heroOrbs.length > 0 && window.matchMedia('(hover: hover)').matches) {
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      heroOrbs.forEach((orb, i) => {
        const speed = (i + 1) * 0.08;
        orb.style.transform = `translateY(${y * speed}px)`;
      });
    }, { passive: true });
  }


  /* ── Nav Active Link on Scroll ── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  const activeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active');
          }
        });
      }
    });
  }, { threshold: 0.3, rootMargin: '-100px 0px -50% 0px' });

  sections.forEach(section => activeObserver.observe(section));

});

/* ── Global: Close mobile nav ── */
function closeMobile() {
  const mobileNav = document.getElementById('mobileNav');
  if (mobileNav) mobileNav.classList.remove('open');
}
