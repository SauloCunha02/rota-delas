/* Recomendações documentais: preferências locais, critérios explícitos, sem perfil remoto. */
(() => {
 'use strict';
 const catalog=window.RotaCatalog,byId=new Map(catalog.resources.map(r=>[r.id,r]));
 const $=id=>document.getElementById(id),e=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const goals={explorar:'Explorar possibilidades',aprender:'Aprender uma habilidade',criar:'Criar um projeto',competir:'Conhecer competições'};
 const stages={explorar:['inspirar','aprender','desafiar'],aprender:['aprender','inspirar','desafiar'],criar:['inspirar','aprender','aprender'],competir:['desafiar','aprender','inspirar']};
 const publicBase=/^https?:$/.test(location.protocol)?new URL('./',location.href):new URL('https://rotadelas-ceara2026.web.app/');
 const key='rota-delas-minha-rota-v1';let current=null,signature='',nextId='',saved=null,swaps=[[],[],[]],trigger=null;
 function clean(p={}){if(!p||typeof p!=='object')p={};return {area:['Tecnologia e Computação','Ciência','Matemática'].includes(p.area)?p.area:'Tecnologia e Computação',uf:Object.hasOwn(catalog.states,p.uf)?p.uf:'',topics:Array.isArray(p.topics)?catalog.topics.filter(t=>p.topics.includes(t)).slice(0,3):[],goal:Object.hasOwn(goals,p.goal)?p.goal:'explorar',mode:['Online','Presencial'].includes(p.mode)?p.mode:''};}
 function role(r){return r.kind==='Competição'?'desafiar':r.kind==='Estudo'?'aprender':'inspirar';}
 function candidates(p){return catalog.resources.filter(r=>r.sourceStatus!=='Inativo'&&(r.area===p.area||(p.area==='Ciência'&&['Ciências Naturais','Ciência e Pesquisa'].includes(r.area)))&&(r.scope==='Nacional'||(p.uf&&r.states.includes(p.uf)))&&(!p.mode||(p.mode==='Online'?r.mode==='Online':['Presencial','Híbrido'].includes(r.mode))));}
 function score(r,p,stage){return r.topics.filter(t=>p.topics.includes(t)).length*30+Number(role(r)===stage)*120+Number(role(r)===stages[p.goal][0])*8+Number(!!p.uf&&r.states.includes(p.uf))*8+Number(r.focus==='Meninas em foco')*5;}
 function rank(p,stage){return candidates(p).sort((a,b)=>score(b,p,stage)-score(a,p,stage)||a.id.localeCompare(b.id,'pt-BR'));}
 function plan(raw){const profile=clean(raw),items=[];for(const stage of stages[profile.goal]){const r=rank(profile,stage).find(r=>!items.includes(r));if(r)items.push(r);}return {profile,items};}
 function preferences(area,uf){return clean({area,uf,topics:[...document.querySelectorAll('#route-topics input:checked')].map(i=>i.value),goal:$('route-goal').value,mode:$('route-mode').value});}
 function ensure(area,uf){const p=preferences(area,uf),s=JSON.stringify(p);if(!current||s!==signature){current=plan(p);signature=s;nextId='';swaps=[[],[],[]];}return current;}
 function reason(r,p){const parts=[],matches=r.topics.filter(t=>p.topics.includes(t));if(matches.length)parts.push('Tema: '+matches.join(', '));else if(p.topics.length)parts.push('Alternativa da área; não corresponde aos temas escolhidos');else parts.push('Área de interesse compatível');if(p.uf&&r.states.includes(p.uf))parts.push('Base: '+catalog.states[p.uf][0]);else parts.push('Alcance nacional');parts.push(r.mode==='Consultar fonte'?'Formato ainda precisa ser confirmado':'Formato: '+r.mode);if(r.focus==='Meninas em foco')parts.push('Meninas em foco');return parts.join(' · ');}
 function render(area,uf){
  const result=ensure(area,uf),p=result.profile,n=result.items.length,chosen=result.items.find(r=>r.id===nextId);
  const noTopic=p.topics.length&&!result.items.some(r=>r.topics.some(t=>p.topics.includes(t)));
  $('route-output').innerHTML='<div class="route-result"><span class="section-index">SUA ROTA · '+e(p.uf||'BRASIL')+'</span><h3>'+e(goals[p.goal])+'</h3><p class="route-summary">'+e(p.area)+(p.topics.length?' · '+e(p.topics.join(', ')):'')+' · '+e(p.mode==='Presencial'?'Presencial ou híbrido':p.mode||'Todos os formatos')+'</p>'+
   (n?'<ol>'+result.items.map((r,i)=>'<li data-route-resource="'+e(r.id)+'"><span class="route-step-kind">'+({inspirar:'Descobrir',aprender:'Aprender',desafiar:'Consultar desafio'}[role(r)])+'</span><a href="'+e(r.url)+'" target="_blank" rel="noopener noreferrer">'+e(r.title)+' ↗</a><p>'+e(r.description)+'</p><details><summary>Por que apareceu para você?</summary><p>'+e(reason(r,p))+'</p><p>Público informado: '+e(r.audience)+'. Confirme datas, custos e requisitos na fonte.</p><p>Fonte consultada em '+e(r.sources[0].checkedAt.split('-').reverse().join('/'))+'.</p></details><div class="route-step-actions"><button type="button" data-route-swap="'+i+'" '+(candidates(p).length<=n?'disabled':'')+' aria-label="Trocar indicação '+(i+1)+'">Trocar indicação</button><button type="button" data-route-next="'+e(r.id)+'" aria-pressed="'+String(nextId===r.id)+'">'+(nextId===r.id?'✓ Meu próximo passo':'Quero começar aqui')+'</button></div></li>').join('')+'</ol>':'<p class="route-warning">Não há recursos documentados para essa combinação. Tente outro formato, área ou estado.</p>')+
   (n&&n<3?'<p class="route-warning">Encontramos apenas '+n+' indicação'+(n>1?'s':'')+' '+(n>1?'compatíveis':'compatível')+'. Não completamos a rota com formatos incompatíveis.</p>':'')+
   (noTopic?'<p class="route-warning">Não encontramos correspondência nos temas escolhidos. Estas são alternativas da mesma área.</p>':'')+
   (n&&p.goal==='competir'&&!result.items.some(r=>r.kind==='Competição')?'<p class="route-warning">Não há competição documentada nesse recorte. As indicações acima são alternativas de descoberta ou preparação.</p>':'')+
   '<p class="route-disclaimer">Sugestões documentais, sem confirmação de vagas ou elegibilidade. “Meu próximo passo” registra uma intenção, não uma atividade concluída.</p>'+
   (chosen?'<p class="route-next-note">Seu próximo passo: <strong>'+e(chosen.title)+'</strong>.</p>':'')+
   (n?'<div class="route-actions"><button type="button" id="save-route">Salvar minha rota</button><button type="button" id="copy-route">Copiar rota</button><button type="button" id="copy-route-link">Copiar link</button><button type="button" id="print-route">Imprimir</button><button type="button" id="create-story" class="story-call">Criar meu Story ↗</button></div>':'')+'</div>';
 }
 function routeLink(){if(!current)return '';const u=new URL(publicBase),p=current.profile;u.searchParams.set('rota',current.items.map(r=>r.id).join(','));u.searchParams.set('area',p.area);if(p.uf)u.searchParams.set('uf',p.uf);if(p.topics.length)u.searchParams.set('temas',p.topics.join(','));u.searchParams.set('objetivo',p.goal);if(p.mode)u.searchParams.set('formato',p.mode);if(nextId)u.searchParams.set('passo',nextId);u.hash='rota';return u.href;}
 async function copy(text){
  try{await navigator.clipboard.writeText(text);return true;}catch{
   const active=document.activeElement,host=[...document.querySelectorAll('dialog[open]')].at(-1)||$('route-output')||document.body;
   const t=document.createElement('textarea');t.value=text;t.style.position='fixed';t.style.opacity='0';host.append(t);t.focus({preventScroll:true});t.select();
   let ok=false;try{ok=document.execCommand('copy');}catch{}t.remove();
   if(active?.isConnected)active.focus({preventScroll:true});
   if(!ok){let group=host.querySelector('.copy-manual');if(!group){group=document.createElement('label');group.className='copy-manual';group.append('Texto para copiar manualmente');const field=document.createElement('textarea');field.readOnly=true;field.rows=5;group.append(field);host.append(group);}const field=group.querySelector('textarea');field.value=text;field.focus({preventScroll:true});field.select();field.scrollIntoView({block:'nearest'});}
   return ok;
  }
 }
 function say(text){$('route-status').textContent=text;}
 function apply(p,ids,next){const cleanProfile=clean(p),eligible=new Set(candidates(cleanProfile).map(r=>r.id)),accepted=[...new Set(Array.isArray(ids)?ids:[])].filter(id=>eligible.has(id)).slice(0,3);state.routeArea=cleanProfile.area;state.routeUf=cleanProfile.uf;$('route-uf').value=cleanProfile.uf;$('route-goal').value=cleanProfile.goal;$('route-mode').value=cleanProfile.mode;document.querySelectorAll('#route-topics input').forEach(i=>i.checked=cleanProfile.topics.includes(i.value));current=accepted.length?{profile:cleanProfile,items:accepted.map(id=>byId.get(id))}:plan(cleanProfile);signature=JSON.stringify(cleanProfile);nextId=current.items.some(r=>r.id===next)?next:'';swaps=[[],[],[]];renderRouteOptions();renderRoute();syncPreferences();return accepted.length!==ids?.length||!accepted.length;}
 function removeSharedQuery(){const u=new URL(location.href);for(const k of ['rota','area','uf','temas','objetivo','formato','passo'])u.searchParams.delete(k);history.replaceState(null,'',u.href);}
 function syncPreferences(){
  const p=preferences(state.routeArea,state.routeUf),count=p.topics.length;
  $('route-topics-count').textContent=count+' de 3 temas selecionados';
  $('route-preferences').textContent=(state.routeArea?state.routeArea:'Área ainda não escolhida')+' · '+goals[p.goal]+' · '+(p.mode==='Presencial'?'Presencial ou híbrido':p.mode||'Todos os formatos')+' · '+(p.uf?catalog.states[p.uf][0]:'Alcance nacional')+(count?' · '+p.topics.join(', '):'');
  window.dispatchEvent(new Event('rota-profile-change'));
 }
 function update(){
  removeSharedQuery();syncPreferences();
  if(state.routeArea){renderRoute();say('Rota atualizada: '+current.items.length+' indicação'+(current.items.length===1?'':'s')+'.');}
  else say('Preferências atualizadas. Escolha uma área para gerar a rota.');
 }
 function clearRoute(){
  let removed=true;try{localStorage.removeItem(key);saved=null;$('restore-route').hidden=true;}catch{removed=false;}
  generation++;blob=null;current=null;signature='';nextId='';swaps=[[],[],[]];
  if(objectUrl){URL.revokeObjectURL(objectUrl);objectUrl='';}
  if($('story-panel').open)$('story-panel').close();
  $('story-preview').removeAttribute('src');$('story-preview').alt='A prévia aparecerá após gerar a imagem.';$('story-transcript').textContent='';$('story-status').textContent='';$('story-download').disabled=true;$('story-share').disabled=true;$('story-panel').querySelector('.copy-manual')?.remove();$('story-canvas').getContext('2d')?.clearRect(0,0,1080,1920);
  $('story-template').value='rota';$('story-palette').value='menta';$('story-phrase').value=phrases.rota;
  state.routeArea=null;state.routeUf='CE';$('route-uf').value='CE';$('route-goal').value='explorar';$('route-mode').value='';document.querySelectorAll('#route-topics input').forEach(i=>i.checked=false);$('route-topics').closest('details').open=false;
  $('route-output').innerHTML='<div class="route-placeholder"><img src="assets/marca/simbolo-claro.svg" alt="" width="52" height="52" aria-hidden="true"><p>Sua rota aparece aqui depois que você escolhe uma área.</p></div>';
  renderRouteOptions();syncPreferences();removeSharedQuery();say(removed?'Rota limpa. Escolhas e próximo passo voltaram ao estado inicial. Favoritos foram preservados.':'Escolhas reiniciadas nesta página. O navegador não permitiu apagar a rota salva; ela pode continuar disponível ao recarregar.');
 }
 function init(){
  if(!$('route-topics'))return;
  $('route-topics').innerHTML=catalog.topics.map(t=>'<label><input type="checkbox" value="'+e(t)+'"><span>'+e(t)+'</span></label>').join('');
  $('route-topics').addEventListener('change',ev=>{if(document.querySelectorAll('#route-topics input:checked').length>3){ev.target.checked=false;say('Escolha até três temas.');return;}update();});
  for(const id of ['route-goal','route-mode'])$(id).addEventListener('change',update);
  try{saved=JSON.parse(localStorage.getItem(key)||'null');if(saved?.version===1&&Array.isArray(saved.ids))$('restore-route').hidden=false;else saved=null;}catch{saved=null;}
  $('restore-route').addEventListener('click',()=>{if(saved){const adjusted=apply(saved.profile,saved.ids,saved.next);removeSharedQuery();say(adjusted?'Rota salva atualizada: indicações incompatíveis ou indisponíveis não foram mantidas.':'Rota salva aberta neste navegador.');}});
  $('forget-route').addEventListener('click',clearRoute);
  document.addEventListener('click',async ev=>{
   const swap=ev.target.closest('[data-route-swap]'),next=ev.target.closest('[data-route-next]');if(swap&&current){const i=Number(swap.dataset.routeSwap),old=current.items[i],used=new Set(current.items.map(r=>r.id));if(!old)return;swaps[i].push(old.id);let replacement=rank(current.profile,stages[current.profile.goal][i]).find(r=>!used.has(r.id)&&!swaps[i].includes(r.id));if(!replacement){swaps[i]=[old.id];replacement=rank(current.profile,stages[current.profile.goal][i]).find(r=>!used.has(r.id));}if(replacement){current.items[i]=replacement;if(nextId===old.id)nextId='';renderRoute();removeSharedQuery();document.querySelector('[data-route-swap="'+i+'"]')?.focus({preventScroll:true});say('Indicação trocada para '+replacement.title+'.');}return;}
   if(next&&current){nextId=nextId===next.dataset.routeNext?'':next.dataset.routeNext;renderRoute();removeSharedQuery();document.querySelector('[data-route-next="'+next.dataset.routeNext+'"]')?.focus({preventScroll:true});say(nextId?'Próximo passo escolhido.':'Próximo passo desmarcado.');return;}
   if(ev.target.id==='save-route'&&current){try{saved={version:1,profile:current.profile,ids:current.items.map(r=>r.id),next:nextId};localStorage.setItem(key,JSON.stringify(saved));$('restore-route').hidden=false;say('Rota salva apenas neste navegador.');}catch{say('Este navegador não permite salvar a rota. Use Copiar link.');}}
   if(ev.target.id==='copy-route-link')say(await copy(routeLink())?'Link copiado. Ele contém as escolhas e os recursos da rota; confira antes de compartilhar.':'Selecione e copie o link no campo disponível abaixo.');
   if(ev.target.id==='create-story')openStory(ev.target);
  });
  const u=new URL(location.href);if(u.searchParams.has('rota')){const ids=(u.searchParams.get('rota')||'').split(',');const adjusted=apply({area:u.searchParams.get('area'),uf:u.searchParams.get('uf'),topics:(u.searchParams.get('temas')||'').split(','),goal:u.searchParams.get('objetivo'),mode:u.searchParams.get('formato')},ids,u.searchParams.get('passo'));say(adjusted?'Link atualizado: indicações inválidas ou indisponíveis não foram mantidas. Confira as sugestões atuais.':'Rota compartilhada aberta. Você pode adaptar as escolhas.');}
  syncPreferences();
  initStory();
 }
 /* O PNG é desenhado localmente, sem fotos externas nem requisição de renderização. */
 let blob=null,objectUrl='',generation=0,shareBusy=false;
 function canShareFile(file){try{return typeof navigator.share==='function'&&typeof navigator.canShare==='function'&&navigator.canShare({files:[file]});}catch{return false;}}
 const palettes={menta:{bg:'#101f2b',ink:'#f7f9f7',accent:'#80ecdc',soft:'#19313d'},clara:{bg:'#f7f9f7',ink:'#101f2b',accent:'#087d76',soft:'#e0eeea'},terracota:{bg:'#34201d',ink:'#fff6ed',accent:'#ffbe99',soft:'#4b302a'}};
 const phrases={'rota':'A ciência também tem espaço para mim.','passo':'Meu próximo passo começa com curiosidade.','convite':'Vem comigo descobrir caminhos na ciência.'};
 function flower(ctx,x,y,scale,ink,accent){ctx.save();ctx.translate(x,y);ctx.scale(scale,scale);for(const [d,color] of [['M48 45C25 41 17 26 23 17c10-9 25 2 25 28Z',accent],['M51 48c4-23 19-31 28-25 9 10-2 25-28 25Z',ink],['M48 51c23 4 31 19 25 28-10 9-25-2-25-28Z',accent],['M45 48C27 46 15 52 15 66c0 10 9 15 18 10 7-4 10-13 12-28Z',ink]]){ctx.fillStyle=color;ctx.fill(new Path2D(d));}ctx.fillStyle='#da754d';for(const [cx,cy,r] of [[48,48,7],[84,15,5]]){ctx.beginPath();ctx.arc(cx,cy,r,0,2*Math.PI);ctx.fill();}ctx.restore();}
 function lines(ctx,text,x,y,width,lineHeight,maxLines=6){const words=String(text).split(/\s+/),out=[];let line='';for(const word of words){if(ctx.measureText(word).width>width){if(line){out.push(line);line='';}let part='';for(const char of word){if(ctx.measureText(part+char).width>width){out.push(part);part=char;}else part+=char;}line=part;continue;}const next=line?line+' '+word:word;if(ctx.measureText(next).width>width&&line){out.push(line);line=word;}else line=next;}if(line)out.push(line);out.slice(0,maxLines).forEach((s,i)=>{if(i===maxLines-1&&out.length>maxLines){while(ctx.measureText(s+'…').width>width)s=s.slice(0,-1);s+='…';}ctx.fillText(s,x,y+i*lineHeight);});return Math.min(out.length,maxLines)*lineHeight;}
 function round(ctx,x,y,w,h,color){const r=28;ctx.fillStyle=color;ctx.beginPath();ctx.moveTo(x+r,y);ctx.lineTo(x+w-r,y);ctx.quadraticCurveTo(x+w,y,x+w,y+r);ctx.lineTo(x+w,y+h-r);ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h);ctx.lineTo(x+r,y+h);ctx.quadraticCurveTo(x,y+h,x,y+h-r);ctx.lineTo(x,y+r);ctx.quadraticCurveTo(x,y,x+r,y);ctx.closePath();ctx.fill();}
 async function drawStory(){
  const ticket=++generation;blob=null;$('story-download').disabled=true;$('story-share').disabled=true;$('story-status').textContent='Preparando sua imagem…';
  try{
   await document.fonts.ready;
   if(!current?.items.length)throw Error('Monte uma rota antes.');
   const canvas=$('story-canvas'),ctx=canvas.getContext('2d'),palette=palettes[$('story-palette').value]||palettes.menta,template=$('story-template').value,phrase=$('story-phrase').value;
   canvas.width=1080;canvas.height=1920;ctx.fillStyle=palette.bg;ctx.fillRect(0,0,1080,1920);
   ctx.globalAlpha=.07;flower(ctx,630,70,5.8,palette.ink,palette.accent);ctx.globalAlpha=1;
   flower(ctx,72,185,1.12,palette.ink,palette.accent);ctx.fillStyle=palette.ink;ctx.font='700 52px "DM Sans",Arial';ctx.fillText('rotadelas',202,260);
   ctx.fillStyle=palette.accent;ctx.font='700 26px "DM Sans",Arial';ctx.fillText('CIÊNCIA DELAS · MEU CAMINHO',88,364);
   ctx.fillStyle=palette.ink;ctx.font='600 78px Fraunces,Georgia';lines(ctx,phrase,88,468,890,86,3);
   ctx.fillStyle=palette.accent;ctx.font='600 32px "DM Sans",Arial';lines(ctx,current.profile.topics.join(' · ')||current.profile.area,88,765,884,40,2);
   if(template==='passo'){
    const selected=current.items.find(r=>r.id===nextId)||current.items[0];round(ctx,72,902,936,464,palette.soft);ctx.fillStyle=palette.accent;ctx.font='700 27px "DM Sans",Arial';ctx.fillText('QUERO COMEÇAR POR',104,966);ctx.fillStyle=palette.ink;ctx.font='600 56px Fraunces,Georgia';lines(ctx,selected.title,104,1060,864,65,3);ctx.font='400 30px "DM Sans",Arial';lines(ctx,selected.kind+' · '+selected.mode,104,1290,864,40,1);
   }else if(template==='convite'){
    round(ctx,72,902,936,464,palette.soft);ctx.fillStyle=palette.ink;ctx.font='600 57px Fraunces,Georgia';lines(ctx,'Qual descoberta você quer fazer primeiro?',104,996,864,65,3);ctx.fillStyle=palette.accent;ctx.font='500 33px "DM Sans",Arial';lines(ctx,'Explore. Escolha seu próximo passo. Convide outra menina.',104,1220,864,44,2);
   }else{
    current.items.forEach((r,i)=>{const y=890+i*170;round(ctx,72,y,936,152,palette.soft);ctx.fillStyle=palette.accent;ctx.font='700 35px "DM Sans",Arial';ctx.fillText(String(i+1).padStart(2,'0'),104,y+58);ctx.fillStyle=palette.ink;ctx.font='600 38px "DM Sans",Arial';lines(ctx,r.title,184,y+56,780,46,2);});
   }
   ctx.fillStyle=palette.ink;ctx.font='600 39px "DM Sans",Arial';ctx.fillText('Monte sua rota também.',88,1500);ctx.fillStyle=palette.accent;ctx.font='500 29px "DM Sans",Arial';ctx.fillText((publicBase.host+publicBase.pathname).replace(/\/$/,''),88,1552);
   ctx.fillStyle=palette.ink;ctx.globalAlpha=.8;ctx.font='400 24px "DM Sans",Arial';lines(ctx,'Sugestões para explorar. Confirme vagas e requisitos nas fontes.',88,1640,900,34,2);ctx.font='600 25px "DM Sans",Arial';ctx.fillText('#RotaDelas  #CiênciaDelas',88,1740);ctx.globalAlpha=1;
   const result=await new Promise((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(Error('Não foi possível gerar o PNG.')),'image/png'));if(ticket!==generation)return;blob=result;
   if(objectUrl)URL.revokeObjectURL(objectUrl);objectUrl=URL.createObjectURL(blob);$('story-preview').src=objectUrl;$('story-preview').alt='Prévia do Story. '+phrase+' '+(template==='rota'?current.items.map(r=>r.title).join('; '):template==='passo'?(current.items.find(r=>r.id===nextId)||current.items[0]).title:'Convite para montar uma rota na ciência.');$('story-transcript').textContent=$('story-preview').alt;
   $('story-download').disabled=false;const file=new File([blob],'minha-rota-delas.png',{type:'image/png'});$('story-share').disabled=shareBusy||!canShareFile(file);$('story-status').textContent='Imagem pronta · PNG 1080 × 1920. '+($('story-share').disabled?'Baixe a imagem e publique pelo Instagram.':'Você pode baixar ou abrir o compartilhamento do celular.');
  }catch(error){if(ticket!==generation)return;$('story-status').textContent='Não foi possível preparar a imagem. Tente novamente ou copie o link da rota.';}
 }
 function openStory(button){if(!current?.items.length)return;trigger=button;$('story-panel').showModal();$('story-close').focus();drawStory();}
 function initStory(){
  const dialog=$('story-panel');$('story-close').addEventListener('click',()=>dialog.close());dialog.addEventListener('close',()=>{if(dialog.open)return;generation++;if(!document.querySelector('dialog[open]')&&trigger?.isConnected)trigger.focus({preventScroll:true});});dialog.addEventListener('click',ev=>{const r=dialog.getBoundingClientRect();if(ev.target===dialog&&(ev.clientX<r.left||ev.clientX>r.right||ev.clientY<r.top||ev.clientY>r.bottom))dialog.close();});
  $('story-template').addEventListener('change',()=>{$('story-phrase').value=phrases[$('story-template').value];drawStory();});for(const id of ['story-palette','story-phrase'])$(id).addEventListener('change',drawStory);$('story-retry').addEventListener('click',drawStory);
  $('story-download').addEventListener('click',()=>{if(!blob)return;const a=document.createElement('a');a.href=objectUrl;a.download='minha-rota-delas.png';document.body.append(a);a.click();a.remove();$('story-status').textContent='Download solicitado. Publique a imagem pelo Instagram e adicione o link usando o adesivo de link.';});
  $('story-share').addEventListener('click',async()=>{if(!blob||shareBusy)return;shareBusy=true;$('story-share').disabled=true;$('story-share').setAttribute('aria-busy','true');try{const file=new File([blob],'minha-rota-delas.png',{type:'image/png'});if(!canShareFile(file))throw Error();await navigator.share({files:[file]});$('story-status').textContent='Compartilhamento acionado. Confirme o envio no aplicativo escolhido.';}catch(error){$('story-status').textContent=error.name==='AbortError'?'Compartilhamento cancelado. Sua imagem continua disponível.':'O aparelho não conseguiu compartilhar. Use Baixar imagem.';}finally{shareBusy=false;$('story-share').removeAttribute('aria-busy');$('story-share').disabled=!blob||!canShareFile(new File([blob],'minha-rota-delas.png',{type:'image/png'}));}});
  $('story-copy-link').addEventListener('click',async()=>$('story-status').textContent=await copy(routeLink())?'Link copiado. Ele inclui as escolhas e indicações da rota; adicione-o ao adesivo de link no Instagram.':'Selecione e copie o link no campo disponível abaixo.');
  $('story-copy-caption').addEventListener('click',async()=>$('story-status').textContent=await copy($('story-phrase').value+' Monte sua rota também: '+routeLink()+' #RotaDelas #CiênciaDelas')?'Legenda copiada.':'Selecione e copie a legenda no campo disponível abaixo.');
 }
 window.RotaPlanner={plan,clean,candidates,rank,ensure,render,update,syncPreferences,clearRoute,routeLink,copy,get current(){return current;},get nextId(){return nextId;},get imageReady(){return !!blob;}};
 document.addEventListener('DOMContentLoaded',init);
})();
