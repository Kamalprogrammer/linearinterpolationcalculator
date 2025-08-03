// Page Navigation System
class PageManager {
    constructor() {
        this.currentPage = 'home';
        this.pages = ['home', 'privacy', 'disclaimer', 'about'];
        this.init();
    }

    init() {
        // Initialize navigation event listeners
        this.setupNavigation();
        this.setupFooterNavigation();
        this.showPage('home');
    }

    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = link.getAttribute('data-page');
                this.showPage(page);
                this.updateActiveNavLink(link);
            });
        });
    }

    setupFooterNavigation() {
        const footerLinks = document.querySelectorAll('.footer-link');
        footerLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = link.getAttribute('data-page');
                this.showPage(page);
                this.updateActiveNavLink(document.querySelector(`[data-page="${page}"]`));
                // Scroll to top when navigating
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        });
    }

    showPage(pageId) {
        // Hide all pages
        this.pages.forEach(page => {
            const pageElement = document.getElementById(`${page}-page`);
            if (pageElement) {
                pageElement.classList.remove('active');
            }
        });

        // Show selected page
        const targetPage = document.getElementById(`${pageId}-page`);
        if (targetPage) {
            targetPage.classList.add('active');
            this.currentPage = pageId;
        }
    }

    updateActiveNavLink(activeLink) {
        // Remove active class from all nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });

        // Add active class to clicked link
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }
}

// Linear Interpolation Calculator
class InterpolationCalculator {
    constructor() {
        this.x1Input = document.getElementById('x1');
        this.y1Input = document.getElementById('y1');
        this.x2Input = document.getElementById('x2');
        this.y2Input = document.getElementById('y2');
        this.xTargetInput = document.getElementById('x-target');
        this.calculateBtn = document.getElementById('calculate-btn');
        this.clearBtn = document.getElementById('clear-btn');
        this.resultsSection = document.getElementById('results-section');
        this.resultValue = document.getElementById('result-value');
        this.stepByStep = document.getElementById('step-by-step');

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupInputValidation();
    }

