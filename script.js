/* ═══════════════════════════════════════════
   JARANA FOOD — Interactive Scripts
   ═══════════════════════════════════════════ */

/* ───────────────────────────────────────────
   WebP Auto-Swap: sirve WebP cuando el navegador lo soporta
   ─────────────────────────────────────────── */
function initWebPSwap() {
  // Comprobar soporte WebP
  const canvas = document.createElement('canvas');
  if (canvas.toDataURL && canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0) {
    // El navegador soporta WebP → reemplazar img jpg/png por su versión webp
    document.querySelectorAll('img[src]').forEach(img => {
      const src = img.getAttribute('src');
      if (src && !src.startsWith('http') && /\.(jpg|jpeg|png)$/i.test(src)) {
        // Cambiar carpeta jpg/ → webp/ y extensión → .webp
        const webpSrc = src.replace('/jpg/', '/webp/').replace(/\.(jpg|jpeg|png)$/i, '.webp');
        img.setAttribute('src', webpSrc);
      }
    });
  }
}

// Retardo mínimo para que la animación se vea bien, pero sin bloquear al usuario
function hidePreloader() {
  const preloader = document.getElementById('preloader');
  if (preloader && !preloader.classList.contains('fade-out')) {
    preloader.classList.add('fade-out');
    setTimeout(() => {
      preloader.remove();
    }, 600);
  }
}

// Usamos DOMContentLoaded para que sea mucho más rápido y no espere a imágenes que no existen
document.addEventListener('DOMContentLoaded', () => {
  // Servir WebP si el navegador lo soporta (antes de que carguen las imágenes)
  initWebPSwap();

  // Inicializaciones previas
  initHeroSlider();
  initScrollAnimations();
  initCategoryNav();
  initStickyNavShadow();
  initSmokeEffect();
  initProductModal();
  initHalloweenBurst();
  initPriceDecimals();

  // Ocultar preloader después de un tiempo suficiente para ver la animación (2.5s)
  setTimeout(hidePreloader, 2500);
});

/* ───────────────────────────────────────────
   Hero Slider
   ─────────────────────────────────────────── */
function initHeroSlider() {
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero-dot');
  if (slides.length === 0) return;

  let current = 0;
  let interval;

  function goTo(index) {
    slides[current].classList.remove('active');
    dots[current]?.classList.remove('active');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current]?.classList.add('active');
  }

  function next() {
    goTo(current + 1);
  }

  function startAuto() {
    interval = setInterval(next, 4500);
  }

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      clearInterval(interval);
      goTo(i);
      startAuto();
    });
  });

  startAuto();
}

/* ───────────────────────────────────────────
   Scroll Animations (Intersection Observer)
   ─────────────────────────────────────────── */
function initScrollAnimations() {
  const elements = document.querySelectorAll('.menu-card, .featured-card, .custom-card, .instagram-card, .animate-in');
  if (elements.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

/* ───────────────────────────────────────────
   Category Navigation
   ─────────────────────────────────────────── */
function initCategoryNav() {
  const navBtns = document.querySelectorAll('.category-btn');
  const sections = document.querySelectorAll('.menu-section[id]');
  if (navBtns.length === 0 || sections.length === 0) return;

  // Click to scroll
  navBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = btn.getAttribute('data-target');
      const target = document.getElementById(targetId);
      if (!target) return;

      const navHeight = document.querySelector('.category-nav')?.offsetHeight || 60;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 10;

      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  // Active state on scroll
  const navEl = document.querySelector('.category-nav');
  const navHeight = navEl?.offsetHeight || 60;

  function updateActive() {
    let currentSection = '';
    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= navHeight + 80) {
        currentSection = section.id;
      }
    });

    navBtns.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-target') === currentSection);
    });

    // Auto-scroll nav to active button
    const activeBtn = document.querySelector('.category-btn.active');
    if (activeBtn) {
      const navInner = document.querySelector('.category-nav-inner');
      if (navInner) {
        const btnRect = activeBtn.getBoundingClientRect();
        const navRect = navInner.getBoundingClientRect();
        const scrollLeft = activeBtn.offsetLeft - navRect.width / 2 + btnRect.width / 2;
        navInner.scrollTo({ left: scrollLeft, behavior: 'smooth' });
      }
    }
  }

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateActive();
        ticking = false;
      });
      ticking = true;
    }
  });

  updateActive();
}

