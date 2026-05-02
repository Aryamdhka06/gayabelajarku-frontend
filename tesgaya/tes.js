// ═══════════════════════════════
// CEK SUDAH TES (dipanggil saat halaman dimuat)
// ═══════════════════════════════
const BASE_URL = "https://gayabelajarku-backend.vercel.app";
let sudahTesGlobal = false;

async function checkSudahTes() {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  if (!user) return;

  try {
    const res = await fetch(`${BASE_URL}/check-result/${user.id}`);
    const data = await res.json();

    if (data.sudahTes && data.result) {
      sudahTesGlobal = true;

      // Nonaktifkan tombol mulai
      btnMulai.disabled = true;
      btnMulai.textContent = "Tes Sudah Dikerjakan";

      // Tampilkan banner peringatan di intro
      const banner = document.getElementById("alreadyDoneBanner");
      if (banner) banner.classList.remove("hidden");

      // Langsung tampilkan hasil dari server
      tampilkanHasilDariServer(data.result);
    }
  } catch (err) {
    console.error("Gagal cek hasil:", err);
  }
}

// ═══════════════════════════════
// TAMPILKAN HASIL DARI SERVER
// ═══════════════════════════════
function tampilkanHasilDariServer(result) {
  const visual     = result.visual_score      || 0;
  const auditori   = result.auditory_score    || 0;
  const kinestetik = result.kinesthetic_score || 0;
  const total      = visual + auditori + kinestetik || 1;

  const vPct = Math.round((visual     / total) * 100);
  const aPct = Math.round((auditori   / total) * 100);
  const kPct = Math.round((kinestetik / total) * 100);

  const gaya = result.dominant_style || determineGaya(visual, auditori, kinestetik);
  renderResult(gaya, vPct, aPct, kPct);
}

// ═══════════════════════════════
// TENTUKAN GAYA DOMINAN
// ═══════════════════════════════
function determineGaya(v, a, k) {
  if (v >= a && v >= k) return "Visual";
  if (a >= k) return "Auditori";
  return "Kinestetik";
}

