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
    padding: "44px 40px",
    width: "100%",
    maxWidth: "480px",
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
    fontSize: "1.6rem",
    fontWeight: 700,
    color: "#0a2e14",
    textAlign: "center",
    marginBottom: "6px",
  },
  sub: {
    textAlign: "center",
    color: "#6b7b6b",
    fontSize: "0.9rem",
    marginBottom: "28px",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "14px",
  },
  fullRow: { gridColumn: "1 / -1" },
  label: {
    display: "block",
    fontSize: "0.78rem",
    fontWeight: 600,
    color: "#3a5a3a",
    marginBottom: "5px",
    textTransform: "uppercase",
    letterSpacing: "0.4px",
  },
  input: {
    width: "100%",
    padding: "11px 14px",
    borderRadius: "10px",
    border: "1.5px solid #d4e8d4",
    fontSize: "0.92rem",
    color: "#1a2e1a",
    background: "#f8fdf9",
    outline: "none",
    transition: "border 0.2s",
    fontFamily: "'DM Sans', sans-serif",
  },
  select: {
    width: "100%",
    padding: "11px 14px",
    borderRadius: "10px",
    border: "1.5px solid #d4e8d4",
    fontSize: "0.92rem",
    color: "#1a2e1a",
    background: "#f8fdf9",
    outline: "none",
    fontFamily: "'DM Sans', sans-serif",
  },
  btn: {
    width: "100%",
    padding: "13px",
    background: "#0f7b2e",
    color: "#fff",
    border: "none",
    borderRadius: "50px",
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 700,
    fontSize: "1rem",
    cursor: "pointer",
    marginTop: "20px",
    boxShadow: "0 4px 20px rgba(15,123,46,0.3)",
    transition: "background 0.2s",
  },
  link: {
    textAlign: "center",
    marginTop: "16px",
    fontSize: "0.88rem",
    color: "#6b7b6b",
  },
  linkBtn: {
    background: "none",
    border: "none",
    color: "#0f7b2e",
    fontWeight: 600,
    cursor: "pointer",
    fontSize: "0.88rem",
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
  success: {
    background: "#e6f4ea",
    border: "1px solid #a8d5b5",
    borderRadius: "8px",
    padding: "10px 14px",
    color: "#0f7b2e",
    fontSize: "0.88rem",
    marginBottom: "16px",
  },
};

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "", gender: "", address: "", age: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    for (const [k, v] of Object.entries(form)) {
      if (!v.trim()) { setError(`Please fill in the ${k} field.`); return; }
    }
    setLoading(true);
    try {
      await axios.post("/signup", form);
      setSuccess("Account created! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.response?.data?.error || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.logo}>🌿 NutriTrack</div>
        <h2 style={s.title}>Create Account</h2>
        <p style={s.sub}>Join thousands eating healthier</p>

        {error && <div style={s.error}>{error}</div>}
        {success && <div style={s.success}>{success}</div>}

        <form onSubmit={submit}>
          <div style={s.formGrid}>
            <div>
              <label style={s.label}>Full Name</label>
              <input style={s.input} name="name" value={form.name} onChange={handle} placeholder="Riya Sharma" required />
            </div>
            <div>
              <label style={s.label}>Email</label>
              <input style={s.input} name="email" type="email" value={form.email} onChange={handle} placeholder="riya@email.com" required />
            </div>
            <div>
              <label style={s.label}>Password</label>
              <input style={s.input} name="password" type="password" value={form.password} onChange={handle} placeholder="••••••••" required />
            </div>
            <div>
              <label style={s.label}>Phone</label>
              <input style={s.input} name="phone" value={form.phone} onChange={handle} placeholder="98765 43210" required />
            </div>
            <div>
              <label style={s.label}>Gender</label>
              <select style={s.select} name="gender" value={form.gender} onChange={handle} required>
                <option value="">Select</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label style={s.label}>Age</label>
              <input style={s.input} name="age" type="number" value={form.age} onChange={handle} placeholder="25" min="1" max="120" required />
            </div>
            <div style={s.fullRow}>
              <label style={s.label}>Address</label>
              <input style={s.input} name="address" value={form.address} onChange={handle} placeholder="123 MG Road, Pune" required />
            </div>
          </div>
          <button style={s.btn} type="submit" disabled={loading}>
            {loading ? "Creating Account..." : "Create Account →"}
          </button>
        </form>

        <div style={s.link}>
          Already have an account?{" "}
          <button style={s.linkBtn} onClick={() => navigate("/login")}>Login</button>
        </div>
      </div>
    </div>
  );
}
