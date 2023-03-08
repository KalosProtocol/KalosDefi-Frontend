import { Language } from "../LangSelector/types";
import { FooterLinkType } from "./types";
import { TwitterIcon, TelegramIcon, RedditIcon, InstagramIcon, GithubIcon, DiscordIcon, MediumIcon } from "../Svg";

export const footerLinks: FooterLinkType[] = [
  {
    label: "About",
    items: [
      {
        label: "Contact",
        href: "https://kalos-protocol.gitbook.io/kazien-protocol-documentations/contact-us",
      },
      {
        label: "Blog",
        href: "https://medium.com/@kalosprotocol",
      },
      {
        label: "Community",
        href: "https://docs.kalosdefi.finance/contact-us/telegram",
      },
      {
        label: "XALO",
        href: "https://kalos-protocol.gitbook.io/kazien-protocol-documentations/tokenomics",
      },
      {
        label: "—",
      },
      /* {
        label: "Online Store",
        href: "https://pancakeswap.creator-spring.com/",
        isHighlighted: true,
      }, */
    ],
  },
  {
    label: "Help",
    items: [
      {
        label: "Customer",
        href: "Support https://kalos-protocol.gitbook.io/kazien-protocol-documentations/contact-us",
      },
      {
        label: "Troubleshooting",
        href: "https://kalos-protocol.gitbook.io/kazien-protocol-documentations/get-started-bsc",
      },
      {
        label: "Guides",
        href: "https://kalos-protocol.gitbook.io/kazien-protocol-documentations/get-started-bsc",
      },
    ],
  },
  {
    label: "Developers",
    items: [
      {
        label: "Github",
        href: "https://github.com/KalosProtocol",
      },
      {
        label: "Documentation",
        href: "https://kalos-protocol.gitbook.io/kazien-protocol-documentations/",
      },
      {
        label: "Bug Bounty",
        href: "-",
      },
      {
        label: "Audits",
        href: "-",
      },
      {
        label: "Careers",
        href: "-",
      },
    ],
  },
];

export const socials = [
  {
    label: "Twitter",
    icon: TwitterIcon,
    href: "https://twitter.com/kalosprotocol",
  },
  {
    label: "Telegram",
    icon: TelegramIcon,
    items: [
      {
        label: "English",
        href: "https://t.me/kalosProtocol",
      },
      
      {
        label: "Announcements",
        href: "-",
      },
    ],
  },
  {
    label: "Reddit",
    icon: RedditIcon,
    href: "-",
  },
  {
    label: "Instagram",
    icon: InstagramIcon,
    href: "-",
  },
  {
    label: "Github",
    icon: GithubIcon,
    href: "https://github.com/KalosProtocol",
  },
  {
    label: "Discord",
    icon: DiscordIcon,
    href: "-",
  },
  {
    label: "Medium",
    icon: MediumIcon,
    href: "https://medium.com/@kalosprotocol",
  },
];

export const langs: Language[] = [...Array(20)].map((_, i) => ({
  code: `en${i}`,
  language: `English${i}`,
  locale: `Locale${i}`,
}));
