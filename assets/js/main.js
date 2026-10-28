/* MPI Matematika SMP — main.js (shared)
   Menu mobile, filter modul di hub, progres sederhana via localStorage, tahun.
   Tanpa framework, tanpa dependensi. */
(function () {
  'use strict';

  /* Tahun di footer */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* Menu mobile: tombol hamburger membuka/menutup .navlinks */
  var toggle = document.querySelector('[data-nav-toggle]');
  var links = document.querySelector('[data-nav-links]');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.textContent = open ? '✕' : '☰';
    });
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.textContent = '☰';
      });
    });
  }

  /* Filter modul di hub: ketik untuk menyaring kartu [data-modul] */
  var filter = document.querySelector('[data-filter-modul]');
  if (filter) {
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-modul]'));
    var count = document.querySelector('[data-filter-count]');
    var empty = document.querySelector('[data-filter-empty]');
    filter.addEventListener('input', function () {
      var q = filter.value.trim().toLowerCase();
      var shown = 0;
      cards.forEach(function (card) {
        var hay = (card.getAttribute('data-modul') + ' ' + card.textContent).toLowerCase();
        var match = !q || hay.indexOf(q) !== -1;
        card.style.display = match ? '' : 'none';
        if (match) shown++;
      });
      if (count) count.textContent = shown + ' modul ditampilkan';
      if (empty) empty.style.display = shown === 0 ? 'block' : 'none';
    });
  }

  /* Progres sederhana: tampilkan skor terbaik B.1 bila ada di localStorage */
  try {
    var best = localStorage.getItem('mpi-b1-quiz-best');
    document.querySelectorAll('[data-b1-best]').forEach(function (el) {
      if (best !== null) {
        el.textContent = 'Skor terbaik kuis B.1: ' + best + '/10';
        el.style.display = '';
      }
    });
    var visited = JSON.parse(localStorage.getItem('mpi-b1-visited') || '[]');
    document.querySelectorAll('[data-b1-progress]').forEach(function (el) {
      var pct = Math.round((visited.length / 6) * 100);
      el.textContent = visited.length === 0
        ? 'Belum mulai'
        : 'Progres B.1: ' + visited.length + ' dari 6 sub-bab (' + pct + '%)';
      el.style.display = '';
    });
  } catch (e) { /* localStorage tidak tersedia: abaikan, halaman tetap jalan */ }

  /* Progres sederhana: tampilkan skor terbaik B.2 bila ada di localStorage */
  try {
    var best2 = localStorage.getItem('mpi-b2-quiz-best');
    document.querySelectorAll('[data-b2-best]').forEach(function (el) {
      if (best2 !== null) {
        el.textContent = 'Skor terbaik kuis B.2: ' + best2 + '/10';
        el.style.display = '';
      }
    });
    var visited2 = JSON.parse(localStorage.getItem('mpi-b2-visited') || '[]');
    document.querySelectorAll('[data-b2-progress]').forEach(function (el) {
      var pct2 = Math.round((visited2.length / 6) * 100);
      el.textContent = visited2.length === 0
        ? 'B.2: Belum mulai'
        : 'Progres B.2: ' + visited2.length + ' dari 6 sub-bab (' + pct2 + '%)';
      el.style.display = '';
    });
  } catch (e) { /* localStorage tidak tersedia: abaikan, halaman tetap jalan */ }

  /* Progres sederhana: tampilkan skor terbaik B.3 bila ada di localStorage */
  try {
    var best3 = localStorage.getItem('mpi-b3-quiz-best');
    document.querySelectorAll('[data-b3-best]').forEach(function (el) {
      if (best3 !== null) {
        el.textContent = 'Skor terbaik kuis B.3: ' + best3 + '/10';
        el.style.display = '';
      }
    });
    var visited3 = JSON.parse(localStorage.getItem('mpi-b3-visited') || '[]');
    document.querySelectorAll('[data-b3-progress]').forEach(function (el) {
      var pct3 = Math.round((visited3.length / 6) * 100);
      el.textContent = visited3.length === 0
        ? 'B.3: Belum mulai'
        : 'Progres B.3: ' + visited3.length + ' dari 6 sub-bab (' + pct3 + '%)';
      el.style.display = '';
    });
  } catch (e) { /* localStorage tidak tersedia: abaikan, halaman tetap jalan */ }

  /* Progres modul lain (27 modul): satu pola untuk semuanya */
  var MODUL_LAIN = [
    { key: 'arithsos', label: 'Aritmetika Sosial' },
    { key: 'b4', label: 'B.4' },
    { key: 'a1', label: 'A.1' },
    { key: 'g1', label: 'G.1' },
    { key: 'g2', label: 'G.2' },
    { key: 'g3', label: 'G.3' },
    { key: 'd1', label: 'D.1' },
    { key: 'd2', label: 'D.2' },
    { key: 'b5', label: 'B.5' },
    { key: 'b6', label: 'B.6' },
    { key: 'b7', label: 'B.7' },
    { key: 'g4', label: 'G.4' },
    { key: 'a2', label: 'A.2' },
    { key: 'a3', label: 'A.3' },
    { key: 'a4', label: 'A.4' },
    { key: 'a5', label: 'A.5' },
    { key: 'a6', label: 'A.6' },
    { key: 'd3', label: 'D.3' },
    { key: 'd4', label: 'D.4' },
    { key: 'a7', label: 'A.7' },
    { key: 'g5', label: 'G.5' },
    { key: 'p1', label: 'P.1' },
    { key: 'p2', label: 'P.2' },
    { key: 'p3', label: 'P.3' },
    { key: 'g6', label: 'G.6' },
    { key: 'd5', label: 'D.5' },
    { key: 'd6', label: 'D.6' }
  ];
  MODUL_LAIN.forEach(function (m) {
    try {
      var bestM = localStorage.getItem('mpi-' + m.key + '-quiz-best');
      document.querySelectorAll('[data-' + m.key + '-best]').forEach(function (el) {
        if (bestM !== null) {
          el.textContent = 'Skor terbaik kuis ' + m.label + ': ' + bestM + '/10';
          el.style.display = '';
        }
      });
      var visitedM = JSON.parse(localStorage.getItem('mpi-' + m.key + '-visited') || '[]');
      document.querySelectorAll('[data-' + m.key + '-progress]').forEach(function (el) {
        var pctM = Math.round((visitedM.length / 6) * 100);
        el.textContent = visitedM.length === 0
          ? m.label + ': Belum mulai'
          : 'Progres ' + m.label + ': ' + visitedM.length + ' dari 6 sub-bab (' + pctM + '%)';
        el.style.display = '';
      });
    } catch (e) { /* localStorage tidak tersedia: abaikan, halaman tetap jalan */ }
  });
})();