/* ───────────────────────────────────────────
   Sticky Nav Shadow
   ─────────────────────────────────────────── */
function initStickyNavShadow() {
  const nav = document.querySelector('.category-nav');
  if (!nav) return;

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 100);
  });
}

/* ───────────────────────────────────────────
   Smoke Effect (Smash Burger Vibe)
   ─────────────────────────────────────────── */
function initSmokeEffect() {
  const container = document.getElementById('smoke-container');
  if (!container) return;

  const particleCount = 15; // Number of simultaneous smoke puffs
  
  for (let i = 0; i < particleCount; i++) {
    createSmokeParticle(container);
  }
}

function createSmokeParticle(container) {
  const particle = document.createElement('div');
  particle.className = 'smoke-puff';
  
  // Random properties for organic look
  const size = Math.random() * 150 + 50; // 50px to 200px
  const startX = Math.random() * 100; // 0% to 100% viewport width
  const duration = Math.random() * 10 + 10; // 10s to 20s
  const delay = Math.random() * 10; // 0s to 10s delay
  const opacity = Math.random() * 0.15 + 0.05; // 0.05 to 0.2 opacity
  
  particle.style.width = `${size}px`;
  particle.style.height = `${size}px`;
  particle.style.left = `${startX}vw`;
  particle.style.animationDuration = `${duration}s`;
  particle.style.animationDelay = `${delay}s`;
  particle.style.opacity = opacity;
  
  container.appendChild(particle);
  
  // Re-create particle when animation ends to keep it infinite but randomized
  particle.addEventListener('animationend', () => {
    particle.remove();
    createSmokeParticle(container);
  });
}

/* ───────────────────────────────────────────
   Product Modal
   ─────────────────────────────────────────── */
