const burgerMenu = document.getElementById('burgerMenu');
const nav = document.querySelector('nav');
const body = document.body;
const logoImg = document.querySelector('header a img');

// Précharger les images de logo pour éviter les délais
const logoNormal = new Image();
logoNormal.src = 'assets/img/logo-ponctue.svg';
const logoMenu = new Image();
logoMenu.src = 'assets/img/logo-ponctue-menu.svg';

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

// Fonction pour changer le logo de manière instantanée (sans fade)
function changeLogo(newSrc) {
    if (logoImg) {
        // Changer directement l'image sans effet de fondu pour éviter le clignotement
        logoImg.src = newSrc;
        // S'assurer que l'opacité reste à 1
        logoImg.style.opacity = '1';
    }
}

// Gestion du clic sur le menu burger
if (burgerMenu && nav) {
    const header = document.querySelector('header');
    
    burgerMenu.addEventListener('click', function() {
        const isOpening = !body.classList.contains('menu-open');
        
        if (isOpening) {
            // 1. Changer le logo en premier
            changeLogo('assets/img/logo-ponctue-menu.svg');
            
            // 2. Calculer et appliquer le padding-top AVANT que le header ne passe en fixed
            if (header) {
                const headerHeight = header.offsetHeight;
                body.style.paddingTop = headerHeight + 'px';
            }
            
            // 3. Attendre le prochain frame pour appliquer les classes
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    this.classList.toggle('open');
                    burgerMenu.classList.toggle('active');
                    nav.classList.toggle('active');
                    body.classList.toggle('menu-open');
                });
            });
        } else {
            // Fermeture du menu : retirer les classes d'abord
            this.classList.toggle('open');
            burgerMenu.classList.toggle('active');
            nav.classList.toggle('active');
            body.classList.toggle('menu-open');
            
            // Puis retirer le padding-top et changer le logo
            requestAnimationFrame(() => {
                body.style.paddingTop = '0';
                changeLogo('assets/img/logo-ponctue.svg');
            });
        }
    });
    
    // Fermer le menu en cliquant en dehors
    document.addEventListener('click', (e) => {
        if (!nav.contains(e.target) && !burgerMenu.contains(e.target) && nav.classList.contains('active')) {
            burgerMenu.classList.remove('active');
            nav.classList.remove('active');
            body.classList.remove('menu-open');
            burgerMenu.classList.remove('open');
            // Remettre l'image du logo normale
            changeLogo('assets/img/logo-ponctue.svg');
            // Retirer le padding-top quand le menu se ferme
            body.style.paddingTop = '0';
        }
    });
}

// Sélection des éléments une seule fois pour optimiser les performances
const menuNav = document.querySelector('nav.menu');
const header = document.querySelector('header');

// Fonction pour mettre à jour la position de l'image en fonction de la souris
function updateImagePosition(e) {
    if (!body.classList.contains('menu-open') || !menuNav) return;
    
    // Obtenir les dimensions de la fenêtre
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    
    // Calculer la position de la souris relative au centre de la fenêtre
    const centerX = windowWidth / 2;
    const centerY = windowHeight / 2;
    
    // Position de la souris dans la fenêtre
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    
    // Calculer le décalage depuis le centre (limité pour un effet subtil)
    const offsetX = (mouseX - centerX) * 0.1; // Facteur de sensibilité
    const offsetY = (mouseY - centerY) * 0.1;
    
    // Mettre à jour les variables CSS sur le menu (qui contient l'image)
    menuNav.style.setProperty('--mouse-x', offsetX);
    menuNav.style.setProperty('--mouse-y', offsetY);
}

// Fonction pour réinitialiser la position de l'image
function resetImagePosition() {
    if (menuNav) {
        menuNav.style.setProperty('--mouse-x', 0);
        menuNav.style.setProperty('--mouse-y', 0);
    }
}

// Animation de l'image de fond du menu en fonction de la souris
if (menuNav) {
    menuNav.addEventListener('mousemove', updateImagePosition);
}

// Animation de l'image de fond en fonction de la souris sur le header quand le menu est ouvert
if (header) {
    header.addEventListener('mousemove', updateImagePosition);
}

