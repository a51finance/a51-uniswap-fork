import { render } from 'test-utils/render'

import { SearchBarDropdown } from './SearchBarDropdown'

const SearchBarDropdownProps = {
  toggleOpen: () => void 0,
  tokens: [],
  collections: [],
  queryText: '',
  hasInput: false,
  isLoading: false,
}

describe('disable nft on searchbar dropdown', () => {
  it('should not render popular nft collections', () => {
    const { container } = render(<SearchBarDropdown {...SearchBarDropdownProps} />)
    expect(container).toMatchSnapshot()
    expect(container).not.toHaveTextContent('Popular NFT collections')
    expect(container).not.toHaveTextContent('NFT')
  })
})
