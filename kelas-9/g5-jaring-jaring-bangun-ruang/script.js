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
