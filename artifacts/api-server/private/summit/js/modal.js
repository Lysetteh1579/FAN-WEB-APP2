const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
const EMAIL_RE = /^\S+@\S+\.\S+$/;

export function initModal() {
  const modal = document.getElementById('register-modal');
  if (!modal) return;
  const dialog = modal.querySelector('.modal-dialog');
  const form = document.getElementById('register-form');
  const success = document.getElementById('register-success');
  const bgEls = [document.querySelector('.site-header'), document.getElementById('main'), document.querySelector('.site-footer'), document.querySelector('.skip-link')].filter(Boolean);
  const fields = {
    fullName: form.elements.fullName,
    email: form.elements.email,
    role: form.elements.userRole,
  };
  let trigger = null;

  function setError(input, msg) {
    const err = document.getElementById(`${input.id}-error`);
    if (msg) {
      input.setAttribute('aria-invalid', 'true');
      err.textContent = msg;
      err.hidden = false;
    } else {
      input.removeAttribute('aria-invalid');
      err.textContent = '';
      err.hidden = true;
    }
  }

  function validate() {
    const errors = {};
    if (fields.fullName.value.trim().length < 2) errors.fullName = 'Please enter your full name (at least 2 characters).';
    if (!EMAIL_RE.test(fields.email.value.trim())) errors.email = 'Please enter a valid email address, like name@studio.com.';
    if (!fields.role.value) errors.role = 'Please select your role.';
    Object.entries(fields).forEach(([k, el]) => setError(el, errors[k]));
    return errors;
  }

  function reset() {
    form.reset();
    Object.values(fields).forEach((el) => setError(el, ''));
    form.hidden = false;
    success.hidden = true;
  }

  function open(e) {
    trigger = e?.currentTarget || document.activeElement;
    reset();
    modal.hidden = false;
    bgEls.forEach((el) => { el.inert = true; el.setAttribute('aria-hidden', 'true'); });
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => modal.classList.add('is-open'));
    fields.fullName.focus();
    document.addEventListener('keydown', onKey);
  }

  function close() {
    if (modal.hidden) return;
    modal.classList.remove('is-open');
    modal.hidden = true;
    bgEls.forEach((el) => { el.inert = false; el.removeAttribute('aria-hidden'); });
    document.body.style.overflow = '';
    document.removeEventListener('keydown', onKey);
    reset();
    if (trigger && typeof trigger.focus === 'function') trigger.focus();
    trigger = null;
  }

  function onKey(e) {
    if (e.key === 'Escape') { e.preventDefault(); close(); return; }
    if (e.key !== 'Tab') return;
    const items = Array.from(dialog.querySelectorAll(FOCUSABLE)).filter((el) => el.offsetParent !== null || el === document.activeElement);
    if (!items.length) { e.preventDefault(); return; }
    const first = items[0];
    const last = items[items.length - 1];
    if (!dialog.contains(document.activeElement)) { e.preventDefault(); first.focus(); return; }
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const errors = validate();
    const firstBad = ['fullName', 'email', 'role'].find((k) => errors[k]);
    if (firstBad) { fields[firstBad].focus(); return; }
    // Demo only: nothing is stored or transmitted.
    form.reset();
    form.hidden = true;
    success.hidden = false;
    success.focus();
  });

  Object.values(fields).forEach((el) => {
    el.addEventListener(el.tagName === 'SELECT' ? 'change' : 'input', () => {
      if (el.getAttribute('aria-invalid') === 'true') {
        const errors = validate();
        Object.entries(fields).forEach(([k, f]) => { if (f !== el && !f.hasAttribute('aria-invalid')) setError(f, ''); else if (f !== el) setError(f, errors[k]); });
      }
    });
  });

  document.querySelectorAll('.js-open-register').forEach((b) => b.addEventListener('click', open));
  modal.querySelectorAll('[data-close-modal]').forEach((b) => b.addEventListener('click', close));
}
