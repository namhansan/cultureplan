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

  // active nav highlight (top-level links + dropdown parent items)
  const key = document.body.getAttribute('data-page');
  document.querySelectorAll('.nav > a[data-key]').forEach(a=>{
    if(a.getAttribute('data-key') === key){ a.classList.add('nav-active'); a.setAttribute('aria-current','page'); }
  });
  document.querySelectorAll('.nav-item[data-key]').forEach(item=>{
    if(item.getAttribute('data-key') === key){ item.classList.add('nav-active'); }
  });

  // dropdown toggle (click-based, works for both desktop fallback and mobile accordion)
  document.querySelectorAll('.nav-item').forEach(item=>{
    const toplink = item.querySelector('.nav-toplink');
    if(!toplink) return;
    toplink.addEventListener('click', (e)=>{
      e.stopPropagation();
      const wasOpen = item.classList.contains('open');
      document.querySelectorAll('.nav-item.open').forEach(o => { if(o !== item) o.classList.remove('open'); });
      item.classList.toggle('open', !wasOpen);
    });
  });
  document.addEventListener('click', ()=>{
    document.querySelectorAll('.nav-item.open').forEach(o => o.classList.remove('open'));
  });

  // mobile nav toggle
  const toggle = document.getElementById('navToggle');
  const nav = document.getElementById('siteNav');
  if(toggle && nav){
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.querySelectorAll('.nav > a, .dropdown a').forEach(a=>a.addEventListener('click',()=>{
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded','false');
    }));
  }

  const yearEl = document.getElementById('year');
  if(yearEl){ yearEl.textContent = new Date().getFullYear(); }
}

// ---- circular "seal / stamp" SVG generator ----
// text: string to run around the ring. size: px. centerNum/centerLbl: text in the middle.
function renderSeal(el, {text = '한국문화기획학교 · KOREA ACADEMY OF CULTURAL PLANNING · ', size = 320, centerLbl = '', centerNum = ''} = {}){
  if(!el) return;
  const r = 46;
  const cx = 50, cy = 50;
  const pathId = 'sealring-' + Math.random().toString(36).slice(2,9);
  const circumference = 2 * Math.PI * r;
  // seed with a generous over-long run; we trim to a whole number of clean
  // copies once we can measure actual glyph width in the DOM (see below).
  const seedRepeated = text.repeat(6);
  el.innerHTML = `
    <svg class="seal" viewBox="-9 -9 118 118" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="한국문화기획학교 인증 마크">
      <circle class="ring" cx="${cx}" cy="${cy}" r="${r}" stroke-width="0.6"/>
      <circle class="ring" cx="${cx}" cy="${cy}" r="${r-6}" stroke-width="0.4" opacity="0.5"/>
      <path id="${pathId}" fill="none" d="M ${cx-r},${cy} a ${r},${r} 0 1,1 ${2*r},0 a ${r},${r} 0 1,1 -${2*r},0" />
      <text class="ring-text">
        <textPath href="#${pathId}" startOffset="0%">${seedRepeated}</textPath>
      </text>
      <image href="/images/brand/kacs-icon-white.png" x="28" y="40.7" width="44" height="18.6" preserveAspectRatio="xMidYMid meet"/>
    </svg>
  `;
  // Measure how wide ONE copy of the base phrase renders as, then lay down only
  // as many *whole* copies as actually fit the ring — never a partial/cut copy.
  const tp = el.querySelector('textPath');
  if(tp && tp.getComputedTextLength){
    tp.textContent = text;
    const singleWidth = tp.getComputedTextLength() || 1;
    const fullCopies = Math.max(1, Math.floor(circumference / singleWidth));
    tp.textContent = text.repeat(fullCopies);
  }
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

// ---- program category metadata (now free-text: any category string works, color assigned by hash) ----
const CATEGORY_COLOR_PALETTE = ['#16233F', '#B23A33', '#1F5C43', '#7A5C2E', '#4A3B7A', '#2E6B7A'];
function hashColor(str){
  let h = 0;
  for(let i=0; i<str.length; i++){ h = (h * 31 + str.charCodeAt(i)) >>> 0; }
  return CATEGORY_COLOR_PALETTE[h % CATEGORY_COLOR_PALETTE.length];
}
function categoryMeta(key){
  if(!key) return { label: '프로그램', color: '#16233F' };
  return { label: key, color: hashColor(key) };
}

// ---- shared program card renderer (handles internal detail pages + external links, e.g. 한국축제지원센터) ----
function renderProgramCard(p){
  const isExternal = !!p.externalUrl;
  const href = isExternal ? p.externalUrl : `/program-detail.html?slug=${encodeURIComponent(p.slug||'')}`;
  const attrs = isExternal ? 'target="_blank" rel="noopener"' : '';
  const linkLabel = isExternal ? '사이트 방문 ↗' : '자세히 →';
  const cat = categoryMeta(p.category);
  const media = p.image
    ? `<div class="ticket-media" style="background-image:url('${encodeURI(p.image)}');"></div>`
    : `<div class="ticket-media ticket-media-fallback" style="background:linear-gradient(135deg, ${cat.color}, ${cat.color}cc);"><span>${escapeHTML(p.tag || cat.label)}</span></div>`;
  return `
    <a class="ticket" href="${href}" ${attrs}>
      ${media}
      <div class="ticket-body">
        <span class="cat-chip" style="color:${cat.color}; border-color:${cat.color};">${escapeHTML(p.tag || cat.label)}</span>
        <div class="status">${escapeHTML(p.status||'')}</div>
        <h3>${escapeHTML(p.title||'')}</h3>
        <p>${escapeHTML(p.summary||'')}</p>
        <div class="meta">${escapeHTML(p.period||'')} · ${escapeHTML(p.audience||'')} <span class="arrow">${linkLabel}</span></div>
      </div>
    </a>
  `;
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

// ---- Netlify Identity global loader ----
// Loads the Identity widget on every page so that invite / password-recovery
// links (which land on the site root with a #invite_token=... hash) always
// trigger the "set your password" popup, no matter which page they open on.
function initIdentityGlobal(){
  if(window.netlifyIdentity) return; // already loaded by this page (e.g. members.html)
  const hadInviteToken = /invite_token=|recovery_token=/.test(window.location.hash);
  const s = document.createElement('script');
  s.src = 'https://identity.netlify.com/v1/netlify-identity-widget.js';
  s.onload = () => {
    if(!window.netlifyIdentity) return;
    window.netlifyIdentity.on('login', () => {
      if(hadInviteToken){ window.location.href = '/admin/'; }
    });
    window.netlifyIdentity.init();
  };
  document.head.appendChild(s);
}

// ---- scroll reveal (fade + slide up elements with class="reveal") ----
function initScrollReveal(){
  const items = document.querySelectorAll('.reveal');
  if(!items.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('revealed');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  items.forEach(el => obs.observe(el));
}

document.addEventListener('DOMContentLoaded', () => {
  loadPartials();
  initBackToTop();
  initIdentityGlobal();
  initScrollReveal();
});
