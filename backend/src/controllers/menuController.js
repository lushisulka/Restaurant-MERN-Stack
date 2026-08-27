const Menu = require('../models/Menu')

// GET ALL (with optional search and category query)
exports.getAllMenuItems = async (req, res) => {
    try {
        const { category, search } = req.query
        const items = await Menu.findAll({ category, search })
        res.json(items)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// GET BY CATEGORY
exports.getMenuByCategory = async (req, res) => {
    try {
        const items = await Menu.findByCategory(req.params.category)
        res.json(items)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// GET BY ID
exports.getMenuItemById = async (req, res) => {
    try {
        const item = await Menu.findById(req.params.id)
        if (!item) {
            return res.status(404).json({ message: 'Menu item not found' })
        }
        res.json(item)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// CREATE
exports.createMenuItem = async (req, res) => {
    try {
        const { name, price, category, description, image, isAvailable } = req.body

        if (!name || price === undefined || !category) {
            return res.status(400).json({ message: 'Name, price, and category are required' })
        }

        const item = await Menu.create({
            name: name.trim(),
            price: parseFloat(price),
            category: category.trim(),
            description: description || '',
            image: image || '',
            isAvailable: isAvailable !== undefined ? isAvailable : true
        })

        res.status(201).json(item)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// UPDATE
exports.updateMenuItem = async (req, res) => {
    try {
        const existing = await Menu.findById(req.params.id)
        if (!existing) {
            return res.status(404).json({ message: 'Menu item not found' })
        }

        const item = await Menu.update(req.params.id, req.body)
        res.json(item)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// DELETE
exports.deleteMenuItem = async (req, res) => {
    try {
        const existing = await Menu.findById(req.params.id)
        if (!existing) {
            return res.status(404).json({ message: 'Menu item not found' })
        }

        await Menu.delete(req.params.id)
        res.json({ message: 'Menu item deleted successfully' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}