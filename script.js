// ===== DOCUMENT READY =====
document.addEventListener('DOMContentLoaded', function() {
    // Initialiser toutes les fonctionnalités
    initNavigation();
    initFormValidation();
    initAnimations();
    initCurrentYear();
    initGallery();
    initSmoothScroll();
    initHeaderScroll();
});

// ===== NAVIGATION MENU =====
function initNavigation() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-link, .btn-contact');
    
    // Toggle menu mobile
    menuToggle.addEventListener('click', function() {
        this.classList.toggle('active');
        navLinks.classList.toggle('active');
        
        // Mettre à jour l'état ARIA
        const isExpanded = this.getAttribute('aria-expanded') === 'true';
        this.setAttribute('aria-expanded', !isExpanded);
        
        // Empêcher le défilement du body quand le menu est ouvert
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });
    
    // Fermer le menu quand on clique sur un lien
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            menuToggle.classList.remove('active');
            navLinks.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        });
    });
    
    // Fermer le menu en cliquant à l'extérieur
    document.addEventListener('click', function(event) {
        if (!menuToggle.contains(event.target) && !navLinks.contains(event.target)) {
            menuToggle.classList.remove('active');
            navLinks.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }
    });
}

// ===== FORM VALIDATION =====
function initFormValidation() {
    const contactForm = document.getElementById('contact-form');
    
    if (!contactForm) return;
    
    // Messages d'erreur
    const errorMessages = {
        required: 'Ce champ est requis',
        email: 'Veuillez entrer un email valide',
        minLength: 'Ce champ doit contenir au moins {min} caractères'
    };
    
    // Validation en temps réel
    contactForm.querySelectorAll('input, select, textarea').forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                validateField(this);
            }
        });
    });
    
    // Soumission du formulaire
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        let isValid = true;
        const formData = {};
        
        // Valider tous les champs
        this.querySelectorAll('input, select, textarea').forEach(input => {
            if (!validateField(input)) {
                isValid = false;
            }
            
            // Collecter les données du formulaire
            if (input.type !== 'submit') {
                formData[input.id || input.name] = input.value;
            }
        });
        
        if (isValid) {
            // Simulation d'envoi du formulaire
            showFormSuccess();
            
            // Ici, vous enverriez normalement les données au serveur
            console.log('Formulaire soumis:', formData);
            
            // Réinitialiser le formulaire
            this.reset();
        } else {
            showFormError('Veuillez corriger les erreurs dans le formulaire');
        }
    });
    
    // Fonction de validation d'un champ
    function validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';
        
        // Vérifier si le champ est requis
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = errorMessages.required;
        }
        
        // Validation spécifique pour l'email
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = errorMessages.email;
            }
        }
        
        // Validation de la longueur minimale
        if (field.hasAttribute('minlength') && value.length < field.minLength) {
            isValid = false;
            errorMessage = errorMessages.minLength.replace('{min}', field.minLength);
        }
        
        // Afficher ou masquer l'erreur
        const errorElement = field.parentElement.querySelector('.error-message');
        
        if (!isValid) {
            field.classList.add('error');
            
            if (!errorElement) {
                const errorDiv = document.createElement('div');
                errorDiv.className = 'error-message';
                errorDiv.style.color = '#dc3545';
                errorDiv.style.fontSize = '0.85rem';
                errorDiv.style.marginTop = '0.3rem';
                errorDiv.textContent = errorMessage;
                field.parentElement.appendChild(errorDiv);
            } else {
                errorElement.textContent = errorMessage;
            }
        } else {
            field.classList.remove('error');
            if (errorElement) {
                errorElement.remove();
            }
        }
        
        return isValid;
    }
    
    // Fonction pour afficher le message de succès
    function showFormSuccess() {
        // Supprimer les messages d'erreur existants
        contactForm.querySelectorAll('.error-message').forEach(el => el.remove());
        
        // Créer le message de succès
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.style.backgroundColor = '#d4edda';
        successMessage.style.color = '#155724';
        successMessage.style.padding = '1rem';
        successMessage.style.borderRadius = 'var(--border-radius)';
        successMessage.style.marginTop = '1rem';
        successMessage.style.textAlign = 'center';
        successMessage.innerHTML = '<i class="fas fa-check-circle"></i> Message envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.';
        
        // Insérer avant le bouton d'envoi
        const submitButton = contactForm.querySelector('button[type="submit"]');
        contactForm.insertBefore(successMessage, submitButton);
        
        // Supprimer le message après 5 secondes
        setTimeout(() => {
            successMessage.remove();
        }, 5000);
    }
    
    // Fonction pour afficher une erreur générale
    function showFormError(message) {
        // Supprimer les messages de succès existants
        const existingError = contactForm.querySelector('.form-error-message');
        if (existingError) existingError.remove();
        
        // Créer le message d'erreur
        const errorMessage = document.createElement('div');
        errorMessage.className = 'form-error-message';
        errorMessage.style.backgroundColor = '#f8d7da';
        errorMessage.style.color = '#721c24';
        errorMessage.style.padding = '1rem';
        errorMessage.style.borderRadius = 'var(--border-radius)';
        errorMessage.style.marginTop = '1rem';
        errorMessage.style.textAlign = 'center';
        errorMessage.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
        
        // Insérer avant le formulaire
        contactForm.insertBefore(errorMessage, contactForm.firstChild);
        
        // Faire défiler jusqu'à l'erreur
        errorMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Supprimer le message après 5 secondes
        setTimeout(() => {
            errorMessage.remove();
        }, 5000);
    }
}

