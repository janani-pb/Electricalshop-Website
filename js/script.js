/* ============================================================
   BRIGHT ELECTRICALS — Main JavaScript
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ── Preloader ── */
  const preloader = document.getElementById('preloader');
  if (preloader) {
    window.addEventListener('load', function () {
      setTimeout(() => {
        preloader.classList.add('hidden');
      }, 700);
    });
    // Fallback in case load already fired
    if (document.readyState === 'complete') {
      setTimeout(() => preloader.classList.add('hidden'), 700);
    }
  }

  /* ── Sticky Navbar ── */
  const navbar = document.querySelector('.site-navbar');
  if (navbar) {
    const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── Active Nav Link ── */
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.site-navbar .nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  /* ── Scroll-to-Top ── */
  const scrollBtn = document.getElementById('scrollTop');
  if (scrollBtn) {
    window.addEventListener('scroll', () => {
      scrollBtn.classList.toggle('visible', window.scrollY > 320);
    }, { passive: true });
    scrollBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ── Scroll Reveal Animations ── */
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    const revealObs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('revealed'); revealObs.unobserve(e.target); } });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => revealObs.observe(el));
  }

  /* ── Counter Animation ── */
  const counters = document.querySelectorAll('.counter');
  if (counters.length) {
    const ctrObs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          animateCounter(e.target);
          ctrObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.6 });
    counters.forEach(el => ctrObs.observe(el));
  }

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 2000;
    const start = performance.now();
    const update = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(ease * target) + suffix;
      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = target + suffix;
    };
    requestAnimationFrame(update);
  }

  /* ── Gallery Filter ── */
  const galFilters = document.querySelectorAll('.gal-filter');
  const galItems   = document.querySelectorAll('.gallery-item-wrap');
  if (galFilters.length) {
    galFilters.forEach(btn => {
      btn.addEventListener('click', function () {
        galFilters.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        const cat = this.dataset.filter;
        galItems.forEach(item => {
          const show = cat === 'all' || item.dataset.category === cat;
          item.style.display = show ? 'block' : 'none';
          if (show) { item.style.animation = 'none'; item.offsetHeight; item.style.animation = ''; }
        });
      });
    });
  }

  /* ── Product Search ── */
  const searchInput = document.getElementById('productSearch');
  if (searchInput) {
    searchInput.addEventListener('input', function () {
      const q = this.value.toLowerCase().trim();
      document.querySelectorAll('.prod-card-wrap').forEach(wrap => {
        const name = (wrap.querySelector('.prod-name')?.textContent || '').toLowerCase();
        const desc = (wrap.querySelector('.prod-desc')?.textContent || '').toLowerCase();
        wrap.style.display = (!q || name.includes(q) || desc.includes(q)) ? '' : 'none';
      });
      updateResultCount();
    });
  }

  /* ── Category Filter (Products page) ── */
  document.querySelectorAll('.cat-list a').forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      document.querySelectorAll('.cat-list a').forEach(l => l.classList.remove('active'));
      this.classList.add('active');
      const cat = this.dataset.category;
      document.querySelectorAll('.prod-card-wrap').forEach(wrap => {
        wrap.style.display = (cat === 'all' || wrap.dataset.category === cat) ? '' : 'none';
      });
      updateResultCount();
    });
  });

  function updateResultCount() {
    const countEl = document.getElementById('resultCount');
    if (!countEl) return;
    const visible = document.querySelectorAll('.prod-card-wrap:not([style*="none"])').length;
    countEl.textContent = visible;
  }

  /* ── Sort Products ── */
  const sortSelect = document.getElementById('sortProducts');
  if (sortSelect) {
    sortSelect.addEventListener('change', function () {
      const grid = document.getElementById('productsGrid');
      if (!grid) return;
      const cards = [...grid.querySelectorAll('.prod-card-wrap')];
      cards.sort((a, b) => {
        const priceA = parseFloat(a.dataset.price || 0);
        const priceB = parseFloat(b.dataset.price || 0);
        const nameA  = a.dataset.name || '';
        const nameB  = b.dataset.name || '';
        if (this.value === 'price-asc')  return priceA - priceB;
        if (this.value === 'price-desc') return priceB - priceA;
        if (this.value === 'name-asc')   return nameA.localeCompare(nameB);
        if (this.value === 'name-desc')  return nameB.localeCompare(nameA);
        return 0;
      });
      cards.forEach(c => grid.appendChild(c));
    });
  }

  /* ── Quantity Selector ── */
  const qtyMinus = document.querySelector('.qty-minus');
  const qtyPlus  = document.querySelector('.qty-plus');
  const qtyNum   = document.querySelector('.qty-num');
  if (qtyMinus && qtyPlus && qtyNum) {
    qtyMinus.addEventListener('click', () => { const v = parseInt(qtyNum.value); if (v > 1) qtyNum.value = v - 1; });
    qtyPlus.addEventListener('click',  () => { const v = parseInt(qtyNum.value); if (v < 99) qtyNum.value = v + 1; });
    qtyNum.addEventListener('blur', () => { const v = parseInt(qtyNum.value); qtyNum.value = (isNaN(v) || v < 1) ? 1 : Math.min(v, 99); });
  }

  /* ── Thumbnail Switcher ── */
  const thumbs = document.querySelectorAll('.thumb-tile');
  const mainIcon = document.getElementById('mainProductIcon');
  if (thumbs.length && mainIcon) {
    thumbs.forEach(t => {
      t.addEventListener('click', function () {
        thumbs.forEach(x => x.classList.remove('active'));
        this.classList.add('active');
        const ic = this.dataset.icon;
        if (ic) { mainIcon.className = ''; mainIcon.className = ic; }
      });
    });
  }

  /* ── Enquiry Button Toast ── */
  const enquiryBtn = document.getElementById('enquiryBtn');
  if (enquiryBtn) {
    enquiryBtn.addEventListener('click', function () {
      showToast('Enquiry sent! We will contact you shortly.', 'success');
    });
  }

  /* ── Contact Form Validation ── */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (validateContactForm()) {
        const successAlert = document.getElementById('successAlert');
        if (successAlert) { successAlert.style.display = 'block'; }
        this.reset();
        showToast('Message sent successfully! We will get back to you soon.', 'success');
        setTimeout(() => { if (successAlert) successAlert.style.display = 'none'; }, 5000);
      }
    });

    // Live validation
    contactForm.querySelectorAll('input, textarea, select').forEach(input => {
      input.addEventListener('input', () => clearError(input));
    });
  }

  function validateContactForm() {
    let valid = true;

    const name = document.getElementById('cName');
    if (!name || name.value.trim().length < 2) { showError(name, 'cNameErr', 'Please enter a valid name (min 2 chars).'); valid = false; }
    else clearError(name, 'cNameErr');

    const email = document.getElementById('cEmail');
    const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRx.test(email.value.trim())) { showError(email, 'cEmailErr', 'Please enter a valid email address.'); valid = false; }
    else clearError(email, 'cEmailErr');

    const phone = document.getElementById('cPhone');
    const phoneRx = /^[0-9\s\-+()]{7,15}$/;
    if (phone && phone.value.trim() && !phoneRx.test(phone.value.trim())) { showError(phone, 'cPhoneErr', 'Please enter a valid phone number.'); valid = false; }
    else if (phone) clearError(phone, 'cPhoneErr');

    const msg = document.getElementById('cMessage');
    if (!msg || msg.value.trim().length < 10) { showError(msg, 'cMsgErr', 'Message must be at least 10 characters.'); valid = false; }
    else clearError(msg, 'cMsgErr');

    return valid;
  }

  function showError(input, errId, msg) {
    if (input) input.classList.add('is-error');
    const errEl = document.getElementById(errId);
    if (errEl) { errEl.textContent = msg; errEl.classList.add('show'); }
  }

  function clearError(input, errId) {
    if (input) input.classList.remove('is-error');
    const id = errId || (input && input.id ? input.id + 'Err' : null);
    if (id) { const el = document.getElementById(id); if (el) el.classList.remove('show'); }
  }

  /* ── Toast Notification ── */
  function showToast(message, type = 'success') {
    const existing = document.querySelector('.be-toast');
    if (existing) existing.remove();

    const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
    const bg   = type === 'success' ? '#10b981' : '#ef4444';

    const toast = document.createElement('div');
    toast.className = 'be-toast';
    toast.innerHTML = `<i class="fas ${icon}"></i> ${message}`;
    toast.style.cssText = `
      position:fixed; bottom:80px; right:28px; z-index:9990;
      background:${bg}; color:#fff; padding:14px 20px; border-radius:10px;
      display:flex; align-items:center; gap:10px; font-weight:600; font-size:.9rem;
      box-shadow:0 6px 24px rgba(0,0,0,.2); max-width:320px;
      animation:fadeSlideDown .35s ease;
    `;
    document.body.appendChild(toast);
    setTimeout(() => { toast.style.opacity = '0'; toast.style.transition = 'opacity .4s'; setTimeout(() => toast.remove(), 400); }, 3500);
  }

  /* ── Navbar collapse on link click (mobile) ── */
  document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
    link.addEventListener('click', () => {
      const toggler = document.querySelector('.navbar-toggler');
      const collapse = document.querySelector('.navbar-collapse');
      if (toggler && collapse && collapse.classList.contains('show')) {
        toggler.click();
      }
    });
  });

});
