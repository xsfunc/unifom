export default {
  lang: 'en-US',
  title: 'UniFom',
  description: 'Form creating tool with effector',
  lastUpdated: true,

  head: [
    ['link', { rel: 'icon', href: '/favicon.ico', sizes: 'any' }],
    ['link', { rel: 'icon', href: '/logo.svg', type: 'image/svg+xml' }],
    ['link', { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' }],
    ['link', { rel: 'manifest', href: '/site.webmanifest' }],
  ],

  themeConfig: {
    siteTitle: 'UniFom',
    logo: '/logo.svg',

    nav: [
      { text: 'Guide', link: '/getting-started' },
      { text: 'Integrations', link: '/integrations' },
      { text: 'API', link: '/api' },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/xsfunc/unifom' },
    ],

    sidebar: [
      {
        text: 'Guide',
        collapsible: true,
        items: [
          { text: 'Getting Started', link: '/getting-started' },
          { text: 'Installation', link: '/guide/installation' },
        ],
      },
      {
        text: 'Integrations',
        collapsible: true,
        items: [
          { text: 'React.js', link: '/integrations/react' },
        ],
      },
      {
        text: 'API',
        items: [
          { text: 'Reference', link: '/api' },
        ],
      },
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2022',
    },
  },
}
