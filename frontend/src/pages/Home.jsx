import React from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f0faf4 0%, #e8f5ec 50%, #eef3f7 100%)",
    fontFamily: "'DM Sans', sans-serif",
  },
  nav: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 48px",
    height: "80px",
    background: "rgba(255,255,255,0.9)",
    backdropFilter: "blur(12px)",
    borderBottom: "1px solid #d4e8d4",
    position: "sticky",
    top: 0,
    zIndex: 100,
    boxShadow: "0 2px 20px rgba(15,123,46,0.08)",
  },
  logo: {
    fontFamily: "'Sora', sans-serif",
    fontWeight: 800,
    fontSize: "1.6rem",
    color: "#0f7b2e",
    letterSpacing: "-0.5px",
  },
  logoSpan: { color: "#1aad44" },
  navLinks: {
    display: "flex",
    gap: "8px",
    alignItems: "center",
  },
  navLink: {
    padding: "8px 18px",
    borderRadius: "50px",
    fontWeight: 500,
    fontSize: "0.9rem",
    color: "#1a2e1a",
    transition: "all 0.2s",
    cursor: "pointer",
    background: "transparent",
    border: "none",
  },
  navBtn: {
    padding: "9px 22px",
    borderRadius: "50px",
    fontWeight: 600,
    fontSize: "0.9rem",
    background: "#0f7b2e",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    transition: "background 0.2s",
  },
  hero: {
    textAlign: "center",
    padding: "100px 24px 60px",
    maxWidth: "800px",
    margin: "0 auto",
  },
  badge: {
    display: "inline-block",
    padding: "6px 16px",
    background: "#e6f4ea",
    color: "#0f7b2e",
    borderRadius: "50px",
    fontSize: "0.8rem",
    fontWeight: 600,
    marginBottom: "24px",
    letterSpacing: "0.5px",
    textTransform: "uppercase",
  },
  heroTitle: {
    fontFamily: "'Sora', sans-serif",
    fontSize: "clamp(2.6rem, 6vw, 4.2rem)",
    fontWeight: 800,
    color: "#0a2e14",
    lineHeight: 1.1,
    marginBottom: "20px",
    letterSpacing: "-1px",
  },
  heroGreen: { color: "#0f7b2e" },
  heroSub: {
    fontSize: "1.15rem",
    color: "#4a6b4a",
    maxWidth: "560px",
    margin: "0 auto 40px",
    lineHeight: 1.7,
    fontWeight: 400,
  },
  heroButtons: {
    display: "flex",
    gap: "16px",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  btnPrimary: {
    padding: "14px 36px",
    background: "#0f7b2e",
    color: "#fff",
    border: "none",
    borderRadius: "50px",
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 700,
    fontSize: "1rem",
    cursor: "pointer",
    boxShadow: "0 4px 20px rgba(15,123,46,0.35)",
    transition: "all 0.2s",
  },
  btnSecondary: {
    padding: "14px 36px",
    background: "transparent",
    color: "#0f7b2e",
    border: "2px solid #0f7b2e",
    borderRadius: "50px",
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 700,
    fontSize: "1rem",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  statsRow: {
    display: "flex",
    justifyContent: "center",
    gap: "48px",
    padding: "40px 24px",
    flexWrap: "wrap",
  },
  stat: { textAlign: "center" },
  statNum: {
    fontFamily: "'Sora', sans-serif",
    fontSize: "2rem",
    fontWeight: 800,
    color: "#0f7b2e",
    display: "block",
  },
  statLabel: { fontSize: "0.85rem", color: "#6b7b6b", fontWeight: 500 },
  featuresSection: {
    padding: "60px 24px",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  sectionTitle: {
    fontFamily: "'Sora', sans-serif",
    fontSize: "2rem",
    fontWeight: 800,
    textAlign: "center",
    color: "#0a2e14",
    marginBottom: "48px",
    letterSpacing: "-0.5px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "24px",
  },
  card: {
    background: "#fff",
    borderRadius: "22px",
    padding: "36px 28px",
    boxShadow: "0 4px 24px rgba(15,123,46,0.08)",
    border: "1px solid #e0f0e4",
    transition: "transform 0.2s, box-shadow 0.2s",
    cursor: "default",
  },
  cardIcon: {
    fontSize: "2.4rem",
    marginBottom: "16px",
    display: "block",
  },
  cardTitle: {
    fontFamily: "'Sora', sans-serif",
    fontWeight: 700,
    fontSize: "1.05rem",
    color: "#0a2e14",
    marginBottom: "8px",
  },
  cardText: {
    fontSize: "0.88rem",
    color: "#6b7b6b",
    lineHeight: 1.6,
  },
  footer: {
    textAlign: "center",
    padding: "40px 24px",
    color: "#6b7b6b",
    fontSize: "0.85rem",
    borderTop: "1px solid #d4e8d4",
    background: "#fff",
  },
};

const features = [
  { icon: "🥦", title: "Protein Foods", desc: "High-quality proteins, eggs, dairy, and supplements for muscle health." },
  { icon: "🥜", title: "Healthy Snacks", desc: "Nuts, seeds, and wholesome snacks that fuel your day without guilt." },
  { icon: "🌿", title: "Organic Products", desc: "Certified organic produce and pantry staples, farm to your table." },
  { icon: "📊", title: "Nutrient Tracking", desc: "See exactly what nutrients you've consumed from every purchase." },
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <div style={styles.page}>
      {/* NAVBAR */}
      <nav style={styles.nav}>
        <span style={styles.logo}>
          Nutri<span style={styles.logoSpan}>Track</span>
        </span>
        <div style={styles.navLinks}>
          <button style={styles.navLink} onClick={() => navigate("/")}>Home</button>
          <button style={styles.navLink} onClick={() => navigate("/signup")}>Sign Up</button>
          <button style={styles.navBtn} onClick={() => navigate("/login")}>Login</button>
        </div>
      </nav>

      {/* HERO */}
      <section style={styles.hero}>
        <span style={styles.badge}>🌱 Health-First Shopping</span>
        <h1 style={styles.heroTitle}>
          Eat Better,<br />
          <span style={styles.heroGreen}>Track Smarter</span>
        </h1>
        <p style={styles.heroSub}>
          NutriTrack helps you shop healthy food products and monitor the nutrients
          you consume based on your purchases.
        </p>
        <div style={styles.heroButtons}>
          <button style={styles.btnPrimary} onClick={() => navigate("/signup")}>
            Get Started →
          </button>
          <button style={styles.btnSecondary} onClick={() => navigate("/login")}>
            Login
          </button>
        </div>
      </section>

      {/* STATS */}
      <div style={styles.statsRow}>
        {[
          { num: "200+", label: "Healthy Products" },
          { num: "15+", label: "Nutrient Types Tracked" },
          { num: "100%", label: "Natural & Organic" },
          { num: "24/7", label: "Nutrition Insights" },
        ].map((s) => (
          <div key={s.label} style={styles.stat}>
            <span style={styles.statNum}>{s.num}</span>
            <span style={styles.statLabel}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* FEATURES */}
      <section style={styles.featuresSection}>
        <h2 style={styles.sectionTitle}>Everything You Need to Eat Well</h2>
        <div style={styles.grid}>
          {features.map((f) => (
            <div
              key={f.title}
              style={styles.card}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 12px 40px rgba(15,123,46,0.16)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 24px rgba(15,123,46,0.08)";
              }}
            >
              <span style={styles.cardIcon}>{f.icon}</span>
              <div style={styles.cardTitle}>{f.title}</div>
              <div style={styles.cardText}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer style={styles.footer}>
        © 2024 NutriTrack — Eat Better, Track Smarter
      </footer>
    </div>
  );
}
