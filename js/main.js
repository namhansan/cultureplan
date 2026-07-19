/* =========================================================
   한국문화기획학교 — site behavior
   ========================================================= */

// ---- load shared header/footer partials ----
async function loadPartials(){
  const headerSlot = document.getElementById('site-header');
  const footerSlot = document.getElementById('site-footer');
  const [h, f] = await Promise.all([
    fetch('/partials/header.html').then(r=>r.text()),
    fetch('/partials/footer.html').then(r=>r.text())
  ]);
  if(headerSlot){ headerSlot.innerHTML = h; }
  if(footerSlot){ footerSlot.innerHTML = f; }

  // active nav highlight
  const key = document.body.getAttribute('data-page');
  document.querySelectorAll('.nav a').forEach(a=>{
    if(a.getAttribute('data-key') === key){ a.setAttribute('aria-current','page'); }
  });

  // mobile nav toggle
  const toggle = document.getElementById('navToggle');
  const nav = document.getElementById('siteNav');
  if(toggle && nav){
    toggle.addEventListener('click', ()=>{
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded','false');
    }));
  }

  const yearEl = document.getElementById('year');
  if(yearEl){ yearEl.textContent = new Date().getFullYear(); }
}

// ---- circular "seal / stamp" SVG generator ----
// text: string to run around the ring. size: px. centerNum/centerLbl: text in the middle.
function renderSeal(el, {text = '한국문화기획학교 · KOREA ACADEMY OF CULTURAL STRATEGY · ', size = 320, centerLbl = '', centerNum = ''} = {}){
  if(!el) return;
  const r = 46;
  const cx = 50, cy = 50;
  const pathId = 'sealring-' + Math.random().toString(36).slice(2,9);
  const repeated = (text + text + text).slice(0, 140);
  el.innerHTML = `
    <svg class="seal" viewBox="0 0 100 100" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="한국문화기획학교 인증 마크">
      <circle class="ring" cx="${cx}" cy="${cy}" r="${r}" stroke-width="0.6"/>
      <circle class="ring" cx="${cx}" cy="${cy}" r="${r-6}" stroke-width="0.4" opacity="0.5"/>
      <path id="${pathId}" fill="none" d="M ${cx-r},${cy} a ${r},${r} 0 1,1 ${2*r},0 a ${r},${r} 0 1,1 -${2*r},0" />
      <text class="ring-text">
        <textPath href="#${pathId}" startOffset="0%">${repeated}</textPath>
      </text>
      <g class="bars" transform="translate(50 50) scale(0.9) translate(-20 -20)">
        <rect x="4"  y="24" width="5" height="14" rx="1"/>
        <rect x="13" y="16" width="5" height="22" rx="1"/>
        <rect x="22" y="8"  width="5" height="30" rx="1"/>
        <rect x="31" y="2"  width="5" height="36" rx="1"/>
      </g>
    </svg>
  `;
  if(centerLbl || centerNum){
    const core = document.createElement('div');
    core.className = 'seal-core';
    core.innerHTML = `${centerNum ? `<span class="num">${centerNum}</span>`:''}${centerLbl ? `<span class="lbl">${centerLbl}</span>`:''}`;
    el.style.position = 'relative';
    el.appendChild(core);
  }
}

// ---- content fetchers (Decap CMS-managed JSON) ----
async function loadJSON(path){
  try{
    const res = await fetch(path, {cache:'no-store'});
    if(!res.ok) throw new Error('not found');
    return await res.json();
  }catch(e){
    console.warn('콘텐츠를 불러오지 못했습니다:', path, e);
    return null;
  }
}

function escapeHTML(s=''){
  return s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

// ---- back to top ----
function initBackToTop(){
  const btn = document.createElement('button');
  btn.className = 'back-to-top';
  btn.setAttribute('aria-label', '맨 위로 이동');
  btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5"/><path d="M5 12l7-7 7 7"/></svg>`;
  document.body.appendChild(btn);
  btn.addEventListener('click', () => window.scrollTo({top:0, behavior:'smooth'}));
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 480);
  }, {passive:true});
}

document.addEventListener('DOMContentLoaded', () => {
  loadPartials();
  initBackToTop();
});
