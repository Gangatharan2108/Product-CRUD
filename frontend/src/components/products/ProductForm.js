import React, { useState, useEffect, useRef } from "react";
import {
  createProduct,
  updateProduct,
  getCategories,
  getSubcategoriesByCategory,
} from "../../services/api";

const empty = {
  product_name: "",
  product_code: "",
  category_id: "",
  subcategory_id: "",
  brand: "",
  mrp: "",
  price: "",
};
function FieldInput({
  name,
  label,
  placeholder,
  type = "text",
  disabled = false,
  form,
  onChange,
  errors,
}) {
  return (
    <div className="form-group">
      <label>{label} *</label>
      <input
        type={type}
        name={name}
        className={`form-control-pro ${errors[name] ? "error" : ""}`}
        value={form[name]}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        step={type === "number" ? "0.01" : undefined}
        min={type === "number" ? "0" : undefined}
      />
      {errors[name] && <div className="error-msg">⚠ {errors[name][0]}</div>}
    </div>
  );
}

export default function ProductForm({ editItem, onSuccess, onCancel }) {
  const [form, setForm] = useState(empty);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcats] = useState([]);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  // Image states
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    getCategories()
      .then((r) => setCategories(r.data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (editItem) {
      setForm({
        product_name: editItem.product_name,
        product_code: editItem.product_code,
        category_id: editItem.category_id,
        subcategory_id: editItem.subcategory_id,
        brand: editItem.brand,
        mrp: editItem.mrp,
        price: editItem.price,
      });
      if (editItem.category_id) {
        getSubcategoriesByCategory(editItem.category_id)
          .then((r) => setSubcats(r.data))
          .catch(() => {});
      }
      // Edit mode-ல் existing image preview காட்டு
      setImageFile(null);
      setImagePreview(editItem.image_url || null);
    } else {
      setForm(empty);
      setSubcats([]);
      setImageFile(null);
      setImagePreview(null);
    }
    setErrors({});
  }, [editItem]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCategoryChange = (e) => {
    const catId = e.target.value;
    setForm((prev) => ({ ...prev, category_id: catId, subcategory_id: "" }));
    setSubcats([]);
    if (catId) {
      getSubcategoriesByCategory(catId)
        .then((r) => setSubcats(r.data))
        .catch(() => {});
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    if (errors.image) setErrors((prev) => ({ ...prev, image: null }));
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSaving(true);

    // FormData use பண்றோம் — image upload-க்கு multipart/form-data வேணும்
    const formData = new FormData();
    Object.entries(form).forEach(([k, v]) => formData.append(k, v));
    if (imageFile) formData.append("image", imageFile);

    try {
      if (editItem) {
        await updateProduct(editItem.id, formData);
        onSuccess("Product updated successfully!");
      } else {
        await createProduct(formData);
        onSuccess("Product created successfully!");
      }
    } catch (err) {
      if (err.response?.data?.errors) setErrors(err.response.data.errors);
      else
        setErrors({
          general: err.response?.data?.message || "Something went wrong.",
        });
    }
    setSaving(false);
  };

  return (
    <div className="form-panel">
      <div className="form-panel-title">
        {editItem ? "✎ Edit Product" : "+ New Product"}
      </div>

      {errors.general && (
        <div className="alert-pro alert-pro-danger">✕ {errors.general}</div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Row 1: Name + Code */}
        <div className="form-grid form-grid-2" style={{ marginBottom: 18 }}>
          <FieldInput
            name="product_name"
            label="Product Name"
            placeholder="e.g. Samsung Galaxy S25"
            form={form}
            onChange={handleChange}
            errors={errors}
          />
          <FieldInput
            name="product_code"
            label="Product Code"
            placeholder="e.g. SAMS-S25-001"
            form={form}
            onChange={handleChange}
            errors={errors}
          />
        </div>

        {/* Row 2: Category + Subcategory */}
        <div className="form-grid form-grid-2" style={{ marginBottom: 18 }}>
          <div className="form-group">
            <label>Category *</label>
            <select
              name="category_id"
              className={`form-control-pro ${errors.category_id ? "error" : ""}`}
              value={form.category_id}
              onChange={handleCategoryChange}
            >
              <option value="">— Select Category —</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.category_name}
                </option>
              ))}
            </select>
            {errors.category_id && (
              <div className="error-msg">⚠ {errors.category_id[0]}</div>
            )}
          </div>

          <div className="form-group">
            <label>Subcategory *</label>
            <select
              name="subcategory_id"
              className={`form-control-pro ${errors.subcategory_id ? "error" : ""}`}
              value={form.subcategory_id}
              onChange={handleChange}
              disabled={!form.category_id}
            >
              <option value="">
                {form.category_id
                  ? "— Select Subcategory —"
                  : "— Select Category first —"}
              </option>
              {subcategories.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.subcategory_name}
                </option>
              ))}
            </select>
            {errors.subcategory_id && (
              <div className="error-msg">⚠ {errors.subcategory_id[0]}</div>
            )}
          </div>
        </div>

        {/* Row 3: Brand + MRP + Price */}
        <div className="form-grid form-grid-3" style={{ marginBottom: 18 }}>
          <FieldInput
            name="brand"
            label="Brand"
            placeholder="e.g. Samsung"
            form={form}
            onChange={handleChange}
            errors={errors}
          />
          <FieldInput
            name="mrp"
            label="MRP (₹)"
            placeholder="89999"
            type="number"
            form={form}
            onChange={handleChange}
            errors={errors}
          />
          <FieldInput
            name="price"
            label="Selling Price (₹)"
            placeholder="79999"
            type="number"
            form={form}
            onChange={handleChange}
            errors={errors}
          />
        </div>

        {/* Row 4: Product Image */}
        <div className="form-group" style={{ marginBottom: 24 }}>
          <label>
            Product Image{" "}
            <span style={{ color: "#64748b", fontWeight: 400 }}>
              (optional)
            </span>
          </label>

          {imagePreview ? (
            <div className="image-preview-box">
              <img
                src={imagePreview}
                alt="preview"
                className="image-preview-thumb"
              />
              <div className="image-preview-info">
                <span className="image-preview-name">
                  {imageFile ? imageFile.name : "Current image"}
                </span>
                <button
                  type="button"
                  className="btn-pro btn-pro-danger"
                  style={{ marginTop: 8 }}
                  onClick={handleRemoveImage}
                >
                  ✕ Remove Image
                </button>
              </div>
            </div>
          ) : (
            <label className="image-dropzone" htmlFor="product-image-input">
              <input
                id="product-image-input"
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/jpg,image/webp"
                onChange={handleImageChange}
                style={{ display: "none" }}
              />
              <div className="dropzone-body">
                <span className="dropzone-icon">🖼️</span>
                <span className="dropzone-text">
                  Click to upload product image
                </span>
                <span className="dropzone-hint">JPEG, PNG, WebP — max 2MB</span>
              </div>
            </label>
          )}

          {errors.image && <div className="error-msg">⚠ {errors.image[0]}</div>}
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="btn-pro btn-pro-primary"
            disabled={saving}
          >
            {saving ? (
              <>
                <span className="spinner" />
                Saving...
              </>
            ) : editItem ? (
              "Update Product"
            ) : (
              "Create Product"
            )}
          </button>
          <button
            type="button"
            className="btn-pro btn-pro-ghost"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
