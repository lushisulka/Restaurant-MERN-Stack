const express = require('express')
const router = express.Router()
const { getAllMenuItems, getMenuByCategory, createMenuItem, updateMenuItem, deleteMenuItem } = require('../controllers/menuController')
const { protect, adminOnly } = require('../middleware/authMiddleware')

router.get('/', getAllMenuItems)
router.get('/category/:category', getMenuByCategory)
router.post('/', protect, adminOnly, createMenuItem)
router.put('/:id', protect, adminOnly, updateMenuItem)
router.delete('/:id', protect, adminOnly, deleteMenuItem)

module.exports = router