/* ============================================================
   INTELLIGENT IoT — Main JavaScript
   ============================================================ */

/* ── THEME ────────────────────────────────────────────────────── */
const Theme = {
  init() {
    const saved = localStorage.getItem('iiot-theme') || 'light';
    this.set(saved, false);
    document.getElementById('theme-toggle')?.addEventListener('click', () => this.toggle());
  },
  set(theme, save = true) {
    document.documentElement.setAttribute('data-theme', theme);
    const btn = document.getElementById('theme-toggle');
    if (btn) btn.innerHTML = theme === 'dark' ? Icons.sun : Icons.moon;
    if (save) localStorage.setItem('iiot-theme', theme);
  },
  toggle() {
    const current = document.documentElement.getAttribute('data-theme');
    this.set(current === 'dark' ? 'light' : 'dark');
  }
};

const Icons = {
  sun: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`,
  moon: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`
};

/* ── NAV ──────────────────────────────────────────────────────── */
const Nav = {
  init() {
    const nav = document.getElementById('main-nav');
    const hamburger = document.getElementById('nav-hamburger');
    const mobile = document.getElementById('nav-mobile');
    const close = document.getElementById('nav-close');

    window.addEventListener('scroll', () => {
      nav?.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });

    hamburger?.addEventListener('click', () => mobile?.classList.add('open'));
    close?.addEventListener('click', () => mobile?.classList.remove('open'));
    mobile?.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => mobile.classList.remove('open'));
    });
  }
};

/* ── PARTICLE NETWORK HERO ────────────────────────────────────── */
class ParticleNet {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.raf = null;
    this.dark = document.documentElement.getAttribute('data-theme') === 'dark';
    this.resize();
    this.spawn();
    this.tick();
    window.addEventListener('resize', () => { this.resize(); this.spawn(); });
    new MutationObserver(() => {
      this.dark = document.documentElement.getAttribute('data-theme') === 'dark';
    }).observe(document.documentElement, { attributes: true });
  }
  resize() {
    this.canvas.width = this.canvas.offsetWidth;
    this.canvas.height = this.canvas.offsetHeight;
  }
  spawn() {
    const n = Math.min(Math.floor(this.canvas.width * this.canvas.height / 14000), 80);
    this.particles = Array.from({ length: n }, () => ({
      x: Math.random() * this.canvas.width,
      y: Math.random() * this.canvas.height,
      vx: (Math.random() - .5) * .45,
      vy: (Math.random() - .5) * .45,
      r: Math.random() * 1.8 + .8,
      op: Math.random() * .4 + .25
    }));
  }
  tick() {
    const { canvas: c, ctx, particles: ps } = this;
    ctx.clearRect(0, 0, c.width, c.height);
    for (const p of ps) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > c.width)  p.vx *= -1;
      if (p.y < 0 || p.y > c.height) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(14,165,164,${p.op})`;
      ctx.fill();
    }
    const maxD = 130;
    for (let i = 0; i < ps.length; i++) {
      for (let j = i + 1; j < ps.length; j++) {
        const dx = ps[i].x - ps[j].x, dy = ps[i].y - ps[j].y;
        const d = Math.hypot(dx, dy);
        if (d < maxD) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(37,99,235,${(1 - d / maxD) * .25})`;
          ctx.lineWidth = .6;
          ctx.moveTo(ps[i].x, ps[i].y);
          ctx.lineTo(ps[j].x, ps[j].y);
          ctx.stroke();
        }
      }
    }
    this.raf = requestAnimationFrame(() => this.tick());
  }
}

/* ── SCROLL REVEAL ────────────────────────────────────────────── */
const Reveal = {
  init() {
    const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    if (!els.length) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    els.forEach(el => io.observe(el));
  }
};

/* ── STATS COUNTER ────────────────────────────────────────────── */
const Stats = {
  init() {
    const els = document.querySelectorAll('[data-count]');
    if (!els.length) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          this.count(e.target);
          io.unobserve(e.target);
        }
      });
    }, { threshold: .5 });
    els.forEach(el => io.observe(el));
  },
  count(el) {
    const target = +el.dataset.count;
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    const dur = 2000;
    const start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      el.textContent = prefix + Math.round(ease * target) + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
};

/* ── DEMO GATE MODAL ──────────────────────────────────────────── */
const DemoModal = {
  DEMO_URL: 'http://84.247.133.39:5176',
  init() {
    document.querySelectorAll('[data-demo]').forEach(btn => {
      btn.addEventListener('click', (e) => { e.preventDefault(); this.open(); });
    });
    document.getElementById('demo-overlay')?.addEventListener('click', (e) => {
      if (e.target.id === 'demo-overlay') this.close();
    });
    document.getElementById('demo-close')?.addEventListener('click', () => this.close());
    document.getElementById('demo-form')?.addEventListener('submit', (e) => this.submit(e));
  },
  open() {
    document.getElementById('demo-overlay')?.classList.add('open');
    document.body.style.overflow = 'hidden';
  },
  close() {
    document.getElementById('demo-overlay')?.classList.remove('open');
    document.body.style.overflow = '';
  },
  submit(e) {
    e.preventDefault();
    const btn = e.target.querySelector('[type=submit]');
    btn.textContent = 'Redirecting…';
    btn.disabled = true;
    setTimeout(() => { window.open(this.DEMO_URL, '_blank'); this.close(); btn.textContent = 'Access Demo'; btn.disabled = false; }, 800);
  }
};

