import Parser from 'rss-parser';
import fs from 'fs';

const parser = new Parser();

async function buscarNoticias(termo) {
    try {
        const url = `https://news.google.com/rss/search?q=${encodeURIComponent(termo)}&hl=en-US&gl=US&ceid=US:en`;
        const feed = await parser.parseURL(url);

        const articles = feed.items.slice(0, 100).map(item => ({
            title: item.title,
            link: item.link,
            pubDate: item.pubDate,
            source: item.source
        }));

        return articles;
    } catch (error) {
        console.error("Erro:", error);
        return [];
    }
}
(async () => {
    const noticias = await buscarNoticias("games");
    fs.writeFileSync('modNews.json', JSON.stringify(noticias, null, 2))

    console.log('arquivos salvos');
})();
