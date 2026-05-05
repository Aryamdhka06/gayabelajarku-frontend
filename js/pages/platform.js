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
      setTimeout(() => entry.target.classList.add('visible'), i * 60);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.06, rootMargin: '0px 0px -20px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

// ═══════════════════════════════
// FILTER & SEARCH
// ═══════════════════════════════
const filterBtns    = document.querySelectorAll('.filter-btn');
const allCards      = document.querySelectorAll('.plat-card');
const sectionLabels = document.querySelectorAll('.section-label');
const emptyState    = document.getElementById('emptyState');
const searchInput   = document.getElementById('searchInput');

let activeFilter = 'all';
let searchQuery  = '';

function applyFilters() {
  let visibleCount = 0;

  allCards.forEach(card => {
    const category = card.getAttribute('data-category') || '';
    const gaya     = card.getAttribute('data-gaya') || '';
    const name     = card.getAttribute('data-name') || '';
    const descText = card.querySelector('.plat-desc')?.textContent.toLowerCase() || '';

    // Filter logic
    let matchFilter = false;
    if (activeFilter === 'all') {
      matchFilter = true;
    } else if (activeFilter === 'kursus' || activeFilter === 'video') {
      matchFilter = category === activeFilter;
    } else {
      // Gaya belajar filter: visual, auditori, kinestetik
      matchFilter = gaya.includes(activeFilter);
    }

    // Search logic
    const matchSearch = searchQuery === '' ||
      name.includes(searchQuery) ||
      descText.includes(searchQuery) ||
      gaya.includes(searchQuery);

    if (matchFilter && matchSearch) {
      card.classList.remove('hidden');
      card.classList.add('visible');
      visibleCount++;
    } else {
      card.classList.add('hidden');
    }
  });

  // Hide section labels if all cards in their section are hidden
  sectionLabels.forEach(label => {
    const section = label.getAttribute('data-section');
    const sectionCards = document.querySelectorAll(`.plat-card[data-category="${section}"]`);
    const anyVisible   = Array.from(sectionCards).some(c => !c.classList.contains('hidden'));
    label.style.display = anyVisible ? '' : 'none';
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

searchInput.addEventListener('input', () => {
  searchQuery = searchInput.value.trim().toLowerCase();
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
// CARD HOVER TILT
// ═══════════════════════════════
allCards.forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect  = card.getBoundingClientRect();
    const x     = e.clientX - rect.left;
    const y     = e.clientY - rect.top;
    const cx    = rect.width  / 2;
    const cy    = rect.height / 2;
    const tiltX = ((y - cy) / cy) * 3.5;
    const tiltY = ((x - cx) / cx) * -3.5;
    card.style.transform   = `translateY(-6px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    card.style.transition  = 'transform 0.1s ease';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform  = '';
    card.style.transition = 'all 0.4s ease';
  });
});