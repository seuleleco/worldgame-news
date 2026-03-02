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
            feed.items.slice(0, 100).map(async item => {
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
// (async () => {
//     const noticias = await searchNews();
//     fs.writeFileSync('gameNews.json', JSON.stringify(noticias, null, 2))
//
//     console.log('arquivos salvos');
// })();
