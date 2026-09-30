# Rota Delas — proposta de projeto para o Ceará Faz Ciência 2026

**Área sugerida:** Ciências Sociais Aplicadas / Engenharias (desenvolvimento de software), a confirmar com o professor orientador conforme a árvore CNPq.  
**Tema:** Ciência Delas.  
**Equipe:** preencher com os nomes reais dos alunos titulares e do professor orientador.

## Problema e justificativa

No Ceará existem iniciativas que aproximam meninas da ciência e da tecnologia, como o Projeto Lua e o DIVAS no IFCE e o Meninas Digitais do Vale na UFC. Também há competições e materiais nacionais que podem servir de porta de entrada. Essas informações estão distribuídas em páginas de instituições diferentes. A Rota Delas propõe reuni-las em uma interface de consulta que ajuda uma estudante do Ensino Médio a encontrar um primeiro caminho de acordo com sua área de interesse.

Esta justificativa descreve a existência e a dispersão das fontes consultadas. **Ela não afirma que o público-alvo desconhece tais oportunidades**, pois isso exigiria investigação com pessoas.

## Objetivo geral

Desenvolver e avaliar tecnicamente uma aplicação web que organize caminhos públicos de ciência e tecnologia para estudantes do Ensino Médio, com ênfase na participação de meninas no Ceará.

## Objetivos específicos

1. Localizar e classificar fontes institucionais sobre projetos, estudos, visitas e competições.
2. Implementar busca, filtros, favoritos locais e rotas por área de interesse.
3. Conferir a correspondência entre os cartões e suas fontes, a operação das funções e a adaptação a telas pequenas.
4. Documentar os limites da aplicação e o procedimento necessário para atualizar os dados.

## Fundamentação inicial

O [Programa Meninas Digitais da Sociedade Brasileira de Computação](https://meninasdigitais.com.br/sobre-nos/) atua para despertar o interesse de meninas por carreiras em tecnologia. O [Projeto Lua do IFCE](https://projetolua.ifce.edu.br/) e o [Projeto DIVAS do IFCE](https://portal.ifce.edu.br/campus/aracati/extensao/divas/) são exemplos cearenses já existentes. Essas iniciativas são **referências e fontes**, com autoria própria reconhecida; a Rota Delas desenvolve um mecanismo de consulta e rotas com conteúdo curado de diferentes instituições.

## Metodologia

1. **Levantamento documental:** consultar páginas oficiais de universidades, institutos, olimpíadas e programas. Registrar título, URL, tipo, área, local, descrição e data da verificação.
2. **Curadoria:** incluir recursos pertinentes ao Ensino Médio ou úteis como preparação. Evitar anunciar vagas ou prazos sem confirmação na fonte.
3. **Desenvolvimento:** implementar a interface em HTML/CSS/JavaScript. A busca normaliza acentos; os filtros combinam área e tipo; as rotas têm três passos definidos por área; os favoritos ficam no navegador.
4. **Avaliação técnica:** testar busca, combinação de filtros, ausência de resultados, rotas, favoritos após recarga, cópia, navegação por teclado e disposição em computador e celular. Conferir os links por resposta HTTP e inspeção das páginas de origem.
5. **Registro:** guardar versões, decisões, problemas e correções no caderno de campo da equipe.

## Resultados técnicos observados em 28/09/2026

- Aplicação funcional com **13 recursos** e fontes institucionais.
- Busca, filtros combináveis, favoritos locais e rotas de três passos nas áreas de Tecnologia, Ciência e Matemática.
- Revisão visual em computador e em largura móvel de 390 px; o primeiro recurso aparece na primeira tela móvel.
- Os 13 links foram consultados por resposta HTTP; endereços antigos que retornaram erro foram substituídos por páginas institucionais acessíveis.

Esses resultados comprovam a implementação e a avaliação técnica realizada, **não o impacto social junto a estudantes**. Não foram feitas entrevistas, questionários nem testes com participantes.

## Inclusão e sustentabilidade

A página é gratuita, não exige conta, funciona em celular e apresenta links para fontes públicas. O formato digital permite compartilhar e atualizar o catálogo sem material impresso. O projeto não estima redução ambiental nem mede inclusão efetiva; esses pontos são objetivos de design a discutir, não resultados demonstrados.

## Limitações e próximos passos

O catálogo exige revisão periódica, porque páginas e regras podem mudar. A equipe pode ampliar a cobertura de municípios e áreas científicas após verificar novas fontes. Uma avaliação de uso com estudantes dependerá de planejamento próprio e da orientação ética aplicável.
