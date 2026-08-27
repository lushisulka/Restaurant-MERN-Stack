const { pool } = require('../config/db')

const Order = {
    // Helper to format order rows with nested items array matching frontend expectations
    _formatOrdersWithItems: async (orderRows) => {
        if (!orderRows || orderRows.length === 0) return []

        const orderIds = orderRows.map(o => o.id)
        const [itemRows] = await pool.query(
            `SELECT oi.id AS item_id, oi.order_id, oi.quantity, oi.price,
                    m.id AS menu_id, m.name AS menu_name, m.price AS menu_price, m.image AS menu_image, m.category AS menu_category
             FROM order_items oi
             LEFT JOIN menus m ON oi.menu_item_id = m.id
             WHERE oi.order_id IN (?)`,
            [orderIds]
        )

        // Group items by order_id
        const itemsByOrderId = {}
        itemRows.forEach(row => {
            if (!itemsByOrderId[row.order_id]) {
                itemsByOrderId[row.order_id] = []
            }
            itemsByOrderId[row.order_id].push({
                _id: row.item_id,
                id: row.item_id,
                quantity: Number(row.quantity),
                price: Number(row.price),
                menuItem: {
                    _id: row.menu_id,
                    id: row.menu_id,
                    name: row.menu_name || 'Menu Item',
                    price: Number(row.menu_price || row.price),
                    image: row.menu_image || '',
                    category: row.menu_category || ''
                }
            })
        })

        return orderRows.map(o => ({
            id: o.id,
            _id: o.id,
            totalPrice: Number(o.total_price),
            status: o.status,
            address: o.address,
            createdAt: o.created_at,
            updatedAt: o.updated_at,
            user: {
                _id: o.user_id,
                id: o.user_id,
                name: o.user_name || '',
                email: o.user_email || ''
            },
            items: itemsByOrderId[o.id] || []
        }))
    },

    // Create Order with Transaction
    create: async ({ userId, items, totalPrice, address }) => {
        const connection = await pool.getConnection()
        try {
            await connection.beginTransaction()

            // 1. Insert into orders table
            const [orderResult] = await connection.query(
                'INSERT INTO orders (user_id, total_price, status, address) VALUES (?, ?, ?, ?)',
                [userId, totalPrice, 'pending', address]
            )
            const orderId = orderResult.insertId

            // 2. Insert items into order_items
            for (const item of items) {
                const menuItemId = item.menuItem || item.id || item._id
                await connection.query(
                    'INSERT INTO order_items (order_id, menu_item_id, quantity, price) VALUES (?, ?, ?, ?)',
                    [orderId, menuItemId, item.quantity, item.price]
                )
            }

            await connection.commit()
            connection.release()

            return Order.findById(orderId)
        } catch (error) {
            await connection.rollback()
            connection.release()
            throw error
        }
    },

    // Find Order by ID
    findById: async (id) => {
        const [orders] = await pool.query(
            `SELECT o.*, u.name as user_name, u.email as user_email
             FROM orders o
             LEFT JOIN users u ON o.user_id = u.id
             WHERE o.id = ? LIMIT 1`,
            [id]
        )
        if (!orders[0]) return null
        const formatted = await Order._formatOrdersWithItems([orders[0]])
        return formatted[0]
    },

    // Find User's Orders
    findByUserId: async (userId) => {
        const [orders] = await pool.query(
            `SELECT o.*, u.name as user_name, u.email as user_email
             FROM orders o
             LEFT JOIN users u ON o.user_id = u.id
             WHERE o.user_id = ?
             ORDER BY o.created_at DESC`,
            [userId]
        )
        return Order._formatOrdersWithItems(orders)
    },

    // Find All Orders (Admin)
    findAll: async () => {
        const [orders] = await pool.query(
            `SELECT o.*, u.name as user_name, u.email as user_email
             FROM orders o
             LEFT JOIN users u ON o.user_id = u.id
             ORDER BY o.created_at DESC`
        )
        return Order._formatOrdersWithItems(orders)
    },

    // Update Status
    updateStatus: async (id, status) => {
        await pool.query('UPDATE orders SET status = ? WHERE id = ?', [status, id])
        return Order.findById(id)
    },

    // Get Aggregate Order Stats
    getStats: async () => {
        const [rows] = await pool.query(`
            SELECT
                COUNT(*) AS totalOrders,
                COALESCE(SUM(CASE WHEN status != 'cancelled' THEN total_price ELSE 0 END), 0) AS totalRevenue,
                COALESCE(SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END), 0) AS pendingOrders,
                COALESCE(SUM(CASE WHEN status = 'preparing' THEN 1 ELSE 0 END), 0) AS preparingOrders,
                COALESCE(SUM(CASE WHEN status = 'delivered' THEN 1 ELSE 0 END), 0) AS deliveredOrders
            FROM orders
        `)
        const stats = rows[0] || {}
        return {
            totalOrders: Number(stats.totalOrders || 0),
            totalRevenue: Number(parseFloat(stats.totalRevenue || 0).toFixed(2)),
            pendingOrders: Number(stats.pendingOrders || 0),
            preparingOrders: Number(stats.preparingOrders || 0),
            deliveredOrders: Number(stats.deliveredOrders || 0)
        }
    }
}

module.exports = Order