from flask import Flask, request, jsonify
from googlenewsdecoder import new_decoderv1
from flask_cors import CORS
from newspaper import Article

app = Flask(__name__)
CORS(app)


@app.route('/decode', methods=['POST'])
def decode_url():
    data = request.get_json()
    source_url = data.get('url')

    if not source_url:
        return jsonify({'status': False, 'message': 'URL é obrigatória'})

    try:
        decoded_url = new_decoderv1(source_url, interval=1)
        article_url = decoded_url["decoded_url"]
        article = Article(article_url)
        article.download()
        article.parse()

        return jsonify({
            "status": True,
            "original_url": article_url,
            "image": article.top_image
        })
    except Exception as e:
        return jsonify({'status': False, 'message': f'Erro: {str(e)}'})

if __name__ == "__main__":
    app.run(debug=True)
