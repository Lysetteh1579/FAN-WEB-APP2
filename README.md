# Lash Pro Summit 2026 — Event Portal (Presentation Demo)

A static, vanilla HTML/CSS/JavaScript event page. No backend, database, auth, payments, or AI. Vite is used only to serve/build.

## Structure
```
index.html
css/style.css  css/components.css  css/responsive.css
js/app.js  js/filter.js  js/modal.js  js/timer.js
data/speakers.js  data/agenda.js
assets/images/
```
(`src/` is leftover scaffold and is not loaded.)

## Running
- **pnpm / Vite:** `pnpm --filter @workspace/lash-pro-summit run dev` (requires `PORT` and `BASE_PATH` env vars, e.g. `PORT=5173 BASE_PATH=/`). Build: `run build` (outputs `dist/public`).
- **Plain static server (including the standalone GitHub copy):** from this folder run `python3 -m http.server 8080` or `npx serve .` and open http://localhost:8080. No installation or build is needed. ES modules require HTTP; opening the file directly via `file://` will not work.

Note: in a Vite build, `assets/images/` files are not copied automatically; if photos are added, place them in `public/assets/images/` as well, or serve the folder statically.

## Demo limitations
- **Registration is demo only.** Nothing is saved, sent, or persisted; no seat is reserved. Reopening the dialog resets it.
- **Speaker photos not supplied.** Monogram placeholders are shown. To enable a photo, add the file at the path in `data/speakers.js` and set `photoAvailable: true`. A failed load falls back to the monogram. No image requests are made while `photoAvailable` is false.
- **Agenda times and titles not supplied.** Sessions show "Time TBA" and "Session details to be announced" under a "Schedule to be announced" label.
- No social profile URLs, prices, attendance numbers, or testimonials are included.
- Accessibility: designed to target WCAG 2.2 AA; not independently audited.

## Manual QA checklist
1. Header stays sticky; at < 768px a hamburger toggles the menu (aria-expanded updates, Escape closes). Anchors #speakers, #agenda, #about scroll correctly.
2. Countdown ticks every second with fixed-width digits. To test expiry, temporarily change `EVENT_START` in `js/timer.js` to a past date: "Event Live Now!" shows, no negative values, interval stops.
3. Filters: each button shows only matching speakers instantly; active button is rose and `aria-pressed="true"`.
4. Agenda: select a speaker link while a different filter is active — filter resets to All, page scrolls to the card and focuses it.
5. Registration: any "Claim Your Seat" opens the dialog; focus lands on Full name; Tab/Shift+Tab stay trapped; Escape, overlay click, and close button close it; focus returns to the opening button; page behind does not scroll.
6. Submit empty: red inline errors, `aria-invalid`, focus moves to first invalid field. Valid submit shows "Registration Complete! We have saved your seat for Lash Pro Summit 2026." with the demo notice.
7. Check widths 320, 768, 1024, 1440: no horizontal scroll; 1 / 2 / 4 columns; content max 1200px centered.
8. Enable OS "reduce motion": reveals, iris rotation, and transitions are disabled.
