// Modern Derma Time Website JavaScript

// Previously this file auto-initialized on DOMContentLoaded. That autoload has been removed
// to allow manual control. Call `initializeDerma()` when you want to start the UI.

let __dermaInitialized = false;

function initializeDerma() {
    if (__dermaInitialized) return;
    __dermaInitialized = true;

    // Initialize all features
    initMobileMenu();
    initSmoothScrolling();
    initHeaderScroll();
    initTestimonialCarousel();
    initContactForm();
    initScrollAnimations();
    initAccessibility();
    initServiceFilters();
    initGalleryFilters();
    initBackToTop();
    initStatsCounter();
    initParallaxEffects();
    initPreloader();
}

// Expose global initializer for manual bootstrapping and backwards compatibility
window.initializeDerma = initializeDerma;

// Optional: if you still want automatic initialization in some environments,
// uncomment the following line to auto-run after DOM content is loaded.
// document.addEventListener('DOMContentLoaded', initializeDerma);

// Preloader
function initPreloader() {
    const preloader = document.createElement('div');
    preloader.className = 'preloader';
    preloader.innerHTML = `
        <div class="preloader-content">
            <div class="preloader-logo">Derma<span>Time</span></div>
            <div class="preloader-spinner"></div>
        </div>
    `;
    document.body.appendChild(preloader);
    
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('fade-out');
            setTimeout(() => preloader.remove(), 500);
        }, 1000);
    });
}

// Enhanced Mobile Menu
function initMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const navigation = document.querySelector('.navigation');
    const navLinks = document.querySelectorAll('.nav-link');

    if (mobileMenuToggle && navigation) {
        mobileMenuToggle.addEventListener('click', function() {
            // Toggle mobile menu with animation
            navigation.classList.toggle('mobile-active');
            mobileMenuToggle.classList.toggle('active');
            document.body.classList.toggle('menu-open');
            
            // Animate menu items
            if (navigation.classList.contains('mobile-active')) {
                navLinks.forEach((link, index) => {
                    link.style.animationDelay = `${index * 0.1}s`;
                    link.classList.add('animate-slide-in');
                });
            }
        });

        // Close menu when clicking on nav links
        navLinks.forEach(link => {
            link.addEventListener('click', closeMenu);
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!navigation.contains(event.target) && !mobileMenuToggle.contains(event.target)) {
                closeMenu();
            }
        });
        
        // Close menu on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') closeMenu();
        });
    }

    function closeMenu() {
        navigation.classList.remove('mobile-active');
        mobileMenuToggle.classList.remove('active');
        document.body.classList.remove('menu-open');
        navLinks.forEach(link => link.classList.remove('animate-slide-in'));
    }
}

// Enhanced Smooth Scrolling
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                // Add smooth scroll with easing
                smoothScrollTo(targetPosition, 1000);
            }
        });
    });
}

// Custom smooth scroll function
function smoothScrollTo(targetPosition, duration) {
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;

    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = easeInOutQuad(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
    }

    // Easing function
    function easeInOutQuad(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }

    requestAnimationFrame(animation);
}

