import { t } from '@lingui/macro'
import { SwapOrderStatus, TransactionStatus } from 'graphql/data/__generated__/types-and-hooks'
import { UniswapXOrderStatus } from 'lib/hooks/orders/types'
import { TransactionType } from 'state/transactions/types'

const TransactionTitleTable: { [key in TransactionType]: { [state in TransactionStatus]: string } } = {
  [TransactionType.SWAP]: {
    [TransactionStatus.Pending]: t`Swapping`,
    [TransactionStatus.Confirmed]: t`Swapped`,
    [TransactionStatus.Failed]: t`Swap failed`,
  },
  [TransactionType.WRAP]: {
    [TransactionStatus.Pending]: t`Wrapping`,
    [TransactionStatus.Confirmed]: t`Wrapped`,
    [TransactionStatus.Failed]: t`Wrap failed`,
  },
  [TransactionType.APPROVAL]: {
    [TransactionStatus.Pending]: t`Approving`,
    [TransactionStatus.Confirmed]: t`Approved`,
    [TransactionStatus.Failed]: t`Approval failed`,
  },
  [TransactionType.CLAIM]: {
    [TransactionStatus.Pending]: t`Claiming`,
    [TransactionStatus.Confirmed]: t`Claimed`,
    [TransactionStatus.Failed]: t`Claim failed`,
  },
  [TransactionType.BUY]: {
    [TransactionStatus.Pending]: t`Buying`,
    [TransactionStatus.Confirmed]: t`Bought`,
    [TransactionStatus.Failed]: t`Buy failed`,
  },
  [TransactionType.SEND]: {
    [TransactionStatus.Pending]: t`Sending`,
    [TransactionStatus.Confirmed]: t`Sent`,
    [TransactionStatus.Failed]: t`Send failed`,
  },
  [TransactionType.RECEIVE]: {
    [TransactionStatus.Pending]: t`Receiving`,
    [TransactionStatus.Confirmed]: t`Received`,
    [TransactionStatus.Failed]: t`Receive failed`,
  },

  [TransactionType.QUEUE]: {
    [TransactionStatus.Pending]: t`Queuing`,
    [TransactionStatus.Confirmed]: t`Queued`,
    [TransactionStatus.Failed]: t`Queue failed`,
  },
  [TransactionType.EXECUTE]: {
    [TransactionStatus.Pending]: t`Executing`,
    [TransactionStatus.Confirmed]: t`Executed`,
    [TransactionStatus.Failed]: t`Execute failed`,
  },

  [TransactionType.REPAY]: {
    [TransactionStatus.Pending]: t`Repaying`,
    [TransactionStatus.Confirmed]: t`Repaid`,
    [TransactionStatus.Failed]: t`Repay failed`,
  },

  [TransactionType.CANCEL]: {
    [TransactionStatus.Pending]: t`Cancelling`,
    [TransactionStatus.Confirmed]: t`Cancelled`,
    [TransactionStatus.Failed]: t`Cancel failed`,
  },
  [TransactionType.DELEGATE]: {
    [TransactionStatus.Pending]: t`Delegating`,
    [TransactionStatus.Confirmed]: t`Delegated`,
    [TransactionStatus.Failed]: t`Delegate failed`,
  },
}

export const CancelledTransactionTitleTable: { [key in TransactionType]: string } = {
  [TransactionType.SWAP]: t`Swap cancelled`,
  [TransactionType.WRAP]: t`Wrap cancelled`,
  [TransactionType.APPROVAL]: t`Approval cancelled`,
  [TransactionType.CLAIM]: t`Claim cancelled`,
  [TransactionType.BUY]: t`Buy cancelled`,
  [TransactionType.SEND]: t`Send cancelled`,
  [TransactionType.RECEIVE]: t`Receive cancelled`,
  [TransactionType.QUEUE]: t`Queue cancelled`,
  [TransactionType.EXECUTE]: t`Execute cancelled`,
  [TransactionType.REPAY]: t`Repay cancelled`,
  [TransactionType.CANCEL]: t`Cancellation cancelled`,
  [TransactionType.DELEGATE]: t`Delegate cancelled`,
}

const AlternateTransactionTitleTable: { [key in TransactionType]?: { [state in TransactionStatus]: string } } = {
  [TransactionType.WRAP]: {
    [TransactionStatus.Pending]: t`Unwrapping`,
    [TransactionStatus.Confirmed]: t`Unwrapped`,
    [TransactionStatus.Failed]: t`Unwrap failed`,
  },
  [TransactionType.APPROVAL]: {
    [TransactionStatus.Pending]: t`Revoking approval`,
    [TransactionStatus.Confirmed]: t`Revoked approval`,
    [TransactionStatus.Failed]: t`Revoke approval failed`,
  },
}

export function getActivityTitle(type: TransactionType, status: TransactionStatus, alternate?: boolean) {
  if (alternate) {
    const alternateTitle = AlternateTransactionTitleTable[type]
    if (alternateTitle !== undefined) return alternateTitle[status]
  }
  return TransactionTitleTable[type][status]
}

const SwapTitleTable = TransactionTitleTable[TransactionType.SWAP]
export const OrderTextTable: {
  [status in UniswapXOrderStatus]: { title: string; status: TransactionStatus; statusMessage?: string }
} = {
  [UniswapXOrderStatus.OPEN]: {
    title: SwapTitleTable.PENDING,
    status: TransactionStatus.Pending,
  },
  [UniswapXOrderStatus.FILLED]: {
    title: SwapTitleTable.CONFIRMED,
    status: TransactionStatus.Confirmed,
  },
  [UniswapXOrderStatus.EXPIRED]: {
    title: t`Swap expired`,
    statusMessage: t`Your swap could not be fulfilled at this time. Please try again.`,
    status: TransactionStatus.Failed,
  },
  [UniswapXOrderStatus.ERROR]: {
    title: SwapTitleTable.FAILED,
    status: TransactionStatus.Failed,
  },
  [UniswapXOrderStatus.INSUFFICIENT_FUNDS]: {
    title: SwapTitleTable.FAILED,
    statusMessage: t`Your account had insufficent funds to complete this swap.`,
    status: TransactionStatus.Failed,
  },
  [UniswapXOrderStatus.CANCELLED]: {
    title: t`Swap cancelled`,
    status: TransactionStatus.Failed,
  },
}

// Converts GQL backend orderStatus enum to the enum used by the frontend and UniswapX backend
export const OrderStatusTable: { [key in SwapOrderStatus]: UniswapXOrderStatus } = {
  [SwapOrderStatus.Open]: UniswapXOrderStatus.OPEN,
  [SwapOrderStatus.Expired]: UniswapXOrderStatus.EXPIRED,
  [SwapOrderStatus.Error]: UniswapXOrderStatus.ERROR,
  [SwapOrderStatus.InsufficientFunds]: UniswapXOrderStatus.INSUFFICIENT_FUNDS,
}
