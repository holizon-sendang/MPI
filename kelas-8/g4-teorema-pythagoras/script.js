/* G.4 Teorema Pythagoras — script.js
   Vanilla JS, tanpa framework.
   localStorage: mpi-g4-visited, mpi-g4-quiz-best, mpi-g4-refleksi. */
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
  try { visited = JSON.parse(read('mpi-g4-visited', '[]')) || []; } catch (e) { visited = []; }
  if (!Array.isArray(visited)) visited = [];
  function saveVisited() { store('mpi-g4-visited', JSON.stringify(visited)); }
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
  var bestStored = read('mpi-g4-quiz-best', null);
  var bestEl = $('quizBestText');
  if (bestStored !== null && bestEl) {
    bestEl.textContent = 'Skor terbaik kuis: ' + bestStored + '/10';
    bestEl.hidden = false;
  }


  /* ---------- Segitiga interaktif (canvas) ---------- */
  var pyA = $('pyA'), pyB = $('pyB');
  function drawTriangle() {
    if (!pyA || !pyB) return;
    var a = Number(pyA.value), b = Number(pyB.value);
    var c = Math.sqrt(a * a + b * b);
    var lblA = $('pyAVal'); if (lblA) lblA.textContent = String(a);
    var lblB = $('pyBVal'); if (lblB) lblB.textContent = String(b);
    var hasil = $('pyHasil');
    if (hasil) hasil.textContent = 'c = √(' + a + '² + ' + b + '²) = √' + (a * a + b * b) + ' = ' + c.toFixed(2);
    var ket = $('pyKet');
    if (ket) ket.textContent = 'Periksa: ' + a + '² + ' + b + '² = ' + (a * a) + ' + ' + (b * b) + ' = ' + (a * a + b * b) + ', dan ' + c.toFixed(2) + '² ≈ ' + (a * a + b * b) + '. Teorema terbukti!';
    var cv = $('pyCanvas');
    if (cv && cv.getContext) {
      var ctx = cv.getContext('2d');
      var W = cv.width, H = cv.height;
      ctx.clearRect(0, 0, W, H);
      var sc = Math.min((W - 90) / b, (H - 80) / a);
      var ox = 60, oy = H - 45;
      var x2 = ox + b * sc, y2 = oy - a * sc;
      ctx.strokeStyle = '#6D28D9'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(x2, oy); ctx.lineTo(x2, y2); ctx.closePath(); ctx.stroke();
      ctx.fillStyle = '#0F172A'; ctx.font = 'bold 15px sans-serif';
      ctx.fillText('b = ' + b, ox + (b * sc) / 2 - 14, oy + 22);
      ctx.fillText('a = ' + a, x2 + 8, oy - (a * sc) / 2);
      ctx.fillText('c = ' + c.toFixed(2), (ox + x2) / 2 + 6, (oy + y2) / 2 - 8);
      ctx.strokeStyle = '#F59E0B'; ctx.lineWidth = 2;
      ctx.strokeRect(x2 - 16, oy - 16, 16, 16);
    }
  }
  if (pyA) pyA.addEventListener('input', drawTriangle);
  if (pyB) pyB.addEventListener('input', drawTriangle);
  drawTriangle();

  /* ---------- Kalkulator sisi segitiga ---------- */
  var sideBtn = $('sideBtn');
  function renderSide() {
    var x = parseNum($('sideX')), y = parseNum($('sideY'));
    var cari = $('sideSel') ? $('sideSel').value : 'c';
    var hasil = $('sideHasil'), langkah = $('sideLangkah');
    if (x === null || y === null || x <= 0 || y <= 0) {
      if (hasil) hasil.textContent = 'Isi dua sisi yang diketahui (bilangan positif).';
      if (langkah) langkah.textContent = '';
      return;
    }
    var r, teks, lang;
    if (cari === 'c') {
      r = Math.sqrt(x * x + y * y);
      teks = 'c = √(' + x + '² + ' + y + '²) = ' + (Number.isInteger(r) ? String(r) : r.toFixed(2));
      lang = 'Sisi miring dicari dengan menjumlahkan kuadrat kedua sisi siku-siku, lalu diakarkan.';
    } else if (cari === 'a') {
      if (y <= x) { if (hasil) hasil.textContent = 'Sisi miring harus lebih panjang dari sisi siku-siku.'; if (langkah) langkah.textContent = ''; return; }
      r = Math.sqrt(y * y - x * x);
      teks = 'a = √(' + y + '² − ' + x + '²) = ' + (Number.isInteger(r) ? String(r) : r.toFixed(2));
      lang = 'Sisi siku-siku dicari dengan mengurangkan kuadrat sisi siku-siku yang diketahui dari kuadrat sisi miring.';
    } else {
      if (y <= x) { if (hasil) hasil.textContent = 'Sisi miring harus lebih panjang dari sisi siku-siku.'; if (langkah) langkah.textContent = ''; return; }
      r = Math.sqrt(y * y - x * x);
      teks = 'b = √(' + y + '² − ' + x + '²) = ' + (Number.isInteger(r) ? String(r) : r.toFixed(2));
      lang = 'Sisi siku-siku dicari dengan mengurangkan kuadrat sisi siku-siku yang diketahui dari kuadrat sisi miring.';
    }
    if (hasil) hasil.textContent = teks;
    if (langkah) langkah.textContent = lang;
  }
  if (sideBtn) sideBtn.addEventListener('click', renderSide);
  renderSide();

  /* ---------- Checker tripel Pythagoras ---------- */
  var trBtn = $('trBtn');
  function renderTripel() {
    var a = parseIntNum($('trA')), b = parseIntNum($('trB')), c = parseIntNum($('trC'));
    var fb = $('trFb');
    if (a === null || b === null || c === null || a <= 0 || b <= 0 || c <= 0) {
      showFb(fb, false, 'Isi tiga bilangan bulat positif.'); return;
    }
    var s = [a, b, c].sort(function (p, q) { return p - q; });
    var ok = s[0] * s[0] + s[1] * s[1] === s[2] * s[2];
    showFb(fb, ok, ok
      ? 'Ya, tripel Pythagoras! ' + s[0] + '² + ' + s[1] + '² = ' + (s[0] * s[0]) + ' + ' + (s[1] * s[1]) + ' = ' + (s[2] * s[2]) + ' = ' + s[2] + '².'
      : 'Bukan tripel Pythagoras. ' + s[0] + '² + ' + s[1] + '² = ' + (s[0] * s[0] + s[1] * s[1]) + ', sedangkan ' + s[2] + '² = ' + (s[2] * s[2]) + '. Tidak sama.');
  }
  if (trBtn) trBtn.addEventListener('click', renderTripel);

  /* ---------- Segitiga siku-siku istimewa ---------- */
  var istBtn = $('istBtn');
  function renderIst() {
    var s = parseNum($('istS'));
    var jenis = $('istSel') ? $('istSel').value : '4545';
    var hasil = $('istHasil'), langkah = $('istLangkah');
    if (s === null || s <= 0) {
      if (hasil) hasil.textContent = 'Isi panjang sisi yang diketahui (positif).';
      if (langkah) langkah.textContent = '';
      return;
    }
    if (jenis === '4545') {
      var mir = s * Math.SQRT2;
      if (hasil) hasil.textContent = 'Kaki lainnya = ' + s + ' · Miring = ' + s + '√2 ≈ ' + mir.toFixed(2);
      if (langkah) langkah.textContent = 'Segitiga 45°–45°–90°: kedua kakinya sama, perbandingan kaki : kaki : miring = 1 : 1 : √2.';
    } else {
      var lain = s * Math.sqrt(3), miring = 2 * s;
      if (hasil) hasil.textContent = 'Sisi di depan 60° = ' + s + '√3 ≈ ' + lain.toFixed(2) + ' · Miring = ' + miring;
      if (langkah) langkah.textContent = 'Segitiga 30°–60°–90°: perbandingan sisi di depan 30° : di depan 60° : miring = 1 : √3 : 2. Sisi terpendek di depan sudut 30°.';
    }
  }
  if (istBtn) istBtn.addEventListener('click', renderIst);
  renderIst();

  /* ---------- Kalkulator jarak dua titik ---------- */
  var jBtn = $('jBtn');
  function renderJarak() {
    var x1 = parseNum($('jX1')), y1 = parseNum($('jY1')), x2 = parseNum($('jX2')), y2 = parseNum($('jY2'));
    var hasil = $('jHasil'), langkah = $('jLangkah');
    if (x1 === null || y1 === null || x2 === null || y2 === null) {
      if (hasil) hasil.textContent = 'Isi keempat koordinat.';
      if (langkah) langkah.textContent = '';
      return;
    }
    var dx = x2 - x1, dy = y2 - y1;
    var d = Math.sqrt(dx * dx + dy * dy);
    if (hasil) hasil.textContent = 'Jarak = ' + (Number.isInteger(d) ? String(d) : d.toFixed(2)) + ' satuan';
    if (langkah) langkah.textContent = 'd = √((' + x2 + '−' + x1 + ')² + (' + y2 + '−' + y1 + ')²) = √(' + (dx * dx) + ' + ' + (dy * dy) + ') = √' + (dx * dx + dy * dy) + '. Selisih x dan y membentuk segitiga siku-siku, jaraknya adalah sisi miringnya.';
    var cv = $('jCanvas');
    if (cv && cv.getContext) {
      var ctx = cv.getContext('2d');
      var W = cv.width, H = cv.height;
      ctx.clearRect(0, 0, W, H);
      var minX = Math.min(x1, x2) - 1, maxX = Math.max(x1, x2) + 1;
      var minY = Math.min(y1, y2) - 1, maxY = Math.max(y1, y2) + 1;
      var sx = (W - 60) / Math.max(1, maxX - minX), sy = (H - 60) / Math.max(1, maxY - minY);
      var sc = Math.min(sx, sy);
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
  if (jBtn) jBtn.addEventListener('click', renderJarak);
  renderJarak();


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
    "q": "Sisi miring segitiga siku-siku dengan sisi 3 dan 4 adalah …",
    "options": [
      "5",
      "7",
      "6",
      "25"
    ],
    "answer": 0,
    "why": "c = √(3² + 4²) = √25 = 5.",
    "check": "int((3**2+4**2)**0.5)"
  },
  {
    "q": "Sisi miring segitiga siku-siku dengan sisi 6 dan 8 adalah …",
    "options": [
      "12",
      "10",
      "14",
      "48"
    ],
    "answer": 1,
    "why": "c = √(6² + 8²) = √100 = 10.",
    "check": "int((6**2+8**2)**0.5)"
  },
  {
    "q": "Manakah yang merupakan tripel Pythagoras?",
    "options": [
      "4, 5, 6",
      "5, 6, 7",
      "3, 4, 5",
      "2, 3, 4"
    ],
    "answer": 2,
    "why": "3² + 4² = 9 + 16 = 25 = 5²."
  },
  {
    "q": "Sisi miring 13, satu sisi siku-siku 5. Sisi siku-siku lainnya …",
    "options": [
      "8",
      "10",
      "7",
      "12"
    ],
    "answer": 3,
    "why": "a = √(13² − 5²) = √(169 − 25) = √144 = 12.",
    "check": "int((13**2-5**2)**0.5)"
  },
  {
    "q": "Segitiga 30°–60°–90° dengan sisi terpendek 4. Sisi miringnya …",
    "options": [
      "4",
      "8",
      "6",
      "2"
    ],
    "answer": 1,
    "why": "Sisi miring = 2 × sisi terpendek = 2 × 4 = 8."
  },
  {
    "q": "Segitiga 45°–45°–90° dengan kaki 7. Sisi miringnya …",
    "options": [
      "7√2",
      "7",
      "14",
      "√2"
    ],
    "answer": 0,
    "why": "Perbandingan 1 : 1 : √2, jadi miringnya 7√2."
  },
  {
    "q": "Jarak titik (0, 0) ke (6, 8) adalah …",
    "options": [
      "14",
      "48",
      "6",
      "10"
    ],
    "answer": 3,
    "why": "d = √(6² + 8²) = √100 = 10.",
    "check": "int((6**2+8**2)**0.5)"
  },
  {
    "q": "Jarak titik (1, 2) ke (4, 6) adalah …",
    "options": [
      "3",
      "4",
      "5",
      "7"
    ],
    "answer": 2,
    "why": "d = √(3² + 4²) = √25 = 5.",
    "check": "int((3**2+4**2)**0.5)"
  },
  {
    "q": "Tangga 5 m bersandar pada tembok, kaki tangga 3 m dari tembok. Tinggi yang dicapai tangga … m.",
    "options": [
      "3",
      "4",
      "2",
      "5"
    ],
    "answer": 1,
    "why": "Tinggi = √(5² − 3²) = √16 = 4 m.",
    "check": "int((5**2-3**2)**0.5)"
  },
  {
    "q": "Manakah yang BUKAN tripel Pythagoras?",
    "options": [
      "9, 12, 15",
      "8, 15, 17",
      "7, 24, 25",
      "6, 7, 10"
    ],
    "answer": 3,
    "why": "6² + 7² = 36 + 49 = 85, sedangkan 10² = 100. Tidak sama."
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
    var prevBest = read('mpi-g4-quiz-best', null);
    var prevNum = prevBest === null ? -1 : Number(prevBest);
    if (qScore > prevNum) store('mpi-g4-quiz-best', String(qScore));
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
    try { saved = JSON.parse(read('mpi-g4-refleksi', 'null')); } catch (e) { saved = null; }
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
      store('mpi-g4-refleksi', JSON.stringify(data));
      var st = $('refStatus');
      if (st) st.textContent = 'Refleksi tersimpan di perangkat ini pada ' + new Date().toLocaleString('id-ID') + '.';
      markVisited('sub6');
    });
  }
})();
