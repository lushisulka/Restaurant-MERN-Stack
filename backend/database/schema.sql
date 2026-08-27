-- =======================================================
-- Restaurant Database Schema (MySQL)
-- Suitable for MySQL Workbench and MySQL 8.0+
-- =======================================================

CREATE DATABASE IF NOT EXISTS restaurant CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE restaurant;

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_email (email)
) ENGINE=InnoDB;

-- 2. MENUS TABLE (Restaurant Dishes)
CREATE TABLE IF NOT EXISTS menus (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT,
    image TEXT,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_menu_category (category)
) ENGINE=InnoDB;

-- 3. ORDERS TABLE
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    status ENUM('pending', 'preparing', 'delivered', 'cancelled') DEFAULT 'pending',
    address TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_order_user (user_id),
    INDEX idx_order_status (status)
) ENGINE=InnoDB;

-- 4. ORDER ITEMS TABLE (Normalized Order Items)
CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    menu_item_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (menu_item_id) REFERENCES menus(id) ON DELETE RESTRICT,
    INDEX idx_order_item_order (order_id),
    INDEX idx_order_item_menu (menu_item_id)
) ENGINE=InnoDB;

-- 5. REVIEWS TABLE
CREATE TABLE IF NOT EXISTS reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    menu_item_id INT NOT NULL,
    rating TINYINT NOT NULL,
    comment TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (menu_item_id) REFERENCES menus(id) ON DELETE CASCADE,
    INDEX idx_review_menu_item (menu_item_id),
    INDEX idx_review_user (user_id)
) ENGINE=InnoDB;

-- =======================================================
-- INITIAL SEED DATA
-- Default Admin: admin@pastarella.com / admin123
-- =======================================================

INSERT INTO users (name, email, password, role)
VALUES (
    'Executive Admin',
    'admin@pastarella.com',
    '$2a$10$9K0sF08m9ZgPvhb5B2LzbeJ.C0cOqK5/fC1h98z22f/Z9aA4jB0bO', -- hashed admin123
    'admin'
)
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO menus (name, price, category, description, image, is_available)
VALUES
    ('Spaghetti alla Carbonara', 12.50, 'Pasta', 'Traditional Roman carbonara with crispy guanciale, fresh egg yolks, Pecorino Romano, and cracked black pepper.', 'https://images.unsplash.com/photo-1612874742237-6526221588e3?auto=format&fit=crop&w=800&q=80', TRUE),
    ('Tagliatelle al Tartufo', 16.00, 'Pasta', 'Handmade tagliatelle tossed in creamy black truffle butter sauce and aged Parmigiano Reggiano.', 'https://images.unsplash.com/photo-1621996346565-e3d5d6281295?auto=format&fit=crop&w=800&q=80', TRUE),
    ('Penne all\'Arrabbiata', 10.00, 'Pasta', 'San Marzano tomato sauce infused with garlic, red chili peppers, fresh basil, and extra virgin olive oil.', 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80', TRUE),
    ('Pizza Margherita D.O.P.', 9.50, 'Pizza', 'Neapolitan dough baked in wood oven with San Marzano tomatoes, fresh Fior di Latte mozzarella, and fresh basil.', 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80', TRUE),
    ('Pizza Diavola Piccante', 11.50, 'Pizza', 'Tomato sauce, spicy Calabrian salami, mozzarella, chili flakes, and hot honey drizzle.', 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=800&q=80', TRUE),
    ('Pizza Quattro Formaggi', 13.00, 'Pizza', 'White base with mozzarella, Gorgonzola D.O.P., Fontina, and aged Parmigiano Reggiano.', 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80', TRUE),
    ('Insalata Burrata & Pomodorini', 11.00, 'Salad', 'Creamy Apulian burrata, colorful heirloom cherry tomatoes, basil pesto, and balsamic glaze.', 'https://images.unsplash.com/photo-1592417817098-8f3d6eb22509?auto=format&fit=crop&w=800&q=80', TRUE),
    ('Classic Caesar Salad', 9.00, 'Salad', 'Crisp romaine lettuce, grilled herb chicken, sourdough croutons, parmesan shavings, and house caesar dressing.', 'https://images.unsplash.com/photo-1546793665-c74683f339c1?auto=format&fit=crop&w=800&q=80', TRUE),
    ('Gourmet Truffle Burger', 14.50, 'Burger', '100% Angus beef patty, smoked provolone, caramelized onions, arugula, and truffle mayo on a brioche bun.', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80', TRUE),
    ('Salmon & Avocado Roll (8 pcs)', 13.50, 'Sushi', 'Fresh Norwegian salmon, ripe avocado, cucumber, Japanese mayo, and toasted sesame seeds.', 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80', TRUE),
    ('Belgian Nutella & Strawberry Waffle', 7.50, 'Waffle', 'Warm golden Belgian waffle topped with rich Nutella, fresh organic strawberries, and vanilla gelato.', 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?auto=format&fit=crop&w=800&q=80', TRUE),
    ('Traditional Tiramisù', 6.50, 'Other', 'Savoiardi ladyfingers soaked in dark espresso and Marsala, layered with whipped mascarpone cream and Dutch cocoa.', 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=800&q=80', TRUE);
