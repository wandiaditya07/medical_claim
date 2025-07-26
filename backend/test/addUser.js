// add-user.js
const bcrypt = require('bcrypt');
const db = require('../config/db');

async function addUser() {
  const username = 'employee_user';
  const password = 'employee123';
  const fullname = 'Rusdi Ngawi';
  const role = "KARYAWAN";

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.execute('INSERT INTO users (username, password_hash, full_name, role) VALUES (?, ?, ?)', [username, hashedPassword, fullname, role]);
    console.log(`User '${username}' berhasil ditambahkan dengan ID: ${result.insertId}`);
  } catch (err) {
    console.error('Gagal menambahkan user:', err);
  } finally {
    process.exit();
  }
}

addUser();
