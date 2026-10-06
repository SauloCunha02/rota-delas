import data from '../dados/jornada-fonte.mjs';
import {readFile,writeFile} from 'node:fs/promises';
const root=new URL('../',import.meta.url),catalog=JSON.parse(await readFile(new URL('dist/dados/catalogo.json',root),'utf8'));
const ids=new Set(catalog.resources.map(r=>r.id)),unique=new Set();
for(const trail of data.trails){
 for(const m of trail.missions){
  if(unique.has(m.id)||!m.title||m.minutes<1||m.steps.length<3||m.checklist.length<3||!m.delivery)throw Error('Missão inválida: '+m.id);
  unique.add(m.id);for(const id of m.resources)if(!ids.has(id))throw Error('Recurso ausente: '+id);
 }
}
const dates=/^\d{4}-\d{2}-\d{2}$/;
for(const e of data.events){
 if(unique.has(e.id)||!dates.test(e.start)||!dates.test(e.end)||e.end<e.start||!dates.test(e.checkedAt)||new URL(e.source).protocol!=='https:')throw Error('Evento inválido: '+e.id);
 if(e.startsAt&&Number.isNaN(Date.parse(e.startsAt)))throw Error('Horário inválido');
 unique.add(e.id);
}
const json=JSON.stringify(data,null,2)+'\n';
await writeFile(new URL('dist/dados/jornada.json',root),json);
await writeFile(new URL('dist/jornada-dados.js',root),'/* Gerado por scripts/gerar-jornada.mjs. */\nwindow.RotaJornadaDados='+json.trim()+';\n');
console.log(data.trails.length+' trilhas, '+data.trails.flatMap(t=>t.missions).length+' missões e '+data.events.length+' datas documentadas.');
