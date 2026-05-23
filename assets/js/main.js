
/* ===== Cookie banner (inyectado en todas las páginas) ===== */
(function(){
  var accepted = false;
  try { accepted = localStorage.getItem('cookieConsent') === 'true'; } catch(e) {}
  if (accepted) return;

  var el = document.createElement('div');
  el.id = 'cookie-banner';
  el.innerHTML =
    '<div class="ck-inner">' +
      '<p class="ck-text">Usamos únicamente <strong>cookies técnicas</strong> imprescindibles para el funcionamiento de esta web. No rastreamos ni cedemos datos personales.</p>' +
      '<div class="ck-btns">' +
        '<button id="ck-accept">Aceptar</button>' +
        '<a href="privacidad.html" class="ck-link">Más información</a>' +
      '</div>' +
    '</div>';
  document.body.appendChild(el);

  requestAnimationFrame(function(){
    requestAnimationFrame(function(){ el.classList.add('ck-visible'); });
  });

  document.getElementById('ck-accept').onclick = function(){
    el.classList.remove('ck-visible');
    el.classList.add('ck-hiding');
    setTimeout(function(){ if (el.parentNode) el.parentNode.removeChild(el); }, 480);
    try { localStorage.setItem('cookieConsent', 'true'); } catch(e) {}
  };
})();

/* ===== Header shrink en scroll (con histéresis para evitar parpadeo) ===== */
function headerShrink(){
  var h = document.querySelector('.header');
  if (!h) return;
  var shrunk = h.classList.contains('shrink');
  if (!shrunk && window.scrollY > 60) { h.classList.add('shrink'); }
  else if (shrunk && window.scrollY < 40) { h.classList.remove('shrink'); }
}
window.addEventListener('scroll', headerShrink);
window.addEventListener('load', headerShrink);

/* ===== Lightbox ===== */
function openLightbox(src, alt){
  var o = document.getElementById('lb');
  if (!o) return;
  document.getElementById('lb-img').src = src;
  document.getElementById('lb-img').alt = alt || '';
  o.classList.add('active');
  document.addEventListener('keydown', escClose);
}
function closeLightbox(){
  var o = document.getElementById('lb');
  if (!o) return;
  o.classList.remove('active');
  document.removeEventListener('keydown', escClose);
}
function escClose(e){ if (e.key === 'Escape') closeLightbox(); }

/* ===== FAQ accordion ===== */
function initFaqAccordion(){
  var root = document.getElementById('faq');
  if (!root) return;
  root.querySelectorAll('details').forEach(function(det){
    if (det.querySelector('.faq-content')) return;
    var content = document.createElement('div');
    content.className = 'faq-content';
    var nodes = Array.prototype.slice.call(det.childNodes);
    nodes.forEach(function(n){
      if (!(n.tagName && n.tagName.toLowerCase() === 'summary')) content.appendChild(n);
    });
    det.appendChild(content);
  });
}

/* ===== Test gratuito ===== */
var testSteps = [
  {q:'¿Te cepillas los dientes al menos 2 veces al día?', name:'cepillados'},
  {q:'¿Usas hilo dental o irrigador al menos 4 días por semana?', name:'interprox'},
  {q:'¿Cepillas o limpias la lengua de forma habitual?', name:'lengua'},
  {q:'¿Evitas dulces/bebidas azucaradas entre horas?', name:'azucar', invert:true},
  {q:'¿Tu cepillo/cabezal tiene menos de 3 meses de uso?', name:'recambio'},
  {q:'¿Revisión o limpieza profesional en el último año?', name:'revision'}
];
var testIdx = 0, testAnswers = {};

function testRender(){
  var box = document.getElementById('step-box');
  if (!box) return;
  var s = testSteps[testIdx];
  var html = '<p><strong>' + (testIdx+1) + ' de ' + testSteps.length + '.</strong> ' + s.q + '</p>';
  html += '<div style="display:flex;gap:12px;margin-top:10px">';
  html += '<label style="cursor:pointer"><input type="radio" name="ans" value="si"> Sí</label>';
  html += '<label style="cursor:pointer;margin-left:8px"><input type="radio" name="ans" value="no"> No</label>';
  html += '</div>';
  box.innerHTML = html;
  document.getElementById('btn-back').disabled = (testIdx === 0);
  document.getElementById('btn-next').textContent = (testIdx === testSteps.length - 1) ? 'Ver resultado' : 'Siguiente';
  if (testAnswers[s.name]){
    var sel = document.querySelector('input[name="ans"][value="' + testAnswers[s.name] + '"]');
    if (sel) sel.checked = true;
  }
}
function testNext(){
  var box = document.getElementById('step-box');
  if (!box) return;
  var checked = document.querySelector('input[name="ans"]:checked');
  if (!checked){ alert('Selecciona una respuesta'); return; }
  testAnswers[testSteps[testIdx].name] = checked.value;
  if (testIdx < testSteps.length - 1){ testIdx++; testRender(); }
  else { testResultado(); }
}
function testBack(){ if (testIdx > 0){ testIdx--; testRender(); } }
function testResultado(){
  var puntos = 0;
  testSteps.forEach(function(s){
    var v = testAnswers[s.name] || 'no';
    if (s.invert ? v === 'no' : v === 'si') puntos++;
  });
  var nivel, msg;
  if (puntos >= 5){ nivel = '¡Muy bien!'; msg = 'Tu rutina va por buen camino. Mantén los hábitos y revisa con tu dentista cada 6–12 meses.'; }
  else if (puntos >= 3){ nivel = 'Mejorable'; msg = 'Hay puntos a reforzar: hilo/irrigador, limpieza de lengua y reducir azúcares entre horas.'; }
  else { nivel = 'Necesita atención'; msg = 'Te vendría bien un repaso completo de hábitos y probablemente una limpieza profesional.'; }
  var html = '<h2 style="margin:0 0 8px">' + nivel + '</h2><p>' + msg + '</p>' +
    '<div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:14px">' +
    '<a class="btn" href="https://wa.me/34669033565" target="_blank" rel="noopener">Hablar con Sergi por WhatsApp</a> ' +
    '<a class="btn secondary" href="clinica.html">Pedir cita en clínica</a>' +
    '</div>';
  var res = document.getElementById('resultado');
  res.innerHTML = html; res.style.display = 'block';
  res.scrollIntoView({behavior:'smooth'});
  document.getElementById('step-box').style.display = 'none';
  document.getElementById('nav-box').style.display = 'none';
}

document.addEventListener('DOMContentLoaded', function(){
  initFaqAccordion();
  testRender();
});
