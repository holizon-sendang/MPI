/* B.7 Bentuk Baku — script.js
   Vanilla JS, tanpa framework.
   localStorage: mpi-b7-visited, mpi-b7-quiz-best, mpi-b7-refleksi. */
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
  try { visited = JSON.parse(read('mpi-b7-visited', '[]')) || []; } catch (e) { visited = []; }
  if (!Array.isArray(visited)) visited = [];
  function saveVisited() { store('mpi-b7-visited', JSON.stringify(visited)); }
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
  var bestStored = read('mpi-b7-quiz-best', null);
  var bestEl = $('quizBestText');
  if (bestStored !== null && bestEl) {
    bestEl.textContent = 'Skor terbaik kuis: ' + bestStored + '/10';
    bestEl.hidden = false;
  }


  /* ---------- Konverter bentuk baku ---------- */
  var convBtn = $('convBtn');
  function toBaku(x) {
    if (x === 0) return { a: 0, n: 0 };
    var n = Math.floor(Math.log10(Math.abs(x)));
    var a = x / Math.pow(10, n);
    a = Math.round(a * 1000) / 1000;
    return { a: a, n: n };
  }
  function renderConv() {
    var v = parseNum($('convN'));
    var hasil = $('convHasil'), langkah = $('convLangkah');
    if (v === null || v === 0) {
      if (hasil) hasil.textContent = 'Isi bilangan bukan nol.';
      if (langkah) langkah.textContent = '';
      return;
    }
    var b = toBaku(v);
    if (hasil) hasil.textContent = v + ' = ' + b.a + ' × 10^' + b.n;
    if (langkah) {
      langkah.textContent = b.n >= 0
        ? 'Geser koma ' + b.n + ' tempat ke kiri sampai tersisa satu angka di depan koma: ' + b.a + ', lalu kalikan 10^' + b.n + '.'
        : 'Geser koma ' + Math.abs(b.n) + ' tempat ke kanan sampai tersisa satu angka di depan koma: ' + b.a + ', lalu kalikan 10^' + b.n + '.';
    }
  }
  if (convBtn) convBtn.addEventListener('click', renderConv);
  renderConv();

  /* ---------- Explorer 10^n ---------- */
  var zoomRange = $('zoomRange');
  function renderZoom() {
    if (!zoomRange) return;
    var n = Number(zoomRange.value);
    var val = Math.pow(10, n);
    var lbl = $('zoomVal');
    if (lbl) lbl.textContent = '10^' + n;
    var out = $('zoomHasil');
    if (out) out.textContent = '10^' + n + ' = ' + val.toLocaleString('id-ID');
    var ket = $('zoomKet');
    if (ket) {
      ket.textContent = n >= 0
        ? 'Pangkat positif: 10^' + n + ' adalah 1 diikuti ' + n + ' angka nol.'
        : 'Pangkat negatif: 10^' + n + ' adalah 0,000…1 dengan ' + Math.abs(n) + ' tempat desimal.';
    }
  }
  if (zoomRange) zoomRange.addEventListener('input', renderZoom);
  renderZoom();

  /* ---------- Kalkulator operasi bentuk baku ---------- */
  var bakuBtn = $('bakuBtn');
  function renderBakuOp() {
    var a1 = parseNum($('opA1')), n1 = parseIntNum($('opN1'));
    var a2 = parseNum($('opA2')), n2 = parseIntNum($('opN2'));
    var op = $('bakuSel') ? $('bakuSel').value : 'x';
    var hasil = $('bakuHasil'), langkah = $('bakuLangkah');
    if (a1 === null || n1 === null || a2 === null || n2 === null || a2 === 0) {
      if (hasil) hasil.textContent = 'Isi keempat bilangan (a₂ bukan nol).';
      if (langkah) langkah.textContent = '';
      return;
    }
    var a, n;
    if (op === 'x') { a = a1 * a2; n = n1 + n2; } else { a = a1 / a2; n = n1 - n2; }
    var b = toBaku(a * Math.pow(10, n));
    if (hasil) hasil.textContent = '(' + a1 + ' × 10^' + n1 + ') ' + (op === 'x' ? '×' : ':') + ' (' + a2 + ' × 10^' + n2 + ') = ' + b.a + ' × 10^' + b.n;
    if (langkah) {
      langkah.textContent = op === 'x'
        ? 'Kalikan koefisiennya (' + a1 + ' × ' + a2 + ' = ' + (a1 * a2) + ') dan jumlahkan pangkatnya (' + n1 + ' + ' + n2 + ' = ' + (n1 + n2) + ').'
        : 'Bagikan koefisiennya (' + a1 + ' : ' + a2 + ' = ' + (a1 / a2) + ') dan kurangkan pangkatnya (' + n1 + ' − ' + n2 + ' = ' + (n1 - n2) + ').';
    }
  }
  if (bakuBtn) bakuBtn.addEventListener('click', renderBakuOp);
  renderBakuOp();


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
    "q": "300.000 dalam bentuk baku adalah …",
    "options": [
      "3 × 10^4",
      "3 × 10^5",
      "30 × 10^4",
      "3 × 10^6"
    ],
    "answer": 1,
    "why": "300.000 = 3 × 100.000 = 3 × 10^5.",
    "check": "3*10**5"
  },
  {
    "q": "0,0005 dalam bentuk baku adalah …",
    "options": [
      "5 × 10^-4",
      "5 × 10^4",
      "5 × 10^-3",
      "0,5 × 10^-3"
    ],
    "answer": 0,
    "why": "Koma digeser 4 tempat ke kanan: 0,0005 = 5 × 10^-4."
  },
  {
    "q": "2,5 × 10^6 dalam bilangan biasa adalah …",
    "options": [
      "250.000",
      "25.000.000",
      "250.000.000",
      "2.500.000"
    ],
    "answer": 3,
    "why": "2,5 × 10^6 = 2,5 × 1.000.000 = 2.500.000.",
    "check": "int(2.5*10**6)"
  },
  {
    "q": "Bentuk baku dari 45.000.000 adalah …",
    "options": [
      "4,5 × 10^6",
      "45 × 10^6",
      "4,5 × 10^7",
      "4,5 × 10^8"
    ],
    "answer": 2,
    "why": "45.000.000 = 4,5 × 10.000.000 = 4,5 × 10^7."
  },
  {
    "q": "7 × 10^-3 = …",
    "options": [
      "0,007",
      "0,07",
      "0,0007",
      "7,0"
    ],
    "answer": 0,
    "why": "10^-3 = 0,001, jadi 7 × 0,001 = 0,007."
  },
  {
    "q": "(2 × 10^3) × (4 × 10^2) = …",
    "options": [
      "8 × 10^6",
      "8 × 10^5",
      "8 × 10^1",
      "6 × 10^5"
    ],
    "answer": 1,
    "why": "(2×4) × 10^(3+2) = 8 × 10^5."
  },
  {
    "q": "(6 × 10^7) : (2 × 10^4) = …",
    "options": [
      "3 × 10^11",
      "3 × 10^28",
      "3 × 10^2",
      "3 × 10^3"
    ],
    "answer": 3,
    "why": "(6:2) × 10^(7−4) = 3 × 10^3."
  },
  {
    "q": "Jarak Matahari–Bumi ±150.000.000 km. Bentuk bakunya …",
    "options": [
      "1,5 × 10^7",
      "15 × 10^7",
      "1,5 × 10^8",
      "1,5 × 10^9"
    ],
    "answer": 2,
    "why": "150.000.000 = 1,5 × 10^8."
  },
  {
    "q": "Manakah yang merupakan bentuk baku?",
    "options": [
      "12 × 10^3",
      "9,8 × 10^5",
      "0,7 × 10^2",
      "10 × 10^4"
    ],
    "answer": 1,
    "why": "Bentuk baku mensyaratkan 1 ≤ a < 10. Hanya 9,8 yang memenuhi."
  },
  {
    "q": "10^9 sama dengan …",
    "options": [
      "1 juta",
      "10 juta",
      "100 juta",
      "1 miliar"
    ],
    "answer": 3,
    "why": "10^9 = 1.000.000.000 = 1 miliar.",
    "check": "10**9"
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
    var prevBest = read('mpi-b7-quiz-best', null);
    var prevNum = prevBest === null ? -1 : Number(prevBest);
    if (qScore > prevNum) store('mpi-b7-quiz-best', String(qScore));
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
    try { saved = JSON.parse(read('mpi-b7-refleksi', 'null')); } catch (e) { saved = null; }
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
      store('mpi-b7-refleksi', JSON.stringify(data));
      var st = $('refStatus');
      if (st) st.textContent = 'Refleksi tersimpan di perangkat ini pada ' + new Date().toLocaleString('id-ID') + '.';
      markVisited('sub6');
    });
  }
})();
