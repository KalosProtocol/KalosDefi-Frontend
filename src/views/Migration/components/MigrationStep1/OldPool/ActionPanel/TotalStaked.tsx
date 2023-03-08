import React, { useMemo } from 'react'
import { Flex, Text } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import BigNumber from 'bignumber.js'
import Balance from 'components/Balance'
import { DeserializedPool } from 'state/types'
import { getBalanceNumber } from 'utils/formatBalance'

const Containter = styled(Flex)`
  margin-top: 12px;
  padding: 0;

  ${({ theme }) => theme.mediaQueries.sm} {
    margin-top: 0px;
    padding: 0 12px;
  }
`

interface TotalStakedProps {
  pool: DeserializedPool
  totalXaloInVault: BigNumber
  xaloInVaults: BigNumber
}

const TotalStaked: React.FC<TotalStakedProps> = ({ pool, totalXaloInVault, xaloInVaults }) => {
  const { t } = useTranslation()
  const { sousId, stakingToken, totalStaked, vaultKey } = pool

  const isManualCakePool = sousId === 0

  const totalStakedBalance = useMemo(() => {
    if (vaultKey) {
      return getBalanceNumber(totalXaloInVault, stakingToken.decimals)
    }
    if (isManualCakePool) {
      const manualCakeTotalMinusAutoVault = new BigNumber(totalStaked).minus(xaloInVaults)
      return getBalanceNumber(manualCakeTotalMinusAutoVault, stakingToken.decimals)
    }
    return getBalanceNumber(totalStaked, stakingToken.decimals)
  }, [vaultKey, totalXaloInVault, isManualCakePool, totalStaked, stakingToken.decimals, xaloInVaults])

  return (
    <Containter justifyContent="space-between">
      <Text>{t('Total staked')}</Text>
      <Flex height="20px" alignItems="center">
        <Balance fontSize="16px" value={totalStakedBalance} decimals={0} unit={` ${stakingToken.symbol}`} />
      </Flex>
    </Containter>
  )
}

export default TotalStaked
