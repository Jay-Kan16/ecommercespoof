import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios.js";

const OrderDetail = () => {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  const fetchOrder = async () => {
    try {
      const { data } = await api.get(`/orders/${id}`);
      setOrder(data);
    } catch (error) {
      console.error("Failed to load order:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const handleCancelOrder = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!confirmed) return;

    try {
      setCancelling(true);

      await api.put(`/orders/${id}/cancel`);

      alert("Order cancelled successfully.");

      await fetchOrder();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to cancel order."
      );
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        Loading...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        Order not found.
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-4">

      {/* Order Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            Order #{order._id}
          </h1>

          <p className="text-sm mt-2">
            Status:{" "}
            <span
              className={
                order.status === "Cancelled"
                  ? "text-red-600 font-semibold"
                  : "text-green-600 font-semibold"
              }
            >
              {order.status}
            </span>{" "}
            · Placed on{" "}
            {new Date(order.createdAt).toLocaleDateString()}
          </p>
        </div>

        {/* Cancel Button */}
        {order.status === "Processing" && (
          <button
            type="button"
            onClick={handleCancelOrder}
            disabled={cancelling}
            className="bg-red-600 text-white px-5 py-2 rounded font-semibold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {cancelling ? "Cancelling..." : "Cancel Order"}
          </button>
        )}
      </div>

      {/* Shipping Address */}
      <div className="bg-white rounded shadow-sm p-4">
        <h2 className="font-semibold mb-2">
          Shipping Address
        </h2>

        <p className="text-sm text-gray-700">
          {order.shippingAddress.street},{" "}
          {order.shippingAddress.city},{" "}
          {order.shippingAddress.state}{" "}
          {order.shippingAddress.postalCode},{" "}
          {order.shippingAddress.country}
        </p>
      </div>

      {/* Items */}
      <div className="bg-white rounded shadow-sm p-4">
        <h2 className="font-semibold mb-2">
          Items
        </h2>

        <ul className="divide-y">
          {order.orderItems.map((item) => (
            <li
              key={item.product}
              className="flex items-center gap-4 py-2"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-14 h-14 object-cover rounded"
              />

              <span className="flex-1 text-sm">
                {item.name}
              </span>

              <span className="text-sm">
                {item.qty} x ${item.price.toFixed(2)}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Price Summary */}
      <div className="bg-white rounded shadow-sm p-4 space-y-1">
        <div className="flex justify-between text-sm">
          <span>Items</span>
          <span>
            ${order.itemsPrice.toFixed(2)}
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span>Shipping</span>
          <span>
            ${order.shippingPrice.toFixed(2)}
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span>Tax</span>
          <span>
            ${order.taxPrice.toFixed(2)}
          </span>
        </div>

        <hr />

        <div className="flex justify-between font-bold">
          <span>Total</span>
          <span>
            ${order.totalPrice.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;