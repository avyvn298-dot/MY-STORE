// ==========================================
// ACUMEN WATCHES - Complete JavaScript
// ==========================================

// Watch Data
const watches = [
    {
        id: 1,
        name: "CARRERA CHRONOGRAPH",
        model: "CBN2A1A.BA0643",
        price: "$5,850",
        category: "chronograph",
        badge: "New",
        specs: ["Automatic", "43mm", "100m"],
        image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800"
    },
    {
        id: 2,
        name: "MONACO AUTOMATIC",
        model: "CAW211P.FC6356",
        price: "$6,200",
        category: "automatic",
        badge: "Limited",
        specs: ["Automatic", "39mm", "100m"],
        image: "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=800"
    },
    {
        id: 3,
        name: "AQUARACER PROFESSIONAL",
        model: "WBP208C.FT6201",
        price: "$3,950",
        category: "automatic",
        badge: "",
        specs: ["Automatic", "43mm", "300m"],
        image: "https://images.unsplash.com/photo-1622434641406-a158123450f9?w=800"
    },
    {
        id: 4,
        name: "CARRERA SPORT",
        model: "CBN2013.BA0642",
        price: "$7,100",
        category: "chronograph",
        badge: "Limited",
        specs: ["Chronograph", "44mm", "100m"],
        image: "https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=800"
    },
    {
        id: 5,
        name: "FORMULA 1 CHRONOGRAPH",
        model: "CAZ101AG.BA0842",
        price: "$1,650",
        category: "chronograph",
        badge: "",
        specs: ["Quartz", "43mm", "200m"],
        image: "https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?w=800"
    },
    {
        id: 6,
        name: "AUTAVIA CHRONOGRAPH",
        model: "CBE5110.FC8266",
        price: "$4,900",
        category: "chronograph",
        badge: "New",
        specs: ["Automatic", "42mm", "100m"],
        image: "https://images.unsplash.com/photo-1611148881051-02e80bcb5256?w=800"
    }
];

// ==========================================
// Header Scroll Effect
// ==========================================
const header = document.getElementById('header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// ==========================================
// Mobile Navigation Toggle
// ==========================================
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    navToggle.classList.toggle('active');
});

// Close mobile nav when clicking on a link
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// ==========================================
// Hero Slider
// ==========================================
const heroSlides = [
    {
        image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=1920",
        subtitle: "NEW COLLECTION 2025",
        title: "CARRERA CHRONOGRAPH",
        description: "Precision engineered. Elegantly designed. Swiss craftsmanship redefined."
    },
    {
        image: "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=1920",
        subtitle: "ICONIC DESIGN",
        title: "MONACO HERITAGE",
        description: "The legendary square case that revolutionized watchmaking since 1969."
    },
    {
        image: "https://images.unsplash.com/photo-1622434641406-a158123450f9?w=1920",
        subtitle: "PROFESSIONAL DIVING",
        title: "AQUARACER 300M",
        description: "Engineered for the depths. Built for adventure."
    }
];

let currentSlide = 0;
const sliderContainer = document.querySelector('.hero-slider');
const sliderDotsContainer = document.querySelector('.slider-dots');

// Create slider slides
heroSlides.forEach((slide, index) => {
    const slideElement = document.createElement('div');
    slideElement.className = `hero-slide ${index === 0 ? 'active' : ''}`;
    slideElement.innerHTML = `
        <div class="hero-bg" style="background-image: url('${slide.image}')"></div>
        <div class="hero-overlay"></div>
        <div class="hero-content">
            <span class="hero-subtitle">${slide.subtitle}</span>
            <h1 class="hero-title">${slide.title}</h1>
            <p class="hero-description">${slide.description}</p>
            <div class="hero-buttons">
                <a href="#collections" class="btn btn-primary">Explore Collection</a>
                <a href="#watches" class="btn btn-secondary">View All Watches</a>
            </div>
        </div>
    `;
    if (index > 0) sliderContainer.appendChild(slideElement);
});

// Create slider dots
heroSlides.forEach((_, index) => {
    const dot = document.createElement('div');
    dot.className = `slider-dot ${index === 0 ? 'active' : ''}`;
    dot.addEventListener('click', () => goToSlide(index));
    sliderDotsContainer.appendChild(dot);
});

function goToSlide(index) {
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.slider-dot');
    
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');
    
    currentSlide = index;
    
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
}

function nextSlide() {
    goToSlide((currentSlide + 1) % heroSlides.length);
}

function prevSlide() {
    goToSlide((currentSlide - 1 + heroSlides.length) % heroSlides.length);
}