// ═══════════════════════════════
// DATA SOAL
// Setiap opsi punya tipe: 'v'=Visual, 'a'=Auditori, 'k'=Kinestetik
// ═══════════════════════════════
const questions = [
  {
    q: "Saat kamu ingin pergi ke tempat baru yang belum pernah dikunjungi, kamu lebih memilih:",
    options: [
      { text: "Melihat peta, gambar, atau Google Maps", type: "v" },
      { text: "Mendengarkan penjelasan arah dari orang lain", type: "a" },
      { text: "Langsung pergi sambil mencoba mencari jalan", type: "k" },
    ],
  },
  {
    q: "Saat bermain game baru yang belum pernah kamu mainkan:",
    options: [
      { text: "Membaca atau melihat petunjuk di layar", type: "v" },
      { text: "Mendengarkan penjelasan dari teman", type: "a" },
      { text: "Langsung mencoba bermain", type: "k" },
    ],
  },
  {
    q: "Saat merakit mainan atau benda (misalnya LEGO):",
    options: [
      { text: "Mengikuti gambar langkah-langkahnya", type: "v" },
      { text: "Mendengarkan penjelasan dari orang lain", type: "a" },
      { text: "Langsung mencoba merakit sendiri", type: "k" },
    ],
  },
  {
    q: "Saat kamu mengingat seseorang yang baru dikenal, kamu lebih mudah ingat:",
    options: [
      { text: "Wajah atau penampilannya", type: "v" },
      { text: "Suara atau cara bicaranya", type: "a" },
      { text: "Cara dia bergerak atau beraktivitas", type: "k" },
    ],
  },
  {
    q: "Saat belajar memasak dari resep baru:",
    options: [
      { text: "Menonton video atau melihat gambar resep", type: "v" },
      { text: "Mendengarkan penjelasan dari orang lain", type: "a" },
      { text: "Langsung mencoba memasak", type: "k" },
    ],
  },
  {
    q: "Saat kamu sedang santai di rumah, kamu lebih suka:",
    options: [
      { text: "Menonton video atau membaca", type: "v" },
      { text: "Mendengarkan musik atau podcast", type: "a" },
      { text: "Melakukan aktivitas seperti bermain atau bergerak", type: "k" },
    ],
  },
  {
    q: "Saat kamu tidak mengerti sesuatu (misalnya pelajaran):",
    options: [
      { text: "Mencari gambar, video, atau contoh visual", type: "v" },
      { text: "Bertanya dan mendengarkan penjelasan", type: "a" },
      { text: "Mencoba sendiri sampai paham", type: "k" },
    ],
  },
  {
    q: "Saat mengikuti instruksi (misalnya cara menggunakan alat):",
    options: [
      { text: "Lebih mudah jika ada gambar atau tulisan", type: "v" },
      { text: "Lebih mudah jika dijelaskan secara lisan", type: "a" },
      { text: "Lebih mudah jika langsung dicontohkan", type: "k" },
    ],
  },
  {
    q: "Saat menghafal pelajaran, kamu biasanya:",
    options: [
      { text: "Membaca berulang-ulang", type: "v" },
      { text: "Mengucapkan dengan suara keras", type: "a" },
      { text: "Menghafal sambil bergerak atau praktik", type: "k" },
    ],
  },
  {
    q: "Saat bermain dengan teman, kamu lebih suka:",
    options: [
      { text: "Permainan yang ada gambar atau tampilan menarik", type: "v" },
      { text: "Permainan yang banyak berbicara atau diskusi", type: "a" },
      { text: "Permainan yang banyak gerakan fisik", type: "k" },
    ],
  },
  {
    q: "Saat belajar sesuatu yang baru, kamu lebih suka:",
    options: [
      { text: "Melihat contoh terlebih dahulu", type: "v" },
      { text: "Mendengarkan penjelasan terlebih dahulu", type: "a" },
      { text: "Langsung mencoba sendiri", type: "k" },
    ],
  },
  {
    q: "Saat menonton film, kamu:",
    options: [
      { text: "Lebih memperhatikan gambar dan adegan", type: "v" },
      { text: "Lebih fokus pada dialog atau percakapan", type: "a" },
      { text: "Suka menirukan adegan atau gerakan", type: "k" },
    ],
  },
  {
    q: "Saat kamu menjelaskan sesuatu ke teman, kamu lebih suka:",
    options: [
      { text: "Menggambar atau menuliskan penjelasan", type: "v" },
      { text: "Menjelaskan dengan berbicara langsung", type: "a" },
      { text: "Menunjukkan dengan praktik langsung", type: "k" },
    ],
  },
  {
    q: "Saat berada di kelas, kamu:",
    options: [
      { text: "Lebih fokus melihat tulisan di papan atau slide", type: "v" },
      { text: "Lebih fokus mendengarkan penjelasan guru", type: "a" },
      { text: "Lebih suka saat ada kegiatan praktik", type: "k" },
    ],
  },
  {
    q: "Saat membaca buku pelajaran, kamu biasanya:",
    options: [
      { text: "Membaca dalam hati sambil memperhatikan isi", type: "v" },
      { text: "Membaca dengan suara keras agar lebih paham", type: "a" },
      { text: "Membaca sambil mencatat atau bergerak", type: "k" },
    ],
  },
  {
    q: "Saat mengingat kembali pelajaran, kamu lebih mudah mengingat:",
    options: [
      { text: "Gambar atau catatan yang pernah dilihat", type: "v" },
      { text: "Penjelasan yang pernah didengar", type: "a" },
      { text: "Kegiatan atau praktik yang pernah dilakukan", type: "k" },
    ],
  },
  {
    q: "Saat menggunakan HP untuk belajar, kamu lebih suka:",
    options: [
      { text: "Menonton video pembelajaran", type: "v" },
      { text: "Mendengarkan audio atau penjelasan", type: "a" },
      { text: "Menggunakan aplikasi yang bisa dicoba langsung", type: "k" },
    ],
  },
  {
    q: "Saat mengikuti kursus atau pelatihan, kamu lebih suka:",
    options: [
      { text: "Melihat slide atau gambar penjelasan", type: "v" },
      { text: "Mendengarkan instruktur berbicara", type: "a" },
      { text: "Praktik langsung sambil belajar", type: "k" },
    ],
  },
  {
    q: "Saat mengerjakan tugas, kamu:",
    options: [
      { text: "Membaca instruksi dengan teliti terlebih dahulu", type: "v" },
      { text: "Mendengarkan penjelasan tugas terlebih dahulu", type: "a" },
      { text: "Langsung mencoba mengerjakan", type: "k" },
    ],
  },
  {
    q: "Saat mencoba sesuatu yang baru, kamu lebih memilih:",
    options: [
      { text: "Melihat contoh atau demonstrasi terlebih dahulu", type: "v" },
      { text: "Mendengarkan cara melakukannya dari orang lain", type: "a" },
      { text: "Langsung mencoba sendiri tanpa panduan", type: "k" },
    ],
  },
];

