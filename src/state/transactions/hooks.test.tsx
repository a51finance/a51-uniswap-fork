import { BigNumber } from '@ethersproject/bignumber'
import { PERMIT2_ADDRESS } from '@uniswap/permit2-sdk'
import { ChainId } from '@uniswap/sdk-core'
import { useWeb3React } from '@web3-react/core'
import { USDC_MAINNET } from 'constants/tokens'
import store from 'state'
import { mocked } from 'test-utils/mocked'
import { act, renderHook } from 'test-utils/render'

import { useTransactionAdder, useTransactionCanceller, useTransactionRemover } from './hooks'
import { clearAllTransactions } from './reducer'
import { ApproveTransactionInfo, TransactionInfo, TransactionType } from './types'

const pendingTransactionResponse = {
  hash: '0x123',
  timestamp: 1000,
  from: '0x123',
  wait: jest.fn(),
  nonce: 1,
  gasLimit: BigNumber.from(1000),
  data: '0x',
  value: BigNumber.from(0),
  chainId: ChainId.MAINNET,
  confirmations: 0,
  blockNumber: undefined,
  blockHash: undefined,
}

const mockApprovalTransactionInfo: ApproveTransactionInfo = {
  type: TransactionType.APPROVAL,
  tokenAddress: USDC_MAINNET.address,
  spender: PERMIT2_ADDRESS,
  amount: '10000',
}

describe('Transactions hooks', () => {
  beforeEach(() => {
    mocked(useWeb3React).mockReturnValue({ chainId: 1, account: '0x123' } as ReturnType<typeof useWeb3React>)

    jest.useFakeTimers()
    store.dispatch(clearAllTransactions({ chainId: ChainId.MAINNET }))
  })

  function addPendingTransaction(txInfo: TransactionInfo) {
    const { result } = renderHook(() => useTransactionAdder())
    act(() => {
      result.current(pendingTransactionResponse, txInfo)
    })
  }

  it('useTransactionAdder adds a transaction', () => {
    addPendingTransaction(mockApprovalTransactionInfo)
    expect(store.getState().transactions[ChainId.MAINNET][pendingTransactionResponse.hash]).toEqual({
      hash: pendingTransactionResponse.hash,
      info: mockApprovalTransactionInfo,
      from: pendingTransactionResponse.from,
      addedTime: Date.now(),
      nonce: pendingTransactionResponse.nonce,
      deadline: undefined,
    })
  })

  it('useTransactionRemover removes a transaction', () => {
    addPendingTransaction(mockApprovalTransactionInfo)

    const { result: remover } = renderHook(() => useTransactionRemover())
    act(() => {
      remover.current(pendingTransactionResponse.hash)
    })
    expect(store.getState().transactions[ChainId.MAINNET][pendingTransactionResponse.hash]).toBeUndefined()
  })

  describe('useTransactionCanceller', () => {
    it('Replaces the original tx with a cancel tx with a different hash', () => {
      addPendingTransaction(mockApprovalTransactionInfo)
      const { result: canceller } = renderHook(() => useTransactionCanceller())

      const originalTransactionDetails = store.getState().transactions[ChainId.MAINNET][pendingTransactionResponse.hash]

      act(() => canceller.current(pendingTransactionResponse.hash, ChainId.MAINNET, '0x456'))

      expect(store.getState().transactions[ChainId.MAINNET][pendingTransactionResponse.hash]).toBeUndefined()

      expect(store.getState().transactions[ChainId.MAINNET]['0x456']).toEqual({
        ...originalTransactionDetails,
        hash: '0x456',
        cancelled: true,
      })
    })
  })
})
