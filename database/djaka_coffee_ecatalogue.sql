DROP DATABASE IF EXISTS djaka_coffee_ecatalogue;
CREATE DATABASE djaka_coffee_ecatalogue CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE djaka_coffee_ecatalogue;

CREATE TABLE roles (
  id_role INT AUTO_INCREMENT PRIMARY KEY,
  nama_role VARCHAR(50) NOT NULL UNIQUE
) ENGINE=InnoDB;

CREATE TABLE users (
  id_user INT AUTO_INCREMENT PRIMARY KEY,
  id_role INT NOT NULL,
  nama VARCHAR(120) NOT NULL,
  email VARCHAR(120) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  no_hp VARCHAR(30),
  alamat TEXT,
  status ENUM('aktif','nonaktif') DEFAULT 'aktif',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_users_roles FOREIGN KEY (id_role) REFERENCES roles(id_role)
) ENGINE=InnoDB;

CREATE TABLE kategori (
  id_kategori INT AUTO_INCREMENT PRIMARY KEY,
  nama_kategori VARCHAR(120) NOT NULL,
  deskripsi TEXT
) ENGINE=InnoDB;

CREATE TABLE produk (
  id_produk INT AUTO_INCREMENT PRIMARY KEY,
  id_kategori INT NOT NULL,
  nama_produk VARCHAR(150) NOT NULL,
  deskripsi TEXT,
  spesifikasi TEXT,
  harga DECIMAL(12,2) NOT NULL DEFAULT 0,
  stok INT NOT NULL DEFAULT 0,
  gambar VARCHAR(255),
  status ENUM('aktif','nonaktif') DEFAULT 'aktif',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_produk_kategori FOREIGN KEY (id_kategori) REFERENCES kategori(id_kategori),
  CONSTRAINT chk_produk_harga CHECK (harga >= 0),
  CONSTRAINT chk_produk_stok CHECK (stok >= 0)
) ENGINE=InnoDB;

CREATE TABLE promo (
  id_promo INT AUTO_INCREMENT PRIMARY KEY,
  id_produk INT NOT NULL,
  nama_promo VARCHAR(150) NOT NULL,
  diskon DECIMAL(5,2) NOT NULL DEFAULT 0,
  tanggal_mulai DATE NOT NULL,
  tanggal_selesai DATE NOT NULL,
  status ENUM('aktif','nonaktif') DEFAULT 'aktif',
  CONSTRAINT fk_promo_produk FOREIGN KEY (id_produk) REFERENCES produk(id_produk) ON DELETE CASCADE,
  CONSTRAINT chk_promo_diskon CHECK (diskon >= 0 AND diskon <= 100)
) ENGINE=InnoDB;

CREATE TABLE paket_produk (
  id_paket INT AUTO_INCREMENT PRIMARY KEY,
  nama_paket VARCHAR(150) NOT NULL,
  jenis_acara VARCHAR(100) NOT NULL,
  deskripsi TEXT,
  budget DECIMAL(12,2) NOT NULL DEFAULT 0,
  total_harga DECIMAL(12,2) NOT NULL DEFAULT 0,
  status ENUM('aktif','nonaktif') DEFAULT 'aktif',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT chk_paket_budget CHECK (budget >= 0),
  CONSTRAINT chk_paket_total CHECK (total_harga >= 0)
) ENGINE=InnoDB;

CREATE TABLE detail_paket (
  id_detail_paket INT AUTO_INCREMENT PRIMARY KEY,
  id_paket INT NOT NULL,
  id_produk INT NOT NULL,
  jumlah INT NOT NULL DEFAULT 1,
  harga DECIMAL(12,2) NOT NULL DEFAULT 0,
  subtotal DECIMAL(12,2) NOT NULL DEFAULT 0,
  CONSTRAINT fk_detail_paket_paket FOREIGN KEY (id_paket) REFERENCES paket_produk(id_paket) ON DELETE CASCADE,
  CONSTRAINT fk_detail_paket_produk FOREIGN KEY (id_produk) REFERENCES produk(id_produk),
  CONSTRAINT chk_detail_paket_jumlah CHECK (jumlah > 0)
) ENGINE=InnoDB;

CREATE TABLE pesanan (
  id_pesanan INT AUTO_INCREMENT PRIMARY KEY,
  id_user INT NOT NULL,
  tanggal_pesanan TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status_pesanan ENUM('menunggu','diproses','dikirim','selesai','dibatalkan') DEFAULT 'menunggu',
  total DECIMAL(12,2) NOT NULL DEFAULT 0,
  catatan TEXT,
  CONSTRAINT fk_pesanan_user FOREIGN KEY (id_user) REFERENCES users(id_user)
) ENGINE=InnoDB;

CREATE TABLE detail_pesanan (
  id_detail INT AUTO_INCREMENT PRIMARY KEY,
  id_pesanan INT NOT NULL,
  id_produk INT NULL,
  id_paket INT NULL,
  jumlah INT NOT NULL DEFAULT 1,
  harga DECIMAL(12,2) NOT NULL DEFAULT 0,
  subtotal DECIMAL(12,2) NOT NULL DEFAULT 0,
  CONSTRAINT fk_detail_pesanan_pesanan FOREIGN KEY (id_pesanan) REFERENCES pesanan(id_pesanan) ON DELETE CASCADE,
  CONSTRAINT fk_detail_pesanan_produk FOREIGN KEY (id_produk) REFERENCES produk(id_produk) ON DELETE SET NULL,
  CONSTRAINT fk_detail_pesanan_paket FOREIGN KEY (id_paket) REFERENCES paket_produk(id_paket) ON DELETE SET NULL,
  CONSTRAINT chk_detail_pesanan_item CHECK (id_produk IS NOT NULL OR id_paket IS NOT NULL),
  CONSTRAINT chk_detail_pesanan_jumlah CHECK (jumlah > 0)
) ENGINE=InnoDB;

