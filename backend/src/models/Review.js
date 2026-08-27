const { pool } = require('../config/db')

const Review = {
    // Create a review
    create: async ({ userId, menuItemId, rating, comment }) => {
        const [result] = await pool.query(
            'INSERT INTO reviews (user_id, menu_item_id, rating, comment) VALUES (?, ?, ?, ?)',
            [userId, menuItemId, rating, comment]
        )
        return Review.findById(result.insertId)
    },

    // Find review by ID
    findById: async (id) => {
        const [rows] = await pool.query(
            `SELECT r.*, r.id AS _id, r.user_id, r.menu_item_id,
                    u.name as user_name, u.email as user_email
             FROM reviews r
             LEFT JOIN users u ON r.user_id = u.id
             WHERE r.id = ? LIMIT 1`,
            [id]
        )
        if (!rows[0]) return null
        const r = rows[0]
        return {
            id: r.id,
            _id: r.id,
            rating: Number(r.rating),
            comment: r.comment,
            createdAt: r.created_at,
            updatedAt: r.updated_at,
            menuItem: r.menu_item_id,
            user: {
                id: r.user_id,
                _id: r.user_id,
                name: r.user_name || 'Guest User'
            }
        }
    },

    // Find reviews by MenuItem
    findByMenuItemId: async (menuItemId) => {
        const [rows] = await pool.query(
            `SELECT r.*, r.id AS _id, u.name as user_name
             FROM reviews r
             LEFT JOIN users u ON r.user_id = u.id
             WHERE r.menu_item_id = ?
             ORDER BY r.created_at DESC`,
            [menuItemId]
        )
        return rows.map(r => ({
            id: r.id,
            _id: r.id,
            rating: Number(r.rating),
            comment: r.comment,
            createdAt: r.created_at,
            updatedAt: r.updated_at,
            menuItem: r.menu_item_id,
            user: {
                id: r.user_id,
                _id: r.user_id,
                name: r.user_name || 'Guest User'
            }
        }))
    },

    // Find all recent reviews
    findAll: async (limit = 20) => {
        const [rows] = await pool.query(
            `SELECT r.*, r.id AS _id, u.name as user_name, m.name as menu_name
             FROM reviews r
             LEFT JOIN users u ON r.user_id = u.id
             LEFT JOIN menus m ON r.menu_item_id = m.id
             ORDER BY r.created_at DESC
             LIMIT ?`,
            [limit]
        )
        return rows.map(r => ({
            id: r.id,
            _id: r.id,
            rating: Number(r.rating),
            comment: r.comment,
            createdAt: r.created_at,
            updatedAt: r.updated_at,
            menuItem: {
                id: r.menu_item_id,
                _id: r.menu_item_id,
                name: r.menu_name || 'Dish'
            },
            user: {
                id: r.user_id,
                _id: r.user_id,
                name: r.user_name || 'Guest User'
            }
        }))
    },

    // Delete review
    delete: async (id) => {
        const [result] = await pool.query('DELETE FROM reviews WHERE id = ?', [id])
        return result.affectedRows > 0
    }
}

module.exports = Review