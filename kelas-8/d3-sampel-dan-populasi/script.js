/* D.3 Sampel dan Populasi — script.js
   Vanilla JS, tanpa framework.
   localStorage: mpi-d3-visited, mpi-d3-quiz-best, mpi-d3-refleksi. */
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
  try { visited = JSON.parse(read('mpi-d3-visited', '[]')) || []; } catch (e) { visited = []; }
  if (!Array.isArray(visited)) visited = [];
  function saveVisited() { store('mpi-d3-visited', JSON.stringify(visited)); }
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
  var bestStored = read('mpi-d3-quiz-best', null);
  var bestEl = $('quizBestText');
  if (bestStored !== null && bestEl) {
    bestEl.textContent = 'Skor terbaik kuis: ' + bestStored + '/10';
    bestEl.hidden = false;
  }


  /* ---------- Simulator sampling ---------- */
  var POP = [72, 85, 68, 90, 77, 82, 65, 88, 74, 80, 69, 92, 76, 84, 71, 79, 86, 63, 81, 75, 89, 70, 83, 67, 91, 78, 73, 87, 66, 94];
  var popMean = POP.reduce(function (s, v) { return s + v; }, 0) / POP.length;
  var ssBtn = $('ssBtn');
  function renderSample() {
    var n = Number($('ssN') ? $('ssN').value : 5);
    var lbl = $('ssNVal'); if (lbl) lbl.textContent = String(n);
    var idx = POP.map(function (v, i) { return i; });
    for (var i = idx.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = idx[i]; idx[i] = idx[j]; idx[j] = t;
    }
    var sample = idx.slice(0, n).map(function (i) { return POP[i]; });
    var mean = sample.reduce(function (s, v) { return s + v; }, 0) / sample.length;
    var hasil = $('ssHasil');
    if (hasil) hasil.textContent = 'Rata-rata sampel (' + n + ' siswa) = ' + mean.toFixed(1);
    var ket = $('ssKet');
    if (ket) {
      ket.textContent = 'Sampel: ' + sample.join(', ') + '. Rata-rata populasi (30 siswa) = ' + popMean.toFixed(1) + '. Selisihnya ' + Math.abs(mean - popMean).toFixed(1) + ' poin. Coba ulangi beberapa kali — makin besar sampel, rata-rata sampel makin dekat ke rata-rata populasi!';
    }
  }
  if (ssBtn) ssBtn.addEventListener('click', renderSample);
  renderSample();

  /* ---------- Pencocok teknik sampling ---------- */
  var smBtn = $('smBtn');
  function renderMatch() {
    var v = $('smSel') ? $('smSel').value : 's1';
    var hasil = $('smHasil'), ket = $('smKet');
    var data = {
      s1: { t: 'Teknik: Acak Sederhana', k: 'Setiap anggota populasi punya peluang yang sama untuk terpilih, misalnya dengan undian. Cocok bila populasi homogen.' },
      s2: { t: 'Teknik: Stratifikasi (Berstrata)', k: 'Populasi dibagi kelompok (strata) dulu — misalnya per kelas — lalu diambil sampel acak dari tiap strata. Cocok bila populasi beragam.' },
      s3: { t: 'Teknik: Sistematis', k: 'Anggota dipilih dengan interval tetap, misalnya setiap siswa ke-10 dari daftar absen. Praktis dan rapi.' },
      s4: { t: 'Teknik: Klaster (Gugus)', k: 'Populasi dibagi gugus (misalnya kelas), lalu beberapa gugus dipilih utuh dan semua anggotanya diteliti.' },
      s5: { t: 'Teknik: Purposive (Bertujuan)', k: 'Sampel dipilih sengaja berdasarkan kriteria tertentu, misalnya hanya siswa yang aktif OSIS. Tidak acak, jadi tidak bisa digeneralisasi.' }
    };
    var d = data[v];
    if (hasil) hasil.textContent = d.t;
    if (ket) ket.textContent = d.k;
  }
  if (smBtn) smBtn.addEventListener('click', renderMatch);
  renderMatch();

  /* ---------- Perancang survei ---------- */
  var spBtn = $('spBtn');
  function renderPlan() {
    var tujuan = $('spTujuan') ? $('spTujuan').value : 'Makanan favorit siswa';
    var pop = $('spPop') ? $('spPop').value : 'Seluruh siswa kelas 8';
    var tek = $('spTeknik') ? $('spTeknik').value : 'Acak sederhana';
    var hasil = $('spHasil');
    if (hasil) hasil.textContent = 'Rencana survei: meneliti "' + tujuan + '". Populasi: ' + pop + '. Teknik sampling: ' + tek + '.';
    var ket = $('spKet');
    if (ket) ket.textContent = 'Langkah selanjutnya: tentukan ukuran sampel, buat kuesioner yang jelas, kumpulkan data, lalu simpulkan untuk populasi — bukan hanya untuk sampel.';
  }
  if (spBtn) spBtn.addEventListener('click', renderPlan);
  renderPlan();


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
    "q": "Populasi adalah …",
    "options": [
      "Seluruh objek yang diteliti",
      "Sebagian objek",
      "Sampel acak",
      "Data hasil survei"
    ],
    "answer": 0,
    "why": "Populasi mencakup seluruh objek yang menjadi sasaran penelitian."
  },
  {
    "q": "Sampel yang baik harus …",
    "options": [
      "Sebesar populasi",
      "Mewakili populasi",
      "Dipilih yang pandai saja",
      "Sebanyak mungkin tanpa batas"
    ],
    "answer": 1,
    "why": "Sampel harus mewakili populasi agar kesimpulannya dapat dipercaya."
  },
  {
    "q": "Mengambil 30 dari 300 siswa secara undian termasuk teknik …",
    "options": [
      "Stratifikasi",
      "Sistematis",
      "Acak sederhana",
      "Purposive"
    ],
    "answer": 2,
    "why": "Undian memberi peluang sama: acak sederhana."
  },
  {
    "q": "Setiap anggota populasi ke-5 dipilih sebagai sampel. Tekniknya …",
    "options": [
      "Acak",
      "Klaster",
      "Purposive",
      "Sistematis"
    ],
    "answer": 3,
    "why": "Interval tetap (tiap ke-5): sistematis."
  },
  {
    "q": "Membagi populasi per kelas lalu mengambil sampel acak dari tiap kelas disebut …",
    "options": [
      "Sistematis",
      "Stratifikasi",
      "Klaster",
      "Acak"
    ],
    "answer": 1,
    "why": "Dibagi strata dulu, lalu acak tiap strata: stratifikasi."
  },
  {
    "q": "Memilih seluruh siswa dari 3 kelas yang terpilih disebut teknik …",
    "options": [
      "Klaster",
      "Stratifikasi",
      "Sistematis",
      "Purposive"
    ],
    "answer": 0,
    "why": "Gugus (kelas) dipilih utuh: klaster."
  },
  {
    "q": "Peneliti memilih siswa yang aktif OSIS saja sebagai sampel. Tekniknya …",
    "options": [
      "Acak",
      "Purposive",
      "Sistematis",
      "Klaster"
    ],
    "answer": 1,
    "why": "Dipilih sengaja berdasarkan kriteria: purposive."
  },
  {
    "q": "Tujuan utama mengambil sampel adalah …",
    "options": [
      "Menggantikan populasi",
      "Menghemat waktu saja",
      "Menarik kesimpulan tentang populasi",
      "Menghindari survei"
    ],
    "answer": 2,
    "why": "Sampel dipakai untuk menduga keadaan populasi tanpa meneliti semuanya."
  },
  {
    "q": "Penelitian \"warna favorit siswa kelas 8A\". Populasinya adalah …",
    "options": [
      "Siswa kelas 8A yang disurvei",
      "Semua siswa di sekolah",
      "Guru kelas 8A",
      "Seluruh siswa kelas 8A"
    ],
    "answer": 3,
    "why": "Populasinya seluruh siswa kelas 8A, bukan hanya yang disurvei."
  },
  {
    "q": "Sampel yang terlalu kecil berakibat …",
    "options": [
      "Hasil pasti benar",
      "Biaya naik",
      "Data lebih lengkap",
      "Kesimpulan kurang dapat dipercaya"
    ],
    "answer": 3,
    "why": "Sampel kecil kurang mewakili populasi, jadi kesimpulannya kurang dapat dipercaya."
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
    var prevBest = read('mpi-d3-quiz-best', null);
    var prevNum = prevBest === null ? -1 : Number(prevBest);
    if (qScore > prevNum) store('mpi-d3-quiz-best', String(qScore));
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
    try { saved = JSON.parse(read('mpi-d3-refleksi', 'null')); } catch (e) { saved = null; }
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
      store('mpi-d3-refleksi', JSON.stringify(data));
      var st = $('refStatus');
      if (st) st.textContent = 'Refleksi tersimpan di perangkat ini pada ' + new Date().toLocaleString('id-ID') + '.';
      markVisited('sub6');
    });
  }
})();
