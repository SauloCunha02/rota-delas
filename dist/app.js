const resources = [
  {
    id: 'lua', title: 'Projeto Lua', kind: 'Projeto', area: 'Tecnologia', place: 'Ceará · Tianguá',
    description: 'Iniciativa criada por alunas do IFCE para apoiar meninas e mulheres na tecnologia por meio de conteúdos e ações.',
    url: 'https://projetolua.ifce.edu.br/', tags: ['computação', 'meninas', 'comunidade', 'iniciativa'],
    routeRole: 'inspirar'
  },
  {
    id: 'divas-aracati', title: 'Projeto DIVAS', kind: 'Projeto', area: 'Tecnologia', place: 'Ceará · Aracati',
    description: 'Projeto do IFCE Aracati que aproxima meninas das tecnologias da informação, com cursos e ações de extensão.',
    url: 'https://portal.ifce.edu.br/campus/aracati/extensao/divas/', tags: ['programação', 'informática', 'ifce', 'oficinas'],
    routeRole: 'participar'
  },
  {
    id: 'meninas-vale', title: 'Meninas Digitais do Vale', kind: 'Projeto', area: 'Tecnologia', place: 'Ceará · Russas',
    description: 'Projeto da UFC em Russas com ações para aproximar meninas da computação e apoiar mulheres na área.',
    url: 'https://extensaorussas.ufc.br/pt/projetos/2026-4/tecnologia-e-producao/', tags: ['computação', 'ufc', 'oficinas', 'mentoria'],
    routeRole: 'participar'
  },
  {
    id: 'mulheres-ct', title: 'Mulheres em C&T', kind: 'Projeto', area: 'Ciência', place: 'Ceará · Fortaleza',
    description: 'Projeto de extensão da UFC dedicado a aproximar estudantes da ciência e da tecnologia e mostrar trajetórias de pesquisadoras.',
    url: 'https://deti.ufc.br/pt/resultado-final-selecao-agente-ufc-de-extensao-edital-16-2026-projeto-mulheres-em-ct/', tags: ['pesquisa', 'ufc', 'mulheres', 'trajetórias'],
    routeRole: 'inspirar'
  },
  {
    id: 'seara', title: 'Seara da Ciência', kind: 'Visita', area: 'Ciência', place: 'Ceará · Fortaleza',
    description: 'Museu interativo da UFC com visitação gratuita e atividades de divulgação científica. Veja como agendar no site.',
    url: 'https://seara.ufc.br/pt/agendamento/', tags: ['museu', 'experimentos', 'visita', 'ufc'],
    routeRole: 'participar'
  },
  {
    id: 'divas-tiangua', title: 'DIVAS em Tianguá', kind: 'Projeto', area: 'Tecnologia', place: 'Ceará · Tianguá',
    description: 'Ações do IFCE com oficinas de pensamento computacional e criação de aplicativos para estudantes de escolas públicas.',
    url: 'https://portal.ifce.edu.br/campus/tiangua/not%C3%ADcias/projeto-divas-recebe-premio-de-projeto-destaque-da-regiao-nordeste/', tags: ['aplicativos', 'computação', 'ifce', 'oficinas'],
    routeRole: 'participar'
  },
  {
    id: 'meninas-digitais', title: 'Programa Meninas Digitais', kind: 'Rede', area: 'Tecnologia', place: 'Brasil · online',
    description: 'Rede da Sociedade Brasileira de Computação que reúne projetos para despertar o interesse de meninas pela área.',
    url: 'https://meninasdigitais.com.br/sobre-nos/', tags: ['computação', 'comunidade', 'oficinas', 'rede'],
    routeRole: 'inspirar'
  },
  {
    id: 'obi', title: 'OBI e Competição Feminina', kind: 'Competição', area: 'Tecnologia', place: 'Brasil · escolas',
    description: 'Olimpíada de informática com modalidade de programação e competição feminina. Confira no site as regras e o calendário.',
    url: 'https://olimpiada.ic.unicamp.br/', tags: ['programação', 'olimpíada', 'desafio', 'escola'],
    routeRole: 'desafiar'
  },
  {
    id: 'obi-estude', title: 'Cursos de programação da OBI', kind: 'Estudo', area: 'Tecnologia', place: 'Brasil · online',
    description: 'Materiais gratuitos para quem quer começar a programar, disponíveis no ambiente de estudos da OBI.',
    url: 'https://olimpiada.ic.unicamp.br/prepare/estude/', tags: ['programação', 'curso', 'gratuito', 'iniciantes'],
    routeRole: 'aprender'
  },
  {
    id: 'obmep', title: 'Portal da OBMEP', kind: 'Estudo', area: 'Matemática', place: 'Brasil · online',
    description: 'Materiais gratuitos de matemática para estudantes do Fundamental e do Ensino Médio.',
    url: 'https://portaldaobmep.impa.br/', tags: ['matemática', 'curso', 'gratuito', 'exercícios'],
    routeRole: 'aprender'
  },
  {
    id: 'banco-obmep', title: 'Banco de Questões da OBMEP', kind: 'Estudo', area: 'Matemática', place: 'Brasil · online',
    description: 'Coleção oficial de problemas de matemática para praticar por tema e consultar soluções.',
    url: 'https://www.obmep.org.br/banco.htm', tags: ['matemática', 'questões', 'exercícios', 'gratuito'],
    routeRole: 'praticar'
  },
  {
    id: 'obmep-competicao', title: 'Olimpíada Brasileira de Matemática das Escolas Públicas', kind: 'Competição', area: 'Matemática', place: 'Brasil · escolas',
    description: 'Competição para estudantes do Fundamental e do Médio. A inscrição é feita pela escola; confira o calendário oficial.',
    url: 'https://www.obmep.org.br/', tags: ['matemática', 'olimpíada', 'desafio', 'escola'],
    routeRole: 'desafiar'
  },
  {
    id: 'cfc', title: 'Mostra Ceará Faz Ciência', kind: 'Competição', area: 'Ciência', place: 'Ceará · Fortaleza',
    description: 'Mostra de projetos científicos de escolas públicas dentro da Feira do Conhecimento. Consulte o edital e os prazos no site oficial.',
    url: 'https://feiradoconhecimento.com.br/', tags: ['projeto', 'pesquisa', 'feira', 'cfc'],
    routeRole: 'desafiar'
  }
];

