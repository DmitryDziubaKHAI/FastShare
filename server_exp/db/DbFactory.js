// Фабрика (Factory Pattern) потрібна для централізованого створення та управління підключеннями до бази даних

const { Pool } = require('pg');

// Конфігурація з використанням змінних середовища або значень за замовчуванням
const DB_CONFIG = {
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'fastshare',
    password: process.env.DB_PASSWORD || 'postgres',
    port: parseInt(process.env.DB_PORT || '5432'),
};

class DbFactory {
    constructor() {
        if (!DbFactory.instance) {
            console.log('Connecting to PostgreSQL at:', `${DB_CONFIG.host}:${DB_CONFIG.port}`);
            this.pool = new Pool(DB_CONFIG);
            DbFactory.instance = this;
        }
        return DbFactory.instance;
    }

    getPool() {
        return this.pool;
    }
}

const dbFactory = new DbFactory();
Object.freeze(dbFactory);
module.exports = dbFactory;
