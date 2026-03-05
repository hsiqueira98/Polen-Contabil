/* ═══════════════════════════════════════════════════════════════
   PÓLEN CONTÁBIL — script.js v4 Premium
   Refined for Clarity & Performance
   Theme Toggle · Custom Cursor · Parallax · Reveal System
   ═══════════════════════════════════════════════════════════════ */

'use strict';

/* ═══════════════════════════════════════════════════════════════
   THEME MANAGEMENT — Manual Toggle + Persistence
   ═══════════════════════════════════════════════════════════════ */
const themeToggleBtn = document.getElementById('theme-toggle');
const storedTheme = localStorage.getItem('theme');
const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

// Default to light if no preference, or respect system
let isDarkMode = storedTheme === 'dark' || (!storedTheme && systemDark);

function applyTheme() {
  if (isDarkMode) {
    document.body.classList.add('dark-mode');
  } else {
    document.body.classList.remove('dark-mode');
  }
  localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
}

// Initialize theme
applyTheme();

if (themeToggleBtn) {
  themeToggleBtn.addEventListener('click', () => {
    isDarkMode = !isDarkMode;
    applyTheme();
  });
}

/* ── ELEMENTS ───────────────────────────────────────────────── */
const navbar      = document.getElementById('navbar');
const navLinks    = document.getElementById('navLinks');
const hamburger   = document.getElementById('hamburger');
const cursorDot   = document.getElementById('cursor-dot');
const progressBar = document.getElementById('progress-bar');
const heroImg     = document.getElementById('heroImg');

/* ═══════════════════════════════════════════════════════════════
   MOUSE TRACKING & CURSOR
   ═══════════════════════════════════════════════════════════════ */
let mouseX = window.innerWidth  / 2;
let mouseY = window.innerHeight / 2;
let dotX   = mouseX, dotY  = mouseY;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function animateCursor() {
  // Direct follow for instant response (no interpolation delay)
  // This eliminates the "heavy" feeling completely
  if (cursorDot) {
    cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
  }
  
  requestAnimationFrame(animateCursor);
}
animateCursor();

// Hide cursor when leaving window
document.addEventListener('mouseleave', () => {
  if (cursorDot) cursorDot.style.opacity = '0';
});
document.addEventListener('mouseenter', () => {
  if (cursorDot) cursorDot.style.opacity = '1';
});

/* Hover state — interactive elements */
const INTERACTIVE = 'a, button, .service-card, .stat-card, .pill, .feature-item, .contact-info-item, .logo-wrap';
document.querySelectorAll(INTERACTIVE).forEach(el => {
  el.addEventListener('mouseenter', () => {
    document.body.classList.add('cursor-pointer');
  });
  el.addEventListener('mouseleave', () => {
    document.body.classList.remove('cursor-pointer');
  });
});

/* ═══════════════════════════════════════════════════════════════
   SCROLL — nav, parallax, progress, section detection
   ═══════════════════════════════════════════════════════════════ */
let lastScrollY = 0;
let ticking = false;

function onScroll() {
  const scrollY = window.scrollY;
  if (navbar) navbar.classList.toggle('scrolled', scrollY > 80);

  /* Progress bar */
  const total = document.documentElement.scrollHeight - window.innerHeight;
  if (progressBar) progressBar.style.width = (scrollY / total * 100) + '%';

  /* Hero parallax */
  if (heroImg && scrollY < window.innerHeight * 1.2) {
    heroImg.style.transform = `translateY(${scrollY * 0.2}px)`;
  }

  updateActiveNav(scrollY);

  lastScrollY = scrollY;
  ticking = false;
}

window.addEventListener('scroll', () => {
  if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
}, { passive: true });

function updateActiveNav(scrollY) {
  const sections = document.querySelectorAll('section[id]');
  const anchors  = document.querySelectorAll('.nav-links a[href^="#"]');
  let current = '';
  sections.forEach(s => {
    if (scrollY >= s.offsetTop - 140) current = s.id;
  });
  anchors.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
  });
}

/* ─── NAV helpers ─── */
function scrollToId(sel) {
  const el = document.querySelector(sel);
  if (!el) return;
  const offset = window.scrollY > 80 ? 68 : 90;
  window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
}
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    scrollToId(a.getAttribute('href'));
    closeMenu();
  });
});
function handleNavCta(e) {
  e.preventDefault();
  scrollToId('#contato');
  closeMenu();
}
function toggleMenu() {
  if (navLinks) navLinks.classList.toggle('open');
  if (hamburger) hamburger.classList.toggle('active');
}
function closeMenu() {
  if (navLinks) navLinks.classList.remove('open');
  if (hamburger) hamburger.classList.remove('active');
}

/* ═══════════════════════════════════════════════════════════════
   SCROLL REVEAL
   ═══════════════════════════════════════════════════════════════ */
const REVEAL_SEL = '.reveal, .reveal-blur, .reveal-left, .reveal-right, .reveal-scale';
const revealObs  = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.06, rootMargin: '0px 0px -50px 0px' });
document.querySelectorAll(REVEAL_SEL).forEach(el => revealObs.observe(el));

/* ═══════════════════════════════════════════════════════════════
   COUNTER ANIMATION
   ═══════════════════════════════════════════════════════════════ */
