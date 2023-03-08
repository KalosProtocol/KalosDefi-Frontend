export const getDisplayApr = (xaloRewardsApr?: number, lpRewardsApr?: number) => {
  if (xaloRewardsApr && lpRewardsApr) {
    return (xaloRewardsApr + lpRewardsApr).toLocaleString('en-US', { maximumFractionDigits: 2 })
  }
  if (xaloRewardsApr) {
    return xaloRewardsApr.toLocaleString('en-US', { maximumFractionDigits: 2 })
  }
  return null
}
