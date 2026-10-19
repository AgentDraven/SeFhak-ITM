# Sefhak Integrative Therapeutic Massage — Product PRD

Status: baseline consumer portal and provider handoff draft

## North star

Help a client move from a calm first conversation to a recurring, personalized integrative therapeutic massage relationship.

## Crawl / Walk / Run

| Lane | Crawl | Walk | Run |
| --- | --- | --- | --- |
| Massage | Explain the first-session evaluation, modalities, boundaries, and follow-up | Activate a MeritStore catalog and verified appointment availability | Build a recurring base of 25 monthly clients and later train certified therapists |
| SHOLDR | Describe a bounded listening experience without implying therapy or medical care | Validate a separate offer, price, consent language, and schedule | Establish a repeatable listening practice with its own provider-owned catalog item |
| VitalHealth | Keep the lane visible as a future direction only | Define scope, qualifications, and safe service boundaries | Launch only after approval, provider activation, and evidence-backed fulfillment |

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
