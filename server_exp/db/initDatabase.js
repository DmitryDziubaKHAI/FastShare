const { Client } = require('pg');

// Конфігурація з використанням змінних середовища або значень за замовчуванням
const DB_NAME = process.env.DB_NAME || 'fastshare';
const DB_CONFIG = {
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    password: process.env.DB_PASSWORD || 'postgres',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: DB_NAME,
};

async function initializeDatabase() {
    const client = new Client(DB_CONFIG);
    try {
        let retries = 5;
        while (retries > 0) {
            try {
                await client.connect();
                break;
            } catch (err) {
                console.log(`Failed to connect to PostgreSQL, retrying... (${retries} attempts left)`);
                retries -= 1;
                await new Promise(res => setTimeout(res, 5000)); 
            }
        }
        
        if (retries === 0) {
            throw new Error('Failed to connect to PostgreSQL after multiple attempts');
        }

        console.log('Connected to FastShare database.');

        const usersTableCheck = await client.query(`
            SELECT EXISTS (
                SELECT FROM information_schema.tables
                WHERE table_name = 'users'
            );
        `);

        if (!usersTableCheck.rows[0].exists) {
            console.log('Creating table: users');
            await client.query(`
                CREATE TABLE users (
                                       id SERIAL PRIMARY KEY,
                                       username VARCHAR(50) UNIQUE NOT NULL,
                                       email VARCHAR(100) UNIQUE NOT NULL,
                                       password_hash TEXT NOT NULL,
                                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            `);
            console.log('Table users created successfully.');
        } else {
            console.log('Table users already exists.');
        }

        const filesTableCheck = await client.query(`
            SELECT EXISTS (
                SELECT FROM information_schema.tables
                WHERE table_name = 'files'
            );
        `);

        if (!filesTableCheck.rows[0].exists) {
            console.log('Creating table: files');
            await client.query(`
                CREATE TABLE files (
                    id SERIAL PRIMARY KEY,
                    filename TEXT NOT NULL,
                    file BYTEA NOT NULL,
                    password TEXT NOT NULL,
                    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            `);
            console.log('Table files created successfully.');
        } else {
            console.log('Table files already exists.');
        }

    } catch (error) {
        console.error('Database initialization error:', error);
        throw error;
    } finally {
        await client.end();
    }
}

module.exports = initializeDatabase;
