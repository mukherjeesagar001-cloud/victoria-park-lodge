/* ═══════════════════════════════════════════════════════════════
   Victoria Park Lodge — Premium Animations & Interactions
   GSAP + ScrollTrigger + Lenis Smooth Scroll
   ═══════════════════════════════════════════════════════════════ */

(() => {
    'use strict';

    // ─── Register GSAP Plugins ───
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

    // ─── Global State ───
    const state = {
        isLoaded: false,
        isMobile: window.innerWidth <= 768,
        mouseX: 0,
        mouseY: 0,
    };

    // ═══════════════════════════════════════════
    // LENIS SMOOTH SCROLL
    // ═══════════════════════════════════════════
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        smoothWheel: true,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Connect Lenis to GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // ═══════════════════════════════════════════
    // PRELOADER
    // ═══════════════════════════════════════════
    function initPreloader() {
        const preloader = document.getElementById('preloader');
        const words = document.querySelectorAll('.preloader-word');
        const barFill = document.querySelector('.preloader-bar-fill');
        const counter = document.querySelector('.preloader-counter');

        const tl = gsap.timeline();

        // Animate words in
        tl.to(words, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: 'expo.out',
        });

        // Simulate loading
        let progress = { val: 0 };
        tl.to(progress, {
            val: 100,
            duration: 2,
            ease: 'power2.inOut',
            onUpdate: () => {
                const p = Math.round(progress.val);
                barFill.style.width = p + '%';
                counter.textContent = p + '%';
            },
        }, '-=0.5');

        // Exit preloader
        tl.to(preloader, {
            yPercent: -100,
            duration: 1,
            ease: 'expo.inOut',
            delay: 0.3,
            onComplete: () => {
                preloader.style.display = 'none';
                state.isLoaded = true;
                initHeroAnimations();
                document.body.style.overflow = '';
            },
        });
    }

    // Custom cursor removed

    // ═══════════════════════════════════════════
    // MAGNETIC BUTTONS
    // ═══════════════════════════════════════════
    function initMagneticButtons() {
        if (state.isMobile) return;

        document.querySelectorAll('.magnetic-btn').forEach((btn) => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                gsap.to(btn, {
                    x: x * 0.3,
                    y: y * 0.3,
                    duration: 0.4,
                    ease: 'power2.out',
                });
            });

            btn.addEventListener('mouseleave', () => {
                gsap.to(btn, {
                    x: 0,
                    y: 0,
                    duration: 0.6,
                    ease: 'elastic.out(1, 0.5)',
                });
            });
        });
    }

    // ═══════════════════════════════════════════
    // HERO ANIMATIONS
    // ═══════════════════════════════════════════
    function initHeroAnimations() {
        const tl = gsap.timeline({ delay: 0.2 });

        // Title words reveal
        tl.to('.hero-title-word', {
            y: 0,
            duration: 1.2,
            stagger: 0.1,
            ease: 'expo.out',
        });

        // Badge
        tl.to('.hero-badge', {
            opacity: 1,
            duration: 0.8,
            ease: 'power2.out',
        }, '-=0.8');

        // Subtitle
        tl.to('.hero-subtitle', {
            opacity: 1,
            duration: 0.8,
            ease: 'power2.out',
        }, '-=0.5');

        // Actions
        tl.to('.hero-actions', {
            opacity: 1,
            duration: 0.8,
            ease: 'power2.out',
        }, '-=0.4');

        // Stats
        tl.to('.hero-stats', {
            opacity: 1,
            duration: 0.8,
            ease: 'power2.out',
        }, '-=0.4');

        // Animate stat counters
        document.querySelectorAll('.hero-stat-number').forEach((num) => {
            const target = parseFloat(num.dataset.count);
            const isDecimal = target % 1 !== 0;
            gsap.to({ val: 0 }, {
                val: target,
                duration: 2,
                delay: 1.5,
                ease: 'power2.out',
                onUpdate: function () {
                    num.textContent = isDecimal
                        ? this.targets()[0].val.toFixed(1)
                        : Math.round(this.targets()[0].val);
                },
            });
        });

        // Hero parallax on scroll
        gsap.to('.hero-bg-image', {
            yPercent: 20,
            ease: 'none',
            scrollTrigger: {
                trigger: '.hero',
                start: 'top top',
                end: 'bottom top',
                scrub: 1,
            },
        });

        // Hero content fade on scroll
        gsap.to('.hero-content', {
            opacity: 0,
            y: -60,
            ease: 'none',
            scrollTrigger: {
                trigger: '.hero',
                start: '30% top',
                end: '80% top',
                scrub: 1,
            },
        });
    }

    // ═══════════════════════════════════════════
    // HERO PARTICLES
    // ═══════════════════════════════════════════
    function initParticles() {
        const container = document.getElementById('heroParticles');
        const particleCount = state.isMobile ? 20 : 40;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'hero-particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.width = (Math.random() * 3 + 1) + 'px';
            particle.style.height = particle.style.width;
            container.appendChild(particle);

            gsap.to(particle, {
                opacity: Math.random() * 0.5 + 0.1,
                duration: Math.random() * 3 + 2,
                delay: Math.random() * 3,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
            });

            gsap.to(particle, {
                y: (Math.random() - 0.5) * 100,
                x: (Math.random() - 0.5) * 50,
                duration: Math.random() * 10 + 10,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
            });
        }
    }

    // ═══════════════════════════════════════════
    // NAVBAR
    // ═══════════════════════════════════════════
    function initNavbar() {
        const navbar = document.getElementById('navbar');
        const hamburger = document.getElementById('navHamburger');
        const mobileMenu = document.getElementById('mobileMenu');

        // Scroll behavior — just add background, never hide
        ScrollTrigger.create({
            start: 'top -80',
            end: 99999,
            onToggle: (self) => {
                navbar.classList.toggle('scrolled', self.isActive);
            },
        });

        // Mobile menu toggle
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            mobileMenu.classList.toggle('active');

            if (mobileMenu.classList.contains('active')) {
                lenis.stop();
            } else {
                lenis.start();
            }
        });

        // Close menu on link click
        mobileMenu.querySelectorAll('.mobile-link').forEach((link) => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                mobileMenu.classList.remove('active');
                lenis.start();
            });
        });
    }

    // ═══════════════════════════════════════════
    // SMOOTH SCROLL LINKS
    // ═══════════════════════════════════════════
    function initSmoothScrollLinks() {
        document.querySelectorAll('a[href^="#"]').forEach((link) => {
            link.addEventListener('click', (e) => {
                const target = document.querySelector(link.getAttribute('href'));
                if (target) {
                    e.preventDefault();
                    lenis.scrollTo(target, {
                        offset: -80,
                        duration: 1.5,
                    });
                }
            });
        });
    }

    // ═══════════════════════════════════════════
    // SCROLL REVEAL ANIMATIONS
    // ═══════════════════════════════════════════
    function initScrollReveal() {
        // Text reveals
        gsap.utils.toArray('.reveal-text').forEach((el) => {
            gsap.to(el, {
                opacity: 1,
                y: 0,
                duration: 1,
                ease: 'expo.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 85%',
                    toggleActions: 'play none none none',
                },
            });
        });

        // Card reveals with stagger
        const cardGroups = new Map();

        gsap.utils.toArray('.reveal-card').forEach((card) => {
            const parent = card.parentElement;
            if (!cardGroups.has(parent)) {
                cardGroups.set(parent, []);
            }
            cardGroups.get(parent).push(card);
        });

        cardGroups.forEach((cards, parent) => {
            gsap.to(cards, {
                opacity: 1,
                y: 0,
                duration: 0.8,
                stagger: 0.15,
                ease: 'expo.out',
                scrollTrigger: {
                    trigger: parent,
                    start: 'top 80%',
                    toggleActions: 'play none none none',
                },
            });
        });
    }

    // ═══════════════════════════════════════════
    // PARALLAX IMAGES
    // ═══════════════════════════════════════════
    function initParallaxImages() {
        gsap.utils.toArray('.parallax-img').forEach((img) => {
            gsap.to(img, {
                yPercent: -10,
                ease: 'none',
                scrollTrigger: {
                    trigger: img,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1,
                },
            });
        });
    }

    // ═══════════════════════════════════════════
    // EXPERIENCE SECTION PARALLAX
    // ═══════════════════════════════════════════
    function initExperienceParallax() {
        gsap.to('.experience-bg img', {
            yPercent: 20,
            scale: 1.1,
            ease: 'none',
            scrollTrigger: {
                trigger: '.experience',
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1,
            },
        });
    }

    // ═══════════════════════════════════════════
    // GALLERY HOVER TILT
    // ═══════════════════════════════════════════
    function initGalleryEffects() {
        if (state.isMobile) return;

        document.querySelectorAll('.gallery-item').forEach((item) => {
            item.addEventListener('mousemove', (e) => {
                const rect = item.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;

                gsap.to(item, {
                    rotationY: x * 8,
                    rotationX: -y * 8,
                    duration: 0.4,
                    ease: 'power2.out',
                    transformPerspective: 800,
                });
            });

            item.addEventListener('mouseleave', () => {
                gsap.to(item, {
                    rotationY: 0,
                    rotationX: 0,
                    duration: 0.6,
                    ease: 'elastic.out(1, 0.5)',
                });
            });
        });
    }

    // ═══════════════════════════════════════════
    // LABEL LINE ANIMATION
    // ═══════════════════════════════════════════
    function initLabelLines() {
        gsap.utils.toArray('.label-line').forEach((line) => {
            gsap.from(line, {
                width: 0,
                duration: 0.8,
                ease: 'expo.out',
                scrollTrigger: {
                    trigger: line,
                    start: 'top 85%',
                    toggleActions: 'play none none none',
                },
            });
        });
    }

    // ═══════════════════════════════════════════
    // FEATURE CARD HOVER GLOW
    // ═══════════════════════════════════════════
    function initFeatureGlow() {
        if (state.isMobile) return;

        document.querySelectorAll('.feature-card').forEach((card) => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                card.style.setProperty('--glow-x', `${x}px`);
                card.style.setProperty('--glow-y', `${y}px`);
                card.style.background = `
                    radial-gradient(300px circle at var(--glow-x) var(--glow-y),
                    rgba(201, 169, 110, 0.06), transparent 60%),
                    var(--color-bg-card)
                `;
            });

            card.addEventListener('mouseleave', () => {
                card.style.background = 'var(--color-bg-card)';
            });
        });
    }

    // ═══════════════════════════════════════════
    // BACK TO TOP
    // ═══════════════════════════════════════════
    function initBackToTop() {
        const btn = document.getElementById('backToTop');

        ScrollTrigger.create({
            start: 'top -500',
            end: 99999,
            onToggle: (self) => {
                btn.classList.toggle('visible', self.isActive);
            },
        });

        btn.addEventListener('click', (e) => {
            e.preventDefault();
            lenis.scrollTo(0, { duration: 2 });
        });
    }

    // ═══════════════════════════════════════════
    // CONTACT FORM
    // ═══════════════════════════════════════════
    function initContactForm() {
        const form = document.getElementById('contactForm');
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const btn = form.querySelector('.btn-submit');
            const originalText = btn.querySelector('.btn-text').textContent;

            btn.querySelector('.btn-text').textContent = 'Sending...';
            btn.disabled = true;

            // Simulate sending
            setTimeout(() => {
                btn.querySelector('.btn-text').textContent = 'Enquiry Sent!';
                gsap.to(btn, {
                    scale: 1.05,
                    duration: 0.2,
                    yoyo: true,
                    repeat: 1,
                });

                setTimeout(() => {
                    btn.querySelector('.btn-text').textContent = originalText;
                    btn.disabled = false;
                    form.reset();
                }, 3000);
            }, 1500);
        });
    }

    // ═══════════════════════════════════════════
    // MARQUEE DUPLICATE FOR SEAMLESS LOOP
    // ═══════════════════════════════════════════
    function initMarquee() {
        const track = document.querySelector('.marquee-track');
        const content = document.querySelector('.marquee-content');
        // Clone for seamless loop
        const clone = content.cloneNode(true);
        track.appendChild(clone);
    }

    // ═══════════════════════════════════════════
    // SECTION DIVIDER ANIMATIONS
    // ═══════════════════════════════════════════
    function initSectionAnimations() {
        // Stagger room features
        gsap.utils.toArray('.room-features').forEach((container) => {
            const items = container.querySelectorAll('span');
            gsap.from(items, {
                opacity: 0,
                y: 10,
                duration: 0.5,
                stagger: 0.1,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: container,
                    start: 'top 90%',
                    toggleActions: 'play none none none',
                },
            });
        });

        // About floating card
        gsap.from('.about-floating-card', {
            scale: 0.8,
            opacity: 0,
            duration: 0.8,
            ease: 'back.out(1.7)',
            scrollTrigger: {
                trigger: '.about-floating-card',
                start: 'top 85%',
                toggleActions: 'play none none none',
            },
        });
    }

    // ═══════════════════════════════════════════
    // RESIZE HANDLER
    // ═══════════════════════════════════════════
    function initResizeHandler() {
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                state.isMobile = window.innerWidth <= 768;
                ScrollTrigger.refresh();
            }, 250);
        });
    }

    // ═══════════════════════════════════════════
    // INITIALIZE EVERYTHING
    // ═══════════════════════════════════════════
    function init() {
        document.body.style.overflow = 'hidden';
        
        initPreloader();
        initMagneticButtons();
        initParticles();
        initNavbar();
        initSmoothScrollLinks();
        initScrollReveal();
        initParallaxImages();
        initExperienceParallax();
        initGalleryEffects();
        initLabelLines();
        initFeatureGlow();
        initBackToTop();
        initContactForm();
        initMarquee();
        initSectionAnimations();
        initResizeHandler();
    }

    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

