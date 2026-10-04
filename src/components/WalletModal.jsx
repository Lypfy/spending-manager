import React, { useState, useEffect } from 'react';
import { useSpending } from '../context/SpendingContext';
import { X, Wallet } from 'lucide-react';

export const WalletModal = ({ isOpen, onClose, initialWallet = null }) => {
  const { addWallet, editWallet, deleteWallet, wallets } = useSpending();

  const [name, setName] = useState('');
  const [type, setType] = useState('bank');
  const [balance, setBalance] = useState('');
  const [color, setColor] = useState('#6366f1');
  const [icon, setIcon] = useState('Building2');

  const WALLET_TYPES = [
    { value: 'bank', label: 'Bank Account', icon: 'Building2' },
    { value: 'cash', label: 'Cash Wallet', icon: 'Banknote' },
    { value: 'credit', label: 'Credit Card', icon: 'CreditCard' },
    { value: 'savings', label: 'Savings Vault', icon: 'PiggyBank' },
    { value: 'crypto', label: 'Crypto / Other', icon: 'Coins' },
  ];

  const COLOR_OPTIONS = ['#6366f1', '#10b981', '#8b5cf6', '#ec4899', '#f59e0b', '#0ea5e9', '#ef4444'];

  useEffect(() => {
    if (initialWallet) {
      setName(initialWallet.name || '');
      setType(initialWallet.type || 'bank');
      setBalance(initialWallet.balance || 0);
      setColor(initialWallet.color || '#6366f1');
      setIcon(initialWallet.icon || 'Building2');
    } else {
      setName('');
      setType('bank');
      setBalance('');
      setColor('#6366f1');
      setIcon('Building2');
    }
  }, [initialWallet, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Please enter account name.');
      return;
    }

    const payload = {
      name,
      type,
      balance: parseFloat(balance) || 0,
      color,
      icon,
    };

    if (initialWallet && initialWallet.id) {
      editWallet(initialWallet.id, payload);
    } else {
      addWallet(payload);
    }

    onClose();
  };

  const handleDelete = () => {
    if (wallets.length <= 1) {
      alert('You must have at least one account/wallet.');
      return;
    }
    if (confirm('Are you sure you want to remove this account?')) {
      deleteWallet(initialWallet.id);
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Wallet size={20} color="var(--primary)" />
            <h3 className="modal-title">{initialWallet ? 'Edit Account' : 'Add New Account / Wallet'}</h3>
          </div>
          <button className="icon-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Account Name</label>
              <input
                type="text"
                placeholder="e.g. Chase Checking, Cash in Wallet, Apple Card"
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Account Type</label>
              <select
                className="form-select"
                value={type}
                onChange={(e) => {
                  const val = e.target.value;
                  setType(val);
                  const matched = WALLET_TYPES.find((w) => w.value === val);
                  if (matched) setIcon(matched.icon);
                }}
              >
                {WALLET_TYPES.map((wt) => (
                  <option key={wt.value} value={wt.value}>
                    {wt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Initial Starting Balance</label>
              <input
                type="number"
                step="any"
                placeholder="0.00"
                className="form-input"
                value={balance}
                onChange={(e) => setBalance(e.target.value)}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Account Color Tag</label>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {COLOR_OPTIONS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    style={{
                      width: '32px',
                      height: '32px',
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
            {initialWallet && (
              <button type="button" className="btn-danger" onClick={handleDelete} style={{ marginRight: 'auto' }}>
                Delete
              </button>
            )}
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Save Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