const areas = ['Todas', 'Tecnologia', 'Ciência', 'Matemática'];
const types = ['Todos', 'Projeto', 'Estudo', 'Competição', 'Visita', 'Rede'];
const routeAreas = ['Tecnologia', 'Ciência', 'Matemática'];
const state = { search: '', area: 'Todas', type: 'Todos', routeArea: null, favorites: loadFavorites() };
const byId = new Map(resources.map(item => [item.id, item]));

function loadFavorites() {
  try {
    const value = JSON.parse(localStorage.getItem('rota-delas-favoritos') || '[]');
    return new Set(Array.isArray(value) ? value.filter(id => typeof id === 'string') : []);
  } catch { return new Set(); }
}

function saveFavorites() {
  try { localStorage.setItem('rota-delas-favoritos', JSON.stringify([...state.favorites])); }
  catch { /* A aplicação continua funcional quando o armazenamento estiver bloqueado. */ }
}

function normalize(value) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-BR');
}

function cardMarkup(item) {
  const saved = state.favorites.has(item.id);
  return `<article class="resource-card">
    <div class="card-top"><span class="card-kind">${item.kind}</span><button class="favorite-button" type="button" data-favorite="${item.id}" aria-label="${saved ? 'Remover' : 'Salvar'} ${item.title} ${saved ? 'dos' : 'nos'} favoritos" aria-pressed="${saved}" title="${saved ? 'Remover dos favoritos' : 'Salvar nos favoritos'}">${saved ? '♥' : '♡'}</button></div>
    <h3>${item.title}</h3><p>${item.description}</p>
    <div class="card-bottom"><span>${item.place}</span><a href="${item.url}" target="_blank" rel="noopener noreferrer" aria-label="Abrir fonte oficial de ${item.title} em nova aba">Fonte oficial ↗</a></div>
  </article>`;
}

function renderFilters(containerId, options, key) {
  const container = document.getElementById(containerId);
  if (container.children.length === options.length) {
    container.querySelectorAll('button').forEach(button => button.setAttribute('aria-pressed', String(state[key] === button.dataset.value)));
    return;
  }
  container.innerHTML = options.map(option =>
    `<button type="button" data-filter="${key}" data-value="${option}" aria-pressed="${state[key] === option}">${option}</button>`
  ).join('');
}

function renderCards() {
  const focusId = favoriteFocus('cards');
  const query = normalize(state.search.trim());
  const visible = resources.filter(item => {
    const matchesText = !query || normalize([item.title, item.description, item.place, ...item.tags].join(' ')).includes(query);
    return matchesText && (state.area === 'Todas' || item.area === state.area) && (state.type === 'Todos' || item.kind === state.type);
  });
  document.getElementById('cards').innerHTML = visible.map(cardMarkup).join('');
  document.getElementById('cards').hidden = visible.length === 0;
  document.getElementById('empty-state').hidden = visible.length !== 0;
  document.getElementById('clear-filters').hidden = !state.search.trim() && state.area === 'Todas' && state.type === 'Todos';
  document.getElementById('result-count').textContent = `${visible.length} ${visible.length === 1 ? 'caminho encontrado' : 'caminhos encontrados'}`;
  renderFilters('area-filters', areas, 'area');
  renderFilters('type-filters', types, 'type');
  restoreFavoriteFocus('cards', focusId);
}

