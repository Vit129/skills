# Complexity Level Examples

Comparing output depth across Lightweight / Standard / Full complexity levels.
Using Domain Decomposition as the reference example — same principle applies to all phases.

## Lightweight — concise, 1-2 lines per section

```markdown
## Bounded Contexts
- **Booking** — search, book, pay

## Context Map
Booking → External API (conformist)

## Architecture
Monolith — React + REST API
```

## Standard — adds Entities + key rules + relationship patterns

```markdown
## Bounded Contexts
- **Booking** — search, book, pay
  - Entities: Flight, Reservation
  - Key rule: seat lock expires in 15 min
- **User** — authentication, profile
  - Entities: User, Preference

## Context Map
- Booking → User (downstream, ACL)
- Booking → External API (conformist)

## Architecture
Monolith — React + Express + PostgreSQL (separate schema per context)
```

## Full — down to Value Objects, Aggregates, Domain Events + Sequence Diagram + Regression Checklist

```markdown
## Bounded Contexts
- **Booking**
  - Entities: Flight, Seat, Reservation, PaymentTransaction
  - Value Objects: Money, SeatClass
  - Aggregates: Reservation (root) → Seat + Payment
  - Domain Events: ReservationCreated, PaymentCompleted
  - Key rules: round-trip 2 segments, lock 15 min, max 3 payment retries
- **User** — (same depth as Booking)
- **Notification** — (same depth as Booking)

## Context Map
- Booking → User (ACL — UserProfileAdapter)
- Booking → Notification (published language — ReservationEvent)

## Sequence Diagram — Happy Path
User → SPA → Booking API → DB → RabbitMQ → Notification → Email

## Regression Checklist
- [ ] Booking still works after User schema change
- [ ] Notification receives event after domain event rename
```

## Rule of thumb

- Lightweight = what
- Standard = what + why
- Full = what + why + how + impact

## Applies to all domains

The flight booking example above uses the same principle for any domain:
- E-commerce: Product → Order → Payment → Shipping
- Hospital: Patient → Appointment → Treatment → Billing
- HR: Employee → Leave → Payroll → Evaluation
