# Web3 Staking Demo + QA Showcase

**Date:** 2026-03-25
**Status:** Final

## Goal

Demonstrate one thing clearly: I can test real web3 user flows - wallet interaction, transaction approval, rejection, and wrong-network handling.

Two deliverables:
1. A standalone staking demo dApp (separate repo: `https://github.com/blassaut/web3-staking-demo`)
2. A new section on `/qa` in the portfolio showcasing it

## Architecture

### Hybrid approach

- **Separate repo** (`web3-staking-demo`) for the dApp + tests
- **Integrated experience** on the portfolio's `/qa` page
- External links (repo, live demo) are secondary to the in-page showcase

### Two modes

- **Demo mode** (live visitors): Real MetaMask connection. Real network detection. Wallet prompts use `personal_sign` (message signing) instead of contract transactions - so MetaMask opens, the user can approve or reject, and the app responds accordingly. The transaction lifecycle (pending/confirmed states and balance changes) is controlled via TypeScript with deterministic delays. No faucet, no chain dependency, but wallet interaction is genuine.
- **Test mode** (CI/local): Dappwright + Playwright tests run against a real Staking contract on a local Hardhat node. Transactions are real contract calls.

The separation is environment-driven (an env var like `VITE_MODE=demo|test`), not a UI toggle. The app feels identical in both modes.

### Why this split

- Visitors get instant, reliable interaction without faucet friction or RPC instability.
- Technical reviewers can verify the test suite runs against a real chain environment.
- Wallet connection, network detection, approval, and rejection are real in both modes. Only the transaction backend differs.

---

## Part 1: The dApp

### Tech stack

- Vite + React + TypeScript
- ethers.js (wallet interaction)
- Tailwind CSS (styling)
- Hardhat (local node + contract deployment for tests)
- Vitest + React Testing Library (unit tests, TDD)
- Playwright + Dappwright (e2e wallet automation)

### Smart contract (~30 lines Solidity)

- `stake()` payable - accepts ETH, tracks balance per address
- `unstake()` - withdraws full staked ETH back to sender
- `balanceOf(address)` view - returns staked amount

Deployed to local Hardhat node for test mode only.

### State model

Six states, in order:

1. **Disconnected** - no wallet connected. Only Connect Wallet button is active. All other UI elements are visible but visually disabled/inert (so visitors can see what the app does before connecting).
2. **Connected, unsupported network** - wallet connected, wrong chain. Stake/unstake disabled. Banner: "Unsupported network detected: {network name}" / "Switch to Ethereum Hoodi to continue". Network chip shows amber. Network name is read from MetaMask (works in both demo and test modes since wallet connection is real).
3. **Connected, supported network, idle** - ready to act. Shows staked balance (0 initially). Amount input and action buttons enabled based on preconditions.
4. **Transaction pending** - wallet action approved, awaiting confirmation. Buttons disabled. Status panel shows "Processing stake..." or "Processing unstake...".
5. **Transaction confirmed** - success. Balance updated. Status panel shows result (e.g., "Stake confirmed for 0.1 ETH") for 5 seconds, then app returns to state 3 (idle). Amount input resets to empty.
6. **Transaction rejected** - user rejected in wallet. Status panel shows "Transaction rejected". Buttons re-enable. Amount preserved. App returns to state 3 (idle) after 5 seconds.

### Edge states (not separate journeys, handled inline)

- **No wallet installed** - Connect button click shows message: "MetaMask not detected. Install MetaMask to continue." No further UI is enabled.
- **Connection cancelled** - User closes MetaMask connection prompt. App stays in state 1 (disconnected). No error shown, user can try again.

### UI elements

- **Connect Wallet button** - only interactive element in state 1
- **Connected address display** - truncated address (0x1234...5678)
- **Network chip** - shows current network name, color-coded (green for Hoodi, amber for anything else)
- **Staked balance display** - read-only, updates after stake/unstake. Shows "0 ETH" when nothing staked.
- **Amount input** - number field, only enabled in state 3
- **Stake button** - disabled when: disconnected, unsupported network, empty/zero amount
- **Unstake button** - visible whenever connected (visible but disabled). Enabled only when: supported network AND staked balance > 0. Disabled otherwise.
- **Persistent status panel** - two lines:
  - Current system state (e.g., "Connected on Ethereum Hoodi")
  - Last meaningful action result (e.g., "Stake confirmed for 0.1 ETH")
  - Persists until next action or 5-second timeout. Not toasts.

