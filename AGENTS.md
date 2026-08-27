# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

## Durable design direction

- The selected visual target is `design-reference.png`: deep navy, restrained gold accents, cream editorial cards, Cormorant-style serif typography, square ceremonial framing, and a large authentic church photograph.
- The rector portrait must always use the exact official source asset at `public/assets/fedor-gerasimov.jpg`; do not generate, stylize, or substitute his likeness.
- The public identity is the Holy Trinity Church in Ust-Nitsinskoye, rector Mitrophoric Archpriest Fyodor Gerasimov. Do not mix it with the Holy Trinity Cathedral in Alapayevsk.
- Online services are a working front-end demonstration until the parish approves the service list, donation policy, acquiring provider, legal texts, and payment details. The UI must state that no real funds are charged.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.
