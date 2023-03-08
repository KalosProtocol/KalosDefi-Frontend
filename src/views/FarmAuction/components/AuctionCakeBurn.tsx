import { useState, useEffect } from 'react'
import { Text, Flex, Skeleton, Image } from '@pancakeswap/uikit'
import { useFarmAuctionContract } from 'hooks/useContract'
import useIntersectionObserver from 'hooks/useIntersectionObserver'
import { useTranslation } from 'contexts/Localization'
import { usePriceXaloBusd } from 'state/farms/hooks'
import { getBalanceNumber } from 'utils/formatBalance'
import { ethersToBigNumber } from 'utils/bigNumber'
import Balance from 'components/Balance'
import styled from 'styled-components'

const BurnedText = styled(Text)`
  font-size: 52px;

  ${({ theme }) => theme.mediaQueries.sm} {
    font-size: 64px;
  }
`

const AuctionXaloBurn: React.FC = () => {
  const [burnedXaloAmount, setBurnedXaloAmount] = useState(0)
  const { t } = useTranslation()
  const farmAuctionContract = useFarmAuctionContract(false)
  const { observerRef, isIntersecting } = useIntersectionObserver()
  const xaloPriceBusd = usePriceXaloBusd()

  const burnedAmountAsUSD = xaloPriceBusd.times(burnedXaloAmount)

  useEffect(() => {
    const fetchBurnedXaloAmount = async () => {
      try {
        const amount = await farmAuctionContract.totalCollected()
        const amountAsBN = ethersToBigNumber(amount)
        setBurnedXaloAmount(getBalanceNumber(amountAsBN))
      } catch (error) {
        console.error('Failed to fetch burned auction xalo', error)
      }
    }
    if (isIntersecting && burnedXaloAmount === 0) {
      fetchBurnedXaloAmount()
    }
  }, [isIntersecting, burnedXaloAmount, farmAuctionContract])
  return (
    <Flex flexDirection={['column-reverse', null, 'row']}>
      <Flex flexDirection="column" flex="2" ref={observerRef}>
        {burnedXaloAmount !== 0 ? (
          <Balance fontSize="64px" bold value={burnedXaloAmount} decimals={0} unit=" XALO" />
        ) : (
          <Skeleton width="256px" height="64px" />
        )}
        <BurnedText textTransform="uppercase" bold color="secondary">
          {t('Burned')}
        </BurnedText>
        <Text fontSize="24px" bold>
          {t('through community auctions so far!')}
        </Text>
        {!burnedAmountAsUSD.isNaN() && !burnedAmountAsUSD.isZero() ? (
          <Text color="textSubtle">
            ~${burnedAmountAsUSD.toNumber().toLocaleString('en', { maximumFractionDigits: 0 })}
          </Text>
        ) : (
          <Skeleton width="128px" />
        )}
      </Flex>
      <Image width={350} height={320} src="/images/burnt-cake.png" alt={t('Burnt XALO')} />
    </Flex>
  )
}

export default AuctionXaloBurn
