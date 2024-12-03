import mysql from 'mysql2/promise';
import crypto from 'crypto';

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '17/Juin/2006',
    database: 'health_db',
};

const connectionPool = mysql.createPool(dbConfig);

async function initDb() { 
    const connection = await connectionPool.getConnection();
    try { 
        await connection.query(`CREATE DATABASE IF NOT EXISTS health_db`);
        await connection.query(`USE health_db`);
        await connection.execute(`CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255),
            email VARCHAR(255)
        )`);
        await connection.query(`USE health_db`);
        await connection.execute(`CREATE TABLE IF NOT EXISTS nutrition(
            sexe VARCHAR(12),
            taille integer NOT NULL,
            age integer NOT NULL, 
            poids integer NOT NULL,
            activity VARCHAR(50),
            user_id INT
        )`);
    } catch (err) { 
        console.error("Erreur lors de l'initialisation de la base de données :", err.message);
    } finally { 
        connection.release(); 
    }
}

initDb();

async function displayUsers ()  { 
    const connection = await connectionPool.getConnection();
    try { 
        const [rows] = await connection.execute('SELECT * FROM users');
        const [rows1] = await connection.execute('SELECT * FROM nutrition');
        console.log(rows);
        console.log(rows1);
    }
    catch (err) { 
        console.error(err.message);
    }
    finally { 
        connection.release();
    }
}
 
displayUsers();

export { connectionPool }