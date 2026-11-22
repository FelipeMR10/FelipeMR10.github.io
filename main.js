/* Felipe Madrigal · interacciones del sitio */
(function(){
  var ico = function(n){return '<svg class="i"><use href="#i-'+n+'"/></svg>'};
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Reloj de Medellín en la barra */
  var clk = document.getElementById('clock');
  function tick(){
    try { clk.textContent = new Intl.DateTimeFormat('es-CO',{hour:'2-digit',minute:'2-digit',hour12:false,timeZone:'America/Bogota'}).format(new Date()); } catch(e){}
  }
  tick(); setInterval(tick, 15000);

  /* Negocios */
  var BIZ = [
    {n:'Ventas en la calle', i:'fruit', g:[['wa','Te piden por WhatsApp y vos solo despachás'],['qr','Un cartel con código QR para que te paguen y te encuentren'],['chart','Sabés cuánto vendiste cada día, sin cuaderno']]},
    {n:'Tienda', i:'shop', g:[['cart','Vendé por internet, también de noche'],['box','Sabé qué productos te quedan'],['doc','Facturas listas en un clic']]},
    {n:'Restaurante', i:'food', g:[['qr','El menú en el celular del cliente'],['wa','Pedidos y domicilios por WhatsApp'],['bot','Un asistente que responde las 24 horas']]},
    {n:'Peluquería', i:'cut', g:[['calendar','Las citas se agendan solas'],['bell','Recordatorios para que nadie falte'],['camera','Tus mejores trabajos en tu propia página']]},
    {n:'Taller', i:'tool', g:[['doc','El historial de cada carro o moto'],['bell','Avisás al cliente cuando esté listo'],['box','Control de repuestos']]},
    {n:'Empresa', i:'office', g:[['gear','Tareas repetitivas que se hacen solas'],['link','Tus programas conectados entre sí'],['shield','Tu software probado antes de salir']]}
  ];
  var biz = document.getElementById('biz'), gain = document.getElementById('gain');
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

  /* Ventana de código que se escribe sola */
  var CODE = [
    ['c','// Frutas Don Jorge\n'],
    ['k','const '],['','pedido = '],['k','await '],['f','leer'],['','()\n'],
    ['c','// "¿me traés 6 aguacates?"\n\n'],
    ['k','const '],['','precio = '],['f','calcular'],['','()\n'],
    ['k','await '],['f','responder'],['','('],['s','"$12.000"'],['',')\n'],
    ['k','await '],['f','registrarVenta'],['','()\n\n'],
    ['ok','✓ pedido recibido']
  ];
  var code = document.getElementById('code');
  function esc(t){return t.replace(/&/g,'&amp;').replace(/</g,'&lt;')}
  function full(){ return CODE.map(function(p){return p[0]?'<span class="'+p[0]+'">'+esc(p[1])+'</span>':esc(p[1])}).join(''); }
  if(reduce){ code.innerHTML = full(); }
  else {
    var pi=0, ci=0, done='';
    (function type(){
      if(pi>=CODE.length){ code.innerHTML = done+'<span class="cur"></span>'; setTimeout(function(){ pi=0; ci=0; done=''; type(); }, 4200); return; }
      var p = CODE[pi]; ci++;
      var part = p[1].slice(0,ci), html = p[0]?'<span class="'+p[0]+'">'+esc(part)+'</span>':esc(part);
      code.innerHTML = done+html+'<span class="cur"></span>';
      if(ci>=p[1].length){ done += html; pi++; ci=0; }
      setTimeout(type, p[1].charAt(ci-1)==='\n' ? 160 : 28);
    })();
  }

  /* Chat animado del celular */
  var MSG = [
    ['in','Hola, ¿me traés 6 aguacates? 🥑'],
    ['out','¡Claro! Son $12.000. ¿A qué dirección?<small>Asistente automático</small>'],
    ['in','Calle 10 #43, gracias'],
    ['sale','Pedido recibido · $12.000']
  ];
  var chat = document.getElementById('chat'), mi = 0;
  function step(){
    if(mi >= MSG.length){ if(reduce) return; setTimeout(function(){ chat.innerHTML=''; mi=0; step(); }, 3000); return; }
    var m = MSG[mi++], el = document.createElement('div');
    if(m[0]==='sale'){ el.className='sale b'; el.innerHTML = ico('money')+m[1]; }
    else { el.className='b '+m[0]; el.innerHTML = m[1]; }
    chat.appendChild(el);
    reduce ? step() : setTimeout(step, 1500);
  }
  setTimeout(step, reduce?0:900);

  /* Luz que sigue al puntero en las tarjetas */
  document.querySelectorAll('.cell').forEach(function(c){
    c.addEventListener('pointermove', function(e){ var r=c.getBoundingClientRect(); c.style.setProperty('--mx',(e.clientX-r.left)+'px'); c.style.setProperty('--my',(e.clientY-r.top)+'px'); });
  });

  /* Aparición al bajar, escalonada por grupo */
  ['.bento','.steps','.why'].forEach(function(sel){
    document.querySelectorAll(sel+' > .reveal').forEach(function(el,i){ el.style.transitionDelay=(i*0.07)+'s'; });
  });
  var io = 'IntersectionObserver' in window && !reduce ? new IntersectionObserver(function(es){
    es.forEach(function(e){ if(!e.isIntersecting) return; var t=e.target; t.classList.remove('wait'); t.classList.add('on'); io.unobserve(t); setTimeout(function(){ t.style.transitionDelay=''; },1400); });
  },{rootMargin:'0px 0px -8% 0px'}) : null;
  document.querySelectorAll('.reveal').forEach(function(el){
    if(!io){ el.classList.add('on'); return; }
    if(el.getBoundingClientRect().top > innerHeight){ el.classList.add('wait'); }
    io.observe(el);
  });

  /* Contadores */
  var fmt = function(n){ return n.toLocaleString('es-CO'); };
  var nums = document.querySelectorAll('[data-n]');
  if(io){
    var io2 = new IntersectionObserver(function(es){ es.forEach(function(e){ if(!e.isIntersecting) return; io2.unobserve(e.target);
      var el=e.target, end=+el.dataset.n, t0=performance.now();
      (function f(t){ var p=Math.min(1,(t-t0)/1500); el.textContent=fmt(Math.round(end*(1-Math.pow(1-p,3)))); if(p<1) requestAnimationFrame(f); })(t0);
    }); });
    nums.forEach(function(n){ io2.observe(n); });
  }

  /* Barra: sección activa + línea de los pasos */
  var as = [].slice.call(document.querySelectorAll('.links a'));
  var secs = as.map(function(a){ return document.querySelector(a.getAttribute('href')); });
  var steps = document.querySelector('.steps'), line = steps && steps.querySelector('.line > i');
  function onScroll(){
    var y = innerHeight*0.35, cur = -1;
    secs.forEach(function(s,i){ if(s && s.getBoundingClientRect().top <= y) cur = i; });
    as.forEach(function(a,i){ a.classList.toggle('on', i===cur); });
    if(line){ var r = steps.getBoundingClientRect(); var p = Math.max(0, Math.min(1, (innerHeight*0.8 - r.top)/(r.height+innerHeight*0.15))); line.style.setProperty('--p', reduce?1:p.toFixed(3)); }
  }
  addEventListener('scroll', onScroll, {passive:true}); onScroll();
})();
