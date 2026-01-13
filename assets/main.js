const burgerMenu = document.getElementById('burgerMenu');
const nav = document.querySelector('nav');
const body = document.body;
const logoImg = document.querySelector('header a img');

// S'assurer que l'image est visible au chargement
document.addEventListener('DOMContentLoaded', function() {
    if (logoImg) {
        // S'assurer que l'image est chargée
        if (logoImg.complete) {
            logoImg.style.opacity = '1';
        } else {
            logoImg.addEventListener('load', function() {
                logoImg.style.opacity = '1';
            });
            logoImg.style.opacity = '1';
        }
    }
});

// Fonction pour changer le logo avec effet de fondu
function changeLogo(newSrc) {
    if (logoImg) {
        // Faire disparaître l'image
        logoImg.style.opacity = '0';
        
        // Après la transition, changer l'image et la faire réapparaître
        setTimeout(() => {
            const img = new Image();
            img.onload = function() {
                logoImg.src = newSrc;
                // Petit délai pour s'assurer que le changement de src est pris en compte
                setTimeout(() => {
                    logoImg.style.opacity = '1';
                }, 10);
            };
            img.onerror = function() {
                // En cas d'erreur, réafficher quand même l'image actuelle
                logoImg.style.opacity = '1';
                console.error('Erreur lors du chargement de l\'image:', newSrc);
            };
            img.src = newSrc;
        }, 150); // La moitié de la durée de transition (0.3s)
    }
}

// Gestion du clic sur le menu burger
burgerMenu.addEventListener('click', function() {
    this.classList.toggle('open');
    burgerMenu.classList.toggle('active');
    nav.classList.toggle('active');
    body.classList.toggle('menu-open');
    
    // Changer l'image du logo avec effet de fondu
    if (body.classList.contains('menu-open')) {
        changeLogo('assets/img/logo-ponctue-menu.svg');
    } else {
        changeLogo('assets/img/logo-ponctue.svg');
    }
});
// Fermer le menu en cliquant en dehors
document.addEventListener('click', (e) => {
    if (!nav.contains(e.target) && !burgerMenu.contains(e.target) && nav.classList.contains('active')) {
        burgerMenu.classList.remove('active');
        nav.classList.remove('active');
        body.classList.remove('menu-open');
        burgerMenu.classList.remove('open');
        // Remettre l'image du logo normale avec effet de fondu
        changeLogo('assets/img/logo-ponctue.svg');
    }
});