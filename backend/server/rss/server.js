import Parser from 'rss-parser';
import express from 'express';
import cors from 'cors';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const parser = new Parser({
    headers: {
        "User-Agent": "Mozilla/5.0 (Node.js RSS Reader)"
    }
});

async function decodeGoogleNewsUrl(googleUrl) {
    return new Promise((resolve) => {
        const pythonScript = join(__dirname, '../pydecoder/main.py');
        const python = spawn('python3', [pythonScript, googleUrl]);

        let stdout = '';
        let stderr = '';

        python.stdout.on('data', (data) => {
            stdout += data.toString();
        });

        python.stderr.on('data', (data) => {
            stderr += data.toString();
        });

        python.on('close', (code) => {
            if (code === 0 && stdout.trim()) {
                try {
                    const result = JSON.parse(stdout.trim());
                    resolve({ url: result.url, image: result.image });
                } catch {
                    resolve({ url: stdout.trim(), image: null });
                }
            } else {
                console.error("Erro ao decodificar URL:", stderr);
                resolve({ url: googleUrl, image: null });
            }
        });
    });
}

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

export async function searchNews(termo) {
    try {
        const query = buildSearchQuery();
        const url = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=pt-BR&gl=BR&ceid=BR:pt-419`;
        const feed = await parser.parseURL(url);

        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - (365 * 24 * 60 * 60 * 1000));

        const articles = await Promise.all(
            feed.items.slice(0, 500).map(async item => {
                const decoded = await decodeGoogleNewsUrl(item.link);
                return {
                    title: item.title,
                    url: decoded.url,
                    image: decoded.image,
                    pubDate: item.pubDate,
                    source: item.source
                };
            })
        );

        const filteredArticles = articles
            .filter(article => new Date(article.pubDate) >= thirtyDaysAgo)
            .sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

        return {
            totalItems: filteredArticles.length,
            articles: filteredArticles
        };
    } catch (error) {
        console.error("Erro:", error);
        return { totalItems: 0, articles: [] };
    }
}

const app = express();
const PORT = process.env.PORT || 7000;

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
