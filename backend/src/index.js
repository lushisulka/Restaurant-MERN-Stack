const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const { initDB } = require('./config/db')

dotenv.config()
initDB()

const app = express()

// Middleware
app.use(cors({
    origin: true,
    credentials: true
}))
app.use(express.json())

// Routes
app.use('/api/auth', require('./routes/authRoutes'))
app.use('/api/menu', require('./routes/menuRoutes'))
app.use('/api/orders', require('./routes/orderRoutes'))
app.use('/api/reviews', require('./routes/reviewRoutes'))
app.use('/api/admin', require('./routes/admin'))

app.get('/', (req, res) => {
    res.json({ message: 'Restaurant API is running smoothly...' })
})

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error'
    })
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})