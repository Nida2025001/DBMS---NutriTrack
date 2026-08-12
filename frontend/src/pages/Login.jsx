import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const s = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f0faf4 0%, #e8f5ec 60%, #eef3f7 100%)",
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
    boxShadow: "0 8px 48px rgba(15,123,46,0.14)",
    border: "1px solid #e0f0e4",
  },
  logo: {
    fontFamily: "'Sora', sans-serif",
    fontWeight: 800,
    fontSize: "1.5rem",
    color: "#0f7b2e",
    textAlign: "center",
    marginBottom: "8px",
  },
  title: {
    fontFamily: "'Sora', sans-serif",
    fontSize: "1.8rem",
    fontWeight: 700,
    color: "#0a2e14",
    textAlign: "center",
    marginBottom: "6px",
  },
  sub: { textAlign: "center", color: "#6b7b6b", fontSize: "0.9rem", marginBottom: "32px" },
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
    transition: "border 0.2s",
    fontFamily: "'DM Sans', sans-serif",
  },
  btn: {
    width: "100%",
    padding: "14px",
    background: "#0f7b2e",
    color: "#fff",
    border: "none",
    borderRadius: "50px",
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 700,
    fontSize: "1rem",
    cursor: "pointer",
    marginTop: "8px",
    boxShadow: "0 4px 20px rgba(15,123,46,0.3)",
    transition: "background 0.2s",
  },
  links: {
    marginTop: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    alignItems: "center",
  },
  linkBtn: {
    background: "none",
    border: "none",
    color: "#0f7b2e",
    fontWeight: 600,
    cursor: "pointer",
    fontSize: "0.88rem",
  },
  linkText: { fontSize: "0.88rem", color: "#6b7b6b" },
  adminLink: {
    background: "none",
    border: "none",
    color: "#888",
    fontSize: "0.82rem",
    cursor: "pointer",
    textDecoration: "underline",
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

export default function Login() {
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
      const res = await axios.post("/login", form);
      localStorage.setItem("userId", res.data.userID);
      localStorage.setItem("userName", res.data.name);
      localStorage.setItem("role", "user");
      navigate("/shop");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.logo}>🌿 NutriTrack</div>
        <h2 style={s.title}>Welcome Back</h2>
        <p style={s.sub}>Sign in to continue shopping</p>

        {error && <div style={s.error}>{error}</div>}

        <form onSubmit={submit}>
          <div style={s.group}>
            <label style={s.label}>Email Address</label>
            <input style={s.input} name="email" type="email" value={form.email} onChange={handle} placeholder="you@email.com" required />
          </div>
          <div style={s.group}>
            <label style={s.label}>Password</label>
            <input style={s.input} name="password" type="password" value={form.password} onChange={handle} placeholder="••••••••" required />
          </div>
          <button style={s.btn} type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign In →"}
          </button>
        </form>

        <div style={s.links}>
          <span style={s.linkText}>
            Don't have an account?{" "}
            <button style={s.linkBtn} onClick={() => navigate("/signup")}>Sign Up</button>
          </span>
          <button style={s.adminLink} onClick={() => navigate("/admin-login")}>
            Admin Login
          </button>
        </div>
      </div>
    </div>
  );
}
