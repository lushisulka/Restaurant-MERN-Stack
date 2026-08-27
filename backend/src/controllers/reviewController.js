const Review = require('../models/Review')

const createReview = async (req, res) => {
    try {
        const { menuItem, rating, comment } = req.body

        if (!menuItem || !rating || !comment) {
            return res.status(400).json({ message: 'Menu item, rating, and comment are required' })
        }

        const review = await Review.create({
            userId: req.user.id,
            menuItemId,
            rating: parseInt(rating, 10),
            comment: comment.trim()
        })

        res.status(201).json(review)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const getReviewsByMenuItem = async (req, res) => {
    try {
        const reviews = await Review.findByMenuItemId(req.params.menuItemId)
        res.json(reviews)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.findAll(20)
        res.json(reviews)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const deleteReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id)
        if (!review) {
            return res.status(404).json({ message: 'Review not found' })
        }

        // Allow owner of review or admin to delete
        if (review.user?.id !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to delete this review' })
        }

        await Review.delete(req.params.id)
        res.json({ message: 'Review deleted successfully' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

module.exports = { createReview, getReviewsByMenuItem, getAllReviews, deleteReview }