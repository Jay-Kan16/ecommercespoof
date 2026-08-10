import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios.js";

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    api.get(`/orders/${id}`).then(({ data }) => setOrder(data));
  }, [id]);

  if (!order) return <div className="max-w-4xl mx-auto px-4 py-6">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
      <h1 className="text-xl font-bold">Order #{order._id}</h1>
      <p className="text-sm">
        Status: <span className="font-semibold">{order.status}</span> &middot; Placed on{" "}
        {new Date(order.createdAt).toLocaleDateString()}
      </p>

      <div className="bg-white rounded shadow-sm p-4">
        <h2 className="font-semibold mb-2">Shipping Address</h2>
        <p className="text-sm text-gray-700">
          {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
          {order.shippingAddress.postalCode}, {order.shippingAddress.country}
        </p>
      </div>

      <div className="bg-white rounded shadow-sm p-4">
        <h2 className="font-semibold mb-2">Items</h2>
        <ul className="divide-y">
          {order.orderItems.map((item) => (
            <li key={item.product} className="flex items-center gap-4 py-2">
              <img src={item.image} alt={item.name} className="w-14 h-14 object-cover rounded" />
              <span className="flex-1 text-sm">{item.name}</span>
              <span className="text-sm">{item.qty} x ${item.price.toFixed(2)}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white rounded shadow-sm p-4 space-y-1">
        <div className="flex justify-between text-sm"><span>Items</span><span>${order.itemsPrice.toFixed(2)}</span></div>
        <div className="flex justify-between text-sm"><span>Shipping</span><span>${order.shippingPrice.toFixed(2)}</span></div>
        <div className="flex justify-between text-sm"><span>Tax</span><span>${order.taxPrice.toFixed(2)}</span></div>
        <hr />
        <div className="flex justify-between font-bold"><span>Total</span><span>${order.totalPrice.toFixed(2)}</span></div>
      </div>
    </div>
  );
};

export default OrderDetail;
