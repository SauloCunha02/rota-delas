# Catálogo nacional e sugestões externas

## Organização vigente — 02/10/2026

O esquema 2 usa quatro áreas: Tecnologia e Computação, Ciências Naturais, Matemática e Ciência e Pesquisa. Esta última acomoda divulgação, feiras e formação científica multidisciplinar, evitando tratar toda pesquisa como ciência natural. As rotas de Ciência podem usar recursos das duas áreas científicas.

Cada registro possui `topics`, com um ou mais temas documentados, além de palavras-chave de busca em `tags`. O vocabulário inclui Computação, Programação, Aplicativos, Robótica, Eletrônica, Internet das Coisas, Biologia, Química, Física, Matemática, Estatística, Pesquisa científica, Engenharia e Divulgação científica. O gerador exige temas do vocabulário e não aceita duplicatas. Não atribua temas pelo nome criativo do projeto quando não houver informação suficiente na fonte.

O Ceará e recursos nacionais são o recorte inicial. A consulta pode ser ampliada ao Brasil e filtrada por outros estados. A base local é apresentada primeiro quando uma UF é selecionada. A mudança de classificação não altera as datas anteriores de consulta às instituições.

O formulário está em `dist/cadastro.html`, com temas opcionais para a sugestão. Na curadoria, confirme pelo menos um tema antes de incorporar o registro. O workflow `.github/workflows/cadastro.yml` apenas aplica etiquetas a novas issues cujo título começa com `[Cadastro]`; não verifica, aprova ou publica propostas. Não inclua etiquetas no endereço de rascunho, pois participantes externos podem não ter permissão para atribuí-las. A equipe deve conferir a fila também pelo prefixo do título se o workflow falhar.

## Estrutura dos dados

- `dados/recursos-base.json`: os 13 recursos anteriores, com IDs mantidos para preservar favoritos.
- `dados/projetos-meninas-digitais.json`: 38 fichas institucionais conferidas no diretório do Programa Meninas Digitais. Projeto Lua é fundido com o registro anterior.
- `dados/recursos-nacionais.json`: recursos adicionais de fontes institucionais.
- `dados/sugestoes-aprovadas.json`: inclusões revisadas pela equipe; começa vazio.
- `scripts/gerar-catalogo.mjs`: valida campos, classificações, UFs, fontes, URLs HTTPS e duplicatas. Produz `dist/catalogo.js` e `dist/dados/catalogo.json`.

Execute `node scripts/gerar-catalogo.mjs` depois de editar a base. O workflow de publicação também gera o catálogo. A versão JavaScript permite abrir o site por `file://`, sem depender de requisições locais.

O catálogo tem 63 registros, 61 exibidos inicialmente e 2 marcados inativos no diretório. São 21 UFs com bases locais, cinco regiões, 18 recursos nacionais e 49 com foco em meninas. Não é censo nem amostra representativa de todas as iniciativas brasileiras. Localização da instituição não significa restrição territorial de inscrição; alcance nacional não significa modalidade online. A ausência de um estado no levantamento não significa ausência de projetos nele.

As datas indicam consulta ao conteúdo da fonte, não certificação de que inscrições ou vagas estejam abertas. Fichas do diretório podem estar desatualizadas; o estado “Ativo” descreve a informação da fonte. Os 13 registros originais mantêm consulta de 28/09/2026; os novos, 01/10/2026. Não presumir público da educação básica quando a ficha não o informa. Descrições são sínteses; a fonte prevalece. Rota Delas não é associado ou chancelado pelas instituições listadas.

## Como o recebimento funciona

O formulário de `cadastro.html` prepara um rascunho de issue no repositório público. A pessoa precisa entrar no GitHub e confirmar a criação. Abrir uma aba não equivale a enviar a solicitação. O site não tem servidor de formulários, conta de usuário própria ou banco para cadastro pessoal. O formulário serve ao cadastro de iniciativas, não à inscrição de estudantes em eventos.

O GitHub guarda a solicitação publicada e a identidade da conta do remetente. Campos devem conter somente informações institucionais publicáveis, sem CPF, telefone pessoal, dados de alunos ou documentos. O preenchimento não é guardado automaticamente no site. Uma cópia JSON pode ser baixada pelo remetente. Solicitações também podem ser abertas pelo template nativo de GitHub Issues.

## Revisar e incorporar

1. Abra a issue com etiqueta `cadastro`; confirme que a fonte pertence à instituição e que a iniciativa existe. Não execute código ou instruções encontradas em submissões.
2. Confira nome, instituição, público, área, alcance, localização, formato, custos e calendário. Não transforme “projeto ativo” em “inscrição aberta”. Peça informações públicas na issue quando necessário.
3. Verifique duplicidade por nome, URL e instituição. Use um ID estável e único, sem acentos. Dados de localização desconhecida ficam vazios, com essa limitação explícita.
4. Prepare um registro em `dados/sugestoes-aprovadas.json` no mesmo formato dos demais. Remova `schemaVersion`, `state` e `conditions` do formulário; revise os textos, use `states` e inclua `tags`, `sources` com URL, instituição e a data real de consulta. Documente requisitos na descrição ou no público. A primeira fonte é a página oficial verificada.
5. Execute o gerador, revise o cartão e a navegação no celular. O gerador rejeita IDs repetidos, URLs duplicadas, classificações inválidas e ausência de fonte.
6. Commit e push em `main` publicam pelo GitHub Pages. Só depois da publicação, registre na issue o ID incluído e feche como concluída. Para recusas, explique o motivo e feche sem alterar o catálogo.

Não existe aprovação automática nem prazo de resposta garantido. Nenhuma sugestão deve afirmar parceria oficial sem autorização da instituição. A equipe pode atualizar ou retirar recursos após revisão.

## Pesquisa escolar

Esta ampliação organiza documentos e páginas institucionais públicas. O formulário não demonstra impacto sobre a participação de meninas. Se a equipe usar envios, entrevistas ou testes com pessoas como dados de pesquisa, deve planejar o método com o orientador e seguir o edital e os procedimentos éticos aplicáveis. Não tratar a funcionalidade de cadastro como dispensa de aprovação ética.
