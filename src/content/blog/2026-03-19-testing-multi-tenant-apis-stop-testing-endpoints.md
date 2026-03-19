---
title: "Testing Multi-Tenant APIs: Stop Testing Endpoints"
date: 2026-03-19
tags: [qa, security, api-testing]
excerpt: "Most API tests check that endpoints return the right data. But in multi-tenant systems, the real question is whether data can ever cross tenant boundaries. Here's how to test guarantees instead of routes."
---

Most API tests look like this:

- Call an endpoint
- Check the response
- Move on

Everything passes. And the system can still be broken.

## The real problem

In multi-tenant systems, one rule matters above everything else:

**Data from one organization must never be accessible to another.**

Simple. But most testing doesn't actually verify it.

Why? Because we test endpoints, not guarantees.

## Where it breaks

In real systems, authorization is duplicated, inconsistent, and context-dependent. Each endpoint enforces its own rules - middleware here, a database filter there, a hardcoded check somewhere else.

Each endpoint might look correct in isolation. The system isn't.

Here's what a typical test looks like:

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

This passes. But it tells you nothing about whether Org A can see Org B's wallets.

That's how tenant boundaries break. And those are the bugs that matter - the ones that erode trust.

## The shift

Stop asking: "Does this endpoint work?"

Start asking: **"Can any request ever cross tenant boundaries?"**

That's a different level of thinking. It requires a different kind of test.

## From tests to invariants

Instead of writing individual endpoint checks, define a system property:

**A request authenticated as Organization A must never return data belonging to Organization B.**

Then test it like this:

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

The difference: this isn't testing one endpoint. It's enforcing a guarantee across the entire API surface. Add a new endpoint and forget the auth middleware? This catches it.

## In blockchain APIs, this is even more critical

In web3, tenant data isn't just preferences or settings - it's wallets, signing keys, and transaction flows.

A tenant isolation failure in a staking API could mean one organization crafting transactions with another organization's funds.

At Kiln, our API serves enterprises managing staking across 20+ blockchain networks. Every endpoint that touches wallets, validators, or rewards is a trust boundary. The blast radius of a tenant isolation bug isn't a data leak - it's a financial one.

This is why we test these invariants not just in CI, but continuously in production - every hour, feeding results directly into incident response. If a deployment introduces a boundary violation, we catch it before any client ever notices.

## Make it real

If you want to move from endpoint testing to boundary testing:

**Treat authorization as global, not local.** Don't verify auth per endpoint in your tests. Define the rule once, test it everywhere. If your test framework knows which endpoints serve tenant data, it can enforce isolation automatically.

**Test flows, not routes.** A `GET` might be locked down but a `POST` that creates a resource might leak the `organization_id` in the response. Test the full lifecycle: create, read, update, delete - each time as the wrong tenant.

**Reuse validation across the API surface.** Write one `assertTenantIsolation` function. Loop it over every endpoint. When someone adds a new route, the invariant test picks it up.

**Run it in CI and in production.** CI catches it before merge. Production monitoring catches it after deploy. Both matter.

## The takeaway

If you test endpoints, you'll find endpoint bugs.

If you test guarantees, you'll find system bugs - the kind that actually matter.

Don't test APIs. Test the boundaries they're supposed to enforce.

---

This is why I don't think in test cases anymore.
I think in system properties.

Because once those are enforced, entire classes of bugs stop existing.
