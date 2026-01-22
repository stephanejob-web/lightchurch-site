document.addEventListener('DOMContentLoaded', function () {
    // Accélérer les vidéos de présentation
    document.querySelectorAll('.hero video, .mobile-main-display video').forEach(video => {
        video.playbackRate = 1.5; // 1.5x plus rapide (ajuster entre 1.0 et 2.0)
    });

    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    menuToggle.addEventListener('click', function () {
        navLinks.classList.toggle('active');
        this.classList.toggle('active');
    });

    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            menuToggle.classList.remove('active');
        });
    });

    // Image galleries with dots navigation
    document.querySelectorAll('.feature-gallery').forEach(gallery => {
        const images = gallery.querySelectorAll('.gallery-img');
        const dots = gallery.querySelectorAll('.dot');
        let currentIndex = 0;
        let autoPlayInterval;

        function showImage(index) {
            images.forEach((img, i) => {
                img.classList.toggle('active', i === index);
            });
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
            currentIndex = index;
        }

        // Auto-play gallery
        function startAutoPlay() {
            autoPlayInterval = setInterval(() => {
                const nextIndex = (currentIndex + 1) % images.length;
                showImage(nextIndex);
            }, 4000);
        }

        function stopAutoPlay() {
            clearInterval(autoPlayInterval);
        }

        // Click on dots
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                stopAutoPlay();
                showImage(index);
                startAutoPlay();
            });
        });

        // Click on image to go to next
        images.forEach(img => {
            img.addEventListener('click', () => {
                stopAutoPlay();
                const nextIndex = (currentIndex + 1) % images.length;
                showImage(nextIndex);
                startAutoPlay();
            });
            img.style.cursor = 'pointer';
        });

        // Pause on hover
        gallery.addEventListener('mouseenter', stopAutoPlay);
        gallery.addEventListener('mouseleave', startAutoPlay);

        // Start auto-play
        startAutoPlay();
    });

    // Modal for mobile screenshots
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <span class="modal-close">&times;</span>
        <img src="" alt="Image agrandie">
    `;
    document.body.appendChild(modal);

    const modalImg = modal.querySelector('img');
    const modalClose = modal.querySelector('.modal-close');

    document.querySelectorAll('.phone-screen img').forEach(img => {
        img.addEventListener('click', () => {
            modalImg.src = img.src;
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    modalClose.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Smooth scroll for navigation with offset for fixed header
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight - 20;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });


    // Smart Navbar & Scroll Progress
    const header = document.querySelector('.header');
    let lastScrollY = window.scrollY;

    // Create Scroll Progress Bar
    const progressBarContainer = document.createElement('div');
    progressBarContainer.className = 'scroll-progress-container';
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress-bar';
    progressBarContainer.appendChild(progressBar);
    header.appendChild(progressBarContainer);

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;

        // Header Shadow
        if (currentScrollY > 50) {
            header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
            header.style.background = 'rgba(255, 255, 255, 0.98)'; // More opaque on scroll
        } else {
            header.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
            header.style.background = 'rgba(255, 255, 255, 0.95)';
        }

        // Smart Hide/Show
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
            header.classList.add('header--hidden');
        } else {
            header.classList.remove('header--hidden');
        }
        lastScrollY = currentScrollY;

        // Update Scroll Progress Bar
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + "%";

        // Hero Parallax Effect (Disable on mobile)
        const heroSection = document.querySelector('.hero');
        if (window.innerWidth > 768 && heroSection && currentScrollY <= heroSection.offsetHeight) {
            const heroContent = document.querySelector('.hero-content');
            const heroImage = document.querySelector('.hero-image');
            const heroCanvas = document.getElementById('hero-network-canvas');

            // Move content slower than scroll (0.4x speed)
            if (heroContent) heroContent.style.transform = `translateY(${currentScrollY * 0.4}px)`;

            // Move image slightly faster than content but slower than scroll (0.25x speed)
            // This creates depth between text and image
            if (heroImage) heroImage.style.transform = `translateY(${currentScrollY * 0.25}px)`;

            // Canvas moves even slower (0.1x) to stay "far away"
            if (heroCanvas) heroCanvas.style.transform = `translateY(${currentScrollY * 0.1}px)`;
        } else if (window.innerWidth <= 768) {
            // Reset transforms on mobile to ensure visibility
            const heroContent = document.querySelector('.hero-content');
            if (heroContent) heroContent.style.transform = 'none';
        }
    });

    // Active Link Highlighting with Intersection Observer
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-links a');

    const activeLinkObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const currentId = entry.target.getAttribute('id');
                navItems.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${currentId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, {
        rootMargin: '-50% 0px -50% 0px' // Trigger when section is in middle of viewport
    });

    sections.forEach(section => activeLinkObserver.observe(section));


    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Add animation to cards and feature blocks
    document.querySelectorAll('.problem-card, .solution-feature, .benefits-column, .feature-block, .privacy-card, .privacy-comparison, .trust-badge, .network-card, .network-stats, .network-cta').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});