    setupEventListeners() {
        this.calculateBtn.addEventListener('click', () => this.calculate());
        this.clearBtn.addEventListener('click', () => this.clearAll());

        // Allow Enter key to trigger calculation
        [this.x1Input, this.y1Input, this.x2Input, this.y2Input, this.xTargetInput].forEach(input => {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.calculate();
                }
            });
        });

        // Real-time input validation
        [this.x1Input, this.y1Input, this.x2Input, this.y2Input, this.xTargetInput].forEach(input => {
            input.addEventListener('input', () => this.validateInputs());
        });
    }

    setupInputValidation() {
        // Add input event listeners for real-time validation
        const inputs = [this.x1Input, this.y1Input, this.x2Input, this.y2Input, this.xTargetInput];
        inputs.forEach(input => {
            input.addEventListener('input', (e) => {
                this.validateNumberInput(e.target);
            });
        });
    }

    validateNumberInput(input) {
        const value = input.value;
        const isValid = value === '' || (!isNaN(value) && isFinite(value));
        
        if (isValid) {
            input.style.borderColor = 'rgba(59, 130, 246, 0.3)';
            input.style.backgroundColor = 'rgba(24, 24, 27, 0.8)';
        } else {
            input.style.borderColor = '#ef4444';
            input.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
        }
    }

    validateInputs() {
        const x1 = parseFloat(this.x1Input.value);
        const y1 = parseFloat(this.y1Input.value);
        const x2 = parseFloat(this.x2Input.value);
        const y2 = parseFloat(this.y2Input.value);
        const xTarget = parseFloat(this.xTargetInput.value);

        const allFieldsFilled = !isNaN(x1) && !isNaN(y1) && !isNaN(x2) && !isNaN(y2) && !isNaN(xTarget);
        const validInputs = x1 !== x2; // Prevent division by zero

        this.calculateBtn.disabled = !allFieldsFilled || !validInputs;
        
        if (allFieldsFilled && !validInputs) {
            this.showError('x1 and x2 must be different values to avoid division by zero.');
        } else {
            this.hideError();
        }
    }

    calculate() {
        try {
            const x1 = parseFloat(this.x1Input.value);
            const y1 = parseFloat(this.y1Input.value);
            const x2 = parseFloat(this.x2Input.value);
            const y2 = parseFloat(this.y2Input.value);
            const xTarget = parseFloat(this.xTargetInput.value);

            // Validation
            if (isNaN(x1) || isNaN(y1) || isNaN(x2) || isNaN(y2) || isNaN(xTarget)) {
                throw new Error('Please fill in all fields with valid numbers.');
            }

            if (x1 === x2) {
                throw new Error('x1 and x2 must be different values to avoid division by zero.');
            }

            // Linear interpolation formula: y = y1 + (x - x1) * (y2 - y1) / (x2 - x1)
            const result = this.linearInterpolation(x1, y1, x2, y2, xTarget);
            
            this.displayResult(result, x1, y1, x2, y2, xTarget);
            this.showResults();

        } catch (error) {
            this.showError(error.message);
        }
    }

    linearInterpolation(x1, y1, x2, y2, x) {
        return y1 + (x - x1) * (y2 - y1) / (x2 - x1);
    }

    displayResult(result, x1, y1, x2, y2, xTarget) {
        // Display the final result
        this.resultValue.innerHTML = `
            <div class="result-header">Interpolated Value:</div>
            <div class="result-number">y = ${this.formatNumber(result)}</div>
            <div class="result-coordinates">At point (${this.formatNumber(xTarget)}, ${this.formatNumber(result)})</div>
        `;

        // Generate step-by-step solution
        const steps = this.generateStepByStep(x1, y1, x2, y2, xTarget, result);
        this.stepByStep.innerHTML = `<ol>${steps}</ol>`;
    }

    generateStepByStep(x1, y1, x2, y2, xTarget, result) {
        const slope = (y2 - y1) / (x2 - x1);
        const xDiff = xTarget - x1;
        const yDiff = y2 - y1;
        const xDiffRange = x2 - x1;

        return `
            <li><strong>Given Information:</strong><br>
                Point 1: (${this.formatNumber(x1)}, ${this.formatNumber(y1)})<br>
                Point 2: (${this.formatNumber(x2)}, ${this.formatNumber(y2)})<br>
                Target x-value: ${this.formatNumber(xTarget)}
            </li>
            <li><strong>Linear Interpolation Formula:</strong><br>
                y = y₁ + (x - x₁) × (y₂ - y₁) / (x₂ - x₁)
            </li>
            <li><strong>Substitute the values:</strong><br>
                y = ${this.formatNumber(y1)} + (${this.formatNumber(xTarget)} - ${this.formatNumber(x1)}) × (${this.formatNumber(y2)} - ${this.formatNumber(y1)}) / (${this.formatNumber(x2)} - ${this.formatNumber(x1)})
            </li>
            <li><strong>Calculate the differences:</strong><br>
                x - x₁ = ${this.formatNumber(xTarget)} - ${this.formatNumber(x1)} = ${this.formatNumber(xDiff)}<br>
                y₂ - y₁ = ${this.formatNumber(y2)} - ${this.formatNumber(y1)} = ${this.formatNumber(yDiff)}<br>
                x₂ - x₁ = ${this.formatNumber(x2)} - ${this.formatNumber(x1)} = ${this.formatNumber(xDiffRange)}
            </li>
            <li><strong>Calculate the slope:</strong><br>
                Slope = (y₂ - y₁) / (x₂ - x₁) = ${this.formatNumber(yDiff)} / ${this.formatNumber(xDiffRange)} = ${this.formatNumber(slope)}
            </li>
            <li><strong>Apply the formula:</strong><br>
                y = ${this.formatNumber(y1)} + ${this.formatNumber(xDiff)} × ${this.formatNumber(slope)}<br>
                y = ${this.formatNumber(y1)} + ${this.formatNumber(xDiff * slope)}
            </li>
            <li><strong>Final Result:</strong><br>
                y = ${this.formatNumber(result)}
            </li>
            <li><strong>Verification:</strong><br>
                The interpolated point (${this.formatNumber(xTarget)}, ${this.formatNumber(result)}) lies on the line between (${this.formatNumber(x1)}, ${this.formatNumber(y1)}) and (${this.formatNumber(x2)}, ${this.formatNumber(y2)}).
            </li>
        `;
    }

    formatNumber(num) {
        if (Number.isInteger(num)) {
            return num.toString();
        }
        
        // Round to 6 decimal places and remove trailing zeros
        const rounded = parseFloat(num.toFixed(6));
        return rounded.toString();
    }

    showResults() {
        this.resultsSection.classList.remove('hidden');
        // Smooth scroll to results
        this.resultsSection.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
    }

    hideResults() {
        this.resultsSection.classList.add('hidden');
    }

    clearAll() {
        this.x1Input.value = '';
        this.y1Input.value = '';
        this.x2Input.value = '';
        this.y2Input.value = '';
        this.xTargetInput.value = '';
        this.hideResults();
        this.hideError();
        
        // Reset input styling
        [this.x1Input, this.y1Input, this.x2Input, this.y2Input, this.xTargetInput].forEach(input => {
            input.style.borderColor = 'rgba(59, 130, 246, 0.3)';
            input.style.backgroundColor = 'rgba(24, 24, 27, 0.8)';
        });

        this.calculateBtn.disabled = false;
    }

    showError(message) {
        let errorDiv = document.getElementById('error-message');
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.id = 'error-message';
            errorDiv.className = 'error-message';
            this.calculateBtn.parentNode.insertBefore(errorDiv, this.calculateBtn);
        }
        
        errorDiv.innerHTML = `
            <div style="
                background: rgba(239, 68, 68, 0.1);
                border: 1px solid #ef4444;
                border-radius: 0.5rem;
                padding: 1rem;
                margin-bottom: 1rem;
                color: #ef4444;
                font-size: 0.875rem;
            ">
                <strong>Error:</strong> ${message}
            </div>
        `;
    }

    hideError() {
        const errorDiv = document.getElementById('error-message');
        if (errorDiv) {
            errorDiv.remove();
        }
    }
}

