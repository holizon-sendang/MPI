/* A.7 Sistem Persamaan Linear Dua Variabel — script.js (vanilla JS, tanpa framework).
   localStorage: mpi-a7-visited, mpi-a7-quiz-best, mpi-a7-refleksi. */
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
  try { visited = JSON.parse(read('mpi-a7-visited', '[]')) || []; } catch (e) { visited = []; }
  if (!Array.isArray(visited)) visited = [];
  function saveVisited() { store('mpi-a7-visited', JSON.stringify(visited)); }
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
  var bestStored = read('mpi-a7-quiz-best', null);
  var bestEl = $('quizBestText');
  if (bestStored !== null && bestEl) { bestEl.textContent = 'Skor terbaik kuis: ' + bestStored + '/10'; bestEl.hidden = false; }

  /* Cek pasangan (x,y) pada x + y = 7 dan 2x - y = 5 (penyelesaian x=4, y=3) */
  var cekBtn = $('cekBtn');
  if (cekBtn) cekBtn.addEventListener('click', function () {
    var x = parseNum($('cekX')), y = parseNum($('cekY'));
    if (x === null || y === null) { showFb($('cekFb'), false, 'Isi x dan y dulu dengan bilangan bulat.'); return; }
    var ok1 = x + y === 7, ok2 = 2 * x - y === 5;
    showFb($('cekFb'), ok1 && ok2,
      ok1 && ok2 ? 'Benar! (' + x + ', ' + y + ') memenuhi kedua persamaan, jadi inilah penyelesaiannya.'
      : 'Pasangan (' + x + ', ' + y + '): persamaan 1 ' + (ok1 ? 'terpenuhi' : 'tidak terpenuhi (x+y=' + (x + y) + ', harus 7)') + '; persamaan 2 ' + (ok2 ? 'terpenuhi' : 'tidak terpenuhi (2x-y=' + (2 * x - y) + ', harus 5)') + '. Coba pasangan lain.');
  });
  /* Grafik: y = 7 - x, geser x */
  var glX = $('glX');
  function renderGl() { if (!glX) return; var x = Number(glX.value); var y = 7 - x; var v = $('glXVal'); if (v) v.textContent = 'x = ' + x; var h = $('glHasil'); if (h) h.textContent = 'Titik (' + x + ', ' + y + ') ada di garis y = 7 \u2212 x, karena ' + x + ' + ' + y + ' = 7.'; }
  if (glX) { glX.addEventListener('input', renderGl); renderGl(); }
  /* Solver SPLDV (aturan Cramer) + langkah eliminasi */
  var solveBtn = $('solveBtn');
  if (solveBtn) solveBtn.addEventListener('click', function () {
    var a1 = parseNum($('sA1')), b1 = parseNum($('sB1')), c1 = parseNum($('sC1'));
    var a2 = parseNum($('sA2')), b2 = parseNum($('sB2')), c2 = parseNum($('sC2'));
    var h = $('solveHasil'), l = $('solveLangkah');
    if ([a1, b1, c1, a2, b2, c2].indexOf(null) !== -1) { if (h) h.textContent = 'Isi keenam koefisien dulu.'; if (l) l.textContent = ''; return; }
    var D = a1 * b2 - a2 * b1;
    if (D === 0) { if (h) h.textContent = 'Tidak ada penyelesaian tunggal (garis sejajar atau berimpit).'; if (l) l.textContent = 'Determinan a1b2 \u2212 a2b1 = 0, jadi kedua garis tidak berpotongan di satu titik.'; return; }
    var x = (c1 * b2 - c2 * b1) / D, y = (a1 * c2 - a2 * c1) / D;
    if (h) h.textContent = 'x = ' + fmtDec(x, 2).replace(',00', '') + ', y = ' + fmtDec(y, 2).replace(',00', '');
    if (l) l.textContent = 'Eliminasi: kalikan persamaan 1 dengan ' + b2 + ' dan persamaan 2 dengan ' + b1 + ', kurangkan untuk menghilangkan y, lalu substitusikan x untuk mencari y. Cek: ' + a1 + 'x + ' + b1 + 'y = ' + (a1 * x + b1 * y).toFixed(2).replace('.', ',') + ' (harus ' + c1 + ').';
  });
  /* Pilih metode */
  document.querySelectorAll('[data-met]').forEach(function (b) {
    b.addEventListener('click', function () {
      document.querySelectorAll('[data-met]').forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
      b.setAttribute('aria-pressed', 'true');
      var m = b.getAttribute('data-met'); var h = $('metHasil');
      if (!h) return;
      h.textContent = m === 'grafik' ? 'Grafik: gambar kedua garis, penyelesaiannya titik potongnya. Cocok untuk melihat, tapi kurang teliti kalau titik potongnya bukan bilangan bulat.'
        : m === 'substitusi' ? 'Substitusi: nyatakan satu variabel dari satu persamaan, lalu gantikan ke persamaan lain. Cocok kalau salah satu koefisiennya 1 atau \u22121.'
        : m === 'eliminasi' ? 'Eliminasi: samakan koefisien satu variabel, lalu jumlahkan/kurangkan kedua persamaan. Cocok kalau koefisiennya mudah disamakan.'
        : 'Campuran: eliminasi dulu untuk satu variabel, lalu substitusi untuk variabel lainnya. Paling fleksibel untuk soal cerita.';
    });
  });
  /* Pemodelan soal cerita */
  document.querySelectorAll('[data-model]').forEach(function (b) {
    b.addEventListener('click', function () {
      var ok = b.getAttribute('data-model') === 'benar';
      showFb($('modelFb'), ok, ok ? 'Benar! Misal x = harga 1 buku, y = harga 1 pensil. Modelnya: 2x + y = 9.000 dan x + y = 6.000, penyelesaiannya x = 3.000, y = 3.000.'
        : 'Belum tepat. Perhatikan: 2 buku + 1 pensil = Rp9.000, dan 1 buku + 1 pensil = Rp6.000. Coba lagi.');
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
  var QUIZ = [{"q": "Penyelesaian dari x + y = 9 dan x − y = 3 adalah x = …", "options": ["6", "3", "4", "5"], "answer": 0, "why": "Jumlahkan kedua persamaan: 2x = 12, jadi x = 6 (dan y = 3)."}, {"q": "Nilai y dari sistem x + y = 8 dan 2x − y = 4 adalah …", "options": ["2", "4", "6", "8"], "answer": 1, "why": "Dari kedua persamaan diperoleh x = 4, lalu y = 8 − 4 = 4."}, {"q": "Penyelesaian SPLDV dengan metode grafik adalah …", "options": ["jumlah kedua gradien", "selisih kedua gradien", "titik potong kedua garis", "titik puncak garis"], "answer": 2, "why": "Titik potong memenuhi kedua persamaan sekaligus, jadi itulah penyelesaiannya."}, {"q": "Nilai y dari sistem x + 3y = 14 dan x + y = 6 adalah …", "options": ["2", "3", "5", "4"], "answer": 3, "why": "Kurangkan: 2y = 8, jadi y = 4 (dan x = 2)."}, {"q": "Substitusikan x = 2y ke x + y = 9. Nilai y adalah …", "options": ["2", "3", "4", "6"], "answer": 1, "why": "2y + y = 9, jadi 3y = 9 dan y = 3."}, {"q": "Nilai x dari sistem 3x + y = 11 dan x − y = 1 adalah …", "options": ["3", "2", "4", "5"], "answer": 0, "why": "Jumlahkan: 4x = 12, jadi x = 3 (dan y = 2)."}, {"q": "2 buku + 1 pensil = Rp9.000; 1 buku + 1 pensil = Rp6.000. Harga 1 buku adalah …", "options": ["Rp2.000", "Rp2.500", "Rp4.000", "Rp3.000"], "answer": 3, "why": "Kurangkan kedua persamaan: 1 buku = 9.000 − 6.000 = Rp3.000."}, {"q": "Nilai y dari sistem x + 2y = 11 dan 2x − y = 7 adalah …", "options": ["2", "5", "3", "4"], "answer": 2, "why": "Dari persamaan pertama x = 11 − 2y; substitusi ke persamaan kedua memberi y = 3 (dan x = 5)."}, {"q": "Jika kedua garis sejajar dan tidak berimpit, banyak penyelesaiannya adalah …", "options": ["1", "0", "2", "tak hingga"], "answer": 1, "why": "Garis sejajar tidak pernah berpotongan, jadi tidak ada pasangan (x, y) yang memenuhi keduanya."}, {"q": "Nilai y dari sistem 5x − 2y = 4 dan 3x + y = 9 adalah …", "options": ["1", "2", "4", "3"], "answer": 3, "why": "Dari persamaan kedua y = 9 − 3x; substitusi memberi x = 2, lalu y = 9 − 6 = 3."}];
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
    var prevBest = read('mpi-a7-quiz-best', null); var prevNum = prevBest === null ? -1 : Number(prevBest);
    if (qScore > prevNum) store('mpi-a7-quiz-best', String(qScore));
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
    var saved = null; try { saved = JSON.parse(read('mpi-a7-refleksi', 'null')); } catch (e) { saved = null; }
    if (!saved) return;
    ['refCheck1', 'refCheck2', 'refCheck3'].forEach(function (id, i) { var el = $(id); if (el && saved.checks) el.checked = !!saved.checks[i]; });
    if ($('refContoh') && saved.contoh) $('refContoh').value = saved.contoh;
    if ($('refSulit') && saved.sulit) $('refSulit').value = saved.sulit;
  }
  loadRefleksi();
  var refSave = $('refSave');
  if (refSave) refSave.addEventListener('click', function () {
    var data = { checks: ['refCheck1', 'refCheck2', 'refCheck3'].map(function (id) { var el = $(id); return el ? el.checked : false; }), contoh: $('refContoh') ? $('refContoh').value : '', sulit: $('refSulit') ? $('refSulit').value : '' };
    store('mpi-a7-refleksi', JSON.stringify(data));
    var st = $('refStatus'); if (st) st.textContent = 'Refleksi tersimpan di perangkat ini pada ' + new Date().toLocaleString('id-ID') + '.';
    markVisited('sub6');
  });
})();
