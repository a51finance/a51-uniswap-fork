import { ChainId } from '@uniswap/sdk-core'
import { TokenList } from '@uniswap/token-lists'
import { ConnectionType } from 'connection/types'
import { SupportedLocale } from 'constants/locales'
import { assert, Equals } from 'tsafe'

import { ApplicationModal, ApplicationState, PopupList } from './application/reducer'
import { ListsState } from './lists/reducer'
import { LogsState } from './logs/slice'
import { Log } from './logs/utils'
import { RouterPreference } from './routing/types'
import { TransactionState } from './transactions/reducer'
import { TransactionDetails } from './transactions/types'
import { UserState } from './user/reducer'
import { SerializedPair, SerializedToken, SlippageTolerance } from './user/types'
import { WalletState } from './wallets/reducer'
import { Wallet } from './wallets/types'

/**
 * WARNING:
 * Any changes made to the types of the Redux store could potentially require a migration.
 *
 * If you're making a change that alters the structure or types of the Redux state,
 * consider whether existing state stored in users' browsers will still be compatible
 * with the new types.
 *
 * If compatibility could be broken, you may need to create a migration
 * function that can convert the existing state into a format that's compatible with
 * the new types, or otherwise adjust the user's persisted state in some way
 * to prevent undesirable behavior.
 *
 * This migration function should be added to the `migrations` object
 * in our Redux store configuration.
 *
 * If no migration is needed, just update the expected types here to fix the typecheck.
 */

interface ExpectedUserState {
  selectedWallet?: ConnectionType
  lastUpdateVersionTimestamp?: number
  userLocale: SupportedLocale | null
  userRouterPreference: RouterPreference
  userHideClosedPositions: boolean
  userSlippageTolerance: number | SlippageTolerance.Auto
  userSlippageToleranceHasBeenMigratedToAuto: boolean
  userDeadline: number
  tokens: {
    [chainId: number]: {
      [address: string]: SerializedToken
    }
  }
  pairs: {
    [chainId: number]: {
      [key: string]: SerializedPair
    }
  }
  timestamp: number
  hideBaseWalletBanner: boolean
  showSurveyPopup?: boolean
  disabledUniswapX?: boolean
  optedOutOfUniswapX?: boolean
  originCountry?: string
}

assert<Equals<UserState, ExpectedUserState>>()

interface ExpectedTransactionState {
  [chainId: number]: {
    [txHash: string]: TransactionDetails
  }
}

assert<Equals<TransactionState, ExpectedTransactionState>>()

interface ExpectedListsState {
  readonly byUrl: {
    readonly [url: string]: {
      readonly current: TokenList | null
      readonly pendingUpdate: TokenList | null
      readonly loadingRequestId: string | null
      readonly error: string | null
    }
  }
  readonly lastInitializedDefaultListOfLists?: string[]
}

assert<Equals<ListsState, ExpectedListsState>>()

interface ExpectedApplicationState {
  readonly chainId: number | null
  readonly openModal: ApplicationModal | null
  readonly popupList: PopupList
}

assert<Equals<ApplicationState, ExpectedApplicationState>>()

interface ExpectedWalletState {
  connectedWallets: Wallet[]
  switchingChain: ChainId | false
}

assert<Equals<WalletState, ExpectedWalletState>>()

interface ExpectedLogsState {
  [chainId: number]: {
    [filterKey: string]: {
      listeners: number
      fetchingBlockNumber?: number
      results?:
        | {
            blockNumber: number
            logs: Log[]
            error?: undefined
          }
        | {
            blockNumber: number
            logs?: undefined
            error: true
          }
    }
  }
}

assert<Equals<LogsState, ExpectedLogsState>>()
