const lightCodeTheme = require('prism-react-renderer').themes.github;
const darkCodeTheme = require('prism-react-renderer').themes.dracula;

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
  markdown: {
    mermaid: true,
  },
  themes: ['@docusaurus/theme-mermaid'],
  themeConfig: {
    image: 'img/dark-room-computer.jpeg',
    metadata: [
      { name: 'og:title', content: 'hmos.dev' },
      { name: 'og:description', content: 'Front-end Developer Blog' },
    ],
    // announcementBar: {
    //   content: 'This blog is work in progress. Please wait for my work.',
    //   backgroundColor: '#f58442',
    //   textColor: '#000000',
    //   isCloseable: false,
    // },
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
        { to: '/trouble-shooting', label: 'Trouble Shooting', position: 'left' },
        { to: '/about', label: 'About', position: 'left' },
        { to: '/tags', label: 'Tags', position: 'left' },
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
              label: 'Trouble Shooting',
              to: '/trouble-shooting',
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
      magicComments: [
        // Remember to extend the default highlight class name as well!
        {
          className: 'theme-code-block-highlighted-line',
          line: 'highlight-next-line',
          block: { start: 'highlight-start', end: 'highlight-end' },
        },
        {
          className: 'code-block-error-line',
          line: 'error-next-line',
          block: { start: 'error-start', end: 'error-end' },
        },
        {
          className: 'code-block-good-line',
          line: 'good-next-line',
          block: { start: 'good-start', end: 'good-end' },
        },
      ],
    },
    algolia: {
      appId: 'LJWMP0KD7V',
      apiKey: 'd75034780859d3329f9d6db9ec83fe79',
      indexName: 'hmos',
      contextualSearch: true,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: false,
        blog: {
          blogTitle: 'hmos.dev',
          blogDescription: 'Write article associated with Front-end development',
          path: './blog',
          routeBasePath: '/',
          showReadingTime: true,
          authorsMapPath: '../authors.yml',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
        googleAnalytics: {
          trackingID: 'UA-206743648-1',
        },
        gtag: {
          trackingID: 'G-MFNE9LTQG8',
        },
      },
    ],
  ],
  plugins: [
    [
      '@docusaurus/plugin-content-blog',
      {
        id: 'trouble-shooting',
        routeBasePath: 'trouble-shooting',
        path: './troubleShooting',
        authorsMapPath: '../authors.yml',
      },
    ],
    [
      '@docusaurus/plugin-pwa',
      {
        debug: true,
        offlineModeActivationStrategies: ['appInstalled', 'standalone', 'queryString'],
        pwaHead: [
          {
            tagName: 'link',
            rel: 'icon',
            href: '/favicon/favicon.ico',
          },
          {
            tagName: 'link',
            rel: 'manifest',
            href: '/manifest.json',
          },
          {
            tagName: 'meta',
            name: 'theme-color',
            content: 'rgb(37, 194, 160)',
          },
          {
            tagName: 'meta',
            name: 'apple-mobile-web-app-capable',
            content: 'yes',
          },
          {
            tagName: 'meta',
            name: 'apple-mobile-web-app-status-bar-style',
            content: '#000',
          },
          {
            tagName: 'link',
            rel: 'apple-touch-icon',
            href: '/favicon/apple-touch-icon.png',
          },
          {
            tagName: 'link',
            rel: 'mask-icon',
            href: '/favicon/safari-pinned-tab.svg',
            color: 'rgb(37, 194, 160)',
          },
          {
            tagName: 'meta',
            name: 'msapplication-TileImage',
            content: '/favicon/mstile-150x150.svg',
          },
          {
            tagName: 'meta',
            name: 'msapplication-TileColor',
            content: '#000',
          },
        ],
      },
    ],
  ],
};
