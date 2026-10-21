# ITM

Canonical consumer repository: [AgentDraven/ITM](https://github.com/AgentDraven/ITM), `main`. Local consumer folder: `C:\DApps\ITM`. Shared Store source: `C:\DApps\merit-utils\services\merit-store`; shared identity source: `C:\DApps\merit-subs`.

ITM is the company and consumer product name. This repository delivers the customer front end for the ITM store: service information, contact, booking selection, and subscriber access.

## Ownership

- This consumer owns ITM branding, pages, customer interactions, and the handoff to shared services.
- MeritStore, maintained inside `merit-utils/services/merit-store` on `main`, owns the ITM tenant catalog, availability, appointment holds, checkout, and booking confirmation APIs.
- MeritSubs owns subscriber identity and entitlements.
- MeritUtils supplies shared utilities such as the workbench and journal.

ITM uses the shared store; it does not maintain a separate commerce implementation inside this consumer.

## Local development

Run these commands from this repository:

```powershell
npm run verify
npm run providers:check -- --remote --hosted
npm run e2e:playwright
.\merit.ps1 serve
```

The build writes the customer site to `dist/`. Customer-facing branding is configured in [cfg/branding.json](cfg/branding.json) and [portal/portal.json](portal/portal.json). Provider connections are configured in [cfg/merit-sync.json](cfg/merit-sync.json).

## Current booking boundary

The shared ITM provider has recorded hosted read-only health, availability, and catalog checks. Live booking acceptance still requires durable persistence, hold-expiry cleanup, verified subscriber authentication, audit identifiers, and a hosted booking-mutation test. The consumer shows an unavailable state when booking is not activated.

See the [consumer validation record](docs/IAR/SEFHAK_E2E_VALIDATION_2026-10-19.md), the [consolidated provider validation record](https://github.com/AgentDraven/merit-utils/blob/main/services/merit-store/meritstore%20docs/IAR/ITM_E2E_VALIDATION_2026-10-19.md), and the [current consolidation checkpoint](docs/IAR/ITM_PROVIDER_CONSOLIDATION.md).

## Repository compatibility

The ITM consumer uses the canonical provider `main` commits recorded in `cfg/providers.lock.json`, with immutable utility URLs and integrity pins selected from that Utils main registry. Run `npm run providers:sync` against the canonical sibling provider folders after main advances, validate, and commit the lock and pins together. There is no provider source fork in this consumer. ITM's company name is independent of historical provider tenant identifiers; changing persisted identifiers requires a coordinated data migration.

The inherited `merit-demo docs/` files contain template and historical evidence. They do not establish current ITM production readiness. ITM's current company name and consumer/store ownership are defined above and in [AGENTS.md](AGENTS.md).
