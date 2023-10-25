import QueryTokenLogo from 'components/Logo/QueryTokenLogo'
import TokenSafetyIcon from 'components/TokenSafety/TokenSafetyIcon'
import { checkSearchTokenWarning } from 'constants/tokenSafety'
import { useInfoExplorePageEnabled } from 'featureFlags/flags/infoExplore'
import { TokenStandard } from 'graphql/data/__generated__/types-and-hooks'
import { SearchToken } from 'graphql/data/SearchTokens'
import { getTokenDetailsURL } from 'graphql/data/util'
import { Box } from 'nft/components/Box'
import { Column, Row } from 'nft/components/Flex'
import { vars } from 'nft/css/sprinkles.css'
import { useCallback, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { ThemedText } from 'theme/components'
import { useFormatter } from 'utils/formatNumbers'

import { DeltaArrow, DeltaText } from '../Tokens/TokenDetails/Delta'
import { useAddRecentlySearchedAsset } from './RecentlySearchedAssets'
import * as styles from './SearchBar.css'

const PriceChangeContainer = styled.div`
  display: flex;
  align-items: center;
  padding-top: 4px;
  gap: 2px;
`

interface TokenRowProps {
  token: SearchToken
  isHovered: boolean
  setHoveredIndex: (index: number | undefined) => void
  toggleOpen: () => void
  index: number
}

export const TokenRow = ({ token, isHovered, setHoveredIndex, toggleOpen, index }: TokenRowProps) => {
  const addRecentlySearchedAsset = useAddRecentlySearchedAsset()
  const navigate = useNavigate()
  const { formatFiatPrice, formatDelta } = useFormatter()

  const handleClick = useCallback(() => {
    const address = !token.address && token.standard === TokenStandard.Native ? 'NATIVE' : token.address
    address && addRecentlySearchedAsset({ address, chain: token.chain })

    toggleOpen()
  }, [addRecentlySearchedAsset, token, toggleOpen])

  const isInfoExplorePageEnabled = useInfoExplorePageEnabled()

  const tokenDetailsPath = getTokenDetailsURL({ ...token, isInfoExplorePageEnabled })
  // Close the modal on escape
  useEffect(() => {
    const keyDownHandler = (event: KeyboardEvent) => {
      if (event.key === 'Enter' && isHovered) {
        event.preventDefault()
        navigate(tokenDetailsPath)
        handleClick()
      }
    }
    document.addEventListener('keydown', keyDownHandler)
    return () => {
      document.removeEventListener('keydown', keyDownHandler)
    }
  }, [toggleOpen, isHovered, token, navigate, handleClick, tokenDetailsPath])

  return (
    <Link
      data-testid={`searchbar-token-row-${token.chain}-${token.address ?? 'NATIVE'}`}
      to={tokenDetailsPath}
      onClick={handleClick}
      onMouseEnter={() => !isHovered && setHoveredIndex(index)}
      onMouseLeave={() => isHovered && setHoveredIndex(undefined)}
      className={styles.suggestionRow}
      style={{ background: isHovered ? vars.color.lightGrayOverlay : 'none' }}
    >
      <Row style={{ width: '65%' }}>
        <QueryTokenLogo
          token={token}
          symbol={token.symbol}
          size="36px"
          backupImg={token.project?.logoUrl}
          style={{ marginRight: '8px' }}
        />
        <Column className={styles.suggestionPrimaryContainer}>
          <Row gap="4" width="full">
            <Box className={styles.primaryText}>{token.name}</Box>
            <TokenSafetyIcon warning={checkSearchTokenWarning(token)} />
          </Row>
          <Box className={styles.secondaryText}>{token.symbol}</Box>
        </Column>
      </Row>

      <Column className={styles.suggestionSecondaryContainer}>
        {!!token.market?.price?.value && (
          <>
            <Row gap="4">
              <Box className={styles.primaryText}>{formatFiatPrice({ price: token.market.price.value })}</Box>
            </Row>
            <PriceChangeContainer>
              <DeltaArrow delta={token.market?.pricePercentChange?.value} />
              <ThemedText.BodySmall>
                <DeltaText delta={token.market?.pricePercentChange?.value}>
                  {formatDelta(Math.abs(token.market?.pricePercentChange?.value ?? 0))}
                </DeltaText>
              </ThemedText.BodySmall>
            </PriceChangeContainer>
          </>
        )}
      </Column>
    </Link>
  )
}

export const SkeletonRow = () => {
  return (
    <Row className={styles.suggestionRow}>
      <Row width="full">
        <Box className={styles.imageHolder} />
        <Column gap="4" width="full">
          <Row justifyContent="space-between">
            <Box borderRadius="round" height="20" background="surface2" style={{ width: '180px' }} />
            <Box borderRadius="round" height="20" width="48" background="surface2" />
          </Row>

          <Row justifyContent="space-between">
            <Box borderRadius="round" height="16" width="120" background="surface2" />
            <Box borderRadius="round" height="16" width="48" background="surface2" />
          </Row>
        </Column>
      </Row>
    </Row>
  )
}
