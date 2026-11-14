
const pool = require('../services/mysql.service');
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 12;

async function migratePasswords() {
  try {
    const [users] = await pool.query(
      'SELECT user_id, password FROM users'
    );

    let migrated = 0;
    let skipped = 0;

    for (const user of users) {

      if (/^\$2[aby]\$/.test(user.password)) {
        skipped++;
        continue;
      }

      const hashedPassword = await bcrypt.hash(
        user.password,
        SALT_ROUNDS
      );

      await pool.query(
        'UPDATE users SET password = ? WHERE user_id = ?',
        [hashedPassword, user.user_id]
      );

      migrated++;
    }

    console.log('Migration completed.');
    console.log('Passwords migrated:', migrated);
    console.log('Passwords skipped:', skipped);

  } catch (error) {
    console.error('Error during migration:', error);
    process.exitCode = 1;

  } finally {
    await pool.end();
  }
}

migratePasswords();
