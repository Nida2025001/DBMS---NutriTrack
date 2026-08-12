import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const s = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0a2e14 0%, #0f4a22 50%, #1a6b35 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 16px",
  },
  card: {
    background: "#fff",
    borderRadius: "24px",
    padding: "52px 44px",
    width: "100%",
    maxWidth: "420px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
  },
  badge: {
    display: "inline-block",
    padding: "5px 14px",
    background: "#e6f4ea",
    color: "#0f7b2e",
    borderRadius: "50px",
    fontSize: "0.78rem",
    fontWeight: 700,
    marginBottom: "16px",
    letterSpacing: "0.5px",
    textTransform: "uppercase",
  },
  title: {
    fontFamily: "'Sora', sans-serif",
    fontSize: "1.8rem",
    fontWeight: 700,
    color: "#0a2e14",
    marginBottom: "6px",
  },
  sub: { color: "#6b7b6b", fontSize: "0.9rem", marginBottom: "32px" },
  group: { marginBottom: "18px" },
  label: {
    display: "block",
    fontSize: "0.78rem",
    fontWeight: 600,
    color: "#3a5a3a",
    marginBottom: "6px",
    textTransform: "uppercase",
    letterSpacing: "0.4px",
  },
  input: {
    width: "100%",
    padding: "13px 16px",
    borderRadius: "12px",
    border: "1.5px solid #d4e8d4",
    fontSize: "0.95rem",
    color: "#1a2e1a",
    background: "#f8fdf9",
    outline: "none",
    fontFamily: "'DM Sans', sans-serif",
  },
  btn: {
    width: "100%",
    padding: "14px",
    background: "#0a2e14",
    color: "#fff",
    border: "none",
    borderRadius: "50px",
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 700,
    fontSize: "1rem",
    cursor: "pointer",
    marginTop: "8px",
  },
  backBtn: {
    background: "none",
    border: "none",
    color: "#6b7b6b",
    fontSize: "0.88rem",
    cursor: "pointer",
    marginTop: "16px",
    display: "block",
    textAlign: "center",
    width: "100%",
  },
  error: {
    background: "#fff0f0",
    border: "1px solid #ffc0c0",
    borderRadius: "8px",
    padding: "10px 14px",
    color: "#c0392b",
    fontSize: "0.88rem",
    marginBottom: "16px",
  },
};

export default function AdminLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.email || !form.password) { setError("All fields are required."); return; }
    setLoading(true);
    try {
      const res = await axios.post("/admin/login", form);
      localStorage.setItem("adminId", res.data.adminID);
      localStorage.setItem("adminName", res.data.name);
      localStorage.setItem("role", "admin");
      localStorage.setItem("userId", res.data.adminID); // set for route guard
      navigate("/admin");
    } catch (err) {
      setError(err.response?.data?.error || "Admin login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <div style={s.card}>
        <span style={s.badge}>🔐 Admin Portal</span>
        <h2 style={s.title}>Admin Login</h2>
        <p style={s.sub}>Access the NutriTrack admin dashboard</p>

        {error && <div style={s.error}>{error}</div>}

        <form onSubmit={submit}>
          <div style={s.group}>
            <label style={s.label}>Admin Email</label>
            <input style={s.input} name="email" type="email" value={form.email} onChange={handle} placeholder="admin@nutritrack.com" required />
          </div>
          <div style={s.group}>
            <label style={s.label}>Password</label>
            <input style={s.input} name="password" type="password" value={form.password} onChange={handle} placeholder="••••••••" required />
          </div>
          <button style={s.btn} type="submit" disabled={loading}>
            {loading ? "Authenticating..." : "Enter Dashboard →"}
          </button>
        </form>
        <button style={s.backBtn} onClick={() => navigate("/login")}>← Back to User Login</button>
      </div>
    </div>
  );
}
