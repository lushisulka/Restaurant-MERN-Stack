const express = require('express')
const router = express.Router()
const { auth, adminOnly } = require('../middleware/auth')

router.get('/dashboard', auth, adminOnly, (req, res) => {
    res.json({ message: 'Welcome Admin!' })
})

const adminRoutes = require('./routes/admin')
app.use('/api/admin', adminRoutes)

module.exports = router