// Réinitialiser la position quand la souris quitte à la fois le menu et le header
document.addEventListener('mousemove', (e) => {
    if (body.classList.contains('menu-open')) {
        // Vérifier si la souris est sur le menu ou le header
        const isOnMenu = menuNav && menuNav.contains(e.target);
        const isOnHeader = header && header.contains(e.target);
        
        // Si la souris n'est ni sur le menu ni sur le header, réinitialiser
        if (!isOnMenu && !isOnHeader) {
            resetImagePosition();
        }
    }
});

// Animation GSAP ligne par ligne pour les éléments avec la classe animate-text
(function() {
    // Vérifier si GSAP est disponible
    if (typeof gsap === 'undefined') {
        console.warn('GSAP n\'est pas chargé. L\'animation texte ne fonctionnera pas.');
        return;
    }

    // Enregistrer le plugin ScrollTrigger si disponible
    if (typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
    }

    // Fonction pour diviser un élément en lignes
    function splitIntoLines(element) {
        // Si c'est un <ul>, traiter chaque <li> comme une ligne
        if (element.tagName === 'UL') {
            const lis = element.querySelectorAll('li');
            const lines = [];
            lis.forEach(li => {
                lines.push(li.outerHTML);
            });
            return lines.length > 0 ? lines : [element.innerHTML.trim()];
        }
        
        const html = element.innerHTML;
        const lines = [];
        
        // Diviser par les <br> et <br/>
        const parts = html.split(/(<br\s*\/?>)/i);
        let currentLine = '';
        
        parts.forEach(part => {
            if (part.match(/<br\s*\/?>/i)) {
                // Si c'est un <br>, on termine la ligne actuelle
                if (currentLine.trim()) {
                    lines.push(currentLine.trim());
                }
                currentLine = '';
            } else {
                currentLine += part;
            }
        });
        
        // Ajouter la dernière ligne si elle existe
        if (currentLine.trim()) {
            lines.push(currentLine.trim());
        }
        
        // Si aucune ligne trouvée (pas de <br>), créer une seule ligne
        if (lines.length === 0) {
            lines.push(html.trim());
        }
        
        return lines;
    }
    
    // Fonction pour envelopper chaque ligne dans un span
    function wrapLines(element) {
        const lines = splitIntoLines(element);
        
        if (lines.length === 0) return;
        
        // Si c'est un <ul>, préserver la structure de liste
        if (element.tagName === 'UL') {
            element.innerHTML = '';
            lines.forEach((line, index) => {
                const wrapper = document.createElement('span');
                wrapper.className = 'line';
                wrapper.style.display = 'block';
                wrapper.style.overflow = 'hidden';
                wrapper.innerHTML = line || '&nbsp;';
                element.appendChild(wrapper);
            });
        } else {
            element.innerHTML = '';
            lines.forEach((line, index) => {
                const wrapper = document.createElement('span');
                wrapper.className = 'line';
                wrapper.style.display = 'block';
                wrapper.style.overflow = 'hidden';
                wrapper.innerHTML = line || '&nbsp;';
                element.appendChild(wrapper);
            });
        }
    }

    // Initialiser l'animation au chargement du DOM
    function initTextAnimation() {
        const textElements = document.querySelectorAll('.animate-text');
        
        if (textElements.length === 0) return;
        
        textElements.forEach(element => {
            // Ignorer les éléments déjà traités
            if (element.querySelector('.line')) return;
            
            // Envelopper automatiquement les lignes
            wrapLines(element);
            
            const lines = element.querySelectorAll('.line');
            
            if (lines.length === 0) return;
            
            // Initialiser l'état de chaque ligne (invisible et décalée vers le bas)
            gsap.set(lines, {
                opacity: 0,
                y: 50
            });
            
            // Configuration de l'animation
            const animationConfig = {
                opacity: 1,
                y: 0,
                duration: 0.8,
                stagger: 0.15,
                ease: 'power3.out'
            };
            
            // Créer l'animation avec ScrollTrigger si disponible, sinon animation simple
            if (typeof ScrollTrigger !== 'undefined') {
                animationConfig.scrollTrigger = {
                    trigger: element,
                    start: 'top 80%',
                    end: 'bottom 20%',
                    toggleActions: 'play none none none'
                };
            }
            
            gsap.to(lines, animationConfig);
        });
    }

    // Attendre que le DOM soit chargé
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTextAnimation);
    } else {
        initTextAnimation();
    }
})();