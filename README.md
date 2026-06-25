# Sistem Informasi E-Catalogue Produk untuk Tim Sales di Djaka Coffee

Project fullstack Vite + React + Express.js + MySQL untuk e-catalogue produk, dashboard admin, dashboard sales, bundling paket, pesanan cepat, tracking order, user management, dan import Excel.

## Akun dummy

Akun otomatis dibuat saat server pertama kali dijalankan. Password dienkripsi menggunakan `bcryptjs`.

| Role | Email | Password |
|---|---|---|
| Admin | admin@djaka.com | admin123 |
| Sales | sales@djaka.com | sales123 |

## Cara install dependency

```bash
npm install
```

## Cara konfigurasi database

1. Buat file `.env` dari `.env.example`.
2. Sesuaikan user dan password MySQL.
3. Import file SQL:

```bash
mysql -u root -p < database/djaka_coffee_ecatalogue.sql
```

Atau melalui phpMyAdmin:

1. Buka phpMyAdmin.
2. Klik menu Import.
3. Pilih file `database/djaka_coffee_ecatalogue.sql`.
4. Klik Go/Kirim.

## Cara menjalankan project

```bash
npm run dev
```

Frontend berjalan di:

```text
http://localhost:5173
```

Backend API berjalan di:

```text
http://localhost:5000/api
```

## Import Excel

Fitur import tersedia pada halaman admin:

- Kelola Produk
- Kelola Kategori
- Kelola Promo

Contoh kolom Excel produk:

```text
nama_produk, kategori, deskripsi, spesifikasi, harga, stok, status
```

Contoh kolom Excel kategori:

```text
nama_kategori, deskripsi
```

Contoh kolom Excel promo:

```text
nama_promo, nama_produk, diskon, tanggal_mulai, tanggal_selesai, status
```

## Catatan penting

- Form input manual tetap ada walaupun import Excel tersedia.
- Sidebar otomatis menjadi menu hamburger pada mobile.
- Tabel admin memakai horizontal scroll agar tidak pecah di HP.
- Paket seminar Rp25.000 sudah tersedia sebagai data dummy.
- User nonaktif tidak dapat login.
- Total paket dan pesanan dihitung otomatis dari detail item.
