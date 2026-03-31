const express = require('express')
const router = express.Router()
const { createReview, getReviewsByMenuItem, deleteReview } = require('../controllers/reviewController')
const { protect, adminOnly } = require('../middleware/authMiddleware')

router.post('/', protect, createReview)
router.get('/:menuItemId', getReviewsByMenuItem)
router.delete('/:id', protect, adminOnly, deleteReview)

module.exports = router