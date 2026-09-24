import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Tooltip from '../../../components/ui/Tooltip'

function renderTooltip() {
  render(
    <Tooltip label="CI: GitHub Actions">
      <a href="/x">badge</a>
    </Tooltip>,
  )
  return screen.getByRole('link', { name: 'badge' })
}

describe('Tooltip', () => {
  it('shows its label while the pointer is over the element', () => {
    const trigger = renderTooltip()
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()

    fireEvent.mouseEnter(trigger)

    expect(screen.getByRole('tooltip').textContent).toBe('CI: GitHub Actions')
  })

  it('hides the label when the pointer leaves', async () => {
    const trigger = renderTooltip()
    fireEvent.mouseEnter(trigger)
    expect(screen.getByRole('tooltip')).toBeInTheDocument()

    fireEvent.mouseLeave(trigger)

    await waitFor(() => expect(screen.queryByRole('tooltip')).not.toBeInTheDocument())
  })
})
