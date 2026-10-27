# MPI Matematika SMP

Media Pembelajaran Interaktif (MPI) untuk Matematika SMP Kelas 7, 8, dan 9 —
Kurikulum Merdeka, Fase D, pendekatan Pembelajaran Mendalam (memahami,
mengaplikasi, merefleksi).

Disusun berdasarkan ATP Matematika Fase D MGMP Matematika SMP Kabupaten
Lampung Tengah, Tahun Pelajaran 2026/2027: **29 TP** (B.1–B.7, A.1–A.7,
P.1–P.3, G.1–G.6, D.1–D.6) ditambah **1 modul khusus Aritmetika Sosial**,
total **30 modul**.

Palet visual: **Biru Samudra** — utama `#2563EB`, gelap `#1E3A8A`, lembut
`#DBEAFE`, aksen amber `#F59E0B`, latar `#F8FAFF`, teks `#0F172A`.
Aksen per kelas: Kelas 7 biru, Kelas 8 ungu `#6D28D9`, Kelas 9 amber/oranye.

## Struktur repo (multi-page, bukan single-page)

Satu TP = satu halaman sendiri, supaya guru bisa membagikan tautan langsung
ke satu materi dan tiap modul bisa dirawat tanpa mengganggu modul lain.

```
MPI/
├── index.html                  # Hub utama: pilih kelas, cari/filter 30 modul
├── README.md                   # File ini
├── assets/
│   ├── css/main.css            # CSS bersama (mobile-first, responsif)
│   └── js/main.js              # JS bersama (menu HP, filter, progres)
├── kelas-7/
│   ├── index.html              # Daftar 11 modul Kelas 7
│   ├── b1-bilangan-bulat/      # Modul aktif (prototipe / template)
│   │   ├── index.html
│   │   ├── script.js
│   │   └── style.css
│   └── b4-perbandingan/        # Placeholder status migrasi
│       └── index.html
├── kelas-8/
│   └── index.html              # Daftar 11 modul Kelas 8 (Segera)
└── kelas-9/
    └── index.html              # Daftar 8 modul Kelas 9 (Segera)
```

Di dalam satu modul, 6 sub-babnya tetap dalam satu halaman modul dengan
navigasi sub-bab dan progress bar, supaya progres dan skor kuisnya nyambung.
Yang dipisah per halaman adalah antar TP, bukan antar sub-bab.

### Daftar modul

**Kelas 7 (11):** B.1 Bilangan Bulat *(aktif)*, B.2 Bilangan Bulat dalam
Kehidupan Sehari-hari, B.3 Bilangan Rasional, Aritmetika Sosial, B.4
Perbandingan *(sudah ada — migrasi)*, A.1 Bentuk Aljabar, G.1 Garis dan
Sudut, G.2 Kesebangunan, G.3 Kekongruenan, D.1 Investigasi Data, D.2
Diagram Batang dan Lingkaran.

**Kelas 8 (11):** B.5 Bilangan Berpangkat, B.6 Bentuk Akar, B.7 Bentuk Baku,
G.4 Teorema Pythagoras, A.2 Persamaan Linear Satu Variabel, A.3
Pertidaksamaan Linear Satu Variabel, A.4 Pola Bilangan, A.5 Relasi dan
Fungsi, A.6 Persamaan Garis Lurus, D.3 Sampel dan Populasi, D.4 Ukuran
Pemusatan Data.

**Kelas 9 (8):** A.7 Sistem Persamaan Linear Dua Variabel, G.5
Jaring-jaring Bangun Ruang, P.1 Bangun Ruang Sisi Datar, P.2 Lingkaran,
P.3 Bangun Ruang Sisi Lengkung, G.6 Transformasi Geometri, D.5 Ruang
Sampel dan Peluang, D.6 Frekuensi Relatif dan Frekuensi Harapan.

## Cara menjalankan secara lokal

Tidak ada build step dan tidak ada dependensi yang wajib diinstal
(Google Fonts dimuat dari internet; tanpa internet, huruf sistem dipakai).

```bash
# Cara 1: buka langsung
# Klik dua kali index.html di penjelajah berkas.

# Cara 2 (disarankan): server lokal, dari dalam folder MPI/
python3 -m http.server 8000
# lalu buka http://localhost:8000 di peramban
```

## Deploy ke GitHub Pages

1. Isi repo ini adalah isi repo `https://github.com/holizon-sendang/MPI.git`.
2. Di GitHub: **Settings → Pages → Build and deployment → Source:
   Deploy from a branch**, pilih branch utama dan folder **/(root)**.
3. Simpan. Situs terbit di `https://holizon-sendang.github.io/MPI/`
   (nama persisnya mengikuti pengaturan repo).
4. Setiap push ke branch utama akan menerbitkan ulang otomatis.

## Responsif

Mobile-first, tanpa lebar tetap yang memaksa overflow:

| Perangkat | Lebar | Tata letak |
|---|---|---|
| HP kecil | ≤ 480px | 1 kolom, menu lipat, tombol/input min 44px |
| HP / tablet kecil | 481–767px | 2 kolom kartu |
| Tablet | 768–1023px | 2 kolom, menu atas penuh |
| Laptop | 1024–1439px | 3 kolom, lebar konten maks 1120px |
| PID / layar besar | ≥ 1440px | Lebar maks 1360px, huruf membesar, target sentuh min 52px |

Gunakan `clamp()` untuk ukuran huruf dan grid `auto-fit/minmax` untuk kartu.
Periksa di lebar 360px: tidak boleh ada geser horizontal pada body.

## Cara menambah modul baru

1. Duplikat folder `kelas-7/b1-bilangan-bulat/` ke lokasi baru, misalnya
   `kelas-8/g4-teorema-pythagoras/`.
2. Di `index.html` baru: ubah judul, kode TP, kelas, alokasi JP, dan TP
   lengkapnya. Perbarui path relatif CSS/JS (`../../assets/...` dari
   kedalaman yang sama, `../assets/...` bila foldernya satu tingkat).
3. Di `script.js` baru: ganti kunci localStorage `mpi-b1-*` menjadi kunci
   modul itu (misalnya `mpi-g4-*`), dan ganti soal, kunci jawaban, serta
   penjelasannya. **Periksa manual setiap kunci jawaban sebelum selesai.**
4. `style.css` hanya berisi gaya khusus modul itu; jangan duplikat
   `assets/css/main.css`.
5. Daftarkan modul di `kelas-X/index.html` dan di daftar modul pada
   `index.html` (hub): ubah status dari Segera menjadi Aktif dan arahkan
   tautannya ke folder modul baru.
6. Ikuti template B.1: header TP → navigasi 6 sub-bab → eksplorasi →
   latihan bertingkat → kuis 10 soal → refleksi → rangkuman.

## Privasi

Progres sub-bab, skor kuis terbaik, dan jawaban refleksi tersimpan di
`localStorage` peramban pengguna (kunci `mpi-b1-*` dan seterusnya) dan
tidak dikirim ke mana pun. Tidak ada akun, tidak ada pelacakan.
