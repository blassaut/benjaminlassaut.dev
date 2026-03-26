const WEB3_REPO = 'https://github.com/blassaut/dapp-demo'

export const web3Features: string[] = [
  `Feature: Visitor connects wallet
  As a visitor
  I want to connect my MetaMask wallet
  So that I can interact with the LockBox

  Scenario: Wallet is available and user connects
    Given I am on the LockBox demo page
    When I click the Connect Wallet button
    And I approve the connection in MetaMask
    Then I should see my truncated wallet address
    And the network chip should show the current network

  Scenario: Wallet is available but user cancels connection
    Given I am on the LockBox demo page
    When I click the Connect Wallet button
    And I close the MetaMask connection prompt
    Then the app should remain in disconnected state
    And the Connect Wallet button should still be visible

  Scenario: No wallet is installed
    Given MetaMask is not installed
    And I am on the LockBox demo page
    When I click the Connect Wallet button
    Then I should see "MetaMask not detected. Install MetaMask to continue."`,

  `Feature: Visitor deposits successfully
  As a connected visitor on a supported network
  I want to deposit ETH into the LockBox
  So that I can see the on-chain deposit flow

  Scenario: User deposits and balance updates
    Given I am connected on the supported network
    When I enter "0.1" in the amount input
    And I click the Deposit button
    And I approve the transaction in MetaMask
    Then after confirmation the locked balance should update
    And the status should show a deposit confirmation message
    And the transaction history should be visible
    And the history should have grown by 1

  Scenario: User deposits twice and balance accumulates
    Given I am connected on the supported network
    And I have already deposited successfully
    When I enter "0.2" in the amount input
    And I click the Deposit button
    And I approve the transaction in MetaMask
    Then after confirmation the locked balance should be higher than before

  Scenario: Amount input resets after successful deposit
    Given I am connected on the supported network
    When I enter "0.1" in the amount input
    And I click the Deposit button
    And I approve the transaction in MetaMask
    Then after confirmation the amount input should be empty

  Scenario: Deposit button disabled when amount exceeds wallet balance
    Given I am connected on the supported network
    When I enter "999999" in the amount input
    Then the Deposit button should be disabled
    And I should see the deposit hint showing the max wallet balance

  Scenario: Contract balance updates after deposit
    Given I am connected on the supported network
    When I enter "0.1" in the amount input
    And I click the Deposit button
    And I approve the transaction in MetaMask
    Then the contract balance should show a non-zero value`,

  `Feature: Visitor rejects transaction
  As a connected visitor
  I want to reject a transaction in my wallet
  So that the app recovers gracefully

  Scenario: User rejects a deposit transaction
    Given I am connected on the supported network
    And I enter "0.5" in the amount input
    When I click the Deposit button
    And I reject the transaction in MetaMask
    Then the status panel should show "Transaction rejected"
    And the amount input should still contain "0.5"
    And the Deposit button should be enabled

  Scenario: User rejects a withdrawal transaction
    Given I am connected on the supported network
    And I have already deposited successfully
    When I enter "0.1" in the amount input
    And I click the Withdraw button
    And I reject the transaction in MetaMask
    Then the status panel should show "Transaction rejected"
    And my locked balance should be unchanged`,

  `Feature: Visitor withdraws successfully
  As a connected visitor with a locked balance
  I want to withdraw my ETH
  So that I can see the full round-trip flow

  Scenario: User withdraws and balance decreases
    Given I am connected on the supported network
    And I have already deposited successfully
    When I enter "0.1" in the amount input
    And I click the Withdraw button
    And I approve the transaction in MetaMask
    Then after confirmation the locked balance should decrease
    And the status should show a withdrawal confirmation message
    And the transaction history should be visible
    And the history should have grown by 1

  Scenario: Withdraw button disabled when amount exceeds balance
    Given I am connected on the supported network
    When I enter "99999" in the amount input
    Then the Withdraw button should be disabled

  Scenario: Withdraw hint shows max balance
    Given I am connected on the supported network
    And I have already deposited successfully
    When I enter "99999" in the amount input
    Then I should see the withdraw hint showing the max locked balance`,
]

export const web3Practices = [
  {
    label: 'Real wallet interactions',
    description:
      'Connect MetaMask, approve/reject transactions, switch networks',
    detail: '0 mocked wallet interactions',
    icon: 'Wx',
    caption: 'Dappwright + Playwright' as const,
    source: { label: 'e2e/steps/', href: `${WEB3_REPO}/tree/main/e2e/steps` },
  },
  {
    label: 'Transaction lifecycle',
    description:
      'Pending, confirmed, rejected - each state transition is asserted, including recovery to idle',
    detail: 'Processing -> confirmed / rejected -> idle',
    icon: 'Tx',
    caption: 'Dappwright + Playwright' as const,
    source: { label: 'e2e/features/', href: `${WEB3_REPO}/tree/main/e2e/features` },
  },
  {
    label: 'On-chain state validation',
    description:
      'Contract balance, tx history, and pagination verified against real chain state',
    detail: 'Locked balance + contract total + tx history',
    icon: 'Sc',
    caption: 'Dappwright + Playwright' as const,
    source: {
      label: 'deposit-successfully.feature',
      href: `${WEB3_REPO}/blob/main/e2e/features/deposit-successfully.feature`,
    },
  },
  {
    label: 'No API shortcuts',
    description:
      'Tested in the browser with a real MetaMask wallet',
    detail: 'Confirmation, rejection, input validation, post-transaction state',
    icon: 'W3',
    caption: 'Dappwright + Playwright' as const,
    source: {
      label: 'playwright.config.ts',
      href: `${WEB3_REPO}/blob/main/playwright.config.ts`,
    },
  },
]

export const web3Stats = [
  { value: '4', label: 'User journeys' },
  { value: '13', label: 'Scenarios' },
  { value: '2', label: 'Failure modes' },
  { value: 'Real', label: 'Wallet-level interactions' },
]
