(function initTheme() {
    const themeToggle = document.querySelector('.theme-toggle');
    const htmlElement = document.documentElement;
    //  Récupérer le thème sauvegardé
    const savedTheme = localStorage.getItem('theme');
    // Appliquer le thème sauvegardé ou le thème par défaut
    if (savedTheme) {
        htmlElement.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme);
    }
    
    // Écouteur d'evenement (clique)
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const currentTheme = htmlElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            // Appliquer le nouveau thème
            htmlElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
        });
    }
    // Met à jour l'icone du bouton de bascule
    function updateThemeIcon(theme) {
        if (themeToggle) {
            const icon = themeToggle.querySelector('i');
            if (theme === 'dark') {
                icon.className = 'bi bi-sun-fill';
            } else {
                icon.className = 'bi bi-moon-fill';
            }
        }
    }
})();
//  Change l'apparence de la navbar après défilement
(function initNavbar() {
    const navbar = document.querySelector('.navbar');
    
    if (!navbar) return;
    
    // Vérifier la position au chargement
    checkScroll();
    
    // Écouter le scroll
    window.addEventListener('scroll', checkScroll);
    
    function checkScroll() {
        if (window.scrollY > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
})();
//  Gère l'ouverture et la fermeture du menu mobile
(function initHamburger() {
    const toggler = document.querySelector('.navbar-toggler');
    const menu = document.querySelector('.navbar-menu');
    
    if (!toggler || !menu) return;
    
    toggler.addEventListener('click', function() {
        const isOpen = menu.classList.toggle('open');
        this.setAttribute('aria-expanded', isOpen);
        
        // Changer l'icône
        const icon = this.querySelector('i');
        if (isOpen) {
            icon.className = 'bi bi-x-lg';
        } else {
            icon.className = 'bi bi-list';
        }
    });
    
    // Fermer le menu si on clique en dehors
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.navbar')) {
            menu.classList.remove('open');
            toggler.setAttribute('aria-expanded', 'false');
            const icon = toggler.querySelector('i');
            if (icon) icon.className = 'bi bi-list';
        }
    });
})();

(function initScrollAnimations() {
    // Sélectionner les éléments à animer
    const animatedElements = document.querySelectorAll(
        '.why-card, .speaker-card, .stat-card, .thematic-card, .sponsor'
    );
    
    if (animatedElements.length === 0) return;
    
    // Crée un observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Ajoute un délai pour un effet de cascade
                setTimeout(() => {
                    entry.target.classList.add('animated');
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
                
                // Ne plus observer l'élément une fois animé
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Configure les styles initiaux et observe chaque élément
    animatedElements.forEach((el) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
  
})();


// animation des compteurs statistiques au scroll et s'incrémente jusqu'à la valeur cible
(function initCounters() {
    const statNumbers = document.querySelectorAll('.stat-number');
    if (statNumbers.length === 0) return;
    let countersAnimated = false;

    // Crée un observer pour les compteurs
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !countersAnimated) {
                countersAnimated = true;
                animateCounters();
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    
    // Observe le premier compteur
    if (statNumbers.length > 0) {
        counterObserver.observe(statNumbers[0].closest('.stats') || statNumbers[0]);
    }
    // Anime tous les compteurs
    function animateCounters() {
        statNumbers.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            if (isNaN(target)) return;
            
            const duration = 2000;
            const startTime = Date.now();
            
            function updateCounter() {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Fonction d'accélération (easeOut)
                const eased = 1 - Math.pow(1 - progress, 3);
                const current = Math.floor(eased * target);
                
                counter.textContent = current;
                
                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            }
            
            updateCounter();
        });
    }
})();

// Compte à rebours en temps réel jusqu'à la date de la conférence
// Met à jour l'affichage toutes les secondes
(function initCountdown() {
    const daysElement = document.getElementById('days');
    const hoursElement = document.getElementById('hours');
    const minutesElement = document.getElementById('minutes');
    const secondsElement = document.getElementById('seconds');
    
    if (!daysElement) return;
    
    // Date de la conférence (26 Novembre 2026 à 09:00)
    const targetDate = new Date('2026-11-26T09:00:00').getTime();
    //  Met à jour le compte à rebours
    function updateCountdown() {
        const now = Date.now();
        const diff = targetDate - now;
        
        if (diff <= 0) {
            // La conférence a commencé
            daysElement.textContent = '00';
            hoursElement.textContent = '00';
            minutesElement.textContent = '00';
            secondsElement.textContent = '00';
            return;
        }
        
        // Calculer les jours, heures, minutes, secondes
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        // Afficher avec deux chiffres
        daysElement.textContent = String(days).padStart(2, '0');
        hoursElement.textContent = String(hours).padStart(2, '0');
        minutesElement.textContent = String(minutes).padStart(2, '0');
        secondsElement.textContent = String(seconds).padStart(2, '0');
    }
    
    // Mettre à jour immédiatement puis toutes les secondes
    updateCountdown();
    setInterval(updateCountdown, 1000);
})();