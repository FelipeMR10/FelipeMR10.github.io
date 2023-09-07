var menuBar = document.querySelector('.menu_bar');
var menu = document.querySelector('.menu');

menuBar.addEventListener('click', function () {
    menu.classList.toggle('active');
    if (menu.classList.contains('active')) {
        menu.style.transform = 'translateX(0%)';
    } else {
        menu.style.transform = 'translateX(-100%)';
    }
});