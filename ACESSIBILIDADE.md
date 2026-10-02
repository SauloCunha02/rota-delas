# Acessibilidade do Rota Delas

## Correções de interação — 02/10/2026

O leitor pausa ao abrir um diálogo e reaparece pausado ao fechá-lo. Caixas, rótulos de campos e resumos expansíveis não disparam leitura involuntária. Alt + A troca o diálogo atual pelo painel de acessibilidade; Alt + L inicia a leitura quando o conteúdo ou o próprio painel estão disponíveis. A cópia alternativa usa o diálogo ativo, com campo selecionável quando a permissão é recusada. O retorno de página pelo histórico não mantém um estado de voz que já foi cancelado. Sem síntese de voz, a interface informa a limitação e conserva os recursos escritos.

## Rotas e criação de Stories — 02/10/2026

As novas preferências têm rótulos e avisos acessíveis. A troca e a escolha de próximo passo preservam o foco; o editor de Story é um diálogo nativo com fechamento por Esc e retorno ao botão que o abriu. A imagem tem descrição textual, controles de paleta e frase, e alternativa de download quando o compartilhamento não estiver disponível. Conferidos 320/390 px, orientação horizontal e letras de até 200%. Os rótulos dos temas e objetivos entram no leitor, sem incluir valores de controles.

## Navegação atual — 02/10/2026

O botão com símbolo de acessibilidade fica no cabeçalho, em ambas as páginas. No celular, Buscar, Rota, Salvos e Mais ficam na barra inferior; Mais também oferece atalhos de acessibilidade e Libras. O cabeçalho e a barra reservam espaço na rolagem. O player aparece acima da barra, sem ativar a voz por navegar entre seções. Seu estado acompanha a seção quando a leitura está habilitada.

O controle de posição entra nas opções roláveis ao expandir o leitor. No celular deitado, o trecho atual também entra nessa área quando expandido, liberando espaço para manter o transporte visível. Ao recolher, posição e trecho voltam à parte fixa do leitor. Diálogos ocultam o player temporariamente e mantêm foco de teclado; Esc fecha o diálogo antes de interromper a voz.

A página de cadastro mantém preferências locais e leitura das instruções, rótulos e temas. O leitor não inclui valores digitados nos campos. A integração oficial de VLibras permanece e precisa de internet. Não foi feita certificação WCAG nem avaliação com leitores de tela ou aparelhos físicos nesta alteração.

## Como usar

Abra o botão com o **símbolo de acessibilidade**, no cabeçalho. O botão mantém o nome acessível para leitores de tela. O painel tem estes recursos:

