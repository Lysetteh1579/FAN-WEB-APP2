const EVENT_START = new Date('2026-12-01T09:00:00-05:00').getTime();

const pad = (n) => String(Math.max(0, n)).padStart(2, '0');

export function initTimer() {
  const nums = {};
  document.querySelectorAll('.cd-num').forEach((el) => { nums[el.dataset.unit] = el; });
  const grid = document.getElementById('countdown-grid');
  const live = document.getElementById('countdown-live');
  const label = document.getElementById('countdown-label');
  if (!grid || !live) return;

  let intervalId = null;

  function tick() {
    const diff = EVENT_START - Date.now();
    if (diff <= 0) {
      if (intervalId !== null) { clearInterval(intervalId); intervalId = null; }
      Object.values(nums).forEach((el) => { el.textContent = '00'; });
      grid.hidden = true;
      if (label) label.hidden = true;
      live.hidden = false;
      return false;
    }
    const total = Math.floor(diff / 1000);
    const values = {
      days: Math.floor(total / 86400),
      hours: Math.floor((total % 86400) / 3600),
      minutes: Math.floor((total % 3600) / 60),
      seconds: total % 60,
    };
    for (const [k, v] of Object.entries(values)) {
      const el = nums[k];
      if (!el) continue;
      const text = k === 'days' ? String(v).padStart(3, '0') : pad(v);
      if (el.textContent !== text) el.textContent = text;
    }
    grid.setAttribute('aria-label', `${values.days} days, ${values.hours} hours, ${values.minutes} minutes remaining`);
    return true;
  }

  if (tick()) intervalId = setInterval(tick, 1000);
}
