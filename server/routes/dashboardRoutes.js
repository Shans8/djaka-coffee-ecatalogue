const express = require('express');
const router = express.Router();
const c = require('../controllers/dashboardController');
const { protect } = require('../middleware/authMiddleware');
router.get('/admin', protect('admin'), c.admin);
router.get('/sales', protect('sales'), c.sales);
module.exports = router;
