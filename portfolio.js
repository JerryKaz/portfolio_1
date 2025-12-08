// portfolio.js - Professional Portfolio Script

document.addEventListener('DOMContentLoaded', function() {
    // Theme Manager Class
    class ThemeManager {
        constructor() {
            this.themeToggle = document.getElementById('theme-toggle');
            this.systemPreference = window.matchMedia('(prefers-color-scheme: light)');
            this.init();
        }
        
        init() {
            // Get saved theme or detect system preference
            const savedTheme = localStorage.getItem('portfolio-theme');
            const systemTheme = this.systemPreference.matches ? 'light' : 'dark';
            const initialTheme = savedTheme || 'system';
            
            // Set initial theme
            this.setTheme(initialTheme);
            
            // Update toggle state
            if (this.themeToggle) {
                if (initialTheme === 'system') {
                    this.themeToggle.checked = systemTheme === 'light';
                } else {
                    this.themeToggle.checked = initialTheme === 'light';
                }
            }
            
            // Listen for system preference changes
            this.systemPreference.addEventListener('change', (e) => {
                if (localStorage.getItem('portfolio-theme') === 'system') {
                    const newTheme = e.matches ? 'light' : 'dark';
                    this.applyTheme(newTheme);
                    this.updateToggleState('system');
                }
            });
            
            // Setup toggle listener
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
            
            // Add transition class for smooth theme change
            document.body.classList.add('theme-transition');
            setTimeout(() => {
                document.body.classList.remove('theme-transition');
            }, 500);
            
            // Update badge colors based on theme
            updateBadgeColors(theme);
            
            // Dispatch custom event for other components
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
            // Update theme indicator text if exists
            const themeIndicator = document.getElementById('theme-indicator');
            if (themeIndicator) {
                let text = '';
                switch(theme) {
                    case 'light': text = 'Light Mode'; break;
                    case 'dark': text = 'Dark Mode'; break;
                    case 'system': text = 'Auto (System)'; break;
                }
                themeIndicator.textContent = text;
            }
        }
        
        setupToggle() {
            if (!this.themeToggle) return;
            
            // Create cycle toggle (light -> dark -> system -> light)
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
            
            // Add right-click/double-click to toggle through all options
            this.themeToggle.addEventListener('dblclick', (e) => {
                e.preventDefault();
                const currentTheme = localStorage.getItem('portfolio-theme') || 'system';
                let nextTheme;
                
                switch(currentTheme) {
                    case 'light': nextTheme = 'dark'; break;
                    case 'dark': nextTheme = 'system'; break;
                    case 'system': nextTheme = 'light'; break;
                    default: nextTheme = 'light';
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
    
    // Initialize Theme Manager
    const themeManager = new ThemeManager();
    
    // Enhanced badge color update function
    function updateBadgeColors(theme) {
        const techBadges = document.querySelectorAll('.tech-badge');
        techBadges.forEach(badge => {
            const tooltip = badge.getAttribute('data-tooltip');
            if (tooltip) {
                const colorScheme = getBadgeColorScheme(tooltip, theme);
                badge.style.background = colorScheme.background;
                badge.style.color = colorScheme.color;
                badge.style.boxShadow = colorScheme.shadow;
                badge.style.border = colorScheme.border;
            }
        });
    }
    
    function getBadgeColorScheme(tooltip, theme) {
        const isLight = theme === 'light';
        
        switch(tooltip) {
            case 'SIN':
                return {
                    background: isLight 
                        ? 'linear-gradient(135deg, #2563eb, #7c3aed)' 
                        : 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                    color: 'white',
                    shadow: isLight 
                        ? '0 4px 15px rgba(37, 99, 235, 0.3)' 
                        : '0 4px 15px rgba(59, 130, 246, 0.3)',
                    border: 'none'
                };
            case '12.1 George 3':
                return {
                    background: isLight 
                        ? 'rgba(255, 255, 255, 0.9)' 
                        : 'rgba(30, 41, 59, 0.9)',
                    color: isLight ? '#2563eb' : '#3b82f6',
                    shadow: isLight 
                        ? '0 2px 8px rgba(0, 0, 0, 0.1)' 
                        : '0 2px 8px rgba(0, 0, 0, 0.3)',
                    border: isLight 
                        ? '1px solid rgba(37, 99, 235, 0.2)' 
                        : '1px solid rgba(59, 130, 246, 0.3)'
                };
            case '5':
                return {
                    background: isLight 
                        ? 'linear-gradient(135deg, #06b6d4, #3b82f6)' 
                        : 'linear-gradient(135deg, #22d3ee, #3b82f6)',
                    color: 'white',
                    shadow: isLight 
                        ? '0 4px 15px rgba(6, 182, 212, 0.3)' 
                        : '0 4px 15px rgba(34, 211, 238, 0.3)',
                    border: 'none'
                };
            case 'php':
                return {
                    background: isLight 
                        ? 'rgba(255, 255, 255, 0.9)' 
                        : 'rgba(30, 41, 59, 0.9)',
                    color: isLight ? '#7c3aed' : '#8b5cf6',
                    shadow: isLight 
                        ? '0 2px 8px rgba(0, 0, 0, 0.1)' 
                        : '0 2px 8px rgba(0, 0, 0, 0.3)',
                    border: isLight 
                        ? '1px solid rgba(124, 58, 237, 0.2)' 
                        : '1px solid rgba(139, 92, 246, 0.3)'
                };
            case 'JS':
                return {
                    background: isLight 
                        ? 'rgba(255, 255, 255, 0.9)' 
                        : 'rgba(30, 41, 59, 0.9)',
                    color: isLight ? '#f59e0b' : '#fbbf24',
                    shadow: isLight 
                        ? '0 2px 8px rgba(0, 0, 0, 0.1)' 
                        : '0 2px 8px rgba(0, 0, 0, 0.3)',
                    border: isLight 
                        ? '1px solid rgba(245, 158, 11, 0.2)' 
                        : '1px solid rgba(251, 191, 36, 0.3)'
                };
            default:
                return {
                    background: isLight 
                        ? 'rgba(255, 255, 255, 0.9)' 
                        : 'rgba(30, 41, 59, 0.9)',
                    color: isLight ? '#4b5563' : '#cbd5e1',
                    shadow: isLight 
                        ? '0 2px 8px rgba(0, 0, 0, 0.1)' 
                        : '0 2px 8px rgba(0, 0, 0, 0.3)',
                    border: isLight 
                        ? '1px solid rgba(0, 0, 0, 0.1)' 
                        : '1px solid rgba(255, 255, 255, 0.1)'
                };
        }
    }
    
    // Initialize badge colors
    updateBadgeColors(themeManager.getCurrentTheme());
    
    // Mobile Navigation Toggle
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            this.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });
    }
    
    // Close mobile menu when clicking on a link
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
            
            // Update active nav link
            document.querySelectorAll('.nav-link').forEach(item => {
                item.classList.remove('active');
            });
            this.classList.add('active');
        });
    });
    
    // Header scroll effect
    const header = document.querySelector('.header');
    window.addEventListener('scroll', function() {
        if (header) {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
        
        // Update active nav link based on scroll position
        updateActiveNavLink();
        
        // Show/hide back to top button
        const backToTop = document.getElementById('backToTop');
        if (backToTop) {
            if (window.scrollY > 500) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        }
        
        // Animate badges on scroll into view
        animateBadgesOnScroll();
    });
    
    // Back to Top Button
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        backToTop.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Update active navigation link based on scroll position
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
        
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
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
    
    // Animated counter for stats
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const animateCounter = (element) => {
        const target = parseInt(element.getAttribute('data-count')) || 0;
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
            current += step;
            if (current < target) {
                element.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        };
        
        updateCounter();
    };
    
    // Intersection Observer for stats animation
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && statNumbers.length > 0) {
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
    if (heroSection) {
        statsObserver.observe(heroSection);
    }
    
    // Animate skill bars on scroll
    const skillBars = document.querySelectorAll('.skill-progress');
    
    const animateSkillBars = () => {
        skillBars.forEach(bar => {
            const width = bar.getAttribute('data-width') || '0';
            bar.style.width = '0';
            
            setTimeout(() => {
                bar.style.width = width + '%';
            }, 300);
        });
    };
    
    const skillsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && skillBars.length > 0) {
                animateSkillBars();
                skillsObserver.disconnect();
            }
        });
    }, { threshold: 0.3 });
    
    const skillsSection = document.querySelector('.skills');
    if (skillsSection) {
        skillsObserver.observe(skillsSection);
    }
    
    // Animate badges on scroll
    function animateBadgesOnScroll() {
        const techBadges = document.querySelectorAll('.tech-badge');
        const heroSection = document.querySelector('.hero');
        
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
    
    // Initialize badge animations
    animateBadgesOnScroll();
    
    // Interactive badge effects
    const techBadges = document.querySelectorAll('.tech-badge');
    techBadges.forEach(badge => {
        // Add click effect
        badge.addEventListener('click', function() {
            const tooltip = this.getAttribute('data-tooltip');
            if (tooltip) {
                showNotification(`Clicked on: ${tooltip}`, 'info');
                
                // Add visual feedback
                this.style.transform = 'scale(1.2) rotate(10deg)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 300);
            }
        });
        
        // Add keyboard navigation
        badge.setAttribute('tabindex', '0');
        badge.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
    
    // Certifications Upload Functionality
    const uploadArea = document.getElementById('uploadArea');
    const certificateUpload = document.getElementById('certificateUpload');
    const uploadedFiles = document.getElementById('uploadedFiles');
    
    if (uploadArea && certificateUpload) {
        // Click to upload
        uploadArea.addEventListener('click', () => {
            certificateUpload.click();
        });
        
        // Drag and drop
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
            uploadArea.style.transform = 'translateY(-2px)';
        }
        
        function unhighlight() {
            uploadArea.style.borderColor = '';
            uploadArea.style.backgroundColor = '';
            uploadArea.style.transform = '';
        }
        
        // Handle file drop
        uploadArea.addEventListener('drop', handleDrop, false);
        
        function handleDrop(e) {
            const dt = e.dataTransfer;
            const files = dt.files;
            handleFiles(files);
        }
        
        // Handle file selection
        certificateUpload.addEventListener('change', function() {
            handleFiles(this.files);
        });
        
        function handleFiles(files) {
            [...files].forEach(file => {
                if (file.size > 5 * 1024 * 1024) {
                    showNotification('File too large (max 5MB): ' + file.name, 'error');
                    return;
                }
                
                if (!['image/jpeg', 'image/png', 'application/pdf'].includes(file.type)) {
                    showNotification('Invalid file type: ' + file.name, 'error');
                    return;
                }
                
                displayFile(file);
            });
        }
        
        function displayFile(file) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            
            reader.onload = function(e) {
                const fileItem = document.createElement('div');
                fileItem.className = 'file-item';
                fileItem.innerHTML = `
                    <div class="file-preview">
                        <i class="fas fa-file-${file.type === 'application/pdf' ? 'pdf' : 'image'}"></i>
                    </div>
                    <div class="file-info">
                        <h5>${file.name}</h5>
                        <p>${(file.size / 1024 / 1024).toFixed(2)} MB • ${new Date().toLocaleDateString()}</p>
                    </div>
                    <button class="file-remove" aria-label="Remove ${file.name}">
                        <i class="fas fa-times"></i>
                    </button>
                `;
                
                // Remove file functionality
                const removeBtn = fileItem.querySelector('.file-remove');
                removeBtn.addEventListener('click', () => {
                    fileItem.style.animation = 'fadeOut 0.3s ease';
                    setTimeout(() => {
                        fileItem.remove();
                        showNotification('File removed: ' + file.name, 'success');
                    }, 300);
                });
                
                // Add animation for new file
                fileItem.style.animation = 'fadeIn 0.3s ease';
                uploadedFiles.appendChild(fileItem);
                showNotification('File uploaded: ' + file.name, 'success');
            };
        }
    }
    
    // Add certificate link functionality
    const addCertificateBtn = document.getElementById('addCertificateBtn');
    if (addCertificateBtn) {
        addCertificateBtn.addEventListener('click', function() {
            const url = prompt('Enter the certificate URL:', 'https://');
            const title = prompt('Enter the certificate title:');
            const issuer = prompt('Enter the issuer name:');
            
            if (url && title && issuer) {
                const certificatesGrid = document.querySelector('.certificates-grid');
                if (certificatesGrid) {
                    const certificateItem = document.createElement('div');
                    certificateItem.className = 'certificate-item';
                    certificateItem.style.animation = 'fadeIn 0.5s ease';
                    certificateItem.innerHTML = `
                        <div class="certificate-icon">
                            <i class="fas fa-certificate"></i>
                        </div>
                        <div class="certificate-info">
                            <h4>${title}</h4>
                            <p class="certificate-issuer">${issuer}</p>
                            <a href="${url}" target="_blank" rel="noopener noreferrer" class="certificate-link">View Certificate</a>
                        </div>
                    `;
                    certificatesGrid.appendChild(certificateItem);
                    showNotification('Certificate added successfully!', 'success');
                }
            }
        });
    }
    
    // Contact Form Submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const subject = document.getElementById('subject').value.trim();
            const message = document.getElementById('message').value.trim();
            
            // Validation
            if (!name || !email || !subject || !message) {
                showNotification('Please fill in all fields.', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showNotification('Please enter a valid email address.', 'error');
                return;
            }
            
            // Show loading state
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
            
            // Simulate API call with timeout
            setTimeout(() => {
                showNotification('Message sent successfully! I will get back to you soon.', 'success');
                
                // Reset form
                contactForm.reset();
                
                // Reset button state
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 1500);
        });
    }
    
    // Email validation function
    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    // Profile picture upload simulation
    const profilePic = document.getElementById('profile-pic');
    if (profilePic) {
        profilePic.addEventListener('click', function() {
            showNotification('Profile picture upload feature coming soon!', 'info');
        });
    }
    
    // Tooltip functionality for tech badges
    const allBadges = document.querySelectorAll('.tech-badge');
    allBadges.forEach(badge => {
        const tooltip = badge.getAttribute('data-tooltip');
        if (tooltip) {
            badge.addEventListener('mouseenter', function(e) {
                // Remove existing tooltips
                document.querySelectorAll('.tooltip').forEach(t => t.remove());
                
                const tooltipElement = document.createElement('div');
                tooltipElement.className = 'tooltip';
                tooltipElement.textContent = tooltip;
                
                this.appendChild(tooltipElement);
                
                // Position tooltip
                const rect = this.getBoundingClientRect();
                tooltipElement.style.left = '50%';
                tooltipElement.style.top = '-100%';
            });
            
            badge.addEventListener('mouseleave', function() {
                const tooltip = this.querySelector('.tooltip');
                if (tooltip) {
                    tooltip.remove();
                }
            });
        }
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            if (this.getAttribute('href') === '#') return;
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Enhanced Notification System
    function showNotification(message, type) {
        // Remove any existing notification
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        // Add icon based on type
        let icon = 'info-circle';
        if (type === 'success') icon = 'check-circle';
        if (type === 'error') icon = 'exclamation-circle';
        if (type === 'info') icon = 'info-circle';
        
        notification.innerHTML = `
            <i class="fas fa-${icon}"></i>
            <span>${message}</span>
            <button class="notification-close" aria-label="Close notification">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        // Add to document
        document.body.appendChild(notification);
        
        // Close button functionality
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.style.animation = 'slideOut 0.3s ease-out forwards';
            setTimeout(() => notification.remove(), 300);
        });
        
        // Remove after 5 seconds
        const autoRemove = setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out forwards';
            setTimeout(() => notification.remove(), 300);
        }, 5000);
        
        // Keep notification on hover
        notification.addEventListener('mouseenter', () => {
            clearTimeout(autoRemove);
        });
        
        notification.addEventListener('mouseleave', () => {
            setTimeout(() => {
                notification.style.animation = 'slideOut 0.3s ease-out forwards';
                setTimeout(() => notification.remove(), 300);
            }, 2000);
        });
    }
    
    // Add theme-specific animations to CSS
    const animationStyles = document.createElement('style');
    animationStyles.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fadeOut {
            from { opacity: 1; transform: translateY(0); }
            to { opacity: 0; transform: translateY(10px); }
        }
        
        .file-item {
            display: flex;
            align-items: center;
            gap: 15px;
            padding: 15px;
            background: var(--surface-color-light);
            border-radius: 8px;
            margin-bottom: 10px;
            border: 1px solid var(--border-color);
            transition: var(--transition);
            animation: fadeIn 0.3s ease;
        }
        
        .file-item:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px var(--shadow-light);
        }
        
        .file-preview {
            width: 50px;
            height: 50px;
            background: var(--surface-color);
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--primary-color);
            font-size: 1.5rem;
        }
        
        .file-info h5 {
            margin-bottom: 5px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            max-width: 200px;
        }
        
        .file-info p {
            font-size: 0.85rem;
            color: var(--text-tertiary);
            margin: 0;
        }
        
        .file-remove {
            margin-left: auto;
            background: none;
            border: none;
            color: var(--error-color);
            cursor: pointer;
            font-size: 1.2rem;
            padding: 5px;
            transition: var(--transition);
        }
        
        .file-remove:hover {
            transform: scale(1.1);
        }
        
        .notification {
            position: fixed;
            top: 100px;
            right: 20px;
            padding: 15px 25px;
            border-radius: 12px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            animation: slideIn 0.3s ease-out;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            max-width: 350px;
            font-family: 'Inter', sans-serif;
            display: flex;
            align-items: center;
            gap: 12px;
            backdrop-filter: blur(10px);
            border: 1px solid;
            cursor: pointer;
            transition: transform 0.2s ease;
        }
        
        .notification:hover {
            transform: translateX(-5px);
        }
        
        .notification.success {
            background: linear-gradient(135deg, rgba(16, 185, 129, 0.95), rgba(5, 150, 105, 0.95));
            border-color: rgba(16, 185, 129, 0.3);
        }
        
        .notification.error {
            background: linear-gradient(135deg, rgba(239, 68, 68, 0.95), rgba(220, 38, 38, 0.95));
            border-color: rgba(239, 68, 68, 0.3);
        }
        
        .notification.info {
            background: linear-gradient(135deg, rgba(59, 130, 246, 0.95), rgba(37, 99, 235, 0.95));
            border-color: rgba(59, 130, 246, 0.3);
        }
        
        .notification-close {
            margin-left: auto;
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            opacity: 0.8;
            padding: 5px;
            border-radius: 4px;
            transition: opacity 0.2s ease, background 0.2s ease;
        }
        
        .notification-close:hover {
            opacity: 1;
            background: rgba(255, 255, 255, 0.1);
        }
        
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        
        .theme-transition * {
            transition: background-color 0.5s ease, 
                       color 0.5s ease, 
                       border-color 0.5s ease,
                       box-shadow 0.5s ease,
                       opacity 0.5s ease !important;
        }
        
        /* Theme toggle indicator */
        #theme-indicator {
            font-size: 0.85rem;
            color: var(--text-secondary);
            margin-left: 10px;
            font-weight: 500;
            transition: color 0.3s ease;
        }
    `;
    document.head.appendChild(animationStyles);
    
    // Initialize
    updateActiveNavLink();
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + T to toggle theme
        if ((e.ctrlKey || e.metaKey) && e.key === 't') {
            e.preventDefault();
            const themeToggle = document.getElementById('theme-toggle');
            if (themeToggle) {
                const currentTheme = localStorage.getItem('portfolio-theme') || 'system';
                let nextTheme;
                
                if (currentTheme === 'system') {
                    nextTheme = themeToggle.checked ? 'light' : 'dark';
                } else if (currentTheme === 'light') {
                    nextTheme = 'dark';
                } else {
                    nextTheme = 'system';
                }
                
                themeManager.setTheme(nextTheme);
            }
        }
        
        // Escape to close mobile menu
        if (e.key === 'Escape') {
            if (hamburger) hamburger.classList.remove('active');
            if (navMenu) navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    // Initialize with a welcome message
    setTimeout(() => {
        const currentTheme = localStorage.getItem('portfolio-theme');
        let message = 'Welcome to my portfolio! Explore my work and skills.';
        if (currentTheme === 'system') {
            message += ' (Theme: Auto)';
        }
        showNotification(message, 'info');
    }, 1000);
    
    // Add viewport detection for better mobile experience
    function checkViewport() {
        if (window.innerWidth <= 768) {
            document.body.classList.add('mobile-view');
        } else {
            document.body.classList.remove('mobile-view');
        }
    }
    
    checkViewport();
    window.addEventListener('resize', checkViewport);
    
    // Add loading animation for images
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        if (!img.complete) {
            img.style.opacity = '0';
            img.addEventListener('load', function() {
                this.style.opacity = '1';
                this.style.transition = 'opacity 0.5s ease';
            });
        }
    });
    
    // Add theme change listener for other components
    document.addEventListener('themeChanged', function(e) {
        // You can add additional theme-dependent updates here
        console.log('Theme changed to:', e.detail);
    });
});
