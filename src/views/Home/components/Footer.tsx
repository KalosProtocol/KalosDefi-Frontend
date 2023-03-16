import styled from 'styled-components'
import { Flex, Heading, Text, Link } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { useWeb3React } from '@web3-react/core'
import { multicallv2 } from 'utils/multicall copy'
import xaloAbi from 'config/abi/xalo.json'
import { BalanceWithLoading } from 'components/Balance'
import { useState, useEffect } from 'react'

const Wrapper = styled(Flex)`
  z-index: 1;
  position: relative;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`

const Footer = () => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const tokenAddress = '0x4d7a5b0665EdD992852cb0dA8257A1B7C77a6983'
  const tokenBalanceOf = '0x70a08231' // balanceOf function signature
  const tokenOwner = '0xD00B0Fa59b7ADb92f30e6A402Af28CC42e238343'

  const [xaloBalance, setXaloBalance] = useState(0)

  useEffect(() => {
    const fetchXaloBalance = async () => {
      const response = await multicallv2(xaloAbi, [
        {
          address: tokenAddress,
          name: 'balanceOf',
          params: [tokenOwner],
        },
      ])
      const balance = Number(response[0]) / 10 ** 18
      setXaloBalance(balance)
    }
    if (account) {
      fetchXaloBalance()
    } else {
      setXaloBalance(0)
    }
  }, [account, tokenAddress, tokenOwner])

  return (
    <>
      <Wrapper>
        <Heading mb="24px" scale="xl" color="white">
          {t('Start in seconds.')}
        </Heading>
        <Text textAlign="center" color="white">
          {t('Connect your crypto wallet to start using the app in seconds.')}
        </Text>
        <Text mb="24px" bold color="white">
          {t('No registration needed.')}
        </Text>

        <Link external href="*">
          {t('Learn how to start')}
        </Link>
        {account && (
          <Flex mt="24px" alignItems="center">
            <Text mr="8px" color="white">
              {t('Treasury Vault balance:')}
            </Text>
            <BalanceWithLoading value={xaloBalance} bold color="black" />
          </Flex>
        )}
      </Wrapper>
    </>
  )
}

export default Footer
