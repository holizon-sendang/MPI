/* B.6 Bentuk Akar — script.js
   Vanilla JS, tanpa framework.
   localStorage: mpi-b6-visited, mpi-b6-quiz-best, mpi-b6-refleksi. */
(function () {
  'use strict';
  function $(id) { return document.getElementById(id); }
  function fmt(n) { return (n < 0 ? '−' : '') + Math.abs(n); }
  function fmtSigned(n) { return (n < 0 ? '−' : n > 0 ? '+' : '') + Math.abs(n); }
  function parseNum(el) {
    if (!el) return null;
    var v = el.value === '' ? NaN : Number(el.value);
    return Number.isFinite(v) ? v : null;
  }
  function parseIntNum(el) {
    var v = parseNum(el);
    return v !== null && Number.isInteger(v) ? v : null;
  }
  function showFb(el, ok, msg) {
    if (!el) return;
    el.textContent = msg;
    el.classList.remove('ok', 'no', 'show');
    el.classList.add(ok ? 'ok' : 'no', 'show');
  }
  function store(key, value) { try { localStorage.setItem(key, value); } catch (e) { /* abaikan */ } }
  function read(key, fallback) {
    try { var v = localStorage.getItem(key); return v === null ? fallback : v; } catch (e) { return fallback; }
  }

  /* ---------- Progres sub-bab ---------- */
  var SUBS = ['sub1', 'sub2', 'sub3', 'sub4', 'sub5', 'sub6'];
  var visited = [];
  try { visited = JSON.parse(read('mpi-b6-visited', '[]')) || []; } catch (e) { visited = []; }
  if (!Array.isArray(visited)) visited = [];
  function saveVisited() { store('mpi-b6-visited', JSON.stringify(visited)); }
  function renderProgress() {
    var pct = Math.round((visited.length / SUBS.length) * 100);
    var text = $('progressText');
    if (text) text.textContent = 'Progres: ' + visited.length + ' dari 6 sub-bab (' + pct + '%)';
    var fill = $('progressFill');
    if (fill) fill.style.width = pct + '%';
    var bar = $('progressBar');
    if (bar) bar.setAttribute('aria-valuenow', String(pct));
    document.querySelectorAll('[data-sub]').forEach(function (a) {
      a.classList.toggle('done', visited.indexOf(a.getAttribute('data-sub')) !== -1);
    });
  }
  function markVisited(id) {
    if (visited.indexOf(id) === -1) { visited.push(id); saveVisited(); renderProgress(); }
  }
  document.querySelectorAll('[data-sub]').forEach(function (a) {
    a.addEventListener('click', function () { markVisited(a.getAttribute('data-sub')); });
  });
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) markVisited(en.target.id); });
    }, { rootMargin: '-20% 0px -60% 0px' });
    SUBS.forEach(function (id) { var s = $(id); if (s) io.observe(s); });
  }
  renderProgress();
  var bestStored = read('mpi-b6-quiz-best', null);
  var bestEl = $('quizBestText');
  if (bestStored !== null && bestEl) {
    bestEl.textContent = 'Skor terbaik kuis: ' + bestStored + '/10';
    bestEl.hidden = false;
  }


  /* ---------- Kalkulator akar ---------- */
  var sqrtBtn = $('sqrtBtn');
  function renderSqrt() {
    var n = parseNum($('sqrtN'));
    var hasil = $('sqrtHasil'), ket = $('sqrtKet');
    if (n === null || n < 0 || n > 10000) {
      if (hasil) hasil.textContent = 'Isi bilangan 0 sampai 10.000.';
      if (ket) ket.textContent = '';
      return;
    }
    var r = Math.sqrt(n);
    var bulat = Number.isInteger(r);
    if (hasil) hasil.textContent = '√' + n + ' = ' + (bulat ? String(r) : r.toFixed(4) + '…');
    if (ket) ket.textContent = bulat
      ? n + ' adalah bilangan kuadrat sempurna (' + r + '² = ' + n + '), jadi akarnya bilangan bulat.'
      : n + ' bukan bilangan kuadrat sempurna, jadi √' + n + ' adalah bilangan irasional (desimalnya tak berujung dan tak berulang).';
  }
  if (sqrtBtn) sqrtBtn.addEventListener('click', renderSqrt);
  renderSqrt();

  /* ---------- Penyederhana bentuk akar ---------- */
  function sederhanakan(n) {
    var best = 1;
    for (var a = 2; a * a <= n; a++) {
      if (n % (a * a) === 0) best = a;
    }
    var sisa = n / (best * best);
    return { luar: best, dalam: sisa };
  }
  var simpBtn = $('simpBtn');
  function renderSimp() {
    var n = parseIntNum($('simpN'));
    var hasil = $('simpHasil'), langkah = $('simpLangkah');
    if (n === null || n < 1 || n > 10000) {
      if (hasil) hasil.textContent = 'Isi bilangan 1 sampai 10.000.';
      if (langkah) langkah.textContent = '';
      return;
    }
    var s = sederhanakan(n);
    if (hasil) hasil.textContent = s.dalam === 1 ? '√' + n + ' = ' + s.luar : '√' + n + ' = ' + s.luar + '√' + s.dalam;
    if (langkah) {
      langkah.textContent = s.dalam === 1
        ? n + ' adalah kuadrat sempurna (' + s.luar + '²), jadi √' + n + ' = ' + s.luar + '.'
        : 'Cari faktor kuadrat terbesar dari ' + n + ': ' + (s.luar * s.luar) + ' × ' + s.dalam + ' = ' + n + '. Jadi √' + n + ' = √' + (s.luar * s.luar) + ' × √' + s.dalam + ' = ' + s.luar + '√' + s.dalam + '.';
    }
  }
  if (simpBtn) simpBtn.addEventListener('click', renderSimp);
  renderSimp();

  /* ---------- Kalkulator operasi akar sejenis ---------- */
  var opBtn = $('opBtn');
  function renderOp() {
    var a = parseNum($('opA')), b = parseNum($('opB')), c = parseIntNum($('opC'));
    var op = $('opSel') ? $('opSel').value : '+';
    var hasil = $('opHasil'), langkah = $('opLangkah');
    if (a === null || b === null || c === null || c < 1) {
      if (hasil) hasil.textContent = 'Isi koefisien a, b, dan bilangan di dalam akar.';
      if (langkah) langkah.textContent = '';
      return;
    }
    var r = op === '+' ? a + b : a - b;
    if (hasil) hasil.textContent = fmt(a) + '√' + c + ' ' + op + ' ' + fmt(b) + '√' + c + ' = ' + fmt(r) + '√' + c;
    if (langkah) langkah.textContent = 'Akar sejenis (sama-sama √' + c + ') bisa dijumlah/dikurang seperti suku sejenis: koefisiennya ' + fmt(a) + ' ' + op + ' ' + fmt(b) + ' = ' + fmt(r) + ', akarnya tetap √' + c + '.';
  }
  if (opBtn) opBtn.addEventListener('click', renderOp);
  renderOp();

  /* ---------- Rasionalisasi penyebut ---------- */
  var rasBtn = $('rasBtn');
  function renderRas() {
    var a = parseNum($('rasA')), b = parseIntNum($('rasB'));
    var hasil = $('rasHasil'), langkah = $('rasLangkah');
    if (a === null || b === null || b < 1) {
      if (hasil) hasil.textContent = 'Isi pembilang a dan bilangan di dalam akar b.';
      if (langkah) langkah.textContent = '';
      return;
    }
    var s = sederhanakan(b);
    var teks;
    if (s.dalam === 1) teks = a + '/√' + b + ' = ' + a + '/' + s.luar + ' (sudah rasional, karena √' + b + ' = ' + s.luar + ')';
    else if (s.luar === 1) teks = a + '/√' + b + ' = ' + (a === 1 ? '' : a) + '√' + b + '/' + b;
    else teks = a + '/√' + b + ' = ' + (a * s.luar) + '√' + s.dalam + '/' + b;
    if (hasil) hasil.textContent = teks;
    if (langkah) langkah.textContent = 'Kalikan pembilang dan penyebut dengan √' + b + ' (sekawannya), sehingga penyebutnya menjadi (√' + b + ')² = ' + b + ' — bilangan rasional.';
  }
  if (rasBtn) rasBtn.addEventListener('click', renderRas);
  renderRas();


  /* ---------- Latihan ber-input jawaban ---------- */
  document.querySelectorAll('.qa-row').forEach(function (row) {
    var btn = row.querySelector('.qa-check');
    var input = row.querySelector('.qa-input');
    var select = row.querySelector('.qa-select');
    var explain = row.querySelector('.qa-explain');
    var fb = row.querySelector('.feedback');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var answer = Number(row.getAttribute('data-answer'));
      var ok, v;
      if (input) {
        v = parseNum(input);
        if (v === null) { showFb(fb, false, 'Tulis dulu jawabanmu sebagai bilangan.'); return; }
        ok = Math.abs(v - answer) < 1e-9;
      } else if (select) {
        if (select.value === '') { showFb(fb, false, 'Pilih dulu jawabanmu.'); return; }
        v = Number(select.value);
        ok = v === answer;
      } else { return; }
      row.classList.toggle('ok', ok);
      row.classList.toggle('no', !ok);
      showFb(fb, ok,
        ok ? 'Benar! Jawabannya ' + (input ? fmt(answer) : select.options[answer + 1].textContent) + '.'
           : 'Belum tepat. Coba lagi, perhatikan langkahnya di pembahasan.');
      if (explain) {
        explain.textContent = 'Pembahasan: ' + row.getAttribute('data-explain');
        explain.classList.add('show');
      }
    });
  });

  /* ---------- Kuis 10 soal ---------- */
  var QUIZ = [
  {
    "q": "√49 = …",
    "options": [
      "7",
      "9",
      "14",
      "49"
    ],
    "answer": 0,
    "why": "7² = 49, jadi √49 = 7.",
    "check": "int(49**0.5)"
  },
  {
    "q": "√12 = …",
    "options": [
      "3√2",
      "2√3",
      "4√3",
      "√6"
    ],
    "answer": 1,
    "why": "√12 = √(4 × 3) = 2√3."
  },
  {
    "q": "√50 = …",
    "options": [
      "2√5",
      "5√2",
      "10√5",
      "25√2"
    ],
    "answer": 1,
    "why": "√50 = √(25 × 2) = 5√2."
  },
  {
    "q": "√8 + √8 = …",
    "options": [
      "√16",
      "4",
      "2√8",
      "8"
    ],
    "answer": 2,
    "why": "Akar sejenis: 1√8 + 1√8 = 2√8."
  },
  {
    "q": "√3 × √12 = …",
    "options": [
      "3",
      "12",
      "√15",
      "6"
    ],
    "answer": 3,
    "why": "√3 × √12 = √36 = 6.",
    "check": "int((3*12)**0.5)"
  },
  {
    "q": "√100 : √25 = …",
    "options": [
      "2",
      "5",
      "4",
      "20"
    ],
    "answer": 0,
    "why": "√100 = 10 dan √25 = 5, jadi 10 : 5 = 2.",
    "check": "10//5"
  },
  {
    "q": "Bentuk rasional dari 1/√2 adalah …",
    "options": [
      "√2",
      "√2/2",
      "2√2",
      "1/2"
    ],
    "answer": 1,
    "why": "Kalikan pembilang dan penyebut dengan √2: (1 × √2)/(√2 × √2) = √2/2."
  },
  {
    "q": "√27 − √3 = …",
    "options": [
      "√24",
      "3√3",
      "2√3",
      "√3"
    ],
    "answer": 2,
    "why": "√27 = 3√3, jadi 3√3 − √3 = 2√3."
  },
  {
    "q": "(√7)² = …",
    "options": [
      "14",
      "√14",
      "49",
      "7"
    ],
    "answer": 3,
    "why": "(√7)² = 7."
  },
  {
    "q": "√144 + √25 = …",
    "options": [
      "12",
      "15",
      "19",
      "17"
    ],
    "answer": 3,
    "why": "√144 = 12 dan √25 = 5, jadi 12 + 5 = 17.",
    "check": "12+5"
  }
];
  var qi = 0, qScore = 0, qAnswered = false;
  var letters = ['A', 'B', 'C', 'D'];
  function renderQuiz() {
    var item = QUIZ[qi];
    var qEl = $('quizQuestion');
    if (qEl) qEl.textContent = (qi + 1) + '. ' + item.q;
    var prog = $('quizProgress');
    if (prog) prog.textContent = 'Soal ' + (qi + 1) + ' dari 10';
    var live = $('quizScoreLive');
    if (live) live.textContent = 'Skor sementara: ' + qScore;
    var box = $('quizOptions');
    if (box) {
      box.innerHTML = '';
      item.options.forEach(function (opt, idx) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'opt-btn';
        btn.innerHTML = '<span class="letter">' + letters[idx] + '</span><span></span>';
        btn.lastChild.textContent = opt;
        btn.addEventListener('click', function () { answerQuiz(idx); });
        box.appendChild(btn);
      });
    }
    var fb = $('quizFb');
    if (fb) { fb.textContent = ''; fb.className = 'feedback'; }
    var next = $('quizNext');
    if (next) { next.disabled = true; next.textContent = qi === QUIZ.length - 1 ? 'Lihat Hasil →' : 'Soal Berikutnya →'; }
    qAnswered = false;
  }
  function answerQuiz(idx) {
    if (qAnswered) return;
    qAnswered = true;
    var item = QUIZ[qi];
    var ok = idx === item.answer;
    if (ok) qScore++;
    var live = $('quizScoreLive');
    if (live) live.textContent = 'Skor sementara: ' + qScore;
    document.querySelectorAll('#quizOptions .opt-btn').forEach(function (b, i) {
      b.disabled = true;
      if (i === item.answer) b.classList.add('correct');
      else if (i === idx) b.classList.add('wrong');
    });
    showFb($('quizFb'), ok, (ok ? 'Benar! ' : 'Belum tepat. ') + item.why);
    var next = $('quizNext');
    if (next) next.disabled = false;
  }
  function finishQuiz() {
    var box = $('quizBox'), res = $('quizResult');
    if (box) box.hidden = true;
    if (res) res.hidden = false;
    var scoreEl = $('quizScore');
    if (scoreEl) scoreEl.textContent = qScore + '/10';
    var ring = $('quizRing');
    if (ring) ring.style.setProperty('--p', (qScore * 10) + '%');
    var msg = $('quizMsg');
    if (msg) {
      msg.textContent = qScore === 10 ? 'Sempurna! Kamu menguasai materi ini.'
        : qScore >= 8 ? 'Hebat! Tinggal sedikit lagi menuju sempurna.'
        : qScore >= 6 ? 'Bagus! Ulangi bagian yang masih salah, lalu coba lagi.'
        : 'Terus berlatih! Buka lagi sub-bab sebelumnya, lalu ulangi kuisnya.';
    }
    var prevBest = read('mpi-b6-quiz-best', null);
    var prevNum = prevBest === null ? -1 : Number(prevBest);
    if (qScore > prevNum) store('mpi-b6-quiz-best', String(qScore));
    var bestNow = Math.max(qScore, prevNum);
    var bestLine = $('quizBestLine');
    if (bestLine) bestLine.textContent = 'Skor terbaikmu: ' + bestNow + '/10. Skor ini tersimpan di perangkat ini.';
    if (bestEl) { bestEl.textContent = 'Skor terbaik kuis: ' + bestNow + '/10'; bestEl.hidden = false; }
    markVisited('sub6');
  }
  var quizNext = $('quizNext');
  if (quizNext) {
    quizNext.addEventListener('click', function () {
      if (!qAnswered) return;
      if (qi < QUIZ.length - 1) { qi++; renderQuiz(); } else finishQuiz();
    });
  }
  var quizRetry = $('quizRetry');
  if (quizRetry) {
    quizRetry.addEventListener('click', function () {
      qi = 0; qScore = 0; qAnswered = false;
      var res = $('quizResult'); if (res) res.hidden = true;
      var box = $('quizBox'); if (box) box.hidden = false;
      renderQuiz();
    });
  }
  renderQuiz();

  /* ---------- Refleksi ---------- */
  function loadRefleksi() {
    var saved = null;
    try { saved = JSON.parse(read('mpi-b6-refleksi', 'null')); } catch (e) { saved = null; }
    if (!saved) return;
    ['refCheck1', 'refCheck2', 'refCheck3'].forEach(function (id, i) {
      var el = $(id);
      if (el && saved.checks) el.checked = !!saved.checks[i];
    });
    if ($('refContoh') && saved.contoh) $('refContoh').value = saved.contoh;
    if ($('refSulit') && saved.sulit) $('refSulit').value = saved.sulit;
  }
  loadRefleksi();
  var refSave = $('refSave');
  if (refSave) {
    refSave.addEventListener('click', function () {
      var data = {
        checks: ['refCheck1', 'refCheck2', 'refCheck3'].map(function (id) {
          var el = $(id); return el ? el.checked : false;
        }),
        contoh: $('refContoh') ? $('refContoh').value : '',
        sulit: $('refSulit') ? $('refSulit').value : ''
      };
      store('mpi-b6-refleksi', JSON.stringify(data));
      var st = $('refStatus');
      if (st) st.textContent = 'Refleksi tersimpan di perangkat ini pada ' + new Date().toLocaleString('id-ID') + '.';
      markVisited('sub6');
    });
  }
})();
