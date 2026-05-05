// ═══════════════════════════════
// SIDEBAR COLLAPSE (Desktop)
// ═══════════════════════════════
const sidebar      = document.getElementById('sidebar');
const mainContent  = document.getElementById('mainContent');
const sidebarToggle = document.getElementById('sidebarToggle');
const toggleIcon   = document.getElementById('toggleIcon');

sidebarToggle.addEventListener('click', () => {
  sidebar.classList.toggle('collapsed');
  mainContent.classList.toggle('expanded');
});

// ═══════════════════════════════
// MOBILE SIDEBAR
// ═══════════════════════════════
const mobileMenuBtn   = document.getElementById('mobileMenuBtn');
const sidebarOverlay  = document.getElementById('sidebarOverlay');

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

// Close mobile sidebar when nav link clicked
document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', () => {
    if (window.innerWidth <= 768) closeMobileSidebar();
  });
});

// ═══════════════════════════════
// ACTIVE NAV ITEM ON SCROLL
// ═══════════════════════════════
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-item');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 120;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });

  // Update active nav based on scroll (optional: add more mappings)
  // navItems.forEach(item => {
  //   item.classList.remove('active');
  //   if (item.getAttribute('href')?.includes(current)) {
  //     item.classList.add('active');
  //   }
  // });
}, { passive: true });

// ═══════════════════════════════
// SCROLL REVEAL
// ═══════════════════════════════
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger children in same parent group
      const siblings = entry.target.parentElement.querySelectorAll('.reveal:not(.visible)');
      siblings.forEach((el, idx) => {
        setTimeout(() => el.classList.add('visible'), idx * 100);
      });
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -40px 0px'
});

revealEls.forEach(el => revealObserver.observe(el));

// ═══════════════════════════════
// ANIMATED CHART BARS ON LOAD
// ═══════════════════════════════
window.addEventListener('load', () => {
  const bars = document.querySelectorAll('.bar');
  bars.forEach((bar, i) => {
    const targetH = bar.style.getPropertyValue('--h');
    bar.style.setProperty('--h', '0%');
    setTimeout(() => {
      bar.style.setProperty('--h', targetH);
    }, 300 + i * 80);
  });

  // Animate progress fills
  const fills = document.querySelectorAll('.gcp-fill, .fc-fill');
  fills.forEach(fill => {
    const w = fill.style.width;
    fill.style.width = '0%';
    setTimeout(() => {
      fill.style.transition = 'width 1s cubic-bezier(0.4,0,0.2,1)';
      fill.style.width = w;
    }, 600);
  });
});

// ═══════════════════════════════
// TOPBAR SHADOW ON SCROLL
// ═══════════════════════════════
const topbar = document.querySelector('.topbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 10) {
    topbar.style.boxShadow = '0 4px 32px rgba(0,0,0,0.35)';
  } else {
    topbar.style.boxShadow = 'none';
  }
}, { passive: true });

// ═══════════════════════════════
// AUTO LOGOUT 15 MENIT IDLE
// ═══════════════════════════════
const MAX_IDLE = 15 * 60; // 15 menit
const WARNING_TIME = 10;  // 10 detik sebelum logout

let idleTime = 0;
let warningShown = false;

setInterval(() => {
  idleTime++;

  // ⛔ Tampilkan warning
  if (idleTime === MAX_IDLE - WARNING_TIME && !warningShown) {
    showToast("Kamu akan logout dalam 10 detik...", "warning");
    warningShown = true;
  }

  // 🚪 Auto logout TANPA konfirmasi
  if (idleTime >= MAX_IDLE) {
    localStorage.removeItem("user");
    window.location.href = "../login.html";
  }

}, 1000);