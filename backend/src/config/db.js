const mysql = require('mysql2/promise')
const dotenv = require('dotenv')

dotenv.config()

// Create connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'restaurant',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    decimalNumbers: true,
    timezone: '+00:00'
})

// Initialize database & tables automatically if they do not exist
const initDB = async () => {
    let connection
    try {
        // Test connection without database first to ensure server is alive and create DB if needed
        const rootConnection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            port: parseInt(process.env.DB_PORT || '3306', 10),
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || ''
        })

        const dbName = process.env.DB_NAME || 'restaurant'
        await rootConnection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`)
        await rootConnection.end()

        // Connect using pool to create tables
        connection = await pool.getConnection()
        console.log(`✅ MySQL Connected successfully to database: "${dbName}"`)

        // 1. Users table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                role ENUM('user', 'admin') DEFAULT 'user',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_user_email (email)
            ) ENGINE=InnoDB;
        `)

        // 2. Menus table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS menus (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                price DECIMAL(10, 2) NOT NULL,
                category VARCHAR(100) NOT NULL,
                description TEXT,
                image TEXT,
                is_available BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_menu_category (category)
            ) ENGINE=InnoDB;
        `)

        // 3. Orders table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS orders (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                total_price DECIMAL(10, 2) NOT NULL,
                status ENUM('pending', 'preparing', 'delivered', 'cancelled') DEFAULT 'pending',
                address TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                INDEX idx_order_user (user_id),
                INDEX idx_order_status (status)
            ) ENGINE=InnoDB;
        `)

        // 4. Order Items table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS order_items (
                id INT AUTO_INCREMENT PRIMARY KEY,
                order_id INT NOT NULL,
                menu_item_id INT NOT NULL,
                quantity INT NOT NULL DEFAULT 1,
                price DECIMAL(10, 2) NOT NULL,
                FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
                FOREIGN KEY (menu_item_id) REFERENCES menus(id) ON DELETE RESTRICT,
                INDEX idx_order_item_order (order_id),
                INDEX idx_order_item_menu (menu_item_id)
            ) ENGINE=InnoDB;
        `)

        // 5. Reviews table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS reviews (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                menu_item_id INT NOT NULL,
                rating TINYINT NOT NULL,
                comment TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (menu_item_id) REFERENCES menus(id) ON DELETE CASCADE,
                INDEX idx_review_menu_item (menu_item_id),
                INDEX idx_review_user (user_id)
            ) ENGINE=InnoDB;
        `)

        console.log('✅ MySQL Tables verified and ready.')
    } catch (error) {
        console.error('❌ MySQL Connection / Initialization Error:', error.message)
        if (error.code === 'ECONNREFUSED') {
            console.error('👉 Please make sure your MySQL server is running (e.g. via XAMPP, MySQL service, or Docker) on port ' + (process.env.DB_PORT || 3306))
        }
    } finally {
        if (connection) connection.release()
    }
}

module.exports = { pool, initDB }