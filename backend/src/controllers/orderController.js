const Order = require('../models/Order')

const createOrder = async (req, res) => {
    try {
        const { items, totalPrice, address } = req.body

        const order = await Order.create({
            user: req.user.id,
            items,
            totalPrice,
            address
        })

        res.status(201).json(order)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id }).populate('items.menuItem')
        res.json(orders)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('user', 'name email')
            .populate('items.menuItem')
        res.json(orders)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const updateOrderStatus = async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true }
        )
        res.json(order)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

module.exports = { createOrder, getMyOrders, getAllOrders, updateOrderStatus }