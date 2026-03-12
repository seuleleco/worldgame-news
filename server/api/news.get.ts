export default defineEventHandler(async (event) => {
    try {
        const response = await $fetch('http://localhost:7000/api/news')
        return response
    } catch (error) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Erro ao buscar notícias'
        })
    }
})
