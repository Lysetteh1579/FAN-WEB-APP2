# Lash Pro Summit 2026

A single-page virtual event portal for lash artists, studio owners, and beauty students.

## Project requirements

- Follow the user's V3 specification, preserved under `.local/conversation-workspace/files/attached_assets/`.
- The deliverable uses semantic HTML, modular CSS, and vanilla JavaScript. Vite supplies the preview/build tooling only.
- Registration is a frontend demonstration: do not collect, persist, or transmit registration information or imply an actual reservation.
- The user expanded the requirements to include a login page with working sign-in, not a visual demo. Anyone may create an account, and the entire event website must require sign-in. Authentication is separate from the demo event-registration form.
- Do not invent speaker biographies, ticket prices, session times, photographs, social profiles, or attendee claims. Use explicit TBA agenda details and speaker initials until approved assets are available.
- GitHub destination: `Lysetteh1579/FAN-WEB-APP2`, branch `future`. Keep `main` unchanged.
- Ask the user before additional project changes outside the approved build.
- Work in five phases: requirements, design, foundation, interactions, then testing and approval. Wait for the user's approval before starting each next phase. Keep the existing site as a draft reference rather than deleting it.
- The user approved keeping the centered hero during the design review, overriding the specification's split-screen desktop hero requirement.
- Authentication is an explicitly approved prerequisite step; Phase 2 remains paused until the user approves resuming it.

## Run & Operate

- Start the managed API Server and Lash Pro Summit workflows together; the same-origin API performs authentication checks.
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required authentication configuration is provisioned through Clerk. Never put secret values in source control. This login step does not require an application database.

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5, Clerk session middleware and production auth proxy
- Authentication shell: React + Clerk; protected summit: original vanilla HTML/CSS/JavaScript
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

_Populate as you build — short repo map plus pointers to the source-of-truth file for DB schema, API contracts, theme files, etc._

## Architecture decisions

_Populate as you build — non-obvious choices a reader couldn't infer from the code (3-5 bullets)._

## Product

_Describe the high-level user-facing capabilities of this app once they exist._

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

_Populate as you build — sharp edges, "always run X before Y" rules._

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
