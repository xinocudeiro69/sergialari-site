
document.addEventListener('DOMContentLoaded', ()=>{
  try{
    const ok = localStorage.getItem('cookieConsent')==='true';
    const c = document.getElementById('cookie');
    if(c && !ok){
      c.style.display='block';
      document.getElementById('cookie-accept').onclick=()=>{localStorage.setItem('cookieConsent','true'); c.style.display='none';};
      document.getElementById('cookie-config').onclick=()=>alert('Usamos solo cookies técnicas.');
    }
  }catch(e){}
});
function showStep(n){['step-1','step-2','step-3','step-done'].forEach(id=>{const el=document.getElementById(id); if(el) el.style.display='none';}); const t=document.getElementById('step-'+n); if(t) t.style.display='block';}
function nextStep(s){ if(s===1){if(!document.getElementById('name').value.trim()) return alert('Pon tu nombre 🙂'); showStep(2);} if(s===2){if(!document.getElementById('location').value.trim()) return alert('Dime de dónde eres 🙂'); showStep(3);} }
function prevStep(s){ if(s===2){showStep(1)} if(s===3){showStep(2)} }
function submitForm(){ const name=document.getElementById('name').value.trim(); const loc=document.getElementById('location').value.trim(); const email=document.getElementById('email').value.trim(); const ok=document.getElementById('consent').checked; if(!email) return alert('Necesito tu e‑mail'); if(!ok) return alert('Debes aceptar el permiso para enviarte el regalo'); document.getElementById('out-email').textContent=email; document.getElementById('out-name').textContent=name; document.getElementById('out-loc').textContent=loc; showStep('done'); }
document.addEventListener('DOMContentLoaded', ()=>{
  ['name','location','email'].forEach((id,i)=>{
    const el=document.getElementById(id);
    if(el){ el.addEventListener('keydown', e=>{ if(e.key==='Enter'){ e.preventDefault(); if(i===0) nextStep(1); else if(i===1) nextStep(2); else submitForm(); } }); }
  });
});

function openLightbox(src, alt){ const o=document.getElementById('lb'); if(!o) return; const img=document.getElementById('lb-img'); img.src=src; img.alt=alt||''; o.classList.add('active'); document.addEventListener('keydown', escClose); }
function closeLightbox(){ const o=document.getElementById('lb'); if(!o) return; o.classList.remove('active'); document.removeEventListener('keydown', escClose); }
function escClose(e){ if(e.key==='Escape') closeLightbox(); }

function initFaqAccordion(){
  const root=document.getElementById('faq');
  if(!root) return;
  root.querySelectorAll('details').forEach(det=>{
    // wrap non-summary nodes into .faq-content if not present
    let content=det.querySelector('.faq-content');
    if(!content){
      content=document.createElement('div'); content.className='faq-content';
      const toMove=[]; det.childNodes.forEach(n=>{ if(!(n.tagName && n.tagName.toLowerCase()==='summary')) toMove.append?n:null; });
      // Fallback move: gather all nodes except first summary
      const nodes=[]; for(let i=0;i<det.childNodes.length;i++){ nodes.push(det.childNodes[i]); }
      for(let i=0;i<nodes.length;i++){ const n=nodes[i]; if(!(n.tagName && n.tagName.toLowerCase()==='summary')) { content.appendChild(n); } }
      det.appendChild(content);
    }
  });
}
document.addEventListener('DOMContentLoaded', initFaqAccordion);

// Shrinking header on scroll
function headerShrink(){
  var h=document.querySelector('.header');
  if(!h) return;
  if(window.scrollY>10){ h.classList.add('shrink'); }
  else{ h.classList.remove('shrink'); }
}
window.addEventListener('scroll', headerShrink);
window.addEventListener('load', headerShrink);
