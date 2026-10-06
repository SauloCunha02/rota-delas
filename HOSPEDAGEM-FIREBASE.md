# Rota Delas no Firebase Hosting

Configuração de publicação estática do catálogo e da aplicação, sem serviços de banco de dados ou login do Firebase.

- Projeto e site: rotadelas-ceara2026.
- Endereço: https://rotadelas-ceara2026.web.app/
- Diretório publicado: dist.
- Gerar dados: `node scripts/gerar-catalogo.mjs` e `node scripts/gerar-jornada.mjs`.
- Publicar: firebase deploy --only hosting --project rotadelas-ceara2026
- A autenticação da CLI pertence à máquina e não deve ser adicionada ao repositório.

Os links das rotas e o endereço desenhado nos Stories acompanham a hospedagem em que a página foi aberta. Em arquivo local, usam o endereço do Firebase. As sugestões de cadastro continuam seguindo para revisão no repositório oficial do GitHub.

A hospedagem usa a configuração gratuita inicial do Firebase; as cotas de armazenamento e tráfego se aplicam. Nenhum plano pago foi configurado por esta publicação. O workflow existente do GitHub continua publicando apenas no GitHub Pages; a publicação no Firebase usa o comando acima.
