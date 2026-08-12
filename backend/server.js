const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const db = require("./db");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ─────────────────────────────────────────
// ROOT
// ─────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({ message: "NutriTrack backend is running ✅" });
});

// ─────────────────────────────────────────
// AUTH: USER SIGNUP
// ─────────────────────────────────────────
app.post("/signup", async (req, res) => {
  const { name, email, password, phone, gender, address, age } = req.body;

  if (!name || !email || !password || !phone || !gender || !address || !age) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const [existing] = await db.query("SELECT * FROM USERS WHERE email = ?", [email]);
    if (existing.length > 0) {
      return res.status(409).json({ error: "Email already registered." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [[maxRow]] = await db.query("SELECT MAX(userID) AS maxId FROM USERS");
    const newId = (maxRow.maxId || 100) + 1;

    await db.query(
      "INSERT INTO USERS (userID, name, email, password, phone, address, gender, age) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [newId, name, email, hashedPassword, phone, address, gender, age]
    );

    res.status(201).json({ message: "Signup successful!", userID: newId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error during signup." });
  }
});

// ─────────────────────────────────────────
// AUTH: USER LOGIN
// ─────────────────────────────────────────
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  try {
    const [rows] = await db.query("SELECT * FROM USERS WHERE email = ?", [email]);
    if (rows.length === 0) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    res.json({
      userID: user.userID,
      name: user.name,
      email: user.email,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error during login." });
  }
});

// ─────────────────────────────────────────
// AUTH: ADMIN LOGIN
// ─────────────────────────────────────────
app.post("/admin/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  try {
    const [rows] = await db.query("SELECT * FROM ADMINS WHERE email = ?", [email]);
    if (rows.length === 0) {
      return res.status(401).json({ error: "Invalid admin credentials." });
    }

   const admin = rows[0];
   const match = await bcrypt.compare(password, admin.password);

  if (!match) {
  return res.status(401).json({ error: "Invalid admin credentials." });
  }

    res.json({
      adminID: admin.adminID,
      name: admin.name,
      email: admin.email,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error during admin login." });
  }
});

// ─────────────────────────────────────────
// PRODUCTS: GET ALL
// ─────────────────────────────────────────
app.get("/products", async (req, res) => {
  try {
    const [products] = await db.query("SELECT * FROM PRODUCTS");
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch products." });
  }
});

// ─────────────────────────────────────────
// PRODUCTS:(NUTRIENTS) GET BY ID WITH NUTRIENTS
// ─────────────────────────────────────────
app.get("/product/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [product] = await db.query("SELECT * FROM PRODUCTS WHERE productID = ?", [id]);
    if (product.length === 0) {
      return res.status(404).json({ error: "Product not found." });
    }

    const [nutrients] = await db.query(
      `SELECT n.nutrientName, n.unit, pn.quantity_per_unit
       FROM PRODUCT_NUTRIENT pn
       JOIN NUTRIENTS n ON pn.nutrientID = n.nutrientID
       WHERE pn.productID = ?`,
      [id]
     

      // `SELECT n.nutrientName, n.unit
      //   FROM NUTRIENTS n,
      //   SELECT pn.quantity_per_unit
      //     FROM PRODUCT_NUTRIENT pn
      //     WHERE pn.productID = ?`,
      //   [id]
            
    );

    res.json({ product: product[0], nutrients });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch product." });
  }
});

// ─────────────────────────────────────────
// ORDERS: PLACE ORDER
// ─────────────────────────────────────────
app.post("/place-order", async (req, res) => {
  const { userID, cartItems } = req.body;

  if (!userID || !cartItems || cartItems.length === 0) {
    return res.status(400).json({ error: "UserID and cart items are required." });
  }

  try {
    const [[maxRow]] = await db.query("SELECT MAX(orderID) AS maxId FROM ORDERS");
    const newOrderId = (maxRow.maxId || 1000) + 1;

    const orderDate = new Date().toISOString().slice(0, 10);
    await db.query(
      "INSERT INTO ORDERS (orderID, userID, orderDate, orderStatus) VALUES (?, ?, ?, ?)",
      [newOrderId, userID, orderDate, "Completed"]
    );

    for (const item of cartItems) {
      await db.query(
        "INSERT INTO ORDER_ITEM (orderID, productID, quantity) VALUES (?, ?, ?)",
        [newOrderId, item.productID, item.quantity]
      );
    }

    res.status(201).json({ message: "Order placed successfully!", orderID: newOrderId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to place order." });
  }
});

// ─────────────────────────────────────────
// ORDERS: GET BY USER
// ─────────────────────────────────────────
app.get("/orders/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const [orders] = await db.query(
      `SELECT o.orderID, o.orderDate, o.orderStatus, p.productName, oi.quantity, p.price
       FROM ORDERS o
       JOIN ORDER_ITEM oi ON o.orderID = oi.orderID
       JOIN PRODUCTS p ON oi.productID = p.productID
       WHERE o.userID = ?
       ORDER BY o.orderDate DESC`,
      [userId]
    );
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch orders." });
  }
});

// ─────────────────────────────────────────
// NUTRITION: GET BY USER (completed orders)
// ─────────────────────────────────────────
app.get("/nutrition/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const [nutrition] = await db.query(
      `SELECT n.nutrientName, n.unit,
              SUM(oi.quantity * pn.quantity_per_unit) AS total_amount
       FROM ORDERS o
       JOIN ORDER_ITEM oi ON o.orderID = oi.orderID
       JOIN PRODUCT_NUTRIENT pn ON oi.productID = pn.productID
       JOIN NUTRIENTS n ON pn.nutrientID = n.nutrientID
       WHERE o.userID = ? AND o.orderStatus = 'Completed'
       GROUP BY n.nutrientName, n.unit`,
      [userId]
    );
    res.json(nutrition);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch nutrition data." });
  }
});

