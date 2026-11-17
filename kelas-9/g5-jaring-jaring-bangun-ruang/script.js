/* G.5 Jaring-jaring Bangun Ruang — script.js (vanilla JS, tanpa framework).
   localStorage: mpi-g5-visited, mpi-g5-quiz-best, mpi-g5-refleksi. */
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
  try { visited = JSON.parse(read('mpi-g5-visited', '[]')) || []; } catch (e) { visited = []; }
  if (!Array.isArray(visited)) visited = [];
  function saveVisited() { store('mpi-g5-visited', JSON.stringify(visited)); }
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
  var bestStored = read('mpi-g5-quiz-best', null);
  var bestEl = $('quizBestText');
  if (bestStored !== null && bestEl) { bestEl.textContent = 'Skor terbaik kuis: ' + bestStored + '/10'; bestEl.hidden = false; }

  var NETS = {
    kubus: { info: 'Kubus: 6 sisi persegi, 12 rusuk, 8 titik sudut. Jaring-jaring yang umum berbentuk salib (1-4-1).', cells: ['Persegi','Persegi','Persegi','Persegi','Persegi','Persegi'] },
    prisma: { info: 'Prisma segitiga: 5 sisi (2 segitiga + 3 persegi panjang), 9 rusuk, 6 titik sudut.', cells: ['Segitiga','Persegi panjang','Persegi panjang','Persegi panjang','Segitiga'] },
    tabung: { info: 'Tabung: 3 sisi (2 lingkaran + 1 persegi panjang sebagai selimut). Panjang persegi panjang = keliling lingkaran alas.', cells: ['Lingkaran','Persegi panjang','Lingkaran'] },
    limas: { info: 'Limas segiempat: 5 sisi (1 persegi + 4 segitiga), 8 rusuk, 5 titik sudut.', cells: ['Segitiga','Segitiga','Persegi','Segitiga','Segitiga'] },
    kerucut: { info: 'Kerucut: 2 sisi (1 lingkaran + 1 juring lingkaran sebagai selimut), 1 titik puncak.', cells: ['Juring','Lingkaran'] }
  };
  var netSelect = $('netSelect');
  function renderNet() {
    if (!netSelect) return;
    var n = NETS[netSelect.value]; if (!n) return;
    var info = $('netInfo'); if (info) info.textContent = n.info;
    var d = $('netDiagram');
    if (d) d.innerHTML = n.cells.map(function (c) { return '<span class="net-cell' + (c === 'Lingkaran' ? ' round' : '') + '">' + c + '</span>'; }).join('');
  }
  if (netSelect) { netSelect.addEventListener('change', renderNet); renderNet(); }
  var euBtn = $('euBtn');
  if (euBtn) euBtn.addEventListener('click', function () {
    var v = parseNum($('euV')), e = parseNum($('euE')), f = parseNum($('euF'));
    if (v === null || e === null || f === null) { showFb($('euFb'), false, 'Isi V (titik sudut), E (rusuk), dan F (sisi) dulu.'); return; }
    showFb($('euFb'), v - e + f === 2, v - e + f === 2 ? 'Benar! V \u2212 E + F = ' + v + ' \u2212 ' + e + ' + ' + f + ' = 2. Rumus Euler terpenuhi, datanya konsisten dengan bangun ruang.'
      : 'V \u2212 E + F = ' + v + ' \u2212 ' + e + ' + ' + f + ' = ' + (v - e + f) + ', bukan 2. Salah satu bilangannya keliru — cek lagi jumlah sisi, rusuk, dan titik sudutnya.');
  });
  document.querySelectorAll('[data-net]').forEach(function (b) {
    b.addEventListener('click', function () {
      var ok = b.getAttribute('data-net') === 'benar';
      showFb($('netFb'), ok, ok ? 'Benar! Pola salib (1-4-1) bisa dilipat menjadi kubus: empat persegi mengelilingi, satu di atas dan satu di bawah.'
        : 'Belum tepat. Enam persegi berderet lurus tidak bisa dilipat menjadi kubus — sisi-sisinya tidak menutup semua arah.');
    });
  });

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
  var QUIZ = [{"q": "Jaring-jaring kubus terdiri dari …", "options": ["6 persegi", "5 persegi", "4 persegi", "8 persegi"], "answer": 0, "why": "Kubus punya 6 sisi, semuanya persegi, jadi jaring-jaringnya 6 persegi."}, {"q": "Banyak sisi prisma segitiga adalah …", "options": ["4", "5", "6", "3"], "answer": 1, "why": "2 sisi segitiga (alas dan tutup) + 3 sisi persegi panjang = 5 sisi."}, {"q": "Jaring-jaring tabung terdiri dari …", "options": ["2 segitiga dan 1 persegi", "1 lingkaran dan 1 segitiga", "2 lingkaran dan 1 persegi panjang", "3 lingkaran"], "answer": 2, "why": "Tabung punya 2 alas lingkaran dan selimut berbentuk persegi panjang."}, {"q": "Alas limas segiempat berbentuk …", "options": ["segitiga", "lingkaran", "segilima", "segiempat"], "answer": 3, "why": "Nama limas mengikuti bentuk alasnya: limas segiempat alasnya segiempat."}, {"q": "Banyak rusuk kubus adalah …", "options": ["6", "12", "8", "10"], "answer": 1, "why": "Kubus punya 12 rusuk: 4 di alas, 4 di tutup, dan 4 tegak."}, {"q": "Bangun ruang yang jaring-jaringnya 1 lingkaran dan 1 juring lingkaran adalah …", "options": ["kerucut", "tabung", "bola", "prisma"], "answer": 0, "why": "Selimut kerucut berbentuk juring lingkaran dan alasnya satu lingkaran."}, {"q": "Banyak sisi prisma segienam adalah …", "options": ["6", "7", "10", "8"], "answer": 3, "why": "2 sisi segienam + 6 sisi persegi panjang = 8 sisi."}, {"q": "Banyak titik sudut limas segitiga adalah …", "options": ["3", "6", "4", "5"], "answer": 2, "why": "3 titik di alas segitiga + 1 titik puncak = 4 titik sudut."}, {"q": "Pola jaring-jaring kubus yang benar adalah …", "options": ["enam persegi berderet lurus", "bentuk salib (1-4-1)", "enam persegi bertumpuk", "tiga persegi berderet"], "answer": 1, "why": "Pola salib 1-4-1 bisa dilipat menutup kubus dari semua arah."}, {"q": "Jika jaring-jaring tabung dibuka, sisi lengkungnya berbentuk …", "options": ["segitiga", "lingkaran", "juring", "persegi panjang"], "answer": 3, "why": "Selimut tabung yang dibuka menjadi persegi panjang dengan panjang sama dengan keliling alas."}];
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
    var prevBest = read('mpi-g5-quiz-best', null); var prevNum = prevBest === null ? -1 : Number(prevBest);
    if (qScore > prevNum) store('mpi-g5-quiz-best', String(qScore));
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
    var saved = null; try { saved = JSON.parse(read('mpi-g5-refleksi', 'null')); } catch (e) { saved = null; }
    if (!saved) return;
    ['refCheck1', 'refCheck2', 'refCheck3'].forEach(function (id, i) { var el = $(id); if (el && saved.checks) el.checked = !!saved.checks[i]; });
    if ($('refContoh') && saved.contoh) $('refContoh').value = saved.contoh;
    if ($('refSulit') && saved.sulit) $('refSulit').value = saved.sulit;
  }
  loadRefleksi();
  var refSave = $('refSave');
  if (refSave) refSave.addEventListener('click', function () {
    var data = { checks: ['refCheck1', 'refCheck2', 'refCheck3'].map(function (id) { var el = $(id); return el ? el.checked : false; }), contoh: $('refContoh') ? $('refContoh').value : '', sulit: $('refSulit') ? $('refSulit').value : '' };
    store('mpi-g5-refleksi', JSON.stringify(data));
    var st = $('refStatus'); if (st) st.textContent = 'Refleksi tersimpan di perangkat ini pada ' + new Date().toLocaleString('id-ID') + '.';
    markVisited('sub6');
  });
})();

