import { TradeType } from '@uniswap/sdk-core'

export interface SerializableTransactionReceipt {
  to: string
  from: string
  contractAddress: string
  transactionIndex: number
  blockHash: string
  transactionHash: string
  blockNumber: number
  status?: number
}

/**
 * Be careful adding to this enum, always assign a unique value (typescript will not prevent duplicate values).
 * These values is persisted in state and if you change the value it will cause errors
 */
export enum TransactionType {
  APPROVAL = 0,
  SWAP,
  CLAIM,
  DELEGATE,
  WRAP,
  QUEUE,
  EXECUTE,
  BUY,
  SEND,
  RECEIVE,
  REPAY,
  CANCEL,
}

interface BaseTransactionInfo {
  type: TransactionType
}

export interface QueueTransactionInfo extends BaseTransactionInfo {
  type: TransactionType.QUEUE
  governorAddress: string
  proposalId: number
}

export interface ExecuteTransactionInfo extends BaseTransactionInfo {
  type: TransactionType.EXECUTE
  governorAddress: string
  proposalId: number
}

export interface DelegateTransactionInfo extends BaseTransactionInfo {
  type: TransactionType.DELEGATE
  delegatee: string
}

export interface ApproveTransactionInfo extends BaseTransactionInfo {
  type: TransactionType.APPROVAL
  tokenAddress: string
  spender: string
  amount: string
}

interface BaseSwapTransactionInfo extends BaseTransactionInfo {
  type: TransactionType.SWAP
  tradeType: TradeType
  inputCurrencyId: string
  outputCurrencyId: string
  isUniswapXOrder: boolean
}

export interface ExactInputSwapTransactionInfo extends BaseSwapTransactionInfo {
  tradeType: TradeType.EXACT_INPUT
  inputCurrencyAmountRaw: string
  expectedOutputCurrencyAmountRaw: string
  minimumOutputCurrencyAmountRaw: string
  settledOutputCurrencyAmountRaw?: string
}
export interface ExactOutputSwapTransactionInfo extends BaseSwapTransactionInfo {
  tradeType: TradeType.EXACT_OUTPUT
  outputCurrencyAmountRaw: string
  expectedInputCurrencyAmountRaw: string
  maximumInputCurrencyAmountRaw: string
}

export interface WrapTransactionInfo {
  type: TransactionType.WRAP
  unwrapped: boolean
  currencyAmountRaw: string
  chainId?: number
}

export interface ClaimTransactionInfo {
  type: TransactionType.CLAIM
  recipient: string
  uniAmountRaw?: string
}

export type TransactionInfo =
  | ApproveTransactionInfo
  | ExactOutputSwapTransactionInfo
  | ExactInputSwapTransactionInfo
  | ClaimTransactionInfo
  | QueueTransactionInfo
  | ExecuteTransactionInfo
  | DelegateTransactionInfo
  | WrapTransactionInfo

export interface TransactionDetails {
  hash: string
  receipt?: SerializableTransactionReceipt
  lastCheckedBlockNumber?: number
  addedTime: number
  confirmedTime?: number
  deadline?: number
  from: string
  info: TransactionInfo
  nonce?: number
  cancelled?: boolean
}