// Enhanced Header Scroll Effect
function initHeaderScroll() {
    const header = document.querySelector('.header');
    let lastScrollTop = 0;
    let scrollTimer = null;
    
    window.addEventListener('scroll', function() {
        if (scrollTimer) clearTimeout(scrollTimer);
        
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add scrolled class when scrolling
        if (scrollTop > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Hide/show header on scroll
        if (scrollTop > lastScrollTop && scrollTop > 200) {
            header.classList.add('header-hidden');
        } else {
            header.classList.remove('header-hidden');
        }
        
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
        
        // Add scroll end class
        scrollTimer = setTimeout(() => {
            header.classList.add('scroll-ended');
            setTimeout(() => header.classList.remove('scroll-ended'), 150);
        }, 150);
    });
}

// Enhanced Testimonial Carousel - 3 at a time
function initTestimonialCarousel() {
    const carousel = document.getElementById('testimonials-carousel');
    const wrapper = document.getElementById('testimonials-wrapper');
    const slides = document.querySelectorAll('.testimonial-slide');
    const prevBtn = document.getElementById('testimonial-prev');
    const nextBtn = document.getElementById('testimonial-next');
    const indicators = document.querySelectorAll('.indicator');
    
    let currentIndex = 0;
    let autoSlideTimer;
    const totalSlides = slides.length;
    const slidesToShow = getSlidesToShow();
    const maxIndex = Math.max(0, totalSlides - slidesToShow);
    
    if (totalSlides === 0) return;

    function getSlidesToShow() {
        if (window.innerWidth <= 768) return 1;
        if (window.innerWidth <= 1024) return 2;
        return 3;
    }

    function updateCarousel() {
        const slideWidth = slides[0].offsetWidth + 30; // including gap
        const offset = -currentIndex * slideWidth;
        wrapper.style.transform = `translateX(${offset}px)`;
        
        // Update indicators
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === Math.floor(currentIndex / slidesToShow));
        });
    }

    function nextSlide() {
        const slidesToShow = getSlidesToShow();
        const maxIndex = Math.max(0, totalSlides - slidesToShow);
        
        if (currentIndex < maxIndex) {
            currentIndex += slidesToShow;
        } else {
            currentIndex = 0; // Loop back to start
        }
        updateCarousel();
    }

    function prevSlide() {
        const slidesToShow = getSlidesToShow();
        const maxIndex = Math.max(0, totalSlides - slidesToShow);
        
        if (currentIndex > 0) {
            currentIndex -= slidesToShow;
        } else {
            currentIndex = maxIndex; // Loop to end
        }
        updateCarousel();
    }

    function goToSlide(index) {
        const slidesToShow = getSlidesToShow();
        const maxIndex = Math.max(0, totalSlides - slidesToShow);
        currentIndex = Math.min(index * slidesToShow, maxIndex);
        updateCarousel();
    }

    // Initialize
    updateCarousel();

    // Event listeners
    if (nextBtn) nextBtn.addEventListener('click', () => {
        clearInterval(autoSlideTimer);
        nextSlide();
        startAutoSlide();
    });
    
    if (prevBtn) prevBtn.addEventListener('click', () => {
        clearInterval(autoSlideTimer);
        prevSlide();
        startAutoSlide();
    });

    // Indicator clicks
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', function() {
            clearInterval(autoSlideTimer);
            goToSlide(index);
            startAutoSlide();
        });
    });

    // Auto-advance carousel
    function startAutoSlide() {
        autoSlideTimer = setInterval(nextSlide, 8000);
    }

    // Pause on hover
    if (carousel) {
        carousel.addEventListener('mouseenter', () => clearInterval(autoSlideTimer));
        carousel.addEventListener('mouseleave', startAutoSlide);
    }

    // Touch/swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    if (carousel) {
        carousel.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
        });

        carousel.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });
    }

    function handleSwipe() {
        const swipeThreshold = 50;
        const swipeDistance = touchEndX - touchStartX;

        if (Math.abs(swipeDistance) > swipeThreshold) {
            clearInterval(autoSlideTimer);
            
            if (swipeDistance > 0) {
                prevSlide();
            } else {
                nextSlide();
            }
            
            startAutoSlide();
        }
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            clearInterval(autoSlideTimer);
            prevSlide();
            startAutoSlide();
        } else if (e.key === 'ArrowRight') {
            clearInterval(autoSlideTimer);
            nextSlide();
            startAutoSlide();
        }
    });

    // Handle window resize
    window.addEventListener('resize', () => {
        updateCarousel();
    });

    // Start auto-slide
    startAutoSlide();
}

// Service Filters
function initServiceFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const serviceCards = document.querySelectorAll('.service-card[data-category]');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Filter cards
            serviceCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    card.style.display = 'block';
                    card.classList.add('fade-in');
                } else {
                    card.classList.add('fade-out');
                    setTimeout(() => {
                        card.style.display = 'none';
                        card.classList.remove('fade-out');
                    }, 300);
                }
            });
        });
    });
}

// Gallery Filters
function initGalleryFilters() {
    const filterBtns = document.querySelectorAll('.gallery-filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item[data-category]');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Filter items
            galleryItems.forEach(item => {
                const category = item.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    item.style.display = 'block';
                    item.classList.add('fade-in');
                } else {
                    item.classList.add('fade-out');
                    setTimeout(() => {
                        item.style.display = 'none';
                        item.classList.remove('fade-out');
                    }, 300);
                }
            });
        });
    });
}

// Back to Top Button
function initBackToTop() {
    const backToTop = document.getElementById('back-to-top');
    
    if (backToTop) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTop.classList.add('show');
            } else {
                backToTop.classList.remove('show');
            }
        });
        
        backToTop.addEventListener('click', function() {
            smoothScrollTo(0, 1000);
        });
    }
}

// Animated Stats Counter
function initStatsCounter() {
    const statNumbers = document.querySelectorAll('.stat-number[data-count]');
    let hasAnimated = false;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasAnimated) {
                hasAnimated = true;
                animateCounters();
            }
        });
    }, { threshold: 0.5 });

    if (statNumbers.length > 0) {
        observer.observe(statNumbers[0].closest('.stats-section'));
    }

    function animateCounters() {
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-count'));
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;

            const counter = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(counter);
                }
                stat.textContent = Math.floor(current) + (target > 100 ? '' : target === 98 ? '%' : '+');
            }, 16);
        });
    }
}

