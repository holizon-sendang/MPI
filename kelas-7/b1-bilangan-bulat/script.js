/* B.1 Bilangan Bulat — script.js
   Vanilla JS, tanpa framework. Semua jawaban matematika diperiksa manual.
   localStorage: mpi-b1-visited (sub-bab yang dibuka),
   mpi-b1-quiz-best (skor kuis terbaik), mpi-b1-refleksi (refleksi). */
(function () {
  'use strict';

  /* ---------- Util ---------- */
  function $(id) { return document.getElementById(id); }
  function fmt(n) { return (n < 0 ? '−' : '') + Math.abs(n); }
  function fmtSigned(n) { return (n < 0 ? '−' : n > 0 ? '+' : '') + Math.abs(n); }
  function parseNum(el) {
    if (!el) return null;
    var v = el.value === '' ? NaN : Number(el.value);
    return Number.isFinite(v) && Number.isInteger(v) ? v : null;
  }
  function showFb(el, ok, msg) {
    if (!el) return;
    el.textContent = msg;
    el.classList.remove('ok', 'no', 'show');
    el.classList.add(ok ? 'ok' : 'no', 'show');
  }
  function store(key, value) {
    try { localStorage.setItem(key, value); } catch (e) { /* abaikan */ }
  }
  function read(key, fallback) {
    try {
      var v = localStorage.getItem(key);
      return v === null ? fallback : v;
    } catch (e) { return fallback; }
  }

  /* ---------- Progres sub-bab ---------- */
  var SUBS = ['sub1', 'sub2', 'sub3', 'sub4', 'sub5', 'sub6'];
  var visited = [];
  try { visited = JSON.parse(read('mpi-b1-visited', '[]')) || []; } catch (e) { visited = []; }
  if (!Array.isArray(visited)) visited = [];

  function saveVisited() { store('mpi-b1-visited', JSON.stringify(visited)); }
  function renderProgress() {
    var pct = Math.round((visited.length / SUBS.length) * 100);
    var text = $('progressText');
    if (text) text.textContent = 'Progres: ' + visited.length + ' dari 6 sub-bab (' + pct + '%)';
    var fill = $('progressFill');
    if (fill) fill.style.width = pct + '%';
    var bar = $('progressBar');
    if (bar) bar.setAttribute('aria-valuenow', String(pct));
    document.querySelectorAll('[data-sub]').forEach(function (a) {
      var id = a.getAttribute('data-sub');
      a.classList.toggle('done', visited.indexOf(id) !== -1);
    });
  }
  function markVisited(id) {
    if (visited.indexOf(id) === -1) {
      visited.push(id);
      saveVisited();
      renderProgress();
    }
  }
  document.querySelectorAll('[data-sub]').forEach(function (a) {
    a.addEventListener('click', function () { markVisited(a.getAttribute('data-sub')); });
  });
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) markVisited(en.target.id);
      });
    }, { rootMargin: '-20% 0px -60% 0px' });
    SUBS.forEach(function (id) { var s = $(id); if (s) io.observe(s); });
  }
  renderProgress();

  /* Skor terbaik kuis di header */
  var bestStored = read('mpi-b1-quiz-best', null);
  var bestEl = $('quizBestText');
  if (bestStored !== null && bestEl) {
    bestEl.textContent = 'Skor terbaik kuis: ' + bestStored + '/10';
    bestEl.hidden = false;
  }

  /* ---------- Sub-bab 1: garis bilangan ---------- */
  var nlTicks = $('nlTicks');
  if (nlTicks) {
    var ticksHtml = '';
    for (var t = -10; t <= 10; t++) ticksHtml += '<span>' + fmt(t) + '</span>';
    nlTicks.innerHTML = ticksHtml;
  }
  var nlSlider = $('nlSlider');
  function renderNumberLine() {
    if (!nlSlider) return;
    var v = Number(nlSlider.value);
    var marker = $('nlMarker');
    if (marker) marker.style.left = ((v + 10) / 20 * 100) + '%';
    var val = $('nlValue');
    if (val) val.textContent = fmt(v);
    var detail = $('nlDetail');
    if (detail) {
      var pos = v === 0 ? 'tepat di 0' : (v > 0 ? Math.abs(v) + ' langkah di kanan 0' : Math.abs(v) + ' langkah di kiri 0');
      detail.textContent = 'Lawannya ' + fmt(-v) + ' · Jarak ke 0 adalah ' + Math.abs(v) + ' langkah · Posisi: ' + pos;
    }
  }
  if (nlSlider) {
    nlSlider.addEventListener('input', renderNumberLine);
    renderNumberLine();
  }
  var nlQuizBtn = $('nlQuizBtn');
  if (nlQuizBtn) {
    nlQuizBtn.addEventListener('click', function () {
      var v = parseNum($('nlQuizInput'));
      if (v === null) { showFb($('nlQuizFb'), false, 'Tulis dulu sebuah bilangan bulat, misalnya 7.'); return; }
      showFb($('nlQuizFb'), v === 7,
        v === 7 ? 'Benar! Lawan dari −7 adalah 7, karena jarak keduanya ke 0 sama, 7 langkah, tapi arahnya berlawanan.'
                : 'Belum tepat. Lawan dari −7 adalah bilangan yang jaraknya sama dari 0, tapi di sisi kanan: 7. Coba lagi.');
    });
  }

  /* ---------- Sub-bab 2: alat banding ---------- */
  var cmpPicked = null;
  document.querySelectorAll('[data-cmp]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      cmpPicked = btn.getAttribute('data-cmp');
      document.querySelectorAll('[data-cmp]').forEach(function (b) {
        b.classList.remove('btn-primary');
        b.classList.add('btn-ghost');
      });
      btn.classList.remove('btn-ghost');
      btn.classList.add('btn-primary');
      var picked = $('cmpPicked');
      if (picked) picked.textContent = cmpPicked === '>' ? 'lebih dari (>)' : cmpPicked === '<' ? 'kurang dari (<)' : 'sama dengan (=)';
    });
  });
  var cmpCheck = $('cmpCheck');
  if (cmpCheck) {
    cmpCheck.addEventListener('click', function () {
      var a = parseNum($('cmpA'));
      var b = parseNum($('cmpB'));
      var fb = $('cmpFb');
      if (a === null || b === null) { showFb(fb, false, 'Isi kedua bilangan dulu dengan bilangan bulat.'); return; }
      if (!cmpPicked) { showFb(fb, false, 'Pilih dulu tandanya: >, <, atau =.'); return; }
      var correct = a > b ? '>' : a < b ? '<' : '=';
      var ok = cmpPicked === correct;
      showFb(fb, ok,
        ok ? 'Benar! ' + fmt(a) + ' ' + correct + ' ' + fmt(b) + ', karena ' + fmt(a) + ' letaknya lebih ke ' + (correct === '>' ? 'kanan' : correct === '<' ? 'kiri' : 'sama') + ' daripada ' + fmt(b) + ' di garis bilangan.'
           : 'Belum tepat. Yang benar: ' + fmt(a) + ' ' + correct + ' ' + fmt(b) + '. Ingat, bilangan yang lebih ke kanan di garis bilangan selalu lebih besar.');
    });
  }

  /* Urutkan */
  var sortCheck = $('sortCheck');
  if (sortCheck) {
    sortCheck.addEventListener('click', function () {
      var vals = ['sort1', 'sort2', 'sort3', 'sort4'].map(function (id) {
        var el = $(id);
        return el && el.value !== '' ? Number(el.value) : null;
      });
      var fb = $('sortFb');
      if (vals.indexOf(null) !== -1) { showFb(fb, false, 'Isi keempat kotak dulu.'); return; }
      if (new Set(vals).size !== 4) { showFb(fb, false, 'Ada bilangan yang terulang. Tiap bilangan dipakai tepat satu kali.'); return; }
      var correct = [-8, -3, 0, 5];
      var ok = vals.every(function (v, i) { return v === correct[i]; });
      showFb(fb, ok,
        ok ? 'Benar! Urutan dari yang terkecil: −8, −3, 0, 5.'
           : 'Belum tepat. Urutan yang benar: −8, −3, 0, 5. Ingat, −8 paling kecil karena letaknya paling jauh ke kiri.');
    });
  }

  /* ---------- Sub-bab 3: simulator suhu ---------- */
  var suhuAwal = $('suhuAwal');
  var suhuUbah = $('suhuUbah');
  function renderSuhu() {
    if (!suhuAwal || !suhuUbah) return;
    var awal = Number(suhuAwal.value);
    var ubah = Number(suhuUbah.value);
    var akhir = awal + ubah;
    var awalVal = $('suhuAwalVal');
    if (awalVal) awalVal.textContent = fmt(awal) + '°C';
    var ubahVal = $('suhuUbahVal');
    if (ubahVal) {
      ubahVal.textContent = ubah < 0 ? 'turun ' + Math.abs(ubah) + '°C (' + fmt(ubah) + ')'
        : ubah > 0 ? 'naik ' + ubah + '°C (+' + ubah + ')'
        : 'tetap (0)';
    }
    var hasil = $('suhuHasil');
    if (hasil) {
      hasil.textContent = fmt(akhir) + '°C';
      hasil.classList.toggle('cold', akhir < 0);
      hasil.classList.toggle('hot', akhir > 0);
    }
    var dot = $('suhuDot');
    if (dot) dot.style.left = Math.max(0, Math.min(100, ((akhir + 15) / 30) * 100)) + '%';
    var langkah = $('suhuLangkah');
    if (langkah) {
      langkah.textContent = ubah === 0
        ? 'Dari ' + fmt(awal) + '°C, suhu tidak berubah, tetap ' + fmt(akhir) + '°C.'
        : 'Dari ' + fmt(awal) + '°C, bergerak ' + Math.abs(ubah) + ' langkah ke ' + (ubah > 0 ? 'kanan (naik)' : 'kiri (turun)') + ', sampai di ' + fmt(akhir) + '°C. Jadi ' + fmt(awal) + ' + (' + fmt(ubah) + ') = ' + fmt(akhir) + '.';
    }
  }
  if (suhuAwal) suhuAwal.addEventListener('input', renderSuhu);
  if (suhuUbah) suhuUbah.addEventListener('input', renderSuhu);
  renderSuhu();

  /* Chip positif / negatif */
  var pos = 0;
  var neg = 0;
  var paired = 0; /* jumlah pasangan yang sudah dihapus */
  function renderChips() {
    var area = $('chipArea');
    if (!area) return;
    var html = '';
    var i;
    for (i = 0; i < paired; i++) html += '<span class="chip chip-pos chip-paired">+1</span><span class="chip chip-neg chip-paired">−1</span>';
    for (i = 0; i < pos; i++) html += '<span class="chip chip-pos">+1</span>';
    for (i = 0; i < neg; i++) html += '<span class="chip chip-neg">−1</span>';
    if (pos === 0 && neg === 0 && paired === 0) {
      html = '<span class="muted">Belum ada chip. Tambahkan chip untuk membuat soal, misalnya 2 chip +1 dan 3 chip −1 untuk 2 + (−3).</span>';
    }
    area.innerHTML = html;
    var pc = $('chipPosCount'); if (pc) pc.textContent = String(pos);
    var nc = $('chipNegCount'); if (nc) nc.textContent = String(neg);
    var sisa = $('chipSisa'); if (sisa) sisa.textContent = fmt(pos - neg);
    var pen = $('chipPenjelasan');
    if (pen) {
      pen.textContent = paired > 0
        ? 'Dipasangkan dan dihapus ' + paired + ' pasang (nilainya 0). Sisa ' + Math.abs(pos - neg) + ' chip ' + (pos - neg > 0 ? 'biru (+1)' : pos - neg < 0 ? 'merah (−1)' : 'tidak ada') + ', jadi hasilnya ' + fmt(pos - neg) + '.'
        : 'Hasil sementara: ' + fmtSigned(pos) + ' + (' + fmtSigned(-neg) + ') = ' + fmt(pos - neg) + '. Tekan “Pasangkan & Hapus Pasangan” untuk melihat pasangan yang saling menghilangkan.';
    }
  }
  var addPos = $('chipAddPos');
  if (addPos) addPos.addEventListener('click', function () { pos++; renderChips(); });
  var addNeg = $('chipAddNeg');
  if (addNeg) addNeg.addEventListener('click', function () { neg++; renderChips(); });
  var pairBtn = $('chipPair');
  if (pairBtn) {
    pairBtn.addEventListener('click', function () {
      var p = Math.min(pos, neg);
      if (p === 0) return;
      pos -= p; neg -= p; paired += p;
      renderChips();
    });
  }
  var resetBtn = $('chipReset');
  if (resetBtn) resetBtn.addEventListener('click', function () { pos = 0; neg = 0; paired = 0; renderChips(); });
  renderChips();

  /* Kalkulator langkah demi langkah */
  var calcBtn = $('calcBtn');
  if (calcBtn) {
    calcBtn.addEventListener('click', function () {
      var a = parseNum($('calcA'));
      var b = parseNum($('calcB'));
      var op = $('calcOp') ? $('calcOp').value : '+';
      var hasil = $('calcHasil');
      var langkah = $('calcLangkah');
      if (a === null || b === null) {
        if (hasil) hasil.textContent = 'Isi kedua bilangan dulu.';
        if (langkah) langkah.textContent = '';
        return;
      }
      var effective = op === '+' ? b : -b; /* a - b = a + (-b) */
      var result = a + effective;
      if (hasil) hasil.textContent = op === '+'
        ? fmt(a) + ' + (' + fmt(b) + ') = ' + fmt(result)
        : fmt(a) + ' − ' + Math.abs(b) + ' = ' + fmt(result);
      if (langkah) {
        langkah.textContent = op === '-'
          ? 'Mengurang ' + Math.abs(b) + ' sama dengan menjumlah lawannya, ' + fmt(-b) + '. Mulai dari ' + fmt(a) + ', bergerak ' + Math.abs(b) + ' langkah ke ' + (effective > 0 ? 'kanan' : effective < 0 ? 'kiri' : 'tempat') + ', sampai di ' + fmt(result) + '.'
          : 'Mulai dari ' + fmt(a) + ', bergerak ' + Math.abs(b) + ' langkah ke ' + (effective > 0 ? 'kanan' : effective < 0 ? 'kiri' : 'tempat') + ' (karena ' + fmtSigned(b) + '), sampai di ' + fmt(result) + '.';
      }
    });
  }

  /* ---------- Sub-bab 4: explorer kali/bagi ---------- */
  var exBtn = $('exBtn');
  if (exBtn) {
    exBtn.addEventListener('click', function () {
      var a = parseNum($('exA'));
      var b = parseNum($('exB'));
      var op = $('exOp') ? $('exOp').value : 'x';
      var hasil = $('exHasil');
      var alasan = $('exAlasan');
      if (a === null || b === null) {
        if (hasil) hasil.textContent = 'Isi kedua bilangan dulu.';
        if (alasan) alasan.textContent = '';
        return;
      }
      if (op === ':' && b === 0) {
        if (hasil) hasil.textContent = 'Tidak bisa dibagi 0';
        if (alasan) alasan.textContent = 'Pembagian dengan 0 tidak terdefinisi. Pilih pembagi selain 0.';
        return;
      }
      if (op === ':' && a % b !== 0) {
        if (hasil) hasil.textContent = fmt(a) + ' : ' + fmt(b) + ' tidak habis dibagi';
        if (alasan) alasan.textContent = fmt(a) + ' : ' + fmt(b) + ' = ' + (a / b) + ', bukan bilangan bulat. Coba bilangan yang habis dibagi, misalnya ' + fmt(a) + ' : ' + fmt(a === 0 ? 1 : a) + '.';
        return;
      }
      var result = op === 'x' ? a * b : a / b;
      var sameSign = (a >= 0 && b >= 0) || (a < 0 && b < 0);
      var signText = a === 0 || b === 0 ? 'Salah satu bilangannya 0, jadi hasilnya 0.'
        : sameSign ? 'Tanda sama (' + (a < 0 ? '− dan −' : '+ dan +') + '), jadi hasilnya positif.'
        : 'Tanda berbeda (' + (a < 0 ? '− dan +' : '+ dan −') + '), jadi hasilnya negatif.';
      if (hasil) hasil.textContent = op === 'x'
        ? '(' + fmt(a) + ') × (' + fmt(b) + ') = ' + fmt(result)
        : '(' + fmt(a) + ') : (' + fmt(b) + ') = ' + fmt(result);
      if (alasan) alasan.textContent = signText + ' Nilai mutlaknya ' + Math.abs(a) + (op === 'x' ? ' × ' : ' : ') + Math.abs(b) + ' = ' + Math.abs(result) + '.';
    });
  }

  /* ---------- Latihan ber-input jawaban (Sub-bab 4 & 5) ---------- */
  document.querySelectorAll('.qa-row').forEach(function (row) {
    var btn = row.querySelector('.qa-check');
    var input = row.querySelector('.qa-input');
    var explain = row.querySelector('.qa-explain');
    var fb = row.querySelector('.feedback');
    if (!btn || !input) return;
    btn.addEventListener('click', function () {
      var v = parseNum(input);
      if (v === null) { showFb(fb, false, 'Tulis dulu jawabanmu sebagai bilangan bulat.'); return; }
      var answer = Number(row.getAttribute('data-answer'));
      var ok = v === answer;
      row.classList.toggle('ok', ok);
      row.classList.toggle('no', !ok);
      showFb(fb, ok,
        ok ? 'Benar! Jawabannya ' + fmt(answer) + '.'
           : 'Belum tepat. Coba lagi, perhatikan tanda dan urutan operasinya.');
      if (explain) {
        explain.textContent = 'Pembahasan: ' + row.getAttribute('data-explain');
        explain.classList.add('show');
      }
    });
  });

  /* ---------- Sub-bab 6: kuis 10 soal ---------- */
  /* Kunci sudah diperiksa manual:
     1) 9  2) -4,-1,0,3  3) 2  4) -7  5) -12
     6) 4  7) -7  8) -8  9) 4  10) -1 */
  var QUIZ = [
    { q: 'Lawan dari −9 adalah …', options: ['9', '−9', '0', '1/9'], answer: 0, why: 'Lawan dari −9 adalah 9, karena jarak keduanya ke 0 sama, 9 langkah, tapi arahnya berlawanan.' },
    { q: 'Urutan bilangan −4, −1, 0, 3 dari yang terkecil adalah …', options: ['−4, −1, 0, 3', '−1, −4, 0, 3', '3, 0, −1, −4', '−4, 0, −1, 3'], answer: 0, why: 'Semakin ke kiri semakin kecil: −4 < −1 < 0 < 3.' },
    { q: '−6 + 8 = …', options: ['−14', '−2', '2', '14'], answer: 2, why: 'Mulai dari −6, bergerak 8 langkah ke kanan, sampai di 2.' },
    { q: '5 − 12 = …', options: ['7', '−7', '−17', '17'], answer: 1, why: '5 − 12 = 5 + (−12) = −7.' },
    { q: '(−3) × 4 = …', options: ['12', '−12', '−7', '7'], answer: 1, why: 'Tanda berbeda, jadi negatif. 3 × 4 = 12, hasilnya −12.' },
    { q: '(−24) : (−6) = …', options: ['−4', '4', '−30', '30'], answer: 1, why: 'Tanda sama (keduanya negatif), jadi positif. 24 : 6 = 4.' },
    { q: 'Suhu −2°C turun 5°C menjadi …', options: ['3°C', '−3°C', '−7°C', '7°C'], answer: 2, why: '−2 + (−5) = −7, jadi suhunya −7°C.' },
    { q: '−10 + (−4) − (−6) = …', options: ['−20', '−8', '0', '8'], answer: 1, why: '−10 + (−4) = −14, lalu −14 − (−6) = −14 + 6 = −8.' },
    { q: '3 × (−2) + 10 = …', options: ['4', '−4', '16', '−16'], answer: 0, why: 'Kali dulu: 3 × (−2) = −6, lalu −6 + 10 = 4.' },
    { q: 'Bilangan bulat yang lebih besar dari −3 dan lebih kecil dari 2 adalah …', options: ['−4', '−1', '2', '3'], answer: 1, why: '−1 memenuhi −3 < −1 < 2. Bilangan −4 terlalu kecil, sedangkan 2 dan 3 tidak lebih kecil dari 2.' }
  ];
  var qi = 0;
  var qScore = 0;
  var qAnswered = false;
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
        btn.addEventListener('click', function () { answerQuiz(idx, btn); });
        box.appendChild(btn);
      });
    }
    var fb = $('quizFb');
    if (fb) { fb.textContent = ''; fb.className = 'feedback'; }
    var next = $('quizNext');
    if (next) {
      next.disabled = true;
      next.textContent = qi === QUIZ.length - 1 ? 'Lihat Hasil →' : 'Soal Berikutnya →';
    }
    qAnswered = false;
  }

  function answerQuiz(idx, btn) {
    if (qAnswered) return;
    qAnswered = true;
    var item = QUIZ[qi];
    var ok = idx === item.answer;
    if (ok) qScore++;
    var live = $('quizScoreLive');
    if (live) live.textContent = 'Skor sementara: ' + qScore;
    var buttons = document.querySelectorAll('#quizOptions .opt-btn');
    buttons.forEach(function (b, i) {
      b.disabled = true;
      if (i === item.answer) b.classList.add('correct');
      else if (i === idx) b.classList.add('wrong');
    });
    showFb($('quizFb'), ok, (ok ? 'Benar! ' : 'Belum tepat. ') + item.why);
    var next = $('quizNext');
    if (next) next.disabled = false;
  }

  function finishQuiz() {
    var box = $('quizBox');
    var res = $('quizResult');
    if (box) box.hidden = true;
    if (res) res.hidden = false;
    var scoreEl = $('quizScore');
    if (scoreEl) scoreEl.textContent = qScore + '/10';
    var ring = $('quizRing');
    if (ring) ring.style.setProperty('--p', (qScore * 10) + '%');
    var msg = $('quizMsg');
    if (msg) {
      msg.textContent = qScore === 10 ? 'Sempurna! Kamu menguasai Bilangan Bulat.'
        : qScore >= 8 ? 'Hebat! Tinggal sedikit lagi menuju sempurna.'
        : qScore >= 6 ? 'Bagus! Ulangi bagian yang masih salah, lalu coba lagi.'
        : 'Terus berlatih! Buka lagi Sub-bab 3 dan 4, lalu ulangi kuisnya.';
    }
    var prevBest = read('mpi-b1-quiz-best', null);
    var prevNum = prevBest === null ? -1 : Number(prevBest);
    if (qScore > prevNum) store('mpi-b1-quiz-best', String(qScore));
    var bestNow = Math.max(qScore, prevNum);
    var bestLine = $('quizBestLine');
    if (bestLine) bestLine.textContent = 'Skor terbaikmu: ' + bestNow + '/10. Skor ini tersimpan di perangkat ini.';
    if (bestEl) {
      bestEl.textContent = 'Skor terbaik kuis: ' + bestNow + '/10';
      bestEl.hidden = false;
    }
    markVisited('sub6');
  }

  var quizNext = $('quizNext');
  if (quizNext) {
    quizNext.addEventListener('click', function () {
      if (!qAnswered) return;
      if (qi < QUIZ.length - 1) { qi++; renderQuiz(); }
      else finishQuiz();
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
    try { saved = JSON.parse(read('mpi-b1-refleksi', 'null')); } catch (e) { saved = null; }
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
      store('mpi-b1-refleksi', JSON.stringify(data));
      var st = $('refStatus');
      if (st) st.textContent = 'Refleksi tersimpan di perangkat ini pada ' + new Date().toLocaleString('id-ID') + '.';
      markVisited('sub6');
    });
  }
})();
