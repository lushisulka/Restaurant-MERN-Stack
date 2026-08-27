const express = require('express')
const router = express.Router()
const { createReview, getReviewsByMenuItem, getAllReviews, deleteReview } = require('../controllers/reviewController')
const { protect } = require('../middleware/authMiddleware')

router.get('/', getAllReviews)
router.get('/:menuItemId', getReviewsByMenuItem)
router.post('/', protect, createReview)
router.delete('/:id', protect, deleteReview)

module.exports = router