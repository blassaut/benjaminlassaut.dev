---
title: "Testing Multi-Tenant APIs: Test Guarantees, Not Endpoints"
date: 2026-03-19
tags: [qa, security, api-testing]
excerpt: "Most API tests check that an endpoint returns the right data. In multi-tenant systems, the real question is whether data can ever cross tenant boundaries."
---

Most API tests do this: call an endpoint, check the response, move on. Everything's green. The system can still be broken.

## The problem

In multi-tenant systems, one rule matters above everything else: data from one organization must never be accessible to another.

Most tests don't actually verify this. They test endpoints, not guarantees.

## Where it breaks

In real systems, authorization is duplicated, inconsistent, and context-dependent. Each endpoint enforces its own rules - middleware here, a database filter there, a hardcoded check somewhere else.

Each endpoint might look correct in isolation. The system doesn't.

A typical test:

```typescript
// Traditional endpoint test
test('GET /api/wallets returns wallets', async () => {
  const response = await api.get('/api/wallets', {
    headers: { Authorization: `Bearer ${orgA_token}` }
  });
  expect(response.status).toBe(200);
  expect(response.data.length).toBeGreaterThan(0);
});
```

This passes. But it says nothing about whether Org A can see Org B's wallets. That's how tenant boundaries break - and those are the bugs that matter.

## From endpoints to invariants

The question isn't "does this endpoint work?" but "can any request ever cross tenant boundaries?"

Define a system property: a request authenticated as Organization A must never return data belonging to Organization B.

Then test it:

```typescript
// Boundary invariant test
async function assertTenantIsolation(endpoint: string) {
  // Create resources as Org A
  const resource = await createResource(orgA_token);

  // Attempt to access as Org B
  const response = await api.get(`${endpoint}/${resource.id}`, {
    headers: { Authorization: `Bearer ${orgB_token}` }
  });

  // Must be 403 or 404 - never 200 with data
  expect([403, 404]).toContain(response.status);
}

// Run across every endpoint that returns tenant data
for (const endpoint of tenantEndpoints) {
  test(`tenant isolation: ${endpoint}`, () =>
    assertTenantIsolation(endpoint)
  );
}
```

This isn't testing one endpoint. It's enforcing a guarantee across the entire API surface. A new endpoint added without auth middleware? This catches it.

## In blockchain APIs, the stakes are higher

In web3, tenant data isn't preferences or settings - it's wallets, signing keys, and transaction flows.

A tenant isolation failure in a staking API could mean one organization crafting transactions with another organization's funds.

At Kiln, our API serves enterprises managing staking across 20+ blockchains. Every endpoint that touches wallets, validators, or rewards is a trust boundary. The blast radius of a tenant isolation bug isn't a data leak - it's a financial one.

This is why we test these invariants in CI but also continuously in production, every hour, with results feeding directly into incident response.

## In practice

Treat authorization as global. Don't verify auth endpoint by endpoint. Define the rule once, test it everywhere. If your framework knows which endpoints serve tenant data, it can enforce isolation automatically.

Test flows, not routes. A `GET` might be locked down but a `POST` that creates a resource might leak the `organization_id` in the response. Test the full lifecycle - create, read, update, delete - each time as the wrong tenant.

Reuse validation across the API surface. One `assertTenantIsolation` function, looped over every endpoint. When someone adds a route, the invariant test covers it.

Run it in CI and in production. CI catches it before merge. Production monitoring catches it after deploy.
