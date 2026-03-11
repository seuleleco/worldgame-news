import sys
import json
from googlenewsdecoder import new_decoderv1
from newspaper import Article

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("ERROR: URL não fornecida", file=sys.stderr)
        sys.exit(1)
    source_url = sys.argv[1]
    try:
        decoded_url = new_decoderv1(source_url, interval=1)
        article_url = decoded_url['decoded_url']

        article = Article(article_url)
        article.download()
        article.parse()

        result = {
            'url': article_url,
            'image': article.top_image
        }
        print(json.dumps(result))
    except Exception as e:
        print(f"ERROR: {str(e)}", file=sys.stderr)
        sys.exit(1)