/* ================= SIMULASI LIPATAN 3D — port dari mpi-mtk-ix-hz/kelas-9/g5-jaring-jaring/ =================
   Dua blok di bawah ini disalin verbatim dari modul Kelas 9 mendalam (7 canvas):
   (1) SIM3D — lipatan jaring kubus Susunan A–D (Uji Lipat); (2) SIM3DB — lipatan balok,
   prisma segitiga, limas segiempat. Semua fungsi/variabel berada di dalam callback
   DOMContentLoaded masing-masing sehingga tidak bertabrakan dengan kode modul ini
   (tidak ada rename; tidak ada nama yang sama dengan $, fmt, renderNet, markVisited).
   Blok ini tidak memakai localStorage. */
/* ================= SIMULASI LIPATAN 3D (Eksplorasi Uji Lipat) =================
   Setiap susunan dilipat mengikuti pohon sambungan (BFS) dari sel akar:
   tiap sel anak berputar pada engsel rusuk bersama dengan sudut yang sama.
   Geometri lipatannya sama dengan yang dipakai memverifikasi keabsahan
   jaring-jaring ini: susunan valid menutup menjadi kubus, susunan tidak
   valid memperlihatkan sisi yang bertumpuk dan sisi kubus yang kosong. */
if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", function () {
    "use strict";

    var SIM3D = {
      a: { cells: [[0, 0], [1, 0], [2, 0], [3, 0], [1, 1], [1, -1]], root: 1, valid: true,
           pesanJadi: "✓ Terbentuk kubus tertutup — keenam persegi menempati sisi yang berbeda-beda." },
      b: { cells: [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [2, 1]], root: 2, valid: false,
           pesanJadi: "✗ Perhatikan hasil akhirnya: ada persegi yang bertumpuk menempati posisi yang sama (berwarna merah — putar gambarnya untuk melihatnya), dan ada sisi kubus yang kosong. Itulah sebabnya Susunan B bukan jaring-jaring kubus." },
      c: { cells: [[0, 1], [1, 1], [2, 1], [3, 1], [0, 0], [1, 2]], root: 1, valid: true,
           pesanJadi: "✓ Terbentuk kubus tertutup — pola 2-3-1 ini memang jaring-jaring kubus." },
      d: { cells: [[0, 1], [1, 1], [0, 0], [1, 0], [2, 0], [3, 0]], root: 2, valid: false,
           pesanJadi: "✗ Perhatikan hasil akhirnya: ada persegi yang bertumpuk memperebutkan satu posisi sisi (berwarna merah), dan ada sisi kubus yang kosong. Itulah sebabnya Susunan D bukan jaring-jaring kubus." }
    };
    var PESAN_AWAL = "Klik “Lipat Jadi Kubus” atau geser sudut lipatannya. Seret gambar untuk memutar pandangan.";

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

    function bangunPohon(spec) {
      var peta = {};
      spec.cells.forEach(function (sel, i) { peta[sel[0] + "," + sel[1]] = i; });
      var induk = {};
      induk[spec.root] = -1;
      var antre = [spec.root];
      var urut = [spec.root];
      while (antre.length) {
        var i = antre.shift();
        var sel = spec.cells[i];
        [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(function (dd) {
          var k = (sel[0] + dd[0]) + "," + (sel[1] + dd[1]);
          if (k in peta) {
            var j = peta[k];
            if (!(j in induk)) { induk[j] = i; antre.push(j); urut.push(j); }
          }
        });
      }
      return { induk: induk, urut: urut };
    }

    function hitungBingkai(spec, pohon, theta) {
      var hasil = {};
      var akar = spec.cells[spec.root];
      hasil[spec.root] = { c: [akar[0], akar[1], 0], R: [1, 0, 0], U: [0, 1, 0], N: [0, 0, 1] };
      pohon.urut.forEach(function (i) {
        if (i === spec.root) { return; }
        var p = pohon.induk[i];
        var bp = hasil[p];
        var sel = spec.cells[i];
        var selp = spec.cells[p];
        var d = vAdd(vScale(bp.R, sel[0] - selp[0]), vScale(bp.U, sel[1] - selp[1]));
        var sumbu = vCross(bp.N, d);
        var tengah = vAdd(bp.c, vScale(d, 0.5));
        var geser = rotSumbu(vScale(d, 0.5), sumbu, theta);
        hasil[i] = {
          c: vAdd(tengah, geser),
          R: rotSumbu(bp.R, sumbu, theta),
          U: rotSumbu(bp.U, sumbu, theta),
          N: rotSumbu(bp.N, sumbu, theta)
        };
      });
      return hasil;
    }

    document.querySelectorAll(".sim3d-kanvas").forEach(function (kanvas) {
      var kunci = kanvas.getAttribute("data-net");
      var spec = SIM3D[kunci];
      if (!spec) { return; }
      var ctx = kanvas.getContext("2d");
      var pohon = bangunPohon(spec);
      var xs = spec.cells.map(function (s) { return s[0]; });
      var ys = spec.cells.map(function (s) { return s[1]; });
      var geserPusat = [-(Math.min.apply(null, xs) + Math.max.apply(null, xs)) / 2,
                        -(Math.min.apply(null, ys) + Math.max.apply(null, ys)) / 2, 0];
      var lebarSel = Math.max.apply(null, xs) - Math.min.apply(null, xs) + 1;
      var skala = Math.min(110, 600 / lebarSel);
      // Sel yang bertabrakan pada lipatan penuh (khusus susunan tidak valid):
      // dua sel menempati slot sisi kubus yang sama (pusat + normal sama pada 90°).
      var tabrak = {};
      (function () {
        var b90 = hitungBingkai(spec, pohon, Math.PI / 2);
        var slot = {};
        spec.cells.forEach(function (sel, i) {
          var b = b90[i];
          var pus = vAdd(b.c, b.N);
          var k = pus.map(function (v) { return Math.round(v * 100); }).join(",");
          if (k in slot) { tabrak[i] = true; tabrak[slot[k]] = true; }
          else { slot[k] = i; }
        });
      })();
      var st = { theta: 0, target: 0, yaw: -0.42, pitch: 0.34, raf: 0 };
      var tombol = document.querySelector('.btn-lipat[data-net="' + kunci + '"]');
      var geserEl = document.querySelector('.sim3d-geser[data-net="' + kunci + '"]');
      var statusEl = document.querySelector('.sim3d-status[data-net="' + kunci + '"]');
      if (statusEl) { statusEl.textContent = PESAN_AWAL; }

      function perbaruiStatus() {
        if (!statusEl) { return; }
        if (st.theta >= 89.5) { statusEl.textContent = spec.pesanJadi; }
        else if (st.theta <= 0.5) { statusEl.textContent = PESAN_AWAL; }
        else { statusEl.textContent = "Sedang melipat… sudut " + Math.round(st.theta) + "° dari 90°."; }
        if (tombol) {
          tombol.textContent = st.target >= 90 ? "↺ Buka Lagi" : "▶ Lipat Jadi Kubus";
        }
      }

      function gambar() {
        var W = kanvas.width, H = kanvas.height;
        ctx.clearRect(0, 0, W, H);
        var theta = st.theta * Math.PI / 180;
        var bingkai = hitungBingkai(spec, pohon, theta);
        function putar(v) {
          return rotSumbu(rotSumbu(v, [0, 1, 0], st.yaw), [1, 0, 0], st.pitch);
        }
        var wajah = [];
        spec.cells.forEach(function (sel, i) {
          var b = bingkai[i];
          var c = putar(vAdd(b.c, geserPusat));
          var R = putar(b.R), U = putar(b.U), N = putar(b.N);
          var sudut = [];
          [[-0.5, -0.5], [0.5, -0.5], [0.5, 0.5], [-0.5, 0.5]].forEach(function (k) {
            var titik = vAdd(c, vAdd(vScale(R, k[0]), vScale(U, k[1])));
            sudut.push([W / 2 + titik[0] * skala, H / 2 - titik[1] * skala]);
          });
          wajah.push({ sudut: sudut, dalam: c[2], nz: N[2], idx: i, tabrak: !!tabrak[i] });
        });
        wajah.sort(function (p, q) { return (p.dalam + p.idx * 0.002) - (q.dalam + q.idx * 0.002); });
        var sudutDerajat = st.theta;
        wajah.forEach(function (w) {
          var t = (w.nz + 1) / 2;
          var r = Math.round(147 + (219 - 147) * t);
          var g = Math.round(197 + (234 - 197) * t);
          var b = Math.round(253 + (254 - 253) * t);
          var garis = "#1E3A8A";
          if (w.tabrak && sudutDerajat > 55) {
            // Sisi yang bertumpuk diwarnai merah, makin jelas menjelang lipatan penuh.
            var f = Math.min(1, (sudutDerajat - 55) / 35);
            var rr = Math.round(220 + (254 - 220) * t);
            var gg = Math.round(90 + (202 - 90) * t);
            var bb = Math.round(90 + (202 - 90) * t);
            r = Math.round(r + (rr - r) * f);
            g = Math.round(g + (gg - g) * f);
            b = Math.round(b + (bb - b) * f);
            if (f > 0.6) { garis = "#B91C1C"; }
          }
          ctx.beginPath();
          w.sudut.forEach(function (s, i) { if (i === 0) { ctx.moveTo(s[0], s[1]); } else { ctx.lineTo(s[0], s[1]); } });
          ctx.closePath();
          ctx.fillStyle = "rgba(" + r + "," + g + "," + b + ",0.88)";
          ctx.fill();
          ctx.strokeStyle = garis;
          ctx.lineWidth = 2.5;
          ctx.stroke();
        });
      }

      function animasi() {
        cancelAnimationFrame(st.raf);
        var dari = st.theta, ke = st.target, t0 = null;
        function langkah(ts) {
          if (!t0) { t0 = ts; }
          var p = Math.min(1, (ts - t0) / 1500);
          var e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
          st.theta = dari + (ke - dari) * e;
          if (geserEl) { geserEl.value = st.theta; }
          gambar();
          perbaruiStatus();
          if (p < 1) { st.raf = requestAnimationFrame(langkah); }
        }
        st.raf = requestAnimationFrame(langkah);
      }

      if (tombol) {
        tombol.addEventListener("click", function () {
          st.target = st.target >= 90 ? 0 : 90;
          perbaruiStatus();
          animasi();
        });
      }
      if (geserEl) {
        geserEl.addEventListener("input", function () {
          cancelAnimationFrame(st.raf);
          st.theta = parseFloat(geserEl.value);
          st.target = st.theta >= 89.5 ? 90 : 0;
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
  });
}

/* ================= SIMULASI LIPATAN 3D BANGUN LAIN (Sub-bab 4) =================
   Mesin lipat umum untuk sisi berbentuk poligon (persegi panjang & segitiga).
   Setiap sisi anak berputar pada engsel rusuk bersamanya dengan sudut khas
   bangunnya: balok semua 90°; prisma mengikuti sudut segitiganya
   (126,87° dan 106,26°, tutup 90°); limas 126,87° sampai keempat puncak
   segitiga bertemu di satu titik. Semua sudut dan titik-temu sudah
   diverifikasi numerik sebelum modul ini dibangun. */
if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", function () {
    "use strict";

    function rect(x0, y0, x1, y1) { return [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]; }

    var SIM3DB = {
      balok: {
        pesanJadi: "✓ Terbentuk balok tertutup — perhatikan: sisi yang berhadapan selalu sama ukurannya (p × t dengan p × t, l × t dengan l × t, dan kedua tutup p × l berwarna kuning).",
        faces: [
          { poly: rect(0, 0, 3, 1.6), ref: [1.5, 0.8], parent: -1 },
          { poly: rect(3, 0, 5, 1.6), ref: [4, 0.8], parent: 0, dir: [1, 0], pHalf: 1.5, maxAng: 90 },
          { poly: rect(5, 0, 8, 1.6), ref: [6.5, 0.8], parent: 1, dir: [1, 0], pHalf: 1.0, maxAng: 90 },
          { poly: rect(8, 0, 10, 1.6), ref: [9, 0.8], parent: 2, dir: [1, 0], pHalf: 1.5, maxAng: 90 },
          { poly: rect(0, 1.6, 3, 3.6), ref: [1.5, 2.6], parent: 0, dir: [0, 1], pHalf: 0.8, maxAng: 90, amber: true },
          { poly: rect(0, -2, 3, 0), ref: [1.5, -1], parent: 0, dir: [0, -1], pHalf: 0.8, maxAng: 90, amber: true }
        ]
      },
      prisma: {
        pesanJadi: "✓ Terbentuk prisma segitiga tertutup — ketiga persegi panjang melingkungi sisi segitiga, dan kedua segitiga kuning menjadi alas dan tutup yang kongruen.",
        faces: [
          { poly: rect(0, 0, 2.4, 3), ref: [1.2, 1.5], parent: -1 },
          { poly: rect(2.4, 0, 4.4, 3), ref: [3.4, 1.5], parent: 0, dir: [1, 0], pHalf: 1.2, maxAng: 126.8699 },
          { poly: rect(4.4, 0, 6.4, 3), ref: [5.4, 1.5], parent: 1, dir: [1, 0], pHalf: 1.0, maxAng: 106.2602 },
          { poly: [[2.4, 3], [4.4, 3], [3.84, 4.92]], ref: [3.547, 3.64], parent: 1, dir: [0, 1], pHalf: 1.5, maxAng: 90, amber: true },
          { poly: [[0, 0], [2.4, 0], [1.2, -1.6]], ref: [1.2, -0.533], parent: 0, dir: [0, -1], pHalf: 1.5, maxAng: 90, amber: true }
        ]
      },
      limas: {
        pesanJadi: "✓ Terbentuk limas segiempat — keempat segitiga kuning naik dan bertemu tepat di satu titik puncak di atas pusat persegi.",
        faces: [
          { poly: rect(0, 0, 2.4, 2.4), ref: [1.2, 1.2], parent: -1 },
          { poly: [[0, 2.4], [2.4, 2.4], [1.2, 4.4]], ref: [1.2, 3.067], parent: 0, dir: [0, 1], pHalf: 1.2, maxAng: 126.8699, amber: true },
          { poly: [[0, 0], [2.4, 0], [1.2, -2.0]], ref: [1.2, -0.667], parent: 0, dir: [0, -1], pHalf: 1.2, maxAng: 126.8699, amber: true },
          { poly: [[2.4, 0], [2.4, 2.4], [4.4, 1.2]], ref: [3.067, 1.2], parent: 0, dir: [1, 0], pHalf: 1.2, maxAng: 126.8699, amber: true },
          { poly: [[0, 0], [0, 2.4], [-2.0, 1.2]], ref: [-0.667, 1.2], parent: 0, dir: [-1, 0], pHalf: 1.2, maxAng: 126.8699, amber: true }
        ]
      }
    };
    var PESAN_AWAL_B = "Klik tombol lipat atau geser proses lipatannya. Seret gambar untuk memutar pandangan.";

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

    function hitungBingkaiB(spec, prog) {
      var hasil = [];
      spec.faces.forEach(function (f, i) {
        if (f.parent < 0) {
          hasil[i] = { c: [f.ref[0], f.ref[1], 0], R: [1, 0, 0], U: [0, 1, 0], N: [0, 0, 1] };
          return;
        }
        var pf = spec.faces[f.parent];
        var bp = hasil[f.parent];
        var d = vAdd(vScale(bp.R, f.dir[0]), vScale(bp.U, f.dir[1]));
        var sumbu = vCross(bp.N, d);
        var ang = f.maxAng * prog * Math.PI / 180;
        var hinge = vAdd(bp.c, vScale(d, f.pHalf));
        var hingeNet = [pf.ref[0] + f.dir[0] * f.pHalf, pf.ref[1] + f.dir[1] * f.pHalf];
        var offNet = vAdd(vScale(bp.R, f.ref[0] - hingeNet[0]), vScale(bp.U, f.ref[1] - hingeNet[1]));
        var off = rotSumbu(offNet, sumbu, ang);
        hasil[i] = {
          c: vAdd(hinge, off),
          R: rotSumbu(bp.R, sumbu, ang),
          U: rotSumbu(bp.U, sumbu, ang),
          N: rotSumbu(bp.N, sumbu, ang)
        };
      });
      return hasil;
    }

    document.querySelectorAll(".sim3d-kanvas-b").forEach(function (kanvas) {
      var kunci = kanvas.getAttribute("data-bangun");
      var spec = SIM3DB[kunci];
      if (!spec) { return; }
      var ctx = kanvas.getContext("2d");
      var semuaX = [], semuaY = [];
      spec.faces.forEach(function (f) {
        f.poly.forEach(function (titik) { semuaX.push(titik[0]); semuaY.push(titik[1]); });
      });
      var geserPusat = [-(Math.min.apply(null, semuaX) + Math.max.apply(null, semuaX)) / 2,
                        -(Math.min.apply(null, semuaY) + Math.max.apply(null, semuaY)) / 2, 0];
      var lebarNet = Math.max.apply(null, semuaX) - Math.min.apply(null, semuaX);
      var tinggiNet = Math.max.apply(null, semuaY) - Math.min.apply(null, semuaY);
      var skalaDasar = Math.min(600 / lebarNet, 420 / tinggiNet);
      var st = { prog: 0, target: 0, yaw: -0.5, pitch: 0.38, raf: 0 };
      if (kunci === "limas") { st.yaw = 2.85; st.pitch = 0.45; }
      var tombol = document.querySelector('.btn-lipat[data-bangun="' + kunci + '"]');
      var labelLipat = tombol ? tombol.textContent : "";
      var geserEl = document.querySelector('.sim3d-geser-b[data-bangun="' + kunci + '"]');
      var statusEl = document.querySelector('.sim3d-status-b[data-bangun="' + kunci + '"]');
      if (statusEl) { statusEl.textContent = PESAN_AWAL_B; }

      function perbaruiStatus() {
        if (!statusEl) { return; }
        if (st.prog >= 0.995) { statusEl.textContent = spec.pesanJadi; }
        else if (st.prog <= 0.005) { statusEl.textContent = PESAN_AWAL_B; }
        else { statusEl.textContent = "Sedang melipat… " + Math.round(st.prog * 100) + "% menuju bangun utuh."; }
        if (tombol) { tombol.textContent = st.target >= 1 ? "↺ Buka Lagi" : labelLipat; }
      }

      function gambar() {
        var W = kanvas.width, H = kanvas.height;
        ctx.clearRect(0, 0, W, H);
        var bingkai = hitungBingkaiB(spec, st.prog);
        function putar(v) {
          return rotSumbu(rotSumbu(v, [0, 1, 0], st.yaw), [1, 0, 0], st.pitch);
        }
        var mentah = [];
        var minX = 1e9, maxX = -1e9, minY = 1e9, maxY = -1e9;
        spec.faces.forEach(function (f, i) {
          var b = bingkai[i];
          var N = putar(b.N);
          var sudut = [];
          var zRata = 0;
          f.poly.forEach(function (titik) {
            var dunia = vAdd(vAdd(b.c, geserPusat), vAdd(vScale(b.R, titik[0] - f.ref[0]), vScale(b.U, titik[1] - f.ref[1])));
            var pv = putar(dunia);
            sudut.push(pv);
            zRata += pv[2];
            if (pv[0] < minX) { minX = pv[0]; }
            if (pv[0] > maxX) { maxX = pv[0]; }
            if (pv[1] < minY) { minY = pv[1]; }
            if (pv[1] > maxY) { maxY = pv[1]; }
          });
          mentah.push({ sudut: sudut, dalam: zRata / f.poly.length, nz: N[2], idx: i, amber: !!f.amber });
        });
        // Pas-kan & pusatkan hasil render saat ini ke kanvas pada setiap sudut lipatan.
        // Margin sangat lega (230px horizontal, 210px vertikal) dan pembesaran dibatasi
        // 1,15x skala jaring datar, supaya bangun tampil kecil dan selalu terlihat utuh
        // dengan ruang napas besar di semua sisi, termasuk atas, pada layar sempit.
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
          w.sudut.forEach(function (s, i) { if (i === 0) { ctx.moveTo(s[0], s[1]); } else { ctx.lineTo(s[0], s[1]); } });
          ctx.closePath();
          ctx.fillStyle = "rgba(" + r + "," + g + "," + b + ",0.92)";
          ctx.fill();
          ctx.strokeStyle = garis;
          ctx.lineWidth = 2.5;
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
  });
}
