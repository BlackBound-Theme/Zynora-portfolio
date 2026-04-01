/**
 * Zynora Portfolio Engine
 * Version: 3.1.0
 * Description: Core interactive functionality for the Zynora template.
 * Written with pure Vanilla JavaScript (zero dependencies).
 */

(function () {
    'use strict';

    class ZynoraPortfolio {
        constructor() {
            // State
            this.isTouchDevice = window.matchMedia('(hover:none)').matches || 'ontouchstart' in window;
            this.DOM = {
                body: document.body,
                html: document.documentElement
            };

            // Initialize all modules safely
            document.addEventListener('DOMContentLoaded', () => {
                this.initPreloader();
                this.initCursor();
                this.initParticles();
                this.initNavigation();
                this.initThemeToggle();
                this.initParallaxGlow();
                this.initTypingEffect();
                this.initScrollReveals();
                this.initCounters();
                this.initGitHubGraph();
                this.initPortfolioFilters();
                this.initTiltEffect();
                this.initLightbox();
                this.initTimeline();
                this.initAccordions();
                this.initFormValidation();
            });
        }

        /**
         * Hide the preloader when the page finishes loading.
         */
        initPreloader() {
            window.addEventListener('load', () => {
                setTimeout(() => {
                    const preloader = document.getElementById('preloader');
                    if (preloader) {
                        preloader.classList.add('preloader-hidden');
                        setTimeout(() => preloader.remove(), 1000);
                    }
                }, 900);
            });
        }

        /**
         * Custom magnetic cursor and trailing dot physics.
         */
        initCursor() {
            const cursorDot = document.getElementById('cursor-dot');
            const cursorOutline = document.getElementById('cursor-outline');

            if (this.isTouchDevice) {
                if (cursorDot) cursorDot.remove();
                if (cursorOutline) cursorOutline.remove();
                this.DOM.body.style.cursor = 'auto';
                
                const interactables = document.querySelectorAll('a, button, input, textarea');
                interactables.forEach(element => {
                    element.style.cursor = 'auto';
                });
                return;
            }

            let mouseX = 0;
            let mouseY = 0;
            let outlineX = 0;
            let outlineY = 0;

            window.addEventListener('mousemove', (event) => {
                mouseX = event.clientX;
                mouseY = event.clientY;
                if (cursorDot) {
                    cursorDot.style.transform = `translate(calc(${mouseX}px - 50%), calc(${mouseY}px - 50%))`;
                }
            });

            const animateCursor = () => {
                // Apply easing equation for smooth trailing effect
                outlineX += (mouseX - outlineX) * 0.12;
                outlineY += (mouseY - outlineY) * 0.12;
                
                if (cursorOutline) {
                    cursorOutline.style.transform = `translate(calc(${outlineX}px - 50%), calc(${outlineY}px - 50%))`;
                }
                requestAnimationFrame(animateCursor);
            };
            animateCursor();

            // Magnetic hover states on links and buttons
            const magneticElements = document.querySelectorAll('a, button, [data-magnetic-strength], .project-card, .filter-btn, .tech-pill');
            magneticElements.forEach(element => {
                element.addEventListener('mouseenter', () => {
                    if (cursorOutline) cursorOutline.classList.add('magnetic-hover');
                });
                element.addEventListener('mouseleave', () => {
                    if (cursorOutline) cursorOutline.classList.remove('magnetic-hover');
                });
            });

            document.addEventListener('mouseleave', () => {
                if (cursorDot) cursorDot.style.opacity = '0';
                if (cursorOutline) cursorOutline.style.opacity = '0';
            });
            
            document.addEventListener('mouseenter', () => {
                if (cursorDot) cursorDot.style.opacity = '1';
                if (cursorOutline) cursorOutline.style.opacity = '1';
            });
        }

        /**
         * Renders floating background particles on hero section.
         */
        initParticles() {
            const canvas = document.getElementById('particles-canvas');
            if (!canvas || this.isTouchDevice) {
                return;
            }

            const ctx = canvas.getContext('2d');
            let canvasWidth = window.innerWidth;
            let canvasHeight = window.innerHeight;
            let particlesArray = [];

            const resizeCanvas = () => {
                canvasWidth = canvas.width = window.innerWidth;
                canvasHeight = canvas.height = window.innerHeight;
            };
            resizeCanvas();
            window.addEventListener('resize', resizeCanvas, { passive: true });

            // Generate initial particles
            for (let i = 0; i < 55; i++) {
                particlesArray.push({
                    x: Math.random() * window.innerWidth,
                    y: Math.random() * window.innerHeight,
                    radius: Math.random() * 1.5 + 0.5,
                    velocityX: (Math.random() - 0.5) * 0.25,
                    velocityY: (Math.random() - 0.5) - 0.15,
                    opacity: Math.random() * 0.5 + 0.1
                });
            }

            const drawParticles = () => {
                ctx.clearRect(0, 0, canvasWidth, canvasHeight);
                const isDarkMode = this.DOM.html.getAttribute('data-theme') !== 'light';
                const particleColor = isDarkMode ? '0,240,255' : '91,0,232';

                particlesArray.forEach(particle => {
                    // Update physics
                    particle.x += particle.velocityX;
                    particle.y += particle.velocityY;

                    // Wrap around screen boundaries
                    if (particle.y < -10) {
                        particle.y = canvasHeight + 10;
                        particle.x = Math.random() * canvasWidth;
                    }
                    if (particle.x < 0) particle.x = canvasWidth;
                    if (particle.x > canvasWidth) particle.x = 0;

                    // Render
                    ctx.beginPath();
                    ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(${particleColor}, ${particle.opacity})`;
                    ctx.fill();
                });

                requestAnimationFrame(drawParticles);
            };
            drawParticles();
        }

        /**
         * Navigation scroll spy, sticky header, and smooth scrolling.
         */
        initNavigation() {
            const mainNav = document.getElementById('main-nav');
            const sections = document.querySelectorAll('section[id]');
            const navLinks = document.querySelectorAll('.nav-link[data-section]');

            // Smooth scrolling to anchors
            document.querySelectorAll('a[href^="#"]').forEach(link => {
                link.addEventListener('click', (event) => {
                    const targetId = link.getAttribute('href');
                    const targetElement = document.querySelector(targetId);
                    
                    if (targetElement) {
                        event.preventDefault();
                        this.closeMobileMenu();
                        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                });
            });

            // Highlight active section on scroll
            const updateActiveLink = (activeId) => {
                navLinks.forEach(link => {
                    if (link.getAttribute('data-section') === activeId) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            };

            const scrollObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        updateActiveLink(entry.target.id);
                    }
                });
            }, { rootMargin: '-35% 0px -55% 0px' });

            sections.forEach(section => {
                scrollObserver.observe(section);
            });

            // Sticky nav background transform
            window.addEventListener('scroll', () => {
                if (mainNav) {
                    mainNav.classList.toggle('scrolled', window.scrollY > 60);
                }
            }, { passive: true });

            // Mobile Navigation Toggle
            this.hamburger = document.getElementById('hamburger');
            this.mobileMenu = document.getElementById('mobile-menu');
            this.menuOverlay = document.getElementById('menu-overlay');

            if (this.hamburger) {
                this.hamburger.addEventListener('click', () => {
                    if (this.hamburger.classList.contains('open')) {
                        this.closeMobileMenu();
                    } else {
                        this.openMobileMenu();
                    }
                });
            }

            if (this.menuOverlay) {
                this.menuOverlay.addEventListener('click', () => this.closeMobileMenu());
            }

            document.addEventListener('keydown', (event) => {
                if (event.key === 'Escape') {
                    this.closeMobileMenu();
                    this.closeLightbox();
                }
            });
        }

        openMobileMenu() {
            if (this.hamburger) {
                this.hamburger.classList.add('open');
                this.hamburger.setAttribute('aria-expanded', 'true');
            }
            if (this.mobileMenu) {
                this.mobileMenu.classList.add('open');
            }
            if (this.menuOverlay) {
                this.menuOverlay.classList.add('active');
            }
            this.DOM.body.style.overflow = 'hidden';
        }

        closeMobileMenu() {
            if (this.hamburger) {
                this.hamburger.classList.remove('open');
                this.hamburger.setAttribute('aria-expanded', 'false');
            }
            if (this.mobileMenu) {
                this.mobileMenu.classList.remove('open');
            }
            if (this.menuOverlay) {
                this.menuOverlay.classList.remove('active');
            }
            this.DOM.body.style.overflow = '';
        }

        /**
         * Dark/Light mode theme system using CSS variables.
         */
        initThemeToggle() {
            const themeToggleBtn = document.getElementById('theme-toggle');
            const savedTheme = localStorage.getItem('zynora-theme') || 'dark';
            
            this.DOM.html.setAttribute('data-theme', savedTheme);
            if (themeToggleBtn) {
                themeToggleBtn.textContent = savedTheme === 'light' ? '🌙' : '☀️';
            }

            if (themeToggleBtn) {
                themeToggleBtn.addEventListener('click', () => {
                    const currentTheme = this.DOM.html.getAttribute('data-theme');
                    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
                    
                    this.DOM.html.setAttribute('data-theme', nextTheme);
                    themeToggleBtn.textContent = nextTheme === 'light' ? '🌙' : '☀️';
                    localStorage.setItem('zynora-theme', nextTheme);
                });
            }
        }

        /**
         * Mouse-following ambient glow behind hero text.
         */
        initParallaxGlow() {
            const heroGlow = document.querySelector('.hero-glow');
            const heroSection = document.querySelector('.hero-section');
            if (!heroGlow || !heroSection) return;

            heroSection.addEventListener('mousemove', (event) => {
                const rotationX = (event.clientX / window.innerWidth - 0.5) * 40;
                const rotationY = (event.clientY / window.innerHeight - 0.5) * 40;
                heroGlow.style.transform = `translate(calc(-50% + ${rotationX}px), calc(-50% + ${rotationY}px))`;
            }, { passive: true });
        }

        /**
         * Hero section typewriter effect looping through job roles.
         */
        initTypingEffect() {
            const typingTarget = document.getElementById('typing-text');
            if (!typingTarget) return;

            const jobRoles = ['Creative Coder.', 'UI/UX Specialist.', 'System Architect.', 'WebGL Enthusiast.'];
            let currentWordIndex = 0;
            let currentCharIndex = 0;
            let isDeleting = false;

            const typeTick = () => {
                const currentWord = jobRoles[currentWordIndex];
                
                if (isDeleting) {
                    currentCharIndex--;
                } else {
                    currentCharIndex++;
                }

                typingTarget.textContent = currentWord.slice(0, currentCharIndex);

                let timeoutDelay = isDeleting ? 36 : 88;

                // Handle word completion or deletion finishing
                if (!isDeleting && currentCharIndex === currentWord.length) {
                    timeoutDelay = 2200; // Pause at end of word
                    isDeleting = true;
                } else if (isDeleting && currentCharIndex === 0) {
                    isDeleting = false;
                    currentWordIndex = (currentWordIndex + 1) % jobRoles.length;
                    timeoutDelay = 480; // Pause before typing next word
                }

                setTimeout(typeTick, timeoutDelay);
            };

            // Start typing effect after an initial delay
            setTimeout(typeTick, 1600);
        }

        /**
         * Animate elements into view uniquely as they enter the viewport.
         */
        initScrollReveals() {
            const revealElements = document.querySelectorAll('.reveal:not(.active), .reveal-left, .reveal-right, .reveal-scale');
            
            const revealObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('active');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });

            revealElements.forEach(element => {
                revealObserver.observe(element);
            });
        }

        /**
         * Increment numeric statistics gracefully from zero.
         */
        initCounters() {
            const animateCounter = (element, targetNumber, durationMs = 1800) => {
                let startTime = null;
                const suffix = targetNumber > 50 ? '+' : '';

                const animationStep = (timestamp) => {
                    if (!startTime) startTime = timestamp;
                    const progress = Math.min((timestamp - startTime) / durationMs, 1);
                    // Ease out cubic
                    const easing = 1 - Math.pow(1 - progress, 3);
                    const currentNumber = Math.floor(easing * targetNumber);
                    
                    element.textContent = currentNumber + suffix;

                    if (progress < 1) {
                        requestAnimationFrame(animationStep);
                    }
                };
                requestAnimationFrame(animationStep);
            };

            const counterObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const targetValue = parseInt(entry.target.getAttribute('data-target'), 10);
                        animateCounter(entry.target, targetValue);
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });

            const counterElements = document.querySelectorAll('[data-target]');
            counterElements.forEach(element => {
                counterObserver.observe(element);
            });
        }

        /**
         * Simulates a GitHub activity graph using procedural generation.
         */
        initGitHubGraph() {
            const githubGrid = document.getElementById('gh-grid');
            if (!githubGrid) return;

            // Determines the distribution of cell intensity
            const intensityProbabilities = [0, 0, 0, 0, 1, 1, 1, 2, 2, 3, 4];
            
            for (let i = 0; i < 182; i++) {
                const cell = document.createElement('div');
                const randomLevel = intensityProbabilities[Math.floor(Math.random() * intensityProbabilities.length)];
                
                cell.className = 'gh-cell';
                if (randomLevel > 0) {
                    cell.classList.add(`gh-level-${randomLevel}`);
                }
                
                githubGrid.appendChild(cell);
            }
        }

        /**
         * Project grid robust filtering logic.
         */
        initPortfolioFilters() {
            const filterButtons = document.querySelectorAll('.filter-btn');
            const projectItems = document.querySelectorAll('.filter-item');

            filterButtons.forEach(button => {
                button.addEventListener('click', () => {
                    // Update active button state
                    const activeButton = document.querySelector('.filter-btn.active');
                    if (activeButton) {
                        activeButton.classList.remove('active');
                    }
                    button.classList.add('active');

                    // Filter logic
                    const filterCategory = button.getAttribute('data-filter');
                    
                    projectItems.forEach(item => {
                        const isMatch = filterCategory === 'all' || item.getAttribute('data-category') === filterCategory;
                        
                        if (isMatch) {
                            item.style.display = '';
                            requestAnimationFrame(() => {
                                item.style.opacity = '1';
                                item.style.transform = 'scale(1)';
                            });
                        } else {
                            item.style.opacity = '0';
                            item.style.transform = 'scale(0.9)';
                            setTimeout(() => {
                                item.style.display = 'none';
                            }, 310);
                        }
                    });
                });
            });
        }

        /**
         * 3D card tilt effect for portfolio grid interactions.
         */
        initTiltEffect() {
            if (this.isTouchDevice) return;

            const cards = document.querySelectorAll('.project-card');
            
            cards.forEach(card => {
                card.addEventListener('mousemove', (event) => {
                    const rect = card.getBoundingClientRect();
                    const rotationX = ((event.clientY - rect.top) / rect.height - 0.5) * -16;
                    const rotationY = ((event.clientX - rect.left) / rect.width - 0.5) * 16;
                    
                    card.style.transition = 'none';
                    card.style.transform = `perspective(900px) rotateX(${rotationX}deg) rotateY(${rotationY}deg) scale(1.025)`;
                });

                card.addEventListener('mouseleave', () => {
                    card.style.transition = 'transform 0.7s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                    card.style.transform = 'perspective(900px) rotateX(0) rotateY(0) scale(1)';
                });
            });
        }

        /**
         * Accessible image viewing modal.
         */
        initLightbox() {
            this.lightbox = document.getElementById('lightbox');
            this.lightboxImg = document.getElementById('lb-img');
            this.lightboxTitle = document.getElementById('lb-title');
            this.lightboxCat = document.getElementById('lb-cat');
            const closeButton = document.getElementById('lb-close');

            const projectOverlays = document.querySelectorAll('.project-overlay');
            projectOverlays.forEach(overlay => {
                overlay.addEventListener('click', () => {
                    const imageSrc = overlay.getAttribute('data-src') || '';
                    const titleText = overlay.getAttribute('data-title') || '';
                    const categoryText = overlay.getAttribute('data-cat') || '';
                    this.openLightbox(imageSrc, titleText, categoryText);
                });
            });

            // Keyboard accessibility for cards
            document.querySelectorAll('.project-card[tabindex]').forEach(card => {
                card.addEventListener('keydown', (event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        const overlayButton = card.querySelector('.project-overlay');
                        if (overlayButton) overlayButton.click();
                    }
                });
            });

            if (closeButton) {
                closeButton.addEventListener('click', () => this.closeLightbox());
            }

            if (this.lightbox) {
                this.lightbox.addEventListener('click', (event) => {
                    if (event.target === this.lightbox) {
                        this.closeLightbox();
                    }
                });
            }
        }

        openLightbox(src, title, category) {
            if (this.lightboxImg) this.lightboxImg.src = src;
            if (this.lightboxTitle) this.lightboxTitle.textContent = title;
            if (this.lightboxCat) this.lightboxCat.textContent = category;
            
            if (this.lightbox) {
                this.lightbox.classList.add('open');
            }
            this.DOM.body.style.overflow = 'hidden';
        }

        closeLightbox() {
            if (this.lightbox) {
                this.lightbox.classList.remove('open');
            }
            this.DOM.body.style.overflow = '';
            
            // Clear source after animation to prevent flashing previous image
            setTimeout(() => {
                if (this.lightboxImg) this.lightboxImg.src = '';
            }, 500);
        }

        /**
         * Timeline progress rail synced fluidly with user scroll.
         */
        initTimeline() {
            const timelineFill = document.getElementById('tl-fill');
            const timelineRail = document.getElementById('tl-rail');
            const timelineItems = document.querySelectorAll('.timeline-item[data-tl-pct]');
            
            // Map the corresponding tracking dots
            const trackingDots = [0, 1, 2, 3].map(index => document.getElementById(`tl-dot-${index}`));

            const updateTimelineProgress = () => {
                if (!timelineRail) return;
                
                const railRect = timelineRail.getBoundingClientRect();
                
                // Calculate percentage of scroll based on rail offset
                const scrollProgress = ((window.innerHeight - railRect.top) / railRect.height) * 100;
                const percentage = Math.min(Math.max(scrollProgress, 0), 100);
                
                if (timelineFill) {
                    timelineFill.style.height = `${percentage}%`;
                }

                timelineItems.forEach((item, index) => {
                    const thresholdValue = parseInt(item.getAttribute('data-tl-pct') || '0', 10);
                    if (trackingDots[index]) {
                        trackingDots[index].classList.toggle('lit', percentage >= thresholdValue);
                    }
                });
            };

            window.addEventListener('scroll', updateTimelineProgress, { passive: true });
            updateTimelineProgress(); // Initial check
        }

        /**
         * Collapsible accordion menus for services page.
         */
        initAccordions() {
            const accordionHeaders = document.querySelectorAll('.accordion-head');
            
            accordionHeaders.forEach(header => {
                header.addEventListener('click', () => {
                    const parentItem = header.parentElement;
                    const isCurrentlyOpen = parentItem.classList.contains('open');
                    
                    // Close all active accordions first
                    document.querySelectorAll('.accordion-item.open').forEach(activeItem => {
                        activeItem.classList.remove('open');
                    });
                    
                    // Toggle current if it wasn't already open
                    if (!isCurrentlyOpen) {
                        parentItem.classList.add('open');
                    }
                });
            });
        }

        /**
         * Basic frontend validation suite for the contact form.
         */
        initFormValidation() {
            const contactForm = document.getElementById('contact-form');
            const successMessage = document.getElementById('form-success');
            const submitBtn = document.getElementById('submit-btn');

            if (!contactForm) return;

            const validationRules = {
                'f-name':    value => value.trim().length >= 2,
                'f-email':   value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()),
                'f-subject': value => value.trim().length >= 2,
                'f-message': value => value.trim().length >= 20,
            };

            const checkFieldValidity = (fieldId) => {
                const inputField = document.getElementById(fieldId);
                if (!inputField) return true;
                
                const rule = validationRules[fieldId];
                if (!rule) return true;
                
                const isValid = rule(inputField.value);
                const isBlank = inputField.value.trim() === '';
                
                // Toggle error states securely
                if (!isValid && !isBlank) {
                    inputField.classList.add('error');
                    inputField.setAttribute('aria-invalid', 'true');
                } else {
                    inputField.classList.remove('error');
                    inputField.removeAttribute('aria-invalid');
                }
                
                return isValid;
            };

            // Bind input validation dynamically
            Object.keys(validationRules).forEach(id => {
                const element = document.getElementById(id);
                if (element) {
                    element.addEventListener('input', () => checkFieldValidity(id));
                    element.addEventListener('blur', () => checkFieldValidity(id));
                }
            });

            contactForm.addEventListener('submit', (event) => {
                event.preventDefault();
                let isFormFullyValid = true;
                
                Object.keys(validationRules).forEach(id => {
                    if (!checkFieldValidity(id)) {
                        isFormFullyValid = false;
                        const invalidField = document.getElementById(id);
                        if (invalidField) {
                            invalidField.classList.add('error');
                        }
                    }
                });

                if (isFormFullyValid) {
                    const originalBtnText = submitBtn.textContent;
                    submitBtn.textContent = 'Sending...';
                    submitBtn.classList.add('sending');
                    
                    // Simulate network delay
                    setTimeout(() => {
                        contactForm.reset();
                        successMessage.style.display = 'block';
                        submitBtn.textContent = originalBtnText;
                        submitBtn.classList.remove('sending');
                        setTimeout(() => {
                            if (successMessage) successMessage.style.display = 'none';
                        }, 5000);
                    }, 1500);
                }
            });
        }
    }

    // Initialize the portfolio engine
    new ZynoraPortfolio();

})();
