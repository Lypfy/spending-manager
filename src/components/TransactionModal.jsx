import React, { useState, useEffect } from 'react';
import { useSpending } from '../context/SpendingContext';
import { DynamicIcon } from './DynamicIcon';
import { X, ArrowDownRight, ArrowUpRight, ArrowRightLeft } from 'lucide-react';

export const TransactionModal = ({ isOpen, onClose, initialTransaction = null }) => {
  const { categories, wallets, addTransaction, editTransaction } = useSpending();

  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [walletId, setWalletId] = useState('');
  const [toWalletId, setToWalletId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState('');

  useEffect(() => {
    if (initialTransaction) {
      setType(initialTransaction.type || 'expense');
      setAmount(initialTransaction.amount || '');
      setCategoryId(initialTransaction.categoryId || '');
      setWalletId(initialTransaction.walletId || (wallets[0]?.id || ''));
      setToWalletId(initialTransaction.toWalletId || '');
      setDate(initialTransaction.date || new Date().toISOString().split('T')[0]);
      setNote(initialTransaction.note || '');
    } else {
      setType('expense');
      setAmount('');
      const defaultExpCat = categories.find((c) => c.type === 'expense')?.id || '';
      setCategoryId(defaultExpCat);
      setWalletId(wallets[0]?.id || '');
      setToWalletId(wallets[1]?.id || '');
      setDate(new Date().toISOString().split('T')[0]);
      setNote('');
    }
  }, [initialTransaction, isOpen, categories, wallets]);

  if (!isOpen) return null;

  const filteredCategories = categories.filter((c) => c.type === type);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid amount greater than 0.');
      return;
    }

    if (type !== 'transfer' && !categoryId) {
      alert('Please select a category.');
      return;
    }

    if (type === 'transfer' && walletId === toWalletId) {
      alert('Source and destination wallets must be different.');
      return;
    }

    const payload = {
      type,
      amount: parseFloat(amount),
      categoryId: type === 'transfer' ? 'transfer' : categoryId,
      walletId,
      toWalletId: type === 'transfer' ? toWalletId : null,
      date,
      note,
    };

    if (initialTransaction && initialTransaction.id) {
      editTransaction(initialTransaction.id, payload);
    } else {
      addTransaction(payload);
    }

    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <h3 className="modal-title">
            {initialTransaction ? 'Edit Transaction' : 'Record Transaction'}
          </h3>
          <button className="icon-btn" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Type Switcher */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <button
                type="button"
                className={`btn-secondary ${type === 'expense' ? 'active' : ''}`}
                onClick={() => {
                  setType('expense');
                  const cat = categories.find((c) => c.type === 'expense')?.id || '';
                  setCategoryId(cat);
                }}
                style={{
                  background: type === 'expense' ? 'var(--danger-light)' : 'var(--bg-input)',
                  borderColor: type === 'expense' ? 'var(--danger)' : 'var(--border-subtle)',
                  color: type === 'expense' ? 'var(--danger)' : 'var(--text-secondary)',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  padding: '0.6rem 0.5rem',
                }}
              >
                <ArrowDownRight size={16} /> Expense
              </button>

              <button
                type="button"
                className={`btn-secondary ${type === 'income' ? 'active' : ''}`}
                onClick={() => {
                  setType('income');
                  const cat = categories.find((c) => c.type === 'income')?.id || '';
                  setCategoryId(cat);
                }}
                style={{
                  background: type === 'income' ? 'var(--success-light)' : 'var(--bg-input)',
                  borderColor: type === 'income' ? 'var(--success)' : 'var(--border-subtle)',
                  color: type === 'income' ? 'var(--success)' : 'var(--text-secondary)',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  padding: '0.6rem 0.5rem',
                }}
              >
                <ArrowUpRight size={16} /> Income
              </button>

              <button
                type="button"
                className={`btn-secondary ${type === 'transfer' ? 'active' : ''}`}
                onClick={() => setType('transfer')}
                style={{
                  background: type === 'transfer' ? 'var(--primary-light)' : 'var(--bg-input)',
                  borderColor: type === 'transfer' ? 'var(--primary)' : 'var(--border-subtle)',
                  color: type === 'transfer' ? 'var(--primary)' : 'var(--text-secondary)',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  padding: '0.6rem 0.5rem',
                }}
              >
                <ArrowRightLeft size={16} /> Transfer
              </button>
            </div>

            {/* Amount Field */}
            <div className="form-group">
              <label className="form-label">Amount</label>
              <input
                type="number"
                step="any"
                min="0.01"
                placeholder="0.00"
                className="form-input"
                style={{ fontSize: '1.4rem', fontWeight: 800, padding: '0.6rem 1rem' }}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                autoFocus
                required
              />
            </div>

            {/* Category Field (For Income/Expense) */}
            {type !== 'transfer' && (
              <div className="form-group">
                <label className="form-label">Category</label>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))',
                    gap: '0.5rem',
                    maxHeight: '160px',
                    overflowY: 'auto',
                    padding: '0.35rem',
                    background: 'var(--bg-input)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  {filteredCategories.map((c) => {
                    const isSelected = categoryId === c.id;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setCategoryId(c.id)}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '0.35rem',
                          padding: '0.5rem',
                          borderRadius: 'var(--radius-sm)',
                          border: `1px solid ${isSelected ? c.color : 'transparent'}`,
                          background: isSelected ? `${c.color}22` : 'transparent',
                          color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)',
                          cursor: 'pointer',
                          transition: 'all var(--transition-fast)',
                        }}
                      >
                        <div
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: `${c.color}25`,
                            color: c.color,
                          }}
                        >
                          <DynamicIcon name={c.icon} size={14} />
                        </div>
                        <span style={{ fontSize: '0.75rem', fontWeight: isSelected ? 700 : 500, textAlign: 'center', lineHeight: 1.1 }}>
                          {c.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Wallet Selection */}
            <div style={{ display: 'grid', gridTemplateColumns: type === 'transfer' ? '1fr 1fr' : '1fr', gap: '0.75rem' }}>
              <div className="form-group">
                <label className="form-label">{type === 'transfer' ? 'From Wallet / Account' : 'Wallet / Account'}</label>
                <select className="form-select" value={walletId} onChange={(e) => setWalletId(e.target.value)}>
                  {wallets.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.name}
                    </option>
                  ))}
                </select>
              </div>

              {type === 'transfer' && (
                <div className="form-group">
                  <label className="form-label">To Wallet / Account</label>
                  <select className="form-select" value={toWalletId} onChange={(e) => setToWalletId(e.target.value)}>
                    {wallets.map((w) => (
                      <option key={w.id} value={w.id}>
                        {w.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Date Field */}
            <div className="form-group">
              <label className="form-label">Date</label>
              <input type="date" className="form-input" value={date} onChange={(e) => setDate(e.target.value)} required />
            </div>

            {/* Note / Description */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Note / Description (Optional)</label>
              <input
                type="text"
                placeholder="e.g. Grocery trip at Trader Joe's"
                className="form-input"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
          </div>

          {/* Modal Footer */}
          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {initialTransaction ? 'Save Changes' : 'Save Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
