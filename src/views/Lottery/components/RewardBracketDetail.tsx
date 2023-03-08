import BigNumber from 'bignumber.js'
import { Flex, Skeleton, Text } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { usePriceXaloBusd } from 'state/farms/hooks'
import Balance from 'components/Balance'
import { getBalanceNumber, getFullDisplayBalance } from 'utils/formatBalance'

interface RewardBracketDetailProps {
  xaloAmount: BigNumber
  rewardBracket?: number
  numberWinners?: string
  isBurn?: boolean
  isHistoricRound?: boolean
  isLoading?: boolean
}

const RewardBracketDetail: React.FC<RewardBracketDetailProps> = ({
  rewardBracket,
  xaloAmount,
  numberWinners,
  isHistoricRound,
  isBurn,
  isLoading,
}) => {
  const { t } = useTranslation()
  const xaloPriceBusd = usePriceXaloBusd()

  const getRewardText = () => {
    const numberMatch = rewardBracket + 1
    if (isBurn) {
      return t('Burn')
    }
    if (rewardBracket === 5) {
      return t('Match all %numberMatch%', { numberMatch })
    }
    return t('Match first %numberMatch%', { numberMatch })
  }

  return (
    <Flex flexDirection="column">
      {isLoading ? (
        <Skeleton mb="4px" mt="8px" height={16} width={80} />
      ) : (
        <Text bold color={isBurn ? 'failure' : 'secondary'}>
          {getRewardText()}
        </Text>
      )}
      <>
        {isLoading || xaloAmount.isNaN() ? (
          <Skeleton my="4px" mr="10px" height={20} width={110} />
        ) : (
          <Balance fontSize="20px" bold unit=" XALO" value={getBalanceNumber(xaloAmount)} decimals={0} />
        )}
        {isLoading || xaloAmount.isNaN() ? (
          <>
            <Skeleton mt="4px" mb="16px" height={12} width={70} />
          </>
        ) : (
          <Balance
            fontSize="12px"
            color="textSubtle"
            prefix="~$"
            value={getBalanceNumber(xaloAmount.times(xaloPriceBusd))}
            decimals={0}
          />
        )}
        {isHistoricRound && xaloAmount && (
          <>
            {numberWinners !== '0' && (
              <Text fontSize="12px" color="textSubtle">
                {getFullDisplayBalance(xaloAmount.div(parseInt(numberWinners, 10)), 18, 2)} XALO {t('each')}
              </Text>
            )}
            <Text fontSize="12px" color="textSubtle">
              {numberWinners} {t('Winning Tickets')}
            </Text>
          </>
        )}
      </>
    </Flex>
  )
}

export default RewardBracketDetail
