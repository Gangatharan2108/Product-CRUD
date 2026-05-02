import React, { useState, useEffect } from 'react';
import { createSubcategory, updateSubcategory, getCategories } from '../../services/api';

export default function SubcategoryForm({ editItem, onSuccess, onCancel }) {
  const [form, setForm]       = useState({ subcategory_name: '', category_id: '' });
  const [categories, setCats] = useState([]);
  const [errors, setErrors]   = useState({});
  const [saving, setSaving]   = useState(false);

  useEffect(() => {
    getCategories().then(res => setCats(res.data)).catch(() => {});
    if (editItem) {
      setForm({ subcategory_name: editItem.subcategory_name, category_id: editItem.category_id });
    } else {
      setForm({ subcategory_name: '', category_id: '' });
    }
    setErrors({});
  }, [editItem]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSaving(true);
    try {
      if (editItem) {
        await updateSubcategory(editItem.id, form);
        onSuccess('Subcategory updated successfully!');
      } else {
        await createSubcategory(form);
        onSuccess('Subcategory created successfully!');
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
        {editItem ? '✎ Edit Subcategory' : '+ New Subcategory'}
      </div>
      {errors.general && <div className="alert-pro alert-pro-danger">✕ {errors.general}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-grid form-grid-2">
          <div className="form-group">
            <label>Parent Category *</label>
            <select name="category_id"
              className={`form-control-pro ${errors.category_id ? 'error' : ''}`}
              value={form.category_id} onChange={handleChange}>
              <option value="">— Select Category —</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.category_name}</option>
              ))}
            </select>
            {errors.category_id && <div className="error-msg">⚠ {errors.category_id[0]}</div>}
          </div>

          <div className="form-group">
            <label>Subcategory Name *</label>
            <input type="text" name="subcategory_name"
              className={`form-control-pro ${errors.subcategory_name ? 'error' : ''}`}
              value={form.subcategory_name} onChange={handleChange}
              placeholder="e.g. Mobile Phones, Laptops..." autoFocus />
            {errors.subcategory_name && <div className="error-msg">⚠ {errors.subcategory_name[0]}</div>}
          </div>
        </div>
        <div className="form-actions">
          <button type="submit" className="btn-pro btn-pro-primary" disabled={saving}>
            {saving ? <><span className="spinner" />Saving...</> : (editItem ? 'Update Subcategory' : 'Create Subcategory')}
          </button>
          <button type="button" className="btn-pro btn-pro-ghost" onClick={onCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
