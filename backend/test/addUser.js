// add-user.js
const bcrypt = require('bcrypt');
const db = require('./db');

async function addUser() {
  const username = 'cashier_sue';
  const password = 'login123';
  const roleid = 5;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.execute('INSERT INTO users (username, password_hash, role_id) VALUES (?, ?, ?)', [username, hashedPassword, roleid]);
    console.log(`User '${username}' berhasil ditambahkan dengan ID: ${result.insertId}`);
  } catch (err) {
    console.error('Gagal menambahkan user:', err);
  } finally {
    process.exit();
  }
}

addUser();
