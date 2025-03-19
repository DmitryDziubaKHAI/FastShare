const dbFactory = require('./DbFactory');

class DbContext {
    constructor() {
        if (!DbContext.instance) {
            this.pool = dbFactory.getPool();
            DbContext.instance = this;
        }
        return DbContext.instance;
    }

    async query(text, params) {
        const client = await this.pool.connect();
        try {
            const result = await client.query(text, params);
            return {
                rows: result.rows,
                rowCount: result.rowCount,
                command: result.command
            };
        } catch (error) {
            console.error('Query error:', error);
            throw error;
        } finally {
            client.release();
        }
    }
}

const dbContext = new DbContext();
Object.freeze(dbContext); // Запобігаємо зміні об'єкта implementation of Singleton, який ми можемо передавати в конструктори репозиторіїв "умовний DI"
module.exports = dbContext;
