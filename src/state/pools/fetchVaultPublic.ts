import BigNumber from 'bignumber.js'
import { multicallv2 } from 'utils/multicall'
import xaloVaultAbi from 'config/abi/xaloVaultV2.json'
import { getXaloVaultAddress, getXaloFlexibleSideVaultAddress } from 'utils/addressHelpers'
import { BIG_ZERO } from 'utils/bigNumber'
import { getXaloContract } from 'utils/contractHelpers'

const xaloVaultV2 = getXaloVaultAddress()
const xaloFlexibleSideVaultV2 = getXaloFlexibleSideVaultAddress()
const xaloContract = getXaloContract()
export const fetchPublicVaultData = async (xaloVaultAddress = xaloVaultV2) => {
  try {
    const calls = ['getPricePerFullShare', 'totalShares', 'totalLockedAmount'].map((method) => ({
      address: xaloVaultAddress,
      name: method,
    }))

    const [[[sharePrice], [shares], totalLockedAmount], totalXaloInVault] = await Promise.all([
      multicallv2(xaloVaultAbi, calls, {
        requireSuccess: false,
      }),
      xaloContract.balanceOf(xaloVaultV2),
    ])

    const totalSharesAsBigNumber = shares ? new BigNumber(shares.toString()) : BIG_ZERO
    const totalLockedAmountAsBigNumber = totalLockedAmount ? new BigNumber(totalLockedAmount[0].toString()) : BIG_ZERO
    const sharePriceAsBigNumber = sharePrice ? new BigNumber(sharePrice.toString()) : BIG_ZERO
    return {
      totalShares: totalSharesAsBigNumber.toJSON(),
      totalLockedAmount: totalLockedAmountAsBigNumber.toJSON(),
      pricePerFullShare: sharePriceAsBigNumber.toJSON(),
      totalXaloInVault: new BigNumber(totalXaloInVault.toString()).toJSON(),
    }
  } catch (error) {
    return {
      totalShares: null,
      totalLockedAmount: null,
      pricePerFullShare: null,
      totalXaloInVault: null,
    }
  }
}

export const fetchPublicFlexibleSideVaultData = async (xaloVaultAddress = xaloFlexibleSideVaultV2) => {
  try {
    const calls = ['getPricePerFullShare', 'totalShares'].map((method) => ({
      address: xaloVaultAddress,
      name: method,
    }))

    const [[[sharePrice], [shares]], totalXaloInVault] = await Promise.all([
      multicallv2(xaloVaultAbi, calls, {
        requireSuccess: false,
      }),
      xaloContract.balanceOf(xaloVaultAddress),
    ])

    const totalSharesAsBigNumber = shares ? new BigNumber(shares.toString()) : BIG_ZERO
    const sharePriceAsBigNumber = sharePrice ? new BigNumber(sharePrice.toString()) : BIG_ZERO
    return {
      totalShares: totalSharesAsBigNumber.toJSON(),
      pricePerFullShare: sharePriceAsBigNumber.toJSON(),
      totalXaloInVault: new BigNumber(totalXaloInVault.toString()).toJSON(),
    }
  } catch (error) {
    return {
      totalShares: null,
      pricePerFullShare: null,
      totalXaloInVault: null,
    }
  }
}

export const fetchVaultFees = async (xaloVaultAddress = xaloVaultV2) => {
  try {
    const calls = ['performanceFee', 'withdrawFee', 'withdrawFeePeriod'].map((method) => ({
      address: xaloVaultAddress,
      name: method,
    }))

    const [[performanceFee], [withdrawalFee], [withdrawalFeePeriod]] = await multicallv2(xaloVaultAbi, calls)

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

export default fetchPublicVaultData
