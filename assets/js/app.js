// === Helper Functions ===
function renderProducts({ containerId, category = null, featured = false, limit = null }) {
  const container = document.getElementById(containerId);
  let items = PRODUCTS;

  if (category) items = items.filter(p => p.category === category);
  if (featured) items = items.filter(p => p.featured);

  if (limit) items = items.slice(0, limit);

  container.innerHTML = items.map(p => `
    <div class="col-md-4">
      <div class="card h-100">
        <img src="${p.images[0]}" class="card-img-top" alt="${p.name}">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${p.name}</h5>
          <p class="card-text text-muted">Rs. ${p.price}</p>
          <a href="product.html?sku=${p.sku}" class="btn btn-gold mt-auto">View Details</a>
        </div>
      </div>
    </div>
  `).join('');
}

function getProductBySlug(sku) {
  return PRODUCTS.find(p => p.sku === sku);
}

function renderProductDetail(product, containerId) {
  const container = document.getElementById(containerId);
  if (!product) {
    container.innerHTML = "<p>Product not found.</p>";
    return;
  }

  container.innerHTML = `
    <div class="row g-4">
      <div class="col-md-6">
        <img src="${product.images[0]}" class="img-fluid rounded" alt="${product.name}">
      </div>
      <div class="col-md-6">
        <h1>${product.name}</h1>
        <p class="text-gold h4 mb-3">Rs. ${product.price}</p>
        <p>${product.description}</p>
        <a href="https://wa.me/YOURNUMBER?text=I want to order: ${product.name}" target="_blank" class="btn btn-gold btn-lg mt-3">Order with Cash on Delivery</a>
      </div>
    </div>
  `;
}
