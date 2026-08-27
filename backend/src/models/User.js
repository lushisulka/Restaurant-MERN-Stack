const { pool } = require('../config/db')

const User = {
    // Find user by email
    findByEmail: async (email) => {
        const [rows] = await pool.query(
            'SELECT id, id AS _id, name, email, password, role, created_at, updated_at FROM users WHERE email = ? LIMIT 1',
            [email]
        )
        return rows[0] || null
    },

    // Find user by ID
    findById: async (id) => {
        const [rows] = await pool.query(
            'SELECT id, id AS _id, name, email, role, created_at, updated_at FROM users WHERE id = ? LIMIT 1',
            [id]
        )
        return rows[0] || null
    },

    // Create user
    create: async ({ name, email, password, role = 'user' }) => {
        const [result] = await pool.query(
            'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
            [name, email, password, role]
        )
        return {
            id: result.insertId,
            _id: result.insertId,
            name,
            email,
            role
        }
    },

    // Count users
    count: async (role = 'user') => {
        const [rows] = await pool.query(
            'SELECT COUNT(*) as count FROM users WHERE role = ?',
            [role]
        )
        return rows[0]?.count || 0
    }
}

module.exports = User