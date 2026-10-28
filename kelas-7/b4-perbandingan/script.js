/* B.4 Perbandingan — script.js
   Vanilla JS, tanpa framework. Semua jawaban matematika diperiksa manual.
   localStorage: mpi-b4-visited (sub-bab yang dibuka),
   mpi-b4-quiz-best (skor kuis terbaik), mpi-b4-refleksi (refleksi). */
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
  try { visited = JSON.parse(read('mpi-b4-visited', '[]')) || []; } catch (e) { visited = []; }
  if (!Array.isArray(visited)) visited = [];

  function saveVisited() { store('mpi-b4-visited', JSON.stringify(visited)); }
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
  var bestStored = read('mpi-b4-quiz-best', null);
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


  /* ---------- Sub-bab 1: Laboratorium Apel & Jeruk ---------- */
  function renderDots(el, count, cls, label) {
    if (!el) return;
    el.innerHTML = '';
    for (var i = 0; i < count; i++) {
      var d = document.createElement('span');
      d.className = 'dot ' + cls;
      d.textContent = label;
      el.appendChild(d);
    }
  }
  var apelRange = $('apelRange'), jerukRange = $('jerukRange');
  function updateRatio() {
    if (!apelRange || !jerukRange) return;
    var a = Number(apelRange.value), b = Number(jerukRange.value);
    var av = $('apelVal'), jv = $('jerukVal');
    if (av) av.textContent = a;
    if (jv) jv.textContent = b;
    renderDots($('apelDots'), a, 'dot-apel', 'A');
    renderDots($('jerukDots'), b, 'dot-jeruk', 'J');
    var max = Math.max(a, b);
    var ab = $('apelBar'), jb = $('jerukBar');
    if (ab) ab.style.width = (a / max * 100) + '%';
    if (jb) jb.style.width = (b / max * 100) + '%';
    var g = gcd(a, b), sa = a / g, sb = b / g;
    var big = $('ratioBig');
    if (big) big.textContent = g === 1 ? (a + ' : ' + b + '  (sudah paling sederhana)') : (a + ' : ' + b + '  =  ' + sa + ' : ' + sb);
    var txt = $('ratioText');
    if (txt) txt.textContent = 'Sebagai pecahan: ' + a + '/' + b + (g === 1 ? '' : ' = ' + sa + '/' + sb) + '. Artinya setiap ' + sa + ' apel, ada ' + sb + ' jeruk. FPB dari ' + a + ' dan ' + b + ' adalah ' + g + '.';
  }
  if (apelRange) apelRange.addEventListener('input', updateRatio);
  if (jerukRange) jerukRange.addEventListener('input', updateRatio);
  updateRatio();

  /* ---------- Sub-bab 1: kalkulator penyederhana ---------- */
  function simplifyRatio() {
    var a = parseIntNum($('simpA')), b = parseIntNum($('simpB'));
    var res = $('simpResult'), fpb = $('simpFpb'), steps = $('simpSteps');
    if (a === null || b === null || a < 1 || b < 1) {
      if (res) res.textContent = 'Isi kedua bilangan dengan angka positif dulu.';
      if (fpb) fpb.textContent = '';
      if (steps) steps.innerHTML = '';
      return;
    }
    var g = gcd(a, b), sa = a / g, sb = b / g;
    if (res) res.textContent = a + ' : ' + b + '  →  ' + sa + ' : ' + sb;
    if (fpb) fpb.textContent = g === 1 ? 'FPB-nya 1 — perbandingan ini sudah paling sederhana' : 'FPB dari ' + a + ' dan ' + b + ' adalah ' + fmtId(g);
    if (steps) steps.innerHTML = '<strong>Langkah-langkahnya:</strong><ol>'
      + '<li>Cari FPB dari ' + fmtId(a) + ' dan ' + fmtId(b) + ' → <strong>' + fmtId(g) + '</strong></li>'
      + '<li>Bagi bilangan pertama: ' + fmtId(a) + ' ÷ ' + fmtId(g) + ' = <strong>' + fmtId(sa) + '</strong></li>'
      + '<li>Bagi bilangan kedua: ' + fmtId(b) + ' ÷ ' + fmtId(g) + ' = <strong>' + fmtId(sb) + '</strong></li>'
      + '<li>Jadi bentuk sederhananya adalah <strong>' + sa + ' : ' + sb + '</strong></li></ol>';
  }
  var simpBtn = $('simpBtn');
  if (simpBtn) simpBtn.addEventListener('click', simplifyRatio);
  var sA = $('simpA'), sB = $('simpB');
  if (sA) sA.addEventListener('change', simplifyRatio);
  if (sB) sB.addEventListener('change', simplifyRatio);
  simplifyRatio();

  /* ---------- Grafik garis (SVG) untuk simulasi ---------- */
  function drawLineChart(svgId, points, color, hlIndex, xLabel, yLabel) {
    var svg = $(svgId);
    if (!svg) return;
    var W = 320, H = 190, pl = 38, pb = 26, pt = 12, pr = 12;
    var maxX = Math.max.apply(null, points.map(function (p) { return p[0]; }));
    var maxY = Math.max.apply(null, points.map(function (p) { return p[1]; }));
    function X(v) { return pl + (v / maxX) * (W - pl - pr); }
    function Y(v) { return H - pb - (v / maxY) * (H - pt - pb); }
    var s = '';
    s += '<line x1="' + pl + '" y1="' + (H - pb) + '" x2="' + (W - pr) + '" y2="' + (H - pb) + '" stroke="#9db3c8" stroke-width="1.5"/>';
    s += '<line x1="' + pl + '" y1="' + pt + '" x2="' + pl + '" y2="' + (H - pb) + '" stroke="#9db3c8" stroke-width="1.5"/>';
    var path = points.map(function (p, i) { return (i === 0 ? 'M' : 'L') + X(p[0]).toFixed(1) + ' ' + Y(p[1]).toFixed(1); }).join(' ');
    s += '<path d="' + path + '" fill="none" stroke="' + color + '" stroke-width="3" stroke-linecap="round"/>';
    points.forEach(function (p, i) {
      var hl = i === hlIndex;
      s += '<circle cx="' + X(p[0]) + '" cy="' + Y(p[1]) + '" r="' + (hl ? 6 : 3.5) + '" fill="' + (hl ? '#F59E0B' : color) + '" stroke="#fff" stroke-width="1.5"/>';
      if (hl) { s += '<text x="' + X(p[0]) + '" y="' + (Y(p[1]) - 12) + '" text-anchor="middle" font-size="11" font-weight="700" fill="currentColor">' + p[0] + ' → ' + fmtId(p[1]) + '</text>'; }
    });
    s += '<text x="' + (W - pr) + '" y="' + (H - 6) + '" text-anchor="end" font-size="10.5" fill="currentColor" opacity=".65">' + xLabel + '</text>';
    s += '<text x="6" y="' + (pt + 4) + '" font-size="10.5" fill="currentColor" opacity=".65">' + yLabel + '</text>';
    svg.innerHTML = s;
  }

  /* ---------- Sub-bab 2: simulasi senilai (buku) ---------- */
  var HARGA_BUKU = 6000;
  var bukuRange = $('bukuRange');
  function updateBuku() {
    if (!bukuRange) return;
    var n = Number(bukuRange.value);
    var bv = $('bukuVal'), bt = $('bukuTotal'), bc = $('bukuCalc');
    if (bv) bv.textContent = n + ' buku';
    if (bt) bt.textContent = 'Rp' + fmtId(n * HARGA_BUKU);
    if (bc) bc.textContent = n + ' × Rp' + fmtId(HARGA_BUKU) + ' = Rp' + fmtId(n * HARGA_BUKU);
    var pts = [];
    for (var i = 0; i <= 10; i++) { pts.push([i, i * HARGA_BUKU / 1000]); }
    drawLineChart('senilaiChart', pts, '#2563EB', n, 'Jumlah buku →', 'Harga (ribu Rp)');
    var tb = document.querySelector('#bukuTable tbody');
    if (tb) {
      tb.innerHTML = '';
      for (var j = 1; j <= 10; j++) {
        var tr = document.createElement('tr');
        if (j === n) tr.className = 'hl';
        var td1 = document.createElement('td'); td1.textContent = j + ' buku';
        var td2 = document.createElement('td'); td2.className = 'num'; td2.textContent = 'Rp' + fmtId(j * HARGA_BUKU);
        tr.appendChild(td1); tr.appendChild(td2);
        tb.appendChild(tr);
      }
    }
  }
  if (bukuRange) bukuRange.addEventListener('input', updateBuku);
  updateBuku();

  /* ---------- Sub-bab 3: simulasi berbalik nilai (pekerja) ---------- */
  var TOTAL_KERJA = 60;
  var pekerjaRange = $('pekerjaRange');
  function updatePekerja() {
    if (!pekerjaRange) return;
    var n = Number(pekerjaRange.value);
    var hari = TOTAL_KERJA / n;
    var hariTxt = (hari % 1 === 0) ? fmtId(hari) : fmtId(hari.toFixed(1));
    var pv = $('pekerjaVal'), ph = $('pekerjaHari'), pc = $('pekerjaCalc');
    if (pv) pv.textContent = n + ' orang';
    if (ph) ph.textContent = hariTxt + ' hari';
    if (pc) pc.textContent = '60 ÷ ' + n + ' pekerja = ' + hariTxt + ' hari · hasil kali selalu tetap: ' + n + ' × ' + hariTxt + ' = 60';
    var pts = [];
    for (var i = 2; i <= 20; i++) { pts.push([i, TOTAL_KERJA / i]); }
    drawLineChart('berbalikChart', pts, '#E85D3F', n - 2, 'Jumlah pekerja →', 'Hari');
  }
  if (pekerjaRange) pekerjaRange.addEventListener('input', updatePekerja);
  updatePekerja();

  /* ---------- Sub-bab 4: kalkulator skala ---------- */
  var skalaMode = $('skalaMode');
  function numVal(id) {
    var el = $(id);
    if (!el) return 0;
    var v = parseFloat(el.value);
    return isNaN(v) ? 0 : v;
  }
  function hitungSkala() {
    if (!skalaMode) return;
    var m = skalaMode.value;
    var label = $('skalaResLabel'), res = $('skalaResult'), exp = $('skalaExplain');
    if (m === 'sebenarnya') {
      var jp = numVal('inPeta'), sk = numVal('inSkala');
      if (jp <= 0 || sk <= 0) { if (res) res.textContent = '—'; if (exp) exp.textContent = 'Isi jarak di peta dan skala dulu.'; return; }
      var cm = jp * sk, km = cm / 100000;
      if (label) label.textContent = 'JARAK SEBENARNYA';
      if (res) res.textContent = (km % 1 === 0 ? fmtId(km) : fmtId(km.toFixed(2))) + ' km';
      if (exp) exp.textContent = jp + ' cm × ' + fmtId(sk) + ' = ' + fmtId(cm) + ' cm = ' + (km % 1 === 0 ? fmtId(km) : km) + ' km';
    } else if (m === 'peta') {
      var jsKm = numVal('inSebenarnya'), sk2 = numVal('inSkala');
      if (jsKm <= 0 || sk2 <= 0) { if (res) res.textContent = '—'; if (exp) exp.textContent = 'Isi jarak sebenarnya dan skala dulu.'; return; }
      var cm2 = jsKm * 100000, jp2 = cm2 / sk2;
      if (label) label.textContent = 'JARAK DI PETA';
      if (res) res.textContent = (jp2 % 1 === 0 ? fmtId(jp2) : fmtId(jp2.toFixed(2))) + ' cm';
      if (exp) exp.textContent = jsKm + ' km = ' + fmtId(cm2) + ' cm, lalu ÷ ' + fmtId(sk2) + ' = ' + (jp2 % 1 === 0 ? fmtId(jp2) : jp2) + ' cm';
    } else {
      var jp3 = numVal('inPeta'), jsKm3 = numVal('inSebenarnya');
      if (jp3 <= 0 || jsKm3 <= 0) { if (res) res.textContent = '—'; if (exp) exp.textContent = 'Isi jarak di peta dan jarak sebenarnya dulu.'; return; }
      var cm3 = jsKm3 * 100000, sk3 = Math.round(cm3 / jp3);
      if (label) label.textContent = 'SKALANYA';
      if (res) res.textContent = '1 : ' + fmtId(sk3);
      if (exp) exp.textContent = jsKm3 + ' km = ' + fmtId(cm3) + ' cm, lalu ' + fmtId(cm3) + ' ÷ ' + jp3 + ' cm = ' + fmtId(sk3) + ' → skala 1 : ' + fmtId(sk3);
    }
  }
  function updateSkalaFields() {
    if (!skalaMode) return;
    var m = skalaMode.value;
    var fp = $('fieldPeta'), fs = $('fieldSebenarnya'), fk = $('fieldSkala');
    if (fp) fp.style.display = (m === 'peta') ? 'none' : 'block';
    if (fs) fs.style.display = (m === 'sebenarnya') ? 'none' : 'block';
    if (fk) fk.style.display = (m === 'skala') ? 'none' : 'block';
    hitungSkala();
  }
  if (skalaMode) skalaMode.addEventListener('change', updateSkalaFields);
  ['inPeta', 'inSebenarnya', 'inSkala'].forEach(function (id) {
    var el = $(id);
    if (el) el.addEventListener('input', hitungSkala);
  });
  updateSkalaFields();


  /* ---------- Sub-bab 6: kuis 10 soal ---------- */
  /* Kunci sudah diperiksa manual (keseimbangan A2/B3/C2/D3):
     1) 3 : 2 (idx 2)
     2) Rp70.000 (idx 3)
     3) Rp56.000 (idx 1)
     4) 8 hari (idx 1)
     5) 20 km (idx 1)
     6) 5 gelas (idx 0)
     7) 3 jam (idx 0)
     8) 12 tahun (idx 2)
     9) 15 km (idx 3)
     10) 25 butir (idx 3) */
  var QUIZ = [
  {
    "q": "Di keranjang ada 12 apel dan 8 jeruk. Bentuk paling sederhana dari perbandingan apel : jeruk adalah …",
    "options": [
      "12 : 8",
      "6 : 4",
      "3 : 2",
      "2 : 3"
    ],
    "answer": 2,
    "why": "Bagi keduanya dengan FPB-nya, yaitu 4. 12 ÷ 4 = 3 dan 8 ÷ 4 = 2. Jadi 3 : 2. Hati-hati, urutan tidak boleh tertukar: apel dulu, baru jeruk."
  },
  {
    "q": "Perbandingan uang Rina : Sinta adalah 4 : 7. Selisih uang mereka Rp30.000. Berapa uang Sinta?",
    "options": [
      "Rp40.000",
      "Rp75.000",
      "Rp110.000",
      "Rp70.000"
    ],
    "answer": 3,
    "why": "Selisih bagian = 7 − 4 = 3 bagian = Rp30.000, jadi 1 bagian = Rp10.000. Uang Sinta = 7 × Rp10.000 = Rp70.000."
  },
  {
    "q": "Harga 5 buku adalah Rp35.000. Dengan harga satuan yang sama, harga 8 buku adalah …",
    "options": [
      "Rp48.000",
      "Rp56.000",
      "Rp52.000",
      "Rp64.000"
    ],
    "answer": 1,
    "why": "Ini perbandingan senilai. Harga 1 buku = 35.000 ÷ 5 = Rp7.000. Maka 8 buku = 8 × 7.000 = Rp56.000."
  },
  {
    "q": "Sebuah proyek selesai dalam 12 hari oleh 10 pekerja. Jika pekerjanya menjadi 15 orang (kecepatan kerja sama), proyek selesai dalam …",
    "options": [
      "18 hari",
      "8 hari",
      "10 hari",
      "6 hari"
    ],
    "answer": 1,
    "why": "Ini perbandingan berbalik nilai: pekerja bertambah, waktu berkurang. Total kerja = 10 × 12 = 120. Lama hari = 120 ÷ 15 = 8 hari."
  },
  {
    "q": "Skala peta 1 : 500.000. Jika jarak dua kota di peta 4 cm, jarak sebenarnya adalah …",
    "options": [
      "2 km",
      "20 km",
      "50 km",
      "200 km"
    ],
    "answer": 1,
    "why": "Jarak sebenarnya = 4 × 500.000 = 2.000.000 cm. Ubah ke km: 2.000.000 ÷ 100.000 = 20 km."
  },
  {
    "q": "Resep kue membutuhkan 2 gelas tepung untuk 12 kue. Untuk membuat 30 kue, tepung yang dibutuhkan adalah …",
    "options": [
      "5 gelas",
      "3 gelas",
      "4 gelas",
      "6 gelas"
    ],
    "answer": 0,
    "why": "Perbandingan senilai: 30 kue adalah 30 ÷ 12 = 2,5 kali lipatnya. Tepung = 2 × 2,5 = 5 gelas."
  },
  {
    "q": "Sebuah mobil menempuh perjalanan dalam 4 jam dengan kecepatan 60 km/jam. Jika kecepatannya 80 km/jam, waktu tempuhnya menjadi …",
    "options": [
      "3 jam",
      "3,5 jam",
      "5 jam",
      "5,5 jam"
    ],
    "answer": 0,
    "why": "Kecepatan naik, waktu turun → berbalik nilai. Jarak tetap = 60 × 4 = 240 km. Waktu = 240 ÷ 80 = 3 jam."
  },
  {
    "q": "Perbandingan umur Ayah : Anak adalah 7 : 2. Jika umur Ayah 42 tahun, umur Anak adalah …",
    "options": [
      "10 tahun",
      "14 tahun",
      "12 tahun",
      "21 tahun"
    ],
    "answer": 2,
    "why": "7 bagian = 42 tahun, jadi 1 bagian = 6 tahun. Umur Anak = 2 × 6 = 12 tahun."
  },
  {
    "q": "Pada peta berskala 1 : 250.000, jarak dua tempat adalah 6 cm. Jarak sebenarnya kedua tempat itu …",
    "options": [
      "10 km",
      "12 km",
      "18 km",
      "15 km"
    ],
    "answer": 3,
    "why": "Jarak sebenarnya = 6 × 250.000 = 1.500.000 cm = 15 km."
  },
  {
    "q": "Perbandingan kelereng Andi : Budi = 5 : 3. Jumlah kelereng mereka 40 butir. Kelereng Andi ada …",
    "options": [
      "20 butir",
      "15 butir",
      "30 butir",
      "25 butir"
    ],
    "answer": 3,
    "why": "Jumlah bagian = 8 bagian = 40 butir, jadi 1 bagian = 5 butir. Kelereng Andi = 5 × 5 = 25 butir."
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
      msg.textContent = qScore === 10 ? 'Sempurna! Kamu menguasai Perbandingan.'
        : qScore >= 8 ? 'Hebat! Tinggal sedikit lagi menuju sempurna.'
        : qScore >= 6 ? 'Bagus! Ulangi bagian yang masih salah, lalu coba lagi.'
        : 'Terus berlatih! Buka lagi sub-bab awal, lalu ulangi kuisnya.';
    }
    var prevBest = read('mpi-b4-quiz-best', null);
    var prevNum = prevBest === null ? -1 : Number(prevBest);
    if (qScore > prevNum) store('mpi-b4-quiz-best', String(qScore));
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
    try { saved = JSON.parse(read('mpi-b4-refleksi', 'null')); } catch (e) { saved = null; }
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
      store('mpi-b4-refleksi', JSON.stringify(data));
      var st = $('refStatus');
      if (st) st.textContent = 'Refleksi tersimpan di perangkat ini pada ' + new Date().toLocaleString('id-ID') + '.';
      markVisited('sub6');
    });
  }
})();
