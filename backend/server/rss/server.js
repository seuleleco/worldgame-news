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

async function fetchBingNews(query) {
    try {
        const url = `https://www.bing.com/news/search?q=${encodeURIComponent(query)}&format=RSS&count=100qft=interval:"7"`;
        const feed = await parser.parseURL(url);

        return feed.items.map(item => ({
            title: item.title,
            url: item.link,
            image: item.enclosure?.url || item['media:thumbnail']?.$?.url || null,
            pubDate: item.pubDate || item.isoDate,
            source: item.source?._ || item.source || 'Bing News'
        }));
    } catch (error) {
        console.error(`Erro ao buscar "${query}":`, error.message);
        return [];
    }
}

export async function searchNews() {
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

        // Buscar todas as queries em paralelo
        const results = await Promise.all(queries.map(q => fetchBingNews(q)));

        // Combinar todos os resultados
        const allArticles = results.flat();
        console.log('Total de artigos coletados:', allArticles.length);

        // Remover duplicatas por URL
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

        return {
            totalItems: filteredArticles.length,
            articles: filteredArticles
        };
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
