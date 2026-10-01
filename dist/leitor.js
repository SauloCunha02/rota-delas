/* Leitura mapeada ao conteúdo real. Sem temporizadores que simulem palavras faladas. */
(() => {
  'use strict';
  const $ = id => document.getElementById('a11y-' + id);
  const normalize = text => text.replace(/\s+/g,' ').trim();
  const ignored = 'button,input,select,textarea,svg,[hidden],[aria-hidden="true"],.sr-only,.filter-group,.route-options,.route-actions,.search-row';
  const blocks = 'h1,h2,h3,p,.card-kind,.card-bottom>span,.route-result li,.resource-meta dt,.resource-meta dd,.participate-guide li,.catalog-stats div';

  function visible(element) {
    return element?.isConnected && !element.closest(ignored) && element.getClientRects().length > 0 && getComputedStyle(element).visibility !== 'hidden';
  }
  function mappedText(element, selectedRange) {
    const walker = document.createTreeWalker(element,NodeFilter.SHOW_TEXT);
    const nodes = element.nodeType === Node.TEXT_NODE ? [element] : [];
    let node;
    while ((node=walker.nextNode())) nodes.push(node);
    let text = ''; const map = []; let previousParent = null;
    for (const leaf of nodes) {
      if (!visible(leaf.parentElement)) continue;
      if (selectedRange && !selectedRange.intersectsNode(leaf)) continue;
      const start = selectedRange?.startContainer === leaf ? selectedRange.startOffset : 0;
      const end = selectedRange?.endContainer === leaf ? selectedRange.endOffset : leaf.length;
      if (end<=start) continue;
      if (text && !text.endsWith(' ') && previousParent && previousParent!==leaf.parentElement && !/^\s/.test(leaf.data.slice(start,end))) {text+=' ';map.push(null);}
      for (let offset=start;offset<end;offset++) {
        const char=leaf.data[offset];
        if (/\s/.test(char)) {if(text&&!text.endsWith(' ')){text+=' ';map.push({node:leaf,offset});}}
        else {text+=char;map.push({node:leaf,offset});}
      }
      previousParent=leaf.parentElement;
    }
    if(text.endsWith(' ')){text=text.slice(0,-1);map.pop();}
    return {text,map};
  }
  function split(mapped, element, section) {
    const result=[];let start=0;
    while(start<mapped.text.length){
      let end=Math.min(start+220,mapped.text.length);
      if(end<mapped.text.length){
        const fragment=mapped.text.slice(start,end);
        const sentence=[...fragment.matchAll(/[.!?;:]\s/g)].at(-1);
        const space=fragment.lastIndexOf(' ');
        if(sentence&&sentence.index>55)end=start+sentence.index+1;
        else if(space>0)end=start+space;
      }
      result.push({text:mapped.text.slice(start,end),map:mapped.map.slice(start,end),element,section});
      start=end;while(mapped.text[start]===' ')start++;
    }
    return result;
  }
  function textRange(part,start=0,end=part.text.length) {
    const positions=part.map.slice(start,end).filter(Boolean);
    const first=positions[0],last=positions.at(-1);
    if(!first?.node.isConnected||!last?.node.isConnected)return null;
    try{const range=document.createRange();range.setStart(first.node,first.offset);range.setEnd(last.node,last.offset+1);return range;}catch{return null;}
  }
  function wordAt(text,index) {
    const words=[...text.matchAll(/[\p{L}\p{N}]+(?:['’\-][\p{L}\p{N}]+)*/gu)];
    const word=words.find(match=>index>=match.index&&index<match.index+match[0].length)||words.find(match=>match.index>=index);
    return word?{start:word.index,end:word.index+word[0].length}:null;
  }

  window.RotaReader = class {
    constructor(options) {
      this.options=options;this.parts=[];this.index=0;this.offset=0;this.reading=false;this.paused=false;this.token=0;this.utterance=null;this.highlighted=null;this.completed=false;
      this.supported=!!window.speechSynthesis&&typeof window.SpeechSynthesisUtterance==='function';
      this.selectedText='';this.selectedRange=null;
      this.smallViewport=matchMedia('(max-width:680px), (max-height:500px) and (pointer:coarse)');
      this.compact=this.smallViewport.matches;this.layoutChosen=false;
      this.bind();this.render();
      this.observer=new MutationObserver(()=>{
        if(this.parts.some(part=>part.element&&(!part.element.isConnected||part.map.some(point=>point&&!point.node.isConnected)))){
          this.stop('O conteúdo mudou. Pressione Play para ler os resultados atuais.');this.parts=[];this.index=0;this.render();$('player-text').textContent='Os resultados mudaram. Pressione Play para preparar a leitura atual.';$('transcript').hidden=true;
        }
      });
      this.observer.observe(document.querySelector('main'),{childList:true,subtree:true,characterData:true});
      if(window.ResizeObserver){this.resize=new ResizeObserver(()=>this.measure());this.resize.observe($('player'));}
      this.smallViewport.addEventListener('change',()=>{if(!this.layoutChosen)this.compact=this.smallViewport.matches;this.render();});
    }
    setSelection(text,range) {
      this.selectedText=text;this.selectedRange=range;
      for(const id of ['scope','player-scope'])$(id).querySelector('[value=selection]').disabled=!text;
    }
    scope() {return $('scope').value;}
    collect() {
      if(this.scope()==='selection'){
        if(this.selectedRange){const ancestor=this.selectedRange.commonAncestorContainer;const element=ancestor.nodeType===Node.TEXT_NODE?ancestor.parentElement:ancestor;return split(mappedText(ancestor,this.selectedRange),element,'Texto selecionado');}
        return split({text:normalize(this.selectedText),map:[]},null,'Texto selecionado');
      }
      const scope=document.getElementById(this.scope());
      if(!scope)return[];
      return [...scope.querySelectorAll(blocks)].filter(element=>visible(element)&&!element.parentElement.closest('.route-result li')).flatMap(element=>{
        const section=element.closest('section');
        const heading=section?.querySelector('h1,h2');
        return split(mappedText(element),element,normalize(heading?.textContent||'Rota Delas'));
      });
    }
    prepare() {this.parts=this.collect();this.index=0;this.offset=0;this.completed=false;this.render();return this.parts.length>0;}
    startScope() {this.stop('Preparando a leitura…');if(!this.prepare()){this.status('Esta seção não tem texto visível para ler.');return;}this.speak(0);}
    startAt(element) {
      this.stop('Preparando a leitura…');$('scope').value='conteudo';$('player-scope').value='conteudo';
      if(!this.prepare())return;
      const index=this.parts.findIndex(part=>part.element===element);
      if(index>=0)this.speak(index);
    }
    clearHighlight() {
      this.highlighted?.classList.remove('tts-reading-block');this.highlighted=null;
      if(window.CSS?.highlights){CSS.highlights.delete('rota-trecho');CSS.highlights.delete('rota-palavra');}
    }
    highlight(word) {
      this.clearHighlight();const part=this.parts[this.index];if(!part)return;
      if(part.element?.isConnected){this.highlighted=part.element;part.element.classList.add('tts-reading-block');}
      if(window.CSS?.highlights&&typeof window.Highlight==='function'){
        const range=textRange(part);if(range)CSS.highlights.set('rota-trecho',new Highlight(range));
        const wordRange=word&&textRange(part,word.start,word.end);if(wordRange)CSS.highlights.set('rota-palavra',new Highlight(wordRange));
      }
      for(const id of ['player-text','current-text']){
        const output=$(id);output.replaceChildren();
        if(word){const mark=document.createElement('mark');mark.textContent=part.text.slice(word.start,word.end);output.append(part.text.slice(0,word.start),mark,part.text.slice(word.end));}
        else output.textContent=part.text;
      }
      $('transcript').hidden=false;
      const preview=$('player-text'),mark=preview.querySelector('mark');
      if(mark){const current=mark.getBoundingClientRect(),frame=preview.getBoundingClientRect();if(current.top<frame.top+8||current.bottom>frame.bottom-8)preview.scrollTop+=current.top-frame.top-12;}
    }
    measure() {
      const player=$('player');
      document.documentElement.style.setProperty('--reader-height',player.hidden?'0px':player.getBoundingClientRect().height+'px');
      const details=$('player-details'),control=document.activeElement;
      if(!details.hidden&&details.contains(control)){
        const frame=details.getBoundingClientRect(),target=control.getBoundingClientRect();
        if(target.top<frame.top+4)details.scrollTop+=target.top-frame.top-4;
        else if(target.bottom>frame.bottom-4)details.scrollTop+=target.bottom-frame.bottom+4;
      }
    }
    locate(force=false) {
      const part=this.parts[this.index];if(!part?.element?.isConnected||$('panel').open||(!force&&!this.options.getFollow()))return;
      const word=wordAt(part.text,this.offset);const range=word&&textRange(part,word.start,word.end);
      const rect=range?.getBoundingClientRect()||part.element.getBoundingClientRect();
      const bottom=$('player').hidden?innerHeight-32:$('player').getBoundingClientRect().top-24;
      if(force||rect.top<24||rect.bottom>bottom){const target=Math.max(32,bottom*.4);window.scrollBy({top:rect.top-target,behavior:'instant'});}
      if(this.options.positionGuide&&this.options.getGuide())this.options.positionGuide(Math.max(48,Math.min(innerHeight-48,(range?.getBoundingClientRect()||part.element.getBoundingClientRect()).top+16)));
    }
    status(message) {$('speech-status').textContent=message;$('player-status').textContent=message;}
    render() {
      $('pause').disabled=!this.reading;$('stop').disabled=!this.reading;
      $('pause').textContent=this.paused?'Continuar':'Pausar';$('read').textContent=this.reading?'Reiniciar seção':'Ouvir texto';
      $('player').hidden=(!this.options.getListen()&&!this.reading&&!this.parts.length)||$('panel').open;
      $('player-play').textContent=this.reading&&!this.paused?'Pausar':'Play';
      $('player-play').setAttribute('aria-label',this.reading&&!this.paused?'Pausar leitura':this.paused?'Continuar leitura':'Iniciar leitura');
      $('player-play').disabled=!this.supported;
      $('player-prev').disabled=!this.parts.length||this.index===0;
      $('player-next').disabled=!this.parts.length||this.index>=this.parts.length-1;
      $('player-stop').disabled=!this.reading;
      $('player-rate').value=this.options.getRate();$('rate').value=this.options.getRate();
      $('player-rate-badge').textContent=String(this.options.getRate()).replace('.',',')+'×';
      $('player-rate-badge').setAttribute('aria-label','Alterar velocidade, atual '+String(this.options.getRate()).replace('.',',')+' vezes');
      $('player').classList.toggle('is-compact',this.compact);$('player-details').hidden=this.compact;
      $('player-collapse').setAttribute('aria-expanded',String(!this.compact));$('player-collapse').setAttribute('aria-label',this.compact?'Expandir opções do leitor':'Recolher opções do leitor');$('player-collapse').textContent=this.compact?'⌃':'⌄';
      $('player-slower').disabled=this.options.getRate()<=.5;$('player-faster').disabled=this.options.getRate()>=2;
      $('player-follow').checked=this.options.getFollow();$('player-scope').value=this.scope();
      $('player-position').disabled=!this.parts.length;$('player-position').max=Math.max(1,this.parts.length);$('player-position').value=this.index+1;
      const progress=this.parts.length?`Trecho ${this.index+1} de ${this.parts.length}`:'Nenhum trecho';
      $('player-progress').value=progress;$('player-position').setAttribute('aria-valuetext',progress);
      $('player-location').textContent=this.parts[this.index]?.section||'Leitor do Rota Delas';
      $('player-locate').disabled=!this.parts[this.index]?.element?.isConnected;
      $('speech-status').setAttribute('aria-live',$('panel').open?'polite':'off');$('player-status').setAttribute('aria-live',$('panel').open?'off':'polite');
      document.body.classList.toggle('reader-visible',!$('player').hidden);
      document.body.classList.toggle('reader-expanded',!$('player').hidden&&!this.compact);
      this.measure();
      if(!this.supported){$('read').disabled=true;$('player-rate').disabled=true;$('rate').disabled=true;}
    }
    speak(index,offset=0,remainPaused=false) {
      if(!this.supported){this.status('A leitura em voz alta não está disponível neste navegador. Você pode navegar pelos trechos escritos.');return;}
      if(!this.parts[index])return;
      if(this.parts[index].element&&!visible(this.parts[index].element)){if(index+1<this.parts.length)this.speak(index+1,0,remainPaused);else this.stop('Fim dos trechos visíveis.');return;}
      ++this.token;window.speechSynthesis.cancel();this.utterance=null;
      this.index=index;this.offset=offset;this.reading=true;this.paused=remainPaused;this.completed=false;
      this.render();this.highlight();this.locate();
      if(remainPaused){this.status(`Leitura pausada. Trecho ${index+1} de ${this.parts.length}.`);return;}
      const currentToken=this.token;const part=this.parts[index];
      const utterance=new SpeechSynthesisUtterance(part.text.slice(offset));this.utterance=utterance;
      utterance.lang='pt-BR';utterance.rate=this.options.getRate();
      const voices=window.speechSynthesis.getVoices().filter(voice=>/^pt[-_]/i.test(voice.lang));
      const voice=voices.find(voice=>voice.localService&&/^pt[-_]BR$/i.test(voice.lang))||voices.find(voice=>/^pt[-_]BR$/i.test(voice.lang))||voices[0];if(voice)utterance.voice=voice;
      this.status(`Lendo trecho ${index+1} de ${this.parts.length}, a ${String(utterance.rate).replace('.',',')}×.`);
      utterance.onboundary=event=>{
        if(currentToken!==this.token||this.paused||event.name==='sentence')return;
        const absolute=Math.min(part.text.length-1,offset+Math.max(0,event.charIndex||0));
        const word=wordAt(part.text,absolute);if(word){this.offset=word.start;this.highlight(word);this.locate();}
      };
      utterance.onend=()=>{
        if(currentToken!==this.token)return;
        if(index+1<this.parts.length){if(this.paused)this.speak(index+1,0,true);else this.speak(index+1);}
        else{this.reading=false;this.paused=false;this.utterance=null;this.completed=true;this.render();this.status('Leitura concluída. Use as setas para rever um trecho ou Play para reiniciar.');}
      };
      utterance.onerror=event=>{if(currentToken===this.token)this.stop(`A voz não pôde continuar (${event.error}). O texto e a navegação pelos trechos continuam disponíveis.`);};
      window.speechSynthesis.speak(utterance);
    }
    playPause() {
      if(this.reading){
        if(this.paused){this.paused=false;if(this.utterance)window.speechSynthesis.resume();else{this.speak(this.index,this.offset);return;}}
        else{this.paused=true;window.speechSynthesis.pause();}
        this.render();this.status(this.paused?'Leitura pausada. Você pode mudar o trecho ou a velocidade.':'Leitura retomada.');return;
      }
      if(!this.parts.length&&!this.prepare()){this.status('Esta seção não tem texto visível para ler.');return;}
      if(this.completed)this.index=0;
      this.speak(this.index,this.offset);
    }
    stop(message='Leitura interrompida.') {
      ++this.token;if(this.supported)window.speechSynthesis.cancel();this.utterance=null;this.reading=false;this.paused=false;this.offset=0;this.clearHighlight();
      const part=this.parts[this.index];if(part){$('player-text').textContent=part.text;$('current-text').textContent=part.text;}
      this.render();this.status(message);
    }
    navigate(index) {
      if(!this.parts.length)this.prepare();if(!this.parts.length)return;
      index=Math.max(0,Math.min(this.parts.length-1,index));
      if(this.reading){this.speak(index,0,this.paused);return;}
      this.index=index;this.offset=0;this.completed=false;this.render();this.highlight();this.locate();this.status(`Trecho ${index+1} de ${this.parts.length} selecionado. Pressione Play para ouvir.`);
    }
    changeRate(rate) {
      rate=Number.isFinite(rate)?Math.max(.5,Math.min(2,Math.round(rate*4)/4)):1;
      const wasReading=this.reading,wasPaused=this.paused,offset=this.offset,index=this.index;
      this.options.setRate(rate);this.render();
      if(wasReading)this.speak(index,offset,wasPaused);
      else this.status(`Velocidade definida em ${String(rate).replace('.',',')}×.`);
    }
    changeScope(value) {
      this.stop('Seção de leitura alterada.');$('scope').value=value;$('player-scope').value=value;
      this.prepare();if(this.parts.length){this.highlight();this.status('Seção pronta. Pressione Play para ouvir.');}
    }
    reset() {this.stop();this.parts=[];this.index=0;this.completed=false;this.render();$('player-text').textContent='Ative Play ou toque em um parágrafo para escolher de onde começar.';}
    bind() {
      $('read').addEventListener('click',()=>this.startScope());$('pause').addEventListener('click',()=>this.playPause());$('stop').addEventListener('click',()=>this.stop());
      $('player-play').addEventListener('click',()=>this.playPause());$('player-stop').addEventListener('click',()=>this.stop());
      $('player-prev').addEventListener('click',()=>this.navigate(this.index-1));$('player-next').addEventListener('click',()=>this.navigate(this.index+1));
      $('player-position').addEventListener('input',event=>this.navigate(Number(event.target.value)-1));
      $('player-locate').addEventListener('click',()=>this.locate(true));
      $('player-follow').addEventListener('change',event=>{this.options.setFollow(event.target.checked);if(event.target.checked)this.locate(true);});
      for(const id of ['rate','player-rate'])$(id).addEventListener('change',event=>this.changeRate(Number(event.target.value)));
      $('player-slower').addEventListener('click',()=>this.changeRate(this.options.getRate()-.25));$('player-faster').addEventListener('click',()=>this.changeRate(this.options.getRate()+.25));
      for(const id of ['scope','player-scope'])$(id).addEventListener('change',event=>this.changeScope(event.target.value));
      $('player-close').addEventListener('click',()=>{this.reset();this.options.close();});
      $('player-collapse').addEventListener('click',()=>{this.layoutChosen=true;this.compact=!this.compact;this.render();});
      $('player-rate-badge').addEventListener('click',()=>{this.layoutChosen=true;this.compact=false;this.render();$('player-rate').focus({preventScroll:true});$('player-rate').scrollIntoView({block:'nearest',behavior:'auto'});});
      $('player-accessibility').addEventListener('click',()=>$('open').click());
      $('player-libras').addEventListener('click',()=>{$('open').click();$('libras').click();});
      $('player').addEventListener('keydown',event=>{
        if(event.target.matches('input,select,textarea')||event.altKey||event.ctrlKey||event.metaKey)return;
        if(event.key==='ArrowLeft'||event.key==='ArrowRight'){event.preventDefault();this.navigate(this.index+(event.key==='ArrowRight'?1:-1));}
        else if((event.key===' '||event.key==='Enter')&&event.target===$('player')){event.preventDefault();this.playPause();}
      });
      document.querySelector('main').addEventListener('click',event=>{
        if(!this.options.getListen()||$('panel').open||event.target.closest('a,button,input,select')||window.getSelection()?.toString().trim())return;
        const element=event.target.closest(blocks);if(element&&visible(element))this.startAt(element);
      });
      window.addEventListener('pagehide',()=>{++this.token;if(this.supported)window.speechSynthesis.cancel();});
    }
  };
})();