### data-testid attributes

Every interactive and assertable element gets a `data-testid`, following the same `{section}-{element}-{qualifier}` convention used in the portfolio site. Dappwright tests target these exclusively - never CSS selectors or DOM structure.

| Element | data-testid |
|---------|-------------|
| Connect Wallet button | `wallet-connect-button` |
| Connected address | `wallet-address` |
| Network chip | `network-chip` |
| Network banner (unsupported) | `network-banner-unsupported` |
| Staked balance | `staking-balance` |
| Amount input | `staking-input-amount` |
| Stake button | `staking-button-stake` |
| Unstake button | `staking-button-unstake` |
| Status panel | `status-panel` |
| Status - current state | `status-current` |
| Status - last action | `status-last-action` |
| No wallet message | `wallet-not-detected` |

### Precondition handling

Built into the UI, not a separate journey:

- No wallet installed: message shown, nothing else enabled
- No wallet connected: only Connect button active
- Empty/zero amount: Stake button disabled
- Zero staked balance: Unstake button disabled
- Wrong network: both action buttons disabled, banner shown

### Behavioral details

- After successful stake: reset amount input, update balance
- After successful unstake: update balance to 0, unstake button becomes disabled
- After rejection: preserve entered amount, re-enable buttons
- After wrong network: preserve entered amount
- After confirmation: status panel holds result for 5 seconds, then returns to idle
- After rejection: status panel holds rejection message for 5 seconds, then returns to idle
- Rejection recovery: status shows rejection, buttons re-enable, amount preserved, back to idle

### Demo mode mechanics

The `controlled-provider.ts` module implements a `StakingProvider` interface identical to `contract-provider.ts`:

1. **Wallet connection**: real MetaMask via ethers.js `BrowserProvider`. No simulation.
2. **Network detection**: real, read from MetaMask's connected chain. No simulation.
3. **Stake action**: calls `personal_sign` via ethers.js (a real MetaMask prompt for message signing). If user approves, demo provider waits 1.5 seconds (simulated pending), then updates local balance state. If user rejects, the rejection is real (MetaMask returns an error).
4. **Unstake action**: same pattern - `personal_sign` prompt, simulated pending, local balance update.
5. **Balance**: maintained in React state. Starts at 0, increases on stake, decreases on unstake. Not persisted across page reloads.

This means: wallet connection is real, approval/rejection is real, network detection is real. Only the on-chain state change is simulated.

### Supported network

Ethereum Hoodi testnet (chain ID 560048). All other networks are treated as unsupported.

### 5 user journeys

#### 1. Visitor connects wallet (3 scenarios)
- Wallet is available, user connects, address is displayed
- Wallet is available, user cancels connection, app stays disconnected
- Wallet is not installed, user sees guidance message

#### 2. Visitor stakes successfully (3 scenarios)
- Connected on Hoodi, enters amount, approves transaction, balance updates
- Connected on Hoodi, stakes twice, balance accumulates
- After successful stake, amount input resets

#### 3. Visitor rejects transaction (2 scenarios)
- User rejects stake, app shows rejection, buttons re-enable, amount preserved
- User rejects unstake, app shows rejection, balance unchanged

#### 4. Visitor is on wrong network (3 scenarios)
- Connected on unsupported network, banner shows network name and switch guidance
- Stake button is disabled on unsupported network
- Unstake button remains disabled on unsupported network

#### 5. Visitor unstakes successfully (2 scenarios)
- Connected on Hoodi with staked balance, unstakes, balance returns to 0
- After unstake, unstake button returns to disabled state

**Total: 13 scenarios across 5 journeys.**

### Failure modes

Two distinct failure modes tested:
1. **Transaction rejection** - user rejects in wallet
2. **Wrong network** - unsupported chain detected

Stats row will show "2 failure modes" (not 3).

### Development approach: TDD

All implementation follows test-driven development. Write the test first, watch it fail, implement the minimum code to pass, then refine.

