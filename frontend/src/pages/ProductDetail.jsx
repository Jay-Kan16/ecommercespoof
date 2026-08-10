import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios.js";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { userInfo } = useAuth();

  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [reviewError, setReviewError] = useState("");

  const fetchProduct = async () => {
    const { data } = await api.get(`/products/${id}`);
    setProduct(data);
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const submitReview = async (e) => {
    e.preventDefault();
    setReviewError("");
    try {
      await api.post(`/products/${id}/reviews`, { rating, comment });
      setComment("");
      fetchProduct();
    } catch (err) {
      setReviewError(err.response?.data?.message || "Could not submit review");
    }
  };

  if (!product) return <div className="max-w-7xl mx-auto px-4 py-6">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 grid md:grid-cols-2 gap-8">
      <img src={product.image} alt={product.name} className="w-full rounded-lg object-cover" />

      <div>
        <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
        <p className="text-brand-gold mb-2">
          {"★".repeat(Math.round(product.rating))}
          <span className="text-gray-300">{"★".repeat(5 - Math.round(product.rating))}</span>{" "}
          <span className="text-gray-500 text-sm">({product.numReviews} reviews)</span>
        </p>
        <p className="text-3xl font-bold mb-4">${product.price.toFixed(2)}</p>
        <p className="text-gray-700 mb-4">{product.description}</p>
        <p className="mb-4 text-sm">
          Status:{" "}
          {product.countInStock > 0 ? (
            <span className="text-green-700 font-semibold">In Stock</span>
          ) : (
            <span className="text-red-600 font-semibold">Out of Stock</span>
          )}
        </p>

        {product.countInStock > 0 && (
          <div className="flex items-center gap-3 mb-6">
            <label className="text-sm">Qty:</label>
            <select
              value={qty}
              onChange={(e) => setQty(Number(e.target.value))}
              className="border rounded px-2 py-1"
            >
              {[...Array(Math.min(product.countInStock, 10)).keys()].map((x) => (
                <option key={x + 1} value={x + 1}>{x + 1}</option>
              ))}
            </select>
            <button
              onClick={() => {
                addToCart(product, qty);
                navigate("/cart");
              }}
              className="bg-brand-gold text-brand-navy font-semibold px-6 py-2 rounded hover:brightness-95"
            >
              Add to Cart
            </button>
          </div>
        )}

        <hr className="my-6" />

        <h2 className="text-lg font-semibold mb-3">Customer Reviews</h2>
        {product.reviews.length === 0 && <p className="text-gray-500 mb-4">No reviews yet.</p>}
        <ul className="space-y-3 mb-6">
          {product.reviews.map((r) => (
            <li key={r._id} className="border-b pb-2">
              <p className="font-medium text-sm">{r.name}</p>
              <p className="text-brand-gold text-sm">{"★".repeat(r.rating)}</p>
              <p className="text-sm text-gray-700">{r.comment}</p>
            </li>
          ))}
        </ul>

        {userInfo ? (
          <form onSubmit={submitReview} className="space-y-2">
            <h3 className="font-medium text-sm">Write a review</h3>
            {reviewError && <p className="text-red-600 text-sm">{reviewError}</p>}
            <select
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              className="border rounded px-2 py-1 text-sm"
            >
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>{n} - {["Poor","Fair","Good","Very Good","Excellent"][n-1]}</option>
              ))}
            </select>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
              className="w-full border rounded px-2 py-1 text-sm"
              rows={3}
              placeholder="Share your thoughts about this product"
            />
            <button className="bg-brand-navy text-white text-sm px-4 py-2 rounded hover:brightness-110">
              Submit Review
            </button>
          </form>
        ) : (
          <p className="text-sm text-gray-600">Please sign in to write a review.</p>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
