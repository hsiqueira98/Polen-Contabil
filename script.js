/* ═══════════════════════════════════════════════════════════════
   PÓLEN CONTÁBIL — script.js v3
   Mouse illumination · Custom cursor · Floating nav · Parallax
   ═══════════════════════════════════════════════════════════════ */

'use strict';

/* ── ELEMENTS ───────────────────────────────────────────────── */
const navbar     = document.getElementById('navbar');
const navLinks   = document.getElementById('navLinks');
const hamburger  = document.getElementById('hamburger');
const mouseLight = document.getElementById('mouse-light');
const cursorDot  = document.getElementById('cursor-dot');
const cursorRing = document.getElementById('cursor-ring');
const progressBar= document.getElementById('progress-bar');
const heroImg    = document.getElementById('heroImg');

/* ═══════════════════════════════════════════════════════════════
   MOUSE TRACKING — illumination + cursor
   ═══════════════════════════════════════════════════════════════ */
let mouseX = window.innerWidth  / 2;
let mouseY = window.innerHeight / 2;
let ringX  = mouseX;
let ringY  = mouseY;
let dotX   = mouseX;
let dotY   = mouseY;
let rafId  = null;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;

  /* Update CSS vars for the glow layer — instant feel */
  mouseLight.style.setProperty('--mx', mouseX + 'px');
  mouseLight.style.setProperty('--my', mouseY + 'px');
  mouseLight.style.background = `radial-gradient(
    680px circle at ${mouseX}px ${mouseY}px,
    rgba(201,168,76,0.044) 0%,
    rgba(180,110,40,0.018) 40%,
    transparent 72%
  )`;
});

/* Cursor: dot follows instantly, ring lags (lerp) */
function animateCursor() {
  dotX  = mouseX;
  dotY  = mouseY;
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;

  if (cursorDot)  { cursorDot.style.left  = dotX  + 'px'; cursorDot.style.top  = dotY  + 'px'; }
  if (cursorRing) { cursorRing.style.left = ringX + 'px'; cursorRing.style.top = ringY + 'px'; }

  rafId = requestAnimationFrame(animateCursor);
}
animateCursor();

/* Hide cursor when leaving window */
document.addEventListener('mouseleave', () => {
  if (cursorDot)  cursorDot.style.opacity  = '0';
  if (cursorRing) cursorRing.style.opacity = '0';
});
document.addEventListener('mouseenter', () => {
  if (cursorDot)  cursorDot.style.opacity  = '1';
  if (cursorRing) cursorRing.style.opacity = '1';
});

/* ═══════════════════════════════════════════════════════════════
   NAV — scroll behaviour + active link
   ═══════════════════════════════════════════════════════════════ */
let lastScrollY = 0;
let ticking = false;

function onScroll() {
  const scrollY = window.scrollY;

  /* Floating → fixed transition at 80px */
  navbar.classList.toggle('scrolled', scrollY > 80);

  /* Progress bar */
  const total = document.documentElement.scrollHeight - window.innerHeight;
  if (progressBar) progressBar.style.width = (scrollY / total * 100) + '%';

  /* Parallax hero image */
  if (heroImg && scrollY < window.innerHeight) {
    heroImg.style.transform = `translateY(${scrollY * 0.22}px)`;
  }

  /* Active nav highlight */
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
    if (scrollY >= s.offsetTop - 120) current = s.id;
  });
  anchors.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
  });
}

/* ─── NAV helpers ─── */
function scrollToId(sel) {
  const el = document.querySelector(sel);
  if (!el) return;
  const offset = window.scrollY > 80 ? 64 : 82;
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
  navLinks.classList.toggle('open');
  hamburger.classList.toggle('active');
}
function closeMenu() {
  navLinks.classList.remove('open');
  hamburger.classList.remove('active');
}

/* ═══════════════════════════════════════════════════════════════
   SCROLL REVEAL
   ═══════════════════════════════════════════════════════════════ */
const REVEAL_SEL = '.reveal, .reveal-blur, .reveal-left, .reveal-right, .reveal-scale';
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -44px 0px' });

document.querySelectorAll(REVEAL_SEL).forEach(el => revealObs.observe(el));

/* ═══════════════════════════════════════════════════════════════
   COUNTER ANIMATION
   ═══════════════════════════════════════════════════════════════ */
