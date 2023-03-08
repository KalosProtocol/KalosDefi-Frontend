import BigNumber from 'bignumber.js'
import { convertSharesToXalo } from 'views/Pools/helpers'
import { multicallv2 } from 'utils/multicall'
import ifoPoolAbi from 'config/abi/ifoPool.json'
import { BIG_ZERO } from 'utils/bigNumber'

export const fetchPublicIfoPoolData = async (ifoPoolAddress: string) => {
  try {
    const calls = ['getPricePerFullShare', 'totalShares', 'startBlock', 'endBlock'].map((method) => ({
      address: ifoPoolAddress,
      name: method,
    }))

    const [[sharePrice], [shares], [startBlock], [endBlock]] = await multicallv2(ifoPoolAbi, calls)

    const totalSharesAsBigNumber = shares ? new BigNumber(shares.toString()) : BIG_ZERO
    const sharePriceAsBigNumber = sharePrice ? new BigNumber(sharePrice.toString()) : BIG_ZERO
    const totalXaloInVaultEstimate = convertSharesToXalo(totalSharesAsBigNumber, sharePriceAsBigNumber)
    return {
      totalShares: totalSharesAsBigNumber.toJSON(),
      pricePerFullShare: sharePriceAsBigNumber.toJSON(),
      totalXaloInVault: totalXaloInVaultEstimate.xaloAsBigNumber.toJSON(),
      creditStartBlock: startBlock.toNumber(),
      creditEndBlock: endBlock.toNumber(),
    }
  } catch (error) {
    return {
      totalShares: null,
      pricePerFullShare: null,
      totalXaloInVault: null,
    }
  }
}

export const fetchIfoPoolFeesData = async (ifoPoolAddress: string) => {
  try {
    const calls = ['performanceFee', 'withdrawFee', 'withdrawFeePeriod'].map((method) => ({
      address: ifoPoolAddress,
      name: method,
    }))

    const [[performanceFee], [withdrawalFee], [withdrawalFeePeriod]] = await multicallv2(ifoPoolAbi, calls)

    return {
      performanceFee: performanceFee.toNumber(),
      withdrawalFee: withdrawalFee.toNumber(),
      withdrawalFeePeriod: withdrawalFeePeriod.toNumber(),
    }
  } catch (error) {
    return {
      performanceFee: null,
      withdrawalFee: null,
      withdrawalFeePeriod: null,
    }
  }
}

export default fetchPublicIfoPoolData
