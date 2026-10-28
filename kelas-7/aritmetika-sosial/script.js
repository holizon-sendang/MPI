/* Aritmetika Sosial — script.js
   Vanilla JS, tanpa framework. Semua jawaban matematika diperiksa manual.
   localStorage: mpi-arithsos-visited (sub-bab yang dibuka),
   mpi-arithsos-quiz-best (skor kuis terbaik), mpi-arithsos-refleksi (refleksi). */
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
  try { visited = JSON.parse(read('mpi-arithsos-visited', '[]')) || []; } catch (e) { visited = []; }
  if (!Array.isArray(visited)) visited = [];

  function saveVisited() { store('mpi-arithsos-visited', JSON.stringify(visited)); }
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
  var bestStored = read('mpi-arithsos-quiz-best', null);
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


  /* ---------- Sub-bab 1: kalkulator untung / rugi ---------- */
  var urBtn = $('urBtn');
  if (urBtn) {
    urBtn.addEventListener('click', function () {
      var hb = parseNum($('urHB')), hj = parseNum($('urHJ'));
      var hasil = $('urHasil'), langkah = $('urLangkah');
      if (hb === null || hj === null || hb <= 0 || hj < 0) {
        if (hasil) hasil.textContent = 'Isi harga beli dan harga jual yang benar.';
        if (langkah) langkah.textContent = '';
        return;
      }
      var selisih = hj - hb;
      if (selisih > 0) {
        if (hasil) hasil.textContent = 'Untung Rp' + fmtId(selisih);
        if (langkah) langkah.textContent = 'Harga jual (Rp' + fmtId(hj) + ') lebih besar dari harga beli (Rp' + fmtId(hb) + '). Untung = ' + fmtId(hj) + ' − ' + fmtId(hb) + ' = Rp' + fmtId(selisih) + '.';
      } else if (selisih < 0) {
        if (hasil) hasil.textContent = 'Rugi Rp' + fmtId(-selisih);
        if (langkah) langkah.textContent = 'Harga jual (Rp' + fmtId(hj) + ') lebih kecil dari harga beli (Rp' + fmtId(hb) + '). Rugi = ' + fmtId(hb) + ' − ' + fmtId(hj) + ' = Rp' + fmtId(-selisih) + '.';
      } else {
        if (hasil) hasil.textContent = 'Impas (tidak untung, tidak rugi)';
        if (langkah) langkah.textContent = 'Harga jual sama dengan harga beli, jadi tidak ada untung maupun rugi.';
      }
    });
  }

  /* ---------- Sub-bab 2: kalkulator persen untung / rugi ---------- */
  var psBtn = $('psBtn');
  if (psBtn) {
    psBtn.addEventListener('click', function () {
      var hb = parseNum($('psHB')), hj = parseNum($('psHJ'));
      var hasil = $('psHasil'), langkah = $('psLangkah');
      if (hb === null || hj === null || hb <= 0 || hj < 0) {
        if (hasil) hasil.textContent = 'Isi harga beli dan harga jual yang benar.';
        if (langkah) langkah.textContent = '';
        return;
      }
      var selisih = hj - hb;
      var persen = Math.abs(selisih) / hb * 100;
      var pTxt = fmtNum(persen, 2);
      if (selisih > 0) {
        if (hasil) hasil.textContent = 'Untung ' + pTxt + '%';
        if (langkah) langkah.textContent = 'Untung Rp' + fmtId(selisih) + '. Persentase untung = untung ÷ harga beli × 100% = ' + fmtId(selisih) + ' ÷ ' + fmtId(hb) + ' × 100% = ' + pTxt + '%.';
      } else if (selisih < 0) {
        if (hasil) hasil.textContent = 'Rugi ' + pTxt + '%';
        if (langkah) langkah.textContent = 'Rugi Rp' + fmtId(-selisih) + '. Persentase rugi = rugi ÷ harga beli × 100% = ' + fmtId(-selisih) + ' ÷ ' + fmtId(hb) + ' × 100% = ' + pTxt + '%.';
      } else {
        if (hasil) hasil.textContent = 'Impas — 0%';
        if (langkah) langkah.textContent = 'Harga jual sama dengan harga beli, persentase untung maupun ruginya 0%.';
      }
    });
  }

  /* ---------- Sub-bab 3: kalkulator diskon ---------- */
  var dkBtn = $('dkBtn');
  if (dkBtn) {
    dkBtn.addEventListener('click', function () {
      var harga = parseNum($('dkHarga')), diskon = parseNum($('dkDiskon'));
      var hasil = $('dkHasil'), langkah = $('dkLangkah');
      if (harga === null || diskon === null || harga <= 0 || diskon < 0 || diskon > 100) {
        if (hasil) hasil.textContent = 'Isi harga awal dan diskon (0–100%) yang benar.';
        if (langkah) langkah.textContent = '';
        return;
      }
      var potongan = harga * diskon / 100;
      var bayar = harga - potongan;
      if (hasil) hasil.textContent = 'Bayar Rp' + fmtId(bayar);
      if (langkah) langkah.textContent = 'Potongan = ' + diskon + '% × Rp' + fmtId(harga) + ' = Rp' + fmtId(potongan) + '. Harga yang dibayar = Rp' + fmtId(harga) + ' − Rp' + fmtId(potongan) + ' = Rp' + fmtId(bayar) + '.';
    });
  }

  /* ---------- Sub-bab 4: kalkulator bruto / tara / netto ---------- */
  var btBtn = $('btBtn');
  if (btBtn) {
    btBtn.addEventListener('click', function () {
      var mode = $('btMode') ? $('btMode').value : 'netto';
      var v1 = parseNum($('btV1')), v2 = parseNum($('btV2'));
      var hasil = $('btHasil'), langkah = $('btLangkah');
      if (v1 === null || v2 === null || v1 <= 0 || v2 < 0) {
        if (hasil) hasil.textContent = 'Isi kedua bilangan dengan benar.';
        if (langkah) langkah.textContent = '';
        return;
      }
      if (mode === 'netto') {
        var netto = v1 - v1 * v2 / 100;
        if (hasil) hasil.textContent = 'Netto = ' + fmtNum(netto, 2) + ' kg';
        if (langkah) langkah.textContent = 'Tara = ' + v2 + '% × ' + fmtId(v1) + ' kg = ' + fmtNum(v1 * v2 / 100, 2) + ' kg. Netto = bruto − tara = ' + fmtId(v1) + ' − ' + fmtNum(v1 * v2 / 100, 2) + ' = ' + fmtNum(netto, 2) + ' kg.';
      } else if (mode === 'bruto') {
        var bruto = v1 / (1 - v2 / 100);
        if (v2 >= 100) { if (hasil) hasil.textContent = 'Tara tidak boleh 100% atau lebih.'; if (langkah) langkah.textContent = ''; return; }
        if (hasil) hasil.textContent = 'Bruto = ' + fmtNum(bruto, 2) + ' kg';
        if (langkah) langkah.textContent = 'Netto adalah ' + (100 - v2) + '% dari bruto, jadi bruto = ' + fmtId(v1) + ' ÷ ' + (100 - v2) + '% = ' + fmtNum(bruto, 2) + ' kg. Tara-nya ' + fmtNum(bruto - v1, 2) + ' kg.';
      } else {
        var tara = v1 - v2;
        var persen = tara / v1 * 100;
        if (hasil) hasil.textContent = 'Tara = ' + fmtNum(tara, 2) + ' kg (' + fmtNum(persen, 2) + '%)';
        if (langkah) langkah.textContent = 'Tara = bruto − netto = ' + fmtId(v1) + ' − ' + fmtId(v2) + ' = ' + fmtNum(tara, 2) + ' kg, yaitu ' + fmtNum(persen, 2) + '% dari bruto.';
      }
    });
  }

  /* ---------- Sub-bab 5: kalkulator bunga tunggal & pajak ---------- */
  var bgBtn = $('bgBtn');
  if (bgBtn) {
    bgBtn.addEventListener('click', function () {
      var modal = parseNum($('bgModal')), persen = parseNum($('bgPersen')), bulan = parseNum($('bgBulan'));
      var hasil = $('bgHasil'), langkah = $('bgLangkah');
      if (modal === null || persen === null || bulan === null || modal <= 0 || persen < 0 || bulan < 0) {
        if (hasil) hasil.textContent = 'Isi modal, persen bunga, dan lama menabung yang benar.';
        if (langkah) langkah.textContent = '';
        return;
      }
      var bunga = modal * persen / 100 * bulan / 12;
      var total = modal + bunga;
      if (hasil) hasil.textContent = 'Bunga Rp' + fmtId(Math.round(bunga * 100) / 100);
      if (langkah) langkah.textContent = 'Bunga = modal × persen × waktu = Rp' + fmtId(modal) + ' × ' + persen + '% × ' + bulan + '/12 = Rp' + fmtId(Math.round(bunga * 100) / 100) + '. Total tabungan menjadi Rp' + fmtId(Math.round(total * 100) / 100) + '.';
    });
  }
  var pjBtn = $('pjBtn');
  if (pjBtn) {
    pjBtn.addEventListener('click', function () {
      var harga = parseNum($('pjHarga')), persen = parseNum($('pjPersen'));
      var hasil = $('pjHasil'), langkah = $('pjLangkah');
      if (harga === null || persen === null || harga <= 0 || persen < 0) {
        if (hasil) hasil.textContent = 'Isi harga dan persen pajak yang benar.';
        if (langkah) langkah.textContent = '';
        return;
      }
      var pajak = harga * persen / 100;
      if (hasil) hasil.textContent = 'Total bayar Rp' + fmtId(harga + pajak);
      if (langkah) langkah.textContent = 'Pajak = ' + persen + '% × Rp' + fmtId(harga) + ' = Rp' + fmtId(pajak) + '. Total yang dibayar = Rp' + fmtId(harga) + ' + Rp' + fmtId(pajak) + ' = Rp' + fmtId(harga + pajak) + '.';
    });
  }


  /* ---------- Sub-bab 6: kuis 10 soal ---------- */
  /* Kunci sudah diperiksa manual (keseimbangan A2/B3/C2/D3):
     1) Rp20.000 (idx 1)
     2) 10% (idx 1)
     3) Rp120.000 (idx 3)
     4) 49 kg (idx 1)
     5) Rp60.000 (idx 3)
     6) Rp250.000 (idx 0)
     7) Rp140.000 (idx 0)
     8) 50 kg (idx 2)
     9) Rp550.000 (idx 2)
     10) Rp460.000 (idx 3) */
  var QUIZ = [
  {
    "q": "Sebuah pensil dibeli Rp100.000 lalu dijual Rp120.000. Keuntungan pedagang itu …",
    "options": [
      "Rp10.000",
      "Rp20.000",
      "Rp25.000",
      "Rp30.000"
    ],
    "answer": 1,
    "why": "Untung = harga jual − harga beli = 120.000 − 100.000 = Rp20.000."
  },
  {
    "q": "Sebuah tas dibeli Rp80.000 lalu dijual Rp72.000. Persentase kerugiannya …",
    "options": [
      "5%",
      "10%",
      "12,5%",
      "20%"
    ],
    "answer": 1,
    "why": "Rugi Rp8.000. Persentase rugi = 8.000 ÷ 80.000 × 100% = 10%."
  },
  {
    "q": "Sebuah jaket Rp150.000 didiskon 20%. Harga yang harus dibayar …",
    "options": [
      "Rp100.000",
      "Rp110.000",
      "Rp115.000",
      "Rp120.000"
    ],
    "answer": 3,
    "why": "Potongan 20% dari Rp150.000 adalah Rp30.000, jadi bayarnya 150.000 − 30.000 = Rp120.000."
  },
  {
    "q": "Bruto sekarung kopi 50 kg dengan tara 2%. Nettonya …",
    "options": [
      "48 kg",
      "49 kg",
      "49,5 kg",
      "50 kg"
    ],
    "answer": 1,
    "why": "Tara = 2% × 50 = 1 kg, jadi netto = 50 − 1 = 49 kg."
  },
  {
    "q": "Sinta menabung Rp1.000.000 dengan bunga 12% per tahun. Bunga setelah 6 bulan …",
    "options": [
      "Rp50.000",
      "Rp120.000",
      "Rp100.000",
      "Rp60.000"
    ],
    "answer": 3,
    "why": "Bunga = 1.000.000 × 12% × 6/12 = Rp60.000."
  },
  {
    "q": "Harga beli sebuah radio Rp200.000. Jika dijual dengan keuntungan 25%, harga jualnya …",
    "options": [
      "Rp250.000",
      "Rp225.000",
      "Rp240.000",
      "Rp260.000"
    ],
    "answer": 0,
    "why": "Untung 25% dari Rp200.000 adalah Rp50.000, jadi harga jual = 200.000 + 50.000 = Rp250.000."
  },
  {
    "q": "Sebuah sepatu Rp200.000 didiskon 30%. Harga setelah diskon …",
    "options": [
      "Rp140.000",
      "Rp60.000",
      "Rp170.000",
      "Rp130.000"
    ],
    "answer": 0,
    "why": "Potongan 30% dari Rp200.000 adalah Rp60.000, jadi bayarnya 200.000 − 60.000 = Rp140.000."
  },
  {
    "q": "Netto sekarung tepung 48 kg dan taranya 2 kg. Brutonya …",
    "options": [
      "46 kg",
      "52 kg",
      "50 kg",
      "48 kg"
    ],
    "answer": 2,
    "why": "Bruto = netto + tara = 48 + 2 = 50 kg."
  },
  {
    "q": "Sebuah buku Rp500.000 dikenai pajak 10%. Total yang harus dibayar …",
    "options": [
      "Rp500.000",
      "Rp505.000",
      "Rp550.000",
      "Rp600.000"
    ],
    "answer": 2,
    "why": "Pajak = 10% × 500.000 = Rp50.000, jadi totalnya 500.000 + 50.000 = Rp550.000."
  },
  {
    "q": "Modal sebuah kios Rp400.000. Jika dijual dengan keuntungan 15%, harga jualnya …",
    "options": [
      "Rp415.000",
      "Rp440.000",
      "Rp450.000",
      "Rp460.000"
    ],
    "answer": 3,
    "why": "Untung 15% dari Rp400.000 adalah Rp60.000, jadi harga jual = 400.000 + 60.000 = Rp460.000."
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
      msg.textContent = qScore === 10 ? 'Sempurna! Kamu menguasai Aritmetika Sosial.'
        : qScore >= 8 ? 'Hebat! Tinggal sedikit lagi menuju sempurna.'
        : qScore >= 6 ? 'Bagus! Ulangi bagian yang masih salah, lalu coba lagi.'
        : 'Terus berlatih! Buka lagi sub-bab awal, lalu ulangi kuisnya.';
    }
    var prevBest = read('mpi-arithsos-quiz-best', null);
    var prevNum = prevBest === null ? -1 : Number(prevBest);
    if (qScore > prevNum) store('mpi-arithsos-quiz-best', String(qScore));
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
    try { saved = JSON.parse(read('mpi-arithsos-refleksi', 'null')); } catch (e) { saved = null; }
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
      store('mpi-arithsos-refleksi', JSON.stringify(data));
      var st = $('refStatus');
      if (st) st.textContent = 'Refleksi tersimpan di perangkat ini pada ' + new Date().toLocaleString('id-ID') + '.';
      markVisited('sub6');
    });
  }
})();
