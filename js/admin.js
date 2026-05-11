/* ═════════════════════════════════════════════════════════════
  admin.js – The Loom Master's Sanctuary
  Controls password, logo, slider, texts, backgrounds, products.
  All changes saved in localStorage (prefix alazhartex_).
═════════════════════════════════════════════════════════════ */

const PREFIX = 'alazhartex_';
const ADMIN_SESSION_KEY = PREFIX + 'admin_session';
const DEFAULT_PASSWORD = 'admin';

// Check if user is already logged in (session expires 1h)
function isLoggedIn() {
  const sess = JSON.parse(localStorage.getItem(ADMIN_SESSION_KEY) || '{}');
  return sess.loggedIn && (Date.now() - sess.timestamp < 3600000);
}

function login(password) {
  if (password === (localStorage.getItem(PREFIX+'admin_pass') || DEFAULT_PASSWORD)) {
    localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify({ loggedIn: true, timestamp: Date.now() }));
    return true;
  }
  return false;
}

function logout() {
  localStorage.removeItem(ADMIN_SESSION_KEY);
  location.reload();
}

function showLogin() {
  document.getElementById('login-panel').style.display = 'flex';
  document.getElementById('dashboard').style.display = 'none';
}

function showDashboard() {
  document.getElementById('login-panel').style.display = 'none';
  document.getElementById('dashboard').style.display = 'block';
  initPanels();
}

// Tab switching in dashboard
function initPanels() {
  const tabs = document.querySelectorAll('.admin-tab');
  const panels = document.querySelectorAll('.admin-panel');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      panels.forEach(p => p.style.display = 'none');
      document.getElementById(tab.dataset.target).style.display = 'block';
      // Load specific panel content
      const loader = window['load'+ tab.dataset.target.charAt(0).toUpperCase()+tab.dataset.target.slice(1)];
      if (loader) loader();
    });
  });
  // Trigger first tab
  if (tabs.length) tabs[0].click();
}

// Password panel
function loadPasswordPanel() {
  document.querySelector('#password-panel').innerHTML = `
    <h3>Change Password</h3>
    <input type="password" id="old-pass" placeholder="Old password">
    <input type="password" id="new-pass" placeholder="New password">
    <input type="password" id="confirm-pass" placeholder="Confirm new password">
    <button id="save-pass" class="btn">Save Password</button>
    <p id="pass-msg"></p>
  `;
  document.getElementById('save-pass').onclick = () => {
    const old = document.getElementById('old-pass').value;
    const newP = document.getElementById('new-pass').value;
    const conf = document.getElementById('confirm-pass').value;
    const current = localStorage.getItem(PREFIX+'admin_pass') || DEFAULT_PASSWORD;
    if (old !== current) return showMsg('Old password incorrect', 'red');
    if (newP !== conf) return showMsg('Passwords do not match', 'red');
    localStorage.setItem(PREFIX+'admin_pass', newP);
    showMsg('Password updated!', 'green');
  };
}

// Logo panel
function loadLogoPanel() {
  document.querySelector('#logo-panel').innerHTML = `
    <h3>Customize Logo</h3>
    <label>Upload Image: <input type="file" id="logo-file" accept="image/*"></label>
    <br>Or URL: <input type="text" id="logo-url" placeholder="https://...">
    <button id="save-logo" class="btn">Save Logo</button>
    <img id="logo-preview" style="max-height:100px; margin-top:1rem;">
  `;
  document.getElementById('save-logo').onclick = () => {
    const file = document.getElementById('logo-file').files[0];
    const url = document.getElementById('logo-url').value;
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        localStorage.setItem(PREFIX+'logo', reader.result);
        updatePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else if (url) {
      localStorage.setItem(PREFIX+'logo', url);
      updatePreview(url);
    }
  };
  function updatePreview(src) {
    document.getElementById('logo-preview').src = src;
  }
  // show existing
  const existing = localStorage.getItem(PREFIX+'logo');
  if (existing) updatePreview(existing);
}

