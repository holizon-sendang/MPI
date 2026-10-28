/* A.1 Bentuk Aljabar — script.js
   Vanilla JS, tanpa framework. Semua jawaban matematika diperiksa manual.
   localStorage: mpi-a1-visited (sub-bab yang dibuka),
   mpi-a1-quiz-best (skor kuis terbaik), mpi-a1-refleksi (refleksi). */
(function () {
  'use strict';

  /* ---------- Util ---------- */
  function $(id) { return document.getElementById(id); }
  function gcd(a, b) {
    a = Math.abs(a); b = Math.abs(b);
    while (b !== 0) { var t = b; b = a % b; a = t; }
    return a || 1;
  }
  function lcm(a, b) { return Math.abs(a * b) / gcd(a, b); }
  function simplify(n, d) {
    var g = gcd(n, d);
    n = n / g; d = d / g;
    if (d < 0) { n = -n; d = -d; }
    return { n: n, d: d };
  }
  function fracStr(f) { return f.d === 1 ? String(f.n) : f.n + '/' + f.d; }
  function fmtId(n) {
    var s = String(n);
    if (s.indexOf('.') === -1) return Number(s).toLocaleString('id-ID');
    var parts = s.split('.');
    return Number(parts[0]).toLocaleString('id-ID') + ',' + parts[1];
  }
  function fmtNum(n, dec) {
    var r = Math.round(n * Math.pow(10, dec)) / Math.pow(10, dec);
    return fmtId(r);
  }
  function parseNum(el) {
    if (!el) return null;
    if (el.value === '') return null;
    var v = Number(el.value);
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
  function store(key, value) {
    try { localStorage.setItem(key, value); } catch (e) { /* abaikan */ }
  }
  function read(key, fallback) {
    try {
      var v = localStorage.getItem(key);
      return v === null ? fallback : v;
    } catch (e) { return fallback; }
  }

  /* ---------- Progres sub-bab ---------- */
  var SUBS = ['sub1', 'sub2', 'sub3', 'sub4', 'sub5', 'sub6'];
  var visited = [];
  try { visited = JSON.parse(read('mpi-a1-visited', '[]')) || []; } catch (e) { visited = []; }
  if (!Array.isArray(visited)) visited = [];

  function saveVisited() { store('mpi-a1-visited', JSON.stringify(visited)); }
  function renderProgress() {
    var pct = Math.round((visited.length / SUBS.length) * 100);
    var text = $('progressText');
    if (text) text.textContent = 'Progres: ' + visited.length + ' dari 6 sub-bab (' + pct + '%)';
    var fill = $('progressFill');
    if (fill) fill.style.width = pct + '%';
    var bar = $('progressBar');
    if (bar) bar.setAttribute('aria-valuenow', String(pct));
    document.querySelectorAll('[data-sub]').forEach(function (a) {
      var id = a.getAttribute('data-sub');
      a.classList.toggle('done', visited.indexOf(id) !== -1);
    });
  }
  function markVisited(id) {
    if (visited.indexOf(id) === -1) {
      visited.push(id);
      saveVisited();
      renderProgress();
    }
  }
  document.querySelectorAll('[data-sub]').forEach(function (a) {
    a.addEventListener('click', function () { markVisited(a.getAttribute('data-sub')); });
  });
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) markVisited(en.target.id);
      });
    }, { rootMargin: '-20% 0px -60% 0px' });
    SUBS.forEach(function (id) { var s = $(id); if (s) io.observe(s); });
  }
  renderProgress();

  /* Skor terbaik kuis di header */
  var bestStored = read('mpi-a1-quiz-best', null);
  var bestEl = $('quizBestText');
  if (bestStored !== null && bestEl) {
    bestEl.textContent = 'Skor terbaik kuis: ' + bestStored + '/10';
    bestEl.hidden = false;
  }

  /* ---------- Latihan pilih jawaban (model-box) ---------- */
  document.querySelectorAll('.model-box').forEach(function (box) {
    var fb = box.querySelector('.feedback');
    var explain = box.getAttribute('data-explain') || '';
    box.querySelectorAll('.model-opt').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var ok = btn.getAttribute('data-correct') === 'true';
        box.querySelectorAll('.model-opt').forEach(function (b) {
          b.setAttribute('aria-pressed', b === btn ? 'true' : 'false');
          b.classList.remove('btn-primary');
          b.classList.add('btn-ghost');
        });
        btn.classList.remove('btn-ghost');
        btn.classList.add('btn-primary');
        showFb(fb, ok, (ok ? 'Benar! ' : 'Belum tepat. Coba lagi. ') + explain);
      });
    });
  });

  /* ---------- Latihan ber-input jawaban (qa-row) ---------- */
  document.querySelectorAll('.qa-row').forEach(function (row) {
    var btn = row.querySelector('.qa-check');
    var input = row.querySelector('.qa-input');
    var explain = row.querySelector('.qa-explain');
    var fb = row.querySelector('.feedback');
    if (!btn || !input) return;
    btn.addEventListener('click', function () {
      var v = parseNum(input);
      if (v === null) { showFb(fb, false, 'Tulis dulu jawabanmu sebagai bilangan.'); return; }
      var answer = Number(row.getAttribute('data-answer'));
      var tol = Number(row.getAttribute('data-tol') || '0.001');
      var ok = Math.abs(v - answer) <= tol;
      row.classList.toggle('ok', ok);
      row.classList.toggle('no', !ok);
      showFb(fb, ok,
        ok ? 'Benar! Jawabannya ' + fmtId(row.getAttribute('data-answer')) + '.'
           : 'Belum tepat. Coba lagi, perhatikan langkah dan bentuk jawabannya.');
      if (explain) {
        explain.textContent = 'Pembahasan: ' + row.getAttribute('data-explain');
        explain.classList.add('show');
      }
    });
  });


  /* ---------- Sub-bab 1: pengurai bentuk aljabar ---------- */
  var EXPR = {
    '3x + 5': [
      { tampil: '3x', ket: 'Suku pertama: koefisien 3, variabel x' },
      { tampil: '5', ket: 'Suku kedua: konstanta 5 (tidak punya variabel)' }
    ],
    '2a − 7b + 4': [
      { tampil: '2a', ket: 'Suku pertama: koefisien 2, variabel a' },
      { tampil: '−7b', ket: 'Suku kedua: koefisien −7, variabel b' },
      { tampil: '4', ket: 'Suku ketiga: konstanta 4' }
    ],
    '5x² − 3x + 8': [
      { tampil: '5x²', ket: 'Suku pertama: koefisien 5, variabel x berpangkat 2' },
      { tampil: '−3x', ket: 'Suku kedua: koefisien −3, variabel x berpangkat 1' },
      { tampil: '8', ket: 'Suku ketiga: konstanta 8' }
    ],
    '4p + 2q − 9': [
      { tampil: '4p', ket: 'Suku pertama: koefisien 4, variabel p' },
      { tampil: '2q', ket: 'Suku kedua: koefisien 2, variabel q' },
      { tampil: '−9', ket: 'Suku ketiga: konstanta −9' }
    ]
  };
  function renderExpr(key) {
    var chips = $('uraiChips'), list = $('uraiList'), judul = $('uraiJudul');
    if (!chips || !list) return;
    if (judul) judul.textContent = key;
    chips.innerHTML = '';
    list.innerHTML = '';
    EXPR[key].forEach(function (t) {
      var c = document.createElement('span');
      c.className = 'suku-chip';
      c.textContent = t.tampil;
      chips.appendChild(c);
      var li = document.createElement('li');
      li.textContent = t.tampil + ' — ' + t.ket;
      list.appendChild(li);
    });
  }
  document.querySelectorAll('[data-expr]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      document.querySelectorAll('[data-expr]').forEach(function (b) {
        b.classList.remove('btn-primary'); b.classList.add('btn-ghost');
      });
      btn.classList.remove('btn-ghost'); btn.classList.add('btn-primary');
      renderExpr(btn.getAttribute('data-expr'));
    });
  });
  renderExpr('3x + 5');

  /* ---------- Sub-bab 2: kalkulator suku sejenis ---------- */
  var gjBtn = $('gjBtn');
  if (gjBtn) {
    gjBtn.addEventListener('click', function () {
      var k1 = parseNum($('gjK1')), k2 = parseNum($('gjK2'));
      var op = $('gjOp') ? $('gjOp').value : '+';
      var v = $('gjVar') ? $('gjVar').value : 'x';
      var hasil = $('gjHasil'), langkah = $('gjLangkah');
      if (k1 === null || k2 === null) {
        if (hasil) hasil.textContent = 'Isi kedua koefisien dulu.';
        if (langkah) langkah.textContent = '';
        return;
      }
      var k = op === '+' ? k1 + k2 : k1 - k2;
      if (hasil) hasil.textContent = k1 + v + ' ' + (op === '+' ? '+' : '−') + ' ' + k2 + v + ' = ' + k + v;
      if (langkah) langkah.textContent = 'Karena variabelnya sama (' + v + '), cukup jumlahkan koefisiennya: ' + k1 + ' ' + (op === '+' ? '+' : '−') + ' ' + k2 + ' = ' + k + '. Variabelnya tetap ' + v + '.';
    });
  }

  /* ---------- Sub-bab 3: kalkulator kali / bagi bentuk aljabar ---------- */
  var kbBtn = $('kbBtn');
  if (kbBtn) {
    kbBtn.addEventListener('click', function () {
      var k1 = parseNum($('kbK1')), e1 = parseIntNum($('kbE1'));
      var k2 = parseNum($('kbK2')), e2 = parseIntNum($('kbE2'));
      var op = $('kbOp') ? $('kbOp').value : 'x';
      var hasil = $('kbHasil'), langkah = $('kbLangkah');
      if (k1 === null || k2 === null || e1 === null || e2 === null) {
        if (hasil) hasil.textContent = 'Isi koefisien dan pangkat keduanya dulu.';
        if (langkah) langkah.textContent = '';
        return;
      }
      if (op === 'x') {
        var k = k1 * k2, e = e1 + e2;
        if (hasil) hasil.textContent = '(' + k1 + 'x' + e1 + ') × (' + k2 + 'x' + e2 + ') = ' + k + 'x' + e;
        if (langkah) langkah.textContent = 'Kalikan koefisien: ' + k1 + ' × ' + k2 + ' = ' + k + '. Jumlahkan pangkat: ' + e1 + ' + ' + e2 + ' = ' + e + '. Jadi hasilnya ' + k + 'x' + e + '.';
      } else {
        if (k2 === 0) { if (hasil) hasil.textContent = 'Tidak bisa membagi dengan 0.'; if (langkah) langkah.textContent = ''; return; }
        var k3 = k1 / k2, e3 = e1 - e2;
        var kTxt = (k3 % 1 === 0) ? fmtId(k3) : fmtId(k3.toFixed(2));
        if (hasil) hasil.textContent = '(' + k1 + 'x' + e1 + ') ÷ (' + k2 + 'x' + e2 + ') = ' + kTxt + 'x' + e3;
        if (langkah) langkah.textContent = 'Bagi koefisien: ' + k1 + ' ÷ ' + k2 + ' = ' + kTxt + '. Kurangkan pangkat: ' + e1 + ' − ' + e2 + ' = ' + e3 + '. Jadi hasilnya ' + kTxt + 'x' + e3 + '.';
      }
    });
  }

  /* ---------- Sub-bab 4: pembangun model aljabar ---------- */
  var mdBtn = $('mdBtn');
  if (mdBtn) {
    mdBtn.addEventListener('click', function () {
      var a = parseIntNum($('mdA')), b = parseIntNum($('mdB'));
      var hasil = $('mdHasil'), langkah = $('mdLangkah');
      if (a === null || b === null || a < 0 || b < 0) {
        if (hasil) hasil.textContent = 'Isi banyak buku dan pensilnya dulu.';
        if (langkah) langkah.textContent = '';
        return;
      }
      var model = (a === 0 ? '' : a + 'x') + (a > 0 && b > 0 ? ' + ' : '') + (b === 0 ? '' : b + 'y');
      if (model === '') model = '0';
      if (hasil) hasil.textContent = 'Total harga = ' + model;
      if (langkah) langkah.textContent = 'Misalkan harga 1 buku = x rupiah dan harga 1 pensil = y rupiah. ' + a + ' buku harganya ' + a + 'x dan ' + b + ' pensil harganya ' + b + 'y, jadi totalnya ' + model + ' rupiah.';
    });
  }

  /* ---------- Sub-bab 5: kalkulator substitusi ---------- */
  var sbBtn = $('sbBtn');
  if (sbBtn) {
    sbBtn.addEventListener('click', function () {
      var x = parseNum($('sbX'));
      var rumus = $('sbRumus') ? $('sbRumus').value : '2x+3';
      var hasil = $('sbHasil'), langkah = $('sbLangkah');
      if (x === null) {
        if (hasil) hasil.textContent = 'Isi nilai x dulu.';
        if (langkah) langkah.textContent = '';
        return;
      }
      var nilai, ket;
      if (rumus === '2x+3') { nilai = 2 * x + 3; ket = '2 × ' + fmtId(x) + ' + 3 = ' + fmtId(nilai); }
      else if (rumus === '3x-5') { nilai = 3 * x - 5; ket = '3 × ' + fmtId(x) + ' − 5 = ' + fmtId(nilai); }
      else if (rumus === 'x2+2x') { nilai = x * x + 2 * x; ket = fmtId(x) + '² + 2 × ' + fmtId(x) + ' = ' + fmtId(nilai); }
      else { nilai = 10 - x; ket = '10 − ' + fmtId(x) + ' = ' + fmtId(nilai); }
      if (hasil) hasil.textContent = 'Nilai = ' + fmtId(nilai);
      if (langkah) langkah.textContent = 'Ganti setiap x dengan ' + fmtId(x) + ', lalu hitung: ' + ket + '.';
    });
  }


  /* ---------- Sub-bab 6: kuis 10 soal ---------- */
  /* Kunci sudah diperiksa manual (keseimbangan A2/B3/C2/D3):
     1) 7 (idx 1)
     2) 9 (idx 2)
     3) 3 (idx 3)
     4) 8x (idx 1)
     5) 6x + 8 (idx 3)
     6) 13 (idx 0)
     7) 3xy (idx 0)
     8) 3x + 2 (idx 1)
     9) 3x + 2y (idx 2)
     10) 7 (idx 3) */
  var QUIZ = [
  {
    "q": "Pada bentuk aljabar 7x + 3, koefisien dari x adalah …",
    "options": [
      "3",
      "7",
      "x",
      "10"
    ],
    "answer": 1,
    "why": "Koefisien adalah angka di depan variabel. Pada 7x, angka di depan x adalah 7."
  },
  {
    "q": "Pada bentuk aljabar 5a − 2b + 9, konstantanya adalah …",
    "options": [
      "5",
      "−2",
      "9",
      "a"
    ],
    "answer": 2,
    "why": "Konstanta adalah suku yang tidak punya variabel, yaitu 9."
  },
  {
    "q": "Bentuk aljabar 4x² + 3x − 7 mempunyai … suku.",
    "options": [
      "2",
      "4",
      "1",
      "3"
    ],
    "answer": 3,
    "why": "Suku-sukunya adalah 4x², 3x, dan −7 — ada 3 suku."
  },
  {
    "q": "Hasil dari 3x + 5x adalah …",
    "options": [
      "8",
      "8x",
      "15x",
      "8x²"
    ],
    "answer": 1,
    "why": "3x dan 5x sejenis, jadi (3 + 5)x = 8x."
  },
  {
    "q": "Hasil dari 2(3x + 4) adalah …",
    "options": [
      "5x + 6",
      "6x + 4",
      "5x + 8",
      "6x + 8"
    ],
    "answer": 3,
    "why": "Kalikan 2 ke tiap suku di dalam kurung: 2 × 3x = 6x dan 2 × 4 = 8, jadi 6x + 8."
  },
  {
    "q": "Jika x = 5, nilai dari 2x + 3 adalah …",
    "options": [
      "13",
      "16",
      "10",
      "18"
    ],
    "answer": 0,
    "why": "2 × 5 + 3 = 10 + 3 = 13."
  },
  {
    "q": "Manakah yang sejenis dengan 5xy?",
    "options": [
      "3xy",
      "5x",
      "5y",
      "xy²"
    ],
    "answer": 0,
    "why": "Suku sejenis punya variabel dan pangkat yang sama: 3xy dan 5xy sama-sama xy berpangkat 1."
  },
  {
    "q": "Hasil dari (x + 3) + (2x − 1) adalah …",
    "options": [
      "2x + 2",
      "3x + 2",
      "x + 4",
      "3x − 2"
    ],
    "answer": 1,
    "why": "Jumlahkan yang sejenis: x + 2x = 3x dan 3 − 1 = 2, jadi 3x + 2."
  },
  {
    "q": "Harga 1 buku x rupiah dan 1 pensil y rupiah. Model aljabar untuk 3 buku dan 2 pensil adalah …",
    "options": [
      "3x − 2y",
      "5xy",
      "3x + 2y",
      "3x · 2y"
    ],
    "answer": 2,
    "why": "3 buku = 3x dan 2 pensil = 2y, jadi totalnya 3x + 2y."
  },
  {
    "q": "Jika a = 4, nilai dari 3a − 5 adalah …",
    "options": [
      "17",
      "12",
      "1",
      "7"
    ],
    "answer": 3,
    "why": "3 × 4 − 5 = 12 − 5 = 7."
  }
];
  var qi = 0;
  var qScore = 0;
  var qAnswered = false;
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
        btn.addEventListener('click', function () { answerQuiz(idx, btn); });
        box.appendChild(btn);
      });
    }
    var fb = $('quizFb');
    if (fb) { fb.textContent = ''; fb.className = 'feedback'; }
    var next = $('quizNext');
    if (next) {
      next.disabled = true;
      next.textContent = qi === QUIZ.length - 1 ? 'Lihat Hasil →' : 'Soal Berikutnya →';
    }
    qAnswered = false;
  }

  function answerQuiz(idx, btn) {
    if (qAnswered) return;
    qAnswered = true;
    var item = QUIZ[qi];
    var ok = idx === item.answer;
    if (ok) qScore++;
    var live = $('quizScoreLive');
    if (live) live.textContent = 'Skor sementara: ' + qScore;
    var buttons = document.querySelectorAll('#quizOptions .opt-btn');
    buttons.forEach(function (b, i) {
      b.disabled = true;
      if (i === item.answer) b.classList.add('correct');
      else if (i === idx) b.classList.add('wrong');
    });
    showFb($('quizFb'), ok, (ok ? 'Benar! ' : 'Belum tepat. ') + item.why);
    var next = $('quizNext');
    if (next) next.disabled = false;
  }

  function finishQuiz() {
    var box = $('quizBox');
    var res = $('quizResult');
    if (box) box.hidden = true;
    if (res) res.hidden = false;
    var scoreEl = $('quizScore');
    if (scoreEl) scoreEl.textContent = qScore + '/10';
    var ring = $('quizRing');
    if (ring) ring.style.setProperty('--p', (qScore * 10) + '%');
    var msg = $('quizMsg');
    if (msg) {
      msg.textContent = qScore === 10 ? 'Sempurna! Kamu menguasai Bentuk Aljabar.'
        : qScore >= 8 ? 'Hebat! Tinggal sedikit lagi menuju sempurna.'
        : qScore >= 6 ? 'Bagus! Ulangi bagian yang masih salah, lalu coba lagi.'
        : 'Terus berlatih! Buka lagi sub-bab awal, lalu ulangi kuisnya.';
    }
    var prevBest = read('mpi-a1-quiz-best', null);
    var prevNum = prevBest === null ? -1 : Number(prevBest);
    if (qScore > prevNum) store('mpi-a1-quiz-best', String(qScore));
    var bestNow = Math.max(qScore, prevNum);
    var bestLine = $('quizBestLine');
    if (bestLine) bestLine.textContent = 'Skor terbaikmu: ' + bestNow + '/10. Skor ini tersimpan di perangkat ini.';
    if (bestEl) {
      bestEl.textContent = 'Skor terbaik kuis: ' + bestNow + '/10';
      bestEl.hidden = false;
    }
    markVisited('sub6');
  }

  var quizNext = $('quizNext');
  if (quizNext) {
    quizNext.addEventListener('click', function () {
      if (!qAnswered) return;
      if (qi < QUIZ.length - 1) { qi++; renderQuiz(); }
      else finishQuiz();
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
    try { saved = JSON.parse(read('mpi-a1-refleksi', 'null')); } catch (e) { saved = null; }
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
      store('mpi-a1-refleksi', JSON.stringify(data));
      var st = $('refStatus');
      if (st) st.textContent = 'Refleksi tersimpan di perangkat ini pada ' + new Date().toLocaleString('id-ID') + '.';
      markVisited('sub6');
    });
  }
})();
