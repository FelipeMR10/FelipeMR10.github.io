/* Felipe Madrigal · interacciones del sitio */
(function(){
  document.documentElement.classList.add('js');
  var ico = function(n){return '<svg class="i"><use href="#i-'+n+'"/></svg>'};

  /* Negocios */
  var BIZ = [
    {k:'carreta', n:'Ventas en la calle', i:'fruit', g:[['wa','Te piden por WhatsApp y vos solo despachás'],['qr','Un cartel con código QR para que te paguen y te encuentren'],['chart','Sabés cuánto vendiste cada día, sin cuaderno']]},
    {k:'tienda', n:'Tienda', i:'shop', g:[['cart','Vendé por internet, también de noche'],['box','Sabé qué productos te quedan'],['doc','Facturas listas en un clic']]},
    {k:'comida', n:'Restaurante', i:'food', g:[['qr','El menú en el celular del cliente'],['wa','Pedidos y domicilios por WhatsApp'],['bot','Un asistente que responde las 24 horas']]},
    {k:'belleza', n:'Peluquería', i:'cut', g:[['calendar','Las citas se agendan solas'],['bell','Recordatorios para que nadie falte'],['camera','Tus mejores trabajos en tu propia página']]},
    {k:'taller', n:'Taller', i:'tool', g:[['doc','El historial de cada carro o moto'],['bell','Avisás al cliente cuando esté listo'],['box','Control de repuestos']]},
    {k:'empresa', n:'Empresa', i:'office', g:[['gear','Tareas repetitivas que se hacen solas'],['link','Tus programas conectados entre sí'],['shield','Tu software probado antes de salir']]}
  ];
  var biz = document.getElementById('biz'), gain = document.getElementById('gain'), negocio = document.getElementById('negocio');
  BIZ.forEach(function(b,ix){
    var btn = document.createElement('button');
    btn.type='button'; btn.setAttribute('aria-pressed', ix===0?'true':'false');
    btn.innerHTML = ico(b.i)+'<span>'+b.n+'</span>';
    btn.onclick = function(){ pick(ix); };
    biz.appendChild(btn);
  });
  function pick(ix){
    [].forEach.call(biz.children,function(c,j){c.setAttribute('aria-pressed', j===ix?'true':'false')});
    gain.innerHTML = BIZ[ix].g.map(function(x){return '<div><span>'+ico(x[0])+'</span><p>'+x[1]+'</p></div>'}).join('');
  }
  pick(0);

  /* Servicios */
  var SVC = [
    ['bot','Inteligencia Artificial','Asistentes que atienden a tus clientes y hacen tareas repetitivas, día y noche.',['Chatbots','Agentes de IA','Automatizaciones','Desarrollo potenciado con IA']],
    ['shield','Calidad y soporte','Reviso que todo funcione bien hoy y mañana, y lo mantengo al día.',['Pruebas QA manuales y automáticas','Playwright','Mantenimiento','Hosting']],
    ['web','Páginas y tiendas','Tu negocio en internet, bonito en el celular y listo para vender.',['Páginas web','Landing pages','eCommerce','Diseño responsive']],
    ['phone','Apps a tu medida','Apps y sistemas para lo que tu negocio necesite: citas, inventario, facturas.',['Apps móviles','Plataformas web','Flutter','React']],
    ['link','Conectar y automatizar','Tus programas trabajando juntos para que no hagás todo a mano.',['APIs REST','Integraciones con CRM','Pasarelas de pago','Automatización']],
    ['idea','¿Tenés otra idea?','Contámela. Si se puede hacer con software, lo conversamos.',[]]
  ];
  var svc = document.getElementById('svc');
  SVC.forEach(function(s,ix){
    var last = ix===SVC.length-1;
    var c = document.createElement(last?'a':'button');
    c.className = 'card reveal'+(last?' idea':'');
    if(last){ c.href='https://wa.me/message/ZS7BVH67JTQZN1'; c.target='_blank'; c.rel='noopener'; c.style.textDecoration='none'; }
    else { c.type='button'; c.setAttribute('aria-pressed','false'); }
    c.innerHTML = '<div class="in"><div class="face"><span class="ic">'+ico(s[0])+'</span><h3>'+s[1]+'</h3><p>'+s[2]+'</p><span class="flip">'+(last?'Escribime →':'Tocá para ver el detalle técnico ↻')+'</span></div>'+
      (last?'':'<div class="face back"><span class="ic" style="font-size:36px">'+ico(s[0])+'</span><h3 style="font-size:24px">'+s[1]+'</h3><ul>'+s[3].map(function(t){return '<li>'+t+'</li>'}).join('')+'</ul><span class="flip">Volver ↻</span></div>')+'</div>';
    if(!last) c.onclick = function(){
      var open = c.getAttribute('aria-pressed')==='true';
      svc.querySelectorAll('.card[aria-pressed="true"]').forEach(function(o){ o.setAttribute('aria-pressed','false'); });
      if(!open) c.setAttribute('aria-pressed','true');
    };
    svc.appendChild(c);
  });

  /* Chat animado del celular */
  var MSG = [
    ['in','Hola, ¿me traés 6 aguacates? 🥑'],
    ['out','¡Claro! Son $12.000. ¿A qué dirección?<small>Asistente automático</small>'],
    ['in','Calle 10 #43, gracias'],
    ['sale','Pedido recibido · $12.000']
  ];
  var chat = document.getElementById('chat'), mi = 0;
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  function step(){
    if(mi >= MSG.length){ if(reduce) return; setTimeout(function(){ chat.innerHTML=''; mi=0; step(); }, 2600); return; }
    var m = MSG[mi++], el = document.createElement('div');
    if(m[0]==='sale'){ el.className='sale b'; el.innerHTML = ico('money')+m[1]; }
    else { el.className='b '+m[0]; el.innerHTML = m[1]; }
    chat.appendChild(el);
    reduce ? step() : setTimeout(step, 1300);
  }
  step();

  /* Entrada suave al hacer scroll (visible por defecto) */
  if('IntersectionObserver' in window && !reduce){
    var io = new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.remove('wait'); io.unobserve(e.target);} }); },{rootMargin:'0px 0px -8% 0px'});
    document.querySelectorAll('.reveal').forEach(function(el){
      var r = el.getBoundingClientRect(); if(r.top > innerHeight){ el.classList.add('wait'); io.observe(el); }
    });
  }

  /* Contadores */
  var nums = document.querySelectorAll('[data-n]');
  if('IntersectionObserver' in window && !reduce){
    var io2 = new IntersectionObserver(function(es){ es.forEach(function(e){ if(!e.isIntersecting) return; io2.unobserve(e.target);
      var el=e.target, end=+el.dataset.n, t0=performance.now();
      (function f(t){ var p=Math.min(1,(t-t0)/1400); el.textContent=Math.round(end*(1-Math.pow(1-p,3))); if(p<1) requestAnimationFrame(f); })(t0);
    }); });
    nums.forEach(function(n){ io2.observe(n); });
  }

  /* Sonido: apagado por defecto. El botón de arriba lo enciende o lo apaga para todo el sitio;
     solo suenan los botones de escuchar de cada sección, y solo con el sonido encendido.
     Usa la voz del dispositivo: se prefiere una voz masculina natural en español latino. */
  var synth = window.speechSynthesis, soundOn = false, playing = null;
  var sound = document.getElementById('sound'), says = document.querySelectorAll('.say');
  /* Voces masculinas conocidas en español:
     iPhone/Mac: Carlos (Colombia), Juan (México), Diego (Argentina), Jorge (España), Eddy, Reed, Rocko.
     Windows/Edge: Gonzalo (Colombia), Jorge y Raúl (México), Álvaro y Pablo (España).
     Android/Google: voces con código esd/esf (EE. UU.) o eed/eee (España). */
  var MALE = /\b(carlos|juan|diego|jorge|eddy|reed|rocko|gonzalo|ra[uú]l|[aá]lvaro|pablo|alonso|tom[aá]s|lorenzo|enrique|male|hombre|masculin[oa])\b|-x-(esd|esf|eed|eee)/i;
  var FEMALE = /\b(soledad|m[oó]nica|paulina|marisol|ang[eé]lica|isabela|francisca|luciana|sabina|helena|laura|salom[eé]|dalia|elvira|paloma|female|mujer|femenin[oa])\b|-x-(esc|eea|eec|eef)/i;
  var voices = [];
  function loadVoices(){ if(synth) voices = synth.getVoices().filter(function(x){ return /^es/i.test(x.lang); }); }
  if(synth){ loadVoices(); if('onvoiceschanged' in synth) synth.addEventListener('voiceschanged', loadVoices); }
  function pickVoice(){
    if(!voices.length) loadVoices();
    var score = function(x){
      var id = x.name + ' ' + (x.voiceURI || ''), s = 0;
      if(MALE.test(id)) s += 10;
      if(FEMALE.test(id)) s -= 10;
      if(/natural|online|neural|premium|enhanced|mejorad/i.test(id)) s += 3;
      /* Acento: primero Colombia, luego el resto de Latinoamérica; España de último */
      if(/es[-_]CO/i.test(x.lang)) s += 25; else if(/es[-_](419|MX|US|AR|CL|PE|VE|EC)/i.test(x.lang)) s += 22;
      return s;
    };
    var best = voices.slice().sort(function(a,b){ return score(b) - score(a); })[0] || null;
    return best ? { voice: best, male: MALE.test(best.name + ' ' + (best.voiceURI || '')) && !FEMALE.test(best.name + ' ' + (best.voiceURI || '')) } : null;
  }
  function stop(){ if(synth) synth.cancel(); if(playing){ playing.classList.remove('on'); playing = null; } }
  function setSound(on){
    soundOn = on; if(!on) stop();
    sound.setAttribute('aria-pressed', on ? 'true' : 'false');
    sound.querySelector('use').setAttribute('href', on ? '#i-speak' : '#i-mute');
    sound.querySelector('.lbl').textContent = on ? 'Sonido encendido' : 'Sonido apagado';
    says.forEach(function(b){ b.disabled = !on; b.title = on ? 'Escuchar esta sección' : 'Activá el sonido arriba para escuchar'; });
  }
  sound.onclick = function(){ setSound(!soundOn); };
  says.forEach(function(b){
    b.onclick = function(){
      if(!soundOn || !synth) return;
      if(playing === b){ stop(); return; }
      stop();
      var u = new SpeechSynthesisUtterance(b.closest('[data-say]').dataset.say);
      u.lang = 'es-CO'; var v = pickVoice(); if(v){ u.voice = v.voice; u.lang = v.voice.lang; }
      u.rate = .95;
      /* Si no hay voz de hombre instalada, se baja un poco el tono para que suene más grave */
      u.pitch = (v && v.male) ? .9 : .75;
      u.onend = u.onerror = function(){ if(playing === b){ b.classList.remove('on'); playing = null; } };
      playing = b; b.classList.add('on'); synth.speak(u);
    };
  });
  if(!synth){ sound.hidden = true; says.forEach(function(b){ b.hidden = true; }); }
  setSound(false);

  /* Tema */
  document.getElementById('theme').onclick = function(){
    var r = document.documentElement, cur = r.getAttribute('data-theme') || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark':'light');
    var t = cur==='dark' ? 'light' : 'dark';
    r.setAttribute('data-theme', t);
    try { localStorage.setItem('tema', t); } catch(e){}
    var m = document.querySelector('meta[name="theme-color"]'); if(m) m.setAttribute('content', t==='light' ? '#f6f6f4' : '#0e0e10');
  };
})();
