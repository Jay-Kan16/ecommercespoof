import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await register(name, email, password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="bg-white p-6 rounded shadow-sm">
        <h1 className="text-xl font-bold mb-4">Create account</h1>
        {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
        <form onSubmit={submit} className="space-y-3">
          <input
            required placeholder="Full name" value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm"
          />
          <input
            type="email" required placeholder="Email" value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm"
          />
          <input
            type="password" required minLength={6} placeholder="Password (min 6 chars)" value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm"
          />
          <button className="w-full bg-brand-gold text-brand-navy font-semibold py-2 rounded hover:brightness-95">
            Create account
          </button>
        </form>
        <p className="text-sm mt-4">
          Already have an account? <Link to="/login" className="text-brand-navy underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
