
Rodando o Flask (Python)
Abra um terminal novo no VS Code

Entre na pasta do backend
cd python-api

Ative o ambiente virtual
venv\Scripts\activate


Instale dependências (só na primeira vez)
pip install -r requirements.txt

Rode o Flask
python main.py

http://127.0.0.1:5000


Deixe esse terminal aberto

Rodando o Nuxt
Abra OUTRO terminal
(NÃO feche o do Flask)

Vá para a raiz do projeto
cd WORLDGAME-NEWS

Instale dependências (só na primeira vez)
npm install

Rode o Nuxt
npm run dev

http://localhost:3000

Deixe esse terminal aberto também

Teste rápido (fluxo completo)
Flask

Não abra no navegador.

Teste com:
POST http://127.0.0.1:5000/decode

Abra um terminal PowerShell e cole:

Invoke-RestMethod -Uri "http://127.0.0.1:5000/decode" -Method POST -ContentType "application/json" -Body '{"url":"https://news.google.com/rss/articles/CBMirAFBVV95cUxObjBYN1RYaG40LWRoeXhLVGVNeW9XckotMFNkSzJkZjJkdHpqVFVUWHJEdWFERW9YNVRpTm0tRXRLdWtUXy1xd2Y2bHpSMmttaTlNckpMT3NFWE5ubDJFM2FKZTZld2NQSk5ybExMeHVrMDVsU2xxYTlfTnpkQ0ZTeVV6a0djdmZldDZndW9ZYkUtUzJDTW54OEFXUWI0T0VaazhWcm9fMWpBZ2hk?oc=5"}'

Nuxt
Abra no navegador:

http://localhost:3000

Clique em uma notícia.

Deve abrir o site original, não o Google News.