- **Letras:** aumente em passos de 25%, até 200%, pelo controle ou pelos botões A− e A+.
- **Perfis rápidos:** leitura assistida, baixa visão, menos movimento e foco na linha aplicam conjuntos de preferências personalizáveis. O painel lateral, a organização dos recursos e os perfis foram inspirados em [Cartografias do Abandono](https://saulocunha02.github.io/cartografias-do-abandono/).
- **Fonte de alta legibilidade e espaçamento:** use Atkinson Hyperlegible e amplie os espaços entre linhas, letras e palavras. Os arquivos regular e negrito estão em `dist/assets/fontes`, com licença OFL incluída; a fonte fica disponível no projeto local.
- **Baixa visão:** aplique letras em 150%, alto contraste claro, fonte de alta legibilidade, maior espaçamento, links destacados, movimento reduzido, cursor ampliado e foco reforçado. Cada ajuste pode ser alterado.
- **Cores:** escolha a marca, contraste claro ou escuro. O seletor de paletas alternativas oferece azul/amarelo, azul/laranja, vinho/turquesa e cinza. A escolha é individual; o alto contraste tem prioridade sobre as paletas alternativas.
- **Guia e máscara de leitura:** acompanham o ponteiro ou podem ser arrastados pelo botão ↕. Dê foco a esse botão e use as setas para mover 24 px por vez; Home e End levam aos extremos. A máscara escurece a área fora de uma faixa de 96 px. Guia e máscara são opções exclusivas: ativar uma desativa a outra.
- **Cursor e foco:** amplie o ponteiro e aumente o contorno de foco na navegação por teclado.
- **Links destacados e movimento reduzido:** facilite a identificação dos links e desative animações e rolagem suave. A preferência de movimento reduzido do sistema também é respeitada.
- **Voz:** escolha uma seção ou selecione texto na página antes de abrir o painel. Ative Leitura por parágrafo para ouvir um parágrafo ao tocá-lo. Use Ouvir texto, Pausar/Continuar e Parar. Os controles flutuantes permitem avançar e voltar entre trechos e interromper a voz após fechar o painel. Fechar os controles interrompe a leitura e desativa o modo de leitura por parágrafo.
- **Conteúdo escrito:** o trecho narrado e os avisos aparecem por escrito. O uso do aplicativo não exige ouvir sons.
- **Libras:** use o botão oficial de mãos na lateral direita ou a opção Abrir tradutor de Libras no painel. A opção Tradutor de Libras mostra ou oculta o widget. O VLibras traduz textos por meio de seu avatar e precisa de internet. Ao abrir pelo painel, este é fechado para liberar a interação com o tradutor. Se o carregamento falhar, aparece um aviso e o botão permite tentar novamente.
- **Restaurar:** retorne às preferências originais, sem apagar favoritos.

As preferências ficam no navegador deste aparelho. Quando o armazenamento estiver bloqueado, os ajustes continuam funcionando durante a visita e o painel avisa que não foram salvos.

## Teclado e leitores de tela

O primeiro link pula para o conteúdo principal. Tab e Shift + Tab percorrem os controles; Enter e Espaço ativam os botões. As setas ajustam o controle de tamanho de letras. Esc fecha o painel e devolve o foco ao botão que o abriu. O diálogo nativo mantém a navegação por teclado dentro do painel enquanto ele está aberto.

Alt + A abre ou fecha o painel e devolve o foco ao controle usado anteriormente. Alt + L inicia a leitura da seção escolhida. Fora do painel, Esc interrompe a leitura em andamento. Os atalhos podem ser reservados por alguns navegadores ou leitores de tela; os controles visíveis continuam disponíveis.

Filtros e opções de rota preservam o foco após a atualização. Favoritos usam rótulos com o nome do item e estado pressionado. A contagem de resultados, a alteração de favoritos e a criação da rota têm avisos para leitores de tela. Links externos informam em seus rótulos que abrem outra aba. Os filtros selecionados têm também uma marca de seleção, e os favoritos mudam a forma do coração.

## Voz e disponibilidade

A leitura usa `SpeechSynthesis`. O aplicativo procura uma voz em português e prefere uma voz local em português do Brasil, quando disponível. Algumas vozes dependem de serviços pela internet. Se a API de voz estiver indisponível, o painel informa isso e mantém o conteúdo escrito acessível. Erros de síntese são apresentados por escrito. A voz integrada complementa o leitor de tela do usuário.

### Controle da leitura

O player permite escolher toda a página, uma seção ou texto selecionado. Toque em um parágrafo com a leitura por parágrafo ativada para começar ali e continuar no conteúdo seguinte. O mapeamento mantém uma ligação com os elementos reais da página e não insere marcações dentro dos links ou altera os cartões.

- **Posição:** contador e barra mostram o trecho atual no total de trechos preparados. A barra permite pular diretamente para um trecho; ela representa posição textual, sem estimar segundos de áudio.
- **Play/Pausa e Parar:** a pausa preserva a leitura. Navegar ou alterar a velocidade durante a pausa mantém a voz pausada. Parar encerra a voz e preserva os controles de navegação.
- **Velocidade:** seletor e botões −/+ ajustam de 0,5× a 2× em passos de 0,25. Durante a leitura, a voz retoma da última palavra sincronizada; quando a voz não informa palavras, retoma o trecho atual.
- **Trechos:** anterior/próximo funcionam com a voz em reprodução, pausada ou parada. No player, use setas esquerda/direita; com a região do player em foco, Espaço alterna Play/Pausa. Se um campo estiver em foco, suas setas mantêm o comportamento nativo.
- **Destaque:** o trecho aparece destacado na página e no player. A palavra é destacada apenas quando a voz informa eventos `boundary`; o navegador que não oferece esses eventos mantém o destaque por trecho.
- **Rolagem:** Acompanhar trecho ativa/desativa a rolagem automática. Localizar trecho posiciona a página no trecho selecionado.
- **Recolher:** esconde as opções mantendo os controles principais, a posição, a velocidade indicada e o trecho atual. No celular, o leitor abre recolhido. Toque na velocidade para abrir suas opções; o botão de seta expande/recolhe o painel.

### Uso no celular

O leitor fica na base da tela. Anterior, Play/Pausar, próximo, Parar, posição e trecho continuam disponíveis com as opções recolhidas. O trecho pode ser rolado e acompanha a palavra sincronizada quando a voz fornece esse evento.

As opções têm rolagem própria para preservar os controles principais, inclusive com letras ampliadas. O botão de velocidade abre as opções e dá foco ao seletor. Com o painel expandido, os atalhos Acessibilidade e Libras ficam dentro das opções. A acessibilidade permanece no cabeçalho e o leitor reserva espaço acima da barra inferior. Na orientação horizontal, o leitor fica à direita; a integração oficial de Libras mantém espaço livre à esquerda.

## Revisão mobile — 01/10/2026

Foram aprovadas 39 verificações no Chrome emulado, cobrindo 320, 360, 390 e 430 px, letras de 100% e 200%, orientação horizontal, posição dos atalhos, controles tocáveis, opções com rolagem, diálogo de acessibilidade e interações de toque com filtros, favoritos, rota e busca. As 20 verificações de estados e sincronização do leitor foram executadas novamente. Capturas e relatório mobile estão em `identidade-visual/revisao/mobile`.

As capturas foram inspecionadas. A emulação não substitui avaliação em celulares físicos; reprodução sonora real e qualidade da tradução de Libras não foram avaliadas nesta revisão.

Alterar resultados ou remover conteúdo lido cancela a fila anterior e permite iniciar uma leitura com o conteúdo atualizado. Eventos antigos de cancelamento e fim são descartados para evitar saltos ou vozes simultâneas.

O novo leitor passou por 20 verificações de estado e sincronização, com eventos de voz simulados, incluindo destaque ligado ao DOM, callbacks antigos, velocidade com voz pausada/ativa, navegação, barra de posição, filtros, teclado e layout em 390/320 px. A reprodução sonora real continua dependente das vozes do navegador. Capturas e relatório estão em `identidade-visual/revisao/leitor`.

## Revisão realizada em 30/09/2026

- Sintaxe dos dois arquivos JavaScript conferida com `node --check`.
- 113 verificações aprovadas no Chrome em modo headless, sem exceções JavaScript.
- Página e painel conferidos em 1440, 390 e 320 px, com tamanhos de letras de 100%, 150% e 200% nas cinco paletas, sem rolagem horizontal.
- Foco após filtros, favoritos e escolha de rota; fechamento por Esc; restauração e persistência das preferências conferidos.
- Capturas do painel em computador e celular e do ajuste de baixa visão inspecionadas.
- Perfis rápidos, paletas alternativas, prioridade do alto contraste, exclusividade entre máscara e guia, movimento da faixa pelo teclado, fonte local e atalho Alt + A conferidos.
- Fluxo de iniciar, pausar, continuar e parar a leitura conferido com um substituto da API de voz. A reprodução de som real não foi avaliada pelo navegador headless.

As capturas e o relatório ficam em `identidade-visual/revisao/acessibilidade`. Uma auditoria completa de WCAG, o uso com leitores de tela reais e a avaliação com pessoas com deficiência ainda precisam ser realizados. A revisão registrada é técnica e não constitui certificação de conformidade.

## Referências de implementação

- [W3C — Reflow: reorganização do conteúdo em telas estreitas](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html).
- [W3C — Use of Color: informação compreensível além da cor](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html).
- [MDN — elemento dialog](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog).
- [MDN — SpeechSynthesis](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis).
- [VLibras — integração oficial do widget](https://www.vlibras.gov.br/doc/widget/installation/webpageintegration.html).
- [Google Fonts — fonte Atkinson Hyperlegible e licença](https://github.com/google/fonts/tree/main/ofl/atkinsonhyperlegible).
- [MDN — eventos de sincronização da voz](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesisUtterance/boundary_event).
- [MDN — CSS Custom Highlight API](https://developer.mozilla.org/en-US/docs/Web/API/CSS_Custom_Highlight_API).
