import {spawn} from 'node:child_process';
import {mkdtemp,mkdir,writeFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join,dirname} from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
const root=dirname(fileURLToPath(import.meta.url));
const output=join(root,'revisao','brasil');await mkdir(output,{recursive:true});
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


 const change=async(id,value)=>evaluate(`(()=>{const e=document.getElementById('${id}');e.value=${JSON.stringify(value)};e.dispatchEvent(new Event('change',{bubbles:true}));})()`);
 await check('63 IDs e URLs únicos',`RotaCatalog.resources.length===63&&new Set(RotaCatalog.resources.map(r=>r.id)).size===63&&new Set(RotaCatalog.resources.map(r=>r.url)).size===63`);
 await check('Fontes, datas e cobertura territorial',`RotaCatalog.resources.every(r=>r.sources.length&&r.sources.every(s=>s.checkedAt&&s.url.startsWith('https://')))&&RotaCatalog.stats.states===21&&RotaCatalog.stats.regions===5`);
 await check('Página inicial limitada a 12 cartões',`document.querySelectorAll('#cards .resource-card').length===12&&document.getElementById('result-count').textContent.startsWith('26 caminhos')`);
 const page1=await evaluate(`[...document.querySelectorAll('#cards article')].map(r=>r.dataset.resource)`);
 await evaluate(`document.getElementById('page-next').click()`);
 await check('Paginação avança e mantém foco no título',`document.getElementById('page-status').textContent==='Página 2 de 3'&&document.activeElement.id==='explore-title'`);
 const page2=await evaluate(`[...document.querySelectorAll('#cards article')].map(r=>r.dataset.resource)`);
 if(page2.some(id=>page1.includes(id)))throw Error('Paginação repete registros');
 await evaluate(`document.getElementById('page-prev').click()`);
 await change('uf-filter','CE');await change('include-national','');await evaluate(`document.getElementById('include-national').checked=false;document.getElementById('include-national').dispatchEvent(new Event('change'))`);
 await check('Ceará filtra somente iniciativas locais',`document.getElementById('result-count').textContent.startsWith('8 caminhos')&&[...document.querySelectorAll('#cards article')].every(e=>RotaCatalog.resources.find(r=>r.id===e.dataset.resource).states.includes('CE'))`);
 await evaluate(`document.getElementById('include-national').checked=true;document.getElementById('include-national').dispatchEvent(new Event('change'))`);
 await check('Ceará mais recursos nacionais',`document.getElementById('result-count').textContent.startsWith('26 caminhos')`);
 await change('region-filter','Norte');
 await check('Trocar região limpa UF incompatível',`document.getElementById('uf-filter').value===''&&!document.querySelector('#uf-filter option[value=CE]')`);
 await evaluate(`document.getElementById('clear-filters').click();document.getElementById('include-inactive').checked=true;document.getElementById('include-inactive').dispatchEvent(new Event('change'))`);
 await check('Inclusão de inativos mostra 63',`document.getElementById('result-count').textContent.startsWith('63 caminhos')`);
 await evaluate(`document.getElementById('clear-filters').click()`);
 await change('mode-filter','Online');
 await check('Formato online corresponde aos dados',`[...document.querySelectorAll('#cards article')].every(e=>RotaCatalog.resources.find(r=>r.id===e.dataset.resource).mode==='Online')`);
 await change('focus-filter','Meninas em foco');
 await evaluate(`document.querySelector('[data-filter="type"][data-value="Estudo"]').click()`);
 await check('Filtros combinados sem resultados têm recuperação',`!document.getElementById('empty-state').hidden`);
 await evaluate(`document.getElementById('empty-reset').click();const s=document.getElementById('search');s.value='Cunhanta';s.dispatchEvent(new Event('input'))`);
 await check('Busca sem acento e sem caixa',`document.querySelectorAll('#cards article').length===1&&document.querySelector('#cards h3').textContent==='Cunhantã Digital'`);
 await evaluate(`document.querySelector('#cards .favorite-button').click()`);
 await check('Favorito nacional preservado no armazenamento',`JSON.parse(localStorage.getItem('rota-delas-favoritos')).includes('md-cunhanta-digital')&&document.querySelector('#saved-cards h3').textContent==='Cunhantã Digital'`);
 await evaluate(`document.getElementById('clear-filters').click()`);
 for(const uf of ['', 'CE','AM','SP','RR']){await change('route-uf',uf);for(const area of ['Tecnologia e Computação','Ciência','Matemática']){await evaluate(`document.querySelector('[data-route-area="${area}"]').click()`);await check('Rota de três passos '+(uf||'Brasil')+' '+area,`document.querySelectorAll('.route-result li').length===3&&new Set([...document.querySelectorAll('.route-result li a')].map(a=>a.href)).size===3`);}}
 const contrast=`(()=>{const c=getComputedStyle(document.querySelector('.catalog-stats span')).color.match(/\\d+/g).slice(0,3).map(Number).map(x=>{x/=255;return x<=.04045?x/12.92:((x+.055)/1.055)**2.4});return (1.05)/(c[0]*.2126+c[1]*.7152+c[2]*.0722+.05)>=4.5})()`;
 await check('Contraste da cobertura no tema da marca',contrast);
 loaded=load();await call('Page.navigate',{url:pathToFileURL(join(root,'..','dist','cadastro.html')).href},sessionId);await loaded;
 await check('Formulário incompleto bloqueado',`!document.getElementById('initiative-form').checkValidity()`);
 const fixture={title:'Iniciativa de teste — não enviar',institution:'Escola de teste',url:'https://exemplo.edu.br/projeto',kind:'Projeto',area:'Tecnologia e Computação',focus:'Meninas em foco',scope:'Local',state:'CE',city:'Fortaleza',mode:'Híbrido',audience:'Meninas do ensino médio',description:'Oficinas de programação para meninas com materiais públicos e acompanhamento de professores.',conditions:'Consultar requisitos na fonte oficial.'};
 await evaluate(`(()=>{const f=document.getElementById('initiative-form');for(const [k,v] of Object.entries(${JSON.stringify(fixture)}))f.elements[k].value=v;document.getElementById('initiative-consent').checked=true;f.requestSubmit()})()`);
 await check('Prévia modal sem enviar requisição',`document.getElementById('submission-preview').open&&document.activeElement.id==='preview-close'&&document.getElementById('initiative-status').textContent===''`);
 await check('Rascunho público não exige permissão para atribuir etiquetas',`(()=>{const u=new URL(document.getElementById('submission-link').href);return u.origin==='https://github.com'&&u.pathname==='/SauloCunha02/rota-delas/issues/new'&&u.searchParams.get('body').includes('Iniciativa de teste')&&u.searchParams.get('title').startsWith('[Cadastro]')&&!u.searchParams.has('labels')&&!u.searchParams.has('template')})()`);
 await evaluate(`document.getElementById('preview-edit').click();document.getElementById('initiative-title').value='<img src=x onerror=alert(1)>';document.getElementById('initiative-form').requestSubmit()`);
 await check('Prévia exibe texto externo sem executar HTML',`!document.querySelector('#submission-summary img')&&document.querySelector('#submission-summary dd').textContent.startsWith('<img')`);
 await evaluate(`document.getElementById('preview-close').click();document.getElementById('initiative-url').value='javascript:alert(1)';document.getElementById('initiative-form').dispatchEvent(new Event('submit',{cancelable:true}))`);
 await check('URL não HTTPS rejeitada',`!document.getElementById('submission-preview').open&&!document.getElementById('initiative-url').validity.valid`);
 await evaluate(`(()=>{const f=document.getElementById('initiative-form');f.elements.url.value='https://exemplo.edu.br/projeto';f.elements.url.dispatchEvent(new Event('input'));for(const [k,n] of [['title',120],['institution',160],['audience',180],['description',600],['conditions',300]])f.elements[k].value='ç'.repeat(n);f.requestSubmit()})()`);
 await check('Texto volumoso usa cópia sem URL extensa',`document.getElementById('submission-preview').open&&!document.getElementById('submission-long-notice').hidden&&document.getElementById('submission-link').href.length<7500`);
 await evaluate(`document.getElementById('preview-close').click();const f=document.getElementById('initiative-form');for(const [k,v] of Object.entries(${JSON.stringify(fixture)})){f.elements[k].value=v;f.elements[k].dispatchEvent(new Event('input'))}`);

 for(const [width,size] of [[390,100],[320,200]]){await call('Emulation.setDeviceMetricsOverride',{width,height:844,deviceScaleFactor:1,mobile:true},sessionId);await evaluate(`var reviewScale=document.getElementById('a11y-size');reviewScale.value=${size};reviewScale.dispatchEvent(new Event('input'));document.getElementById('participate-title').scrollIntoView({behavior:'instant'})`);await check('Formulário cabe '+width+'px '+size+'%',`document.documentElement.scrollWidth<=innerWidth&&document.querySelector('.initiative-form').scrollWidth<=document.querySelector('.initiative-form').clientWidth+1`);await screenshot('formulario-'+width+'-'+size);await evaluate(`document.getElementById('initiative-form').requestSubmit()`);await check('Prévia cabe '+width+'px '+size+'%',`document.getElementById('submission-preview').scrollWidth<=document.getElementById('submission-preview').clientWidth+1`);await screenshot('previa-'+width+'-'+size);await evaluate(`document.getElementById('preview-close').click()`);}
 if(errors.length)throw Error(JSON.stringify(errors));
 await writeFile(join(output,'resultado.json'),JSON.stringify({checks:results,errors,limite:'Chrome emulado e arquivo local; nenhuma solicitação fictícia foi enviada ao GitHub. Submissão final exige ação e conta do remetente.'},null,2));
 console.log(results.length+' verificações da expansão nacional aprovadas.');
 await call('Browser.close');
}finally{socket?.close();chrome.kill();}