function renderSaved() {
  const focusId = favoriteFocus('saved-cards');
  const saved = [...state.favorites].map(id => byId.get(id)).filter(Boolean);
  document.getElementById('saved-count').textContent = `${saved.length} ${saved.length === 1 ? 'item' : 'itens'}`;
  document.getElementById('saved-cards').innerHTML = saved.length
    ? saved.map(cardMarkup).join('')
    : '<div class="empty-saved">Toque no coração de um item para guardá-lo aqui.</div>';
  restoreFavoriteFocus('saved-cards', focusId);
}

function favoriteFocus(containerId) {
  const active = document.activeElement;
  return document.getElementById(containerId).contains(active) ? active.dataset.favorite : null;
}

function restoreFavoriteFocus(containerId, id) {
  if (!id) return;
  const button = [...document.getElementById(containerId).querySelectorAll('[data-favorite]')].find(node => node.dataset.favorite === id);
  if (button) button.focus({ preventScroll: true });
  else {
    const heading = document.getElementById('saved-title');
    heading.setAttribute('tabindex', '-1');
    heading.focus({ preventScroll: true });
  }
}

function announceApp(message) {
  document.getElementById('app-status').textContent = message;
}

function renderRouteOptions() {
  const container = document.getElementById('route-options');
  if (container.children.length === routeAreas.length) {
    container.querySelectorAll('button').forEach(button => button.setAttribute('aria-pressed', String(state.routeArea === button.dataset.routeArea)));
    return;
  }
  document.getElementById('route-options').innerHTML = routeAreas.map(area =>
    `<button type="button" data-route-area="${area}" aria-pressed="${state.routeArea === area}">${area}</button>`
  ).join('');
}

function chooseRoute(area) {
  const routeIds = {
    Tecnologia: ['lua', 'obi-estude', 'obi'],
    Ciência: ['mulheres-ct', 'seara', 'cfc'],
    Matemática: ['obmep', 'banco-obmep', 'obmep-competicao']
  };
  return (routeIds[area] || []).map(id => byId.get(id)).filter(Boolean);
}

function renderRoute() {
  const area = state.routeArea;
  const picks = chooseRoute(area);
  const labels = { inspirar: 'Conheça pessoas e iniciativas da área', aprender: 'Aprenda uma habilidade', desafiar: 'Coloque em prática', participar: 'Viva a ciência de perto', praticar: 'Treine com problemas' };
  document.getElementById('route-output').innerHTML = `<div class="route-result"><span class="section-index">ROTA SUGERIDA · ${area.toUpperCase()}</span><h3>Três passos possíveis</h3><ol>${picks.map(item =>
    `<li><a href="${item.url}" target="_blank" rel="noopener noreferrer" aria-label="Abrir ${item.title} em nova aba">${item.title} ↗</a><span>${labels[item.routeRole]} · ${item.place}</span></li>`
  ).join('')}</ol><div class="route-actions"><button type="button" id="copy-route">Copiar rota</button><button type="button" id="print-route">Imprimir</button></div></div>`;
}

function clearFilters() {
  state.search = '';
  state.area = 'Todas';
  state.type = 'Todos';
  document.getElementById('search').value = '';
  renderCards();
  document.getElementById('search').focus();
}

document.getElementById('search').addEventListener('input', event => { state.search = event.target.value; renderCards(); });
document.getElementById('clear-filters').addEventListener('click', clearFilters);
document.getElementById('empty-reset').addEventListener('click', clearFilters);
document.addEventListener('click', async event => {
  const filter = event.target.closest('[data-filter]');
  if (filter) { state[filter.dataset.filter] = filter.dataset.value; renderCards(); return; }
  const favorite = event.target.closest('[data-favorite]');
  if (favorite) {
    const id = favorite.dataset.favorite;
    state.favorites.has(id) ? state.favorites.delete(id) : state.favorites.add(id);
    saveFavorites(); renderCards(); renderSaved();
    announceApp(`${byId.get(id).title} ${state.favorites.has(id) ? 'salvo nos' : 'removido dos'} favoritos.`);
    return;
  }
  const routeArea = event.target.closest('[data-route-area]');
  if (routeArea) {
    state.routeArea = routeArea.dataset.routeArea; renderRouteOptions(); renderRoute();
    announceApp(`Rota de ${state.routeArea} criada com três passos. O resultado está depois das opções de área.`);
    return;
  }
  if (event.target.id === 'print-route') { window.print(); return; }
  if (event.target.id === 'copy-route') {
    const picks = chooseRoute(state.routeArea);
    const content = `Minha rota em ${state.routeArea}\n${picks.map((item, index) => `${index + 1}. ${item.title}: ${item.url}`).join('\n')}`;
    try { await navigator.clipboard.writeText(content); event.target.textContent = 'Rota copiada!'; announceApp('Rota copiada.'); }
    catch { event.target.textContent = 'Não foi possível copiar'; announceApp('Não foi possível copiar a rota.'); }
    setTimeout(() => { const button = document.getElementById('copy-route'); if (button) button.textContent = 'Copiar rota'; }, 2200);
  }
});

renderCards();
renderSaved();
renderRouteOptions();
