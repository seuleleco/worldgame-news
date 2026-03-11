import sys
from googlenewsdecoder import gnewsdecoder

if __name__ == "__main__":
    if len(sys.argv) < 2:
    print("ERROR: URL não fornecida", file=sys.stderr)
    sys.exit(1)
source_url = sys.argv[1]
    try:
        decoded_url = gnewsdecoder(source_url, interval=1)
        print(decoded_url['decoded_url'])
    except Exception as e:
        print(f"ERROR: {str(e)}", file=sys.stderr)
        sys.exit(1)
