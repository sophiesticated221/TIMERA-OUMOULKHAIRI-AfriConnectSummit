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
        
        // Calcule les jours, heures, minutes, secondes
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
// Gère l'affichage des onglets du programme (Jour 1, 2, 3)
(function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    if (tabButtons.length === 0) return;
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Désactiver tous les boutons
            tabButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-selected', 'false');
            });
            
            // Active le bouton cliqué
            this.classList.add('active');
            this.setAttribute('aria-selected', 'true');
            
            // Cache tous les panneaux
            tabPanes.forEach(pane => {
                pane.classList.remove('active');
            });
            
            // Affiche le panneau correspondant
            const dayId = this.getAttribute('data-day');
            const targetPane = document.getElementById(dayId);
            if (targetPane) {
                targetPane.classList.add('active');
            }
        });
    });
})();
// Filtre les cartes d'intervenants par thématique
 
(function initFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const speakerCards = document.querySelectorAll('.speaker-full-card');
    
    if (filterButtons.length === 0 || speakerCards.length === 0) return;
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Désactiver tous les boutons
            filterButtons.forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Activer le bouton cliqué
            this.classList.add('active');
            
            const filterValue = this.getAttribute('data-filter');
            
            // Filtrer les cartes
            speakerCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = 'block';
                    // Ajouter une animation d'apparition
                    card.style.animation = 'fadeIn 0.5s ease forwards';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
})();

//  Valide le formulaire d'inscription avec retour visuel
(function initFormValidation() {
    const form = document.getElementById('registrationForm');
    const successMessage = document.getElementById('formSuccess');
    
    if (!form) return;
    
    // Écoute la soumission du formulaire
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Valide tous les champs
        const isValid = validateAllFields();
        
        if (isValid) {
            // Affiche le message de succès
            successMessage.style.display = 'block';
            
            // Réinitialise le formulaire après 3 secondes
            setTimeout(() => {
                form.reset();
                successMessage.style.display = 'none';
                // Enleve les classes de validation
                document.querySelectorAll('.form-group').forEach(group => {
                    group.classList.remove('success', 'error');
                    const errorMsg = group.querySelector('.error-message');
                    if (errorMsg) errorMsg.textContent = '';
                });
            }, 3000);
        }
    });
    
    // Valide tous les champs du formulaire
    function validateAllFields() {
        let isValid = true;
        
        // Valider le nom
        const fullname = document.getElementById('fullname');
        if (!validateField(fullname, value => value.trim().length >= 2, 'Le nom doit contenir au moins 2 caractères')) {
            isValid = false;
        }
        
        // Valider l'email
        const email = document.getElementById('email');
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!validateField(email, value => emailRegex.test(value.trim()), 'Veuillez entrer un email valide')) {
            isValid = false;
        }
        
        // Valider le téléphone (minimum 8 chiffres)
        const phone = document.getElementById('phone');
        const phoneRegex = /^[0-9]{8,}$/;
        if (!validateField(phone, value => phoneRegex.test(value.trim().replace(/[^0-9]/g, '')), 'Le téléphone doit contenir au moins 8 chiffres')) {
            isValid = false;
        }
        
        // Valider le type de participation
        const participation = document.getElementById('participation');
        if (!validateField(participation, value => value !== '', 'Veuillez sélectionner un type de participation')) {
            isValid = false;
        }
        
        // Valider le pays
        const country = document.getElementById('country');
        if (!validateField(country, value => value !== '', 'Veuillez sélectionner un pays')) {
            isValid = false;
        }
        
        // Valider le message
        const message = document.getElementById('message');
        if (!validateField(message, value => value.trim().length >= 20, 'Le message doit contenir au moins 20 caractères')) {
            isValid = false;
        }
        
        return isValid;
    }
    //  Valide un champ individuel
    function validateField(field, validator, errorMessage) {
        const value = field.value;
        const formGroup = field.closest('.form-group');
        const errorMsg = formGroup.querySelector('.error-message');
        
        if (validator(value)) {
            formGroup.classList.remove('error');
            formGroup.classList.add('success');
            if (errorMsg) errorMsg.textContent = '';
            return true;
        } else {
            formGroup.classList.remove('success');
            formGroup.classList.add('error');
            if (errorMsg) errorMsg.textContent = errorMessage;
            return false;
        }
    }
    
    // Validation en temps réel au changement de champ
    document.querySelectorAll('#registrationForm input, #registrationForm select, #registrationForm textarea').forEach(field => {
        field.addEventListener('blur', function() {
            validateFieldOnBlur(this);
        });
        
        field.addEventListener('input', function() {
            // Si le champ a déjà été validé, le revalider
            if (this.closest('.form-group').classList.contains('success') || 
                this.closest('.form-group').classList.contains('error')) {
                validateFieldOnBlur(this);
            }
        });
    });
    
    function validateFieldOnBlur(field) {
        const id = field.id;
        
        switch(id) {
            case 'fullname':
                validateField(field, value => value.trim().length >= 2, 'Le nom doit contenir au moins 2 caractères');
                break;
            case 'email':
                const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                validateField(field, value => emailRegex.test(value.trim()), 'Veuillez entrer un email valide');
                break;
            case 'phone':
                const phoneRegex = /^[0-9]{8,}$/;
                validateField(field, value => phoneRegex.test(value.trim().replace(/[^0-9]/g, '')), 'Le téléphone doit contenir au moins 8 chiffres');
                break;
            case 'participation':
                validateField(field, value => value !== '', 'Veuillez sélectionner un type de participation');
                break;
            case 'country':
                validateField(field, value => value !== '', 'Veuillez sélectionner un pays');
                break;
            case 'message':
                validateField(field, value => value.trim().length >= 20, 'Le message doit contenir au moins 20 caractères');
                break;
        }
    }
})();