document.querySelector('.next-btn').addEventListener('click', nextSlide);
document.querySelector('.prev-btn').addEventListener('click', prevSlide);

// Auto-play slider
setInterval(nextSlide, 5000);

// ==========================================
// Watches Grid & Filter
// ==========================================
const watchesGrid = document.getElementById('watchesGrid');
const filterBtns = document.querySelectorAll('.filter-btn');

function renderWatches(category = 'all') {
    watchesGrid.innerHTML = '';
    
    const filteredWatches = category === 'all' 
        ? watches 
        : watches.filter(watch => watch.category === category);
    
    filteredWatches.forEach((watch, index) => {
        const watchCard = document.createElement('div');
        watchCard.className = 'watch-card';
        watchCard.style.animationDelay = `${index * 0.1}s`;
        watchCard.setAttribute('data-aos', 'fade-up');
        
        watchCard.innerHTML = `
            <div class="watch-image">
                <img src="${watch.image}" alt="${watch.name}">
                ${watch.badge ? `<span class="watch-badge">${watch.badge}</span>` : ''}
            </div>
            <div class="watch-info">
                <h3 class="watch-name">${watch.name}</h3>
                <p class="watch-model">${watch.model}</p>
                <div class="watch-specs">
                    ${watch.specs.map(spec => `<span class="watch-spec">${spec}</span>`).join('')}
                </div>
                <div class="watch-price">${watch.price}</div>
                <div class="watch-actions">
                    <button class="btn btn-primary" onclick="addToCart(${watch.id})">Add to Cart</button>
                    <button class="btn btn-secondary" onclick="viewDetails(${watch.id})">Details</button>
                </div>
            </div>
        `;
        
        watchesGrid.appendChild(watchCard);
    });
    
    // Trigger AOS animations
    initAOS();
}

// Filter functionality
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const category = btn.getAttribute('data-filter');
        renderWatches(category);
    });
});

// Initial render
renderWatches();

// ==========================================
// Shopping Cart
// ==========================================
let cart = [];
const cartCount = document.querySelector('.cart-count');

function updateCartCount() {
    cartCount.textContent = cart.length;
}

function addToCart(watchId) {
    const watch = watches.find(w => w.id === watchId);
    if (watch) {
        cart.push(watch);
        updateCartCount();
        showNotification(`${watch.name} added to cart!`);
    }
}

function viewDetails(watchId) {
    const watch = watches.find(w => w.id === watchId);
    if (watch) {
        showNotification(`Viewing details for ${watch.name}`);
    }
}

// ==========================================
// Notification System
// ==========================================
function showNotification(message) {
    // Remove existing notification if any
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(135deg, #c7a661, #f1d48c);
        color: #0b0b0b;
        padding: 1rem 2rem;
        border-radius: 10px;
        font-weight: 600;
        z-index: 9999;
        animation: slideInRight 0.3s ease;
        box-shadow: 0 8px 30px rgba(199, 166, 97, 0.3);
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add notification animations to CSS dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ==========================================
// Forms
// ==========================================
const newsletterForm = document.getElementById('newsletterForm');
const contactForm = document.getElementById('contactForm');

newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = newsletterForm.querySelector('input[type="email"]').value;
    showNotification('Thank you for subscribing!');
    newsletterForm.reset();
});

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    showNotification('Message sent successfully! We\'ll get back to you soon.');
    contactForm.reset();
});

// ==========================================
// Scroll to Top Button
// ==========================================
const scrollTopBtn = document.getElementById('scrollTop');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollTopBtn.classList.add('visible');
    } else {
        scrollTopBtn.classList.remove('visible');
    }
});

scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ==========================================
// Smooth Scroll for Anchor Links
// ==========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        
        if (target) {
            const headerHeight = document.getElementById('header').offsetHeight;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ==========================================
// AOS (Animate On Scroll) Implementation
// ==========================================
function initAOS() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('[data-aos]').forEach(element => {
        observer.observe(element);
    });
}

// Initialize AOS on page load
document.addEventListener('DOMContentLoaded', () => {
    initAOS();
});

// ==========================================
// Search Functionality
// ==========================================
const searchBtn = document.querySelector('.search-btn');

