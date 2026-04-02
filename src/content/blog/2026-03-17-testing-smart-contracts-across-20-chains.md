---
title: "Testing Smart Contracts Across 20+ Chains"
date: 2026-03-17
tags: [web3, qa, smart-contracts, testing]
excerpt: "Kiln supports 20+ blockchains. Each one has its own transaction model, finality rules, and failure modes. This is how we built a cross-chain QA framework."
---

Kiln supports staking on 20+ blockchains - EVM networks, Solana, Cosmos, Polkadot, TON, Cardano. Each one has its own transaction model, finality rules, and failure modes.

There was no documented cross-chain QA framework to handle this. We built one.

## The word "transaction" doesn't mean the same thing everywhere

On **EVM chains** (Ethereum, Polygon, Arbitrum...), the model is straightforward. Craft, sign, broadcast, confirm. Gas is predictable, tooling is mature, Ethers.js and Hardhat do the job.

**Solana** is a different world. Transactions are built from instructions, accounts need to be pre-allocated, the execution model is fundamentally different. An Ethereum test doesn't "port" to Solana - it needs to be rethought.

**Cosmos**: each chain (Celestia, Osmosis, dYdX...) speaks IBC but has its own modules, governance rules, and staking mechanics. What works on one doesn't necessarily work on another.

**Polkadot** has its relay chain / parachain architecture. **TON** runs on asynchronous message-passing. **Cardano** uses an extended UTXO model closer to Bitcoin than Ethereum.

There is no universal abstraction for "test a blockchain transaction." Each ecosystem demands its own understanding.

## BDD as the common language

What stays consistent across all these chains is the business logic. We're always testing the same kinds of flows: a user stakes tokens and expects rewards, a user unstakes and receives funds after an unbonding period, a DeFi vault deposits into a protocol and the share price reflects the yield.

This is where BDD becomes essential. We write Cucumber feature files that describe these flows in plain English:

```gherkin
Feature: Native staking on Ethereum

  Scenario: Stake ETH and verify rewards accrue
    Given a funded wallet on "ethereum"
    When I craft a stake transaction for "32" ETH
    And I sign the transaction via Fireblocks
    And I broadcast the signed transaction
    Then the transaction should be confirmed within 5 minutes
    And the staking position should appear in the dashboard
```

The feature file reads the same whether we're testing Ethereum, Solana, or Cosmos. The step definitions underneath handle the chain-specific logic. That separation is what makes the framework scale.

## Chain-specific step definitions

Behind each step, there's a layer that knows how to talk to a specific chain. The architecture:

```
Feature files (chain-agnostic)
  └── Step definitions (routing layer)
       └── Chain adapters (chain-specific logic)
            ├── EVM adapter
            ├── Solana adapter
            ├── Cosmos adapter
            └── ...
```

Each adapter knows how to craft a transaction in its chain's format, sign it (through Fireblocks for key management), broadcast it to the right network, and verify the result via the chain's RPC or indexer.

Adding a new chain means writing an adapter. Not rewriting tests.

## The signing pipeline is the real problem

The biggest challenge wasn't the blockchain logic - it was signing.

In production, Kiln uses [Fireblocks](https://www.fireblocks.com/) for key management. In testing, we need to replicate that flow: craft the payload, send it to the Fireblocks API, wait for the signing callback, assemble the signed transaction, broadcast.

Each step can fail, and the failure modes differ per chain. Nonce mismatch on EVM. Wrong account sequence on Cosmos. Expired blockhash on Solana.

We built retry logic and chain-aware error handling into the pipeline. The framework needs to distinguish "this failed because of a bug" from "this failed because of network timing" - and handle each case differently.

## What actually breaks

After two years running this framework, the patterns are clear.

**Cross-chain integration points** break the most. The staking API returns a transaction payload - does it match what the blockchain actually expects? Schema mismatches between our API and the chain's current format are a recurring source of bugs, especially after upgrades.

**Gas estimation** on EVM chains is a constant pain point. Costs change with network conditions, what worked in staging can fail in production during a gas spike. We test with realistic gas scenarios, not hardcoded values.

**Unbonding and withdrawal flows** hide the most business-critical bugs. Staking is simple - the user sends tokens. Unstaking involves waiting periods, partial withdrawals, validator changes, and edge cases that multiply across chains.

**Chain upgrades** are the wildcard. Hard fork or protocol upgrade, existing tests can break in subtle ways. We monitor upcoming upgrades and run targeted test suites against testnets before mainnet goes live.

## What I take away from this

Start with the happy path on a single chain, then expand. Trying to cover all chains at once doesn't work.

BDD in a cross-chain context is an architectural tool. The feature files / step definitions separation maps directly to the business logic / chain-specific implementation separation.

Observability on test runs is critical. When a test fails on chain 17 out of 20, you need to quickly identify whether it's a test issue, a chain issue, or a product bug. We log chain responses, transaction hashes, and timing data alongside test results.

Testnets are unstable. That's a fact. The CI pipeline needs to handle testnet flakiness without flooding the team with false alerts. We separate testnet instability from real failures using chain health checks before test runs.

Adapters should stay thin. Craft, sign, broadcast, verify - that's it. Business logic validation belongs in the step definitions, not in the adapter.

## What's next

We're exploring contract-level testing - verifying smart contract state transitions directly, not just transaction flows. Foundry (EVM) and Anchor (Solana) let you write tests that assert on storage slots and program accounts. That catches bugs that end-to-end flows miss.

Web3 QA is still a young field. There's no established playbook for testing at this scale, across this many chains. If you're working on similar problems, reach out via the [contact form](/#contact) or on [LinkedIn](https://linkedin.com/in/benjaminlassaut).
