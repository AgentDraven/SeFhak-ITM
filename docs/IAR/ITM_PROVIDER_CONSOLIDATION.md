# ITM shared-provider acceptance — 2026-10-21

**ACK:** the user directed ITM naming, reconciliation of the separate Store checkout, physical Store consolidation into Utils, no extra branches/forks, and consumption of provider main tips.

## Current source contract

- Consumer: `AgentDraven/ITM`, branch `main`, local `C:/DApps/ITM`. Renamed in place from the historical repository/folder; existing repository identity and history are preserved.
- Utilities and commerce: `AgentDraven/merit-utils`, branch `main`. Shared Store code is `services/merit-store` in the same Git tree. ITM is tenant `itm`, with the pre-existing subscriber consumer ID `sefhak` retained for data compatibility.
- Identity: `AgentDraven/merit-subs`, branch `main`; the consumer proxies its canonical V01 API without shipping provider source.
- `cfg/providers.lock.json` records the exact accepted main revisions. `npm run providers:sync` reads the current main registry, updates immutable version/SRI pairs and page pins together, and rejects a noncanonical branch/root. `providers:check -- --remote --hosted` rejects stale remote-main references and mismatched hosted bytes.

## Validation

The first browser run correctly rejected an inherited hard-coded workbench version and outdated registration-route assertion. Both were corrected. The passing repeat covers current V01 workbench initialization/mount, desktop/mobile routes, local journal/AMA fallback, explicit booking-unavailable handling, the ITM Store registration route, and canonical provider health. All consumed utility artifacts passed hosted integrity read-back. Build, fork contract and alpha identity-context contract passed.

This is source-consolidation and frontend/provider-contract acceptance. It does not turn the existing in-process calendar into durable production booking or prove live payment, subscriber recovery, multi-device or clinical capabilities. Those existing product gates remain separately open.

CI verifies the committed provider lock and hosted artifact integrity. Both providers are private, and ITM's repository-scoped GitHub token cannot inspect their main branches. The authenticated operator must run `npm run providers:check -- --remote --hosted` immediately before release; CI does not claim that separate remote-main check. No cross-repository credential is copied into the consumer.

## Release and preservation

Source changes are delivered on existing main branches only. Uncommitted provider work was externally preserved with file hashes and Git history bundles, temporarily stashed for main convergence, and is restored separately from the published consolidation. Extra development checkouts are retired only after the shared main source and deployment are verified. Previous evidence and original Store history remain recoverable.
