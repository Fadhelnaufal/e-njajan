# PRD Final — Aplikasi Pemesanan Kantin Sekolah

Product Requirements Document · MVP · Versi 1.0 · 14 Oktober 2026

[Inspirasi visual aplikasi pemesanan kantin sekolah dengan menu makanan dan antarmuka mobile yang ceria](https://images.openai.com/static-rsc-4/MK_i0inaqvSFffxtEyUOnY5mx0VDJrllrIiBK1HFSHlNksgMErfL9g1tE2ErWDEiCe2QaD1AZt0zgLcHAjkRT4LJ9-FXFaWw4R7Cio0D1brjlBI0GnrDGHUrnMSfC6FE0VJzI4ffnOQcI9OzVQlze2VRGd3Idtbirvi18Sn0Ii4?purpose=inline)

[dribbble.com](https://dribbble.com/shots/27080483-Campus-Food-Ordering-Canteen-Management-App-Campus-Crave)

Jenis produk

Web app mobile-first

Target rilis

MVP / Prototype

Pengguna

Siswa, guru, petugas kantin

Arsitektur

Tanpa backend

## 1. Ringkasan eksekutif

Aplikasi Kantin Sekolah adalah aplikasi pemesanan makanan dan minuman yang memudahkan siswa dan guru melihat menu, memilih makanan, melakukan checkout, memilih metode pembayaran simulasi, dan memantau pesanan. Petugas kantin menggunakan dashboard terpisah untuk mengelola menu, stok, pesanan, pembayaran tunai, biaya pengantaran, serta ringkasan penjualan harian.

MVP ini mengutamakan pengalaman end-to-end yang lancar dan dapat langsung didemonstrasikan tanpa server, database eksternal, autentikasi sungguhan, atau integrasi pembayaran.

Semua data disimpan di browser melalui `localStorage`. Seluruh peran berbagi data yang sama pada browser dan perangkat yang sama. Perubahan tidak disinkronkan antarperangkat.

## 2. Masalah yang ingin diselesaikan

- Siswa dan guru perlu cara yang praktis untuk mengetahui menu, harga, dan ketersediaan makanan.
- Pemesanan manual dapat menyebabkan antrean, pesanan terlewat, atau kesalahan pencatatan.
- Petugas kantin membutuhkan satu tampilan untuk memantau pesanan dan memperbarui statusnya.
- Pembayaran tunai dan simulasi QRIS perlu dicatat dengan status yang jelas.
- Stok harus diperbarui secara konsisten agar pesanan tidak melebihi persediaan.

## 3. Tujuan produk dan indikator keberhasilan

### Tujuan

1. Memungkinkan siswa dan guru menyelesaikan pemesanan dari katalog hingga konfirmasi.
2. Memungkinkan petugas memproses pesanan dari konfirmasi sampai selesai atau dibatalkan.
3. Menjaga status pesanan, pembayaran, dan stok tetap konsisten di seluruh halaman.
4. Menyediakan demo interaktif yang bisa diuji ulang melalui reset data.
5. Menghasilkan antarmuka mobile-first yang ceria, jelas, dan mudah digunakan.

### Kriteria keberhasilan MVP

| Indikator          | Kriteria penerimaan                                                         |
| ------------------ | --------------------------------------------------------------------------- |
| Alur pemesanan     | Pengguna dapat memilih menu, checkout, dan melihat detail pesanan           |
| Validasi stok      | Checkout ditolak jika stok tidak mencukupi                                  |
| Pemrosesan pesanan | Petugas dapat memperbarui status sesuai alur yang valid                     |
| Pembayaran         | QRIS simulasi dan pembayaran tunai memiliki status terpisah                 |
| Pembatalan         | Pembatalan yang diizinkan mengembalikan stok                                |
| Data lokal         | Data bertahan setelah refresh pada browser yang sama                        |
| Dashboard          | Ringkasan penjualan harian menghitung pesanan selesai saja untuk pendapatan |
| Reset demo         | Data dapat dikembalikan ke keadaan awal setelah konfirmasi                  |

## 4. Target pengguna dan kebutuhan

[Siswa menggunakan ponsel di kantin sekolah](https://images.openai.com/static-rsc-4/NIndVcuqkRRnzVJtKZ324SBkp7wJ_m9gquyJXNRp1k4MWqtOQeSPUXKfFOfZW0Y89ByBN2Y4xkFBs2BjO7cmv0Hcc5ys15cErdETLlCHYCDPKnDIz_gTEHvpEa0jpT0rDlBVPuPPVO3ditieQDFW360XRMOCwwF3HouLhKd1DSc?purpose=inline)

Siswa

Ingin menemukan makanan dengan cepat, melihat harga dan stok, memesan untuk pickup atau diantar ke kelas, serta memantau pesanan.

[Guru menggunakan ponsel di lingkungan sekolah](https://images.openai.com/static-rsc-4/oHGtyQ5c9vG5BGpDZ-JAfZ2iH3mrT_EwYXkZK7Br-7wsROPMgX5uDwm5RnzRm8k3MZM7uCOirApFdH3JmhLK2ktDNy1YsRmqW0ZtTPHYScIiGE0k1y6HEtBL-McJLfN1dkRAKYl3U1QrYZCbV8Re8AjjXS7rsRDDXesJJh2JTtM?purpose=inline)

Guru

Membutuhkan pengalaman pemesanan yang sama seperti siswa, termasuk lokasi pengantaran seperti ruang guru atau laboratorium.

[Petugas kantin menyiapkan pesanan](https://images.openai.com/static-rsc-4/lC5avYUvWek4okosoOgjkcT0T1g5brT5zOiP86_dPkLYXSGZQuUOv36hnfA2nf7NW3R6uSsRm4gTuqlNFmCcyldU8oXCMdDDHEym-t_1a7g3I4LLPnomwskCrOnPUMfA2Hs2gILC1K9JH6er08zSB4VU0na-765UwLI9VtFpEjM?purpose=inline)

Petugas kantin

Ingin mengelola menu dan stok, memproses pesanan, mengonfirmasi pembayaran tunai, dan melihat ringkasan operasional.

## 5. Ruang lingkup MVP

### Fitur yang termasuk

- Pemilihan peran tanpa login sungguhan.
- Profil lokal dengan nama pengguna.
- Katalog menu, kategori, pencarian, menu populer, dan label stok habis.
- Foto menu dengan fallback emoji.
- Keranjang multi-item dan checkout.
- Pickup dan delivery dengan lokasi teks bebas.
- Simulasi QRIS dan pembayaran tunai.
- Pelacakan pesanan dan riwayat.
- Dashboard petugas untuk pesanan dan pengelolaan menu.
- Konfirmasi pembayaran tunai oleh petugas.
- Ringkasan penjualan harian.
- Pengaturan nama kantin, biaya pengantaran, dan status layanan.
- Notifikasi dalam aplikasi tanpa push notification.
- Data demo awal, pesanan contoh, dan reset data demo.
- Persistensi data melalui `localStorage`.

### Di luar ruang lingkup

- Backend, API, atau database cloud.
- Sinkronisasi antarperangkat.
- Login, password, dan autentikasi berbasis akun.
- Transaksi QRIS atau pembayaran sungguhan.
- Pengembalian dana sungguhan.
- Notifikasi push, WhatsApp, atau SMS.
- Pemesanan terjadwal.
- Filter katalog lanjutan.
- Pengelolaan banyak kantin atau cabang.
- Laporan keuangan lanjutan dan ekspor data.

## 6. Struktur navigasi

Halaman awal

Nama aplikasi · Pilih peran · Nama pengguna

Siswa / Guru

Menu

Keranjang

Pesanan aktif

Riwayat

Profil / ganti peran

Petugas kantin

Dashboard

Daftar pesanan

Kelola menu dan stok

Ringkasan penjualan

Pengaturan kantin

Navigasi pengguna menggunakan tab bawah pada layar mobile: Menu, Keranjang, Pesanan, Riwayat. Navigasi petugas menggunakan menu operasional tersendiri.

## 7. Spesifikasi fitur

### 7.1 Pemilihan peran dan profil lokal

- Halaman pertama menampilkan nama/logo aplikasi dan pilihan Siswa, Guru, serta Petugas Kantin.
- Siswa dan guru memasukkan nama pada profil lokal.
- Nama disimpan di browser dan dicantumkan dalam detail pesanan.
- Petugas dapat masuk melalui pemilihan peran tanpa autentikasi.
- Pengguna dapat berganti peran untuk menguji alur demo.
- Data pesanan dan menu tetap sama saat peran berganti.

Catatan: pemilih peran bukan mekanisme keamanan. Dalam MVP, semua orang yang mengakses browser dapat memilih peran petugas.

### 7.2 Katalog menu

Setiap item menu memiliki:

- ID unik, nama, deskripsi singkat, harga, kategori, stok, status aktif, dan gambar atau emoji.
- Penanda menu populer untuk data demo.
- Label Habis jika stok nol atau menu tidak tersedia.
- Pencarian berdasarkan nama menu.
- Filter kategori.
- Harga yang tampil jelas dan konsisten dalam format Rupiah.

Petugas dapat menambah, mengedit, atau menghapus menu. Perubahan langsung tercermin di katalog pada browser yang sama.

### 7.3 Keranjang dan checkout

- Mendukung beberapa item dalam satu pesanan.
- Pengguna dapat menambah, mengurangi, dan menghapus item.
- Total dihitung ulang otomatis.
- Tidak ada minimum pembelian.
- Checkout memvalidasi ulang stok semua item.
- Jika stok kurang, checkout diblokir dan item bermasalah ditandai.
- Jika valid, sistem membuat pesanan, mengurangi stok, lalu menyimpan pesanan.
- Biaya pengantaran hanya berlaku untuk delivery.
- Perubahan biaya pengantaran hanya berlaku pada pesanan baru; pesanan yang sudah dibuat menyimpan biaya saat checkout.

Rumus total:

\\[ \text{Total}=\text{Subtotal}+\text{Biaya Pengantaran} \\]

Untuk pickup, biaya pengantaran adalah Rp0.

### 7.4 Pickup dan delivery

Pickup — ambil sendiri

- Tidak memerlukan lokasi.
- Setelah disiapkan, status menjadi Siap diambil.
- Petugas dapat menandai pesanan selesai setelah diserahkan.

Delivery — diantar

- Pengguna wajib mengisi lokasi teks bebas, misalnya `Kelas 8B`, `Ruang Guru`, atau `Lab Komputer`.
- Setelah disiapkan, status menjadi Dalam pengantaran.
- Petugas menandai pesanan selesai setelah diantar.

### 7.5 Pembayaran

[Ilustrasi layar QR untuk simulasi pembayaran](https://images.openai.com/static-rsc-4/Nc__X4uvPcVgn3vwvnXlxXFmEFFp7pUOJ2hdrQGGZrUBH_wTgIW_zid8UeOLnCWdrgYVGhLe1p7MMgjMNl14VGm5h6nejKBwGEusCiXE4c58OTzVL4-2W71h4nAbxLFNWm4yyI3LQaSaT3kMWk5peBhZ_XQ5k85VBBt4MkBMrmSVot1X_-ruWqb679qvWFhz?purpose=inline)

QRIS simulasi

Setelah checkout, aplikasi menampilkan layar QR dummy dan tombol Simulasikan Pembayaran Berhasil. Tidak ada transaksi nyata. Status pembayaran berubah menjadi berhasil disimulasikan setelah tombol ditekan.

[Ilustrasi pembayaran tunai](https://images.openai.com/static-rsc-4/KOU9e9j1id0LYYt7Xlw-FBpgBYvyePC-At3UvqfprVoTEpwJHLZ2ImbyVp5Kn1L2vuNegB4YVc-gFLspkm_cGgUmvjVdjKKG6xxCFlz7jvC6lqE69miey0gCGQP-SSlG3EHYpWM2vupCbt6Enk7vwyUw0IzOp0MpzrhP81Jb5v8?purpose=inline)

Tunai

Pembayaran dimulai dengan status Belum dibayar. Setelah menerima uang, petugas menekan Tandai Lunas. Status berubah menjadi Lunas.

Status pembayaran terpisah dari status pesanan. Pesanan yang dibatalkan setelah QRIS simulasi berhasil menampilkan keterangan Pengembalian dana disimulasikan. Ini hanya pencatatan demo, bukan transaksi refund.

### 7.6 Status dan aturan pesanan

| Status              | Makna                           | Aksi petugas                        |
| ------------------- | ------------------------------- | ----------------------------------- |
| Menunggu konfirmasi | Pesanan baru masuk              | Mulai persiapan atau batalkan       |
| Sedang disiapkan    | Pesanan sedang dibuat           | Siap diambil atau mulai pengantaran |
| Siap diambil        | Pesanan pickup siap diserahkan  | Tandai selesai                      |
| Dalam pengantaran   | Pesanan delivery sedang diantar | Tandai selesai                      |
| Selesai             | Pesanan sudah diserahkan        | Lihat detail                        |
| Dibatalkan          | Pesanan dibatalkan              | Lihat detail                        |

Pembatalan hanya diperbolehkan sebelum persiapan dimulai. Jika dibatalkan, stok dipulihkan secara otomatis. Jika QRIS simulasi sudah berhasil, aplikasi mencatat refund simulasi.

Setiap pesanan memiliki nomor unik dengan format harian seperti `KNT-001`, `KNT-002`. Penomoran dimulai kembali pada hari baru. Setiap pesanan juga menyimpan waktu pembuatan dan detail transaksi untuk kebutuhan riwayat.

### 7.7 Dashboard petugas dan penjualan

Dashboard menampilkan:

- Jumlah pesanan hari ini.
- Jumlah pesanan selesai.
- Jumlah pesanan yang sedang diproses.
- Total pendapatan dari pesanan selesai saja.
- Daftar pesanan dengan filter status.
- Aksi yang sesuai dengan status dan metode pemenuhan.

Pendapatan dihitung dari pesanan selesai, menggunakan total transaksi yang tersimpan pada pesanan tersebut. Pesanan yang dibatalkan atau masih diproses tidak dihitung sebagai pendapatan selesai.

### 7.8 Pengaturan kantin

Petugas dapat mengubah:

- Nama kantin.
- Biaya pengantaran.
- Status layanan aktif atau nonaktif.

Jika layanan nonaktif, katalog dan riwayat tetap bisa dibuka, tetapi checkout baru dinonaktifkan. Pesanan yang sudah dibuat tetap dapat diproses.

### 7.9 Notifikasi dalam aplikasi

Notifikasi lokal ditampilkan ketika:

- Pesanan berhasil dibuat.
- Status pesanan berubah.
- Pesanan dibatalkan.
- Pembayaran dikonfirmasi.

Tidak ada push notification. Karena data tidak disinkronkan antarperangkat, perubahan status tidak dikirim secara real-time ke perangkat lain.

### 7.10 Data demo dan reset

Saat pertama kali dibuka, aplikasi memiliki 12–15 menu contoh serta beberapa pesanan contoh untuk menunjukkan dashboard. Data contoh diberi penanda internal agar dapat dibedakan dari pesanan baru.

Tombol Reset Data Demo mengembalikan menu, pesanan, stok, profil demo, pengaturan, dan status pembayaran ke data awal. Reset harus meminta konfirmasi sebelum menghapus perubahan lokal.

## 8. Alur utama pengguna

### Alur A — Siswa atau guru melakukan pemesanan

### 01

Pilih peran dan nama

Masuk sebagai siswa atau guru.

### 02

Jelajahi katalog

Cari menu, pilih kategori, dan periksa stok.

### 03

Atur keranjang

Pilih kuantitas dan hapus item jika perlu.

### 04

Checkout

Pilih pickup atau delivery, isi lokasi jika delivery, dan pilih pembayaran.

### 05

Konfirmasi pesanan

Sistem validasi stok, membuat nomor pesanan, dan mengurangi stok.

### 06

Bayar atau tunggu konfirmasi

Selesaikan simulasi QRIS atau bayar tunai saat menerima pesanan.

### 07

Lacak pesanan

Lihat status hingga pesanan selesai atau dibatalkan.

### Alur B — Petugas memproses pesanan

Menunggu konfirmasi

Terima pesanan atau batalkan

Sedang disiapkan

Siapkan makanan dan minuman

Pickup

Siap diambil → Selesai

Delivery

Dalam pengantaran → Selesai

Petugas juga dapat menandai pembayaran tunai lunas setelah uang diterima. Aksi pembayaran tidak mengubah status pemenuhan pesanan.

## 9. Model data dan aturan konsistensi

Data disimpan secara lokal menggunakan `localStorage`, dengan struktur konseptual berikut.

| Entitas    | Data utama                                                                                    |
| ---------- | --------------------------------------------------------------------------------------------- |
| Profil     | Nama, peran, preferensi lokal                                                                 |
| Menu       | ID, nama, deskripsi, harga, kategori, stok, gambar/emoji, status aktif                        |
| Keranjang  | ID menu, kuantitas                                                                            |
| Pesanan    | Nomor, tanggal, pemesan, item, subtotal, biaya antar, total, metode pemenuhan, lokasi, status |
| Pembayaran | Metode, status, waktu konfirmasi, catatan simulasi                                            |
| Pengaturan | Nama kantin, biaya antar, status layanan                                                      |
| Notifikasi | Pesan, waktu, jenis kejadian                                                                  |
| Data demo  | Penanda data contoh dan versi data awal                                                       |

Aturan penting:

1. Setiap pesanan menyimpan snapshot nama menu, harga, kuantitas, dan biaya pengantaran saat checkout. Perubahan menu di kemudian hari tidak mengubah transaksi lama.
2. Semua perubahan stok, pesanan, dan pembayaran harus disimpan secara konsisten.
3. Nomor pesanan harian tidak boleh bertabrakan pada tanggal yang sama.
4. Stok tidak boleh menjadi negatif.
5. Tombol aksi yang tidak valid untuk status tertentu tidak boleh ditampilkan atau dijalankan.
6. Data harus bertahan setelah refresh browser.
7. Jika penyimpanan lokal gagal, tampilkan pesan yang jelas dan jangan berpura-pura bahwa transaksi berhasil disimpan.
8. `localStorage` bukan penyimpanan aman untuk data sensitif dan tidak memberikan konsistensi antarperangkat.

## 10. Persyaratan UI/UX

### Arah visual

- Mobile-first, responsif untuk tablet dan desktop.
- Ceria, ramah anak sekolah, tetapi tetap profesional.
- Palet dasar: krem, oranye, kuning hangat, dengan teks gelap yang mudah dibaca.
- Kartu menu dengan foto, harga, nama, dan kontrol tambah.
- Tombol utama berukuran nyaman untuk layar sentuh.
- Badge status menggunakan warna konsisten.
- Layout dan komponen berbeda untuk pelanggan dan petugas.
- Empty state yang jelas untuk keranjang kosong, riwayat kosong, dan hasil pencarian kosong.
- Skeleton atau indikator proses hanya digunakan ketika memang ada proses yang perlu ditunggu.
- Konfirmasi sebelum pembatalan pesanan dan reset data.
- Kontras teks yang memadai, label yang jelas, dan indikator stok tidak bergantung pada warna saja.

### Daftar layar minimum

| Layar                   | Isi utama                                            |
| ----------------------- | ---------------------------------------------------- |
| 1. Pilih peran          | Logo, nama kantin, pilihan peran                     |
| 2. Profil               | Input nama untuk siswa/guru                          |
| 3. Katalog              | Pencarian, kategori, menu populer, kartu menu        |
| 4. Detail menu          | Gambar, deskripsi, harga, stok, kuantitas            |
| 5. Keranjang            | Item, kuantitas, subtotal, total                     |
| 6. Checkout             | Pickup/delivery, lokasi, metode pembayaran           |
| 7. QRIS simulasi        | QR dummy, nominal, tombol simulasi berhasil          |
| 8. Pesanan berhasil     | Nomor pesanan, ringkasan, tautan ke pelacakan        |
| 9. Detail pesanan       | Item, status pesanan, status pembayaran              |
| 10. Pesanan dan riwayat | Daftar pesanan aktif dan riwayat                     |
| 11. Dashboard petugas   | Statistik, daftar pesanan, filter status             |
| 12. Kelola menu         | Daftar menu dan stok                                 |
| 13. Form menu           | Nama, harga, kategori, stok, foto/emoji              |
| 14. Ringkasan penjualan | Total pesanan, selesai, diproses, pendapatan         |
| 15. Pengaturan          | Nama kantin, biaya antar, status layanan, reset demo |

Setelah checkout berhasil, tampilkan halaman sukses dengan tiga aksi: Lacak Pesanan, Kembali ke Menu, dan Lihat Riwayat.

## 11. Acceptance criteria dan skenario uji

### Checklist pengujian MVP

0 dari 12 diuji

Pemesanan pickup

Siswa memesan menu tersedia, memilih pickup, checkout berhasil, lalu melihat nomor pesanan dan status awal.

Pemesanan delivery

Guru mengisi lokasi pengantaran; biaya pengantaran masuk ke total dan tersimpan pada pesanan.

Stok tidak cukup

Checkout diblokir ketika kuantitas melebihi stok terbaru; pengguna dapat memperbaiki keranjang.

QRIS simulasi

Tombol simulasi mengubah status pembayaran menjadi berhasil disimulasikan tanpa transaksi eksternal.

Tunai

Status dimulai belum dibayar dan hanya petugas yang dapat menandainya lunas setelah menerima uang.

Pembatalan

Pesanan sebelum persiapan dapat dibatalkan; stok pulih dan refund simulasi dicatat bila relevan.

Transisi status

Aksi yang tersedia sesuai status dan metode pemenuhan; pickup tidak memiliki aksi pengantaran.

Pendapatan harian

Hanya total pesanan berstatus selesai yang masuk ke pendapatan.

Persistensi

Menu, pesanan, stok, pembayaran, dan pengaturan bertahan setelah refresh browser.

Reset demo

Setelah konfirmasi, data kembali ke menu dan pesanan contoh awal.

Layanan nonaktif

Checkout baru diblokir, tetapi katalog dan riwayat tetap bisa dilihat.

Ganti peran

Pengguna dapat berpindah peran dan melihat data pesanan yang sama di browser tersebut.

Reset checklistSalin checklist

## 12. Risiko dan mitigasi

- Tidak ada sinkronisasi: perubahan hanya terlihat pada browser yang sama. Nyatakan batasan ini pada demo dan jangan menjanjikan kolaborasi lintas perangkat.
- Penyimpanan lokal dapat dihapus: sediakan reset demo yang disengaja, validasi data saat aplikasi dibuka, dan pesan error jika penyimpanan gagal.
- Pemilih peran tidak aman: tandai sebagai mode demo; jangan gunakan untuk operasional nyata dengan data sensitif.
- Foto gagal dimuat: sediakan fallback emoji dan placeholder.
- Data demo bercampur dengan pesanan baru: tandai pesanan contoh secara internal dan bedakan pada tampilan demo bila diperlukan.
- Status pembayaran dan pesanan berbeda: tampilkan keduanya secara terpisah agar pengguna tidak salah mengira bahwa pesanan selesai berarti pembayaran otomatis lunas.
- Penghitungan pendapatan: gunakan total pesanan yang disimpan saat checkout, bukan harga menu terbaru.

## 13. Tahapan implementasi yang disarankan

1. Fondasi UI dan data lokal — desain responsif, pemilihan peran, profil, data awal, dan penyimpanan.
2. Katalog dan keranjang — pencarian, kategori, kartu menu, pengelolaan kuantitas, dan validasi stok.
3. Checkout dan pembayaran — pickup/delivery, biaya pengantaran, simulasi QRIS, dan tunai.
4. Operasional petugas — dashboard, transisi status, pembatalan, pembayaran tunai, dan CRUD menu.
5. Pelacakan dan laporan — riwayat, notifikasi lokal, ringkasan penjualan, dan pengaturan.
6. Polishing dan pengujian — responsive layout, aksesibilitas, skenario edge case, persistensi, dan reset demo.

### Definisi selesai

MVP dianggap siap didemonstrasikan ketika siswa atau guru dapat membuat pesanan dari katalog, petugas dapat memproses pesanan tersebut dengan mengganti peran, stok dan pembayaran tercatat konsisten, seluruh perubahan bertahan setelah refresh, dan data demo dapat direset kembali.

> 💡 Pro Tip: Are you ready to create a slide deck from this PRD? Don't start from scratch. Use Gamma to convert this PRD into a presentation automatically. Use the [Gamma AI Presentation Generator](https://try.gamma.app/PRD) (Sponsored) ✅ Professional slides, auto-formatted ✅ Dozens of polished, customizable templates ✅ Export and share easily (PDF/PowerPoint) ✅ No credit card required

👉 [Create with Gamma AI – For Free](https://try.gamma.app/PRD)