function initProductModal() {
  const modal = document.getElementById('product-modal');
  if (!modal) return;

  const overlay = modal.querySelector('.modal-overlay');
  const closeBtn = modal.querySelector('.modal-close');
  const imgEl = document.getElementById('modal-img');
  const imageContainer = modal.querySelector('.modal-image-container');
  const titleEl = document.getElementById('modal-title');
  const badgeEl = document.getElementById('modal-badge');
  const descEl = document.getElementById('modal-desc');
  const priceEl = document.getElementById('modal-price');
  const allergensEl = document.getElementById('modal-allergens');
  
  // New Info Panel Elements
  const btnInfoToggle = document.getElementById('btn-info-toggle');
  const modalInfoPanel = document.getElementById('modal-info-panel');
  const blockAllergens = document.getElementById('block-allergens');
  const blockTraces = document.getElementById('block-traces');
  const trazasEl = document.getElementById('modal-trazas');

  const cards = document.querySelectorAll('.menu-card, .featured-card');

  cards.forEach(card => {
    // Las tarjetas "próximamente" de Halloween no abren el modal (ver initHalloweenBurst)
    if (card.classList.contains('halloween-card')) return;

    card.addEventListener('click', () => {
      // Extract data
      const name = card.querySelector('.menu-card-name')?.textContent || '';
      const desc = card.querySelector('.menu-card-desc')?.textContent || '';
      const price = card.querySelector('.menu-card-price')?.textContent || '';
      const imgSrc = card.querySelector('img')?.src || '';
      const allergens = card.getAttribute('data-allergens') || '';
      const trazas = card.getAttribute('data-trazas') || '';
      
      // Check for primary badge (e.g., NUEVO, POPULAR)
      const primaryBadge = card.querySelector('.badge:not(.badge-limited)');
      if (primaryBadge && !card.classList.contains('salsa-item')) {
        // Clone the badge to keep classes
        badgeEl.className = primaryBadge.className;
        badgeEl.textContent = primaryBadge.textContent;
        badgeEl.style.display = 'inline-block';
        badgeEl.classList.add('modal-badge-small');
      } else {
        badgeEl.style.display = 'none';
      }

      // Check for limited-time badge
      const limitedBadge = card.querySelector('.badge-limited');
      const modalClock = document.getElementById('modal-clock');
      if (modalClock) {
        if (limitedBadge) {
          modalClock.style.display = 'inline-block';
        } else {
          modalClock.style.display = 'none';
        }
      }

      // Populate modal
      titleEl.textContent = name;
      descEl.textContent = desc;
      formatPriceElement(priceEl, price);

      if (imgSrc) {
        imgEl.src = imgSrc;
        imgEl.style.display = 'block';
        imageContainer.classList.remove('placeholder-image');
        const pText = imageContainer.querySelector('.placeholder-text');
        if (pText) pText.style.display = 'none';
      } else {
        imgEl.style.display = 'none';
        imageContainer.classList.add('placeholder-image');
        let pText = imageContainer.querySelector('.placeholder-text');
        if (!pText) {
          pText = document.createElement('span');
          pText.className = 'placeholder-text';
          pText.textContent = 'PRÓXIMAMENTE';
          imageContainer.appendChild(pText);
        }
        pText.style.display = 'block';
      }

      // Reset Info Panel state on open
      if (btnInfoToggle) {
        btnInfoToggle.classList.remove('active');
        btnInfoToggle.style.display = 'none';
      }
      const modalInfoOverlay = document.getElementById('modal-info-overlay');
      if (modalInfoOverlay) {
        modalInfoOverlay.classList.remove('open');
      }
      if (blockAllergens) blockAllergens.style.display = 'none';
      if (blockTraces) blockTraces.style.display = 'none';

      if (allergens || trazas) {
        // Full map of all 14 standard EU allergen icons
        const iconMap = {
          'Gluten': 'gluten.png',
          'Crustáceos': 'crustaceos.png',
          'Huevo': 'huevo.png',
          'Pescado': 'pescado.png',
          'Cacahuetes': 'cacahuetes.png',
          'Soja': 'soja.png',
          'Lácteos': 'lacteos.png',
          'Frutos de cáscara': 'frutos_de_cascara.png',
          'Apio': 'apio.png',
          'Mostaza': 'mostaza.png',
          'Sésamo': 'sesamo.png',
          'Sulfitos': 'sulfitos.png',
          'Altramuces': 'altramuces.png',
          'Moluscos': 'moluscos.png',
          'NODISP': 'NODISP.png'
        };

        const generateIconsHtml = (dataStr, isTrace = false) => {
          if (!dataStr) return '';
          const extraClass = isTrace ? ' allergen-image-trace' : '';
          return dataStr.split(',').map(a => {
            const name = a.trim();
            const fileName = iconMap[name];
            
            if (fileName) {
              return `<div class="allergen-icon-wrapper" title="${name}">
                        <img src="img/allergens/${fileName}" alt="${name}" class="allergen-image${extraClass}">
                      </div>`;
            } else {
              return `<div class="allergen-icon-wrapper" title="${name}">
                        <span class="allergen-text-badge">${name}</span>
                      </div>`;
            }
          }).join('');
        };

        if (allergens) {
          allergensEl.innerHTML = generateIconsHtml(allergens, false);
          if (blockAllergens) blockAllergens.style.display = 'flex';
        }
        
        if (trazas) {
          trazasEl.innerHTML = generateIconsHtml(trazas, true);
          if (blockTraces) blockTraces.style.display = 'flex';
        }

        if (btnInfoToggle) btnInfoToggle.style.display = 'flex';
      }

      // Show modal
      modal.classList.add('active');
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    });
  });

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', closeModal);

  // Info Overlay Toggle Logic
  const globalBtnInfoToggle = document.getElementById('btn-info-toggle');
  const globalModalInfoOverlay = document.getElementById('modal-info-overlay');
  const globalBtnInfoClose = document.getElementById('btn-info-close');

  if (globalBtnInfoToggle && globalModalInfoOverlay) {
    globalBtnInfoToggle.addEventListener('click', () => {
      globalModalInfoOverlay.classList.add('open');
    });
  }

  if (globalBtnInfoClose && globalModalInfoOverlay) {
    globalBtnInfoClose.addEventListener('click', () => {
      globalModalInfoOverlay.classList.remove('open');
    });
  }

  const globalBtnInfoReturn = document.getElementById('btn-info-return');
  if (globalBtnInfoReturn && globalModalInfoOverlay) {
    globalBtnInfoReturn.addEventListener('click', () => {
      globalModalInfoOverlay.classList.remove('open');
    });
  }
}

/* ───────────────────────────────────────────
   Halloween Burst
   Al pulsar la tarjeta "próximamente" explotan calabazas,
   zombies, telarañas, arañas y fantasmas (sin abrir el modal)
   ─────────────────────────────────────────── */
