document.addEventListener('DOMContentLoaded', function () {

  const siteHeader  = document.getElementById('site-header');
  const navWrapper  = document.getElementById('nav-wrapper');
  const hamburger   = document.getElementById('hamburger');
  const drawer      = document.getElementById('mobile-drawer');
  const overlay     = document.getElementById('mobile-overlay');
  const drawerClose = document.getElementById('drawer-close');

  // ── Smooth Scroll ──────────────────────────────────────────
  function getNavHeight() {
    return navWrapper ? navWrapper.offsetHeight : 0;
  }

  function smoothScroll(targetId) {
    const el = document.querySelector(targetId);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.pageYOffset - getNavHeight() - 16;
    window.scrollTo({ top, behavior: 'smooth' });
  }

  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href.length > 1) {
        e.preventDefault();
        smoothScroll(href);
        closeMobileDrawer();
      }
    });
  });

  // ── Sub Nav Sticky ─────────────────────────────────────────
  window.addEventListener('scroll', function () {
    const headerBottom = siteHeader.getBoundingClientRect().bottom;
    navWrapper.classList.toggle('stuck', headerBottom <= 0);
  }, { passive: true });

  // ── Active Nav Highlight ───────────────────────────────────
  const sections = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.sub-nav a');

  window.addEventListener('scroll', function () {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - getNavHeight() - 40)
        current = sec.getAttribute('id');
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  }, { passive: true });

  // ── Mobile Drawer ──────────────────────────────────────────
  function openMobileDrawer() {
    drawer.classList.add('open');
    overlay.classList.add('open');
    hamburger.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileDrawer() {
    drawer.classList.remove('open');
    overlay.classList.remove('open');
    hamburger.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (hamburger) hamburger.addEventListener('click', () => {
    drawer.classList.contains('open') ? closeMobileDrawer() : openMobileDrawer();
  });
  if (overlay)     overlay.addEventListener('click', closeMobileDrawer);
  if (drawerClose) drawerClose.addEventListener('click', closeMobileDrawer);

  // ── Blog Search ────────────────────────────────────────────
  const searchInput = document.getElementById('searchInput');
  const blogCards   = document.querySelectorAll('#blogPosts .blog-card');
  const noResults   = document.getElementById('no-results');

  if (searchInput) {
    searchInput.addEventListener('input', function () {
      const term = this.value.toLowerCase().trim();
      let visible = 0;
      blogCards.forEach(card => {
        const match = card.getAttribute('data-title').toLowerCase().includes(term)
                   || card.textContent.toLowerCase().includes(term);
        card.style.display = match ? '' : 'none';
        if (match) visible++;
      });
      if (noResults) noResults.style.display = visible === 0 ? 'block' : 'none';
    });
  }

  // ── Contact Form ───────────────────────────────────────────
  const form    = document.getElementById('contactForm');
  const formMsg = document.getElementById('formMessage');

  if (form) {
    form.addEventListener('submit', function (e) {
      if (!window.location.hostname.includes('netlify')) {
        e.preventDefault();
        const btn = form.querySelector('button[type="submit"]');
        btn.textContent = 'Sending…';
        btn.disabled = true;
        setTimeout(() => {
          formMsg.textContent = '✅ Message sent! I\'ll get back to you shortly.';
          formMsg.style.color = '#10b981';
          form.reset();
          btn.textContent = 'Send Message';
          btn.disabled = false;
        }, 1200);
      }
    });
  }

  // ── Scroll Reveal ──────────────────────────────────────────
  const revealEls = document.querySelectorAll(
    '.service-card, .blog-card, .download-card, .alert-card, .about-text, .about-visual, .resources-text, .resources-downloads, .contact-info, .contact-form-wrap'
  );
  revealEls.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => observer.observe(el));

  document.querySelectorAll('.service-card').forEach((c, i) => c.style.transitionDelay = (i * 80) + 'ms');
  document.querySelectorAll('.blog-card').forEach((c, i)    => c.style.transitionDelay = (i * 60) + 'ms');
  // ── Dynamic Copyright Year ─────────────────────────────
  const yearEl = document.getElementById('copy-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
