/* Missões e agenda documentada. Registros pessoais permanecem neste navegador. */
(() => {
 'use strict';
 const data=window.RotaJornadaDados,$=id=>document.getElementById(id),escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 if(!data||!$('missoes'))return;
 const all=data.trails.flatMap(t=>t.missions),missions=new Map(all.map(m=>[m.id,m])),catalog=new Map(window.RotaCatalog.resources.map(r=>[r.id,r]));
 const key='rota-delas-missoes-v1',agendaKey='rota-delas-agenda-v1';let records={},savedEvents=new Set(),trailId=data.trails[0].id,manualTrail=false,persisted=true;
 const statusLabels={new:'Não iniciada',doing:'Em andamento',paused:'Para continuar',done:'Concluída por você'};
 const day=date=>new Intl.DateTimeFormat('en-CA',{timeZone:'America/Sao_Paulo',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(date).filter(p=>p.type!=='literal').reduce((a,p)=>({...a,[p.type]:p.value}),{});
 const today=()=>{const p=day(new Date());return p.year+'-'+p.month+'-'+p.day;};
 const plus=(s,n)=>{const d=new Date(s+'T12:00:00Z');d.setUTCDate(d.getUTCDate()+n);return d.toISOString().slice(0,10);};
 const pretty=s=>new Intl.DateTimeFormat('pt-BR',{timeZone:'UTC',day:'2-digit',month:'short',year:'numeric'}).format(new Date(s+'T12:00:00Z'));
 let month=today().slice(0,7),selectedDay='',view='upcoming';
 function say(id,text){$(id).textContent=text;}
 function load(){
  try{const raw=JSON.parse(localStorage.getItem(key)||'{}');if(data.trails.some(t=>t.id===raw?._trail))trailId=raw._trail;manualTrail=raw?._manualTrail===true;for(const m of all){const r=raw?.[m.id];if(r&&typeof r==='object')records[m.id]={status:Object.hasOwn(statusLabels,r.status)?r.status:'new',note:typeof r.note==='string'?r.note.slice(0,6000):'',checks:m.checklist.map((_,i)=>r.checks?.[i]===true)};}}catch{}
  try{const raw=JSON.parse(localStorage.getItem(agendaKey)||'[]'),valid=new Set(data.events.map(e=>e.id));savedEvents=new Set(Array.isArray(raw)?raw.filter(id=>valid.has(id)):[]);}catch{}
 }
 function record(m){return records[m.id]||(records[m.id]={status:'new',note:'',checks:m.checklist.map(()=>false)});}
 function save(){try{localStorage.setItem(key,JSON.stringify({...records,_trail:trailId,_manualTrail:manualTrail}));persisted=true;return true;}catch{persisted=false;return false;}}
 function savedText(ok){return ok?'Salvo neste navegador.':'Atualizado nesta página. O navegador bloqueou o salvamento; exporte seus registros para guardar uma cópia.';}
 function download(text,name,type){const url=URL.createObjectURL(new Blob([text],{type})),a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),30000);}
 function progress(){
  const t=data.trails.find(t=>t.id===trailId),done=t.missions.filter(m=>record(m).status==='done').length,totalDone=all.filter(m=>record(m).status==='done').length;
  $('mission-progress').value=done;$('mission-progress').max=t.missions.length;
  $('mission-progress').setAttribute('aria-label',done+' de '+t.missions.length+' missões concluídas na trilha');
  $('mission-progress-text').textContent=done+' de '+t.missions.length+' nesta trilha · '+totalDone+' de '+all.length+' no total';
  document.querySelectorAll('[data-trail]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.trail===trailId)));
 }
 function canFinish(m){const r=record(m);return r.note.trim().length>=30&&r.checks.every(Boolean);}
 function card(m,i){
  const r=record(m),done=r.status==='done',open=r.status==='doing';
  return '<article class="mission-card" data-mission="'+m.id+'"><div class="journey-card-top"><span class="journey-kicker">MISSÃO '+String(i+1).padStart(2,'0')+'</span><span class="journey-status" data-state="'+r.status+'">'+statusLabels[r.status]+'</span></div><h3>'+escape(m.title)+'</h3><p class="journey-meta">'+m.minutes+' min estimados · No seu ritmo</p><p>'+escape(m.delivery)+'</p><button type="button" class="journey-button" data-start="'+m.id+'" aria-expanded="'+open+'" aria-controls="details-'+m.id+'">'+(done?'Rever missão':r.status==='new'?'Começar missão':'Retomar missão')+'</button><details id="details-'+m.id+'" '+(open?'open':'')+'><summary>Instruções e minha entrega</summary><h4>O que você precisa</h4><p>'+m.materials.map(escape).join(' · ')+'</p><h4>Faça por etapas</h4><ol class="mission-steps">'+m.steps.map(s=>'<li><p>'+escape(s)+'</p></li>').join('')+'</ol><h4>Fontes para explorar</h4><ul class="mission-sources">'+m.resources.map(id=>{const r=catalog.get(id);return '<li><a href="'+escape(r.url)+'" target="_blank" rel="noopener noreferrer">'+escape(r.title)+' ↗</a></li>';}).join('')+'</ul><h4>Sua entrega</h4><p>'+escape(m.delivery)+'</p><label for="note-'+m.id+'">Registre o que fez ou onde guardou seu trabalho</label><textarea id="note-'+m.id+'" data-note="'+m.id+'" maxlength="6000" rows="5" placeholder="Descreva sua atividade, o que aprendeu e as fontes. Não inclua dados pessoais.">'+escape(r.note)+'</textarea><p class="journey-small" data-note-count>'+r.note.length+' / 6000 caracteres · Salvamento local automático</p><fieldset class="mission-checks"><legend>Confira sua atividade</legend>'+m.checklist.map((s,i)=>'<label><input type="checkbox" data-check="'+m.id+'" data-index="'+i+'" '+(r.checks[i]?'checked':'')+'><span>'+escape(s)+'</span></label>').join('')+'</fieldset><p class="journey-small">Para concluir, registre pelo menos 30 caracteres e marque as três conferências. A conclusão é declarada por você, sem certificado ou envio à equipe.</p><div class="journey-actions"><button type="button" data-pause="'+m.id+'">Continuar depois</button><button type="button" data-complete="'+m.id+'" '+(done||canFinish(m)?'':'disabled')+'>'+ (done?'Reabrir missão':'Concluir missão')+'</button></div><p class="journey-small" data-save-status role="status"></p></details></article>';
 }
 function renderMissions(){const t=data.trails.find(t=>t.id===trailId);$('mission-trail-title').textContent=t.title;$('mission-trail-summary').textContent=t.subtitle;$('mission-cards').innerHTML=t.missions.map(card).join('');progress();}
 function refreshCard(id,focus){const old=document.querySelector('[data-mission="'+id+'"]'),t=data.trails.find(t=>t.id===trailId),m=missions.get(id);if(!old)return;old.outerHTML=card(m,t.missions.indexOf(m));const cardEl=document.querySelector('[data-mission="'+id+'"]');if(focus)cardEl.querySelector(focus)?.focus({preventScroll:true});progress();}
 function recommended(){const p=window.RotaPlanner?.current?.profile;return p?(p.area==='Matemática'?'matematica':p.area==='Ciência'?'pesquisa':'programacao'):null;}
 function syncRoute(){const id=recommended();$('mission-follow-route').hidden=!id;$('mission-suggestion').textContent=id?'Sua rota combina com a trilha '+data.trails.find(t=>t.id===id).title+'. Você pode escolher qualquer trilha.':'Escolha uma trilha ou monte Minha rota para receber uma sugestão.';if(id&&!manualTrail&&id!==trailId){trailId=id;renderMissions();const ok=save();if(!ok)say('mission-status',savedText(ok));}}
 function exportProgress(){const t=data.trails.find(t=>t.id===trailId);const text=['ROTA DELAS · MINHAS MISSÕES',t.title,'Registros autodeclarados, sem certificação. Exportado em '+pretty(today()),...t.missions.flatMap(m=>{const r=record(m);return ['','MISSÃO: '+m.title,'Estado: '+statusLabels[r.status],'Tempo estimado: '+m.minutes+' min','Entrega: '+m.delivery,...m.checklist.map((s,i)=>(r.checks[i]?'[x] ':'[ ] ')+s),'Meu registro: '+(r.note||'Ainda não registrado.'),...m.resources.map(id=>'Fonte: '+catalog.get(id).url)];})].join('\n');download(text,'minhas-missoes-'+trailId+'.txt','text/plain;charset=utf-8');say('mission-status','Exportação solicitada. Guarde o arquivo para conservar seus registros.');}
 function eventState(e){const now=today();if(e.end<now)return 'Encerrado';if(e.type==='Inscrição'&&e.opensOn&&e.opensOn>now)return 'Abre em '+pretty(e.opensOn);if(e.type==='Inscrição')return e.start===now?'Prazo informado para hoje':'Prazo informado: '+pretty(e.start);if(e.start<=now)return 'Hoje / em andamento';return e.certainty?.startsWith('Previsto')?'Data prevista':'Próximo';}
 function age(e){return Math.floor((new Date(today()+'T12:00Z')-new Date(e.checkedAt+'T12:00Z'))/86400000);}
 function matches(e,omitDate=false){
  const norm=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  if($('agenda-search').value&&!norm([e.title,e.description,e.location,e.audience].join(' ')).includes(norm($('agenda-search').value)))return false;
  if($('agenda-area').value&&e.area!==$('agenda-area').value)return false;
  if($('agenda-kind').value&&e.type!==$('agenda-kind').value)return false;
  if($('agenda-place').value&&e.scope!==$('agenda-place').value)return false;
  if($('agenda-saved-only').checked&&!savedEvents.has(e.id))return false;
  if(omitDate)return true;
  if(selectedDay)return e.start<=selectedDay&&e.end>=selectedDay;
  if(view==='upcoming')return e.end>=today();
  if(view==='month'){const [y,m]=month.split('-').map(Number),last=new Date(Date.UTC(y,m,0)).toISOString().slice(0,10);return e.start<=last&&e.end>=month+'-01';}
  return true;
 }
 function visibleEvents(){return data.events.filter(e=>matches(e)).sort((a,b)=>a.start.localeCompare(b.start)||a.id.localeCompare(b.id));}
 function renderCalendar(){
  const y=Number(month.slice(0,4)),m=Number(month.slice(5,7)),first=new Date(Date.UTC(y,m-1,1)),days=new Date(Date.UTC(y,m,0)).getUTCDate(),offset=(first.getUTCDay()+6)%7;
  $('agenda-month-label').textContent=new Intl.DateTimeFormat('pt-BR',{month:'long',year:'numeric',timeZone:'UTC'}).format(first);
  $('agenda-days').innerHTML='<span class="calendar-gap" aria-hidden="true" style="grid-column:span '+(offset||1)+';'+(!offset?'display:none':'')+'"></span>'+Array.from({length:days},(_,i)=>{const d=month+'-'+String(i+1).padStart(2,'0'),events=data.events.filter(e=>matches(e,true)&&e.start<=d&&e.end>=d);return '<button type="button" data-agenda-day="'+d+'" aria-pressed="'+String(d===selectedDay)+'" '+(d===today()?'aria-current="date"':'')+' aria-label="'+escape(pretty(d))+', '+events.length+' evento'+(events.length!==1?'s':'')+'" class="'+(events.length?'has-events':'')+'">'+(i+1)+(events.length?'<span class="calendar-dot" aria-hidden="true"></span>':'')+'</button>';}).join('');
 }
 function renderEvents(){const list=visibleEvents();$('agenda-count').textContent=list.length+' '+(list.length===1?'registro':'registros')+(selectedDay?' em '+pretty(selectedDay):view==='month'?' no mês exibido':view==='upcoming'?' com datas atuais ou futuras':' incluindo histórico');$('agenda-clear-day').hidden=!selectedDay;$('agenda-export').disabled=!list.length;
  $('agenda-events').innerHTML=list.length?list.map(e=>'<article class="agenda-card" data-event="'+e.id+'"><div class="journey-card-top"><span class="journey-kicker">'+escape(e.type)+' · '+escape(e.scope)+'</span><button type="button" data-event-save="'+e.id+'" aria-pressed="'+savedEvents.has(e.id)+'" aria-label="'+(savedEvents.has(e.id)?'Remover dos salvos: ':'Salvar evento: ')+escape(e.title)+'">'+(savedEvents.has(e.id)?'✓ Salvo':'Salvar')+'</button></div><h3>'+escape(e.title)+'</h3><p class="agenda-date"><time datetime="'+e.start+'">'+pretty(e.start)+'</time>'+(e.end!==e.start?' a <time datetime="'+e.end+'">'+pretty(e.end)+'</time>':'')+(e.timeLabel?'<br>'+escape(e.timeLabel):'')+'</p><p class="journey-status">'+escape(eventState(e))+(e.certainty?' · '+escape(e.certainty):'')+'</p><p>'+escape(e.description)+'</p><dl><dt>Onde</dt><dd>'+escape(e.location)+'</dd><dt>Para quem</dt><dd>'+escape(e.audience)+'</dd></dl><details><summary>Fonte e conferência da data</summary><p>Fonte consultada em '+pretty(e.checkedAt)+'. '+(age(e)>14?'Revisão recomendada: confira eventuais mudanças na organização.':'Confira eventuais alterações na organização antes de participar.')+'</p><p><a href="'+escape(e.source)+'" target="_blank" rel="noopener noreferrer">Abrir fonte oficial ↗</a></p></details><div class="journey-actions"><button type="button" data-event-export="'+e.id+'">Adicionar ao calendário (.ics)</button><a href="'+escape(e.source)+'" target="_blank" rel="noopener noreferrer">Consultar regras ↗</a></div></article>').join(''):'<div class="journey-empty"><h3>Nenhuma data neste recorte</h3><p>Nem todas as iniciativas têm calendário publicado. Experimente outros filtros ou consulte o catálogo.</p><button type="button" data-agenda-reset>Limpar filtros</button></div>';
 }
 function renderAgenda(){renderCalendar();renderEvents();}
 function resetAgenda(){for(const id of ['agenda-search','agenda-area','agenda-kind','agenda-place'])$(id).value='';$('agenda-saved-only').checked=false;selectedDay='';view='upcoming';$('agenda-view').value=view;month=today().slice(0,7);renderAgenda();}
 const icsEscape=s=>String(s).replace(/\\/g,'\\\\').replace(/\r?\n/g,'\\n').replace(/;/g,'\\;').replace(/,/g,'\\,');
 function fold(line){let parts=[],s='',len=0;for(const char of line){const n=new TextEncoder().encode(char).length;if(len+n>75){parts.push(s);s=' ';len=1;}s+=char;len+=n;}parts.push(s);return parts.join('\r\n');}
 function calendarText(list,reminder=false){const lines=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Rota Delas//Agenda Delas//PT-BR','CALSCALE:GREGORIAN','METHOD:PUBLISH','X-WR-CALNAME:Agenda Delas'];
  for(const e of list){lines.push('BEGIN:VEVENT','UID:'+e.id+'@rotadelas-ceara2026.web.app','DTSTAMP:'+new Date().toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,''));
   if(e.startsAt)lines.push('DTSTART:'+e.startsAt.replace(/[-:]/g,''));else lines.push('DTSTART;VALUE=DATE:'+e.start.replace(/-/g,''),'DTEND;VALUE=DATE:'+plus(e.end,1).replace(/-/g,''));
   lines.push('SUMMARY:'+icsEscape(e.title),'DESCRIPTION:'+icsEscape(e.description+'\nPúblico: '+e.audience+'\n'+(e.certainty||'Data informada na fonte')+'. Fonte conferida em '+e.checkedAt+'\n'+e.source+'\nExportar não realiza inscrição nem atualiza alterações futuras automaticamente.'),'LOCATION:'+icsEscape(e.location),'URL:'+e.source,'TRANSP:TRANSPARENT');
   if(reminder&&e.end>=today())lines.push('BEGIN:VALARM','TRIGGER:-P1D','ACTION:DISPLAY','DESCRIPTION:'+icsEscape('Agenda Delas: '+e.title),'END:VALARM');lines.push('END:VEVENT');
  }lines.push('END:VCALENDAR');return lines.map(fold).join('\r\n')+'\r\n';
 }
 function exportEvents(list,name){if(!list.length)return;download(calendarText(list,$('agenda-reminder').checked),name+'.ics','text/calendar;charset=utf-8');say('agenda-status','Calendário exportado com '+list.length+' registro'+(list.length===1?'':'s')+'. Abra no aplicativo de calendário ou importe no Google Agenda. Não realiza inscrição; confira mudanças nas fontes.');}
 function init(){
  load();$('mission-trails').innerHTML=data.trails.map(t=>'<button type="button" data-trail="'+t.id+'" aria-pressed="false">'+escape(t.title)+'</button>').join('');renderMissions();syncRoute();renderAgenda();
  window.addEventListener('rota-profile-change',syncRoute);
  $('mission-trails').addEventListener('click',e=>{const b=e.target.closest('[data-trail]');if(!b)return;manualTrail=true;trailId=b.dataset.trail;const ok=save();renderMissions();say('mission-status','Trilha '+data.trails.find(t=>t.id===trailId).title+' aberta. '+savedText(ok));});
  $('mission-follow-route').addEventListener('click',()=>{const id=recommended();if(id){manualTrail=false;trailId=id;const ok=save();renderMissions();say('mission-status','Trilha sugerida pela sua rota aberta. '+savedText(ok));}});
  $('mission-export').addEventListener('click',exportProgress);
  $('mission-cards').addEventListener('input',e=>{const id=e.target.dataset.note;if(!id)return;const m=missions.get(id),r=record(m);r.note=e.target.value.slice(0,6000);const ok=save(),cardEl=e.target.closest('.mission-card');cardEl.querySelector('[data-note-count]').textContent=r.note.length+' / 6000 caracteres';cardEl.querySelector('[data-save-status]').textContent=savedText(ok);cardEl.querySelector('[data-complete]').disabled=r.status==='done'?false:!canFinish(m);});
  $('mission-cards').addEventListener('change',e=>{const id=e.target.dataset.check;if(!id)return;const m=missions.get(id),r=record(m);r.checks[Number(e.target.dataset.index)]=e.target.checked;const ok=save(),cardEl=e.target.closest('.mission-card');cardEl.querySelector('[data-save-status]').textContent=savedText(ok);cardEl.querySelector('[data-complete]').disabled=r.status==='done'?false:!canFinish(m);});
  $('mission-cards').addEventListener('click',e=>{
   const b=e.target.closest('button');if(!b)return;const id=b.dataset.start||b.dataset.pause||b.dataset.complete;if(!id)return;const m=missions.get(id),r=record(m);if(b.dataset.start){if(r.status!=='done')r.status='doing';const ok=save();refreshCard(id,'summary');document.getElementById('details-'+id).open=true;const trigger=document.querySelector('[data-start="'+id+'"]');trigger.setAttribute('aria-expanded','true');say('mission-status','Missão aberta. '+savedText(ok));}
   else if(b.dataset.pause){r.status=r.status==='done'?'done':'paused';const ok=save();refreshCard(id,'[data-start]');say('mission-status','Missão pausada para continuar. '+savedText(ok));}
   else {if(r.status==='done')r.status='doing';else{if(!canFinish(m))return;r.status='done';}const ok=save();refreshCard(id,'[data-start]');say('mission-status',(r.status==='done'?'Missão concluída por você. ':'Missão reaberta. ')+savedText(ok));}
  });
  $('mission-cards').addEventListener('toggle',e=>{if(e.target.matches('details'))e.target.closest('.mission-card').querySelector('[data-start]').setAttribute('aria-expanded',String(e.target.open));},true);
  for(const id of ['agenda-area','agenda-kind','agenda-place','agenda-view','agenda-saved-only'])$(id).addEventListener('change',()=>{view=$('agenda-view').value;selectedDay='';renderAgenda();});
  $('agenda-search').addEventListener('input',()=>renderAgenda());$('agenda-reset').addEventListener('click',resetAgenda);
  $('agenda-days').addEventListener('click',e=>{const b=e.target.closest('[data-agenda-day]');if(!b)return;selectedDay=selectedDay===b.dataset.agendaDay?'':b.dataset.agendaDay;renderAgenda();document.querySelector('[data-agenda-day="'+b.dataset.agendaDay+'"]')?.focus({preventScroll:true});});
  $('agenda-days').addEventListener('keydown',e=>{const b=e.target.closest('[data-agenda-day]'),shifts={ArrowLeft:-1,ArrowRight:1,ArrowUp:-7,ArrowDown:7};if(!b||!Object.hasOwn(shifts,e.key))return;e.preventDefault();e.stopPropagation();const d=plus(b.dataset.agendaDay,shifts[e.key]);if(d.slice(0,7)!==month){month=d.slice(0,7);view='month';$('agenda-view').value=view;selectedDay='';renderAgenda();}document.querySelector('[data-agenda-day="'+d+'"]')?.focus();});
  for(const [id,shift] of [['agenda-prev',-1],['agenda-next',1]])$(id).addEventListener('click',()=>{const [y,m]=month.split('-').map(Number);month=new Date(Date.UTC(y,m-1+shift,1)).toISOString().slice(0,7);selectedDay='';view='month';$('agenda-view').value=view;renderAgenda();});
  $('agenda-today').addEventListener('click',()=>{month=today().slice(0,7);selectedDay='';renderAgenda();});$('agenda-clear-day').addEventListener('click',()=>{selectedDay='';renderAgenda();});
  $('agenda-export').addEventListener('click',()=>exportEvents(visibleEvents(),'agenda-delas'));
  $('agenda-events').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.hasAttribute('data-agenda-reset')){resetAgenda();$('agenda-search').focus();return;}
   if(b.dataset.eventExport){exportEvents([data.events.find(e=>e.id===b.dataset.eventExport)],b.dataset.eventExport);return;}
   if(b.dataset.eventSave){const id=b.dataset.eventSave;savedEvents.has(id)?savedEvents.delete(id):savedEvents.add(id);let ok=true;try{localStorage.setItem(agendaKey,JSON.stringify([...savedEvents]));}catch{ok=false;}renderAgenda();document.querySelector('[data-event-save="'+id+'"]')?.focus({preventScroll:true});say('agenda-status',(savedEvents.has(id)?'Evento salvo. ':'Evento removido dos salvos. ')+savedText(ok));}
  });
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)renderAgenda();});
 }
 window.RotaJornada={calendarText,eventState,visibleEvents,today,get trail(){return trailId;},get records(){return records;},get savedEvents(){return [...savedEvents];},get persisted(){return persisted;}};
 document.addEventListener('DOMContentLoaded',init);
})();
