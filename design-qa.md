# Design QA — Храм Святой Троицы, с. Усть-Ницинское

## Comparison target

- Source visual truth: `design-reference.png`
- Rendered implementation: `implementation-desktop-v5.png`
- Full-view side-by-side evidence: `design-comparison-desktop-v2.png`
- Focused rector-card evidence: `design-comparison-rector.png`
- Responsive evidence: `implementation-mobile.png`, `interaction-mobile-menu.png`, `interaction-mobile-modal.png`
- Payment-flow evidence: `interaction-modal-step1.png`, `interaction-payment-demo.png`
- Viewport and state: desktop landing page, top of page, modal closed, 1487 × 1058 CSS px
- Source pixels: 1487 × 1058
- Implementation pixels: 1487 × 1058
- Device scale factor: 1
- Density normalization: none required; source and implementation were captured at identical pixel dimensions

## Findings

No actionable P0, P1, or P2 findings remain.

- [P3] The authentic church photograph has a tighter crop and slightly softer source resolution than the generated panorama in the visual target.
  - Location: hero image.
  - Evidence: the source target shows more sky and a wider western facade; the implementation uses the official 564 × 750 parish photograph and therefore crops closer at the same wide slot.
  - Impact: minor image-detail drift only; the correct church and architectural subject remain immediately recognizable.
  - Disposition: accepted in favor of source authenticity. A sharper wide photograph supplied by the parish can replace it without changing layout.

- [P3] Header and decorative cross marks use the closest Lucide icon-library equivalents rather than the bespoke generated ornaments.
  - Location: header brand, hero ornament, section dividers.
  - Evidence: stroke weight and gold treatment match, while the exact ornament geometry differs.
  - Impact: minor decorative difference with no usability or hierarchy impact.
  - Disposition: accepted; no handcrafted SVG or CSS illustration was substituted.

## Required fidelity surfaces

- Fonts and typography: Cormorant Garamond is used for display and editorial text; Manrope is used for controls and small UI copy. Weight, scale, line height, wrapping, and optical hierarchy remain coherent at desktop and mobile sizes.
- Spacing and layout rhythm: the final desktop geometry matches the source composition — 112 px header, 529 px hero, 365 px editorial-card region, and 52 px location strip. Hero card, two-column content, borders, button sizes, and vertical rhythm align with the target.
- Colors and visual tokens: deep navy, restrained warm gold, cream paper, thin gold borders, and low-contrast secondary text are consistently tokenized and visually match the source.
- Image quality and asset fidelity: the rector portrait is the exact official image from the Алапаевская епархия source, not generated or stylized. The church hero also uses the official parish photograph. Both have responsive object positioning and retain natural proportions.
- Copy and content: the site consistently identifies the Holy Trinity Church in Ust-Nitsinskoye and rector Mitrophoric Archpriest Fyodor Gerasimov. It does not mix facts from the Holy Trinity Cathedral in Alapayevsk. Unconfirmed information about the “Venetskaya” icon is explicitly marked for parish approval.
- Icons: all visible icons come from one library, use consistent stroke weight, align to text, and expose no broken or placeholder states.
- Responsiveness: verified at 390 × 844 with no horizontal overflow. The mobile hero, menu, editorial cards, and bottom-sheet form remain usable.
- Accessibility: semantic headings and controls, alt text, visible focus rings, reduced-motion handling, Escape-to-close, initial modal focus, modal focus trapping, labels, and practical mobile tap targets are implemented.

## Interaction and runtime checks

- Header anchors and mobile menu open/close behavior were exercised.
- “Заказать молебен” opens the service selector.
- Service selection, names, phone, donation amount, and consent progress to payment review.
- Card and СБП states were exercised.
- The demo payment reaches “Заявка сформирована”; the UI clearly states that no funds are charged.
- Modal desktop and mobile layouts were visually checked.
- Browser console warnings/errors checked: none.
- Horizontal overflow checked at 1487 px and 390 px: none.
- Production build completed successfully.
- Sites packaging tests: 4 passed, 0 failed.

## Comparison history

### Pass 1

- [P2] A mobile-menu button was visible in the desktop header and the date had a duplicated year suffix.
  - Fix: strengthened the desktop visibility rule and formatted the date from separate day/month and year parts.
- [P2] The first-screen editorial cards extended below the source composition and the target's bottom information strip was absent.
  - Fix: matched the source's measured vertical geometry and added the 52 px address/status strip.

### Pass 2

- Post-fix evidence: `implementation-desktop-v5.png` and `design-comparison-desktop-v2.png`.
- Result: desktop region geometry aligns to the source; no actionable P0/P1/P2 mismatch remains.

## Open questions before real payments

- The parish must approve the final list of services, the donation model, acquiring provider, merchant details, receipt process, privacy/consent text, and handling/refund policy.
- The parish should confirm the “Venetskaya” icon information and provide a publication-cleared photograph before turning the editorial note into a public shrine page.

## Follow-up polish

- Replace the low-resolution church hero with a parish-approved high-resolution wide photograph when available.
- Replace the generic library church mark with an approved parish emblem if one exists.

final result: passed
