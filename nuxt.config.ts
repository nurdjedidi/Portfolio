import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

export default defineNuxtConfig({
  ssr: true,
  build: {
    transpile: ['vuetify'],
  },

  app: {
    head: {
      htmlAttrs: {
        lang: 'en',
      },
      meta: [
        { charset: 'UTF-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1.0, viewport-fit=cover' },
        { name: 'author', content: 'Nûr' },
        { name: 'description', content: 'Développeur Vue.js, je conçois vos solutions digitales sur mesures.' },
        { name: 'keywords', content: 'développeur web fullstack, HTML, CSS, JavaScript, Typescript, Vue.js, Nuxt.js, Node.js, MySQL, API' },
        { name: 'robots', content: 'index, follow' },
        { name: 'referrer', content: 'no-referrer' },
        { property: 'og:title', content: 'Portfolio de Nûr - Développeur Web' },
        { property: 'og:description', content: 'Développeur Vue.js, je conçois vos solutions digitales sur mesures.' },
        { property: 'og:url', content: 'https://portfolionurdjedd.com' },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'Portfolio | Nûr' },
        { property: 'og:image', content: 'https://portfolionurdjedd.com/images/nurdjedd.jpg' },
        { property: 'og:image:secure_url', content: 'https://portfolionurdjedd.com/images/nurdjedd.jpg' },
        { property: 'og:image:type', content: 'image/jpeg' },
        { property: 'og:locale', content: 'fr_FR' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/portfolio.ico' },
      ],
      script: [
        {
          defer: true,
          'data-domain': 'portfolionurdjedd.com',
          src: 'https://plausible.io/js/script.outbound-links.js'
        }
      ],
      title: 'Portfolio | Nûr',
    },
  },
  nitro: {
    routeRules: {
      '/**': {
      }
    }
  },
  site: {
    url: 'https://portfolionurdjedd.com',
    name: 'My portfolio'
  },
  sitemap: {
    defaults: {
      lastmod: new Date().toISOString(),
    },
    urls: [
      {
        loc: '/'
      },
      {
        loc: '/services',
        images: [
          {
            loc: '/images/nurdjedd.jpg',
            caption: 'Full stack website',
            title: 'I create your website'
          },
          {
            loc: '/images/seo.jpg',
            caption: 'SEO optimization',
            title: 'Optimize the SEO of your website'
          }
        ]
      },
      {
        loc: '/projects',
        images: [
          {
            loc: '/images/urban.avif',
            caption: 'Shop project',
            title: 'Urbanstyle'
          },
          {
            loc: '/images/news.avif',
            caption: 'news for your country',
            title: 'World news'
          },
          {
            loc: '/images/fitness.avif',
            caption: 'Nutritional dashboard',
            title: 'NutriWeb'
          }
        ]
      },
      {
        loc: '/about',
      },
      {
        loc: '/contact',
      }
    ]
  },
  devtools: { enabled: true },

  modules: ['@nuxt/image', '@nuxtjs/sitemap',
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }))
      })
    },
  ],

  image: {
    domains: ['portfolionurdjedd.com']
  },

  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },

  compatibilityDate: '2025-02-14',
});