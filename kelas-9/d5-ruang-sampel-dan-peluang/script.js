/* D.5 Ruang Sampel dan Peluang — script.js (vanilla JS, tanpa framework).
   localStorage: mpi-d5-visited, mpi-d5-quiz-best, mpi-d5-refleksi. */
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
  try { visited = JSON.parse(read('mpi-d5-visited', '[]')) || []; } catch (e) { visited = []; }
  if (!Array.isArray(visited)) visited = [];
  function saveVisited() { store('mpi-d5-visited', JSON.stringify(visited)); }
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
  var bestStored = read('mpi-d5-quiz-best', null);
  var bestEl = $('quizBestText');
  if (bestStored !== null && bestEl) { bestEl.textContent = 'Skor terbaik kuis: ' + bestStored + '/10'; bestEl.hidden = false; }

  /* Pelempar dadu: lempar, catat frekuensi tiap mata */
  var counts = [0, 0, 0, 0, 0, 0];
  var totalLempar = 0;
  function renderDadu(last) {
    var h = $('daduHasil');
    if (h) h.textContent = last === null ? 'Belum melempar.' : 'Mata dadu: ' + last;
    var d = $('daduDetail');
    if (d) d.textContent = totalLempar === 0 ? 'Tekan tombol Lempar Dadu.' : 'Total lemparan: ' + totalLempar + '. Frekuensi: ' + counts.map(function (c, i) { return (i + 1) + '→' + c; }).join(' · ');
    var bars = $('daduBars');
    if (bars) {
      var mx = Math.max.apply(null, counts.concat([1]));
      bars.innerHTML = counts.map(function (c, i) { return '<div class="bar-row"><span class="bar-label">Mata ' + (i + 1) + '</span><span class="bar-track"><span class="bar-fill" style="display:block;width:' + Math.round(c / mx * 100) + '%"></span></span><span>' + c + '</span></div>'; }).join('');
    }
  }
  var daduBtn = $('daduBtn');
  if (daduBtn) daduBtn.addEventListener('click', function () { var v = 1 + Math.floor(Math.random() * 6); counts[v - 1]++; totalLempar++; renderDadu(v); });
  var daduReset = $('daduReset');
  if (daduReset) daduReset.addEventListener('click', function () { counts = [0, 0, 0, 0, 0, 0]; totalLempar = 0; renderDadu(null); });
  renderDadu(null);
  /* Kalkulator ruang sampel & peluang */
  var spBtn = $('spBtn');
  if (spBtn) spBtn.addEventListener('click', function () {
    var perc = $('spPerc') ? $('spPerc').value : 'dadu1';
    var h = $('spHasil'), d = $('spDetail');
    var data = { dadu1: ['1 dadu', 6, 'muncul mata 3', 1], dadu2: ['2 dadu', 36, 'jumlah mata 7', 6], koin1: ['1 koin', 2, 'muncul gambar', 1], koin2: ['2 koin', 4, 'muncul 2 gambar', 1], koin3: ['3 koin', 8, 'muncul 3 gambar', 1] };
    var row = data[perc];
    if (h) h.textContent = 'Ruang sampel ' + row[0] + ' = ' + row[1] + ' anggota · Peluang ' + row[2] + ' = ' + row[3] + '/' + row[1];
    if (d) d.textContent = 'Peluang = banyak kejadian yang dimaksud ÷ banyak anggota ruang sampel = ' + row[3] + ' ÷ ' + row[1] + ' = ' + (row[3] / row[1]).toFixed(4).replace('.', ',') + '.';
  });
  /* Pasti vs mustahil */
  document.querySelectorAll('[data-pasti]').forEach(function (b) {
    b.addEventListener('click', function () {
      var ok = b.getAttribute('data-pasti') === 'benar';
      showFb($('pastiFb'), ok, ok ? 'Benar! Mata dadu selalu 1 sampai 6, jadi “muncul mata kurang dari 7” pasti terjadi: peluangnya 1.'
        : 'Belum tepat. Mata dadu paling besar 6, jadi “muncul mata 7” tidak mungkin terjadi — itu kejadian mustahil, peluangnya 0.');
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
  var QUIZ = [{"q": "Banyak anggota ruang sampel pelemparan 1 dadu adalah …", "options": ["6", "12", "36", "3"], "answer": 0, "why": "Ruang sampel 1 dadu: {1, 2, 3, 4, 5, 6}, ada 6 anggota."}, {"q": "Banyak anggota ruang sampel pelemparan 2 koin adalah …", "options": ["2", "4", "6", "8"], "answer": 1, "why": "Ruang sampel: {AA, AG, GA, GG}, ada 4 anggota."}, {"q": "Peluang muncul mata 3 pada pelemparan 1 dadu adalah …", "options": ["1/3", "1/2", "1/6", "1"], "answer": 2, "why": "Ada 1 mata 3 dari 6 kemungkinan, jadi peluangnya 1/6."}, {"q": "Peluang suatu kejadian mustahil adalah …", "options": ["1", "1/2", "1/6", "0"], "answer": 3, "why": "Kejadian mustahil tidak pernah terjadi, jadi peluangnya 0."}, {"q": "Peluang suatu kejadian pasti adalah …", "options": ["0", "1", "1/2", "1/6"], "answer": 1, "why": "Kejadian pasti selalu terjadi, jadi peluangnya 1."}, {"q": "Banyak anggota ruang sampel pelemparan 2 dadu adalah …", "options": ["36", "12", "6", "18"], "answer": 0, "why": "6 × 6 = 36 pasangan mata dadu yang mungkin."}, {"q": "Peluang muncul mata genap pada pelemparan 1 dadu adalah …", "options": ["1/3", "1/6", "2/3", "1/2"], "answer": 3, "why": "Mata genap ada 3 (2, 4, 6) dari 6, jadi peluangnya 3/6 = 1/2."}, {"q": "Banyak anggota ruang sampel pelemparan 3 koin adalah …", "options": ["4", "6", "8", "12"], "answer": 2, "why": "2 × 2 × 2 = 8 kemungkinan."}, {"q": "Peluang muncul sisi gambar pada pelemparan 1 koin adalah …", "options": ["1", "1/2", "1/4", "0"], "answer": 1, "why": "Ada 1 sisi gambar dari 2 sisi koin, jadi peluangnya 1/2."}, {"q": "Peluang jumlah mata 12 pada pelemparan 2 dadu adalah …", "options": ["1/6", "1/12", "1/18", "1/36"], "answer": 3, "why": "Hanya pasangan (6, 6) yang jumlahnya 12, dari 36 kemungkinan, jadi 1/36."}];
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
    var prevBest = read('mpi-d5-quiz-best', null); var prevNum = prevBest === null ? -1 : Number(prevBest);
    if (qScore > prevNum) store('mpi-d5-quiz-best', String(qScore));
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
    var saved = null; try { saved = JSON.parse(read('mpi-d5-refleksi', 'null')); } catch (e) { saved = null; }
    if (!saved) return;
    ['refCheck1', 'refCheck2', 'refCheck3'].forEach(function (id, i) { var el = $(id); if (el && saved.checks) el.checked = !!saved.checks[i]; });
    if ($('refContoh') && saved.contoh) $('refContoh').value = saved.contoh;
    if ($('refSulit') && saved.sulit) $('refSulit').value = saved.sulit;
  }
  loadRefleksi();
  var refSave = $('refSave');
  if (refSave) refSave.addEventListener('click', function () {
    var data = { checks: ['refCheck1', 'refCheck2', 'refCheck3'].map(function (id) { var el = $(id); return el ? el.checked : false; }), contoh: $('refContoh') ? $('refContoh').value : '', sulit: $('refSulit') ? $('refSulit').value : '' };
    store('mpi-d5-refleksi', JSON.stringify(data));
    var st = $('refStatus'); if (st) st.textContent = 'Refleksi tersimpan di perangkat ini pada ' + new Date().toLocaleString('id-ID') + '.';
    markVisited('sub6');
  });
})();
