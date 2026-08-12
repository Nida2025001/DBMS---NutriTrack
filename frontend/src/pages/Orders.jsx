import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const s = {
  page: { minHeight: "100vh", background: "#eef3f7", fontFamily: "'DM Sans', sans-serif" },
  nav: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "0 40px", height: "80px", background: "#fff",
    borderBottom: "1px solid #d4e8d4", position: "sticky", top: 0, zIndex: 100,
  },
  logo: { fontFamily: "'Sora', sans-serif", fontWeight: 800, fontSize: "1.4rem", color: "#0f7b2e" },
  body: { maxWidth: "860px", margin: "0 auto", padding: "40px 24px" },
  pageTitle: { fontFamily: "'Sora', sans-serif", fontWeight: 800, fontSize: "2rem", color: "#0a2e14", marginBottom: "6px" },
  subtitle: { color: "#6b7b6b", fontSize: "0.92rem", marginBottom: "32px" },
  orderCard: {
    background: "#fff", borderRadius: "18px",
    border: "1px solid #e0f0e4",
    boxShadow: "0 2px 16px rgba(15,123,46,0.07)",
    marginBottom: "16px", overflow: "hidden",
  },
  orderHeader: {
    display: "flex", justifyContent: "space-between",
    alignItems: "center", padding: "18px 24px",
    background: "#f8fdf9", borderBottom: "1px solid #e0f0e4",
    flexWrap: "wrap", gap: "10px",
  },
  orderId: { fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: "0.95rem", color: "#0a2e14" },
  orderDate: { fontSize: "0.82rem", color: "#888" },
  statusBadge: {
    padding: "4px 14px", borderRadius: "50px",
    background: "#e6f4ea", color: "#0f7b2e",
    fontSize: "0.78rem", fontWeight: 700,
  },
  itemsTable: { padding: "16px 24px" },
  tableHeader: {
    display: "grid", gridTemplateColumns: "1fr auto auto",
    gap: "16px", padding: "8px 0", borderBottom: "1px solid #e0f0e4",
    fontSize: "0.78rem", fontWeight: 600, color: "#888",
    textTransform: "uppercase", letterSpacing: "0.4px",
  },
  tableRow: {
    display: "grid", gridTemplateColumns: "1fr auto auto",
    gap: "16px", padding: "10px 0", borderBottom: "1px solid #f5f5f5",
    alignItems: "center",
  },
  productName: { fontSize: "0.9rem", fontWeight: 500, color: "#1a2e1a" },
  qty: { fontSize: "0.9rem", color: "#555", textAlign: "center" },
  price: { fontSize: "0.9rem", fontWeight: 600, color: "#0f7b2e", textAlign: "right" },
  orderTotal: {
    padding: "12px 24px",
    display: "flex", justifyContent: "flex-end", gap: "12px",
    alignItems: "center", background: "#f8fdf9",
  },
  empty: {
    textAlign: "center", padding: "80px 24px", background: "#fff",
    borderRadius: "20px", border: "1px solid #e0f0e4",
  },
  navBtn: {
    padding: "9px 18px", borderRadius: "50px", fontWeight: 600, fontSize: "0.88rem",
    cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
  },
};

export default function Orders() {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const [orders, setOrders] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) { navigate("/login"); return; }
    axios.get(`/orders/${userId}`)
      .then((r) => {
        // Group by orderID
        const grouped = {};
        r.data.forEach((row) => {
          if (!grouped[row.orderID]) {
            grouped[row.orderID] = {
              orderID: row.orderID,
              orderDate: row.orderDate,
              orderStatus: row.orderStatus,
              items: [],
            };
          }
          grouped[row.orderID].items.push({
            productName: row.productName,
            quantity: row.quantity,
            price: row.price,
          });
        });
        setOrders(grouped);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [userId, navigate]);

  const orderList = Object.values(orders);

  return (
    <div style={s.page}>
      <nav style={s.nav}>
        <span style={s.logo}>🌿 NutriTrack</span>
        <div style={{ display: "flex", gap: "8px" }}>
          <button style={{ ...s.navBtn, background: "transparent", border: "1.5px solid #d4e8d4", color: "#3a5a3a" }}
            onClick={() => navigate("/shop")}>← Shop</button>
          <button style={{ ...s.navBtn, background: "#0f7b2e", border: "none", color: "#fff" }}
            onClick={() => navigate("/nutrition")}>Nutrition Dashboard</button>
        </div>
      </nav>

      <div style={s.body}>
        <h1 style={s.pageTitle}>My Orders 📦</h1>
        <p style={s.subtitle}>Your complete order history</p>

        {loading && <p style={{ color: "#888" }}>Loading orders...</p>}

        {!loading && orderList.length === 0 && (
          <div style={s.empty}>
            <div style={{ fontSize: "3.5rem" }}>📦</div>
            <p style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: "1.2rem", color: "#0a2e14", marginTop: "12px" }}>No orders yet</p>
            <p style={{ color: "#888", marginTop: "8px" }}>Start shopping to see your orders here</p>
            <button style={{ marginTop: "20px", padding: "12px 28px", background: "#0f7b2e", color: "#fff", border: "none", borderRadius: "50px", fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}
              onClick={() => navigate("/shop")}>Shop Now</button>
          </div>
        )}

        {orderList.map((order) => {
          const orderTotal = order.items.reduce((sum, i) => sum + i.quantity * i.price, 0);
          return (
            <div key={order.orderID} style={s.orderCard}>
              <div style={s.orderHeader}>
                <div>
                  <div style={s.orderId}>Order #{order.orderID}</div>
                  <div style={s.orderDate}>{new Date(order.orderDate).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}</div>
                </div>
                <span style={s.statusBadge}>✓ {order.orderStatus}</span>
              </div>

              <div style={s.itemsTable}>
                <div style={s.tableHeader}>
                  <span>Product</span>
                  <span>Qty</span>
                  <span>Subtotal</span>
                </div>
                {order.items.map((item, i) => (
                  <div key={i} style={s.tableRow}>
                    <span style={s.productName}>{item.productName}</span>
                    <span style={s.qty}>×{item.quantity}</span>
                    <span style={s.price}>₹{(item.quantity * item.price).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div style={s.orderTotal}>
                <span style={{ fontSize: "0.9rem", color: "#555" }}>Order Total</span>
                <span style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: "1.1rem", color: "#0f7b2e" }}>
                  ₹{orderTotal.toFixed(2)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
