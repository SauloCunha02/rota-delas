/* Preferências locais. A leitura usa a síntese de voz do navegador. */
(() => {
  'use strict';
  const KEY = 'rota-delas-acessibilidade-v1';
  const toggles = ['font','spacing','links','guide','mask','motion','cursor','focus','listen','libras'];
  const defaults = {size:100, theme:'normal', colors:'none', font:false, spacing:false, links:false, guide:false, mask:false, motion:false, cursor:false, focus:false, listen:false, libras:true, follow:true, rate:1};
  const themes = ['normal','light','dark','blue','mono'];
  function sanitize(value) {
    const result = {...defaults};
    if (!value || typeof value !== 'object') return result;
    if ([100,125,150,175,200].includes(value.size)) result.size = value.size;
    if (themes.includes(value.theme)) result.theme = value.theme;
    if ([.5,.75,1,1.25,1.5,1.75,2].includes(value.rate)) result.rate = value.rate;
    if(typeof value.follow==='boolean')result.follow=value.follow;
    if (['none','protan','deutan','tritan','achromat'].includes(value.colors)) result.colors = value.colors;
    for (const key of toggles) if (typeof value[key] === 'boolean') result[key] = value[key];
    if (result.mask) result.guide = false;
    return result;
  }
  let settings;
  try { settings = sanitize(JSON.parse(localStorage.getItem(KEY))); } catch { settings = {...defaults}; }
  const root = document.documentElement;
  function apply() {
    root.style.setProperty('--a11y-scale', settings.size / 100);
    root.dataset.a11ySize = settings.size;
    const colorThemes = {protan:'blue',deutan:'orange',tritan:'rose',achromat:'mono'};
    root.dataset.a11yTheme = ['light','dark'].includes(settings.theme) ? settings.theme : (colorThemes[settings.colors] || settings.theme);
    for (const key of toggles) root.dataset['a11y' + key[0].toUpperCase() + key.slice(1)] = String(settings[key]);
  }
  apply();
  document.addEventListener('DOMContentLoaded', () => {
    const $ = id => document.getElementById('a11y-' + id);
    const dialog = $('panel');
    const launcher = $('open');
    let storageOK = true;
    let selection = '';
    let lastFocus = launcher;
    let guideY = innerHeight * 0.45;
    let dragging = false;
    const supported = 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
    let reader;
    const profiles = {
      assisted:{size:125,font:true,spacing:true,listen:true},
      lowvision:{size:150,theme:'light',font:true,spacing:true,links:true,motion:true,cursor:true,focus:true},
      calm:{motion:true},
      'focus-profile':{mask:true,guide:false,motion:true,focus:true}
    };
    function announce(message) { $('status').textContent = message + (storageOK ? '' : ' O navegador não permitiu salvar; os ajustes valem nesta página.'); }
    function sync() {
      $('size').value = settings.size;
      $('size').setAttribute('aria-valuetext', settings.size + ' por cento');
      $('size-value').value = settings.size + '%';
      $('smaller').disabled = settings.size <= 100;
      $('larger').disabled = settings.size >= 200;
      $('theme').value = settings.theme;
      $('colors').value = settings.colors;
      $('rate').value = settings.rate;
      for (const key of toggles) $(key === 'libras' ? 'libras-enabled' : key).checked = settings[key];
      document.getElementById('reading-guide').hidden = !settings.guide;
      document.getElementById('reading-mask').hidden = !settings.mask;
      $('guide-handle').hidden = !settings.guide && !settings.mask;
      for (const [id,profile] of Object.entries(profiles)) $(id).setAttribute('aria-pressed',String(Object.entries(profile).every(([key,value])=>settings[key]===value)));
      const count = toggles.filter(key=>key!=='libras'&&settings[key]).length + (settings.size!==100?1:0) + (settings.theme!=='normal'?1:0) + (settings.colors!=='none'?1:0) + (settings.rate!==1?1:0);
      $('count').textContent = count ? `${count} ${count===1?'ajuste ativo':'ajustes ativos'}` : 'Nenhum ajuste ativo';
      launcher.classList.toggle('has-adjustments',count>0);
      launcher.setAttribute('aria-label','Abrir opções de acessibilidade' + (count ? `, ${count} ajustes ativos` : ''));
      buttons();
      positionGuide(guideY);
    }
    function save(message) {
      apply(); sync();
      try { localStorage.setItem(KEY, JSON.stringify(settings)); storageOK = true; } catch { storageOK = false; }
      announce(message);
      window.dispatchEvent(new Event('rota-accessibility-change'));
    }
    reader = new window.RotaReader({
      getRate:()=>settings.rate,getFollow:()=>settings.follow,getListen:()=>settings.listen,
      getGuide:()=>settings.guide||settings.mask,positionGuide,
      setRate:rate=>{settings.rate=rate;save('Velocidade da leitura atualizada.');},
      setFollow:value=>{settings.follow=value;save(value?'Acompanhamento automático ativado.':'Acompanhamento automático desativado.');},
      close:()=>{settings.listen=false;save('Controles de voz fechados.');launcher.focus({preventScroll:true});}
    });
    launcher.hidden = false;
    sync();
    function openPanel() {
      lastFocus = document.activeElement;
      selection = window.getSelection()?.toString().trim() || '';
      const selected = window.getSelection();
      reader.setSelection(selection,selected?.rangeCount&&selection?selected.getRangeAt(0).cloneRange():null);
      const option = $('scope').querySelector('[value=selection]');
      option.disabled = !selection;
      if (selection) $('scope').value = 'selection';
      else if ($('scope').value === 'selection') $('scope').value = 'conteudo';
      dialog.showModal();
      launcher.setAttribute('aria-expanded','true');
      buttons();
    }
    launcher.addEventListener('click', openPanel);
    $('close').addEventListener('click', () => dialog.close());
    dialog.addEventListener('close', () => {launcher.setAttribute('aria-expanded','false');buttons();if(reader.reading)reader.locate();const target=lastFocus?.isConnected&&lastFocus.getClientRects().length&&!lastFocus.disabled?lastFocus:launcher;target.focus({preventScroll:true});});
    dialog.addEventListener('click', event => {const rect=dialog.getBoundingClientRect();if(event.target===dialog&&(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom))dialog.close();});
    $('size').addEventListener('input', event => {settings.size = Number(event.target.value);save('Letras em ' + settings.size + '%.');});
    for (const [id,delta] of [['smaller',-25],['larger',25]]) $(id).addEventListener('click', () => {settings.size = Math.max(100,Math.min(200,settings.size + delta));save('Letras em ' + settings.size + '%.');});
    for (const key of toggles) $(key === 'libras' ? 'libras-enabled' : key).addEventListener('change', event => {
      settings[key] = event.target.checked;
      if(key==='mask'&&settings.mask)settings.guide=false;
      if(key==='guide'&&settings.guide)settings.mask=false;
      if(key==='listen'&&!settings.listen)reader.reset();
      if(key==='listen'&&settings.listen&&!reader.reading&&supported)speechStatus('Toque em um parágrafo ou use Play para ler a seção escolhida no painel.');
      save('Preferência de leitura atualizada.');
    });
    $('theme').addEventListener('change', event => {settings.theme = event.target.value;save('Aparência: ' + event.target.selectedOptions[0].textContent + '.');});
    $('colors').addEventListener('change', event => {settings.colors=event.target.value;save('Paleta alternativa atualizada. Os modos de alto contraste têm prioridade.');});
    for(const [id,profile] of Object.entries(profiles)) $(id).addEventListener('click',()=>{Object.assign(settings,profile);if(id==='assisted'&&!reader.reading&&supported)speechStatus('Toque em um parágrafo ou use Play para ler a seção escolhida no painel.');save('Perfil aplicado. Você pode ajustar cada preferência abaixo.');});
    function positionGuide(y) {
      guideY = Math.max(48,Math.min(innerHeight-48,y));
      root.style.setProperty('--a11y-guide-y',guideY+'px');
      document.getElementById('reading-guide').style.top=guideY+'px';
    }
    document.addEventListener('pointermove', event => {
      if ((settings.guide||settings.mask)&&!dialog.open&&(dragging||(event.pointerType!=='touch'&&document.activeElement!==$('guide-handle'))))positionGuide(event.clientY);
    }, {passive:true});
    $('guide-handle').addEventListener('pointerdown',event=>{dragging=true;event.currentTarget.setPointerCapture(event.pointerId);positionGuide(event.clientY);});
    $('guide-handle').addEventListener('pointerup',()=>{dragging=false;});
    $('guide-handle').addEventListener('pointercancel',()=>{dragging=false;});
    $('guide-handle').addEventListener('keydown',event=>{if(['ArrowUp','ArrowDown','Home','End'].includes(event.key)){event.preventDefault();positionGuide(event.key==='Home'?48:event.key==='End'?innerHeight-48:guideY+(event.key==='ArrowDown'?24:-24));}});
    window.addEventListener('resize',()=>positionGuide(guideY));
    function buttons() { reader?.render(); }
    function speechStatus(message) { reader?.status(message); }
    document.addEventListener('keydown',event=>{
      if(event.altKey&&!event.ctrlKey&&!event.metaKey&&!event.repeat){
        if(event.key.toLowerCase()==='a'){event.preventDefault();dialog.open?dialog.close():openPanel();}
        if(event.key.toLowerCase()==='l'){event.preventDefault();reader.startScope();}
      }else if(event.key==='Escape'&&!document.querySelector('dialog[open]')&&reader.reading){event.preventDefault();reader.stop();}
    });
    $('reset').addEventListener('click', () => {reader.reset();settings = {...defaults};positionGuide(innerHeight*.45);save('Preferências restauradas. As preferências de movimento do seu sistema continuam respeitadas.');$('transcript').hidden = true;});
    if (!supported) {
      $('read').disabled = true; $('rate').disabled = true;
      speechStatus('Este navegador não oferece leitura em voz alta. Todo o conteúdo está disponível por escrito e para seu leitor de tela.');
    }
  });
})();
