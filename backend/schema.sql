-- =============================================
-- NutriTrack Database Setup
-- Run this in MySQL Workbench or CLI:
--   mysql -u root -p < schema.sql
-- =============================================

CREATE DATABASE IF NOT EXISTS nutritrack;
USE nutritrack;

-- ─────────────────────────────────────────
-- TABLES
-- ─────────────────────────────────────────

CREATE TABLE IF NOT EXISTS USERS (
  userID    INT PRIMARY KEY,
  name      VARCHAR(100) NOT NULL,
  email     VARCHAR(100) UNIQUE NOT NULL,
  password  VARCHAR(255) NOT NULL,
  phone     VARCHAR(20),
  address   TEXT,
  gender    VARCHAR(20),
  age       INT
);

CREATE TABLE IF NOT EXISTS ADMINS (
  adminID   INT PRIMARY KEY,
  name      VARCHAR(100) NOT NULL,
  email     VARCHAR(100) UNIQUE NOT NULL,
  password  VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS PRODUCTS (
  productID   INT PRIMARY KEY,
  adminID     INT,
  productName VARCHAR(150) NOT NULL,
  brand       VARCHAR(100),
  price       DECIMAL(10,2) NOT NULL,
  category    VARCHAR(50),
  FOREIGN KEY (adminID) REFERENCES ADMINS(adminID)
);

CREATE TABLE IF NOT EXISTS ORDERS (
  orderID     INT PRIMARY KEY,
  userID      INT NOT NULL,
  orderDate   DATE NOT NULL,
  orderStatus VARCHAR(50) DEFAULT 'Completed',
  FOREIGN KEY (userID) REFERENCES USERS(userID)
);

CREATE TABLE IF NOT EXISTS ORDER_ITEM (
  orderID   INT NOT NULL,
  productID INT NOT NULL,
  quantity  INT NOT NULL DEFAULT 1,
  PRIMARY KEY (orderID, productID),
  FOREIGN KEY (orderID) REFERENCES ORDERS(orderID),
  FOREIGN KEY (productID) REFERENCES PRODUCTS(productID)
);

CREATE TABLE IF NOT EXISTS NUTRIENTS (
  nutrientID   INT PRIMARY KEY,
  nutrientName VARCHAR(100) NOT NULL,
  unit         VARCHAR(20)
);

CREATE TABLE IF NOT EXISTS PRODUCT_NUTRIENT (
  productID        INT NOT NULL,
  nutrientID       INT NOT NULL,
  quantity_per_unit DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (productID, nutrientID),
  FOREIGN KEY (productID) REFERENCES PRODUCTS(productID),
  FOREIGN KEY (nutrientID) REFERENCES NUTRIENTS(nutrientID)
);

-- ─────────────────────────────────────────
-- SEED: ADMINS
-- Password: admin123 (bcrypt hashed)
-- ─────────────────────────────────────────
INSERT INTO ADMINS (adminID, name, email, password) VALUES
(1, 'Admin User', 'admin@nutritrack.com', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy');
-- Password above = "admin123"

-- ─────────────────────────────────────────
-- SEED: NUTRIENTS
-- ─────────────────────────────────────────
INSERT INTO NUTRIENTS (nutrientID, nutrientName, unit) VALUES
(401, 'Calories',       'kcal'),
(402, 'Protein',        'g'),
(403, 'Carbohydrates',  'g'),
(404, 'Fat',            'g'),
(405, 'Fiber',          'g'),
(406, 'Sugar',          'g'),
(407, 'Calcium',        'mg'),
(408, 'Iron',           'mg'),
(409, 'Sodium',         'mg'),
(410, 'Vitamin C',      'mg');

-- ─────────────────────────────────────────
-- SEED: PRODUCTS
-- ─────────────────────────────────────────
INSERT INTO PRODUCTS (productID, adminID, productName, brand, price, category) VALUES
(301, 1, 'Whole Milk',             'Amul',         55.00,  'Drinks'),
(302, 1, 'Farm Fresh Eggs (12)',   'Country Delight', 89.00, 'Proteins'),
(303, 1, 'Multigrain Bread',       'Britannia',    45.00,  'Snacks'),
(304, 1, 'Basmati Rice (1kg)',     'India Gate',   120.00, 'Vegetables'),
(305, 1, 'Rolled Oats',           'Quaker',        99.00,  'Proteins'),
(306, 1, 'Almonds (200g)',         'Happilo',      199.00, 'Snacks'),
(307, 1, 'Banana Bunch',          'Fresh Farm',    35.00,  'Snacks'),
(308, 1, 'Royal Gala Apple (4pc)','Fresh Farm',    60.00,  'Snacks'),
(309, 1, 'Whey Protein Powder',   'MuscleBlaze',  999.00, 'Proteins'),
(310, 1, 'Spinach (500g)',        'Organic India',  49.00, 'Vegetables'),
(311, 1, 'Orange Juice',          'Tropicana',     85.00,  'Drinks'),
(312, 1, 'Vitamin C Supplement',  'HealthKart',   299.00, 'Supplements'),
(313, 1, 'Greek Yogurt',          'Epigamia',      75.00,  'Proteins'),
(314, 1, 'Dark Chocolate Bar',    'Amul',          60.00,  'Snacks'),
(315, 1, 'Multivitamin Tablets',  'Revital',      350.00, 'Supplements');

-- ─────────────────────────────────────────
-- SEED: PRODUCT_NUTRIENT
-- ─────────────────────────────────────────
-- Whole Milk
INSERT INTO PRODUCT_NUTRIENT VALUES (301, 401, 61), (301, 402, 3.2), (301, 403, 4.8), (301, 404, 3.3), (301, 407, 120);
-- Eggs
INSERT INTO PRODUCT_NUTRIENT VALUES (302, 401, 155), (302, 402, 13), (302, 404, 11), (302, 408, 1.2);
-- Bread
INSERT INTO PRODUCT_NUTRIENT VALUES (303, 401, 265), (303, 403, 49), (303, 405, 3.4), (303, 409, 491);
-- Rice
INSERT INTO PRODUCT_NUTRIENT VALUES (304, 401, 130), (304, 402, 2.7), (304, 403, 28), (304, 404, 0.3);
-- Oats
INSERT INTO PRODUCT_NUTRIENT VALUES (305, 401, 389), (305, 402, 17), (305, 403, 66), (305, 404, 7), (305, 405, 10.6);
-- Almonds
INSERT INTO PRODUCT_NUTRIENT VALUES (306, 401, 579), (306, 402, 21), (306, 404, 50), (306, 405, 12.5), (306, 407, 264);
-- Banana
INSERT INTO PRODUCT_NUTRIENT VALUES (307, 401, 89), (307, 403, 23), (307, 406, 12), (307, 405, 2.6);
-- Apple
INSERT INTO PRODUCT_NUTRIENT VALUES (308, 401, 52), (308, 403, 14), (308, 406, 10), (308, 405, 2.4), (308, 410, 4.6);
-- Whey Protein
INSERT INTO PRODUCT_NUTRIENT VALUES (309, 401, 120), (309, 402, 25), (309, 403, 3), (309, 404, 2);
-- Spinach
INSERT INTO PRODUCT_NUTRIENT VALUES (310, 401, 23), (310, 402, 2.9), (310, 403, 3.6), (310, 405, 2.2), (310, 408, 2.7), (310, 410, 28);
-- Orange Juice
INSERT INTO PRODUCT_NUTRIENT VALUES (311, 401, 45), (311, 403, 10), (311, 406, 8.4), (311, 410, 50);
-- Vitamin C
INSERT INTO PRODUCT_NUTRIENT VALUES (312, 410, 500);
-- Greek Yogurt
INSERT INTO PRODUCT_NUTRIENT VALUES (313, 401, 100), (313, 402, 10), (313, 403, 6), (313, 404, 4);
-- Dark Chocolate
INSERT INTO PRODUCT_NUTRIENT VALUES (314, 401, 546), (314, 403, 60), (314, 404, 31), (314, 406, 48), (314, 408, 3.3);
-- Multivitamin
INSERT INTO PRODUCT_NUTRIENT VALUES (315, 410, 60), (315, 408, 14), (315, 407, 200);

-- ─────────────────────────────────────────
-- NOTE: To create a test user, sign up via
-- the app's /signup page. The first user
-- will get userID = 101 automatically.
-- ─────────────────────────────────────────
