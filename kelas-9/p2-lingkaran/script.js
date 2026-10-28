/* P.2 Lingkaran — script.js (vanilla JS, tanpa framework).
   localStorage: mpi-p2-visited, mpi-p2-quiz-best, mpi-p2-refleksi. */
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
  try { visited = JSON.parse(read('mpi-p2-visited', '[]')) || []; } catch (e) { visited = []; }
  if (!Array.isArray(visited)) visited = [];
  function saveVisited() { store('mpi-p2-visited', JSON.stringify(visited)); }
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
  var bestStored = read('mpi-p2-quiz-best', null);
  var bestEl = $('quizBestText');
  if (bestStored !== null && bestEl) { bestEl.textContent = 'Skor terbaik kuis: ' + bestStored + '/10'; bestEl.hidden = false; }

  /* Kalkulator lingkaran: geser jari-jari */
  var lingR = $('lingR');
  function renderLing() {
    if (!lingR) return;
    var r = Number(lingR.value);
    var rv = $('lingRVal'); if (rv) rv.textContent = 'r = ' + r + ' cm';
    var k = 2 * Math.PI * r, l = Math.PI * r * r;
    var h = $('lingHasil'); if (h) h.textContent = 'Keliling = ' + fmtDec(k, 2) + ' cm · Luas = ' + fmtDec(l, 2) + ' cm²';
    var c = $('lingCircle'); if (c) { c.setAttribute('r', String(20 + r * 3)); }
    var d = $('lingDetail'); if (d) d.textContent = 'Dengan \u03c0 \u2248 3,14: keliling = 2 × 3,14 × ' + r + ' = ' + fmtDec(2 * 3.14 * r, 2) + ' cm; luas = 3,14 × ' + r + '² = ' + fmtDec(3.14 * r * r, 2) + ' cm².';
  }
  if (lingR) { lingR.addEventListener('input', renderLing); renderLing(); }
  /* Kalkulator busur & juring */
  var busBtn = $('busBtn');
  if (busBtn) busBtn.addEventListener('click', function () {
    var r = parseNum($('busR')), s = parseNum($('busSudut'));
    var h = $('busHasil'), d = $('busDetail');
    if (r === null || s === null || r <= 0 || s <= 0 || s > 360) { if (h) h.textContent = 'Isi jari-jari (positif) dan sudut pusat (1–360°).'; if (d) d.textContent = ''; return; }
    var busur = s / 360 * 2 * 3.14 * r;
    var juring = s / 360 * 3.14 * r * r;
    if (h) h.textContent = 'Busur = ' + fmtDec(busur, 2) + ' cm · Juring = ' + fmtDec(juring, 2) + ' cm²';
    if (d) d.textContent = 'Busur = ' + s + '/360 × keliling = ' + s + '/360 × ' + fmtDec(2 * 3.14 * r, 2) + ' = ' + fmtDec(busur, 2) + ' cm. Juring = ' + s + '/360 × luas = ' + s + '/360 × ' + fmtDec(3.14 * r * r, 2) + ' = ' + fmtDec(juring, 2) + ' cm².';
  });
  /* Sudut pusat vs sudut keliling */
  document.querySelectorAll('[data-sudut]').forEach(function (b) {
    b.addEventListener('click', function () {
      var ok = b.getAttribute('data-sudut') === 'benar';
      showFb($('sudutFb'), ok, ok ? 'Benar! Sudut keliling yang menghadap busur yang sama besarnya setengah sudut pusat: ½ × 100° = 50°.'
        : 'Belum tepat. Ingat: sudut keliling = setengah sudut pusat yang menghadap busur yang sama.');
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
  var QUIZ = [{"q": "Keliling lingkaran dengan jari-jari 7 cm (π = 22/7) adalah …", "options": ["44 cm", "22 cm", "88 cm", "154 cm"], "answer": 0, "why": "K = 2 × 22/7 × 7 = 44 cm."}, {"q": "Keliling lingkaran dengan jari-jari 14 cm (π = 22/7) adalah …", "options": ["44 cm", "88 cm", "176 cm", "616 cm"], "answer": 1, "why": "K = 2 × 22/7 × 14 = 88 cm."}, {"q": "Luas lingkaran dengan jari-jari 7 cm (π = 22/7) adalah …", "options": ["44 cm²", "77 cm²", "154 cm²", "308 cm²"], "answer": 2, "why": "L = 22/7 × 7² = 22 × 7 = 154 cm²."}, {"q": "Luas lingkaran dengan diameter 20 cm (π = 3,14) adalah …", "options": ["62,8 cm²", "125,6 cm²", "314 cm²", "628 cm²"], "answer": 2, "why": "r = 10 cm, L = 3,14 × 10² = 314 cm²."}, {"q": "Panjang busur lingkaran r = 21 cm dengan sudut pusat 60° (π = 22/7) adalah …", "options": ["11 cm", "22 cm", "33 cm", "44 cm"], "answer": 1, "why": "Busur = 60/360 × 2 × 22/7 × 21 = ⅙ × 132 = 22 cm."}, {"q": "Luas juring lingkaran r = 7 cm dengan sudut pusat 90° (π = 22/7) adalah …", "options": ["38,5 cm²", "77 cm²", "154 cm²", "11 cm²"], "answer": 0, "why": "Juring = 90/360 × 22/7 × 49 = ¼ × 154 = 38,5 cm²."}, {"q": "Sebuah lingkaran kelilingnya 88 cm (π = 22/7). Jari-jarinya adalah …", "options": ["7 cm", "28 cm", "21 cm", "14 cm"], "answer": 3, "why": "88 = 2 × 22/7 × r, jadi r = 88 × 7 ÷ 44 = 14 cm."}, {"q": "Luas lingkaran 314 cm² (π = 3,14). Jari-jarinya adalah …", "options": ["5 cm", "20 cm", "15 cm", "10 cm"], "answer": 3, "why": "314 = 3,14 × r², jadi r² = 100 dan r = 10 cm."}, {"q": "Besar sudut pusat setengah lingkaran adalah …", "options": ["90°", "180°", "270°", "360°"], "answer": 1, "why": "Satu putaran penuh 360°, setengahnya 180°."}, {"q": "Luas juring lingkaran r = 21 cm dengan sudut pusat 120° (π = 22/7) adalah …", "options": ["231 cm²", "308 cm²", "154 cm²", "462 cm²"], "answer": 3, "why": "Juring = 120/360 × 22/7 × 441 = ⅓ × 1386 = 462 cm²."}];
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
    var prevBest = read('mpi-p2-quiz-best', null); var prevNum = prevBest === null ? -1 : Number(prevBest);
    if (qScore > prevNum) store('mpi-p2-quiz-best', String(qScore));
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
    var saved = null; try { saved = JSON.parse(read('mpi-p2-refleksi', 'null')); } catch (e) { saved = null; }
    if (!saved) return;
    ['refCheck1', 'refCheck2', 'refCheck3'].forEach(function (id, i) { var el = $(id); if (el && saved.checks) el.checked = !!saved.checks[i]; });
    if ($('refContoh') && saved.contoh) $('refContoh').value = saved.contoh;
    if ($('refSulit') && saved.sulit) $('refSulit').value = saved.sulit;
  }
  loadRefleksi();
  var refSave = $('refSave');
  if (refSave) refSave.addEventListener('click', function () {
    var data = { checks: ['refCheck1', 'refCheck2', 'refCheck3'].map(function (id) { var el = $(id); return el ? el.checked : false; }), contoh: $('refContoh') ? $('refContoh').value : '', sulit: $('refSulit') ? $('refSulit').value : '' };
    store('mpi-p2-refleksi', JSON.stringify(data));
    var st = $('refStatus'); if (st) st.textContent = 'Refleksi tersimpan di perangkat ini pada ' + new Date().toLocaleString('id-ID') + '.';
    markVisited('sub6');
  });
})();
