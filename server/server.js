const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const ensureSeedData = require('./seed');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Folder upload gambar
app.use(
  '/uploads',
  express.static(path.join(__dirname, 'uploads'))
);

// Pemeriksaan API
app.get('/api/health', (req, res) => {
  res.json({
    message: 'API Djaka Coffee aktif.'
  });
});

// Route API
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/promos', require('./routes/promoRoutes'));
app.use('/api/packages', require('./routes/packageRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/tracking', require('./routes/trackingRoutes'));
app.use('/api/import', require('./routes/importRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));

// Menampilkan hasil build React
app.use(
  express.static(path.join(__dirname, '../dist'))
);

// Semua halaman React diarahkan ke index.html
app.get(/.*/, (req, res) => {
  res.sendFile(
    path.join(__dirname, '../dist/index.html')
  );
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);

  res.status(500).json({
    message: err.message || 'Terjadi kesalahan server.'
  });
});

// Buat akun dummy, kemudian jalankan server
ensureSeedData()
  .then(() => {
    console.log('Seed akun admin dan sales berhasil diperiksa.');

    app.listen(PORT, () => {
      console.log(`Server berjalan di port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Gagal menjalankan seed awal.');
    console.error(err);
    process.exit(1);
  });