import { ReactText } from 'react'
import { getBalanceNumber } from 'utils/formatBalance'
import { easterPrizes, PrizesConfig } from 'config/constants/trading-competition/prizes'
import BigNumber from 'bignumber.js'
import useBUSDPrice, { useXaloBusdPrice } from 'hooks/useBUSDPrice'
import tokens from 'config/constants/tokens'
import { multiplyPriceByAmount } from 'utils/prices'

export const localiseTradingVolume = (value: number, decimals = 0) => {
  return value.toLocaleString('en-US', { maximumFractionDigits: decimals })
}

export const useCompetitionXaloRewards = (userXaloReward: ReactText) => {
  const xaloAsBigNumber = new BigNumber(userXaloReward as string)
  const xaloBalance = getBalanceNumber(xaloAsBigNumber)
  const xaloPriceBusd = useXaloBusdPrice()
  return {
    xaloReward: xaloBalance,
    dollarValueOfXaloReward: multiplyPriceByAmount(xaloPriceBusd, xaloBalance),
  }
}

export const useFanTokenCompetitionRewards = ({
  userXaloRewards,
  userLazioRewards,
  userPortoRewards,
  userSantosRewards,
}: {
  userXaloRewards: ReactText
  userLazioRewards: ReactText
  userPortoRewards: ReactText
  userSantosRewards: ReactText
}) => {
  const lazioPriceBUSD = useBUSDPrice(tokens.lazio)
  const portoPriceBUSD = useBUSDPrice(tokens.porto)
  const santosPriceBUSD = useBUSDPrice(tokens.santos)
  const xaloAsBigNumber = new BigNumber(userXaloRewards as string)
  const lazioAsBigNumber = new BigNumber(userLazioRewards as string)
  const portoAsBigNumber = new BigNumber(userPortoRewards as string)
  const santosAsBigNumber = new BigNumber(userSantosRewards as string)
  const xaloBalance = getBalanceNumber(xaloAsBigNumber)
  const lazioBalance = getBalanceNumber(lazioAsBigNumber, 8)
  const portoBalance = getBalanceNumber(portoAsBigNumber, 8)
  const santosBalance = getBalanceNumber(santosAsBigNumber, 8)
  const xaloPriceBusd = useXaloBusdPrice()

  const dollarValueOfTokensReward =
    xaloPriceBusd && lazioPriceBUSD && portoPriceBUSD && santosPriceBUSD
      ? multiplyPriceByAmount(xaloPriceBusd, xaloBalance) +
        multiplyPriceByAmount(lazioPriceBUSD, lazioBalance, 8) +
        multiplyPriceByAmount(portoPriceBUSD, portoBalance, 8) +
        multiplyPriceByAmount(santosPriceBUSD, santosBalance, 8)
      : null

  return {
    xaloReward: xaloBalance,
    lazioReward: lazioBalance,
    portoReward: portoBalance,
    santosReward: santosBalance,
    dollarValueOfTokensReward,
  }
}

export const useMoboxCompetitionRewards = ({
  userXaloRewards,
  userMoboxRewards,
}: {
  userXaloRewards: ReactText
  userMoboxRewards: ReactText
}) => {
  const moboxPriceBUSD = useBUSDPrice(tokens.mbox)
  const xaloAsBigNumber = new BigNumber(userXaloRewards as string)
  const moboxAsBigNumber = new BigNumber(userMoboxRewards as string)
  const xaloBalance = getBalanceNumber(xaloAsBigNumber)
  const moboxBalance = getBalanceNumber(moboxAsBigNumber)
  const xaloPriceBusd = useXaloBusdPrice()

  const dollarValueOfTokensReward =
    xaloPriceBusd && moboxPriceBUSD
      ? multiplyPriceByAmount(xaloPriceBusd, xaloBalance) + multiplyPriceByAmount(moboxPriceBUSD, moboxBalance, 8)
      : null

  return {
    xaloReward: xaloBalance,
    moboxReward: moboxBalance,
    dollarValueOfTokensReward,
  }
}

export const useModCompetitionRewards = ({
  userXaloRewards,
  userDarRewards,
}: {
  userXaloRewards: ReactText
  userDarRewards: ReactText
}) => {
  const darPriceBUSD = useBUSDPrice(tokens.dar)
  const xaloAsBigNumber = new BigNumber(userXaloRewards as string)
  const darAsBigNumber = new BigNumber(userDarRewards as string)
  const xaloBalance = getBalanceNumber(xaloAsBigNumber)
  const darBalance = getBalanceNumber(darAsBigNumber, tokens.dar.decimals)
  const xaloPriceBusd = useXaloBusdPrice()

  const dollarValueOfTokensReward =
    xaloPriceBusd && darPriceBUSD
      ? multiplyPriceByAmount(xaloPriceBusd, xaloBalance) +
        multiplyPriceByAmount(darPriceBUSD, darBalance, tokens.dar.decimals)
      : null

  return {
    xaloReward: xaloBalance,
    darReward: darBalance,
    dollarValueOfTokensReward,
  }
}

// 1 is a reasonable teamRank default: accessing the first team in the config.
// We use the smart contract userPointReward to get a users' points
// Achievement keys are consistent across different teams regardless of team team rank
// If a teamRank value isn't passed, this helper can be used to return achievement keys for a given userRewardGroup
export const getEasterRewardGroupAchievements = (userRewardGroup: string, teamRank = 1) => {
  const userGroup = easterPrizes[teamRank].filter((prizeGroup) => {
    return prizeGroup.group === userRewardGroup
  })[0]
  return userGroup && userGroup.achievements
}

// given we have userPointReward and userRewardGroup, we can find the specific reward because no Rank has same two values.
export const getRewardGroupAchievements = (prizes: PrizesConfig, userRewardGroup: string, userPointReward: string) => {
  const prize = Object.values(prizes)
    .flat()
    .find((rank) => rank.achievements.points === Number(userPointReward) && rank.group === userRewardGroup)
  return prize && prize.achievements
}

export default localiseTradingVolume
