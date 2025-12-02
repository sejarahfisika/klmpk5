// Data level: materi + soal
const levels = [
  {
    id: 1,
    name: "Babilonia",
    tag: "Akar Astronomi & Aritmetika",
    description:
      "Mengamati gerak benda langit dan mengembangkan sistem bilangan 60 sebagai dasar satuan sudut & waktu.",
    content:
      "Bangsa Babilonia terkenal dengan catatan astronominya di tablet tanah liat. Mereka menggunakan sistem bilangan 60 (sexagesimal) untuk menghitung sudut dan waktu. Dari sini kemudian lahir pembagian lingkaran menjadi 360°, serta sistem menit dan detik yang masih digunakan dalam fisika dan astronomi saat ini.",
    question:
      "Konsep apa dari sistem bilangan Babilonia yang masih digunakan dalam fisika modern?",
    options: [
      "Pembagian lingkaran menjadi 360° serta menit dan detik",
      "Sistem bilangan biner untuk komputer",
      "Konsep energi mekanik",
      "Teori relativitas ruang-waktu"
    ],
    correctIndex: 0
  },
  {
    id: 2,
    name: "Yunani Kuno",
    tag: "Filsafat Alam & Logika",
    description:
      "Munculnya pemikiran logis tentang gerak, materi, dan gaya, serta awal konsep hidrostatika.",
    content:
      "Di Yunani Kuno, fisika berkembang sebagai bagian dari filsafat alam. Tokoh seperti Aristoteles membahas gerak dan unsur pembentuk materi, sedangkan Archimedes merumuskan hukum daya apung yang menjadi dasar hidrostatika. Walau sebagian teorinya sudah diperbaiki oleh fisika modern, pendekatan logis dan matematis mereka menjadi fondasi penting.",
    question:
      "Pernyataan manakah yang paling tepat menggambarkan kontribusi Archimedes?",
    options: [
      "Menjelaskan gerak planet mengelilingi Matahari",
      "Merumuskan hukum daya apung pada benda yang dicelupkan ke dalam fluida",
      "Menentukan kecepatan cahaya di ruang hampa",
      "Mengembangkan teori kuantum tentang atom"
    ],
    correctIndex: 1
  },
  {
    id: 3,
    name: "Arab / Islam",
    tag: "Optika & Metode Eksperimen",
    description:
      "Mengembangkan optika, pengukuran, dan eksperimen sistematis yang menjadi dasar metode ilmiah.",
    content:
      "Pada era keemasan sains Islam, ilmuwan seperti Ibn al-Haytham (Alhazen) mengkaji sifat cahaya dan penglihatan melalui eksperimen. Karya 'Kitab al-Manazir' menjadi rujukan penting dalam optika dan dianggap sebagai salah satu dasar optika modern. Mereka menekankan pentingnya observasi dan eksperimen terkontrol, yang kemudian dikenal sebagai metode ilmiah.",
    question:
      "Mengapa Ibn al-Haytham sering disebut sebagai 'Bapak Optika Modern'?",
    options: [
      "Karena ia menemukan teori relativitas",
      "Karena ia pertama kali mengukur kecepatan cahaya",
      "Karena ia menjelaskan cahaya dan penglihatan dengan eksperimen sistematis",
      "Karena ia menemukan hukum gravitasi"
    ],
    correctIndex: 2
  },
  {
    id: 4,
    name: "Fisika Modern",
    tag: "Hukum Newton hingga Relativitas",
    description:
      "Fisika menjadi ilmu formal dengan hukum matematis dan eksperimen presisi tinggi.",
    content:
      "Fisika modern berkembang pesat di Eropa melalui tokoh-tokoh seperti Galileo, Newton, Maxwell, dan Einstein. Newton merumuskan hukum gerak dan gravitasi yang menjelaskan interaksi benda-benda di Bumi maupun di angkasa. Einstein kemudian mengembangkan teori relativitas yang mengubah cara pandang kita terhadap ruang dan waktu.",
    question:
      "Manakah contoh penerapan langsung dari Hukum II Newton (F = m · a)?",
    options: [
      "Perubahan arah cahaya saat melewati prisma",
      "Percepatan mobil ketika pedal gas diinjak",
      "Terbentuknya spektrum garis atom hidrogen",
      "Pembelokan cahaya oleh gravitasi bintang"
    ],
    correctIndex: 1
  }
];

// State
// unlockedLevelIndex = index level berikutnya yang boleh dimainkan
// 0..levels.length, dimana nilai == levels.length berarti semua level selesai.
let unlockedLevelIndex = 0;
let currentLevel = null;
let score = 0;

