import { agenda } from '../data/agenda.js';
import { speakers } from '../data/speakers.js';
import { initSpeakers, revealSpeaker } from './filter.js';
import { initModal } from './modal.js';
import { initTimer } from './timer.js';

function initNav() {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('primary-nav');
  const header = document.querySelector('.site-header');
  if (!toggle || !nav) return;
  const label = toggle.querySelector('.visually-hidden');
  const set = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('is-open', open);
    header.classList.toggle('menu-open', open);
    label.textContent = open ? 'Close menu' : 'Open menu';
  };
  toggle.addEventListener('click', () => set(toggle.getAttribute('aria-expanded') !== 'true'));
  nav.querySelectorAll('a, button').forEach((el) => el.addEventListener('click', () => set(false)));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') { set(false); toggle.focus(); }
  });
  window.matchMedia('(min-width: 768px)').addEventListener('change', (m) => { if (m.matches) set(false); });

  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 24);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

function initAgenda() {
  const list = document.getElementById('agenda-list');
  if (!list) return;
  const byId = Object.fromEntries(speakers.map((s) => [s.id, s]));
  list.innerHTML = agenda.map((a, i) => {
    const s = byId[a.speakerId];
    return `
    <li class="agenda-item cat-${s.category}" data-testid="row-agenda-${a.id}">
      <span class="agenda-num" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span>
      <p class="agenda-time">${a.time}</p>
      <div class="agenda-main">
        <p class="agenda-cat">${a.categoryLabel}</p>
        <h3 class="agenda-title">${a.title}</h3>
      </div>
      <a class="agenda-speaker" href="#${s.id}" data-speaker="${s.id}" data-testid="link-agenda-speaker-${s.id}">
        <span class="visually-hidden">Speaker: </span>${s.name}
        <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </a>
    </li>`;
  }).join('');
  list.addEventListener('click', (e) => {
    const link = e.target.closest('[data-speaker]');
    if (!link) return;
    e.preventDefault();
    revealSpeaker(link.dataset.speaker);
    history.replaceState(null, '', `#${link.dataset.speaker}`);
  });
}

function initReveal() {
  const els = document.querySelectorAll('.reveal, .speaker-card, .agenda-item');
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
    els.forEach((el) => el.classList.add('is-visible'));
    return;
  }
  document.documentElement.classList.add('js-motion');
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add('is-visible'); io.unobserve(en.target); }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  els.forEach((el) => io.observe(el));
}

function init() {
  const y = document.getElementById('year');
  if (y) y.textContent = String(Math.max(2026, new Date().getFullYear()));
  initNav();
  initSpeakers();
  initAgenda();
  initTimer();
  initModal();
  initReveal();
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();
