const Menu = require('../models/Menu')

const getAllMenuItems = async (req, res) => {
    try {
        const items = await Menu.find({ available: true })
        res.json(items)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const getMenuByCategory = async (req, res) => {
    try {
        const items = await Menu.find({ category: req.params.category, available: true })
        res.json(items)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const createMenuItem = async (req, res) => {
    try {
        const item = await Menu.create(req.body)
        res.status(201).json(item)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const updateMenuItem = async (req, res) => {
    try {
        const item = await Menu.findByIdAndUpdate(req.params.id, req.body, { new: true })
        res.json(item)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const deleteMenuItem = async (req, res) => {
    try {
        await Menu.findByIdAndDelete(req.params.id)
        res.json({ message: 'Item deleted successfully' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

module.exports = { getAllMenuItems, getMenuByCategory, createMenuItem, updateMenuItem, deleteMenuItem }