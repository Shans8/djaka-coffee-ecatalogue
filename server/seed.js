import bcrypt from 'bcryptjs';
import pool from './config/db.js';

async function ensureSeedData() {
  await pool.query(`
    INSERT IGNORE INTO roles (id_role, nama_role)
    VALUES (1, 'admin'), (2, 'sales')
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

    const [existing] = await pool.query(
      'SELECT id_user FROM users WHERE email = ?',
      [account.email]
    );

    if (!existing.length) {
      const hashedPassword = await bcrypt.hash(account.password, 10);

      await pool.query(
        `INSERT INTO users
         (id_role, nama, email, password, no_hp, alamat, status)
         VALUES (?, ?, ?, ?, ?, ?, 'aktif')`,
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
  }
}

export default ensureSeedData;

if (process.argv[1] && process.argv[1].endsWith('seed.js')) {
  ensureSeedData()
    .then(() => {
      console.log('Seed akun admin dan sales berhasil dibuat/diperiksa.');
      process.exit(0);
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}