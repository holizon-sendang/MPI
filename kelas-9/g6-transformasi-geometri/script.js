/* G.6 Transformasi Geometri — script.js (vanilla JS, tanpa framework).
   localStorage: mpi-g6-visited, mpi-g6-quiz-best, mpi-g6-refleksi. */
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
  try { visited = JSON.parse(read('mpi-g6-visited', '[]')) || []; } catch (e) { visited = []; }
  if (!Array.isArray(visited)) visited = [];
  function saveVisited() { store('mpi-g6-visited', JSON.stringify(visited)); }
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
  var bestStored = read('mpi-g6-quiz-best', null);
  var bestEl = $('quizBestText');
  if (bestStored !== null && bestEl) { bestEl.textContent = 'Skor terbaik kuis: ' + bestStored + '/10'; bestEl.hidden = false; }

  /* Kalkulator transformasi titik */
  var trBtn = $('trBtn');
  if (trBtn) trBtn.addEventListener('click', function () {
    var jenis = $('trJenis') ? $('trJenis').value : 'translasi';
    var x = parseNum($('trX')), y = parseNum($('trY'));
    var a = parseNum($('trA')), b = parseNum($('trB'));
    var h = $('trHasil'), d = $('trDetail');
    if (x === null || y === null) { if (h) h.textContent = 'Isi koordinat titik (x, y) dulu.'; return; }
    var nx, ny, ket;
    if (jenis === 'translasi') {
      if (a === null || b === null) { if (h) h.textContent = 'Isi pergeseran a dan b.'; return; }
      nx = x + a; ny = y + b; ket = 'Translasi (' + a + ', ' + b + '): x\u2032 = x + a = ' + x + ' + ' + a + ' = ' + nx + '; y\u2032 = y + b = ' + y + ' + ' + b + ' = ' + ny + '.';
    } else if (jenis === 'refx') { nx = x; ny = -y; ket = 'Refleksi terhadap sumbu x: (x, y) \u2192 (x, \u2212y). Tanda y berubah.'; }
    else if (jenis === 'refy') { nx = -x; ny = y; ket = 'Refleksi terhadap sumbu y: (x, y) \u2192 (\u2212x, y). Tanda x berubah.'; }
    else if (jenis === 'refxy') { nx = y; ny = x; ket = 'Refleksi terhadap garis y = x: (x, y) \u2192 (y, x). Koordinat bertukar tempat.'; }
    else if (jenis === 'rot90') { nx = -y; ny = x; ket = 'Rotasi 90° berlawanan jarum jam terhadap O: (x, y) \u2192 (\u2212y, x).'; }
    else if (jenis === 'rot180') { nx = -x; ny = -y; ket = 'Rotasi 180° terhadap O: (x, y) \u2192 (\u2212x, \u2212y). Kedua tanda berubah.'; }
    else { var k = a === null ? 2 : a; nx = k * x; ny = k * y; ket = 'Dilatasi faktor ' + k + ' terhadap O: (x, y) \u2192 (' + k + 'x, ' + k + 'y). Jarak titik ke pusat dikali ' + k + '.'; }
    if (h) h.textContent = '(' + x + ', ' + y + ') \u2192 (' + nx + ', ' + ny + ')';
    if (d) d.textContent = ket;
  });
  /* Peta titik: gambar titik asal & bayangan di grid */
  var trShow = $('trShow');
  function drawGrid() {
    var svg = $('trSvg'); if (!svg) return;
    var jenis = $('trJenis2') ? $('trJenis2').value : 'translasi';
    var x = 2, y = 3, nx, ny;
    if (jenis === 'translasi') { nx = x + 3; ny = y - 2; }
    else if (jenis === 'refx') { nx = x; ny = -y; }
    else if (jenis === 'refy') { nx = -x; ny = y; }
    else if (jenis === 'rot90') { nx = -y; ny = x; }
    else { nx = 2 * x; ny = 2 * y; }
    function px(v) { return 150 + v * 25; }
    function py(v) { return 150 - v * 25; }
    var html = '<line x1="0" y1="150" x2="300" y2="150" stroke="#0F172A" stroke-width="1.5"/><line x1="150" y1="0" x2="150" y2="300" stroke="#0F172A" stroke-width="1.5"/>';
    var g;
    for (g = -5; g <= 5; g++) { html += '<line x1="' + px(g) + '" y1="0" x2="' + px(g) + '" y2="300" stroke="#DCE6F5" stroke-width="1"/><line x1="0" y1="' + py(g) + '" x2="300" y2="' + py(g) + '" stroke="#DCE6F5" stroke-width="1"/>'; }
    html += '<circle cx="' + px(x) + '" cy="' + py(y) + '" r="8" fill="#2563EB"/><text x="' + (px(x) + 10) + '" y="' + (py(y) - 8) + '" font-size="13" font-weight="700" fill="#2563EB">A(' + x + ', ' + y + ')</text>';
    html += '<circle cx="' + px(nx) + '" cy="' + py(ny) + '" r="8" fill="#D97706"/><text x="' + (px(nx) + 10) + '" y="' + (py(ny) - 8) + '" font-size="13" font-weight="700" fill="#D97706">A\u2032(' + nx + ', ' + ny + ')</text>';
    html += '<line x1="' + px(x) + '" y1="' + py(y) + '" x2="' + px(nx) + '" y2="' + py(ny) + '" stroke="#D97706" stroke-width="2" stroke-dasharray="5 4"/>';
    svg.innerHTML = html;
    var cap = $('trCap'); if (cap) cap.textContent = 'Titik A(2, 3) dipetakan menjadi A\u2032(' + nx + ', ' + ny + ') dengan ' + (jenis === 'translasi' ? 'translasi (3, \u22122)' : jenis === 'refx' ? 'refleksi sumbu x' : jenis === 'refy' ? 'refleksi sumbu y' : jenis === 'rot90' ? 'rotasi 90° berlawanan jarum jam' : 'dilatasi faktor 2') + '.';
  }
  if (trShow) trShow.addEventListener('click', drawGrid);
  var trJenis2 = $('trJenis2');
  if (trJenis2) trJenis2.addEventListener('change', drawGrid);
  drawGrid();

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
  var QUIZ = [{"q": "Bayangan titik (3, 4) oleh translasi (2, −1) adalah …", "options": ["(5, 3)", "(1, 5)", "(5, 5)", "(3, 3)"], "answer": 0, "why": "x′ = 3 + 2 = 5; y′ = 4 − 1 = 3."}, {"q": "Bayangan titik (4, −3) oleh refleksi terhadap sumbu y adalah …", "options": ["(4, 3)", "(−4, −3)", "(−4, 3)", "(3, −4)"], "answer": 1, "why": "Refleksi sumbu y: (x, y) → (−x, y), jadi (4, −3) → (−4, −3)."}, {"q": "Bayangan titik (2, 5) oleh rotasi 90° berlawanan jarum jam terhadap O adalah …", "options": ["(5, −2)", "(5, 2)", "(−5, 2)", "(−2, −5)"], "answer": 2, "why": "Rotasi 90° CCW: (x, y) → (−y, x), jadi (2, 5) → (−5, 2)."}, {"q": "Bayangan titik (3, −2) oleh dilatasi faktor 2 terhadap O adalah …", "options": ["(5, 0)", "(3, −4)", "(1, 0)", "(6, −4)"], "answer": 3, "why": "Dilatasi faktor 2: (3, −2) → (6, −4)."}, {"q": "Bayangan titik (5, 7) oleh refleksi terhadap sumbu x adalah …", "options": ["(−5, 7)", "(5, −7)", "(−5, −7)", "(7, 5)"], "answer": 1, "why": "Refleksi sumbu x: (x, y) → (x, −y), jadi (5, 7) → (5, −7)."}, {"q": "Bayangan titik (−2, 6) oleh translasi (5, −3) adalah …", "options": ["(3, 3)", "(3, 9)", "(−7, 3)", "(7, 3)"], "answer": 0, "why": "x′ = −2 + 5 = 3; y′ = 6 − 3 = 3."}, {"q": "Bayangan titik (4, −1) oleh rotasi 180° terhadap O adalah …", "options": ["(4, 1)", "(−1, 4)", "(1, −4)", "(−4, 1)"], "answer": 3, "why": "Rotasi 180°: (x, y) → (−x, −y), jadi (4, −1) → (−4, 1)."}, {"q": "Bayangan titik (8, 6) oleh dilatasi faktor ½ terhadap O adalah …", "options": ["(16, 12)", "(2, 3)", "(4, 3)", "(8, 3)"], "answer": 2, "why": "Dilatasi faktor ½: (8, 6) → (4, 3)."}, {"q": "Bayangan titik (3, 8) oleh refleksi terhadap garis y = x adalah …", "options": ["(3, −8)", "(8, 3)", "(−8, 3)", "(−3, 8)"], "answer": 1, "why": "Refleksi y = x: (x, y) → (y, x), jadi (3, 8) → (8, 3)."}, {"q": "Bayangan titik (0, 0) oleh translasi (−3, 4) adalah …", "options": ["(3, −4)", "(−4, 3)", "(4, −3)", "(−3, 4)"], "answer": 3, "why": "x′ = 0 − 3 = −3; y′ = 0 + 4 = 4."}];
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
    var prevBest = read('mpi-g6-quiz-best', null); var prevNum = prevBest === null ? -1 : Number(prevBest);
    if (qScore > prevNum) store('mpi-g6-quiz-best', String(qScore));
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
    var saved = null; try { saved = JSON.parse(read('mpi-g6-refleksi', 'null')); } catch (e) { saved = null; }
    if (!saved) return;
    ['refCheck1', 'refCheck2', 'refCheck3'].forEach(function (id, i) { var el = $(id); if (el && saved.checks) el.checked = !!saved.checks[i]; });
    if ($('refContoh') && saved.contoh) $('refContoh').value = saved.contoh;
    if ($('refSulit') && saved.sulit) $('refSulit').value = saved.sulit;
  }
  loadRefleksi();
  var refSave = $('refSave');
  if (refSave) refSave.addEventListener('click', function () {
    var data = { checks: ['refCheck1', 'refCheck2', 'refCheck3'].map(function (id) { var el = $(id); return el ? el.checked : false; }), contoh: $('refContoh') ? $('refContoh').value : '', sulit: $('refSulit') ? $('refSulit').value : '' };
    store('mpi-g6-refleksi', JSON.stringify(data));
    var st = $('refStatus'); if (st) st.textContent = 'Refleksi tersimpan di perangkat ini pada ' + new Date().toLocaleString('id-ID') + '.';
    markVisited('sub6');
  });
})();
