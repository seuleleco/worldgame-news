import 'dotenv/config';
import Parser from 'rss-parser';
import express from 'express';
import cors from 'cors';

const parser = new Parser({
    headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
    }
});

const ALLOWED_SITES = [
    'br.ign.com',
    'theenemy.com.br',
    'gamevicio.com',
    'flowgames.gg',
    'manualdosgames.com',
    'gamehall.com.br',
    'nintendoblast.com.br',
    'psxbrasil.com.br',
    'centralxbox.com.br',
    'techtudo.com.br/jogos',
    'canaltech.com.br/games',
    'uol.com.br/start',
    'terra.com.br/gameon',
    'g1.globo.com/pop-arte/games',
    'tecmundo.com.br/voxel',
    'adrenaline.com.br'
];

const BLOCKED_SITES = [
    'pinterest.com',
    'mercadolivre.com.br',
    'cesan.com.br'
];

const BLOCKED_TERMS = [
    'criptomoeda',
    'loteria',
    'aposta',
    'cassino'
];

const UPSTASH_REDIS_URL = process.env.UPSTASH_REDIS_URL;
const UPSTASH_REDIS_TOKEN = process.env.UPSTASH_REDIS_TOKEN;
const REDIS_CACHE_KEY = 'wgn:news:payload';
const REDIS_LAST_FETCH_KEY = 'wgn:news:lastFetchedAt';
const TWO_HOURS_MS = 2 * 60 * 60 * 1000;

function buildSearchQuery() {
    const gameTerms = [
        '"jogos de video game"',
        '"videogame"',
        '"video game"',
        '"games"',
        '"jogos eletrônicos"'
    ].join(' OR\n');

    const siteFilters = ALLOWED_SITES
        .map(site => `site:${site}`)
        .join(' OR\n');

    const blockedSites = BLOCKED_SITES
        .map(site => `-site:${site}`)
        .join('\n');

    const blockedTerms = BLOCKED_TERMS
        .map(term => `-${term}`)
        .join('\n');

    return `
(
${gameTerms}
)
(
${siteFilters}
)
${blockedSites}
${blockedTerms}
`;
}

async function extractImageFromArticle(url) {
    try {
        const response = await fetch(url, { redirect: 'follow' });
        const html = await response.text();

        const ogMatch = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i);
        if (ogMatch?.[1]) return ogMatch[1];

        const twitterMatch = html.match(/<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i);
        if (twitterMatch?.[1]) return twitterMatch[1];

        return null;
    } catch {
        return null;
    }
}

function getOriginalUrl(bingUrl) {
    try {
        const parsed = new URL(bingUrl);
        const encodedOriginal = parsed.searchParams.get('url');
        return encodedOriginal ? decodeURIComponent(encodedOriginal) : bingUrl;
    } catch {
        return bingUrl;
    }
}

async function fetchBingNews(query) {
    try {
        const url = `https://www.bing.com/news/search?q=${encodeURIComponent(query)}&format=RSS&count=100&qft=interval:%227%22&mkt=pt-BR&setlang=pt-BR&cc=br`;
        const feed = await parser.parseURL(url);

        const articles = await Promise.all(feed.items.map(async (item) => {
            const originalUrl = getOriginalUrl(item.link);
            const rssImage = item.enclosure?.url || item['media:thumbnail']?.$?.url || null;
            const image = rssImage || await extractImageFromArticle(originalUrl);

            return {
                title: item.title,
                url: originalUrl,
                image,
                pubDate: item.pubDate || item.isoDate,
                source: item.source?._ || item.source || 'Bing News'
            };
        }));

        return articles;
    } catch (error) {
        console.error(`Erro ao buscar "${query}":`, error.message);
        return [];
    }
}

async function redisCommand(command, ...args) {
    if (!UPSTASH_REDIS_URL || !UPSTASH_REDIS_TOKEN) {
        throw new Error('Redis Tokens são obrigatórios.');
    }
    const endpoint = `${UPSTASH_REDIS_URL}/${command}/${args.map(arg => encodeURIComponent(String(arg))).join('/')}`;
    const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${UPSTASH_REDIS_TOKEN}`
        }
    });
    if (!response.ok) throw new Error(`Redis command failed: ${command}`);
    const data = await response.json();
    return data.result;
}

async function loadCacheFromRedis() {
    try {
        const [cachedPayload, lastFetchedRaw] = await Promise.all([
            redisCommand('get', REDIS_CACHE_KEY),
            redisCommand('get', REDIS_LAST_FETCH_KEY)
        ]);

        if (!cachedPayload || !lastFetchedRaw) return null;

        const lastFetchedAt = Number(lastFetchedRaw);
        if (!Number.isFinite(lastFetchedAt)) return null;

        const age = Date.now() - lastFetchedAt;
        if (age > TWO_HOURS_MS) return null;

        const parsed = JSON.parse(cachedPayload);
        return {
            ...parsed,
            lastFetchedAt
        };
    } catch (error) {
        console.error('Erro ao ler cache no Redis:', error.message);
        return null;
    }
}

async function saveCacheToRedis(payload) {
    const lastFetchedAt = Date.now();
    const enrichedPayload = {
        ...payload,
        lastFetchedAt
    };

    await Promise.all([
        redisCommand('set', REDIS_CACHE_KEY, JSON.stringify(enrichedPayload)),
        redisCommand('set', REDIS_LAST_FETCH_KEY, String(lastFetchedAt))
    ]);

    return enrichedPayload;
}

export async function searchNews() {
    const cached = await loadCacheFromRedis();
    if (cached) {
        console.log('Retornando notícias do cache Redis.');
        return cached;
    }

    try {
        // Múltiplas buscas com termos diferentes
        const queries = [
            'videogames',
            'video games lançamento',
            'jogos eletrônicos',
            'PlayStation',
            'Xbox',
            'Nintendo',
            'PC games',
            'gaming notícias',
            'game updates',
            'novos jogos',
            'jogos de video game"',
            'videogame',
            'video game',
            'games',

        ];

        console.log('Buscando notícias em múltiplas fontes...');

        const results = await Promise.all(queries.map(q => fetchBingNews(q)));

        const allArticles = results.flat();
        console.log('Total de artigos coletados:', allArticles.length);

        const uniqueArticles = Array.from(
            new Map(allArticles.map(article => [article.url, article])).values()
        );
        console.log('Artigos únicos:', uniqueArticles.length);

        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));

        const filteredArticles = uniqueArticles
            .filter(article => {
                const articleDate = new Date(article.pubDate);
                return articleDate >= thirtyDaysAgo;
            })
            .sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate))
            .slice(0, 100);

        console.log('Artigos filtrados:', filteredArticles.length);

        const freshPayload = {
            totalItems: filteredArticles.length,
            articles: filteredArticles
        };
        const saved = await saveCacheToRedis(freshPayload);
        return saved;
    } catch (error) {
        console.error("Erro completo:", error);
        return { totalItems: 0, articles: [] };
    }
}

const app = express();
const PORT = 7000;

app.use(cors());
app.use(express.json());

let cache = null;
let lastFetch = 0;
const CACHE_DURATION = 5 * 60 * 1000;

app.get('/api/news', async (req, res) => {
    const now = Date.now();

    if (!cache || (now - lastFetch) > CACHE_DURATION) {
        cache = await searchNews();
        lastFetch = now;
    }

    res.json(cache);
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
