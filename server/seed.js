const bcrypt = require('bcryptjs');
const pool = require('./config/db');

async function ensureSeedData() {
  await pool.query(`
    INSERT INTO roles (id_role, nama_role)
    VALUES 
      (1, 'admin'),
      (2, 'sales')
    ON DUPLICATE KEY UPDATE
      nama_role = VALUES(nama_role)
  `);

  const accounts = [
    {
      role: 'admin',
      nama: 'Admin Djaka Coffee',
      email: 'admin@djaka.com',
      password: 'admin123',
      no_hp: '081111111111',
      alamat: 'Djaka Coffee'
    },
    {
      role: 'sales',
      nama: 'Sales Djaka Coffee',
      email: 'sales@djaka.com',
      password: 'sales123',
      no_hp: '082222222222',
      alamat: 'Djaka Coffee'
    }
  ];

  for (const account of accounts) {
    const [[role]] = await pool.query(
      'SELECT id_role FROM roles WHERE nama_role = ?',
      [account.role]
    );

    const hashedPassword = await bcrypt.hash(account.password, 10);

    await pool.query(
      `
      INSERT INTO users
      (id_role, nama, email, password, no_hp, alamat, status)
      VALUES (?, ?, ?, ?, ?, ?, 'aktif')
      ON DUPLICATE KEY UPDATE
        id_role = VALUES(id_role),
        nama = VALUES(nama),
        password = VALUES(password),
        no_hp = VALUES(no_hp),
        alamat = VALUES(alamat),
        status = 'aktif'
      `,
      [
        role.id_role,
        account.nama,
        account.email,
        hashedPassword,
        account.no_hp,
        account.alamat
      ]
    );
  }

  console.log('Akun dummy admin dan sales berhasil dibuat/diperbarui.');
}

if (require.main === module) {
  ensureSeedData()
    .then(() => {
      console.log('Seed selesai.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('Seed gagal:', err);
      process.exit(1);
    });
}

module.exports = ensureSeedData;