function animateCount(el) {
  const target = parseInt(el.getAttribute('data-count'));
  if (isNaN(target)) return;
  const dur = 2200;
  const t0  = performance.now();
  const tick = now => {
    const p = Math.min((now - t0) / dur, 1);
    const v = 1 - Math.pow(1 - p, 3);  /* cubic ease-out */
    el.textContent = Math.floor(v * target);
    p < 1 ? requestAnimationFrame(tick) : (el.textContent = target);
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
   CARD 3D TILT — elegant subtle tilt on mouse over
   ═══════════════════════════════════════════════════════════════ */
const TILT_CARDS = '.service-card, .stat-card, .contact-form-card';
document.querySelectorAll(TILT_CARDS).forEach(card => {
  let raf;
  let targetRX = 0, targetRY = 0;
  let currentRX = 0, currentRY = 0;
  let isHovered = false;

  card.addEventListener('mouseenter', () => { isHovered = true; });
  card.addEventListener('mousemove', e => {
    const r  = card.getBoundingClientRect();
    const cx = r.left + r.width  / 2;
    const cy = r.top  + r.height / 2;
    targetRX = ((e.clientY - cy) / (r.height / 2)) * -3.5;
    targetRY = ((e.clientX - cx) / (r.width  / 2)) *  3.5;
  });
  card.addEventListener('mouseleave', () => {
    isHovered = false;
    targetRX = 0; targetRY = 0;
  });

  function tiltLoop() {
    currentRX += (targetRX - currentRX) * 0.12;
    currentRY += (targetRY - currentRY) * 0.12;

    const ty = isHovered ? -10 : 0;
    card.style.transform = `translateY(${ty}px) rotateX(${currentRX}deg) rotateY(${currentRY}deg)`;

    if (Math.abs(currentRX) > 0.05 || Math.abs(currentRY) > 0.05 || isHovered) {
      raf = requestAnimationFrame(tiltLoop);
    } else {
      card.style.transform = '';
    }
  }

  card.addEventListener('mouseenter', () => {
    cancelAnimationFrame(raf);
    tiltLoop();
  });
});

/* ═══════════════════════════════════════════════════════════════
   FLOATING GOLD PARTICLES
   ═══════════════════════════════════════════════════════════════ */
(function spawnParticles() {
  const count = 16;
  for (let i = 0; i < count; i++) {
    const p    = document.createElement('div');
    p.className = 'particle';
    const size = 1 + Math.random() * 2.2;
    p.style.cssText = `
      width: ${size}px; height: ${size}px;
      left: ${Math.random() * 100}%;
      bottom: ${5 + Math.random() * 40}%;
      --dur:   ${11 + Math.random() * 14}s;
      --del:   ${Math.random() * 15}s;
      --dx:    ${(Math.random() - 0.5) * 90}px;
      --dy:    ${-(70 + Math.random() * 130)}px;
    `;
    document.body.appendChild(p);
  }
})();

/* ═══════════════════════════════════════════════════════════════
   FORM SUBMIT
   ═══════════════════════════════════════════════════════════════ */
function handleSubmit(e) {
  e.preventDefault();
  const btn = document.getElementById('submitBtn');
  const orig = btn.textContent;

  btn.disabled = true;
  btn.textContent = 'Enviando…';

  setTimeout(() => {
    btn.textContent = '✓  Mensagem Enviada';
    btn.style.background = '#3d9970';
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

/* ═══════════════════════════════════════════════════════════════
   SECTION BARRIER REVEAL — subtle scale-in for barrier gems
   ═══════════════════════════════════════════════════════════════ */
const barrierObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const gem = e.target.querySelector('.barrier-gem');
      if (gem) {
        gem.style.transition = 'transform 0.8s cubic-bezier(0.34,1.56,0.64,1), opacity 0.6s ease';
        gem.style.opacity = '1';
        gem.style.transform = 'translate(-50%,-50%) rotate(45deg) scale(1)';
      }
      barrierObs.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.barrier').forEach(b => {
  const gem = b.querySelector('.barrier-gem');
  if (gem) { gem.style.opacity = '0'; gem.style.transform = 'translate(-50%,-50%) rotate(45deg) scale(0)'; }
  barrierObs.observe(b);
});

/* ═══════════════════════════════════════════════════════════════
   HERO AMBIENT MOUSE PARALLAX (extra subtle)
   ═══════════════════════════════════════════════════════════════ */
const heroSection = document.getElementById('home');
if (heroSection) {
  document.addEventListener('mousemove', e => {
    if (window.scrollY > window.innerHeight) return;
    const nx = (e.clientX / window.innerWidth  - 0.5) * 2;
    const ny = (e.clientY / window.innerHeight - 0.5) * 2;
    const heroLeft = heroSection.querySelector('.hero-grid > div:first-child');
    if (heroLeft) {
      heroLeft.style.transform = `translate(${nx * 6}px, ${ny * 4}px)`;
    }
  });
}
