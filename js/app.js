/**
 * Zynora Portfolio Engine v3
 * Pure Vanilla JS — zero external dependencies.
 */
document.addEventListener('DOMContentLoaded', () => {

  /* ── Preloader ─────────────────────────────────────────── */
  window.addEventListener('load', () => {
    setTimeout(() => {
      const el = document.getElementById('preloader');
      if (el) { el.classList.add('preloader-hidden'); setTimeout(() => el.remove(), 1000); }
    }, 900);
  });

  /* ── Touch detection ───────────────────────────────────── */
  const isTouch = () => window.matchMedia('(hover:none)').matches || 'ontouchstart' in window;
  const cDot = document.getElementById('cursor-dot');
  const cOut = document.getElementById('cursor-outline');

  if (isTouch()) {
    cDot?.remove(); cOut?.remove();
    document.body.style.cursor = 'auto';
    document.querySelectorAll('a,button,input,textarea').forEach(el => el.style.cursor = 'auto');
  } else {
    let mX=0, mY=0, oX=0, oY=0;
    window.addEventListener('mousemove', e => {
      mX = e.clientX; mY = e.clientY;
      if (cDot) cDot.style.transform = `translate(calc(${mX}px - 50%), calc(${mY}px - 50%))`;
    });
    const animCursor = () => {
      oX += (mX - oX) * 0.12; oY += (mY - oY) * 0.12;
      if (cOut) cOut.style.transform = `translate(calc(${oX}px - 50%), calc(${oY}px - 50%))`;
      requestAnimationFrame(animCursor);
    };
    animCursor();
    document.querySelectorAll('a,button,[data-magnetic-strength],.project-card,.filter-btn,.tech-pill').forEach(el => {
      el.addEventListener('mouseenter', () => cOut?.classList.add('magnetic-hover'));
      el.addEventListener('mouseleave', () => cOut?.classList.remove('magnetic-hover'));
    });
    document.addEventListener('mouseleave', () => { if(cDot) cDot.style.opacity='0'; if(cOut) cOut.style.opacity='0'; });
    document.addEventListener('mouseenter', () => { if(cDot) cDot.style.opacity='1'; if(cOut) cOut.style.opacity='1'; });
  }

  /* ── Particles Canvas ──────────────────────────────────── */
  const canvas = document.getElementById('particles-canvas');
  if (canvas && !isTouch()) {
    const ctx = canvas.getContext('2d');
    let W, H, pts = [];
    const resize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize, { passive: true });
    const isDark = () => document.documentElement.getAttribute('data-theme') !== 'light';
    for (let i=0; i<55; i++) pts.push({
      x: Math.random()*window.innerWidth, y: Math.random()*window.innerHeight,
      r: Math.random()*1.5+.5, vx:(Math.random()-.5)*.25, vy:(Math.random()-.5)-.15,
      o: Math.random()*.5+.1
    });
    const drawParticles = () => {
      ctx.clearRect(0,0,W,H);
      const color = isDark() ? '0,240,255' : '91,0,232';
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.y < -10) { p.y = H+10; p.x = Math.random()*W; }
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
        ctx.fillStyle = `rgba(${color},${p.o})`;
        ctx.fill();
      });
      requestAnimationFrame(drawParticles);
    };
    drawParticles();
  }

  /* ── Smooth scroll ─────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      closeMobileMenu();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  /* ── Nav sticky + scroll-spy ───────────────────────────── */
  const nav = document.getElementById('main-nav');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link[data-section]');
  const setActive = id => navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('data-section') === id));

  new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); });
  }, { rootMargin: '-35% 0px -55% 0px' }).observe;

  // Simpler: observe each section
  const spy = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); });
  }, { rootMargin: '-35% 0px -55% 0px' });
  sections.forEach(s => spy.observe(s));

  window.addEventListener('scroll', () => nav?.classList.toggle('scrolled', window.scrollY > 60), { passive: true });

  /* ── Mobile menu ───────────────────────────────────────── */
  const hamburger   = document.getElementById('hamburger');
  const mobileMenu  = document.getElementById('mobile-menu');
  const menuOverlay = document.getElementById('menu-overlay');
  const openMobileMenu  = () => { hamburger?.classList.add('open'); hamburger?.setAttribute('aria-expanded','true'); mobileMenu?.classList.add('open'); menuOverlay?.classList.add('active'); document.body.style.overflow='hidden'; };
  const closeMobileMenu = () => { hamburger?.classList.remove('open'); hamburger?.setAttribute('aria-expanded','false'); mobileMenu?.classList.remove('open'); menuOverlay?.classList.remove('active'); document.body.style.overflow=''; };
  hamburger?.addEventListener('click', () => hamburger.classList.contains('open') ? closeMobileMenu() : openMobileMenu());
  menuOverlay?.addEventListener('click', closeMobileMenu);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeMobileMenu(); closeLightbox(); }});

  /* ── Theme toggle ──────────────────────────────────────── */
  const themeBtn = document.getElementById('theme-toggle');
  const root = document.documentElement;
  const saved = localStorage.getItem('zynora-theme') || 'dark';
  root.setAttribute('data-theme', saved);
  if (themeBtn) themeBtn.textContent = saved === 'light' ? '🌙' : '☀️';
  themeBtn?.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    themeBtn.textContent = next === 'light' ? '🌙' : '☀️';
    localStorage.setItem('zynora-theme', next);
  });

  /* ── Hero parallax glow ────────────────────────────────── */
  const heroGlow = document.querySelector('.hero-glow');
  document.querySelector('.hero-section')?.addEventListener('mousemove', e => {
    const rX = (e.clientX / window.innerWidth  - 0.5) * 40;
    const rY = (e.clientY / window.innerHeight - 0.5) * 40;
    if (heroGlow) heroGlow.style.transform = `translate(calc(-50% + ${rX}px), calc(-50% + ${rY}px))`;
  }, { passive: true });

  /* ── Typing effect ─────────────────────────────────────── */
  const typeTarget = document.getElementById('typing-text');
  const roles = ['Creative Coder.', 'UI/UX Specialist.', 'System Architect.', 'WebGL Enthusiast.'];
  let wI=0, cI=0, del=false;
  const tick = () => {
    const word = roles[wI];
    del ? cI-- : cI++;
    if (typeTarget) typeTarget.textContent = word.slice(0, cI);
    let delay = del ? 36 : 88;
    if (!del && cI === word.length) { delay = 2200; del = true; }
    else if (del && cI === 0)      { del = false; wI = (wI+1) % roles.length; delay = 480; }
    setTimeout(tick, delay);
  };
  if (typeTarget) setTimeout(tick, 1600);

  /* ── Scroll reveals ────────────────────────────────────── */
  const revObs = new IntersectionObserver((entries, obs) => {
    entries.forEach(e => { if (!e.isIntersecting) return; e.target.classList.add('active'); obs.unobserve(e.target); });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal:not(.active), .reveal-left, .reveal-right, .reveal-scale').forEach(el => revObs.observe(el));

  /* ── Bento counters ────────────────────────────────────── */
  const animCount = (el, target, ms=1800) => {
    let start = null;
    const suf = target > 50 ? '+' : '';
    const step = ts => {
      if (!start) start = ts;
      const p = Math.min((ts-start)/ms, 1);
      const e = 1 - Math.pow(1-p, 3);
      el.textContent = Math.floor(e * target) + suf;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  // (counters observed below via cntObs)

  // Start counters when in view
  const cntObs = new IntersectionObserver((entries, obs) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      animCount(e.target, parseInt(e.target.getAttribute('data-target'), 10));
      obs.unobserve(e.target);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-target]').forEach(el => cntObs.observe(el));

  /* ── GitHub graph ──────────────────────────────────────── */
  const ghGrid = document.getElementById('gh-grid');
  if (ghGrid) {
    const lvlProb = [0,0,0,0,1,1,1,2,2,3,4];
    for (let i=0; i<182; i++) {
      const cell = document.createElement('div');
      const lv = lvlProb[Math.floor(Math.random() * lvlProb.length)];
      cell.className = 'gh-cell' + (lv ? ` gh-level-${lv}` : '');
      ghGrid.appendChild(cell);
    }
  }

  /* ── Portfolio filter ──────────────────────────────────── */
  const filterBtns  = document.querySelectorAll('.filter-btn');
  const filterItems = document.querySelectorAll('.filter-item');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelector('.filter-btn.active')?.classList.remove('active');
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');
      filterItems.forEach(item => {
        const match = filter === 'all' || item.getAttribute('data-category') === filter;
        if (match) {
          item.style.display = '';
          requestAnimationFrame(() => { item.style.opacity='1'; item.style.transform='scale(1)'; });
        } else {
          item.style.opacity='0'; item.style.transform='scale(0.9)';
          setTimeout(() => { item.style.display='none'; }, 310);
        }
      });
    });
  });

  /* ── 3D card tilt ──────────────────────────────────────── */
  if (!isTouch()) {
    document.querySelectorAll('.project-card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const rX = ((e.clientY - r.top)  / r.height - 0.5) * -16;
        const rY = ((e.clientX - r.left) / r.width  - 0.5) *  16;
        card.style.transition = 'none';
        card.style.transform = `perspective(900px) rotateX(${rX}deg) rotateY(${rY}deg) scale(1.025)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transition = 'transform 0.7s cubic-bezier(0.175,0.885,0.32,1.275)';
        card.style.transform = 'perspective(900px) rotateX(0) rotateY(0) scale(1)';
      });
    });
  }

  /* ── Lightbox ──────────────────────────────────────────── */
  const lightbox = document.getElementById('lightbox');
  const lbImg    = document.getElementById('lb-img');
  const lbTitle  = document.getElementById('lb-title');
  const lbCat    = document.getElementById('lb-cat');
  const lbClose  = document.getElementById('lb-close');
  const openLightbox = (src, title, cat) => {
    if (lbImg)   lbImg.src           = src;
    if (lbTitle) lbTitle.textContent  = title || '';
    if (lbCat)   lbCat.textContent    = cat   || '';
    lightbox?.classList.add('open');
    document.body.style.overflow = 'hidden';
  };
  const closeLightbox = () => {
    lightbox?.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(() => { if (lbImg) lbImg.src = ''; }, 500);
  };
  document.querySelectorAll('.project-overlay').forEach(ov => {
    ov.addEventListener('click', () => openLightbox(ov.dataset.src||'', ov.dataset.title||'', ov.dataset.cat||''));
  });
  document.querySelectorAll('.project-card[tabindex]').forEach(card => {
    card.addEventListener('keydown', e => { if (e.key==='Enter'||e.key===' ') { e.preventDefault(); card.querySelector('.project-overlay')?.click(); }});
  });
  lbClose?.addEventListener('click', closeLightbox);
  lightbox?.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });

  /* ── Timeline ──────────────────────────────────────────── */
  const tlFill  = document.getElementById('tl-fill');
  const tlRail  = document.getElementById('tl-rail');
  const tlItems = document.querySelectorAll('.timeline-item[data-tl-pct]');
  const tlDots  = [0,1,2,3].map(i => document.getElementById(`tl-dot-${i}`));
  const updateTl = () => {
    if (!tlRail) return;
    const r = tlRail.getBoundingClientRect();
    const pct = Math.min(Math.max(((window.innerHeight - r.top) / r.height) * 100, 0), 100);
    if (tlFill) tlFill.style.height = `${pct}%`;
    tlItems.forEach((item, i) => {
      // getAttribute works regardless of camelCase vs kebab-case
      const threshold = parseInt(item.getAttribute('data-tl-pct') || item.dataset.tlPct || '0', 10);
      tlDots[i]?.classList.toggle('lit', pct >= threshold);
    });
  };
  window.addEventListener('scroll', updateTl, { passive: true });
  updateTl();

  /* ── Accordion ─────────────────────────────────────────── */
  document.querySelectorAll('.accordion-head').forEach(head => {
    head.addEventListener('click', () => {
      const parent = head.parentElement;
      const isOpen = parent.classList.contains('open');
      document.querySelectorAll('.accordion-item.open').forEach(item => item.classList.remove('open'));
      if (!isOpen) parent.classList.add('open');
    });
  });

  /* ── Form validation ───────────────────────────────────── */
  const form       = document.getElementById('contact-form');
  const submitBtn  = document.getElementById('submit-btn');
  const formOk     = document.getElementById('form-success');
  if (form) {
    const rules = {
      'f-name':    v => v.trim().length >= 2,
      'f-email':   v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
      'f-subject': v => v.trim().length >= 2,
      'f-message': v => v.trim().length >= 20,
    };
    const validate = id => {
      const f = document.getElementById(id); if (!f) return true;
      const ok = rules[id]?.(f.value) ?? true;
      f.closest('.form-group')?.classList.toggle('has-error', !ok);
      return ok;
    };
    Object.keys(rules).forEach(id => {
      document.getElementById(id)?.addEventListener('blur',  () => validate(id));
      document.getElementById(id)?.addEventListener('input', () => { if (rules[id]?.(document.getElementById(id).value)) document.getElementById(id).closest('.form-group')?.classList.remove('has-error'); });
    });
    form.addEventListener('submit', e => {
      e.preventDefault();
      if (!Object.keys(rules).map(validate).every(Boolean)) return;
      submitBtn.textContent = 'Sending…'; submitBtn.disabled = true;
      setTimeout(() => {
        if (formOk) formOk.style.display = 'block';
        submitBtn.textContent = '✓ Sent';
        setTimeout(() => {
          form.reset(); submitBtn.textContent = 'Send Message →'; submitBtn.disabled = false;
          if (formOk) formOk.style.display = 'none';
        }, 5000);
      }, 1400);
    });
  }

});
