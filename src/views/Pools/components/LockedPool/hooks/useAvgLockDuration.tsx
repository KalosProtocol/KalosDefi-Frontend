import { useMemo } from 'react'
import { BOOST_WEIGHT, DURATION_FACTOR } from 'config/constants/pools'
import BigNumber from 'bignumber.js'
import _toNumber from 'lodash/toNumber'
import { useXaloVault } from 'state/pools/hooks'
import { getFullDecimalMultiplier } from 'utils/getFullDecimalMultiplier'

import formatSecondsToWeeks from '../../utils/formatSecondsToWeeks'

export default function useAvgLockDuration() {
  const { totalLockedAmount, totalShares, totalXaloInVault, pricePerFullShare } = useXaloVault()

  const avgLockDurationsInSeconds = useMemo(() => {
    const flexibleXaloAmount = totalXaloInVault.minus(totalLockedAmount)
    const flexibleXaloShares = flexibleXaloAmount.div(pricePerFullShare).times(getFullDecimalMultiplier(18))
    const lockedXaloBoostedShares = totalShares.minus(flexibleXaloShares)
    const lockedXaloOriginalShares = totalLockedAmount.div(pricePerFullShare).times(getFullDecimalMultiplier(18))
    const avgBoostRatio = lockedXaloBoostedShares.div(lockedXaloOriginalShares)

    return avgBoostRatio
      .minus(1)
      .times(new BigNumber(DURATION_FACTOR.toString()))
      .div(new BigNumber(BOOST_WEIGHT.toString()).div(getFullDecimalMultiplier(12)))
      .toFixed(0)
  }, [totalXaloInVault, totalLockedAmount, pricePerFullShare, totalShares])

  const avgLockDurationsInWeeks = useMemo(
    () => formatSecondsToWeeks(avgLockDurationsInSeconds),
    [avgLockDurationsInSeconds],
  )

  return {
    avgLockDurationsInWeeks,
    avgLockDurationsInSeconds: _toNumber(avgLockDurationsInSeconds),
  }
}