searchBtn.addEventListener('click', () => {
    // Create search overlay
    const searchOverlay = document.createElement('div');
    searchOverlay.className = 'search-overlay';
    searchOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(11, 11, 11, 0.95);
        backdrop-filter: blur(10px);
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
        animation: fadeIn 0.3s ease;
    `;
    
    searchOverlay.innerHTML = `
        <div class="search-container" style="max-width: 600px; width: 90%; position: relative;">
            <button class="close-search" style="
                position: absolute;
                top: -40px;
                right: 0;
                background: transparent;
                color: #c7a661;
                font-size: 2rem;
                cursor: pointer;
            ">&times;</button>
            <input type="text" placeholder="Search watches..." style="
                width: 100%;
                padding: 1.5rem;
                font-size: 1.2rem;
                background: rgba(20, 20, 20, 0.8);
                border: 2px solid rgba(199, 166, 97, 0.3);
                border-radius: 10px;
                color: rgba(255, 255, 255, 0.9);
                font-family: 'Poppins', sans-serif;
            ">
            <div class="search-results" style="
                margin-top: 2rem;
                max-height: 400px;
                overflow-y: auto;
            "></div>
        </div>
    `;
    
    document.body.appendChild(searchOverlay);
    
    const closeBtn = searchOverlay.querySelector('.close-search');
    const searchInput = searchOverlay.querySelector('input');
    const searchResults = searchOverlay.querySelector('.search-results');
    
    closeBtn.addEventListener('click', () => {
        searchOverlay.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => searchOverlay.remove(), 300);
    });
    
    searchInput.focus();
    
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        
        if (query.length > 0) {
            const results = watches.filter(watch => 
                watch.name.toLowerCase().includes(query) || 
                watch.model.toLowerCase().includes(query)
            );
            
            if (results.length > 0) {
                searchResults.innerHTML = results.map(watch => `
                    <div style="
                        background: rgba(20, 20, 20, 0.8);
                        padding: 1rem;
                        margin-bottom: 1rem;
                        border-radius: 10px;
                        border: 1px solid rgba(199, 166, 97, 0.2);
                        cursor: pointer;
                        transition: all 0.3s ease;
                    " onmouseover="this.style.borderColor='#c7a661'" onmouseout="this.style.borderColor='rgba(199, 166, 97, 0.2)'">
                        <h4 style="color: #c7a661; margin-bottom: 0.5rem;">${watch.name}</h4>
                        <p style="color: rgba(255, 255, 255, 0.7); font-size: 0.9rem;">${watch.model}</p>
                        <p style="color: #c7a661; font-weight: 700; margin-top: 0.5rem;">${watch.price}</p>
                    </div>
                `).join('');
            } else {
                searchResults.innerHTML = `
                    <p style="text-align: center; color: rgba(255, 255, 255, 0.5); padding: 2rem;">
                        No watches found matching "${query}"
                    </p>
                `;
            }
        } else {
            searchResults.innerHTML = '';
        }
    });
    
    // Close on overlay click
    searchOverlay.addEventListener('click', (e) => {
        if (e.target === searchOverlay) {
            searchOverlay.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => searchOverlay.remove(), 300);
        }
    });
    
    // Close on Escape key
    document.addEventListener('keydown', function escHandler(e) {
        if (e.key === 'Escape') {
            searchOverlay.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => searchOverlay.remove(), 300);
            document.removeEventListener('keydown', escHandler);
        }
    });
});

// ==========================================
// Lazy Loading Images
// ==========================================
const images = document.querySelectorAll('img[data-src]');

const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
        }
    });
});

images.forEach(img => imageObserver.observe(img));

// ==========================================
// Performance Optimization
// ==========================================
// Debounce function for scroll events
function debounce(func, wait) {
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

// Apply debounce to scroll-heavy functions
const debouncedScroll = debounce(() => {
    // Scroll-related operations here
}, 100);

window.addEventListener('scroll', debouncedScroll);

// ==========================================
// Console Easter Egg
// ==========================================
console.log('%c ACUMEN WATCHES ', 'background: linear-gradient(135deg, #c7a661, #f1d48c); color: #0b0b0b; font-size: 24px; font-weight: bold; padding: 10px 20px; border-radius: 5px;');
console.log('%c Swiss Luxury Timepieces Since 1860 ', 'color: #c7a661; font-size: 14px; font-style: italic;');
console.log('%c Interested in our code? We\'re hiring! Visit acumenwatches.com/careers ', 'color: rgba(255, 255, 255, 0.7); font-size: 12px;');

// ==========================================
// Page Load Animation
// ==========================================
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// ==========================================
// Initialize Everything
// ==========================================
console.log('✓ ACUMEN Watches website loaded successfully');
console.log(`✓ ${watches.length} watches available`);
console.log('✓ All systems operational');
