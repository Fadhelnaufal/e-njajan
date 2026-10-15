# DESIGN.md — e-njajan (Aplikasi Pemesanan Kantin Sekolah)

## 1. Identity & Personality
- **Product Name**: e-njajan
- **Tagline**: Jajan Praktis, Bebas Antre di Kantin Sekolah
- **Target Audience**: Siswa, Guru, dan Petugas Kantin di Indonesia.
- **Personality**: Ceria, hangat, ramah anak, bersahabat, namun tetap rapi, fungsional, dan efisien untuk operasional jam istirahat sekolah yang padat.
- **Visual Archetype**: Modern Indonesian School Canteen. Menghadirkan kehangatan nuansa kantin sekolah dengan kemudahan pemesanan digital mobile-first.

## 2. Design Dials (Antislop Part 3)
- **ENERGY: 2 (Balanced)**. Ceria dan berkarakter dengan warna oranye hangat dan kuning madu yang menggugah selera jajan, tetapi tetap fokus pada kemudahan memesan dan keterbacaan data.
- **RHYTHM: 2 (Varied)**. Komposisi yang seimbang antara kartu katalog menu yang interaktif, strip status pesanan yang jelas, dan dashboard operasional yang terstruktur rapi.
- **MOTION: 1 (Subtle / Functional)**. Transisi halus pada hover, active feedback saat menambah item keranjang, dan badge animasi ringan pada status pesanan aktif. Tidak ada template bounce/spin yang berlebihan.

## 3. Color Palette
Dibatasi secara ketat pada palet harmonis yang memenuhi standar WCAG AA (kontras > 4.5:1 untuk teks normal):
- **Base Canvas / Background**:
  - Light mode: Warm Cream (`#FFFDF7` dan `#FBF5EB`)
  - Dark mode: Warm Cocoa Espresso (`#1A1614` dan `#241E1A`)
- **Primary / Brand**: Warm Orange (`#E8590C` / `#D9480F`)
  - Alasan: Warna hangat yang menggugah selera makan (appetizing), ramah, dan menjadi titik fokus utama aksi pemesanan.
- **Secondary / Accent**: Sunny Honey Yellow (`#F59F00` / `#D97706`)
  - Alasan: Penanda badge menu populer, kategori aktif, dan aksen visual hangat.
- **Text & Foreground**:
  - Light mode: Deep Charcoal Brown (`#1C1917` dan `#292524`), secondary text (`#57534E`)
  - Dark mode: Warm Cream (`#FAFAF9`), secondary text (`#A8A29E`)
  - Memastikan kontras rasio minimal 7:1 di seluruh layar.
- **Semantic Status Palette**:
  - Menunggu Konfirmasi: Amber Gold (`#D97706` / bg `#FEF3C7`)
  - Sedang Disiapkan: Indigo Sky (`#4F46E5` / bg `#EEF2FF`)
  - Siap Diambil / Diantar: Emerald Green (`#059669` / bg `#D1FAE5`)
  - Selesai: Forest Teal (`#047857` / bg `#ECFDF5`)
  - Dibatalkan: Rose Brick (`#DC2626` / bg `#FEE2E2`)

## 4. Typography
- **Font Family**: Plus Jakarta Sans (`next/font/google`)
  - Alasan pemilihan: Font modern sans-serif yang dirancang di Indonesia, memiliki kurva humanist yang ramah dan bersahabat untuk anak sekolah, serta geometri yang sangat jelas dan mudah dibaca pada layar ponsel kecil.
- **Hierarchy**:
  - Display / Title: Font Bold (700), tracking normal.
  - Section Header: Font SemiBold (600), 18px-20px.
  - Body & Form: Font Regular (400) dan Medium (500), 14px-16px.
  - Price & Numbers: Tabular numerals, Font SemiBold (600), format Rupiah yang konsisten.

## 5. Mobile-First & Tap Targets
- Area sentuh tombol utama minimal 44px x 44px untuk kenyamanan jempol pada smartphone.
- Bottom navigation bar dengan 5 tab untuk pelanggan (Menu, Keranjang, Pesanan, Riwayat, Profil).
- Header khusus petugas dengan status ringkas kantin dan switcher cepat peran demo.
- Validasi stok langsung di kartu menu dan di halaman keranjang checkout.

## 6. Liveliness Levers
- **Focal Point**: Pada katalog, banner rekomendasi jajan hari ini dan kartu menu; pada checkout, tombol aksi konfirmasi pesanan dengan total harga jelas.
- **Whitespace**: Spacing 16px-24px yang konsisten menjaga tampilan tidak sesak walau banyak menu.
- **Empty States**: Menampilkan ilustrasi kontekstual dan pesan bersahabat jika keranjang kosong, riwayat belum ada, atau pencarian tidak ditemukan.
