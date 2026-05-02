// ═══════════════════════════════
// SIDEBAR COLLAPSE (Desktop)
// ═══════════════════════════════
const sidebar       = document.getElementById('sidebar');
const mainContent   = document.getElementById('mainContent');
const sidebarToggle = document.getElementById('sidebarToggle');

sidebarToggle.addEventListener('click', () => {
  sidebar.classList.toggle('collapsed');
  mainContent.classList.toggle('expanded');
});

// ═══════════════════════════════
// MOBILE SIDEBAR
// ═══════════════════════════════
const mobileMenuBtn  = document.getElementById('mobileMenuBtn');
const sidebarOverlay = document.getElementById('sidebarOverlay');

function openMobileSidebar() {
  sidebar.classList.add('mobile-open');
  sidebarOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closeMobileSidebar() {
  sidebar.classList.remove('mobile-open');
  sidebarOverlay.classList.remove('active');
  document.body.style.overflow = '';
}

mobileMenuBtn.addEventListener('click', openMobileSidebar);
sidebarOverlay.addEventListener('click', closeMobileSidebar);

document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', () => {
    if (window.innerWidth <= 768) closeMobileSidebar();
  });
});

// ═══════════════════════════════
// SCROLL REVEAL
// ═══════════════════════════════
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 70);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.06, rootMargin: '0px 0px -20px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

// ═══════════════════════════════
// FILTER TABS
// ═══════════════════════════════
const filterBtns = document.querySelectorAll('.filter-btn');
const aiCards    = document.querySelectorAll('.ai-card');
const emptyState = document.getElementById('emptyState');
const searchInput = document.getElementById('searchInput');

let activeFilter = 'all';
let searchQuery  = '';

function applyFilters() {
  let visibleCount = 0;

  aiCards.forEach(card => {
    const category = card.getAttribute('data-category') || '';
    const name     = card.getAttribute('data-name') || '';

    const matchFilter = activeFilter === 'all' || category === activeFilter;
    const matchSearch = name.includes(searchQuery.toLowerCase()) ||
                        category.includes(searchQuery.toLowerCase());

    if (matchFilter && matchSearch) {
      card.classList.remove('hidden');
      card.classList.add('visible'); // ensure reveal visible
      visibleCount++;
    } else {
      card.classList.add('hidden');
    }
  });

  emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
}

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeFilter = btn.getAttribute('data-filter');
    applyFilters();
  });
});

// ═══════════════════════════════
// SEARCH (TOPBAR)
// ═══════════════════════════════
searchInput.addEventListener('input', () => {
  searchQuery = searchInput.value.trim();
  applyFilters();
});

// ═══════════════════════════════
// TOPBAR SHADOW ON SCROLL
// ═══════════════════════════════
const topbar = document.querySelector('.topbar');
window.addEventListener('scroll', () => {
  topbar.style.boxShadow = window.scrollY > 10 ? '0 4px 32px rgba(0,0,0,0.35)' : 'none';
}, { passive: true });

// ═══════════════════════════════
// CARD HOVER - subtle tilt effect
// ═══════════════════════════════
aiCards.forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect   = card.getBoundingClientRect();
    const x      = e.clientX - rect.left;
    const y      = e.clientY - rect.top;
    const cx     = rect.width  / 2;
    const cy     = rect.height / 2;
    const tiltX  = ((y - cy) / cy) * 4;
    const tiltY  = ((x - cx) / cx) * -4;
    card.style.transform = `translateY(-6px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    card.style.transition = 'transform 0.1s ease';
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'all 0.4s ease';
  });
});