/* D.6 Frekuensi Relatif dan Frekuensi Harapan — script.js (vanilla JS, tanpa framework).
   localStorage: mpi-d6-visited, mpi-d6-quiz-best, mpi-d6-refleksi. */
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
  try { visited = JSON.parse(read('mpi-d6-visited', '[]')) || []; } catch (e) { visited = []; }
  if (!Array.isArray(visited)) visited = [];
  function saveVisited() { store('mpi-d6-visited', JSON.stringify(visited)); }
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
  var bestStored = read('mpi-d6-quiz-best', null);
  var bestEl = $('quizBestText');
  if (bestStored !== null && bestEl) { bestEl.textContent = 'Skor terbaik kuis: ' + bestStored + '/10'; bestEl.hidden = false; }

  /* Simulator: lempar koin N kali, hitung frekuensi relatif gambar */
  var simBtn = $('simBtn');
  if (simBtn) simBtn.addEventListener('click', function () {
    var n = parseNum($('simN'));
    if (n === null || n < 1 || n > 1000) { showFb($('simFb'), false, 'Isi banyak lemparan antara 1 dan 1000.'); return; }
    var g = 0;
    for (var i = 0; i < n; i++) if (Math.random() < 0.5) g++;
    var fr = g / n;
    var h = $('simHasil');
    if (h) h.textContent = 'Gambar muncul ' + g + ' dari ' + n + ' lemparan · Frekuensi relatif = ' + fmtDec(fr, 3);
    var d = $('simDetail');
    if (d) d.textContent = 'Peluang teoretik gambar = 0,5. Frekuensi relatifmu ' + fmtDec(fr, 3) + (Math.abs(fr - 0.5) < 0.1 ? ' — dekat dengan 0,5, bagus!' : ' — masih jauh dari 0,5. Coba lempar lebih banyak (misalnya 500 kali) dan lihat frekuensi relatifnya mendekati 0,5.');
    var bars = $('simBars');
    if (bars) bars.innerHTML = '<div class="bar-row"><span class="bar-label">Gambar</span><span class="bar-track"><span class="bar-fill" style="display:block;width:' + Math.round(fr * 100) + '%"></span></span><span>' + fmtDec(fr, 3) + '</span></div><div class="bar-row"><span class="bar-label">Angka</span><span class="bar-track"><span class="bar-fill" style="display:block;width:' + Math.round((1 - fr) * 100) + '%"></span></span><span>' + fmtDec(1 - fr, 3) + '</span></div>';
    showFb($('simFb'), true, 'Percobaan selesai: ' + g + ' gambar dari ' + n + ' lemparan.');
  });
  /* Kalkulator frekuensi harapan */
  var fhBtn = $('fhBtn');
  if (fhBtn) fhBtn.addEventListener('click', function () {
    var kej = $('fhKej') ? $('fhKej').value : 'koin-gambar';
    var n = parseNum($('fhN'));
    var h = $('fhHasil'), d = $('fhDetail');
    if (n === null || n < 1) { if (h) h.textContent = 'Isi banyak percobaan (bilangan positif).'; if (d) d.textContent = ''; return; }
    var p = { 'koin-gambar': [1, 2, 'gambar pada koin'], 'dadu-6': [1, 6, 'mata 6 pada dadu'], 'dadu-genap': [1, 2, 'mata genap pada dadu'], 'dadu-prima': [1, 2, 'mata prima pada dadu'] }[kej];
    var fh = p[0] / p[1] * n;
    if (h) h.textContent = 'Frekuensi harapan = ' + fmtDec(fh, 2).replace(',00', '') + ' kali';
    if (d) d.textContent = 'Frekuensi harapan = peluang teoretik × banyak percobaan = ' + p[0] + '/' + p[1] + ' × ' + n + ' = ' + fmtDec(fh, 2).replace(',00', '') + ' kali. Artinya, dalam ' + n + ' percobaan, ' + p[2] + ' diperkirakan muncul sekitar ' + fmtDec(fh, 2).replace(',00', '') + ' kali.';
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
  var QUIZ = [{"q": "Frekuensi harapan muncul mata 6 dalam 60 lemparan dadu adalah …", "options": ["10 kali", "6 kali", "12 kali", "20 kali"], "answer": 0, "why": "Fh = 1/6 × 60 = 10 kali."}, {"q": "Frekuensi relatif muncul gambar 25 kali dari 100 lemparan koin adalah …", "options": ["0,2", "0,25", "0,5", "2,5"], "answer": 1, "why": "Frekuensi relatif = 25 ÷ 100 = 0,25."}, {"q": "Frekuensi harapan muncul gambar dalam 80 lemparan koin adalah …", "options": ["20 kali", "30 kali", "40 kali", "80 kali"], "answer": 2, "why": "Fh = 1/2 × 80 = 40 kali."}, {"q": "Peluang teoretik muncul sisi angka pada 1 koin adalah …", "options": ["0", "1", "1/4", "1/2"], "answer": 3, "why": "Ada 1 sisi angka dari 2 sisi koin, jadi peluangnya 1/2."}, {"q": "Frekuensi harapan muncul mata genap dalam 120 lemparan dadu adalah …", "options": ["30 kali", "60 kali", "40 kali", "90 kali"], "answer": 1, "why": "Peluang mata genap = 3/6 = 1/2, jadi Fh = 1/2 × 120 = 60 kali."}, {"q": "Frekuensi relatif 12 dari 40 percobaan adalah …", "options": ["0,3", "0,4", "0,12", "3"], "answer": 0, "why": "Frekuensi relatif = 12 ÷ 40 = 0,3."}, {"q": "Frekuensi harapan muncul mata prima dalam 180 lemparan dadu adalah …", "options": ["30 kali", "60 kali", "45 kali", "90 kali"], "answer": 3, "why": "Peluang mata prima = 3/6 = 1/2, jadi Fh = 1/2 × 180 = 90 kali."}, {"q": "Jika percobaan dilakukan semakin banyak, frekuensi relatif mendekati …", "options": ["frekuensi harapan", "nol", "peluang teoretik", "ruang sampel"], "answer": 2, "why": "Hukum bilangan besar: frekuensi relatif mendekati peluang teoretik saat percobaan diperbanyak."}, {"q": "Frekuensi harapan muncul mata 1 dalam 90 lemparan dadu adalah …", "options": ["30 kali", "15 kali", "9 kali", "45 kali"], "answer": 1, "why": "Fh = 1/6 × 90 = 15 kali."}, {"q": "Frekuensi relatif 45 dari 150 percobaan adalah …", "options": ["0,45", "0,15", "0,25", "0,3"], "answer": 3, "why": "Frekuensi relatif = 45 ÷ 150 = 0,3."}];
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
    var prevBest = read('mpi-d6-quiz-best', null); var prevNum = prevBest === null ? -1 : Number(prevBest);
    if (qScore > prevNum) store('mpi-d6-quiz-best', String(qScore));
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
    var saved = null; try { saved = JSON.parse(read('mpi-d6-refleksi', 'null')); } catch (e) { saved = null; }
    if (!saved) return;
    ['refCheck1', 'refCheck2', 'refCheck3'].forEach(function (id, i) { var el = $(id); if (el && saved.checks) el.checked = !!saved.checks[i]; });
    if ($('refContoh') && saved.contoh) $('refContoh').value = saved.contoh;
    if ($('refSulit') && saved.sulit) $('refSulit').value = saved.sulit;
  }
  loadRefleksi();
  var refSave = $('refSave');
  if (refSave) refSave.addEventListener('click', function () {
    var data = { checks: ['refCheck1', 'refCheck2', 'refCheck3'].map(function (id) { var el = $(id); return el ? el.checked : false; }), contoh: $('refContoh') ? $('refContoh').value : '', sulit: $('refSulit') ? $('refSulit').value : '' };
    store('mpi-d6-refleksi', JSON.stringify(data));
    var st = $('refStatus'); if (st) st.textContent = 'Refleksi tersimpan di perangkat ini pada ' + new Date().toLocaleString('id-ID') + '.';
    markVisited('sub6');
  });
})();
