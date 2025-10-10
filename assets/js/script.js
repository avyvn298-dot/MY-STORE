// ================================
// script.js — Master controller for Acumen Watches
// - Dynamic rendering (home, collection, product, blog)
// - Quick View modal and product detail rendering
// - Full cart system (add/remove/update/localStorage)
// - Navigation, smooth scroll, reveal hookup
// - Lazy loading hooks and image optimizations
// - Uses data from window.Acumen.data
// ================================

(function () {
  'use strict';

  const { qsa, qs, debounce, formatCurrency } = window.Acumen.utils;
  const DATA = window.Acumen?.data ?? { products: [], collections: [], blogPosts: [], contactInfo: {}, socialLinks: {} };

  // Cart structure
  const Cart = {
    items: [], // { id, qty, price }
    key: 'acumen_cart_v1',
    load() {
      try {
        const raw = localStorage.getItem(this.key);
        this.items = raw ? JSON.parse(raw) : [];
      } catch (e) {
        this.items = [];
      }
    },
    save() {
      localStorage.setItem(this.key, JSON.stringify(this.items));
      this.dispatchChange();
    },
    add(productId, qty = 1) {
      const prod = DATA.products.find(p => p.id === productId);
      if (!prod) return false;
      const existing = this.items.find(i => i.id === productId);
      if (existing) existing.qty += qty;
      else this.items.push({ id: productId, qty, price: prod.price, currency: prod.currency, name: prod.name, image: prod.images?.[0] ?? '' });
      this.save();
      return true;
    },
    remove(productId) {
      this.items = this.items.filter(i => i.id !== productId);
      this.save();
    },
    update(productId, qty) {
      const it = this.items.find(i => i.id === productId);
      if (!it) return;
      it.qty = Math.max(0, Number(qty));
      if (it.qty === 0) this.remove(productId);
      else this.save();
    },
    clear() {
      this.items = [];
      this.save();
    },
    subtotal() {
      return this.items.reduce((s, i) => s + (i.price * i.qty), 0);
    },
    count() {
      return this.items.reduce((s, i) => s + i.qty, 0);
    },
    dispatchChange() {
      document.dispatchEvent(new CustomEvent('acumen.cart.change', { detail: { items: this.items } }));
    }
  };

  // Initialize app
  document.addEventListener('DOMContentLoaded', () => {
    Cart.load();
    renderLogo();
    enhanceImages();
    route();
    bindGlobalUI();
    // react to cart changes
    document.addEventListener('acumen.cart.change', () => {
      renderCartBadge();
      renderCartPreview();
    });
    renderCartBadge();
    renderCartPreview();
  });

  // Basic client-side routing to decide which page to render dynamic parts for
  function route() {
    const path = window.location.pathname.split('/').pop() || 'index.html';
    if (path === '' || path === 'index.html') {
      renderHome();
    } else if (path === 'collection.html') {
      renderCollection();
    } else if (path === 'product.html') {
      renderProductFromQuery();
    } else if (path === 'blog.html') {
      renderBlog();
    } else {
      // other pages don't need dynamic rendering
    }
  }

  /* ================== RENDER LOGO ================== */
  function renderLogo() {
    // If assets/icons/logo.svg exists, use it, otherwise fallback to text
    const logoEls = qsa('.logo');
    const logoPath = 'assets/icons/logo.svg';
    logoEls.forEach(el => {
      // try to load image silently and swap if exists
      fetch(logoPath, { method: 'HEAD' }).then(res => {
        if (res.ok) {
          el.innerHTML = `<img src="${logoPath}" alt="Acumen Watches logo" style="height:36px;">`;
        } else {
          el.textContent = 'ACUMEN';
        }
      }).catch(() => { el.textContent = 'ACUMEN'; });
    });
  }

  /* ============== ENHANCEMENTS ============== */
  function enhanceImages() {
    // Convert standard images to lazy loading if not already using native attribute
    qsa('img').forEach(img => {
      if (!img.hasAttribute('loading')) img.setAttribute('loading', 'lazy');
      // add class for fade-in handled by animations.js
      if (!img.classList.contains('fade-in')) img.classList.add('fade-in');
    });
  }

  /* ================== HOME PAGE RENDER ================== */
  function renderHome() {
    // Featured products: top 3 by price or first 3
    const featuredContainer = qs('.featured-grid');
    if (!featuredContainer) return;
    featuredContainer.innerHTML = '';
    const featured = DATA.products.slice(0, 3);
    featured.forEach(p => {
      const card = document.createElement('article');
      card.className = 'watch-card reveal fade-up';
      card.innerHTML = `
        <img src="${p.images?.[0] || 'assets/images/products/placeholder.png'}" alt="${p.name}" class="watch-img">
        <h3>${p.name}</h3>
        <p class="muted">${p.shortDesc}</p>
        <div style="display:flex;gap:10px;align-items:center;justify-content:center;margin-top:12px">
          <a href="product.html?id=${encodeURIComponent(p.id)}" class="btn-secondary">View Details</a>
          <button class="btn-primary quick-add" data-id="${p.id}">Add to Cart</button>
        </div>
      `;
      featuredContainer.appendChild(card);
    });

    // bind quick-add handlers
    qsa('.quick-add').forEach(btn => btn.addEventListener('click', (e) => {
      const id = btn.dataset.id;
      Cart.add(id, 1);
      // micro-feedback
      btn.textContent = 'Added ✓';
      setTimeout(() => btn.textContent = 'Add to Cart', 900);
    }));
  }

  /* ================== COLLECTION PAGE RENDER ================== */
  function renderCollection() {
    const grid = qs('#collectionGrid');
    if (!grid) return;
    grid.innerHTML = '';

    const mapCard = (p) => {
      const el = document.createElement('div');
      el.className = 'watch-card reveal fade-up';
      el.innerHTML = `
        <img src="${p.images?.[0] || 'assets/images/products/placeholder.png'}" alt="${p.name}" class="watch-img" loading="lazy">
        <h3>${p.name}</h3>
        <p class="muted">${p.shortDesc}</p>
        <div style="display:flex;gap:10px;align-items:center;justify-content:center;margin-top:12px">
          <a href="product.html?id=${encodeURIComponent(p.id)}" class="btn-secondary">View</a>
          <button class="btn-primary add-to-cart" data-id="${p.id}">Add</button>
          <button class="btn-secondary quick-view" data-id="${p.id}">Quick View</button>
        </div>
      `;
      return el;
    };

    DATA.products.forEach(p => grid.appendChild(mapCard(p)));

    // attach handlers
    qsa('.add-to-cart').forEach(b => b.addEventListener('click', () => {
      Cart.add(b.dataset.id, 1);
    }));

    qsa('.quick-view').forEach(b => b.addEventListener('click', (e) => {
      const id = b.dataset.id;
      openQuickView(id);
    }));
  }

  /* ================== PRODUCT PAGE RENDER ================== */
  function renderProductFromQuery() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    if (!id) return renderProductNotFound();
    const product = DATA.products.find(p => p.id === id);
    if (!product) return renderProductNotFound();

    const wrapper = qs('#productWrapper');
    if (!wrapper) return;

    wrapper.innerHTML = productTemplate(product);
    bindProductControls(product);
  }

  function renderProductNotFound() {
    const wrapper = qs('#productWrapper');
    if (!wrapper) return;
    wrapper.innerHTML = `<div class="card"><h2>Product not found</h2><p class="muted">The product you requested could not be located.</p></div>`;
  }

  function productTemplate(p) {
    return `
      <div class="product-grid reveal fade-up">
        <div class="product-media">
          <div class="product-gallery">
            ${p.images.map((src, i) => `<img src="${src}" data-index="${i}" class="product-thumb" loading="lazy" alt="${p.name} view ${i+1}">`).join('')}
          </div>
          <div class="product-main">
            <img src="${p.images[0]}" alt="${p.name} main" id="productMainImage" loading="lazy" class="fade-in">
          </div>
        </div>
        <div class="product-details">
          <h1>${p.name}</h1>
          <div class="muted">${p.specs.movement} · ${p.specs.materials}</div>
          <p class="price" data-price="${p.price}">${formatCurrency(p.price, p.currency)}</p>
          <p class="lead">${p.longDesc}</p>

          <div class="product-options">
            <label>Quantity</label>
            <input type="number" id="productQty" value="1" min="1" style="width:70px;padding:8px;border-radius:6px;border:none">
          </div>

          <div style="display:flex;gap:10px;margin-top:18px">
            <button class="btn-primary" id="addToCartBtn" data-id="${p.id}">Add to Cart</button>
            <button class="btn-secondary" id="buyNowBtn">Buy Now</button>
          </div>

          <section class="specs card" style="margin-top:18px">
            <h4>Specifications</h4>
            <ul class="muted">
              <li>Movement: ${p.specs.movement}</li>
              <li>Water Resistance: ${p.specs.waterResistance}</li>
              <li>Materials: ${p.specs.materials}</li>
              <li>Strap: ${p.specs.strap}</li>
            </ul>
          </section>
        </div>
      </div>
    `;
  }

  function bindProductControls(product) {
    const mainImg = qs('#productMainImage');
    qsa('.product-thumb').forEach(t => t.addEventListener('click', () => {
      mainImg.src = t.src;
    }));

    const addBtn = qs('#addToCartBtn');
    const qtyInput = qs('#productQty');
    if (addBtn && qtyInput) {
      addBtn.addEventListener('click', () => {
        const qty = Number(qtyInput.value) || 1;
        Cart.add(product.id, qty);
        addBtn.textContent = 'Added ✓';
        setTimeout(() => addBtn.textContent = 'Add to Cart', 900);
      });
    }

    const buyBtn = qs('#buyNowBtn');
    if (buyBtn) {
      buyBtn.addEventListener('click', () => {
        // for demo: add to cart and navigate to cart page
        const qty = Number(qtyInput.value) || 1;
        Cart.add(product.id, qty);
        window.location.href = 'cart.html';
      });
    }
  }

  /* ================== QUICK VIEW MODAL ================== */
  function openQuickView(productId) {
    const product = DATA.products.find(p => p.id === productId);
    if (!product) return;
    // create modal if not exists
    let modal = qs('#quickViewModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'quickViewModal';
      modal.className = 'modal';
      modal.innerHTML = `
        <div class="modal-dialog">
          <button class="modal-close" aria-label="Close">×</button>
          <div class="modal-body">
            <div class="quick-media">
              <img src="${product.images[0]}" alt="${product.name}" style="width:100%;max-width:420px;display:block;margin:0 auto;">
            </div>
            <div class="quick-details">
              <h3>${product.name}</h3>
              <p class="muted">${product.shortDesc}</p>
              <p class="price">${formatCurrency(product.price, product.currency)}</p>
              <div style="display:flex;gap:8px;margin-top:12px">
                <button class="btn-primary" id="qvAdd" data-id="${product.id}">Add to Cart</button>
                <a href="product.html?id=${encodeURIComponent(product.id)}" class="btn-secondary">View Page</a>
              </div>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
      // close handler
      modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(modal); });
      modal.querySelector('.modal-close')?.addEventListener('click', () => closeModal(modal));
    } else {
      // update content
      modal.querySelector('.quick-media img').src = product.images[0];
      modal.querySelector('.quick-details h3').textContent = product.name;
      modal.querySelector('.quick-details .muted').textContent = product.shortDesc;
      modal.querySelector('.quick-details .price').textContent = formatCurrency(product.price, product.currency);
      modal.querySelector('#qvAdd').dataset.id = product.id;
    }
    modal.classList.add('active');

    const qvAdd = qs('#qvAdd');
    qvAdd?.addEventListener('click', () => { Cart.add(product.id, 1); });

    function closeModal(m) { m.classList.remove('active'); }
  }

  /* ================== CART UI ================== */
  function renderCartBadge() {
    const badge = qs('.cart-badge');
    if (!badge) return;
    const count = Cart.count();
    badge.textContent = count ? count : '';
  }

  function renderCartPreview() {
    // small dropdown preview in nav if exists
    const preview = qs('#cartPreview');
    if (!preview) return;
    preview.innerHTML = '';
    if (!Cart.items.length) { preview.innerHTML = '<div class="muted">Your cart is empty.</div>'; return; }

    Cart.items.forEach(it => {
      const prod = DATA.products.find(p => p.id === it.id) || {};
      const row = document.createElement('div');
      row.className = 'cart-preview-row';
      row.innerHTML = `
        <img src="${it.image || 'assets/images/products/placeholder.png'}" alt="${it.name}" style="width:64px;height:64px;object-fit:cover;border-radius:6px;margin-right:10px">
        <div style="flex:1">
          <div style="font-weight:600">${it.name}</div>
          <div class="muted">${it.qty} × ${formatCurrency(it.price, it.currency)}</div>
        </div>
        <button class="muted remove-cart" data-id="${it.id}" aria-label="Remove">✕</button>
      `;
      preview.appendChild(row);
    });

    const checkoutBtn = document.createElement('a');
    checkoutBtn.href = 'cart.html';
    checkoutBtn.className = 'btn-primary';
    checkoutBtn.textContent = 'View Cart';
    preview.appendChild(checkoutBtn);

    qsa('.remove-cart').forEach(b => b.addEventListener('click', () => Cart.remove(b.dataset.id)));
  }

  /* ================== CART PAGE RENDER ================== */
  function renderCartPage() {
    const itemsWrap = qs('#cartItems');
    const summaryWrap = qs('#cartSummary');
    if (!itemsWrap || !summaryWrap) return;

    itemsWrap.innerHTML = '';
    if (!Cart.items.length) { itemsWrap.innerHTML = '<p class="muted">Your cart is empty.</p>'; return; }

    Cart.items.forEach(it => {
      const prod = DATA.products.find(p => p.id === it.id) || {};
      const row = document.createElement('div');
      row.className = 'cart-row';
      row.innerHTML = `
        <div style="display:flex;gap:12px;align-items:center">
          <img src="${it.image || 'assets/images/products/placeholder.png'}" alt="${it.name}" style="width:96px;height:96px;object-fit:cover;border-radius:8px">
          <div>
            <div style="font-weight:700">${it.name}</div>
            <div class="muted">${formatCurrency(it.price, it.currency)}</div>
            <div style="margin-top:8px">
              <input type="number" min="0" value="${it.qty}" class="cart-qty" data-id="${it.id}" style="width:68px;padding:6px;border-radius:6px;border:none">
              <button class="muted remove-cart" data-id="${it.id}" style="margin-left:8px">Remove</button>
            </div>
          </div>
        </div>
      `;
      itemsWrap.appendChild(row);
    });

    // summary
    summaryWrap.querySelector('#cartSubtotal') && (summaryWrap.querySelector('#cartSubtotal').textContent = formatCurrency(Cart.subtotal(), 'USD'));
    summaryWrap.querySelector('#cartTotal') && (summaryWrap.querySelector('#cartTotal').textContent = formatCurrency(Cart.subtotal(), 'USD'));
    summaryWrap.querySelector('#checkoutBtn') && (summaryWrap.querySelector('#checkoutBtn').disabled = Cart.items.length === 0);

    // bind qty changes & remove
    qsa('.cart-qty').forEach(input => input.addEventListener('change', (e) => {
      const id = input.dataset.id; const val = Number(input.value) || 0; Cart.update(id, val);
    }));
    qsa('.remove-cart').forEach(b => b.addEventListener('click', () => Cart.remove(b.dataset.id)));
  }

  /* ================== BLOG RENDER ================== */
  function renderBlog() {
    const grid = qs('#blogGrid');
    if (!grid) return;
    grid.innerHTML = '';
    DATA.blogPosts.forEach(post => {
      const art = document.createElement('article');
      art.className = 'news-card reveal fade-up';
      art.innerHTML = `
        <img src="${post.image}" alt="${post.title}">
        <div style="padding:12px">
          <h3>${post.title}</h3>
          <p class="muted">${post.excerpt}</p>
          <a href="blog.html#${post.id}" class="btn-secondary">Read More</a>
        </div>
      `;
      grid.appendChild(art);
    });
  }

  /* ================== GLOBAL UI BINDINGS ================== */
  function bindGlobalUI() {
    // open cart preview on hover or click
    const cartBtn = qs('.icon-btn[href="cart.html"]');
    if (cartBtn) {
      cartBtn.addEventListener('mouseenter', () => { const p = qs('#cartPreview'); if (p) p.classList.add('open'); });
      cartBtn.addEventListener('mouseleave', () => { const p = qs('#cartPreview'); if (p) p.classList.remove('open'); });
    }

    // If on cart page, render full cart
    if (window.location.pathname.split('/').pop() === 'cart.html') renderCartPage();

    // expose quick view global (for other scripts)
    window.Acumen.openQuickView = openQuickView;

    // close modal with ESC
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { const m = qs('.modal.active'); if (m) m.classList.remove('active'); } });

    // Listen to cart changes to re-render cart page if present
    document.addEventListener('acumen.cart.change', debounce(() => { if (window.location.pathname.split('/').pop() === 'cart.html') renderCartPage(); }, 120));
  }

  // expose app API
  window.Acumen.app = {
    Cart,
    renderHome,
    renderCollection,
    renderProductFromQuery,
    renderBlog,
    renderCartPage,
    openQuickView
  };

})();
