/* B.2 Bilangan Bulat dalam Kehidupan Sehari-hari — script.js
   Vanilla JS, tanpa framework. Semua jawaban matematika diperiksa manual.
   localStorage: mpi-b2-visited (sub-bab yang dibuka),
   mpi-b2-quiz-best (skor kuis terbaik), mpi-b2-refleksi (refleksi). */
(function () {
  'use strict';

  /* ---------- Util ---------- */
  function $(id) { return document.getElementById(id); }
  function fmt(n) { return (n < 0 ? '−' : '') + Math.abs(n); }
  function fmtSigned(n) { return (n < 0 ? '−' : n > 0 ? '+' : '') + Math.abs(n); }
  function fmtRp(n) { return (n < 0 ? '−Rp' : 'Rp') + Math.abs(n).toLocaleString('id-ID'); }
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
  try { visited = JSON.parse(read('mpi-b2-visited', '[]')) || []; } catch (e) { visited = []; }
  if (!Array.isArray(visited)) visited = [];

  function saveVisited() { store('mpi-b2-visited', JSON.stringify(visited)); }
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
  var bestStored = read('mpi-b2-quiz-best', null);
  var bestEl = $('quizBestText');
  if (bestStored !== null && bestEl) {
    bestEl.textContent = 'Skor terbaik kuis: ' + bestStored + '/10';
    bestEl.hidden = false;
  }

  /* ---------- Sub-bab 2: pilih model ---------- */
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

  /* Kalkulator lift */
  var liftBtn = $('liftBtn');
  if (liftBtn) {
    liftBtn.addEventListener('click', function () {
      var a = parseNum($('liftA'));
      var b = parseNum($('liftB'));
      var hasil = $('liftHasil');
      var langkah = $('liftLangkah');
      if (a === null || b === null) {
        if (hasil) hasil.textContent = 'Isi kedua bilangan dulu.';
        if (langkah) langkah.textContent = '';
        return;
      }
      var akhir = a + b;
      if (hasil) hasil.textContent = fmt(a) + ' + (' + fmt(b) + ') = ' + fmt(akhir);
      if (langkah) {
        var asal = a === 0 ? 'lantai dasar (0)' : a < 0 ? 'lantai ' + fmt(a) + ' (parkir B' + Math.abs(a) + ')' : 'lantai ' + a;
        var tujuan = akhir === 0 ? 'lantai dasar (0)' : akhir < 0 ? 'lantai ' + fmt(akhir) + ' (parkir B' + Math.abs(akhir) + ')' : 'lantai ' + akhir;
        langkah.textContent = 'Dari ' + asal + ', ' + (b >= 0 ? 'naik ' + b + ' lantai' : 'turun ' + Math.abs(b) + ' lantai') + ', sampai di ' + tujuan + '.';
      }
    });
  }

  /* ---------- Sub-bab 4: buku kas ---------- */
  var kasBtn = $('kasBtn');
  if (kasBtn) {
    kasBtn.addEventListener('click', function () {
      var awal = parseNum($('kasAwal'));
      var masuk = parseNum($('kasMasuk'));
      var keluar = parseNum($('kasKeluar'));
      var hasil = $('kasHasil');
      var langkah = $('kasLangkah');
      if (awal === null || masuk === null || keluar === null) {
        if (hasil) hasil.textContent = 'Isi ketiga jumlah uang dulu.';
        if (langkah) langkah.textContent = '';
        return;
      }
      var akhir = awal + masuk - keluar;
      if (hasil) {
        hasil.textContent = fmtRp(akhir);
        hasil.classList.toggle('money-pos', akhir >= 0);
        hasil.classList.toggle('money-neg', akhir < 0);
      }
      if (langkah) {
        langkah.textContent = awal.toLocaleString('id-ID') + ' + ' + masuk.toLocaleString('id-ID') + ' − ' + keluar.toLocaleString('id-ID') + ' = ' + akhir.toLocaleString('id-ID') + '. '
          + (akhir >= 0 ? 'Saldomu masih positif, jadi uangmu cukup.'
            : 'Saldomu negatif, artinya uangmu kurang ' + fmtRp(akhir) + ' — kamu perlu menambah uang atau mengurangi pengeluaran.');
      }
    });
  }

  /* Untung / rugi */
  var untungBtn = $('untungBtn');
  if (untungBtn) {
    untungBtn.addEventListener('click', function () {
      var beli = parseNum($('beliHarga'));
      var jual = parseNum($('jualHarga'));
      var hasil = $('untungHasil');
      var langkah = $('untungLangkah');
      if (beli === null || jual === null) {
        if (hasil) hasil.textContent = 'Isi harga beli dan harga jual dulu.';
        if (langkah) langkah.textContent = '';
        return;
      }
      var selisih = jual - beli;
      if (hasil) {
        hasil.textContent = selisih >= 0 ? 'Untung ' + fmtRp(selisih) : 'Rugi ' + fmtRp(selisih);
        hasil.classList.toggle('money-pos', selisih >= 0);
        hasil.classList.toggle('money-neg', selisih < 0);
      }
      if (langkah) {
        langkah.textContent = jual.toLocaleString('id-ID') + ' − ' + beli.toLocaleString('id-ID') + ' = ' + selisih.toLocaleString('id-ID') + '. Selisihnya '
          + (selisih >= 0 ? 'positif, jadi untung ' + fmtRp(selisih) + '.' : 'negatif, jadi rugi ' + fmtRp(selisih) + '.');
      }
    });
  }

  /* ---------- Latihan ber-input jawaban (Sub-bab 1, 4 & 5) ---------- */
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
           : 'Belum tepat. Coba lagi, perhatikan tanda dan langkah pemodelannya.');
      if (explain) {
        explain.textContent = 'Pembahasan: ' + row.getAttribute('data-explain');
        explain.classList.add('show');
      }
    });
  });

  /* ---------- Sub-bab 6: kuis 10 soal ---------- */
  /* Kunci sudah diperiksa manual:
     1) 2°C (idx 2)   2) -7 m (idx 1)   3) kurang Rp15.000 (idx 0)
     4) lantai 5 (idx 2)   5) 26 (idx 3)   6) Rp105.000 (idx 1)
     7) 36°C (idx 3)   8) Rp15.000 (idx 1)   9) 1 (idx 3)   10) lantai -2 (idx 0) */
  var QUIZ = [
    { q: 'Suhu di Dieng −3°C. Siang hari suhu naik 5°C. Suhu siang adalah …', options: ['−8°C', '−2°C', '2°C', '8°C'], answer: 2, why: '−3 + 5 = 2, jadi suhu siang 2°C.' },
    { q: 'Seorang penyelam berada 12 m di bawah permukaan laut. Ia naik 5 m. Posisinya sekarang …', options: ['−17 m', '−7 m', '7 m', '17 m'], answer: 1, why: '−12 + 5 = −7, jadi ia berada 7 m di bawah permukaan laut.' },
    { q: 'Ibu membawa uang Rp50.000. Ia belanja seharga Rp65.000. Keadaan uang Ibu …', options: ['Kurang Rp15.000 (saldo −Rp15.000)', 'Sisa Rp15.000', 'Sisa Rp115.000', 'Kurang Rp65.000'], answer: 0, why: '50.000 − 65.000 = −15.000, jadi Ibu kekurangan Rp15.000.' },
    { q: 'Sebuah lift berada di lantai −2 (parkir B2). Lift naik 7 lantai. Lift berhenti di lantai …', options: ['−9', '−5', '5', '9'], answer: 2, why: '−2 + 7 = 5, jadi lift berhenti di lantai 5.' },
    { q: 'Dalam sebuah kuis, jawaban benar +4, salah −1, kosong 0. Rina menjawab 7 benar, 2 salah, dan 1 kosong dari 10 soal. Skor Rina …', options: ['24', '25', '28', '26'], answer: 3, why: '7 × 4 = 28, 2 × (−1) = −2, jadi 28 + (−2) + 0 = 26.' },
    { q: 'Tabungan Dina Rp120.000. Ia mengambil Rp45.000, lalu menabung lagi Rp30.000. Tabungan Dina sekarang …', options: ['Rp75.000', 'Rp105.000', 'Rp135.000', 'Rp165.000'], answer: 1, why: '120.000 − 45.000 + 30.000 = 105.000.' },
    { q: 'Suhu tertinggi di sebuah kota 32°C dan suhu terendahnya −4°C. Selisih kedua suhu itu …', options: ['28°C', '32°C', '40°C', '36°C'], answer: 3, why: 'Selisih = 32 − (−4) = 32 + 4 = 36°C.' },
    { q: 'Budi berhutang Rp25.000. Ia membayar Rp10.000. Sisa hutang Budi …', options: ['Rp35.000', 'Rp15.000', 'Rp10.000', 'Rp25.000'], answer: 1, why: '−25.000 + 10.000 = −15.000, jadi sisa hutangnya Rp15.000.' },
    { q: '−8 + 15 − 6 = …', options: ['−1', '7', '13', '1'], answer: 3, why: '−8 + 15 = 7, lalu 7 − 6 = 1.' },
    { q: 'Dedi berada di lantai 3. Ia turun 5 lantai menuju tempat parkir. Dedi berada di lantai …', options: ['−2', '2', '−8', '8'], answer: 0, why: '3 − 5 = −2, jadi Dedi berada di lantai −2 (parkir B2).' }
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
      msg.textContent = qScore === 10 ? 'Sempurna! Kamu menguasai Bilangan Bulat dalam Kehidupan Sehari-hari.'
        : qScore >= 8 ? 'Hebat! Tinggal sedikit lagi menuju sempurna.'
        : qScore >= 6 ? 'Bagus! Ulangi bagian yang masih salah, lalu coba lagi.'
        : 'Terus berlatih! Buka lagi Sub-bab 2 dan 4, lalu ulangi kuisnya.';
    }
    var prevBest = read('mpi-b2-quiz-best', null);
    var prevNum = prevBest === null ? -1 : Number(prevBest);
    if (qScore > prevNum) store('mpi-b2-quiz-best', String(qScore));
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
    try { saved = JSON.parse(read('mpi-b2-refleksi', 'null')); } catch (e) { saved = null; }
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
      store('mpi-b2-refleksi', JSON.stringify(data));
      var st = $('refStatus');
      if (st) st.textContent = 'Refleksi tersimpan di perangkat ini pada ' + new Date().toLocaleString('id-ID') + '.';
      markVisited('sub6');
    });
  }
})();
