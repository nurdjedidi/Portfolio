import mysql from 'mysql2/promise';
import crypto from 'crypto';

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '17/Juin/2006',
    database: 'clients',
};

const connectionPool = mysql.createPool(dbConfig);

export { connectionPool }