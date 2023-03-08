import BigNumber from 'bignumber.js'
import { BLOCKS_PER_YEAR } from 'config'
import lpAprs from 'config/constants/lpAprs.json'

/**
 * Get the APR value in %
 * @param stakingTokenPrice Token price in the same quote currency
 * @param rewardTokenPrice Token price in the same quote currency
 * @param totalStaked Total amount of stakingToken in the pool
 * @param tokenPerBlock Amount of new cake allocated to the pool for each new block
 * @returns Null if the APR is NaN or infinite.
 */
export const getPoolApr = (
  stakingTokenPrice: number,
  rewardTokenPrice: number,
  totalStaked: number,
  tokenPerBlock: number,
): number => {
  const totalRewardPricePerYear = new BigNumber(rewardTokenPrice).times(tokenPerBlock).times(BLOCKS_PER_YEAR)
  const totalStakingTokenInPool = new BigNumber(stakingTokenPrice).times(totalStaked)
  const apr = totalRewardPricePerYear.div(totalStakingTokenInPool).times(100)
  return apr.isNaN() || !apr.isFinite() ? null : apr.toNumber()
}

/**
 * Get farm APR value in %
 * @param poolWeight allocationPoint / totalAllocationPoint
 * @param xaloPriceUsd Xalo price in USD
 * @param poolLiquidityUsd Total pool liquidity in USD
 * @param farmAddress Farm Address
 * @returns Farm Apr
 */
export const getFarmApr = (
  poolWeight: BigNumber,
  xaloPriceUsd: BigNumber,
  poolLiquidityUsd: BigNumber,
  farmAddress: string,
  regularXaloPerBlock: number,
): { xaloRewardsApr: number; lpRewardsApr: number } => {
  const yearlyXaloRewardAllocation = poolWeight
    ? poolWeight.times(BLOCKS_PER_YEAR * regularXaloPerBlock)
    : new BigNumber(NaN)
  const xaloRewardsApr = yearlyXaloRewardAllocation.times(xaloPriceUsd).div(poolLiquidityUsd).times(100)
  let xaloRewardsAprAsNumber = null
  if (!xaloRewardsApr.isNaN() && xaloRewardsApr.isFinite()) {
    xaloRewardsAprAsNumber = xaloRewardsApr.toNumber()
  }
  const lpRewardsApr = lpAprs[farmAddress?.toLocaleLowerCase()] ?? 0
  return { xaloRewardsApr: xaloRewardsAprAsNumber, lpRewardsApr }
}

export default null
