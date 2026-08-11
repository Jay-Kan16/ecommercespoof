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

    if (keyword.trim()) {
      navigate(`/?keyword=${encodeURIComponent(keyword.trim())}`);
    } else {
      navigate("/");
    }
  };

  // Safely get user's display name
  const displayName =
    userInfo?.name ||
    userInfo?.username ||
    userInfo?.email?.split("@")[0] ||
    "User";

  const firstName = displayName.split(" ")[0];

  return (
    <header className="bg-brand-navy text-white">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-5">

        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold text-brand-gold shrink-0"
        >
          zonemarket
        </Link>

        {/* Search */}
        <form
          onSubmit={submitSearch}
          className="flex-1 flex"
        >
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Search products..."
            className="w-full rounded-l px-3 py-2 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-brand-gold"
          />

          <button
            type="submit"
            className="bg-brand-gold text-brand-navy px-4 rounded-r font-semibold hover:brightness-95"
          >
            Search
          </button>
        </form>

        {/* Navigation */}
        <nav className="flex items-center gap-4 text-sm shrink-0">

          {userInfo ? (
            <div className="relative group">

              {/* User button */}
              <button
                type="button"
                className="hover:text-brand-gold py-2"
              >
                Hi, {firstName}
              </button>

              {/* Invisible hover bridge + dropdown */}
              <div className="absolute right-0 top-full z-50 hidden group-hover:block pt-2 w-44">

                <div className="bg-white text-brand-ink rounded shadow-lg py-1">

                  <Link
                    to="/orders"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    My Orders
                  </Link>

                  {userInfo?.isAdmin && (
                    <Link
                      to="/admin"
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      Admin Dashboard
                    </Link>
                  )}

                  <button
                    type="button"
                    onClick={logout}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Sign out
                  </button>

                </div>
              </div>
            </div>
          ) : (
            <Link
              to="/login"
              className="hover:text-brand-gold"
            >
              Sign in
            </Link>
          )}

          {/* Cart */}
          <Link
            to="/cart"
            className="relative hover:text-brand-gold"
          >
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