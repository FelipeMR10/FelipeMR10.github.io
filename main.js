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
    btn.onclick = function(){ pick(ix); speak(b.n+'. '+b.g.map(function(x){return x[1]}).join('. ')); };
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

  /* Voz: leer en voz alta */
  var synth = window.speechSynthesis, current = null;
  function voice(){ if(!synth) return null; var v = synth.getVoices(); return v.find(function(x){return /es[-_](CO|419|MX|US)/i.test(x.lang)}) || v.find(function(x){return /^es/i.test(x.lang)}) || null; }
  function stop(){ if(synth) synth.cancel(); document.querySelectorAll('.say.on,#listenAll[aria-pressed="true"]').forEach(function(b){ b.classList.remove('on'); b.setAttribute('aria-pressed','false'); }); }
  function speak(text, btn){
    if(!synth){ return; }
    stop(); var u = new SpeechSynthesisUtterance(text); u.lang='es-CO'; var v=voice(); if(v) u.voice=v; u.rate=.95;
    if(btn){ btn.classList.add('on'); btn.setAttribute('aria-pressed','true'); u.onend = function(){ btn.classList.remove('on'); btn.setAttribute('aria-pressed','false'); }; }
    synth.speak(u);
  }
  document.querySelectorAll('.say').forEach(function(b){
    b.onclick = function(){ if(b.classList.contains('on')){ stop(); return; } speak(b.closest('[data-say]').dataset.say, b); };
  });
  var all = document.getElementById('listenAll');
  all.onclick = function(){
    if(all.getAttribute('aria-pressed')==='true'){ stop(); return; }
    var txt = 'Hola, soy Felipe Madrigal. Hago páginas, apps y asistentes con inteligencia artificial. Vendé más y ahorrá tiempo, desde tu celular. ' +
      [].map.call(document.querySelectorAll('[data-say]'), function(s){ return s.dataset.say; }).join(' ');
    speak(txt, all);
  };
  if(!synth){ document.querySelectorAll('.say,#listenAll').forEach(function(b){ b.hidden = true; }); }

  /* Tema */
  document.getElementById('theme').onclick = function(){
    var r = document.documentElement, cur = r.getAttribute('data-theme') || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark':'light');
    var t = cur==='dark' ? 'light' : 'dark';
    r.setAttribute('data-theme', t);
    try { localStorage.setItem('tema', t); } catch(e){}
    var m = document.querySelector('meta[name="theme-color"]'); if(m) m.setAttribute('content', t==='light' ? '#f6f6f4' : '#0e0e10');
  };
})();
