import BigNumber from 'bignumber.js'
import { vaultPoolConfig } from 'config/constants/pools'
import { DeserializedPool } from 'state/types'
import { BIG_ZERO } from 'utils/bigNumber'
import { getApy } from 'utils/compoundApyHelpers'
import { getBalanceNumber, getFullDisplayBalance, getDecimalAmount } from 'utils/formatBalance'
import memoize from 'lodash/memoize'

export const convertSharesToXalo = (
  shares: BigNumber,
  xaloPerFullShare: BigNumber,
  decimals = 18,
  decimalsToRound = 3,
  fee?: BigNumber,
) => {
  const sharePriceNumber = getBalanceNumber(xaloPerFullShare, decimals)
  const amountInXalo = new BigNumber(shares.multipliedBy(sharePriceNumber)).minus(fee || BIG_ZERO)
  const xaloAsNumberBalance = getBalanceNumber(amountInXalo, decimals)
  const xaloAsBigNumber = getDecimalAmount(new BigNumber(xaloAsNumberBalance), decimals)
  const xaloAsDisplayBalance = getFullDisplayBalance(amountInXalo, decimals, decimalsToRound)
  return { xaloAsNumberBalance, xaloAsBigNumber, xaloAsDisplayBalance }
}

export const convertXaloToShares = (
  xalo: BigNumber,
  xaloPerFullShare: BigNumber,
  decimals = 18,
  decimalsToRound = 3,
) => {
  const sharePriceNumber = getBalanceNumber(xaloPerFullShare, decimals)
  const amountInShares = new BigNumber(xalo.dividedBy(sharePriceNumber))
  const sharesAsNumberBalance = getBalanceNumber(amountInShares, decimals)
  const sharesAsBigNumber = getDecimalAmount(new BigNumber(sharesAsNumberBalance), decimals)
  const sharesAsDisplayBalance = getFullDisplayBalance(amountInShares, decimals, decimalsToRound)
  return { sharesAsNumberBalance, sharesAsBigNumber, sharesAsDisplayBalance }
}

const MANUAL_POOL_AUTO_COMPOUND_FREQUENCY = 0

export const getAprData = (pool: DeserializedPool, performanceFee: number) => {
  const { vaultKey, apr } = pool

  //   Estimate & manual for now. 288 = once every 5 mins. We can change once we have a better sense of this
  const autoCompoundFrequency = vaultKey
    ? vaultPoolConfig[vaultKey].autoCompoundFrequency
    : MANUAL_POOL_AUTO_COMPOUND_FREQUENCY

  if (vaultKey) {
    const autoApr = getApy(apr, autoCompoundFrequency, 365, performanceFee) * 100
    return { apr: autoApr, autoCompoundFrequency }
  }
  return { apr, autoCompoundFrequency }
}

export const getXaloVaultEarnings = (
  account: string,
  xaloAtLastUserAction: BigNumber,
  userShares: BigNumber,
  pricePerFullShare: BigNumber,
  earningTokenPrice: number,
  fee?: BigNumber,
) => {
  const hasAutoEarnings = account && xaloAtLastUserAction?.gt(0) && userShares?.gt(0)
  const { xaloAsBigNumber } = convertSharesToXalo(userShares, pricePerFullShare)
  const autoXaloProfit = xaloAsBigNumber.minus(fee || BIG_ZERO).minus(xaloAtLastUserAction)
  const autoXaloToDisplay = autoXaloProfit.gte(0) ? getBalanceNumber(autoXaloProfit, 18) : 0

  const autoUsdProfit = autoXaloProfit.times(earningTokenPrice)
  const autoUsdToDisplay = autoUsdProfit.gte(0) ? getBalanceNumber(autoUsdProfit, 18) : 0
  return { hasAutoEarnings, autoXaloToDisplay, autoUsdToDisplay }
}

export const getPoolBlockInfo = memoize(
  (pool: DeserializedPool, currentBlock: number) => {
    const { startBlock, endBlock, isFinished } = pool
    const shouldShowBlockCountdown = Boolean(!isFinished && startBlock && endBlock)
    const blocksUntilStart = Math.max(startBlock - currentBlock, 0)
    const blocksRemaining = Math.max(endBlock - currentBlock, 0)
    const hasPoolStarted = blocksUntilStart === 0 && blocksRemaining > 0
    const blocksToDisplay = hasPoolStarted ? blocksRemaining : blocksUntilStart
    return { shouldShowBlockCountdown, blocksUntilStart, blocksRemaining, hasPoolStarted, blocksToDisplay }
  },
  (pool, currentBlock) => `${pool.startBlock}#${pool.endBlock}#${pool.isFinished}#${currentBlock}`,
)

export const getIXaloWeekDisplay = (ceiling: BigNumber) => {
  const weeks = new BigNumber(ceiling).div(60).div(60).div(24).div(7)
  return Math.round(weeks.toNumber())
}
