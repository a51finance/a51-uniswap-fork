// eslint-disable-next-line no-restricted-imports
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { useWeb3React } from '@web3-react/core'
import clsx from 'clsx'
import { Search } from 'components/Icons/Search'
import { useSearchTokens } from 'graphql/data/SearchTokens'
import useDebounce from 'hooks/useDebounce'
import { useOnClickOutside } from 'hooks/useOnClickOutside'
import { organizeSearchResults } from 'lib/utils/searchBar'
import { Box } from 'nft/components/Box'
import { Column, Row } from 'nft/components/Flex'
import { magicalGradientOnHover } from 'nft/css/common.css'
import { useIsMobile, useIsTablet } from 'nft/hooks'
import { useIsNavSearchInputVisible } from 'nft/hooks/useIsNavSearchInputVisible'
import { ChangeEvent, useCallback, useEffect, useReducer, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import styled from 'styled-components'

import { ChevronLeftIcon, NavMagnifyingGlassIcon } from '../../nft/components/icons'
import { NavIcon } from './NavIcon'
import * as styles from './SearchBar.css'
import { SearchBarDropdown } from './SearchBarDropdown'

const KeyShortCut = styled.div`
  background-color: ${({ theme }) => theme.surface3};
  color: ${({ theme }) => theme.neutral2};
  padding: 0px 8px;
  width: 20px;
  height: 20px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 535;
  line-height: 16px;
  display: flex;
  align-items: center;
  opacity: 0.6;
  backdrop-filter: blur(60px);
`

export const SearchBar = () => {
  const [isOpen, toggleOpen] = useReducer((state: boolean) => !state, false)
  const [searchValue, setSearchValue] = useState('')
  const debouncedSearchValue = useDebounce(searchValue, 300)
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const { pathname } = useLocation()
  const isMobile = useIsMobile()
  const isTablet = useIsTablet()
  const isNavSearchInputVisible = useIsNavSearchInputVisible()

  useOnClickOutside(searchRef, () => {
    isOpen && toggleOpen()
  })

  const { chainId } = useWeb3React()
  const { data: tokens, loading: tokensAreLoading } = useSearchTokens(debouncedSearchValue, chainId ?? 1)

  const reducedTokens = organizeSearchResults(tokens ?? [])

  // close dropdown on escape
  useEffect(() => {
    const escapeKeyDownHandler = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        event.preventDefault()
        toggleOpen()
      }
    }

    document.addEventListener('keydown', escapeKeyDownHandler)

    return () => {
      document.removeEventListener('keydown', escapeKeyDownHandler)
    }
  }, [isOpen, toggleOpen])

  // clear searchbar when changing pages
  useEffect(() => {
    setSearchValue('')
  }, [pathname])

  // auto set cursor when searchbar is opened
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus()
    }
  }, [isOpen])

  const isMobileOrTablet = isMobile || isTablet || !isNavSearchInputVisible

  const { i18n } = useLingui() // subscribe to locale changes
  const placeholderText = isMobileOrTablet ? t(i18n)`Search` : t(i18n)`Search tokens`

  const handleKeyPress = useCallback(
    (event: any) => {
      if (event.key === '/') {
        event.preventDefault()
        !isOpen && toggleOpen()
      }
    },
    [isOpen]
  )

  useEffect(() => {
    const innerRef = inputRef.current

    if (innerRef !== null) {
      //only mount the listener when input available as ref
      document.addEventListener('keydown', handleKeyPress)
    }

    return () => {
      if (innerRef !== null) {
        document.removeEventListener('keydown', handleKeyPress)
      }
    }
  }, [handleKeyPress, inputRef])

  return (
    <>
      <Column
        data-cy="search-bar"
        position={{ sm: 'fixed', md: 'absolute' }}
        width={{ sm: isOpen ? 'viewWidth' : 'auto', md: 'auto' }}
        ref={searchRef}
        className={clsx(styles.searchBarContainerNft, {
          searchBarContainerDisableBlur: isNavSearchInputVisible,
        })}
        display={{ sm: isOpen ? 'flex' : 'none', xl: 'flex' }}
        {...(isNavSearchInputVisible && {
          position: 'relative',
          display: 'flex',
        })}
        {...(isOpen && {
          boxShadow: 'deep',
        })}
      >
        <Row
          className={clsx(
            styles.nftSearchBar,
            !isOpen && !isMobile && magicalGradientOnHover,
            isMobileOrTablet && (isOpen ? styles.visible : styles.hidden)
          )}
          borderRadius={isOpen || isMobileOrTablet ? undefined : '16'}
          borderTopRightRadius={isOpen && !isMobile ? '16' : undefined}
          borderTopLeftRadius={isOpen && !isMobile ? '16' : undefined}
          borderBottomWidth={isOpen || isMobileOrTablet ? '0px' : '1px'}
          backgroundColor={isOpen ? 'surface1' : 'surface1'}
          onClick={() => !isOpen && toggleOpen()}
          gap="12"
        >
          <Box className={styles.searchContentLeftAlign}>
            <Box display={{ sm: 'none', md: 'flex' }}>
              <Search width="20px" height="20px" />
            </Box>
            <Box display={{ sm: 'flex', md: 'none' }} color="neutral3" onClick={toggleOpen}>
              <ChevronLeftIcon />
            </Box>
          </Box>

          <Box
            as="input"
            data-cy="search-bar-input"
            placeholder={placeholderText}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              !isOpen && toggleOpen()
              setSearchValue(event.target.value)
            }}
            className={`${styles.searchBarInput} ${styles.searchContentLeftAlign}`}
            value={searchValue}
            ref={inputRef}
            width="full"
          />
          {!isOpen && <KeyShortCut>/</KeyShortCut>}
        </Row>
        <Column overflow="hidden" className={clsx(isOpen ? styles.visible : styles.hidden)}>
          {isOpen && (
            <SearchBarDropdown
              toggleOpen={toggleOpen}
              tokens={reducedTokens}
              queryText={debouncedSearchValue}
              hasInput={debouncedSearchValue.length > 0}
              isLoading={tokensAreLoading}
            />
          )}
        </Column>
      </Column>
      {isMobileOrTablet && (
        <NavIcon onClick={toggleOpen} label={placeholderText}>
          <NavMagnifyingGlassIcon />
        </NavIcon>
      )}
    </>
  )
}
