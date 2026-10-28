/* A.4 Pola Bilangan — script.js
   Vanilla JS, tanpa framework.
   localStorage: mpi-a4-visited, mpi-a4-quiz-best, mpi-a4-refleksi. */
(function () {
  'use strict';
  function $(id) { return document.getElementById(id); }
  function fmt(n) { return (n < 0 ? '−' : '') + Math.abs(n); }
  function fmtSigned(n) { return (n < 0 ? '−' : n > 0 ? '+' : '') + Math.abs(n); }
  function parseNum(el) {
    if (!el) return null;
    var v = el.value === '' ? NaN : Number(el.value);
    return Number.isFinite(v) ? v : null;
  }
  function parseIntNum(el) {
    var v = parseNum(el);
    return v !== null && Number.isInteger(v) ? v : null;
  }
  function showFb(el, ok, msg) {
    if (!el) return;
    el.textContent = msg;
    el.classList.remove('ok', 'no', 'show');
    el.classList.add(ok ? 'ok' : 'no', 'show');
  }
  function store(key, value) { try { localStorage.setItem(key, value); } catch (e) { /* abaikan */ } }
  function read(key, fallback) {
    try { var v = localStorage.getItem(key); return v === null ? fallback : v; } catch (e) { return fallback; }
  }

  /* ---------- Progres sub-bab ---------- */
  var SUBS = ['sub1', 'sub2', 'sub3', 'sub4', 'sub5', 'sub6'];
  var visited = [];
  try { visited = JSON.parse(read('mpi-a4-visited', '[]')) || []; } catch (e) { visited = []; }
  if (!Array.isArray(visited)) visited = [];
  function saveVisited() { store('mpi-a4-visited', JSON.stringify(visited)); }
  function renderProgress() {
    var pct = Math.round((visited.length / SUBS.length) * 100);
    var text = $('progressText');
    if (text) text.textContent = 'Progres: ' + visited.length + ' dari 6 sub-bab (' + pct + '%)';
    var fill = $('progressFill');
    if (fill) fill.style.width = pct + '%';
    var bar = $('progressBar');
    if (bar) bar.setAttribute('aria-valuenow', String(pct));
    document.querySelectorAll('[data-sub]').forEach(function (a) {
      a.classList.toggle('done', visited.indexOf(a.getAttribute('data-sub')) !== -1);
    });
  }
  function markVisited(id) {
    if (visited.indexOf(id) === -1) { visited.push(id); saveVisited(); renderProgress(); }
  }
  document.querySelectorAll('[data-sub]').forEach(function (a) {
    a.addEventListener('click', function () { markVisited(a.getAttribute('data-sub')); });
  });
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) markVisited(en.target.id); });
    }, { rootMargin: '-20% 0px -60% 0px' });
    SUBS.forEach(function (id) { var s = $(id); if (s) io.observe(s); });
  }
  renderProgress();
  var bestStored = read('mpi-a4-quiz-best', null);
  var bestEl = $('quizBestText');
  if (bestStored !== null && bestEl) {
    bestEl.textContent = 'Skor terbaik kuis: ' + bestStored + '/10';
    bestEl.hidden = false;
  }


  /* ---------- Visual pola titik ---------- */
  var pdSel = $('pdSel'), pdN = $('pdN');
  function polaCount(jenis, n) {
    if (jenis === 'segitiga') return n * (n + 1) / 2;
    if (jenis === 'persegi') return n * n;
    if (jenis === 'ppanjang') return n * (n + 1);
    if (jenis === 'ganjil') return 2 * n - 1;
    return n;
  }
  function renderPola() {
    if (!pdSel || !pdN) return;
    var jenis = pdSel.value, n = Number(pdN.value);
    var lbl = $('pdNVal'); if (lbl) lbl.textContent = String(n);
    var total = polaCount(jenis, n);
    var hasil = $('pdHasil');
    if (hasil) hasil.textContent = 'Suku ke-' + n + ' = ' + total + ' titik';
    var ket = $('pdKet');
    if (ket) {
      ket.textContent = jenis === 'segitiga' ? 'Pola segitiga: Un = n(n+1)/2. Suku ke-' + n + ' = ' + n + '×' + (n + 1) + '/2 = ' + total + '.'
        : jenis === 'persegi' ? 'Pola persegi: Un = n². Suku ke-' + n + ' = ' + n + '² = ' + total + '.'
        : jenis === 'ppanjang' ? 'Pola persegi panjang: Un = n(n+1). Suku ke-' + n + ' = ' + n + '×' + (n + 1) + ' = ' + total + '.'
        : 'Bilangan ganjil: Un = 2n−1. Suku ke-' + n + ' = 2×' + n + '−1 = ' + total + '.';
    }
    var dots = $('pdDots');
    if (dots) {
      var html = '';
      var show = Math.min(total, 120);
      for (var i = 0; i < show; i++) html += '<span class="dot"></span>';
      if (total > 120) html += '<span class="muted">… dan ' + (total - 120) + ' titik lagi</span>';
      dots.innerHTML = html;
    }
  }
  if (pdSel) pdSel.addEventListener('change', renderPola);
  if (pdN) pdN.addEventListener('input', renderPola);
  renderPola();

  /* ---------- Kalkulator barisan aritmetika ---------- */
  var arBtn = $('arBtn');
  function renderArit() {
    var a = parseNum($('arA')), b = parseNum($('arB')), n = parseIntNum($('arN'));
    var hasil = $('arHasil'), langkah = $('arLangkah');
    if (a === null || b === null || n === null || n < 1) {
      if (hasil) hasil.textContent = 'Isi suku pertama, beda, dan n (n ≥ 1).';
      if (langkah) langkah.textContent = '';
      return;
    }
    var un = a + (n - 1) * b;
    if (hasil) hasil.textContent = 'U' + n + ' = ' + fmt(un);
    if (langkah) {
      var suku = [];
      for (var i = 1; i <= Math.min(n, 6); i++) suku.push(fmt(a + (i - 1) * b));
      langkah.textContent = 'Un = a + (n−1)b = ' + fmt(a) + ' + (' + n + '−1)×' + fmt(b) + ' = ' + fmt(un) + '. Barisannya: ' + suku.join(', ') + (n > 6 ? ', …' : '') + '.';
    }
  }
  if (arBtn) arBtn.addEventListener('click', renderArit);
  renderArit();

  /* ---------- Kalkulator barisan geometri ---------- */
  var geBtn = $('geBtn');
  function renderGeo() {
    var a = parseNum($('geA')), r = parseNum($('geR')), n = parseIntNum($('geN'));
    var hasil = $('geHasil'), langkah = $('geLangkah');
    if (a === null || r === null || n === null || n < 1 || n > 12) {
      if (hasil) hasil.textContent = 'Isi suku pertama, rasio, dan n (1 sampai 12).';
      if (langkah) langkah.textContent = '';
      return;
    }
    var un = a * Math.pow(r, n - 1);
    if (hasil) hasil.textContent = 'U' + n + ' = ' + fmt(un);
    if (langkah) {
      var suku = [];
      for (var i = 1; i <= Math.min(n, 6); i++) suku.push(fmt(a * Math.pow(r, i - 1)));
      langkah.textContent = 'Un = a·r^(n−1) = ' + fmt(a) + ' × ' + fmt(r) + '^' + (n - 1) + ' = ' + fmt(un) + '. Barisannya: ' + suku.join(', ') + (n > 6 ? ', …' : '') + '.';
    }
  }
  if (geBtn) geBtn.addEventListener('click', renderGeo);
  renderGeo();


  /* ---------- Latihan ber-input jawaban ---------- */
  document.querySelectorAll('.qa-row').forEach(function (row) {
    var btn = row.querySelector('.qa-check');
    var input = row.querySelector('.qa-input');
    var select = row.querySelector('.qa-select');
    var explain = row.querySelector('.qa-explain');
    var fb = row.querySelector('.feedback');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var answer = Number(row.getAttribute('data-answer'));
      var ok, v;
      if (input) {
        v = parseNum(input);
        if (v === null) { showFb(fb, false, 'Tulis dulu jawabanmu sebagai bilangan.'); return; }
        ok = Math.abs(v - answer) < 1e-9;
      } else if (select) {
        if (select.value === '') { showFb(fb, false, 'Pilih dulu jawabanmu.'); return; }
        v = Number(select.value);
        ok = v === answer;
      } else { return; }
      row.classList.toggle('ok', ok);
      row.classList.toggle('no', !ok);
      showFb(fb, ok,
        ok ? 'Benar! Jawabannya ' + (input ? fmt(answer) : select.options[answer + 1].textContent) + '.'
           : 'Belum tepat. Coba lagi, perhatikan langkahnya di pembahasan.');
      if (explain) {
        explain.textContent = 'Pembahasan: ' + row.getAttribute('data-explain');
        explain.classList.add('show');
      }
    });
  });

  /* ---------- Kuis 10 soal ---------- */
  var QUIZ = [
  {
    "q": "Barisan 2, 5, 8, 11, … Suku ke-6 adalah …",
    "options": [
      "14",
      "17",
      "20",
      "23"
    ],
    "answer": 1,
    "why": "a = 2, b = 3. U6 = 2 + 5×3 = 17.",
    "check": "2+5*3"
  },
  {
    "q": "Barisan 1, 4, 9, 16, … Suku ke-6 adalah …",
    "options": [
      "36",
      "25",
      "49",
      "30"
    ],
    "answer": 0,
    "why": "Pola persegi: Un = n². U6 = 36.",
    "check": "6**2"
  },
  {
    "q": "Barisan 3, 6, 12, 24, … Suku ke-6 adalah …",
    "options": [
      "48",
      "24",
      "96",
      "192"
    ],
    "answer": 2,
    "why": "a = 3, r = 2. U6 = 3 × 2^5 = 96.",
    "check": "3*2**5"
  },
  {
    "q": "Pola segitiga 1, 3, 6, 10, … Suku ke-7 adalah …",
    "options": [
      "15",
      "21",
      "25",
      "28"
    ],
    "answer": 3,
    "why": "Un = n(n+1)/2. U7 = 7×8/2 = 28.",
    "check": "7*8//2"
  },
  {
    "q": "Barisan 5, 10, 15, 20, … Suku ke-12 adalah …",
    "options": [
      "50",
      "60",
      "55",
      "65"
    ],
    "answer": 1,
    "why": "a = 5, b = 5. U12 = 5 + 11×5 = 60.",
    "check": "5+11*5"
  },
  {
    "q": "Barisan Fibonacci 1, 1, 2, 3, 5, 8, … Suku berikutnya adalah …",
    "options": [
      "13",
      "11",
      "12",
      "10"
    ],
    "answer": 0,
    "why": "Suku berikutnya = 5 + 8 = 13.",
    "check": "5+8"
  },
  {
    "q": "Barisan 100, 90, 80, … Suku ke-8 adalah …",
    "options": [
      "20",
      "30",
      "40",
      "10"
    ],
    "answer": 1,
    "why": "a = 100, b = −10. U8 = 100 + 7×(−10) = 30.",
    "check": "100+7*(-10)"
  },
  {
    "q": "Barisan 2, 6, 18, … Suku ke-5 adalah …",
    "options": [
      "54",
      "108",
      "162",
      "36"
    ],
    "answer": 2,
    "why": "a = 2, r = 3. U5 = 2 × 3^4 = 162.",
    "check": "2*3**4"
  },
  {
    "q": "Baris pertama bioskop 8 kursi, tiap baris +3 kursi. Baris ke-10 ada … kursi.",
    "options": [
      "32",
      "29",
      "38",
      "35"
    ],
    "answer": 3,
    "why": "U10 = 8 + 9×3 = 35.",
    "check": "8+9*3"
  },
  {
    "q": "Pola persegi panjang 2, 6, 12, 20, … Suku ke-6 adalah …",
    "options": [
      "30",
      "36",
      "40",
      "42"
    ],
    "answer": 3,
    "why": "Un = n(n+1). U6 = 6×7 = 42.",
    "check": "6*7"
  }
];
  var qi = 0, qScore = 0, qAnswered = false;
  var letters = ['A', 'B', 'C', 'D'];
  function renderQuiz() {
    var item = QUIZ[qi];
    var qEl = $('quizQuestion');
    if (qEl) qEl.textContent = (qi + 1) + '. ' + item.q;
    var prog = $('quizProgress');
    if (prog) prog.textContent = 'Soal ' + (qi + 1) + ' dari 10';
    var live = $('quizScoreLive');
    if (live) live.textContent = 'Skor sementara: ' + qScore;
    var box = $('quizOptions');
    if (box) {
      box.innerHTML = '';
      item.options.forEach(function (opt, idx) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'opt-btn';
        btn.innerHTML = '<span class="letter">' + letters[idx] + '</span><span></span>';
        btn.lastChild.textContent = opt;
        btn.addEventListener('click', function () { answerQuiz(idx); });
        box.appendChild(btn);
      });
    }
    var fb = $('quizFb');
    if (fb) { fb.textContent = ''; fb.className = 'feedback'; }
    var next = $('quizNext');
    if (next) { next.disabled = true; next.textContent = qi === QUIZ.length - 1 ? 'Lihat Hasil →' : 'Soal Berikutnya →'; }
    qAnswered = false;
  }
  function answerQuiz(idx) {
    if (qAnswered) return;
    qAnswered = true;
    var item = QUIZ[qi];
    var ok = idx === item.answer;
    if (ok) qScore++;
    var live = $('quizScoreLive');
    if (live) live.textContent = 'Skor sementara: ' + qScore;
    document.querySelectorAll('#quizOptions .opt-btn').forEach(function (b, i) {
      b.disabled = true;
      if (i === item.answer) b.classList.add('correct');
      else if (i === idx) b.classList.add('wrong');
    });
    showFb($('quizFb'), ok, (ok ? 'Benar! ' : 'Belum tepat. ') + item.why);
    var next = $('quizNext');
    if (next) next.disabled = false;
  }
  function finishQuiz() {
    var box = $('quizBox'), res = $('quizResult');
    if (box) box.hidden = true;
    if (res) res.hidden = false;
    var scoreEl = $('quizScore');
    if (scoreEl) scoreEl.textContent = qScore + '/10';
    var ring = $('quizRing');
    if (ring) ring.style.setProperty('--p', (qScore * 10) + '%');
    var msg = $('quizMsg');
    if (msg) {
      msg.textContent = qScore === 10 ? 'Sempurna! Kamu menguasai materi ini.'
        : qScore >= 8 ? 'Hebat! Tinggal sedikit lagi menuju sempurna.'
        : qScore >= 6 ? 'Bagus! Ulangi bagian yang masih salah, lalu coba lagi.'
        : 'Terus berlatih! Buka lagi sub-bab sebelumnya, lalu ulangi kuisnya.';
    }
    var prevBest = read('mpi-a4-quiz-best', null);
    var prevNum = prevBest === null ? -1 : Number(prevBest);
    if (qScore > prevNum) store('mpi-a4-quiz-best', String(qScore));
    var bestNow = Math.max(qScore, prevNum);
    var bestLine = $('quizBestLine');
    if (bestLine) bestLine.textContent = 'Skor terbaikmu: ' + bestNow + '/10. Skor ini tersimpan di perangkat ini.';
    if (bestEl) { bestEl.textContent = 'Skor terbaik kuis: ' + bestNow + '/10'; bestEl.hidden = false; }
    markVisited('sub6');
  }
  var quizNext = $('quizNext');
  if (quizNext) {
    quizNext.addEventListener('click', function () {
      if (!qAnswered) return;
      if (qi < QUIZ.length - 1) { qi++; renderQuiz(); } else finishQuiz();
    });
  }
  var quizRetry = $('quizRetry');
  if (quizRetry) {
    quizRetry.addEventListener('click', function () {
      qi = 0; qScore = 0; qAnswered = false;
      var res = $('quizResult'); if (res) res.hidden = true;
      var box = $('quizBox'); if (box) box.hidden = false;
      renderQuiz();
    });
  }
  renderQuiz();

  /* ---------- Refleksi ---------- */
  function loadRefleksi() {
    var saved = null;
    try { saved = JSON.parse(read('mpi-a4-refleksi', 'null')); } catch (e) { saved = null; }
    if (!saved) return;
    ['refCheck1', 'refCheck2', 'refCheck3'].forEach(function (id, i) {
      var el = $(id);
      if (el && saved.checks) el.checked = !!saved.checks[i];
    });
    if ($('refContoh') && saved.contoh) $('refContoh').value = saved.contoh;
    if ($('refSulit') && saved.sulit) $('refSulit').value = saved.sulit;
  }
  loadRefleksi();
  var refSave = $('refSave');
  if (refSave) {
    refSave.addEventListener('click', function () {
      var data = {
        checks: ['refCheck1', 'refCheck2', 'refCheck3'].map(function (id) {
          var el = $(id); return el ? el.checked : false;
        }),
        contoh: $('refContoh') ? $('refContoh').value : '',
        sulit: $('refSulit') ? $('refSulit').value : ''
      };
      store('mpi-a4-refleksi', JSON.stringify(data));
      var st = $('refStatus');
      if (st) st.textContent = 'Refleksi tersimpan di perangkat ini pada ' + new Date().toLocaleString('id-ID') + '.';
      markVisited('sub6');
    });
  }
})();
