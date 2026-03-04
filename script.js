/* ═══════════════════════════════════════════════════════════════
   PÓLEN CONTÁBIL — script.js v4 Premium
   Multi-layer Illumination · Magnetic Cursor · Constellation
   Section-Aware Glow · Parallax · Holographic Cards
   ═══════════════════════════════════════════════════════════════ */

'use strict';

/* ═══════════════════════════════════════════════════════════════
   THEME MANAGEMENT — Native CSS Support
   (Logic handled by @media (prefers-color-scheme) in CSS)
   ═══════════════════════════════════════════════════════════════ */
/* 
const updateTheme = () => {
  const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
};
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', updateTheme);
updateTheme(); 
*/

const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
let isDarkMode = darkModeQuery.matches;
darkModeQuery.addEventListener('change', e => isDarkMode = e.matches);

/* ── ELEMENTS ───────────────────────────────────────────────── */
const navbar      = document.getElementById('navbar');
const navLinks    = document.getElementById('navLinks');
const hamburger   = document.getElementById('hamburger');
const mouseLight  = document.getElementById('mouse-light');
const mouseLight2 = document.getElementById('mouse-light-2');
const cursorDot   = document.getElementById('cursor-dot');
const cursorRing  = document.getElementById('cursor-ring');
const progressBar = document.getElementById('progress-bar');
const heroImg     = document.getElementById('heroImg');

/* ═══════════════════════════════════════════════════════════════
   SECTION COLOR MAP — warm glow shifts by section
   ═══════════════════════════════════════════════════════════════ */
const SECTION_GLOW = {
  home:     { r: 201, g: 158, b: 56,  outerAlpha: 0.08 },
  sobre:    { r: 190, g: 140, b: 48,  outerAlpha: 0.07 },
  servicos: { r: 210, g: 168, b: 60,  outerAlpha: 0.09 },
  porques:  { r: 195, g: 148, b: 50,  outerAlpha: 0.075 },
  contato:  { r: 220, g: 178, b: 70,  outerAlpha: 0.08 },
};
let currentGlow = SECTION_GLOW.home;
let targetGlow  = SECTION_GLOW.home;
let glowLerp    = { r: 201, g: 158, b: 56, outerAlpha: 0.05 };

/* ═══════════════════════════════════════════════════════════════
   MOUSE TRACKING
   ═══════════════════════════════════════════════════════════════ */
let mouseX = window.innerWidth  / 2;
let mouseY = window.innerHeight / 2;
let ringX  = mouseX, ringY = mouseY;
let dotX   = mouseX, dotY  = mouseY;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  updateIllumination();
});

function lerpVal(a, b, t) { return a + (b - a) * t; }

function updateIllumination() {
  const { r, g, b, outerAlpha } = glowLerp;
  const mx = mouseX, my = mouseY;
  const isDark = isDarkMode;

  /* Reduce glow intensity in light mode for legibility */
  const intensityMult = isDark ? 1 : 0.4;
  const outerAlphaFinal = outerAlpha * (isDark ? 1 : 0.3);

  if (mouseLight) {
    mouseLight.style.mixBlendMode = isDark ? 'screen' : 'multiply';
    mouseLight.style.background = `
      radial-gradient(
        420px circle at ${mx}px ${my}px,
        rgba(${r},${g},${b},${0.08 * intensityMult}) 0%,
        rgba(${r},${Math.round(g*0.7)},${Math.round(b*0.4)},${0.025 * intensityMult}) 50%,
        transparent 80%
      )
    `;
  }
  if (mouseLight2) {
    mouseLight2.style.background = `
      radial-gradient(
        900px circle at ${mx}px ${my}px,
        rgba(${r},${g},${b},${outerAlphaFinal}) 0%,
        rgba(${r},${Math.round(g*0.6)},${Math.round(b*0.3)},${0.01 * intensityMult}) 55%,
        transparent 82%
      )
    `;
  }
}

/* ═══════════════════════════════════════════════════════════════
   CURSOR — smooth lag + magnetic snap
   ═══════════════════════════════════════════════════════════════ */
let isHovering = false;
let magnetTarget = null;
let magnetX = 0, magnetY = 0;

function animateCursor() {
  /* Lerp ring toward mouse or magnetic target */
  if (magnetTarget && isHovering) {
    const r  = magnetTarget.getBoundingClientRect();
    const cx = r.left + r.width  / 2;
    const cy = r.top  + r.height / 2;
    ringX += (cx - ringX) * 0.18;
    ringY += (cy - ringY) * 0.18;
  } else {
    ringX += (mouseX - ringX) * 0.11;
    ringY += (mouseY - ringY) * 0.11;
  }
  dotX = mouseX;
  dotY = mouseY;

  /* Glow color lerp */
  glowLerp.r           = lerpVal(glowLerp.r,           targetGlow.r,           0.04);
  glowLerp.g           = lerpVal(glowLerp.g,           targetGlow.g,           0.04);
  glowLerp.b           = lerpVal(glowLerp.b,           targetGlow.b,           0.04);
  glowLerp.outerAlpha  = lerpVal(glowLerp.outerAlpha,  targetGlow.outerAlpha,  0.04);
  updateIllumination();

  if (cursorDot)  { cursorDot.style.left  = dotX  + 'px'; cursorDot.style.top  = dotY  + 'px'; }
  if (cursorRing) { cursorRing.style.left = ringX + 'px'; cursorRing.style.top = ringY + 'px'; }

  requestAnimationFrame(animateCursor);
}
animateCursor();