// Storage keys
const PROGRESS_KEY = "journeyOfPhysics_progress";
const SCORE_KEY = "journeyOfPhysics_score";

// DOM elements
const mapGrid = document.getElementById("mapGrid");
const progressFill = document.getElementById("progressFill");
const progressText = document.getElementById("progressText");
const modalOverlay = document.getElementById("modalOverlay");
const modalTitle = document.getElementById("modalTitle");
const modalBadge = document.getElementById("modalBadge");
const modalContent = document.getElementById("modalContent");
const modalQuestion = document.getElementById("modalQuestion");
const optionsContainer = document.getElementById("optionsContainer");
const feedbackText = document.getElementById("feedbackText");
const modalCloseBtn = document.getElementById("modalCloseBtn");
const retryBtn = document.getElementById("retryBtn");
const nextLevelBtn = document.getElementById("nextLevelBtn");
const resetProgressBtn = document.getElementById("resetProgressBtn");
const treasureBanner = document.getElementById("treasureBanner");
const treasureScoreText = document.getElementById("treasureScoreText");
const scoreValue = document.getElementById("scoreValue");
const splash = document.getElementById("splash");
const enterBtn = document.getElementById("enterBtn");
const showResultsBtn = document.getElementById("showResultsBtn");

// Results modal
const resultsOverlay = document.getElementById("resultsOverlay");
const resultsCloseBtn = document.getElementById("resultsCloseBtn");
const resultsCloseBtnBottom = document.getElementById("resultsCloseBtnBottom");
const resultsBody = document.getElementById("resultsBody");
const resultsSummary = document.getElementById("resultsSummary");

// Audio elements
const soundClick = document.getElementById("soundClick");
const soundCorrect = document.getElementById("soundCorrect");
const soundWrong = document.getElementById("soundWrong");
const soundTreasure = document.getElementById("soundTreasure");

function playSound(audioEl) {
  try {
    if (!audioEl) return;
    audioEl.currentTime = 0;
    audioEl.play();
  } catch {
    // jika browser block autoplay, diabaikan
  }
}

// Load state from localStorage
function loadState() {
  const savedProgress = Number(localStorage.getItem(PROGRESS_KEY));
  if (
    !Number.isNaN(savedProgress) &&
    savedProgress >= 0 &&
    savedProgress <= levels.length
  ) {
    unlockedLevelIndex = savedProgress;
  }

  const savedScore = Number(localStorage.getItem(SCORE_KEY));
  if (!Number.isNaN(savedScore) && savedScore >= 0) {
    score = savedScore;
  }
}

function saveProgress() {
  localStorage.setItem(PROGRESS_KEY, String(unlockedLevelIndex));
}

function saveScore() {
  localStorage.setItem(SCORE_KEY, String(score));
}

function updateScoreDisplay() {
  if (scoreValue) {
    scoreValue.textContent = score;
  }
}

// Utility: kategori skor
function getScoreCategory(score) {
  if (score >= 350) return "Expert";
  if (score >= 250) return "Advanced";
  if (score >= 150) return "Intermediate";
  return "Pemula";
}

// Render map cards
function renderMap() {
  mapGrid.innerHTML = "";

  levels.forEach((level, index) => {
    const card = document.createElement("button");
    card.classList.add("level-card");

    const isLocked = index > unlockedLevelIndex;

    if (isLocked) {
      card.classList.add("locked");
      card.setAttribute("disabled", "disabled");
    }

    const titleRow = document.createElement("div");
    titleRow.classList.add("level-title");

    const title = document.createElement("h3");
    title.textContent = level.name;

    const number = document.createElement("span");
    number.classList.add("level-number");
    number.textContent = `Level ${index + 1}`;

    titleRow.appendChild(title);
    titleRow.appendChild(number);

    const desc = document.createElement("p");
    desc.classList.add("level-desc");
    desc.textContent = level.description;

    const meta = document.createElement("div");
    meta.classList.add("level-meta");

    const tag = document.createElement("span");
    tag.classList.add("level-badge");
    tag.textContent = level.tag;

    const status = document.createElement("span");
    if (isLocked) {
      status.classList.add("level-status-locked");
      status.textContent = "Terkunci";
    } else if (index === unlockedLevelIndex) {
      status.textContent = "Siap dimainkan";
    } else {
      status.textContent = "Selesai ✅";
    }

    meta.appendChild(tag);
    meta.appendChild(status);

    card.appendChild(titleRow);
    card.appendChild(desc);
    card.appendChild(meta);

    if (!isLocked) {
      card.addEventListener("click", () => {
        playSound(soundClick);
        openLevel(level);
      });
    }

    mapGrid.appendChild(card);
  });

  updateProgress();
}

