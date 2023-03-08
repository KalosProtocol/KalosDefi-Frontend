import { Flex, Text, IconButton, AddIcon, MinusIcon, useModal, Skeleton, Box } from '@pancakeswap/uikit'
import BigNumber from 'bignumber.js'
import { getBalanceNumber } from 'utils/formatBalance'
import { DeserializedPool, VaultKey } from 'state/types'
import { usePriceXaloBusd } from 'state/farms/hooks'
import { useVaultPoolByKey } from 'state/pools/hooks'
import Balance from 'components/Balance'
import NotEnoughTokensModal from '../../PoolCard/Modals/NotEnoughTokensModal'
import VaultStakeModal from '../VaultStakeModal'
import ConvertToLock from '../../LockedPool/Common/ConvertToLock'

interface HasStakeActionProps {
  pool: DeserializedPool
  stakingTokenBalance: BigNumber
  performanceFee: number
}

const HasSharesActions: React.FC<HasStakeActionProps> = ({ pool, stakingTokenBalance, performanceFee }) => {
  const {
    userData: {
      balance: { xaloAsBigNumber, xaloAsNumberBalance },
    },
  } = useVaultPoolByKey(pool.vaultKey)

  const { stakingToken } = pool

  const xaloPriceBusd = usePriceXaloBusd()
  const stakedDollarValue = xaloPriceBusd.gt(0)
    ? getBalanceNumber(xaloAsBigNumber.multipliedBy(xaloPriceBusd), stakingToken.decimals)
    : 0

  const [onPresentTokenRequired] = useModal(<NotEnoughTokensModal tokenSymbol={stakingToken.symbol} />)
  const [onPresentStake] = useModal(
    <VaultStakeModal stakingMax={stakingTokenBalance} performanceFee={performanceFee} pool={pool} />,
  )
  const [onPresentUnstake] = useModal(
    <VaultStakeModal stakingMax={xaloAsBigNumber} pool={pool} isRemovingStake />,
    true,
    true,
    'withdraw-vault',
  )

  return (
    <>
      <Flex mb="16px" justifyContent="space-between" alignItems="center">
        <Flex flexDirection="column">
          <Balance fontSize="20px" bold value={xaloAsNumberBalance} decimals={5} />
          <Text as={Flex} fontSize="12px" color="textSubtle" flexWrap="wrap">
            {xaloPriceBusd.gt(0) ? (
              <Balance
                value={stakedDollarValue}
                fontSize="12px"
                color="textSubtle"
                decimals={2}
                prefix="~"
                unit=" USD"
              />
            ) : (
              <Skeleton mt="1px" height={16} width={64} />
            )}
          </Text>
        </Flex>
        <Flex>
          <IconButton variant="secondary" onClick={onPresentUnstake} mr="6px">
            <MinusIcon color="primary" width="24px" />
          </IconButton>
          <IconButton variant="secondary" onClick={stakingTokenBalance.gt(0) ? onPresentStake : onPresentTokenRequired}>
            <AddIcon color="primary" width="24px" height="24px" />
          </IconButton>
        </Flex>
      </Flex>
      {pool.vaultKey === VaultKey.XaloVault && (
        <Box mb="16px">
          <ConvertToLock stakingToken={stakingToken} currentStakedAmount={xaloAsNumberBalance} />
        </Box>
      )}
    </>
  )
}

export default HasSharesActions
