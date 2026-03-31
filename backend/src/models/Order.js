const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [
        {
            menuItem: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Menu'
            },
            quantity: {
                type: Number,
                required: true
            },
            price: {
                type: Number,
                required: true
            }
        }
    ],
    totalPrice: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'preparing', 'delivered', 'cancelled'],
        default: 'pending'
    },
    address: {
        type: String,
        required: true
    }
}, { timestamps: true })

module.exports = mongoose.model('Order', orderSchema)