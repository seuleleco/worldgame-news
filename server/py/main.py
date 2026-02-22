import sys
import json
from googlenewsdecoder import gnewsdecoder

if __name__ == "__main__":
    url = sys.argv[1]
try:
    result = gnewsdecoder(url, interval=1)
    print(json.dumps(result))
except Exception as e:
    print(json.dumps({'status': False, 'message': str(e)}), file=sys.stderr)
    sys.exit(1)
