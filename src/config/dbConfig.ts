import mysql from 'mysql2/promise';
import { env } from './envConfig';

const pool = mysql.createPool({
    host: env.db.host,
    port: Number(env.db.port),
    user: env.db.user,
    password: env.db.password,
    database: env.db.database,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const testConnection = async () => {
    try {
        await pool.getConnection();
        console.log('Conexión a la base de datos exitosa ✅');
    } catch (error) {
        console.error('Error al conectar a la base de datos:', error + '❌');
        throw error;
    }
};

export { pool, testConnection };
