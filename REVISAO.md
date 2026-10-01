# Revisões da aplicação

## Expansão nacional — 01/10/2026

A tag e a release `rotadelasv1` preservam a versão anterior à expansão nacional. Os relatos abaixo dessa seção descrevem suas respectivas versões históricas, inclusive os resultados com 13 itens.

A base atual tem 63 recursos, 61 exibidos por padrão, 21 UFs com iniciativas locais, cinco regiões, 18 recursos nacionais e 49 com foco em meninas. O gerador valida campos, fontes, classificações, UFs e duplicatas, fundindo o Projeto Lua com sua ficha no diretório. Os dados foram separados do código da interface, com saída JSON e JavaScript para uso também em arquivo local.

A busca usa índice normalizado e paginação de 12 cartões. Região, UF, formato e público combinam-se com área e tipo. O usuário pode incluir recursos nacionais nos filtros territoriais e consultar registros inativos. As rotas consideram a área e a UF escolhidas, sem afirmar vagas abertas.

O formulário externo valida os campos e a URL HTTPS, apresenta uma prévia segura e prepara uma issue no GitHub. O envio final exige conta e confirmação do remetente. Nenhuma solicitação de teste foi enviada. Textos extensos têm alternativa de cópia; o catálogo só recebe inclusões revisadas pela equipe, conforme `CURADORIA.md`.

Revisão: 38 verificações específicas da expansão nacional, 39 verificações mobile e 20 do leitor passaram no Chrome emulado, sem exceções JavaScript. Foram conferidos filtros, paginação, unicidade de dados, rotas, favoritos, prévia, rejeição de URL indevida, texto externo tratado como texto e adaptação do formulário a 390 px e 320 px com letras de 200%. O contraste dos indicadores foi corrigido após inspeção. Scripts e relatórios estão em `identidade-visual/revisar-brasil.mjs` e `identidade-visual/revisao/brasil`.

Limites: não houve auditoria formal com leitores de tela nem testes em aparelhos físicos; a voz foi simulada nas verificações funcionais. As páginas institucionais foram consultadas para o levantamento, sem prometer disponibilidade atual. O envio real depende do GitHub e da confirmação do usuário, e a fila depende de revisão humana. Não há medição de impacto social ou comprovação de atendimento integral ao edital nesta revisão.

Escala interna de 0 a 10: funcionamento (3), confiabilidade das fontes (2), clareza e acessibilidade (2), adequação ao CFC (2) e privacidade (1). A nota é uma autoavaliação da entrega, não uma previsão da banca.

## Revisão 1 — 8,4/10

Busca, filtros e favoritos funcionavam, mas a rota de Ciência mostrava só dois itens apesar de prometer três. Três URLs antigas falhavam na checagem e, no celular, nenhum cartão aparecia na primeira tela. A interface também tinha uma ação redundante para gerar a rota.

## Revisão 2 — 9,2/10

Foram acrescentadas fontes oficiais para Ciência e Matemática; todas as rotas agora têm três passos. URLs antigas foram trocadas por fontes institucionais acessíveis. A rota passou a aparecer ao escolher a área. O layout móvel ficou mais compacto e passou a mostrar um resultado na primeira tela. Faltava registrar a metodologia e conferir todos os links após as substituições.

## Revisão final — 9,6/10

**Funcionamento: 3/3.** Busca sem acentos, filtros combinados, estado vazio, restauração, favoritos após recarga, três rotas e cópia foram acionados na página. O JavaScript passou em `node --check` e o navegador não registrou erros de console.

**Fontes: 2/2.** Os 13 links da versão final responderam HTTP 200 em 28/09/2026. As descrições foram conferidas com páginas institucionais. A disponibilidade futura de cada atividade depende da instituição responsável.

**Clareza e acessibilidade: 1,8/2.** A página foi inspecionada em computador e em largura móvel de 390 px. O primeiro cartão aparece na primeira tela móvel, a navegação usa elementos semânticos e há rótulos para os controles. Ainda cabe uma auditoria formal de acessibilidade com leitores de tela diferentes.

**Adequação ao CFC: 1,8/2.** O projeto se relaciona ao tema Ciência Delas, tem problema, objetivos, método, produto e resultados técnicos documentados. O efeito social ainda não foi medido com estudantes.

**Privacidade: 1/1.** O projeto não coleta respostas nem exige identificação. Os favoritos ficam no navegador.

**Nota total: 9,6/10.** Trata-se de autoavaliação da aplicação e da documentação entregue, não de previsão da nota da comissão do CFC.

## Aplicação da identidade visual — 30/09/2026

A direção 6, **Flor de circuitos**, escolhida pelo usuário, foi aplicada ao cabeçalho, rodapé, favicon, introdução e área de rota. A versão compacta do logotipo permite sua leitura no cabeçalho móvel. As cores da interface foram alinhadas à marca; arquivos SVG para fundos claros, escuros e reprodução monocromática ficam em `dist/assets/marca`.