document.addEventListener('mouseleave', () => {
  if (cursorDot)  cursorDot.style.opacity  = '0';
  if (cursorRing) cursorRing.style.opacity = '0';
});
document.addEventListener('mouseenter', () => {
  if (cursorDot)  cursorDot.style.opacity  = '1';
  if (cursorRing) cursorRing.style.opacity = '1';
});

/* Hover state — interactive elements */
const INTERACTIVE = 'a, button, .service-card, .stat-card, .pill, .feature-item, .contact-info-item';
document.querySelectorAll(INTERACTIVE).forEach(el => {
  el.addEventListener('mouseenter', () => {
    isHovering = true;
    magnetTarget = el;
    if (cursorDot)  cursorDot.classList.add('cursor-hover');
    if (cursorRing) cursorRing.classList.add('cursor-hover');

    /* Hide cursor ring/dot on cards and larger elements to avoid "stuck ball" look */
    if (el.classList.contains('service-card') || el.classList.contains('stat-card') || el.classList.contains('contact-form-card') || el.classList.contains('feature-item')) {
      if (cursorDot) cursorDot.style.opacity = '0';
      if (cursorRing) cursorRing.style.opacity = '0';
    }
  });
  el.addEventListener('mouseleave', () => {
    isHovering = false;
    magnetTarget = null;
    if (cursorDot)  cursorDot.classList.remove('cursor-hover');
    if (cursorRing) cursorRing.classList.remove('cursor-hover');

    /* Restore opacity */
    if (cursorDot) cursorDot.style.opacity = '1';
    if (cursorRing) cursorRing.style.opacity = '1';
  });
});

/* ═══════════════════════════════════════════════════════════════
   SCROLL — nav, parallax, progress, section detection
   ═══════════════════════════════════════════════════════════════ */
let lastScrollY = 0;
let ticking = false;

