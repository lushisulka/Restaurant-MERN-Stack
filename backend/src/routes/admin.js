const express = require('express')
const router = express.Router()
const { protect, adminOnly } = require('../middleware/authMiddleware')
const Order = require('../models/Order')
const Menu = require('../models/Menu')
const User = require('../models/User')

router.get('/dashboard', protect, adminOnly, (req, res) => {
    res.json({ message: 'Welcome Admin!' })
})

// GET ADMIN DASHBOARD STATS
router.get('/stats', protect, adminOnly, async (req, res) => {
    try {
        const totalUsers = await User.count('user')
        const totalMenuItems = await Menu.count()
        const orderStats = await Order.getStats()

        res.json({
            totalUsers,
            totalMenuItems,
            totalOrders: orderStats.totalOrders,
            totalRevenue: orderStats.totalRevenue,
            pendingOrders: orderStats.pendingOrders,
            preparingOrders: orderStats.preparingOrders,
            deliveredOrders: orderStats.deliveredOrders
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

module.exports = router