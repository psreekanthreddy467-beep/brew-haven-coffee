const API_URL = "https://brew-haven-coffee.onrender.com/api/products";

let products = [];

async function loadProducts() {
    try {
        const response = await fetch("https://brew-haven-coffee.onrender.com/api/products")

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();

        console.log("Backend response:", result);

        products = result.data;

        console.log("Products loaded from backend:", products);

        // Display products here
      

    } catch (error) {
        console.error("Error loading products:", error);

        const menuContainer = document.querySelector("#menu-container");

        if (menuContainer) {
            menuContainer.innerHTML =
                "<p>Unable to load products. Please try again.</p>";
        }
    }
}/* ==========================================================================
   BREW HAVEN COFFEE — SCRIPT
   Vanilla ES6, no frameworks
   ========================================================================== */
(() => {
  'use strict';

  document.getElementById('year') && (document.getElementById('year').textContent = new Date().getFullYear());

  /* -----------------------------------------------------------------------
     MENU DATA
  ----------------------------------------------------------------------- */
  let MENU = [
    { id:'espresso',   name:'Espresso',           cat:'coffee', price:3.25, rating:4.9, reviews:214, desc:'A bold, concentrated double shot with a rich crema.', img:'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?q=80&w=500&auto=format&fit=crop' },
    { id:'cappuccino', name:'Cappuccino',         cat:'coffee', price:4.25, rating:4.8, reviews:187, desc:'Equal parts espresso, steamed milk, and silky foam.', img:'https://images.unsplash.com/photo-1572442388796-11668a67e53d?q=80&w=500&auto=format&fit=crop' },
    { id:'latte',      name:'Latte',              cat:'coffee', price:4.5,  rating:4.9, reviews:302, desc:'Smooth espresso with velvety steamed milk and light foam.', img:'https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=500&auto=format&fit=crop' },
    { id:'americano',  name:'Americano',          cat:'coffee', price:3.5,  rating:4.6, reviews:129, desc:'Espresso lengthened with hot water for a lighter body.', img:'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?q=80&w=500&auto=format&fit=crop' },
    { id:'mocha',      name:'Mocha',              cat:'coffee', price:4.75, rating:4.7, reviews:158, desc:'Espresso and steamed milk swirled with rich dark chocolate.', img:'https://images.unsplash.com/photo-1517701604599-bb29b565090c?q=80&w=500&auto=format&fit=crop' },
    { id:'coldbrew',   name:'Cold Brew',          cat:'cold',   price:4.75, rating:4.8, reviews:241, desc:'Steeped 18 hours for a smooth, low-acid, bold finish.', img:'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?q=80&w=500&auto=format&fit=crop' },
    { id:'caramel',    name:'Caramel Macchiato',  cat:'cold',   price:5.25, rating:4.9, reviews:276, desc:'Vanilla, milk, espresso, and a caramel drizzle finish.', img:'https://images.unsplash.com/photo-1485808191679-5f86510681a2?q=80&w=500&auto=format&fit=crop' },
    { id:'hotchoc',    name:'Hot Chocolate',      cat:'coffee', price:4.0,  rating:4.7, reviews:112, desc:'Melted dark chocolate and steamed milk, topped with cream.', img:'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?q=80&w=500&auto=format&fit=crop' },
    { id:'muffin',     name:'Blueberry Muffin',   cat:'bakery', price:3.75, rating:4.6, reviews:98,  desc:'Baked daily with plump, wild blueberries and a golden top.', img:'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?q=80&w=500&auto=format&fit=crop' },
    { id:'brownie',    name:'Chocolate Brownie',  cat:'bakery', price:3.95, rating:4.9, reviews:184, desc:'Fudgy, dense, and studded with dark chocolate chunks.', img:'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=500&auto=format&fit=crop' },
    { id:'croissant',  name:'Croissant',          cat:'bakery', price:3.5,  rating:4.8, reviews:167, desc:'Butter-laminated and baked fresh each morning until flaky.', img:'https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=500&auto=format&fit=crop' },
    { id:'sandwich',   name:'Sandwich',           cat:'bakery', price:6.5,  rating:4.7, reviews:143, desc:'Toasted sourdough with seasonal fillings, made to order.', img:'https://images.unsplash.com/photo-1554433607-66b5efe9d304?q=80&w=500&auto=format&fit=crop' },
  ];
  const API_URL = "https://brew-haven-coffee.onrender.com/api/orders";

async function loadProducts() {
  try {
    const response = await fetch(`https://brew-haven-coffee.onrender.com/api/products`);

    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }

    const result = await response.json();

    MENU = result.data.map(product => ({
      id: product._id,
      name: product.name,
      cat:
        product.category === "Coffee"
          ? "coffee"
          : product.category === "Cold Brews"
          ? "cold"
          : product.category === "Bakery"
          ? "bakery"
          : "other",
      price: product.price,
      rating: 5,
      reviews: 0,
      desc: product.description,
      img: product.image
    }));

    console.log("MENU updated from MongoDB:", MENU);

    renderMenu();

  } catch (error) {
    console.error("Error loading products:", error);
  }
}

  const stars = (r) => '★★★★★'.slice(0, Math.round(r)) + '☆☆☆☆☆'.slice(0, 5 - Math.round(r));
  const money = (n) => `₹${n.toFixed(0)}`;

  /* -----------------------------------------------------------------------
     STATE (persisted)
  ----------------------------------------------------------------------- */
  const store = {
    get(key, fallback){ try{ const v = JSON.parse(localStorage.getItem(key)); return v ?? fallback; }catch(e){ return fallback; } },
    set(key, val){ try{ localStorage.setItem(key, JSON.stringify(val)); }catch(e){} }
  };
  let cart = store.get('bh_cart', {});         // { id: qty }
  let wishlist = store.get('bh_wishlist', []); // [id]

  const saveCart = () => store.set('bh_cart', cart);
  const saveWishlist = () => store.set('bh_wishlist', wishlist);

  /* -----------------------------------------------------------------------
     LOADER
  ----------------------------------------------------------------------- */
  window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    if(loader){ setTimeout(() => loader.classList.add('hide'), 500); }
  });

  /* -----------------------------------------------------------------------
     SCROLL PROGRESS + STICKY HEADER + BACK TO TOP
  ----------------------------------------------------------------------- */
  const progress = document.getElementById('scrollProgress');
  const header = document.getElementById('siteHeader');
  const backToTop = document.getElementById('backToTop');

  const onScroll = () => {
    const h = document.documentElement;
    const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
    if(progress) progress.style.width = scrolled + '%';
    if(header) header.classList.toggle('scrolled', h.scrollTop > 20);
    if(backToTop) backToTop.classList.toggle('show', h.scrollTop > 500);
  };
  document.addEventListener('scroll', onScroll);
  onScroll();
  backToTop && backToTop.addEventListener('click', () => window.scrollTo({ top:0, behavior:'smooth' }));

  /* Active nav link on scroll */
  const sections = document.querySelectorAll('main section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a');
  if(sections.length && navAnchors.length){
    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if(entry.isIntersecting){
          navAnchors.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${entry.target.id}`));
        }
      });
    }, { rootMargin:'-40% 0px -50% 0px' });
    sections.forEach(s => navObserver.observe(s));
  }

  /* -----------------------------------------------------------------------
     MOBILE NAV
  ----------------------------------------------------------------------- */
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  hamburger && hamburger.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', open);
  });
  navLinks && navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    navLinks.classList.remove('open'); hamburger.classList.remove('open');
  }));

  /* -----------------------------------------------------------------------
     DARK / LIGHT MODE
  ----------------------------------------------------------------------- */
  const themeToggle = document.getElementById('themeToggle');
  const applyTheme = (t) => document.documentElement.setAttribute('data-theme', t);
  applyTheme(store.get('bh_theme', 'light'));
  themeToggle && themeToggle.addEventListener('click', () => {
    const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next); store.set('bh_theme', next);
  });

  /* -----------------------------------------------------------------------
     SCROLL REVEAL ANIMATIONS + COUNTERS
  ----------------------------------------------------------------------- */
  const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
  const counters = document.querySelectorAll('.counter');

  const animateCounter = (el) => {
    const target = +el.dataset.target;
    const duration = 1400;
    const start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.floor(eased * target).toLocaleString();
      if(p < 1) requestAnimationFrame(step); else el.textContent = target.toLocaleString();
    };
    requestAnimationFrame(step);
  };

  const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('visible');
        if(entry.target.classList.contains('counter')) animateCounter(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold:0.2 });

  revealEls.forEach(el => revealObserver.observe(el));
  counters.forEach(el => revealObserver.observe(el));

  /* -----------------------------------------------------------------------
     MENU RENDER + FILTER + SEARCH + FAVORITES
  ----------------------------------------------------------------------- */
  const menuGrid = document.getElementById('menuGrid');

  const cardHTML = (item) => `
    <article class="menu-card" data-cat="${item.cat}" data-id="${item.id}">
      <div class="menu-card-media">
        <img src="${item.img}" alt="${item.name}" loading="lazy">
        <button class="menu-card-fav ${wishlist.includes(item.id) ? 'active' : ''}" data-fav="${item.id}" aria-label="Add ${item.name} to wishlist">${wishlist.includes(item.id) ? '♥' : '♡'}</button>
      </div>
      <div class="menu-card-body">
        <div class="menu-card-top"><h3>${item.name}</h3><span class="menu-card-price">${money(item.price)}</span></div>
        <p class="desc">${item.desc}</p>
        <div class="menu-card-rating">${stars(item.rating)} <span>${item.rating} (${item.reviews})</span></div>
        <button class="add-cart-btn" data-add="${item.id}">Add to Cart</button>
      </div>
    </article>`;

  const renderMenu = (list = MENU) => {
    if(!menuGrid) return;
    menuGrid.innerHTML = list.map(cardHTML).join('') || '<p class="drawer-empty">No items match your search.</p>';
  };
  // Products will be rendered after MongoDB data is loaded

  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.filter;
      renderMenu(f === 'all' ? MENU : MENU.filter(m => m.cat === f));
      // re-observe newly injected cards for hover-only (no reveal needed here)
    });
  });

  /* Live menu search overlay */
  const searchToggle = document.getElementById('searchToggle');
  const searchOverlay = document.getElementById('searchOverlay');
  const searchClose = document.getElementById('searchClose');
  const searchInput = document.getElementById('menuSearchInput');
  const searchResults = document.getElementById('searchResults');

  const openSearch = () => { searchOverlay.classList.add('open'); setTimeout(() => searchInput.focus(), 300); };
  const closeSearch = () => searchOverlay.classList.remove('open');
  searchToggle && searchToggle.addEventListener('click', openSearch);
  searchClose && searchClose.addEventListener('click', closeSearch);
  searchOverlay && searchOverlay.addEventListener('click', (e) => { if(e.target === searchOverlay) closeSearch(); });

  const renderSearchResults = (q) => {
    if(!q){ searchResults.innerHTML = ''; return; }
    const matches = MENU.filter(m => m.name.toLowerCase().includes(q.toLowerCase()) || m.desc.toLowerCase().includes(q.toLowerCase()));
    searchResults.innerHTML = matches.length
      ? matches.map(m => `<div class="search-result-item"><span>${m.name}</span><strong>${money(m.price)}</strong></div>`).join('')
      : '<p class="search-empty">No matches — try "latte" or "brownie".</p>';
  };
  searchInput && searchInput.addEventListener('input', (e) => renderSearchResults(e.target.value));

  /* -----------------------------------------------------------------------
     CART + WISHLIST LOGIC (event delegation)
  ----------------------------------------------------------------------- */
  const cartBadge = document.getElementById('cartBadge');
  const wishlistBadge = document.getElementById('wishlistBadge');
  const cartItemsEl = document.getElementById('cartItems');
  const wishlistItemsEl = document.getElementById('wishlistItems');
  const cartSubtotalEl = document.getElementById('cartSubtotal');

  const findItem = (id) => MENU.find(m => m.id === id);

  const updateBadges = () => {
    const cartCount = Object.values(cart).reduce((a,b) => a+b, 0);
    if(cartBadge) cartBadge.textContent = cartCount;
    if(wishlistBadge) wishlistBadge.textContent = wishlist.length;
  };

  const renderCart = () => {
    if(!cartItemsEl) return;
    const ids = Object.keys(cart).filter(id => cart[id] > 0);
    if(!ids.length){
      cartItemsEl.innerHTML = '<p class="drawer-empty">Your cart is empty — add something delicious.</p>';
      cartSubtotalEl && (cartSubtotalEl.textContent = money(0));
      updateBadges(); return;
    }
    let subtotal = 0;
    cartItemsEl.innerHTML = ids.map(id => {
      const item = findItem(id); const qty = cart[id]; subtotal += item.price * qty;
      return `<div class="drawer-item" data-id="${id}">
        <img src="${item.img}" alt="${item.name}">
        <div class="drawer-item-info">
          <h4>${item.name}</h4><span>${money(item.price)}</span>
          <div class="qty-control">
            <button data-qty="dec" data-id="${id}">−</button>
            <span>${qty}</span>
            <button data-qty="inc" data-id="${id}">+</button>
            <button class="drawer-remove" data-remove="${id}">Remove</button>
          </div>
        </div>
      </div>`;
    }).join('');
    cartSubtotalEl && (cartSubtotalEl.textContent = money(subtotal));
    updateBadges();
  };

  const renderWishlist = () => {
    if(!wishlistItemsEl) return;
    if(!wishlist.length){ wishlistItemsEl.innerHTML = '<p class="drawer-empty">No favorites yet — tap the heart on a menu item.</p>'; updateBadges(); return; }
    wishlistItemsEl.innerHTML = wishlist.map(id => {
      const item = findItem(id); if(!item) return '';
      return `<div class="drawer-item" data-id="${id}">
        <img src="${item.img}" alt="${item.name}">
        <div class="drawer-item-info">
          <h4>${item.name}</h4><span>${money(item.price)}</span>
          <div class="qty-control">
            <button class="add-cart-btn" style="padding:0.3rem 0.9rem" data-add="${id}">Add to Cart</button>
            <button class="drawer-remove" data-unfav="${id}">Remove</button>
          </div>
        </div>
      </div>`;
    }).join('');
    updateBadges();
  };

  document.addEventListener('click', (e) => {
    const addBtn = e.target.closest('[data-add]');
    if(addBtn){
      const id = addBtn.dataset.add;
      cart[id] = (cart[id] || 0) + 1; saveCart(); renderCart(); updateBadges();
      addBtn.textContent = 'Added ✓'; setTimeout(() => addBtn.textContent = addBtn.dataset.add ? 'Add to Cart' : addBtn.textContent, 900);
      openDrawer('cartDrawer');
      return;
    }
    const favBtn = e.target.closest('[data-fav]');
    if(favBtn){
      const id = favBtn.dataset.fav;
      if(wishlist.includes(id)){ wishlist = wishlist.filter(w => w !== id); favBtn.classList.remove('active'); favBtn.textContent = '♡'; }
      else { wishlist.push(id); favBtn.classList.add('active'); favBtn.textContent = '♥'; }
      saveWishlist(); renderWishlist(); updateBadges();
      return;
    }
    const qtyBtn = e.target.closest('[data-qty]');
    if(qtyBtn){
      const id = qtyBtn.dataset.id;
      if(qtyBtn.dataset.qty === 'inc') cart[id] = (cart[id]||0) + 1;
      else cart[id] = Math.max(0, (cart[id]||0) - 1);
      if(cart[id] === 0) delete cart[id];
      saveCart(); renderCart();
      return;
    }
    const removeBtn = e.target.closest('[data-remove]');
    if(removeBtn){ delete cart[removeBtn.dataset.remove]; saveCart(); renderCart(); return; }
    const unfavBtn = e.target.closest('[data-unfav]');
    if(unfavBtn){ wishlist = wishlist.filter(w => w !== unfavBtn.dataset.unfav); saveWishlist(); renderWishlist(); updateBadges(); return; }
  });

  /* -----------------------------------------------------------------------
     DRAWERS
  ----------------------------------------------------------------------- */
  const overlay = document.getElementById('drawerOverlay');
  const openDrawer = (id) => {
    document.getElementById(id)?.classList.add('open');
    overlay?.classList.add('show');
  };
  const closeDrawers = () => {
    document.querySelectorAll('.drawer').forEach(d => d.classList.remove('open'));
    overlay?.classList.remove('show');
  };
  document.getElementById('cartToggle')?.addEventListener('click', () => { renderCart(); openDrawer('cartDrawer'); });
  document.getElementById('wishlistToggle')?.addEventListener('click', () => { renderWishlist(); openDrawer('wishlistDrawer'); });
  document.getElementById('cartClose')?.addEventListener('click', closeDrawers);
  document.getElementById('wishlistClose')?.addEventListener('click', closeDrawers);
  overlay?.addEventListener('click', closeDrawers);

  renderCart(); renderWishlist(); updateBadges();

  /* -----------------------------------------------------------------------
     TESTIMONIAL SLIDER
  ----------------------------------------------------------------------- */
  const TESTIMONIALS = [
    { name:'Amelia Ross',    role:'Regular Guest', rating:5, quote:'Best latte in Portland, hands down. The staff know my order before I finish saying hello.', img:'https://randomuser.me/api/portraits/women/68.jpg' },
    { name:'Marcus Webb',    role:'Remote Worker',  rating:5, quote:'My unofficial office. Fast wifi, strong coffee, and nobody rushes you out.', img:'https://randomuser.me/api/portraits/men/32.jpg' },
    { name:'Priya Nair',     role:'Food Blogger',   rating:5, quote:'The cold brew is smooth with zero bitterness. Their brownie pairs perfectly with it.', img:'https://randomuser.me/api/portraits/women/44.jpg' },
    { name:'Daniel Osei',    role:'Local Regular',  rating:5, quote:'Cozy, warm, and the loyalty rewards actually feel generous. I come back every week.', img:'https://randomuser.me/api/portraits/men/76.jpg' },
    { name:'Grace Lin',      role:'Student',        rating:5, quote:'The student discount plus a quiet corner table makes this my go-to study spot.', img:'https://randomuser.me/api/portraits/women/21.jpg' },
    { name:'Tomás Rivera',   role:'Barista Fan',    rating:5, quote:'You can tell every drink is made with care. The caramel macchiato is unbeatable.', img:'https://randomuser.me/api/portraits/men/54.jpg' },
  ];
  const track = document.getElementById('testimonialTrack');
  const dotsWrap = document.getElementById('sliderDots');
  let tIndex = 0, perView = 1;

  const getPerView = () => window.innerWidth >= 1080 ? 3 : window.innerWidth >= 760 ? 2 : 1;

  const renderTestimonials = () => {
    if(!track) return;
    track.innerHTML = TESTIMONIALS.map(t => `
      <div class="testimonial-card">
        <div class="testimonial-inner">
          <img src="${t.img}" alt="${t.name}" loading="lazy">
          <div class="testimonial-stars">${'★'.repeat(t.rating)}</div>
          <p class="quote">"${t.quote}"</p>
          <strong>${t.name}</strong><small>${t.role}</small>
        </div>
      </div>`).join('');
    perView = getPerView();
    const pages = Math.max(1, TESTIMONIALS.length - perView + 1);
    dotsWrap.innerHTML = Array.from({length: pages}).map((_,i) => `<button data-i="${i}" class="${i===0?'active':''}"></button>`).join('');
    goTo(0);
  };

  const goTo = (i) => {
    if(!track) return;
    const pages = Math.max(1, TESTIMONIALS.length - perView + 1);
    tIndex = Math.max(0, Math.min(i, pages - 1));
    track.style.transform = `translateX(-${tIndex * (100/perView)}%)`;
    dotsWrap?.querySelectorAll('button').forEach((b,idx) => b.classList.toggle('active', idx === tIndex));
  };

  document.getElementById('prevTestimonial')?.addEventListener('click', () => goTo(tIndex - 1));
  document.getElementById('nextTestimonial')?.addEventListener('click', () => goTo(tIndex + 1));
  dotsWrap?.addEventListener('click', (e) => { const b = e.target.closest('button'); if(b) goTo(+b.dataset.i); });
  window.addEventListener('resize', () => { const p = getPerView(); if(p !== perView) renderTestimonials(); });

  renderTestimonials();

  let autoSlide = setInterval(() => { if(track) goTo((tIndex + 1) % Math.max(1, TESTIMONIALS.length - perView + 1)); }, 6000);
  document.querySelector('.testimonial-slider')?.addEventListener('mouseenter', () => clearInterval(autoSlide));

  /* -----------------------------------------------------------------------
     FAQ ACCORDION
  ----------------------------------------------------------------------- */
  document.querySelectorAll('.faq-q').forEach(q => {
    q.addEventListener('click', () => {
      const item = q.closest('.faq-item');
      const wasOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if(!wasOpen) item.classList.add('open');
    });
  });

  /* -----------------------------------------------------------------------
     FORMS (reservation / contact / newsletter)
  ----------------------------------------------------------------------- */
  const handleFormSuccess = (form, successEl, msg) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      successEl.textContent = msg;
      form.reset();
      setTimeout(() => successEl.textContent = '', 5000);
    });
  };
  const resForm = document.getElementById('reservationForm');
  resForm && handleFormSuccess(resForm, document.getElementById('resSuccess'), '✓ Table reserved! A confirmation email is on its way.');

  const contactForm = document.getElementById('contactForm');
  contactForm && handleFormSuccess(contactForm, document.getElementById('contactSuccess'), '✓ Message sent! We\'ll reply within 24 hours.');

  document.getElementById('footerNewsletter')?.addEventListener('submit', (e) => {
    e.preventDefault(); e.target.reset();
    alert('Thanks for subscribing to the Brew Club!');
  });

  /* -----------------------------------------------------------------------
     NEWSLETTER POPUP (once per session, after delay)
  ----------------------------------------------------------------------- */
  const popup = document.getElementById('newsletterPopup');
  const popupOverlay = document.getElementById('popupOverlay');
  if(popup && !sessionStorage.getItem('bh_popup_shown')){
    setTimeout(() => { popup.classList.add('show'); popupOverlay.classList.add('show'); sessionStorage.setItem('bh_popup_shown','1'); }, 6000);
  }
  const closePopup = () => { popup?.classList.remove('show'); popupOverlay?.classList.remove('show'); };
  document.getElementById('popupClose')?.addEventListener('click', closePopup);
  popupOverlay?.addEventListener('click', closePopup);
  document.getElementById('popupForm')?.addEventListener('submit', (e) => { e.preventDefault(); closePopup(); alert('Welcome to the Brew Club! Check your inbox for 15% off.'); });

  /* -----------------------------------------------------------------------
     CHATBOT WIDGET (placeholder)
  ----------------------------------------------------------------------- */
  const chatbotToggle = document.getElementById('chatbotToggle');
  const chatbotPanel = document.getElementById('chatbotPanel');
  chatbotToggle?.addEventListener('click', () => chatbotPanel.classList.toggle('open'));
  document.getElementById('chatbotClose')?.addEventListener('click', () => chatbotPanel.classList.remove('open'));

  /* -----------------------------------------------------------------------
     CHECKOUT PAGE LOGIC
  ----------------------------------------------------------------------- */
  const checkoutItemsEl = document.getElementById('checkoutItems');
  if(checkoutItemsEl){
    const ids = Object.keys(cart).filter(id => cart[id] > 0);
    let subtotal = 0;
    checkoutItemsEl.innerHTML = ids.length ? ids.map(id => {
      const item = findItem(id); const qty = cart[id]; subtotal += item.price * qty;
      return `<div class="checkout-item-row"><span>${item.name} × ${qty}</span><span>${money(item.price*qty)}</span></div>`;
    }).join('') : '<p class="drawer-empty">Your cart is empty. <a href="index.html#menu">Browse the menu</a>.</p>';
    document.getElementById('sumSubtotal') && (document.getElementById('sumSubtotal').textContent = money(subtotal));
    document.getElementById('sumTotal') && (document.getElementById('sumTotal').textContent = money(subtotal + (ids.length ? 3.5 : 0)));

    document.getElementById('checkoutForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const form = e.target;
  const successEl = document.getElementById('checkoutSuccess');

  const name =
    document.getElementById('customerName')?.value.trim();

const phone =
    document.getElementById('customerPhone')?.value.trim();

const email =
    document.getElementById('customerEmail')?.value.trim();

const address =
    document.getElementById('customerAddress')?.value.trim();
    console.log("CUSTOMER DATA:", {
    name,
    email,
    phone,
    address
});

  const paymentMethod =
    document.getElementById('paymentMethod')?.value || 'cod';

  const items = Object.keys(cart)
  .filter(id => cart[id] > 0)
  .map(productId => {
    const product = products.find(p => p.name.toLowerCase() === productId.toLowerCase());

    if (!product) {
      console.error("Product not found:", productId);
      return null;
    }

    return {
      productId: product._id,
      quantity: cart[productId]
    };
  })
  .filter(item => item !== null);

  if (!items.length) {
    successEl.textContent = 'Please add at least one item to your cart.';
    return;
  }

  try {
    successEl.textContent = 'Placing your order...';

    const response = await fetch('https://brew-haven-coffee.onrender.com/api/orders', {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json'
      },

      body: JSON.stringify({
        customer: {
          name,
          phone,
          email,
          address
        },

        items,

        paymentMethod
      })
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Order failed');
    }

    console.log('Order created:', result.data);

    successEl.textContent =
      `✓ Order placed successfully! Order ID: ${result.data._id}`;

    cart = {};
    saveCart();

    form.reset();

  } catch (error) {

    console.error('Order error:', error);

    successEl.textContent =
      '❌ Unable to place order. Please try again.';
  }
});
  }
  

})();
document.addEventListener("DOMContentLoaded", () => {
    loadProducts();
});