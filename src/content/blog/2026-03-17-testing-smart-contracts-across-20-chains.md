---
title: "Testing Smart Contracts Across 20+ Chains - What I Learned"
date: 2026-03-17
tags: [web3, qa, smart-contracts, testing]
excerpt: "What happens when your test suite needs to cover EVM, Solana, Cosmos, Polkadot, TON, and Cardano? Here's what I learned building cross-chain QA at Kiln."
---

When I joined Kiln as a Senior QA Engineer in late 2023, the company supported staking on a handful of blockchain networks. Today we cover 20+ chains - EVM networks, Solana, Cosmos-based chains, Polkadot, TON, Cardano, and more. Each one has its own transaction model, finality rules, and failure modes.

Testing all of this required building something I hadn't seen documented anywhere: a cross-chain QA framework that could handle the fundamental differences between these ecosystems while keeping tests readable and maintainable.

Here's what I learned along the way.

## Not all chains are created equal

The first thing you realize when testing across multiple blockchains is that the word "transaction" means very different things depending on where you are.

On **EVM chains** (Ethereum, Polygon, Arbitrum...), the model is familiar. You craft a transaction, sign it, broadcast it, wait for confirmation. Gas estimation is predictable. Tooling is mature. Ethers.js and Hardhat give you a solid foundation.

**Solana** throws that out the window. Transactions are built from instructions, accounts need to be pre-allocated, and you're dealing with a completely different execution model. A test that works on Ethereum can't just be "ported" to Solana - it needs to be rethought from the ground up.

**Cosmos chains** add another layer. Each chain in the Cosmos ecosystem (Celestia, Osmosis, dYdX...) speaks IBC but has its own modules, governance rules, and staking mechanics. You can't assume that what works on one Cosmos chain works on another.

**Polkadot** has its relay chain / parachain architecture. **TON** has its asynchronous message-passing model. **Cardano** uses an extended UTXO model that's closer to Bitcoin than Ethereum.

The point is: there's no universal abstraction for "test a blockchain transaction." Every ecosystem demands its own understanding.

## The framework: BDD as the common language

The one thing that does stay consistent across all these chains? The business logic. Regardless of the underlying technology, we're always testing the same kinds of flows:

- A user stakes tokens and expects rewards
- A user unstakes and expects to receive funds after an unbonding period
- A DeFi vault deposits into a protocol and the share price reflects the yield

This is where BDD (Behavior-Driven Development) became essential. We write Cucumber feature files that describe these flows in plain English:

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

The feature file reads the same whether we're testing Ethereum, Solana, or Cosmos. The step definitions underneath handle the chain-specific logic. This separation is what makes the framework scale.

## Chain-specific step definitions

Behind each step, there's a layer that knows how to talk to a specific chain. The architecture looks roughly like this:

```
Feature files (chain-agnostic)
  └── Step definitions (routing layer)
       └── Chain adapters (chain-specific logic)
            ├── EVM adapter
            ├── Solana adapter
            ├── Cosmos adapter
            └── ...
```

Each adapter knows how to:
- **Craft** a transaction for that chain's format
- **Sign** it (we route through Fireblocks for key management)
- **Broadcast** it to the right network
- **Verify** the result using that chain's specific RPC or indexer

This pattern means adding a new chain is mostly about writing a new adapter, not rewriting tests.

## Signing is harder than you think

One of the biggest challenges wasn't the blockchain logic itself - it was the signing pipeline.

In production, Kiln uses [Fireblocks](https://www.fireblocks.com/) for institutional-grade key management. In testing, we need to replicate that flow. That means:

1. Crafting the raw transaction payload
2. Sending it to Fireblocks via their API
3. Waiting for the signing callback
4. Assembling the signed transaction
5. Broadcasting it

Each step can fail, and the failure modes are different per chain. An EVM transaction might fail because of a nonce mismatch. A Cosmos transaction might fail because the account sequence is wrong. A Solana transaction might fail because the blockhash expired.

We built retry logic and chain-aware error handling into the signing pipeline. The test framework needs to distinguish between "this failed because of a bug" and "this failed because of network timing" - and handle each case differently.

## What actually breaks

After running this framework for over two years, I've noticed patterns in what fails:

**Cross-chain integration points** break the most. When a staking API returns a transaction payload, does it match what the blockchain actually expects? Schema mismatches between our API and the chain's current format are a recurring source of bugs, especially after chain upgrades.

**Gas estimation** is a constant pain point on EVM chains. Gas costs change with network conditions, and what worked in staging might fail in production during a gas spike. We test with realistic gas scenarios, not just hardcoded values.

**Unbonding and withdrawal flows** are where the most business-critical bugs hide. Staking is relatively straightforward - the user sends tokens. Unstaking involves waiting periods, partial withdrawals, validator changes, and edge cases that multiply across chains.

**Chain upgrades** are the wildcard. When a chain does a hard fork or protocol upgrade, existing tests can break in subtle ways. We monitor upcoming upgrades and run targeted test suites against testnets before mainnet goes live.

## Lessons learned

**Start with the happy path, then go deep on one chain.** Don't try to build full coverage across all chains at once. Get end-to-end staking working on one chain, then expand horizontally.

**BDD is not just for stakeholder communication.** In a cross-chain context, BDD becomes an architectural tool. The separation between feature files and step definitions maps perfectly to the separation between business logic and chain-specific implementation.

**Invest in observability for your test runs.** When a test fails on chain 17 out of 20, you need to quickly identify whether it's a test issue, a chain issue, or a product bug. We log chain responses, transaction hashes, and timing data alongside test results.

**Testnets are unreliable, plan for it.** Almost every blockchain has a testnet, and almost every testnet has periods of instability. Your CI pipeline needs to handle testnet flakiness without flooding the team with false alerts. We separate testnet instability from real failures using chain health checks before test runs.

**Keep adapters thin.** The chain adapter should do as little as possible - craft, sign, broadcast, verify. Business logic validation belongs in the step definitions, not in the adapter. This keeps adapters easy to write and easy to debug.

## What's next

We're currently exploring contract-level testing - going beyond transaction flows to verify smart contract state transitions directly. Tools like Foundry (for EVM) and Anchor (for Solana) let you write tests that assert on storage slots and program accounts, which catches bugs that end-to-end flows might miss.

The web3 QA space is still young. There's no established playbook for testing across this many chains at this scale. If you're working on something similar, I'd love to hear how you're approaching it - reach out via the [contact form](/#contact) or find me on [LinkedIn](https://linkedin.com/in/benjaminlassaut).
