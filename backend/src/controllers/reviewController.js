const Review = require('../models/Review')

const createReview = async (req, res) => {
    try {
        const { menuItem, rating, comment } = req.body

        const review = await Review.create({
            user: req.user.id,
            menuItem,
            rating,
            comment
        })

        res.status(201).json(review)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const getReviewsByMenuItem = async (req, res) => {
    try {
        const reviews = await Review.find({ menuItem: req.params.menuItemId })
            .populate('user', 'name')
        res.json(reviews)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const deleteReview = async (req, res) => {
    try {
        await Review.findByIdAndDelete(req.params.id)
        res.json({ message: 'Review deleted successfully' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

module.exports = { createReview, getReviewsByMenuItem, deleteReview }