import {spawn} from 'node:child_process';
import {mkdtemp,mkdir,writeFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join,dirname} from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
const root=dirname(fileURLToPath(import.meta.url));
const output=join(root,'revisao','interface');await mkdir(output,{recursive:true});
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
 async function check(name,expression){const value=await evaluate(expression);results.push({name,value});if(!value){await screenshot('falha');console.log(await evaluate(`JSON.stringify([...document.querySelectorAll('#a11y-player,#a11y-player>*,#mobile-nav')].map(e=>({id:e.id||e.className,rect:e.getBoundingClientRect().toJSON(),min:getComputedStyle(e).minHeight,max:getComputedStyle(e).maxHeight})))`));throw Error('Falhou: '+name);}}
 const screenshot=async name=>{await evaluate('new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)))');const picture=await call('Page.captureScreenshot',{format:'png',captureBeyondViewport:false},sessionId);await writeFile(join(output,name+'.png'),Buffer.from(picture.data,'base64'));};


 const navigate=async page=>{const [file,hash]=page.split('#'),url=pathToFileURL(join(root,'..','dist',file));if(hash)url.hash=hash;loaded=load();await call('Page.navigate',{url:url.href},sessionId);await loaded;};
 const size=async(w,h,scale=100)=>{await call('Emulation.setDeviceMetricsOverride',{width:w,height:h,deviceScaleFactor:1,mobile:true},sessionId);await call('Emulation.setTouchEmulationEnabled',{enabled:true,maxTouchPoints:1},sessionId);await evaluate(`(()=>{const e=document.getElementById('a11y-size');e.value=${scale};e.dispatchEvent(new Event('input'));})()`);await evaluate('document.fonts.ready');await evaluate('new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)))');};
 await check('Ceará e nacionais são a seleção inicial',`document.getElementById('uf-filter').value==='CE'&&document.getElementById('region-filter').value==='Nordeste'&&document.getElementById('route-uf').value==='CE'&&document.getElementById('result-count').textContent.startsWith('26 caminhos')`);
 await check('Iniciativas cearenses vêm primeiro',`[...document.querySelectorAll('#cards article')].slice(0,8).every(e=>RotaCatalog.resources.find(r=>r.id===e.dataset.resource).states.includes('CE'))`);
 await check('Formulário saiu da página principal',`!document.getElementById('initiative-form')&&document.querySelector('.contribute-section a').getAttribute('href')==='cadastro.html'`);
 await check('Áreas e temas documentados',`RotaCatalog.areas.includes('Ciências Naturais')&&RotaCatalog.areas.includes('Ciência e Pesquisa')&&RotaCatalog.resources.every(r=>r.topics.length&&r.topics.every(t=>RotaCatalog.topics.includes(t)))`);
 await evaluate(`document.querySelector('[data-territory=brasil]').click();const t=document.getElementById('topic-filter');t.value='Química';t.dispatchEvent(new Event('change'))`);
 await check('Tema Química retorna os dois registros pertinentes',`document.querySelectorAll('#cards article').length===2&&[...document.querySelectorAll('#cards article')].every(e=>RotaCatalog.resources.find(r=>r.id===e.dataset.resource).topics.includes('Química'))`);
 await evaluate(`document.getElementById('clear-filters').click();document.querySelector('[data-filter=area][data-value="Ciências Naturais"]').click()`);
 await check('Ciências Naturais filtra sem misturar pesquisa geral',`[...document.querySelectorAll('#cards article')].every(e=>RotaCatalog.resources.find(r=>r.id===e.dataset.resource).area==='Ciências Naturais')&&document.querySelectorAll('#cards article').length>0`);
 await evaluate(`document.getElementById('clear-filters').click();document.querySelector('[data-territory=ceara]').click()`);
 for(const [w,h,scale] of [[320,568,100],[390,844,100],[430,932,100],[320,568,200]]){
  await size(w,h,scale);await evaluate('window.scrollTo(0,0)');
  await check('Cabeçalho e barra cabem '+w+'px '+scale+'%',`document.documentElement.scrollWidth<=innerWidth&&document.getElementById('mobile-nav').scrollWidth<=innerWidth`);
  await check('Acessibilidade está visível no cabeçalho '+w+'px '+scale+'%',`(()=>{const a=document.getElementById('a11y-open').getBoundingClientRect(),h=document.querySelector('.site-header').getBoundingClientRect();return a.width>=48&&a.height>=48&&a.top>=h.top&&a.bottom<=h.bottom&&getComputedStyle(document.getElementById('a11y-open')).position==='static'})()`);
  await check('Barra inferior tem quatro alvos tocáveis '+w+'px '+scale+'%',`[...document.querySelectorAll('#mobile-nav>a,#mobile-nav>button')].length===4&&[...document.querySelectorAll('#mobile-nav>a,#mobile-nav>button')].every(e=>{const r=e.getBoundingClientRect();return r.width>=44&&r.height>=44&&r.bottom<=innerHeight})`);
  await screenshot('inicio-'+w+'-'+scale);
 }
 await size(390,844);
 await evaluate(`document.querySelector('#mobile-nav [data-section=explorar]').click()`);
 await check('Navegar sem ativar voz mantém leitor fechado',`document.getElementById('a11y-player').hidden&&document.getElementById('a11y-player-scope').value==='explorar'`);
 await evaluate(`document.getElementById('more-open').click()`);
 await check('Menu Mais é modal e recebe foco',`document.getElementById('more-panel').open&&document.activeElement.id==='more-close'&&document.getElementById('more-open').getAttribute('aria-expanded')==='true'`);
 await screenshot('menu-mais');
 await call('Input.dispatchKeyEvent',{type:'keyDown',key:'Escape',code:'Escape',windowsVirtualKeyCode:27,nativeVirtualKeyCode:27},sessionId);await call('Input.dispatchKeyEvent',{type:'keyUp',key:'Escape',code:'Escape',windowsVirtualKeyCode:27,nativeVirtualKeyCode:27},sessionId);
 await evaluate('new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)))');
 await check('Esc fecha Mais e devolve foco',`!document.getElementById('more-panel').open&&document.activeElement.id==='more-open'`);
 await evaluate(`document.getElementById('more-open').click();document.querySelector('[data-open-accessibility]').click()`);
 await check('Mais abre acessibilidade sem dois diálogos',`document.getElementById('a11y-panel').open&&!document.getElementById('more-panel').open`);
 await evaluate(`(()=>{window.__spoken=[];Object.defineProperty(window,'speechSynthesis',{configurable:true,value:{getVoices:()=>[],cancel:()=>{},speak:u=>__spoken.push(u),pause:()=>{},resume:()=>{}}});const t=document.getElementById('a11y-listen');t.checked=true;t.dispatchEvent(new Event('change'));document.getElementById('a11y-close').click();document.getElementById('a11y-player-play').click()})()`);
 for(const [w,h,scale] of [[320,568,100],[390,844,100],[320,568,200],[844,390,100]]){
  await size(w,h,scale);
  await check('Leitor preserva menu e cabeçalho '+w+'px '+scale+'%',`(()=>{const p=document.getElementById('a11y-player').getBoundingClientRect(),n=document.getElementById('mobile-nav').getBoundingClientRect();return p.top>=0&&p.bottom<=(getComputedStyle(document.getElementById('mobile-nav')).display==='none'?innerHeight:n.top)&&document.documentElement.scrollWidth<=innerWidth})()`);
  await screenshot('leitor-'+w+'-'+scale);
 }
 await size(320,568,200);await evaluate(`document.getElementById('a11y-player-rate-badge').click()`);
 await check('Player expandido conserva transporte e área rolável',`(()=>{const p=document.getElementById('a11y-player').getBoundingClientRect(),d=document.getElementById('a11y-player-details').getBoundingClientRect();return d.height>=120&&d.bottom<=p.bottom&&[...document.querySelectorAll('.a11y-player-buttons button')].every(b=>{const r=b.getBoundingClientRect();return r.top>=p.top&&r.bottom<=p.bottom})})()`);
 await screenshot('leitor-expandido-320-200');
 for(const scale of [100,200]){await size(844,390,scale);await check('Opções do leitor cabem no celular deitado '+scale+'%',`(()=>{const p=document.getElementById('a11y-player').getBoundingClientRect(),d=document.getElementById('a11y-player-details').getBoundingClientRect(),n=document.getElementById('mobile-nav').getBoundingClientRect();return d.height>=120&&d.bottom<=p.bottom&&p.top>=0&&p.bottom<=n.top&&document.getElementById('a11y-player-text').parentElement.id==='a11y-player-details'})()`);await screenshot('expandido-deitado-'+scale);}
 await evaluate(`document.getElementById('a11y-player-collapse').click()`);await size(390,844);
 await evaluate(`document.querySelector('#mobile-nav [data-section=rota]').click()`);
 await check('Navegação muda seção e interrompe leitura anterior',`document.getElementById('a11y-player-scope').value==='rota'&&document.getElementById('a11y-player-play').textContent==='Play'&&location.hash==='#rota'`);
 await evaluate(`document.getElementById('a11y-player-close').click()`);
 await navigate('cadastro.html');
 await check('Cadastro tem formulário e acessibilidade independentes',`!!document.getElementById('initiative-form')&&!document.getElementById('cards')&&!document.getElementById('a11y-open').hidden&&document.querySelectorAll('#initiative-topics input').length===RotaCatalog.topics.length`);
 await size(390,844);await evaluate(`document.querySelector('.initiative-form').scrollIntoView({block:'start',behavior:'instant'})`);await screenshot('cadastro-campos-390');
 await evaluate(`document.getElementById('a11y-open').click();const s=document.getElementById('a11y-scope');s.value='participar';s.dispatchEvent(new Event('change'))`);
 await check('Leitor do cadastro tem apenas seções existentes',`[...document.getElementById('a11y-scope').options].every(o=>o.value==='selection'||!!document.getElementById(o.value))`);
 await evaluate(`document.getElementById('a11y-close').click();document.getElementById('initiative-title').value='NAO_NARRAR_VALOR_123'`);
 await check('Leitor narra rótulos e não valores digitados',`(()=>{const parts=RotaReader.prototype.collect.call({scope:()=> 'participar'});return parts.some(p=>p.text.includes('Nome da iniciativa'))&&!parts.some(p=>p.text.includes('NAO_NARRAR_VALOR_123'))})()`);
 await evaluate(`document.getElementById('a11y-close').click();document.getElementById('more-open').click()`);await check('Mais marca cadastro ativo',`document.querySelector('#more-panel a[aria-current=page]').getAttribute('href')==='cadastro.html'`);await evaluate(`document.getElementById('more-close').click()`);
 for(const theme of ['normal','light','dark','blue','mono']){await evaluate(`(()=>{const s=document.getElementById('a11y-theme');s.value='${theme}';s.dispatchEvent(new Event('change'))})()`);await check('Campos e barra seguem tema '+theme,`document.documentElement.dataset.a11yTheme==='${theme}'&&document.documentElement.scrollWidth<=innerWidth`);}
 await screenshot('cadastro-contraste');await navigate('index.html#participar');
 await evaluate(`new Promise(resolve=>{const ready=()=>location.pathname.endsWith('cadastro.html')&&document.getElementById('initiative-form')?resolve():setTimeout(ready,20);ready()})`);
 await check('Link antigo de cadastro redireciona',`location.pathname.endsWith('cadastro.html')&&!!document.getElementById('initiative-form')`);
 if(errors.length)throw Error(JSON.stringify(errors));
 await writeFile(join(output,'resultado.json'),JSON.stringify({checks:results,errors,limite:'Chrome emulado; voz simulada, sem submissão real de dados e sem auditoria formal com leitor de tela.'},null,2));
 console.log(results.length+' verificações da reorganização aprovadas.');
 await call('Browser.close');
}finally{socket?.close();chrome.kill();}
