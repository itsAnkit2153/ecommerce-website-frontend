// Products Array
const products = [
  {
    id: 1,
    title: "Autumn Hoodie",
    price: 264.9,
    image: "https://pangaia.com/cdn/shop/products/Recycled-Nylon-NW-Flwrdwn-Quilted-Collarless-Jacket-Cerulean-Blue-Female-1_bf4b2a54-8a7f-4174-bc49-8ef22b24bfdd.jpg?v=1666708230&width=1426",
  },
  {
    id: 2,
    title: "FUSION HOODIE",
    price: 295,
    image: "https://images.undiz.com/on/demandware.static/-/Sites-ZLIN-master/default/dw2264d914/merch/BTS/654206666_x.jpg?sw=1250",
  },
  {
    id: 3,
    title: "Chestnut Brown",
    price: 74.9,
    image: "images/Chestnut.jpg",
  },
  {
    id: 4,
    title: "Nike Sportswear",
    price: 80,
    image: "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/61734ec7-dad8-40f3-9b95-c7500939150a/sportswear-club-mens-french-terry-crew-neck-sweatshirt-tdFDRc.png",
  },
  {
    id: 5,
    title: "Champion BASIC",
    price: 48.99,
    image: "https://img01.ztat.net/article/spp-media-p1/7067458719b744fe81ffee62d3d0b912/abad421e7d8e47f08a2abc1c6ffe07dc.jpg?imwidth=1800",
  },
  {
    id: 6,
    title: "Cotton Hoodie",
    price: 395,
    image: "https://pangaia.com/cdn/shop/files/Reclaim-3.0-Hoodie-Reclaim-Jade-Womens-3.jpg?v=1693398673&width=1426",
  },
  {
    id: 7,
    title: "CLASSIC CREWNECK",
    price: 48.99,
    image: "https://img01.ztat.net/article/spp-media-p1/10cea44041564f81ac585fc6c8978907/c4c32dbc45dd4dbc9d15087c846538f2.jpg?imwidth=1800",
  },
  {
    id: 8,
    title: "TAPE HOODED",
    price: 79.99,
    image: "https://img01.ztat.net/article/spp-media-p1/d391f90be278469ebfdff731800cfccc/6d2101bd672f4e059501f01fe726f315.jpg?imwidth=1800",
  },
];

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const menuIcon = document.getElementById('menu-icon');
  const navbar = document.querySelector('.navbar');
  const productList = document.getElementById('productList');
  const cartItemsElement = document.getElementById('cartItems');
  const cartTotalElement = document.getElementById('cartTotal');
  const cartIcon = document.getElementById('cart-icon');

  // Cart Data
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  
  // Clean up cart data on load - remove any invalid items
  cart = cart.filter(item => {
    const productExists = products.find(p => p.id === item.id);
    return productExists && item.quantity > 0;
  });
  localStorage.setItem("cart", JSON.stringify(cart));

  // Mobile Menu Toggle
  if (menuIcon) {
    menuIcon.addEventListener('click', () => {
      navbar.classList.toggle('active');
    });
  }

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (navbar && navbar.classList.contains('active') && !e.target.closest('.nav')) {
      navbar.classList.remove('active');
    }
  });

  // Product rendering
  function renderProducts() {
    if (!productList) return;

    productList.innerHTML = products.map(product => `
      <div class="product">
        <img 
          src="${product.image}" 
          alt="${product.title}" 
          class="product-img" 
          loading="lazy" 
          onerror="this.onerror=null; this.src='https://via.placeholder.com/350x450?text=Product+Image'; this.classList.add('error')"
        >
        <div class="product-info">
          <h2 class="product-title">${product.title}</h2>
          <p class="product-price">$${product.price.toFixed(2)}</p>
          <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
        </div>
      </div>
    `).join("");

    // Add to cart event listeners
    document.querySelectorAll('.add-to-cart').forEach(button => {
      button.addEventListener('click', (e) => {
        const productId = parseInt(e.target.getAttribute('data-id'));
        const product = products.find(p => p.id === productId);
        if (product) {
          addToCart(product);
          showNotification('Item added to cart!');
        }
      });
    });

    // Add image load event listeners
    document.querySelectorAll('.product-img').forEach(img => {
      img.addEventListener('load', () => {
        img.style.opacity = '1';
      });
      
      img.addEventListener('error', () => {
        img.classList.add('error');
      });
    });
  }

  function addToCart(product) {
    if (!product || !product.id) return;

    const existingProduct = cart.find(item => item.id === product.id);
    if (existingProduct) {
      existingProduct.quantity = (existingProduct.quantity || 1) + 1;
    } else {
      cart.push({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        quantity: 1
      });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartIcon();
    renderCartItems();
  }

  function renderCartItems() {
    if (!cartItemsElement) return;

    if (cart.length === 0) {
      cartItemsElement.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
      if (cartTotalElement) {
        cartTotalElement.textContent = 'Total: $0.00';
      }
      return;
    }

    cartItemsElement.innerHTML = cart.map(item => {
      const product = products.find(p => p.id === item.id);
      if (!product) return '';
      
      return `
        <div class="cart-item">
          <img 
            src="${product.image}" 
            alt="${product.title}" 
            onerror="this.onerror=null; this.src='https://via.placeholder.com/100x100?text=Product'; this.classList.add('error')" 
            loading="lazy"
          >
          <div class="cart-item-info">
            <h2 class="cart-item-title">${product.title}</h2>
            <div class="quantity-controls">
              <button class="quantity-btn minus" data-id="${item.id}">-</button>
              <input 
                class="cart-item-quantity"
                type="number"
                min="1"
                value="${item.quantity || 1}"
                data-id="${item.id}"
              >
              <button class="quantity-btn plus" data-id="${item.id}">+</button>
            </div>
            <button class="remove-from-cart" data-id="${item.id}">Remove</button>
          </div>
          <h2 class="cart-item-price">$${(product.price * (item.quantity || 1)).toFixed(2)}</h2>
        </div>
      `;
    }).filter(Boolean).join("");

    // Cart event listeners
    setupCartEventListeners();
    updateCartTotal();
  }

  function setupCartEventListeners() {
    // Remove item
    document.querySelectorAll('.remove-from-cart').forEach(button => {
      button.addEventListener('click', (e) => {
        const id = parseInt(e.target.getAttribute('data-id'));
        removeFromCart(id);
      });
    });

    // Quantity buttons
    document.querySelectorAll('.quantity-btn').forEach(button => {
      button.addEventListener('click', (e) => {
        const id = parseInt(e.target.getAttribute('data-id'));
        const isPlus = e.target.classList.contains('plus');
        updateQuantity(id, isPlus);
      });
    });

    // Quantity input
    document.querySelectorAll('.cart-item-quantity').forEach(input => {
      input.addEventListener('change', (e) => {
        const id = parseInt(e.target.getAttribute('data-id'));
        const value = parseInt(e.target.value);
        if (value >= 1) {
          updateQuantity(id, null, value);
        }
      });
    });
  }

  function updateQuantity(id, isPlus, directValue = null) {
    const item = cart.find(item => item.id === id);
    if (!item) return;

    if (directValue !== null) {
      item.quantity = directValue;
    } else {
      item.quantity = (item.quantity || 1) + (isPlus ? 1 : -1);
    }

    if (item.quantity < 1) {
      removeFromCart(id);
      return;
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    renderCartItems();
    updateCartIcon();
  }

  function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCartItems();
    updateCartIcon();
    showNotification('Item removed from cart');
  }

  function updateCartTotal() {
    if (!cartTotalElement) return;

    const total = cart.reduce((sum, item) => {
      const product = products.find(p => p.id === item.id);
      if (!product) return sum; // Skip invalid products
      return sum + (product.price * (item.quantity || 1));
    }, 0);
    
    cartTotalElement.textContent = `Total: $${total.toFixed(2)}`;
  }

  function updateCartIcon() {
    if (!cartIcon) return;
    const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    cartIcon.setAttribute('data-quantity', totalItems.toString());
  }

  function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 2000);
  }

  // Initialize page based on current route
  if (window.location.pathname.includes('cart.html')) {
    renderCartItems();
  } else {
    renderProducts();
  }
  updateCartIcon();
});
