
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
  var mejoras = [];
  var tips = {
    cepillados: {icon:'🪥', texto:'<strong>Cepíllate al menos dos veces al día</strong>, sobre todo por la noche. La placa bacteriana tarda entre 24 y 48 horas en endurecerse y convertirse en sarro, que solo se puede eliminar en clínica.'},
    interprox:  {icon:'🧵', texto:'<strong>Usa hilo dental o irrigador al menos 4 días por semana.</strong> El cepillo solo llega al 60% de la superficie del diente. Los espacios entre dientes son donde más empiezan caries y enfermedad de encías.'},
    lengua:     {icon:'👅', texto:'<strong>Limpia la lengua cada día.</strong> Acumula millones de bacterias que causan mal aliento. Un raspalenguas cuesta menos de 5€ y cambia mucho la sensación de boca limpia.'},
    azucar:     {icon:'🍬', texto:'<strong>Reduce el picoteo dulce entre horas.</strong> No es tanto la cantidad como la frecuencia: cada vez que tomas azúcar la boca tarda una hora en recuperar el pH normal. Reserva lo dulce para las comidas principales.'},
    recambio:   {icon:'🔄', texto:'<strong>Cambia el cepillo cada 3 meses.</strong> Las cerdas desgastadas no limpian bien y pueden irritar las encías. Si usas eléctrico, el cabezal también.'},
    revision:   {icon:'🦷', texto:'<strong>Haz una revisión este año.</strong> Las caries iniciales y la gingivitis no duelen. Detectarlos a tiempo significa tratamientos más sencillos y baratos.'}
  };
  testSteps.forEach(function(s){
    var v = testAnswers[s.name] || 'no';
    var positivo = s.invert ? (v === 'no') : (v === 'si');
    if(positivo){ puntos++; } else { mejoras.push(tips[s.name]); }
  });
  var nivel, intro;
  if(puntos >= 5){
    nivel = '¡Muy bien!';
    intro = 'Tu rutina está por encima de la media. Estás haciendo las cosas bien — mantenlo.';
  } else if(puntos >= 3){
    nivel = 'Hay margen de mejora';
    intro = 'Tienes una base sólida. Con unos ajustes concretos notarás la diferencia rápido.';
  } else {
    nivel = 'Tu boca necesita atención';
    intro = 'No te preocupes — con cambios de hábitos concretos puedes mejorar mucho en poco tiempo.';
  }
  var html = '<h3 style="margin:0 0 6px;font-size:22px">' + nivel + '</h3>';
  html += '<p style="color:var(--ink-70);margin-bottom:' + (mejoras.length ? '16px' : '8px') + '">' + intro + '</p>';
  if(mejoras.length){
    html += '<p style="font-weight:800;margin:0 0 12px">Qué puedes mejorar:</p>';
    mejoras.forEach(function(m){
      html += '<div style="display:flex;gap:10px;margin-bottom:12px"><span style="font-size:20px;flex-shrink:0;line-height:1.5">' + m.icon + '</span><p style="margin:0;font-size:14px;color:var(--ink-70);line-height:1.55">' + m.texto + '</p></div>';
    });
  } else {
    html += '<p style="color:var(--ink-70);font-size:14px">Mantén estos hábitos y visita al dentista cada 6–12 meses. ¡Sigue así!</p>';
  }
  html += '<p style="margin-top:14px;font-size:14px;border-top:1px solid var(--line);padding-top:12px">¿Tienes dudas sobre alguno de estos puntos? <a href="https://wa.me/34669033565" target="_blank" rel="noopener" style="color:var(--accent);font-weight:800">Escríbeme por WhatsApp</a>, sin compromiso.</p>';
  var res = document.getElementById('resultado');
  res.innerHTML = html; res.style.display = 'block';
  document.getElementById('step-box').style.display = 'none';
  document.getElementById('nav-box').style.display = 'none';
}

document.addEventListener('DOMContentLoaded', function(){
  initFaqAccordion();
  testRender();
});

/* ===== Banner CTA flotante ===== */
(function(){
  if(window.location.pathname.indexOf('domicilio') !== -1) return;
  try { if(localStorage.getItem('ctaWaDismissed') === 'true') return; } catch(e) {}
  var el = document.createElement('div');
  el.className = 'cta-strip';
  el.innerHTML = '<button class="cs-close" aria-label="Cerrar" onclick="(function(b){b.parentNode.classList.remove(\'cs-visible\');setTimeout(function(){b.parentNode.remove()},400);try{localStorage.setItem(\'ctaWaDismissed\',\'true\')}catch(e){}})(this.parentNode)">×</button>'
    + '<p>¿Tienes a alguien en casa que no puede ir al dentista?</p>'
    + '<a href="https://wa.me/34669033565" target="_blank" rel="noopener">→ Escríbeme por WhatsApp</a>';
  document.body.appendChild(el);
  setTimeout(function(){ el.classList.add('cs-visible'); }, 4000);
})();
