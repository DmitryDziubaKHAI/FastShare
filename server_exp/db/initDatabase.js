// db/initDatabase.js
const { Client } = require('pg');

/* ——— конфіг ——————————————————————————————————————————————— */
const DB_CONFIG = {
  user    : process.env.DB_USER     || 'postgres',
  host    : process.env.DB_HOST     || 'localhost',
  password: process.env.DB_PASSWORD || 'postgres',
  port    : parseInt(process.env.DB_PORT || '5432', 10),
  database: process.env.DB_NAME     || 'fastshare',
};

/* ——— service helpers ————————————————————————————————————————— */
async function tableExists (client, name) {
  const { rows } = await client.query(`
    SELECT 1 FROM information_schema.tables
     WHERE table_name = $1
       AND table_schema = 'public' LIMIT 1;
  `, [name]);
  return rows.length > 0;
}

async function columnExists (client, table, column) {
  const { rows } = await client.query(`
    SELECT 1 FROM information_schema.columns
     WHERE table_name  = $1
       AND column_name = $2
       AND table_schema = 'public' LIMIT 1;
  `, [table, column]);
  return rows.length > 0;
}

/* ——— main routine ————————————————————————————————————————— */
module.exports = async function initializeDatabase () {
  const client = new Client(DB_CONFIG);

  /* — retries — */
  let retries = 5;
  while (retries) {
    try { await client.connect(); break; }
    catch (e) {
      console.log(`Failed to connect, retrying… (${--retries} left)`); 
      if (!retries) throw e;
      await new Promise(r => setTimeout(r, 5_000));
    }
  }
  console.log('Connected to PostgreSQL.');

  /* — users — */
  if (!(await tableExists(client, 'users'))) {
    console.log('Creating table: users');
    await client.query(`
      CREATE TABLE users (
        id            SERIAL PRIMARY KEY,
        username      varchar(50)  UNIQUE NOT NULL,
        email         varchar(100) UNIQUE NOT NULL,
        password_hash text         NOT NULL,
        created_at    timestamptz  DEFAULT now()
      );
    `);
  }

  /* — files — */
  if (!(await tableExists(client, 'files'))) {
    console.log('Creating table: files');
    await client.query(`
      CREATE TABLE files (
        id           SERIAL PRIMARY KEY,
        filename     text        NOT NULL,
        file         bytea       NOT NULL,
        password     text        NOT NULL,
        uploaded_at  timestamptz DEFAULT now(),
        user_id      integer     REFERENCES users(id) ON DELETE SET NULL,
        content_type text
      );
    `);
  } else {
    /* ensure user_id */
    if (!(await columnExists(client, 'files', 'user_id'))) {
      console.log('Adding column user_id to files…');
      await client.query(`
        ALTER TABLE files
          ADD COLUMN user_id integer
          REFERENCES users(id) ON DELETE SET NULL;
      `);
    }
    /* ensure content_type */
    if (!(await columnExists(client, 'files', 'content_type'))) {
      console.log('Adding column content_type to files…');
      await client.query(`
        ALTER TABLE files
          ADD COLUMN content_type text;
      `);
    }
  }

  console.log('Database schema is up-to-date.');
  await client.end();
};
