import {spawn} from 'node:child_process';
import {mkdtemp,mkdir,writeFile,stat,readFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join,dirname} from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
const root=dirname(fileURLToPath(import.meta.url));
const output=join(root,'revisao','personalizacao');await mkdir(output,{recursive:true});
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
 async function check(name,expression){const value=await evaluate(expression);results.push({name,value});if(!value)throw Error('Falhou: '+name);}
 const screenshot=async name=>{await evaluate('new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)))');const picture=await call('Page.captureScreenshot',{format:'png',captureBeyondViewport:false},sessionId);await writeFile(join(output,name+'.png'),Buffer.from(picture.data,'base64'));};


 const change=async(id,value)=>evaluate('(()=>{const e=document.getElementById('+JSON.stringify(id)+');e.value='+JSON.stringify(value)+';e.dispatchEvent(new Event("change",{bubbles:true}));})()');
 const ready=()=>evaluate('new Promise((resolve,reject)=>{let n=0;const tick=()=>{if(RotaPlanner.imageReady)resolve();else if(++n>150)reject(Error("PNG não gerado"));else setTimeout(tick,100)};tick()})');
 await check('Preferências e 14 temas disponíveis','document.querySelectorAll("#route-topics input").length===14&&document.getElementById("route-goal").options.length===4');
 await check('Entrada incompleta e malformada normalizada','RotaPlanner.clean(null).goal==="explorar"&&RotaPlanner.clean({topics:["falso"],uf:"ZZ",mode:"falso"}).topics.length===0&&RotaPlanner.clean({goal:"__proto__",uf:"constructor"}).goal==="explorar"&&RotaPlanner.clean({goal:"__proto__",uf:"constructor"}).uf===""');
 await check('Matriz de áreas estados objetivos e formatos respeita restrições','(()=>{for(const area of ["Tecnologia e Computação","Ciência","Matemática"])for(const uf of ["",...Object.keys(RotaCatalog.states)])for(const goal of ["explorar","aprender","criar","competir"])for(const mode of ["","Online","Presencial"]){const p={area,uf,goal,mode},a=RotaPlanner.plan(p),b=RotaPlanner.plan(p),valid=new Set(RotaPlanner.candidates(a.profile).map(r=>r.id));if(a.items.length>3||new Set(a.items.map(r=>r.id)).size!==a.items.length||a.items.some(r=>!valid.has(r.id))||a.items.map(r=>r.id).join(",")!==b.items.map(r=>r.id).join(","))return false;}return true})()');
 await evaluate('document.querySelector("[data-route-area]").click()');
 await check('Rota tem três recursos e justificativas','RotaPlanner.current.items.length===3&&new Set(RotaPlanner.current.items.map(r=>r.id)).size===3&&document.querySelectorAll(".route-result li details").length===3');
 const baseline=await evaluate('RotaPlanner.current.items.map(r=>r.id).join(",")');
 await change('route-goal','competir');
 await check('Objetivo de competir muda a seleção','RotaPlanner.current.items.map(r=>r.id).join(",")!=='+JSON.stringify(baseline)+'&&RotaPlanner.current.items[0].kind==="Competição"');
 await evaluate('document.querySelector("#route-topics input[value=Robótica]").checked=true;document.querySelector("#route-topics input[value=Robótica]").dispatchEvent(new Event("change",{bubbles:true}))');
 await check('Tema informado entra no perfil','RotaPlanner.current.profile.topics.includes("Robótica")');
 await evaluate('document.querySelectorAll("#route-topics input").forEach((i,n)=>i.checked=n<4);document.querySelectorAll("#route-topics input")[3].dispatchEvent(new Event("change",{bubbles:true}))');
 await check('Até três temas, aviso acessível','document.querySelectorAll("#route-topics input:checked").length===3&&document.getElementById("route-status").textContent.includes("três")');
 await change('route-mode','Online');
 await check('Online não inclui formato desconhecido ou híbrido','RotaPlanner.current.items.length>0&&RotaPlanner.current.items.every(r=>r.mode==="Online")');
 await change('route-mode','Presencial');await change('route-uf','');await evaluate('document.querySelector("[data-route-area=Matemática]").click()');
 await check('Combinação sem cobertura não inventa recurso','RotaPlanner.current.items.length===0&&document.querySelector(".route-warning").textContent.includes("Não há")&&!document.getElementById("create-story")');
 await change('route-mode','');await change('route-uf','CE');await change('route-goal','explorar');await evaluate('document.querySelector("[data-route-area]").click()');
 await evaluate('document.querySelectorAll("#route-topics input").forEach(i=>i.checked=false);document.querySelector("#route-topics input").dispatchEvent(new Event("change",{bubbles:true}))');
 const oldFirst=await evaluate('RotaPlanner.current.items[0].id');
 await evaluate('document.querySelector("[data-route-swap]").click()');
 await check('Troca mantém três itens distintos e foco','RotaPlanner.current.items[0].id!=='+JSON.stringify(oldFirst)+'&&new Set(RotaPlanner.current.items.map(r=>r.id)).size===3&&document.activeElement.hasAttribute("data-route-swap")');
 await evaluate('document.querySelector("[data-route-next]").click();document.getElementById("save-route").click()');
 await check('Rota e próximo passo salvos somente no navegador','JSON.parse(localStorage.getItem("rota-delas-minha-rota-v1")).next===RotaPlanner.nextId&&document.getElementById("restore-route").hidden===false');
 const link=await evaluate('RotaPlanner.routeLink()');
 await check('Link inclui IDs mas não nome foto ou identificação','(()=>{const u=new URL(RotaPlanner.routeLink());return u.hash==="#rota"&&u.searchParams.get("rota").split(",").length===3&&!u.searchParams.has("nome")&&!u.searchParams.has("foto")})()');
 await change('route-goal','aprender');await evaluate('document.getElementById("restore-route").click()');
 await check('Restaurar preserva objetivo e indicações','RotaPlanner.current.profile.goal==="explorar"&&RotaPlanner.nextId&&RotaPlanner.current.items[0].id===JSON.parse(localStorage.getItem("rota-delas-minha-rota-v1")).ids[0]');
 await evaluate('document.getElementById("create-story").click()');await ready();
 await check('Modal do Story com foco e PNG real','document.getElementById("story-panel").open&&document.activeElement.id==="story-close"&&document.getElementById("story-canvas").width===1080&&document.getElementById("story-canvas").height===1920&&document.getElementById("story-preview").naturalWidth===1080');
 await check('Compartilhamento ausente oferece download','!document.getElementById("story-download").disabled&&document.getElementById("story-status").textContent.includes("1080")');
 const downloadDir=await mkdtemp(join(tmpdir(),'rota-story-download-'));await call('Browser.setDownloadBehavior',{behavior:'allow',downloadPath:downloadDir});await evaluate('document.getElementById("story-download").click()');
 for(let attempt=0;attempt<50;attempt++){try{if((await stat(join(downloadDir,'minha-rota-delas.png'))).size>10000)break;}catch{}await new Promise(resolve=>setTimeout(resolve,100));}
 const downloaded=await readFile(join(downloadDir,'minha-rota-delas.png'));await check('Download produz arquivo PNG real',JSON.stringify(downloaded.subarray(0,8).toString('hex')==='89504e470d0a1a0a'&&downloaded.readUInt32BE(16)===1080&&downloaded.readUInt32BE(20)===1920));await writeFile(join(output,'download-validado.png'),downloaded);
 for(const template of ['rota','passo','convite']){await change('story-template',template);await ready();await check('PNG do modelo '+template,'RotaPlanner.imageReady&&!document.getElementById("story-download").disabled');const data=await evaluate('document.getElementById("story-canvas").toDataURL("image/png").split(",")[1]');await writeFile(join(output,'story-'+template+'.png'),Buffer.from(data,'base64'));}
 for(const palette of ['clara','terracota','menta']){await change('story-palette',palette);await ready();await check('PNG na paleta '+palette,'RotaPlanner.imageReady');}
 for(const [w,h,scale] of [[390,844,100],[320,568,200],[844,390,200],[1440,900,100]]){await call('Emulation.setDeviceMetricsOverride',{width:w,height:h,deviceScaleFactor:1,mobile:w<1000},sessionId);await evaluate('(()=>{const e=document.getElementById("a11y-size");e.value='+scale+';e.dispatchEvent(new Event("input"))})()');await check('Modal e controles sem overflow '+w+' '+scale,'document.documentElement.scrollWidth<=innerWidth&&document.getElementById("story-panel").scrollWidth<=document.getElementById("story-panel").clientWidth&&document.getElementById("story-panel").getBoundingClientRect().height<=innerHeight&&document.querySelector("#story-panel .preview-top").getBoundingClientRect().height<innerHeight*.4');await screenshot('modal-'+w+'-'+scale);}
 await evaluate('window.__copy="";Object.defineProperty(navigator,"clipboard",{configurable:true,value:{writeText:async text=>window.__copy=text}});document.getElementById("story-copy-link").click()');
 await check('Link da rota copiado','window.__copy.startsWith("https://saulocunha02.github.io/rota-delas/")&&window.__copy.includes("rota=")');
 await evaluate('document.getElementById("story-copy-caption").click()');
 await check('Legenda copia frase e link','window.__copy.includes("#CiênciaDelas")&&window.__copy.includes("rota=")');
 await evaluate('Object.defineProperty(navigator,"canShare",{configurable:true,value:()=>true});Object.defineProperty(navigator,"share",{configurable:true,value:async data=>{window.__file=data.files[0]}});document.getElementById("story-retry").click()');await ready();
 await evaluate('document.getElementById("story-share").click()');
 await check('Compartilhamento recebe arquivo PNG','window.__file.type==="image/png"&&window.__file.size>10000');
 await evaluate('Object.defineProperty(navigator,"share",{configurable:true,value:async()=>{const e=Error();e.name="AbortError";throw e}});document.getElementById("story-share").click()');
 await check('Cancelar compartilhamento preserva imagem','document.getElementById("story-status").textContent.includes("cancelado")&&RotaPlanner.imageReady');
 await call('Input.dispatchKeyEvent',{type:'keyDown',key:'Escape',code:'Escape',windowsVirtualKeyCode:27},sessionId);await call('Input.dispatchKeyEvent',{type:'keyUp',key:'Escape',code:'Escape',windowsVirtualKeyCode:27},sessionId);
 await evaluate('new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)))');
 await check('Esc fecha modal e retorna foco','!document.getElementById("story-panel").open&&document.activeElement.id==="create-story"');
 loaded=load();await call('Page.navigate',{url:pathToFileURL(join(root,'..','dist','index.html')).href+'?'+new URL(link).searchParams.toString()+'#rota'},sessionId);await loaded;
 await check('Link reabre exatamente os recursos e próximo passo','RotaPlanner.current.items.map(r=>r.id).join(",")==='+JSON.stringify(new URL(link).searchParams.get('rota'))+'&&RotaPlanner.nextId==='+JSON.stringify(new URL(link).searchParams.get('passo')));
 await evaluate('document.getElementById("forget-route").click()');
 await check('Apagar remove apenas a rota salva','!localStorage.getItem("rota-delas-minha-rota-v1")&&document.getElementById("restore-route").hidden');
 await check('Nenhuma exceção JavaScript',JSON.stringify(errors.length===0));
 await writeFile(join(output,'resultado.json'),JSON.stringify({checkedAt:new Date().toISOString(),checks:results.length,errors:errors.length,results},null,2));
 console.log(results.length+' verificações de personalização e Stories aprovadas.');
}finally{if(socket)socket.close();chrome.kill();}
