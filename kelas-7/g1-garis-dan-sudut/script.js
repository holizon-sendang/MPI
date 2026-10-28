/* G.1 Garis dan Sudut — script.js
   Vanilla JS, tanpa framework. Semua jawaban matematika diperiksa manual.
   localStorage: mpi-g1-visited (sub-bab yang dibuka),
   mpi-g1-quiz-best (skor kuis terbaik), mpi-g1-refleksi (refleksi). */
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
  try { visited = JSON.parse(read('mpi-g1-visited', '[]')) || []; } catch (e) { visited = []; }
  if (!Array.isArray(visited)) visited = [];

  function saveVisited() { store('mpi-g1-visited', JSON.stringify(visited)); }
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
  var bestStored = read('mpi-g1-quiz-best', null);
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


  /* ---------- Sub-bab 1: penjelajah sudut ---------- */
  function polar(cx, cy, r, deg) {
    var rad = -deg * Math.PI / 180;
    return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
  }
  function drawAngle(svgId, deg) {
    var svg = $(svgId);
    if (!svg) return;
    var cx = 160, cy = 150, r = 100, rArc = 52;
    var p2 = polar(cx, cy, r, deg);
    var a2 = polar(cx, cy, rArc, deg);
    var large = deg > 180 ? 1 : 0;
    var s = '';
    s += '<line x1="' + cx + '" y1="' + cy + '" x2="' + (cx + r) + '" y2="' + cy + '" stroke="#475569" stroke-width="2.5"/>';
    s += '<line x1="' + cx + '" y1="' + cy + '" x2="' + p2[0].toFixed(1) + '" y2="' + p2[1].toFixed(1) + '" stroke="#2563EB" stroke-width="2.5"/>';
    if (deg > 0 && deg < 360) {
      s += '<path d="M ' + (cx + rArc) + ' ' + cy + ' A ' + rArc + ' ' + rArc + ' 0 ' + large + ' 0 ' + a2[0].toFixed(1) + ' ' + a2[1].toFixed(1) + '" fill="none" stroke="#F59E0B" stroke-width="3"/>';
    }
    if (deg === 90) {
      s += '<path d="M ' + (cx + 16) + ' ' + cy + ' L ' + (cx + 16) + ' ' + (cy - 16) + ' L ' + cx + ' ' + (cy - 16) + '" fill="none" stroke="#F59E0B" stroke-width="2.5"/>';
    }
    s += '<circle cx="' + cx + '" cy="' + cy + '" r="4" fill="#0F172A"/>';
    s += '<text x="' + (cx + r + 4) + '" y="' + (cy + 4) + '" font-size="12" font-weight="700" fill="currentColor">0°</text>';
    svg.innerHTML = s;
  }
  function jenisSudut(deg) {
    if (deg === 0) return 'Sudut nol';
    if (deg < 90) return 'Sudut lancip';
    if (deg === 90) return 'Sudut siku-siku';
    if (deg < 180) return 'Sudut tumpul';
    if (deg === 180) return 'Sudut lurus';
    if (deg < 360) return 'Sudut refleks';
    return 'Sudut penuh (satu putaran)';
  }
  var sdRange = $('sdRange');
  function updateSudut() {
    if (!sdRange) return;
    var deg = Number(sdRange.value);
    var lv = $('sdVal');
    if (lv) lv.textContent = deg + '°';
    drawAngle('sdSvg', deg);
    var hasil = $('sdHasil'), langkah = $('sdLangkah');
    if (hasil) hasil.textContent = deg + '° — ' + jenisSudut(deg);
    if (langkah) {
      if (deg === 0) langkah.textContent = '0°: belum ada sudut — kedua sinar berimpit.';
      else if (deg < 90) langkah.textContent = deg + '° lebih kecil dari 90°, jadi sudut lancip — seperti ujung pensil yang runcing.';
      else if (deg === 90) langkah.textContent = 'Tepat 90°: sudut siku-siku, seperti sudut meja dan sudut buku.';
      else if (deg < 180) langkah.textContent = deg + '° lebih besar dari 90° tapi lebih kecil dari 180°, jadi sudut tumpul.';
      else if (deg === 180) langkah.textContent = 'Tepat 180°: sudut lurus, seperti garis lurus yang dibuka penuh.';
      else if (deg < 360) langkah.textContent = deg + '° lebih besar dari 180°, jadi sudut refleks — sudut “besar” yang melengkung ke belakang.';
      else langkah.textContent = '360°: satu putaran penuh, kembali ke posisi awal.';
    }
  }
  if (sdRange) sdRange.addEventListener('input', updateSudut);
  updateSudut();

  /* ---------- Sub-bab 2: kalkulator pelurus & penyiku ---------- */
  var plBtn = $('plBtn');
  if (plBtn) {
    plBtn.addEventListener('click', function () {
      var x = parseNum($('plX'));
      var hasil = $('plHasil'), langkah = $('plLangkah');
      if (x === null || x < 0 || x > 180) {
        if (hasil) hasil.textContent = 'Isi sudut antara 0° dan 180°.';
        if (langkah) langkah.textContent = '';
        return;
      }
      var pelurus = 180 - x, penyiku = 90 - x;
      if (hasil) hasil.textContent = 'Pelurus ' + pelurus + '° · Penyiku ' + (penyiku >= 0 ? penyiku + '°' : 'tidak ada');
      if (langkah) langkah.textContent = 'Pelurus: 180° − ' + x + '° = ' + pelurus + '°. '
        + (penyiku >= 0
          ? 'Penyiku: 90° − ' + x + '° = ' + penyiku + '°. Dua sudut berpenyiku jumlahnya 90°.'
          : 'Penyiku tidak ada karena ' + x + '° sudah lebih dari 90° — sudut penyiku hanya ada untuk sudut lancip.');
    });
  }

  /* ---------- Sub-bab 4: kalkulator sudut garis sejajar ---------- */
  var sjBtn = $('sjBtn');
  if (sjBtn) {
    sjBtn.addEventListener('click', function () {
      var x = parseNum($('sjX'));
      var hasil = $('sjHasil'), langkah = $('sjLangkah'), tabel = $('sjTabel');
      if (x === null || x <= 0 || x >= 180) {
        if (hasil) hasil.textContent = 'Isi sudut ∠1 antara 0° dan 180° (tidak termasuk 0 dan 180).';
        if (langkah) langkah.textContent = '';
        return;
      }
      var y = 180 - x;
      var vals = [x, y, y, x, x, y, y, x];
      if (hasil) hasil.textContent = '∠1 = ∠4 = ∠5 = ∠8 = ' + x + '° · ∠2 = ∠3 = ∠6 = ∠7 = ' + y + '°';
      if (langkah) langkah.textContent = 'Sehadap: ∠5 = ∠1 = ' + x + '°. Bersebrangan dalam: ∠3 = ∠6 = ' + y + '°. Sepihak dalam: ∠3 + ∠5 = ' + y + '° + ' + x + '° = 180° (saling berpelurus).';
      if (tabel) {
        var body = tabel.querySelector('tbody');
        if (body) {
          body.innerHTML = '';
          var nama = ['∠1 (kiri atas)', '∠2 (kanan atas)', '∠3 (kiri bawah)', '∠4 (kanan bawah)', '∠5 (kiri atas)', '∠6 (kanan atas)', '∠7 (kiri bawah)', '∠8 (kanan bawah)'];
          var garis = ['Garis atas', 'Garis atas', 'Garis atas', 'Garis atas', 'Garis bawah', 'Garis bawah', 'Garis bawah', 'Garis bawah'];
          for (var i = 0; i < 8; i++) {
            var tr = document.createElement('tr');
            var td1 = document.createElement('td'); td1.textContent = garis[i] + ' — ' + nama[i];
            var td2 = document.createElement('td'); td2.className = 'num'; td2.textContent = vals[i] + '°';
            tr.appendChild(td1); tr.appendChild(td2);
            body.appendChild(tr);
          }
        }
      }
    });
  }

  /* ---------- Sub-bab 5: permainan tebak sudut ---------- */
  var TEBAK = [35, 50, 80, 110, 145];
  var tebakIdx = 0;
  function renderTebak() {
    var deg = TEBAK[tebakIdx];
    drawAngle('tbSvg', deg);
    var info = $('tbInfo');
    if (info) info.textContent = 'Sudut ke-' + (tebakIdx + 1) + ' dari ' + TEBAK.length + ' — tebak besarnya!';
    var fb = $('tbFb');
    if (fb) { fb.textContent = ''; fb.className = 'feedback'; }
    document.querySelectorAll('[data-est]').forEach(function (b) { b.disabled = false; });
  }
  document.querySelectorAll('[data-est]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var est = Number(btn.getAttribute('data-est'));
      var deg = TEBAK[tebakIdx];
      var ok = Math.abs(est - deg) <= 12;
      var fb = $('tbFb');
      showFb(fb, ok, ok
        ? 'Tepat! Sudut itu ' + deg + '° (' + jenisSudut(deg) + '). Tebakanmu ' + est + '° hanya meleset ' + Math.abs(est - deg) + '°.'
        : 'Belum tepat. Sudut itu sebenarnya ' + deg + '° (' + jenisSudut(deg) + '). Tebakanmu ' + est + '° meleset ' + Math.abs(est - deg) + '°. Perhatikan: ' + (deg < 90 ? 'sudutnya lancip, kurang dari 90°.' : deg === 90 ? 'sudutnya siku-siku.' : deg < 180 ? 'sudutnya tumpul, antara 90° dan 180°.' : 'sudutnya refleks.'));
      document.querySelectorAll('[data-est]').forEach(function (b) { b.disabled = true; });
    });
  });
  var tbNext = $('tbNext');
  if (tbNext) {
    tbNext.addEventListener('click', function () {
      tebakIdx = (tebakIdx + 1) % TEBAK.length;
      renderTebak();
    });
  }
  renderTebak();


  /* ---------- Sub-bab 6: kuis 10 soal ---------- */
  /* Kunci sudah diperiksa manual (keseimbangan A2/B3/C2/D3):
     1) Tumpul (idx 1)
     2) 115° (idx 1)
     3) 55° (idx 3)
     4) 48° (idx 1)
     5) 70° (idx 3)
     6) 180° (idx 0)
     7) 180° (idx 0)
     8) 120° (idx 2)
     9) 50° (idx 2)
     10) 115° (idx 3) */
  var QUIZ = [
  {
    "q": "Sudut sebesar 135° termasuk sudut …",
    "options": [
      "Lancip",
      "Tumpul",
      "Siku-siku",
      "Refleks"
    ],
    "answer": 1,
    "why": "135° lebih besar dari 90° dan lebih kecil dari 180°, jadi sudut tumpul."
  },
  {
    "q": "Pelurus dari sudut 65° adalah …",
    "options": [
      "25°",
      "115°",
      "90°",
      "155°"
    ],
    "answer": 1,
    "why": "Pelurus: 180° − 65° = 115°."
  },
  {
    "q": "Penyiku dari sudut 35° adalah …",
    "options": [
      "145°",
      "125°",
      "65°",
      "55°"
    ],
    "answer": 3,
    "why": "Penyiku: 90° − 35° = 55°."
  },
  {
    "q": "Dua garis berpotongan membentuk sudut 48°. Sudut yang bertolak belakang dengannya adalah …",
    "options": [
      "132°",
      "48°",
      "90°",
      "42°"
    ],
    "answer": 1,
    "why": "Sudut bertolak belakang sama besar, jadi 48°."
  },
  {
    "q": "Dua garis sejajar dipotong transversal. Sudut sehadap dengan sudut 70° adalah …",
    "options": [
      "110°",
      "20°",
      "90°",
      "70°"
    ],
    "answer": 3,
    "why": "Sudut sehadap pada garis sejajar sama besar, jadi 70°."
  },
  {
    "q": "Besar sudut lurus adalah …",
    "options": [
      "180°",
      "90°",
      "360°",
      "45°"
    ],
    "answer": 0,
    "why": "Sudut lurus tepat 180°, seperti garis lurus yang dibuka penuh."
  },
  {
    "q": "Sudut refleks adalah sudut yang lebih besar dari …",
    "options": [
      "180°",
      "90°",
      "270°",
      "360°"
    ],
    "answer": 0,
    "why": "Sudut refleks lebih besar dari 180° dan lebih kecil dari 360°."
  },
  {
    "q": "Dua sudut bersebrangan dalam pada garis sejajar, salah satunya 120°. Sudut yang lain adalah …",
    "options": [
      "60°",
      "30°",
      "120°",
      "90°"
    ],
    "answer": 2,
    "why": "Sudut bersebrangan pada garis sejajar sama besar, jadi 120°."
  },
  {
    "q": "Dua sudut berpenyiku. Jika salah satunya 40°, sudut yang lain adalah …",
    "options": [
      "30°",
      "130°",
      "50°",
      "140°"
    ],
    "answer": 2,
    "why": "Berpenyiku jumlahnya 90°, jadi 90° − 40° = 50°."
  },
  {
    "q": "Dua sudut sepihak dalam pada garis sejajar, salah satunya 65°. Sudut yang lain adalah …",
    "options": [
      "65°",
      "25°",
      "155°",
      "115°"
    ],
    "answer": 3,
    "why": "Sudut sepihak dalam saling berpelurus, jadi 180° − 65° = 115°."
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
      msg.textContent = qScore === 10 ? 'Sempurna! Kamu menguasai Garis dan Sudut.'
        : qScore >= 8 ? 'Hebat! Tinggal sedikit lagi menuju sempurna.'
        : qScore >= 6 ? 'Bagus! Ulangi bagian yang masih salah, lalu coba lagi.'
        : 'Terus berlatih! Buka lagi sub-bab awal, lalu ulangi kuisnya.';
    }
    var prevBest = read('mpi-g1-quiz-best', null);
    var prevNum = prevBest === null ? -1 : Number(prevBest);
    if (qScore > prevNum) store('mpi-g1-quiz-best', String(qScore));
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
    try { saved = JSON.parse(read('mpi-g1-refleksi', 'null')); } catch (e) { saved = null; }
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
      store('mpi-g1-refleksi', JSON.stringify(data));
      var st = $('refStatus');
      if (st) st.textContent = 'Refleksi tersimpan di perangkat ini pada ' + new Date().toLocaleString('id-ID') + '.';
      markVisited('sub6');
    });
  }
})();
