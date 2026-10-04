import React, { useState } from 'react';
import { useSpending } from '../context/SpendingContext';
import { DynamicIcon } from './DynamicIcon';
import { X, Tag } from 'lucide-react';

export const CategoryModal = ({ isOpen, onClose }) => {
  const { addCategory } = useSpending();

  const [name, setName] = useState('');
  const [type, setType] = useState('expense');
  const [icon, setIcon] = useState('Tag');
  const [color, setColor] = useState('#6366f1');

  const AVAILABLE_ICONS = [
    'ShoppingBag', 'Utensils', 'Car', 'Home', 'Film', 'Zap',
    'HeartPulse', 'GraduationCap', 'Plane', 'Smile', 'Gift',
    'Briefcase', 'Laptop', 'TrendingUp', 'Coffee', 'Tv',
    'Fuel', 'Gamepad2', 'Wifi', 'Dumbbell', 'Music', 'Book'
  ];

  const COLOR_OPTIONS = [
    '#f97316', '#10b981', '#6366f1', '#0ea5e9', '#ec4899',
    '#8b5cf6', '#eab308', '#ef4444', '#14b8a6', '#f43f5e', '#06b6d4'
  ];

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Please enter a category name.');
      return;
    }

    addCategory({
      name: name.trim(),
      type,
      icon,
      color,
    });

    setName('');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Tag size={20} color="var(--primary)" />
            <h3 className="modal-title">Create Custom Category</h3>
          </div>
          <button className="icon-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Category Type</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <button
                  type="button"
                  className={`btn-secondary ${type === 'expense' ? 'active' : ''}`}
                  onClick={() => setType('expense')}
                  style={{
                    background: type === 'expense' ? 'var(--danger-light)' : 'var(--bg-input)',
                    borderColor: type === 'expense' ? 'var(--danger)' : 'var(--border-subtle)',
                    color: type === 'expense' ? 'var(--danger)' : 'var(--text-secondary)',
                    fontWeight: 600,
                  }}
                >
                  Expense
                </button>
                <button
                  type="button"
                  className={`btn-secondary ${type === 'income' ? 'active' : ''}`}
                  onClick={() => setType('income')}
                  style={{
                    background: type === 'income' ? 'var(--success-light)' : 'var(--bg-input)',
                    borderColor: type === 'income' ? 'var(--success)' : 'var(--border-subtle)',
                    color: type === 'income' ? 'var(--success)' : 'var(--text-secondary)',
                    fontWeight: 600,
                  }}
                >
                  Income
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Category Name</label>
              <input
                type="text"
                placeholder="e.g. Subscriptions, Pet Care, Freelancing"
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
                required
              />
            </div>

            {/* Icon Picker */}
            <div className="form-group">
              <label className="form-label">Select Icon</label>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(6, 1fr)',
                  gap: '0.5rem',
                  maxHeight: '140px',
                  overflowY: 'auto',
                  padding: '0.5rem',
                  background: 'var(--bg-input)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                {AVAILABLE_ICONS.map((ic) => (
                  <button
                    key={ic}
                    type="button"
                    onClick={() => setIcon(ic)}
                    style={{
                      height: '38px',
                      borderRadius: 'var(--radius-sm)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: icon === ic ? 'var(--primary-light)' : 'transparent',
                      border: `1px solid ${icon === ic ? 'var(--primary)' : 'transparent'}`,
                      color: icon === ic ? 'var(--primary)' : 'var(--text-secondary)',
                      cursor: 'pointer',
                    }}
                  >
                    <DynamicIcon name={ic} size={18} />
                  </button>
                ))}
              </div>
            </div>

            {/* Color Palette */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Color Accent</label>
              <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
                {COLOR_OPTIONS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    style={{
                      width: '30px',
                      height: '30px',
                      borderRadius: '50%',
                      background: c,
                      border: color === c ? '3px solid #ffffff' : 'none',
                      boxShadow: color === c ? '0 0 10px rgba(0,0,0,0.5)' : 'none',
                      cursor: 'pointer',
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Add Category
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