#### Unit tests (Vitest + React Testing Library)

Written before implementation. Cover logic and component behavior in isolation:

- **Hooks** (`useWallet`, `useStaking`, `useNetwork`): state transitions, error handling, return values
- **Providers** (`controlled-provider`, `contract-provider`): correct method calls, state updates, error propagation
- **Components**: render states (disconnected, connected, pending, etc.), disabled/enabled conditions, displayed values, user interactions
- **State model**: transition logic between the 6 states, edge cases (no wallet, connection cancelled)

Provider dependencies (ethers.js, MetaMask) are mocked in unit tests. Each hook and component is tested against all relevant states before the code is written.

#### E2E tests (Playwright + Dappwright)

- Hardhat local node starts before test suite (via `globalSetup`)
- Contract deployed in test setup fixture
- Gherkin feature files with BDD step definitions (playwright-bdd)
- Tests assert on: UI state, status panel content, balance display, button enabled/disabled states, banner visibility
- 13 scenarios across 5 journeys validate the full user experience with a real wallet

### Done criteria

- MetaMask connects reliably
- Supported/wrong-network state is visually obvious
- Stake success visible, balance updates
- Stake rejection visible, app recovers (buttons re-enable, amount preserved)
- Unstake success visible, balance updates
- Staked balance reflects round-trip correctly (0 -> staked -> 0)
- Unit test suite passes (all hooks, providers, and components covered)
- Dappwright suite passes deterministically against Hardhat

---

## Part 2: `/qa` page integration

### Page structure change

The current `QA.tsx` renders a flat sequence: hero, stats, cards, feature files, CTA, repo link. The change adds a second section below the existing content, visually separated by a section heading.

New layout:

```
Hero: "Who tests the tester?" (existing, unchanged)

Section 1: "This portfolio" (existing content, unchanged)
  - Stats row
  - "How it's built" cards
  - Feature files accordion
  - Repo link

Transition block:
  "In web3, bugs don't just break UX - they lose money."
  "Testing isn't about clicks. It's about transactions you can't undo."
  "That means validating rejection, network mismatch, and confirmation - not just UI."
  "Most QA systems stop at the UI. This one tests what actually happens inside the wallet."

Section 2: "A web3 staking demo" (new)
  - Intro copy
  - Stats row
  - "How it's built" cards
  - Feature files accordion
  - Visual preview placeholder
  - Demo + repo links
  - Transparency line

Page-level CTA: "If your system needs this level of confidence, let's talk." (existing, moves to bottom of page after both sections)
```

The existing CTA moves to the very end, after both sections. It serves as the page-level conversion point.

### Section 2 heading

"A web3 staking demo" - rendered with the same `SectionHeading` component used in Section 1.

### Stats row (4 items, same grid as Section 1)

Hardcoded values (since feature files live in a separate repo and cannot be dynamically imported at build time):

- 5 user journeys
- 13 scenarios
- 2 failure modes
- 1 wallet

### "How it's built" cards (4 cards, same layout as Section 1)

1. **Automated wallet interactions** - Connect MetaMask, approve or reject wallet actions, and switch networks inside end-to-end tests.
2. **Transaction lifecycle testing** - Validate pending, confirmed, and rejected states instead of only happy-path UI.
3. **Wrong-network resilience** - Tests verify that unsupported networks are detected and recovery guidance is shown before any action is taken.
4. **Browser-level web3 testing** - Wallet-driven flows are tested in the browser where failures actually happen - network selection, confirmation, rejection, and post-transaction state.

Each card links to relevant source in the `web3-staking-demo` repo (`https://github.com/blassaut/web3-staking-demo`). Small "Dappwright + Playwright" caption in card footer.

### Feature files (second accordion group)

Feature file content is **hardcoded as raw strings** in a new data file (`src/data/web3-features.ts`) in the portfolio repo. This mirrors how the existing feature files are imported but avoids cross-repo build dependencies. Content is copied from the actual `.feature` files in the `web3-staking-demo` repo and updated manually when scenarios change.

5 feature summaries displayed:

