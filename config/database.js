// Import package
require('dotenv').config();
const mysql = require('mysql2');

const pool = mysql.createPool(
    {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    }
);

// Connect
pool.getConnection((err, connection) => {
    if (err) {
        console.log('Error connecting to the database: ', err.stack);
        return;
    }
    console.log('Successfully connected to the database as ID', connection.threadId);
    connection.release(); 
});

// Export the connection
module.exports = pool.promise();