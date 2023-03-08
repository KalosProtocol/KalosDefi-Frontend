import { useEffect, useState } from 'react'
import { BigNumber } from '@ethersproject/bignumber'
import { Zero } from '@ethersproject/constants'
import { useTranslation } from 'contexts/Localization'
import { multicallv2 } from 'utils/multicall'
import profileABI from 'config/abi/pancakeProfile.json'
import { getPancakeProfileAddress } from 'utils/addressHelpers'
import useToast from 'hooks/useToast'

const useGetProfileCosts = () => {
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(true)
  const [costs, setCosts] = useState({
    numberXaloToReactivate: Zero,
    numberXaloToRegister: Zero,
    numberXaloToUpdate: Zero,
  })
  const { toastError } = useToast()

  useEffect(() => {
    const fetchCosts = async () => {
      try {
        const calls = ['numberXaloToReactivate', 'numberXaloToRegister', 'numberXaloToUpdate'].map((method) => ({
          address: getPancakeProfileAddress(),
          name: method,
        }))
        const [[numberXaloToReactivate], [numberXaloToRegister], [numberXaloToUpdate]] = await multicallv2<
          [[BigNumber], [BigNumber], [BigNumber]]
        >(profileABI, calls)

        setCosts({
          numberXaloToReactivate,
          numberXaloToRegister,
          numberXaloToUpdate,
        })
        setIsLoading(false)
      } catch (error) {
        toastError(t('Error'), t('Could not retrieve XALO costs for profile'))
      }
    }

    fetchCosts()
  }, [setCosts, toastError, t])

  return { costs, isLoading }
}

export default useGetProfileCosts
