import React from 'react'
import styled from 'styled-components'
import {
  BlockIcon,
  CheckmarkCircleIcon,
  Flex,
  CrownIcon,
  Text,
  TeamPlayerIcon,
  TrophyGoldIcon,
  Skeleton,
} from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { useCompetitionXaloRewards, getEasterRewardGroupAchievements } from '../../../helpers'
import { BoldTd, Td, StyledPrizeTable } from '../../../components/StyledPrizeTable'

const StyledThead = styled.thead`
  border-bottom: 2px solid ${({ theme }) => theme.colors.cardBorder};
`

const EasterUserPrizeGrid: React.FC<{ userTradingInformation? }> = ({ userTradingInformation }) => {
  const { t } = useTranslation()
  const { userRewardGroup, userXaloRewards, userPointReward, canClaimNFT } = userTradingInformation
  const { xaloReward, dollarValueOfXaloReward } = useCompetitionXaloRewards(userXaloRewards)
  const { champion, teamPlayer } = getEasterRewardGroupAchievements(userRewardGroup)

  return (
    <StyledPrizeTable>
      <StyledThead>
        <tr>
          <th>{t('XALO Prizes')}</th>
          <th>{t('Achievements')}</th>
          <th>{t('NFT')}</th>
        </tr>
      </StyledThead>
      <tbody>
        <tr>
          <BoldTd>
            <Flex flexDirection="column">
              <Text bold>{xaloReward.toFixed(2)}</Text>
              {dollarValueOfXaloReward ? (
                <Text fontSize="12px" color="textSubtle">
                  ~{dollarValueOfXaloReward} USD
                </Text>
              ) : (
                <Skeleton height={24} width={80} />
              )}
            </Flex>
          </BoldTd>
          <Td>
            <Flex alignItems="center" flexWrap="wrap" justifyContent="center" width="100%">
              {champion && <CrownIcon mr={[0, '4px']} />}
              {teamPlayer && <TeamPlayerIcon mr={[0, '4px']} />}
              <TrophyGoldIcon mr={[0, '4px']} />
              <Text fontSize="12px" color="textSubtle" textTransform="lowercase">
                + {userPointReward} {t('Points')}
              </Text>
            </Flex>
          </Td>
          <Td>{canClaimNFT ? <CheckmarkCircleIcon color="success" /> : <BlockIcon color="textDisabled" />}</Td>
        </tr>
      </tbody>
    </StyledPrizeTable>
  )
}

export default EasterUserPrizeGrid
