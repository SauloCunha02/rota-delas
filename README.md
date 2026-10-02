# Rota Delas

Aplicação web de consulta a iniciativas, competições, visitas e materiais de estudo em ciência e tecnologia, com foco em meninas do Ensino Médio no Ceará, apoiado por recursos locais e nacionais. Feita em HTML, CSS e JavaScript, com catálogo documental e envio público de sugestões pelo GitHub.

**Site:** https://saulocunha02.github.io/rota-delas/  
**Código:** https://github.com/SauloCunha02/rota-delas

## Identidade visual

A identidade visual adotada é a **direção 6 — Flor de circuitos**. A marca está no cabeçalho, rodapé e favicon; o símbolo também aparece na introdução e na área de rota. Os arquivos claro, escuro, monocromático e símbolo estão em `dist/assets/marca`. A paleta usa azul #101F2B, verde #108A82, menta #67DFD0 e terracota #DA754D. Para o cabeçalho, a versão compacta preserva a leitura do nome em tamanhos pequenos.

## Executar

Na pasta do projeto:

```powershell
python -m http.server 8765 --directory dist
```

Abra `http://localhost:8765/`. Também pode publicar a pasta `dist` em qualquer hospedagem estática.

## Publicação no GitHub

O workflow `.github/workflows/pages.yml` publica a pasta `dist` no GitHub Pages a cada atualização da branch `main`. O repositório usa GitHub Actions como fonte do Pages. HTML, CSS, JavaScript, ícones e fontes locais ficam na pasta `dist`.

## Funcionalidades

- Busca por nome, descrição, local e palavras-chave, inclusive sem acentos.
- Filtros combináveis de área, tema, tipo, região, UF, formato e público; paginação com 12 cartões.
- 63 recursos com fontes e datas de consulta; 61 visíveis inicialmente e 2 inativos consultáveis.
- Rotas personalizadas por área, estado, até três temas, objetivo e formato confirmado; até três indicações com justificativas e aviso de cobertura insuficiente.
- Troca de indicações, escolha do próximo passo, salvamento local e link que reabre os recursos selecionados.
- Três modelos de Stories, três paletas e frases selecionáveis; prévia, PNG 1080 × 1920, download, cópia de legenda/link e compartilhamento de arquivo em aparelhos compatíveis.
- Favoritos salvos apenas no navegador do aparelho.
- Cópia da rota para a área de transferência e versão para impressão.
- Layout responsivo e controles utilizáveis por teclado.
- Painel de acessibilidade com preferências de leitura salvas no navegador.

## Acessibilidade

Na seção Minha rota, escolha a área e ajuste objetivo, formato e temas. As escolhas e o contador de temas atualizam o resumo e a seleção imediatamente. Use “Quero começar aqui” para destacar uma indicação. “Limpar minha rota” apaga a rota salva e devolve a seção e o Story ao estado inicial, preservando favoritos e acessibilidade. “Criar meu Story” abre o editor do cartão; a publicação no Instagram é feita pela usuária. Sem suporte ao compartilhamento de arquivos, baixe o PNG. O link da rota inclui suas escolhas e IDs de recursos, sem nome ou foto, e deve ser conferido antes de compartilhar.

