import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const s = {
  page: { minHeight: "100vh", background: "#eef3f7", fontFamily: "'DM Sans', sans-serif" },
  nav: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "0 40px", height: "80px",
    background: "linear-gradient(90deg, #0a2e14 0%, #0f4a22 100%)",
    position: "sticky", top: 0, zIndex: 100,
  },
  logo: { fontFamily: "'Sora', sans-serif", fontWeight: 800, fontSize: "1.4rem", color: "#fff" },
  navRight: { display: "flex", gap: "8px", alignItems: "center" },
  navName: { color: "rgba(255,255,255,0.7)", fontSize: "0.88rem" },
  signoutBtn: {
    padding: "8px 18px", borderRadius: "50px",
    border: "1.5px solid rgba(255,255,255,0.3)", background: "transparent",
    color: "#fff", fontSize: "0.85rem", fontWeight: 500, cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
  },
  body: { maxWidth: "1100px", margin: "0 auto", padding: "40px 24px" },
  pageTitle: { fontFamily: "'Sora', sans-serif", fontWeight: 800, fontSize: "2rem", color: "#0a2e14", marginBottom: "6px" },
  subtitle: { color: "#6b7b6b", fontSize: "0.92rem", marginBottom: "36px" },
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "28px" },
  card: {
    background: "#fff", borderRadius: "20px", padding: "28px",
    border: "1px solid #e0f0e4", boxShadow: "0 4px 24px rgba(15,123,46,0.08)",
  },
  cardTitle: {
    fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: "1rem",
    color: "#0a2e14", marginBottom: "20px",
    paddingBottom: "10px", borderBottom: "2px solid #e6f4ea",
    display: "flex", alignItems: "center", gap: "8px",
  },
  formGroup: { marginBottom: "14px" },
  label: {
    display: "block", fontSize: "0.78rem", fontWeight: 600,
    color: "#3a5a3a", marginBottom: "5px",
    textTransform: "uppercase", letterSpacing: "0.3px",
  },
  input: {
    width: "100%", padding: "10px 14px", borderRadius: "10px",
    border: "1.5px solid #d4e8d4", fontSize: "0.9rem",
    color: "#1a2e1a", background: "#f8fdf9", outline: "none",
    fontFamily: "'DM Sans', sans-serif",
  },
  select: {
    width: "100%", padding: "10px 14px", borderRadius: "10px",
    border: "1.5px solid #d4e8d4", fontSize: "0.9rem",
    color: "#1a2e1a", background: "#f8fdf9", outline: "none",
    fontFamily: "'DM Sans', sans-serif",
  },
  submitBtn: {
    width: "100%", padding: "12px", background: "#0f7b2e",
    color: "#fff", border: "none", borderRadius: "50px",
    fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "0.92rem",
    cursor: "pointer", marginTop: "4px",
  },
  success: {
    background: "#e6f4ea", border: "1px solid #a8d5b5", borderRadius: "8px",
    padding: "10px 14px", color: "#0f7b2e", fontSize: "0.85rem", marginBottom: "12px",
  },
  error: {
    background: "#fff0f0", border: "1px solid #ffc0c0", borderRadius: "8px",
    padding: "10px 14px", color: "#c0392b", fontSize: "0.85rem", marginBottom: "12px",
  },
  tableCard: {
    background: "#fff", borderRadius: "20px", padding: "28px",
    border: "1px solid #e0f0e4", boxShadow: "0 4px 24px rgba(15,123,46,0.08)",
    gridColumn: "1 / -1",
  },
  table: { width: "100%", borderCollapse: "collapse", marginTop: "8px" },
  th: {
    padding: "10px 14px", textAlign: "left", fontSize: "0.78rem",
    fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: "0.3px",
    borderBottom: "2px solid #e8f0ea", background: "#f8fdf9",
  },
  td: {
    padding: "12px 14px", fontSize: "0.9rem", color: "#1a2e1a",
    borderBottom: "1px solid #f0f0f0",
  },
  deleteBtn: {
    padding: "6px 14px", background: "#fff0f0", color: "#c0392b",
    border: "1px solid #f5c6c6", borderRadius: "50px",
    fontSize: "0.78rem", fontWeight: 600, cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
  },
  catBadge: {
    padding: "3px 10px", borderRadius: "50px",
    background: "#e6f4ea", color: "#0f7b2e",
    fontSize: "0.75rem", fontWeight: 600,
  },
  hint: {
    background: "#f8fdf9", border: "1px solid #d4e8d4", borderRadius: "8px",
    padding: "10px 14px", fontSize: "0.82rem", color: "#555", marginTop: "12px",
    lineHeight: 1.6,
  },
};

