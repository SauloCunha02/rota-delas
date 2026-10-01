import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {dirname,join} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=join(dirname(fileURLToPath(import.meta.url)),'..');
const names=['recursos-base','projetos-meninas-digitais','recursos-nacionais','sugestoes-aprovadas'];
const states={AC:['Acre','Norte'],AL:['Alagoas','Nordeste'],AP:['Amapá','Norte'],AM:['Amazonas','Norte'],BA:['Bahia','Nordeste'],CE:['Ceará','Nordeste'],DF:['Distrito Federal','Centro-Oeste'],ES:['Espírito Santo','Sudeste'],GO:['Goiás','Centro-Oeste'],MA:['Maranhão','Nordeste'],MT:['Mato Grosso','Centro-Oeste'],MS:['Mato Grosso do Sul','Centro-Oeste'],MG:['Minas Gerais','Sudeste'],PA:['Pará','Norte'],PB:['Paraíba','Nordeste'],PR:['Paraná','Sul'],PE:['Pernambuco','Nordeste'],PI:['Piauí','Nordeste'],RJ:['Rio de Janeiro','Sudeste'],RN:['Rio Grande do Norte','Nordeste'],RS:['Rio Grande do Sul','Sul'],RO:['Rondônia','Norte'],RR:['Roraima','Norte'],SC:['Santa Catarina','Sul'],SP:['São Paulo','Sudeste'],SE:['Sergipe','Nordeste'],TO:['Tocantins','Norte']};
const kinds=['Projeto','Estudo','Competição','Visita','Rede'];
const areas=['Tecnologia','Ciência','Matemática'];
const catalog=new Map();
function validURL(value){const u=new URL(value);if(u.protocol!=='https:'||u.username||u.password)throw Error('URL pública HTTPS exigida: '+value);}
for(const name of names){
 const records=JSON.parse(await readFile(join(root,'dados',name+'.json'),'utf8'));
 if(!Array.isArray(records))throw Error(name+': esperado vetor');
 const fileIds=new Set();
 for(const record of records){
  if(!/^[a-z0-9-]+$/.test(record.id)||fileIds.has(record.id))throw Error('ID inválido/duplicado: '+record.id);
  fileIds.add(record.id);
  for(const field of ['title','description','institution','audience'])if(typeof record[field]!=='string'||!record[field].trim())throw Error(record.id+': falta '+field);
  if(!kinds.includes(record.kind)||!areas.includes(record.area))throw Error(record.id+': tipo/área inválidos');
  if(!['Nacional','Local'].includes(record.scope)||!['Online','Presencial','Híbrido','Consultar fonte'].includes(record.mode)||!['Meninas em foco','Para todos'].includes(record.focus)||!['Ativo','Inativo','Consultar fonte'].includes(record.sourceStatus))throw Error(record.id+': classificação inválida');
  if(!Array.isArray(record.states)||record.states.some(uf=>!states[uf]))throw Error(record.id+': UF inválida');
  validURL(record.url);
  if(!record.sources?.length)throw Error(record.id+': fonte obrigatória');
  for(const source of record.sources){validURL(source.url);if(!/^\d{4}-\d{2}-\d{2}$/.test(source.checkedAt)||!source.name)throw Error(record.id+': fonte incompleta');}
  const previous=catalog.get(record.id);
  if(previous){
   if(record.id!=='lua')throw Error('ID repetido entre arquivos: '+record.id);
   catalog.set(record.id,{...previous,institution:record.institution,sourceStatus:record.sourceStatus,since:record.since,audience:record.audience,sources:[...previous.sources,...record.sources]});
  }else catalog.set(record.id,record);
 }
}
const urls=new Set();
const resources=[...catalog.values()].map(record=>{
 if(urls.has(record.url))throw Error('URL duplicada: '+record.url);urls.add(record.url);
 const regions=[...new Set(record.states.map(uf=>states[uf][1]))];
 const place=record.scope==='Nacional'?'Brasil · alcance nacional':record.states.length?record.states.map(uf=>states[uf][0]).join(' / ')+(record.city?' · '+record.city:''):'Localização não informada';
 return {...record,regions,place};
});
const coverage=new Set(resources.flatMap(r=>r.states));
const result={schemaVersion:1,updatedAt:'2026-10-01',states,resources,stats:{total:resources.length,active:resources.filter(r=>r.sourceStatus!=='Inativo').length,states:coverage.size,regions:new Set(resources.flatMap(r=>r.regions)).size,national:resources.filter(r=>r.scope==='Nacional').length,femaleFocus:resources.filter(r=>r.focus==='Meninas em foco').length}};
await mkdir(join(root,'dist','dados'),{recursive:true});
await writeFile(join(root,'dist','dados','catalogo.json'),JSON.stringify(result,null,2)+'\n');
await writeFile(join(root,'dist','catalogo.js'),'/* Gerado por scripts/gerar-catalogo.mjs. Edite dados/*.json. */\nwindow.RotaCatalog = '+JSON.stringify(result).replaceAll('<','\\u003c')+';\n');
console.log(JSON.stringify(result.stats));
