import React, { useState, useMemo } from 'react';
import { useSpending } from '../context/SpendingContext';
import { formatCurrency, formatDate, getMonthKey } from '../utils/formatters';
import { exportToCSV } from '../utils/exportImport';
import { DynamicIcon } from './DynamicIcon';
import {
  Search,
  Filter,
  Download,
  Plus,
  Trash2,
  Edit2,
  ArrowRightLeft,
  ArrowDownRight,
  ArrowUpRight,
} from 'lucide-react';

export const TransactionsView = ({ onOpenAddTransaction, onEditTransaction }) => {
  const { transactions, categories, wallets, currency, deleteTransaction } = useSpending();

  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterWallet, setFilterWallet] = useState('all');
  const [filterPeriod, setFilterPeriod] = useState('all');
  const [sortBy, setSortBy] = useState('date_desc');

  const getCategory = (catId) => categories.find((c) => c.id === catId);
  const getWallet = (wId) => wallets.find((w) => w.id === wId);

  const filteredTransactions = useMemo(() => {
    const now = new Date();
    const currentMonthKey = getMonthKey(now);
    const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthKey = getMonthKey(lastMonthDate);
    const currentYearStr = String(now.getFullYear());

    return transactions.filter((tx) => {
      // Type filter
      if (filterType !== 'all' && tx.type !== filterType) return false;

      // Category filter
      if (filterCategory !== 'all' && tx.categoryId !== filterCategory) return false;

      // Wallet filter
      if (filterWallet !== 'all' && tx.walletId !== filterWallet && tx.toWalletId !== filterWallet) return false;

      // Date Period filter
      if (filterPeriod === 'this_month' && getMonthKey(tx.date) !== currentMonthKey) return false;
      if (filterPeriod === 'last_month' && getMonthKey(tx.date) !== lastMonthKey) return false;
      if (filterPeriod === 'this_year' && !tx.date?.startsWith(currentYearStr)) return false;

      // Search filter
      if (search.trim()) {
        const query = search.toLowerCase();
        const cat = getCategory(tx.categoryId);
        const catName = cat ? cat.name.toLowerCase() : '';
        const note = (tx.note || '').toLowerCase();
        const amtStr = String(tx.amount);
        if (!catName.includes(query) && !note.includes(query) && !amtStr.includes(query)) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'date_desc') return new Date(b.date) - new Date(a.date);
      if (sortBy === 'date_asc') return new Date(a.date) - new Date(b.date);
      if (sortBy === 'amount_desc') return b.amount - a.amount;
      if (sortBy === 'amount_asc') return a.amount - b.amount;
      return 0;
    });
  }, [transactions, search, filterType, filterCategory, filterWallet, filterPeriod, sortBy, categories]);

  const handleDelete = (id, e) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this transaction record?')) {
      deleteTransaction(id);
    }
  };

  const totalFilteredAmount = filteredTransactions.reduce((acc, tx) => {
    if (tx.type === 'income') return acc + tx.amount;
    if (tx.type === 'expense') return acc - tx.amount;
    return acc;
  }, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header & Main Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Transactions History</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Showing {filteredTransactions.length} of {transactions.length} records
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn-secondary" onClick={() => exportToCSV(filteredTransactions, categories, wallets)}>
            <Download size={16} /> Export CSV
          </button>
          <button className="btn-primary" onClick={onOpenAddTransaction}>
            <Plus size={16} /> Add Transaction
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="glass-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
          {/* Search Input */}
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search note, category, amount..."
              className="form-input"
              style={{ paddingLeft: '36px' }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Type Filter */}
          <select className="select-control" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="all">All Types</option>
            <option value="expense">Expenses Only</option>
            <option value="income">Income Only</option>
            <option value="transfer">Transfers Only</option>
          </select>

          {/* Category Filter */}
          <select className="select-control" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.type})
              </option>
            ))}
          </select>

          {/* Wallet Filter */}
          <select className="select-control" value={filterWallet} onChange={(e) => setFilterWallet(e.target.value)}>
            <option value="all">All Accounts</option>
            {wallets.map((w) => (
              <option key={w.id} value={w.id}>
                {w.name}
              </option>
            ))}
          </select>

          {/* Period Filter */}
          <select className="select-control" value={filterPeriod} onChange={(e) => setFilterPeriod(e.target.value)}>
            <option value="all">All Time</option>
            <option value="this_month">This Month</option>
            <option value="last_month">Last Month</option>
            <option value="this_year">This Year</option>
          </select>

          {/* Sort By */}
          <select className="select-control" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="date_desc">Newest First</option>
            <option value="date_asc">Oldest First</option>
            <option value="amount_desc">Highest Amount</option>
            <option value="amount_asc">Lowest Amount</option>
          </select>
        </div>
      </div>

      {/* Transaction List Feed */}
      <div className="glass-card" style={{ padding: '1rem', overflow: 'hidden' }}>
        {filteredTransactions.length === 0 ? (
          <div style={{ padding: '3rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            No transactions matching your selected filters.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {filteredTransactions.map((tx) => {
              const cat = getCategory(tx.categoryId);
              const wallet = getWallet(tx.walletId);
              const toWallet = getWallet(tx.toWalletId);
              const isIncome = tx.type === 'income';
              const isTransfer = tx.type === 'transfer';

              return (
                <div
                  key={tx.id}
                  onClick={() => onEditTransaction(tx)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.85rem 1.25rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-subtle)',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)',
                    gap: '1rem',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.4)')}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border-subtle)')}
                >
                  {/* Left: Icon & Details */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: 'var(--radius-md)',
                        background: isTransfer
                          ? 'var(--primary-light)'
                          : cat
                          ? `${cat.color}20`
                          : 'var(--bg-tertiary)',
                        color: isTransfer ? 'var(--primary)' : cat ? cat.color : 'var(--text-secondary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {isTransfer ? (
                        <ArrowRightLeft size={20} />
                      ) : (
                        <DynamicIcon name={cat?.icon || 'Tag'} size={20} />
                      )}
                    </div>

                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                          {isTransfer ? `Transfer: ${wallet?.name} → ${toWallet?.name}` : cat?.name || 'Uncategorized'}
                        </span>
                        <span
                          className={`badge ${
                            isTransfer ? 'badge-primary' : isIncome ? 'badge-success' : 'badge-danger'
                          }`}
                        >
                          {tx.type}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                        <span>{formatDate(tx.date)}</span>
                        {wallet && <span> &bull; {wallet.name}</span>}
                        {tx.note && <span style={{ color: 'var(--text-muted)' }}> &bull; "{tx.note}"</span>}
                      </div>
                    </div>
                  </div>

                  {/* Right: Amount & Actions */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexShrink: 0 }}>
                    <div
                      style={{
                        fontSize: '1.1rem',
                        fontWeight: 800,
                        color: isTransfer ? 'var(--primary)' : isIncome ? 'var(--success)' : 'var(--danger)',
                        textAlign: 'right',
                      }}
                    >
                      {isTransfer ? '' : isIncome ? '+' : '-'}
                      {formatCurrency(tx.amount, currency)}
                    </div>

                    <div style={{ display: 'flex', gap: '0.35rem' }}>
                      <button
                        className="icon-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditTransaction(tx);
                        }}
                        title="Edit"
                        style={{ width: '32px', height: '32px' }}
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        className="icon-btn"
                        onClick={(e) => handleDelete(tx.id, e)}
                        title="Delete"
                        style={{ width: '32px', height: '32px', color: 'var(--danger)' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
