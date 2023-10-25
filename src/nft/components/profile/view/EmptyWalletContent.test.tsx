import { render } from 'test-utils/render'

import { EmptyWalletModule } from './EmptyWalletContent'

describe('EmptyWalletContent.tsx', () => {
  it('matches base snapshot', () => {
    const { asFragment } = render(
      <div>
        <EmptyWalletModule type="token" />
        <EmptyWalletModule type="activity" />
      </div>
    )
    expect(asFragment()).toMatchSnapshot()
  })
})
