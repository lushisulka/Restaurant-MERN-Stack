const { pool } = require('../config/db')

const Menu = {
    // Find all with optional category and search filters
    findAll: async ({ category, search } = {}) => {
        let sql = 'SELECT id, id AS _id, name, price, category, description, image, is_available AS isAvailable, created_at AS createdAt, updated_at AS updatedAt FROM menus WHERE 1=1'
        const params = []

        if (category && category.toLowerCase() !== 'all') {
            sql += ' AND LOWER(category) = LOWER(?)'
            params.push(category)
        }

        if (search && search.trim()) {
            sql += ' AND (name LIKE ? OR description LIKE ?)'
            const term = `%${search.trim()}%`
            params.push(term, term)
        }

        sql += ' ORDER BY created_at DESC'

        const [rows] = await pool.query(sql, params)
        return rows.map(item => ({
            ...item,
            price: Number(item.price),
            isAvailable: Boolean(item.isAvailable)
        }))
    },

    // Find by Category
    findByCategory: async (category) => {
        const [rows] = await pool.query(
            'SELECT id, id AS _id, name, price, category, description, image, is_available AS isAvailable, created_at AS createdAt, updated_at AS updatedAt FROM menus WHERE LOWER(category) = LOWER(?) ORDER BY created_at DESC',
            [category]
        )
        return rows.map(item => ({
            ...item,
            price: Number(item.price),
            isAvailable: Boolean(item.isAvailable)
        }))
    },

    // Find by ID
    findById: async (id) => {
        const [rows] = await pool.query(
            'SELECT id, id AS _id, name, price, category, description, image, is_available AS isAvailable, created_at AS createdAt, updated_at AS updatedAt FROM menus WHERE id = ? LIMIT 1',
            [id]
        )
        if (!rows[0]) return null
        return {
            ...rows[0],
            price: Number(rows[0].price),
            isAvailable: Boolean(rows[0].isAvailable)
        }
    },

    // Create item
    create: async ({ name, price, category, description = '', image = '', isAvailable = true }) => {
        const [result] = await pool.query(
            'INSERT INTO menus (name, price, category, description, image, is_available) VALUES (?, ?, ?, ?, ?, ?)',
            [name, price, category, description, image, isAvailable ? 1 : 0]
        )
        return Menu.findById(result.insertId)
    },

    // Update item
    update: async (id, fields) => {
        const updates = []
        const params = []

        if (fields.name !== undefined) {
            updates.push('name = ?')
            params.push(fields.name)
        }
        if (fields.price !== undefined) {
            updates.push('price = ?')
            params.push(fields.price)
        }
        if (fields.category !== undefined) {
            updates.push('category = ?')
            params.push(fields.category)
        }
        if (fields.description !== undefined) {
            updates.push('description = ?')
            params.push(fields.description)
        }
        if (fields.image !== undefined) {
            updates.push('image = ?')
            params.push(fields.image)
        }
        if (fields.isAvailable !== undefined) {
            updates.push('is_available = ?')
            params.push(fields.isAvailable ? 1 : 0)
        }

        if (updates.length === 0) return Menu.findById(id)

        params.push(id)
        await pool.query(
            `UPDATE menus SET ${updates.join(', ')} WHERE id = ?`,
            params
        )
        return Menu.findById(id)
    },

    // Delete item
    delete: async (id) => {
        const [result] = await pool.query('DELETE FROM menus WHERE id = ?', [id])
        return result.affectedRows > 0
    },

    // Count all items
    count: async () => {
        const [rows] = await pool.query('SELECT COUNT(*) as count FROM menus')
        return rows[0]?.count || 0
    }
}

module.exports = Menu