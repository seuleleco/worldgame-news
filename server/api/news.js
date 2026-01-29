import { searchNews } from "#server/rss/server.js";

export default defineEventHandler(async (event) => {
    return await searchNews()
});