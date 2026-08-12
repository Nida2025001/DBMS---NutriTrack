# 🌿 NutriTrack — Full-Stack DBMS Mini Project

> A health-focused food e-commerce and nutrition tracking web application.

---

## 📁 Folder Structure

```
nutritrack/
├── backend/
│   ├── server.js          ← Express API server
│   ├── db.js              ← MySQL connection pool
│   ├── schema.sql         ← DB tables + seed data
│   ├── .env.example       ← Environment variables template
│   └── package.json
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── Signup.jsx
    │   │   ├── Login.jsx
    │   │   ├── AdminLogin.jsx
    │   │   ├── Shop.jsx
    │   │   ├── ProductDetails.jsx
    │   │   ├── Cart.jsx
    │   │   ├── Orders.jsx
    │   │   ├── Nutrition.jsx
    │   │   └── Admin.jsx
    │   ├── utils/
    │   │   └── imageUtils.js
    │   ├── App.jsx
    │   ├── index.js
    │   └── index.css
    └── package.json
```

---

## 🛢️ Database Setup

### 1. Open MySQL (Workbench or CLI)

```bash
mysql -u root -p
```

### 2. Run the schema file

```bash
mysql -u root -p < backend/schema.sql
```

This will:
- Create the `nutritrack` database
- Create all 7 tables: USERS, ADMINS, PRODUCTS, ORDERS, ORDER_ITEM, NUTRIENTS, PRODUCT_NUTRIENT
- Insert 1 admin, 10 nutrients, and 15 products with full nutrient mappings

---

## ⚙️ Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MySQL credentials
npm run dev
```

Backend runs at: `http://localhost:5000`

### .env contents:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=nutritrack
PORT=5000
```

---

## 💻 Frontend Setup

```bash
cd frontend
npm install
npm start
```

Frontend runs at: `http://localhost:3000`

> The `"proxy": "http://localhost:5000"` in `frontend/package.json` routes all `/api` calls to the backend automatically.

---

## 🔑 Test Credentials

### Admin Login (`/admin-login`)
- Email: `admin@nutritrack.com`
- Password: `admin123`

### User
- Sign up via `/signup` (first user gets ID 101)
- Then login at `/login`

---

## 🌐 App Routes

| Route | Page | Access |
|-------|------|--------|
| `/` | Home (landing) | Public |
| `/signup` | Sign Up | Public |
| `/login` | User Login | Public |
| `/admin-login` | Admin Login | Public |
| `/shop` | Product Listing | User |
| `/product/:id` | Product Details | User |
| `/cart` | Shopping Cart | User |
| `/orders` | Order History | User |
| `/nutrition` | Nutrition Dashboard | User |
| `/admin` | Admin Dashboard | Admin only |

---

## 🔌 Backend API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Health check |
| POST | `/signup` | Register user |
| POST | `/login` | User login |
| POST | `/admin/login` | Admin login |
| GET | `/products` | All products |
| GET | `/product/:id` | Product + nutrients |
| POST | `/place-order` | Place order from cart |
| GET | `/orders/:userId` | User order history |
| GET | `/nutrition/:userId` | Nutrition summary |
| POST | `/admin/add-product` | Add product |
| DELETE | `/admin/delete-product/:id` | Delete product |
| POST | `/admin/add-product-nutrient` | Add nutrient mapping |

---

## 🗄️ Database Schema

```sql
USERS(userID PK, name, email UNIQUE, password, phone, address, gender, age)
ADMINS(adminID PK, name, email UNIQUE, password)
PRODUCTS(productID PK, adminID FK, productName, brand, price, category)
ORDERS(orderID PK, userID FK, orderDate, orderStatus)
ORDER_ITEM(orderID FK, productID FK, quantity)  ← composite PK
NUTRIENTS(nutrientID PK, nutrientName, unit)
PRODUCT_NUTRIENT(productID FK, nutrientID FK, quantity_per_unit)  ← composite PK
```

---

## 🚀 User Flow

```
Public:  Home → Signup / Login → Shop → Product Details → Cart → Place Order → My Orders → Nutrition

Admin:   Admin Login → Admin Dashboard → Add/Delete Products, Add Nutrient Mappings
```

---

## 🎨 Tech Stack

- **Frontend**: React 18, React Router v6, Axios, Chart.js (react-chartjs-2)
- **Backend**: Node.js, Express.js
- **Database**: MySQL (via mysql2)
- **Auth**: bcrypt password hashing
- **State**: localStorage (userId, role, cart)

---

## ⚠️ Notes

- Admin and user roles are separate. Regular users cannot access `/admin`.
- Cart is stored in `localStorage` and cleared after placing an order.
- Nutrition dashboard only counts `Completed` orders.
- Product images are matched by keyword from product name (consistent across Shop, Details, Cart).
- No JWT or payment gateway — this is a clean DBMS demo project.
