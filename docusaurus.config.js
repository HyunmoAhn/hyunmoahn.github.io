const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: 'hmos.dev',
  tagline: 'Front-End developer',
  url: 'https://hmos.dev',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'favicon/favicon.ico',
  organizationName: 'HyunmoAhn', // Usually your GitHub org/user name.
  projectName: 'hyunmoahn.github.io', // Usually your repo name.
  trailingSlash: false,
  i18n: {
    defaultLocale: 'ko',
    locales: ['ko', 'en'],
  },
  themeConfig: {
    image: 'img/dark-room-computer.jpeg',
    metadatas: [
      { name: 'og:title', content: 'hmos.dev' },
      { name: 'og:description', content: 'Front-end Developer Blog' },
    ],
    announcementBar: {
      content: 'This blog is work in progress. Please wait for my work.',
      backgroundColor: '#f58442',
      textColor: '#000000',
      isCloseable: false,
    },
    colorMode: {
      defaultMode: 'dark',
    },
    navbar: {
      title: 'hmos.dev',
      logo: {
        alt: 'hmos Logo',
        src: 'img/logo.svg',
      },
      hideOnScroll: true,
      items: [
        { to: '/about', label: 'About', position: 'left' },
        {
          type: 'localeDropdown',
          position: 'right',
        },
        {
          href: 'https://github.com/HyunmoAhn',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'More',
          items: [
            {
              label: 'Blog',
              to: '/',
            },
            {
              label: 'About',
              to: '/about',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/HyunmoAhn',
            },
          ],
        },
      ],
      copyright: `<div>Icons made by <a href="https://www.freepik.com" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>Copyright © ${new Date().getFullYear()} Hyunmo Ahn. Built with Docusaurus.\n`,
    },
    prism: {
      theme: lightCodeTheme,
      darkTheme: darkCodeTheme,
    },
    googleAnalytics: {
      trackingID: 'UA-206743648-1',
    },
    gtag: {
      trackingID: 'G-MFNE9LTQG8',
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: false,
        blog: {
          path: './blog',
          routeBasePath: '/',
          showReadingTime: true,
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
