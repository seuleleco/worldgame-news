// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    vite: {
        server: {
            allowedHosts: true
        }
    },
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true }
})
