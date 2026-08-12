import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getImage } from "../utils/imageUtils";

const s = {
  page: { minHeight: "100vh", background: "#eef3f7", fontFamily: "'DM Sans', sans-serif" },
  nav: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "0 40px", height: "80px", background: "#fff",
    borderBottom: "1px solid #d4e8d4", position: "sticky", top: 0, zIndex: 100,
  },
  logo: { fontFamily: "'Sora', sans-serif", fontWeight: 800, fontSize: "1.4rem", color: "#0f7b2e" },
  body: { maxWidth: "960px", margin: "0 auto", padding: "40px 24px" },
  pageTitle: {
    fontFamily: "'Sora', sans-serif", fontWeight: 800, fontSize: "2rem",
    color: "#0a2e14", marginBottom: "8px",
  },
  subtitle: { color: "#6b7b6b", fontSize: "0.92rem", marginBottom: "28px" },
  layout: { display: "grid", gridTemplateColumns: "1fr 320px", gap: "24px", alignItems: "start" },
  itemsCol: { display: "flex", flexDirection: "column", gap: "16px" },
  itemCard: {
    background: "#fff", borderRadius: "16px", padding: "16px",
    display: "flex", gap: "16px", alignItems: "center",
    border: "1px solid #e0f0e4", boxShadow: "0 2px 12px rgba(15,123,46,0.07)",
  },
  img: { width: "80px", height: "80px", objectFit: "cover", borderRadius: "12px", flexShrink: 0 },
  itemInfo: { flex: 1 },
  itemName: { fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: "0.95rem", color: "#0a2e14", marginBottom: "2px" },
  itemCat: { fontSize: "0.78rem", color: "#888", marginBottom: "6px" },
  itemPrice: { fontSize: "0.88rem", color: "#555" },
  qtyRow: { display: "flex", alignItems: "center", gap: "8px" },
  qtyBtn: {
    width: "30px", height: "30px", border: "1.5px solid #d4e8d4",
    background: "#f8fdf9", borderRadius: "6px",
    fontWeight: 700, color: "#0f7b2e", cursor: "pointer", fontSize: "1rem",
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  qtyNum: { fontFamily: "'Sora', sans-serif", fontWeight: 700, minWidth: "24px", textAlign: "center" },
  subtotal: { fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: "1rem", color: "#0f7b2e", minWidth: "70px", textAlign: "right" },
  removeBtn: {
    background: "none", border: "none", color: "#ccc",
    fontSize: "1.2rem", cursor: "pointer", padding: "4px",
    transition: "color 0.2s",
  },
  summaryCard: {
    background: "#fff", borderRadius: "20px", padding: "28px",
    border: "1px solid #e0f0e4", boxShadow: "0 4px 24px rgba(15,123,46,0.10)",
    position: "sticky", top: "100px",
  },
  summaryTitle: {
    fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: "1.1rem",
    color: "#0a2e14", marginBottom: "20px",
  },
  summaryRow: {
    display: "flex", justifyContent: "space-between",
    padding: "8px 0", borderBottom: "1px solid #f0f0f0",
    fontSize: "0.9rem", color: "#555",
  },
  totalRow: {
    display: "flex", justifyContent: "space-between",
    padding: "14px 0 0",
    fontFamily: "'Sora', sans-serif", fontWeight: 800,
    fontSize: "1.2rem", color: "#0a2e14",
  },
  placeOrderBtn: {
    width: "100%", padding: "14px",
    background: "#0f7b2e", color: "#fff", border: "none",
    borderRadius: "50px", fontFamily: "'DM Sans', sans-serif",
    fontWeight: 700, fontSize: "1rem", cursor: "pointer",
    marginTop: "16px", boxShadow: "0 4px 20px rgba(15,123,46,0.3)",
  },
  clearBtn: {
    width: "100%", padding: "10px",
    background: "transparent", color: "#c0392b", border: "1.5px solid #f5c6c6",
    borderRadius: "50px", fontFamily: "'DM Sans', sans-serif",
    fontWeight: 600, fontSize: "0.88rem", cursor: "pointer", marginTop: "10px",
  },
  emptyState: {
    background: "#fff", borderRadius: "20px", padding: "80px 24px",
    textAlign: "center", border: "1px solid #e0f0e4",
  },
  navBtn: {
    padding: "9px 18px", borderRadius: "50px", fontWeight: 600, fontSize: "0.88rem",
    cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
  },
};