/* ── CONTACT FORM (EmailJS) ───────────────────────────────────── */
const ContactForm = {
  SERVICE_ID: 'YOUR_EMAILJS_SERVICE_ID',
  TEMPLATE_ID: 'YOUR_EMAILJS_TEMPLATE_ID',
  PUBLIC_KEY: 'YOUR_EMAILJS_PUBLIC_KEY',
  init() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    form.addEventListener('submit', (e) => this.submit(e));
  },
  async submit(e) {
    e.preventDefault();
    const form = e.target;
    const btn = form.querySelector('[type=submit]');
    const msg = document.getElementById('form-msg');
    btn.disabled = true;
    btn.textContent = 'Sending…';
    try {
      if (typeof emailjs !== 'undefined') {
        await emailjs.sendForm(this.SERVICE_ID, this.TEMPLATE_ID, form, this.PUBLIC_KEY);
      }
      form.reset();
      if (msg) { msg.textContent = '✓ Message sent! We\'ll be in touch within 24 hours.'; msg.className = 'form-msg form-msg--ok'; }
    } catch {
      if (msg) { msg.textContent = 'Something went wrong. Please email us directly at info@intelligenceiot.com'; msg.className = 'form-msg form-msg--err'; }
    } finally {
      btn.disabled = false;
      btn.textContent = 'Send Message';
    }
  }
};

/* ── DEMO REQUEST FORM ────────────────────────────────────────── */
const DemoRequestForm = {
  DEMO_URL: 'http://84.247.133.39:5176',
  init() {
    const form = document.getElementById('demo-request-form');
    if (!form) return;
    form.addEventListener('submit', (e) => this.submit(e));
  },
  submit(e) {
    e.preventDefault();
    const btn = e.target.querySelector('[type=submit]');
    btn.disabled = true;
    btn.textContent = 'Launching Demo…';
    setTimeout(() => { window.open(this.DEMO_URL, '_blank'); btn.disabled = false; btn.textContent = 'Access Live Demo'; }, 1000);
  }
};

/* ── FLOATING DEMO BUTTON ─────────────────────────────────────── */
const FloatingDemo = {
  init() {
    const btn = document.getElementById('demo-float');
    if (!btn) return;
    window.addEventListener('scroll', () => {
      btn.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });
    btn.addEventListener('click', (e) => { e.preventDefault(); DemoModal.open(); });
  }
};

/* ── COOKIE BANNER ────────────────────────────────────────────── */
const Cookie = {
  init() {
    if (localStorage.getItem('iiot-cookie')) return;
    const banner = document.getElementById('cookie-banner');
    if (!banner) return;
    setTimeout(() => banner.classList.add('visible'), 1500);
    document.getElementById('cookie-accept')?.addEventListener('click', () => this.accept());
    document.getElementById('cookie-decline')?.addEventListener('click', () => this.accept());
  },
  accept() {
    localStorage.setItem('iiot-cookie', '1');
    document.getElementById('cookie-banner')?.classList.remove('visible');
  }
};

/* ── NEWSLETTER ───────────────────────────────────────────────── */
const Newsletter = {
  init() {
    document.querySelectorAll('.newsletter__form').forEach(form => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = form.querySelector('input');
        const btn = form.querySelector('button');
        btn.textContent = '✓ Subscribed!';
        btn.disabled = true;
        input.value = '';
        setTimeout(() => { btn.textContent = 'Subscribe'; btn.disabled = false; }, 3000);
      });
    });
  }
};

/* ── PRICING TOGGLE (annual/monthly placeholder) ──────────────── */
const Pricing = {
  init() {
    document.getElementById('billing-toggle')?.addEventListener('change', (e) => {
      document.querySelectorAll('.price-monthly').forEach(el => el.classList.toggle('hidden', e.target.checked));
      document.querySelectorAll('.price-annual').forEach(el => el.classList.toggle('hidden', !e.target.checked));
    });
  }
};

/* ── ACTIVE NAV LINK ──────────────────────────────────────────── */
const ActiveNav = {
  init() {
    const path = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav__link').forEach(a => {
      const href = a.getAttribute('href');
      if (href === path || (path === '' && href === 'index.html')) {
        a.style.color = 'var(--blue)';
        a.style.background = 'var(--blue-light)';
      }
    });
  }
};

/* ── BOOT ─────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  Theme.init();
  Nav.init();
  Reveal.init();
  Stats.init();
  DemoModal.init();
  ContactForm.init();
  DemoRequestForm.init();
  FloatingDemo.init();
  Cookie.init();
  Newsletter.init();
  Pricing.init();
  ActiveNav.init();
  if (document.getElementById('hero-canvas')) {
    new ParticleNet('hero-canvas');
  }
});

/* ── CSS additions for form messages ─────────────────────────── */
const s = document.createElement('style');
s.textContent = `.form-msg{padding:.75rem 1rem;border-radius:8px;font-size:.875rem;margin-top:.75rem}
.form-msg--ok{background:#DCFCE7;color:#166534}
.form-msg--err{background:#FEE2E2;color:#991B1B}
[data-theme="dark"] .form-msg--ok{background:rgba(22,101,52,.2);color:#86EFAC}
[data-theme="dark"] .form-msg--err{background:rgba(153,27,27,.2);color:#FCA5A5}
.hidden{display:none!important}`;
document.head.appendChild(s);
