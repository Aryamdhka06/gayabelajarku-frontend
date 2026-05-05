const BASE_URL = "https://gayabelajarku-backend.vercel.app";
// ═══════════════════════════════
// PANEL TOGGLE
// ═══════════════════════════════
const loginPanel    = document.getElementById('loginPanel');
const registerPanel = document.getElementById('registerPanel');
const rpLogin       = document.getElementById('rpLogin');
const rpRegister    = document.getElementById('rpRegister');
const goRegister    = document.getElementById('goRegister');
const goLogin       = document.getElementById('goLogin');

function switchToRegister() {
  loginPanel.classList.add('hidden');
  registerPanel.classList.remove('hidden');
  rpLogin.classList.add('hidden');
  rpRegister.classList.remove('hidden');
  // Trigger re-animation
  registerPanel.style.animation = 'none';
  requestAnimationFrame(() => { registerPanel.style.animation = ''; });
}

function switchToLogin() {
  registerPanel.classList.add('hidden');
  loginPanel.classList.remove('hidden');
  rpRegister.classList.add('hidden');
  rpLogin.classList.remove('hidden');
  loginPanel.style.animation = 'none';
  requestAnimationFrame(() => { loginPanel.style.animation = ''; });
}

goRegister.addEventListener('click', switchToRegister);
goLogin.addEventListener('click', switchToLogin);

// ═══════════════════════════════
// PASSWORD VISIBILITY TOGGLE
// ═══════════════════════════════
function setupEyeToggle(btnId, iconId, inputId) {
  const btn   = document.getElementById(btnId);
  const icon  = document.getElementById(iconId);
  const input = document.getElementById(inputId);
  if (!btn) return;
  btn.addEventListener('click', () => {
    const isHidden = input.type === 'password';
    input.type     = isHidden ? 'text' : 'password';
    icon.className = isHidden ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye';
  });
}

setupEyeToggle('toggleLoginPw', 'eyeLoginIcon', 'password');
setupEyeToggle('toggleRegPw',   'eyeRegIcon',   'regPassword');

// ═══════════════════════════════
// PASSWORD STRENGTH METER
// ═══════════════════════════════
const regPasswordInput = document.getElementById('regPassword');
const pwFill           = document.getElementById('pwFill');
const pwLabel          = document.getElementById('pwLabel');

if (regPasswordInput) {
  regPasswordInput.addEventListener('input', () => {
    const val = regPasswordInput.value;
    const score = calcStrength(val);

    const levels = [
      { width: '0%',   color: 'transparent',                    label: 'Kekuatan password' },
      { width: '25%',  color: '#ef4444',                         label: 'Lemah' },
      { width: '50%',  color: '#f97316',                         label: 'Sedang' },
      { width: '75%',  color: '#eab308',                         label: 'Kuat' },
      { width: '100%', color: 'linear-gradient(90deg,#10b981,#3b82f6)', label: 'Sangat Kuat' },
    ];

    const lvl = levels[score];
    pwFill.style.width      = lvl.width;
    pwFill.style.background = lvl.color;
    pwLabel.textContent     = lvl.label;
    pwLabel.style.color     = score === 0 ? 'var(--muted)' : (score < 3 ? '#f97316' : score === 3 ? '#eab308' : '#10b981');
  });
}

function calcStrength(pw) {
  if (!pw) return 0;
  let score = 0;
  if (pw.length >= 8)  score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score;
}

// ═══════════════════════════════
// TOAST
// ═══════════════════════════════
const toastEl = document.getElementById('toast');
let toastTimer;

function showToast(message, type = 'success') {
  clearTimeout(toastTimer);
  toastEl.className   = `toast ${type} show`;
  const icons = { success: 'check-circle', error: 'circle-xmark', warning: 'triangle-exclamation' };
  toastEl.innerHTML = `<i class="fa-solid fa-${icons[type] || 'check-circle'}"></i> ${message}`;
  toastTimer = setTimeout(() => toastEl.classList.remove('show'), 3200);
}

// ═══════════════════════════════
// LOADING STATE HELPER
// ═══════════════════════════════
function setLoading(btnId, loading) {
  const btn    = document.getElementById(btnId);
  const text   = btn.querySelector('.btn-text');
  const loader = btn.querySelector('.btn-loader');
  btn.disabled         = loading;
  text.style.display   = loading ? 'none' : 'flex';
  loader.style.display = loading ? 'flex' : 'none';
}

// ═══════════════════════════════
// INPUT VALIDATION HELPER
// ═══════════════════════════════
function setError(inputId, hasError) {
  const el = document.getElementById(inputId);
  if (!el) return;
  el.classList.toggle('error', hasError);
}

// ═══════════════════════════════
// LOGIN
// ═══════════════════════════════
const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email    = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  // Basic validation
  let valid = true;
  if (!email)    { setError('email', true);    valid = false; } else { setError('email', false); }
  if (!password) { setError('password', true); valid = false; } else { setError('password', false); }
  if (!valid) { showToast('Lengkapi semua field!', 'error'); return; }

  setLoading('loginBtn', true);

  try {
    const res = await fetch(`${BASE_URL}/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password }),
});
    const data = await res.json();

    if (data.success) {
      localStorage.setItem('user', JSON.stringify(data.user));
      showToast('Login berhasil! Mengalihkan...', 'success');
      setTimeout(() => {
        window.location.href = './pages/home/home.html';
      }, 1000);
    } else {
      showToast('Login gagal: ' + (data.error || 'Cek email & password'), 'error');
      setError('email', true);
      setError('password', true);
    }
  } catch (err) {
    console.error(err);
    showToast('Server tidak terhubung. Coba lagi.', 'error');
  } finally {
    setLoading('loginBtn', false);
  }
});

// ═══════════════════════════════
// REGISTER
// ═══════════════════════════════
const registerForm = document.getElementById('registerForm');

registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = document.getElementById('username').value.trim();
  const email    = document.getElementById('regEmail').value.trim();
  const password = document.getElementById('regPassword').value;

  // Validation
  let valid = true;
  if (!username)          { setError('username', true);    valid = false; } else { setError('username', false); }
  if (!email)             { setError('regEmail', true);    valid = false; } else { setError('regEmail', false); }
  if (password.length < 6) { setError('regPassword', true); valid = false; } else { setError('regPassword', false); }
  if (!valid) { showToast('Lengkapi semua field dengan benar!', 'error'); return; }

  if (calcStrength(password) < 2) {
    showToast('Password terlalu lemah — tambahkan angka atau huruf kapital', 'warning');
    return;
  }

  setLoading('registerBtn', true);

  try {
    const res  = await fetch(`${BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });
    const data = await res.json();

    if (data.success) {
      showToast('Akun berhasil dibuat! Silakan login.', 'success');
      registerForm.reset();
      pwFill.style.width  = '0%';
      pwLabel.textContent = 'Kekuatan password';
      setTimeout(switchToLogin, 1400);
    } else {
      showToast('Daftar gagal: ' + (data.error || 'Coba lagi'), 'error');
    }
  } catch (err) {
    console.error(err);
    showToast('Server tidak terhubung. Coba lagi.', 'error');
  } finally {
    setLoading('registerBtn', false);
  }
});

// ═══════════════════════════════
// CLEAR ERROR ON INPUT
// ═══════════════════════════════
['email','password','username','regEmail','regPassword'].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.addEventListener('input', () => setError(id, false));
});