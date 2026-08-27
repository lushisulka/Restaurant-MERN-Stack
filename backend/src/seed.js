const bcrypt = require('bcryptjs')
const dotenv = require('dotenv')
const { pool, initDB } = require('./config/db')
const User = require('./models/User')
const Menu = require('./models/Menu')

dotenv.config()

const sampleMenuItems = [
    {
        name: 'Spaghetti alla Carbonara',
        price: 12.50,
        category: 'Pasta',
        description: 'Traditional Roman carbonara with crispy guanciale, fresh egg yolks, Pecorino Romano, and cracked black pepper.',
        image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?auto=format&fit=crop&w=800&q=80',
        isAvailable: true
    },
    {
        name: 'Tagliatelle al Tartufo',
        price: 16.00,
        category: 'Pasta',
        description: 'Handmade tagliatelle tossed in creamy black truffle butter sauce and aged Parmigiano Reggiano.',
        image: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281295?auto=format&fit=crop&w=800&q=80',
        isAvailable: true
    },
    {
        name: 'Penne all\'Arrabbiata',
        price: 10.00,
        category: 'Pasta',
        description: 'San Marzano tomato sauce infused with garlic, red chili peppers, fresh basil, and extra virgin olive oil.',
        image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80',
        isAvailable: true
    },
    {
        name: 'Pizza Margherita D.O.P.',
        price: 9.50,
        category: 'Pizza',
        description: 'Neapolitan dough baked in wood oven with San Marzano tomatoes, fresh Fior di Latte mozzarella, and fresh basil.',
        image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80',
        isAvailable: true
    },
    {
        name: 'Pizza Diavola Piccante',
        price: 11.50,
        category: 'Pizza',
        description: 'Tomato sauce, spicy Calabrian salami, mozzarella, chili flakes, and hot honey drizzle.',
        image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=800&q=80',
        isAvailable: true
    },
    {
        name: 'Pizza Quattro Formaggi',
        price: 13.00,
        category: 'Pizza',
        description: 'White base with mozzarella, Gorgonzola D.O.P., Fontina, and aged Parmigiano Reggiano.',
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
        isAvailable: true
    },
    {
        name: 'Insalata Burrata & Pomodorini',
        price: 11.00,
        category: 'Salad',
        description: 'Creamy Apulian burrata, colorful heirloom cherry tomatoes, basil pesto, and balsamic glaze.',
        image: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb22509?auto=format&fit=crop&w=800&q=80',
        isAvailable: true
    },
    {
        name: 'Classic Caesar Salad',
        price: 9.00,
        category: 'Salad',
        description: 'Crisp romaine lettuce, grilled herb chicken, sourdough croutons, parmesan shavings, and house caesar dressing.',
        image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?auto=format&fit=crop&w=800&q=80',
        isAvailable: true
    },
    {
        name: 'Gourmet Truffle Burger',
        price: 14.50,
        category: 'Burger',
        description: '100% Angus beef patty, smoked provolone, caramelized onions, arugula, and truffle mayo on a brioche bun.',
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
        isAvailable: true
    },
    {
        name: 'Salmon & Avocado Roll (8 pcs)',
        price: 13.50,
        category: 'Sushi',
        description: 'Fresh Norwegian salmon, ripe avocado, cucumber, Japanese mayo, and toasted sesame seeds.',
        image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80',
        isAvailable: true
    },
    {
        name: 'Belgian Nutella & Strawberry Waffle',
        price: 7.50,
        category: 'Waffle',
        description: 'Warm golden Belgian waffle topped with rich Nutella, fresh organic strawberries, and vanilla gelato.',
        image: 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?auto=format&fit=crop&w=800&q=80',
        isAvailable: true
    },
    {
        name: 'Traditional Tiramisù',
        price: 6.50,
        category: 'Other',
        description: 'Savoiardi ladyfingers soaked in dark espresso and Marsala, layered with whipped mascarpone cream and Dutch cocoa.',
        image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=800&q=80',
        isAvailable: true
    }
]

const seedDatabase = async () => {
    try {
        console.log('🔄 Initializing MySQL schema before seeding...')
        await initDB()

        // 1. Seed Admin user if not exists
        const adminEmail = 'admin@pastarella.com'
        const existingAdmin = await User.findByEmail(adminEmail)

        if (!existingAdmin) {
            const hashedPassword = await bcrypt.hash('admin123', 10)
            await User.create({
                name: 'Executive Admin',
                email: adminEmail,
                password: hashedPassword,
                role: 'admin'
            })
            console.log(`✅ Default Admin user created (${adminEmail} / admin123)`)
        } else {
            console.log(`ℹ️ Admin user already exists (${adminEmail})`)
        }

        // 2. Seed Menu items if table is empty
        const count = await Menu.count()
        if (count === 0) {
            for (const item of sampleMenuItems) {
                await Menu.create(item)
            }
            console.log(`✅ Seeded ${sampleMenuItems.length} dishes into MySQL "menus" table!`)
        } else {
            console.log(`ℹ️ "menus" table already has ${count} dishes. Skipping dish seed.`)
        }

        console.log('🎉 MySQL database seeding finished successfully!')
        process.exit(0)
    } catch (error) {
        console.error('❌ Seeding failed with error:', error)
        process.exit(1)
    }
}

seedDatabase()
