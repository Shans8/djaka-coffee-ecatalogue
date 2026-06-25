const express = require('express');
const router = express.Router();
const c = require('../controllers/importController');
const { protect } = require('../middleware/authMiddleware');
const { uploadExcel } = require('../middleware/uploadMiddleware');
router.post('/products', protect('admin'), uploadExcel.single('file'), c.importProducts);
router.post('/categories', protect('admin'), uploadExcel.single('file'), c.importCategories);
router.post('/promos', protect('admin'), uploadExcel.single('file'), c.importPromos);
module.exports = router;
