const bcrypt = require('bcrypt');
const dbContext = require('../db/DbContext');
const User = require('../models/User');

class UserRepository {
    constructor(dbContext) {
        this.dbContext = dbContext;
    }

    async createUser(username, email, password) {
        const passwordHash = await bcrypt.hash(password, 10);

        const result = await this.dbContext.query(
            `INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING *`,
            [username, email, passwordHash]
        );

        return result.rows.length > 0 ? new User(...Object.values(result.rows[0])) : null;
    }

    async getUserByEmail(email) {
        const result = await this.dbContext.query(
            `SELECT * FROM users WHERE email = $1`,
            [email]
        );

        return result.rows.length > 0 ? new User(...Object.values(result.rows[0])) : null;
    }

    async verifyPassword(user, password) {
        return await bcrypt.compare(password, user.passwordHash);
    }
}

module.exports = new UserRepository(dbContext);