- **Visitor connects wallet** - wallet is available, user connects successfully, connected address is displayed
- **Visitor stakes successfully** - correct network is selected, transaction is approved, success state is shown, balance updates
- **Visitor rejects transaction** - wallet confirmation opens, user rejects transaction, app shows rejection state without breaking
- **Visitor is on wrong network** - unsupported network detected, staking action is blocked, switch-network guidance is shown
- **Visitor unstakes successfully** - balance exists, unstake confirmed, balance updates to zero

### Visual preview area (placeholder)

Bordered container with muted text: "Preview coming from the live demo." Styled to feel intentional, not broken. CTA row directly beneath. Will be replaced with screenshots/animation once the dApp UI is final.

### CTAs

- "Try the live demo" - opens deployed dApp in new tab (`https://web3-staking-demo.vercel.app` or similar)
- "See the full implementation" - links to `https://github.com/blassaut/web3-staking-demo`

### Transparency line (muted, below CTAs)

> The live demo uses real wallet interaction with a controlled transaction flow. The automated suite runs against a chain-backed environment to validate confirmation, rejection, and network handling.

---

## Repo structure (`web3-staking-demo`)

```
web3-staking-demo/
+-- src/
|   +-- App.tsx
|   +-- components/
|   |   +-- ConnectWallet.tsx
|   |   +-- NetworkChip.tsx
|   |   +-- StakeForm.tsx
|   |   +-- StatusPanel.tsx
|   |   +-- StakedBalance.tsx
|   |   +-- NetworkBanner.tsx
|   +-- hooks/
|   |   +-- useWallet.ts
|   |   +-- useStaking.ts
|   |   +-- useNetwork.ts
|   +-- lib/
|   |   +-- types.ts              # StakingProvider interface
|   |   +-- controlled-provider.ts      # personal_sign + local state for demo mode
|   |   +-- contract-provider.ts   # real contract calls for test mode
|   +-- types.ts
+-- src/__tests__/
|   +-- hooks/
|   |   +-- useWallet.test.ts
|   |   +-- useStaking.test.ts
|   |   +-- useNetwork.test.ts
|   +-- lib/
|   |   +-- controlled-provider.test.ts
|   |   +-- contract-provider.test.ts
|   +-- components/
|   |   +-- ConnectWallet.test.tsx
|   |   +-- NetworkChip.test.tsx
|   |   +-- StakeForm.test.tsx
|   |   +-- StatusPanel.test.tsx
|   |   +-- StakedBalance.test.tsx
|   |   +-- NetworkBanner.test.tsx
+-- contracts/
|   +-- Staking.sol
+-- e2e/
|   +-- features/
|   |   +-- connect-wallet.feature
|   |   +-- stake-successfully.feature
|   |   +-- reject-transaction.feature
|   |   +-- wrong-network.feature
|   |   +-- unstake-successfully.feature
|   +-- steps/
|   |   +-- wallet.steps.ts
|   |   +-- staking.steps.ts
|   |   +-- network.steps.ts
+-- hardhat.config.ts
+-- playwright.config.ts
+-- package.json
+-- vite.config.ts
+-- tailwind.config.ts
```

---

## Scope guardrails

### Keep

- One wallet (MetaMask)
- One page
- One main action pair (stake/unstake)
- One supported network (Ethereum Hoodi)
- Two failure modes (rejection, wrong network)

### Cut

- Multiple wallets
- Real protocol depth
- Multiple chains
- Custom contract complexity
- Detailed backend
- Tokenomics, dashboards, charts
- Multiple pages
- Production branding

---

## Deployment

- dApp: Vercel (separate project from portfolio)
- Portfolio: existing Vercel setup, no changes needed
- `/qa` page links out to deployed dApp

---

## Timeline estimate

### Weekend 1
- Init repo, set up Vite + React + Tailwind + ethers.js + Vitest
- TDD: write unit tests for hooks and providers, then implement
- TDD: write unit tests for components, then build core UI components
- Implement controlled-provider.ts (personal_sign + local state)
- Wire up state model and all 6 states
- Handle all preconditions and edge states

### Weekend 2
- Hardhat contract + local node setup
- TDD: write unit tests for contract-provider, then implement
- Dappwright + Playwright test suite (13 scenarios)
- Portfolio `/qa` page Section 2 integration
- Feature file content in `src/data/web3-features.ts`
- Copy, stats, cards, CTAs