export default function Cart() {
  const navigate = useNavigate();
  const [cart, setCart] = useState(JSON.parse(localStorage.getItem("cart") || "[]"));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const save = (updated) => {
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const updateQty = (idx, delta) => {
    const updated = [...cart];
    updated[idx].quantity = Math.max(1, updated[idx].quantity + delta);
    save(updated);
  };

  const remove = (idx) => {
    const updated = cart.filter((_, i) => i !== idx);
    save(updated);
  };

  const clear = () => { save([]); };

  const total = cart.reduce((sum, i) => sum + i.quantity * i.price, 0);

  const placeOrder = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) { navigate("/login"); return; }
    if (cart.length === 0) { setError("Cart is empty."); return; }
    setLoading(true);
    setError("");
    try {
      await axios.post("/place-order", {
        userID: userId,
        cartItems: cart.map((i) => ({ productID: i.productID, quantity: i.quantity })),
      });
      save([]);
      navigate("/orders");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to place order.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <nav style={s.nav}>
        <span style={s.logo}>🌿 NutriTrack</span>
        <div style={{ display: "flex", gap: "8px" }}>
          <button style={{ ...s.navBtn, background: "transparent", border: "1.5px solid #d4e8d4", color: "#3a5a3a" }}
            onClick={() => navigate("/shop")}>← Continue Shopping</button>
          <button style={{ ...s.navBtn, background: "#0f7b2e", border: "none", color: "#fff" }}
            onClick={() => navigate("/orders")}>My Orders</button>
        </div>
      </nav>

      <div style={s.body}>
        <h1 style={s.pageTitle}>Your Cart 🛒</h1>
        <p style={s.subtitle}>{cart.length} item{cart.length !== 1 ? "s" : ""} in your cart</p>

        {error && (
          <div style={{ background: "#fff0f0", border: "1px solid #ffc0c0", borderRadius: "10px", padding: "12px 16px", color: "#c0392b", marginBottom: "16px" }}>
            {error}
          </div>
        )}

        {cart.length === 0 ? (
          <div style={s.emptyState}>
            <div style={{ fontSize: "3.5rem" }}>🛒</div>
            <p style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: "1.2rem", color: "#0a2e14", marginTop: "12px" }}>Your cart is empty</p>
            <p style={{ color: "#888", marginTop: "8px" }}>Browse our shop to add healthy products</p>
            <button style={{ marginTop: "20px", padding: "12px 28px", background: "#0f7b2e", color: "#fff", border: "none", borderRadius: "50px", fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}
              onClick={() => navigate("/shop")}>Go to Shop</button>
          </div>
        ) : (
          <div style={s.layout}>
            {/* ITEMS */}
            <div style={s.itemsCol}>
              {cart.map((item, idx) => (
                <div key={idx} style={s.itemCard}>
                  <img src={getImage(item)} alt={item.productName} style={s.img}
                    onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&q=80"; }} />
                  <div style={s.itemInfo}>
                    <div style={s.itemName}>{item.productName}</div>
                    <div style={s.itemCat}>{item.category} · {item.brand}</div>
                    <div style={s.itemPrice}>₹{Number(item.price).toFixed(2)} each</div>
                    <div style={{ ...s.qtyRow, marginTop: "8px" }}>
                      <button style={s.qtyBtn} onClick={() => updateQty(idx, -1)}>−</button>
                      <span style={s.qtyNum}>{item.quantity}</span>
                      <button style={s.qtyBtn} onClick={() => updateQty(idx, 1)}>+</button>
                    </div>
                  </div>
                  <span style={s.subtotal}>₹{(item.quantity * item.price).toFixed(2)}</span>
                  <button style={s.removeBtn}
                    onMouseEnter={(e) => e.target.style.color = "#c0392b"}
                    onMouseLeave={(e) => e.target.style.color = "#ccc"}
                    onClick={() => remove(idx)}>✕</button>
                </div>
              ))}
            </div>

            {/* SUMMARY */}
            <div style={s.summaryCard}>
              <div style={s.summaryTitle}>Order Summary</div>
              {cart.map((item, idx) => (
                <div key={idx} style={s.summaryRow}>
                  <span>{item.productName.substring(0, 20)}{item.productName.length > 20 ? "…" : ""} ×{item.quantity}</span>
                  <span>₹{(item.quantity * item.price).toFixed(2)}</span>
                </div>
              ))}
              <div style={s.totalRow}>
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
              <button style={s.placeOrderBtn} onClick={placeOrder} disabled={loading}>
                {loading ? "Placing Order..." : "Place Order →"}
              </button>
              <button style={s.clearBtn} onClick={clear}>Clear Cart</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
