import BigNumber from 'bignumber.js'
import { useTranslation } from 'contexts/Localization'
import { getBalanceAmount } from 'utils/formatBalance'

import { useMemo } from 'react'

export const useUserEnoughXaloValidator = (xaloAmount: string, stakingTokenBalance: BigNumber) => {
  const { t } = useTranslation()
  const errorMessage = t('Insufficient XALO balance')

  const userNotEnoughXalo = useMemo(() => {
    if (new BigNumber(xaloAmount).gt(getBalanceAmount(stakingTokenBalance, 18))) return true
    return false
  }, [xaloAmount, stakingTokenBalance])
  return { userNotEnoughXalo, notEnoughErrorMessage: errorMessage }
}
