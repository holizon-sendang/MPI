/* P.3 Bangun Ruang Sisi Lengkung — script.js (vanilla JS, tanpa framework).
   localStorage: mpi-p3-visited, mpi-p3-quiz-best, mpi-p3-refleksi. */
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
  try { visited = JSON.parse(read('mpi-p3-visited', '[]')) || []; } catch (e) { visited = []; }
  if (!Array.isArray(visited)) visited = [];
  function saveVisited() { store('mpi-p3-visited', JSON.stringify(visited)); }
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
  var bestStored = read('mpi-p3-quiz-best', null);
  var bestEl = $('quizBestText');
  if (bestStored !== null && bestEl) { bestEl.textContent = 'Skor terbaik kuis: ' + bestStored + '/10'; bestEl.hidden = false; }

  /* Kalkulator tabung / kerucut / bola (pi = 3,14) */
  function hitungP3() {
    var jenis = $('brBangun') ? $('brBangun').value : 'tabung';
    var r = parseNum($('brR')), t = parseNum($('brT'));
    var h = $('brHasil'), lg = $('brLangkah');
    if (r === null || r <= 0) { if (h) h.textContent = 'Isi jari-jari (bilangan positif).'; if (lg) lg.textContent = ''; return; }
    var pi = 3.14, lp, v, ket;
    if (jenis === 'tabung') {
      if (t === null || t <= 0) { if (h) h.textContent = 'Isi tinggi tabung.'; if (lg) lg.textContent = ''; return; }
      lp = 2 * pi * r * (r + t); v = pi * r * r * t;
      ket = 'Lp = 2πr(r + t) = 2 × 3,14 × ' + r + ' × ' + (r + t) + ' = ' + fmtDec(lp, 2) + '. V = πr²t = 3,14 × ' + r + '² × ' + t + ' = ' + fmtDec(v, 2) + '.';
    } else if (jenis === 'kerucut') {
      if (t === null || t <= 0) { if (h) h.textContent = 'Isi tinggi kerucut.'; if (lg) lg.textContent = ''; return; }
      var s = Math.sqrt(r * r + t * t);
      lp = pi * r * (r + s); v = (1 / 3) * pi * r * r * t;
      ket = 'Garis pelukis s = √(r² + t²) = ' + fmtDec(s, 2) + '. Lp = πr(r + s) = ' + fmtDec(lp, 2) + '. V = ⅓πr²t = ' + fmtDec(v, 2) + '.';
    } else {
      lp = 4 * pi * r * r; v = (4 / 3) * pi * r * r * r;
      ket = 'Lp bola = 4πr² = 4 × 3,14 × ' + r + '² = ' + fmtDec(lp, 2) + '. V bola = 4/3 πr³ = ' + fmtDec(v, 2) + '.';
    }
    if (h) h.textContent = 'Lp = ' + fmtDec(lp, 2) + ' · V = ' + fmtDec(v, 2);
    if (lg) lg.textContent = ket;
  }
  var brBtn = $('brBtn');
  if (brBtn) brBtn.addEventListener('click', hitungP3);
  var brBangun = $('brBangun');
  if (brBangun) brBangun.addEventListener('change', function () { var row = $('rowT'); if (row) row.style.display = brBangun.value === 'bola' ? 'none' : ''; });
  /* Slider bola: ubah jari-jari */
  var bolaR = $('bolaR');
  function renderBola() {
    if (!bolaR) return;
    var r = Number(bolaR.value);
    var v = $('bolaRVal'); if (v) v.textContent = 'r = ' + r + ' cm';
    var h = $('bolaHasil'); if (h) h.textContent = 'Volume bola = 4/3 × 3,14 × ' + r + '³ = ' + fmtDec((4 / 3) * 3.14 * r * r * r, 2) + ' cm³ · Luas permukaan = ' + fmtDec(4 * 3.14 * r * r, 2) + ' cm²';
  }
  if (bolaR) { bolaR.addEventListener('input', renderBola); renderBola(); }

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
  var QUIZ = [{"q": "Volume tabung r = 7 cm, t = 10 cm (π = 22/7) adalah …", "options": ["1540 cm³", "770 cm³", "3080 cm³", "154 cm³"], "answer": 0, "why": "V = 22/7 × 49 × 10 = 1540 cm³."}, {"q": "Luas selimut tabung r = 7 cm, t = 10 cm (π = 22/7) adalah …", "options": ["220 cm²", "440 cm²", "880 cm²", "154 cm²"], "answer": 1, "why": "Luas selimut = 2πrt = 2 × 22/7 × 7 × 10 = 440 cm²."}, {"q": "Volume kerucut r = 7 cm, t = 24 cm (π = 22/7) adalah …", "options": ["616 cm³", "924 cm³", "1232 cm³", "2464 cm³"], "answer": 2, "why": "V = ⅓ × 22/7 × 49 × 24 = ⅓ × 3696 = 1232 cm³."}, {"q": "Volume bola r = 7 cm (π = 22/7) adalah …", "options": ["1078 cm³", "1232 cm³", "1540 cm³", "1437,33 cm³"], "answer": 3, "why": "V = 4/3 × 22/7 × 343 = 1437,33 cm³."}, {"q": "Luas permukaan bola r = 10 cm (π = 3,14) adalah …", "options": ["628 cm²", "1256 cm²", "314 cm²", "2512 cm²"], "answer": 1, "why": "Lp = 4 × 3,14 × 100 = 1256 cm²."}, {"q": "Volume tabung r = 14 cm, t = 10 cm (π = 22/7) adalah …", "options": ["6160 cm³", "3080 cm³", "12320 cm³", "1540 cm³"], "answer": 0, "why": "V = 22/7 × 196 × 10 = 6160 cm³."}, {"q": "Garis pelukis kerucut dengan r = 6 cm dan t = 8 cm adalah …", "options": ["7 cm", "9 cm", "14 cm", "10 cm"], "answer": 3, "why": "s = √(6² + 8²) = √100 = 10 cm (tripel Pythagoras 6-8-10)."}, {"q": "Luas permukaan bola r = 7 cm (π = 22/7) adalah …", "options": ["308 cm²", "154 cm²", "616 cm²", "1232 cm²"], "answer": 2, "why": "Lp = 4 × 22/7 × 49 = 616 cm²."}, {"q": "Luas permukaan tabung tanpa tutup r = 7 cm, t = 10 cm (π = 22/7) adalah …", "options": ["748 cm²", "594 cm²", "440 cm²", "308 cm²"], "answer": 1, "why": "Lp = selimut + 1 alas = 440 + 154 = 594 cm²."}, {"q": "Volume kerucut r = 10 cm, t = 24 cm (π = 3,14) adalah …", "options": ["1256 cm³", "1884 cm³", "3140 cm³", "2512 cm³"], "answer": 3, "why": "V = ⅓ × 3,14 × 100 × 24 = 2512 cm³."}];
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
    var prevBest = read('mpi-p3-quiz-best', null); var prevNum = prevBest === null ? -1 : Number(prevBest);
    if (qScore > prevNum) store('mpi-p3-quiz-best', String(qScore));
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
    var saved = null; try { saved = JSON.parse(read('mpi-p3-refleksi', 'null')); } catch (e) { saved = null; }
    if (!saved) return;
    ['refCheck1', 'refCheck2', 'refCheck3'].forEach(function (id, i) { var el = $(id); if (el && saved.checks) el.checked = !!saved.checks[i]; });
    if ($('refContoh') && saved.contoh) $('refContoh').value = saved.contoh;
    if ($('refSulit') && saved.sulit) $('refSulit').value = saved.sulit;
  }
  loadRefleksi();
  var refSave = $('refSave');
  if (refSave) refSave.addEventListener('click', function () {
    var data = { checks: ['refCheck1', 'refCheck2', 'refCheck3'].map(function (id) { var el = $(id); return el ? el.checked : false; }), contoh: $('refContoh') ? $('refContoh').value : '', sulit: $('refSulit') ? $('refSulit').value : '' };
    store('mpi-p3-refleksi', JSON.stringify(data));
    var st = $('refStatus'); if (st) st.textContent = 'Refleksi tersimpan di perangkat ini pada ' + new Date().toLocaleString('id-ID') + '.';
    markVisited('sub6');
  });
})();

