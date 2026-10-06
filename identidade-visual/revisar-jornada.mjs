import {spawn} from 'node:child_process';
import {mkdtemp,mkdir,writeFile,stat,readFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join,dirname} from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
const root=dirname(fileURLToPath(import.meta.url));
const site=process.env.ROTA_TEST_URL||pathToFileURL(join(root,'..','dist','index.html')).href;
const output=join(root,'revisao',process.env.ROTA_TEST_URL?'jornada-online':'jornada');await mkdir(output,{recursive:true});
const profile=await mkdtemp(join(tmpdir(),'rota-a11y-review-'));
const chrome=spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',['--headless=new','--disable-gpu','--no-sandbox','--disable-background-networking','--no-first-run','--user-data-dir='+profile,'--remote-debugging-port=0','about:blank'],{windowsHide:true});
let socket;
try{
 const endpoint=await new Promise((resolve,reject)=>{let text='';const timer=setTimeout(()=>reject(Error('Chrome não respondeu')),15000);chrome.stderr.on('data',data=>{text+=data;const found=text.match(/DevTools listening on (ws:\/\/[^\s]+)/);if(found){clearTimeout(timer);resolve(found[1]);}});chrome.on('error',reject);});
 socket=new WebSocket(endpoint);await new Promise((resolve,reject)=>{socket.addEventListener('open',resolve,{once:true});socket.addEventListener('error',reject,{once:true});});
 let sequence=0;const pending=new Map();const errors=[];
 socket.addEventListener('message',event=>{const message=JSON.parse(event.data);const callback=pending.get(message.id);if(callback){pending.delete(message.id);message.error?callback.reject(Error(JSON.stringify(message.error))):callback.resolve(message.result);}if(message.method==='Runtime.exceptionThrown')errors.push(message.params.exceptionDetails);});
 const call=(method,params={},sessionId)=>new Promise((resolve,reject)=>{const id=++sequence;pending.set(id,{resolve,reject});socket.send(JSON.stringify({id,method,params,...(sessionId?{sessionId}:{})}));});
 const {targetId}=await call('Target.createTarget',{url:'about:blank'});const {sessionId}=await call('Target.attachToTarget',{targetId,flatten:true});
 await call('Page.enable',{},sessionId);await call('Runtime.enable',{},sessionId);
 const load=()=>new Promise(resolve=>{const listener=event=>{const msg=JSON.parse(event.data);if(msg.method==='Page.loadEventFired'&&msg.sessionId===sessionId){socket.removeEventListener('message',listener);resolve();}};socket.addEventListener('message',listener);});
 // Data controlada para reproduzir filtros e calendário da revisão de 06/10/2026.
 await call('Page.addScriptToEvaluateOnNewDocument',{source:'{const OriginalDate=Date;class ReviewDate extends OriginalDate{constructor(...args){super(...(args.length?args:["2026-10-06T15:00:00Z"]))}static now(){return new OriginalDate("2026-10-06T15:00:00Z").getTime()}}window.Date=ReviewDate;}'},sessionId);
 let loaded=load();await call('Page.navigate',{url:site},sessionId);await loaded;
 const evaluate=async expression=>{const value=await call('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true},sessionId);if(value.exceptionDetails)throw Error(JSON.stringify(value.exceptionDetails));return value.result.value;};
 const results=[];
 async function check(name,expression){const value=await evaluate(expression);results.push({name,value});if(!value)console.log('FALHOU: '+name);}
 const screenshot=async name=>{await evaluate('new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)))');const picture=await call('Page.captureScreenshot',{format:'png',captureBeyondViewport:false},sessionId);await writeFile(join(output,name+'.png'),Buffer.from(picture.data,'base64'));};


 const tick=()=>evaluate('new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)))');
 const change=async(id,value)=>evaluate('(()=>{const e=document.getElementById('+JSON.stringify(id)+');e.value='+JSON.stringify(value)+';e.dispatchEvent(new Event(e.id==="agenda-search"?"input":"change",{bubbles:true}));})()');
 const nav=async(query='')=>{loaded=load();await call('Page.navigate',{url:site+query},sessionId);await loaded;};
 await check('3 trilhas e 12 missões completas','RotaJornadaDados.trails.length===3&&RotaJornadaDados.trails.flatMap(t=>t.missions).length===12&&RotaJornadaDados.trails.every(t=>t.missions.every(m=>m.steps.length>=3&&m.materials.length&&m.checklist.length===3&&m.delivery))');
 await check('9 datas oficiais com consulta','RotaJornadaDados.events.length===9&&RotaJornadaDados.events.every(e=>e.source.startsWith("https://")&&e.checkedAt==="2026-10-06")');
 await evaluate('document.querySelector("[data-start]").click()');await tick();
 await check('Começar abre e registra andamento','document.querySelector(".mission-card details").open&&RotaJornada.records["prog-descobrir"].status==="doing"');
 await check('Conclusão exige entrega e conferências','document.querySelector("[data-complete]").disabled');
 await evaluate('(()=>{const e=document.getElementById("note-prog-descobrir");e.value="Comparei os objetivos de duas iniciativas e registrei as fontes oficiais consultadas.";e.dispatchEvent(new Event("input",{bubbles:true}));document.querySelectorAll("[data-check=prog-descobrir]").forEach(e=>{e.checked=true;e.dispatchEvent(new Event("change",{bubbles:true}));});})()');
 await check('Entrega salva sem perda de foco','JSON.parse(localStorage.getItem("rota-delas-missoes-v1"))["prog-descobrir"].note.length>30&&!document.querySelector("[data-complete]").disabled');
 await evaluate('document.querySelector("[data-complete]").click()');await tick();
 await check('Conclusão atualiza progresso imediatamente','RotaJornada.records["prog-descobrir"].status==="done"&&document.getElementById("mission-progress").value===1');
 await evaluate('document.querySelector("[data-start=prog-descobrir]").click();document.querySelector("[data-complete=prog-descobrir]").click()');await tick();
 await check('Reabrir preserva entrega e atualiza progresso','RotaJornada.records["prog-descobrir"].status==="doing"&&RotaJornada.records["prog-descobrir"].note.length>30&&document.getElementById("mission-progress").value===0');
 await evaluate('document.querySelector("[data-pause=prog-descobrir]").click()');
 await check('Pausar fecha e guarda a missão','RotaJornada.records["prog-descobrir"].status==="paused"&&!document.getElementById("details-prog-descobrir").open');
 await evaluate('document.querySelector("[data-trail=matematica]").click()');
 await nav();await check('Trilha escolhida persiste após recarga','RotaJornada.trail==="matematica"&&RotaJornada.records["prog-descobrir"].status==="paused"');
 await evaluate('document.querySelector("[data-route-area=Ciência]").click();document.getElementById("mission-follow-route").click()');
 await check('Trilha acompanha interesse da rota','RotaJornada.trail==="pesquisa"&&document.querySelector("[data-trail=pesquisa]").getAttribute("aria-pressed")==="true"');
 await evaluate('document.querySelector("[data-trail=matematica]").click()');await nav();
 await check('Escolha manual prevalece sobre rota após recarga','RotaJornada.trail==="matematica"');
 await evaluate('document.querySelector("[data-route-area=Ciência]").click();document.getElementById("mission-follow-route").click()');await nav();
 await check('Seguir rota mantém seleção após recarga','RotaJornada.trail==="pesquisa"');
 await evaluate('document.getElementById("forget-route").click()');
 await check('Limpar rota preserva missões e reinicia sugestão','RotaJornada.records["prog-descobrir"].status==="paused"&&document.getElementById("mission-follow-route").hidden');
 await change('agenda-kind','Prova');await check('Filtros de agenda combinam e atualizam','RotaJornada.visibleEvents().every(e=>e.type==="Prova")');
 await change('agenda-view','all');await change('agenda-area','Tecnologia e Computação');
 await check('Histórico diferencia competição encerrada','RotaJornada.visibleEvents().length===1&&RotaJornada.eventState(RotaJornada.visibleEvents()[0])==="Encerrado"');
 await evaluate('document.getElementById("agenda-reset").click()');await change('agenda-view','all');
 await check('Reset restaura todos os controles e histórico traz 9 registros','RotaJornada.visibleEvents().length===9&&!document.getElementById("agenda-saved-only").checked');
 await evaluate('document.querySelector("[data-event-save=cfc-inscricao-2026]").click();document.getElementById("agenda-saved-only").checked=true;document.getElementById("agenda-saved-only").dispatchEvent(new Event("change"))');
 await check('Salvar e somente salvos funcionam','RotaJornada.visibleEvents().length===1&&RotaJornada.savedEvents.includes("cfc-inscricao-2026")');
 await nav();await check('Eventos salvos persistem','RotaJornada.savedEvents.includes("cfc-inscricao-2026")');
 await evaluate('document.querySelector("[data-agenda-day]:nth-of-type(17)").click()');
 await check('Dia selecionado filtra prova e mantém seleção','RotaJornada.visibleEvents().length===1&&RotaJornada.visibleEvents()[0].id==="obmep-prova-2026"&&document.querySelector("[data-agenda-day]:nth-of-type(17)").getAttribute("aria-pressed")==="true"');
 await evaluate('document.querySelector("[data-agenda-day]:nth-of-type(17)").click()');
 await check('Clicar novamente remove o filtro do dia','document.getElementById("agenda-clear-day").hidden');
 await evaluate('document.getElementById("agenda-next").click();document.querySelector("[data-agenda-day]:nth-of-type(6)").click()');
 await check('Intervalos aparecem em dias intermediários','RotaJornada.visibleEvents().some(e=>e.id==="cfc-mostra-2026")&&RotaJornada.visibleEvents().some(e=>e.id==="feira-conhecimento-2026")');
 await evaluate('document.querySelector("[data-agenda-day]:nth-of-type(30)").focus()');await call('Input.dispatchKeyEvent',{type:'keyDown',key:'ArrowRight',code:'ArrowRight',windowsVirtualKeyCode:39},sessionId);await tick();
 await check('Setas navegam entre meses','document.activeElement.dataset.agendaDay==="2026-12-01"');
 await check('ICS de intervalo tem fim exclusivo','(()=>{const e=RotaJornadaDados.events.find(e=>e.id==="obi-semana-2026"),s=RotaJornada.calendarText([e]);return s.includes("DTSTART;VALUE=DATE:20261206")&&s.includes("DTEND;VALUE=DATE:20261213")})()');
 await check('ICS de prova respeita Brasília e não inventa fim','(()=>{const e=RotaJornadaDados.events.find(e=>e.id==="obmep-prova-2026"),s=RotaJornada.calendarText([e]);return s.includes("DTSTART:20261017T173000Z")&&!s.includes("DTEND")})()');
 await check('ICS tem UID estável, CRLF e lembrete opcional','(()=>{const s=RotaJornada.calendarText(RotaJornadaDados.events,true);return s.includes("UID:cfc-inscricao-2026@rotadelas-ceara2026.web.app")&&s.includes("TRIGGER:-P1D")&&s.endsWith("END:VCALENDAR"+String.fromCharCode(13,10))&&s.split(String.fromCharCode(13,10)).every(l=>new TextEncoder().encode(l).length<=75)})()');
 await evaluate('HTMLAnchorElement.prototype.click=function(){window.__download={name:this.download,url:this.href}};document.getElementById("agenda-reset").click();document.getElementById("agenda-export").click()');
 await check('Download efetivo usa blob de calendário','window.__download.name==="agenda-delas.ics"&&window.__download.url.startsWith("blob:")');
 const ics=await evaluate('fetch(window.__download.url).then(r=>r.text())');await writeFile(join(output,'agenda-exportada.ics'),ics);
 await check('Arquivo exportado contém eventos visíveis','(s=>s.includes("BEGIN:VEVENT")&&s.includes("URL:https://"))('+JSON.stringify(ics)+')');
 await evaluate('document.getElementById("mission-export").click()');await check('Missões exportam arquivo local','window.__download.name.startsWith("minhas-missoes-")&&window.__download.name.endsWith(".txt")');
 await change('agenda-search','xxx-sem-datas');await check('Estado vazio e exportação desabilitada','!RotaJornada.visibleEvents().length&&document.getElementById("agenda-export").disabled&&document.querySelector(".journey-empty")');
 await evaluate('document.getElementById("agenda-reset").click()');
 await evaluate('document.querySelector("[data-trail=programacao]").click();document.querySelector("[data-start=prog-descobrir]").click()');
 for(const theme of ['normal','light','dark','blue','mono']){
  await change('a11y-theme',theme);
  for(const [width,height,scale] of [[320,568,100],[320,568,200],[390,844,175],[844,390,200],[1440,900,100]]){
   await call('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:width<1000},sessionId);
   await evaluate('(()=>{const e=document.getElementById("a11y-size");e.value='+scale+';e.dispatchEvent(new Event("input"))})()');await tick();
   await check('Sem overflow '+theme+' '+width+' '+scale,'document.documentElement.scrollWidth<=innerWidth&&document.getElementById("missoes").scrollWidth<=innerWidth&&document.getElementById("agenda").scrollWidth<=innerWidth');
  }
 }
 await call('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true},sessionId);await change('a11y-theme','normal');await evaluate('document.getElementById("a11y-size").value=100;document.getElementById("a11y-size").dispatchEvent(new Event("input"));document.getElementById("missoes").scrollIntoView({behavior:"instant"})');await tick();await screenshot('missoes-mobile');
 await evaluate('document.getElementById("agenda").scrollIntoView({behavior:"instant"})');await tick();await screenshot('agenda-mobile');
 await call('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false},sessionId);await evaluate('document.getElementById("missoes").scrollIntoView({behavior:"instant"})');await tick();await screenshot('missoes-desktop');
 await evaluate('document.getElementById("agenda").scrollIntoView({behavior:"instant"})');await tick();await screenshot('agenda-desktop');
 await evaluate('document.querySelector(".agenda-calendar").scrollIntoView({behavior:"instant"})');await tick();await screenshot('agenda-calendario-desktop');
 await call('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true},sessionId);await evaluate('document.querySelector(".agenda-calendar").scrollIntoView({behavior:"instant"})');await tick();await screenshot('agenda-calendario-mobile');
 await check('Calendário mantém números em uma linha','(()=>{const e=document.querySelector("[data-agenda-day]:nth-of-type(17)"),r=document.createRange();r.selectNode(e.firstChild);return r.getClientRects().length===1})()');
 await check('Escopos de leitura incluem novas seções','document.querySelector("#a11y-scope [value=missoes]")&&document.querySelector("#a11y-player-scope [value=agenda]")');
 for(const trail of await evaluate('RotaJornadaDados.trails')){
  await evaluate('document.querySelector("[data-trail='+trail.id+']").click()');
  for(const m of trail.missions){
   await evaluate('(()=>{document.querySelector("[data-start='+m.id+']").click();const n=document.getElementById("note-'+m.id+'");n.value="Registro técnico de revisão: atividade executada, fontes conferidas e entrega documentada.";n.dispatchEvent(new Event("input",{bubbles:true}));document.querySelectorAll("[data-check='+m.id+']").forEach(c=>{c.checked=true;c.dispatchEvent(new Event("change",{bubbles:true}));});document.querySelector("[data-complete='+m.id+']").click();})()');
   await check('Fluxo completo da missão '+m.id,'RotaJornada.records['+JSON.stringify(m.id)+'].status==="done"');
  }
 }
 await check('Progresso total alcança 12 missões','document.getElementById("mission-progress-text").textContent.includes("12 de 12")');
 await evaluate('(()=>{window.__spoken=[];Object.defineProperty(window,"speechSynthesis",{configurable:true,value:{getVoices:()=>[],cancel:()=>{},speak:u=>__spoken.push(u),pause:()=>{},resume:()=>{}}});})()');
 for(const [scope,title] of [['missoes','Seu interesse vira experiência'],['agenda','Uma data. Um próximo passo']]){
  await change('a11y-player-scope',scope);await evaluate('document.getElementById("a11y-player-play").click()');
  await check('Leitor reconhece seção '+scope,'__spoken.at(-1).text.includes('+JSON.stringify(title)+')&&!!document.querySelector(".tts-reading-block").closest("#'+scope+'")');
  await evaluate('document.getElementById("a11y-player-stop").click()');
 }
 await check('IDs únicos','(()=>{const ids=[...document.querySelectorAll("[id]")].map(e=>e.id);return ids.length===new Set(ids).size})()');
 await evaluate('Object.defineProperty(Storage.prototype,"setItem",{configurable:true,value(){throw new DOMException("Bloqueado","SecurityError")}});document.querySelector("[data-trail=matematica]").click();document.querySelector("[data-start=mat-explorar]").click()');
 await check('Armazenamento bloqueado tem aviso honesto','!RotaJornada.persisted&&document.getElementById("mission-status").textContent.includes("bloqueou")');
 await check('Sem exceções JavaScript',JSON.stringify(errors.length===0));
 await writeFile(join(output,'resultado.json'),JSON.stringify({checkedAt:new Date().toISOString(),site,controlledDate:"2026-10-06",checks:results.length,failed:results.filter(r=>!r.value),errors,results},null,2));
 console.log(results.length+' verificações; '+results.filter(r=>!r.value).length+' falhas.');
 if(results.some(r=>!r.value)||errors.length)process.exitCode=1;
}finally{if(socket)socket.close();chrome.kill();}