Use o botão com o **símbolo de acessibilidade**, visível no cabeçalho, ou **Alt + A**. O painel lateral segue a organização de [Cartografias do Abandono](https://saulocunha02.github.io/cartografias-do-abandono/), com quatro perfis rápidos: leitura assistida, baixa visão, menos movimento e foco na linha.

Os ajustes incluem letras de 100% a 200%, fonte Atkinson Hyperlegible incluída localmente, maior espaçamento, destaque de links, guia e máscara de leitura, redução de movimento, cursor ampliado, foco reforçado e alto contraste claro/escuro. As paletas alternativas oferecem azul/amarelo, azul/laranja, vinho/turquesa e cinza; o alto contraste tem prioridade. A máscara e o guia podem ser movidos pelo ponteiro, pelo toque ou pelas setas no botão ↕.

O tradutor **VLibras** fica disponível pelo botão de mãos na lateral direita e pela seção Libras do painel. O widget oficial é carregado pela internet e permite traduzir textos para Libras.

A leitura em voz alta permite escolher uma seção, o texto selecionado ou um parágrafo, ajustar a velocidade, pausar, continuar, avançar, voltar e parar. Os controles flutuantes ficam acessíveis após fechar o painel. **Alt + L** inicia a leitura da seção escolhida; **Esc** fecha o painel ou interrompe a voz. A voz é fornecida pelo navegador/aparelho; algumas vozes precisam de internet. Os trechos lidos e os estados dos controles aparecem por escrito. O conteúdo, os favoritos e os filtros também oferecem informações textuais e rótulos para leitores de tela.

Veja os detalhes de uso e o escopo da revisão em `ACESSIBILIDADE.md`.

### Player de leitura

O player mostra o trecho atual, sua posição no texto e os controles **Play/Pausa**, **anterior/próximo**, **Parar**, velocidade de **0,5× a 2×** e uma barra para escolher o trecho. É possível navegar com a voz parada ou pausada. No player, as setas esquerda/direita mudam de trecho; Espaço inicia ou pausa quando a região do player está em foco. Os seletores e a barra de posição mantêm seus controles nativos de teclado.

No celular, o leitor abre compacto e mantém o trecho atual visível. Toque na velocidade para abrir o seletor ou na seta para expandir todas as opções. A área de opções rola separadamente dos controles principais. A acessibilidade fica no cabeçalho e no menu Mais; o leitor permanece acima da barra inferior. Ao expandir, o controle de posição fica na área rolável de opções. No celular deitado, o trecho também entra nessa área enquanto as opções estão abertas. O layout também se adapta ao celular deitado e às letras ampliadas.

A narração destaca o trecho na página e a palavra quando a voz do navegador fornece eventos de sincronização. O botão **Localizar trecho** leva ao trecho selecionado, e **Acompanhar trecho na página** permite ligar/desligar a rolagem automática. A velocidade muda durante a leitura, retomando da última palavra informada pela voz; sem eventos por palavra, o trecho atual é retomado. O botão de recolher reduz o tamanho do player.

## Dados e atualização

Os registros são editados em `dados/*.json`. Execute `node scripts/gerar-catalogo.mjs` para validar e produzir `dist/catalogo.js` e `dist/dados/catalogo.json`. O workflow também gera o catálogo. Cada item tem ID estável, título, tipo, área, instituição, localização, alcance, formato, público, descrição, URL, palavras-chave, fontes com datas e função na rota. Veja `CURADORIA.md`. Antes de acrescentar um item, confira na fonte oficial se a iniciativa existe e se o texto descreve corretamente o público e a disponibilidade. A aplicação não apresenta inscrições como abertas sem confirmação no site de origem.

Os recursos originais preservam a consulta de 28/09/2026. Novos registros consultados em 01/10/2026 incluem fichas do Programa Meninas Digitais, Technovation Brasil, TM², Quimeninas, Maratona Feminina de Programação, TFM, OBR, FEBRACE, APICE, Code IoT, Instituto Butantan, OBQ e BitGirls/UFMG. Os endereços específicos estão nos cartões. A disponibilidade de cursos, projetos, visitas e competições pode mudar; cada estudante deve conferir a página oficial antes de participar.

## Privacidade e limites

A busca, os filtros e a rota são calculados no navegador. Os favoritos e as preferências de acessibilidade usam `localStorage` e não são enviados pela aplicação. Não há contas próprias, análise de uso ou questionários de avaliação. O formulário de iniciativas prepara uma issue pública no GitHub: exige conta nesse serviço e confirmação final do remetente. Os dados da iniciativa e a conta que publicar ficarão públicos; não inclua informações pessoais de estudantes. Nenhuma sugestão entra automaticamente no catálogo. O carregamento da fonte tipográfica usa Google Fonts, e a abertura dos links externos passa a seguir as práticas de cada site de origem. A leitura em voz alta usa o serviço de voz do navegador; o processamento local ou pela internet depende da voz disponível. O VLibras carrega o widget oficial de `vlibras.gov.br` e usa os serviços externos da ferramenta para tradução.

A aplicação demonstra uma solução técnica; ainda não há evidência de que ela aumente a participação de meninas na ciência. Qualquer estudo posterior com participantes deve ser planejado com o professor orientador e conforme as exigências éticas aplicáveis.


## Sugestões externas

A página `cadastro.html` valida dados institucionais, mostra uma prévia e abre um rascunho no GitHub. A equipe recebe as issues com etiqueta `cadastro` e revisa a fonte antes de publicar. Para textos extensos há cópia do conteúdo e download JSON. Os procedimentos de revisão estão em `CURADORIA.md`.

## Versão preservada

A versão anterior à expansão nacional está na tag/release [rotadelasv1](https://github.com/SauloCunha02/rota-delas/releases/tag/rotadelasv1), no commit `2ea3a9db9ec2c523cd5d0c2bf038fb30ad00895c`.

## Navegação e foco local — 02/10/2026

A consulta inicia em Ceará + nacionais (26 recursos disponíveis nesse recorte), com opção de explorar todo o Brasil. Área e temas específicos são classificações diferentes; iniciativas de pesquisa ampla não são classificadas automaticamente como Ciências Naturais. O catálogo mantém 63 registros e suas datas reais de consulta. A nova organização não é uma nova conferência de disponibilidade das fontes.

No celular, a barra inferior oferece Buscar, Rota, Salvos e Mais. O menu Mais reúne cadastro, metodologia e atalhos de acessibilidade e Libras. A navegação funciona também no celular deitado. O leitor reserva espaço acima da barra; menus e prévias são modais e restauram o foco ao fechar. Navegar não ativa a voz automaticamente.

O formulário completo está em cadastro.html. As sugestões continuam públicas e dependem de conta no GitHub e confirmação do remetente. O endereço não pede permissões de atribuição de etiquetas; o workflow cadastro.yml aplica cadastro e em-revisao após a abertura de uma issue com o prefixo [Cadastro]. A aprovação e a inclusão no catálogo continuam manuais.

A versão anterior à reorganização foi preservada em https://github.com/SauloCunha02/rota-delas/releases/tag/rotadelasv2.
