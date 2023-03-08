import { TranslateFunction } from 'contexts/Localization/types'
import { SalesSectionProps } from '.'

export const swapSectionData = (t: TranslateFunction): SalesSectionProps => ({
  headingText: t('Trade anything. No registration no KYC no hassle.'),
  bodyText: t('Trade any token on BNB Smart Chain in seconds, just by connecting your wallet.'),
  reverse: false,
  primaryButton: {
    to: '/swap',
    text: t('Trade Now'),
    external: false,
  },
  
  secondaryButton: {
    to: 'https://kalos-protocol.gitbook.io/kazien-protocol-documentations/',
    text: t('Learn'),
    external: true,
  },
  
  /*  images: {
    path: '/images/home/trade/',
    attributes: [
      { src: 'BNB', alt: t('BNB token') },
      { src: 'BTC', alt: t('BTC token') },
      { src: 'CAKE', alt: t('CAKE token') },
    ], 
  }, */
})

export const earnSectionData = (t: TranslateFunction): SalesSectionProps => ({
  headingText: t('Earn passive income with crypto.'),
  bodyText: t('KalosDeFi makes it easy to make your crypto work for you.'),
  reverse: true,
  primaryButton: {
    to: '/farms',
    text: t('Explore'),
    external: false,
  },
  secondaryButton: {
    to: '*',
    text: t('Learn'),
    external: true,
  },
  /* images: {
    path: '/images/home/earn/',
    attributes: [
      { src: 'pie', alt: t('Pie chart') },
      { src: 'stonks', alt: t('Stocks chart') },
      { src: 'folder', alt: t('Folder with cake token') },
    ],
  }, */
})

export const cakeSectionData = (t: TranslateFunction): SalesSectionProps => ({
  headingText: t('XALO makes our world go round.'),
  bodyText: t(
    'XALO token is at the heart of the PancakeSwap ecosystem. Buy it, win it, farm it, spend it, stake it... heck, you can even vote with it!',
  ),
  reverse: false,
  primaryButton: {
    to: '/swap?outputCurrency=0x4d7a5b0665EdD992852cb0dA8257A1B7C77a6983',
    text: t('Buy XALO'),
    external: false,
  },
  secondaryButton: {
    to: '*',
    text: t('Learn'),
    external: true,
  },

  /* images: {
    path: '/images/home/cake/',
    attributes: [
      { src: 'bottom-right', alt: t('Small 3d pancake') },
      { src: 'top-right', alt: t('Small 3d pancake') },
      { src: 'coin', alt: t('CAKE token') },
      { src: 'top-left', alt: t('Small 3d pancake') },
    ],
  }, */
})
