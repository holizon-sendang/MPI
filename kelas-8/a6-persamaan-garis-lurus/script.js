/* A.6 Persamaan Garis Lurus — script.js
   Vanilla JS, tanpa framework.
   localStorage: mpi-a6-visited, mpi-a6-quiz-best, mpi-a6-refleksi. */
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
  try { visited = JSON.parse(read('mpi-a6-visited', '[]')) || []; } catch (e) { visited = []; }
  if (!Array.isArray(visited)) visited = [];
  function saveVisited() { store('mpi-a6-visited', JSON.stringify(visited)); }
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
  var bestStored = read('mpi-a6-quiz-best', null);
  var bestEl = $('quizBestText');
  if (bestStored !== null && bestEl) {
    bestEl.textContent = 'Skor terbaik kuis: ' + bestStored + '/10';
    bestEl.hidden = false;
  }


  /* ---------- Kalkulator gradien + grafik ---------- */
  var gBtn = $('gBtn');
  function renderGrad() {
    var x1 = parseNum($('gX1')), y1 = parseNum($('gY1')), x2 = parseNum($('gX2')), y2 = parseNum($('gY2'));
    var hasil = $('gHasil'), langkah = $('gLangkah');
    if (x1 === null || y1 === null || x2 === null || y2 === null) {
      if (hasil) hasil.textContent = 'Isi keempat koordinat.';
      if (langkah) langkah.textContent = '';
      return;
    }
    if (x1 === x2) {
      if (hasil) hasil.textContent = 'Garis vertikal — gradien tidak terdefinisi';
      if (langkah) langkah.textContent = 'Kedua titik punya x yang sama, jadi garisnya tegak (vertikal). Pembaginya nol, gradien tak terdefinisi.';
      return;
    }
    var m = (y2 - y1) / (x2 - x1);
    if (hasil) hasil.textContent = 'm = ' + (Number.isInteger(m) ? String(m) : m.toFixed(2));
    if (langkah) langkah.textContent = 'm = (y₂ − y₁) : (x₂ − x₁) = (' + y2 + ' − ' + y1 + ') : (' + x2 + ' − ' + x1 + ') = ' + (y2 - y1) + ' : ' + (x2 - x1) + ' = ' + (Number.isInteger(m) ? String(m) : m.toFixed(2)) + '. ' + (m > 0 ? 'Gradien positif: garis naik ke kanan.' : m < 0 ? 'Gradien negatif: garis turun ke kanan.' : 'Gradien nol: garis mendatar.');
    var cv = $('gCanvas');
    if (cv && cv.getContext) {
      var ctx = cv.getContext('2d');
      var W = cv.width, H = cv.height;
      ctx.clearRect(0, 0, W, H);
      var minX = Math.min(x1, x2) - 2, maxX = Math.max(x1, x2) + 2;
      var minY = Math.min(y1, y2) - 2, maxY = Math.max(y1, y2) + 2;
      var sc = Math.min((W - 60) / Math.max(1, maxX - minX), (H - 60) / Math.max(1, maxY - minY));
      function px(x) { return 30 + (x - minX) * sc; }
      function py(y) { return H - 30 - (y - minY) * sc; }
      ctx.strokeStyle = '#DCE6F5'; ctx.lineWidth = 1;
      for (var gx = Math.ceil(minX); gx <= maxX; gx++) { ctx.beginPath(); ctx.moveTo(px(gx), 10); ctx.lineTo(px(gx), H - 10); ctx.stroke(); }
      for (var gy = Math.ceil(minY); gy <= maxY; gy++) { ctx.beginPath(); ctx.moveTo(10, py(gy)); ctx.lineTo(W - 10, py(gy)); ctx.stroke(); }
      ctx.strokeStyle = '#6D28D9'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(px(x1), py(y1)); ctx.lineTo(px(x2), py(y2)); ctx.stroke();
      ctx.fillStyle = '#F59E0B';
      [ [x1, y1], [x2, y2] ].forEach(function (p) { ctx.beginPath(); ctx.arc(px(p[0]), py(p[1]), 6, 0, 2 * Math.PI); ctx.fill(); });
      ctx.fillStyle = '#0F172A'; ctx.font = 'bold 13px sans-serif';
      ctx.fillText('(' + x1 + ', ' + y1 + ')', px(x1) + 10, py(y1) - 8);
      ctx.fillText('(' + x2 + ', ' + y2 + ')', px(x2) + 10, py(y2) - 8);
    }
  }
  if (gBtn) gBtn.addEventListener('click', renderGrad);
  renderGrad();

  /* ---------- Plotter garis y = mx + c ---------- */
  var lpBtn = $('lpBtn');
  function renderPlot() {
    var m = parseNum($('lpM')), c = parseNum($('lpC'));
    var hasil = $('lpHasil');
    if (m === null || c === null) { if (hasil) hasil.textContent = 'Isi gradien m dan konstanta c.'; return; }
    if (hasil) hasil.textContent = 'y = ' + m + 'x + ' + c + ' · Gradien ' + m + ' · Memotong sumbu Y di (0, ' + c + ')';
    var cv = $('lpCanvas');
    if (cv && cv.getContext) {
      var ctx = cv.getContext('2d');
      var W = cv.width, H = cv.height;
      ctx.clearRect(0, 0, W, H);
      var minX = -6, maxX = 6, minY = -8, maxY = 8;
      var scx = (W - 60) / (maxX - minX), scy = (H - 60) / (maxY - minY);
      function px(x) { return 30 + (x - minX) * scx; }
      function py(y) { return H - 30 - (y - minY) * scy; }
      ctx.strokeStyle = '#DCE6F5'; ctx.lineWidth = 1;
      for (var gx = minX; gx <= maxX; gx++) { ctx.beginPath(); ctx.moveTo(px(gx), 10); ctx.lineTo(px(gx), H - 10); ctx.stroke(); }
      for (var gy = minY; gy <= maxY; gy++) { ctx.beginPath(); ctx.moveTo(10, py(gy)); ctx.lineTo(W - 10, py(gy)); ctx.stroke(); }
      ctx.strokeStyle = '#0F172A'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(px(0), 10); ctx.lineTo(px(0), H - 10); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(10, py(0)); ctx.lineTo(W - 10, py(0)); ctx.stroke();
      ctx.strokeStyle = '#6D28D9'; ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(px(minX), py(m * minX + c));
      ctx.lineTo(px(maxX), py(m * maxX + c));
      ctx.stroke();
      ctx.fillStyle = '#F59E0B';
      ctx.beginPath(); ctx.arc(px(0), py(c), 6, 0, 2 * Math.PI); ctx.fill();
      ctx.fillStyle = '#0F172A'; ctx.font = 'bold 13px sans-serif';
      ctx.fillText('(0, ' + c + ')', px(0) + 10, py(c) - 8);
    }
  }
  if (lpBtn) lpBtn.addEventListener('click', renderPlot);
  renderPlot();

  /* ---------- Solver persamaan garis dari dua titik ---------- */
  var leBtn = $('leBtn');
  function renderLineEq() {
    var x1 = parseNum($('leX1')), y1 = parseNum($('leY1')), x2 = parseNum($('leX2')), y2 = parseNum($('leY2'));
    var hasil = $('leHasil'), langkah = $('leLangkah');
    if (x1 === null || y1 === null || x2 === null || y2 === null) {
      if (hasil) hasil.textContent = 'Isi keempat koordinat.';
      if (langkah) langkah.textContent = '';
      return;
    }
    if (x1 === x2) {
      if (hasil) hasil.textContent = 'Garis vertikal: x = ' + x1;
      if (langkah) langkah.textContent = 'Kedua titik punya x yang sama, jadi persamaannya x = ' + x1 + ' (bukan fungsi linear).';
      return;
    }
    var m = (y2 - y1) / (x2 - x1);
    var c = y1 - m * x1;
    var mS = Number.isInteger(m) ? String(m) : m.toFixed(2);
    var cS = Number.isInteger(c) ? String(c) : c.toFixed(2);
    if (hasil) hasil.textContent = 'y = ' + mS + 'x + ' + cS;
    if (langkah) langkah.textContent = 'Langkah 1: m = (' + y2 + ' − ' + y1 + ') : (' + x2 + ' − ' + x1 + ') = ' + mS + '. Langkah 2: pakai titik (' + x1 + ', ' + y1 + '): c = y − mx = ' + y1 + ' − ' + mS + '×' + x1 + ' = ' + cS + '. Jadi y = ' + mS + 'x + ' + cS + '.';
  }
  if (leBtn) leBtn.addEventListener('click', renderLineEq);
  renderLineEq();

  /* ---------- Checker sejajar / tegak lurus ---------- */
  var paBtn = $('paBtn');
  function renderParallel() {
    var m1 = parseNum($('paM1')), m2 = parseNum($('paM2'));
    var fb = $('paFb');
    if (m1 === null || m2 === null) { showFb(fb, false, 'Isi kedua gradien.'); return; }
    if (m1 === m2) showFb(fb, true, 'SEJAJAR! Gradiennya sama (m₁ = m₂ = ' + m1 + '), jadi kedua garis tidak pernah bertemu.');
    else if (Math.abs(m1 * m2 + 1) < 1e-9) showFb(fb, true, 'TEGAK LURUS! m₁ × m₂ = ' + m1 + ' × ' + m2 + ' = −1.');
    else showFb(fb, false, 'Tidak sejajar dan tidak tegak lurus. m₁ = ' + m1 + ', m₂ = ' + m2 + '. Sejajar butuh m₁ = m₂; tegak lurus butuh m₁ × m₂ = −1.');
  }
  if (paBtn) paBtn.addEventListener('click', renderParallel);


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
    "q": "Gradien garis yang melalui (0, 0) dan (2, 4) adalah …",
    "options": [
      "1",
      "2",
      "4",
      "8"
    ],
    "answer": 1,
    "why": "m = (4−0):(2−0) = 2.",
    "check": "(4-0)//(2-0)"
  },
  {
    "q": "Gradien garis y = 3x + 2 adalah …",
    "options": [
      "3",
      "2",
      "−3",
      "5"
    ],
    "answer": 0,
    "why": "Pada y = mx + c, gradiennya koefisien x, yaitu 3."
  },
  {
    "q": "Titik potong garis y = 2x − 5 dengan sumbu Y adalah …",
    "options": [
      "(0, 2)",
      "(0, 5)",
      "(0, −5)",
      "(5, 0)"
    ],
    "answer": 2,
    "why": "Titik potong sumbu Y terjadi saat x = 0: y = −5, jadi (0, −5)."
  },
  {
    "q": "Garis yang sejajar dengan y = 2x + 1 adalah …",
    "options": [
      "y = −2x + 1",
      "y = x + 1",
      "y = −1/2 x",
      "y = 2x − 3"
    ],
    "answer": 3,
    "why": "Sejajar berarti gradien sama: 2. Hanya y = 2x − 3 yang bergradien 2."
  },
  {
    "q": "Garis yang tegak lurus y = 2x + 1 bergradien …",
    "options": [
      "−1/2",
      "2",
      "1/2",
      "−2"
    ],
    "answer": 0,
    "why": "Tegak lurus: m₁ × m₂ = −1, jadi m₂ = −1/2."
  },
  {
    "q": "Persamaan garis bergradien 3 dan melalui (0, 4) adalah …",
    "options": [
      "y = 3x − 4",
      "y = 3x + 4",
      "y = 4x + 3",
      "y = −3x + 4"
    ],
    "answer": 1,
    "why": "y = mx + c dengan m = 3 dan c = 4: y = 3x + 4."
  },
  {
    "q": "Gradien garis 2x + y = 6 adalah …",
    "options": [
      "2",
      "−2",
      "6",
      "−6"
    ],
    "answer": 1,
    "why": "Ubah ke y = −2x + 6, jadi gradiennya −2."
  },
  {
    "q": "Manakah yang merupakan fungsi linear?",
    "options": [
      "y = x²",
      "y = 1/x",
      "y = 4x − 1",
      "y = √x"
    ],
    "answer": 2,
    "why": "Hanya y = 4x − 1 yang berpangkat satu dan grafiknya garis lurus."
  },
  {
    "q": "Apakah titik (2, 7) terletak pada garis y = 3x + 1?",
    "options": [
      "Tidak",
      "Ya, karena 3·2 = 6",
      "Tidak, karena 7 ≠ 5",
      "Ya, karena 3·2 + 1 = 7"
    ],
    "answer": 3,
    "why": "Substitusi x = 2: y = 3·2 + 1 = 7. Cocok, jadi titiknya terletak pada garis."
  },
  {
    "q": "Gradien garis yang melalui (1, 3) dan (5, 11) adalah …",
    "options": [
      "1",
      "3",
      "4",
      "2"
    ],
    "answer": 3,
    "why": "m = (11−3):(5−1) = 8:4 = 2.",
    "check": "(11-3)//(5-1)"
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
    var prevBest = read('mpi-a6-quiz-best', null);
    var prevNum = prevBest === null ? -1 : Number(prevBest);
    if (qScore > prevNum) store('mpi-a6-quiz-best', String(qScore));
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
    try { saved = JSON.parse(read('mpi-a6-refleksi', 'null')); } catch (e) { saved = null; }
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
      store('mpi-a6-refleksi', JSON.stringify(data));
      var st = $('refStatus');
      if (st) st.textContent = 'Refleksi tersimpan di perangkat ini pada ' + new Date().toLocaleString('id-ID') + '.';
      markVisited('sub6');
    });
  }
})();
