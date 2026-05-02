import React, { useEffect, useState } from 'react';
import { getCategories, deleteCategory } from '../../services/api';
import CategoryForm from './CategoryForm';

export default function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [editItem, setEditItem]     = useState(null);
  const [showForm, setShowForm]     = useState(false);
  const [message, setMessage]       = useState({ text: '', type: '' });

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await getCategories();
      setCategories(res.data);
    } catch {
      flash('Failed to load categories.', 'danger');
    }
    setLoading(false);
  };

  useEffect(() => { fetchCategories(); }, []);

  const flash = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category? Subcategories linked to it will also be deleted.')) return;
    try {
      await deleteCategory(id);
      flash('Category deleted successfully.', 'success');
      fetchCategories();
    } catch (err) {
      flash(err.response?.data?.message || 'Delete failed.', 'danger');
    }
  };

  return (
    <div className="data-card">
      <div className="data-card-header">
        <div>
          <div className="data-card-title">Category Master</div>
          <div className="data-card-sub">{categories.length} categories total</div>
        </div>
        <button className="btn-pro btn-pro-primary" onClick={() => { setEditItem(null); setShowForm(true); }}>
          + New Category
        </button>
      </div>

      <div className="data-card-body">
        {message.text && (
          <div className={`alert-pro alert-pro-${message.type}`}>
            {message.type === 'success' ? '✓' : '✕'} {message.text}
          </div>
        )}

        {showForm && (
          <CategoryForm
            editItem={editItem}
            onSuccess={(msg) => { setShowForm(false); flash(msg, 'success'); fetchCategories(); }}
            onCancel={() => setShowForm(false)}
          />
        )}

        <div style={{ overflowX: 'auto' }}>
          <table className="pro-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Category Name</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr className="loader-row">
                  <td colSpan="4"><span className="spinner" />Loading categories...</td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan="4">
                    <div className="empty-state">
                      <div className="empty-icon">⬡</div>
                      No categories yet. Click "New Category" to get started.
                    </div>
                  </td>
                </tr>
              ) : (
                categories.map((cat, i) => (
                  <tr key={cat.id}>
                    <td>{i + 1}</td>
                    <td className="cell-main">{cat.category_name}</td>
                    <td>{new Date(cat.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                    <td>
                      <div className="actions-cell">
                        <button className="btn-pro btn-pro-warning"
                          onClick={() => { setEditItem(cat); setShowForm(true); }}>
                          ✎ Edit
                        </button>
                        <button className="btn-pro btn-pro-danger" onClick={() => handleDelete(cat.id)}>
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
