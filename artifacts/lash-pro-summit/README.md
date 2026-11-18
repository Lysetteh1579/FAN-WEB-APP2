# Lash Pro Summit 2026 — Private Event Portal

A vanilla HTML/CSS/JavaScript event page behind working Clerk authentication.
The user approved authentication as a separate step before Phase 2.
Account signup is open to everyone; access to the event requires a session.
Only the authentication shell uses React; the original summit remains vanilla.
Event registration is still a demonstration, not a real reservation.

## Structure
```
artifacts/lash-pro-summit/
  index.html, src/          # public authentication shell
  public/                  # public brand assets only
artifacts/api-server/
  private/summit/           # protected original HTML, CSS, JS, speaker data
  src/routes/summit.ts      # verifies sessions before sending event files
  src/middlewares/clerkProxyMiddleware.ts
```

## Running
- Use pnpm to install the workspace dependencies.
- In Replit, start the managed **API Server** and **Lash Pro Summit 2026** workflows. They supply their own ports and URL prefixes.
- Authentication uses auto-provisioned `CLERK_SECRET_KEY`, `CLERK_PUBLISHABLE_KEY`, and `VITE_CLERK_PUBLISHABLE_KEY`. Never commit secret values.
- For another hosting environment, configure your own Clerk instance and the same environment variable names through its secret manager, serve the frontend and API on one origin, and route `/api` to Express.
- Build the API with `pnpm --filter @workspace/api-server run build`; its build copies private event files next to the bundle, not into the public web build.
- Build the frontend with `pnpm --filter @workspace/lash-pro-summit run build` using the hosting environment's `PORT` and `BASE_PATH`.
- A plain static file server is **no longer sufficient**: session validation requires the API server.

## Authentication and protection

- `/` is a minimal public access page with sign-in and signup links, not the event website.
- `/sign-in` handles sign-in and password recovery; `/sign-up` handles signup and verification.
- `/user-portal` opens the existing summit in a same-origin protected document.
- `/api/summit/access` and every `/api/summit/content/` file require a verified session. Signed-out requests return 401.
- Responses containing event content use `Cache-Control: private, no-store`.
- Sign-out removes the event view; sessions are managed by Clerk rather than local password storage.
- The production Clerk proxy must remain mounted before body parsers in the API server.
- Accounts created in the development environment are separate from production accounts.
- Do not copy `private/summit/` into the frontend's public directory. Vite's filesystem serving rules also deny access to private files.

## Demo limitations
- **Registration is demo only.** Nothing is saved, sent, or persisted; no seat is reserved. Reopening the dialog resets it.
- **Speaker photos not supplied.** Monogram placeholders are shown. To enable a photo, add it under the protected `private/summit/assets/images/` path and set `photoAvailable: true` in the protected speaker data. A failed load falls back to the monogram. No image requests are made while `photoAvailable` is false.
- **Agenda times and titles not supplied.** Sessions show "Time TBA" and "Session details to be announced" under a "Schedule to be announced" label.
- No social profile URLs, prices, attendance numbers, or testimonials are included.
- Accessibility: designed to target WCAG 2.2 AA; not independently audited.

## Manual QA checklist
0. Signed out: event content is absent from `/`, `/user-portal` returns to the access page, and protected API/file requests return 401. Create a verified account, sign in, refresh, then sign out and confirm content is no longer accessible. Check password recovery from the sign-in form.
1. Header stays sticky; at < 768px a hamburger toggles the menu (aria-expanded updates, Escape closes). Anchors #speakers, #agenda, #about scroll correctly.
2. Countdown ticks every second with fixed-width digits. To test expiry, temporarily change `EVENT_START` in `js/timer.js` to a past date: "Event Live Now!" shows, no negative values, interval stops.
3. Filters: each button shows only matching speakers instantly; active button is rose and `aria-pressed="true"`.
4. Agenda: select a speaker link while a different filter is active — filter resets to All, page scrolls to the card and focuses it.
5. Registration: any "Claim Your Seat" opens the dialog; focus lands on Full name; Tab/Shift+Tab stay trapped; Escape, overlay click, and close button close it; focus returns to the opening button; page behind does not scroll.
6. Submit empty: red inline errors, `aria-invalid`, focus moves to first invalid field. Valid submit shows "Registration Complete! We have saved your seat for Lash Pro Summit 2026." with the demo notice.
7. Check widths 320, 768, 1024, 1440: no horizontal scroll; 1 / 2 / 4 columns; content max 1200px centered.
8. Enable OS "reduce motion": reveals, iris rotation, and transitions are disabled.
