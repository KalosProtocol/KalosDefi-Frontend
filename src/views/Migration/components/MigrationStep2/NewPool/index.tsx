import React, { useEffect, useMemo } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useXaloVault, usePoolsWithVault } from 'state/pools/hooks'
import { useFastRefreshEffect } from 'hooks/useRefreshEffect'
import { useAppDispatch } from 'state'
import {
  fetchXaloPoolUserDataAsync,
  fetchXaloVaultFees,
  fetchXaloVaultPublicData,
  fetchXaloVaultUserData,
  fetchXaloPoolPublicDataAsync,
  fetchXaloFlexibleSideVaultPublicData,
  fetchXaloFlexibleSideVaultUserData,
  fetchXaloFlexibleSideVaultFees,
} from 'state/pools'
import { batch } from 'react-redux'
import PoolsTable from './PoolTable'

const NewPool: React.FC = () => {
  const { account } = useWeb3React()
  const { pools } = usePoolsWithVault()
  const xaloVault = useXaloVault()

  const stakedOnlyOpenPools = useMemo(
    () => pools.filter((pool) => pool.userData && pool.sousId === 0 && !pool.isFinished),
    [pools],
  )

  const userDataReady: boolean = !account || (!!account && !xaloVault.userData?.isLoading)

  const dispatch = useAppDispatch()

  useFastRefreshEffect(() => {
    batch(() => {
      dispatch(fetchXaloVaultPublicData())
      dispatch(fetchXaloFlexibleSideVaultPublicData())
      dispatch(fetchXaloPoolPublicDataAsync())
      if (account) {
        dispatch(fetchXaloVaultUserData({ account }))
        dispatch(fetchXaloFlexibleSideVaultUserData({ account }))
        dispatch(fetchXaloPoolUserDataAsync(account))
      }
    })
  }, [account, dispatch])

  useEffect(() => {
    batch(() => {
      dispatch(fetchXaloVaultFees())
      dispatch(fetchXaloFlexibleSideVaultFees())
    })
  }, [dispatch])

  return <PoolsTable pools={stakedOnlyOpenPools} account={account} userDataReady={userDataReady} />
}

export default NewPool
