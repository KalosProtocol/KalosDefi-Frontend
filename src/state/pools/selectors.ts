import BigNumber from 'bignumber.js'
import { BIG_ZERO } from 'utils/bigNumber'
import { createSelector } from '@reduxjs/toolkit'
import { State, VaultKey } from '../types'
import { transformPool, transformVault } from './helpers'
import { initialPoolVaultState } from './index'
import { getVaultPosition, VaultPosition } from '../../utils/xaloPool'

const selectPoolsData = (state: State) => state.pools.data
const selectPoolData = (sousId) => (state: State) => state.pools.data.find((p) => p.sousId === sousId)
const selectUserDataLoaded = (state: State) => state.pools.userDataLoaded
const selectVault = (key: VaultKey) => (state: State) => key ? state.pools[key] : initialPoolVaultState
const selectIfo = (state: State) => state.pools.ifo
const selectIfoUserCredit = (state: State) => state.pools.ifo.credit ?? BIG_ZERO

export const makePoolWithUserDataLoadingSelector = (sousId) =>
  createSelector([selectPoolData(sousId), selectUserDataLoaded], (pool, userDataLoaded) => {
    return { pool: transformPool(pool), userDataLoaded }
  })

export const poolsWithUserDataLoadingSelector = createSelector(
  [selectPoolsData, selectUserDataLoaded],
  (pools, userDataLoaded) => {
    return { pools: pools.map(transformPool), userDataLoaded }
  },
)

export const makeVaultPoolByKey = (key) => createSelector([selectVault(key)], (vault) => transformVault(key, vault))

export const poolsWithVaultSelector = createSelector(
  [
    poolsWithUserDataLoadingSelector,
    makeVaultPoolByKey(VaultKey.XaloVault),
    makeVaultPoolByKey(VaultKey.XaloFlexibleSideVault),
  ],
  (poolsWithUserDataLoading, deserializedLockedXaloVault, deserializedFlexibleSideXaloVault) => {
    const { pools, userDataLoaded } = poolsWithUserDataLoading
    const xaloPool = pools.find((pool) => !pool.isFinished && pool.sousId === 0)
    const withoutXaloPool = pools.filter((pool) => pool.sousId !== 0)

    const xaloAutoVault = {
      ...xaloPool,
      ...deserializedLockedXaloVault,
      vaultKey: VaultKey.XaloVault,
      userData: { ...xaloPool.userData, ...deserializedLockedXaloVault.userData },
    }

    const lockedVaultPosition = getVaultPosition(deserializedLockedXaloVault.userData)
    const hasFlexibleSideSharesStaked = deserializedFlexibleSideXaloVault.userData.userShares.gt(0)

    const xaloAutoFlexibleSideVault =
      lockedVaultPosition > VaultPosition.Flexible || hasFlexibleSideSharesStaked
        ? [
            {
              ...xaloPool,
              ...deserializedFlexibleSideXaloVault,
              vaultKey: VaultKey.XaloFlexibleSideVault,
              userData: { ...xaloPool.userData, ...deserializedFlexibleSideXaloVault.userData },
            },
          ]
        : []

    return { pools: [xaloAutoVault, ...xaloAutoFlexibleSideVault, ...withoutXaloPool], userDataLoaded }
  },
)

export const makeVaultPoolWithKeySelector = (vaultKey) =>
  createSelector(poolsWithVaultSelector, ({ pools }) => pools.find((p) => p.vaultKey === vaultKey))

export const ifoCreditSelector = createSelector([selectIfoUserCredit], (ifoUserCredit) => {
  return new BigNumber(ifoUserCredit)
})

export const ifoCeilingSelector = createSelector([selectIfo], (ifoData) => {
  return new BigNumber(ifoData.ceiling)
})
