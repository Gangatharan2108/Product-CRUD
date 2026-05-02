import React, { useState, useEffect } from 'react';
import { createCategory, updateCategory } from '../../services/api';

export default function CategoryForm({ editItem, onSuccess, onCancel }) {
  const [categoryName, setCategoryName] = useState('');
  const [errors, setErrors]             = useState({});
  const [saving, setSaving]             = useState(false);

  useEffect(() => {
    setCategoryName(editItem ? editItem.category_name : '');
    setErrors({});
  }, [editItem]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSaving(true);
    try {
      if (editItem) {
        await updateCategory(editItem.id, { category_name: categoryName });
        onSuccess('Category updated successfully!');
      } else {
        await createCategory({ category_name: categoryName });
        onSuccess('Category created successfully!');
      }
    } catch (err) {
      if (err.response?.data?.errors) setErrors(err.response.data.errors);
      else setErrors({ general: err.response?.data?.message || 'Something went wrong.' });
    }
    setSaving(false);
  };

  return (
    <div className="form-panel">
      <div className="form-panel-title">
        {editItem ? '✎ Edit Category' : '+ New Category'}
      </div>
      {errors.general && (
        <div className="alert-pro alert-pro-danger">✕ {errors.general}</div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label>Category Name *</label>
            <input
              type="text"
              className={`form-control-pro ${errors.category_name ? 'error' : ''}`}
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="e.g. Electronics, Clothing, Furniture..."
              autoFocus
            />
            {errors.category_name && (
              <div className="error-msg">⚠ {errors.category_name[0]}</div>
            )}
          </div>
        </div>
        <div className="form-actions">
          <button type="submit" className="btn-pro btn-pro-primary" disabled={saving}>
            {saving ? <><span className="spinner" />Saving...</> : (editItem ? 'Update Category' : 'Create Category')}
          </button>
          <button type="button" className="btn-pro btn-pro-ghost" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
