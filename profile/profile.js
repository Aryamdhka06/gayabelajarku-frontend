const BASE_URL = "https://gayabelajarku-backend.vercel.app";
// ═══════════════════════════════
// ini profile.js
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
      setTimeout(() => entry.target.classList.add('visible'), i * 90);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
revealEls.forEach(el => revealObserver.observe(el));

// ═══════════════════════════════
// STATE
// ═══════════════════════════════
let currentUser      = null;
let isEditMode       = false;
let newAvatarFile    = null;
let currentAvatarUrl = '';

// ═══════════════════════════════
// DOM REFS
// ═══════════════════════════════
const profileNameEl  = document.getElementById('profileName');
const profileEmailEl = document.getElementById('profileEmail');
const infoNamaEl     = document.getElementById('infoNama');
const infoEmailEl    = document.getElementById('infoEmail');
const infoJoinEl     = document.getElementById('infoJoin');
const infoLokasiEl   = document.getElementById('infoLokasi');
const bioParagraph   = document.getElementById('bioParagraph');
const avatarDisplay  = document.getElementById('avatarDisplay');
const avatarTopbar   = document.getElementById('avatarTopbar');
const btnEdit        = document.getElementById('btnEditProfile');
const btnLogoutEl    = document.getElementById('btnLogout');

// ═══════════════════════════════
// INJECT ELEMEN EDIT KE DOM
// ═══════════════════════════════
function injectEditElements() {
  const nameInput = document.createElement('input');
  nameInput.id          = 'editNameInput';
  nameInput.type        = 'text';
  nameInput.placeholder = 'Nama lengkap...';
  nameInput.className   = 'inline-input';
  nameInput.style.display = 'none';
  profileNameEl.insertAdjacentElement('afterend', nameInput);

  const bioTextarea = document.createElement('textarea');
  bioTextarea.id          = 'editBioTextarea';
  bioTextarea.placeholder = 'Ceritakan tentang dirimu...';
  bioTextarea.className   = 'inline-textarea';
  bioTextarea.rows        = 3;
  bioTextarea.style.display = 'none';
  bioParagraph.insertAdjacentElement('afterend', bioTextarea);

  const fileInput = document.createElement('input');
  fileInput.id     = 'avatarFileInput';
  fileInput.type   = 'file';
  fileInput.accept = 'image/*';
  fileInput.style.display = 'none';
  document.body.appendChild(fileInput);

  const changePhotoBtn = document.createElement('button');
  changePhotoBtn.id        = 'changePhotoBtn';
  changePhotoBtn.className = 'change-photo-btn';
  changePhotoBtn.title     = 'Ganti foto profil';
  changePhotoBtn.innerHTML = '<i class="fa-solid fa-camera"></i>';
  changePhotoBtn.style.display = 'none';

  const avatarRing = avatarDisplay.parentElement;
  avatarRing.appendChild(changePhotoBtn);

  changePhotoBtn.addEventListener('click', () => fileInput.click());

  fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    newAvatarFile = file;
    const reader = new FileReader();
    reader.onload = (ev) => {
      // FIX: gunakan renderAvatar agar styling konsisten & tidak lonjong
      renderAvatarFromDataUrl(ev.target.result);
    };
    reader.readAsDataURL(file);
  });
}

// ═══════════════════════════════
// MODE TAMPILAN NORMAL
// ═══════════════════════════════
function setViewMode() {
  isEditMode = false;

  profileNameEl.style.display = '';
  bioParagraph.style.display  = '';
  document.getElementById('editNameInput').style.display   = 'none';
  document.getElementById('editBioTextarea').style.display = 'none';
  document.getElementById('changePhotoBtn').style.display  = 'none';

  btnEdit.innerHTML = '<i class="fa-solid fa-pen-to-square"></i> Edit Profil';
  btnEdit.classList.remove('btn-save-mode');
  btnEdit.disabled = false;

  btnLogoutEl.style.display = '';
}

// ═══════════════════════════════
// MODE EDIT
// ═══════════════════════════════
function setEditMode() {
  isEditMode    = true;
  newAvatarFile = null;

  document.getElementById('editNameInput').value   = profileNameEl.textContent.trim();
  document.getElementById('editBioTextarea').value = bioParagraph.textContent.trim();

  profileNameEl.style.display = 'none';
  bioParagraph.style.display  = 'none';
  document.getElementById('editNameInput').style.display   = '';
  document.getElementById('editBioTextarea').style.display = '';
  document.getElementById('changePhotoBtn').style.display  = '';

  btnEdit.innerHTML = '<i class="fa-solid fa-check"></i> Simpan';
  btnEdit.classList.add('btn-save-mode');

  btnLogoutEl.style.display = 'none';

  document.getElementById('editNameInput').focus();
}

