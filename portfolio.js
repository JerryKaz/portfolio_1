// portfolio.js - Professional Portfolio Script
document.addEventListener('DOMContentLoaded', function() {
    // ============================
    // MOBILE VIEWPORT FIX
    // ============================
    function fixMobileViewport() {
        // Prevent horizontal scroll
        document.body.style.maxWidth = '100vw';
        document.body.style.overflowX = 'hidden';
        
        // Set proper viewport meta tag if not present
        if (!document.querySelector('meta[name="viewport"]')) {
            const viewportMeta = document.createElement('meta');
            viewportMeta.name = 'viewport';
            viewportMeta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
            document.head.appendChild(viewportMeta);
        }
        
        // Check if mobile and adjust
        checkViewport();
    }
    
    // Call immediately
    fixMobileViewport();
    
    // ============================
    // THEME MANAGER
    // ============================
    class ThemeManager {
        constructor() {
            this.themeToggle = document.getElementById('theme-toggle');
            this.systemPreference = window.matchMedia('(prefers-color-scheme: light)');
            this.init();
        }
        
        init() {
            const savedTheme = localStorage.getItem('portfolio-theme');
            const systemTheme = this.systemPreference.matches ? 'light' : 'dark';
            const initialTheme = savedTheme || 'system';
            
            this.setTheme(initialTheme);
            
            if (this.themeToggle) {
                if (initialTheme === 'system') {
                    this.themeToggle.checked = systemTheme === 'light';
                } else {
                    this.themeToggle.checked = initialTheme === 'light';
                }
            }
            
            this.systemPreference.addEventListener('change', (e) => {
                if (localStorage.getItem('portfolio-theme') === 'system') {
                    const newTheme = e.matches ? 'light' : 'dark';
                    this.applyTheme(newTheme);
                    this.updateToggleState('system');
                }
            });
            
            this.setupToggle();
        }
        
        setTheme(theme) {
            localStorage.setItem('portfolio-theme', theme);
            
            let appliedTheme;
            if (theme === 'system') {
                appliedTheme = this.systemPreference.matches ? 'light' : 'dark';
            } else {
                appliedTheme = theme;
            }
            
            this.applyTheme(appliedTheme);
            this.updateToggleState(theme);
            this.updateThemeIndicator(theme);
        }
        
        applyTheme(theme) {
            document.documentElement.setAttribute('data-theme', theme);
            
            document.body.classList.add('theme-transition');
            setTimeout(() => {
                document.body.classList.remove('theme-transition');
            }, 500);
            
            updateBadgeColors(theme);
            document.dispatchEvent(new CustomEvent('themeChanged', { detail: theme }));
        }
        
        updateToggleState(theme) {
            if (!this.themeToggle) return;
            
            if (theme === 'system') {
                const systemTheme = this.systemPreference.matches ? 'light' : 'dark';
                this.themeToggle.checked = systemTheme === 'light';
            } else {
                this.themeToggle.checked = theme === 'light';
            }
        }
        
        updateThemeIndicator(theme) {
            const themeIndicator = document.getElementById('theme-indicator');
            if (themeIndicator) {
                let text = '';
                switch(theme) {
                    case 'light': text = 'Light Mode'; break;
                    case 'dark': text = 'Dark Mode'; break;
                    case 'system': text = 'Auto'; break;
                }
                themeIndicator.textContent = text;
            }
        }
        
        setupToggle() {
            if (!this.themeToggle) return;
            
            this.themeToggle.addEventListener('change', () => {
                const currentTheme = localStorage.getItem('portfolio-theme') || 'system';
                let nextTheme;
                
                if (currentTheme === 'system') {
                    nextTheme = this.themeToggle.checked ? 'light' : 'dark';
                } else if (currentTheme === 'light') {
                    nextTheme = 'dark';
                } else {
                    nextTheme = 'system';
                }
                
                this.setTheme(nextTheme);
            });
        }
        
        getCurrentTheme() {
            const saved = localStorage.getItem('portfolio-theme') || 'system';
            if (saved === 'system') {
                return this.systemPreference.matches ? 'light' : 'dark';
            }
            return saved;
        }
    }
    
    const themeManager = new ThemeManager();
    
    // ============================
    // BADGE COLORS
    // ============================
    function updateBadgeColors(theme) {
        const techBadges = document.querySelectorAll('.tech-badge');
        techBadges.forEach(badge => {
            const tooltip = badge.getAttribute('data-tooltip');
            if (tooltip) {
                const colorScheme = getBadgeColorScheme(tooltip, theme);
                Object.assign(badge.style, colorScheme);
            }
        });
    }
    
    function getBadgeColorScheme(tooltip, theme) {
        const isLight = theme === 'light';
        
        const schemes = {
            'SIN': {
                background: isLight 
                    ? 'linear-gradient(135deg, #2563eb, #7c3aed)' 
                    : 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                color: 'white'
            },
            '12.1 George 3': {
                background: isLight 
                    ? 'rgba(255, 255, 255, 0.9)' 
                    : 'rgba(30, 41, 59, 0.9)',
                color: isLight ? '#2563eb' : '#3b82f6'
            },
            '5': {
                background: isLight 
                    ? 'linear-gradient(135deg, #06b6d4, #3b82f6)' 
                    : 'linear-gradient(135deg, #22d3ee, #3b82f6)',
                color: 'white'
            },
            'php': {
                background: isLight 
                    ? 'rgba(255, 255, 255, 0.9)' 
                    : 'rgba(30, 41, 59, 0.9)',
                color: isLight ? '#7c3aed' : '#8b5cf6'
            },
            'JS': {
                background: isLight 
                    ? 'rgba(255, 255, 255, 0.9)' 
                    : 'rgba(30, 41, 59, 0.9)',
                color: isLight ? '#f59e0b' : '#fbbf24'
            },
            'default': {
                background: isLight 
                    ? 'rgba(255, 255, 255, 0.9)' 
                    : 'rgba(30, 41, 59, 0.9)',
                color: isLight ? '#4b5563' : '#cbd5e1'
            }
        };
        
        return schemes[tooltip] || schemes.default;
    }
    
    updateBadgeColors(themeManager.getCurrentTheme());
    
    // ============================
    // MOBILE NAVIGATION
    // ============================
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function(e) {
            e.stopPropagation();
            this.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
            document.body.style.position = navMenu.classList.contains('active') ? 'fixed' : '';
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (navMenu.classList.contains('active') && 
                !navMenu.contains(e.target) && 
                !hamburger.contains(e.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
                document.body.style.position = '';
            }
        });
    }
    
    // Close mobile menu when clicking links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            }
            
            if (hamburger) hamburger.classList.remove('active');
            if (navMenu) navMenu.classList.remove('active');
            document.body.style.overflow = '';
            document.body.style.position = '';
            
            document.querySelectorAll('.nav-link').forEach(item => {
                item.classList.remove('active');
            });
            this.classList.add('active');
        });
    });
    
    // ============================
    // SCROLL EFFECTS
    // ============================
    const header = document.querySelector('.header');
    window.addEventListener('scroll', function() {
        if (header) {
            header.classList.toggle('scrolled', window.scrollY > 50);
        }
        
        updateActiveNavLink();
        
        const backToTop = document.getElementById('backToTop');
        if (backToTop) {
            backToTop.classList.toggle('visible', window.scrollY > 500);
        }
        
        animateBadgesOnScroll();
    });
    
    // Back to Top
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        backToTop.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Active Nav Link
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
        
        let currentSection = '';
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }
    
    // ============================
    // ANIMATIONS
    // ============================
    // Counter Animation
    const statNumbers = document.querySelectorAll('.stat-number');
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                statNumbers.forEach(number => {
                    if (!number.hasAttribute('data-animated')) {
                        number.setAttribute('data-animated', 'true');
                        animateCounter(number);
                    }
                });
            }
        });
    }, { threshold: 0.5 });
    
    const heroSection = document.querySelector('.hero');
    if (heroSection) statsObserver.observe(heroSection);
    
    function animateCounter(element) {
        const target = parseInt(element.getAttribute('data-count')) || 0;
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;
        
        const update = () => {
            current += increment;
            if (current < target) {
                element.textContent = Math.floor(current);
                requestAnimationFrame(update);
            } else {
                element.textContent = target;
            }
        };
        update();
    }
    
    // Skill Bars Animation
    const skillBars = document.querySelectorAll('.skill-progress');
    const skillsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                skillBars.forEach(bar => {
                    const width = bar.getAttribute('data-width') || '0';
                    bar.style.width = '0';
                    setTimeout(() => {
                        bar.style.width = width + '%';
                    }, 300);
                });
                skillsObserver.disconnect();
            }
        });
    }, { threshold: 0.3 });
    
    const skillsSection = document.querySelector('.skills');
    if (skillsSection) skillsObserver.observe(skillsSection);
    
    // Badge Animations
    function animateBadgesOnScroll() {
        const techBadges = document.querySelectorAll('.tech-badge');
        if (heroSection) {
            const heroRect = heroSection.getBoundingClientRect();
            const isHeroVisible = heroRect.top < window.innerHeight && heroRect.bottom >= 0;
            
            if (isHeroVisible) {
                techBadges.forEach((badge, index) => {
                    badge.style.animationPlayState = 'running';
                    badge.style.animationDelay = `${index * 0.2}s`;
                });
            }
        }
    }
    animateBadgesOnScroll();
    
    // ============================
    // INTERACTIVE ELEMENTS
    // ============================
    // Badge Interactions
    document.querySelectorAll('.tech-badge').forEach(badge => {
        badge.setAttribute('tabindex', '0');
        badge.addEventListener('click', function() {
            const tooltip = this.getAttribute('data-tooltip');
            if (tooltip) {
                showNotification(`Clicked: ${tooltip}`, 'info');
                this.style.transform = 'scale(1.2) rotate(10deg)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 300);
            }
        });
        
        badge.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
    
    // ============================
    // FILE UPLOAD
    // ============================
    const uploadArea = document.getElementById('uploadArea');
    const certificateUpload = document.getElementById('certificateUpload');
    const uploadedFiles = document.getElementById('uploadedFiles');
    
    if (uploadArea && certificateUpload) {
        uploadArea.addEventListener('click', () => certificateUpload.click());
        
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, preventDefaults, false);
        });
        
        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }
        
        ['dragenter', 'dragover'].forEach(eventName => {
            uploadArea.addEventListener(eventName, highlight, false);
        });
        
        ['dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, unhighlight, false);
        });
        
        function highlight() {
            uploadArea.style.borderColor = 'var(--primary-color)';
            uploadArea.style.backgroundColor = 'var(--surface-color-light)';
        }
        
        function unhighlight() {
            uploadArea.style.borderColor = '';
            uploadArea.style.backgroundColor = '';
        }
        
        uploadArea.addEventListener('drop', handleDrop, false);
        certificateUpload.addEventListener('change', function() {
            handleFiles(this.files);
        });
        
        function handleDrop(e) {
            handleFiles(e.dataTransfer.files);
        }
        
        function handleFiles(files) {
            [...files].forEach(file => {
                if (file.size > 5 * 1024 * 1024) {
                    showNotification('File too large (max 5MB)', 'error');
                    return;
                }
                
                const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
                if (!validTypes.includes(file.type)) {
                    showNotification('Invalid file type', 'error');
                    return;
                }
                
                displayFile(file);
            });
        }
        
        function displayFile(file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const fileItem = document.createElement('div');
                fileItem.className = 'file-item';
                fileItem.innerHTML = `
                    <div class="file-preview">
                        <i class="fas fa-file-${file.type === 'application/pdf' ? 'pdf' : 'image'}"></i>
                    </div>
                    <div class="file-info">
                        <h5>${file.name}</h5>
                        <p>${(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                    <button class="file-remove">
                        <i class="fas fa-times"></i>
                    </button>
                `;
                
                fileItem.querySelector('.file-remove').addEventListener('click', () => {
                    fileItem.style.animation = 'fadeOut 0.3s ease';
                    setTimeout(() => {
                        fileItem.remove();
                        showNotification('File removed', 'success');
                    }, 300);
                });
                
                uploadedFiles.appendChild(fileItem);
                showNotification('File uploaded', 'success');
            };
            reader.readAsDataURL(file);
        }
    }
    
    // Add Certificate
    const addCertificateBtn = document.getElementById('addCertificateBtn');
    if (addCertificateBtn) {
        addCertificateBtn.addEventListener('click', function() {
            const url = prompt('Certificate URL:', 'https://');
            const title = prompt('Title:');
            const issuer = prompt('Issuer:');
            
            if (url && title && issuer) {
                const certificatesGrid = document.querySelector('.certificates-grid');
                if (certificatesGrid) {
                    const certificateItem = document.createElement('div');
                    certificateItem.className = 'certificate-item';
                    certificateItem.innerHTML = `
                        <div class="certificate-icon">
                            <i class="fas fa-certificate"></i>
                        </div>
                        <div class="certificate-info">
                            <h4>${title}</h4>
                            <p>${issuer}</p>
                            <a href="${url}" target="_blank">View</a>
                        </div>
                    `;
                    certificatesGrid.appendChild(certificateItem);
                    showNotification('Certificate added', 'success');
                }
            }
        });
    }
    
    // ============================
    // CONTACT FORM
    // ============================
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const subject = document.getElementById('subject').value.trim();
            const message = document.getElementById('message').value.trim();
            
            if (!name || !email || !subject || !message) {
                showNotification('Please fill all fields', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showNotification('Invalid email', 'error');
                return;
            }
            
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                showNotification('Message sent!', 'success');
                this.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 1500);
        });
    }
    
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    
    // ============================
    // NOTIFICATION SYSTEM
    // ============================
    function showNotification(message, type) {
        const existing = document.querySelector('.notification');
        if (existing) existing.remove();
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            info: 'info-circle'
        };
        
        notification.innerHTML = `
            <i class="fas fa-${icons[type] || 'info-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        document.body.appendChild(notification);
        
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        });
        
        const autoRemove = setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }, 5000);
        
        notification.addEventListener('mouseenter', () => clearTimeout(autoRemove));
        notification.addEventListener('mouseleave', () => {
            setTimeout(() => {
                notification.style.animation = 'slideOut 0.3s ease-out';
                setTimeout(() => notification.remove(), 300);
            }, 2000);
        });
    }
    
    // ============================
    // MOBILE VIEWPORT DETECTION
    // ============================
    function checkViewport() {
        const isMobile = window.innerWidth <= 768;
        document.body.classList.toggle('mobile-view', isMobile);
        
        // Adjust mobile-specific styles
        if (isMobile) {
            // Ensure proper touch handling
            document.body.style.touchAction = 'pan-y';
            document.body.style.webkitTapHighlightColor = 'transparent';
            
            // Adjust font sizes for mobile if needed
            const html = document.documentElement;
            html.style.fontSize = '14px'; // Base mobile font size
            
            // Fix for iOS viewport height
            const setVh = () => {
                const vh = window.innerHeight * 0.01;
                document.documentElement.style.setProperty('--vh', `${vh}px`);
            };
            setVh();
            window.addEventListener('resize', setVh);
        }
    }
    
    // ============================
    // INITIALIZATION
    // ============================
    // Add mobile-friendly CSS
    const mobileStyles = document.createElement('style');
    mobileStyles.textContent = `
        /* Mobile fixes */
        body.mobile-view {
            -webkit-text-size-adjust: 100%;
            -moz-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
            text-size-adjust: 100%;
        }
        
        /* Prevent horizontal scroll */
        body {
            max-width: 100vw;
            overflow-x: hidden;
            position: relative;
        }
        
        /* Mobile menu fixes */
        .nav-menu.active {
            position: fixed;
            top: 70px;
            left: 0;
            right: 0;
            bottom: 0;
            background: var(--surface-color);
            z-index: 1000;
            overflow-y: auto;
        }
        
        /* Mobile-friendly animations */
        @media (max-width: 768px) {
            .file-item {
                flex-wrap: wrap;
                padding: 10px;
            }
            
            .file-info h5 {
                max-width: 150px;
            }
            
            .notification {
                left: 20px;
                right: 20px;
                max-width: none;
            }
            
            /* Prevent zoom on input focus in iOS */
            input, textarea, select {
                font-size: 16px !important;
            }
        }
        
        /* Smooth transitions */
        * {
            transition: background-color 0.3s ease,
                       color 0.3s ease,
                       border-color 0.3s ease;
        }
        
        .theme-transition * {
            transition: all 0.5s ease !important;
        }
        
        /* File item animations */
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fadeOut {
            from { opacity: 1; transform: translateY(0); }
            to { opacity: 0; transform: translateY(10px); }
        }
        
        /* Notification animations */
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px;
            border-radius: 8px;
            color: white;
            z-index: 9999;
            animation: slideIn 0.3s ease;
            max-width: 300px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .notification.success {
            background: linear-gradient(135deg, #10b981, #059669);
        }
        
        .notification.error {
            background: linear-gradient(135deg, #ef4444, #dc2626);
        }
        
        .notification.info {
            background: linear-gradient(135deg, #3b82f6, #2563eb);
        }
        
        .notification-close {
            margin-left: auto;
            background: none;
            border: none;
            color: white;
            cursor: pointer;
        }
        
        /* Mobile specific */
        @media (max-width: 480px) {
            .container {
                padding-left: 15px !important;
                padding-right: 15px !important;
            }
            
            section {
                padding: 40px 15px !important;
            }
            
            .tech-badge {
                padding: 6px 12px !important;
                font-size: 0.8rem !important;
            }
        }
    `;
    document.head.appendChild(mobileStyles);
    
    // Initialize
    updateActiveNavLink();
    checkViewport();
    window.addEventListener('resize', checkViewport);
    window.addEventListener('orientationchange', checkViewport);
    
    // Welcome message
    setTimeout(() => {
        showNotification('Portfolio loaded successfully!', 'info');
    }, 500);
    
    // Image loading
    document.querySelectorAll('img').forEach(img => {
        if (!img.complete) {
            img.style.opacity = '0';
            img.addEventListener('load', function() {
                this.style.opacity = '1';
                this.style.transition = 'opacity 0.5s ease';
            });
        }
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 't') {
            e.preventDefault();
            const themeToggle = document.getElementById('theme-toggle');
            if (themeToggle) {
                themeToggle.click();
            }
        }
        
        if (e.key === 'Escape') {
            if (hamburger) hamburger.classList.remove('active');
            if (navMenu) navMenu.classList.remove('active');
            document.body.style.overflow = '';
            document.body.style.position = '';
        }
    });
});


// Add this to the end of your JavaScript file, right before the last });

// Mobile-specific fixes
function applyMobileFixes() {
    if (window.innerWidth <= 768) {
        // Adjust container padding
        const containers = document.querySelectorAll('.container');
        containers.forEach(container => {
            container.style.paddingLeft = '15px';
            container.style.paddingRight = '15px';
        });
        
        // Adjust font sizes for better readability
        document.documentElement.style.fontSize = '14px';
        
        // Fix for iOS viewport height
        const setVh = () => {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        };
        setVh();
        window.addEventListener('resize', setVh);
        
        // Prevent zoom on input focus
        const inputs = document.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.style.fontSize = '16px';
        });
    }
}

// Run on load and resize
applyMobileFixes();
window.addEventListener('resize', applyMobileFixes);
window.addEventListener('orientationchange', applyMobileFixes);