// ===== ANIMATIONS AU SCROLL =====
function initAnimations() {
    // Observer pour les animations au défilement
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                
                // Ajouter des classes d'animation spécifiques
                if (entry.target.classList.contains('card')) {
                    entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
                    entry.target.style.opacity = '0';
                }
                
                if (entry.target.classList.contains('value-item')) {
                    const index = Array.from(entry.target.parentElement.children).indexOf(entry.target);
                    entry.target.style.animation = `fadeInUp 0.6s ease ${index * 0.1}s forwards`;
                    entry.target.style.opacity = '0';
                }
                
                if (entry.target.classList.contains('gallery-item')) {
                    const index = Array.from(entry.target.parentElement.children).indexOf(entry.target);
                    entry.target.style.animation = `fadeInUp 0.6s ease ${index * 0.1}s forwards`;
                    entry.target.style.opacity = '0';
                }
            }
        });
    }, observerOptions);
    
    // Observer les éléments à animer
    document.querySelectorAll('.card, .value-item, .gallery-item').forEach(el => {
        observer.observe(el);
    });
}

// ===== ANNÉE COURANTE DANS LE FOOTER =====
function initCurrentYear() {
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

// ===== GALERIE INTERACTIVE =====
function initGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            // Créer une lightbox simple
            const lightbox = document.createElement('div');
            lightbox.className = 'lightbox';
            lightbox.style.position = 'fixed';
            lightbox.style.top = '0';
            lightbox.style.left = '0';
            lightbox.style.width = '100%';
            lightbox.style.height = '100%';
            lightbox.style.background = 'url(image/culturede.jpg)';
            lightbox.style.backgroundSize = 'cover';
            lightbox.style.backgroundPosition = 'center';
            lightbox.style.display = 'flex';
            lightbox.style.justifyContent = 'center';
            lightbox.style.alignItems = 'center';
            lightbox.style.zIndex = '2000';
            lightbox.style.cursor = 'pointer';
            
            // Récupérer le contenu de l'overlay
            const overlay = this.querySelector('.gallery-overlay');
            const title = overlay ? overlay.querySelector('h3').textContent : 'Image de la ferme';
            const description = overlay ? overlay.querySelector('p').textContent : '';
            
            // Créer le contenu de la lightbox
            const content = document.createElement('div');
            content.style.maxWidth = '90%';
            content.style.maxHeight = '90%';
            content.style.backgroundColor = 'white';
            content.style.borderRadius = 'var(--border-radius)';
            content.style.padding = '2rem';
            content.style.position = 'relative';
            content.style.cursor = 'default';
            
            // Ajouter le texte
            content.innerHTML = `
                <h3 style="color: var(--primary-dark); margin-bottom: 1rem;">${title}</h3>
                <p style="color: var(--text-light); margin-bottom: 1.5rem;">${description}</p>
                <div style="width: 100%; height: 300px; background: url(image/agri.jpeg) center/cover no-repeat; border-radius: var(--border-radius); display: flex; justify-content: center; align-items: center; color: white; font-size: 1.2rem;">
                    <i class="" style="font-size: 4rem; margin-right: 1rem;"></i>
                     
                </div>
                <button class="close-lightbox" style="position: absolute; top: 1rem; right: 1rem; background: none; border: none; font-size: 1.5rem; color: var(--text-light); cursor: pointer; padding: 0.5rem;">
                    <i class="fas fa-times"></i>
                </button>
            `;
            
            // Empêcher la propagation du clic sur le contenu
            content.addEventListener('click', function(e) {
                e.stopPropagation();
            });
            

            lightbox.appendChild(content);
            document.body.appendChild(lightbox);
            document.body.style.overflow = 'hidden';
            
            // Fermer la lightbox
            function closeLightbox() {
                lightbox.remove();
                document.body.style.overflow = '';
            }
            
            // Fermer en cliquant sur le bouton
            content.querySelector('.close-lightbox').addEventListener('click', closeLightbox);
            
            // Fermer en cliquant à l'extérieur
            lightbox.addEventListener('click', closeLightbox);
            
            // Fermer avec la touche Échap
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape') {
                    closeLightbox();
                }
            });
        });
    });
}

