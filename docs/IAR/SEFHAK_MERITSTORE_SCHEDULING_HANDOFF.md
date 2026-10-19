# Sefhak → MeritStore scheduling enhancement handoff

Status: provider contract implemented in isolated MeritStore checkout; not yet deployed or verified on the V01 host

## Required provider capabilities

- Provider-owned availability by tenant, service, timezone, date range, and duration.
- Conflict-safe slot hold with an expiry time.
- Catalog lookup restricted to active, purchasable Sefhak items.
- Appointment confirmation coupled to the provider checkout/entitlement result.
- Cancellation and reschedule rules returned by the provider, not hard-coded in the consumer.
- Audit identifiers for availability read, hold, checkout, and appointment confirmation.

## ITM initial pricing proposal

- ITM first-session intake: $45 one time.
- ITM Member: $149/month, including one 90-minute massage session per month.
- SHOLDR: $50/hour.
- VitalHealth: consultation-priced; the provider must return the consultation quote before checkout.

## Implemented contract shape

```text
GET  /api/v1/tenants/{tenant}/availability?from=&to=&duration=
POST /api/v1/tenants/{tenant}/appointments/holds
GET  /api/v1/tenants/{tenant}/offerings?catalog=1
POST /api/v1/tenants/{tenant}/appointments/confirm
POST /api/v1/tenants/{tenant}/appointments/{id}/cancel
```

The isolated provider implementation uses a ten-minute hold and requires a subscriber authorization header. The consumer must fail closed when these routes are absent or when provider confirmation is not explicit.

## Product inputs awaiting approval

- First-session intake/evaluation fee and massage rates.
- Member cadence and rollover rules.
- Home-visit boundary and surcharge.
- Service descriptions and safety/boundary language.
- How Massage, SHOLDR, and the current VitalHealth offering are represented in the approved catalog.

No paid offering is seeded in `cfg/meritstore_tenant.json` until these inputs are approved and the provider activation is verified.
