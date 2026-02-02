const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkSchema() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT
    });

    try {
        const [columns] = await connection.execute('SHOW COLUMNS FROM users');
        const fields = columns.map(c => c.Field);
        console.log('Columns in users:', fields);

        if (fields.includes('points')) {
            console.log('SUCCESS: users table has points column.');
        } else {
            console.log('FAILURE: users table MISSING points column.');
            process.exit(1);
        }

    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    } finally {
        await connection.end();
    }
}

checkSchema();
