/* D.4 Ukuran Pemusatan Data — script.js
   Vanilla JS, tanpa framework.
   localStorage: mpi-d4-visited, mpi-d4-quiz-best, mpi-d4-refleksi. */
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
  try { visited = JSON.parse(read('mpi-d4-visited', '[]')) || []; } catch (e) { visited = []; }
  if (!Array.isArray(visited)) visited = [];
  function saveVisited() { store('mpi-d4-visited', JSON.stringify(visited)); }
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
  var bestStored = read('mpi-d4-quiz-best', null);
  var bestEl = $('quizBestText');
  if (bestStored !== null && bestEl) {
    bestEl.textContent = 'Skor terbaik kuis: ' + bestStored + '/10';
    bestEl.hidden = false;
  }


  /* ---------- Kalkulator statistik ---------- */
  function parseData(text) {
    return text.split(/[,;\s]+/).filter(function (s) { return s !== ''; }).map(Number)
      .filter(function (v) { return Number.isFinite(v); });
  }
  function statsOf(data) {
    var sorted = data.slice().sort(function (a, b) { return a - b; });
    var n = sorted.length;
    var sum = sorted.reduce(function (s, v) { return s + v; }, 0);
    var mean = sum / n;
    var median = n % 2 === 1 ? sorted[(n - 1) / 2] : (sorted[n / 2 - 1] + sorted[n / 2]) / 2;
    var freq = {};
    sorted.forEach(function (v) { freq[v] = (freq[v] || 0) + 1; });
    var maxF = 0, modus = [];
    Object.keys(freq).forEach(function (k) { if (freq[k] > maxF) maxF = freq[k]; });
    Object.keys(freq).forEach(function (k) { if (freq[k] === maxF && maxF > 1) modus.push(Number(k)); });
    var range = sorted[n - 1] - sorted[0];
    return { sorted: sorted, mean: mean, median: median, modus: modus, range: range, n: n };
  }
  function fmtStat(v) { return Number.isInteger(v) ? String(v) : v.toFixed(2); }
  var stBtn = $('stBtn');
  function renderStat() {
    var data = parseData($('stData') ? $('stData').value : '');
    var hasil = $('stHasil'), ket = $('stKet');
    if (data.length < 2) {
      if (hasil) hasil.textContent = 'Isi minimal 2 bilangan, dipisah koma.';
      if (ket) ket.textContent = '';
      return;
    }
    var s = statsOf(data);
    if (hasil) hasil.textContent = 'Mean ' + fmtStat(s.mean) + ' · Median ' + fmtStat(s.median) + ' · Modus ' + (s.modus.length ? s.modus.join(', ') : 'tidak ada') + ' · Range ' + fmtStat(s.range);
    if (ket) ket.textContent = 'Data terurut: ' + s.sorted.join(', ') + '. Mean = jumlah data : banyak data. Median = nilai tengah setelah diurutkan. Modus = nilai yang paling sering muncul. Range = terbesar − terkecil.';
  }
  if (stBtn) stBtn.addEventListener('click', renderStat);
  renderStat();

  /* ---------- Diagram batang interaktif ---------- */
  var barData = [7, 8, 8, 9, 8];
  function renderBars() {
    var wrap = $('sbBars'), labels = $('sbLabels');
    if (!wrap) return;
    var max = Math.max.apply(null, barData.concat([1]));
    var html = barData.map(function (v) {
      var h = Math.max(8, Math.round((v / max) * 110));
      return '<div class="bar" style="height:' + h + 'px">' + v + '</div>';
    }).join('');
    wrap.innerHTML = html;
    if (labels) labels.innerHTML = barData.map(function (v, i) { return '<span>S' + (i + 1) + '</span>'; }).join('');
    var s = statsOf(barData);
    var out = $('sbHasil');
    if (out) out.textContent = 'Banyak data: ' + s.n + ' · Mean ' + fmtStat(s.mean) + ' · Median ' + fmtStat(s.median) + ' · Modus ' + (s.modus.length ? s.modus.join(', ') : 'tidak ada') + ' · Range ' + fmtStat(s.range);
  }
  var sbAdd = $('sbAdd');
  if (sbAdd) {
    sbAdd.addEventListener('click', function () {
      var v = parseNum($('sbVal'));
      if (v === null) return;
      barData.push(v);
      renderBars();
    });
  }
  var sbReset = $('sbReset');
  if (sbReset) sbReset.addEventListener('click', function () { barData = [7, 8, 8, 9, 8]; renderBars(); });
  renderBars();

  /* ---------- Preset data ---------- */
  var presetBtn = $('presetBtn');
  function renderPreset() {
    var v = $('presetSel') ? $('presetSel').value : 'nilai';
    var data = {
      nilai: [7, 8, 6, 9, 8, 7, 10, 8],
      tinggi: [150, 155, 160, 158, 152, 165, 157],
      jual: [12, 15, 10, 18, 14, 20, 11]
    }[v];
    var s = statsOf(data);
    var hasil = $('presetHasil');
    if (hasil) hasil.textContent = 'Data: ' + data.join(', ');
    var ket = $('presetKet');
    if (ket) ket.textContent = 'Mean ' + fmtStat(s.mean) + ' · Median ' + fmtStat(s.median) + ' · Modus ' + (s.modus.length ? s.modus.join(', ') : 'tidak ada') + ' · Range ' + fmtStat(s.range) + '. ' + (v === 'nilai' ? 'Nilai ulangan paling sering 8, dan rata-ratanya 8 — kelas ini cukup merata.' : v === 'tinggi' ? 'Tinggi badan siswa berkisar 150–165 cm dengan rata-rata ' + fmtStat(s.mean) + ' cm.' : 'Penjualan paling tinggi 20 unit dan paling rendah 10 unit.');
  }
  if (presetBtn) presetBtn.addEventListener('click', renderPreset);
  renderPreset();


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
    "q": "Mean dari data 4, 6, 8 adalah …",
    "options": [
      "5",
      "6",
      "7",
      "8"
    ],
    "answer": 1,
    "why": "Mean = (4+6+8):3 = 18:3 = 6.",
    "check": "(4+6+8)//3"
  },
  {
    "q": "Median dari data 3, 5, 7 adalah …",
    "options": [
      "5",
      "3",
      "7",
      "6"
    ],
    "answer": 0,
    "why": "Suku tengahnya 5.",
    "check": "5"
  },
  {
    "q": "Modus dari data 2, 3, 3, 5 adalah …",
    "options": [
      "2",
      "5",
      "3",
      "4"
    ],
    "answer": 2,
    "why": "Angka 3 muncul 2 kali, paling sering."
  },
  {
    "q": "Range dari data 4, 9, 15 adalah …",
    "options": [
      "9",
      "15",
      "19",
      "11"
    ],
    "answer": 3,
    "why": "Range = 15 − 4 = 11.",
    "check": "15-4"
  },
  {
    "q": "Median dari data 2, 4, 6, 8 adalah …",
    "options": [
      "5",
      "4",
      "6",
      "3"
    ],
    "answer": 0,
    "why": "Median = (4+6):2 = 5.",
    "check": "(4+6)//2"
  },
  {
    "q": "Mean dari data 10, 20, 30, 40 adalah …",
    "options": [
      "20",
      "25",
      "30",
      "15"
    ],
    "answer": 1,
    "why": "Mean = 100:4 = 25.",
    "check": "(10+20+30+40)//4"
  },
  {
    "q": "Modus dari data 7, 7, 8, 9, 9, 9 adalah …",
    "options": [
      "7",
      "9",
      "8",
      "7 dan 9"
    ],
    "answer": 1,
    "why": "Angka 9 muncul 3 kali, paling sering."
  },
  {
    "q": "Jika mean 5 data adalah 10, jumlah kelima data itu …",
    "options": [
      "10",
      "40",
      "50",
      "15"
    ],
    "answer": 2,
    "why": "Jumlah = mean × banyak data = 10 × 5 = 50.",
    "check": "10*5"
  },
  {
    "q": "Median dari data 5, 7, 9, 9, 10 adalah …",
    "options": [
      "7",
      "10",
      "8",
      "9"
    ],
    "answer": 3,
    "why": "Suku tengahnya 9."
  },
  {
    "q": "Rata-rata dari 6, 8, 10, 12, 14 adalah …",
    "options": [
      "9",
      "8",
      "11",
      "10"
    ],
    "answer": 3,
    "why": "Mean = 50:5 = 10.",
    "check": "(6+8+10+12+14)//5"
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
    var prevBest = read('mpi-d4-quiz-best', null);
    var prevNum = prevBest === null ? -1 : Number(prevBest);
    if (qScore > prevNum) store('mpi-d4-quiz-best', String(qScore));
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
    try { saved = JSON.parse(read('mpi-d4-refleksi', 'null')); } catch (e) { saved = null; }
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
      store('mpi-d4-refleksi', JSON.stringify(data));
      var st = $('refStatus');
      if (st) st.textContent = 'Refleksi tersimpan di perangkat ini pada ' + new Date().toLocaleString('id-ID') + '.';
      markVisited('sub6');
    });
  }
})();
