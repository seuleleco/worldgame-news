import Parser from 'rss-parser';
import fs from 'fs';

const parser = new Parser({
    headers: {
        "User-Agent": "Mozilla/5.0 (Node.js RSS Reader)"
    }
});

async function buscarNoticias(termo) {
    try {
        const query = `
(
"jogos de video game" OR
"videogame" OR
"video game" OR
"games" OR
"jogos eletrônicos"
)
(
site:tecmundo.com.br OR
site:canaltech.com.br OR
site:adrenaline.com.br OR
site:omelete.com.br OR
site:voxel.com.br
)
-site:pinterest.com
-site:mercadolivre.com.br
-cesan.com.br
-criptomoeda 
-loteria
 -aposta 
 -cassino
`;

        const url = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=pt-BR&gl=BR&ceid=BR:pt-419`;
        const feed = await parser.parseURL(url);

        const totalItems = feed.items.length
        const articles = feed.items.slice(0, 100).map(item => ({
            title: item.title,
            link: item.link,
            pubDate: item.pubDate,
            source: item.source,
            // thumbnail: item.content || null
        }));

        return {
            totalItems,
            articles
        }
    } catch (error) {
        console.error("Erro:", error);
        return [];
    }
}
(async () => {
    const noticias = await buscarNoticias();
    fs.writeFileSync('gameNews.json', JSON.stringify(noticias, null, 2))

    console.log('arquivos salvos');
})();