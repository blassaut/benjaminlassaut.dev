const WEB3_REPO = 'https://github.com/blassaut/web3-staking-demo'

export const web3Features: string[] = [
  `Feature: Visitor connects wallet
  As a visitor
  I want to connect my MetaMask wallet
  So that I can interact with the staking demo

  Scenario: Wallet is available and user connects
    Given MetaMask is installed
    And I am on the staking demo page
    When I click the Connect Wallet button
    And I approve the connection in MetaMask
    Then I should see my truncated wallet address
    And the network chip should show the current network

  Scenario: Wallet is available but user cancels connection
    Given MetaMask is installed
    And I am on the staking demo page
    When I click the Connect Wallet button
    And I close the MetaMask connection prompt
    Then the app should remain in disconnected state
    And the Connect Wallet button should still be visible

  Scenario: No wallet is installed
    Given MetaMask is not installed
    And I am on the staking demo page
    When I click the Connect Wallet button
    Then I should see a message "MetaMask not detected. Install MetaMask to continue."
    And no other UI elements should be enabled`,

  `Feature: Visitor stakes successfully
  As a connected visitor on a supported network
  I want to stake ETH
  So that I can see the staking flow in action

  Scenario: User stakes and balance updates
    Given I am connected on Ethereum Hoodi
    And my staked balance shows "0 ETH"
    When I enter "0.1" in the amount input
    And I click the Stake button
    And I approve the transaction in MetaMask
    Then the status panel should show "Processing stake..."
    And after confirmation the status should show "Stake confirmed for 0.1 ETH"
    And my staked balance should show "0.1 ETH"

  Scenario: User stakes twice and balance accumulates
    Given I am connected on Ethereum Hoodi
    And I have already staked "0.1" ETH
    When I enter "0.2" in the amount input
    And I click the Stake button
    And I approve the transaction in MetaMask
    Then after confirmation my staked balance should show "0.3 ETH"

  Scenario: Amount input resets after successful stake
    Given I am connected on Ethereum Hoodi
    When I enter "0.1" in the amount input
    And I click the Stake button
    And I approve the transaction in MetaMask
    Then after confirmation the amount input should be empty`,

  `Feature: Visitor rejects transaction
  As a connected visitor
  I want to reject a transaction in my wallet
  So that the app recovers gracefully

  Scenario: User rejects a stake transaction
    Given I am connected on Ethereum Hoodi
    And I enter "0.5" in the amount input
    When I click the Stake button
    And I reject the transaction in MetaMask
    Then the status panel should show "Transaction rejected"
    And the amount input should still contain "0.5"
    And the Stake button should be enabled

  Scenario: User rejects an unstake transaction
    Given I am connected on Ethereum Hoodi
    And my staked balance shows "0.1 ETH"
    When I click the Unstake button
    And I reject the transaction in MetaMask
    Then the status panel should show "Transaction rejected"
    And my staked balance should still show "0.1 ETH"`,

  `Feature: Visitor is on wrong network
  As a connected visitor on an unsupported network
  I want to see clear guidance
  So that I know to switch networks before staking

  Scenario: Unsupported network shows banner with switch guidance
    Given I am connected on an unsupported network
    Then I should see a banner with the detected network name
    And the banner should say "Switch to Ethereum Hoodi to continue"
    And the network chip should be amber

  Scenario: Stake button is disabled on unsupported network
    Given I am connected on an unsupported network
    When I enter "0.1" in the amount input
    Then the Stake button should be disabled

  Scenario: Unstake button remains disabled on unsupported network
    Given I am connected on an unsupported network
    Then the Unstake button should be disabled`,

  `Feature: Visitor unstakes successfully
  As a connected visitor with a staked balance
  I want to unstake my ETH
  So that I can see the full round-trip flow

  Scenario: User unstakes and balance returns to zero
    Given I am connected on Ethereum Hoodi
    And my staked balance shows "0.1 ETH"
    When I click the Unstake button
    And I approve the transaction in MetaMask
    Then the status panel should show "Processing unstake..."
    And after confirmation the status should show "Unstake confirmed"
    And my staked balance should show "0 ETH"

  Scenario: Unstake button returns to disabled state after unstake
    Given I am connected on Ethereum Hoodi
    And my staked balance shows "0.1 ETH"
    When I click the Unstake button
    And I approve the transaction in MetaMask
    Then after confirmation the Unstake button should be disabled`,
]

export const web3Practices = [
  {
    label: 'Automated wallet interactions',
    description:
      'Connect MetaMask, approve or reject transactions, and switch networks inside end-to-end tests - driven by a real wallet extension in Playwright.',
    detail: '0 mocked wallet interactions',
    icon: 'Wx',
    caption: 'Dappwright + Playwright' as const,
    source: { label: 'e2e/steps/', href: `${WEB3_REPO}/tree/main/e2e/steps` },
  },
  {
    label: 'Transaction lifecycle testing',
    description:
      'Validate pending, confirmed, and rejected states instead of only happy-path UI. Each transition is asserted, including recovery back to idle.',
    detail: 'Processing -> confirmed / rejected -> idle',
    icon: 'Tx',
    caption: 'Dappwright + Playwright' as const,
    source: { label: 'e2e/features/', href: `${WEB3_REPO}/tree/main/e2e/features` },
  },
  {
    label: 'Wrong-network resilience',
    description:
      'Tests verify that unsupported networks are detected and action buttons are disabled before any transaction can be attempted. Recovery guidance is shown automatically.',
    detail: 'Banner + disabled buttons + amber network chip',
    icon: 'Nw',
    caption: 'Dappwright + Playwright' as const,
    source: {
      label: 'wrong-network.feature',
      href: `${WEB3_REPO}/blob/main/e2e/features/wrong-network.feature`,
    },
  },
  {
    label: 'Browser-level web3 testing',
    description:
      'Wallet-driven flows are tested in the browser where failures actually happen. No API shortcuts - every interaction goes through a real MetaMask extension.',
    detail: 'Network selection, confirmation, rejection, post-transaction state',
    icon: 'W3',
    caption: 'Dappwright + Playwright' as const,
    source: {
      label: 'playwright.config.ts',
      href: `${WEB3_REPO}/blob/main/playwright.config.ts`,
    },
  },
]

export const web3Stats = [
  { value: '5', label: 'User journeys' },
  { value: '13', label: 'Scenarios' },
  { value: '2', label: 'Failure modes' },
  { value: 'Real', label: 'Wallet interactions' },
]
