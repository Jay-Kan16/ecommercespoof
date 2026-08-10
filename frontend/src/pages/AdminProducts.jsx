import React, { useEffect, useState } from "react";
import api from "../api/axios.js";

const emptyForm = { name: "", price: "", description: "", image: "", category: "", brand: "", countInStock: "" };

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  const load = () => api.get("/products?limit=100").then(({ data }) => setProducts(data.products));

  useEffect(() => {
    load();
  }, []);

  const startEdit = (p) => {
    setEditingId(p._id);
    setForm({
      name: p.name, price: p.price, description: p.description,
      image: p.image, category: p.category, brand: p.brand, countInStock: p.countInStock,
    });
  };

  const resetForm = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const payload = { ...form, price: Number(form.price), countInStock: Number(form.countInStock) };
      if (editingId) {
        await api.put(`/products/${editingId}`, payload);
      } else {
        await api.post("/products", payload);
      }
      resetForm();
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Could not save product");
    }
  };

  const remove = async (id) => {
    if (!confirm("Delete this product?")) return;
    await api.delete(`/products/${id}`);
    load();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 grid md:grid-cols-3 gap-8">
      <div className="md:col-span-1 bg-white rounded shadow-sm p-4 h-fit">
        <h2 className="font-semibold mb-3">{editingId ? "Edit Product" : "Add Product"}</h2>
        {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
        <form onSubmit={submit} className="space-y-2">
          {["name", "price", "image", "category", "brand", "countInStock"].map((field) => (
            <input
              key={field}
              required={["name", "price", "image", "category"].includes(field)}
              placeholder={field}
              type={["price", "countInStock"].includes(field) ? "number" : "text"}
              value={form[field]}
              onChange={(e) => setForm({ ...form, [field]: e.target.value })}
              className="w-full border rounded px-3 py-2 text-sm"
            />
          ))}
          <textarea
            required
            placeholder="description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full border rounded px-3 py-2 text-sm"
            rows={3}
          />
          <div className="flex gap-2">
            <button className="flex-1 bg-brand-gold text-brand-navy font-semibold py-2 rounded hover:brightness-95">
              {editingId ? "Update" : "Create"}
            </button>
            {editingId && (
              <button type="button" onClick={resetForm} className="px-4 py-2 border rounded text-sm">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="md:col-span-2 bg-white rounded shadow-sm overflow-x-auto h-fit">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Price</th>
              <th className="p-3">Stock</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id} className="border-t">
                <td className="p-3">{p.name}</td>
                <td className="p-3">${p.price.toFixed(2)}</td>
                <td className="p-3">{p.countInStock}</td>
                <td className="p-3 space-x-2 whitespace-nowrap">
                  <button onClick={() => startEdit(p)} className="text-brand-navy underline">Edit</button>
                  <button onClick={() => remove(p._id)} className="text-red-600 underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminProducts;
