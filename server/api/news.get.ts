import { searchNews } from "~~/backend/server/rss/server.js";

export default defineEventHandler(async (event) => {
    try {
        const response = await searchNews()
        return response
    } catch (error) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Erro ao buscar notícias'
        })
    }
})
