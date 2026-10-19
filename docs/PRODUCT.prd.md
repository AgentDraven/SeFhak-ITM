# ITM — Integrate Therapeutic Massage Product PRD

Status: baseline consumer portal and provider handoff draft

## North star

Help a client move from a calm first conversation to a recurring, personalized therapeutic massage relationship.

## Customer journey: Crawl / Walk / Run

The progression is sequential, not three simultaneous lanes: Massage → SHOLDR → VitalHealth.

| Stage | Customer focus | Definition of progress |
| --- | --- | --- |
| Crawl — Massage | Establish the first-session evaluation, therapeutic modalities, privacy boundaries, and recurring client relationship. | Activate a MeritStore catalog and verified appointment availability, then build a recurring base of clients. |
| Walk — SHOLDR | Add a clearly bounded listening and holding-space experience after the massage foundation is stable. | Validate separate offer, price, consent language, schedule, and provider-owned catalog item. |
| Run — VitalHealth | Offer the current whole-person wellness experience with clear scope and safe service boundaries. | Keep the active offering understandable, bookable, and provider-backed as the customer journey reaches Run. |

## User flow

1. A visitor learns what Sefhak offers and how the first session works.
2. A verified subscriber signs in through MeritSubs.
3. The consumer asks MeritStore for provider-owned availability.
4. The subscriber selects an available time.
5. MeritStore places a short-lived hold on that slot.
6. The subscriber selects an active catalog item.
7. MeritStore owns checkout and confirms the appointment only after payment/entitlement success.
8. MeritStore returns the confirmed appointment to the consumer; the consumer displays it without synthesizing status.

The calendar enhancement must hold the slot between steps 4 and 6 so another client cannot purchase the same time. A failed, expired, or unavailable provider response must leave the consumer in a clearly labeled not-booked state.

## Current boundary

The baseline portal is marketing-only and uses the MERIT consumer template. MeritSubs and MeritStore remain external provider rails. The Sefhak tenant, catalog, pricing, and calendar contract are not activated by this repository.
