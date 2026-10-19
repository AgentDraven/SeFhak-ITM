# SEFHAK MERIT E2E Validation — 2026-10-19

## Scope

This record covers the consumer portal and its ITM booking handoff. It uses only project roles/personas and contains no secrets or personal user details.

## Commands and evidence

- Consumer: `npm run verify`
- Consumer: `npm run e2e:playwright`
- Consumer evidence: `merit-demo docs/evidence/` (desktop and mobile route screenshots)
- Provider: `npm run build`
- Provider unit test: `node --experimental-strip-types --test tests/itm-calendar.test.ts`
- Provider Playwright: `npx playwright test tests/e2e/itm-calendar.spec.ts --reporter=line`
- Provider local API probe: availability, catalog, hold, conflict, checkout gate, and confirmation

## Consumer results

| Persona/scenario | Expected result | Observed result |
|---|---|---|
| Visitor opens public routes | All configured routes serve | PASS: home, portal, AMA, journal, subscription, play, admin, diagnostics |
| Desktop visitor | Screenshot evidence is captured | PASS: route screenshots in `merit-demo docs/evidence/` |
| Mobile visitor | Key mobile routes remain usable | PASS: portal, play, journal, AMA screenshots captured |
| Visitor uses hosted MERIT runtime | Hello World, hosted-ready state, workbench, and Register free appear | PASS |
| Visitor uses journal during provider outage | Local fallback saves and renders an entry | PASS |
| Visitor uses AMA during provider outage | Local fallback posts and renders a question | PASS |
| Visitor sees subscription CTA | CTA does not imply activation when provider registration is absent | PASS/PENDING: CTA is intentionally fail-closed |
| Visitor reaches live ITM provider tenant | Activated registration route is available | PENDING: no live ITM registration URL is configured |
| Visitor opens booking while ITM provider is unavailable | UI remains fail-closed and offers subscriber registration fallback | PASS: pending activation message and `/subs/` fallback link |
| Provider health | Required MERIT production health and registry are reachable | PASS: `merit-prod` health and registry; WARN: `meritsubs` health returned HTTP 404 |

Consumer command ended with: `E2E OK: sefhak routes, provider links, Hello World, screenshots`. The booking-unavailable assertion also passed, confirming the consumer does not imply live activation.

## Booking/persona contract

| Persona/scenario | Expected result | Observed result |
|---|---|---|
| Visitor | Can view availability and catalog without holding a slot | PASS in provider E2E |
| Unauthenticated visitor attempts a hold | Request is rejected | PASS negative case: HTTP 401 |
| Registered subscriber | Can hold an available slot | PASS: HTTP 200 |
| Second subscriber selects the same slot | Conflict is rejected | PASS negative case: HTTP 409 |
| Subscriber without confirmed checkout | Appointment is not confirmed | PASS negative case: HTTP 402 |
| Confirmed subscriber | Appointment becomes booked | PASS: HTTP 200 and `booked` status |
| VitalHealth visitor | Sees consultation-based pricing rather than a fabricated amount | PASS: catalog status `consultation_required` |

## Pricing represented in the provider contract

- ITM intake: one-time `$45`
- ITM member: `$149/month`, including one 90-minute massage per month
- SHOLDR: `$50/hour`
- VitalHealth: consultation-priced

## Evidence boundary and next step

The provider calendar is an alpha implementation with in-process memory. It is not yet production-durable: database persistence, expiry cleanup, authenticated MeritSubs token validation, audit IDs, and live ITM tenant activation remain required. The consumer therefore fails closed instead of claiming that booking is live.

AgentSync reference: [MERIT Labs folder](https://drive.google.com/drive/folders/1YY824Wj45d3waXuqfQQfiQDRgF2d0xxA), [STATE.md](https://drive.google.com/file/d/1gxfZ5WPk3pKzl7kq3zbx19k2jlivnXXT/view?usp=drivesdk), and [handover](https://drive.google.com/file/d/1ifkTzqRKfq7JVRHDEOElYb00oe9hVHLy/view?usp=drivesdk). GitHub push, deployment, and AgentSync write remain approval-gated.
