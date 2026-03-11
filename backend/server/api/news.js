import { searchNews } from "#server/rss/server.js";

let cache = null;
let lastFetch = 0;
const CACHE_DURATION = 5 * 60 * 1000;

export default defineEventHandler(async (event) => {
    const now = Date.now()

    if(!cache || (now - lastFetch) > CACHE_DURATION) {
        cache = await searchNews();
        lastFetch = now;
    }
    setHeader(event, 'Content-type', 'application/json');
    return cache;
});