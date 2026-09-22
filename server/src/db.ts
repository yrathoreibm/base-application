import path from 'path';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

// Load .env from the project root (one level above /server)
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

/**
 * Shared MySQL connection pool.
 * Reads all connection settings from environment variables — never hardcoded.
 */
const pool = mysql.createPool({
  host: process.env['DB_HOST'] ?? '127.0.0.1',
  port: parseInt(process.env['DB_PORT'] ?? '3306', 10),
  database: process.env['DB_NAME'],
  user: process.env['DB_USER'],
  password: process.env['DB_PASSWORD'],
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;

// Made with Bob
