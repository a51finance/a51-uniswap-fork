import { ReactNode } from 'react'
import styled from 'styled-components'
import { ThemedText } from 'theme/components'
import { CloseIcon } from 'theme/components'

import { AutoColumn } from '../Column'
import Row from '../Row'

const Wrapper = styled.div`
  background-color: ${({ theme }) => theme.surface1};
  border-radius: 20px;
  outline: 1px solid ${({ theme }) => theme.surface3};
  width: 100%;
  padding: 16px;
`

const BottomSection = styled(AutoColumn)`
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
`

export function ConfirmationModalContent({
  title,
  bottomContent,
  onDismiss,
  topContent,
  headerContent,
}: {
  title: ReactNode
  onDismiss: () => void
  topContent: () => ReactNode
  bottomContent?: () => ReactNode
  headerContent?: () => ReactNode
}) {
  return (
    <Wrapper>
      <AutoColumn gap="sm">
        <Row>
          {headerContent?.()}
          <Row justify="center" marginLeft="24px">
            <ThemedText.SubHeader>{title}</ThemedText.SubHeader>
          </Row>
          <CloseIcon onClick={onDismiss} data-testid="confirmation-close-icon" />
        </Row>
        {topContent()}
      </AutoColumn>
      {bottomContent && <BottomSection gap="16px">{bottomContent()}</BottomSection>}
    </Wrapper>
  )
}
