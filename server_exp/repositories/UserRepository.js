const DbContext = require('../db/DbContext');

class UserRepository {
  async getUserByEmail (email) {
    const { rows } = await DbContext.query(
      `SELECT id,
              username,
              email,
              password_hash          
         FROM users
        WHERE email = $1
        LIMIT 1`,
      [email.trim()]
    );
    return rows[0] || null;
  }

  async createUser({ username, email, passwordHash }) {
  const { rows } = await DbContext.query(
    `INSERT INTO users (username, email, password_hash)
     VALUES ($1, $2, $3)
     RETURNING id, username, email`,
    [username.trim(), email.trim(), passwordHash]
  );
  return rows[0];
}
}

module.exports = new UserRepository();
