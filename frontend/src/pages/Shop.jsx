import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getImage } from "../utils/imageUtils";

const CATEGORIES = ["All", "Proteins", "Vegetables", "Snacks", "Supplements", "Drinks"];

const s = {
  page: { minHeight: "100vh", width: "100%", background: "#eef3f7", fontFamily: "'DM Sans', sans-serif" },
  nav: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "0 40px", height: "80px",
    background: "rgba(255,255,255,0.96)", backdropFilter: "blur(12px)",
    borderBottom: "1px solid #d4e8d4", position: "sticky", top: 0, zIndex: 100,
    boxShadow: "0 2px 20px rgba(15,123,46,0.08)",
  },
  logo: { fontFamily: "'Sora', sans-serif", fontWeight: 800, fontSize: "1.5rem", color: "#0f7b2e" },
  navLinks: { display: "flex", gap: "4px", alignItems: "center" },
  navBtn: {
    padding: "8px 16px", borderRadius: "50px", fontWeight: 500, fontSize: "0.88rem",
    color: "#1a2e1a", background: "transparent", border: "none", cursor: "pointer",
    transition: "background 0.2s", fontFamily: "'DM Sans', sans-serif",
  },
  navBtnActive: {
    padding: "8px 16px", borderRadius: "50px", fontWeight: 600, fontSize: "0.88rem",
    color: "#0f7b2e", background: "#e6f4ea", border: "none", cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
  },
  cartBtn: {
    padding: "8px 18px", borderRadius: "50px", fontWeight: 600, fontSize: "0.88rem",
    color: "#fff", background: "#0f7b2e", border: "none", cursor: "pointer",
    display: "flex", alignItems: "center", gap: "6px", fontFamily: "'DM Sans', sans-serif",
  },
  adminBtn: {
    padding: "8px 16px", borderRadius: "50px", fontWeight: 600, fontSize: "0.88rem",
    color: "#0a2e14", background: "#d4f5d4", border: "none", cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
  },
  signoutBtn: {
    padding: "8px 16px", borderRadius: "50px", fontWeight: 500, fontSize: "0.88rem",
    color: "#888", background: "transparent", border: "1px solid #ddd", cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
  },
  hero: {
    width: "100%",
    background: "linear-gradient(135deg, #0a2e14 0%, #0f5a26 50%, #1a8a40 100%)",
    padding: "72px 48px",
    position: "relative",
    overflow: "hidden",
  },
  heroBg: {
    position: "absolute", inset: 0,
    backgroundImage: "radial-gradient(circle at 70% 50%, rgba(26,173,68,0.15) 0%, transparent 60%)",
  },
  heroContent: { position: "relative", maxWidth: "600px" },
  heroTitle: {
    fontFamily: "'Sora', sans-serif",
    fontSize: "clamp(2rem, 4vw, 3.2rem)",
    fontWeight: 800, color: "#fff", lineHeight: 1.15, marginBottom: "14px", letterSpacing: "-0.5px",
  },
  heroSub: { color: "rgba(255,255,255,0.75)", fontSize: "1rem", lineHeight: 1.65, maxWidth: "480px" },
  shopBody: { padding: "32px 40px", maxWidth: "1400px", margin: "0 auto" },
  controls: {
    display: "flex", gap: "16px", alignItems: "center",
    marginBottom: "24px", flexWrap: "wrap",
  },
  searchWrap: {
    flex: 1, minWidth: "220px", position: "relative",
  },
  searchIcon: {
    position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)",
    fontSize: "1rem", color: "#888",
  },
  searchInput: {
    width: "100%", padding: "11px 16px 11px 40px",
    borderRadius: "50px", border: "1.5px solid #d4e8d4",
    fontSize: "0.92rem", background: "#fff", outline: "none",
    fontFamily: "'DM Sans', sans-serif",
  },
  chips: { display: "flex", gap: "8px", flexWrap: "wrap" },
  chip: {
    padding: "7px 18px", borderRadius: "50px",
    border: "1.5px solid #d4e8d4", background: "#fff",
    fontSize: "0.82rem", fontWeight: 500, cursor: "pointer",
    transition: "all 0.2s", fontFamily: "'DM Sans', sans-serif",
  },
  chipActive: {
    padding: "7px 18px", borderRadius: "50px",
    border: "1.5px solid #0f7b2e", background: "#0f7b2e",
    fontSize: "0.82rem", fontWeight: 600, cursor: "pointer",
    color: "#fff", fontFamily: "'DM Sans', sans-serif",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
    gap: "20px",
  },
  card: {
    background: "#fff", borderRadius: "20px",
    overflow: "hidden", border: "1px solid #e8f0ea",
    boxShadow: "0 2px 16px rgba(15,123,46,0.07)",
    transition: "transform 0.2s, box-shadow 0.2s",
    display: "flex", flexDirection: "column",
  },
  img: { width: "100%", height: "180px", objectFit: "cover" },
  cardBody: { padding: "16px", display: "flex", flexDirection: "column", flex: 1 },
  catTag: {
    display: "inline-block", padding: "3px 10px",
    background: "#e6f4ea", color: "#0f7b2e",
    borderRadius: "50px", fontSize: "0.72rem", fontWeight: 600,
    marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.3px",
  },
  productName: {
    fontFamily: "'Sora', sans-serif",
    fontWeight: 700, fontSize: "0.95rem", color: "#0a2e14",
    marginBottom: "4px", lineHeight: 1.3,
  },
  brand: { fontSize: "0.8rem", color: "#888", marginBottom: "10px" },
  price: {
    fontFamily: "'Sora', sans-serif",
    fontWeight: 700, fontSize: "1.1rem", color: "#0f7b2e", marginBottom: "12px",
  },
  cardBtns: { display: "flex", gap: "8px", marginTop: "auto" },
  viewBtn: {
    flex: 1, padding: "9px", borderRadius: "50px",
    border: "1.5px solid #0f7b2e", background: "transparent",
    color: "#0f7b2e", fontWeight: 600, fontSize: "0.82rem",
    cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
  },
  addBtn: {
    flex: 1, padding: "9px", borderRadius: "50px",
    border: "none", background: "#0f7b2e",
    color: "#fff", fontWeight: 600, fontSize: "0.82rem",
    cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
  },
  empty: {
    textAlign: "center", padding: "80px 24px", color: "#888",
  },
  cartCount: {
    background: "#fff", color: "#0f7b2e",
    borderRadius: "50%", width: "20px", height: "20px",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "0.72rem", fontWeight: 700,
  },
};

