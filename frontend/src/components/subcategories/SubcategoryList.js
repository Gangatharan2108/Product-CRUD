import React, { useEffect, useState } from 'react';
import { getSubcategories, deleteSubcategory } from '../../services/api';
import SubcategoryForm from './SubcategoryForm';

export default function SubcategoryList() {
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading]             = useState(true);
  const [editItem, setEditItem]           = useState(null);
  const [showForm, setShowForm]           = useState(false);
  const [message, setMessage]             = useState({ text: '', type: '' });

  const fetchSubcategories = async () => {
    setLoading(true);
    try {
      const res = await getSubcategories();
      setSubcategories(res.data);
    } catch {
      flash('Failed to load subcategories.', 'danger');
    }
    setLoading(false);
  };

  useEffect(() => { fetchSubcategories(); }, []);

  const flash = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this subcategory?')) return;
    try {
      await deleteSubcategory(id);
      flash('Subcategory deleted.', 'success');
      fetchSubcategories();
    } catch (err) {
      flash(err.response?.data?.message || 'Delete failed.', 'danger');
    }
  };

  return (
    <div className="data-card">
      <div className="data-card-header">
        <div>
          <div className="data-card-title">Subcategory Master</div>
          <div className="data-card-sub">{subcategories.length} subcategories total</div>
        </div>
        <button className="btn-pro btn-pro-primary" onClick={() => { setEditItem(null); setShowForm(true); }}>
          + New Subcategory
        </button>
      </div>

      <div className="data-card-body">
        {message.text && (
          <div className={`alert-pro alert-pro-${message.type}`}>
            {message.type === 'success' ? '✓' : '✕'} {message.text}
          </div>
        )}

        {showForm && (
          <SubcategoryForm
            editItem={editItem}
            onSuccess={(msg) => { setShowForm(false); flash(msg, 'success'); fetchSubcategories(); }}
            onCancel={() => setShowForm(false)}
          />
        )}

        <div style={{ overflowX: 'auto' }}>
          <table className="pro-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Subcategory Name</th>
                <th>Parent Category</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr className="loader-row">
                  <td colSpan="5"><span className="spinner" />Loading subcategories...</td>
                </tr>
              ) : subcategories.length === 0 ? (
                <tr>
                  <td colSpan="5">
                    <div className="empty-state">
                      <div className="empty-icon">◈</div>
                      No subcategories yet. Add a category first, then create subcategories.
                    </div>
                  </td>
                </tr>
              ) : (
                subcategories.map((sub, i) => (
                  <tr key={sub.id}>
                    <td>{i + 1}</td>
                    <td className="cell-main">{sub.subcategory_name}</td>
                    <td>
                      <span className="pro-badge pro-badge-purple">
                        {sub.category?.category_name}
                      </span>
                    </td>
                    <td>{new Date(sub.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                    <td>
                      <div className="actions-cell">
                        <button className="btn-pro btn-pro-warning"
                          onClick={() => { setEditItem(sub); setShowForm(true); }}>
                          ✎ Edit
                        </button>
                        <button className="btn-pro btn-pro-danger" onClick={() => handleDelete(sub.id)}>
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
