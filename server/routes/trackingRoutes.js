const express = require('express');
const router = express.Router();
const c = require('../controllers/trackingController');
const { protect } = require('../middleware/authMiddleware');
router.get('/:id_pesanan', protect('admin','sales'), c.getByOrder);
router.post('/', protect('admin'), c.create);
router.put('/:id', protect('admin'), c.update);
module.exports = router;
