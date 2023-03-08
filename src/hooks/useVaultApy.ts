import { BigNumber, FixedNumber } from '@ethersproject/bignumber'
import { WeiPerEther } from '@ethersproject/constants'
import _toString from 'lodash/toString'
import { BLOCKS_PER_YEAR } from 'config'
import masterChefAbi from 'config/abi/masterchef.json'
import { useCallback, useMemo } from 'react'
import { useXaloVault } from 'state/pools/hooks'
import useSWRImmutable from 'swr/immutable'
import { getMasterChefAddress } from 'utils/addressHelpers'
import { BIG_ZERO } from 'utils/bigNumber'
import { BOOST_WEIGHT, DURATION_FACTOR, MAX_LOCK_DURATION } from 'config/constants/pools'
import { multicallv2 } from '../utils/multicall'

const masterChefAddress = getMasterChefAddress()

// default
const DEFAULT_PERFORMANCE_FEE_DECIMALS = 2

const PRECISION_FACTOR = BigNumber.from('1000000000000')

const getFlexibleApy = (
  totalXaloPoolEmissionPerYear: FixedNumber,
  pricePerFullShare: FixedNumber,
  totalShares: FixedNumber,
) =>
  totalXaloPoolEmissionPerYear
    .mulUnsafe(FixedNumber.from(WeiPerEther))
    .divUnsafe(pricePerFullShare)
    .divUnsafe(totalShares)
    .mulUnsafe(FixedNumber.from(100))

const _getBoostFactor = (boostWeight: BigNumber, duration: number, durationFactor: BigNumber) => {
  return FixedNumber.from(boostWeight)
    .mulUnsafe(FixedNumber.from(Math.max(duration, 0)))
    .divUnsafe(FixedNumber.from(durationFactor))
    .divUnsafe(FixedNumber.from(PRECISION_FACTOR))
}

const getLockedApy = (flexibleApy: string, boostFactor: FixedNumber) =>
  FixedNumber.from(flexibleApy).mulUnsafe(boostFactor.addUnsafe(FixedNumber.from('1')))

const xaloPoolPID = 0

export function useVaultApy({ duration = MAX_LOCK_DURATION }: { duration?: number } = {}) {
  const {
    totalShares = BIG_ZERO,
    pricePerFullShare = BIG_ZERO,
    fees: { performanceFeeAsDecimal } = { performanceFeeAsDecimal: DEFAULT_PERFORMANCE_FEE_DECIMALS },
  } = useXaloVault()

  const totalSharesAsEtherBN = useMemo(() => FixedNumber.from(totalShares.toString()), [totalShares])
  const pricePerFullShareAsEtherBN = useMemo(() => FixedNumber.from(pricePerFullShare.toString()), [pricePerFullShare])

  const { data: totalXaloPoolEmissionPerYear } = useSWRImmutable('masterChef-total-xalo-pool-emission', async () => {
    const calls = [
      {
        address: masterChefAddress,
        name: 'xaloPerBlock',
        params: [false],
      },
      {
        address: masterChefAddress,
        name: 'poolInfo',
        params: [xaloPoolPID],
      },
      {
        address: masterChefAddress,
        name: 'totalSpecialAllocPoint',
      },
    ]

    const [[specialFarmsPerBlock], xaloPoolInfo, [totalSpecialAllocPoint]] = await multicallv2(masterChefAbi, calls)

    const xaloPoolSharesInSpecialFarms = FixedNumber.from(xaloPoolInfo.allocPoint).divUnsafe(
      FixedNumber.from(totalSpecialAllocPoint),
    )
    return FixedNumber.from(specialFarmsPerBlock)
      .mulUnsafe(FixedNumber.from(BLOCKS_PER_YEAR))
      .mulUnsafe(xaloPoolSharesInSpecialFarms)
  })

  const flexibleApy = useMemo(
    () =>
      totalXaloPoolEmissionPerYear &&
      !pricePerFullShareAsEtherBN.isZero() &&
      !totalSharesAsEtherBN.isZero() &&
      getFlexibleApy(totalXaloPoolEmissionPerYear, pricePerFullShareAsEtherBN, totalSharesAsEtherBN).toString(),
    [pricePerFullShareAsEtherBN, totalXaloPoolEmissionPerYear, totalSharesAsEtherBN],
  )

  const boostFactor = useMemo(() => _getBoostFactor(BOOST_WEIGHT, duration, DURATION_FACTOR), [duration])

  const lockedApy = useMemo(() => {
    return flexibleApy && getLockedApy(flexibleApy, boostFactor).toString()
  }, [boostFactor, flexibleApy])

  const getBoostFactor = useCallback(
    (adjustDuration: number) => _getBoostFactor(BOOST_WEIGHT, adjustDuration, DURATION_FACTOR),
    [],
  )

  const flexibleApyNoFee = useMemo(() => {
    if (flexibleApy && performanceFeeAsDecimal) {
      const rewardPercentageNoFee = _toString(1 - performanceFeeAsDecimal / 100)

      return FixedNumber.from(flexibleApy).mulUnsafe(FixedNumber.from(rewardPercentageNoFee)).toString()
    }

    return flexibleApy
  }, [flexibleApy, performanceFeeAsDecimal])

  return {
    flexibleApy: flexibleApyNoFee,
    lockedApy,
    getLockedApy: useCallback(
      (adjustDuration: number) => flexibleApy && getLockedApy(flexibleApy, getBoostFactor(adjustDuration)).toString(),
      [flexibleApy, getBoostFactor],
    ),
    boostFactor: useMemo(() => boostFactor.addUnsafe(FixedNumber.from('1')), [boostFactor]),
    getBoostFactor: useCallback(
      (adjustDuration: number) => getBoostFactor(adjustDuration).addUnsafe(FixedNumber.from('1')),
      [getBoostFactor],
    ),
  }
}
