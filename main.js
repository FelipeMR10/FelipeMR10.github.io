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
    document.body.style.overflow = open ? 'hidden' : '';
  }
  toggle.addEventListener('click', function () { setMenu(!menu.classList.contains('is-open')); });
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

  // Contacto
  gsap.from('.contact__title .line__in', { yPercent: 110, rotate: 3, stagger: .12, duration: 1.2, scrollTrigger: { trigger: '.contact', start: 'top 70%' } });
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
