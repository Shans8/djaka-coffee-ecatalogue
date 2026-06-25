const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const ensureSeedData = require('./seed');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/api/health', (_, res) => res.json({ message: 'API Djaka Coffee aktif.' }));
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

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: err.message || 'Terjadi kesalahan server.' });
});

ensureSeedData()
  .then(() => {
    app.listen(PORT, () => console.log(`Server berjalan di http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('Gagal menjalankan seed awal. Pastikan database sudah diimport dan koneksi .env benar.');
    console.error(err);
    process.exit(1);
  });