export default function Shop() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [toast, setToast] = useState("");
  const role = localStorage.getItem("role");
  const userName = localStorage.getItem("userName") || "";

  useEffect(() => {
    axios.get("/products").then((r) => setProducts(r.data)).catch(console.error);
  }, []);

  const cartItems = JSON.parse(localStorage.getItem("cart") || "[]");

  const filtered = products.filter((p) => {
    const matchSearch = p.productName.toLowerCase().includes(search.toLowerCase()) ||
      (p.brand || "").toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "All" || p.category.toLowerCase() === category.toLowerCase();
    return matchSearch && matchCat;
  });

  const addToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existing = cart.find((i) => i.productID === product.productID);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    setToast(`${product.productName} added to cart!`);
    setTimeout(() => setToast(""), 2500);
  };

  const signOut = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div style={s.page}>
      {/* TOAST */}
      {toast && (
        <div style={{
          position: "fixed", bottom: "24px", right: "24px", zIndex: 999,
          background: "#0f7b2e", color: "#fff", padding: "12px 22px",
          borderRadius: "50px", fontWeight: 600, fontSize: "0.9rem",
          boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
        }}>{toast}</div>
      )}

      {/* NAVBAR */}
      <nav style={s.nav}>
        <span style={s.logo}>🌿 NutriTrack</span>
        <div style={s.navLinks}>
          <button style={s.navBtnActive} onClick={() => navigate("/shop")}>Shop</button>
          <button style={s.navBtn} onClick={() => navigate("/nutrition")}>Nutrition</button>
          <button style={s.navBtn} onClick={() => navigate("/orders")}>My Orders</button>
          {role === "admin" && (
            <button style={s.adminBtn} onClick={() => navigate("/admin")}>⚙ Admin</button>
          )}
          <button style={s.cartBtn} onClick={() => navigate("/cart")}>
            🛒 Cart
            {cartItems.length > 0 && (
              <span style={s.cartCount}>{cartItems.reduce((a, i) => a + i.quantity, 0)}</span>
            )}
          </button>
          <span style={{ fontSize: "0.85rem", color: "#888", padding: "0 4px" }}>
            👤 {userName.split(" ")[0]}
          </span>
          <button style={s.signoutBtn} onClick={signOut}>Sign Out</button>
        </div>
      </nav>

      {/* HERO */}
      <div style={s.hero}>
        <div style={s.heroBg} />
        <div style={s.heroContent}>
          <h1 style={s.heroTitle}>Fuel your body<br />with what it deserves</h1>
          <p style={s.heroSub}>
            Premium health foods, supplements, and snacks — carefully sourced
            for people who take nutrition seriously.
          </p>
        </div>
      </div>

      {/* SHOP BODY */}
      <div style={s.shopBody}>
        {/* CONTROLS */}
        <div style={s.controls}>
          <div style={s.searchWrap}>
            <span style={s.searchIcon}>🔍</span>
            <input
              style={s.searchInput}
              placeholder="Search products or brands..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div style={s.chips}>
            {CATEGORIES.map((c) => (
              <button
                key={c}
                style={category === c ? s.chipActive : s.chip}
                onClick={() => setCategory(c)}
              >{c}</button>
            ))}
          </div>
        </div>

        {/* GRID */}
        {filtered.length === 0 ? (
          <div style={s.empty}>
            <div style={{ fontSize: "3rem" }}>🥦</div>
            <p style={{ marginTop: "12px", fontWeight: 600 }}>No products found</p>
            <p style={{ fontSize: "0.88rem" }}>Try a different search or category</p>
          </div>
        ) : (
          <div style={s.grid}>
            {filtered.map((p) => (
              <div
                key={p.productID}
                style={s.card}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "0 12px 32px rgba(15,123,46,0.14)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 2px 16px rgba(15,123,46,0.07)";
                }}
              >
                <img
                  src={getImage(p)}
                  alt={p.productName}
                  style={s.img}
                  onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&q=80"; }}
                />
                <div style={s.cardBody}>
                  <span style={s.catTag}>{p.category}</span>
                  <div style={s.productName}>{p.productName}</div>
                  <div style={s.brand}>{p.brand}</div>
                  <div style={s.price}>₹{Number(p.price).toFixed(2)}</div>
                  <div style={s.cardBtns}>
                    <button style={s.viewBtn} onClick={() => navigate(`/product/${p.productID}`)}>
                      View Details
                    </button>
                    <button style={s.addBtn} onClick={() => addToCart(p)}>
                      + Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
