import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";

const Navbar = () => {
  const { userInfo, logout } = useAuth();
  const { itemsCount } = useCart();
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  const submitSearch = (e) => {
    e.preventDefault();
    navigate(keyword ? `/?keyword=${encodeURIComponent(keyword)}` : "/");
  };

  return (
    <header className="bg-brand-navy text-white sticky top-0 z-40">
      <div className="max-w-7xl mx-auto flex items-center gap-4 px-4 py-3">
        <Link to="/" className="text-xl font-bold tracking-tight text-brand-gold shrink-0">
          zone<span className="text-white">market</span>
        </Link>

        <form onSubmit={submitSearch} className="flex-1 flex">
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Search products..."
            className="w-full rounded-l px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-gold"
          />
          <button className="bg-brand-gold text-brand-navy px-4 rounded-r font-semibold hover:brightness-95">
            Search
          </button>
        </form>

        <nav className="flex items-center gap-4 text-sm shrink-0">
          {userInfo ? (
            <div className="relative group">
              <button className="hover:text-brand-gold">Hi, {userInfo.name.split(" ")[0]}</button>
              <div className="absolute right-0 hidden group-hover:block bg-white text-brand-ink rounded shadow-lg mt-1 w-40 py-1">
                <Link to="/orders" className="block px-4 py-2 hover:bg-gray-100">My Orders</Link>
                {userInfo.isAdmin && (
                  <Link to="/admin" className="block px-4 py-2 hover:bg-gray-100">Admin Dashboard</Link>
                )}
                <button
                  onClick={logout}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Sign out
                </button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="hover:text-brand-gold">Sign in</Link>
          )}

          <Link to="/cart" className="relative hover:text-brand-gold">
            Cart
            {itemsCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-brand-gold text-brand-navy text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {itemsCount}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
