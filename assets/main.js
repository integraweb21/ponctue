const burgerMenu = document.getElementById('burgerMenu');
const nav = document.querySelector('nav');
const body = document.body;

burgerMenu.addEventListener('click', function() {
    this.classList.toggle('open');
});

burgerMenu.addEventListener('click', () => {
    burgerMenu.classList.toggle('active');
    nav.classList.toggle('active');
    body.classList.toggle('menu-open');
});
// Fermer le menu en cliquant en dehors
document.addEventListener('click', (e) => {
    if (!nav.contains(e.target) && !burgerMenu.contains(e.target) && nav.classList.contains('active')) {
        burgerMenu.classList.remove('active');
        nav.classList.remove('active');
        body.classList.remove('menu-open');
    }
});