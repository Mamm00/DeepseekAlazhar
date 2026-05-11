/* ═════════════════════════════════════════════════════════════
  main.js – The Loom of Al Azhar Tex
  Handles dynamic customization from localStorage,
  hero slider, tabs, lightbox, mobile menu, scroll magic.
  Every page reads the weaver's saved preferences.
═════════════════════════════════════════════════════════════ */

// ---------- Factory Defaults (the original cloth) ----------
const DEFAULTS = {
  logo: 'images/logo.png',   // Replace with real logo path
  slides: [
    { img: 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=1920&q=80', heading: 'Timeless Egyptian Fabrics', sub: 'Wholesale rolls woven with tradition', btn: 'Explore Collection' },
    { img: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=1920&q=80', heading: 'Luxury for Every Season', sub: 'Satin, Gabardine, Linen & more', btn: 'Shop Now' },
    { img: 'https://images.unsplash.com/photo-1598556776374-0a0f90f47ea5?w=1920&q=80', heading: 'Menswear Excellence', sub: 'Tailored suiting fabrics for the modern gentleman', btn: 'Discover' },
  ],
  texts: {
    heroTitle: 'Discover Al Azhar Tex',
    heroSub: 'Premium wholesale fabrics from the heart of Zagazig',
    aboutStory: 'Al Azhar Tex was born in the bustling textile lanes of Zagazig, where generations have spun threads into dreams. We supply the finest fabrics to tailors and designers across Egypt.',
    contactAddress: 'Zagazig, Sharqia Governorate, Egypt',
    phone: '+20 100 360 0949',
    workHours: 'Daily 11 AM – 7 PM | Closed Friday (جمعة إجازة)',
    footerText: '© Al Azhar Tex – Woven with passion in the Nile Delta.'
  },
  backgrounds: {
    'hero-bg': 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=1920&q=80',
    'women-header': 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=1920&q=80',
    'men-header': 'https://images.unsplash.com/photo-1598556776374-0a0f90f47ea5?w=1920&q=80',
  },
  products: {
    women: [
      { name: 'Warsaw (ورسو)', desc: 'Elegant drape, perfect for evening gowns', img: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400&q=80' },
      { name: 'Pirlanta (بيرلانتا)', desc: 'Shimmering fabric with crystal effect', img: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400&q=80' },
      { name: 'Chiffon 150 (شيفون 150)', desc: 'Lightweight, graceful flow', img: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400&q=80' },
      { name: 'Chiffon 180 (شيفون 180)', desc: 'Heavier chiffon, rich texture', img: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400&q=80' },
      { name: '625 (قماش 625)', desc: 'High-quality versatile fabric', img: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400&q=80' },
      { name: 'Bubble Satin (ستان فقاعات)', desc: 'Textured satin with 3D bubbles', img: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400&q=80' },
      { name: 'Satin Crinkle (ستان مكسر)', desc: 'Crushed satin effect', img: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400&q=80' },
      { name: 'Different Satin (أنواع مختلفة من الستان)', desc: 'Assorted satin varieties', img: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400&q=80' },
      { name: 'Fursan 180 (فرسان 180)', desc: 'Luxurious heavy fabric', img: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400&q=80' },
      { name: 'Rotana 150 (روتانا 150)', desc: 'Soft drape, perfect for dresses', img: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400&q=80' },
      { name: 'Rotana 180 (روتانا 180)', desc: 'Thicker Rotana for structured wear', img: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400&q=80' },
    ],
    men: [
      { name: 'Gabardine (جبردين)', desc: 'Durable, wrinkle-resistant', img: 'https://images.unsplash.com/photo-1598556776374-0a0f90f47ea5?w=400&q=80' },
      { name: 'Tavira (تافيرا)', desc: 'Classic suiting fabric', img: 'https://images.unsplash.com/photo-1598556776374-0a0f90f47ea5?w=400&q=80' },
      { name: 'Feskar (فسكار)', desc: 'Premium Egyptian wool blend', img: 'https://images.unsplash.com/photo-1598556776374-0a0f90f47ea5?w=400&q=80' },
      { name: 'Cashmere (كشمير)', desc: 'Soft luxury for coats', img: 'https://images.unsplash.com/photo-1598556776374-0a0f90f47ea5?w=400&q=80' },
      { name: 'Linen (كتان)', desc: 'Breathable summer fabric', img: 'https://images.unsplash.com/photo-1598556776374-0a0f90f47ea5?w=400&q=80' },
      { name: 'Cotton Blends (قطن مخلوط)', desc: 'Comfort meets durability', img: 'https://images.unsplash.com/photo-1598556776374-0a0f90f47ea5?w=400&q=80' },
      { name: 'Suiting Fabrics (أقمشة بدل)', desc: 'Tailored perfection', img: 'https://images.unsplash.com/photo-1598556776374-0a0f90f47ea5?w=400&q=80' },
      { name: 'Shirtings (أقمشة قمصان)', desc: 'Fine cottons for dress shirts', img: 'https://images.unsplash.com/photo-1598556776374-0a0f90f47ea5?w=400&q=80' },
    ],
    trending: [
      { name: 'Dantel (دانتيل)', desc: 'Lace extravagance', img: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400&q=80' },
      { name: 'Tel (تل)', desc: 'Sheer net fabric', img: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400&q=80' },
      { name: 'Georgette (جورجيت)', desc: 'Crinkly lightweight texture', img: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400&q=80' },
      { name: 'Crepe (كريب)', desc: 'Wrinkle-free drape', img: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400&q=80' },
      { name: 'Mousseline (موسلين)', desc: 'Ultra-soft double layer', img: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400&q=80' },
      { name: 'Velvet (قطيفة)', desc: 'Plush royal fabric', img: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400&q=80' },
      { name: 'Lame (لاميه)', desc: 'Metallic shine', img: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400&q=80' },
      { name: 'Tergal (ترجال)', desc: 'Crisp, formal suiting', img: 'https://images.unsplash.com/photo-1598556776374-0a0f90f47ea5?w=400&q=80' },
      { name: 'Shantoon (شانتون)', desc: 'Soft, structured drape', img: 'https://images.unsplash.com/photo-1598556776374-0a0f90f47ea5?w=400&q=80' },
      { name: 'Tulle (تول)', desc: 'Delicate netting', img: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400&q=80' },
      { name: 'Lurex (لوريكس)', desc: 'Glittering thread fabric', img: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400&q=80' },
      { name: 'Saten Shiffon (ساتان شيفون)', desc: 'Silky satin-chiffon blend', img: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400&q=80' },
    ]
  }
};

// ---------- Storage Helper (prefix to avoid clashes) ----------
const Storage = {
  prefix: 'alazhartex_',
  get(key) {
    const val = localStorage.getItem(this.prefix + key);
    try { return JSON.parse(val); } catch(e) { return val; }
  },
  set(key, value) {
    localStorage.setItem(this.prefix + key, JSON.stringify(value));
  },
  remove(key) {
    localStorage.removeItem(this.prefix + key);
  },
  resetAll() {
    Object.keys(localStorage).forEach(k => {
      if (k.startsWith(this.prefix)) localStorage.removeItem(k);
    });
  }
};

// ---------- Get Override or Fallback ----------
function getOverride(key, defaultVal) {
  const stored = Storage.get(key);
  return (stored !== undefined && stored !== null) ? stored : defaultVal;
}

// ---------- Apply Customizations on Every Page ----------
function applyCustomizations() {
  // Logo
  const logoEl = document.querySelector('.logo img');
  if (logoEl) {
    const customLogo = getOverride('logo', DEFAULTS.logo);
    logoEl.src = customLogo;
  }

  // Texts (replace elements with data-text attribute)
  document.querySelectorAll('[data-text]').forEach(el => {
    const key = el.getAttribute('data-text');
    if (DEFAULTS.texts.hasOwnProperty(key)) {
      el.textContent = getOverride('texts_' + key, DEFAULTS.texts[key]);
    }
  });

  // Background images (data-bg)
  document.querySelectorAll('[data-bg]').forEach(el => {
    const bgKey = el.getAttribute('data-bg');
    const customBg = getOverride('bg_' + bgKey, DEFAULTS.backgrounds[bgKey]);
    if (customBg) el.style.backgroundImage = `url('${customBg}')`;
  });

  // Products (if products page renders them later)
  window.customProducts = {
    women: getOverride('products_women', DEFAULTS.products.women),
    men: getOverride('products_men', DEFAULTS.products.men),
    trending: getOverride('products_trending', DEFAULTS.products.trending)
  };
}

// ---------- Hero Slider (the grand loom) ----------
function initHeroSlider() {
  const slider = document.querySelector('.hero-slider');
  if (!slider) return;
  const slidesData = getOverride('slides', DEFAULTS.slides);
  slider.innerHTML = '';
  slidesData.forEach((s, idx) => {
    const slide = document.createElement('div');
    slide.className = `slide${idx===0?' active':''}`;
    slide.style.backgroundImage = `url('${s.img}')`;
    slide.innerHTML = `
      <div class="slide-overlay">
        <h2>${s.heading}</h2>
        <p>${s.sub}</p>
        <a href="products.html" class="btn">${s.btn}</a>
      </div>`;
    slider.appendChild(slide);
  });
  // Controls
  const controls = document.createElement('div');
  controls.className = 'slider-controls';
  slidesData.forEach((_, i) => {
    const dot = document.createElement('button');
    if(i===0) dot.classList.add('active');
    dot.addEventListener('click', ()=> goToSlide(i));
    controls.appendChild(dot);
  });
  slider.appendChild(controls);

  let current = 0;
  function goToSlide(index) {
    document.querySelectorAll('.slide').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.slider-controls button').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.slide')[index].classList.add('active');
    document.querySelectorAll('.slider-controls button')[index].classList.add('active');
    current = index;
  }
  setInterval(() => {
    const next = (current + 1) % slidesData.length;
    goToSlide(next);
  }, 5000);
}

// ---------- Mobile Menu (fabric folds) ----------
function initMobileMenu() {
  const hamburger = document.querySelector('.hamburger');
  const nav = document.querySelector('.nav-list');
  if (!hamburger || !nav) return;
  hamburger.addEventListener('click', () => {
    nav.classList.toggle('open');
  });
}

// ---------- Scroll Reveal (Intersection Observer) ----------
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if(e.isIntersecting) e.target.classList.add('active');
    });
  }, { threshold: 0.1 });
  reveals.forEach(r => observer.observe(r));
}

// ---------- Tabs (Women/Men/Trending) ----------
function initTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');
  if (!tabBtns.length) return;
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.tab;
      tabPanes.forEach(p => {
        p.style.display = p.dataset.cat === cat ? 'block' : 'none';
      });
    });
  });
}

// ---------- Lightbox for Gallery ----------
function initLightbox() {
  const galleryItems = document.querySelectorAll('.gallery-item img');
  if (!galleryItems.length) return;
  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.innerHTML = '<img src="" alt="Enlarged fabric">';
  document.body.appendChild(lightbox);
  galleryItems.forEach(img => {
    img.addEventListener('click', () => {
      const bigSrc = img.dataset.full || img.src;
      lightbox.querySelector('img').src = bigSrc;
      lightbox.classList.add('active');
    });
  });
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target.tagName === 'IMG') lightbox.classList.remove('active');
  });
}

// ---------- Render Products (from overrides) ----------
function renderProducts(containerSelector, products) {
  const container = document.querySelector(containerSelector);
  if (!container) return;
  container.innerHTML = products.map(p => `
    <div class="product-card reveal">
      <div class="product-img" style="background-image:url('${p.img}')"></div>
      <div class="product-info">
        <h3 class="product-title">${p.name}</h3>
        <p class="product-desc">${p.desc}</p>
        <div class="product-meta">
          <span class="price-tag">Wholesale</span>
          <a href="https://wa.me/201003600949?text=I'm%20interested%20in%20${encodeURIComponent(p.name)}" class="btn">Inquire</a>
        </div>
      </div>
    </div>
  `).join('');
  // re-run reveal observer
  initScrollReveal();
}

// ---------- Page Init ----------
document.addEventListener('DOMContentLoaded', () => {
  applyCustomizations();
  initHeroSlider();
  initMobileMenu();
  initScrollReveal();
  initTabs();
  initLightbox();

  // Header scroll shadow
  window.addEventListener('scroll', () => {
    const header = document.querySelector('.site-header');
    if (header) header.classList.toggle('scrolled', window.scrollY > 20);
  });

  // Render product grids if containers exist
  if (document.getElementById('women-products')) {
    renderProducts('#women-products', window.customProducts.women);
  }
  if (document.getElementById('men-products')) {
    renderProducts('#men-products', window.customProducts.men);
  }
  if (document.getElementById('trending-products')) {
    renderProducts('#trending-products', window.customProducts.trending);
  }
});

// Expose globally
window.AlAzharTex = { DEFAULTS, Storage, getOverride, applyCustomizations, renderProducts };