// ─────────────────────────────────────────
// ADMIN: ADD PRODUCT
// ─────────────────────────────────────────
app.post("/admin/add-product", async (req, res) => {
  const { productName, brand, price, category, adminID } = req.body;

  if (!productName || !brand || !price || !category || !adminID) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const [[maxRow]] = await db.query("SELECT MAX(productID) AS maxId FROM PRODUCTS");
    const newId = (maxRow.maxId || 300) + 1;

    await db.query(
      "INSERT INTO PRODUCTS (productID, adminID, productName, brand, price, category) VALUES (?, ?, ?, ?, ?, ?)",
      [newId, adminID, productName, brand, price, category]
    );

    res.status(201).json({ message: "Product added successfully!", productID: newId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add product." });
  }
});

// ─────────────────────────────────────────
// ADMIN: DELETE PRODUCT
// ─────────────────────────────────────────
app.delete("/admin/delete-product/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [referenced] = await db.query(
      "SELECT * FROM ORDER_ITEM WHERE productID = ?",
      [id]
    );
    if (referenced.length > 0) {
      return res.status(409).json({
        error: "Cannot delete product because it is referenced in past orders.",
      });
    }

    // Also remove product-nutrient mappings first
    await db.query("DELETE FROM PRODUCT_NUTRIENT WHERE productID = ?", [id]);
    const [result] = await db.query("DELETE FROM PRODUCTS WHERE productID = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Product not found." });
    }

    res.json({ message: "Product deleted successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete product." });
  }
});

// ─────────────────────────────────────────
// ADMIN: ADD PRODUCT NUTRIENT MAPPING
// ─────────────────────────────────────────
app.post("/admin/add-product-nutrient", async (req, res) => {
  const { productID, nutrientID, quantity_per_unit } = req.body;

  if (!productID || !nutrientID || quantity_per_unit === undefined) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const [existing] = await db.query(
      "SELECT * FROM PRODUCT_NUTRIENT WHERE productID = ? AND nutrientID = ?",
      [productID, nutrientID]
    );
    if (existing.length > 0) {
      return res.status(409).json({
        error: "Nutrient value already exists for this product.",
      });
    }

    await db.query(
      "INSERT INTO PRODUCT_NUTRIENT (productID, nutrientID, quantity_per_unit) VALUES (?, ?, ?)",
      [productID, nutrientID, quantity_per_unit]
    );

    res.status(201).json({ message: "Nutrient mapping added successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add nutrient mapping." });
  }
});


// ─────────────────────────────────────────
// START SERVER
// ─────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 NutriTrack server running on http://localhost:${PORT}`);
});