// Parallax Effects
function initParallaxEffects() {
    const parallaxElements = document.querySelectorAll('.hero-bg-image, .services-bg-image, .stats-bg-image');
    
    if (window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset;
            
            parallaxElements.forEach(element => {
                const speed = 0.5;
                const yPos = -(scrollTop * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
        });
    }
}

// Enhanced Contact Form
function initContactForm() {
    const form = document.getElementById('contact-form');
    
    if (form) {
        // Add real-time validation
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => validateField(input));
            input.addEventListener('input', () => {
                if (input.classList.contains('error')) {
                    validateField(input);
                }
            });
        });
        
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(form);
            const formObject = {};
            
            formData.forEach((value, key) => {
                formObject[key] = value;
            });
            
            // Validate form
            if (validateForm(formObject)) {
                submitForm(formObject);
            }
        });
    }
}

// Field validation
function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    
    // Remove existing error styling
    field.classList.remove('error');
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) existingError.remove();
    
    // Check if required field is empty
    if (field.hasAttribute('required') && !value) {
        showFieldError(field, 'This field is required');
        isValid = false;
    }
    
    // Email validation
    if (field.type === 'email' && value && !isValidEmail(value)) {
        showFieldError(field, 'Please enter a valid email address');
        isValid = false;
    }
    
    // Phone validation
    if (field.type === 'tel' && value && !isValidPhone(value)) {
        showFieldError(field, 'Please enter a valid phone number');
        isValid = false;
    }
    
    return isValid;
}

function showFieldError(field, message) {
    field.classList.add('error');
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    field.parentNode.appendChild(errorDiv);
}

// Enhanced form validation
function validateForm(data) {
    let isValid = true;
    const form = document.getElementById('contact-form');
    const inputs = form.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });
    
    return isValid;
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Phone validation
function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
}

// Enhanced form submission
function submitForm(data) {
    const submitBtn = document.querySelector('#contact-form button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.innerHTML = '<span class="btn-spinner"></span>Sending...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        showFormSuccess();
        document.getElementById('contact-form').reset();
        
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        console.log('Form submitted:', data);
    }, 2000);
}

// Enhanced success message
function showFormSuccess() {
    const successContainer = document.createElement('div');
    successContainer.className = 'form-success animate-scale';
    successContainer.innerHTML = `
        <div class="success-icon">✅</div>
        <h4>Thank you!</h4>
        <p>Your appointment request has been received. We'll contact you within 24 hours to confirm your booking.</p>
    `;
    
    const form = document.getElementById('contact-form');
    form.insertBefore(successContainer, form.firstChild);
    
    setTimeout(() => {
        successContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
    
    setTimeout(() => {
        successContainer.classList.add('fade-out');
        setTimeout(() => successContainer.remove(), 500);
    }, 5000);
}

// Enhanced Scroll Animations
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('[data-aos]');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
                
                // Add staggered animation for grids
                if (entry.target.parentElement.classList.contains('services-grid') ||
                    entry.target.parentElement.classList.contains('features-grid')) {
                    const siblings = Array.from(entry.target.parentElement.children);
                    const index = siblings.indexOf(entry.target);
                    entry.target.style.animationDelay = `${index * 0.1}s`;
                }
            }
        });
    }, observerOptions);
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// Accessibility Enhancements
function initAccessibility() {
    // Enhanced keyboard navigation
    document.addEventListener('keydown', function(e) {
        // Skip links
        if (e.key === 'Tab' && e.shiftKey) {
            const skipLink = document.querySelector('.skip-link');
            if (document.activeElement === document.body) {
                e.preventDefault();
                skipLink.focus();
            }
        }
        
        // Close mobile menu on escape
        if (e.key === 'Escape') {
            const navigation = document.querySelector('.navigation');
            if (navigation.classList.contains('mobile-active')) {
                const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
                mobileMenuToggle.click();
            }
        }
    });
    
    // Announce page changes to screen readers
    const sections = document.querySelectorAll('section[id]');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
                const sectionName = entry.target.querySelector('h2')?.textContent || 
                                  entry.target.getAttribute('aria-label') || 
                                  'Section';
                
                // Update page title for screen readers
                document.title = `${sectionName} - Derma Time`;
            }
        });
    }, { threshold: 0.5 });
    
    sections.forEach(section => observer.observe(section));
}

// Utility Functions
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
}

// Enhanced error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    // Show user-friendly message
    showNotification('Something went wrong. Please refresh the page.', 'error');
});

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span class="notification-message">${message}</span>
        <button class="notification-close" aria-label="Close notification">×</button>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => notification.classList.add('show'), 100);
    
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    });
    
    if (type !== 'error') {
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }
}