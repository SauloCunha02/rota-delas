/* Navegação compartilhada pelas páginas de consulta e de cadastro. */
(() => {
 'use strict';
 const nav=document.getElementById('mobile-nav'),header=document.querySelector('.site-header'),menu=document.getElementById('more-panel'),open=document.getElementById('more-open'),close=document.getElementById('more-close');
 const root=document.documentElement,main=document.querySelector('main');
 if(document.body.dataset.page==='catalogo'&&location.hash==='#participar'){location.replace('cadastro.html');return;}
 let restoreMenuFocus=true;
 function measure(){root.style.setProperty('--bottom-nav-height',getComputedStyle(nav).display==='none'?'0px':nav.getBoundingClientRect().height+'px');root.style.setProperty('--site-header-height',header.getBoundingClientRect().height+'px');}
 function mark(section){nav.querySelectorAll('[data-section]').forEach(a=>{if(a.dataset.section===section&&document.body.dataset.page==='catalogo')a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});open.classList.toggle('is-current',document.body.dataset.page==='cadastro'||['metodo','contribuir'].includes(section));}
 function syncDialogs(){const active=!!document.querySelector('dialog[open]');document.body.classList.toggle('dialog-open',active);open.setAttribute('aria-expanded',String(menu.open));window.dispatchEvent(new Event('rota-dialog-change'));}
 open.addEventListener('click',()=>{restoreMenuFocus=true;menu.showModal();close.focus();syncDialogs();});
 close.addEventListener('click',()=>menu.close());
 menu.addEventListener('close',()=>{syncDialogs();if(restoreMenuFocus&&!document.querySelector('dialog[open]')&&open.getClientRects().length)open.focus({preventScroll:true});restoreMenuFocus=true;});
 for(const dialog of document.querySelectorAll('dialog'))new MutationObserver(syncDialogs).observe(dialog,{attributes:true,attributeFilter:['open']});
 menu.addEventListener('click',event=>{const rect=menu.getBoundingClientRect();if(event.target===menu&&(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom))menu.close();});
 document.querySelectorAll('[data-open-accessibility],[data-open-libras]').forEach(button=>button.addEventListener('click',()=>{restoreMenuFocus=false;menu.close();document.getElementById('a11y-open').click();if(button.hasAttribute('data-open-libras'))document.getElementById('a11y-libras').click();}));
 document.addEventListener('click',event=>{
  const link=event.target.closest('a[href]');if(!link)return;
  const url=new URL(link.href,location.href);if(url.origin!==location.origin||url.pathname!==location.pathname||!url.hash||link.target==='_blank'||link.hasAttribute('download'))return;
  let hash;try{hash=decodeURIComponent(url.hash.slice(1));}catch{return;}
  const target=document.getElementById(hash);if(!target)return;
  event.preventDefault();if(menu.open){restoreMenuFocus=false;menu.close();}
  history.pushState(null,'',url.hash);const heading=target.querySelector('h1,h2')||target;heading.tabIndex=-1;heading.focus({preventScroll:true});
  target.scrollIntoView({block:'start',behavior:root.dataset.a11yMotion==='true'?'instant':'smooth'});
  mark(url.hash.slice(1)==='inicio'?'explorar':url.hash.slice(1));
  if(main.contains(target))window.dispatchEvent(new CustomEvent('rota-section-change',{detail:{id:target.id}}));
 });
 const observed=[...main.querySelectorAll('section[id]')];
 if(window.IntersectionObserver){const observer=new IntersectionObserver(entries=>{const visible=entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio);if(visible[0])mark(visible[0].target.id==='inicio'?'explorar':visible[0].target.id);},{rootMargin:'-80px 0px -45% 0px',threshold:[0,.1,.5]});observed.forEach(s=>observer.observe(s));}
 window.addEventListener('popstate',()=>{const id=location.hash.slice(1)||'inicio';mark(id==='inicio'?'explorar':id);const target=document.getElementById(id);if(target){target.scrollIntoView({block:'start',behavior:'instant'});window.dispatchEvent(new CustomEvent('rota-section-change',{detail:{id}}));}});
 function keyboard(){const typing=document.activeElement?.matches('textarea,input:not([type=checkbox]):not([type=range]):not([type=button])');document.body.classList.toggle('keyboard-open',!!typing&&!!window.visualViewport&&innerHeight-visualViewport.height>150);measure();}
 window.visualViewport?.addEventListener('resize',keyboard);document.addEventListener('focusin',keyboard);document.addEventListener('focusout',()=>requestAnimationFrame(keyboard));
 window.addEventListener('resize',measure);if(window.ResizeObserver){const sizes=new ResizeObserver(measure);sizes.observe(nav);sizes.observe(header);}
 mark(document.body.dataset.page==='cadastro'?'participar':(location.hash.slice(1)||'explorar'));measure();
})();
