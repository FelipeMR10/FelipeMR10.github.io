// Modo día / noche
(function () {
  var btn = document.querySelector('.theme-toggle');
  if (!btn) return;
  var root = document.documentElement;
  var meta = document.querySelector('meta[name="theme-color"]');
  function label(t) { btn.setAttribute('aria-label', t === 'light' ? 'Cambiar a modo noche' : 'Cambiar a modo día'); }
  label(root.getAttribute('data-theme'));
  btn.addEventListener('click', function () {
    var t = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    root.classList.add('theme-anim');
    root.setAttribute('data-theme', t);
    if (meta) meta.setAttribute('content', t === 'light' ? '#f6f6f4' : '#0e0e10');
    try { localStorage.setItem('tema', t); } catch (e) {}
    label(t);
    setTimeout(function () { root.classList.remove('theme-anim'); }, 500);
  });
})();

(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(pointer: fine)').matches;
  var hasGsap = typeof window.gsap !== 'undefined';

  document.getElementById('year').textContent = new Date().getFullYear();

  /* ---------- Menú ---------- */
  var nav = document.querySelector('.nav');
  var toggle = document.querySelector('.nav__toggle');
  var menu = document.getElementById('menu');

  function setMenu(open) {
    menu.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    document.documentElement.classList.toggle('menu-open', open);
  }
  toggle.addEventListener('click', function () { setMenu(!menu.classList.contains('is-open')); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && menu.classList.contains('is-open')) setMenu(false); });
  // Bloquea el arrastre de la página detrás del menú abierto en pantallas táctiles
  menu.addEventListener('touchmove', function (e) { e.preventDefault(); }, { passive: false });
  window.matchMedia('(min-width: 1061px)').addEventListener('change', function (e) { if (e.matches) setMenu(false); });
  menu.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });

  // El botón de WhatsApp sube cuando aparece el pie de página
  var footer = document.querySelector('.footer');
  var waFloat = document.querySelector('.wa-float');
  function liftWhatsApp() {
    var overlap = Math.max(0, window.innerHeight - footer.getBoundingClientRect().top);
    waFloat.style.bottom = (22 + overlap) + 'px';
  }

  function onScroll() {
    nav.classList.toggle('is-scrolled', window.scrollY > 30);
    liftWhatsApp();
  }
  window.addEventListener('resize', liftWhatsApp);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Terminal que escribe ---------- */
  var code = [
    ['// tu idea, hecha software\n', 'c'],
    ['const ', 'k'], ['proyecto = {\n', ''],
    ['  cliente: ', ''], ['"Tú"', 's'], [',\n', ''],
    ['  tipo: [', ''], ['"web"', 's'], [', ', ''], ['"app"', 's'], [', ', ''], ['"api"', 's'], ['],\n', ''],
    ['  calidad: ', ''], ['"probada"', 's'], [',\n', ''],
    ['  precio: ', ''], ['"a tu alcance"', 's'], [',\n', ''],
    ['};\n\n', ''],
    ['await ', 'k'], ['lanzar(proyecto);\n', ''],
    ['// ✓ listo para tus clientes', 'c']
  ];
  var typed = document.getElementById('typed');

  function esc(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;'); }
  function render(count) {
    var html = '', left = count;
    for (var i = 0; i < code.length && left > 0; i++) {
      var part = code[i][0].slice(0, left);
      left -= part.length;
      html += code[i][1] ? '<span class="' + code[i][1] + '">' + esc(part) + '</span>' : esc(part);
    }
    typed.innerHTML = html;
  }
  var total = code.reduce(function (n, p) { return n + p[0].length; }, 0);

  function typeCode(delay) {
    if (reduce) { render(total); return; }
    var n = 0;
    setTimeout(function step() {
      n++;
      render(n);
      if (n < total) setTimeout(step, /[\n,]/.test(typed.textContent.slice(-1)) ? 120 : 26 + Math.random() * 40);
    }, delay);
  }

  /* ---------- Filtros de certificaciones ---------- */
  var filters = document.querySelectorAll('.filter');
  var certs = document.querySelectorAll('.cert');
  filters.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var cat = btn.dataset.filter;
      filters.forEach(function (b) {
        var on = b === btn;
        b.classList.toggle('is-active', on);
        b.setAttribute('aria-pressed', String(on));
      });
      var shown = [];
      certs.forEach(function (c) {
        var match = cat === 'all' || c.dataset.cat === cat;
        c.hidden = !match;
        if (match) shown.push(c);
      });
      if (hasGsap && !reduce) {
        gsap.fromTo(shown, { y: 18, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: .5, stagger: .04, ease: 'power3.out', overwrite: true });
      }
      if (window.ScrollTrigger) ScrollTrigger.refresh();
    });
  });

  if (!hasGsap || reduce) {
    typeCode(0);
    return;
  }

  /* ---------- Animaciones con GSAP ---------- */
  gsap.registerPlugin(ScrollTrigger);
  gsap.defaults({ ease: 'power4.out', duration: 1.1 });

  // Logo: las llaves se dibujan
  document.querySelectorAll('.brand__braces path').forEach(function (p) {
    var len = p.getTotalLength();
    gsap.fromTo(p, { strokeDasharray: len, strokeDashoffset: len }, { strokeDashoffset: 0, duration: 1.6, ease: 'power2.inOut', delay: .1 });
  });

  // Entrada del hero
  var intro = gsap.timeline({ delay: .15 });
  intro
    .from('.brand__text', { x: -20, autoAlpha: 0, duration: .9 }, .5)
    .from('.nav__menu a, .nav__toggle', { y: -16, autoAlpha: 0, stagger: .07, duration: .8 }, .6)
    .from('.hero__eyebrow', { y: 20, autoAlpha: 0, duration: .8 }, .3)
    .from('.hero__title .line__in', { yPercent: 110, rotate: 3, stagger: .12, duration: 1.2 }, .4)
    .from('.hero__lead', { y: 30, autoAlpha: 0 }, 1)
    .from('.hero__actions .btn', { y: 30, autoAlpha: 0, stagger: .1 }, 1.1)
    .from('.terminal', { y: 80, rotateX: 18, autoAlpha: 0, duration: 1.4, transformPerspective: 900, onComplete: function () { typeCode(100); } }, .8)
    .from('.scroll-hint', { autoAlpha: 0 }, 1.6);

  // Parallax suave del hero al bajar
  // (solo en pantallas grandes: en celular el contenido va en una columna)
  gsap.matchMedia().add('(min-width: 981px)', function () {
    gsap.to('.terminal', { yPercent: -18, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    gsap.to('.hero__inner', { yPercent: -10, autoAlpha: .15, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    gsap.to('.scroll-hint__mouse, .scroll-hint span', { opacity: 0, y: 10, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: '+=180', scrub: true } });
  });

  // La cinta se acelera o frena según el scroll
  var marquee = document.querySelector('.marquee__track');
  ScrollTrigger.create({
    onUpdate: function (self) {
      var v = Math.min(Math.abs(self.getVelocity()) / 1200, 3);
      gsap.to(marquee, { skewX: self.direction * -v * 2, duration: .4, overwrite: true });
    }
  });

  // Títulos de sección palabra por palabra
  document.querySelectorAll('.reveal-words').forEach(function (el) {
    el.innerHTML = el.textContent.trim().split(/\s+/).map(function (w) {
      return '<span class="w"><span>' + w + '</span></span>';
    }).join(' ');
    gsap.from(el.querySelectorAll('.w > span'), {
      yPercent: 110, stagger: .06, duration: 1,
      scrollTrigger: { trigger: el, start: 'top 85%' }
    });
  });

  gsap.utils.toArray('.section__head .eyebrow, .about .eyebrow, .contact .eyebrow').forEach(function (el) {
    gsap.from(el, { y: 16, autoAlpha: 0, duration: .9, scrollTrigger: { trigger: el, start: 'top 90%' } });
  });

  // Tarjetas de servicios en cascada
  gsap.from('.card', {
    y: 70, autoAlpha: 0, stagger: { each: .09, grid: 'auto', from: 'start' }, duration: 1,
    scrollTrigger: { trigger: '.services', start: 'top 80%' }
  });
  gsap.from('.card__icon', {
    scale: 0, rotate: -90, stagger: .09, duration: .9, ease: 'back.out(2)',
    scrollTrigger: { trigger: '.services', start: 'top 75%' }
  });
  document.querySelectorAll('.card').forEach(function (card) {
    card.addEventListener('pointermove', function (e) {
      var r = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      card.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  });

  // Línea del proceso que se dibuja con el scroll
  var mm = gsap.matchMedia();
  mm.add('(min-width: 981px)', function () {
    var line = document.querySelector('.steps__line');
    var steps = document.querySelector('.steps');
    line.style.top = (steps.offsetTop + 8) + 'px';
    gsap.to('.steps__line span', {
      scaleX: 1, ease: 'none',
      scrollTrigger: { trigger: '.steps', start: 'top 75%', end: 'bottom 55%', scrub: .6 }
    });
  });
  gsap.utils.toArray('.step').forEach(function (step, i) {
    gsap.from(step, {
      y: 50, autoAlpha: 0, duration: 1, delay: i * .08,
      scrollTrigger: {
        trigger: step, start: 'top 80%',
        onEnter: function () { step.classList.add('is-on'); },
        onLeaveBack: function () { step.classList.remove('is-on'); }
      }
    });
  });

  // Sobre mí
  gsap.from('.about__text p:not(.eyebrow)', { y: 30, autoAlpha: 0, stagger: .15, scrollTrigger: { trigger: '.about', start: 'top 70%' } });
  gsap.from('.values li', { y: 40, autoAlpha: 0, stagger: .12, scrollTrigger: { trigger: '.values', start: 'top 80%' } });

  // Skills: contadores, chips y certificados
  document.querySelectorAll('.stat__num').forEach(function (el) {
    var to = +el.dataset.count, from = +(el.dataset.from || 0), suffix = el.dataset.suffix || '';
    var obj = { v: from };
    el.textContent = from + suffix;
    gsap.to(obj, {
      v: to, duration: 2, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 85%' },
      onUpdate: function () { el.textContent = Math.round(obj.v) + suffix; }
    });
  });
  gsap.from('.stat', { y: 40, autoAlpha: 0, stagger: .12, scrollTrigger: { trigger: '.stats', start: 'top 85%' } });
  gsap.utils.toArray('.skillgroup').forEach(function (g) {
    gsap.from(g.querySelector('h3'), { y: 30, autoAlpha: 0, scrollTrigger: { trigger: g, start: 'top 85%' } });
    gsap.from(g.querySelectorAll('.chips li'), { y: 20, scale: .8, autoAlpha: 0, stagger: .05, duration: .7, ease: 'back.out(2)', scrollTrigger: { trigger: g, start: 'top 80%' } });
  });
  gsap.from('.certs__title', { y: 30, autoAlpha: 0, scrollTrigger: { trigger: '.certs__title', start: 'top 88%' } });
  gsap.utils.toArray('.cert').forEach(function (c) {
    gsap.from(c, { y: 24, autoAlpha: 0, duration: .8, scrollTrigger: { trigger: c, start: 'top 92%' } });
  });

  // Proyectos
  gsap.from('.project', { y: 60, autoAlpha: 0, duration: 1.1, scrollTrigger: { trigger: '.project', start: 'top 80%' } });
  gsap.from('.project__body > *', { y: 24, autoAlpha: 0, stagger: .08, scrollTrigger: { trigger: '.project', start: 'top 75%' } });
  var street = document.querySelector('.project__street');
  if (street) {
    var len = street.getTotalLength();
    gsap.fromTo(street, { strokeDasharray: len, strokeDashoffset: len }, { strokeDashoffset: 0, duration: 1.8, ease: 'power2.inOut', scrollTrigger: { trigger: '.project__visual', start: 'top 80%' } });
  }
  gsap.to('.project__route', { strokeDashoffset: -180, duration: 6, ease: 'none', repeat: -1 });
  gsap.from('.project__pin', { scale: 0, transformOrigin: 'center', stagger: .3, duration: .8, ease: 'back.out(2.5)', scrollTrigger: { trigger: '.project__visual', start: 'top 75%' } });
  document.querySelectorAll('.project__stats b').forEach(function (el) {
    var to = +el.textContent, obj = { v: 0 };
    gsap.to(obj, { v: to, duration: 2, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 90%' }, onUpdate: function () { el.textContent = Math.round(obj.v); } });
  });

  // Contacto
  gsap.from('.contact__title .line__in', { yPercent: 110, rotate: 3, stagger: .12, duration: 1.2, scrollTrigger: { trigger: '.contact', start: 'top 70%' } });
  gsap.from('.qr-card', { y: 50, rotate: -4, scale: .9, autoAlpha: 0, duration: 1.2, ease: 'back.out(1.6)', scrollTrigger: { trigger: '.contact', start: 'top 60%' } });
  gsap.from('.contact__lead, .contact__item', { y: 30, autoAlpha: 0, stagger: .12, scrollTrigger: { trigger: '.contact', start: 'top 60%' } });

  // Botón flotante de WhatsApp
  gsap.from('.wa-float', { scale: 0, rotate: -180, duration: 1, ease: 'back.out(1.8)', delay: 2 });

  if (!finePointer) return;

  // Resplandor que sigue el cursor
  var glow = document.querySelector('.cursor-glow');
  var gx = gsap.quickTo(glow, 'x', { duration: .8, ease: 'power3' });
  var gy = gsap.quickTo(glow, 'y', { duration: .8, ease: 'power3' });
  window.addEventListener('pointermove', function (e) {
    gx(e.clientX); gy(e.clientY);
    if (!glow.dataset.on) { glow.dataset.on = '1'; gsap.to(glow, { opacity: 1, duration: 1 }); }
  });

  // Botones magnéticos
  document.querySelectorAll('.magnetic').forEach(function (el) {
    var mx = gsap.quickTo(el, 'x', { duration: .5, ease: 'power3' });
    var my = gsap.quickTo(el, 'y', { duration: .5, ease: 'power3' });
    el.addEventListener('pointermove', function (e) {
      var r = el.getBoundingClientRect();
      mx((e.clientX - r.left - r.width / 2) * .25);
      my((e.clientY - r.top - r.height / 2) * .35);
    });
    el.addEventListener('pointerleave', function () { mx(0); my(0); });
  });

  // Inclinación 3D de la terminal
  var term = document.querySelector('.terminal');
  term.addEventListener('pointermove', function (e) {
    var r = term.getBoundingClientRect();
    gsap.to(term, {
      rotateY: ((e.clientX - r.left) / r.width - .5) * 10,
      rotateX: -((e.clientY - r.top) / r.height - .5) * 10,
      transformPerspective: 900, duration: .6, ease: 'power2.out'
    });
  });
  term.addEventListener('pointerleave', function () { gsap.to(term, { rotateX: 0, rotateY: 0, duration: .8 }); });
})();
