import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

export default defineNuxtConfig({
  ssr: true,
  css: ['@/public/style.css'],
  build: {
    transpile: ['vuetify'],
  },
  compatibilityDate: '2024-11-01',
  app: {
  head: {
    htmlAttrs: {
      lang: 'en', 
    },
    meta: [
      { charset: 'UTF-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0, viewport-fit=cover' },
      { name: 'author', content: 'Nûr' },
      { name: 'description', content: 'Je suis Nûr, développeur web spécialisé en programmation fullstack. Découvrez mes projets, compétences, et comment me contacter.' },
      { name: 'keywords', content: 'développeur web fullstack, HTML, CSS, JavaScript, Vue, Node.js, MySQL, API' },
      { name: 'robots', content: 'index, follow' },
      { name: 'referrer', content: 'no-referrer' },
      { property: 'og:title', content: 'Portfolio de Nûr - Développeur Web' },
      { property: 'og:description', content: 'Découvrez mes projets en développement web, mes compétences en HTML, CSS, JavaScript, et plus encore.' },
      { property: 'og:url', content: 'https://portfolionurdjedd.com' },
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: 'Portfolio | Nûr' },
      { property: 'og:image', content: '/images/Vignette.avif' },
      { property: 'og:image:type', content: 'image/jpeg' },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { property: 'og:locale', content: 'fr_FR' },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'preload', href: '/images/urbanstyle.avif', as: 'image' },
      { rel: 'preload', href: '/images/Vignette.avif', as: 'image' },
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
  devtools: { enabled: true },
  modules: [
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }))
      })
    },
  ],
  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
});