// FAQ Functionality
class FAQManager {
    constructor() {
        this.init();
    }

    init() {
        const faqQuestions = document.querySelectorAll('.faq-question');
        faqQuestions.forEach(question => {
            question.addEventListener('click', () => {
                this.toggleFAQ(question);
            });
        });
    }

    toggleFAQ(questionElement) {
        const answer = questionElement.nextElementSibling;
        const isActive = questionElement.classList.contains('active');

        // Close all other FAQs
        document.querySelectorAll('.faq-question').forEach(q => {
            if (q !== questionElement) {
                q.classList.remove('active');
                q.nextElementSibling.classList.remove('active');
            }
        });

        // Toggle current FAQ
        if (isActive) {
            questionElement.classList.remove('active');
            answer.classList.remove('active');
        } else {
            questionElement.classList.add('active');
            answer.classList.add('active');
        }
    }
}

// Smooth Scrolling for Internal Links
class SmoothScroll {
    constructor() {
        this.init();
    }

    init() {
        // Add smooth scrolling to any internal links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
}

// Animation Observer for Scroll Effects
class AnimationObserver {
    constructor() {
        this.init();
    }

    init() {
        // Create intersection observer for animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Observe elements that should animate on scroll
        const animatedElements = document.querySelectorAll('.guide-card, .feature-card, .step-card, .content-card');
        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }
}

// Form Enhancement
class FormEnhancer {
    constructor() {
        this.init();
    }

    init() {
        // Add floating label effect
        const inputs = document.querySelectorAll('input[type="number"]');
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                input.parentElement.classList.add('focused');
            });

            input.addEventListener('blur', () => {
                if (!input.value) {
                    input.parentElement.classList.remove('focused');
                }
            });

            // Check if input has value on load
            if (input.value) {
                input.parentElement.classList.add('focused');
            }
        });
    }
}

// Keyboard Shortcuts
class KeyboardShortcuts {
    constructor() {
        this.init();
    }

    init() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + Enter to calculate
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                const calculateBtn = document.getElementById('calculate-btn');
                if (calculateBtn && !calculateBtn.disabled) {
                    calculateBtn.click();
                }
            }

            // Escape to clear
            if (e.key === 'Escape') {
                const clearBtn = document.getElementById('clear-btn');
                if (clearBtn) {
                    clearBtn.click();
                }
            }

            // Number keys 1-4 for navigation
            if (e.altKey && ['1', '2', '3', '4'].includes(e.key)) {
                e.preventDefault();
                const pages = ['home', 'privacy', 'disclaimer', 'about'];
                const pageIndex = parseInt(e.key) - 1;
                if (pages[pageIndex]) {
                    const navLink = document.querySelector(`[data-page="${pages[pageIndex]}"]`);
                    if (navLink) {
                        navLink.click();
                    }
                }
            }
        });
    }
}

// Performance Monitor
class PerformanceMonitor {
    constructor() {
        this.init();
    }

    init() {
        // Monitor page load performance
        window.addEventListener('load', () => {
            const loadTime = performance.now();
            console.log(`Page loaded in ${loadTime.toFixed(2)}ms`);
            
            // Add performance badge for development
            if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                this.addPerformanceBadge(loadTime);
            }
        });
    }

    addPerformanceBadge(loadTime) {
        const badge = document.createElement('div');
        badge.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: rgba(59, 130, 246, 0.9);
            color: white;
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 12px;
            font-family: monospace;
            z-index: 10000;
            pointer-events: none;
        `;
        badge.textContent = `Load: ${loadTime.toFixed(0)}ms`;
        document.body.appendChild(badge);

        // Remove badge after 3 seconds
        setTimeout(() => {
            badge.remove();
        }, 3000);
    }
}

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    const pageManager = new PageManager();
    const calculator = new InterpolationCalculator();
    const faqManager = new FAQManager();
    const smoothScroll = new SmoothScroll();
    const animationObserver = new AnimationObserver();
    const formEnhancer = new FormEnhancer();
    const keyboardShortcuts = new KeyboardShortcuts();
    const performanceMonitor = new PerformanceMonitor();

    // Add loading animation completion
    document.body.classList.add('loaded');

    // Console welcome message
    console.log('%c🧮 Linear Interpolation Calculator', 'color: #3b82f6; font-size: 16px; font-weight: bold;');
    console.log('%cKeyboard Shortcuts:', 'color: #06b6d4; font-weight: bold;');
    console.log('• Ctrl/Cmd + Enter: Calculate');
    console.log('• Escape: Clear all fields');
    console.log('• Alt + 1-4: Navigate between pages');
});

// Service Worker Registration (for PWA capabilities)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Export for testing purposes
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        InterpolationCalculator,
        PageManager,
        FAQManager
    };
}