// ═══════════════════════════════
// SIMPAN PROFIL
// ═══════════════════════════════
async function saveProfile() {
  const newNama = document.getElementById('editNameInput').value.trim();
  const newBio  = document.getElementById('editBioTextarea').value.trim();

  if (!newNama) {
    document.getElementById('editNameInput').classList.add('input-error');
    setTimeout(() => document.getElementById('editNameInput').classList.remove('input-error'), 2000);
    showToast('Nama tidak boleh kosong!', 'error');
    return;
  }

  btnEdit.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Menyimpan...';
  btnEdit.disabled  = true;

  try {
    let fotoUrl = currentAvatarUrl;

    if (newAvatarFile && currentUser?.id) {
      const formData = new FormData();
      formData.append("avatar", newAvatarFile);

      const uploadRes  = await fetch(`${BASE_URL}/upload-avatar/${currentUser.id}`, {
        method: "POST",
        body: formData,
      });
      const uploadData = await uploadRes.json();

      if (!uploadData.success) throw new Error(uploadData.error);
      fotoUrl = uploadData.url;
    }

    if (currentUser?.id) {
      const res  = await fetch(`${BASE_URL}/profile/${currentUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nama: newNama, bio: newBio, foto: fotoUrl }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Gagal menyimpan ke server');
    }

    profileNameEl.textContent = newNama;
    infoNamaEl.textContent    = newNama;
    if (newBio) bioParagraph.textContent = newBio;

    if (fotoUrl) renderAvatar(fotoUrl, newNama);
    currentAvatarUrl = fotoUrl;

    const initials = newNama.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
    avatarTopbar.textContent = initials;

    const savedUser = JSON.parse(localStorage.getItem('user')) || {};
    Object.assign(savedUser, { nama: newNama, bio: newBio, foto: fotoUrl || savedUser.foto });
    localStorage.setItem('user', JSON.stringify(savedUser));
    currentUser = { ...currentUser, ...savedUser };

    setViewMode();
    showToast('Profil berhasil diperbarui!', 'success');

  } catch (err) {
    console.warn('Backend error:', err.message);

    const newNamaFb = document.getElementById('editNameInput').value.trim();
    const newBioFb  = document.getElementById('editBioTextarea').value.trim();

    profileNameEl.textContent = newNamaFb;
    infoNamaEl.textContent    = newNamaFb;
    if (newBioFb) bioParagraph.textContent = newBioFb;

    const savedUser = JSON.parse(localStorage.getItem('user')) || {};
    Object.assign(savedUser, { nama: newNamaFb, bio: newBioFb });
    localStorage.setItem('user', JSON.stringify(savedUser));
    currentUser = { ...currentUser, ...savedUser };

    const initials = newNamaFb.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
    avatarTopbar.textContent = initials;

    setViewMode();
    showToast('Disimpan lokal (server tidak terhubung)', 'warning');
  }
}

// ═══════════════════════════════
// TOMBOL EDIT / SIMPAN
// ═══════════════════════════════
btnEdit.addEventListener('click', () => {
  if (!isEditMode) {
    setEditMode();
  } else {
    saveProfile();
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && isEditMode) {
    if (newAvatarFile) renderAvatar(currentAvatarUrl, profileNameEl.textContent);
    newAvatarFile = null;
    setViewMode();
    showToast('Edit dibatalkan', 'warning');
  }
});

// ═══════════════════════════════
// RENDER AVATAR — FIX UTAMA
// Pisahkan helper untuk dataURL (preview)
// dan URL normal agar keduanya bulat sempurna
// ═══════════════════════════════

/**
 * Render avatar dari URL (http/https/data URL).
 * Membersihkan konten lama lalu buat <img> dengan
 * style yang benar agar tidak lonjong.
 */
function renderAvatar(url, nama) {
  avatarDisplay.innerHTML = '';

  if (url) {
    const img = document.createElement('img');
    img.src = url;
    img.alt = 'Avatar';

    // FIX: gunakan CSS class + style absolute positioning
    // agar img mengisi lingkaran 100%×100% tanpa distorsi
    img.style.cssText = [
      'position: absolute',
      'inset: 0',
      'width: 100%',
      'height: 100%',
      'object-fit: cover',
      'object-position: center',
      'border-radius: 50%',
      'display: block',
    ].join('; ');

    // Pastikan parent relative (kadang belum di-set)
    avatarDisplay.style.position = 'relative';

    avatarDisplay.appendChild(img);
    currentAvatarUrl = url;
  } else {
    // Fallback: tampilkan inisial
    const initials = (nama || 'GK').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
    const span = document.createElement('span');
    span.style.cssText = 'font-size:32px; font-weight:800; color:white; position:relative; z-index:1;';
    span.textContent   = initials;
    avatarDisplay.appendChild(span);
    currentAvatarUrl = '';
  }
}

/**
 * Render dari dataURL hasil FileReader (preview foto baru).
 * Sama seperti renderAvatar tapi tidak ubah currentAvatarUrl.
 */
function renderAvatarFromDataUrl(dataUrl) {
  avatarDisplay.innerHTML = '';
  const img = document.createElement('img');
  img.src = dataUrl;
  img.alt = 'Preview';
  img.style.cssText = [
    'position: absolute',
    'inset: 0',
    'width: 100%',
    'height: 100%',
    'object-fit: cover',
    'object-position: center',
    'border-radius: 50%',
    'display: block',
  ].join('; ');
  avatarDisplay.style.position = 'relative';
  avatarDisplay.appendChild(img);
}

// ═══════════════════════════════
// LOAD USER PROFILE
// ═══════════════════════════════
async function loadProfile() {
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user) { setProfileFallback(); return; }

  currentUser = user;
  const nama  = user.nama || user.name || user.username || 'Pengguna';

  applyProfileData({ nama, email: user.email, bio: user.bio, foto: user.foto, lokasi: user.lokasi });

  if (user.id) {
    try {
      const res  = await fetch(`${BASE_URL}/profile/${user.id}`);
      const data = await res.json();
      if (data.success && data.user) {
        const u = data.user;
        currentUser = { ...user, ...u };
        applyProfileData({
          nama:   u.nama    || nama,
          email:  u.email   || user.email,
          bio:    u.bio     || user.bio,
          foto:   u.foto    || user.foto,
          lokasi: u.lokasi  || user.lokasi,
          join:   u.created_at || user.joinDate,
        });
      }
    } catch {
      console.warn('Backend tidak terhubung, pakai data lokal.');
    }
  }
}

function applyProfileData({ nama, email, bio, foto, lokasi, join }) {
  if (nama) {
    profileNameEl.textContent = nama;
    infoNamaEl.textContent    = nama;
    const initials = nama.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
    avatarTopbar.textContent  = initials;
  }
  if (email) {
    profileEmailEl.textContent = email;
    infoEmailEl.textContent    = email;
  }
  if (bio)    bioParagraph.textContent = bio;
  if (lokasi) infoLokasiEl.textContent = lokasi;
  if (join) {
    infoJoinEl.textContent = new Date(join).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'long', year: 'numeric',
    });
  }
  // Selalu panggil renderAvatar agar konsisten
  renderAvatar(foto || '', nama);
}

function setProfileFallback() {
  profileNameEl.textContent  = 'Tamu';
  infoNamaEl.textContent     = 'Tamu';
  profileEmailEl.textContent = 'Belum login';
  infoEmailEl.textContent    = 'Belum login';
  avatarTopbar.textContent   = 'GK';
  avatarDisplay.innerHTML    = '<i class="fa-solid fa-user" style="position:relative;z-index:1;"></i>';
}

// ═══════════════════════════════
// LOAD HASIL TES GAYA BELAJAR
// FIX: ambil dari data.result, bukan dari data langsung
// ═══════════════════════════════
async function loadHasilTes() {
  const user = JSON.parse(localStorage.getItem('user'));

  // Default state
  document.getElementById('dominantName').textContent = 'Belum Tes';
  document.getElementById('gayaDesc').textContent     = 'Silakan lakukan tes gaya belajar terlebih dahulu!';

  if (!user || !user.id) return;

  try {
    const res  = await fetch(`${BASE_URL}/check-result/${user.id}`);
    const data = await res.json();

    if (!data.success || !data.sudahTes || !data.result) return;

    const result     = data.result;
    const visual     = result.visual_score      || 0;
    const auditori   = result.auditory_score    || 0;
    const kinestetik = result.kinesthetic_score || 0;

    // ✅ FIX: total HARUS ADA
    const total = visual + auditori + kinestetik || 1;

    // ✅ persen
    const persenVisual     = Math.round((visual / total) * 100);
    const persenAuditori   = Math.round((auditori / total) * 100);
    const persenKinestetik = Math.round((kinestetik / total) * 100);

    // tampilkan persen
    document.getElementById('scoreVisual').textContent     = persenVisual + '%';
    document.getElementById('scoreAuditori').textContent   = persenAuditori + '%';
    document.getElementById('scoreKinestetik').textContent = persenKinestetik + '%';

    // progress bar
    setTimeout(() => {
      document.getElementById('barVisual').style.width     = `${persenVisual}%`;
      document.getElementById('barAuditori').style.width   = `${persenAuditori}%`;
      document.getElementById('barKinestetik').style.width = `${persenKinestetik}%`;
    }, 400);

    // tentukan dominan
    let dominantName;
    if (result.dominant_style) {
      dominantName = result.dominant_style;
    } else {
      const scores = { Visual: visual, Auditori: auditori, Kinestetik: kinestetik };
      dominantName = Object.entries(scores).reduce((a, b) => b[1] > a[1] ? b : a)[0];
    }

    // ambil persen dominan
    const dominantPercent = {
      Visual: persenVisual,
      Auditori: persenAuditori,
      Kinestetik: persenKinestetik
    }[dominantName];

    // tampilkan
    document.getElementById('dominantName').textContent  = dominantName;
    document.getElementById('dominantBadge').textContent = dominantPercent + '%';

    const descriptions = {
      Visual:     'Kamu belajar paling efektif melalui gambar, diagram, warna, dan tampilan visual.',
      Auditori:   'Kamu belajar paling efektif melalui pendengaran, diskusi, dan penjelasan lisan.',
      Kinestetik: 'Kamu belajar paling efektif melalui gerakan, praktik langsung, dan pengalaman nyata.',
    };

    document.getElementById('gayaDesc').textContent = descriptions[dominantName] || '';

  } catch (err) {
    console.error("Gagal load hasil tes:", err);
  }
}

// ═══════════════════════════════
// LOGOUT
// ═══════════════════════════════
btnLogoutEl.addEventListener('click', () => {
  if (confirm('Yakin ingin logout?')) {
    localStorage.removeItem('user');
    window.location.href = '../home/home.html';
  }
});

// ═══════════════════════════════
// TOAST NOTIFICATION
// ═══════════════════════════════
function showToast(message, type = 'success') {
  let toast = document.getElementById('profileToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'profileToast';
    toast.style.cssText = `
      position:fixed; bottom:30px; right:30px; z-index:9999;
      color:white; padding:13px 22px; border-radius:12px;
      font-size:14px; font-weight:600;
      font-family:'Plus Jakarta Sans',sans-serif;
      display:flex; align-items:center; gap:8px;
      transform:translateY(20px); opacity:0;
      transition: all 0.35s cubic-bezier(0.4,0,0.2,1);
      box-shadow:0 8px 24px rgba(0,0,0,0.3);
      pointer-events:none;
    `;
    document.body.appendChild(toast);
  }

  const bg   = { success:'linear-gradient(135deg,#7c3aed,#ec4899)', error:'linear-gradient(135deg,#dc2626,#ef4444)', warning:'linear-gradient(135deg,#d97706,#f59e0b)' };
  const icon = { success:'check-circle', error:'circle-xmark', warning:'triangle-exclamation' };

  toast.style.background = bg[type] || bg.success;
  toast.innerHTML = `<i class="fa-solid fa-${icon[type] || 'check-circle'}"></i> ${message}`;

  requestAnimationFrame(() => {
    toast.style.transform = 'translateY(0)';
    toast.style.opacity   = '1';
  });
  setTimeout(() => {
    toast.style.transform = 'translateY(20px)';
    toast.style.opacity   = '0';
  }, 3000);
}

// ═══════════════════════════════
// TOPBAR SHADOW ON SCROLL
// ═══════════════════════════════
const topbar = document.querySelector('.topbar');
window.addEventListener('scroll', () => {
  topbar.style.boxShadow = window.scrollY > 10 ? '0 4px 32px rgba(0,0,0,0.35)' : 'none';
}, { passive: true });

// ═══════════════════════════════
// INIT
// ═══════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  injectEditElements();
  loadProfile();
  loadHasilTes();
});