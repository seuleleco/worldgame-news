// https://nuxt.com/docs/api/configuration/nuxt-config
const isVercel = process.env.VERCEL === '1'

export default defineNuxtConfig({
    vite: {
        server: {
            allowedHosts: true
        }
    },
    modules: [
      'motion-v/nuxt',
      '@nuxt/content',
      'nuxt-studio'
    ],
    css: ['bootstrap/dist/css/bootstrap.min.css'],
    compatibilityDate: '2025-07-15',
    devtools: { enabled: true },
    nitro: {
        preset: isVercel ? 'vercel' : 'node-server'
    }
})