/* ================= SIMULATOR LIPAT 3D (port dari mpi-mtk-ix-hz P.3) =================
   Dua simulator lipat 3D dari modul P.3 Kelas 9 mendalam: sim-kerucut dan
   sim-tabung. Kode disalin utuh; semua fungsi/variabel berada di dalam
   callback DOMContentLoaded masing-masing sehingga tidak bertabrakan dengan
   kode target (tidak ada rename). Elemen yang dipakai: #sim-kerucut,
   #btn-lipat-kerucut, #geser-kerucut, #status-kerucut, #sim-tabung,
   #btn-lipat-tabung, #geser-tabung, #status-tabung. */
/* ================= SIMULASI LIPAT 3D KERUCUT (Sub-bab 3) =================
   Jaring kerucut (juring selimut + lingkaran alas) dilipat menjadi kerucut
   dengan interpolasi titik-per-titik antara posisi datar dan posisi kerucut.
   Pola mengikuti simulator lipat 3D modul G.5: tombol animasi, slider proses,
   seret untuk memutar, dan auto-fit longgar pada setiap frame. */
if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", function () {
    "use strict";
    var kanvas = document.getElementById("sim-kerucut");
    if (!kanvas) { return; }
    var ctx = kanvas.getContext("2d");
    var tombol = document.getElementById("btn-lipat-kerucut");
    var geserEl = document.getElementById("geser-kerucut");
    var statusEl = document.getElementById("status-kerucut");
    var labelLipat = tombol ? tombol.textContent : "";
    var PESAN_AWAL = "Jaring-jaring kerucut: juring lingkaran (selimut) + lingkaran (alas).";
    var PESAN_TENGAH = "Sedang melipat… juring melengkung mengikuti alas.";
    var PESAN_JADI = "Kerucut terbentuk! Juring menjadi selimut dan lingkaran menjadi alasnya.";

    /* Geometri kerucut contoh modul: r = 6 cm, t = 8 cm, s = 10 cm.
       Sudut juring = (r/s) × 360° = 216°, setengahnya 108°. */
    var R = 6, T = 8, S = 10;
    var SETENGAH = 108 * Math.PI / 180;
    var NA = 24, NR = 4; /* segmen sudut dan cincin radial juring */
    var NB = 24, NF = 3; /* segmen sudut dan cincin lingkaran alas */

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
    function lerp(a, b, p) { return a + (b - a) * p; }
    function lerpV(a, b, p) { return [lerp(a[0], b[0], p), lerp(a[1], b[1], p), lerp(a[2], b[2], p)]; }

    /* Satu titik juring: rho = jarak miring dari puncak (0..s), phi = sudut juring. */
    function titikJuring(rho, phi) {
      var datar = [rho * Math.sin(phi), 0, rho * Math.cos(phi)];
      var psi = phi * (S / R);
      var q = rho * (R / S);
      var jadi = [q * Math.sin(psi), T - rho * (T / S), q * Math.cos(psi)];
      return { datar: datar, jadi: jadi };
    }
    /* Satu titik lingkaran alas: beta = sudut keliling, f = pecahan jejari (0..1).
       Saat datar pusatnya di (0, 0, s + r) sehingga tepi terdekatnya menyentuh
       titik tengah busur juring di (0, 0, s). */
    function titikAlas(beta, f) {
      var datar = [R * f * Math.sin(beta), 0, (S + R) + R * f * Math.cos(beta)];
      var jadi = [R * f * Math.sin(beta), 0, R * f * Math.cos(beta)];
      return { datar: datar, jadi: jadi };
    }

    var gridJuring = [], gridAlas = [], i, j;
    for (i = 0; i <= NR; i++) {
      var barisJ = [];
      for (j = 0; j <= NA; j++) {
        barisJ.push(titikJuring(S * i / NR, -SETENGAH + 2 * SETENGAH * j / NA));
      }
      gridJuring.push(barisJ);
    }
    for (i = 0; i <= NF; i++) {
      var barisA = [];
      for (j = 0; j <= NB; j++) {
        barisA.push(titikAlas(2 * Math.PI * j / NB, i / NF));
      }
      gridAlas.push(barisA);
    }
    var FACES = [];
    for (i = 0; i < NR; i++) {
      for (j = 0; j < NA; j++) {
        FACES.push({ a: gridJuring[i][j], b: gridJuring[i][j + 1], c: gridJuring[i + 1][j + 1], d: gridJuring[i + 1][j], amber: true });
      }
    }
    for (i = 0; i < NF; i++) {
      for (j = 0; j < NB; j++) {
        FACES.push({ a: gridAlas[i][j], b: gridAlas[i][j + 1], c: gridAlas[i + 1][j + 1], d: gridAlas[i + 1][j], amber: false });
      }
    }

    /* Pemusatan tampilan: jaring datar dipusatkan pada rentang z-nya
       (dari s·cos108° sampai s + 2r), kerucut pada setengah tingginya. */
    var PUSAT_DATAR = [0, 0, (S + 2 * R + S * Math.cos(SETENGAH)) / 2];
    var PUSAT_JADI = [0, T / 2, 0];
    var lebarNet = 2 * S * Math.sin(SETENGAH);
    var dalamNet = (S + 2 * R) - S * Math.cos(SETENGAH);
    var skalaDasar = Math.min(600 / lebarNet, 420 / dalamNet);
    var st = { prog: 0, target: 0, yaw: -0.5, pitch: 0.38, raf: 0 };

    function posisi(titik, p) {
      var mentah = lerpV(titik.datar, titik.jadi, p);
      var geser = lerpV(PUSAT_DATAR, PUSAT_JADI, p);
      return [mentah[0] - geser[0], mentah[1] - geser[1], mentah[2] - geser[2]];
    }

    function perbaruiStatus() {
      if (statusEl) {
        if (st.prog >= 0.995) { statusEl.textContent = PESAN_JADI; }
        else if (st.prog <= 0.005) { statusEl.textContent = PESAN_AWAL; }
        else { statusEl.textContent = PESAN_TENGAH; }
      }
      if (tombol) { tombol.textContent = st.target >= 1 ? "↺ Buka Lagi" : labelLipat; }
    }

    function gambar() {
      var W = kanvas.width, H = kanvas.height;
      ctx.clearRect(0, 0, W, H);
      function putar(v) {
        return rotSumbu(rotSumbu(v, [0, 1, 0], st.yaw), [1, 0, 0], st.pitch);
      }
      var mentah = [];
      var minX = 1e9, maxX = -1e9, minY = 1e9, maxY = -1e9;
      FACES.forEach(function (f, idx) {
        var pts = [f.a, f.b, f.c, f.d].map(function (t) { return putar(posisi(t, st.prog)); });
        var zRata = 0;
        pts.forEach(function (pv) {
          zRata += pv[2];
          if (pv[0] < minX) { minX = pv[0]; }
          if (pv[0] > maxX) { maxX = pv[0]; }
          if (pv[1] < minY) { minY = pv[1]; }
          if (pv[1] > maxY) { maxY = pv[1]; }
        });
        /* Normal dari dua diagonal segi empat — tetap sah pada cincin puncak
           juring dan cincin pusat alas yang sudut-sudutnya menyatu. */
        var diag1 = [pts[2][0] - pts[0][0], pts[2][1] - pts[0][1], pts[2][2] - pts[0][2]];
        var diag2 = [pts[3][0] - pts[1][0], pts[3][1] - pts[1][1], pts[3][2] - pts[1][2]];
        var n = vCross(diag2, diag1);
        var panjang = Math.sqrt(vDot(n, n));
        var nz = panjang > 1e-9 ? n[2] / panjang : 0;
        mentah.push({ sudut: pts, dalam: zRata / 4, nz: nz, idx: idx, amber: f.amber });
      });
      /* Pas-kan & pusatkan hasil render saat ini ke kanvas pada setiap proses
         lipatan. Margin lega (230px horizontal, 210px vertikal) dan pembesaran
         dibatasi 1,15x skala jaring datar — pelajaran dari perbaikan ukuran
         simulator G.5 — supaya bangun selalu terlihat utuh di semua sisi. */
      var rentangX = Math.max(0.001, maxX - minX);
      var rentangY = Math.max(0.001, maxY - minY);
      var skala = Math.min((W - 230) / rentangX, (H - 210) / rentangY, skalaDasar * 1.15);
      var pusX = (minX + maxX) / 2, pusY = (minY + maxY) / 2;
      var wajah = mentah.map(function (w) {
        return {
          sudut: w.sudut.map(function (pv) {
            return [W / 2 + (pv[0] - pusX) * skala, H / 2 - (pv[1] - pusY) * skala];
          }),
          dalam: w.dalam, nz: w.nz, idx: w.idx, amber: w.amber
        };
      });
      wajah.sort(function (p, q) { return (p.dalam + p.idx * 0.002) - (q.dalam + q.idx * 0.002); });
      wajah.forEach(function (w) {
        var t = (w.nz + 1) / 2;
        var r, g, b, garis;
        if (w.amber) {
          r = Math.round(217 + (254 - 217) * t);
          g = Math.round(119 + (243 - 119) * t);
          b = Math.round(6 + (199 - 6) * t);
          garis = "#92400E";
        } else {
          r = Math.round(147 + (219 - 147) * t);
          g = Math.round(197 + (234 - 197) * t);
          b = Math.round(253 + (254 - 253) * t);
          garis = "#1E3A8A";
        }
        ctx.beginPath();
        w.sudut.forEach(function (s, k) { if (k === 0) { ctx.moveTo(s[0], s[1]); } else { ctx.lineTo(s[0], s[1]); } });
        ctx.closePath();
        ctx.fillStyle = "rgba(" + r + "," + g + "," + b + ",0.92)";
        ctx.fill();
        ctx.strokeStyle = garis;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      });
    }

    function animasi() {
      cancelAnimationFrame(st.raf);
      var dari = st.prog, ke = st.target, t0 = null;
      function langkah(ts) {
        if (!t0) { t0 = ts; }
        var p = Math.min(1, (ts - t0) / 1800);
        var e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
        st.prog = dari + (ke - dari) * e;
        if (geserEl) { geserEl.value = st.prog * 100; }
        gambar();
        perbaruiStatus();
        if (p < 1) { st.raf = requestAnimationFrame(langkah); }
      }
      st.raf = requestAnimationFrame(langkah);
    }

    if (tombol) {
      tombol.addEventListener("click", function () {
        st.target = st.target >= 1 ? 0 : 1;
        perbaruiStatus();
        animasi();
      });
    }
    if (geserEl) {
      geserEl.addEventListener("input", function () {
        cancelAnimationFrame(st.raf);
        st.prog = parseFloat(geserEl.value) / 100;
        st.target = st.prog >= 0.995 ? 1 : 0;
        gambar();
        perbaruiStatus();
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
      gambar();
    });
    ["pointerup", "pointercancel", "pointerleave"].forEach(function (nama) {
      kanvas.addEventListener(nama, function () { seret = null; });
    });

    gambar();
    perbaruiStatus();
  });
}

