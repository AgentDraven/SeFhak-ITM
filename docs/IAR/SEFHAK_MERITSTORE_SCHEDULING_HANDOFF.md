# Sefhak → MeritStore scheduling enhancement handoff

Status: proposed provider requirement; not an implemented or verified production API

## Required provider capabilities

- Provider-owned availability by tenant, service, timezone, date range, and duration.
- Conflict-safe slot hold with an expiry time.
- Catalog lookup restricted to active, purchasable Sefhak items.
- Appointment confirmation coupled to the provider checkout/entitlement result.
- Cancellation and reschedule rules returned by the provider, not hard-coded in the consumer.
- Audit identifiers for availability read, hold, checkout, and appointment confirmation.

## Proposed contract shape

```text
GET  /api/v1/tenants/{tenant}/availability?from=&to=&duration=&timezone=
POST /api/v1/tenants/{tenant}/appointments/holds
GET  /api/v1/tenants/{tenant}/catalog?appointment_hold_id=
POST /api/v1/tenants/{tenant}/appointments/confirm
POST /api/v1/tenants/{tenant}/appointments/{id}/cancel
```

The exact paths, authentication, hold duration, timezone rules, and response schema must be supplied by MeritStore before consumer implementation. The consumer must fail closed when these routes are absent or when provider confirmation is not explicit.

## Product inputs awaiting approval

- First-session intake/evaluation fee and massage rates.
- Member cadence and rollover rules.
- Home-visit boundary and surcharge.
- Service descriptions and safety/boundary language.
- How Massage, SHOLDR, and the current VitalHealth offering are represented in the approved catalog.

No paid offering is seeded in `cfg/meritstore_tenant.json` until these inputs are approved and the provider activation is verified.
