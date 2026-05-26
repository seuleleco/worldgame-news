// https://nuxt.com/docs/api/configuration/nuxt-config
const isVercel = process.env.VERCEL === '1'

export default defineNuxtConfig({
    vite: {
        server: {
            allowedHosts: true
        }
    },
    modules: ['motion-v/nuxt'],
    css: ['bootstrap/dist/css/bootstrap.min.css'],
    compatibilityDate: '2025-07-15',
    devtools: { enabled: true },
    nitro: {
        preset: isVercel ? 'vercel' : 'node-server'
    },
    app: {
        head: {
          title: 'World Game News',
          meta: [
            { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' }
          ],
          link: [
            { rel: 'icon', type: 'image/png', href: '/images/icon.png' }
          ]
        }
      }
})
