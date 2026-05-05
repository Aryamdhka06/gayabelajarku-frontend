// ═══════════════════════════════
// NAVBAR BURGER (Mobile)
// ═══════════════════════════════
const navBurger  = document.getElementById('navBurger');
const mobileMenu = document.getElementById('mobileMenu');

navBurger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});

// Tutup mobile menu saat klik link
mobileMenu.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

// ═══════════════════════════════
// NAVBAR SCROLL EFFECT
// ═══════════════════════════════
const topnav = document.getElementById('topnav');
window.addEventListener('scroll', () => {
  topnav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// ═══════════════════════════════
// SCROLL REVEAL
// ═══════════════════════════════
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

// ═══════════════════════════════
// BACK TO TOP
// ═══════════════════════════════
const backTop = document.getElementById('backTop');
window.addEventListener('scroll', () => {
  backTop.classList.toggle('visible', window.scrollY > 400);
}, { passive: true });

backTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ═══════════════════════════════
// MINDMAP NODE HOVER ANIMATION
// ═══════════════════════════════
document.querySelectorAll('.mm-node').forEach(node => {
  node.addEventListener('mouseenter', () => {
    node.style.transition = 'all 0.3s ease';
  });
});

// ═══════════════════════════════
// SMOOTH SCROLL untuk hero-scroll
// ═══════════════════════════════
const heroScroll = document.querySelector('.hero-scroll');
if (heroScroll) {
  heroScroll.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector('#section-apa');
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
}