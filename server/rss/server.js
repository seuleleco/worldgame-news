import Parser from 'rss-parser';
// import fs from 'fs';

const parser = new Parser({
    headers: {
        "User-Agent": "Mozilla/5.0 (Node.js RSS Reader)"
    }
});

async function decodeGoogleNewsUrl(googleUrl) {
    try {
        const response = await fetch("http://localhost:5000/decode", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ url: googleUrl })
        });

        const data = await response.json();
        return data.status ? { url: data.original_url, image: data.image } : { url: googleUrl, image: null };
    } catch (err) {
        console.error("Erro ao decodificar URL:", err);
        return { url: googleUrl, image: null };
    }
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

// (async () => {
//     const noticias = await searchNews();
//     fs.writeFileSync('gameNews.json', JSON.stringify(noticias, null, 2))
//
//     console.log('arquivos salvos');
// })();