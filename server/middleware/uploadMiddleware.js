const multer = require('multer');
const path = require('path');
const fs = require('fs');

const productDir = path.join(__dirname, '../uploads/products');
fs.mkdirSync(productDir, { recursive: true });

const productStorage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, productDir),
  filename: (_, file, cb) => cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`)
});

const imageFilter = (_, file, cb) => {
  if (!file.mimetype.startsWith('image/')) return cb(new Error('File harus berupa gambar.'));
  cb(null, true);
};

const excelFilter = (_, file, cb) => {
  const allowed = ['.xlsx', '.xls'];
  if (!allowed.includes(path.extname(file.originalname).toLowerCase())) return cb(new Error('File harus berupa Excel .xlsx atau .xls.'));
  cb(null, true);
};

const uploadProductImage = multer({ storage: productStorage, fileFilter: imageFilter });
const uploadExcel = multer({ storage: multer.memoryStorage(), fileFilter: excelFilter });

module.exports = { uploadProductImage, uploadExcel };
