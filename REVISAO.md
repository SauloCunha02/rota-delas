# Revisões da aplicação

## Correções após uso — 02/10/2026

O usuário relatou atualizações pouco claras ao marcar escolhas e limpeza da rota que não restaurava a seção. Adicionados resumo em tempo real e contador de temas; a limpeza agora reinicia preferências, seleção, próximo passo, estado salvo e Story, preservando favoritos e acessibilidade. Os objetivos aprender e criar passaram a usar sequências distintas. A ordem de temas recebidos por link foi normalizada para preservar os recursos e o próximo passo.

A auditoria inicial reproduziu cinco falhas adicionais: cópia alternativa fora do diálogo ativo, cancelamento da imagem ao fechar/reabrir rapidamente, empilhamento de diálogos por atalho, aviso de link inválido substituído por mensagem de sucesso e foco não restaurado ao fechar a prévia do cadastro por Esc. Foram corrigidas e incorporadas à revisão.

Também conferidos bloqueio de armazenamento/clipboard, cópia manual, compartilhamento indisponível ou repetido, arquivos PNG, navegador sem voz, retorno pelo histórico, leitura pausada nos diálogos, rótulos que não iniciam voz, cinco paletas, fontes, espaçamento e letras de até 200%.

Resultado: **265 verificações funcionais aprovadas**, sendo 94 da auditoria ampliada e 171 das revisões anteriores repetidas. Não houve exceções JavaScript nos cenários de navegador verificados. Referências locais e IDs das duas páginas foram conferidos separadamente. Relatórios ficam em identidade-visual/revisao/auditoria e demais pastas de revisão.

A revisão usa Chrome com emulação móvel; voz e compartilhamento nativo são simulados. Não houve publicação em rede social nem envio fictício de cadastro. A tentativa de conferir links institucionais por HTTP teve respostas 200, bloqueios 403 e falhas de conexão; não autoriza afirmar indisponibilidade das iniciativas nem atualizar suas datas de consulta documental. Isso não representa garantia universal de ausência de falhas ou certificação de acessibilidade.

## Rotas personalizadas e Stories — 02/10/2026

Implementadas preferências de tema, objetivo e formato, justificativas das indicações, troca, próximo passo, salvamento local, exclusão e reabertura por link. Os critérios e limites estão em PERSONALIZACAO.md. O catálogo mantém 63 recursos; não foram inventados níveis ou requisitos que as fontes não informam.

Adicionados três modelos de Story com três paletas e quatro frases. O navegador desenha a marca e exporta PNG 1080 × 1920, com prévia descrita em texto, download, cópia de link/legenda e compartilhamento de arquivo onde houver suporte. A publicação no Instagram é feita pela usuária.

Passaram 171 verificações: 34 de personalização e Stories, 40 da interface, 39 mobile, 38 de catálogo/cadastro e 20 do leitor. A seleção foi conferida também em uma matriz de áreas, estados, objetivos e formatos. O teste de download produziu arquivo com assinatura PNG e dimensões verificadas. Os três cartões e as capturas finais foram inspecionados; o cabeçalho do modal foi corrigido em 200% para manter espaço de leitura e rolagem.

Limites: compartilhamento exercitado com substitutos da API, sem publicação em rede social; emulação de telas não substitui aparelhos físicos. Não foram medidos engajamento ou participação feminina. Os links compartilhados expõem as escolhas na URL por iniciativa da usuária; a interface informa essa condição.

Autoavaliação técnica interna: **9,5/10**, considerando funcionamento, documentação das fontes, clareza/acessibilidade, adequação documental ao CFC e privacidade. Mantêm-se as limitações de validação com aparelhos físicos, leitores de tela e impacto social. A nota não prevê avaliação da banca nem certifica acessibilidade.

## Organização, navegação e participação — 02/10/2026

A versão anterior foi preservada pela tag e release `rotadelasv2`, no commit `f3bf7209c6d1430255723c386d02f1bc0c7ba50e`. A versão atual mantém os 63 registros e prioriza o Ceará junto com recursos nacionais, sem restringir a consulta ao Brasil. Foram definidas quatro áreas e 14 temas, com campos validados no gerador; a data desta organização não substitui as datas de consulta das fontes.

O formulário completo fica em `cadastro.html`, acessível por uma chamada curta na página inicial. O remetente confere a prévia antes de abrir o GitHub e confirma o envio na plataforma. O link de cadastro não solicita etiquetas que exigiriam permissão de colaborador. O workflow do repositório aplica `cadastro` e `em-revisao` depois da abertura de uma issue com o prefixo esperado; a inclusão no catálogo continua dependendo da curadoria humana.

O botão de acessibilidade fica no cabeçalho. No celular, a barra inferior oferece Buscar, Rota, Salvos e Mais. O leitor ocupa o espaço acima da barra, mantém os controles principais disponíveis e permite rolar as opções com letras ampliadas, inclusive em orientação horizontal. A navegação comum não inicia a leitura; durante a leitura, a mudança de seção atualiza seu escopo. Os rótulos do formulário podem ser narrados, sem incluir os valores digitados.

Passaram 137 verificações: 40 da nova interface, 39 mobile, 20 do leitor e 38 do catálogo nacional e cadastro. Foram verificadas larguras de 320, 360, 390, 430 e 844 px, letras de até 200%, cinco paletas, filtros combinados, rotas, favoritos, modais, teclado, prévia do cadastro e compatibilidade com links antigos. As capturas finais foram inspecionadas. Relatórios e scripts estão em `identidade-visual/revisao` e `identidade-visual/revisar-*.mjs`.

Limites: a validação usa Chrome com emulação móvel e eventos de voz simulados. Não substitui testes em aparelhos físicos, reprodução sonora real, revisão linguística de Libras ou auditoria formal com leitores de tela. Nenhuma issue fictícia foi enviada, portanto a classificação de uma solicitação real pelo novo workflow não foi exercitada de ponta a ponta. Não foram medidos efeitos sociais nem prometidas vagas nas iniciativas.

Autoavaliação interna: funcionamento 3/3, organização e fontes 1,9/2, clareza e acessibilidade 1,9/2, adequação documental ao CFC 1,8/2 e privacidade 0,9/1, totalizando **9,5/10**. A nota é uma avaliação da entrega técnica; não representa nota da banca nem certificação de acessibilidade. O envio pelo GitHub é público e essa condição aparece antes do envio.

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
