// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    vite: {
        server: {
            allowedHosts: true
        }
    },
    modules: ['motion-v/nuxt'],
    css: ['bootstrap/dist/css/bootstrap.min.css'],
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true }
})