CREATE TABLE tracking_order (
  id_tracking INT AUTO_INCREMENT PRIMARY KEY,
  id_pesanan INT NOT NULL,
  status ENUM('menunggu','diproses','dikirim','selesai','dibatalkan') NOT NULL,
  keterangan TEXT,
  tanggal_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_tracking_pesanan FOREIGN KEY (id_pesanan) REFERENCES pesanan(id_pesanan) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE sinkronisasi_data (
  id_sinkronisasi INT AUTO_INCREMENT PRIMARY KEY,
  id_user INT NOT NULL,
  jenis_data VARCHAR(100) NOT NULL,
  status_sinkronisasi ENUM('pending','berhasil','gagal') DEFAULT 'pending',
  waktu_sinkronisasi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  keterangan TEXT,
  CONSTRAINT fk_sinkronisasi_user FOREIGN KEY (id_user) REFERENCES users(id_user) ON DELETE CASCADE
) ENGINE=InnoDB;

INSERT INTO roles (id_role, nama_role) VALUES
(1, 'admin'),
(2, 'sales');

INSERT INTO kategori (id_kategori, nama_kategori, deskripsi) VALUES
(1, 'Makanan Berat', 'Menu utama seperti nasi, mie, dan paket makan.'),
(2, 'Minuman', 'Kopi, teh, dan minuman botol.'),
(3, 'Snack', 'Makanan ringan pendamping acara.'),
(4, 'Paket Bundling', 'Kategori untuk kebutuhan paket acara.');

INSERT INTO produk (id_produk, id_kategori, nama_produk, deskripsi, spesifikasi, harga, stok, gambar, status) VALUES
(1, 1, 'Nasi ayam', 'Nasi ayam untuk paket seminar.', 'Nasi putih, ayam bumbu, sambal, lalapan', 18000, 150, NULL, 'aktif'),
(2, 2, 'Air mineral', 'Air mineral botol kecil.', 'Botol 330 ml', 3000, 300, NULL, 'aktif'),
(3, 3, 'Snack kecil', 'Snack kecil untuk pelengkap paket.', 'Snack ringan satu porsi', 4000, 250, NULL, 'aktif'),
(4, 1, 'Nasi goreng', 'Nasi goreng untuk paket acara.', 'Nasi goreng, telur, acar', 17000, 130, NULL, 'aktif'),
(5, 2, 'Es teh', 'Minuman es teh manis.', 'Cup 12 oz', 4000, 220, NULL, 'aktif'),
(6, 3, 'Roti', 'Roti kecil untuk snack acara.', 'Roti manis satuan', 4000, 180, NULL, 'aktif'),
(7, 1, 'Mie goreng', 'Mie goreng untuk paket acara.', 'Mie goreng, sayur, telur', 16000, 120, NULL, 'aktif'),
(8, 2, 'Kopi susu kecil', 'Kopi susu ukuran kecil.', 'Cup 8 oz', 6000, 200, NULL, 'aktif'),
(9, 3, 'Snack', 'Snack ringan standar.', 'Snack satuan', 3000, 260, NULL, 'aktif'),
(10, 2, 'Kopi Americano', 'Kopi hitam klasik Djaka Coffee.', 'Cup 12 oz, espresso dan air', 12000, 100, NULL, 'aktif'),
(11, 2, 'Cappuccino', 'Kopi susu berbusa lembut.', 'Cup 12 oz, espresso, susu, foam', 18000, 80, NULL, 'aktif');

INSERT INTO promo (id_promo, id_produk, nama_promo, diskon, tanggal_mulai, tanggal_selesai, status) VALUES
(1, 8, 'Promo Kopi Susu Seminar', 10, '2026-01-01', '2026-12-31', 'aktif'),
(2, 11, 'Diskon Cappuccino', 15, '2026-01-01', '2026-12-31', 'aktif');

INSERT INTO paket_produk (id_paket, nama_paket, jenis_acara, deskripsi, budget, total_harga, status) VALUES
(1, 'Paket Seminar A', 'seminar', 'Nasi ayam, air mineral, dan snack kecil untuk seminar.', 25000, 25000, 'aktif'),
(2, 'Paket Seminar B', 'seminar', 'Nasi goreng, es teh, dan roti untuk seminar.', 25000, 25000, 'aktif'),
(3, 'Paket Seminar C', 'seminar', 'Mie goreng, kopi susu kecil, dan snack untuk seminar.', 25000, 25000, 'aktif');

INSERT INTO detail_paket (id_paket, id_produk, jumlah, harga, subtotal) VALUES
(1, 1, 1, 18000, 18000),
(1, 2, 1, 3000, 3000),
(1, 3, 1, 4000, 4000),
(2, 4, 1, 17000, 17000),
(2, 5, 1, 4000, 4000),
(2, 6, 1, 4000, 4000),
(3, 7, 1, 16000, 16000),
(3, 8, 1, 6000, 6000),
(3, 9, 1, 3000, 3000);

-- Akun admin dan sales dibuat otomatis saat server berjalan agar password terenkripsi bcrypt.
-- Email: admin@djaka.com / Password: admin123
-- Email: sales@djaka.com / Password: sales123
