// // Obtén elementos del DOM
// var menuBar = document.querySelector('.menu_bar');
// var menu = document.querySelector('.menu');

// // Agrega un evento de clic al ícono de hamburguesa
// menuBar.addEventListener('click', function () {
// 	// Alternar la visibilidad del menú
// 	if (menu.style.display === 'block') {
// 		menu.style.display = 'none';
// 	} else {
// 		menu.style.display = 'block';
// 	}
// });


var menuBar = document.querySelector('.menu_bar');
var menu = document.querySelector('.menu');

// Agrega un evento de clic al ícono de hamburguesa
menuBar.addEventListener('click', function () {
	// Alterna la clase 'active' en el menú para mostrarlo u ocultarlo
	menu.classList.toggle('active');
});




// var contador = 1;

// function main () {
//   console.log('main');
// 	$('.menu_bar').click(function(){
//       	console.log('menu bar click', contador);
// 		if (contador == 1) {
// 			$('nav').animate({
// 				left: '0'
// 			});
// 			contador = 0;
// 		} else {
// 			contador = 1;
// 			$('nav').animate({
// 				left: '-100%'
// 			});
// 		}
// 	});

// 	// Mostramos y ocultamos submenus
// 	$('.submenu').click(function(){
//       console.log('submenu click');
// 		$(this).children('.children').slideToggle();
// 	});
// }

// var script = document.createElement("script");

// script.onload = function() {
//   main();
// };

// script.src = "https://code.jquery.com/jquery-latest.js";
// script.async = true;
// script.defer = true;
// script.crossorigin = "";

// document.body.appendChild(script);