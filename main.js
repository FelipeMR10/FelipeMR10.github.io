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
    var last = ix===SVC.length-1, li = document.createElement('li');
    li.className = 'reveal'+(last?' idea':'');
    var num = '<span class="ix">'+('0'+(ix+1)).slice(-2)+'</span>';
    var title = '<span><h3>'+s[1]+'</h3><span class="sub">'+s[2]+'</span></span>';
    if(last){
      li.innerHTML = '<a class="row" href="https://wa.me/message/ZS7BVH67JTQZN1" target="_blank" rel="noopener">'+num+title+'<span class="mark">→</span></a>';
    } else {
      var id = 'svc-more-'+ix;
      li.innerHTML = '<button class="row" type="button" aria-expanded="false" aria-controls="'+id+'">'+num+title+'<span class="mark">'+ico('plus')+'</span></button>'+
        '<div class="more" id="'+id+'"><div><ul aria-label="Detalle técnico">'+s[3].map(function(t){return '<li>'+t+'</li>'}).join('')+'</ul></div></div>';
      li.querySelector('.row').onclick = function(){
        var open = li.classList.contains('open');
        svc.querySelectorAll(':scope > li.open').forEach(function(o){ o.classList.remove('open'); o.querySelector('.row').setAttribute('aria-expanded','false'); });
        if(!open){ li.classList.add('open'); this.setAttribute('aria-expanded','true'); }
      };
    }
    svc.appendChild(li);
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
    var io = new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ var t=e.target; t.classList.remove('wait'); io.unobserve(t); setTimeout(function(){ t.style.transitionDelay=''; }, 1400);} }); },{rootMargin:'0px 0px -8% 0px'});
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

  /* Título: cada palabra entra con un pequeño retraso */
  document.querySelectorAll('.words span').forEach(function(w,i){ w.style.animationDelay = (0.08 + i*0.09)+'s'; });

  /* Barra: marca la sección en la que vas */
  var as = [].slice.call(document.querySelectorAll('.links a'));
  var secs = as.map(function(a){ return document.querySelector(a.getAttribute('href')); });
  var onScroll = function(){
    var y = innerHeight*0.35, cur = -1;
    secs.forEach(function(s,i){ if(s && s.getBoundingClientRect().top <= y) cur = i; });
    as.forEach(function(a,i){ a.classList.toggle('on', i===cur); });
  };
  addEventListener('scroll', onScroll, {passive:true}); onScroll();

  /* Aparición escalonada en grupos */
  ['.svc','.steps','.why','.proj'].forEach(function(sel){
    document.querySelectorAll(sel+' > .reveal').forEach(function(el,i){ el.style.transitionDelay = (i*0.08)+'s'; });
  });

  /* Tema */
  document.getElementById('theme').onclick = function(){
    var r = document.documentElement, cur = r.getAttribute('data-theme') || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark':'light');
    var t = cur==='dark' ? 'light' : 'dark';
    r.setAttribute('data-theme', t);
    try { localStorage.setItem('tema', t); } catch(e){}
    var m = document.querySelector('meta[name="theme-color"]'); if(m) m.setAttribute('content', t==='light' ? '#f2ede3' : '#0e0e10');
  };
})();
