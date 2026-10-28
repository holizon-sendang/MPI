/* G.3 Kekongruenan — script.js
   Vanilla JS, tanpa framework. Semua jawaban matematika diperiksa manual.
   localStorage: mpi-g3-visited (sub-bab yang dibuka),
   mpi-g3-quiz-best (skor kuis terbaik), mpi-g3-refleksi (refleksi). */
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
  try { visited = JSON.parse(read('mpi-g3-visited', '[]')) || []; } catch (e) { visited = []; }
  if (!Array.isArray(visited)) visited = [];

  function saveVisited() { store('mpi-g3-visited', JSON.stringify(visited)); }
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
  var bestStored = read('mpi-g3-quiz-best', null);
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


  /* ---------- Sub-bab 1: pemilih pasangan bangun ---------- */
  var PASANGAN = {
    'p1': { judul: 'Pasangan 1: dua segitiga 3-4-5', ok: true, ket: 'KONGRUEN. Ketiga sisinya sama (3 cm, 4 cm, 5 cm) — bentuk dan ukurannya sama persis, jadi bisa ditumpuk tepat.' },
    'p2': { judul: 'Pasangan 2: persegi 4×4 dan persegi 5×5', ok: false, ket: 'TIDAK kongruen — hanya sebangun. Bentuknya sama (persegi) dan sudutnya sama, tapi ukurannya berbeda, jadi tidak bisa ditumpuk tepat.' },
    'p3': { judul: 'Pasangan 3: segitiga 3-4-5 dan segitiga 3-4-6', ok: false, ket: 'TIDAK kongruen. Dua sisinya sama (3 dan 4) tapi sisi ketiganya berbeda (5 lawan 6), jadi bentuknya tidak sama persis.' }
  };
  document.querySelectorAll('[data-pair]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var info = PASANGAN[btn.getAttribute('data-pair')];
      document.querySelectorAll('[data-pair]').forEach(function (b) {
        b.classList.remove('btn-primary'); b.classList.add('btn-ghost');
      });
      btn.classList.remove('btn-ghost'); btn.classList.add('btn-primary');
      var judul = $('kgJudul'), fb = $('kgFb');
      if (judul) judul.textContent = info.judul;
      showFb(fb, info.ok, info.ket);
    });
  });

  /* ---------- Sub-bab 3: pemeta sisi & sudut bersesuaian ---------- */
  var PETA = {
    'AB': 'AB bersesuaian dengan DE. Karena AB = 5 cm, maka DE = 5 cm.',
    'BC': 'BC bersesuaian dengan EF. Karena BC = 7 cm, maka EF = 7 cm.',
    'CA': 'CA bersesuaian dengan FD. Karena CA = 6 cm, maka FD = 6 cm.',
    'A': 'Sudut A bersesuaian dengan sudut D. Karena sudut A = 50°, maka sudut D = 50°.',
    'B': 'Sudut B bersesuaian dengan sudut E. Karena sudut B = 60°, maka sudut E = 60°.',
    'C': 'Sudut C bersesuaian dengan sudut F. Karena sudut C = 70°, maka sudut F = 70°.'
  };
  var pmBtn = $('pmBtn');
  if (pmBtn) {
    pmBtn.addEventListener('click', function () {
      var pilih = $('pmPilih') ? $('pmPilih').value : 'AB';
      var hasil = $('pmHasil'), langkah = $('pmLangkah');
      if (hasil) hasil.textContent = PETA[pilih];
      if (langkah) langkah.textContent = 'Segitiga ABC kongruen dengan DEF, jadi semua sisi dan sudut yang bersesuaian sama besar. Urutan hurufnya menunjukkan pasangannya: A↔D, B↔E, C↔F.';
    });
  }


  /* ---------- Sub-bab 6: kuis 10 soal ---------- */
  /* Kunci sudah diperiksa manual (keseimbangan A2/B3/C2/D3):
     1) 5 cm (idx 1)
     2) Tiga sisi bersesuaian sama (idx 1)
     3) 3 cm, 4 cm, 5 cm (idx 3)
     4) Sama besar (idx 1)
     5) Dua lingkaran berjari-jari sama (idx 3)
     6) Bentuk sama, ukuran sama (idx 0)
     7) Dua sisi dan sudut apitnya (idx 0)
     8) 50° (idx 2)
     9) Sama (idx 2)
     10) 8 cm (idx 3) */
  var QUIZ = [
  {
    "q": "Segitiga ABC kongruen dengan DEF. AB = 5 cm. Panjang sisi yang bersesuaian dengan AB adalah …",
    "options": [
      "3 cm",
      "5 cm",
      "7 cm",
      "10 cm"
    ],
    "answer": 1,
    "why": "Sisi yang bersesuaian dengan AB adalah DE, dan karena kongruen, DE = AB = 5 cm."
  },
  {
    "q": "Syarat SSS pada dua segitiga artinya …",
    "options": [
      "Dua sudut sama",
      "Tiga sisi bersesuaian sama",
      "Dua sisi dan satu sudut",
      "Tiga sudut sama"
    ],
    "answer": 1,
    "why": "SSS = Sisi-Sisi-Sisi: ketiga sisi yang bersesuaian sama panjang."
  },
  {
    "q": "Segitiga dengan sisi 3 cm, 4 cm, 5 cm kongruen dengan segitiga bersisi …",
    "options": [
      "3 cm, 4 cm, 6 cm",
      "5 cm, 5 cm, 5 cm",
      "3 cm, 5 cm, 6 cm",
      "3 cm, 4 cm, 5 cm"
    ],
    "answer": 3,
    "why": "Syarat SSS: ketiga sisinya harus sama persis, yaitu 3 cm, 4 cm, 5 cm."
  },
  {
    "q": "Sudut-sudut yang bersesuaian pada dua segitiga yang kongruen adalah …",
    "options": [
      "Berbeda",
      "Sama besar",
      "Berpelurus",
      "Berpenyiku"
    ],
    "answer": 1,
    "why": "Pada bangun kongruen, semua sudut yang bersesuaian sama besar."
  },
  {
    "q": "Pasangan bangun berikut yang PASTI kongruen adalah …",
    "options": [
      "Dua persegi panjang sembarang",
      "Dua segitiga sama kaki",
      "Dua trapesium",
      "Dua lingkaran berjari-jari sama"
    ],
    "answer": 3,
    "why": "Lingkaran ditentukan sepenuhnya oleh jari-jarinya. Dua lingkaran berjari-jari sama pasti kongruen."
  },
  {
    "q": "Dua bangun kongruen berarti …",
    "options": [
      "Bentuk sama, ukuran sama",
      "Bentuk sama, ukuran beda",
      "Bentuk beda, ukuran sama",
      "Tidak ada yang sama"
    ],
    "answer": 0,
    "why": "Kongruen berarti bentuk dan ukuran sama persis."
  },
  {
    "q": "Syarat SAS membutuhkan …",
    "options": [
      "Dua sisi dan sudut apitnya",
      "Tiga sudut",
      "Tiga sisi",
      "Dua sudut dan satu sisi"
    ],
    "answer": 0,
    "why": "SAS = Sisi-Sudut-Sisi: dua sisi sama panjang dan sudut yang diapit kedua sisi itu sama besar."
  },
  {
    "q": "Segitiga ABC kongruen dengan DEF. Sudut A = 50°. Besar sudut D adalah …",
    "options": [
      "40°",
      "130°",
      "50°",
      "90°"
    ],
    "answer": 2,
    "why": "Sudut A bersesuaian dengan sudut D, jadi sudut D = 50°."
  },
  {
    "q": "Jika dua segitiga kongruen, keliling keduanya …",
    "options": [
      "Berbeda",
      "Yang satu dua kali yang lain",
      "Sama",
      "Tidak bisa ditentukan"
    ],
    "answer": 2,
    "why": "Segitiga kongruen punya semua sisi sama, jadi kelilingnya juga sama."
  },
  {
    "q": "Sisi AB bersesuaian dengan DE pada dua segitiga kongruen. Jika AB = 8 cm, DE = …",
    "options": [
      "4 cm",
      "16 cm",
      "2 cm",
      "8 cm"
    ],
    "answer": 3,
    "why": "Sisi yang bersesuaian pada segitiga kongruen sama panjang: DE = 8 cm."
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
      msg.textContent = qScore === 10 ? 'Sempurna! Kamu menguasai Kekongruenan.'
        : qScore >= 8 ? 'Hebat! Tinggal sedikit lagi menuju sempurna.'
        : qScore >= 6 ? 'Bagus! Ulangi bagian yang masih salah, lalu coba lagi.'
        : 'Terus berlatih! Buka lagi sub-bab awal, lalu ulangi kuisnya.';
    }
    var prevBest = read('mpi-g3-quiz-best', null);
    var prevNum = prevBest === null ? -1 : Number(prevBest);
    if (qScore > prevNum) store('mpi-g3-quiz-best', String(qScore));
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
    try { saved = JSON.parse(read('mpi-g3-refleksi', 'null')); } catch (e) { saved = null; }
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
      store('mpi-g3-refleksi', JSON.stringify(data));
      var st = $('refStatus');
      if (st) st.textContent = 'Refleksi tersimpan di perangkat ini pada ' + new Date().toLocaleString('id-ID') + '.';
      markVisited('sub6');
    });
  }
})();
