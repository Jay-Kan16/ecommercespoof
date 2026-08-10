import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";

const Cart = () => {
  const { cartItems, updateQty, removeFromCart, itemsPrice } = useCart();
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10 text-center">
        <p className="text-lg mb-4">Your cart is empty.</p>
        <Link to="/" className="text-brand-navy underline">Continue shopping</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 grid md:grid-cols-3 gap-8">
      <div className="md:col-span-2 space-y-4">
        <h1 className="text-xl font-bold mb-2">Shopping Cart</h1>
        {cartItems.map((item) => (
          <div key={item._id} className="bg-white rounded shadow-sm p-4 flex gap-4 items-center">
            <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded" />
            <div className="flex-1">
              <Link to={`/product/${item._id}`} className="font-medium hover:underline">
                {item.name}
              </Link>
              <p className="text-sm text-gray-500">${item.price.toFixed(2)} each</p>
            </div>
            <select
              value={item.qty}
              onChange={(e) => updateQty(item._id, Number(e.target.value))}
              className="border rounded px-2 py-1"
            >
              {[...Array(10).keys()].map((x) => (
                <option key={x + 1} value={x + 1}>{x + 1}</option>
              ))}
            </select>
            <p className="w-20 text-right font-semibold">${(item.price * item.qty).toFixed(2)}</p>
            <button
              onClick={() => removeFromCart(item._id)}
              className="text-red-600 text-sm hover:underline"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="bg-white rounded shadow-sm p-4 h-fit">
        <p className="text-lg mb-2">
          Subtotal ({cartItems.reduce((a, i) => a + i.qty, 0)} items):{" "}
          <span className="font-bold">${itemsPrice.toFixed(2)}</span>
        </p>
        <button
          onClick={() => navigate("/checkout")}
          className="w-full bg-brand-gold text-brand-navy font-semibold py-2 rounded hover:brightness-95"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;
