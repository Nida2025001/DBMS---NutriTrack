import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { getImage } from "../utils/imageUtils";

const s = {
  page: { minHeight: "100vh", background: "#eef3f7", fontFamily: "'DM Sans', sans-serif" },
  nav: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "0 40px", height: "80px", background: "#fff",
    borderBottom: "1px solid #d4e8d4", position: "sticky", top: 0, zIndex: 100,
  },
  logo: { fontFamily: "'Sora', sans-serif", fontWeight: 800, fontSize: "1.4rem", color: "#0f7b2e" },
  navBtns: { display: "flex", gap: "8px" },
  btn: {
    padding: "9px 20px", borderRadius: "50px", fontWeight: 600, fontSize: "0.88rem",
    cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
  },
  body: { maxWidth: "1100px", margin: "0 auto", padding: "40px 24px" },
  backBtn: {
    display: "inline-flex", alignItems: "center", gap: "6px",
    padding: "9px 18px", borderRadius: "50px",
    border: "1.5px solid #d4e8d4", background: "#fff",
    fontSize: "0.88rem", fontWeight: 500, color: "#3a5a3a",
    cursor: "pointer", marginBottom: "28px",
    fontFamily: "'DM Sans', sans-serif",
  },
  layout: {
    display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px",
    alignItems: "start",
  },
  imgCard: {
    background: "#fff", borderRadius: "22px", overflow: "hidden",
    boxShadow: "0 4px 24px rgba(15,123,46,0.10)",
    border: "1px solid #e0f0e4",
  },
  img: { width: "100%", height: "340px", objectFit: "cover" },
  imgCaption: {
    padding: "12px 16px",
    background: "#f8fdf9",
    borderTop: "1px solid #e0f0e4",
    display: "flex", gap: "10px",
  },
  tag: {
    padding: "4px 12px", borderRadius: "50px",
    background: "#e6f4ea", color: "#0f7b2e",
    fontSize: "0.78rem", fontWeight: 600,
  },
  infoCard: {
    background: "#fff", borderRadius: "22px",
    padding: "32px", border: "1px solid #e0f0e4",
    boxShadow: "0 4px 24px rgba(15,123,46,0.10)",
  },
  catTag: {
    display: "inline-block", padding: "4px 12px",
    background: "#e6f4ea", color: "#0f7b2e",
    borderRadius: "50px", fontSize: "0.78rem", fontWeight: 600,
    marginBottom: "10px", textTransform: "uppercase",
  },
  productName: {
    fontFamily: "'Sora', sans-serif",
    fontSize: "1.7rem", fontWeight: 800, color: "#0a2e14",
    marginBottom: "4px", lineHeight: 1.2,
  },
  brand: { color: "#888", fontSize: "0.9rem", marginBottom: "16px" },
  price: {
    fontFamily: "'Sora', sans-serif",
    fontSize: "2rem", fontWeight: 800, color: "#0f7b2e",
    marginBottom: "24px",
  },
  qtyRow: {
    display: "flex", alignItems: "center", gap: "14px",
    marginBottom: "16px",
  },
  qtyLabel: { fontWeight: 600, fontSize: "0.88rem", color: "#3a5a3a", minWidth: "80px" },
  qtyBtns: { display: "flex", alignItems: "center", gap: "0" },
  qtyBtn: {
    width: "36px", height: "36px", border: "1.5px solid #d4e8d4",
    background: "#f8fdf9", borderRadius: "8px",
    fontSize: "1rem", fontWeight: 700, color: "#0f7b2e",
    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
  },
  qtyNum: {
    width: "44px", textAlign: "center",
    fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: "1rem",
  },
  subtotalRow: {
    display: "flex", justifyContent: "space-between",
    padding: "14px 0", borderTop: "1px solid #e0f0e4",
    borderBottom: "1px solid #e0f0e4", marginBottom: "20px",
  },
  subtotalLabel: { fontWeight: 600, color: "#3a5a3a" },
  subtotalVal: {
    fontFamily: "'Sora', sans-serif",
    fontWeight: 800, fontSize: "1.2rem", color: "#0f7b2e",
  },
  addToCartBtn: {
    width: "100%", padding: "14px",
    background: "#0f7b2e", color: "#fff",
    border: "none", borderRadius: "50px",
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 700, fontSize: "1rem",
    cursor: "pointer",
    boxShadow: "0 4px 20px rgba(15,123,46,0.3)",
  },
  nutriCard: {
    background: "#fff", borderRadius: "22px",
    padding: "28px", border: "1px solid #e0f0e4",
    boxShadow: "0 4px 24px rgba(15,123,46,0.10)",
    gridColumn: "1 / -1", marginTop: "8px",
  },
  nutriTitle: {
    fontFamily: "'Sora', sans-serif",
    fontWeight: 700, fontSize: "1.1rem", color: "#0a2e14",
    marginBottom: "18px",
    display: "flex", alignItems: "center", gap: "8px",
  },
  nutriGrid: {
    display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
    gap: "12px",
  },
  nutriItem: {
    background: "#f8fdf9", borderRadius: "12px",
    padding: "14px 16px", border: "1px solid #e0f0e4",
    textAlign: "center",
  },
  nutriName: { fontSize: "0.8rem", color: "#6b7b6b", marginBottom: "4px" },
  nutriVal: {
    fontFamily: "'Sora', sans-serif",
    fontWeight: 700, fontSize: "1rem", color: "#0f7b2e",
  },
};

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [nutrients, setNutrients] = useState([]);
  const [qty, setQty] = useState(1);
  const [toast, setToast] = useState("");

  useEffect(() => {
    axios.get(`/product/${id}`)
      .then((r) => { setProduct(r.data.product); setNutrients(r.data.nutrients); })
      .catch(console.error);
  }, [id]);

  if (!product) return <div style={{ padding: "60px", textAlign: "center", color: "#888" }}>Loading...</div>;

  const subtotal = (qty * product.price).toFixed(2);

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existing = cart.find((i) => i.productID === product.productID);
    if (existing) existing.quantity += qty;
    else cart.push({ ...product, quantity: qty });
    localStorage.setItem("cart", JSON.stringify(cart));
    setToast("Added to cart!");
    setTimeout(() => setToast(""), 2000);
  };

  return (
    <div style={s.page}>
      {toast && (
        <div style={{
          position: "fixed", bottom: "24px", right: "24px", zIndex: 999,
          background: "#0f7b2e", color: "#fff", padding: "12px 22px",
          borderRadius: "50px", fontWeight: 600,
        }}>{toast}</div>
      )}
      <nav style={s.nav}>
        <span style={s.logo}>🌿 NutriTrack</span>
        <div style={s.navBtns}>
          <button style={{ ...s.btn, background: "transparent", border: "1.5px solid #d4e8d4", color: "#3a5a3a" }}
            onClick={() => navigate("/shop")}>← Shop</button>
          <button style={{ ...s.btn, background: "#0f7b2e", border: "none", color: "#fff" }}
            onClick={() => navigate("/cart")}>🛒 Cart</button>
        </div>
      </nav>
      <div style={s.body}>
        <button style={s.backBtn} onClick={() => navigate("/shop")}>← Back to Shop</button>
        <div style={s.layout}>
          {/* IMAGE */}
          <div style={s.imgCard}>
            <img src={getImage(product)} alt={product.productName} style={s.img}
              onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&q=80"; }} />
            <div style={s.imgCaption}>
              <span style={s.tag}>{product.category}</span>
              <span style={s.tag}>ID: {product.productID}</span>
            </div>
          </div>

          {/* INFO */}
          <div style={s.infoCard}>
            <span style={s.catTag}>{product.category}</span>
            <div style={s.productName}>{product.productName}</div>
            <div style={s.brand}>by {product.brand}</div>
            <div style={s.price}>₹{Number(product.price).toFixed(2)}</div>

            <div style={s.qtyRow}>
              <span style={s.qtyLabel}>Quantity</span>
              <div style={s.qtyBtns}>
                <button style={s.qtyBtn} onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
                <span style={s.qtyNum}>{qty}</span>
                <button style={s.qtyBtn} onClick={() => setQty(q => q + 1)}>+</button>
              </div>
            </div>

            <div style={s.subtotalRow}>
              <span style={s.subtotalLabel}>Subtotal</span>
              <span style={s.subtotalVal}>₹{subtotal}</span>
            </div>

            <button style={s.addToCartBtn} onClick={addToCart}>
              Add to Cart
            </button>
          </div>

          {/* NUTRIENTS */}
          <div style={s.nutriCard}>
            <div style={s.nutriTitle}>🧬 Nutrition Facts <span style={{ color: "#888", fontWeight: 400, fontSize: "0.85rem" }}>(per unit)</span></div>
            {nutrients.length === 0 ? (
              <p style={{ color: "#888", fontSize: "0.9rem" }}>No nutrition data available for this product.</p>
            ) : (
              <div style={s.nutriGrid}>
                {nutrients.map((n) => (
                  <div key={n.nutrientName} style={s.nutriItem}>
                    <div style={s.nutriName}>{n.nutrientName}</div>
                    <div style={s.nutriVal}>{n.quantity_per_unit} {n.unit}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
