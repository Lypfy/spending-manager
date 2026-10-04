import React, { useState, useEffect } from 'react';
import { useSpending } from '../context/SpendingContext';
import { DynamicIcon } from './DynamicIcon';
import { X } from 'lucide-react';
import { getMonthKey } from '../utils/formatters';

export const BudgetModal = ({ isOpen, onClose, initialBudget = null }) => {
  const { categories, setBudget, deleteBudget } = useSpending();
  const [categoryId, setCategoryId] = useState('');
  const [limit, setLimit] = useState('');

  const expenseCategories = categories.filter((c) => c.type === 'expense');

  useEffect(() => {
    if (initialBudget) {
      setCategoryId(initialBudget.categoryId);
      setLimit(initialBudget.limit);
    } else {
      setCategoryId(expenseCategories[0]?.id || '');
      setLimit('');
    }
  }, [initialBudget, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!limit || parseFloat(limit) <= 0) {
      alert('Please enter a valid budget limit.');
      return;
    }
    setBudget({ categoryId, limit: parseFloat(limit), month: getMonthKey() });
    onClose();
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to remove this category budget?')) {
      deleteBudget(categoryId, getMonthKey());
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">{initialBudget ? 'Update Budget' : 'Set Monthly Budget'}</h3>
          <button className="icon-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                className="form-select"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                disabled={Boolean(initialBudget)}
              >
                {expenseCategories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Monthly Spending Limit</label>
              <input
                type="number"
                step="any"
                min="1"
                placeholder="e.g. 500"
                className="form-input"
                style={{ fontSize: '1.25rem', fontWeight: 700 }}
                value={limit}
                onChange={(e) => setLimit(e.target.value)}
                autoFocus
                required
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.35rem' }}>
                You'll receive visual status indicators and alerts when spending approaches or exceeds this target.
              </span>
            </div>
          </div>

          <div className="modal-footer">
            {initialBudget && (
              <button type="button" className="btn-danger" onClick={handleDelete} style={{ marginRight: 'auto' }}>
                Remove
              </button>
            )}
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Save Budget
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
