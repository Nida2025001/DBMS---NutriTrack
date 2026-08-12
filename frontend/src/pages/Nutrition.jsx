import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const PIE_COLORS = [
  "#0f7b2e", "#1aad44", "#2ecc71", "#27ae60",
  "#52d68a", "#82e0aa", "#a9dfbf", "#d5f5e3",
  "#f9e79f", "#f0b27a", "#e59866", "#d98880",
];

const s = {
  page: { minHeight: "100vh", background: "#eef3f7", fontFamily: "'DM Sans', sans-serif" },
  nav: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "0 40px", height: "80px", background: "#fff",
    borderBottom: "1px solid #d4e8d4", position: "sticky", top: 0, zIndex: 100,
  },
  logo: { fontFamily: "'Sora', sans-serif", fontWeight: 800, fontSize: "1.4rem", color: "#0f7b2e" },
  body: { maxWidth: "1000px", margin: "0 auto", padding: "40px 24px" },
  pageTitle: { fontFamily: "'Sora', sans-serif", fontWeight: 800, fontSize: "2rem", color: "#0a2e14", marginBottom: "6px" },
  subtitle: { color: "#6b7b6b", fontSize: "0.92rem", marginBottom: "32px" },
  layout: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "28px", alignItems: "start" },
  chartCard: {
    background: "#fff", borderRadius: "22px", padding: "28px",
    border: "1px solid #e0f0e4", boxShadow: "0 4px 24px rgba(15,123,46,0.10)",
  },
  cardTitle: {
    fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: "1.1rem",
    color: "#0a2e14", marginBottom: "20px",
  },
  chartWrap: { maxWidth: "280px", margin: "0 auto" },
  summaryCard: {
    background: "#fff", borderRadius: "22px", padding: "28px",
    border: "1px solid #e0f0e4", boxShadow: "0 4px 24px rgba(15,123,46,0.10)",
  },
  nutriRow: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "12px 0", borderBottom: "1px solid #f0f0f0",
  },
  nutriLeft: { display: "flex", alignItems: "center", gap: "12px" },
  colorDot: { width: "12px", height: "12px", borderRadius: "50%", flexShrink: 0 },
  nutriName: { fontWeight: 500, fontSize: "0.92rem", color: "#1a2e1a" },
  nutriVal: {
    fontFamily: "'Sora', sans-serif",
    fontWeight: 700, fontSize: "0.95rem", color: "#0f7b2e",
  },
  nutriUnit: { fontSize: "0.78rem", color: "#888", fontWeight: 400, marginLeft: "3px" },
  empty: {
    background: "#fff", borderRadius: "20px", padding: "80px 24px",
    textAlign: "center", border: "1px solid #e0f0e4", gridColumn: "1 / -1",
  },
  navBtn: {
    padding: "9px 18px", borderRadius: "50px", fontWeight: 600, fontSize: "0.88rem",
    cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
  },
};

export default function Nutrition() {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const [nutrition, setNutrition] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) { navigate("/login"); return; }
    axios.get(`/nutrition/${userId}`)
      .then((r) => setNutrition(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [userId, navigate]);

  const chartData = {
    labels: nutrition.map((n) => n.nutrientName),
    datasets: [{
      data: nutrition.map((n) => parseFloat(n.total_amount)),
      backgroundColor: PIE_COLORS.slice(0, nutrition.length),
      borderColor: "#fff",
      borderWidth: 2,
    }],
  };

  const chartOptions = {
    plugins: {
      legend: { position: "bottom", labels: { font: { family: "DM Sans", size: 12 }, padding: 14 } },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const n = nutrition[ctx.dataIndex];
            return ` ${ctx.label}: ${ctx.parsed.toFixed(1)} ${n.unit}`;
          },
        },
      },
    },
    maintainAspectRatio: true,
  };

  return (
    <div style={s.page}>
      <nav style={s.nav}>
        <span style={s.logo}>🌿 NutriTrack</span>
        <div style={{ display: "flex", gap: "8px" }}>
          <button style={{ ...s.navBtn, background: "transparent", border: "1.5px solid #d4e8d4", color: "#3a5a3a" }}
            onClick={() => navigate("/shop")}>← Shop</button>
          <button style={{ ...s.navBtn, background: "#0f7b2e", border: "none", color: "#fff" }}
            onClick={() => navigate("/orders")}>My Orders</button>
        </div>
      </nav>

      <div style={s.body}>
        <h1 style={s.pageTitle}>Nutrition Dashboard 🧬</h1>
        <p style={s.subtitle}>Nutrients consumed based on completed orders</p>

        {loading && <p style={{ color: "#888" }}>Loading nutrition data...</p>}

        {!loading && nutrition.length === 0 ? (
          <div style={s.empty}>
            <div style={{ fontSize: "3.5rem" }}>🥗</div>
            <p style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: "1.2rem", color: "#0a2e14", marginTop: "12px" }}>
              No nutrition data yet
            </p>
            <p style={{ color: "#888", marginTop: "8px" }}>
              Complete some orders to see your nutrient intake here
            </p>
            <button style={{ marginTop: "20px", padding: "12px 28px", background: "#0f7b2e", color: "#fff", border: "none", borderRadius: "50px", fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}
              onClick={() => navigate("/shop")}>Shop Now</button>
          </div>
        ) : !loading && (
          <div style={s.layout}>
            {/* PIE CHART */}
            <div style={s.chartCard}>
              <div style={s.cardTitle}>🥧 Nutrient Distribution</div>
              <div style={s.chartWrap}>
                <Pie data={chartData} options={chartOptions} />
              </div>
            </div>

            {/* SUMMARY LIST */}
            <div style={s.summaryCard}>
              <div style={s.cardTitle}>📋 Nutrient Summary</div>
              {nutrition.map((n, i) => (
                <div key={n.nutrientName} style={s.nutriRow}>
                  <div style={s.nutriLeft}>
                    <div style={{ ...s.colorDot, background: PIE_COLORS[i % PIE_COLORS.length] }} />
                    <span style={s.nutriName}>{n.nutrientName}</span>
                  </div>
                  <span style={s.nutriVal}>
                    {parseFloat(n.total_amount).toFixed(1)}
                    <span style={s.nutriUnit}>{n.unit}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
