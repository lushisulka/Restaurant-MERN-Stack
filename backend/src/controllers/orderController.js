const Order = require('../models/Order')

const createOrder = async (req, res) => {
    try {
        const { items, totalPrice, address } = req.body

        if (!items || !items.length) {
            return res.status(400).json({ message: 'Order must contain at least one item' })
        }

        if (!address || !address.trim()) {
            return res.status(400).json({ message: 'Delivery address is required' })
        }

        const order = await Order.create({
            userId: req.user.id,
            items,
            totalPrice: parseFloat(totalPrice),
            address: address.trim()
        })

        res.status(201).json(order)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.findByUserId(req.user.id)
        res.json(orders)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.findAll()
        res.json(orders)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body
        const validStatuses = ['pending', 'preparing', 'delivered', 'cancelled']
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid order status' })
        }

        const order = await Order.updateStatus(req.params.id, status)
        if (!order) {
            return res.status(404).json({ message: 'Order not found' })
        }

        res.json(order)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

module.exports = { createOrder, getMyOrders, getAllOrders, updateOrderStatus }