// ═══════════════════════════════
// SHUFFLE HELPER
// ═══════════════════════════════
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const shuffledQuestions = questions.map((q) => ({
  q: q.q,
  options: shuffle(q.options),
}));

// ═══════════════════════════════
// STATE
// ═══════════════════════════════
let currentIndex = 0;
let answers = new Array(shuffledQuestions.length).fill(null);

// ═══════════════════════════════
// DOM REFS
// ═══════════════════════════════
const screenIntro  = document.getElementById("screenIntro");
const screenQuiz   = document.getElementById("screenQuiz");
const screenResult = document.getElementById("screenResult");

const btnMulai     = document.getElementById("btnMulai");
const btnPrev      = document.getElementById("btnPrev");
const btnNext      = document.getElementById("btnNext");
const btnHitung    = document.getElementById("btnHitung");

const currentQEl   = document.getElementById("currentQ");
const progressPct  = document.getElementById("progressPct");
const progressFill = document.getElementById("progressFill");
const qNumber      = document.getElementById("qNumber");
const qText        = document.getElementById("qText");
const qOptions     = document.getElementById("qOptions");
const navDots      = document.getElementById("navDots");

// ═══════════════════════════════
// SCREEN SWITCH
// ═══════════════════════════════
function show(el) {
  [screenIntro, screenQuiz, screenResult].forEach((s) =>
    s.classList.add("hidden")
  );
  el.classList.remove("hidden");
}

// ═══════════════════════════════
// RENDER SOAL
// ═══════════════════════════════
function renderQuestion(idx) {
  const total = shuffledQuestions.length;
  const q = shuffledQuestions[idx];

  qNumber.textContent = String(idx + 1).padStart(2, "0");
  qText.textContent = q.q;
  currentQEl.textContent = idx + 1;

  const pct = Math.round(((idx + 1) / total) * 100);
  progressFill.style.width = pct + "%";
  progressPct.textContent = pct + "%";

  qOptions.innerHTML = "";
  const labels = ["A", "B", "C"];
  q.options.forEach((opt, i) => {
    const div = document.createElement("div");
    div.className = "q-option" + (answers[idx] === i ? " selected" : "");
    div.innerHTML = `
      <span class="opt-letter">${labels[i]}</span>
      <span class="opt-text">${opt.text}</span>
    `;
    div.addEventListener("click", () => selectOption(idx, i));
    qOptions.appendChild(div);
  });

  const card = document.getElementById("questionCard");
  card.style.animation = "none";
  requestAnimationFrame(() => {
    card.style.animation = "";
  });

  btnPrev.disabled = idx === 0;
  const allAnswered = answers.filter((a) => a !== null).length === total;

  if (idx === total - 1) {
    btnNext.classList.add("hidden");
    btnHitung.classList.remove("hidden");
    btnHitung.style.display = "flex";
    const unanswered = answers.filter((a) => a === null).length;
    if (!allAnswered) {
      btnHitung.textContent = `Lihat Hasil (${unanswered} belum dijawab)`;
    } else {
      btnHitung.textContent = "Lihat Hasil";
    }
  } else {
    btnNext.classList.remove("hidden");
    btnHitung.classList.add("hidden");
  }

  renderDots(idx);
}

// ═══════════════════════════════
// RENDER DOTS
// ═══════════════════════════════
function renderDots(activeIdx) {
  navDots.innerHTML = "";
  shuffledQuestions.forEach((_, i) => {
    const dot = document.createElement("div");
    dot.className =
      "nav-dot" +
      (answers[i] !== null ? " answered" : "") +
      (i === activeIdx ? " current" : "");
    dot.addEventListener("click", () => {
      currentIndex = i;
      renderQuestion(i);
    });
    navDots.appendChild(dot);
  });
}

