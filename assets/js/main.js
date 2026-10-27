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
})();
