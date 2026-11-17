/* P.1 Bangun Ruang Sisi Datar — script.js (vanilla JS, tanpa framework).
   localStorage: mpi-p1-visited, mpi-p1-quiz-best, mpi-p1-refleksi. */
(function () {
  'use strict';
  function $(id) { return document.getElementById(id); }
  function fmt(n) { return (n < 0 ? '\u2212' : '') + Math.abs(n); }
  function fmtDec(n, d) { var s = Number(n).toFixed(d === undefined ? 2 : d); return s.replace('.', ',').replace('-', '\u2212'); }
  function parseNum(el) { if (!el) return null; var v = el.value === '' ? NaN : Number(String(el.value).replace(',', '.')); return Number.isFinite(v) ? v : null; }
  function showFb(el, ok, msg) { if (!el) return; el.textContent = msg; el.classList.remove('ok', 'no', 'show'); el.classList.add(ok ? 'ok' : 'no', 'show'); }
  function store(key, value) { try { localStorage.setItem(key, value); } catch (e) {} }
  function read(key, fallback) { try { var v = localStorage.getItem(key); return v === null ? fallback : v; } catch (e) { return fallback; } }
  var SUBS = ['sub1', 'sub2', 'sub3', 'sub4', 'sub5', 'sub6'];
  var visited = [];
  try { visited = JSON.parse(read('mpi-p1-visited', '[]')) || []; } catch (e) { visited = []; }
  if (!Array.isArray(visited)) visited = [];
  function saveVisited() { store('mpi-p1-visited', JSON.stringify(visited)); }
  function renderProgress() {
    var pct = Math.round((visited.length / SUBS.length) * 100);
    var text = $('progressText'); if (text) text.textContent = 'Progres: ' + visited.length + ' dari 6 sub-bab (' + pct + '%)';
    var fill = $('progressFill'); if (fill) fill.style.width = pct + '%';
    var bar = $('progressBar'); if (bar) bar.setAttribute('aria-valuenow', String(pct));
    document.querySelectorAll('[data-sub]').forEach(function (a) { a.classList.toggle('done', visited.indexOf(a.getAttribute('data-sub')) !== -1); });
  }
  function markVisited(id) { if (visited.indexOf(id) === -1) { visited.push(id); saveVisited(); renderProgress(); } }
  document.querySelectorAll('[data-sub]').forEach(function (a) { a.addEventListener('click', function () { markVisited(a.getAttribute('data-sub')); }); });
  if ('IntersectionObserver' in window) { var io = new IntersectionObserver(function (entries) { entries.forEach(function (en) { if (en.isIntersecting) markVisited(en.target.id); }); }, { rootMargin: '-20% 0px -60% 0px' }); SUBS.forEach(function (id) { var s = $(id); if (s) io.observe(s); }); }
  renderProgress();
  var bestStored = read('mpi-p1-quiz-best', null);
  var bestEl = $('quizBestText');
  if (bestStored !== null && bestEl) { bestEl.textContent = 'Skor terbaik kuis: ' + bestStored + '/10'; bestEl.hidden = false; }

  /* Kalkulator kubus / balok / prisma segitiga / limas segiempat */
  function hitungP1() {
    var jenis = $('calcBangun') ? $('calcBangun').value : 'kubus';
    var s = parseNum($('calcS')), p = parseNum($('calcP')), l = parseNum($('calcL')), t = parseNum($('calcT'));
    var h = $('calcHasil'), lg = $('calcLangkah');
    if (!h) return;
    var lp, v, ket;
    if (jenis === 'kubus') {
      if (s === null || s <= 0) { h.textContent = 'Isi sisi kubus (bilangan positif).'; if (lg) lg.textContent = ''; return; }
      lp = 6 * s * s; v = s * s * s; ket = 'Luas permukaan = 6 × s² = 6 × ' + s + '² = ' + lp + '. Volume = s³ = ' + s + '³ = ' + v + '.';
    } else if (jenis === 'balok') {
      if (p === null || l === null || t === null || p <= 0 || l <= 0 || t <= 0) { h.textContent = 'Isi panjang, lebar, dan tinggi balok.'; if (lg) lg.textContent = ''; return; }
      lp = 2 * (p * l + p * t + l * t); v = p * l * t; ket = 'Luas permukaan = 2(pl + pt + lt) = 2(' + (p*l) + ' + ' + (p*t) + ' + ' + (l*t) + ') = ' + lp + '. Volume = p × l × t = ' + v + '.';
    } else if (jenis === 'prisma') {
      if (s === null || t === null || p === null || s <= 0 || t <= 0 || p <= 0) { h.textContent = 'Isi alas segitiga, tinggi segitiga, dan panjang prisma.'; if (lg) lg.textContent = ''; return; }
      v = 0.5 * s * t * p; lp = s * t + 3 * s * p; ket = 'Volume = luas alas × panjang prisma = (½ × ' + s + ' × ' + t + ') × ' + p + ' = ' + v + '. (Luas permukaan di sini memakai prisma dengan ketiga sisi tegak berbentuk persegi panjang ' + s + ' × ' + p + '.)';
    } else {
      if (s === null || t === null || s <= 0 || t <= 0) { h.textContent = 'Isi sisi alas dan tinggi limas.'; if (lg) lg.textContent = ''; return; }
      v = (1 / 3) * s * s * t; lp = s * s + 2 * s * Math.sqrt(t * t + (s / 2) * (s / 2)); ket = 'Volume = ⅓ × luas alas × tinggi = ⅓ × ' + (s*s) + ' × ' + t + ' = ' + fmtDec(v, 2).replace(',00', '') + '.';
    }
    h.textContent = 'Lp = ' + fmtDec(lp, 2).replace(',00', '') + ' · V = ' + fmtDec(v, 2).replace(',00', '');
    if (lg) lg.textContent = ket;
  }
  var calcBtn = $('calcBtn');
  if (calcBtn) { calcBtn.addEventListener('click', hitungP1); }
  var calcBangun = $('calcBangun');
  if (calcBangun) calcBangun.addEventListener('change', function () {
    var j = calcBangun.value;
    ['rowS','rowP','rowL','rowT'].forEach(function (id) { var el = $(id); if (el) el.style.display = ''; });
    if (j === 'kubus') { ['rowP','rowL','rowT'].forEach(function (id) { var el = $(id); if (el) el.style.display = 'none'; }); }
    if (j === 'limas') { ['rowP','rowL'].forEach(function (id) { var el = $(id); if (el) el.style.display = 'none'; }); }
  });
  /* Slider balok: ubah ukuran, lihat volume */
  function renderBalok() {
    var p = Number($('blkP') ? $('blkP').value : 4), l = Number($('blkL') ? $('blkL').value : 3), t = Number($('blkT') ? $('blkT').value : 2);
    var pv = $('blkPVal'); if (pv) pv.textContent = p + ' cm';
    var lv = $('blkLVal'); if (lv) lv.textContent = l + ' cm';
    var tv = $('blkTVal'); if (tv) tv.textContent = t + ' cm';
    var h = $('blkHasil'); if (h) h.textContent = 'Volume = ' + p + ' × ' + l + ' × ' + t + ' = ' + (p * l * t) + ' cm³ · Luas permukaan = ' + (2 * (p * l + p * t + l * t)) + ' cm²';
  }
  ['blkP','blkL','blkT'].forEach(function (id) { var el = $(id); if (el) el.addEventListener('input', renderBalok); });
  renderBalok();

  /* ---------- Latihan ber-input jawaban ---------- */
  document.querySelectorAll('.qa-row').forEach(function (row) {
    var btn = row.querySelector('.qa-check'); var input = row.querySelector('.qa-input');
    var explain = row.querySelector('.qa-explain'); var fb = row.querySelector('.feedback');
    if (!btn || !input) return;
    btn.addEventListener('click', function () {
      var v = parseNum(input);
      if (v === null) { showFb(fb, false, 'Tulis dulu jawabanmu sebagai angka.'); return; }
      var answer = Number(String(row.getAttribute('data-answer')).replace(',', '.'));
      var ok = Math.abs(v - answer) < 0.011;
      row.classList.toggle('ok', ok); row.classList.toggle('no', !ok);
      showFb(fb, ok, ok ? 'Benar! Jawabannya ' + row.getAttribute('data-answer') + '.' : 'Belum tepat. Coba lagi, perhatikan langkah dan rumusnya.');
      if (explain) { explain.textContent = 'Pembahasan: ' + row.getAttribute('data-explain'); explain.classList.add('show'); }
    });
  });
  /* ---------- Kuis 10 soal ---------- */
  var QUIZ = [{"q": "Luas permukaan kubus dengan rusuk 4 cm adalah …", "options": ["96 cm²", "64 cm²", "48 cm²", "128 cm²"], "answer": 0, "why": "Lp = 6 × 4² = 6 × 16 = 96 cm²."}, {"q": "Volume balok 3 cm × 4 cm × 5 cm adalah …", "options": ["47 cm³", "60 cm³", "72 cm³", "94 cm³"], "answer": 1, "why": "V = 3 × 4 × 5 = 60 cm³."}, {"q": "Volume kubus dengan rusuk 5 cm adalah …", "options": ["100 cm³", "150 cm³", "125 cm³", "75 cm³"], "answer": 2, "why": "V = 5³ = 125 cm³."}, {"q": "Luas permukaan balok 2 cm × 3 cm × 4 cm adalah …", "options": ["24 cm²", "48 cm²", "26 cm²", "52 cm²"], "answer": 3, "why": "Lp = 2(2×3 + 2×4 + 3×4) = 2(6 + 8 + 12) = 52 cm²."}, {"q": "Volume prisma segitiga (alas 8 cm, tinggi segitiga 6 cm, panjang prisma 12 cm) adalah …", "options": ["144 cm³", "288 cm³", "576 cm³", "96 cm³"], "answer": 1, "why": "V = (½ × 8 × 6) × 12 = 24 × 12 = 288 cm³."}, {"q": "Volume limas segiempat (alas 6 cm × 6 cm, tinggi 4 cm) adalah …", "options": ["48 cm³", "96 cm³", "72 cm³", "144 cm³"], "answer": 0, "why": "V = ⅓ × 36 × 4 = 48 cm³."}, {"q": "Luas permukaan kubus dengan rusuk 7 cm adalah …", "options": ["196 cm²", "245 cm²", "343 cm²", "294 cm²"], "answer": 3, "why": "Lp = 6 × 7² = 6 × 49 = 294 cm²."}, {"q": "Volume balok 6 cm × 5 cm × 4 cm adalah …", "options": ["60 cm³", "90 cm³", "120 cm³", "150 cm³"], "answer": 2, "why": "V = 6 × 5 × 4 = 120 cm³."}, {"q": "Banyak sisi balok adalah …", "options": ["8", "6", "12", "4"], "answer": 1, "why": "Balok punya 6 sisi: alas, tutup, dan 4 sisi tegak."}, {"q": "Akuarium berbentuk balok 10 dm × 6 dm × 5 dm. Volumenya dalam liter adalah …", "options": ["150 liter", "200 liter", "250 liter", "300 liter"], "answer": 3, "why": "V = 10 × 6 × 5 = 300 dm³ = 300 liter."}];
  var qi = 0, qScore = 0, qAnswered = false;
  var letters = ['A', 'B', 'C', 'D'];
  function renderQuiz() {
    var item = QUIZ[qi];
    var qEl = $('quizQuestion'); if (qEl) qEl.textContent = (qi + 1) + '. ' + item.q;
    var prog = $('quizProgress'); if (prog) prog.textContent = 'Soal ' + (qi + 1) + ' dari 10';
    var live = $('quizScoreLive'); if (live) live.textContent = 'Skor sementara: ' + qScore;
    var box = $('quizOptions');
    if (box) { box.innerHTML = ''; item.options.forEach(function (opt, idx) { var btn = document.createElement('button'); btn.type = 'button'; btn.className = 'opt-btn'; btn.innerHTML = '<span class="letter">' + letters[idx] + '</span><span></span>'; btn.lastChild.textContent = opt; btn.addEventListener('click', function () { answerQuiz(idx, btn); }); box.appendChild(btn); }); }
    var fb = $('quizFb'); if (fb) { fb.textContent = ''; fb.className = 'feedback'; }
    var next = $('quizNext'); if (next) { next.disabled = true; next.textContent = qi === QUIZ.length - 1 ? 'Lihat Hasil \u2192' : 'Soal Berikutnya \u2192'; }
    qAnswered = false;
  }
  function answerQuiz(idx, btn) {
    if (qAnswered) return; qAnswered = true;
    var item = QUIZ[qi]; var ok = idx === item.answer; if (ok) qScore++;
    var live = $('quizScoreLive'); if (live) live.textContent = 'Skor sementara: ' + qScore;
    document.querySelectorAll('#quizOptions .opt-btn').forEach(function (b, i) { b.disabled = true; if (i === item.answer) b.classList.add('correct'); else if (i === idx) b.classList.add('wrong'); });
    showFb($('quizFb'), ok, (ok ? 'Benar! ' : 'Belum tepat. ') + item.why);
    var next = $('quizNext'); if (next) next.disabled = false;
  }
  function finishQuiz() {
    var box = $('quizBox'); var res = $('quizResult');
    if (box) box.hidden = true; if (res) res.hidden = false;
    var scoreEl = $('quizScore'); if (scoreEl) scoreEl.textContent = qScore + '/10';
    var ring = $('quizRing'); if (ring) ring.style.setProperty('--p', (qScore * 10) + '%');
    var msg = $('quizMsg');
    if (msg) msg.textContent = qScore === 10 ? 'Sempurna! Kamu menguasai materi ini.' : qScore >= 8 ? 'Hebat! Tinggal sedikit lagi menuju sempurna.' : qScore >= 6 ? 'Bagus! Ulangi bagian yang masih salah, lalu coba lagi.' : 'Terus berlatih! Buka lagi sub-bab sebelumnya, lalu ulangi kuisnya.';
    var prevBest = read('mpi-p1-quiz-best', null); var prevNum = prevBest === null ? -1 : Number(prevBest);
    if (qScore > prevNum) store('mpi-p1-quiz-best', String(qScore));
    var bestNow = Math.max(qScore, prevNum);
    var bestLine = $('quizBestLine'); if (bestLine) bestLine.textContent = 'Skor terbaikmu: ' + bestNow + '/10. Skor ini tersimpan di perangkat ini.';
    if (bestEl) { bestEl.textContent = 'Skor terbaik kuis: ' + bestNow + '/10'; bestEl.hidden = false; }
    markVisited('sub6');
  }
  var quizNext = $('quizNext');
  if (quizNext) quizNext.addEventListener('click', function () { if (!qAnswered) return; if (qi < QUIZ.length - 1) { qi++; renderQuiz(); } else finishQuiz(); });
  var quizRetry = $('quizRetry');
  if (quizRetry) quizRetry.addEventListener('click', function () { qi = 0; qScore = 0; qAnswered = false; var res = $('quizResult'); if (res) res.hidden = true; var box = $('quizBox'); if (box) box.hidden = false; renderQuiz(); });
  renderQuiz();
  /* ---------- Refleksi ---------- */
  function loadRefleksi() {
    var saved = null; try { saved = JSON.parse(read('mpi-p1-refleksi', 'null')); } catch (e) { saved = null; }
    if (!saved) return;
    ['refCheck1', 'refCheck2', 'refCheck3'].forEach(function (id, i) { var el = $(id); if (el && saved.checks) el.checked = !!saved.checks[i]; });
    if ($('refContoh') && saved.contoh) $('refContoh').value = saved.contoh;
    if ($('refSulit') && saved.sulit) $('refSulit').value = saved.sulit;
  }
  loadRefleksi();
  var refSave = $('refSave');
  if (refSave) refSave.addEventListener('click', function () {
    var data = { checks: ['refCheck1', 'refCheck2', 'refCheck3'].map(function (id) { var el = $(id); return el ? el.checked : false; }), contoh: $('refContoh') ? $('refContoh').value : '', sulit: $('refSulit') ? $('refSulit').value : '' };
    store('mpi-p1-refleksi', JSON.stringify(data));
    var st = $('refStatus'); if (st) st.textContent = 'Refleksi tersimpan di perangkat ini pada ' + new Date().toLocaleString('id-ID') + '.';
    markVisited('sub6');
  });

  /* ---------- Percobaan Tuang Pasir 3D (port dari MPI Matematika Kelas 9 mendalam,
     mpi-mtk-ix-hz/kelas-9/p1-luas-volume) ----------
  /* Satu limas dituang berulang kali ke prisma beralas & bertinggi sama; prisma penuh
     pada tuangan ke-3. Semua nama di dalam blok ini lokal (callback DOMContentLoaded),
     tidak ada yang bertabrakan dengan kode target, jadi tanpa awalan sim3d_. */
/* ================= PERCOBAAN TUANG PASIR 3D (Sub-bab 4) =================
   Sebuah limas (alas & tinggi sama dengan prisma kaca di sebelahnya)
   dituang berulang kali; permukaan pasir di dalam prisma naik ⅓ setiap
   tuangan dan prisma tepat penuh pada tuangan ke-3. */
if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", function () {
    "use strict";
    var kanvas = document.querySelector(".tuang-kanvas");
    if (!kanvas) { return; }
    var ctx = kanvas.getContext("2d");
    var tombol = document.querySelector(".btn-tuang");
    var tombolUlang = document.querySelector(".btn-tuang-ulang");
    var statusEl = document.querySelector(".tuang-status");

    var HB = 1.1;          /* setengah sisi alas persegi */
    var T = 2.6;           /* tinggi prisma & limas */
    var POS_DIAM = [3.35, 0, 0];
    var POS_ATAS = [-0.5, 4.55, 0];
    var MIRING_ATAS = -2.6;

    var st = {
      tuang: 0,            /* tuangan selesai */
      level: 0,            /* tinggi pasir saat ini (satuan dunia) */
      anim: null,          /* {mulai} saat animasi berjalan */
      partikel: [],
      yaw: -0.55, pitch: 0.32
    };

    var TEKS_AWAL = "Prisma masih kosong (0 dari 3 tuangan). Limas di samping beralas dan bertinggi sama persis dengan prisma — tuang dan buktikan sendiri.";
    var TEKS_ISI = [
      "",
      "Tuangan ke-1 selesai: prisma baru terisi ⅓. Masih jauh dari penuh — satu limas memang belum cukup.",
      "Tuangan ke-2 selesai: prisma terisi ⅔. Tinggal satu tuangan lagi…",
      "✓ PENUH! Tepat 3 tuangan limas untuk memenuhi 1 prisma yang alas dan tingginya sama. Jadi isi limas adalah ⅓ dari isi prisma: V limas = ⅓ × V prisma."
    ];

    function vAdd(a, b) { return [a[0] + b[0], a[1] + b[1], a[2] + b[2]]; }
    function vScale(a, s) { return [a[0] * s, a[1] * s, a[2] * s]; }
    function vCross(a, b) { return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]; }
    function vDot(a, b) { return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; }
    function rotSumbu(v, sumbu, rad) {
      var c = Math.cos(rad), s = Math.sin(rad);
      var silang = vCross(sumbu, v);
      var d = vDot(sumbu, v);
      return [
        v[0] * c + silang[0] * s + sumbu[0] * d * (1 - c),
        v[1] * c + silang[1] * s + sumbu[1] * d * (1 - c),
        v[2] * c + silang[2] * s + sumbu[2] * d * (1 - c)
      ];
    }
    function rotZ(v, rad) {
      var c = Math.cos(rad), s = Math.sin(rad);
      return [v[0] * c - v[1] * s, v[0] * s + v[1] * c, v[2]];
    }
    function halus(x) { x = Math.max(0, Math.min(1, x)); return x * x * (3 - 2 * x); }
    function campur(a, b, k) { return a + (b - a) * k; }

    /* Keadaan limas pada waktu animasi p (0..1); tanpa animasi: diam di samping. */
    function keadaanLimas() {
      if (!st.anim) { return { pos: POS_DIAM, miring: 0, menuang: false }; }
      var p = Math.min(1, (performance.now() - st.anim.mulai) / 2400);
      var m;
      if (p < 0.3) { m = halus(p / 0.3); }
      else if (p < 0.78) { m = 1; }
      else { m = 1 - halus((p - 0.78) / 0.22); }
      return {
        pos: [campur(POS_DIAM[0], POS_ATAS[0], m), campur(POS_DIAM[1], POS_ATAS[1], m), 0],
        miring: MIRING_ATAS * m,
        menuang: p >= 0.3 && p <= 0.75,
        p: p
      };
    }
    function levelSaatIni() {
      if (!st.anim) { return st.level; }
      var p = Math.min(1, (performance.now() - st.anim.mulai) / 2400);
      var naik = halus((p - 0.3) / 0.45);
      return (st.anim.dari + naik) / 3 * T;
    }

    var ALAS = [[-HB, 0, -HB], [HB, 0, -HB], [HB, 0, HB], [-HB, 0, HB]];
    var PUNCAK = [0, T, 0];

    function titikLimas(lokal, keadaan) {
      return vAdd(rotZ(lokal, keadaan.miring), keadaan.pos);
    }

    function perbaruiUI() {
      if (statusEl) {
        if (st.anim) { statusEl.textContent = "Menuang limas ke-" + (st.tuang + 1) + "… perhatikan permukaan pasirnya naik."; }
        else if (st.tuang === 0) { statusEl.textContent = TEKS_AWAL; }
        else { statusEl.textContent = TEKS_ISI[st.tuang]; }
      }
      if (tombol) {
        if (st.tuang >= 3) { tombol.textContent = "Sudah Penuh ✓"; tombol.disabled = true; }
        else {
          tombol.textContent = "▶ Tuang Limas ke-" + (st.tuang + 1);
          tombol.disabled = !!st.anim;
        }
      }
    }

    function gambar() {
      var W = kanvas.width, H = kanvas.height;
      ctx.clearRect(0, 0, W, H);
      var keadaan = keadaanLimas();
      var level = levelSaatIni();
      function putar(v) {
        return rotSumbu(rotSumbu(v, [0, 1, 0], st.yaw), [1, 0, 0], st.pitch);
      }
      /* titik dunia */
      var wadahBawah = ALAS.map(function (t) { return t; });
      var wadahAtas = ALAS.map(function (t) { return [t[0], T, t[2]]; });
      var pasirAtas = ALAS.map(function (t) { return [t[0], level, t[2]]; });
      var limasAlas = ALAS.map(function (t) { return titikLimas(t, keadaan); });
      var limasPuncak = titikLimas(PUNCAK, keadaan);

      /* pas-kan ke kanvas dari kotak pembungkus prisma + limas */
      var semua = wadahBawah.concat(wadahAtas, limasAlas, [limasPuncak]).map(putar);
      var minX = 1e9, maxX = -1e9, minY = 1e9, maxY = -1e9;
      semua.forEach(function (pv) {
        if (pv[0] < minX) { minX = pv[0]; }
        if (pv[0] > maxX) { maxX = pv[0]; }
        if (pv[1] < minY) { minY = pv[1]; }
        if (pv[1] > maxY) { maxY = pv[1]; }
      });
      var skala = Math.min((W - 110) / Math.max(0.001, maxX - minX), (H - 100) / Math.max(0.001, maxY - minY), 120);
      var pusX = (minX + maxX) / 2, pusY = (minY + maxY) / 2;
      function layar(v) {
        var pv = putar(v);
        return [W / 2 + (pv[0] - pusX) * skala, H / 2 - (pv[1] - pusY) * skala, pv[2]];
      }

      var wajah = [];
      function tambahWajah(titik, r, g, b, alfa, garis) {
        var pts = titik.map(layar);
        var z = 0;
        pts.forEach(function (p) { z += p[2]; });
        wajah.push({ pts: pts, z: z / pts.length, warna: "rgba(" + r + "," + g + "," + b + "," + alfa + ")", garis: garis || null });
      }
      /* pasir di dalam prisma */
      if (level > 0.02) {
        for (var s = 0; s < 4; s++) {
          var a1 = ALAS[s], a2 = ALAS[(s + 1) % 4];
          tambahWajah([a1, a2, [a2[0], level, a2[2]], [a1[0], level, a1[2]]], 245, 158, 11, 0.9);
        }
        tambahWajah(pasirAtas, 253, 230, 138, 0.95);
      }
      /* kaca prisma: alas + 4 sisi tembus pandang */
      tambahWajah(wadahBawah, 191, 219, 254, 0.5);
      for (var k = 0; k < 4; k++) {
        var b1 = wadahBawah[k], b2 = wadahBawah[(k + 1) % 4], t2 = wadahAtas[(k + 1) % 4], t1 = wadahAtas[k];
        tambahWajah([b1, b2, t2, t1], 219, 234, 254, 0.13);
      }
      /* limas */
      var urutan = [0, 1, 2, 3];
      urutan.forEach(function (i) {
        tambahWajah([limasAlas[i], limasAlas[(i + 1) % 4], limasPuncak], 254, 243, 199, 0.95, "#D97706");
      });
      tambahWajah(limasAlas, 254, 243, 199, 0.45, "#D97706");

      wajah.sort(function (p, q) { return p.z - q.z; });
      wajah.forEach(function (w) {
        ctx.beginPath();
        w.pts.forEach(function (p, i) { if (i === 0) { ctx.moveTo(p[0], p[1]); } else { ctx.lineTo(p[0], p[1]); } });
        ctx.closePath();
        ctx.fillStyle = w.warna;
        ctx.fill();
        if (w.garis) { ctx.strokeStyle = w.garis; ctx.lineWidth = 2; ctx.stroke(); }
      });

      /* rusuk prisma */
      ctx.strokeStyle = "#2563EB";
      ctx.lineWidth = 2.5;
      function garis3(a, b) {
        var pa = layar(a), pb = layar(b);
        ctx.beginPath(); ctx.moveTo(pa[0], pa[1]); ctx.lineTo(pb[0], pb[1]); ctx.stroke();
      }
      for (var e = 0; e < 4; e++) {
        garis3(wadahBawah[e], wadahBawah[(e + 1) % 4]);
        garis3(wadahAtas[e], wadahAtas[(e + 1) % 4]);
        garis3(wadahBawah[e], wadahAtas[e]);
      }
      /* penanda ⅓ dan ⅔ pada rusuk depan */
      ctx.fillStyle = "#1E3A8A";
      ctx.font = "700 17px system-ui, sans-serif";
      ctx.textAlign = "right";
      [1, 2].forEach(function (n) {
        var yTanda = T * n / 3;
        var titik = layar([-HB, yTanda, HB]);
        ctx.beginPath();
        ctx.moveTo(titik[0] - 12, titik[1]);
        ctx.lineTo(titik[0] + 2, titik[1]);
        ctx.strokeStyle = "#1E3A8A";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillText(n === 1 ? "⅓" : "⅔", titik[0] - 16, titik[1] + 6);
      });
      ctx.textAlign = "left";

      /* partikel pasir */
      if (keadaan.menuang) {
        for (var j = 0; j < 3; j++) {
          st.partikel.push({
            x: limasPuncak[0] + (Math.random() - 0.5) * 0.3,
            y: limasPuncak[1] - 0.1,
            z: limasPuncak[2] + (Math.random() - 0.5) * 0.3,
            v: 0
          });
        }
      }
      st.partikel = st.partikel.filter(function (pt) { return pt.y > level + 0.05; });
      st.partikel.forEach(function (pt) {
        pt.v += 0.012;
        pt.y -= pt.v;
        var p = layar([pt.x, pt.y, pt.z]);
        ctx.beginPath();
        ctx.arc(p[0], p[1], 3, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(217,119,6,0.9)";
        ctx.fill();
      });
    }

    function bingkai() {
      gambar();
      if (st.anim) {
        var p = (performance.now() - st.anim.mulai) / 2400;
        if (p >= 1) {
          st.tuang += 1;
          st.level = st.tuang / 3 * T;
          st.anim = null;
          st.partikel = [];
          perbaruiUI();
          gambar();
          return;
        }
        requestAnimationFrame(bingkai);
      }
    }

    if (tombol) {
      tombol.addEventListener("click", function () {
        if (st.anim || st.tuang >= 3) { return; }
        st.anim = { mulai: performance.now(), dari: st.tuang };
        perbaruiUI();
        requestAnimationFrame(bingkai);
      });
    }
    if (tombolUlang) {
      tombolUlang.addEventListener("click", function () {
        st.tuang = 0;
        st.level = 0;
        st.anim = null;
        st.partikel = [];
        perbaruiUI();
        gambar();
      });
    }
    var seret = null;
    kanvas.addEventListener("pointerdown", function (ev) {
      seret = { x: ev.clientX, y: ev.clientY };
      try { kanvas.setPointerCapture(ev.pointerId); } catch (e) {}
    });
    kanvas.addEventListener("pointermove", function (ev) {
      if (!seret) { return; }
      st.yaw += (ev.clientX - seret.x) * 0.01;
      st.pitch += (ev.clientY - seret.y) * 0.01;
      if (st.pitch > 1.2) { st.pitch = 1.2; }
      if (st.pitch < -1.2) { st.pitch = -1.2; }
      seret = { x: ev.clientX, y: ev.clientY };
      if (!st.anim) { gambar(); }
    });
    ["pointerup", "pointercancel", "pointerleave"].forEach(function (nama) {
      kanvas.addEventListener(nama, function () { seret = null; });
    });

    perbaruiUI();
    gambar();
  });
}
})();
