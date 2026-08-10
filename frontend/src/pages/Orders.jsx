import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios.js";

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get("/orders/myorders").then(({ data }) => setOrders(data));
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="text-xl font-bold mb-4">My Orders</h1>
      {orders.length === 0 && <p className="text-gray-600">You have no orders yet.</p>}
      <div className="space-y-3">
        {orders.map((o) => (
          <Link
            key={o._id}
            to={`/orders/${o._id}`}
            className="block bg-white rounded shadow-sm p-4 hover:shadow-md"
          >
            <div className="flex justify-between text-sm">
              <span>Order #{o._id.slice(-8)}</span>
              <span className="font-semibold">${o.totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>{new Date(o.createdAt).toLocaleDateString()}</span>
              <span>{o.status}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Orders;
