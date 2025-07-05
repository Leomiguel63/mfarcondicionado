// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: false },
  css: [
    'bootstrap/dist/css/bootstrap.min.css',
    '~/assets/css/themes.css'
  ],
  plugins: [
    '~/plugins/bootstrap.client.js'
  ]
})