// Update progress bar & treasure banner
function updateProgress() {
  const total = levels.length;
  const completedLevels = Math.min(unlockedLevelIndex, total);
  const progressPercent = (completedLevels / total) * 100;

  progressFill.style.width = `${progressPercent}%`;
  progressText.textContent = `${completedLevels} / ${total} level terselesaikan`;

  // Tampilkan banner harta karun kalau semua level selesai
  if (completedLevels === total) {
    treasureBanner.classList.remove("hidden");
    const category = getScoreCategory(score);
    if (treasureScoreText) {
      treasureScoreText.textContent = `Skor akhir: ${score} poin · Kategori: ${category}.`;
    }
  } else {
    treasureBanner.classList.add("hidden");
  }
}

// Open modal for a level
function openLevel(level) {
  currentLevel = level;
  // Reset UI
  feedbackText.textContent = "";
  feedbackText.classList.remove("success", "error");
  nextLevelBtn.disabled = false; // akan dinonaktifkan jika di level terakhir
  resetOptionsState();

  modalTitle.textContent = `Level ${level.id} – ${level.name}`;
  modalBadge.textContent = level.tag;
  modalContent.textContent = level.content;
  modalQuestion.textContent = level.question;

  // Render options
  optionsContainer.innerHTML = "";
  level.options.forEach((opt, index) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.classList.add("option-btn");
    btn.dataset.index = index;

    const prefix = document.createElement("span");
    prefix.classList.add("option-prefix");
    prefix.textContent = String.fromCharCode(65 + index) + ".";

    const text = document.createElement("span");
    text.textContent = opt;

    btn.appendChild(prefix);
    btn.appendChild(text);

    btn.addEventListener("click", () => {
      playSound(soundClick);
      handleAnswer(btn, index);
    });

    optionsContainer.appendChild(btn);
  });

  const currentIndex = levels.findIndex((l) => l.id === level.id);
  const isLastLevel = currentIndex === levels.length - 1;
  nextLevelBtn.disabled = isLastLevel;

  openModal();
}

// Handle answer click
function handleAnswer(btn, selectedIndex) {
  if (!currentLevel) return;

  const allOptionBtns = optionsContainer.querySelectorAll(".option-btn");
  allOptionBtns.forEach((b) => {
    b.classList.remove("correct", "incorrect");
  });

  const isCorrect = selectedIndex === currentLevel.correctIndex;
  const currentIndex = levels.findIndex((l) => l.id === currentLevel.id);
  const isLastLevel = currentIndex === levels.length - 1;

  if (isCorrect) {
    btn.classList.add("correct");
    feedbackText.textContent =
      "Benar! Kamu berhasil menyelesaikan level ini. 🎉";
    feedbackText.classList.remove("error");
    feedbackText.classList.add("success");
    playSound(soundCorrect);

    const isNewClear = unlockedLevelIndex === currentIndex;

    // Tambah skor hanya jika ini pertama kali menuntaskan level tersebut
    if (isNewClear) {
      score += 100;
      saveScore();
      updateScoreDisplay();
    }

    // Buka level berikutnya (atau tandai semua selesai)
    if (unlockedLevelIndex === currentIndex) {
      unlockedLevelIndex = currentIndex + 1; // bisa == levels.length (artinya semua selesai)
      saveProgress();
      renderMap();

      // Jika baru saja menyelesaikan level terakhir → mainkan suara harta karun
      if (unlockedLevelIndex === levels.length) {
        playSound(soundTreasure);
      }
    }

    // Jika level terakhir, tidak ada level berikutnya
    nextLevelBtn.disabled = isLastLevel;
    if (isLastLevel) {
      updateProgress();
    }
  } else {
    btn.classList.add("incorrect");
    feedbackText.textContent = "Belum tepat. Coba baca lagi materinya ya. 😉";
    feedbackText.classList.remove("success");
    feedbackText.classList.add("error");
    nextLevelBtn.disabled = true;
    playSound(soundWrong);
  }
}

// Reset options state
function resetOptionsState() {
  const allOptionBtns = optionsContainer.querySelectorAll(".option-btn");
  allOptionBtns.forEach((b) => {
    b.classList.remove("correct", "incorrect");
  });
}