A revisão em navegador conferiu larguras de 1440, 390 e 320 px, sem rolagem horizontal. As imagens da marca carregaram e os 13 cartões continuaram presentes. O rodapé foi inspecionado e o fundo branco da área de rota foi conferido no modo de impressão. Capturas e relatório estão em `identidade-visual/revisao/aplicacao`. Esta revisão verificou a aplicação visual da marca; não repetiu a checagem de fontes externas registrada acima.

## Recursos de acessibilidade — 30/09/2026

Adicionado painel de preferências de leitura, contraste, paletas alternativas, guia de leitura, movimento reduzido e síntese de voz. Rótulos e avisos textuais complementam os recursos; filtros, favoritos e rota preservam o foco por teclado. O painel pode ser fechado com Esc e as preferências são persistidas localmente.

Foram aprovadas 103 verificações técnicas, incluindo página e painel em 1440, 390 e 320 px, cinco paletas e letras de até 200%. As capturas foram inspecionadas e não houve exceções JavaScript. Os controles de voz foram conferidos com um substituto da API; a reprodução real depende do navegador e das vozes do aparelho. O detalhamento e os limites desta revisão estão em `ACESSIBILIDADE.md`.

## Botão com símbolo e Libras — 30/09/2026

O botão principal passou a exibir somente o símbolo, em formato circular de 54 px, com rótulo acessível. Adicionado o widget oficial do VLibras: o botão de mãos fica acima do botão de acessibilidade, e a seção Libras do painel permite abrir o tradutor. O diálogo de preferências fecha antes de abrir o tradutor. O carregamento usa internet e oferece aviso e nova tentativa em caso de falha.

O carregamento real do botão oficial e a abertura do painel do tradutor foram conferidos no navegador. As larguras de 1440 e 390 px não apresentaram rolagem horizontal nem exceções JavaScript nessa revisão. Capturas e relatório estão em `identidade-visual/revisao/libras`. A qualidade linguística da tradução automática não foi avaliada.

## Organização baseada na referência indicada — 30/09/2026

O painel passou a abrir na lateral esquerda, com cabeçalho e restauração sempre disponíveis, perfis rápidos e contagem de ajustes ativos. A referência de organização foi o site Cartografias do Abandono indicado pelo usuário. Foram acrescentados fonte Atkinson Hyperlegible local, máscara de leitura, movimento da faixa pelo toque e teclado, cursor ampliado, foco reforçado, paletas alternativas, atalhos Alt + A/Alt + L, controles de voz flutuantes e opção de mostrar/ocultar Libras.

A revisão aprovou 113 verificações técnicas, sem exceções JavaScript, e conferiu a fonte local. O botão e a abertura do painel oficial do VLibras também foram conferidos após a adaptação. Capturas em computador, celular, baixa visão e máscara de leitura foram inspecionadas. A avaliação da reprodução sonora real, do uso com leitores de tela e da qualidade linguística da tradução continua pendente.

## Player com controle de posição

O leitor passou a mapear cada trecho para os elementos reais da página. O player mostra seção, trecho atual, barra de posição, texto narrado, Play/Pausa, anterior/próximo, Parar, velocidade de 0,5× a 2×, Localizar trecho, acompanhamento automático e opção de recolher. A navegação mantém a pausa; alterar velocidade retoma da última palavra informada pela voz, ou do início do trecho quando não há sincronização por palavra. Conteúdo atualizado cancela a fila antiga.

Foram aprovadas 20 verificações específicas do novo leitor com eventos de voz simulados, incluindo palavra ligada ao DOM, callbacks antigos, mudança de velocidade, navegação pausada/parada, posição, teclado, filtros e layout móvel. Capturas foram inspecionadas. Os arquivos de evidência estão em `identidade-visual/revisao/leitor`; áudio real depende da voz instalada no navegador.

## Consolidação mobile — 01/10/2026

Navegação, busca, filtros, cartões e rota receberam ajustes de tamanho de texto, espaçamento e controles de toque. O painel de acessibilidade usa a largura da tela. O leitor abre compacto em telas pequenas, preserva o trecho narrado e permite expandir as opções por uma seta ou pelo botão de velocidade. As opções rolam separadamente, com espaço próprio em 200%. O trecho mantém a palavra sincronizada à vista. A rolagem de acompanhamento é imediata para evitar movimentos concorrentes.

O posicionamento do botão oficial de Libras foi integrado por variáveis CSS herdadas no Shadow DOM do widget. No celular, os atalhos ficam acima do leitor recolhido; no painel expandido, estão disponíveis dentro das opções. Na orientação horizontal, leitor e atalhos ocupam lados diferentes.

Foram aprovadas 39 verificações mobile, sem exceções JavaScript, e novamente as 20 verificações do leitor. Conferidas larguras de 320/360/390/430 px, letras de até 200%, orientação horizontal e interações com eventos de toque para favoritos, filtros, rota e busca. Capturas inspecionadas em `identidade-visual/revisao/mobile`. A validação usou emulação no Chrome e eventos de voz simulados; aparelhos físicos e reprodução sonora real não foram avaliados.
