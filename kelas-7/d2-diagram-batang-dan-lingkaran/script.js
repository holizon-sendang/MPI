/* D.2 Diagram Batang dan Lingkaran — script.js
   Vanilla JS, tanpa framework. Semua jawaban matematika diperiksa manual.
   localStorage: mpi-d2-visited (sub-bab yang dibuka),
   mpi-d2-quiz-best (skor kuis terbaik), mpi-d2-refleksi (refleksi). */
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
  try { visited = JSON.parse(read('mpi-d2-visited', '[]')) || []; } catch (e) { visited = []; }
  if (!Array.isArray(visited)) visited = [];

  function saveVisited() { store('mpi-d2-visited', JSON.stringify(visited)); }
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
  var bestStored = read('mpi-d2-quiz-best', null);
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


  /* ---------- Sub-bab 1: pembuat diagram batang ---------- */
  var BAR_LABELS = ['Membaca', 'Olahraga', 'Musik', 'Menonton'];
  var BAR_COLORS = ['#2563EB', '#F59E0B', '#E85D3F', '#6D28D9'];
  function drawBars() {
    var svg = $('barSvg');
    if (!svg) return;
    var vals = BAR_LABELS.map(function (l, i) {
      var el = $('bar' + i);
      var v = el ? parseNum(el) : 0;
      return (v === null || v < 0) ? 0 : v;
    });
    var max = Math.max.apply(null, vals.concat([1]));
    var W = 320, H = 190, base = 160, bw = 48, gap = (W - 4 * bw - 24) / 3;
    var s = '';
    s += '<line x1="12" y1="' + base + '" x2="' + (W - 12) + '" y2="' + base + '" stroke="#9db3c8" stroke-width="1.5"/>';
    vals.forEach(function (v, i) {
      var h = Math.round((v / max) * 120);
      var x = 12 + i * (bw + gap);
      var y = base - h;
      s += '<rect x="' + x + '" y="' + y + '" width="' + bw + '" height="' + h + '" rx="6" fill="' + BAR_COLORS[i] + '"/>';
      s += '<text x="' + (x + bw / 2) + '" y="' + (y - 6) + '" text-anchor="middle" font-size="12" font-weight="800" fill="currentColor">' + v + '</text>';
      s += '<text x="' + (x + bw / 2) + '" y="' + (base + 16) + '" text-anchor="middle" font-size="10.5" font-weight="700" fill="currentColor">' + BAR_LABELS[i] + '</text>';
    });
    svg.innerHTML = s;
    var total = vals.reduce(function (a, b) { return a + b; }, 0);
    var maxV = Math.max.apply(null, vals);
    var idx = vals.indexOf(maxV);
    var hasil = $('barHasil'), langkah = $('barLangkah');
    if (hasil) hasil.textContent = 'Total: ' + total + ' siswa · Terbanyak: ' + BAR_LABELS[idx] + ' (' + maxV + ' siswa)';
    if (langkah) langkah.textContent = 'Batang yang paling tinggi menunjukkan kategori dengan nilai terbesar. Ubah angkanya dan perhatikan batangnya ikut berubah.';
  }
  BAR_LABELS.forEach(function (l, i) {
    var el = $('bar' + i);
    if (el) el.addEventListener('input', drawBars);
  });
  drawBars();

  /* ---------- Sub-bab 3: diagram lingkaran ---------- */
  function polarPie(cx, cy, r, deg) {
    var rad = (deg - 90) * Math.PI / 180;
    return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
  }
  function drawPie() {
    var svg = $('pieSvg');
    if (!svg) return;
    var pct = Number($('pieRange') ? $('pieRange').value : 25);
    var cx = 110, cy = 110, r = 90;
    var ang = pct * 3.6;
    var p1 = polarPie(cx, cy, r, 0);
    var p2 = polarPie(cx, cy, r, ang);
    var large = ang > 180 ? 1 : 0;
    var s = '';
    if (pct <= 0) {
      s += '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="#2563EB"/>';
    } else if (pct >= 100) {
      s += '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="#F59E0B"/>';
    } else {
      s += '<path d="M ' + cx + ' ' + cy + ' L ' + p1[0].toFixed(1) + ' ' + p1[1].toFixed(1) + ' A ' + r + ' ' + r + ' 0 ' + large + ' 1 ' + p2[0].toFixed(1) + ' ' + p2[1].toFixed(1) + ' Z" fill="#F59E0B"/>';
      s += '<path d="M ' + cx + ' ' + cy + ' L ' + p2[0].toFixed(1) + ' ' + p2[1].toFixed(1) + ' A ' + r + ' ' + r + ' 0 ' + (ang > 180 ? 0 : 1) + ' 1 ' + p1[0].toFixed(1) + ' ' + p1[1].toFixed(1) + ' Z" fill="#2563EB"/>';
    }
    s += '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="none" stroke="#fff" stroke-width="2"/>';
    svg.innerHTML = s;
    var lv = $('pieVal');
    if (lv) lv.textContent = pct + '%';
    var legA = $('pieLegA'), legB = $('pieLegB');
    if (legA) legA.textContent = pct + '%';
    if (legB) legB.textContent = (100 - pct) + '%';
    var hasil = $('pieHasil'), langkah = $('pieLangkah');
    if (hasil) hasil.textContent = 'Bagian A: ' + pct + '% = sudut pusat ' + fmtNum(pct * 3.6, 1) + '°';
    if (langkah) langkah.textContent = 'Sudut pusat = persen × 360° = ' + pct + '% × 360° = ' + fmtNum(pct * 3.6, 1) + '°. Sisa ' + (100 - pct) + '% untuk bagian B, sudutnya ' + fmtNum((100 - pct) * 3.6, 1) + '°.';
  }
  var pieRange = $('pieRange');
  if (pieRange) pieRange.addEventListener('input', drawPie);
  drawPie();

  /* ---------- Sub-bab 4: kalkulator sudut pusat ---------- */
  var spBtn = $('spBtn');
  if (spBtn) {
    spBtn.addEventListener('click', function () {
      var mode = $('spMode') ? $('spMode').value : 'sudut';
      var v1 = parseNum($('spV1')), v2 = parseNum($('spV2'));
      var hasil = $('spHasil'), langkah = $('spLangkah');
      if (v1 === null || v1 < 0) {
        if (hasil) hasil.textContent = 'Isi bilangan pertama dengan benar.';
        if (langkah) langkah.textContent = '';
        return;
      }
      if (mode === 'sudut') {
        if (v1 > 100) { if (hasil) hasil.textContent = 'Persen tidak boleh lebih dari 100%.'; if (langkah) langkah.textContent = ''; return; }
        if (hasil) hasil.textContent = 'Sudut pusat = ' + fmtNum(v1 * 3.6, 1) + '°';
        if (langkah) langkah.textContent = 'Sudut pusat = ' + v1 + '% × 360° = ' + fmtNum(v1 * 3.6, 1) + '°.';
      } else {
        if (v2 === null || v2 <= 0) { if (hasil) hasil.textContent = 'Isi jumlah total dengan bilangan positif.'; if (langkah) langkah.textContent = ''; return; }
        var persen = v1 / v2 * 100;
        if (hasil) hasil.textContent = 'Persen = ' + fmtNum(persen, 1) + '% · Sudut pusat = ' + fmtNum(persen * 3.6, 1) + '°';
        if (langkah) langkah.textContent = 'Persen = ' + fmtId(v1) + ' ÷ ' + fmtId(v2) + ' × 100% = ' + fmtNum(persen, 1) + '%. Sudut pusat = ' + fmtNum(persen, 1) + '% × 360° = ' + fmtNum(persen * 3.6, 1) + '°.';
      }
    });
  }


  /* ---------- Sub-bab 6: kuis 10 soal ---------- */
  /* Kunci sudah diperiksa manual (keseimbangan A2/B3/C2/D3):
     1) Membandingkan banyak tiap kategori (idx 1)
     2) Menunjukkan proporsi bagian dari keseluruhan (idx 1)
     3) 90° (idx 3)
     4) Nilai terbesar (idx 1)
     5) 90° (idx 3)
     6) 360° (idx 0)
     7) 20 siswa (idx 0)
     8) Frekuensi (banyaknya) (idx 2)
     9) 180° (idx 2)
     10) 90 (idx 3) */
  var QUIZ = [
  {
    "q": "Diagram batang paling cocok untuk …",
    "options": [
      "Menunjukkan bagian dari keseluruhan",
      "Membandingkan banyak tiap kategori",
      "Menunjukkan perubahan waktu kontinu",
      "Menghitung rata-rata"
    ],
    "answer": 1,
    "why": "Batang memudahkan perbandingan antar kategori lewat tingginya."
  },
  {
    "q": "Diagram lingkaran paling cocok untuk …",
    "options": [
      "Membandingkan tinggi batang",
      "Menunjukkan proporsi bagian dari keseluruhan",
      "Menunjukkan tren waktu",
      "Menghitung modus"
    ],
    "answer": 1,
    "why": "Lingkaran menunjukkan tiap bagian sebagai juring dari keseluruhan 100%."
  },
  {
    "q": "Sebuah bagian sebesar 25% dalam diagram lingkaran. Sudut pusatnya adalah …",
    "options": [
      "45°",
      "180°",
      "60°",
      "90°"
    ],
    "answer": 3,
    "why": "Sudut pusat = 25% × 360° = 90°."
  },
  {
    "q": "Pada diagram batang, batang yang paling tinggi menunjukkan …",
    "options": [
      "Nilai terkecil",
      "Nilai terbesar",
      "Rata-rata",
      "Median"
    ],
    "answer": 1,
    "why": "Tinggi batang sebanding dengan nilainya — batang tertinggi berarti nilai terbesar."
  },
  {
    "q": "Dari 40 siswa, 10 siswa suka musik. Sudut pusat juring musik pada diagram lingkaran adalah …",
    "options": [
      "45°",
      "60°",
      "36°",
      "90°"
    ],
    "answer": 3,
    "why": "Persen = 10 ÷ 40 × 100% = 25%. Sudut pusat = 25% × 360° = 90°."
  },
  {
    "q": "Jumlah seluruh sudut pusat dalam satu diagram lingkaran adalah …",
    "options": [
      "360°",
      "180°",
      "90°",
      "100°"
    ],
    "answer": 0,
    "why": "Satu lingkaran penuh adalah 360°."
  },
  {
    "q": "Jika 40% dari 50 siswa suka membaca, banyak siswa yang suka membaca adalah …",
    "options": [
      "20 siswa",
      "25 siswa",
      "15 siswa",
      "10 siswa"
    ],
    "answer": 0,
    "why": "40% × 50 = 20 siswa."
  },
  {
    "q": "Pada diagram batang, sumbu tegak biasanya menunjukkan …",
    "options": [
      "Kategori",
      "Waktu",
      "Frekuensi (banyaknya)",
      "Judul"
    ],
    "answer": 2,
    "why": "Sumbu tegak menunjukkan nilai atau frekuensi tiap kategori."
  },
  {
    "q": "Sebuah juring sebesar 50% dalam diagram lingkaran. Sudut pusatnya adalah …",
    "options": [
      "90°",
      "100°",
      "180°",
      "270°"
    ],
    "answer": 2,
    "why": "Sudut pusat = 50% × 360° = 180° — setengah lingkaran."
  },
  {
    "q": "Diagram batang penjualan: Januari 20, Februari 30, Maret 40. Total penjualan tiga bulan itu …",
    "options": [
      "80",
      "70",
      "60",
      "90"
    ],
    "answer": 3,
    "why": "Total = 20 + 30 + 40 = 90."
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
      msg.textContent = qScore === 10 ? 'Sempurna! Kamu menguasai Diagram Batang dan Lingkaran.'
        : qScore >= 8 ? 'Hebat! Tinggal sedikit lagi menuju sempurna.'
        : qScore >= 6 ? 'Bagus! Ulangi bagian yang masih salah, lalu coba lagi.'
        : 'Terus berlatih! Buka lagi sub-bab awal, lalu ulangi kuisnya.';
    }
    var prevBest = read('mpi-d2-quiz-best', null);
    var prevNum = prevBest === null ? -1 : Number(prevBest);
    if (qScore > prevNum) store('mpi-d2-quiz-best', String(qScore));
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
    try { saved = JSON.parse(read('mpi-d2-refleksi', 'null')); } catch (e) { saved = null; }
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
      store('mpi-d2-refleksi', JSON.stringify(data));
      var st = $('refStatus');
      if (st) st.textContent = 'Refleksi tersimpan di perangkat ini pada ' + new Date().toLocaleString('id-ID') + '.';
      markVisited('sub6');
    });
  }
})();
