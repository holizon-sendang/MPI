/* A.5 Relasi dan Fungsi — script.js
   Vanilla JS, tanpa framework.
   localStorage: mpi-a5-visited, mpi-a5-quiz-best, mpi-a5-refleksi. */
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
  try { visited = JSON.parse(read('mpi-a5-visited', '[]')) || []; } catch (e) { visited = []; }
  if (!Array.isArray(visited)) visited = [];
  function saveVisited() { store('mpi-a5-visited', JSON.stringify(visited)); }
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
  var bestStored = read('mpi-a5-quiz-best', null);
  var bestEl = $('quizBestText');
  if (bestStored !== null && bestEl) {
    bestEl.textContent = 'Skor terbaik kuis: ' + bestStored + '/10';
    bestEl.hidden = false;
  }


  /* ---------- Penjelajah relasi ---------- */
  var rcBtn = $('rcBtn');
  function renderRelasi() {
    var v = $('rcSel') ? $('rcSel').value : 'r1';
    var hasil = $('rcHasil'), ket = $('rcKet');
    var data = {
      r1: { t: 'Relasi "suka pelajaran": {(Ani, Matematika), (Budi, IPA), (Citra, Matematika)}', k: 'Domain: {Ani, Budi, Citra}. Kodomain: {Matematika, IPA}. Setiap anak punya tepat satu pasangan — relasi ini JUGA fungsi.' },
      r2: { t: 'Relasi "berada di kelas": {(Ani, 8A), (Budi, 8A), (Citra, 8B)}', k: 'Domain: {Ani, Budi, Citra}. Kodomain: {8A, 8B}. Setiap anak tepat satu kelas — relasi ini JUGA fungsi.' },
      r3: { t: 'Relasi "mempunyai hobi": {(Ani, Membaca), (Ani, Renang), (Budi, Renang)}', k: 'Domain: {Ani, Budi}. Kodomain: {Membaca, Renang}. Ani punya DUA pasangan (Membaca dan Renang) — relasi ini BUKAN fungsi.' }
    };
    var d = data[v];
    if (hasil) hasil.textContent = d.t;
    if (ket) ket.textContent = d.k;
  }
  if (rcBtn) rcBtn.addEventListener('click', renderRelasi);
  renderRelasi();

  /* ---------- Penguji fungsi ---------- */
  var ftBtn = $('ftBtn');
  function renderFunTest() {
    var v = $('ftSel') ? $('ftSel').value : 'f1';
    var hasil = $('ftHasil'), ket = $('ftKet');
    var data = {
      f1: { ok: true, t: '{(1, 2), (2, 4), (3, 6)} adalah FUNGSI.', k: 'Setiap anggota domain (1, 2, 3) punya tepat satu pasangan di kodomain. Aturannya: y = 2x.' },
      f2: { ok: false, t: '{(1, 2), (1, 3), (2, 4)} BUKAN fungsi.', k: 'Anggota domain 1 punya dua pasangan (2 dan 3). Satu anggota domain tidak boleh punya dua pasangan.' },
      f3: { ok: true, t: '{(1, 5), (2, 5), (3, 5)} adalah FUNGSI.', k: 'Setiap anggota domain punya tepat satu pasangan, meskipun pasangannya sama (5). Fungsi boleh memetakan banyak domain ke satu kodomain.' },
      f4: { ok: false, t: '{(2, 1), (2, 2), (3, 1)} BUKAN fungsi.', k: 'Anggota domain 2 punya dua pasangan (1 dan 2).' }
    };
    var d = data[v];
    if (hasil) hasil.textContent = d.t;
    if (ket) ket.textContent = d.k;
  }
  if (ftBtn) ftBtn.addEventListener('click', renderFunTest);
  renderFunTest();

  /* ---------- Mesin fungsi ---------- */
  var fmBtn = $('fmBtn');
  function renderMachine() {
    var a = parseNum($('fmA')), b = parseNum($('fmB')), x = parseNum($('fmX'));
    var hasil = $('fmHasil'), tabel = $('fmTabel');
    if (a === null || b === null || x === null) {
      if (hasil) hasil.textContent = 'Isi a, b, dan x.';
      if (tabel) tabel.innerHTML = '';
      return;
    }
    var y = a * x + b;
    if (hasil) hasil.textContent = 'f(' + fmt(x) + ') = ' + fmt(a) + ' × (' + fmt(x) + ') + ' + fmt(b) + ' = ' + fmt(y);
    if (tabel) {
      var rows = '';
      for (var i = -2; i <= 3; i++) rows += '<tr><td class="num">' + fmt(i) + '</td><td class="num">' + fmt(a * i + b) + '</td></tr>';
      tabel.innerHTML = '<table><thead><tr><th class="num">x</th><th class="num">f(x) = ' + fmt(a) + 'x + ' + fmt(b) + '</th></tr></thead><tbody>' + rows + '</tbody></table>';
    }
  }
  if (fmBtn) fmBtn.addEventListener('click', renderMachine);
  renderMachine();


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
    "q": "Relasi {(1, a), (2, b), (3, a)} adalah fungsi?",
    "options": [
      "Ya",
      "Tidak",
      "Bukan relasi",
      "Tidak dapat ditentukan"
    ],
    "answer": 0,
    "why": "Setiap anggota domain (1, 2, 3) punya tepat satu pasangan."
  },
  {
    "q": "Relasi {(1, 2), (1, 3), (2, 4)} adalah fungsi?",
    "options": [
      "Ya",
      "Tidak",
      "Mungkin",
      "Ya, jika diubah"
    ],
    "answer": 1,
    "why": "Anggota domain 1 punya dua pasangan (2 dan 3)."
  },
  {
    "q": "Jika f(x) = 3x − 1, maka f(4) = …",
    "options": [
      "10",
      "13",
      "11",
      "12"
    ],
    "answer": 2,
    "why": "f(4) = 3×4 − 1 = 11.",
    "check": "3*4-1"
  },
  {
    "q": "Jika f(x) = x² + 1, maka f(3) = …",
    "options": [
      "9",
      "8",
      "7",
      "10"
    ],
    "answer": 3,
    "why": "f(3) = 3² + 1 = 10.",
    "check": "3**2+1"
  },
  {
    "q": "Domain dari relasi {(1, 2), (2, 3)} adalah …",
    "options": [
      "{2, 3}",
      "{1, 2}",
      "{1, 2, 3}",
      "{3}"
    ],
    "answer": 1,
    "why": "Domain adalah himpunan pertama: {1, 2}."
  },
  {
    "q": "Range dari f(x) = 2x dengan domain {1, 2, 3} adalah …",
    "options": [
      "{2, 4, 6}",
      "{1, 2, 3}",
      "{2, 3, 4}",
      "{4, 6, 8}"
    ],
    "answer": 0,
    "why": "f(1) = 2, f(2) = 4, f(3) = 6. Range = {2, 4, 6}."
  },
  {
    "q": "Jika f(x) = 5 − 2x, maka f(−1) = …",
    "options": [
      "3",
      "7",
      "−7",
      "−3"
    ],
    "answer": 1,
    "why": "f(−1) = 5 − 2(−1) = 5 + 2 = 7.",
    "check": "5-2*(-1)"
  },
  {
    "q": "Manakah yang grafiknya merupakan fungsi?",
    "options": [
      "Lingkaran",
      "Garis x = 3",
      "Parabola y = x²",
      "Garis vertikal"
    ],
    "answer": 2,
    "why": "Parabola y = x² memetakan tiap x ke tepat satu y. Lingkaran dan garis vertikal tidak."
  },
  {
    "q": "Jika g(x) = x + 4, maka g(6) = …",
    "options": [
      "9",
      "8",
      "11",
      "10"
    ],
    "answer": 3,
    "why": "g(6) = 6 + 4 = 10.",
    "check": "6+4"
  },
  {
    "q": "Ongkos kirim Rp10.000 + Rp2.000/kg. Biaya kirim paket 5 kg adalah …",
    "options": [
      "Rp18.000",
      "Rp15.000",
      "Rp12.000",
      "Rp20.000"
    ],
    "answer": 3,
    "why": "f(5) = 10.000 + 2.000×5 = 20.000.",
    "check": "10000+2000*5"
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
    var prevBest = read('mpi-a5-quiz-best', null);
    var prevNum = prevBest === null ? -1 : Number(prevBest);
    if (qScore > prevNum) store('mpi-a5-quiz-best', String(qScore));
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
    try { saved = JSON.parse(read('mpi-a5-refleksi', 'null')); } catch (e) { saved = null; }
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
      store('mpi-a5-refleksi', JSON.stringify(data));
      var st = $('refStatus');
      if (st) st.textContent = 'Refleksi tersimpan di perangkat ini pada ' + new Date().toLocaleString('id-ID') + '.';
      markVisited('sub6');
    });
  }
})();
