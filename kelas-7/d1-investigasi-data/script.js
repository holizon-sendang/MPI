/* D.1 Investigasi Data — script.js
   Vanilla JS, tanpa framework. Semua jawaban matematika diperiksa manual.
   localStorage: mpi-d1-visited (sub-bab yang dibuka),
   mpi-d1-quiz-best (skor kuis terbaik), mpi-d1-refleksi (refleksi). */
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
    var s = String(n);
    if (s.indexOf('.') === -1) return Number(s).toLocaleString('id-ID');
    var parts = s.split('.');
    return Number(parts[0]).toLocaleString('id-ID') + ',' + parts[1];
  }
  function fmtNum(n, dec) {
    var r = Math.round(n * Math.pow(10, dec)) / Math.pow(10, dec);
    return fmtId(r);
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
  try { visited = JSON.parse(read('mpi-d1-visited', '[]')) || []; } catch (e) { visited = []; }
  if (!Array.isArray(visited)) visited = [];

  function saveVisited() { store('mpi-d1-visited', JSON.stringify(visited)); }
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
  var bestStored = read('mpi-d1-quiz-best', null);
  var bestEl = $('quizBestText');
  if (bestStored !== null && bestEl) {
    bestEl.textContent = 'Skor terbaik kuis: ' + bestStored + '/10';
    bestEl.hidden = false;
  }

  /* ---------- Latihan pilih jawaban (model-box) ---------- */
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

  /* ---------- Latihan ber-input jawaban (qa-row) ---------- */
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


  /* ---------- Sub-bab 2: pembangun rencana investigasi ---------- */
  var RENCANA = {
    'hobi': { jenis: 'Data kualitatif (kategori)', cara: 'Angket / kuesioner ke seluruh siswa kelas', grafik: 'Diagram batang atau diagram lingkaran' },
    'tinggi': { jenis: 'Data kuantitatif kontinu', cara: 'Pengukuran langsung dengan meteran', grafik: 'Histogram atau diagram batang' },
    'nilai': { jenis: 'Data kuantitatif diskrit', cara: 'Mengumpulkan nilai ulangan dari daftar nilai', grafik: 'Diagram batang atau tabel frekuensi' }
  };
  var rcBtn = $('rcBtn');
  if (rcBtn) {
    rcBtn.addEventListener('click', function () {
      var pilih = $('rcPilih') ? $('rcPilih').value : 'hobi';
      var r = RENCANA[pilih];
      var hasil = $('rcHasil'), langkah = $('rcLangkah');
      if (hasil) hasil.textContent = 'Jenis data: ' + r.jenis;
      if (langkah) langkah.textContent = 'Cara mengumpulkan: ' + r.cara + '. Grafik yang cocok: ' + r.grafik + '.';
    });
  }

  /* ---------- Sub-bab 4: kalkulator tabel frekuensi ---------- */
  var fqBtn = $('fqBtn');
  function renderFreq() {
    var input = $('fqData');
    var tabel = $('fqTabel');
    if (!input || !tabel) return;
    var raw = input.value.split(',').map(function (s) { return Number(s.trim()); }).filter(function (n) { return Number.isFinite(n); });
    var body = tabel.querySelector('tbody');
    var totalEl = $('fqTotal'), modusEl = $('fqModus');
    if (raw.length === 0) {
      if (body) body.innerHTML = '';
      if (totalEl) totalEl.textContent = 'Isi data dulu, pisahkan dengan koma.';
      if (modusEl) modusEl.textContent = '';
      return;
    }
    var count = {};
    raw.forEach(function (n) { count[n] = (count[n] || 0) + 1; });
    var keys = Object.keys(count).map(Number).sort(function (a, b) { return a - b; });
    if (body) {
      body.innerHTML = '';
      keys.forEach(function (k) {
        var tr = document.createElement('tr');
        var td1 = document.createElement('td'); td1.textContent = fmtId(k);
        var td2 = document.createElement('td'); td2.className = 'num'; td2.textContent = count[k];
        tr.appendChild(td1); tr.appendChild(td2);
        body.appendChild(tr);
      });
    }
    var modus = keys[0], maxC = count[keys[0]];
    keys.forEach(function (k) { if (count[k] > maxC) { maxC = count[k]; modus = k; } });
    if (totalEl) totalEl.textContent = 'Banyak data: ' + raw.length + ' · Nilai terkecil: ' + fmtId(keys[0]) + ' · Nilai terbesar: ' + fmtId(keys[keys.length - 1]);
    if (modusEl) modusEl.textContent = 'Modus (nilai yang paling sering muncul): ' + fmtId(modus) + ' — muncul ' + maxC + ' kali.';
  }
  if (fqBtn) fqBtn.addEventListener('click', renderFreq);
  renderFreq();

  /* ---------- Sub-bab 5: pemilih grafik ---------- */
  var pgBtn = $('pgBtn');
  if (pgBtn) {
    pgBtn.addEventListener('click', function () {
      var pilih = $('pgPilih') ? $('pgPilih').value : 'kategori';
      var hasil = $('pgHasil'), langkah = $('pgLangkah');
      var map = {
        'kategori': ['Diagram batang atau diagram lingkaran', 'Data kategori (misalnya hobi, warna favorit) paling enak dibaca lewat batang yang tingginya dibandingkan, atau lingkaran yang menunjukkan bagiannya dari keseluruhan.'],
        'diskrit': ['Diagram batang / histogram', 'Data hitungan (misalnya nilai ulangan, jumlah anak) cocok dengan batang — tiap nilai punya batangnya sendiri.'],
        'waktu': ['Diagram garis', 'Data yang berubah sepanjang waktu (misalnya suhu tiap jam, penjualan tiap bulan) paling jelas lewat garis yang naik-turun.'],
        'bagian': ['Diagram lingkaran', 'Kalau pertanyaannya “berapa bagian dari keseluruhan?”, diagram lingkaran jawabannya: tiap juring adalah satu bagian.']
      };
      var m = map[pilih];
      if (hasil) hasil.textContent = m[0];
      if (langkah) langkah.textContent = m[1];
    });
  }


  /* ---------- Sub-bab 6: kuis 10 soal ---------- */
  /* Kunci sudah diperiksa manual (keseimbangan A2/B3/C2/D3):
     1) Kualitatif (idx 1)
     2) Kuantitatif kontinu (idx 1)
     3) Merumuskan pertanyaan/masalah (idx 3)
     4) Seluruh siswa kelas 7A (idx 2)
     5) Diskrit (idx 3)
     6) Kuesioner tertulis (idx 0)
     7) Banyaknya kemunculan tiap nilai (idx 0)
     8) Diagram batang / histogram (idx 2)
     9) Mewakili populasi (idx 1)
     10) 40% (idx 3) */
  var QUIZ = [
  {
    "q": "Data “warna favorit siswa” termasuk data …",
    "options": [
      "Kuantitatif",
      "Kualitatif",
      "Diskrit",
      "Kontinu"
    ],
    "answer": 1,
    "why": "Warna favorit berupa kategori, bukan bilangan — data kualitatif."
  },
  {
    "q": "Data “tinggi badan siswa” termasuk data …",
    "options": [
      "Kualitatif",
      "Kuantitatif kontinu",
      "Diskrit",
      "Nominal"
    ],
    "answer": 1,
    "why": "Tinggi badan hasil mengukur dan bisa bernilai apa saja — kuantitatif kontinu."
  },
  {
    "q": "Langkah pertama dalam melakukan investigasi data adalah …",
    "options": [
      "Mengumpulkan data",
      "Membuat grafik",
      "Menyajikan tabel",
      "Merumuskan pertanyaan/masalah"
    ],
    "answer": 3,
    "why": "Investigasi dimulai dari pertanyaan yang jelas, baru ditentukan data apa yang dibutuhkan."
  },
  {
    "q": "Dalam survei hobi seluruh siswa kelas 7A, populasinya adalah …",
    "options": [
      "Satu siswa",
      "Sampel acak",
      "Seluruh siswa kelas 7A",
      "Guru kelas"
    ],
    "answer": 2,
    "why": "Populasi adalah seluruh objek yang diteliti — seluruh siswa kelas 7A."
  },
  {
    "q": "Data “jumlah anak dalam satu keluarga” termasuk data …",
    "options": [
      "Kualitatif",
      "Kontinu",
      "Nominal",
      "Diskrit"
    ],
    "answer": 3,
    "why": "Jumlah anak hasil menghitung dan nilainya bulat — kuantitatif diskrit."
  },
  {
    "q": "Angket adalah cara mengumpulkan data dengan …",
    "options": [
      "Kuesioner tertulis",
      "Mengamati",
      "Mengukur",
      "Menghitung"
    ],
    "answer": 0,
    "why": "Angket memakai kuesioner tertulis yang diisi oleh responden."
  },
  {
    "q": "Tabel frekuensi menunjukkan …",
    "options": [
      "Banyaknya kemunculan tiap nilai",
      "Rata-rata",
      "Nilai terbesar",
      "Grafik"
    ],
    "answer": 0,
    "why": "Tabel frekuensi mencatat tiap nilai beserta frekuensinya — berapa kali nilai itu muncul."
  },
  {
    "q": "Data nilai ulangan paling cocok disajikan dengan …",
    "options": [
      "Diagram lingkaran",
      "Piktogram",
      "Diagram batang / histogram",
      "Kartogram"
    ],
    "answer": 2,
    "why": "Nilai ulangan adalah data hitungan; diagram batang menunjukkan perbandingan frekuensi tiap nilai dengan jelas."
  },
  {
    "q": "Sampel yang baik harus …",
    "options": [
      "Sekecil mungkin",
      "Mewakili populasi",
      "Hanya yang pandai",
      "Dipilih suka-suka"
    ],
    "answer": 1,
    "why": "Sampel harus mewakili populasi supaya kesimpulan dari sampel berlaku untuk populasi."
  },
  {
    "q": "Dari 30 siswa, 12 siswa suka sepak bola. Persentase siswa yang suka sepak bola adalah …",
    "options": [
      "30%",
      "25%",
      "35%",
      "40%"
    ],
    "answer": 3,
    "why": "12 ÷ 30 × 100% = 40%."
  }
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
      msg.textContent = qScore === 10 ? 'Sempurna! Kamu menguasai Investigasi Data.'
        : qScore >= 8 ? 'Hebat! Tinggal sedikit lagi menuju sempurna.'
        : qScore >= 6 ? 'Bagus! Ulangi bagian yang masih salah, lalu coba lagi.'
        : 'Terus berlatih! Buka lagi sub-bab awal, lalu ulangi kuisnya.';
    }
    var prevBest = read('mpi-d1-quiz-best', null);
    var prevNum = prevBest === null ? -1 : Number(prevBest);
    if (qScore > prevNum) store('mpi-d1-quiz-best', String(qScore));
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
    try { saved = JSON.parse(read('mpi-d1-refleksi', 'null')); } catch (e) { saved = null; }
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
      store('mpi-d1-refleksi', JSON.stringify(data));
      var st = $('refStatus');
      if (st) st.textContent = 'Refleksi tersimpan di perangkat ini pada ' + new Date().toLocaleString('id-ID') + '.';
      markVisited('sub6');
    });
  }
})();
