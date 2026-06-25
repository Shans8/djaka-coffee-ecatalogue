import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import promoRoutes from './routes/promoRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import trackingRoutes from './routes/trackingRoutes.js';
import packageRoutes from './routes/packageRoutes.js';
import importRoutes from './routes/importRoutes.js';
import userRoutes from './routes/userRoutes.js';

dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Folder upload gambar produk
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// =======================
// ROUTE API
// =======================
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/promos', promoRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/tracking', trackingRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/import', importRoutes);
app.use('/api/users', userRoutes);

// =======================
// FRONTEND REACT BUILD
// Taruh di sini, setelah semua API
// =======================
app.use(express.static(path.join(__dirname, '../dist')));

app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// =======================
// SERVER LISTEN
// =======================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});