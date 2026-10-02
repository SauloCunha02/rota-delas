import {spawn} from 'node:child_process';
import {mkdtemp,mkdir,writeFile,stat,readFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join,dirname} from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
const root=dirname(fileURLToPath(import.meta.url));
const output=join(root,'revisao','auditoria');await mkdir(output,{recursive:true});
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
 let loaded=load();await call('Page.navigate',{url:pathToFileURL(join(root,'..','dist','index.html')).href},sessionId);await loaded;
 const evaluate=async expression=>{const value=await call('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true},sessionId);if(value.exceptionDetails)throw Error(JSON.stringify(value.exceptionDetails));return value.result.value;};
 const results=[];
 async function check(name,expression){const value=await evaluate(expression);results.push({name,value});if(!value)console.log('FALHOU: '+name);}
 const screenshot=async name=>{await evaluate('new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)))');const picture=await call('Page.captureScreenshot',{format:'png',captureBeyondViewport:false},sessionId);await writeFile(join(output,name+'.png'),Buffer.from(picture.data,'base64'));};


 const change=async(id,value,event='change')=>evaluate('(()=>{const e=document.getElementById('+JSON.stringify(id)+');e.value='+JSON.stringify(value)+';e.dispatchEvent(new Event('+JSON.stringify(event)+',{bubbles:true}));})()');
 const tick=()=>evaluate('new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)))');
 const nav=async(page='index.html',query='')=>{loaded=load();await call('Page.navigate',{url:pathToFileURL(join(root,'..','dist',page)).href+query},sessionId);await loaded;};
 const size=async(w,h,scale=100)=>{await call('Emulation.setDeviceMetricsOverride',{width:w,height:h,deviceScaleFactor:1,mobile:w<1000},sessionId);await call('Emulation.setTouchEmulationEnabled',{enabled:w<1000,maxTouchPoints:1},sessionId);await change('a11y-size',scale,'input');await tick();};
 const ready=()=>evaluate('new Promise((resolve,reject)=>{let n=0;const tick=()=>{if(RotaPlanner.imageReady)resolve();else if(++n>100)reject(Error("PNG não gerado"));else setTimeout(tick,50)};tick()})');
 await evaluate('document.querySelector("[data-route-area]").click()');
 // Exercícios de falhas de permissão e reabertura rápida que os testes anteriores não cobriam.
 await evaluate('document.getElementById("create-story").click()');await ready();
 await evaluate('Object.defineProperty(navigator,"clipboard",{configurable:true,value:{writeText:async()=>{throw Error("Negado")}}});window.__copyFocused=false;document.execCommand=()=>{window.__copyFocused=!!document.activeElement?.matches("textarea")&&!document.activeElement.closest("[inert]")&&document.getElementById("story-panel").contains(document.activeElement);return window.__copyFocused};document.getElementById("story-copy-link").click()');await tick();
 await check('Cópia alternativa funciona dentro do diálogo','window.__copyFocused&&document.getElementById("story-status").textContent.startsWith("Link copiado")');
 await evaluate('document.getElementById("story-close").click();document.getElementById("create-story").click()');await tick();await evaluate('new Promise(resolve=>setTimeout(resolve,100))');
 await check('Fechar e reabrir rapidamente não cancela novo PNG','document.getElementById("story-panel").open&&RotaPlanner.imageReady');
 await call('Input.dispatchKeyEvent',{type:'keyDown',key:'a',code:'KeyA',altKey:true,modifiers:1,windowsVirtualKeyCode:65},sessionId);await call('Input.dispatchKeyEvent',{type:'keyUp',key:'a',code:'KeyA',modifiers:1,windowsVirtualKeyCode:65},sessionId);await tick();
 await check('Atalho de acessibilidade não empilha modais','document.querySelectorAll("dialog[open]").length===1');
 await evaluate('document.querySelectorAll("dialog[open]").forEach(d=>d.close())');await tick();
 await nav('index.html','?rota=nao-existe&area=Ciência&uf=CE#rota');
 await check('Link inválido tem aviso específico','/inválid|indisponíve|atualizad|incompatíve/i.test(document.getElementById("route-status").textContent)&&!document.getElementById("route-status").textContent.includes("compartilhada aberta")');
 await nav();await evaluate('document.querySelector("[data-route-area]").click();document.getElementById("save-route").focus();document.getElementById("save-route").click();document.getElementById("create-story").click()');await ready();
 // Conteúdo e painéis em todas as paletas e com ajustes simultâneos.
 for(const theme of ['normal','light','dark','blue','mono']){
  await change('a11y-theme',theme);
  for(const [w,h,scale] of [[320,568,100],[320,568,200],[390,844,175],[844,390,200],[1440,900,200]]){
   await size(w,h,scale);
   await check('Story cabe '+theme+' '+w+' '+scale,'document.documentElement.scrollWidth<=innerWidth&&document.getElementById("story-panel").scrollWidth<=document.getElementById("story-panel").clientWidth');
   await evaluate('document.getElementById("story-download").scrollIntoView({block:"center"});');await tick();
   await check('Download acessível por rolagem '+theme+' '+w+' '+scale,'(()=>{const b=document.getElementById("story-download").getBoundingClientRect(),d=document.getElementById("story-panel").getBoundingClientRect(),h=document.querySelector("#story-panel .preview-top").getBoundingClientRect();return b.left>=d.left&&b.right<=d.right&&b.top>=h.bottom&&b.bottom<=d.bottom})()');
  }
 }
 await screenshot('story-controles-200');await evaluate('document.getElementById("story-close").click()');await tick();
 for(const scale of [100,125,150,175,200]){
  await size(320,568,scale);await evaluate('document.querySelector(".route-personalize details").open=true;document.querySelectorAll(".route-result details").forEach(d=>d.open=true)');
  await check('Rota completa cabe '+scale,'document.documentElement.scrollWidth<=innerWidth&&document.getElementById("rota").scrollWidth<=innerWidth');
 }
 await evaluate('document.getElementById("rota").scrollIntoView({block:"start",behavior:"instant"})');await tick();await screenshot('rota-320-200');
 // Opções assistidas combinadas.
 await size(320,568,200);await evaluate('document.getElementById("a11y-open").click();document.getElementById("a11y-spacing").checked=true;document.getElementById("a11y-spacing").dispatchEvent(new Event("change"));document.getElementById("a11y-font").checked=true;document.getElementById("a11y-font").dispatchEvent(new Event("change"));document.getElementById("a11y-close").click()');await tick();
 await check('Rota com fonte e espaçamento não excede tela','document.documentElement.scrollWidth<=innerWidth');
 await evaluate('document.getElementById("create-story").click()');await ready();
 await check('Story com fonte e espaçamento não excede modal','document.getElementById("story-panel").scrollWidth<=document.getElementById("story-panel").clientWidth');
 await evaluate('document.getElementById("story-close").click()');await tick();await nav('cadastro.html');
 await check('Cadastro não tem IDs duplicados','(()=>{const ids=[...document.querySelectorAll("[id]")].map(e=>e.id);return ids.length===new Set(ids).size})()');
 await size(320,568,200);
 await evaluate('document.getElementById("a11y-open").click()');await change('a11y-theme','normal');await evaluate('document.getElementById("a11y-reset").click();document.getElementById("a11y-close").click()');await size(320,568,200);
 // Esc no cadastro deve restaurar o foco sem exigir clique no fechar.
 await evaluate('(()=>{const f=document.getElementById("initiative-form"),v={title:"Iniciativa de teste",institution:"Escola de teste",url:"https://example.org/projeto",kind:"Projeto",area:"Tecnologia e Computação",focus:"Meninas em foco",scope:"Local",state:"CE",city:"Fortaleza",mode:"Online",audience:"Estudantes do Ensino Médio",description:"Descrição institucional de teste, sem submissão real.",conditions:"Consultar fonte"};Object.entries(v).forEach(([k,v])=>f.elements[k].value=v);f.querySelectorAll("input[type=checkbox][required]").forEach(e=>e.checked=true);f.requestSubmit()})()');
 await check('Prévia de cadastro abre','document.getElementById("submission-preview").open');
 await call('Input.dispatchKeyEvent',{type:'keyDown',key:'Escape',code:'Escape',windowsVirtualKeyCode:27},sessionId);await call('Input.dispatchKeyEvent',{type:'keyUp',key:'Escape',code:'Escape',windowsVirtualKeyCode:27},sessionId);await tick();
 await check('Esc da prévia devolve foco ao botão de envio','!document.getElementById("submission-preview").open&&document.activeElement===document.querySelector("#initiative-form [type=submit]")');
 await screenshot('cadastro-320-200');
 // Atualizações reais das preferências e restauração integral da seção.
 await nav();await size(390,844);await change('route-goal','criar');
 await check('Preferências atualizam antes da escolha de área','document.getElementById("route-preferences").textContent.includes("Criar um projeto")&&document.getElementById("route-status").textContent.includes("Escolha uma área")');
 await evaluate('document.querySelector("[data-route-area]").click()');await change('route-goal','aprender');const learnIds=await evaluate('RotaPlanner.current.items.map(r=>r.id).join(",")');await change('route-goal','criar');
 await check('Criar e aprender têm percursos distintos','RotaPlanner.current.items.map(r=>r.id).join(",")!=='+JSON.stringify(learnIds)+'&&RotaPlanner.current.profile.goal==="criar"');
 await change('route-mode','Online');
 await check('Formato atualiza resultado imediatamente','RotaPlanner.current.profile.mode==="Online"&&RotaPlanner.current.items.every(r=>r.mode==="Online")&&document.getElementById("route-preferences").textContent.includes("Online")');
 await evaluate('document.querySelector("#route-topics input[value=Programação]").click()');
 await check('Caixa de tema atualiza perfil contador e resumo','RotaPlanner.current.profile.topics.includes("Programação")&&document.getElementById("route-topics-count").textContent==="1 de 3 temas selecionados"&&document.getElementById("route-preferences").textContent.includes("Programação")');
 await change('route-uf','SP');
 await check('Estado atualiza resumo e candidatos','RotaPlanner.current.profile.uf==="SP"&&document.getElementById("route-preferences").textContent.includes("São Paulo")&&RotaPlanner.current.items.every(r=>r.scope==="Nacional"||r.states.includes("SP"))');
 await evaluate('document.querySelector("[data-route-next]").click()');await change('route-goal','competir');
 await check('Mudança de preferências remove próximo passo antigo','RotaPlanner.nextId===""&&!document.querySelector("[data-route-next][aria-pressed=true]")');
 await evaluate('document.querySelector("#cards [data-favorite]").click();document.querySelector("[data-route-next]").click();document.getElementById("save-route").click()');
 const favorites=await evaluate('localStorage.getItem("rota-delas-favoritos")');
 const shared=await evaluate('RotaPlanner.routeLink()');const ids=await evaluate('RotaPlanner.current.items.map(r=>r.id)');
 const sharedUrl=new URL(shared);sharedUrl.searchParams.set('temas','Robótica,Programação');sharedUrl.searchParams.set('formato','');const validProfile={area:'Tecnologia e Computação',uf:'SP',topics:['Robótica','Programação'],goal:'competir',mode:''};
 // Preserva uma rota válida mesmo se os temas do link vierem em ordem diferente.
 await nav('index.html','?'+sharedUrl.searchParams.toString()+'#rota');
 await check('Temas fora de ordem não reconstroem a rota recebida','RotaPlanner.current.items.map(r=>r.id).join(",")==='+JSON.stringify(ids.join(','))+'&&RotaPlanner.nextId==='+JSON.stringify(new URL(shared).searchParams.get('passo')));
 await check('Leitor começa na seção do link','document.getElementById("a11y-player-scope").value==="rota"');
 await evaluate('document.querySelector(".route-personalize details").open=true;document.getElementById("forget-route").click()');
 await check('Limpar restaura área temas objetivo formato e estado','RotaPlanner.current===null&&state.routeArea===null&&state.routeUf==="CE"&&document.getElementById("route-goal").value==="explorar"&&document.getElementById("route-mode").value===""&&!document.querySelector("#route-topics input:checked")&&!document.querySelector("[data-route-area][aria-pressed=true]")&&document.querySelector(".route-placeholder")&&document.getElementById("route-topics-count").textContent==="0 de 3 temas selecionados"&&!document.querySelector(".route-personalize details").open');
 await check('Limpar apaga salvamento e parâmetros mas preserva favoritos','!localStorage.getItem("rota-delas-minha-rota-v1")&&!new URL(location.href).searchParams.has("rota")&&localStorage.getItem("rota-delas-favoritos")==='+JSON.stringify(favorites));
 await check('Limpar invalida imagem e próximo passo','!RotaPlanner.imageReady&&RotaPlanner.nextId===""&&document.getElementById("story-download").disabled&&!document.getElementById("story-preview").hasAttribute("src")');
 await nav();
 await check('Recarregar após limpeza mantém seção inicial','RotaPlanner.current===null&&document.getElementById("restore-route").hidden&&document.querySelector(".route-placeholder")');
 // A leitura assistida não intercepta cliques em rótulos, controles e disclosures.
 await evaluate('window.__speaks=[];Object.defineProperty(window,"speechSynthesis",{configurable:true,value:{getVoices:()=>[],cancel:()=>{},speak:u=>window.__speaks.push(u),pause:()=>window.__paused=true,resume:()=>{}}});document.getElementById("a11y-listen").checked=true;document.getElementById("a11y-listen").dispatchEvent(new Event("change"));document.querySelector("[data-route-area]").click();document.querySelector(".route-personalize details").open=true;document.querySelector("#route-topics label").click()');
 await check('Rótulo da caixa não dispara voz e preserva seleção','window.__speaks.length===0&&document.querySelectorAll("#route-topics input:checked").length===1&&RotaPlanner.current.profile.topics.length===1');
 await evaluate('document.querySelector(".route-result summary").click()');
 await check('Abrir justificativa não dispara leitura','window.__speaks.length===0&&document.querySelector(".route-result details").open');
 await change('a11y-scope','rota');await evaluate('document.getElementById("a11y-player-play").click();document.getElementById("create-story").click()');await ready();await tick();
 await check('Abrir Story pausa voz e mantém controle ao fechar','window.__paused===true&&document.getElementById("a11y-player-play").textContent==="Play"&&document.getElementById("a11y-player").hidden');
 await evaluate('document.getElementById("story-close").click()');await tick();
 await check('Leitor reaparece pausado após fechar Story','!document.getElementById("a11y-player").hidden&&document.getElementById("a11y-player-play").textContent==="Play"');
 await evaluate('document.getElementById("a11y-listen").checked=false;document.getElementById("a11y-listen").dispatchEvent(new Event("change"));location.hash="salvos"');await tick();
 await check('Mudança nativa de hash atualiza escopo','document.getElementById("a11y-player-scope").value==="salvos"');
 // Falhas e permissões: manter a função útil e avisar sem confirmação enganosa.
 await nav();await evaluate('document.querySelector("[data-route-area]").click();document.getElementById("create-story").click()');await ready();
 await evaluate('Object.defineProperty(navigator,"canShare",{configurable:true,value:()=>{throw Error("API indisponível")}});document.getElementById("story-retry").click()');await ready();
 await check('Falha de canShare preserva PNG download e aviso correto','RotaPlanner.imageReady&&!document.getElementById("story-download").disabled&&document.getElementById("story-share").disabled&&document.getElementById("story-status").textContent.startsWith("Imagem pronta")');
 await evaluate('Object.defineProperty(navigator,"clipboard",{configurable:true,value:{writeText:async()=>{throw Error("Bloqueado")}}});document.execCommand=()=>false;document.getElementById("story-copy-link").click()');await tick();
 await check('Sem permissão de cópia existe alternativa selecionável no modal','document.querySelector("#story-panel .copy-manual textarea")===document.activeElement&&document.activeElement.readOnly&&document.activeElement.value.includes("rota=")&&document.getElementById("story-status").textContent.includes("Selecione")');
 await evaluate('Object.defineProperty(navigator,"canShare",{configurable:true,value:()=>true});Object.defineProperty(navigator,"share",{configurable:true,value:()=>{window.__shareCount=(window.__shareCount||0)+1;return new Promise(resolve=>window.__resolveShare=resolve)}});document.getElementById("story-retry").click()');await ready();
 await evaluate('document.getElementById("story-share").click();document.getElementById("story-share").click()');
 await check('Dois cliques não abrem dois compartilhamentos','window.__shareCount===1&&document.getElementById("story-share").disabled&&document.getElementById("story-share").getAttribute("aria-busy")==="true"');
 await evaluate('window.__resolveShare()');await tick();
 await check('Fim de compartilhamento libera botão','!document.getElementById("story-share").disabled&&!document.getElementById("story-share").hasAttribute("aria-busy")');
 await evaluate('CanvasRenderingContext2D.prototype.roundRect=undefined;document.getElementById("story-retry").click()');await ready();
 await check('PNG funciona sem API roundRect','RotaPlanner.imageReady');
 await evaluate('document.getElementById("story-close").click()');await tick();
 await evaluate('window.__setItem=Storage.prototype.setItem;Storage.prototype.setItem=function(){throw Error("Bloqueado")};document.getElementById("save-route").click()');
 await check('Salvar bloqueado não afirma persistência','document.getElementById("route-status").textContent.includes("não permite salvar")');
 await evaluate('document.querySelector("#cards [data-favorite]").click()');
 await check('Favoritos bloqueados continuam locais com aviso explícito','document.getElementById("app-status").textContent.includes("nesta página")&&document.getElementById("app-status").textContent.includes("não permite")&&[...document.querySelectorAll("#cards [data-favorite]")].every(b=>b.getAttribute("aria-pressed")===String(state.favorites.has(b.dataset.favorite)))');
 await evaluate('Storage.prototype.setItem=window.__setItem;document.getElementById("save-route").click();window.__removeItem=Storage.prototype.removeItem;Storage.prototype.removeItem=function(){throw Error("Bloqueado")};document.getElementById("forget-route").click()');
 await check('Limpeza bloqueada reinicia interface e informa limite','RotaPlanner.current===null&&document.getElementById("route-status").textContent.includes("não permitiu apagar")&&document.getElementById("restore-route").hidden===false');
 await evaluate('Storage.prototype.removeItem=window.__removeItem;document.getElementById("forget-route").click();localStorage.setItem("rota-delas-favoritos",JSON.stringify(["inexistente",{},42]));localStorage.setItem("rota-delas-minha-rota-v1","JSON inválido")');
 await nav();
 await check('Armazenamento corrompido não trava inicialização','state.favorites.size===0&&RotaPlanner.current===null&&document.getElementById("restore-route").hidden');
 // Retorno pelo histórico e navegador sem síntese de voz.
 await nav();await evaluate('window.__speaks=[];Object.defineProperty(window,"speechSynthesis",{configurable:true,value:{getVoices:()=>[],cancel:()=>{},speak:u=>window.__speaks.push(u),pause:()=>{},resume:()=>{}}});document.getElementById("a11y-listen").checked=true;document.getElementById("a11y-listen").dispatchEvent(new Event("change"));document.getElementById("a11y-player-play").click();window.dispatchEvent(new PageTransitionEvent("pageshow",{persisted:true}))');
 await check('Retorno de página não apresenta áudio fantasma','document.getElementById("a11y-player-play").textContent==="Play"&&document.getElementById("a11y-player-status").textContent.includes("Página retomada")');
 const injected=await call('Page.addScriptToEvaluateOnNewDocument',{source:'Object.defineProperty(window,"speechSynthesis",{configurable:true,value:undefined});Object.defineProperty(window,"SpeechSynthesisUtterance",{configurable:true,value:undefined});'},sessionId);
 await nav();await evaluate('document.querySelector("[data-route-area]").click();document.getElementById("a11y-open").click()');
 await check('Navegador sem voz tem aviso e conserva controles de navegação','document.getElementById("a11y-read").disabled&&document.getElementById("a11y-speech-status").textContent.includes("não oferece")&&RotaPlanner.current.items.length===3');
 await evaluate('document.getElementById("a11y-close").click();document.getElementById("create-story").click()');await ready();
 await check('Story funciona mesmo sem síntese de voz','RotaPlanner.imageReady&&!document.getElementById("story-download").disabled');
 await call('Page.removeScriptToEvaluateOnNewDocument',{identifier:injected.identifier},sessionId);
 await check('Nenhuma exceção JavaScript',JSON.stringify(errors.length===0));
 await writeFile(join(output,'resultado.json'),JSON.stringify({checks:results.length,failed:results.filter(r=>!r.value),errors,results},null,2));
 console.log(results.length+' verificações; '+results.filter(r=>!r.value).length+' falhas.');
 if(results.some(r=>!r.value)||errors.length)process.exitCode=1;
}finally{if(socket)socket.close();chrome.kill();}