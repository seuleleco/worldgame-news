import { searchNews } from "#server/rss/server.js";

export default defineEventHandler(async (event) => {
    const result = await searchNews()
    setHeader(event, 'Content-type', 'application/json');
    return result;
});