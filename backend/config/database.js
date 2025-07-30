const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'equipment_rental',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    timezone: 'Z'
});

// Database schema creation
const createTables = async () => {
    const connection = await pool.getConnection();
    
    try {
        console.log('🔄 Criando tabelas do banco de dados...');
        
        // Users table
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                role ENUM('admin', 'manager', 'operator') DEFAULT 'operator',
                active BOOLEAN DEFAULT true,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);

        // Equipment categories table
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS equipment_categories (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                description TEXT,
                active BOOLEAN DEFAULT true
            )
        `);

        // Equipment table
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS equipment (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                category_id INT,
                description TEXT,
                serial_number VARCHAR(100) UNIQUE,
                brand VARCHAR(100),
                model VARCHAR(100),
                daily_price DECIMAL(10,2) NOT NULL,
                weekly_price DECIMAL(10,2),
                monthly_price DECIMAL(10,2),
                status ENUM('available', 'rented', 'maintenance', 'inactive') DEFAULT 'available',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (category_id) REFERENCES equipment_categories(id)
            )
        `);

        // Clients table
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS clients (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255),
                phone VARCHAR(20),
                document VARCHAR(20) UNIQUE NOT NULL,
                address TEXT,
                active BOOLEAN DEFAULT true,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Insert default categories
        await connection.execute(`
            INSERT IGNORE INTO equipment_categories (name, description) VALUES
            ('Betoneiras', 'Equipamentos para mistura de concreto'),
            ('Ferramentas Elétricas', 'Furadeiras, parafusadeiras, serras'),
            ('Compactadores', 'Equipamentos para compactação'),
            ('Andaimes', 'Estruturas para trabalho em altura'),
            ('Geradores', 'Equipamentos para geração de energia')
        `);

        // Insert default admin user (senha: admin123)
        await connection.execute(`
            INSERT IGNORE INTO users (name, email, password, role) VALUES
            ('Administrador', 'admin@equipamentos.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeWmYLy.c7wH.8i9e', 'admin')
        `);

        console.log('✅ Tabelas criadas com sucesso!');
    } catch (error) {
        console.error('❌ Erro ao criar tabelas:', error);
        throw error;
    } finally {
        connection.release();
    }
};

module.exports = { pool, createTables };
