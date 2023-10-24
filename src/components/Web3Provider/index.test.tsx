import { act, render } from '@testing-library/react'
import { Provider as EIP1193Provider } from '@web3-react/types'
import { Connection, ConnectionType } from 'connection/types'
import { Provider } from 'react-redux'
import { HashRouter } from 'react-router-dom'
import store from 'state'

import Web3Provider from '.'

jest.mock('connection', () => {
  const { EIP1193 } = jest.requireActual('@web3-react/eip1193')
  const { initializeConnector, MockEIP1193Provider } = jest.requireActual('@web3-react/core')
  const { ConnectionType } = jest.requireActual('connection')
  const provider: EIP1193Provider = new MockEIP1193Provider()
  const [connector, hooks] = initializeConnector((actions: any) => new EIP1193({ actions, provider }))
  const mockConnection: Connection = {
    connector,
    hooks,
    getName: () => 'test',
    type: 'INJECTED' as ConnectionType,
    shouldDisplay: () => false,
  }

  return { ConnectionType, getConnection: jest.fn(), connections: [mockConnection] }
})

jest.unmock('@web3-react/core')

const UI = (
  <HashRouter>
    <Provider store={store}>
      <Web3Provider>{null}</Web3Provider>
    </Provider>
  </HashRouter>
)

describe('Web3Provider', () => {
  it('renders and eagerly connects', async () => {
    const result = render(UI)
    await act(async () => {
      await result
    })
    expect(result).toBeTruthy()
  })
})
