# Missões Delas e Agenda Delas

Versão de 06/10/2026. Atividades autorais em dados/jornada-fonte.mjs; dados publicados em dist/dados/jornada.json e dist/jornada-dados.js. Gerar com node scripts/gerar-jornada.mjs, após a geração do catálogo.

## Missões

Três trilhas (Programação, Matemática e Investigação Científica), cada uma com quatro atividades. Cada missão declara tempo estimado, materiais, instruções, entrega, três conferências e recursos do catálogo. Os tempos são orientações pedagógicas, sem cronômetro obrigatório. As atividades não são cursos ou certificados das instituições citadas.

A trilha pode seguir a área da Minha rota ou ser escolhida livremente. Registros e seleção usam rota-delas-missoes-v1 no localStorage. Começar, pausar, retomar, concluir e reabrir funcionam sem conta. A entrega tem até 6000 caracteres. Concluir exige registro de pelo menos 30 caracteres e as três conferências marcadas; é uma declaração da estudante, sem avaliação ou validação externa. A exportação em TXT conserva uma cópia da trilha escolhida. Limpar Minha rota não apaga as missões, os eventos ou os favoritos.

As atividades de investigação usam documentos públicos. A atividade de gráfico usa números explicitamente fictícios. Nenhuma atividade propõe entrevistas, questionários, coleta de dados pessoais ou contato com participantes. Uma pesquisa com pessoas teria planejamento próprio com o orientador, conforme o edital.

## Agenda

Nove registros documentados: encerramento de inscrição e prova da CF-OBI (histórico); prazo, resultado previsto e mostra CFC; Feira do Conhecimento; prova e resultado da OBMEP; Semana Olímpica da OBI. A agenda não é uma lista de vagas abertas. Participação restrita, local físico, data prevista e encerramento aparecem nas fichas. Alcance nacional não garante participação online.

Fontes consultadas em 06/10/2026:

- CFC: https://feiradoconhecimento.com.br/wp-content/uploads/2026/09/Edital-CFC-202601.pdf (cabeçalho e itens 5.1 e 9.2).
- Feira: https://feiradoconhecimento.com.br/ (datas e local na página inicial; programação individual não importada).
- OBI: https://olimpiada.ic.unicamp.br/calendario/datas_importantes (CF-OBI e Semana Olímpica).
- OBMEP: https://www.obmep.org.br/docs/2026/anexoI.pdf (prova da segunda fase e divulgação de premiados).

A equipe deve revisar fontes semanalmente no período de inscrições e antes de publicar alterações. Atualizar checkedAt somente após nova consulta; preservar o histórico e indicar mudanças. Depois de 14 dias sem conferência, a ficha recomenda revisão. Não há serviço externo de monitoramento automático. O estado temporal usa a data de Brasília e a data registrada; não infere elegibilidade ou alteração de edital.

Filtros de busca, área, tipo, alcance, período, favoritos e dia do calendário combinam-se imediatamente. O calendário tem navegação por mês e setas; datas em intervalos aparecem em todos os dias do intervalo. Eventos salvos usam rota-delas-agenda-v1 no navegador.

## Exportação para calendário

Exporta um evento ou o conjunto filtrado para ICS (RFC 5545), com UID estável, fonte, data de consulta, descrição e local. Dias inteiros usam DTEND exclusivo, um dia depois do término. A prova OBMEP usa início 14h30 de Brasília convertido para 17h30 UTC; o horário final não é inventado. Datas sem hora permanecem dias inteiros. O lembrete opcional de um dia antes é um VALARM executado pelo aplicativo da usuária, não notificação do site. Importação não realiza inscrição nem sincroniza mudanças futuras. Importar novamente o mesmo UID depende do comportamento do aplicativo escolhido.

## Privacidade e acessibilidade

Sem envio de registros à equipe. Bloqueio de armazenamento gera aviso explícito; os registros continuam válidos para a sessão e podem ser exportados. Fontes são links externos. Preferências de acessibilidade existentes valem para as novas seções: paletas, tamanho, espaçamento, teclado e leitor. Valores digitados em textarea não são narrados pelo leitor. As missões não comprovam impacto social ou certificação de acessibilidade.

## Revisão técnica da entrega

Em 06/10/2026, 74 verificações das novas áreas passaram no Chrome em ambiente automatizado: fluxo de todas as 12 missões; progresso, pausa, retomada e persistência; escolha livre e relação com a rota; filtros e estado vazio; calendário por intervalo e teclado; geração e download de ICS/TXT; leitura assistida; armazenamento bloqueado; IDs únicos e ausência de exceções JavaScript. A data do navegador é controlada em 06/10/2026 para reproduzir os recortes temporais.

A revisão visual incluiu larguras de 320, 390, 844 e 1440 px, cinco paletas e texto até 200%. A leitura utiliza voz simulada para verificar os controles; reprodução sonora real depende do navegador. O ICS foi inspecionado no conteúdo gerado, sem afirmar testes em todos os aplicativos de calendário. As 265 verificações existentes também passaram. Evidências e script estão em identidade-visual/revisao/jornada e identidade-visual/revisar-jornada.mjs. Para rever a versão hospedada, defina ROTA_TEST_URL com o endereço completo do site antes de executar o script.

Após a publicação no Firebase, as mesmas 74 verificações passaram no endereço hospedado. O relatório e as capturas estão em identidade-visual/revisao/jornada-online.