// Slider panel
function loadSliderPanel() {
  const currentSlides = JSON.parse(localStorage.getItem(PREFIX+'slides') || '[]');
  const defaultSlides = window.AlAzharTex?.DEFAULTS?.slides || [];
  const slides = currentSlides.length ? currentSlides : defaultSlides;
  let html = '<h3>Hero Slides</h3><div id="slide-list">';
  slides.forEach((s,i) => {
    html += `<div class="slide-item">
      <input type="text" value="${s.heading}" data-idx="${i}" class="slide-heading" placeholder="Heading">
      <input type="text" value="${s.sub}" data-idx="${i}" class="slide-sub" placeholder="Subheading">
      <input type="text" value="${s.btn}" data-idx="${i}" class="slide-btn" placeholder="Button text">
      <input type="text" value="${s.img}" data-idx="${i}" class="slide-img" placeholder="Image URL">
      <button class="btn remove-slide" data-idx="${i}">Remove</button>
    </div>`;
  });
  html += '</div><button id="add-slide" class="btn">Add Slide</button><button id="save-slides" class="btn">Save Slides</button>';
  document.querySelector('#slider-panel').innerHTML = html;
  document.getElementById('add-slide').onclick = () => {
    const idx = document.querySelectorAll('.slide-item').length;
    const div = document.createElement('div');
    div.className = 'slide-item';
    div.innerHTML = `<input type="text" data-idx="${idx}" class="slide-heading" placeholder="Heading">
      <input type="text" data-idx="${idx}" class="slide-sub" placeholder="Subheading">
      <input type="text" data-idx="${idx}" class="slide-btn" placeholder="Button text">
      <input type="text" data-idx="${idx}" class="slide-img" placeholder="Image URL">
      <button class="btn remove-slide">Remove</button>`;
    document.getElementById('slide-list').appendChild(div);
  };
  document.getElementById('save-slides').onclick = () => {
    const items = document.querySelectorAll('.slide-item');
    const newSlides = [];
    items.forEach(item => {
      const inputs = item.querySelectorAll('input');
      newSlides.push({
        img: inputs[3].value, heading: inputs[0].value, sub: inputs[1].value, btn: inputs[2].value
      });
    });
    localStorage.setItem(PREFIX+'slides', JSON.stringify(newSlides));
    alert('Slides saved!');
  };
  // delegate remove
  document.getElementById('slide-list').addEventListener('click', e => {
    if (e.target.classList.contains('remove-slide')) e.target.parentElement.remove();
  });
}

// Texts panel
function loadTextsPanel() {
  const texts = {
    heroTitle: 'Hero Title',
    heroSub: 'Hero Subtitle',
    aboutStory: 'About Story',
    contactAddress: 'Contact Address',
    phone: 'Phone',
    workHours: 'Work Hours',
    footerText: 'Footer Text'
  };
  let html = '<h3>Site Texts</h3>';
  for (let [key, label] of Object.entries(texts)) {
    const val = localStorage.getItem(PREFIX+'texts_'+key) || window.AlAzharTex?.DEFAULTS?.texts[key] || '';
    html += `<label>${label}: <input type="text" id="text-${key}" value="${val.replace(/"/g,'&quot;')}"></label><br>`;
  }
  html += '<button id="save-texts" class="btn">Save Texts</button>';
  document.querySelector('#texts-panel').innerHTML = html;
  document.getElementById('save-texts').onclick = () => {
    for (let key of Object.keys(texts)) {
      const input = document.getElementById('text-'+key);
      if (input) localStorage.setItem(PREFIX+'texts_'+key, input.value);
    }
    alert('Texts saved!');
  };
}

// Backgrounds panel
function loadBackgroundsPanel() {
  const bgs = {
    'hero-bg': 'Hero',
    'women-header': 'Women Header',
    'men-header': 'Men Header'
  };
  let html = '<h3>Background Images</h3>';
  for (let [key, label] of Object.entries(bgs)) {
    const val = localStorage.getItem(PREFIX+'bg_'+key) || window.AlAzharTex?.DEFAULTS?.backgrounds[key] || '';
    html += `<label>${label}: <input type="text" id="bg-${key}" value="${val}"></label><br>`;
  }
  html += '<button id="save-bgs" class="btn">Save Backgrounds</button>';
  document.querySelector('#backgrounds-panel').innerHTML = html;
  document.getElementById('save-bgs').onclick = () => {
    for (let key of Object.keys(bgs)) {
      const input = document.getElementById('bg-'+key);
      if (input) localStorage.setItem(PREFIX+'bg_'+key, input.value);
    }
    alert('Backgrounds saved!');
  };
}