function onScroll() {
  const scrollY = window.scrollY;
  navbar.classList.toggle('scrolled', scrollY > 80);

  /* Progress bar */
  const total = document.documentElement.scrollHeight - window.innerHeight;
  if (progressBar) progressBar.style.width = (scrollY / total * 100) + '%';

  /* Hero parallax */
  if (heroImg && scrollY < window.innerHeight * 1.2) {
    heroImg.style.transform = `translateY(${scrollY * 0.2}px)`;
  }

  /* Orb parallax */
  document.querySelectorAll('.hero-orb').forEach((orb, i) => {
    const speed = [0.08, 0.12, 0.06][i] || 0.08;
    if (scrollY < window.innerHeight) {
      orb.style.transform = `translateY(${scrollY * speed}px)`;
    }
  });

  updateActiveNav(scrollY);
  updateSectionGlow(scrollY);

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

function updateSectionGlow(scrollY) {
  const sections = document.querySelectorAll('section[id]');
  let current = 'home';
  sections.forEach(s => {
    if (scrollY >= s.offsetTop - 200) current = s.id;
  });
  if (SECTION_GLOW[current]) targetGlow = SECTION_GLOW[current];
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
   COUNTER ANIMATION — smooth ease-out with gold flash
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
   CARD 3D TILT — precise holographic effect
   ═══════════════════════════════════════════════════════════════ */
const TILT_CARDS = '.service-card, .stat-card, .contact-form-card';
document.querySelectorAll(TILT_CARDS).forEach(card => {
  let raf;
  let targetRX = 0, targetRY = 0;
  let currentRX = 0, currentRY = 0;
  let isHovered = false;
  let mx = 0, my = 0;

  card.addEventListener('mousemove', e => {
    const r  = card.getBoundingClientRect();
    const cx = r.left + r.width  / 2;
    const cy = r.top  + r.height / 2;
    targetRX = ((e.clientY - cy) / (r.height / 2)) * -4;
    targetRY = ((e.clientX - cx) / (r.width  / 2)) *  4;
    mx = (e.clientX - r.left) / r.width;
    my = (e.clientY - r.top)  / r.height;

    /* Holographic shimmer following mouse */
    const shimmer = `radial-gradient(
      ellipse 60% 50% at ${mx*100}% ${my*100}%,
      rgba(201,168,76,0.06) 0%,
      rgba(201,168,76,0.02) 40%,
      transparent 70%
    )`;
    card.style.setProperty('--shimmer', shimmer);
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
    const ty = isHovered ? -12 : 0;
    card.style.transform = `translateY(${ty}px) rotateX(${currentRX}deg) rotateY(${currentRY}deg)`;
    if (Math.abs(currentRX) > 0.04 || Math.abs(currentRY) > 0.04 || isHovered) {
      raf = requestAnimationFrame(tiltLoop);
    } else {
      card.style.transform = '';
      card.style.removeProperty('--shimmer');
    }
  }
});

/* ═══════════════════════════════════════════════════════════════
   CONSTELLATION PARTICLES — gold dots that react to proximity
   ═══════════════════════════════════════════════════════════════ */
(function initConstellation() {
  const canvas = document.createElement('canvas');
  canvas.style.cssText = `
    position: fixed; inset: 0; z-index: 0;
    pointer-events: none; opacity: 0.55;
  `;
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  let W = canvas.width  = window.innerWidth;
  let H = canvas.height = window.innerHeight;

  const DOTS = 55;
  const dots = Array.from({ length: DOTS }, () => ({
    x: Math.random() * W,
    y: Math.random() * H,
    vx: (Math.random() - 0.5) * 0.22,
    vy: (Math.random() - 0.5) * 0.22,
    r: 0.8 + Math.random() * 1.0,
    opacity: 0.12 + Math.random() * 0.2,
  }));

  window.addEventListener('resize', () => {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  });

  let animId;
  function drawConstellation() {
    ctx.clearRect(0, 0, W, H);

    /* Move dots */
    dots.forEach(d => {
      d.x += d.vx; d.y += d.vy;
      if (d.x < 0) d.x = W; if (d.x > W) d.x = 0;
      if (d.y < 0) d.y = H; if (d.y > H) d.y = 0;

      /* Mouse proximity brightness */
      const dx = d.x - mouseX;
      const dy = d.y - mouseY;
      const dist = Math.sqrt(dx*dx + dy*dy);
      const proximity = Math.max(0, 1 - dist / 220);
      const finalOpacity = d.opacity + proximity * 0.55;

      /* Darker gold for light mode visibility */
      const r = isDarkMode ? 201 : 184;
      const g = isDarkMode ? 168 : 134;
      const b = isDarkMode ? 76  : 11;

      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r + proximity * 1.2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r},${g},${b},${finalOpacity})`;
      ctx.fill();

      if (proximity > 0.1) {
        ctx.beginPath();
        ctx.arc(d.x, d.y, (d.r + proximity * 1.2) * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r+25},${g+26},${b+46},${proximity * 0.12})`;
        ctx.fill();
      }
    });

    /* Connect nearby dots with lines */
    for (let i = 0; i < dots.length; i++) {
      for (let j = i + 1; j < dots.length; j++) {
        const dx   = dots[i].x - dots[j].x;
        const dy   = dots[i].y - dots[j].y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 130) {
          /* Check if near mouse */
          const midX = (dots[i].x + dots[j].x) / 2;
          const midY = (dots[i].y + dots[j].y) / 2;
          const mdx  = midX - mouseX;
          const mdy  = midY - mouseY;
          const mDist = Math.sqrt(mdx*mdx + mdy*mdy);
          const proximity = Math.max(0, 1 - mDist / 250);
          const alpha = (1 - dist / 130) * (0.04 + proximity * 0.18);
          
          /* Line color matching dots */
          const r = isDarkMode ? 201 : 184;
          const g = isDarkMode ? 168 : 134;
          const b = isDarkMode ? 76  : 11;

          ctx.beginPath();
          ctx.moveTo(dots[i].x, dots[i].y);
          ctx.lineTo(dots[j].x, dots[j].y);
          ctx.strokeStyle = `rgba(${r},${g},${b},${alpha})`;
          ctx.lineWidth = 0.5 + proximity * 0.8;
          ctx.stroke();
        }
      }
    }

    animId = requestAnimationFrame(drawConstellation);
  }
  drawConstellation();
})();

/* ═══════════════════════════════════════════════════════════════
   FLOATING GOLD PARTICLES — fine pollen dust
   ═══════════════════════════════════════════════════════════════ */
(function spawnParticles() {
  const count = 22;
  for (let i = 0; i < count; i++) {
    const p    = document.createElement('div');
    p.className = 'particle';
    const size = 0.8 + Math.random() * 2.5;
    p.style.cssText = `
      width: ${size}px; height: ${size}px;
      left: ${Math.random() * 100}%;
      bottom: ${3 + Math.random() * 45}%;
      --dur: ${12 + Math.random() * 16}s;
      --del: ${Math.random() * 18}s;
      --dx:  ${(Math.random() - 0.5) * 100}px;
      --dy:  ${-(80 + Math.random() * 150)}px;
      opacity: 0;
    `;
    document.body.appendChild(p);
  }
})();

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
   HERO AMBIENT PARALLAX — multi-layer response
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