// ===== SCROLL LISSE POUR LES LIENS =====
function initSmoothScroll() {
    // Gérer les clics sur les liens d'ancrage
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Ignorer les liens "#" vides
            if (href === '#') return;
            
            const targetElement = document.querySelector(href);
            
            if (targetElement) {
                e.preventDefault();
                
                // Calculer la position avec offset pour le header fixe
                const headerHeight = document.querySelector('.site-header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== HEADER SCROLL EFFECT =====
function initHeaderScroll() {
    const header = document.querySelector('.site-header');
    let lastScroll = 0;
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        // Ajouter/supprimer la classe "scrolled" selon la position
        if (currentScroll > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Cacher/montrer le header au scroll (optionnel)
        if (currentScroll > lastScroll && currentScroll > 200) {
            // Scrolling vers le bas - cacher le header
            header.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling vers le haut - montrer le header
            header.style.transform = 'translateY(0)';
        }
        
        lastScroll = currentScroll;
    });
}

// ===== FONCTIONNALITÉS SUPPLEMENTAIRES =====
// Chargement progressif des images (Lazy Loading)
function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// Message de bienvenue (optionnel)
function showWelcomeMessage() {
    // Vérifier si l'utilisateur a déjà vu le message
    if (!sessionStorage.getItem('welcomeShown')) {
        setTimeout(() => {
            const welcomeMessage = document.createElement('div');
            welcomeMessage.className = 'welcome-message';
            welcomeMessage.style.position = 'fixed';
            welcomeMessage.style.bottom = '20px';
            welcomeMessage.style.right = '20px';
            welcomeMessage.style.backgroundColor = 'var(--primary-color)';
            welcomeMessage.style.color = 'white';
            welcomeMessage.style.padding = '1rem 1.5rem';
            welcomeMessage.style.borderRadius = 'var(--border-radius)';
            welcomeMessage.style.boxShadow = '0 5px 15px var(--shadow-medium)';
            welcomeMessage.style.zIndex = '1000';
            welcomeMessage.style.maxWidth = '300px';
            welcomeMessage.innerHTML = `
                <strong>Bienvenue chez THIARE-AGRI !</strong>
                <p style="margin-top: 0.5rem; font-size: 0.9rem;">Découvrez nos produits frais et durables.</p>
                <button class="close-welcome" style="position: absolute; top: 0.5rem; right: 0.5rem; background: none; border: none; color: white; cursor: pointer;">
                    <i class="fas fa-times"></i>
                </button>
            `;
            
            document.body.appendChild(welcomeMessage);
            
            // Fermer le message
            welcomeMessage.querySelector('.close-welcome') .addEventListener('click', function() {
                welcomeMessage.style.transform = 'translateX(100%)';
                welcomeMessage.style.opacity = '0';
                setTimeout(() => {
                    welcomeMessage.remove();
                }, 300);
            });
            
            // Fermer automatiquement après 8 secondes
            setTimeout(() => {
                if (welcomeMessage.parentElement) {
                    welcomeMessage.style.transform = 'translateX(100%)';
                    welcomeMessage.style.opacity = '0';
                    setTimeout(() => {
                        welcomeMessage.remove();
                    }, 300);
                }
            }, 8000);
            +
            // Marquer comme vu
            sessionStorage.setItem('welcomeShown', 'true');
        }, 1000);
    }
}

// Initialiser le chargement différé
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLazyLoading);
} else {
    initLazyLoading();
}

// Afficher le message de bienvenue (décommenter si souhaité)
// showWelcomeMessage();

// ===== GESTION DES ERREURS GLOBALES =====
window.addEventListener('error', function(e) {
    console.error('Erreur JavaScript:', e.error);
});

// ===== EXPORT DES FONCTIONS POUR LA CONSOLE =====
// (Pour le débogage, si nécessaire)
window.THIARE-AGRI == {
    initNavigation,
    initFormValidation,
    initAnimations,
    initGallery,
    showWelcomeMessage
};