from flask import Flask, request, jsonify
from googlenewsdecoder import gnewsdecoder
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


@app.route('/decode', methods=['POST'])
def decode_url():
    data = request.get_json()
    source_url = data.get('url')

    if not source_url:
        return jsonify({'status': False, 'message': 'URL é obrigatória'})

    try:
        decoded_url = gnewsdecoder(source_url, interval=1)
        return jsonify({
    "status": True,
    "original_url": decoded_url["decoded_url"]
})
    except Exception as e:
        return jsonify({'status': False, 'message': f'Erro: {str(e)}'})

if __name__ == "__main__":
    app.run(debug=True)
