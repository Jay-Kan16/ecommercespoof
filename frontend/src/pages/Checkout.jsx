import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios.js";
import { useCart } from "../context/CartContext.jsx";

const Checkout = () => {
  const { cartItems, itemsPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [address, setAddress] = useState({ street: "", city: "", state: "", postalCode: "", country: "" });
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
  const [error, setError] = useState("");
  const [placing, setPlacing] = useState(false);

  const shipping = itemsPrice > 100 ? 0 : 9.99;
  const tax = Number((itemsPrice * 0.08).toFixed(2));
  const total = (itemsPrice + shipping + tax).toFixed(2);

  const placeOrder = async (e) => {
    e.preventDefault();
    setError("");
    setPlacing(true);
    try {
      const orderItems = cartItems.map((item) => ({ product: item._id, qty: item.qty }));
      const { data } = await api.post("/orders", {
        orderItems,
        shippingAddress: address,
        paymentMethod,
      });
      clearCart();
      navigate(`/orders/${data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Could not place order");
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="text-xl font-bold mb-4">Checkout</h1>
      <form onSubmit={placeOrder} className="grid md:grid-cols-2 gap-8">
        <div className="space-y-3 bg-white p-4 rounded shadow-sm">
          <h2 className="font-semibold">Shipping Address</h2>
          {["street", "city", "state", "postalCode", "country"].map((field) => (
            <input
              key={field}
              required
              placeholder={field[0].toUpperCase() + field.slice(1)}
              value={address[field]}
              onChange={(e) => setAddress({ ...address, [field]: e.target.value })}
              className="w-full border rounded px-3 py-2 text-sm"
            />
          ))}

          <h2 className="font-semibold pt-2">Payment Method</h2>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm"
          >
            <option>Cash on Delivery</option>
            <option>Credit Card (demo)</option>
            <option>PayPal (demo)</option>
          </select>
        </div>

        <div className="bg-white p-4 rounded shadow-sm h-fit space-y-2">
          <h2 className="font-semibold mb-2">Order Summary</h2>
          <div className="flex justify-between text-sm"><span>Items</span><span>${itemsPrice.toFixed(2)}</span></div>
          <div className="flex justify-between text-sm"><span>Shipping</span><span>${shipping.toFixed(2)}</span></div>
          <div className="flex justify-between text-sm"><span>Tax</span><span>${tax.toFixed(2)}</span></div>
          <hr />
          <div className="flex justify-between font-bold"><span>Total</span><span>${total}</span></div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button
            disabled={placing}
            className="w-full bg-brand-gold text-brand-navy font-semibold py-2 rounded hover:brightness-95 disabled:opacity-50"
          >
            {placing ? "Placing order..." : "Place Order"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
