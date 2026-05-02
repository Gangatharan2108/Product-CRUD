import React, { useEffect, useState } from "react";
import { getProducts, deleteProduct } from "../../services/api";
import ProductForm from "./ProductForm";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editItem, setEditItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await getProducts();
      setProducts(res.data);
    } catch {
      flash("Failed to load products.", "danger");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const flash = (text, type = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 3000);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await deleteProduct(id);
      flash("Product deleted.", "success");
      fetchProducts();
    } catch (err) {
      flash(err.response?.data?.message || "Delete failed.", "danger");
    }
  };

  const discount = (mrp, price) => Math.round((1 - price / mrp) * 100);

  return (
    <div className="data-card">
      <div className="data-card-header">
        <div>
          <div className="data-card-title">Products Master</div>
          <div className="data-card-sub">
            {products.length} products in inventory
          </div>
        </div>
        <button
          className="btn-pro btn-pro-primary"
          onClick={() => {
            setEditItem(null);
            setShowForm(true);
          }}
        >
          + New Product
        </button>
      </div>

      <div className="data-card-body">
        {message.text && (
          <div className={`alert-pro alert-pro-${message.type}`}>
            {message.type === "success" ? "✓" : "✕"} {message.text}
          </div>
        )}

        {showForm && (
          <ProductForm
            editItem={editItem}
            onSuccess={(msg) => {
              setShowForm(false);
              flash(msg, "success");
              fetchProducts();
            }}
            onCancel={() => setShowForm(false)}
          />
        )}

        <div style={{ overflowX: "auto" }}>
          <table className="pro-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Image</th>
                <th>Product</th>
                <th>Code</th>
                <th>Category</th>
                <th>Subcategory</th>
                <th>Brand</th>
                <th>MRP</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr className="loader-row">
                  <td colSpan="10">
                    <span className="spinner" />
                    Loading products...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan="10">
                    <div className="empty-state">
                      <div className="empty-icon">◆</div>
                      No products yet. Add categories and subcategories first.
                    </div>
                  </td>
                </tr>
              ) : (
                products.map((p, i) => (
                  <tr key={p.id}>
                    <td>{i + 1}</td>

                    {/* Product Image */}
                    <td>
                      {p.image_url ? (
                        <img
                          src={p.image_url}
                          alt={p.product_name}
                          className="product-table-thumb"
                        />
                      ) : (
                        <div className="product-thumb-empty">—</div>
                      )}
                    </td>

                    <td className="cell-main">{p.product_name}</td>
                    <td>
                      <span className="code-chip">{p.product_code}</span>
                    </td>
                    <td>
                      <span className="pro-badge pro-badge-purple">
                        {p.category?.category_name}
                      </span>
                    </td>
                    <td>{p.subcategory?.subcategory_name}</td>
                    <td>{p.brand}</td>
                    <td>
                      <span className="price-old">
                        ₹{parseFloat(p.mrp).toLocaleString("en-IN")}
                      </span>
                    </td>
                    <td>
                      <div>
                        <span className="price-new">
                          ₹{parseFloat(p.price).toLocaleString("en-IN")}
                        </span>
                        {p.mrp > p.price && (
                          <span
                            style={{
                              fontSize: "11px",
                              color: "#10b981",
                              marginLeft: "6px",
                            }}
                          >
                            {discount(p.mrp, p.price)}% off
                          </span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="actions-cell">
                        <button
                          className="btn-pro btn-pro-warning"
                          onClick={() => {
                            setEditItem(p);
                            setShowForm(true);
                          }}
                        >
                          ✎ Edit
                        </button>
                        <button
                          className="btn-pro btn-pro-danger"
                          onClick={() => handleDelete(p.id)}
                        >
                          ✕ Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
