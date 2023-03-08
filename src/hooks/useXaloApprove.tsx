import { MaxUint256 } from '@ethersproject/constants'
import { useTranslation } from 'contexts/Localization'
import { useXalo } from 'hooks/useContract'
import useToast from 'hooks/useToast'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import useCatchTxError from 'hooks/useCatchTxError'
import { ToastDescriptionWithTx } from 'components/Toast'

const useXaloApprove = (setLastUpdated: () => void, spender, successMsg) => {
  const { t } = useTranslation()
  const { toastSuccess } = useToast()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const { callWithGasPrice } = useCallWithGasPrice()
  const { signer: xaloContract } = useXalo()

  const handleApprove = async () => {
    const receipt = await fetchWithCatchTxError(() => {
      return callWithGasPrice(xaloContract, 'approve', [spender, MaxUint256])
    })
    if (receipt?.status) {
      toastSuccess(
        t('Contract Enabled'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>{successMsg}</ToastDescriptionWithTx>,
      )
      setLastUpdated()
    }
  }

  return { handleApprove, pendingTx }
}

export default useXaloApprove