export default function Admin() {
  const navigate = useNavigate();
  const adminId = localStorage.getItem("adminId");
  const adminName = localStorage.getItem("adminName") || "Admin";

  const [products, setProducts] = useState([]);
  const [productForm, setProductForm] = useState({ productName: "", brand: "", price: "", category: "Proteins" });
  const [nutrientForm, setNutrientForm] = useState({ productID: "", nutrientID: "", quantity_per_unit: "" });
  const [productMsg, setProductMsg] = useState({ type: "", text: "" });
  const [nutrientMsg, setNutrientMsg] = useState({ type: "", text: "" });

  const fetchProducts = () => {
    axios.get("/products").then((r) => setProducts(r.data)).catch(console.error);
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleProductChange = (e) => setProductForm({ ...productForm, [e.target.name]: e.target.value });
  const handleNutrientChange = (e) => setNutrientForm({ ...nutrientForm, [e.target.name]: e.target.value });

  const addProduct = async (e) => {
    e.preventDefault();
    setProductMsg({ type: "", text: "" });
    try {
      await axios.post("/admin/add-product", { ...productForm, adminID: adminId });
      setProductMsg({ type: "success", text: "Product added successfully!" });
      setProductForm({ productName: "", brand: "", price: "", category: "Proteins" });
      fetchProducts();
    } catch (err) {
      setProductMsg({ type: "error", text: err.response?.data?.error || "Failed to add product." });
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm(`Delete product #${id}?`)) return;
    try {
      await axios.delete(`/admin/delete-product/${id}`);
      fetchProducts();
    } catch (err) {
      alert(err.response?.data?.error || "Delete failed.");
    }
  };

  const addNutrient = async (e) => {
    e.preventDefault();
    setNutrientMsg({ type: "", text: "" });
    try {
      await axios.post("/admin/add-product-nutrient", nutrientForm);
      setNutrientMsg({ type: "success", text: "Nutrient mapping added!" });
      setNutrientForm({ productID: "", nutrientID: "", quantity_per_unit: "" });
    } catch (err) {
      setNutrientMsg({ type: "error", text: err.response?.data?.error || "Failed to add mapping." });
    }
  };

  const signOut = () => { localStorage.clear(); navigate("/admin-login"); };

  return (
    <div style={s.page}>
      <nav style={s.nav}>
        <span style={s.logo}>⚙ NutriTrack Admin</span>
        <div style={s.navRight}>
          <span style={s.navName}>👤 {adminName}</span>
          <button style={s.signoutBtn} onClick={signOut}>Sign Out</button>
        </div>
      </nav>

      <div style={s.body}>
        <h1 style={s.pageTitle}>Admin Dashboard</h1>
        <p style={s.subtitle}>Manage products and nutrition mappings</p>

        <div style={s.grid}>
          {/* ADD PRODUCT */}
          <div style={s.card}>
            <div style={s.cardTitle}>➕ Add New Product</div>
            {productMsg.text && (
              <div style={productMsg.type === "success" ? s.success : s.error}>{productMsg.text}</div>
            )}
            <form onSubmit={addProduct}>
              <div style={s.formGroup}>
                <label style={s.label}>Product Name</label>
                <input style={s.input} name="productName" value={productForm.productName} onChange={handleProductChange} placeholder="e.g. Whey Protein" required />
              </div>
              <div style={s.formGroup}>
                <label style={s.label}>Brand</label>
                <input style={s.input} name="brand" value={productForm.brand} onChange={handleProductChange} placeholder="e.g. MuscleBlaze" required />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div style={s.formGroup}>
                  <label style={s.label}>Price (₹)</label>
                  <input style={s.input} name="price" type="number" value={productForm.price} onChange={handleProductChange} placeholder="199" min="0" step="0.01" required />
                </div>
                <div style={s.formGroup}>
                  <label style={s.label}>Category</label>
                  <select style={s.select} name="category" value={productForm.category} onChange={handleProductChange}>
                    <option>Proteins</option>
                    <option>Vegetables</option>
                    <option>Snacks</option>
                    <option>Supplements</option>
                    <option>Drinks</option>
                  </select>
                </div>
              </div>
              <button style={s.submitBtn} type="submit">Add Product</button>
            </form>
          </div>

          {/* ADD NUTRIENT MAPPING */}
          <div style={s.card}>
            <div style={s.cardTitle}>🧬 Add Nutrient Mapping</div>
            {nutrientMsg.text && (
              <div style={nutrientMsg.type === "success" ? s.success : s.error}>{nutrientMsg.text}</div>
            )}
            <form onSubmit={addNutrient}>
              <div style={s.formGroup}>
                <label style={s.label}>Product ID</label>
                <input style={s.input} name="productID" value={nutrientForm.productID} onChange={handleNutrientChange} placeholder="e.g. 301" required />
              </div>
              <div style={s.formGroup}>
                <label style={s.label}>Nutrient ID</label>
                <input style={s.input} name="nutrientID" value={nutrientForm.nutrientID} onChange={handleNutrientChange} placeholder="e.g. 401" required />
              </div>
              <div style={s.formGroup}>
                <label style={s.label}>Quantity Per Unit</label>
                <input style={s.input} name="quantity_per_unit" type="number" value={nutrientForm.quantity_per_unit} onChange={handleNutrientChange} placeholder="e.g. 25" step="0.01" required />
              </div>
              <button style={s.submitBtn} type="submit">Add Mapping</button>
            </form>
            <div style={s.hint}>
              <strong>Nutrient IDs:</strong><br />
              401=Calories (kcal) · 402=Protein (g) · 403=Carbs (g) · 404=Fat (g)<br />
              405=Fiber (g) · 406=Sugar (g) · 407=Calcium (mg) · 408=Iron (mg)<br />
              409=Sodium (mg) · 410=Vitamin C (mg)<br /><br />
              <strong>Example:</strong> ProductID 316, NutrientID 401, Quantity 120
            </div>
          </div>

          {/* PRODUCTS TABLE */}
          <div style={s.tableCard}>
            <div style={s.cardTitle}>📦 All Products ({products.length})</div>
            <div style={{ overflowX: "auto" }}>
              <table style={s.table}>
                <thead>
                  <tr>
                    <th style={s.th}>ID</th>
                    <th style={s.th}>Product Name</th>
                    <th style={s.th}>Brand</th>
                    <th style={s.th}>Price</th>
                    <th style={s.th}>Category</th>
                    <th style={s.th}>Admin ID</th>
                    <th style={s.th}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.productID}>
                      <td style={s.td}>{p.productID}</td>
                      <td style={{ ...s.td, fontWeight: 500 }}>{p.productName}</td>
                      <td style={s.td}>{p.brand}</td>
                      <td style={{ ...s.td, fontWeight: 600, color: "#0f7b2e" }}>₹{Number(p.price).toFixed(2)}</td>
                      <td style={s.td}><span style={s.catBadge}>{p.category}</span></td>
                      <td style={s.td}>{p.adminID}</td>
                      <td style={s.td}>
                        <button style={s.deleteBtn} onClick={() => deleteProduct(p.productID)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {products.length === 0 && (
                <p style={{ textAlign: "center", color: "#888", padding: "24px" }}>No products yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
