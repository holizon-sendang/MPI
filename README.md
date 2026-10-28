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
│   ├── b2-bilangan-bulat-sehari-hari/  # Modul aktif
│   │   ├── index.html
│   │   ├── script.js
│   │   └── style.css
│   ├── b3-bilangan-rasional/   # Modul aktif
│   │   ├── index.html
│   │   ├── script.js
│   │   └── style.css
│   ├── aritmetika-sosial/      # Modul aktif (khusus)
│   │   ├── index.html
│   │   ├── script.js
│   │   └── style.css
│   ├── b4-perbandingan/        # Modul aktif
│   │   ├── index.html
│   │   ├── script.js
│   │   └── style.css
│   ├── a1-bentuk-aljabar/      # Modul aktif
│   │   ├── index.html
│   │   ├── script.js
│   │   └── style.css
│   ├── g1-garis-dan-sudut/     # Modul aktif
│   │   ├── index.html
│   │   ├── script.js
│   │   └── style.css
│   ├── g2-kesebangunan/        # Modul aktif
│   │   ├── index.html
│   │   ├── script.js
│   │   └── style.css
│   ├── g3-kekongruenan/        # Modul aktif
│   │   ├── index.html
│   │   ├── script.js
│   │   └── style.css
│   ├── d1-investigasi-data/    # Modul aktif
│   │   ├── index.html
│   │   ├── script.js
│   │   └── style.css
│   └── d2-diagram-batang-dan-lingkaran/  # Modul aktif
│       ├── index.html
│       ├── script.js
│       └── style.css
├── kelas-8/
│   ├── index.html              # Daftar 11 modul Kelas 8 (semua aktif)
│   ├── b5-bilangan-berpangkat/ # Modul aktif
│   ├── b6-bentuk-akar/         # Modul aktif
│   ├── b7-bentuk-baku/         # Modul aktif
│   ├── g4-teorema-pythagoras/  # Modul aktif
│   ├── a2-persamaan-linear-satu-variabel/  # Modul aktif
│   ├── a3-pertidaksamaan-linear-satu-variabel/  # Modul aktif
│   ├── a4-pola-bilangan/       # Modul aktif
│   ├── a5-relasi-dan-fungsi/   # Modul aktif
│   ├── a6-persamaan-garis-lurus/  # Modul aktif
│   ├── d3-sampel-dan-populasi/ # Modul aktif
│   └── d4-ukuran-pemusatan-data/  # Modul aktif
│       (tiap folder modul berisi index.html, script.js, style.css)
└── kelas-9/
    ├── index.html              # Daftar 8 modul Kelas 9 (semua aktif)
    ├── a7-sistem-persamaan-linear-dua-variabel/  # Modul aktif
    ├── g5-jaring-jaring-bangun-ruang/  # Modul aktif
    ├── p1-bangun-ruang-sisi-datar/  # Modul aktif
    ├── p2-lingkaran/           # Modul aktif
    ├── p3-bangun-ruang-sisi-lengkung/  # Modul aktif
    ├── g6-transformasi-geometri/  # Modul aktif
    ├── d5-ruang-sampel-dan-peluang/  # Modul aktif
    └── d6-frekuensi-relatif-dan-frekuensi-harapan/  # Modul aktif
        (tiap folder modul berisi index.html, script.js, style.css)
```

Di dalam satu modul, 6 sub-babnya tetap dalam satu halaman modul dengan
navigasi sub-bab dan progress bar, supaya progres dan skor kuisnya nyambung.
Yang dipisah per halaman adalah antar TP, bukan antar sub-bab.

### Daftar modul

**Semua 30 modul sudah aktif** (per 28 Okt 2026). Total 98 file:
30 folder modul × 3 file + hub + 3 halaman kelas + CSS/JS bersama + README.

**Kelas 7 (11):** B.1 Bilangan Bulat *(10 JP)*, B.2 Bilangan Bulat dalam
Kehidupan Sehari-hari *(14 JP)*, B.3 Bilangan Rasional *(22 JP)*,
Aritmetika Sosial *(12 JP, modul khusus)*, B.4 Perbandingan *(14 JP)*,
A.1 Bentuk Aljabar *(18 JP)*, G.1 Garis dan Sudut *(8 JP)*, G.2
Kesebangunan *(6 JP)*, G.3 Kekongruenan *(6 JP)*, D.1 Investigasi Data
*(8 JP)*, D.2 Diagram Batang dan Lingkaran *(8 JP)*.

**Kelas 8 (11):** B.5 Bilangan Berpangkat *(10 JP)*, B.6 Bentuk Akar
*(8 JP)*, B.7 Bentuk Baku *(6 JP)*, G.4 Teorema Pythagoras *(20 JP)*,
A.2 Persamaan Linear Satu Variabel *(10 JP)*, A.3 Pertidaksamaan Linear
Satu Variabel *(10 JP)*, A.4 Pola Bilangan *(10 JP)*, A.5 Relasi dan
Fungsi *(14 JP)*, A.6 Persamaan Garis Lurus *(18 JP)*, D.3 Sampel dan
Populasi *(4 JP)*, D.4 Ukuran Pemusatan Data *(8 JP)*.

**Kelas 9 (8):** A.7 Sistem Persamaan Linear Dua Variabel *(18 JP)*,
G.5 Jaring-jaring Bangun Ruang *(6 JP)*, P.1 Bangun Ruang Sisi Datar
*(12 JP)*, P.2 Lingkaran *(10 JP)*, P.3 Bangun Ruang Sisi Lengkung
*(18 JP)*, G.6 Transformasi Geometri *(18 JP)*, D.5 Ruang Sampel dan
Peluang *(8 JP)*, D.6 Frekuensi Relatif dan Frekuensi Harapan *(8 JP)*.

Catatan alokasi JP: JP diambil dari **tabel TP** ATP. Tabel distribusi
ATP tidak selalu cocok dengan tabel TP:
- B.2: tabel TP 14 JP vs distribusi Bilangan Bulat B.1+B.2 = 18 JP
  (padahal 10 + 14 = 24).
- B.3: tabel TP 22 JP vs distribusi Bilangan Rasional = 16 JP.
- Aritmetika Sosial tidak punya baris TP sendiri; 12 JP diambil dari
  tabel distribusi ("Aritmetika Sosial B.2, B.3 = 12 JP").
- D.5 + D.6: tabel TP 8 + 8 = 16 JP; tabel distribusi menulis Peluang
  = 16 JP pada satu baris (D.5).
- Selebihnya cocok: G.1+G.2+G.3 = 20 JP, D.1+D.2 = 16 JP,
  B.5+B.6+B.7 = 24 JP, A.2+A.3 = 20 JP, D.3+D.4 = 12 JP,
  G.5+P.1 = 18 JP.

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
