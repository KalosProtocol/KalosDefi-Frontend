import { useMemo } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useXalo } from 'hooks/useContract'
import { useSWRContract, UseSWRContractKey } from 'hooks/useSWRContract'

// TODO: refactor as useTokenApprovalStatus for generic use

export const useXaloApprovalStatus = (spender) => {
  const { account } = useWeb3React()
  const { reader: xaloContract } = useXalo()

  const key = useMemo<UseSWRContractKey>(
    () =>
      account && spender
        ? {
            contract: xaloContract,
            methodName: 'allowance',
            params: [account, spender],
          }
        : null,
    [account, xaloContract, spender],
  )

  const { data, mutate } = useSWRContract(key)

  return { isVaultApproved: data ? data.gt(0) : false, setLastUpdated: mutate }
}

export default useXaloApprovalStatus
