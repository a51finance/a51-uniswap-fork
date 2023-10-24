import { SupportedLocalCurrency } from 'constants/localCurrencies'
import useParsedQueryString from 'hooks/useParsedQueryString'
import { useAtom } from 'jotai'
import { stringify } from 'qs'
import { useMemo } from 'react'
import type { To } from 'react-router-dom'
import { useLocation } from 'react-router-dom'

import { activeLocalCurrencyAtom } from './useActiveLocalCurrency'

export function useLocalCurrencyLinkProps(localCurrency?: SupportedLocalCurrency): {
  to?: To
  onClick?: () => void
} {
  const location = useLocation()
  const qs = useParsedQueryString()
  const [, updateActiveLocalCurrency] = useAtom(activeLocalCurrencyAtom)

  return useMemo(
    () =>
      !localCurrency
        ? {}
        : {
            to: {
              ...location,
              search: stringify({ ...qs, cur: localCurrency }),
            },
            onClick: () => {
              updateActiveLocalCurrency(localCurrency)
            },
          },
    [localCurrency, location, qs, updateActiveLocalCurrency]
  )
}
