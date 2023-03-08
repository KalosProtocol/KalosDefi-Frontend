import { Text } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { differenceInHours } from 'date-fns'
import { useVaultPoolByKey } from 'state/pools/hooks'
import { DeserializedPool, VaultKey, DeserializedLockedVaultUser } from 'state/types'
import { getXaloVaultEarnings } from '../helpers'

interface AutoEarningsBreakdownProps {
  pool: DeserializedPool
  account: string
}

const AutoEarningsBreakdown: React.FC<AutoEarningsBreakdownProps> = ({ pool, account }) => {
  const { t } = useTranslation()

  const { earningTokenPrice } = pool
  const { pricePerFullShare, userData } = useVaultPoolByKey(pool.vaultKey)
  const { autoXaloToDisplay, autoUsdToDisplay } = getXaloVaultEarnings(
    account,
    userData.xaloAtLastUserAction,
    userData.userShares,
    pricePerFullShare,
    earningTokenPrice,
    pool.vaultKey === VaultKey.XaloVault
      ? (userData as DeserializedLockedVaultUser).currentPerformanceFee
          .plus((userData as DeserializedLockedVaultUser).currentOverdueFee)
          .plus((userData as DeserializedLockedVaultUser).userBoostedShare)
      : null,
  )

  const lastActionInMs = userData.lastUserActionTime ? parseInt(userData.lastUserActionTime) * 1000 : 0
  const hourDiffSinceLastAction = differenceInHours(Date.now(), lastActionInMs)
  const earnedXaloPerHour = hourDiffSinceLastAction ? autoXaloToDisplay / hourDiffSinceLastAction : 0
  const earnedUsdPerHour = hourDiffSinceLastAction ? autoUsdToDisplay / hourDiffSinceLastAction : 0

  return (
    <>
      <Text bold>
        {autoXaloToDisplay.toFixed(3)}
        {' XALO'}
      </Text>
      <Text bold>~${autoUsdToDisplay.toFixed(2)}</Text>
      <Text>{t('Earned since your last action')}:</Text>
      <Text>{new Date(lastActionInMs).toLocaleString()}</Text>
      {hourDiffSinceLastAction ? (
        <>
          <Text>{t('Your average per hour')}:</Text>
          <Text bold>{t('XALO per hour: %amount%', { amount: earnedXaloPerHour.toFixed(2) })}</Text>
          <Text bold>{t('per hour: ~$%amount%', { amount: earnedUsdPerHour.toFixed(2) })}</Text>
        </>
      ) : null}
    </>
  )
}

export default AutoEarningsBreakdown
