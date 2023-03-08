import { FooterLinkType } from '@pancakeswap/uikit'
import { ContextApi } from 'contexts/Localization/types'

export const footerLinks: (t: ContextApi['t']) => FooterLinkType[] = (t) => [
  {
    label: t('About'),
    items: [
      {
        label: t('Contact'),
        href: 'https://kalos-protocol.gitbook.io/kazien-protocol-documentations/',
        isHighlighted: true,
      },
      {
        label: t('Brand'),
        href: 'https://kalos-protocol.gitbook.io/kazien-protocol-documentations/',
      },
      {
        label: t('Blog'),
        href: 'https://medium.com/@kalosprotocol',
      },
      {
        label: t('Community'),
        href: 'https://kalos-protocol.gitbook.io/kazien-protocol-documentations/',
      },
      {
        label: t('Litepaper'),
        href: 'https://www.kalosdefi.com',
      },
      {
        label: '—',
      },
      /* {
        label: t('Online Store'),
        href: 'https://pancakeswap.creator-spring.com/',
      }, */
    ],
  }, 
  {
    label: t('Help'),
    items: [
      {
        label: t('Customer Support'),
        href: 'https://kalos-protocol.gitbook.io/kazien-protocol-documentations/',
      },
      {
        label: t('Troubleshooting'),
        href: 'https://kalos-protocol.gitbook.io/kazien-protocol-documentations/',
      },
      {
        label: t('Guides'),
        href: 'https://kalos-protocol.gitbook.io/kazien-protocol-documentations/',
      },
    ],
  },
  {
    label: t('Developers'),
    items: [
      {
        label: 'Github',
        href: 'https://github.com/KalosProtocol',
      },
      {
        label: t('Documentation'),
        href: 'https://kalos-protocol.gitbook.io/kazien-protocol-documentations/',
      },
      {
        label: t('Bug Bounty'),
        href: 'https://kalos-protocol.gitbook.io/kazien-protocol-documentations/',
      },
      {
        label: t('Audits (COMING SOON)'),
        href: '*',
      },
      {
        label: t('Careers'),
        href: 'https://kalos-protocol.gitbook.io/kazien-protocol-documentations/',
      },
    ],
  },
]
