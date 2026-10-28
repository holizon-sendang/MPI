/* B.5 Bilangan Berpangkat — script.js
   Vanilla JS, tanpa framework.
   localStorage: mpi-b5-visited, mpi-b5-quiz-best, mpi-b5-refleksi. */
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
  try { visited = JSON.parse(read('mpi-b5-visited', '[]')) || []; } catch (e) { visited = []; }
  if (!Array.isArray(visited)) visited = [];
  function saveVisited() { store('mpi-b5-visited', JSON.stringify(visited)); }
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
  var bestStored = read('mpi-b5-quiz-best', null);
  var bestEl = $('quizBestText');
  if (bestStored !== null && bestEl) {
    bestEl.textContent = 'Skor terbaik kuis: ' + bestStored + '/10';
    bestEl.hidden = false;
  }


  /* ---------- Kalkulator pangkat ---------- */
  var powBtn = $('powBtn');
  function renderPow() {
    var a = parseNum($('powBase')), n = parseIntNum($('powExp'));
    var hasil = $('powHasil'), langkah = $('powLangkah');
    if (a === null || n === null || n < -10 || n > 10) {
      if (hasil) hasil.textContent = 'Isi basis dan pangkat (pangkat −10 sampai 10).';
      if (langkah) langkah.textContent = '';
      return;
    }
    var val = Math.pow(a, n);
    if (hasil) {
      hasil.textContent = a < 0 ? '(' + fmt(a) + ')^' + fmt(n) + ' = ' + fmt(val) : fmt(a) + '^' + fmt(n) + ' = ' + fmt(val);
    }
    if (langkah) {
      if (n === 0) langkah.textContent = 'Pangkat 0 selalu 1 (asalkan basisnya bukan 0). Jadi ' + fmt(a) + '^0 = 1.';
      else if (n > 0) {
        var parts = [];
        for (var i = 0; i < n; i++) parts.push(fmt(a));
        langkah.textContent = fmt(a) + '^' + n + ' = ' + parts.join(' × ') + ' = ' + fmt(val) + '. Basis dikalikan sebanyak ' + n + ' kali.';
      } else {
        langkah.textContent = fmt(a) + '^(' + n + ') = 1 : (' + fmt(a) + '^' + Math.abs(n) + ') = 1/' + Math.abs(val === 0 ? 0 : Math.pow(a, Math.abs(n))) + '. Pangkat negatif berarti kebalikan dari pangkat positifnya.';
      }
    }
  }
  if (powBtn) powBtn.addEventListener('click', renderPow);
  renderPow();

  /* ---------- Alat banding pangkat ---------- */
  var cmpPicked = null;
  document.querySelectorAll('[data-cmp]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      cmpPicked = btn.getAttribute('data-cmp');
      document.querySelectorAll('[data-cmp]').forEach(function (b) {
        b.classList.remove('btn-primary'); b.classList.add('btn-ghost');
      });
      btn.classList.remove('btn-ghost'); btn.classList.add('btn-primary');
      var picked = $('cmpPicked');
      if (picked) picked.textContent = cmpPicked === '>' ? 'lebih dari (>)' : cmpPicked === '<' ? 'kurang dari (<)' : 'sama dengan (=)';
    });
  });
  var cmpCheck = $('cmpCheck');
  if (cmpCheck) {
    cmpCheck.addEventListener('click', function () {
      var a = parseNum($('cmpB1')), m = parseIntNum($('cmpE1'));
      var b = parseNum($('cmpB2')), n = parseIntNum($('cmpE2'));
      var fb = $('cmpFb');
      if (a === null || m === null || b === null || n === null) { showFb(fb, false, 'Isi keempat bilangan dulu.'); return; }
      if (!cmpPicked) { showFb(fb, false, 'Pilih dulu tandanya: >, <, atau =.'); return; }
      var va = Math.pow(a, m), vb = Math.pow(b, n);
      var correct = va > vb ? '>' : va < vb ? '<' : '=';
      showFb(fb, cmpPicked === correct,
        cmpPicked === correct
          ? 'Benar! ' + fmt(a) + '^' + m + ' = ' + fmt(va) + ' ' + correct + ' ' + fmt(vb) + ' = ' + fmt(b) + '^' + n + '.'
          : 'Belum tepat. ' + fmt(a) + '^' + m + ' = ' + fmt(va) + ', sedangkan ' + fmt(b) + '^' + n + ' = ' + fmt(vb) + ', jadi tandanya ' + correct + '.');
    });
  }

  /* ---------- Explorer sifat pangkat ---------- */
  var propBtn = $('propBtn');
  function renderProp() {
    var a = parseNum($('propA')), m = parseIntNum($('propM')), n = parseIntNum($('propN'));
    var sel = $('propSel') ? $('propSel').value : 'kali';
    var hasil = $('propHasil'), langkah = $('propLangkah');
    if (a === null || m === null || n === null) {
      if (hasil) hasil.textContent = 'Isi basis dan kedua pangkat dulu.';
      if (langkah) langkah.textContent = '';
      return;
    }
    var kiri, kanan, rumus;
    if (sel === 'kali') { kiri = Math.pow(a, m) * Math.pow(a, n); kanan = Math.pow(a, m + n); rumus = fmt(a) + '^' + m + ' × ' + fmt(a) + '^' + n + ' = ' + fmt(a) + '^(' + m + '+' + n + ') = ' + fmt(a) + '^' + (m + n); }
    else if (sel === 'bagi') { kiri = Math.pow(a, m) / Math.pow(a, n); kanan = Math.pow(a, m - n); rumus = fmt(a) + '^' + m + ' : ' + fmt(a) + '^' + n + ' = ' + fmt(a) + '^(' + m + '−' + n + ') = ' + fmt(a) + '^' + (m - n); }
    else { kiri = Math.pow(Math.pow(a, m), n); kanan = Math.pow(a, m * n); rumus = '(' + fmt(a) + '^' + m + ')^' + n + ' = ' + fmt(a) + '^(' + m + '×' + n + ') = ' + fmt(a) + '^' + (m * n); }
    if (hasil) hasil.textContent = rumus + ' = ' + fmt(kanan);
    if (langkah) langkah.textContent = 'Ruas kiri dihitung langsung: ' + fmt(kiri) + '. Ruas kanan dengan sifat pangkat: ' + fmt(kanan) + '. Keduanya sama — sifatnya terbukti!';
  }
  if (propBtn) propBtn.addEventListener('click', renderProp);
  renderProp();


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
    "q": "2^5 = …",
    "options": [
      "16",
      "32",
      "25",
      "10"
    ],
    "answer": 1,
    "why": "2^5 = 2 × 2 × 2 × 2 × 2 = 32.",
    "check": "2**5"
  },
  {
    "q": "3^4 = …",
    "options": [
      "81",
      "27",
      "12",
      "64"
    ],
    "answer": 0,
    "why": "3^4 = 3 × 3 × 3 × 3 = 81.",
    "check": "3**4"
  },
  {
    "q": "5^0 = …",
    "options": [
      "0",
      "5",
      "1",
      "25"
    ],
    "answer": 2,
    "why": "Setiap bilangan (selain 0) berpangkat 0 hasilnya 1.",
    "check": "5**0"
  },
  {
    "q": "2^(−2) = …",
    "options": [
      "−4",
      "4",
      "1/2",
      "1/4"
    ],
    "answer": 3,
    "why": "2^(−2) = 1 : 2² = 1/4."
  },
  {
    "q": "2^3 × 2^2 = …",
    "options": [
      "32",
      "64",
      "2",
      "10"
    ],
    "answer": 0,
    "why": "Pangkat dijumlah: 2^(3+2) = 2^5 = 32.",
    "check": "2**3*2**2"
  },
  {
    "q": "4^3 : 4^1 = …",
    "options": [
      "4",
      "16",
      "64",
      "1"
    ],
    "answer": 1,
    "why": "Pangkat dikurang: 4^(3−1) = 4² = 16.",
    "check": "4**3//4**1"
  },
  {
    "q": "(3^2)^2 = …",
    "options": [
      "36",
      "81",
      "9",
      "18"
    ],
    "answer": 1,
    "why": "Pangkat dikali: 3^(2×2) = 3^4 = 81.",
    "check": "(3**2)**2"
  },
  {
    "q": "Satu bakteri membelah tiap jam. Dari 1 bakteri, setelah 3 jam ada … bakteri.",
    "options": [
      "4",
      "6",
      "3",
      "8"
    ],
    "answer": 3,
    "why": "Setelah 3 pembelahan: 2^3 = 8 bakteri.",
    "check": "2**3"
  },
  {
    "q": "10^3 × 10^2 = …",
    "options": [
      "1000",
      "10",
      "100000",
      "10^1"
    ],
    "answer": 2,
    "why": "Pangkat dijumlah: 10^(3+2) = 10^5 = 100.000.",
    "check": "10**3*10**2"
  },
  {
    "q": "Manakah yang nilainya paling besar?",
    "options": [
      "2^4 = 16",
      "4^2 = 16",
      "5^2 = 25",
      "3^3 = 27"
    ],
    "answer": 3,
    "why": "2^4 = 16, 3^3 = 27, 5^2 = 25, 4^2 = 16. Yang terbesar 3^3 = 27."
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
    var prevBest = read('mpi-b5-quiz-best', null);
    var prevNum = prevBest === null ? -1 : Number(prevBest);
    if (qScore > prevNum) store('mpi-b5-quiz-best', String(qScore));
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
    try { saved = JSON.parse(read('mpi-b5-refleksi', 'null')); } catch (e) { saved = null; }
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
      store('mpi-b5-refleksi', JSON.stringify(data));
      var st = $('refStatus');
      if (st) st.textContent = 'Refleksi tersimpan di perangkat ini pada ' + new Date().toLocaleString('id-ID') + '.';
      markVisited('sub6');
    });
  }
})();
