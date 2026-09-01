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
  const allergensContainer = modal.querySelector('.modal-allergens-container');

  const cards = document.querySelectorAll('.menu-card, .featured-card');

  cards.forEach(card => {
    card.addEventListener('click', () => {
      // Extract data
      const name = card.querySelector('.menu-card-name')?.textContent || '';
      const desc = card.querySelector('.menu-card-desc')?.textContent || '';
      const price = card.querySelector('.menu-card-price')?.textContent || '';
      const imgSrc = card.querySelector('img')?.src || '';
      const allergens = card.getAttribute('data-allergens') || '';
      
      // Check for badge
      const badge = card.querySelector('.badge');
      if (badge && !card.classList.contains('salsa-item')) {
        // Clone the badge to keep classes
        badgeEl.className = badge.className;
        badgeEl.textContent = badge.textContent;
        badgeEl.style.display = 'inline-block';
        badgeEl.classList.add('modal-badge-small');
      } else {
        badgeEl.style.display = 'none';
      }

      // Populate modal
      titleEl.textContent = name;
      descEl.textContent = desc;
      priceEl.textContent = price;

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

      if (allergens) {
        allergensEl.textContent = allergens;
        allergensContainer.style.display = 'block';
      } else {
        allergensContainer.style.display = 'none';
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
