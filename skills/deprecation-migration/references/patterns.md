# Migration Patterns

## Strangler Fig

Replace old system piece by piece — new code wraps old, gradually taking over.

```
Traffic → Router
           ├── /users (new service) ← migrated
           ├── /orders (new service) ← migrated
           └── /legacy/* (old system) ← shrinking
```

Use when: replacing a monolith with microservices, one endpoint at a time.

## Parallel Run

Run old + new simultaneously, compare outputs, switch when confident.

```typescript
async function getOrderTotal(orderId: string) {
  const [oldResult, newResult] = await Promise.all([
    legacyCalculator.getTotal(orderId),
    newCalculator.getTotal(orderId),
  ]);

  if (oldResult !== newResult) {
    logger.warn('Mismatch', { orderId, old: oldResult, new: newResult });
  }

  return oldResult; // return old (safe) until confidence is high
}
```

Use when: correctness is critical (financial calculations, billing).

## Feature Flag Migration

```typescript
if (featureFlags.useNewCheckout(userId)) {
  return newCheckoutFlow(cart);
}
return legacyCheckoutFlow(cart);
```

Rollout: 5% → 25% → 50% → 100% → remove flag + old code.

Use when: gradual user migration with easy rollback.

## Branch by Abstraction

1. Create abstraction layer over old code
2. Clients use abstraction (not old code directly)
3. Implement new version behind same abstraction
4. Switch abstraction to new implementation
5. Remove old implementation

Use when: deep dependency that many modules use.
