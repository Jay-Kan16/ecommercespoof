import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="bg-white p-6 rounded shadow-sm">
        <h1 className="text-xl font-bold mb-4">Sign in</h1>
        {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
        <form onSubmit={submit} className="space-y-3">
          <input
            type="email" required placeholder="Email" value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm"
          />
          <input
            type="password" required placeholder="Password" value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm"
          />
          <button className="w-full bg-brand-gold text-brand-navy font-semibold py-2 rounded hover:brightness-95">
            Sign in
          </button>
        </form>
        <p className="text-sm mt-4">
          New here? <Link to="/register" className="text-brand-navy underline">Create an account</Link>
        </p>
        <p className="text-xs text-gray-500 mt-4">
          Demo admin: admin@example.com / admin123 (after running the seed script)
        </p>
      </div>
    </div>
  );
};

export default Login;
