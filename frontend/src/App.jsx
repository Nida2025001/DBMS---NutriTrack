import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import AdminLogin from "./pages/AdminLogin";
import Shop from "./pages/Shop";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import Nutrition from "./pages/Nutrition";
import Admin from "./pages/Admin";

// Guard: requires logged-in user
function UserRoute({ children }) {
  const userId = localStorage.getItem("userId");
  return userId ? children : <Navigate to="/login" replace />;
}

// Guard: requires admin role
function AdminRoute({ children }) {
  const role = localStorage.getItem("role");
  return role === "admin" ? children : <Navigate to="/admin-login" replace />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin-login" element={<AdminLogin />} />

        <Route path="/shop" element={<UserRoute><Shop /></UserRoute>} />
        <Route path="/product/:id" element={<UserRoute><ProductDetails /></UserRoute>} />
        <Route path="/cart" element={<UserRoute><Cart /></UserRoute>} />
        <Route path="/orders" element={<UserRoute><Orders /></UserRoute>} />
        <Route path="/nutrition" element={<UserRoute><Nutrition /></UserRoute>} />

        <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
