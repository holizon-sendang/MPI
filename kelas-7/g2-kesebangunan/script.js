/* G.2 Kesebangunan — script.js
   Vanilla JS, tanpa framework. Semua jawaban matematika diperiksa manual.
   localStorage: mpi-g2-visited (sub-bab yang dibuka),
   mpi-g2-quiz-best (skor kuis terbaik), mpi-g2-refleksi (refleksi). */
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
  try { visited = JSON.parse(read('mpi-g2-visited', '[]')) || []; } catch (e) { visited = []; }
  if (!Array.isArray(visited)) visited = [];

  function saveVisited() { store('mpi-g2-visited', JSON.stringify(visited)); }
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
  var bestStored = read('mpi-g2-quiz-best', null);
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


  /* ---------- Sub-bab 1: slider skala persegi panjang ---------- */
  var skRange = $('skRange');
  function updateSkalaBangun() {
    if (!skRange) return;
    var k = Number(skRange.value);
    var kv = $('skVal');
    if (kv) kv.textContent = '×' + k;
    var svg = $('skSvg');
    if (svg) {
      var w2 = 60 * k, h2 = 40 * k;
      var s = '';
      s += '<rect x="20" y="30" width="60" height="40" fill="#DBEAFE" stroke="#2563EB" stroke-width="2"/>';
      s += '<text x="50" y="92" text-anchor="middle" font-size="11" font-weight="700" fill="currentColor">Asli: 6 cm × 4 cm</text>';
      s += '<rect x="180" y="' + (110 - h2) + '" width="' + w2 + '" height="' + h2 + '" fill="#FEF3C7" stroke="#F59E0B" stroke-width="2"/>';
      s += '<text x="' + (180 + w2 / 2) + '" y="132" text-anchor="middle" font-size="11" font-weight="700" fill="currentColor">Hasil: ' + fmtNum(6 * k, 1) + ' cm × ' + fmtNum(4 * k, 1) + ' cm</text>';
      svg.innerHTML = s;
    }
    var hasil = $('skHasil'), langkah = $('skLangkah');
    if (hasil) hasil.textContent = 'Perbandingan sisi = 1 : ' + k + ' — tetap sebangun';
    if (langkah) langkah.textContent = 'Semua sisi dikali ' + k + ': 6 × ' + k + ' = ' + fmtNum(6 * k, 1) + ' cm dan 4 × ' + k + ' = ' + fmtNum(4 * k, 1) + ' cm. Sudut-sudutnya tetap 90°, jadi bangunnya sebangun.';
  }
  if (skRange) skRange.addEventListener('input', updateSkalaBangun);
  updateSkalaBangun();

  /* ---------- Sub-bab 3/4: kalkulator sisi segitiga sebangun ---------- */
  var sgBtn = $('sgBtn');
  if (sgBtn) {
    sgBtn.addEventListener('click', function () {
      var a = parseNum($('sgA')), ap = parseNum($('sgAp')), b = parseNum($('sgB'));
      var hasil = $('sgHasil'), langkah = $('sgLangkah');
      if (a === null || ap === null || b === null || a <= 0 || ap <= 0 || b <= 0) {
        if (hasil) hasil.textContent = 'Isi ketiga panjang sisi dengan bilangan positif.';
        if (langkah) langkah.textContent = '';
        return;
      }
      var skala = ap / a;
      var bp = b * skala;
      if (hasil) hasil.textContent = "Sisi yang dicari = " + fmtNum(bp, 2) + ' cm';
      if (langkah) langkah.textContent = 'Skala perbandingan = ' + fmtId(ap) + ' ÷ ' + fmtId(a) + ' = ' + fmtNum(skala, 2) + '. Sisi bersesuaian = ' + fmtId(b) + ' × ' + fmtNum(skala, 2) + ' = ' + fmtNum(bp, 2) + ' cm.';
    });
  }

  /* ---------- Sub-bab 5: kalkulator tinggi dari bayangan ---------- */
  var byBtn = $('byBtn');
  if (byBtn) {
    byBtn.addEventListener('click', function () {
      var t = parseNum($('byT')), b = parseNum($('byB')), bp = parseNum($('byBp'));
      var hasil = $('byHasil'), langkah = $('byLangkah');
      if (t === null || b === null || bp === null || t <= 0 || b <= 0 || bp <= 0) {
        if (hasil) hasil.textContent = 'Isi ketiga ukuran dengan bilangan positif.';
        if (langkah) langkah.textContent = '';
        return;
      }
      var tinggi = t * bp / b;
      if (hasil) hasil.textContent = 'Tinggi pohon = ' + fmtNum(tinggi, 2) + ' m';
      if (langkah) langkah.textContent = 'Segitiga tongkat dan segitiga pohon sebangun (sinar matahari sejajar). Perbandingan tinggi : bayangan = ' + fmtId(t) + ' : ' + fmtId(b) + ', jadi tinggi pohon = ' + fmtId(t) + ' × ' + fmtId(bp) + ' ÷ ' + fmtId(b) + ' = ' + fmtNum(tinggi, 2) + ' m.';
    });
  }


  /* ---------- Sub-bab 6: kuis 10 soal ---------- */
  /* Kunci sudah diperiksa manual (keseimbangan A2/B3/C2/D3):
     1) 2 : 3 (idx 1)
     2) 10 cm (idx 1)
     3) Sudut sama dan sisi bersesuaian sebanding (idx 3)
     4) 8 cm (idx 1)
     5) 21 cm (idx 3)
     6) Tidak (idx 0)
     7) Sama besar (idx 0)
     8) 4 m (idx 2)
     9) 10 cm (idx 2)
     10) 2 : 5 (idx 3) */
  var QUIZ = [
  {
    "q": "Dua persegi panjang sebangun dengan sisi bersesuaian 4 cm dan 6 cm. Perbandingan paling sederhana kedua sisi itu …",
    "options": [
      "4 : 6",
      "2 : 3",
      "3 : 2",
      "6 : 4"
    ],
    "answer": 1,
    "why": "FPB dari 4 dan 6 adalah 2, jadi 4 : 6 = 2 : 3."
  },
  {
    "q": "Segitiga ABC sebangun dengan DEF. AB = 3 cm bersesuaian dengan DE = 6 cm. Jika BC = 5 cm, EF = …",
    "options": [
      "2,5 cm",
      "10 cm",
      "8 cm",
      "15 cm"
    ],
    "answer": 1,
    "why": "Skala = 6 ÷ 3 = 2, jadi EF = 5 × 2 = 10 cm."
  },
  {
    "q": "Syarat dua bangun sebangun yang BENAR adalah …",
    "options": [
      "Sudut-sudut sama, sisi tidak perlu sebanding",
      "Sisi sebanding, sudut boleh beda",
      "Bentuk dan ukuran sama persis",
      "Sudut sama dan sisi bersesuaian sebanding"
    ],
    "answer": 3,
    "why": "Dua syarat sebangun: sudut-sudut yang bersesuaian sama besar DAN sisi-sisi yang bersesuaian sebanding."
  },
  {
    "q": "Sebuah foto 3 cm × 4 cm diperbesar menjadi 6 cm × … cm agar tetap sebangun.",
    "options": [
      "6 cm",
      "8 cm",
      "9 cm",
      "12 cm"
    ],
    "answer": 1,
    "why": "Skala = 6 ÷ 3 = 2, jadi sisi lain = 4 × 2 = 8 cm."
  },
  {
    "q": "Dua segitiga sebangun dengan skala 1 : 3. Sebuah sisi segitiga kecil 7 cm. Sisi bersesuaiannya …",
    "options": [
      "3 cm",
      "10 cm",
      "4 cm",
      "21 cm"
    ],
    "answer": 3,
    "why": "Sisi besar = 7 × 3 = 21 cm."
  },
  {
    "q": "Apakah sebuah persegi dan sebuah persegi panjang sebangun?",
    "options": [
      "Tidak",
      "Ya, selalu",
      "Ya, jika ukurannya sama",
      "Tidak tahu"
    ],
    "answer": 0,
    "why": "Persegi punya semua sisi sama, persegi panjang belum tentu. Sudutnya sama (90°) tapi sisinya belum tentu sebanding."
  },
  {
    "q": "Sudut-sudut pada dua bangun yang sebangun adalah …",
    "options": [
      "Sama besar",
      "Berbanding lurus dengan ukuran",
      "Selalu 90°",
      "Berubah mengikuti ukuran"
    ],
    "answer": 0,
    "why": "Sudut tidak ikut membesar saat bangun diperbesar — sudut yang bersesuaian selalu sama besar."
  },
  {
    "q": "Sebuah tongkat 2 m mempunyai bayangan 3 m. Pada saat yang sama, bayangan sebuah pohon 6 m. Tinggi pohon itu …",
    "options": [
      "3 m",
      "5 m",
      "4 m",
      "6 m"
    ],
    "answer": 2,
    "why": "Tinggi pohon = 2 × 6 ÷ 3 = 4 m."
  },
  {
    "q": "Segitiga ABC sebangun dengan DEF. AB = 4 cm, DE = 8 cm, BC = 5 cm. Panjang EF adalah …",
    "options": [
      "8 cm",
      "9 cm",
      "10 cm",
      "12 cm"
    ],
    "answer": 2,
    "why": "Skala = 8 ÷ 4 = 2, jadi EF = 5 × 2 = 10 cm."
  },
  {
    "q": "Dua bangun sebangun dengan skala 2 : 5. Perbandingan keliling keduanya adalah …",
    "options": [
      "4 : 25",
      "1 : 2",
      "5 : 2",
      "2 : 5"
    ],
    "answer": 3,
    "why": "Keliling sebanding dengan skala panjangnya, jadi 2 : 5."
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
      msg.textContent = qScore === 10 ? 'Sempurna! Kamu menguasai Kesebangunan.'
        : qScore >= 8 ? 'Hebat! Tinggal sedikit lagi menuju sempurna.'
        : qScore >= 6 ? 'Bagus! Ulangi bagian yang masih salah, lalu coba lagi.'
        : 'Terus berlatih! Buka lagi sub-bab awal, lalu ulangi kuisnya.';
    }
    var prevBest = read('mpi-g2-quiz-best', null);
    var prevNum = prevBest === null ? -1 : Number(prevBest);
    if (qScore > prevNum) store('mpi-g2-quiz-best', String(qScore));
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
    try { saved = JSON.parse(read('mpi-g2-refleksi', 'null')); } catch (e) { saved = null; }
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
      store('mpi-g2-refleksi', JSON.stringify(data));
      var st = $('refStatus');
      if (st) st.textContent = 'Refleksi tersimpan di perangkat ini pada ' + new Date().toLocaleString('id-ID') + '.';
      markVisited('sub6');
    });
  }
})();
