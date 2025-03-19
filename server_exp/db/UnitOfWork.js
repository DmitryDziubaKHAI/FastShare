const dbFactory = require('./DbFactory');

class UnitOfWork {
    constructor() {
        this.pool = dbFactory.getPool();
    }

    async transaction(callback) {
        const client = await this.pool.connect();
        try {
            await client.query('BEGIN');
            const result = await callback(client);
            await client.query('COMMIT');
            return result;
        } catch (error) {
            await client.query('ROLLBACK');
            console.error('Transaction error:', error);
            throw error;
        } finally {
            client.release();
        }
    }
}

module.exports = new UnitOfWork();
