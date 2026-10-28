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
