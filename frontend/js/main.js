// ASATEC Website Main JavaScript

class AsatecWebsite {
    constructor() {
        this.API_BASE_URL =
            window.API_BASE_URL ||
            (typeof process !== 'undefined' && process.env && process.env.API_BASE_URL) ||
            `${window.location.protocol}//${window.location.hostname}${window.location.port ? ':' + window.location.port : ''}/api`;
        this.init();
    }

    init() {
        this.initializeEventListeners();
        this.initializeNavigation();
        this.initializeHeroSection();
        this.initializeScrollEffects();
        this.loadFeaturedVideos();
    }

    initializeEventListeners() {
        // Mobile menu toggle
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        const navMenu = document.querySelector('.nav-menu');
        
        if (mobileToggle && navMenu) {
            mobileToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                mobileToggle.classList.toggle('active');
            });
        }

        // Search functionality
        const searchBtn = document.querySelector('.search-btn');
        if (searchBtn) {
            searchBtn.addEventListener('click', this.toggleSearch.bind(this));
        }

        // Language selector
        const languageSelector = document.querySelector('.language-selector');
        if (languageSelector) {
            languageSelector.addEventListener('click', this.toggleLanguageMenu.bind(this));
        }

        // Scroll to top button
        const scrollToTopBtn = document.getElementById('scrollToTop');
        if (scrollToTopBtn) {
            scrollToTopBtn.addEventListener('click', this.scrollToTop.bind(this));
        }

        // Window events
        window.addEventListener('scroll', this.handleScroll.bind(this));
        window.addEventListener('resize', this.handleResize.bind(this));
    }

    initializeNavigation() {
        // Add active state to current page
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            if (link.getAttribute('href') === currentPath) {
                link.classList.add('active');
            }
        });

        // Smooth scroll for anchor links
        const anchorLinks = document.querySelectorAll('a[href^="#"]');
        anchorLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    initializeHeroSection() {
        // Hero carousel functionality
        const indicators = document.querySelectorAll('.indicator');
        let currentSlide = 0;
        const slides = [
            {
                title: 'Leading supplier of IoT modules and solutions',
                subtitle: 'ASATEC <span class="highlight">power</span> solutions',
                description: 'We provide comprehensive IoT solutions including modules, connectivity, and smart industry applications. Our cutting-edge technology enables seamless integration across various industries.'
            },
            {
                title: 'Advanced 5G Connectivity Solutions',
                subtitle: 'Next-generation <span class="highlight">wireless</span> technology',
                description: 'Experience ultra-low latency and high-speed connectivity with our cutting-edge 5G modules designed for mission-critical applications.'
            },
            {
                title: 'Smart Industry Applications',
                subtitle: 'Transforming <span class="highlight">industries</span> worldwide',
                description: 'From smart cities to industrial automation, our IoT solutions are revolutionizing how businesses operate and connect with their customers.'
            }
        ];

        if (indicators.length > 0) {
            indicators.forEach((indicator, index) => {
                indicator.addEventListener('click', () => {
                    this.changeSlide(index, slides);
                    currentSlide = index;
                });
            });

            // Auto-advance slides
            setInterval(() => {
                currentSlide = (currentSlide + 1) % slides.length;
                this.changeSlide(currentSlide, slides);
            }, 6000);
        }

        // Animate IoT devices
        this.animateIoTDevices();
    }

    changeSlide(index, slides) {
        const heroTitle = document.querySelector('.hero-title');
        const heroSubtitle = document.querySelector('.hero-subtitle');
        const heroDescription = document.querySelector('.hero-description');
        const indicators = document.querySelectorAll('.indicator');

        // Update active indicator
        indicators.forEach((indicator, i) => {
            indicator.classList.toggle('active', i === index);
        });

        // Update content with fade effect
        if (heroTitle && heroSubtitle && heroDescription) {
            const elements = [heroTitle, heroSubtitle, heroDescription];
            
            elements.forEach(el => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(20px)';
            });

            setTimeout(() => {
                heroTitle.textContent = slides[index].title;
                heroSubtitle.innerHTML = slides[index].subtitle;
                heroDescription.textContent = slides[index].description;

                elements.forEach((el, i) => {
                    setTimeout(() => {
                        el.style.opacity = '1';
                        el.style.transform = 'translateY(0)';
                    }, i * 100);
                });
            }, 300);
        }
    }

    animateIoTDevices() {
        const devices = document.querySelectorAll('.iot-device');
        const connectionLines = document.querySelectorAll('.connection-line');

        // Animate connection lines
        connectionLines.forEach((line, index) => {
            setTimeout(() => {
                line.style.animation = 'fadeIn 0.5s ease forwards';
            }, index * 200);
        });

        // Add hover effects to devices
        devices.forEach(device => {
            device.addEventListener('mouseenter', () => {
                device.style.transform = 'scale(1.1)';
                const connectionLine = device.querySelector('.connection-line');
                if (connectionLine) {
                    connectionLine.style.opacity = '1';
                    connectionLine.style.boxShadow = '0 0 10px rgba(255, 255, 255, 0.5)';
                }
            });

            device.addEventListener('mouseleave', () => {
                device.style.transform = 'scale(1)';
                const connectionLine = device.querySelector('.connection-line');
                if (connectionLine) {
                    connectionLine.style.opacity = '0.6';
                    connectionLine.style.boxShadow = 'none';
                }
            });
        });

        // Pulse animation for tech icons
        const techIcons = document.querySelectorAll('.tech-icon');
        techIcons.forEach((icon, index) => {
            setTimeout(() => {
                icon.style.animation = 'pulse 2s ease-in-out infinite';
            }, index * 100);
        });
    }

    initializeScrollEffects() {
        // Intersection Observer for scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observe elements for animation
        const animateElements = document.querySelectorAll(
            '.section-title, .product-card, .application-card, .video-card, .tech-icon'
        );
        
        animateElements.forEach(el => {
            observer.observe(el);
        });
    }

    handleScroll() {
        const scrollY = window.scrollY;
        const scrollToTopBtn = document.getElementById('scrollToTop');
        
        // Show/hide scroll to top button
        if (scrollToTopBtn) {
            if (scrollY > 500) {
                scrollToTopBtn.classList.add('visible');
            } else {
                scrollToTopBtn.classList.remove('visible');
            }
        }

        // Parallax effect for hero background
        const heroBackground = document.querySelector('.hero-background');
        if (heroBackground) {
            const parallaxSpeed = 0.5;
            heroBackground.style.transform = `translateY(${scrollY * parallaxSpeed}px)`;
        }

        // Header background on scroll
        const header = document.querySelector('.header');
        if (header) {
            if (scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
    }

    handleResize() {
        // Handle mobile menu on resize
        if (window.innerWidth > 768) {
            const navMenu = document.querySelector('.nav-menu');
            const mobileToggle = document.querySelector('.mobile-menu-toggle');
            
            if (navMenu) navMenu.classList.remove('active');
            if (mobileToggle) mobileToggle.classList.remove('active');
        }
    }

    toggleSearch() {
        // Implement search functionality
        console.log('Search functionality to be implemented');
    }

    toggleLanguageMenu() {
        // Implement language selection
        console.log('Language selection to be implemented');
    }

    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    async loadFeaturedVideos() {
        const videosGrid = document.getElementById('videosGrid');
        if (!videosGrid) return;

        try {
            // Show loading state
            videosGrid.innerHTML = `
                <div class="video-card loading">
                    <div class="video-thumbnail">
                        <div class="loading-placeholder"></div>
                    </div>
                    <div class="video-info">
                        <div class="loading-placeholder-text"></div>
                        <div class="loading-placeholder-text" style="width: 60%; margin-top: 8px;"></div>
                    </div>
                </div>
            `.repeat(3);

            // Fetch videos from API
            const response = await fetch(`${this.API_BASE_URL}/media?type=0&featured=true`);
            
            if (!response.ok) {
                throw new Error('Failed to fetch videos');
            }

            const videos = await response.json();
            
            // Render videos
            videosGrid.innerHTML = videos.slice(0, 3).map(video => `
                <div class="video-card" data-video-id="${video.id}">
                    <div class="video-thumbnail">
                        <img src="${video.thumbnailUrl}" alt="${video.title}" loading="lazy">
                        <div class="play-button">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M8 5V19L19 12L8 5Z" fill="currentColor"/>
                            </svg>
                        </div>
                    </div>
                    <div class="video-info">
                        <h3 class="video-title">${video.title}</h3>
                        <p class="video-description">${video.description}</p>
                        <div class="video-meta">
                            <span class="video-duration">${video.duration}</span>
                            <span class="video-views">${video.viewCount} views</span>
                        </div>
                    </div>
                </div>
            `).join('');

            // Add click handlers for videos
            const videoCards = videosGrid.querySelectorAll('.video-card');
            videoCards.forEach(card => {
                card.addEventListener('click', () => {
                    const videoId = card.dataset.videoId;
                    this.playVideo(videoId);
                });
            });

        } catch (error) {
            console.error('Error loading videos:', error);
            videosGrid.innerHTML = `
                <div class="alert alert-error">
                    <p>Unable to load videos at this time. Please try again later.</p>
                </div>
            `;
        }
    }

    async playVideo(videoId) {
        try {
            // Fetch video details
            const response = await fetch(`${this.API_BASE_URL}/media/${videoId}`);
            const video = await response.json();

            // Create modal for video player
            const modal = document.createElement('div');
            modal.className = 'modal-overlay active';
            modal.innerHTML = `
                <div class="modal">
                    <div class="modal-header">
                        <h2 class="modal-title">${video.title}</h2>
                        <button class="modal-close">&times;</button>
                    </div>
                    <div class="modal-body">
                        <video controls autoplay style="width: 100%; height: auto;">
                            <source src="${video.url}" type="video/mp4">
                            Your browser does not support the video tag.
                        </video>
                        <p style="margin-top: 1rem; color: var(--text-light);">${video.description}</p>
                    </div>
                </div>
            `;

            document.body.appendChild(modal);

            // Close modal functionality
            const closeBtn = modal.querySelector('.modal-close');
            const closeModal = () => {
                modal.classList.remove('active');
                setTimeout(() => {
                    document.body.removeChild(modal);
                }, 300);
            };

            closeBtn.addEventListener('click', closeModal);
            modal.addEventListener('click', (e) => {
                if (e.target === modal) closeModal();
            });

        } catch (error) {
            console.error('Error playing video:', error);
        }
    }

    // Utility methods
    showAlert(message, type = 'info') {
        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`;
        alert.innerHTML = `<p>${message}</p>`;
        
        document.body.appendChild(alert);
        
        setTimeout(() => {
            alert.style.opacity = '0';
            setTimeout(() => {
                if (document.body.contains(alert)) {
                    document.body.removeChild(alert);
                }
            }, 300);
        }, 5000);
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// Additional CSS animations
const additionalStyles = `
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes pulse {
        0%, 100% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.05);
        }
    }

    .animate-in {
        animation: fadeIn 0.6s ease forwards;
    }

    .header.scrolled {
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(10px);
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }

    .nav-menu.active {
        display: flex;
        flex-direction: column;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: var(--white);
        padding: var(--spacing-lg);
        box-shadow: 0 4px 12px var(--shadow-light);
        z-index: 1000;
    }

    .mobile-menu-toggle.active span:nth-child(1) {
        transform: rotate(45deg) translate(5px, 5px);
    }

    .mobile-menu-toggle.active span:nth-child(2) {
        opacity: 0;
    }

    .mobile-menu-toggle.active span:nth-child(3) {
        transform: rotate(-45deg) translate(7px, -6px);
    }
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// Initialize the website when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AsatecWebsite();
});