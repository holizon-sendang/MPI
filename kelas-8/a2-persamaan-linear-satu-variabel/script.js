/* A.2 Persamaan Linear Satu Variabel — script.js
   Vanilla JS, tanpa framework.
   localStorage: mpi-a2-visited, mpi-a2-quiz-best, mpi-a2-refleksi. */
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
  try { visited = JSON.parse(read('mpi-a2-visited', '[]')) || []; } catch (e) { visited = []; }
  if (!Array.isArray(visited)) visited = [];
  function saveVisited() { store('mpi-a2-visited', JSON.stringify(visited)); }
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
  var bestStored = read('mpi-a2-quiz-best', null);
  var bestEl = $('quizBestText');
  if (bestStored !== null && bestEl) {
    bestEl.textContent = 'Skor terbaik kuis: ' + bestStored + '/10';
    bestEl.hidden = false;
  }


  /* ---------- Penilai kalimat terbuka ---------- */
  var evBtn = $('evBtn');
  function renderEval() {
    var x = parseNum($('evX'));
    var hasil = $('evHasil');
    if (x === null) { if (hasil) hasil.textContent = 'Isi nilai x dulu.'; return; }
    var kiri = x + 3;
    if (hasil) hasil.textContent = kiri === 7
      ? 'x = ' + x + ' → ' + x + ' + 3 = 7. BENAR! x = ' + x + ' adalah penyelesaian x + 3 = 7.'
      : 'x = ' + x + ' → ' + x + ' + 3 = ' + kiri + ' ≠ 7. Bukan penyelesaian. Coba x = 4.';
  }
  if (evBtn) evBtn.addEventListener('click', renderEval);
  renderEval();

  /* ---------- Solver PLSV langkah demi langkah ---------- */
  var sBtn = $('sBtn');
  function renderSolver() {
    var a = parseNum($('sA')), b = parseNum($('sB')), c = parseNum($('sC'));
    var hasil = $('sHasil'), langkah = $('sLangkah');
    if (a === null || b === null || c === null || a === 0) {
      if (hasil) hasil.textContent = 'Isi a, b, c (a bukan 0).';
      if (langkah) langkah.textContent = '';
      return;
    }
    var x = (c - b) / a;
    if (hasil) hasil.textContent = 'x = ' + (Number.isInteger(x) ? String(x) : x.toFixed(2));
    if (langkah) {
      langkah.textContent = 'Langkah 1: pindahkan ' + fmt(b) + ' ke ruas kanan: ' + fmt(a) + 'x = ' + fmt(c) + ' − (' + fmt(b) + ') = ' + fmt(c - b) + '. Langkah 2: bagi kedua ruas dengan ' + fmt(a) + ': x = ' + fmt(c - b) + ' : ' + fmt(a) + ' = ' + (Number.isInteger(x) ? String(x) : x.toFixed(2)) + '.';
    }
  }
  if (sBtn) sBtn.addEventListener('click', renderSolver);
  renderSolver();

  /* ---------- Timbangan persamaan ---------- */
  var scX = $('scX');
  function renderScale() {
    if (!scX) return;
    var x = Number(scX.value);
    var kiri = 2 * x + 3, kanan = 11;
    var lbl = $('scXVal'); if (lbl) lbl.textContent = String(x);
    var lk = $('scKiri'); if (lk) lk.textContent = '2x + 3 = ' + kiri;
    var rk = $('scKanan'); if (rk) rk.textContent = '11';
    var ket = $('scKet');
    if (ket) {
      ket.textContent = kiri === kanan
        ? 'SEIMBANG! 2x + 3 = 11 saat x = ' + x + '. Jadi penyelesaian 2x + 3 = 11 adalah x = ' + x + '.'
        : kiri < kanan
          ? 'Kiri lebih ringan (' + kiri + ' < 11). Naikkan x supaya seimbang.'
          : 'Kiri lebih berat (' + kiri + ' > 11). Turunkan x supaya seimbang.';
    }
    var pan = $('scPan');
    if (pan) pan.style.transform = 'rotate(' + Math.max(-8, Math.min(8, (kanan - kiri) * 1.2)) + 'deg)';
  }
  if (scX) scX.addEventListener('input', renderScale);
  renderScale();


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
    "q": "Penyelesaian dari 2x + 6 = 14 adalah …",
    "options": [
      "3",
      "4",
      "5",
      "7"
    ],
    "answer": 1,
    "why": "2x = 14 − 6 = 8, jadi x = 4.",
    "check": "(14-6)//2"
  },
  {
    "q": "Penyelesaian dari 5x − 3 = 17 adalah …",
    "options": [
      "4",
      "3",
      "5",
      "20"
    ],
    "answer": 0,
    "why": "5x = 17 + 3 = 20, jadi x = 4.",
    "check": "(17+3)//5"
  },
  {
    "q": "Penyelesaian dari x/3 + 2 = 7 adalah …",
    "options": [
      "9",
      "12",
      "15",
      "21"
    ],
    "answer": 2,
    "why": "x/3 = 7 − 2 = 5, jadi x = 15.",
    "check": "(7-2)*3"
  },
  {
    "q": "Manakah yang merupakan PLSV?",
    "options": [
      "x² + 1 = 5",
      "2x + 3y = 7",
      "x + 5 = 2x",
      "2x − 4 = 10"
    ],
    "answer": 3,
    "why": "2x − 4 = 10 hanya punya satu variabel x berpangkat satu. Yang lain berpangkat dua atau dua variabel."
  },
  {
    "q": "Penyelesaian dari 3(x − 2) = 12 adalah …",
    "options": [
      "6",
      "4",
      "2",
      "10"
    ],
    "answer": 0,
    "why": "x − 2 = 12 : 3 = 4, jadi x = 6.",
    "check": "12//3+2"
  },
  {
    "q": "3 buku dan ongkir Rp2.000 total Rp17.000. Harga 1 buku …",
    "options": [
      "Rp4.000",
      "Rp5.000",
      "Rp6.000",
      "Rp15.000"
    ],
    "answer": 1,
    "why": "3x + 2000 = 17000 → 3x = 15000 → x = 5000.",
    "check": "(17000-2000)//3"
  },
  {
    "q": "Penyelesaian dari 7x = 56 adalah …",
    "options": [
      "6",
      "8",
      "7",
      "9"
    ],
    "answer": 1,
    "why": "x = 56 : 7 = 8.",
    "check": "56//7"
  },
  {
    "q": "Penyelesaian dari x + 8 = 3x − 4 adalah …",
    "options": [
      "4",
      "5",
      "6",
      "8"
    ],
    "answer": 2,
    "why": "8 + 4 = 3x − x → 12 = 2x → x = 6.",
    "check": "(8+4)//2"
  },
  {
    "q": "Penyelesaian dari 2x + 5 = 3x − 1 adalah …",
    "options": [
      "2",
      "4",
      "5",
      "6"
    ],
    "answer": 3,
    "why": "5 + 1 = 3x − 2x → 6 = x.",
    "check": "5+1"
  },
  {
    "q": "Jumlah tiga bilangan berurutan adalah 51. Bilangan yang di tengah adalah …",
    "options": [
      "15",
      "16",
      "18",
      "17"
    ],
    "answer": 3,
    "why": "Misal bilangannya x−1, x, x+1. Jumlahnya 3x = 51, jadi x = 17.",
    "check": "51//3"
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
    var prevBest = read('mpi-a2-quiz-best', null);
    var prevNum = prevBest === null ? -1 : Number(prevBest);
    if (qScore > prevNum) store('mpi-a2-quiz-best', String(qScore));
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
    try { saved = JSON.parse(read('mpi-a2-refleksi', 'null')); } catch (e) { saved = null; }
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
      store('mpi-a2-refleksi', JSON.stringify(data));
      var st = $('refStatus');
      if (st) st.textContent = 'Refleksi tersimpan di perangkat ini pada ' + new Date().toLocaleString('id-ID') + '.';
      markVisited('sub6');
    });
  }
})();
