/* B.3 Bilangan Rasional — script.js
   Vanilla JS, tanpa framework. Semua jawaban matematika diperiksa manual.
   localStorage: mpi-b3-visited (sub-bab yang dibuka),
   mpi-b3-quiz-best (skor kuis terbaik), mpi-b3-refleksi (refleksi). */
(function () {
  'use strict';

  /* ---------- Util ---------- */
  function $(id) { return document.getElementById(id); }
  function gcd(a, b) {
    a = Math.abs(a); b = Math.abs(b);
    while (b !== 0) { var t = b; b = a % b; a = t; }
    return a || 1;
  }
  function lcm(a, b) { return Math.abs(a * b) / gcd(a, b); }
  function simplify(n, d) {
    var g = gcd(n, d);
    n = n / g; d = d / g;
    if (d < 0) { n = -n; d = -d; }
    return { n: n, d: d };
  }
  function fracStr(f) { return f.d === 1 ? String(f.n) : f.n + '/' + f.d; }
  function fmtId(n) {
    /* Format angka gaya Indonesia: koma desimal, titik ribuan. */
    var s = String(n);
    if (s.indexOf('.') === -1) return Number(s).toLocaleString('id-ID');
    var parts = s.split('.');
    return Number(parts[0]).toLocaleString('id-ID') + ',' + parts[1];
  }
  function parseNum(el) {
    if (!el) return null;
    if (el.value === '') return null;
    var v = Number(el.value);
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
  try { visited = JSON.parse(read('mpi-b3-visited', '[]')) || []; } catch (e) { visited = []; }
  if (!Array.isArray(visited)) visited = [];

  function saveVisited() { store('mpi-b3-visited', JSON.stringify(visited)); }
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
  var bestStored = read('mpi-b3-quiz-best', null);
  var bestEl = $('quizBestText');
  if (bestStored !== null && bestEl) {
    bestEl.textContent = 'Skor terbaik kuis: ' + bestStored + '/10';
    bestEl.hidden = false;
  }

  /* ---------- Sub-bab 2: pilih jawaban ---------- */
  document.querySelectorAll('.model-box').forEach(function (box) {
    var fb = box.querySelector('.feedback');
    var explain = box.getAttribute('data-explain') || '';
    box.querySelectorAll('.model-opt').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var ok = btn.getAttribute('data-correct') === 'true';
        box.querySelectorAll('.model-opt').forEach(function (b) {
          b.setAttribute('aria-pressed', b === btn ? 'true' : 'false');
          b.classList.remove('btn-primary');
          b.classList.add('btn-ghost');
        });
        btn.classList.remove('btn-ghost');
        btn.classList.add('btn-primary');
        showFb(fb, ok, (ok ? 'Benar! ' : 'Belum tepat. Coba lagi. ') + explain);
      });
    });
  });

  /* ---------- Sub-bab 1: konverter pecahan-desimal-persen ---------- */
  var convBtn = $('convBtn');
  if (convBtn) {
    convBtn.addEventListener('click', function () {
      var a = parseIntNum($('convA'));
      var b = parseIntNum($('convB'));
      var hasil = $('convHasil');
      var langkah = $('convLangkah');
      if (a === null || b === null) {
        if (hasil) hasil.textContent = 'Isi pembilang dan penyebut dulu.';
        if (langkah) langkah.textContent = '';
        return;
      }
      if (b === 0) {
        if (hasil) hasil.textContent = 'Penyebut tidak boleh 0.';
        if (langkah) langkah.textContent = 'Pecahan dengan penyebut 0 tidak terdefinisi.';
        return;
      }
      var s = simplify(a, b);
      var des = a / b;
      var desTxt = fmtId(Math.round(des * 10000) / 10000);
      var perTxt = fmtId(Math.round(des * 10000) / 100);
      if (hasil) hasil.textContent = fracStr(s);
      if (langkah) {
        langkah.textContent = a + '/' + b + ' = ' + desTxt + ' = ' + perTxt + '%. Bentuk paling sederhana: ' + fracStr(s)
          + (fracStr(s) === a + '/' + b ? ' (sudah paling sederhana).' : ' (dibagi FPB ' + gcd(a, b) + ').');
      }
    });
  }

  /* ---------- Sub-bab 1: simulator pecahan senilai ---------- */
  var senA = $('senA'), senB = $('senB'), senK = $('senK');
  function renderSenilai() {
    if (!senA || !senB || !senK) return;
    var a = parseIntNum(senA);
    var b = parseIntNum(senB);
    var k = Number(senK.value);
    var kVal = $('senKVal');
    if (kVal) kVal.textContent = '×' + k;
    var hasil = $('senHasil'), langkah = $('senLangkah');
    if (a === null || b === null || b === 0) {
      if (hasil) hasil.textContent = 'Isi pecahan yang benar (penyebut bukan 0).';
      return;
    }
    var pct = Math.max(0, Math.min(100, (a / b) * 100));
    var l1 = $('senLabel1'), l2 = $('senLabel2');
    if (l1) l1.textContent = a + '/' + b;
    if (l2) l2.textContent = (a * k) + '/' + (b * k);
    var bar1 = $('senBar1'), bar2 = $('senBar2');
    if (bar1) bar1.style.width = pct + '%';
    if (bar2) bar2.style.width = pct + '%';
    if (hasil) hasil.textContent = a + '/' + b + ' = ' + (a * k) + '/' + (b * k);
    if (langkah) {
      var s = simplify(a * k, b * k);
      langkah.textContent = a + '/' + b + ' dikali ' + k + '/' + k + ' menjadi ' + (a * k) + '/' + (b * k)
        + '. Keduanya senilai: ' + (a * k) + '/' + (b * k) + ' disederhanakan (FPB ' + gcd(a * k, b * k) + ') kembali menjadi ' + fracStr(s) + '.';
    }
  }
  if (senA) senA.addEventListener('input', renderSenilai);
  if (senB) senB.addEventListener('input', renderSenilai);
  if (senK) senK.addEventListener('input', renderSenilai);
  renderSenilai();

  /* ---------- Sub-bab 2: garis bilangan ---------- */
  var FRAC_LABEL = { 0: '0', 0.25: '1/4', 0.5: '1/2', 0.75: '3/4', 1: '1', 1.25: '5/4', 1.5: '3/2', 1.75: '7/4', 2: '2' };
  var garisVal = $('garisVal');
  function renderGaris() {
    if (!garisVal) return;
    var v = Number(garisVal.value);
    var label = $('garisValLabel');
    if (label) label.textContent = fmtId(v);
    var dot = $('garisDot');
    if (dot) dot.style.left = (v / 2 * 100) + '%';
    var hasil = $('garisHasil');
    if (hasil) hasil.textContent = fmtId(v) + ' = ' + (FRAC_LABEL[v] || v);
    var langkah = $('garisLangkah');
    if (langkah) {
      if (v === 0) langkah.textContent = 'Titik 0: awal garis bilangan. Semua bilangan di kanan 0 bernilai positif.';
      else if (v === 2) langkah.textContent = 'Titik 2: dua satuan penuh dari 0. Nilainya sama dengan 2/1.';
      else if (v < 1) langkah.textContent = fmtId(v) + ' terletak di antara 0 dan 1, tepat di ' + FRAC_LABEL[v] + '. Jadi 0 < ' + FRAC_LABEL[v] + ' < 1.';
      else if (v === 1) langkah.textContent = 'Titik 1: satu satuan penuh. 1 = 4/4 = 2/2.';
      else langkah.textContent = fmtId(v) + ' terletak di antara 1 dan 2, tepat di ' + FRAC_LABEL[v] + '. Jadi 1 < ' + FRAC_LABEL[v] + ' < 2.';
    }
  }
  if (garisVal) garisVal.addEventListener('input', renderGaris);
  renderGaris();

  /* ---------- Kalkulator pecahan umum ---------- */
  function fracCalc(prefix, isMulDiv) {
    var btn = $(prefix + 'Btn');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var a = parseIntNum($(prefix + 'A'));
      var b = parseIntNum($(prefix + 'B'));
      var c = parseIntNum($(prefix + 'C'));
      var d = parseIntNum($(prefix + 'D'));
      var op = $(prefix + 'Op') ? $(prefix + 'Op').value : '+';
      var hasil = $(prefix + 'Hasil');
      var langkah = $(prefix + 'Langkah');
      if (a === null || b === null || c === null || d === null) {
        if (hasil) hasil.textContent = 'Isi keempat bilangan dulu.';
        if (langkah) langkah.textContent = '';
        return;
      }
      if (b === 0 || d === 0) {
        if (hasil) hasil.textContent = 'Penyebut tidak boleh 0.';
        if (langkah) langkah.textContent = '';
        return;
      }
      if (isMulDiv && op === ':' && c === 0) {
        if (hasil) hasil.textContent = 'Tidak bisa membagi dengan 0.';
        if (langkah) langkah.textContent = 'Pecahan kedua tidak boleh 0 saat membagi.';
        return;
      }
      var left = a + '/' + b, right = c + '/' + d;
      var res, steps;
      if (!isMulDiv) {
        var k = lcm(b, d);
        var n1 = a * (k / b), n2 = c * (k / d);
        var num = op === '+' ? n1 + n2 : n1 - n2;
        res = simplify(num, k);
        steps = 'KPK dari ' + b + ' dan ' + d + ' adalah ' + k + '. ' + left + ' = ' + n1 + '/' + k + ' dan ' + right + ' = ' + n2 + '/' + k
          + ', jadi ' + n1 + '/' + k + ' ' + op + ' ' + n2 + '/' + k + ' = ' + num + '/' + k
          + (fracStr(res) === num + '/' + k ? ' (sudah paling sederhana).' : ' = ' + fracStr(res) + ' (dibagi FPB ' + gcd(num, k) + ').');
      } else if (op === 'x') {
        res = simplify(a * c, b * d);
        steps = left + ' × ' + right + ' = ' + (a * c) + '/' + (b * d)
          + (fracStr(res) === (a * c) + '/' + (b * d) ? ' (sudah paling sederhana).' : ' = ' + fracStr(res) + ' (dibagi FPB ' + gcd(a * c, b * d) + ').');
      } else {
        res = simplify(a * d, b * c);
        steps = left + ' ÷ ' + right + ' = ' + left + ' × ' + d + '/' + c + ' = ' + (a * d) + '/' + (b * c)
          + (fracStr(res) === (a * d) + '/' + (b * c) ? ' (sudah paling sederhana).' : ' = ' + fracStr(res) + ' (dibagi FPB ' + gcd(a * d, b * c) + ').');
      }
      var opTxt = !isMulDiv ? (op === '+' ? '+' : '−') : (op === 'x' ? '×' : '÷');
      if (hasil) hasil.textContent = left + ' ' + opTxt + ' ' + right + ' = ' + fracStr(res);
      if (langkah) langkah.textContent = steps;
    });
  }
  fracCalc('t', false);
  fracCalc('k', true);

  /* ---------- Latihan ber-input jawaban (Sub-bab 1, 3, 4 & 5) ---------- */
  document.querySelectorAll('.qa-row').forEach(function (row) {
    var btn = row.querySelector('.qa-check');
    var input = row.querySelector('.qa-input');
    var explain = row.querySelector('.qa-explain');
    var fb = row.querySelector('.feedback');
    if (!btn || !input) return;
    btn.addEventListener('click', function () {
      var v = parseNum(input);
      if (v === null) { showFb(fb, false, 'Tulis dulu jawabanmu sebagai bilangan.'); return; }
      var answer = Number(row.getAttribute('data-answer'));
      var tol = Number(row.getAttribute('data-tol') || '0.001');
      var ok = Math.abs(v - answer) <= tol;
      row.classList.toggle('ok', ok);
      row.classList.toggle('no', !ok);
      showFb(fb, ok,
        ok ? 'Benar! Jawabannya ' + fmtId(row.getAttribute('data-answer')) + '.'
           : 'Belum tepat. Coba lagi, perhatikan langkah dan bentuk jawabannya.');
      if (explain) {
        explain.textContent = 'Pembahasan: ' + row.getAttribute('data-explain');
        explain.classList.add('show');
      }
    });
  });

  /* ---------- Sub-bab 6: kuis 10 soal ---------- */
  /* Kunci sudah diperiksa manual (keseimbangan A2/B3/C2/D3):
     1) 3/4 (idx 1)   2) 4/5 (idx 1)   3) 3/4 (idx 3)   4) 1/2 (idx 1)
     5) Rp40.000 (idx 3)   6) 3 (idx 0)   7) 0,75 (idx 0)
     8) 60 (idx 2)   9) 50 (idx 2)   10) 5/8 (idx 3) */
  var QUIZ = [
    { q: 'Rani minum 1/2 liter susu pagi hari dan 1/4 liter sore hari. Total susu yang diminum Rani …', options: ['2/6 liter', '3/4 liter', '1/3 liter', '2/4 liter'], answer: 1, why: 'Samakan penyebut 4: 1/2 = 2/4, jadi 2/4 + 1/4 = 3/4 liter.' },
    { q: 'Bentuk pecahan paling sederhana dari 0,8 adalah …', options: ['8/10', '4/5', '2/5', '8/5'], answer: 1, why: '0,8 = 8/10. Bagi pembilang dan penyebut dengan FPB 2 menjadi 4/5.' },
    { q: 'Manakah yang paling besar: 0,7; 2/3; 3/4; atau 0,65?', options: ['0,7', '2/3', '0,65', '3/4'], answer: 3, why: 'Ubah ke desimal: 2/3 ≈ 0,67 dan 3/4 = 0,75. Yang paling besar adalah 3/4.' },
    { q: 'Hasil dari 2/3 × 3/4 adalah …', options: ['5/12', '1/2', '2/3', '6/7'], answer: 1, why: '2/3 × 3/4 = 6/12 = 1/2. Angka 3 bisa dicoret dulu.' },
    { q: 'Sebuah baju seharga Rp50.000 didiskon 20%. Harga yang harus dibayar …', options: ['Rp10.000', 'Rp30.000', 'Rp45.000', 'Rp40.000'], answer: 3, why: 'Diskon 20% dari Rp50.000 adalah Rp10.000, jadi bayarnya 50.000 − 10.000 = Rp40.000.' },
    { q: 'Hasil dari 3/5 ÷ 1/5 adalah …', options: ['3', '3/25', '5/3', '1/3'], answer: 0, why: '3/5 ÷ 1/5 = 3/5 × 5/1 = 15/5 = 3.' },
    { q: 'Hasil dari 1,5 − 0,75 adalah …', options: ['0,75', '2,25', '0,25', '1,25'], answer: 0, why: 'Luruskan koma: 1,50 − 0,75 = 0,75.' },
    { q: '25% dari 240 adalah …', options: ['50', '80', '60', '40'], answer: 2, why: '25% = 1/4, jadi 240 ÷ 4 = 60.' },
    { q: 'Taksiran terbaik dari 0,51 × 98 adalah sekitar …', options: ['5', '500', '50', '100'], answer: 2, why: 'Taksir 0,51 ≈ 0,5 dan 98 ≈ 100, jadi 0,5 × 100 = 50.' },
    { q: 'Hasil dari 7/8 − 1/4 adalah …', options: ['6/8', '3/4', '1/2', '5/8'], answer: 3, why: 'Samakan penyebut 8: 1/4 = 2/8, jadi 7/8 − 2/8 = 5/8.' }
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
      msg.textContent = qScore === 10 ? 'Sempurna! Kamu menguasai Bilangan Rasional.'
        : qScore >= 8 ? 'Hebat! Tinggal sedikit lagi menuju sempurna.'
        : qScore >= 6 ? 'Bagus! Ulangi bagian yang masih salah, lalu coba lagi.'
        : 'Terus berlatih! Buka lagi Sub-bab 1 dan 3, lalu ulangi kuisnya.';
    }
    var prevBest = read('mpi-b3-quiz-best', null);
    var prevNum = prevBest === null ? -1 : Number(prevBest);
    if (qScore > prevNum) store('mpi-b3-quiz-best', String(qScore));
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
    try { saved = JSON.parse(read('mpi-b3-refleksi', 'null')); } catch (e) { saved = null; }
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
      store('mpi-b3-refleksi', JSON.stringify(data));
      var st = $('refStatus');
      if (st) st.textContent = 'Refleksi tersimpan di perangkat ini pada ' + new Date().toLocaleString('id-ID') + '.';
      markVisited('sub6');
    });
  }
})();
