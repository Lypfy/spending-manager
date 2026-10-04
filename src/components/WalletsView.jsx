import React, { useState } from 'react';
import { useSpending } from '../context/SpendingContext';
import { formatCurrency } from '../utils/formatters';
import { DynamicIcon } from './DynamicIcon';
import { WalletModal } from './WalletModal';
import { CategoryModal } from './CategoryModal';
import {
  Wallet,
  Plus,
  ArrowRightLeft,
  Edit2,
  Trash2,
  Tag,
  CreditCard,
  Building2,
  Banknote,
  PiggyBank,
} from 'lucide-react';

export const WalletsView = ({ onOpenTransfer }) => {
  const {
    walletsWithBalance,
    categories,
    deleteCategory,
    currency,
    netWorth,
  } = useSpending();

  const [selectedWallet, setSelectedWallet] = useState(null);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  const expenseCats = categories.filter((c) => c.type === 'expense');
  const incomeCats = categories.filter((c) => c.type === 'income');

  const handleDeleteCat = (catId, catName) => {
    if (confirm(`Delete category "${catName}"?`)) {
      deleteCategory(catId);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      {/* Wallets & Accounts Section */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Accounts & Wallets</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Total Net Worth across all accounts: <strong style={{ color: 'var(--text-primary)' }}>{formatCurrency(netWorth, currency)}</strong>
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button className="btn-secondary" onClick={onOpenTransfer}>
              <ArrowRightLeft size={16} /> Transfer Funds
            </button>
            <button
              className="btn-primary"
              onClick={() => {
                setSelectedWallet(null);
                setIsWalletModalOpen(true);
              }}
            >
              <Plus size={16} /> Add Account
            </button>
          </div>
        </div>

        {/* Wallets Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {walletsWithBalance.map((w) => (
            <div
              key={w.id}
              className="glass-card"
              style={{
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                position: 'relative',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: 'var(--radius-md)',
                      background: `${w.color}25`,
                      color: w.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <DynamicIcon name={w.icon || 'Wallet'} size={20} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>{w.name}</h4>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                      {w.type}
                    </span>
                  </div>
                </div>

                <button
                  className="icon-btn"
                  onClick={() => {
                    setSelectedWallet(w);
                    setIsWalletModalOpen(true);
                  }}
                  title="Edit Account"
                  style={{ width: '32px', height: '32px' }}
                >
                  <Edit2 size={14} />
                </button>
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Current Balance</div>
                <div
                  style={{
                    fontSize: '1.4rem',
                    fontWeight: 800,
                    color: w.currentBalance < 0 ? 'var(--danger)' : 'var(--text-primary)',
                    marginTop: '0.15rem',
                  }}
                >
                  {formatCurrency(w.currentBalance, currency)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Category Management Section */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Category Manager</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Customize and organize income & expense classification tags
            </p>
          </div>
          <button className="btn-secondary" onClick={() => setIsCategoryModalOpen(true)}>
            <Plus size={16} /> New Category
          </button>
        </div>

        {/* Expense Categories */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--danger)' }}>
            Expense Categories ({expenseCats.length})
          </h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
            {expenseCats.map((c) => (
              <div
                key={c.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.45rem 0.75rem',
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--bg-secondary)',
                  border: `1px solid ${c.color}35`,
                  fontSize: '0.85rem',
                }}
              >
                <div
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    background: `${c.color}25`,
                    color: c.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <DynamicIcon name={c.icon} size={12} />
                </div>
                <span style={{ fontWeight: 600 }}>{c.name}</span>
                {categories.length > 5 && (
                  <button
                    onClick={() => handleDeleteCat(c.id, c.name)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      padding: 0,
                      display: 'flex',
                      alignItems: 'center',
                    }}
                    title="Remove"
                  >
                    <Trash2 size={12} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Income Categories */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--success)' }}>
            Income Categories ({incomeCats.length})
          </h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
            {incomeCats.map((c) => (
              <div
                key={c.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.45rem 0.75rem',
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--bg-secondary)',
                  border: `1px solid ${c.color}35`,
                  fontSize: '0.85rem',
                }}
              >
                <div
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    background: `${c.color}25`,
                    color: c.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <DynamicIcon name={c.icon} size={12} />
                </div>
                <span style={{ fontWeight: 600 }}>{c.name}</span>
                {categories.length > 5 && (
                  <button
                    onClick={() => handleDeleteCat(c.id, c.name)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      padding: 0,
                      display: 'flex',
                      alignItems: 'center',
                    }}
                    title="Remove"
                  >
                    <Trash2 size={12} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <WalletModal
        isOpen={isWalletModalOpen}
        onClose={() => {
          setIsWalletModalOpen(false);
          setSelectedWallet(null);
        }}
        initialWallet={selectedWallet}
      />

      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
      />
    </div>
  );
};
