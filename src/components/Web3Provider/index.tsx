import { ChainId } from '@uniswap/sdk-core'
import { useWeb3React, Web3ReactHooks, Web3ReactProvider } from '@web3-react/core'
import { Connector } from '@web3-react/types'
import { connections, getConnection } from 'connection'
import { isSupportedChain } from 'constants/chains'
import { DEPRECATED_RPC_PROVIDERS, RPC_PROVIDERS } from 'constants/providers'
import { useFallbackProviderEnabled } from 'featureFlags/flags/fallbackProvider'
import { TraceJsonRpcVariant, useTraceJsonRpcFlag } from 'featureFlags/flags/traceJsonRpc'
import usePrevious from 'hooks/usePrevious'
import { chainIdToNetworkName } from 'lib/hooks/useCurrencyLogoURIs'
import { MixPanelTrackEvent } from 'pages/mixpanel'
import { ReactNode, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useConnectedWallets } from 'state/wallets/hooks'
import { getCurrentPageFromLocation } from 'utils/urlRoutes'

export default function Web3Provider({ children }: { children: ReactNode }) {
  const connectors = connections.map<[Connector, Web3ReactHooks]>(({ hooks, connector }) => [connector, hooks])

  return (
    <Web3ReactProvider connectors={connectors}>
      <Updater />
      {children}
    </Web3ReactProvider>
  )
}

/** A component to run hooks under the Web3ReactProvider context. */
function Updater() {
  const { account, chainId, connector, provider } = useWeb3React()
  const { pathname } = useLocation()
  const currentPage = getCurrentPageFromLocation(pathname)

  const providers = useFallbackProviderEnabled() ? RPC_PROVIDERS : DEPRECATED_RPC_PROVIDERS

  // Trace RPC calls (for debugging).
  const networkProvider = isSupportedChain(chainId) ? providers[chainId] : undefined
  const shouldTrace = useTraceJsonRpcFlag() === TraceJsonRpcVariant.Enabled
  useEffect(() => {
    if (shouldTrace) {
      provider?.on('debug', trace)
      if (provider !== networkProvider) {
        networkProvider?.on('debug', trace)
      }
    }
    return () => {
      provider?.off('debug', trace)
      networkProvider?.off('debug', trace)
    }
  }, [networkProvider, provider, shouldTrace])

  // Send analytics events when the active account changes.
  const previousAccount = usePrevious(account)
  const [connectedWallets, addConnectedWallet] = useConnectedWallets()
  useEffect(() => {
    if (account && account !== previousAccount) {
      const walletType = getConnection(connector).getName()

      MixPanelTrackEvent({
        category: 'Dex51 Wallet Connected',
        action: 'Wallet connected by user',
        label: walletType,
        account,
        chain: chainIdToNetworkName(chainId ?? ChainId.MAINNET),
      })

      addConnectedWallet({ account, walletType })
    }
  }, [account, addConnectedWallet, currentPage, chainId, connectedWallets, connector, previousAccount, provider])

  return null
}

function trace(event: any) {
  if (!event?.request) return
  const { method, id, params } = event.request
  console.groupCollapsed(method, id)
  console.debug(params)
  console.groupEnd()
}
