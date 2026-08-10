import React from "react";
import { Link } from "react-router-dom";

const Stars = ({ rating }) => (
  <div className="text-brand-gold text-sm">
    {"★".repeat(Math.round(rating))}
    <span className="text-gray-300">{"★".repeat(5 - Math.round(rating))}</span>
  </div>
);

const ProductCard = ({ product }) => (
  <Link
    to={`/product/${product._id}`}
    className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 flex flex-col"
  >
    <img
      src={product.image}
      alt={product.name}
      className="w-full h-44 object-cover rounded mb-3"
      loading="lazy"
    />
    <h3 className="text-sm font-medium line-clamp-2 mb-1">{product.name}</h3>
    <Stars rating={product.rating} />
    <p className="text-xs text-gray-500 mb-2">{product.numReviews} reviews</p>
    <p className="mt-auto text-lg font-bold text-brand-ink">${product.price.toFixed(2)}</p>
    {product.countInStock === 0 && (
      <span className="text-xs text-red-600 font-semibold mt-1">Out of stock</span>
    )}
  </Link>
);

export default ProductCard;
