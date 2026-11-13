/* Latihan ASAS Matematika Kelas 7 — script.js
   Vanilla JS, tanpa framework. Semua soal, kunci, dan pembahasan
   disalin dari Kunci Jawaban & Pedoman Penskoran ASAS Matematika
   Kelas VII TP 2025/2026 — MGMP Kabupaten Lampung Tengah, dan
   sudah diperiksa ulang satu per satu.
   localStorage: mpi-asas-answers (jawaban), mpi-asas-scores (skor
   per bagian), mpi-asas-best (skor total terbaik /100),
   mpi-asas-visited (bagian yang dibuka). */
(function () {
  'use strict';

  /* ---------- Util ---------- */
  function $(id) { return document.getElementById(id); }
  function store(key, value) {
    try { localStorage.setItem(key, value); } catch (e) { /* abaikan */ }
  }
  function read(key, fallback) {
    try {
      var v = localStorage.getItem(key);
      return v === null ? fallback : v;
    } catch (e) { return fallback; }
  }
  function showFb(el, ok, msg) {
    if (!el) return;
    el.textContent = msg;
    el.classList.remove('ok', 'no', 'show');
    el.classList.add(ok ? 'ok' : 'no', 'show');
  }
  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  /* ---------- Bank soal ---------- */
  var PG = [
    { q: 'Perhatikan urutan bilangan pada garis bilangan berikut: -8, -5, -2, ..., 4, 7. Bilangan yang tepat untuk mengisi titik-titik tersebut adalah...',
      options: ['-1', '0', '1', '2'], answer: 2,
      why: 'Selisih antar bilangan +3, jadi -2 + 3 = 1.' },
    { q: 'Diberikan kelompok bilangan bulat acak: -12, 8, -5, 0, 15, -3. Urutan bilangan dari yang terbesar ke yang terkecil adalah...',
      options: ['15, 8, 0, -3, -5, -12', '15, 8, 0, -12, -5, -3', '-12, -5, -3, 0, 8, 15', '-3, -5, -12, 0, 8, 15'], answer: 0,
      why: 'Urutkan dari terbesar: 15, 8, 0, -3, -5, -12.' },
    { q: 'Sebuah anak panah pada garis bilangan dimulai dari titik 0 bergerak ke kiri sejauh 5 satuan, kemudian dilanjutkan bergerak ke kanan sejauh 8 satuan. Operasi hitung yang sesuai adalah...',
      options: ['-5 - 8 = -13', '-5 + 8 = 3', '5 + (-8) = -3', '5 - 8 = -3'], answer: 1,
      why: 'Ke kiri 5 dari 0 adalah -5, lalu ke kanan 8: -5 + 8 = 3.' },
    { q: 'Hasil dari operasi hitung campuran 24 + (-36) ÷ 6 - (-10) adalah...',
      options: ['28', '18', '-8', '-18'], answer: 0,
      why: '(-36) ÷ 6 = -6, lalu 24 - 6 - (-10) = 24 - 6 + 10 = 28.' },
    { q: 'Di antara kelompok bilangan berikut, manakah yang bukan merupakan bilangan rasional?',
      options: ['75%', '0,333...', '√2 = 1,41421356...', '-5/8'], answer: 2,
      why: '√2 adalah bilangan irasional (desimalnya tidak berulang dan tidak berakhir); yang lain bilangan rasional.' },
    { q: 'Sebuah bilangan pecahan yang nilainya terletak di antara 1/3 dan 1/2 adalah...',
      options: ['1/4', '5/12', '2/3', '7/12'], answer: 1,
      why: '1/3 ≈ 0,333 dan 1/2 = 0,5; 5/12 ≈ 0,417 ada di antaranya.' },
    { q: 'Bentuk persen (%) dari pecahan biasa 3/8 adalah...',
      options: ['37,5%', '35,0%', '32,5%', '30,0%'], answer: 0,
      why: '3/8 = 0,375 = 37,5%.' },
    { q: 'Perhatikan kesetaraan berikut: (i) 3/5 = 0,6 (ii) 45% = 9/20 (iii) 0,25 = 1/5 (iv) 4/25 = 16%. Hubungan yang tidak senilai ditunjukkan oleh...',
      options: ['(i)', '(ii)', '(iii)', '(iv)'], answer: 2,
      why: '(iii) salah: 0,25 = 1/4, bukan 1/5. Yang lain senilai.' },
    { q: 'Urutan bilangan rasional 0,65; 5/8; 60%; 2/3 dari yang terkecil adalah...',
      options: ['60%; 5/8; 0,65; 2/3', '5/8; 60%; 0,65; 2/3', '60%; 0,65; 5/8; 2/3', '2/3; 0,65; 5/8; 60%'], answer: 0,
      why: '60% = 0,6; 5/8 = 0,625; 0,65; 2/3 ≈ 0,667.' },
    { q: 'Hasil dari operasi hitung campuran (3/4) × 0,8 ÷ 20% adalah...',
      options: ['1,5', '2,0', '3,0', '4,5'], answer: 2,
      why: '(3/4) = 0,75; 0,75 × 0,8 = 0,6; 20% = 0,2; 0,6 ÷ 0,2 = 3.' },
    { q: 'Nilai persentase 15% dari uang sebesar Rp240.000,00 adalah...',
      options: ['Rp32.000', 'Rp36.000', 'Rp40.000', 'Rp48.000'], answer: 1,
      why: '15% × 240.000 = 36.000.' },
    { q: 'Ibu membeli 2 ½ kg tepung terigu. Kemudian Ibu membeli lagi tepung terigu sebanyak 1,75 kg. Jumlah seluruh tepung terigu yang dibeli Ibu adalah...',
      options: ['3,75 kg', '4,15 kg', '4,25 kg', '4,50 kg'], answer: 2,
      why: '2 ½ kg = 2,5 kg; 2,5 + 1,75 = 4,25 kg.' },
    { q: 'Pak Budi membeli motor bekas seharga Rp5.000.000,00. Setelah diperbaiki dengan biaya Rp500.000,00, motor dijual kembali seharga Rp5.200.000,00. Pernyataan yang benar adalah...',
      options: ['Pak Budi untung Rp300.000,00', 'Pak Budi rugi Rp300.000,00', 'Pak Budi untung Rp200.000,00', 'Pak Budi rugi Rp200.000,00'], answer: 1,
      why: 'Modal = 5.000.000 + 500.000 = 5.500.000; dijual 5.200.000, jadi rugi 300.000.' },
    { q: 'Seorang pedagang membeli sekeranjang buah seharga Rp200.000,00. Jika pedagang menginginkan keuntungan sebesar 15%, maka harga penjualan seluruh buah tersebut adalah...',
      options: ['Rp215.000', 'Rp225.000', 'Rp230.000', 'Rp240.000'], answer: 2,
      why: 'Harga jual = 200.000 × (1 + 15%) = 200.000 × 1,15 = 230.000.' },
    { q: 'Jarak Kota A dan Kota B pada peta adalah 4 cm, sedangkan jarak sebenarnya adalah 80 km. Skala pada peta tersebut adalah...',
      options: ['1 : 200.000', '1 : 500.000', '1 : 2.000.000', '1 : 5.000.000'], answer: 2,
      why: '80 km = 8.000.000 cm; 4 : 8.000.000 = 1 : 2.000.000.' },
    { q: 'Skala peta adalah 1 : 500.000. Jika jarak dua tempat pada peta 6 cm, maka jarak sebenarnya adalah...',
      options: ['3 km', '30 km', '300 km', '3.000 km'], answer: 1,
      why: '6 × 500.000 = 3.000.000 cm = 30 km.' },
    { q: 'Jarak sebenarnya dua kecamatan adalah 15 km. Digambar pada peta skala 1 : 300.000. Jarak pada peta adalah...',
      options: ['3 cm', '5 cm', '6 cm', '10 cm'], answer: 1,
      why: '15 km = 1.500.000 cm; 1.500.000 ÷ 300.000 = 5 cm.' },
    { q: 'Rasio kelereng Andi dan Budi adalah 3 : 5. Jika jumlah kelereng mereka berdua 40 butir, banyak kelereng Budi adalah...',
      options: ['15 butir', '20 butir', '25 butir', '30 butir'], answer: 2,
      why: 'Budi = 5/(3 + 5) × 40 = 5/8 × 40 = 25 butir.' },
    { q: 'Di kelas terdapat 18 siswa laki-laki dan 12 siswa perempuan. Rasio paling sederhana antara siswa perempuan dan seluruh siswa adalah...',
      options: ['2 : 3', '2 : 5', '3 : 2', '3 : 5'], answer: 1,
      why: 'Perempuan : seluruh siswa = 12 : 30 = 2 : 5.' },
    { q: 'Harga 3 kg beras adalah Rp36.000,00. Harga 7 kg beras sejenis adalah...',
      options: ['Rp72.000', 'Rp81.000', 'Rp84.000', 'Rp96.000'], answer: 2,
      why: '1 kg = 36.000 ÷ 3 = 12.000; 7 kg = 7 × 12.000 = 84.000.' }
  ];
  /* Kunci PG (huruf): C A B A C B A C A C B C B C C B B C B C */

  var BS = [
    { q: 'Bilangan Bulat: a × (b + c) = (a × b) + (a × c) merupakan penerapan sifat distributif perkalian terhadap penjumlahan.',
      answer: true, why: 'Itulah bunyi sifat distributif perkalian terhadap penjumlahan.' },
    { q: 'Bilangan Bulat: Daftar seluruh faktor positif dari bilangan 18 adalah 1, 2, 3, 6, dan 18.',
      answer: false, why: 'Faktor positif 18 yang benar: 1, 2, 3, 6, 9, 18 — angka 9 tertinggal.' },
    { q: 'Bilangan Rasional: Nilai pecahan 3/7 lebih kecil daripada pecahan 4/9.',
      answer: true, why: '3/7 = 27/63 dan 4/9 = 28/63; 27/63 < 28/63.' },
    { q: 'Aritmetika Sosial: Tabungan bunga tunggal 6%/tahun. Setelah 1 tahun menjadi Rp2.120.000,00, maka modal awalnya Rp2.000.000,00.',
      answer: true, why: '2.000.000 + 6% × 2.000.000 = 2.000.000 + 120.000 = 2.120.000.' },
    { q: 'Rasio: Mobil butuh 4 liter bensin untuk 48 km. Jika diisi 7 liter bensin, jarak yang ditempuh adalah 80 km.',
      answer: false, why: '1 liter = 48 ÷ 4 = 12 km; 7 liter = 7 × 12 = 84 km, bukan 80 km.' }
  ];

  var MATCH_OPTS = [
    { l: 'A', t: '8' }, { l: 'B', t: '32' }, { l: 'C', t: '4 ¼' },
    { l: 'D', t: '25%' }, { l: 'E', t: '480 gram' },
    { l: 'F', t: '-8' }, { l: 'G', t: '20%' }
  ];
  var MATCH = [
    { q: 'Hasil dari -15 - (-23) adalah ...', answer: 'A',
      why: '-15 - (-23) = -15 + 23 = 8.' },
    { q: 'Hasil operasi hitung (-48) ÷ 6 × (-4) adalah ...', answer: 'B',
      why: '(-48) ÷ 6 = -8; -8 × (-4) = 32.' },
    { q: 'Hasil penjumlahan pecahan 1 ¾ + 2 ½ adalah ...', answer: 'C',
      why: '1 ¾ + 2 ½ = 7/4 + 5/2 = 7/4 + 10/4 = 17/4 = 4 ¼.' },
    { q: 'Beli barang Rp80.000,00, jual Rp100.000,00. Persentase untung = ...', answer: 'D',
      why: 'Untung = 100.000 - 80.000 = 20.000; 20.000 ÷ 80.000 = 25%.' },
    { q: '5 porsi kue butuh 200 g gula. Gula untuk 12 porsi kue = ...', answer: 'E',
      why: '1 porsi = 200 ÷ 5 = 40 g; 12 porsi = 12 × 40 = 480 gram.' }
  ];

  var ISIAN = [
    { q: 'Suhu awal dalam freezer adalah -4°C. Saat listrik padam, suhu naik 3°C setiap 20 menit. Suhu freezer setelah listrik padam selama 1 jam (60 menit) adalah ... °C.',
      accepted: ['5'], why: '60 ÷ 20 = 3 kali kenaikan; 3 × 3°C = 9°C; -4 + 9 = 5°C.' },
    { q: 'Panitia membagikan bantuan 36 kg beras, 48 bungkus mie, dan 60 kaleng susu secara merata kepada keluarga penerima. Banyak keluarga terbanyak yang menerima bantuan adalah ... keluarga.',
      accepted: ['12'], why: 'FPB dari 36, 48, dan 60 adalah 12.' },
    { q: 'Hasil dari operasi hitung campuran pecahan dan desimal (3/5) + 1,2 ÷ 0,4 adalah ...',
      accepted: ['3,6', '3.6', '3 3/5', '3⅗', '3,60', '3.60'], why: '1,2 ÷ 0,4 = 3; 3/5 = 0,6; 0,6 + 3 = 3,6 (atau 3 ⅗).' },
    { q: 'Ayah menabung Rp4.000.000,00. Setelah 1 tahun, jumlah tabungannya menjadi Rp4.320.000,00. Persentase bunga tunggal per tahun dari bank tersebut adalah ... %.',
      accepted: ['8'], why: 'Bunga = 4.320.000 - 4.000.000 = 320.000; 320.000 ÷ 4.000.000 = 8%.' },
    { q: 'Pembangunan gedung selesai dalam 20 hari oleh 12 pekerja. Jika ingin selesai dalam waktu 15 hari, maka banyak pekerja yang dibutuhkan adalah ... orang.',
      accepted: ['16'], why: 'Total beban = 20 × 12 = 240 hari-pekerja; 240 ÷ 15 = 16 orang.' }
  ];

  var URAIAN = [
    { q: 'Sistem Skor Kompetisi (Bilangan Bulat): Aturan penskoran: Jawaban benar = +4, Salah = -2, Tidak dijawab = -1. Dari 50 soal, Ahmad menjawab benar 38 soal, tidak menjawab 5 soal, dan sisanya salah. a. Hitunglah total skor yang diperoleh Ahmad! b. Jika syarat minimum lulus adalah skor 130, apakah Ahmad dinyatakan lulus? Berikan alasannya!',
      why: 'Salah = 50 − (38 + 5) = 7 soal. Skor benar = 38 × 4 = 152; skor salah = 7 × (−2) = −14; skor kosong = 5 × (−1) = −5. Total = 152 − 14 − 5 = 133. LULUS, karena 133 ≥ 130.' },
    { q: 'Jadwal Latihan Bersama (KPK Bilangan Bulat): Ridho latihan renang setiap 4 hari sekali, Dani setiap 6 hari sekali, dan Hendra setiap 8 hari sekali. Jika pada hari Sabtu, 5 Oktober 2024 mereka berenang bersama untuk pertama kalinya, pada hari dan tanggal berapakah mereka akan berenang bersama untuk kedua kalinya?',
      why: 'Faktorisasi: 4 = 2², 6 = 2 × 3, 8 = 2³ → KPK = 2³ × 3 = 24 hari. Tanggal: 5 Oktober + 24 hari = 29 Oktober 2024. Hari: 24 ÷ 7 = 3 sisa 3 hari; 3 hari setelah Sabtu adalah Selasa. Jawaban: Selasa, 29 Oktober 2024.' },
    { q: 'Pembagian Tanah Warisan (Bilangan Rasional): Pak Hasan memiliki tanah seluas 1.200 m². Tanah dibagikan: Anak I mendapat 1/3 bagian, Anak II mendapat 25% bagian, Anak III mendapat 0,2 bagian, dan sisanya dibuat taman. a. Tentukan luas tanah yang diterima masing-masing anak! b. Tentukan luas tanah yang digunakan untuk taman!',
      why: 'Anak I = ⅓ × 1.200 = 400 m²; Anak II = 25% × 1.200 = 300 m²; Anak III = 0,2 × 1.200 = 240 m². Total anak = 400 + 300 + 240 = 940 m²; taman = 1.200 − 940 = 260 m².' },
    { q: 'Perhitungan Diskon Toko (Aritmetika Sosial): Nadia membeli baju seharga Rp150.000,00 (diskon 20%) dan sepatu seharga Rp250.000,00 (diskon 30%). Hitunglah total uang yang harus dibayarkan oleh Nadia!',
      why: 'Baju: diskon 20% × 150.000 = 30.000 → bayar Rp120.000,00. Sepatu: diskon 30% × 250.000 = 75.000 → bayar Rp175.000,00. Total bayar = 120.000 + 175.000 = Rp295.000,00.' },
    { q: 'Proyek Pembangunan (Perbandingan Berbalik Nilai): Pemborong memperkirakan proyek jembatan selesai 30 hari dengan 12 pekerja. Setelah bekerja 10 hari, proyek terhenti 4 hari karena hujan lebat. Agar jembatan selesai tepat waktu sesuai jadwal semula, berapa banyak tambahan pekerja yang dibutuhkan?',
      why: 'Total beban = 30 hari × 12 pekerja = 360 hari-pekerja. Selesai (10 hari) = 10 × 12 = 120 → sisa beban = 360 − 120 = 240 hari-pekerja. Sisa waktu = (30 − 10) − 4 hari libur = 16 hari → pekerja butuh = 240 ÷ 16 = 15 orang. Tambahan pekerja = 15 − 12 = 3 orang pekerja.' }
  ];

  var LETTERS = ['A', 'B', 'C', 'D'];
  var MAX = { pg: 40, bs: 10, match: 10, isian: 10, uraian: 30 };

  /* ---------- State (tersimpan) ---------- */
  var answers = { pg: {}, bs: {}, match: {}, isian: {}, uraianText: {}, uraianScore: {} };
  try {
    var savedA = JSON.parse(read('mpi-asas-answers', 'null'));
    if (savedA) answers = savedA;
  } catch (e) { /* abaikan */ }
  var scores = { pg: null, bs: null, match: null, isian: null, uraian: null };
  try {
    var savedS = JSON.parse(read('mpi-asas-scores', 'null'));
    if (savedS) scores = savedS;
  } catch (e) { /* abaikan */ }

  function saveAnswers() { store('mpi-asas-answers', JSON.stringify(answers)); }
  function saveScores() { store('mpi-asas-scores', JSON.stringify(scores)); }

  /* ---------- Progres bagian ---------- */
  var SUBS = ['sub1', 'sub2', 'sub3', 'sub4', 'sub5', 'sub6'];
  var visited = [];
  try { visited = JSON.parse(read('mpi-asas-visited', '[]')) || []; } catch (e) { visited = []; }
  if (!Array.isArray(visited)) visited = [];

  function saveVisited() { store('mpi-asas-visited', JSON.stringify(visited)); }
  function renderProgress() {
    var pct = Math.round((visited.length / SUBS.length) * 100);
    var text = $('progressText');
    if (text) text.textContent = 'Progres: ' + visited.length + ' dari 6 bagian (' + pct + '%)';
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

  /* Skor terbaik di header */
  var bestStored = read('mpi-asas-best', null);
  var bestEl = $('quizBestText');
  if (bestStored !== null && bestEl) {
    bestEl.textContent = 'Skor terbaik ASAS: ' + bestStored + '/100';
    bestEl.hidden = false;
  }

  /* ---------- Render Bagian I: Pilihan Ganda ---------- */
  function renderPG() {
    var box = $('pgBox');
    if (!box) return;
    box.innerHTML = '';
    PG.forEach(function (item, i) {
      var div = document.createElement('div');
      div.className = 'soal';
      div.id = 'pg-' + i;
      var html = '<p class="soal-q">' + (i + 1) + '. ' + esc(item.q) + '</p><div class="pg-opts" role="group" aria-label="Pilihan jawaban soal ' + (i + 1) + '">';
      item.options.forEach(function (opt, idx) {
        var pressed = answers.pg[i] === idx ? ' aria-pressed="true"' : ' aria-pressed="false"';
        html += '<button type="button" class="opt-btn" data-i="' + i + '" data-opt="' + idx + '"' + pressed + '><span class="letter">' + LETTERS[idx] + '</span><span>' + esc(opt) + '</span></button>';
      });
      html += '</div><p class="kunci"></p><p class="pembahasan"></p>';
      div.innerHTML = html;
      box.appendChild(div);
    });
    box.querySelectorAll('.opt-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var i = Number(btn.getAttribute('data-i'));
        var idx = Number(btn.getAttribute('data-opt'));
        answers.pg[i] = idx;
        saveAnswers();
        var row = $('pg-' + i);
        row.querySelectorAll('.opt-btn').forEach(function (b) {
          b.setAttribute('aria-pressed', b === btn ? 'true' : 'false');
        });
      });
    });
  }

  function checkPG(silent) {
    var benar = 0;
    PG.forEach(function (item, i) {
      var row = $('pg-' + i);
      var picked = answers.pg[i];
      var ok = picked === item.answer;
      if (ok) benar++;
      var kunci = row.querySelector('.kunci');
      var bahas = row.querySelector('.pembahasan');
      kunci.textContent = 'Kunci: ' + LETTERS[item.answer] + ' — ' + item.options[item.answer];
      kunci.classList.add('show');
      bahas.textContent = 'Pembahasan: ' + item.why;
      bahas.classList.add('show');
      row.classList.remove('ok', 'no');
      row.classList.add(ok ? 'ok' : 'no');
      row.querySelectorAll('.opt-btn').forEach(function (b, idx) {
        b.disabled = true;
        if (idx === item.answer) b.classList.add('correct');
        else if (idx === picked) b.classList.add('wrong');
      });
    });
    scores.pg = benar * 2;
    saveScores();
    var el = $('pgScore');
    if (el) el.textContent = 'Skor Bagian I: ' + scores.pg + ' / 40 (' + benar + ' dari 20 soal benar)';
    if (!silent) showFb($('pgFb'), benar >= 14,
      benar === 20 ? 'Sempurna! Semua jawaban pilihan ganda benar.'
      : 'Bagian I diperiksa: ' + benar + ' dari 20 soal benar. Lihat kunci dan pembahasan tiap soal di atas.');
    markVisited('sub1');
    updateTotal();
  }

  /* ---------- Render Bagian II: Benar / Salah ---------- */
  function renderBS() {
    var box = $('bsBox');
    if (!box) return;
    box.innerHTML = '';
    BS.forEach(function (item, i) {
      var div = document.createElement('div');
      div.className = 'soal';
      div.id = 'bs-' + i;
      var picked = answers.bs[i];
      div.innerHTML = '<p class="soal-q">' + (i + 1) + '. ' + esc(item.q) + '</p>' +
        '<div class="bs-opts" role="group" aria-label="Pilih BENAR atau SALAH soal ' + (i + 1) + '">' +
        '<button type="button" class="btn btn-ghost" data-i="' + i + '" data-val="true"' + (picked === true ? ' aria-pressed="true"' : ' aria-pressed="false"') + '>BENAR</button>' +
        '<button type="button" class="btn btn-ghost" data-i="' + i + '" data-val="false"' + (picked === false ? ' aria-pressed="true"' : ' aria-pressed="false"') + '>SALAH</button>' +
        '</div><p class="kunci"></p><p class="pembahasan"></p>';
      box.appendChild(div);
    });
    box.querySelectorAll('.bs-opts .btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var i = Number(btn.getAttribute('data-i'));
        var val = btn.getAttribute('data-val') === 'true';
        answers.bs[i] = val;
        saveAnswers();
        var row = $('bs-' + i);
        row.querySelectorAll('.bs-opts .btn').forEach(function (b) {
          var on = b === btn;
          b.setAttribute('aria-pressed', on ? 'true' : 'false');
          b.classList.toggle('picked-benarsalah', on);
        });
      });
    });
  }

  function checkBS(silent) {
    var benar = 0;
    BS.forEach(function (item, i) {
      var row = $('bs-' + i);
      var picked = answers.bs[i];
      var ok = picked === item.answer;
      if (ok) benar++;
      var kunci = row.querySelector('.kunci');
      var bahas = row.querySelector('.pembahasan');
      kunci.textContent = 'Kunci: ' + (item.answer ? 'BENAR' : 'SALAH');
      kunci.classList.add('show');
      bahas.textContent = 'Pembahasan: ' + item.why;
      bahas.classList.add('show');
      row.classList.remove('ok', 'no');
      row.classList.add(ok ? 'ok' : 'no');
      row.querySelectorAll('.bs-opts .btn').forEach(function (b) {
        b.disabled = true;
        var val = b.getAttribute('data-val') === 'true';
        if (val === item.answer) b.classList.add('btn-primary');
        else if (val === picked) b.classList.add('btn-amber');
      });
    });
    scores.bs = benar * 2;
    saveScores();
    var el = $('bsScore');
    if (el) el.textContent = 'Skor Bagian II: ' + scores.bs + ' / 10 (' + benar + ' dari 5 soal benar)';
    if (!silent) showFb($('bsFb'), benar >= 4,
      benar === 5 ? 'Sempurna! Semua pernyataan benar/salah dijawab tepat.'
      : 'Bagian II diperiksa: ' + benar + ' dari 5 soal benar. Lihat kunci dan pembahasan tiap soal di atas.');
    markVisited('sub2');
    updateTotal();
  }

  /* ---------- Render Bagian III: Menjodohkan ---------- */
  function renderMatch() {
    var box = $('matchBox');
    if (!box) return;
    box.innerHTML = '';
    MATCH.forEach(function (item, i) {
      var div = document.createElement('div');
      div.className = 'soal match-row';
      div.id = 'match-' + i;
      var opts = '<option value="">— Pilih huruf —</option>';
      MATCH_OPTS.forEach(function (o) {
        opts += '<option value="' + o.l + '"' + (answers.match[i] === o.l ? ' selected' : '') + '>' + o.l + ' — ' + o.t + '</option>';
      });
      div.innerHTML = '<p class="soal-q">' + (i + 1) + '. ' + esc(item.q) + '</p>' +
        '<select aria-label="Jawaban menjodohkan soal ' + (i + 1) + '">' + opts + '</select>' +
        '<p class="kunci"></p><p class="pembahasan"></p>';
      box.appendChild(div);
    });
    box.querySelectorAll('select').forEach(function (sel, i) {
      sel.addEventListener('change', function () {
        answers.match[i] = sel.value || null;
        saveAnswers();
      });
    });
  }

  function checkMatch(silent) {
    var benar = 0;
    MATCH.forEach(function (item, i) {
      var row = $('match-' + i);
      var picked = answers.match[i];
      var ok = picked === item.answer;
      if (ok) benar++;
      var kunci = row.querySelector('.kunci');
      var bahas = row.querySelector('.pembahasan');
      var ansText = '';
      MATCH_OPTS.forEach(function (o) { if (o.l === item.answer) ansText = o.t; });
      kunci.textContent = 'Kunci: ' + item.answer + ' (' + ansText + ')';
      kunci.classList.add('show');
      bahas.textContent = 'Pembahasan: ' + item.why;
      bahas.classList.add('show');
      row.classList.remove('ok', 'no');
      row.classList.add(ok ? 'ok' : 'no');
      var sel = row.querySelector('select');
      if (sel) sel.disabled = true;
    });
    scores.match = benar * 2;
    saveScores();
    var el = $('matchScore');
    if (el) el.textContent = 'Skor Bagian III: ' + scores.match + ' / 10 (' + benar + ' dari 5 soal benar)';
    if (!silent) showFb($('matchFb'), benar >= 4,
      benar === 5 ? 'Sempurna! Semua pasangan menjodohkan tepat.'
      : 'Bagian III diperiksa: ' + benar + ' dari 5 soal benar. Lihat kunci dan pembahasan tiap soal di atas.');
    markVisited('sub3');
    updateTotal();
  }

  /* ---------- Render Bagian IV: Isian Singkat ---------- */
  function normIsian(s) {
    if (s === null || s === undefined) return '';
    var t = String(s).toLowerCase().trim().replace(/\s+/g, ' ');
    t = t.replace(/°c/g, '').replace(/%/g, '');
    t = t.replace(/\s*c$/, '');
    return t.trim();
  }

  function renderIsian() {
    var box = $('isianBox');
    if (!box) return;
    box.innerHTML = '';
    ISIAN.forEach(function (item, i) {
      var div = document.createElement('div');
      div.className = 'soal isian-row';
      div.id = 'isian-' + i;
      var val = answers.isian[i] !== undefined && answers.isian[i] !== null ? answers.isian[i] : '';
      div.innerHTML = '<p class="soal-q">' + (i + 1) + '. ' + esc(item.q) + '</p>' +
        '<input type="text" inputmode="decimal" aria-label="Jawaban isian soal ' + (i + 1) + '" value="' + esc(val) + '" placeholder="Tulis jawaban singkat" />' +
        '<p class="kunci"></p><p class="pembahasan"></p>';
      box.appendChild(div);
    });
    box.querySelectorAll('input').forEach(function (inp, i) {
      inp.addEventListener('input', function () {
        answers.isian[i] = inp.value;
        saveAnswers();
      });
    });
  }

  function checkIsian(silent) {
    var benar = 0;
    ISIAN.forEach(function (item, i) {
      var row = $('isian-' + i);
      var raw = answers.isian[i];
      var norm = normIsian(raw);
      var ok = item.accepted.some(function (a) { return normIsian(a) === norm; });
      if (ok) benar++;
      var kunci = row.querySelector('.kunci');
      var bahas = row.querySelector('.pembahasan');
      kunci.textContent = 'Kunci: ' + item.accepted[0];
      kunci.classList.add('show');
      bahas.textContent = 'Pembahasan: ' + item.why;
      bahas.classList.add('show');
      row.classList.remove('ok', 'no');
      row.classList.add(ok ? 'ok' : 'no');
      var inp = row.querySelector('input');
      if (inp) inp.disabled = true;
    });
    scores.isian = benar * 2;
    saveScores();
    var el = $('isianScore');
    if (el) el.textContent = 'Skor Bagian IV: ' + scores.isian + ' / 10 (' + benar + ' dari 5 soal benar)';
    if (!silent) showFb($('isianFb'), benar >= 4,
      benar === 5 ? 'Sempurna! Semua isian singkat tepat.'
      : 'Bagian IV diperiksa: ' + benar + ' dari 5 soal benar. Lihat kunci dan pembahasan tiap soal di atas.');
    markVisited('sub4');
    updateTotal();
  }

  /* ---------- Render Bagian V: Uraian ---------- */
  function renderUraian() {
    var box = $('uraianBox');
    if (!box) return;
    box.innerHTML = '';
    URAIAN.forEach(function (item, i) {
      var div = document.createElement('div');
      div.className = 'soal';
      div.id = 'uraian-' + i;
      var txt = answers.uraianText[i] || '';
      var sc = answers.uraianScore[i];
      div.innerHTML = '<p class="soal-q">' + (i + 1) + '. ' + esc(item.q) + '</p>' +
        '<div class="uraian-jawab"><label class="f-label" for="ur-txt-' + i + '">Jawabanmu (tulis langkah-langkahnya):</label>' +
        '<textarea id="ur-txt-' + i + '" placeholder="Tulis langkah penyelesaian lengkap di sini...">' + esc(txt) + '</textarea></div>' +
        '<div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:12px">' +
        '<button type="button" class="btn btn-ghost" data-bahas="' + i + '">Lihat Pembahasan</button></div>' +
        '<div class="pembahasan-box" id="ur-bahas-' + i + '"><p><strong>Pembahasan &amp; rubrik:</strong></p><p>' + esc(item.why) + '</p><p class="muted small">Beri skor 0–6 sesuai rubrik: 6 = langkah lengkap dan jawaban benar; 4–5 = langkah hampir lengkap, ada kekeliruan kecil; 2–3 = sebagian langkah benar; 0–1 = jawaban salah atau kosong.</p></div>' +
        '<div class="uraian-skor"><label for="ur-skor-' + i + '">Skor saya (0–6):</label>' +
        '<input type="number" id="ur-skor-' + i + '" min="0" max="6" step="1" value="' + (sc === undefined || sc === null ? '' : sc) + '" placeholder="0–6" /></div>';
      box.appendChild(div);
    });
    box.querySelectorAll('textarea').forEach(function (ta, i) {
      ta.addEventListener('input', function () {
        answers.uraianText[i] = ta.value;
        saveAnswers();
      });
    });
    box.querySelectorAll('[data-bahas]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var i = btn.getAttribute('data-bahas');
        var b = $('ur-bahas-' + i);
        if (!b) return;
        var show = !b.classList.contains('show');
        b.classList.toggle('show', show);
        btn.textContent = show ? 'Sembunyikan Pembahasan' : 'Lihat Pembahasan';
      });
    });
    box.querySelectorAll('input[type="number"]').forEach(function (inp, i) {
      inp.addEventListener('input', function () {
        var v = Number(inp.value);
        if (inp.value === '') { answers.uraianScore[i] = null; }
        else if (Number.isFinite(v)) { answers.uraianScore[i] = Math.max(0, Math.min(6, Math.round(v))); }
        saveAnswers();
      });
    });
  }

  function saveUraian(silent) {
    var total = 0;
    var filled = 0;
    URAIAN.forEach(function (item, i) {
      var inp = $('ur-skor-' + i);
      var v = inp ? Number(inp.value) : NaN;
      if (inp && inp.value !== '' && Number.isFinite(v)) {
        v = Math.max(0, Math.min(6, Math.round(v)));
        inp.value = String(v);
        answers.uraianScore[i] = v;
        total += v;
        filled++;
      } else {
        answers.uraianScore[i] = 0;
      }
    });
    saveAnswers();
    scores.uraian = total;
    saveScores();
    var el = $('uraianScore');
    if (el) el.textContent = 'Skor Bagian V (mandiri): ' + scores.uraian + ' / 30 (' + filled + ' dari 5 soal diberi skor)';
    if (!silent) showFb($('uraianFb'), true,
      'Skor uraian tersimpan: ' + scores.uraian + ' / 30. Nilai dirimu dengan jujur — bandingkan tiap langkahmu dengan pembahasan di atas.');
    markVisited('sub5');
    updateTotal();
  }

  /* ---------- Hasil akhir ---------- */
  function updateTotal() {
    var tPg = $('tPg'), tBs = $('tBs'), tMatch = $('tMatch'), tIsian = $('tIsian'), tUraian = $('tUraian'), tTotal = $('tTotal');
    function cell(el, v, max) { if (el) el.textContent = v === null ? '—' : v + ' / ' + max; }
    cell(tPg, scores.pg, MAX.pg);
    cell(tBs, scores.bs, MAX.bs);
    cell(tMatch, scores.match, MAX.match);
    cell(tIsian, scores.isian, MAX.isian);
    cell(tUraian, scores.uraian, MAX.uraian);
    var done = ['pg', 'bs', 'match', 'isian', 'uraian'].filter(function (k) { return scores[k] !== null; }).length;
    var total = 0;
    ['pg', 'bs', 'match', 'isian', 'uraian'].forEach(function (k) { if (scores[k] !== null) total += scores[k]; });
    var totalEl = $('hasilTotal');
    var ring = $('hasilRing');
    var msg = $('hasilMsg');
    if (done === 0) {
      if (totalEl) totalEl.textContent = '—/100';
      if (ring) ring.style.setProperty('--p', '0%');
      if (msg) msg.textContent = 'Kerjakan dulu bagian-bagiannya, lalu tekan “Periksa Jawaban”.';
      if (tTotal) tTotal.textContent = '—';
    } else {
      if (totalEl) totalEl.textContent = total + '/100';
      if (ring) ring.style.setProperty('--p', total + '%');
      if (tTotal) tTotal.textContent = String(total);
      if (msg) {
        msg.textContent = done < 5
          ? 'Baru ' + done + ' dari 5 bagian diperiksa — total sementara ' + total + '/100. Lanjutkan bagian yang belum diperiksa.'
          : total === 100 ? 'Sempurna! Skor 100/100 — kamu siap menghadapi ASAS.'
          : total >= 85 ? 'Luar biasa! Skor ' + total + '/100 — tinggal sedikit lagi menuju sempurna.'
          : total >= 70 ? 'Bagus! Skor ' + total + '/100 — ulangi soal yang masih salah, lalu coba lagi.'
          : total >= 50 ? 'Cukup! Skor ' + total + '/100 — buka lagi modul-modul Kelas 7 yang terkait, lalu ulangi latihan ini.'
          : 'Terus berlatih! Skor ' + total + '/100 — pelajari pembahasan tiap soal, lalu ulangi latihan ini.';
      }
      if (done === 5) {
        var prevBest = read('mpi-asas-best', null);
        var prevNum = prevBest === null ? -1 : Number(prevBest);
        if (total > prevNum) store('mpi-asas-best', String(total));
        var bestNow = Math.max(total, prevNum);
        var bestLine = $('hasilBestLine');
        if (bestLine) bestLine.textContent = 'Skor terbaikmu: ' + bestNow + '/100. Skor ini tersimpan di perangkat ini.';
        if (bestEl) {
          bestEl.textContent = 'Skor terbaik ASAS: ' + bestNow + '/100';
          bestEl.hidden = false;
        }
        markVisited('sub6');
      }
    }
  }

  /* ---------- Pasang tombol ---------- */
  renderPG();
  renderBS();
  renderMatch();
  renderIsian();
  renderUraian();

  var pgBtn = $('pgCheck');
  if (pgBtn) pgBtn.addEventListener('click', function () { checkPG(false); });
  var bsBtn = $('bsCheck');
  if (bsBtn) bsBtn.addEventListener('click', function () { checkBS(false); });
  var matchBtn = $('matchCheck');
  if (matchBtn) matchBtn.addEventListener('click', function () { checkMatch(false); });
  var isianBtn = $('isianCheck');
  if (isianBtn) isianBtn.addEventListener('click', function () { checkIsian(false); });
  var uraianBtn = $('uraianSave');
  if (uraianBtn) uraianBtn.addEventListener('click', function () { saveUraian(false); });

  /* Pulihkan tampilan bagian yang sudah diperiksa sebelumnya */
  if (scores.pg !== null) checkPG(true);
  if (scores.bs !== null) checkBS(true);
  if (scores.match !== null) checkMatch(true);
  if (scores.isian !== null) checkIsian(true);
  if (scores.uraian !== null) saveUraian(true);
  updateTotal();

  var resetBtn = $('resetBtn');
  if (resetBtn) {
    resetBtn.addEventListener('click', function () {
      if (!window.confirm('Hapus semua jawaban dan skor latihan ASAS di perangkat ini, lalu mulai dari awal?')) return;
      ['mpi-asas-answers', 'mpi-asas-scores', 'mpi-asas-best', 'mpi-asas-visited'].forEach(function (k) {
        try { localStorage.removeItem(k); } catch (e) { /* abaikan */ }
      });
      window.location.reload();
    });
  }
})();
