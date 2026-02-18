// FiBER Shop - Main JavaScript
// Handles cart functionality, product rendering, and WhatsApp checkout

// Product Data
const products = [
    {
        id: 1,
        name: 'Hoodie',
        price: 25000,
        description: 'Soft fleece',
        image: 'Hoodie'
    },
    {
        id: 2,
        name: 'Sweatshirt',
        price: 20000,
        description: 'Soft fleece',
        image: 'Sweatshirt'
    },
    {
        id: 3,
        name: 'Joggers',
        price: 20000,
        description: 'Soft fleece',
        image: 'Joggers'
    },
    {
        id: 4,
        name: 'T-Shirt',
        price: 15000,
        description: '220g/m² cotton',
        image: 'T-Shirt'
    }
];

// Cart State
let cart = [];

// DOM Elements
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
const cartBtn = document.getElementById('cartBtn');
const cartSidebar = document.getElementById('cartSidebar');
const cartOverlay = document.getElementById('cartOverlay');
const cartClose = document.getElementById('cartClose');
const cartItems = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const cartTotal = document.getElementById('cartTotal');
const checkoutBtn = document.getElementById('checkoutBtn');
const productsGrid = document.getElementById('productsGrid');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    setupEventListeners();
    updateCartUI();
});

// Render Products
function renderProducts() {
    productsGrid.innerHTML = products.map(product => `
        <article class="product-card">
            <div class="product-image">
                <span>${product.image}</span>
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-footer">
                    <span class="product-price">₦${product.price.toLocaleString()}</span>
                    <button class="add-to-cart" onclick="addToCart(${product.id})" aria-label="Add ${product.name} to cart">
                        Add to Cart
                    </button>
                </div>
            </div>
        </article>
    `).join('');
}

// Setup Event Listeners
function setupEventListeners() {
    // Mobile Navigation Toggle
    navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        // Animate hamburger to X
        const spans = navToggle.querySelectorAll('span');
        if (navLinks.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });

    // Cart Toggle
    cartBtn.addEventListener('click', openCart);
    cartClose.addEventListener('click', closeCart);
    cartOverlay.addEventListener('click', closeCart);

    // Close cart on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeCart();
            navLinks.classList.remove('active');
        }
    });

    // Checkout
    checkoutBtn.addEventListener('click', checkout);

    // Active Navigation Link on Scroll
    const sections = document.querySelectorAll('.section');
    const navLinksItems = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinksItems.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    });
}

// Cart Functions
function openCart() {
    cartSidebar.classList.add('active');
    cartOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeCart() {
    cartSidebar.classList.remove('active');
    cartOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCartUI();
    openCart();
    
    // Visual feedback
    const btn = event.target;
    const originalText = btn.textContent;
    btn.textContent = 'Added!';
    btn.style.background = '#25D366';
    setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
    }, 1000);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
}

function updateCartUI() {
    // Update count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;

    // Update items display
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="cart-empty">Your cart is empty</p>';
        checkoutBtn.disabled = true;
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-image">
                    <span>${item.image}</span>
                </div>
                <div class="cart-item-details">
                    <h4 class="cart-item-name">${item.name}</h4>
                    <p class="cart-item-price">₦${item.price.toLocaleString()} x ${item.quantity}</p>
                    <button class="cart-item-remove" onclick="removeFromCart(${item.id})">Remove</button>
                </div>
            </div>
        `).join('');
        checkoutBtn.disabled = false;
    }

    // Update total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = `₦${total.toLocaleString()}`;
}

// WhatsApp Checkout
function checkout() {
    if (cart.length === 0) return;

    const phoneNumber = '2349136142251';
    
    // Build order message
    let message = 'Hi FiBER,%0A%0AI would like to place an order:%0A%0A';
    
    cart.forEach(item => {
        message += `• ${item.name} x${item.quantity} - ₦${(item.price * item.quantity).toLocaleString()}%0A`;
    });
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    message += `%0ATotal: ₦${total.toLocaleString()}%0A%0AThank you!`;

    // Open WhatsApp
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
    
    // Optional: Clear cart after checkout
    // cart = [];
    // updateCartUI();
    // closeCart();
}

// Expose functions to global scope for onclick handlers
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