/* ================= SIMULASI LIPAT 3D TABUNG (Sub-bab 3) =================
   Jaring tabung (persegi panjang selimut + lingkaran tutup dan alas) dilipat
   menjadi tabung: selimut ditekuk isometrik dengan kelengkungan κ = p/r,
   kedua lingkaran berotasi kaku mengitari titik tempelnya. Pola mengikuti
   simulator kerucut di atas dan simulator lipat 3D modul G.5: tombol animasi,
   slider proses, seret untuk memutar, dan auto-fit longgar setiap frame. */
if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", function () {
    "use strict";
    var kanvas = document.getElementById("sim-tabung");
    if (!kanvas) { return; }
    var ctx = kanvas.getContext("2d");
    var tombol = document.getElementById("btn-lipat-tabung");
    var geserEl = document.getElementById("geser-tabung");
    var statusEl = document.getElementById("status-tabung");
    var labelLipat = tombol ? tombol.textContent : "";
    var PESAN_AWAL = "Jaring-jaring tabung: 1 persegi panjang (selimut) + 2 lingkaran (tutup dan alas).";
    var PESAN_TENGAH = "Sedang melipat… persegi panjang menggulung, kedua lingkaran menutup ujungnya.";
    var PESAN_JADI = "Tabung terbentuk! Persegi panjang menjadi selimut, kedua lingkaran menjadi tutup dan alas.";

    /* Geometri tabung contoh modul: r = 7 cm, t = 10 cm, keliling alas 44 cm.
       Bidang jaring: u mendatar (persegi panjang u∈[−22,22]), v tegak
       (persegi panjang v∈[0,10]); lingkaran tutup menempel di (0,10) dengan
       pusat datar (0,17), lingkaran alas menempel di (0,0) dengan pusat (0,−7). */
    var R = 7, T = 10, PANJANG = 44;
    var NU = 28, NV = 4; /* kolom dan baris mesh persegi panjang */
    var NB = 24, NF = 3; /* segmen sudut dan cincin kedua lingkaran */

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
    function lerp(a, b, p) { return a + (b - a) * p; }
    function lerpV(a, b, p) { return [lerp(a[0], b[0], p), lerp(a[1], b[1], p), lerp(a[2], b[2], p)]; }

    /* Satu titik selimut pada proses p: tekuk isometrik kelengkungan κ = p/r.
       Pada p=1 hasilnya silinder jejari r berpusat sumbu di (0, ·, −r). */
    function titikSelimut(u, v, p) {
      var kappa = p / R;
      if (kappa < 1e-9) { return [u, v, 0]; }
      return [Math.sin(u * kappa) / kappa, v, (Math.cos(u * kappa) - 1) / kappa];
    }
    /* Satu titik lingkaran: beta = sudut keliling, f = pecahan jejari (0..1).
       Tutup: dy diukur dari titik tempel (0,10), dy∈[0,14]; rotasi −90°·p
       mengitari sumbu X melalui titik tempel, menutup ke arah −z.
       Alas: dy diukur dari titik tempel (0,0), dy∈[−14,0]; rotasi +90°·p,
       juga menutup ke arah −z (pusat silinder). Pada p=1 pusat tutup tepat
       di (0,10,−7) dan pusat alas tepat di (0,0,−7). */
    function titikTutup(beta, f, p) {
      var dx = R * f * Math.sin(beta);
      var dy = R + R * f * Math.cos(beta);
      var th = -Math.PI / 2 * p;
      return [dx, T + dy * Math.cos(th), dy * Math.sin(th)];
    }
    function titikAlas(beta, f, p) {
      var dx = R * f * Math.sin(beta);
      var dy = -R + R * f * Math.cos(beta);
      var th = Math.PI / 2 * p;
      return [dx, dy * Math.cos(th), dy * Math.sin(th)];
    }

    var gridSelimut = [], gridTutup = [], gridAlas = [], i, j;
    for (i = 0; i <= NV; i++) {
      var barisS = [];
      for (j = 0; j <= NU; j++) {
        barisS.push({ u: -PANJANG / 2 + PANJANG * j / NU, v: T * i / NV });
      }
      gridSelimut.push(barisS);
    }
    for (i = 0; i <= NF; i++) {
      var barisT = [], barisA = [];
      for (j = 0; j <= NB; j++) {
        barisT.push({ beta: 2 * Math.PI * j / NB, f: i / NF });
        barisA.push({ beta: 2 * Math.PI * j / NB, f: i / NF });
      }
      gridTutup.push(barisT);
      gridAlas.push(barisA);
    }
    var FACES = [];
    for (i = 0; i < NV; i++) {
      for (j = 0; j < NU; j++) {
        FACES.push({ a: gridSelimut[i][j], b: gridSelimut[i][j + 1], c: gridSelimut[i + 1][j + 1], d: gridSelimut[i + 1][j], jenis: "selimut", amber: true });
      }
    }
    for (i = 0; i < NF; i++) {
      for (j = 0; j < NB; j++) {
        FACES.push({ a: gridTutup[i][j], b: gridTutup[i][j + 1], c: gridTutup[i + 1][j + 1], d: gridTutup[i + 1][j], jenis: "tutup", amber: false });
        FACES.push({ a: gridAlas[i][j], b: gridAlas[i][j + 1], c: gridAlas[i + 1][j + 1], d: gridAlas[i + 1][j], jenis: "alas", amber: false });
      }
    }

    /* Pemusatan tampilan: jaring datar berpusat pada (0, 5, 0) (rentang v dari
       −14 sampai 24), tabung jadi pada pusat sumbunya (0, 5, −7). */
    var PUSAT_DATAR = [0, T / 2, 0];
    var PUSAT_JADI = [0, T / 2, -R];
    var skalaDasar = Math.min(600 / PANJANG, 420 / (2 * R + T + 2 * R));
    var st = { prog: 0, target: 0, yaw: -0.45, pitch: 0.32, raf: 0 };

    function posisi(param, jenis, p) {
      var mentah;
      if (jenis === "selimut") { mentah = titikSelimut(param.u, param.v, p); }
      else if (jenis === "tutup") { mentah = titikTutup(param.beta, param.f, p); }
      else { mentah = titikAlas(param.beta, param.f, p); }
      var geser = lerpV(PUSAT_DATAR, PUSAT_JADI, p);
      return [mentah[0] - geser[0], mentah[1] - geser[1], mentah[2] - geser[2]];
    }

    function perbaruiStatus() {
      if (statusEl) {
        if (st.prog >= 0.995) { statusEl.textContent = PESAN_JADI; }
        else if (st.prog <= 0.005) { statusEl.textContent = PESAN_AWAL; }
        else { statusEl.textContent = PESAN_TENGAH; }
      }
      if (tombol) { tombol.textContent = st.target >= 1 ? "↺ Buka Lagi" : labelLipat; }
    }

    function gambar() {
      var W = kanvas.width, H = kanvas.height;
      ctx.clearRect(0, 0, W, H);
      function putar(v) {
        return rotSumbu(rotSumbu(v, [0, 1, 0], st.yaw), [1, 0, 0], st.pitch);
      }
      var mentah = [];
      var minX = 1e9, maxX = -1e9, minY = 1e9, maxY = -1e9;
      FACES.forEach(function (f, idx) {
        var pts = [f.a, f.b, f.c, f.d].map(function (t) { return putar(posisi(t, f.jenis, st.prog)); });
        var zRata = 0;
        pts.forEach(function (pv) {
          zRata += pv[2];
          if (pv[0] < minX) { minX = pv[0]; }
          if (pv[0] > maxX) { maxX = pv[0]; }
          if (pv[1] < minY) { minY = pv[1]; }
          if (pv[1] > maxY) { maxY = pv[1]; }
        });
        /* Normal dari dua diagonal segi empat — tetap sah pada cincin pusat
           kedua lingkaran yang sudut-sudutnya menyatu. */
        var diag1 = [pts[2][0] - pts[0][0], pts[2][1] - pts[0][1], pts[2][2] - pts[0][2]];
        var diag2 = [pts[3][0] - pts[1][0], pts[3][1] - pts[1][1], pts[3][2] - pts[1][2]];
        var n = vCross(diag2, diag1);
        var panjang = Math.sqrt(vDot(n, n));
        var nz = panjang > 1e-9 ? n[2] / panjang : 0;
        mentah.push({ sudut: pts, dalam: zRata / 4, nz: nz, idx: idx, amber: f.amber });
      });
      /* Pas-kan & pusatkan hasil render saat ini ke kanvas pada setiap proses
         lipatan. Margin lega (230px horizontal, 210px vertikal) dan pembesaran
         dibatasi 1,15x skala jaring datar — pelajaran dari perbaikan ukuran
         simulator G.5 — supaya bangun selalu terlihat utuh di semua sisi. */
      var rentangX = Math.max(0.001, maxX - minX);
      var rentangY = Math.max(0.001, maxY - minY);
      var skala = Math.min((W - 230) / rentangX, (H - 210) / rentangY, skalaDasar * 1.15);
      var pusX = (minX + maxX) / 2, pusY = (minY + maxY) / 2;
      var wajah = mentah.map(function (w) {
        return {
          sudut: w.sudut.map(function (pv) {
            return [W / 2 + (pv[0] - pusX) * skala, H / 2 - (pv[1] - pusY) * skala];
          }),
          dalam: w.dalam, nz: w.nz, idx: w.idx, amber: w.amber
        };
      });
      wajah.sort(function (p, q) { return (p.dalam + p.idx * 0.002) - (q.dalam + q.idx * 0.002); });
      wajah.forEach(function (w) {
        var t = (w.nz + 1) / 2;
        var r, g, b, garis;
        if (w.amber) {
          r = Math.round(217 + (254 - 217) * t);
          g = Math.round(119 + (243 - 119) * t);
          b = Math.round(6 + (199 - 6) * t);
          garis = "#92400E";
        } else {
          r = Math.round(147 + (219 - 147) * t);
          g = Math.round(197 + (234 - 197) * t);
          b = Math.round(253 + (254 - 253) * t);
          garis = "#1E3A8A";
        }
        ctx.beginPath();
        w.sudut.forEach(function (s, k) { if (k === 0) { ctx.moveTo(s[0], s[1]); } else { ctx.lineTo(s[0], s[1]); } });
        ctx.closePath();
        ctx.fillStyle = "rgba(" + r + "," + g + "," + b + ",0.92)";
        ctx.fill();
        ctx.strokeStyle = garis;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      });
    }

    function animasi() {
      cancelAnimationFrame(st.raf);
      var dari = st.prog, ke = st.target, t0 = null;
      function langkah(ts) {
        if (!t0) { t0 = ts; }
        var p = Math.min(1, (ts - t0) / 1800);
        var e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
        st.prog = dari + (ke - dari) * e;
        if (geserEl) { geserEl.value = st.prog * 100; }
        gambar();
        perbaruiStatus();
        if (p < 1) { st.raf = requestAnimationFrame(langkah); }
      }
      st.raf = requestAnimationFrame(langkah);
    }

    if (tombol) {
      tombol.addEventListener("click", function () {
        st.target = st.target >= 1 ? 0 : 1;
        perbaruiStatus();
        animasi();
      });
    }
    if (geserEl) {
      geserEl.addEventListener("input", function () {
        cancelAnimationFrame(st.raf);
        st.prog = parseFloat(geserEl.value) / 100;
        st.target = st.prog >= 0.995 ? 1 : 0;
        gambar();
        perbaruiStatus();
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
      gambar();
    });
    ["pointerup", "pointercancel", "pointerleave"].forEach(function (nama) {
      kanvas.addEventListener(nama, function () { seret = null; });
    });

    gambar();
    perbaruiStatus();
  });
}
