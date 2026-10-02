(() => {
 'use strict';
 const form=document.getElementById('initiative-form'),dialog=document.getElementById('submission-preview'),urlField=form.elements.url;
 let prepared=null,preparedBody='';
 const stateSelect=form.elements.state;
 stateSelect.innerHTML='<option value="">Selecione o estado</option>'+Object.entries(window.RotaCatalog.states).sort((a,b)=>a[1][0].localeCompare(b[1][0],'pt-BR')).map(([uf,v])=>`<option value="${uf}">${v[0]} (${uf})</option>`).join('');
 const themeChoices=document.getElementById('initiative-topics');
 for(const theme of window.RotaCatalog.topics){const label=document.createElement('label'),input=document.createElement('input');input.type='checkbox';input.name='topics';input.value=theme;label.append(input,theme);themeChoices.append(label);}
 function validateURL(){let valid=false;try{const u=new URL(urlField.value.trim());valid=u.protocol==='https:'&&!u.username&&!u.password&&u.hostname.includes('.')&&!['localhost','127.0.0.1'].includes(u.hostname);}catch{}urlField.setCustomValidity(valid?'':'Informe um endereço público HTTPS, sem usuário ou senha no link.');return valid;}
 urlField.addEventListener('input',()=>urlField.setCustomValidity(''));
 function readData(){const data=new FormData(form),values=Object.fromEntries(data);delete values.topics;for(const key of Object.keys(values))values[key]=values[key].trim();return {schemaVersion:2,...values,topics:data.getAll('topics'),states:[values.state],sourceStatus:'Consultar fonte',routeRole:values.kind==='Estudo'?'aprender':values.kind==='Competição'?'desafiar':'inspirar'};}
 const fields={title:'Iniciativa',institution:'Instituição',url:'Página oficial',kind:'Tipo',area:'Área',topics:'Temas',focus:'Público principal',scope:'Alcance',state:'Estado',city:'Cidade',mode:'Formato',audience:'Quem pode participar',description:'Descrição',conditions:'Requisitos e calendário'};
 form.addEventListener('submit',event=>{
  event.preventDefault();validateURL();
  for(const name of ['title','institution','audience','description']){const field=form.elements[name];field.setCustomValidity(field.value.trim().length>=(name==='description'?30:1)?'':'Preencha este campo com informações da iniciativa.');field.addEventListener('input',()=>field.setCustomValidity(''),{once:true});}
  if(!form.reportValidity())return;
  prepared=readData();const summary=document.getElementById('submission-summary');summary.replaceChildren();const dl=document.createElement('dl');
  for(const [key,label] of Object.entries(fields)){if(!prepared[key]||(Array.isArray(prepared[key])&&!prepared[key].length))continue;const dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=label;dd.textContent=Array.isArray(prepared[key])?prepared[key].join(', '):prepared[key];dl.append(dt,dd);}summary.append(dl);
  const body='## Sugestão de iniciativa para o Rota Delas\n\nInformações institucionais públicas, encaminhadas para revisão. A inclusão não é automática.\n\n```json\n'+JSON.stringify(prepared,null,2)+'\n```\n\n- [x] Confirmo que estes dados podem ser publicados e não contêm informações pessoais de estudantes.\n- [ ] Revisão da fonte pela equipe (preenchimento dos responsáveis).';
  const target=new URL('https://github.com/SauloCunha02/rota-delas/issues/new');target.searchParams.set('title','[Cadastro] '+prepared.title);target.searchParams.set('body',body);
  preparedBody=body;
  const long=target.href.length>7500;
  if(long)target.searchParams.delete('body');
  document.getElementById('submission-long-notice').hidden=!long;
  document.getElementById('submission-link').href=target.href;dialog.showModal();document.getElementById('preview-close').focus();
 });
 const close=()=>{dialog.close();form.querySelector('[type=submit]').focus();};
 document.getElementById('preview-close').addEventListener('click',close);document.getElementById('preview-edit').addEventListener('click',close);
 document.getElementById('submission-link').addEventListener('click',()=>{document.getElementById('initiative-status').textContent='Rascunho aberto no GitHub. O envio só estará concluído depois que você confirmar a criação da solicitação lá.';});
 document.getElementById('copy-submission').addEventListener('click',async event=>{try{await navigator.clipboard.writeText(preparedBody);event.target.textContent='Texto copiado';}catch{const text=document.getElementById('submission-copy-text');text.hidden=false;text.value=preparedBody;text.focus();text.select();event.target.textContent='Selecione e copie o texto abaixo';}});
 document.getElementById('download-submission').addEventListener('click',()=>{if(!prepared)return;const blob=new Blob([JSON.stringify(prepared,null,2)],{type:'application/json'}),href=URL.createObjectURL(blob),link=document.createElement('a');link.href=href;link.download='rota-delas-sugestao.json';link.click();setTimeout(()=>URL.revokeObjectURL(href),1000);});
})();
