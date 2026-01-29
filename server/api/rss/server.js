import Parser from 'rss-parser';
import fs from 'fs';

const parser = new Parser({
    headers: {
        "User-Agent": "Mozilla/5.0 (Node.js RSS Reader)"
    }
});

export async function searchNews(termo) {
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
        const articles = await Promise.all(
            feed.items.slice(0, 100).map(async item => ({
                title: item.title,
                link: item.link,
                // originalLink: await getOriginalUrl(item.link), // Link direto do site original
                pubDate: item.pubDate,
                source: item.source,
                // thumbnail: await getThumbnail(item.link)
            }))
        );
        return {
            totalItems,
            articles: articles.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate))
        }
        console.log('Dados coletados com sucesso')
    } catch (error) {
        console.error("Erro:", error);
        return [];
    }
}
(async () => {
    const noticias = await searchNews();
    fs.writeFileSync('gameNews.json', JSON.stringify(noticias, null, 2))

    console.log('arquivos salvos');
})();