// ═══════════════════════════════
// SELECT OPTION
// ═══════════════════════════════
function selectOption(qIdx, optIdx) {
  answers[qIdx] = optIdx;
  renderQuestion(qIdx);

  if (qIdx < shuffledQuestions.length - 1) {
    setTimeout(() => {
      currentIndex = qIdx + 1;
      renderQuestion(currentIndex);
    }, 350);
  }
}

// ═══════════════════════════════
// NAVIGATION
// ═══════════════════════════════
btnPrev.addEventListener("click", () => {
  if (currentIndex > 0) {
    currentIndex--;
    renderQuestion(currentIndex);
  }
});

btnNext.addEventListener("click", () => {
  if (currentIndex < shuffledQuestions.length - 1) {
    currentIndex++;
    renderQuestion(currentIndex);
  }
});

// ═══════════════════════════════
// TOMBOL MULAI — validasi sudahTesGlobal
// ═══════════════════════════════
btnMulai.addEventListener("click", () => {
  if (sudahTesGlobal) {
    alert("Kamu sudah pernah mengerjakan tes ini.");
    return;
  }
  renderQuestion(0);
  show(screenQuiz);
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// ═══════════════════════════════
// HITUNG HASIL
// ═══════════════════════════════
btnHitung.addEventListener("click", () => {
  const unanswered = answers.filter((a) => a === null).length;
  if (unanswered > 0) {
    if (
      !confirm(
        `Masih ada ${unanswered} soal yang belum dijawab. Tetap lihat hasil?`
      )
    )
      return;
  }
  hitungDanSimpan();
});

// ═══════════════════════════════
// HITUNG + SIMPAN KE SERVER
// ═══════════════════════════════
async function hitungDanSimpan() {
  let visual = 0, auditori = 0, kinestetik = 0;

  answers.forEach((optIdx, qIdx) => {
    if (optIdx === null) return;
    const type = shuffledQuestions[qIdx].options[optIdx].type;
    if (type === "v") visual++;
    else if (type === "a") auditori++;
    else kinestetik++;
  });

  const total = visual + auditori + kinestetik || 1;
  const vPct  = Math.round((visual     / total) * 100);
  const aPct  = Math.round((auditori   / total) * 100);
  const kPct  = Math.round((kinestetik / total) * 100);
  const gaya  = determineGaya(visual, auditori, kinestetik);

  // Simpan ke localStorage
  try {
    localStorage.setItem(
      "hasilTes",
      JSON.stringify({ visual: vPct, auditori: aPct, kinestetik: kPct, dominant: gaya })
    );
  } catch (e) {}

  // Kirim ke backend
  const user = JSON.parse(localStorage.getItem("user") || "null");
  if (user) {
    try {
      const res = await fetch(`${BASE_URL}/save-result`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id:     user.id,
          visual:      visual,
          auditory:    auditori,   // key sesuai backend
          kinesthetic: kinestetik, // key sesuai backend
        }),
      });

      const result = await res.json();
      console.log("Saved ke server:", result);

      // Jika backend menolak karena sudah pernah tes, tampilkan data lama
      if (result.message === "User sudah pernah tes" && result.result) {
        sudahTesGlobal = true;
        tampilkanHasilDariServer(result.result);
        return;
      }
    } catch (err) {
      console.error("Gagal simpan:", err);
    }
  }

  // Tandai sudah tes agar tidak bisa ulang
  sudahTesGlobal = true;
  renderResult(gaya, vPct, aPct, kPct);
}