function initHalloweenBurst() {
  const cards = document.querySelectorAll('.halloween-card');
  if (cards.length === 0) return;

  const emojis = ['🎃', '🧟', '🕸️', '🕷️', '👻'];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  cards.forEach(card => {
    card.addEventListener('click', (e) => {
      const rect = card.getBoundingClientRect();
      // Origen: punto de clic (o centro de la tarjeta si no hay coordenadas)
      const x = e.clientX || rect.left + rect.width / 2;
      const y = e.clientY || rect.top + rect.height / 2;

      const count = reduceMotion ? 6 : 14;
      for (let i = 0; i < count; i++) {
        spawnSpookyParticle(x, y, emojis[i % emojis.length], reduceMotion);
      }

      // Pequeño temblor de la tarjeta (reinicia la animación en cada clic)
      if (!reduceMotion) {
        card.classList.remove('halloween-shake');
        void card.offsetWidth;
        card.classList.add('halloween-shake');
      }
    });
  });
}

function spawnSpookyParticle(x, y, emoji, reduceMotion) {
  const el = document.createElement('span');
  el.className = 'spooky-particle';
  el.textContent = emoji;
  el.setAttribute('aria-hidden', 'true');
  el.style.left = `${x}px`;
  el.style.top = `${y}px`;
  el.style.fontSize = `${22 + Math.random() * 26}px`;
  document.body.appendChild(el);

  const angle = Math.random() * Math.PI * 2;
  const distance = (reduceMotion ? 40 : 120) + Math.random() * (reduceMotion ? 60 : 220);
  const dx = Math.cos(angle) * distance;
  const dy = Math.sin(angle) * distance - 60; // sesgo hacia arriba
  const rot = (Math.random() - 0.5) * 540;
  const duration = reduceMotion ? 1500 : 3000 + Math.random() * 1000;
  const fall = 90 + Math.random() * 60; // caída suave tras la explosión

  const anim = el.animate([
    // Explosión rápida hacia fuera
    { transform: 'translate(-50%, -50%) scale(0.2) rotate(0deg)', opacity: 1, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' },
    {
      transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(1.15) rotate(${rot * 0.5}deg)`,
      opacity: 1,
      offset: 0.2,
      easing: 'ease-in-out'
    },
    // Caída lenta, flotando
    {
      transform: `translate(calc(-50% + ${dx * 1.1}px), calc(-50% + ${dy + fall * 0.6}px)) scale(1) rotate(${rot * 0.8}deg)`,
      opacity: 1,
      offset: 0.7,
      easing: 'ease-in'
    },
    // Se desvanece al final
    {
      transform: `translate(calc(-50% + ${dx * 1.15}px), calc(-50% + ${dy + fall}px)) scale(0.85) rotate(${rot}deg)`,
      opacity: 0
    }
  ], {
    duration,
    fill: 'forwards'
  });

  anim.onfinish = () => el.remove();
}

/* ───────────────────────────────────────────
   Dynamic Image Fallback
   ─────────────────────────────────────────── */
window.handleImageError = function(img) {
  // Evitar bucles infinitos
  img.onerror = null; 
  img.style.display = 'none'; // Simplemente la ocultamos, no la eliminamos del HTML
  
  const container = img.parentElement;
  container.classList.add('placeholder-image');
  
  // Si no tiene ya el texto de próximamente, se lo ponemos
  if (!container.querySelector('.placeholder-text')) {
    const span = document.createElement('span');
    span.className = 'placeholder-text';
    span.textContent = 'PRÓXIMAMENTE';
    container.appendChild(span);
  }
};

/* ───────────────────────────────────────────
   Price Decimals Formatting
   Hace que los decimales (,XX€) se vean más pequeños
   ─────────────────────────────────────────── */
function formatPriceElement(el, priceText) {
  // Regex: captura la parte entera y la decimal+símbolo
  // Ej: "14,90€" → groups: "14" y ",90€"
  // Ej: "15€"   → no match, se deja tal cual
  const match = priceText.match(/^(\d+)(,\d+)(€)$/);
  if (match) {
    el.innerHTML = match[1] + '<span class="price-decimals">' + match[2] + match[3] + '</span>';
  } else {
    el.textContent = priceText;
  }
}

function initPriceDecimals() {
  document.querySelectorAll('.menu-card-price, .simple-item-price').forEach(el => {
    const text = el.textContent.trim();
    formatPriceElement(el, text);
  });
}
