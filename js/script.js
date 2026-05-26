/* ============================================================
   BRIGHT ELECTRICALS — Main JavaScript
   Crompton + Anchor/Panasonic inspired design
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ── Preloader ── */
  const pl = document.getElementById('preloader');
  if (pl) {
    const hide = () => { pl.classList.add('hidden'); };
    if (document.readyState === 'complete') { setTimeout(hide, 600); }
    else { window.addEventListener('load', () => setTimeout(hide, 600)); }
  }

  /* ── Navbar scroll ── */
  const navbar = document.querySelector('.site-navbar');
  if (navbar) {
    window.addEventListener('scroll', () => navbar.classList.toggle('scrolled', window.scrollY > 40), { passive: true });
  }

  /* ── Mobile menu toggle ── */
  const toggler = document.getElementById('nbToggler');
  const mobileMenu = document.getElementById('nbMobile');
  if (toggler && mobileMenu) {
    toggler.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
      toggler.classList.toggle('active');
    });
    // close on link click
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        toggler.classList.remove('active');
      });
    });
  }

  /* ── Active nav link ── */
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nb-link, .nb-mobile a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html')) link.classList.add('active');
    else link.classList.remove('active');
  });

  /* ── Scroll to top ── */
  const scrollBtn = document.getElementById('scrollTop');
  if (scrollBtn) {
    window.addEventListener('scroll', () => scrollBtn.classList.toggle('visible', window.scrollY > 320), { passive: true });
    scrollBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ── Scroll reveal ── */
  const revEls = document.querySelectorAll('.reveal');
  if (revEls.length) {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('revealed'); obs.unobserve(e.target); } });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    revEls.forEach(el => obs.observe(el));
  }

  /* ── Counter animation ── */
  const counters = document.querySelectorAll('.counter');
  if (counters.length) {
    const cobs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { animateCounter(e.target); cobs.unobserve(e.target); } });
    }, { threshold: 0.5 });
    counters.forEach(el => cobs.observe(el));
  }
  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || '';
    const dur = 1800; const start = performance.now();
    const run = now => {
      const p = Math.min((now - start) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.floor(ease * target) + suffix;
      if (p < 1) requestAnimationFrame(run);
      else el.textContent = target + suffix;
    };
    requestAnimationFrame(run);
  }

  /* ── Product tabs (home/products) ── */
  document.querySelectorAll('.ptab').forEach(tab => {
    tab.addEventListener('click', function () {
      const group = this.closest('.ptabs-group');
      if (!group) return;
      group.querySelectorAll('.ptab').forEach(t => t.classList.remove('active'));
      this.classList.add('active');
      const cat = this.dataset.tab;
      const grid = group.nextElementSibling || document.getElementById('productsGrid');
      if (!grid) return;
      grid.querySelectorAll('.prod-card-wrap').forEach(card => {
        card.style.display = (cat === 'all' || card.dataset.category === cat) ? '' : 'none';
      });
      updateResultCount();
    });
  });

  /* ── Category filter ── */
  document.querySelectorAll('.cat-list a').forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      document.querySelectorAll('.cat-list a').forEach(l => l.classList.remove('active'));
      this.classList.add('active');
      const cat = this.dataset.category;
      document.querySelectorAll('.prod-card-wrap').forEach(card => {
        card.style.display = (cat === 'all' || card.dataset.category === cat) ? '' : 'none';
      });
      updateResultCount();
    });
  });

  /* ── Gallery filter ── */
  document.querySelectorAll('.gal-filter').forEach(btn => {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.gal-filter').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      const f = this.dataset.filter;
      document.querySelectorAll('.gallery-item-wrap').forEach(item => {
        item.style.display = (f === 'all' || item.dataset.category === f) ? '' : 'none';
      });
    });
  });

  /* ── Product search ── */
  const searchInput = document.getElementById('productSearch');
  if (searchInput) {
    searchInput.addEventListener('input', function () {
      const q = this.value.toLowerCase().trim();
      document.querySelectorAll('.prod-card-wrap').forEach(card => {
        const name = (card.querySelector('.pc-name')?.textContent || '').toLowerCase();
        const desc = (card.querySelector('.pc-desc')?.textContent || '').toLowerCase();
        card.style.display = (!q || name.includes(q) || desc.includes(q)) ? '' : 'none';
      });
      updateResultCount();
    });
  }

  /* ── Sort products ── */
  const sortSel = document.getElementById('sortProducts');
  if (sortSel) {
    sortSel.addEventListener('change', function () {
      const grid = document.getElementById('productsGrid');
      if (!grid) return;
      const cards = [...grid.querySelectorAll('.prod-card-wrap')];
      cards.sort((a, b) => {
        const pa = parseFloat(a.dataset.price || 0), pb = parseFloat(b.dataset.price || 0);
        const na = a.dataset.name || '', nb = b.dataset.name || '';
        if (this.value === 'price-asc') return pa - pb;
        if (this.value === 'price-desc') return pb - pa;
        if (this.value === 'name-asc') return na.localeCompare(nb);
        if (this.value === 'name-desc') return nb.localeCompare(na);
        return 0;
      });
      cards.forEach(c => grid.appendChild(c));
    });
  }

  function updateResultCount() {
    const el = document.getElementById('resultCount');
    if (el) el.textContent = document.querySelectorAll('.prod-card-wrap:not([style*="none"])').length;
  }

  /* ── Quantity selector ── */
  const qMinus = document.querySelector('.qty-minus');
  const qPlus  = document.querySelector('.qty-plus');
  const qNum   = document.querySelector('.qty-num');
  if (qMinus && qPlus && qNum) {
    qMinus.addEventListener('click', () => { const v = parseInt(qNum.value); if (v > 1) qNum.value = v - 1; });
    qPlus.addEventListener('click',  () => { const v = parseInt(qNum.value); if (v < 99) qNum.value = v + 1; });
    qNum.addEventListener('blur', () => { const v = parseInt(qNum.value); qNum.value = (isNaN(v)||v<1)?1:Math.min(v,99); });
  }

  /* ── Thumbnail switcher ── */
  const thumbs = document.querySelectorAll('.thumb-tile');
  const mainIcon = document.getElementById('mainProductIcon');
  if (thumbs.length && mainIcon) {
    thumbs.forEach(t => {
      t.addEventListener('click', function () {
        thumbs.forEach(x => x.classList.remove('active'));
        this.classList.add('active');
        const ic = this.dataset.icon;
        if (ic) { mainIcon.className = ic; }
      });
    });
  }

  /* ── Enquiry button ── */
  const enqBtn = document.getElementById('enquiryBtn');
  if (enqBtn) { enqBtn.addEventListener('click', () => showToast('Enquiry sent! We will contact you shortly.', 'success')); }

  /* ── Contact form ── */
  const cf = document.getElementById('contactForm');
  if (cf) {
    cf.addEventListener('submit', function (e) {
      e.preventDefault();
      if (validateForm()) {
        const sa = document.getElementById('successAlert');
        if (sa) sa.style.display = 'flex';
        this.reset();
        showToast('Message sent! We will get back to you within 24 hours.', 'success');
        setTimeout(() => { if (sa) sa.style.display = 'none'; }, 5000);
      }
    });
    cf.querySelectorAll('input, textarea, select').forEach(inp => {
      inp.addEventListener('input', () => clearErr(inp));
    });
  }

  function validateForm() {
    let ok = true;
    const name = document.getElementById('cName');
    if (!name || name.value.trim().length < 2) { showErr(name, 'cNameErr', 'Please enter your name (min 2 chars).'); ok = false; }
    else clearErr(name, 'cNameErr');
    const email = document.getElementById('cEmail');
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) { showErr(email, 'cEmailErr', 'Please enter a valid email.'); ok = false; }
    else clearErr(email, 'cEmailErr');
    const phone = document.getElementById('cPhone');
    if (phone && phone.value.trim() && !/^[0-9\s\-+()]{7,15}$/.test(phone.value.trim())) { showErr(phone, 'cPhoneErr', 'Enter a valid phone number.'); ok = false; }
    else if (phone) clearErr(phone, 'cPhoneErr');
    const msg = document.getElementById('cMessage');
    if (!msg || msg.value.trim().length < 10) { showErr(msg, 'cMsgErr', 'Message must be at least 10 characters.'); ok = false; }
    else clearErr(msg, 'cMsgErr');
    return ok;
  }
  function showErr(inp, id, msg) {
    if (inp) inp.classList.add('is-error');
    const el = document.getElementById(id); if (el) { el.textContent = msg; el.classList.add('show'); }
  }
  function clearErr(inp, id) {
    if (inp) inp.classList.remove('is-error');
    const eid = id || (inp && inp.id ? inp.id + 'Err' : null);
    if (eid) { const el = document.getElementById(eid); if (el) el.classList.remove('show'); }
  }

  /* ── FAQ ── */
  document.querySelectorAll('.faq-q').forEach(q => {
    q.addEventListener('click', function () {
      const isOpen = this.classList.contains('open');
      document.querySelectorAll('.faq-q').forEach(x => { x.classList.remove('open'); x.nextElementSibling.classList.remove('open'); });
      if (!isOpen) { this.classList.add('open'); this.nextElementSibling.classList.add('open'); }
    });
  });

  /* ── Newsletter form ── */
  const nlForm = document.getElementById('newsletterForm');
  if (nlForm) {
    nlForm.addEventListener('submit', function (e) {
      e.preventDefault();
      showToast('Thank you for subscribing!', 'success');
      this.reset();
    });
  }

  /* ── Toast ── */
  function showToast(msg, type = 'success') {
    document.querySelector('.be-toast')?.remove();
    const bg = type === 'success' ? '#10B981' : '#EF4444';
    const ic = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
    const t = document.createElement('div');
    t.className = 'be-toast';
    t.innerHTML = `<i class="fas ${ic}"></i> ${msg}`;
    t.style.cssText = `background:${bg};color:#fff;`;
    document.body.appendChild(t);
    setTimeout(() => { t.style.opacity = '0'; t.style.transition = 'opacity .4s'; setTimeout(() => t.remove(), 400); }, 3500);
  }

});