// Products panel
function loadProductsPanel() {
  // Categories tabs inside panel
  document.querySelector('#products-panel').innerHTML = `
    <h3>Edit Products</h3>
    <div class="admin-inner-tabs">
      <button class="btn prod-tab active" data-cat="women">Women</button>
      <button class="btn prod-tab" data-cat="men">Men</button>
      <button class="btn prod-tab" data-cat="trending">Trending</button>
    </div>
    <div id="prod-editor"></div>
    <button id="save-products" class="btn">Save Products</button>
  `;
  const prodTabBtns = document.querySelectorAll('.prod-tab');
  prodTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      prodTabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      showCategory(btn.dataset.cat);
    });
  });
  showCategory('women');

  function showCategory(cat) {
    const products = JSON.parse(localStorage.getItem(PREFIX+'products_'+cat) || '[]');
    const defaults = window.AlAzharTex?.DEFAULTS?.products[cat] || [];
    const list = products.length ? products : defaults;
    let html = '';
    list.forEach((p,i) => {
      html += `<div class="prod-edit-item">
        <input type="text" value="${p.name}" data-idx="${i}" class="prod-name" placeholder="Name">
        <input type="text" value="${p.desc}" data-idx="${i}" class="prod-desc" placeholder="Description">
        <input type="text" value="${p.img}" data-idx="${i}" class="prod-img" placeholder="Image URL">
        <button class="btn remove-prod" data-idx="${i}">Remove</button>
      </div>`;
    });
    html += `<button id="add-prod" class="btn">Add Product</button>`;
    document.getElementById('prod-editor').innerHTML = html;
    document.getElementById('add-prod').onclick = () => {
      const idx = document.querySelectorAll('.prod-edit-item').length;
      const div = document.createElement('div');
      div.className = 'prod-edit-item';
      div.innerHTML = `<input type="text" data-idx="${idx}" class="prod-name" placeholder="Name">
        <input type="text" data-idx="${idx}" class="prod-desc" placeholder="Description">
        <input type="text" data-idx="${idx}" class="prod-img" placeholder="Image URL">
        <button class="btn remove-prod">Remove</button>`;
      document.getElementById('prod-editor').appendChild(div);
    };
  }

  document.getElementById('save-products').onclick = () => {
    const activeCat = document.querySelector('.prod-tab.active').dataset.cat;
    const items = document.querySelectorAll('.prod-edit-item');
    const newProds = [];
    items.forEach(item => {
      const inputs = item.querySelectorAll('input');
      newProds.push({ name: inputs[0].value, desc: inputs[1].value, img: inputs[2].value });
    });
    localStorage.setItem(PREFIX+'products_'+activeCat, JSON.stringify(newProds));
    alert('Products saved for '+activeCat);
  };
  // delegation for remove
  document.getElementById('prod-editor').addEventListener('click', e => {
    if (e.target.classList.contains('remove-prod')) e.target.parentElement.remove();
  });
}

// Reset to factory defaults
function resetAll() {
  if (confirm('Are you sure you want to reset all customizations to factory defaults? This cannot be undone.')) {
    Object.keys(localStorage).forEach(k => { if (k.startsWith(PREFIX)) localStorage.removeItem(k); });
    localStorage.setItem(PREFIX+'admin_pass', DEFAULT_PASSWORD); // keep password
    alert('Reset complete. Reloading...');
    location.reload();
  }
}

// Helper
function showMsg(msg, color) {
  const el = document.getElementById('pass-msg');
  if (el) { el.textContent = msg; el.style.color = color; }
}

// On page load
document.addEventListener('DOMContentLoaded', () => {
  if (isLoggedIn()) {
    showDashboard();
  } else {
    showLogin();
  }
  // Login form
  document.getElementById('login-form').addEventListener('submit', e => {
    e.preventDefault();
    const pwd = document.getElementById('admin-password').value;
    if (login(pwd)) {
      showDashboard();
    } else {
      document.getElementById('login-error').textContent = 'Invalid password';
    }
  });
  // Logout button
  document.getElementById('logout-btn').addEventListener('click', logout);
  // Reset button in dashboard
  document.getElementById('reset-btn').addEventListener('click', resetAll);
});
