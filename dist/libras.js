/* Integração com o widget oficial do VLibras; o tradutor usa serviços externos. */
(() => {
  'use strict';
  const button = document.getElementById('a11y-libras');
  const status = document.getElementById('a11y-libras-status');
  let loading = null;
  let script;
  function enabled() { return document.documentElement.dataset.a11yLibras !== 'false'; }
  function syncVisibility() {
    const wrapper = document.getElementById('vlibras-access-wrapper');
    if (wrapper) wrapper.hidden = !enabled();
    if (!enabled()) {
      const app = document.getElementById('vlibras-app-root');
      if (app) app.dataset.active = 'false';
      status.textContent = 'Botão de Libras oculto. Ative a opção acima para voltar a usá-lo.';
    }
  }
  function load() {
    if (window.VLibrasWidget?.initBtn) return Promise.resolve();
    if (loading) return loading;
    status.textContent = 'Carregando VLibras. A tradução precisa de internet.';
    button.setAttribute('aria-busy', 'true');
    loading = new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error('Tempo de carregamento excedido')), 15000);
      script?.remove();
      script = document.createElement('script');
      script.src = 'https://vlibras.gov.br/app/vlibras-plugin.js';
      script.async = true;
      script.onload = () => {
        clearTimeout(timeout);
        try {
          // A versão atual se inicializa sozinha. A chamada idempotente evita
          // aguardar o temporizador de inicialização antes de abrir pelo painel.
          if (!window.VLibrasWidget?.initBtn && window.VLibras?.Widget) {
            new window.VLibras.Widget({rootPath:'https://vlibras.gov.br/app',position:'R'});
          }
          if (!window.VLibrasWidget?.initBtn) throw new Error('Widget indisponível');
          const access = window.VLibrasWidget.initBtn.parentElement;
          if (access) {
            access.style.top = 'auto';
            access.style.bottom = 'calc(86px + env(safe-area-inset-bottom))';
          }
          status.textContent = 'VLibras disponível. Abra o tradutor e selecione o texto que deseja traduzir. É necessário acesso à internet.';
          button.removeAttribute('aria-busy');
          syncVisibility();
          resolve();
        } catch (error) { reject(error); }
      };
      script.onerror = () => { clearTimeout(timeout); reject(new Error('Falha ao carregar VLibras')); };
      document.body.appendChild(script);
    }).catch(error => {
      loading = null;
      button.removeAttribute('aria-busy');
      status.textContent = 'Não foi possível carregar o VLibras. Confira sua conexão e pressione o botão para tentar novamente.';
      throw error;
    });
    return loading;
  }
  button.addEventListener('click', async () => {
    try {
      if (!enabled()) {
        const toggle = document.getElementById('a11y-libras-enabled');
        toggle.checked = true;
        toggle.dispatchEvent(new Event('change',{bubbles:true}));
      }
      await load();
      document.getElementById('a11y-panel').close();
      // Fecha o diálogo antes de abrir o painel externo para liberá-lo do estado inert.
      requestAnimationFrame(() => window.VLibrasWidget.initBtn.click());
    } catch { /* O aviso visível acima informa a falha e permite nova tentativa. */ }
  });
  window.addEventListener('rota-accessibility-change', () => {
    syncVisibility();
    if (enabled()) load().catch(() => {});
  });
  if (enabled()) load().catch(() => {});
  else syncVisibility();
})();
