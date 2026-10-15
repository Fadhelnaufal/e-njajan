# e-njajan: Aplikasi Pemesanan Kantin Sekolah Modern

Aplikasi web pemesanan makanan dan minuman kantin sekolah modern berbasis Next.js App Router dan Tailwind CSS, dirancang khusus untuk kenyamanan ekosistem sekolah nusantara (Siswa, Guru, dan Petugas Kantin).

## Latar Belakang & Filosofi Desain

Kantin sekolah seringkali mengalami lonjakan antrean yang padat saat jam istirahat sekolah yang singkat (15 sampai 30 menit). **e-njajan** hadir untuk memecahkan masalah ini dengan sistem *pre-order* dan *live tracking* pesanan, dilengkapi simulasi pembayaran QRIS dan opsi pesan antar (delivery) langsung ke ruang guru atau ruang kelas.

Desain visual mengusung palet warna hangat khas kantin sekolah Indonesia (krem hangat, oranye selera, dan kuning madu) dengan tipografi Plus Jakarta Sans, kontras tinggi yang ramah aksesibilitas (WCAG AA), dan kepatuhan penuh terhadap standar mutu **antislop (38/38 Core Rules LULUS)**.

---

## Fitur Utama

### 1. User / Pelanggan (Siswa, Guru, dan Warga Sekolah)
- **Katalog Menu Interaktif**: Jelajahi 15 menu makanan dan minuman khas kantin sekolah dengan kategori (Makanan Berat, Camilan & Snack, Minuman Dingin, Minuman Hangat).
- **Pencarian Cepat & Filter**: Cari menu berdasarkan nama atau deskripsi secara instan.
- **Validasi Stok Real-Time**: Indikator sisa stok dan penanganan otomatis jika stok tidak mencukupi.
- **Keranjang Belanja Fleksibel**: Tambah, kurangi kuantitas, atau kosongkan keranjang dengan konfirmasi aman.
- **Checkout Dinamis**:
  - Opsi **Ambil Sendiri (Pickup)** di konter kantin (bebas biaya pengiriman).
  - Opsi **Pesan Antar (Delivery)** khusus ke ruang kelas atau ruang guru (+ Rp 2.000).
  - *Location chips* interaktif (Ruang Guru, Lab Komputer, Kelas 7A s/d 9C).
  - Metode pembayaran fleksibel: **QRIS Simulasi** dan **Tunai di Loket**.
- **Simulasi Pembayaran QRIS Interaktif**: Dialog QRIS interaktif dengan tombol simulasi pembayaran sukses atau simulasi gagal.
- **Lacak Pesanan Aktif (Live Tracking)**:
  - Stepper visual 3 tahap: *Menunggu Konfirmasi -> Sedang Disiapkan -> Siap Diambil / Diantar*.
  - Opsi pembatalan pesanan aman sebelum pesanan mulai dimasak oleh petugas.
- **Riwayat Transaksi**: Rekam jejak seluruh pesanan terdahulu dengan status pembayaran dan tanggal transaksi.

### 2. Petugas Kantin (Staff Dashboard & Mode Kios)
- **Ringkasan Operasional Harian**: Total pendapatan riil dari pesanan selesai, jumlah antrean aktif, dan status buka/tutup layanan kantin.
- **Manajemen Antrean Pesanan**:
  - Aksi 1-klik untuk menerima pesanan (*Mulai Siapkan*), mengubah status menjadi *Siap Diambil/Diantar*, dan menyelesaikan pesanan.
  - Opsi tolak pesanan dengan pengembalian stok otomatis.
- **Manajemen Menu Lengkap (CRUD)**:
  - Tambah menu baru dengan foto, emoji, harga, kategori, dan stok awal.
  - Edit informasi menu dan deskripsi.
  - Ubah stok cepat (*Quick Stock*) dengan sanitasi input anti-angka-negatif.
  - Toggle aktif/nonaktif menu dan hapus menu dengan konfirmasi.
- **Pengaturan Kantin**: Ubah nama kantin, biaya pesan antar, dan reset data demo aplikasi kapan saja.

---

## Tumpukan Teknologi (Tech Stack)

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Bahasa**: TypeScript
- **Styling**: Tailwind CSS & CSS Variables
- **Ikonografi**: Lucide React
- **Tipografi**: Plus Jakarta Sans (`next/font/google`)
- **State & Penyimpanan**: React Context API + LocalStorage Persistence
- **Standar Desain & Mutu**: antislop Craftsmanship (38 Rules Checked)

---

## Memulai (Getting Started)

### Prasyarat
- Node.js 18.18.0 atau versi yang lebih baru
- npm / pnpm / yarn

### Instalasi & Menjalankan Lokal

1. Salin repositori:
   ```bash
   git clone https://github.com/Fadhelnaufal/e-njajan.git
   cd e-njajan
   ```

2. Pasang dependensi:
   ```bash
   npm install
   ```

3. Jalankan server pengembangan:
   ```bash
   npm run dev
   ```

4. Buka peramban di [http://localhost:3000](http://localhost:3000).

### Skrip yang Tersedia

- `npm run dev`: Menjalankan server pengembangan lokal.
- `npm run build`: Melakukan kompilasi produksi dengan Next.js Turbopack.
- `npm run start`: Menjalankan server produksi.
- `npm run lint`: Memeriksa kepatuhan kode dengan ESLint.

---

## Akun Demo & Alur Pengujian

Gunakan tombol **Ganti Peran** di bilah navigasi atas untuk berpindah antara 2 peran demo:
1. **User / Pelanggan (Budi Santoso - Kelas 8B / Warga Sekolah)**: Uji alur pemesanan makanan, ganti nama atau ruang antar (Kelas 8B, Ruang Guru, atau Lab), checkout pesan antar, dan simulasi QRIS.
2. **Petugas Kantin (Pak Slamet)**: Buka dashboard staf untuk menerima pesanan, memperbarui stok, memproses antrean, atau mengubah status kantin.

Jika ingin mengulang demo dari awal, buka **Pengaturan** di dashboard staf lalu klik **Reset Data Demo Sekarang**.

---

## Lisensi

Dibuat untuk kebutuhan operasional kantin sekolah modern.
