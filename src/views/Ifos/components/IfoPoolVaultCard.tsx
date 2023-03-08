import { useMemo } from 'react'
import { Flex, useMatchBreakpointsContext } from '@pancakeswap/uikit'
import CakeVaultCard from 'views/Pools/components/CakeVaultCard'
import { usePoolsWithVault } from 'state/pools/hooks'
import IfoPoolVaultCardMobile from './IfoPoolVaultCardMobile'
import IfoVesting from './IfoVesting/index'

const IfoPoolVaultCard = () => {
  const { isXl, isLg, isMd, isXs, isSm } = useMatchBreakpointsContext()
  const isSmallerThanXl = isXl || isLg || isMd || isXs || isSm
  const { pools } = usePoolsWithVault()
  const xaloPool = useMemo(() => pools.find((pool) => pool.userData && pool.sousId === 0), [pools])

  return (
    <Flex width="100%" maxWidth={400} alignItems="center" flexDirection="column">
      {isSmallerThanXl ? (
        <IfoPoolVaultCardMobile pool={xaloPool} />
      ) : (
        <CakeVaultCard pool={xaloPool} showStakedOnly={false} showIXalo />
      )}
      <IfoVesting pool={xaloPool} />
    </Flex>
  )
}

export default IfoPoolVaultCard
