/* A.3 Pertidaksamaan Linear Satu Variabel — script.js
   Vanilla JS, tanpa framework.
   localStorage: mpi-a3-visited, mpi-a3-quiz-best, mpi-a3-refleksi. */
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
  try { visited = JSON.parse(read('mpi-a3-visited', '[]')) || []; } catch (e) { visited = []; }
  if (!Array.isArray(visited)) visited = [];
  function saveVisited() { store('mpi-a3-visited', JSON.stringify(visited)); }
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
  var bestStored = read('mpi-a3-quiz-best', null);
  var bestEl = $('quizBestText');
  if (bestStored !== null && bestEl) {
    bestEl.textContent = 'Skor terbaik kuis: ' + bestStored + '/10';
    bestEl.hidden = false;
  }


  /* ---------- Garis bilangan pertidaksamaan ---------- */
  var ptBatas = $('ptBatas'), ptTanda = $('ptTanda'), ptUji = $('ptUji');
  function renderPt() {
    if (!ptBatas || !ptTanda || !ptUji) return;
    var b = Number(ptBatas.value), t = ptTanda.value, u = Number(ptUji.value);
    var lbl = $('ptBatasVal'); if (lbl) lbl.textContent = String(b);
    var ulbl = $('ptUjiVal'); if (ulbl) ulbl.textContent = String(u);
    var simbol = { '<': '<', '>': '>', '<=': '≤', '>=': '≥' }[t] || t;
    var himp = $('ptHimp');
    if (himp) himp.textContent = 'Himpunan penyelesaian: x ' + simbol + ' ' + b;
    var ok = t === '<' ? u < b : t === '>' ? u > b : t === '<=' ? u <= b : u >= b;
    var cek = $('ptCek');
    if (cek) cek.textContent = 'Uji x = ' + u + ': ' + u + ' ' + simbol + ' ' + b + ' → ' + (ok ? 'BENAR, ' + u + ' termasuk penyelesaian.' : 'SALAH, ' + u + ' bukan penyelesaian.');
    var dot = $('ptDot');
    if (dot) dot.style.left = Math.max(0, Math.min(100, ((u + 10) / 20) * 100)) + '%';
    var batas = $('ptBatasMark');
    if (batas) batas.style.left = ((b + 10) / 20 * 100) + '%';
  }
  if (ptBatas) ptBatas.addEventListener('input', renderPt);
  if (ptTanda) ptTanda.addEventListener('change', renderPt);
  if (ptUji) ptUji.addEventListener('input', renderPt);
  renderPt();

  /* ---------- Solver PtLSV ---------- */
  var pBtn = $('pBtn');
  function renderPtSolver() {
    var a = parseNum($('pA')), b = parseNum($('pB')), c = parseNum($('pC'));
    var t = $('pTanda') ? $('pTanda').value : '<';
    var hasil = $('pHasil'), langkah = $('pLangkah');
    if (a === null || b === null || c === null || a === 0) {
      if (hasil) hasil.textContent = 'Isi a, b, c (a bukan 0).';
      if (langkah) langkah.textContent = '';
      return;
    }
    var simbol = { '<': '<', '>': '>', '<=': '≤', '>=': '≥' }[t];
    var flip = a < 0;
    var batas = (c - b) / a;
    var t2 = t;
    if (flip) t2 = t === '<' ? '>' : t === '>' ? '<' : t === '<=' ? '>=' : '<=';
    var simbol2 = { '<': '<', '>': '>', '<=': '≤', '>=': '≥' }[t2];
    var bStr = Number.isInteger(batas) ? String(batas) : batas.toFixed(2);
    if (hasil) hasil.textContent = 'x ' + simbol2 + ' ' + bStr;
    if (langkah) {
      langkah.textContent = 'Langkah 1: ' + a + 'x ' + simbol + ' ' + (c - b) + ' (pindahkan ' + fmt(b) + '). Langkah 2: bagi dengan ' + a + '.' + (flip ? ' Karena membagi dengan bilangan negatif, tandanya BERBALIK: ' + simbol + ' menjadi ' + simbol2 + '.' : ' Pembaginya positif, tandanya tetap.') + ' Jadi x ' + simbol2 + ' ' + bStr + '.';
    }
  }
  if (pBtn) pBtn.addEventListener('click', renderPtSolver);
  renderPtSolver();

  /* ---------- Penguji nilai pertidaksamaan ---------- */
  var tBtn = $('tBtn');
  function renderTest() {
    var x = parseNum($('tX'));
    var fb = $('tFb');
    if (x === null) { showFb(fb, false, 'Isi nilai x dulu.'); return; }
    var kiri = 2 * x + 1;
    var ok = kiri < 9;
    showFb(fb, ok, ok
      ? 'x = ' + x + ' memenuhi! 2(' + x + ') + 1 = ' + kiri + ' < 9. Benar, ' + x + ' adalah anggota himpunan penyelesaian.'
      : 'x = ' + x + ' tidak memenuhi. 2(' + x + ') + 1 = ' + kiri + ', sedangkan ' + kiri + ' tidak kurang dari 9.');
  }
  if (tBtn) tBtn.addEventListener('click', renderTest);


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
    "q": "Bilangan bulat terkecil yang memenuhi x > 3 adalah …",
    "options": [
      "4",
      "3",
      "2",
      "5"
    ],
    "answer": 0,
    "why": "x > 3 berarti 4, 5, 6, … Yang terkecil 4."
  },
  {
    "q": "Bilangan bulat terbesar yang memenuhi 2x < 10 adalah …",
    "options": [
      "5",
      "4",
      "6",
      "10"
    ],
    "answer": 1,
    "why": "2x < 10 → x < 5. Bilangan bulat terbesar yang kurang dari 5 adalah 4.",
    "check": "(10//2)-1"
  },
  {
    "q": "Himpunan penyelesaian 3x + 1 ≥ 10 adalah …",
    "options": [
      "x < 3",
      "x ≥ 3",
      "x ≤ 3",
      "x > 3"
    ],
    "answer": 1,
    "why": "3x ≥ 9 → x ≥ 3."
  },
  {
    "q": "Himpunan penyelesaian −2x > 6 adalah …",
    "options": [
      "x > −3",
      "x < 3",
      "x < −3",
      "x > 3"
    ],
    "answer": 2,
    "why": "Bagi dengan −2, tandanya berbalik: x < −3."
  },
  {
    "q": "Himpunan penyelesaian x + 5 ≤ 9 adalah …",
    "options": [
      "x > 4",
      "x ≥ 4",
      "x < 4",
      "x ≤ 4"
    ],
    "answer": 3,
    "why": "x ≤ 9 − 5 = 4."
  },
  {
    "q": "Himpunan penyelesaian x − 4 > 2 adalah …",
    "options": [
      "x > 6",
      "x < 6",
      "x ≥ 6",
      "x ≤ 6"
    ],
    "answer": 0,
    "why": "x > 2 + 4 = 6."
  },
  {
    "q": "Nilai x berikut yang memenuhi 2x − 3 < 5 adalah …",
    "options": [
      "5",
      "3",
      "4",
      "6"
    ],
    "answer": 1,
    "why": "2x < 8 → x < 4. Dari pilihan, hanya 3 yang kurang dari 4."
  },
  {
    "q": "Himpunan penyelesaian 5x ≥ 20 adalah …",
    "options": [
      "x < 4",
      "x > 4",
      "x ≥ 4",
      "x ≤ 4"
    ],
    "answer": 2,
    "why": "x ≥ 20 : 5 = 4."
  },
  {
    "q": "Uang saku Rp20.000, jajan Rp3.000/hari, sisa harus > Rp5.000. Paling banyak jajan … hari.",
    "options": [
      "6",
      "5",
      "3",
      "4"
    ],
    "answer": 3,
    "why": "20.000 − 3.000n > 5.000 → 3.000n < 15.000 → n < 5. Paling banyak 4 hari."
  },
  {
    "q": "Himpunan penyelesaian −x + 7 ≤ 3 adalah …",
    "options": [
      "x ≤ 4",
      "x < 4",
      "x > 4",
      "x ≥ 4"
    ],
    "answer": 3,
    "why": "−x ≤ 3 − 7 = −4. Bagi dengan −1, tanda berbalik: x ≥ 4."
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
    var prevBest = read('mpi-a3-quiz-best', null);
    var prevNum = prevBest === null ? -1 : Number(prevBest);
    if (qScore > prevNum) store('mpi-a3-quiz-best', String(qScore));
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
    try { saved = JSON.parse(read('mpi-a3-refleksi', 'null')); } catch (e) { saved = null; }
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
      store('mpi-a3-refleksi', JSON.stringify(data));
      var st = $('refStatus');
      if (st) st.textContent = 'Refleksi tersimpan di perangkat ini pada ' + new Date().toLocaleString('id-ID') + '.';
      markVisited('sub6');
    });
  }
})();
