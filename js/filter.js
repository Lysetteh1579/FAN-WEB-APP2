import { speakers } from '../data/speakers.js';

const escapeHtml = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

function initials(name) {
  return name
    .replace(/^Dr\.\s*/i, '')
    .split(',')[0]
    .trim()
    .split(/\s+/)
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

function speakerCard(s, i) {
  const ini = initials(s.name);
  const photo = s.photoAvailable
    ? `<img class="speaker-img" src="${escapeHtml(s.image)}" alt="Portrait of ${escapeHtml(s.name)}" loading="lazy" width="600" height="750" />`
    : '';
  return `
  <li class="speaker-card cat-${s.category}" id="${s.id}" data-category="${s.category}" tabindex="-1" data-testid="card-speaker-${s.id}" style="--i:${i}">
    <div class="speaker-portrait">
      <div class="monogram" aria-hidden="true"><span>${ini}</span></div>
      ${photo}
      <span class="speaker-index" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span>
    </div>
    <div class="speaker-body">
      <p class="speaker-cat">${escapeHtml(s.categoryLabel)}</p>
      <h3 class="speaker-name" data-testid="text-speaker-name-${s.id}">${escapeHtml(s.name)}</h3>
      <p class="speaker-title">${escapeHtml(s.title)}</p>
      <p class="speaker-bio">${escapeHtml(s.bio)}</p>
    </div>
  </li>`;
}

let buttons = [];
let cards = [];
const labels = { all: 'all speakers', artistry: 'Artistry', health: 'Ocular Health', chemistry: 'Chemistry', business: 'Business' };

export function applyFilter(filter) {
  let shown = 0;
  buttons.forEach((b) => {
    const on = b.dataset.filter === filter;
    b.classList.toggle('is-active', on);
    b.setAttribute('aria-pressed', String(on));
  });
  cards.forEach((c) => {
    const show = filter === 'all' || c.dataset.category === filter;
    c.style.display = show ? '' : 'none';
    if (show) shown++;
  });
  const status = document.getElementById('filter-status');
  if (status) status.textContent = `Showing ${shown} ${shown === 1 ? 'speaker' : 'speakers'} for ${labels[filter] || filter}.`;
}

export function initSpeakers() {
  const grid = document.getElementById('speaker-grid');
  if (!grid) return;
  grid.innerHTML = speakers.map(speakerCard).join('');
  cards = Array.from(grid.querySelectorAll('.speaker-card'));

  // Fallback: hide any failed photo so the monogram shows through.
  grid.querySelectorAll('.speaker-img').forEach((img) => {
    const fail = () => img.remove();
    img.addEventListener('error', fail, { once: true });
    if (img.complete && img.naturalWidth === 0) fail();
  });

  buttons = Array.from(document.querySelectorAll('#speaker-filters .filter-btn'));
  buttons.forEach((b) => b.addEventListener('click', () => applyFilter(b.dataset.filter)));
}

export function revealSpeaker(id) {
  const card = document.getElementById(id);
  if (!card) return;
  if (card.style.display === 'none') applyFilter('all');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  card.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
  card.focus({ preventScroll: true });
  card.classList.remove('is-highlight');
  void card.offsetWidth;
  card.classList.add('is-highlight');
}