// Modal helpers
function openModal() {
  modalOverlay.classList.remove("hidden");
  setTimeout(() => {
    modalOverlay.classList.add("active");
  }, 10);
}

function closeModal() {
  modalOverlay.classList.remove("active");
  setTimeout(() => {
    modalOverlay.classList.add("hidden");
  }, 180);
}

// Results modal helpers
function openResultsModal() {
  // Bangun ringkasan
  const total = levels.length;
  const completedLevels = Math.min(unlockedLevelIndex, total);
  const category = getScoreCategory(score);

  if (resultsSummary) {
    resultsSummary.textContent = `Kamu telah menyelesaikan ${completedLevels} dari ${total} level dengan skor total ${score} poin (Kategori: ${category}). Ringkasan ini dapat kamu gunakan sebagai dokumentasi hasil belajar.`;
  }

  if (resultsBody) {
    resultsBody.innerHTML = "";
    levels.forEach((level, index) => {
      const tr = document.createElement("tr");
      const statusDone = index < unlockedLevelIndex;
      const levelScore = statusDone ? 100 : 0;

      tr.innerHTML = `
        <td>${index + 1}</td>
        <td>${level.name}</td>
        <td>${statusDone ? "Selesai" : "Belum"}</td>
        <td>${levelScore}</td>
      `;
      resultsBody.appendChild(tr);
    });
  }

  resultsOverlay.classList.remove("hidden");
  setTimeout(() => {
    resultsOverlay.classList.add("active");
  }, 10);
}

function closeResultsModal() {
  resultsOverlay.classList.remove("active");
  setTimeout(() => {
    resultsOverlay.classList.add("hidden");
  }, 180);
}

// Event listeners
modalCloseBtn.addEventListener("click", () => {
  playSound(soundClick);
  closeModal();
});

modalOverlay.addEventListener("click", (e) => {
  if (e.target === modalOverlay) {
    playSound(soundClick);
    closeModal();
  }
});

retryBtn.addEventListener("click", () => {
  playSound(soundClick);
  feedbackText.textContent = "";
  feedbackText.classList.remove("success", "error");
  const currentIndex = levels.findIndex((l) => l.id === currentLevel?.id);
  const isLastLevel = currentIndex === levels.length - 1;
  nextLevelBtn.disabled = isLastLevel;
  resetOptionsState();
});

nextLevelBtn.addEventListener("click", () => {
  playSound(soundClick);
  if (!currentLevel) return;
  const currentIndex = levels.findIndex((l) => l.id === currentLevel.id);
  const next = levels[currentIndex + 1];
  if (!next) {
    feedbackText.textContent =
      "Selamat! Kamu sudah mencapai akhir perjalanan. Harta karunmu adalah pemahaman sejarah fisika yang kuat. 🏆";
    feedbackText.classList.remove("error");
    feedbackText.classList.add("success");
    nextLevelBtn.disabled = true;
    updateProgress();
    return;
  }
  openLevel(next);
});

// Reset progress & skor
resetProgressBtn.addEventListener("click", () => {
  if (confirm("Yakin ingin mengulang perjalanan dan menghapus skor?")) {
    playSound(soundClick);
    unlockedLevelIndex = 0;
    score = 0;
    saveProgress();
    saveScore();
    updateScoreDisplay();
    renderMap();
  }
});

// Splash logic
if (enterBtn && splash) {
  enterBtn.addEventListener("click", () => {
    playSound(soundClick);
    splash.classList.add("hidden");
  });

  // Optional: auto-hide splash setelah beberapa detik
  setTimeout(() => {
    if (!splash.classList.contains("hidden")) {
      splash.classList.add("hidden");
    }
  }, 6000);
}

// Results modal events
if (showResultsBtn) {
  showResultsBtn.addEventListener("click", () => {
    playSound(soundClick);
    openResultsModal();
  });
}

if (resultsCloseBtn) {
  resultsCloseBtn.addEventListener("click", () => {
    playSound(soundClick);
    closeResultsModal();
  });
}

if (resultsCloseBtnBottom) {
  resultsCloseBtnBottom.addEventListener("click", () => {
    playSound(soundClick);
    closeResultsModal();
  });
}

resultsOverlay.addEventListener("click", (e) => {
  if (e.target === resultsOverlay) {
    playSound(soundClick);
    closeResultsModal();
  }
});

// Init
document.addEventListener("DOMContentLoaded", () => {
  loadState();
  updateScoreDisplay();
  renderMap();
});