function animateCount(el) {
  const target = parseInt(el.getAttribute('data-count'));
  if (isNaN(target)) return;
  const dur = 2600;
  const t0  = performance.now();
  const tick = now => {
    const p  = Math.min((now - t0) / dur, 1);
    const v  = 1 - Math.pow(1 - p, 4);  /* quartic ease-out */
    el.textContent = Math.floor(v * target);
    if (p < 1) {
      requestAnimationFrame(tick);
    } else {
      el.textContent = target;
      /* Brief gold flash */
      el.style.filter = 'brightness(1.4)';
      setTimeout(() => el.style.filter = '', 400);
    }
  };
  requestAnimationFrame(tick);
}
const countObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { animateCount(e.target); countObs.unobserve(e.target); }
  });
}, { threshold: 0.5 });
document.querySelectorAll('[data-count]').forEach(el => countObs.observe(el));

/* ═══════════════════════════════════════════════════════════════
   CARD 3D TILT
   ═══════════════════════════════════════════════════════════════ */
const TILT_CARDS = '.service-card, .stat-card, .contact-form-card';
document.querySelectorAll(TILT_CARDS).forEach(card => {
  let raf;
  let targetRX = 0, targetRY = 0;
  let currentRX = 0, currentRY = 0;
  let isHovered = false;

  card.addEventListener('mousemove', e => {
    const r  = card.getBoundingClientRect();
    const cx = r.left + r.width  / 2;
    const cy = r.top  + r.height / 2;
    targetRX = ((e.clientY - cy) / (r.height / 2)) * -4;
    targetRY = ((e.clientX - cx) / (r.width  / 2)) *  4;
  });

  card.addEventListener('mouseenter', () => {
    isHovered = true;
    cancelAnimationFrame(raf);
    tiltLoop();
  });
  card.addEventListener('mouseleave', () => {
    isHovered = false;
    targetRX = 0; targetRY = 0;
  });

  function tiltLoop() {
    currentRX += (targetRX - currentRX) * 0.1;
    currentRY += (targetRY - currentRY) * 0.1;
    const ty = isHovered ? -8 : 0;
    
    // Only apply tilt if significant to save resources
    if (Math.abs(currentRX) > 0.01 || Math.abs(currentRY) > 0.01 || isHovered) {
      card.style.transform = `translateY(${ty}px) rotateX(${currentRX}deg) rotateY(${currentRY}deg)`;
      raf = requestAnimationFrame(tiltLoop);
    } else {
      card.style.transform = '';
    }
  }
});

/* ═══════════════════════════════════════════════════════════════
   BARRIER GEM REVEAL
   ═══════════════════════════════════════════════════════════════ */
const barrierObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const gem = e.target.querySelector('.barrier-gem');
      if (gem) {
        gem.style.transition = 'transform 1s cubic-bezier(0.34,1.56,0.64,1), opacity 0.7s ease, box-shadow 0.5s';
        gem.style.opacity = '1';
        gem.style.transform = 'translate(-50%,-50%) rotate(45deg) scale(1)';
        gem.style.boxShadow = '0 0 18px rgba(201,168,76,0.2)';
      }
      barrierObs.unobserve(e.target);
    }
  });
}, { threshold: 0.4 });

document.querySelectorAll('.barrier').forEach(b => {
  const gem = b.querySelector('.barrier-gem');
  if (gem) { gem.style.opacity = '0'; gem.style.transform = 'translate(-50%,-50%) rotate(45deg) scale(0)'; }
  barrierObs.observe(b);
});

/* ═══════════════════════════════════════════════════════════════
   HERO AMBIENT PARALLAX
   ═══════════════════════════════════════════════════════════════ */
const heroSection = document.getElementById('home');
if (heroSection) {
  let heroParallaxRAF;
  let heroTargetX = 0, heroTargetY = 0;
  let heroCurrentX = 0, heroCurrentY = 0;

  document.addEventListener('mousemove', e => {
    if (window.scrollY > window.innerHeight) return;
    heroTargetX = (e.clientX / window.innerWidth  - 0.5) * 2;
    heroTargetY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  function heroParallaxLoop() {
    heroCurrentX += (heroTargetX - heroCurrentX) * 0.05;
    heroCurrentY += (heroTargetY - heroCurrentY) * 0.05;

    const heroLeft = heroSection.querySelector('.hero-grid > div:first-child');
    if (heroLeft && window.scrollY < window.innerHeight) {
      heroLeft.style.transform = `translate(${heroCurrentX * 7}px, ${heroCurrentY * 5}px)`;
    }
    heroParallaxRAF = requestAnimationFrame(heroParallaxLoop);
  }
  heroParallaxLoop();
}

/* ═══════════════════════════════════════════════════════════════
   FORM SUBMIT
   ═══════════════════════════════════════════════════════════════ */
function handleSubmit(e) {
  e.preventDefault();
  const btn  = document.getElementById('submitBtn');
  const orig = btn.textContent;
  btn.disabled = true;
  btn.textContent = 'Enviando…';
  setTimeout(() => {
    btn.textContent = '✓  Mensagem Enviada';
    btn.style.background = 'linear-gradient(135deg, #2d7a54, #3d9970)';
    btn.style.color = '#fff';
    setTimeout(() => {
      btn.textContent = orig;
      btn.style.background = '';
      btn.style.color = '';
      btn.disabled = false;
      e.target.reset();
    }, 3500);
  }, 1400);
}