// ═══════════════════════════════
// RENDER HASIL
// ═══════════════════════════════
function renderResult(gaya, vPct, aPct, kPct) {
  const configs = {
    Visual: {
      icon: "fa-eye",
      desc: "Kamu belajar paling efektif melalui gambar, diagram, warna, video, dan tampilan visual. Coba gunakan mind map, infografis, dan catatan berwarna untuk belajar lebih optimal!",
      tags: ["Mind Map", "Infografis", "Video Edukasi", "Flashcard Visual"],
      detailHref: "../infogayabelajar/visual/visual.html",
    },
    Auditori: {
      icon: "fa-headphones",
      desc: "Kamu belajar paling efektif melalui pendengaran, diskusi, dan penjelasan lisan. Coba podcast edukasi, baca nyaring, dan diskusi kelompok untuk belajar lebih optimal!",
      tags: ["Podcast", "Diskusi", "Baca Nyaring", "Teknik Feynman"],
      detailHref: "../infogayabelajar/auditori/auditori.html",
    },
    Kinestetik: {
      icon: "fa-hand",
      desc: "Kamu belajar paling efektif melalui gerakan, praktik langsung, dan pengalaman nyata. Coba proyek nyata, simulasi, dan belajar sambil bergerak untuk hasil terbaik!",
      tags: ["Praktik Langsung", "Proyek Nyata", "Role-Play", "Pomodoro Aktif"],
      detailHref: "../infogayabelajar/kinestetik.html",
    },
  };

  const cfg = configs[gaya] || configs["Visual"];
  const cls = gaya.toLowerCase();

  const resultCard = document.getElementById("resultCard");
  resultCard.className = `result-card ${cls}`;
  resultCard.innerHTML = `
    <div class="rc-icon"><i class="fa-solid ${cfg.icon}"></i></div>
    <p class="rc-label">Gaya Belajar Dominanmu</p>
    <h2 class="rc-title">Gaya Belajar ${gaya}</h2>
    <p class="rc-desc">${cfg.desc}</p>
    <div class="rc-tags">
      ${cfg.tags.map((t) => `<span class="rc-tag">${t}</span>`).join("")}
    </div>
    <a href="${cfg.detailHref}" class="btn-detail">
      Pelajari Lebih Lanjut <i class="fa-solid fa-arrow-right"></i>
    </a>
  `;

  const sbBars = document.getElementById("sbBars");
  sbBars.innerHTML = `
    <div class="sb-row">
      <div class="sb-top">
        <span class="sb-name"><i class="fa-solid fa-eye"></i> Visual</span>
        <span class="sb-val">${vPct}%</span>
      </div>
      <div class="sb-bar"><div class="sb-fill visual-fill" id="sbV" style="width:0%"></div></div>
    </div>
    <div class="sb-row">
      <div class="sb-top">
        <span class="sb-name"><i class="fa-solid fa-headphones"></i> Auditori</span>
        <span class="sb-val">${aPct}%</span>
      </div>
      <div class="sb-bar"><div class="sb-fill auditori-fill" id="sbA" style="width:0%"></div></div>
    </div>
    <div class="sb-row">
      <div class="sb-top">
        <span class="sb-name"><i class="fa-solid fa-hand"></i> Kinestetik</span>
        <span class="sb-val">${kPct}%</span>
      </div>
      <div class="sb-bar"><div class="sb-fill kinestetik-fill" id="sbK" style="width:0%"></div></div>
    </div>
  `;

  show(screenResult);
  window.scrollTo({ top: 0, behavior: "smooth" });

  setTimeout(() => {
    document.getElementById("sbV").style.width = vPct + "%";
    document.getElementById("sbA").style.width = aPct + "%";
    document.getElementById("sbK").style.width = kPct + "%";
  }, 300);
}

// ═══════════════════════════════
// TOPNAV SCROLL
// ═══════════════════════════════
const topnav = document.getElementById("topnav");
window.addEventListener(
  "scroll",
  () => {
    topnav.classList.toggle("scrolled", window.scrollY > 40);
  },
  { passive: true }
);

// ═══════════════════════════════
// MOBILE MENU
// ═══════════════════════════════
const navBurger  = document.getElementById("navBurger");
const mobileMenu = document.getElementById("mobileMenu");

navBurger.addEventListener("click", () =>
  mobileMenu.classList.toggle("open")
);
mobileMenu.querySelectorAll("a").forEach((a) => {
  a.addEventListener("click", () => mobileMenu.classList.remove("open"));
});

// ═══════════════════════════════
// SCROLL REVEAL
// ═══════════════════════════════
const revealEls = document.querySelectorAll(".reveal");
const revealObs = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add("visible"), i * 80);
        revealObs.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.05 }
);
revealEls.forEach((el) => revealObs.observe(el));

// ═══════════════════════════════
// INISIALISASI
// ═══════════════════════════════
checkSudahTes();