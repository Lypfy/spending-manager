import React, { useState, useRef } from 'react';
import { useSpending } from '../context/SpendingContext';
import { CURRENCIES } from '../constants/currencies';
import { exportToCSV, exportToJSON, importFromJSON } from '../utils/exportImport';
import {
  LayoutDashboard,
  ReceiptText,
  PieChart,
  Target,
  Trophy,
  Wallet,
  Plus,
  Sun,
  Moon,
  Download,
  Upload,
  RotateCcw,
  Sparkles,
  MoreVertical,
} from 'lucide-react';

export const Navbar = ({ activeTab, setActiveTab, onOpenAddTransaction }) => {
  const {
    currency,
    setCurrency,
    theme,
    setTheme,
    transactions,
    categories,
    wallets,
    budgets,
    goals,
    resetToSampleData,
    clearAllData,
    importData,
  } = useSpending();

  const [menuOpen, setMenuOpen] = useState(false);
  const fileInputRef = useRef(null);

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'transactions', label: 'Transactions', icon: ReceiptText },
    { id: 'analytics', label: 'Analytics', icon: PieChart },
    { id: 'budgets', label: 'Budgets', icon: Target },
    { id: 'goals', label: 'Goals', icon: Trophy },
    { id: 'wallets', label: 'Accounts', icon: Wallet },
  ];

  const handleExportCSV = () => {
    exportToCSV(transactions, categories, wallets);
    setMenuOpen(false);
  };

  const handleExportJSON = () => {
    exportToJSON({ transactions, categories, wallets, budgets, goals, currency, theme });
    setMenuOpen(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    importFromJSON(
      file,
      (data) => {
        importData(data);
        alert('Data successfully imported!');
        setMenuOpen(false);
      },
      (err) => {
        alert('Import failed: ' + err.message);
      }
    );
  };

  return (
    <header className="app-header">
      <div className="header-inner">
        {/* Brand */}
        <div className="brand-logo" onClick={() => setActiveTab('dashboard')}>
          <div className="brand-icon-box">
            <Sparkles size={22} />
          </div>
          <span>SpendFlow</span>
        </div>

        {/* Navigation Tabs */}
        <nav className="nav-tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                className={`nav-tab-btn ${isActive ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="header-actions">
          {/* Quick Add Button */}
          <button className="btn-primary" onClick={onOpenAddTransaction}>
            <Plus size={18} strokeWidth={2.5} />
            <span>Record</span>
          </button>

          {/* Currency Dropdown */}
          <select
            className="select-control"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            title="Choose Currency"
          >
            {CURRENCIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.code} ({c.symbol})
              </option>
            ))}
          </select>

          {/* Theme Toggle */}
          <button
            className="icon-btn"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Settings & Data Menu */}
          <div style={{ position: 'relative' }}>
            <button
              className="icon-btn"
              onClick={() => setMenuOpen(!menuOpen)}
              title="Data & Backup Options"
              aria-label="Data Options"
            >
              <MoreVertical size={18} />
            </button>

            {menuOpen && (
              <div
                style={{
                  position: 'absolute',
                  right: 0,
                  top: '120%',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-lg)',
                  width: '210px',
                  padding: '0.5rem',
                  zIndex: 50,
                  animation: 'fadeIn 0.15s ease-out',
                }}
              >
                <button
                  onClick={handleExportCSV}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    width: '100%',
                    padding: '0.5rem 0.75rem',
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-primary)',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    borderRadius: 'var(--radius-sm)',
                    textAlign: 'left',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-tertiary)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <Download size={15} /> Export to CSV
                </button>

                <button
                  onClick={handleExportJSON}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    width: '100%',
                    padding: '0.5rem 0.75rem',
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-primary)',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    borderRadius: 'var(--radius-sm)',
                    textAlign: 'left',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-tertiary)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <Download size={15} /> Backup Data (JSON)
                </button>

                <button
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    width: '100%',
                    padding: '0.5rem 0.75rem',
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-primary)',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    borderRadius: 'var(--radius-sm)',
                    textAlign: 'left',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-tertiary)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <Upload size={15} /> Restore Backup
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  accept=".json"
                  onChange={handleFileChange}
                />

                <div style={{ height: '1px', background: 'var(--border-subtle)', margin: '0.35rem 0' }} />

                <button
                  onClick={() => {
                    if (confirm('Load demo transactions and budgets? Current unsaved custom entries may be replaced.')) {
                      resetToSampleData();
                      setMenuOpen(false);
                    }
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    width: '100%',
                    padding: '0.5rem 0.75rem',
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--primary)',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    borderRadius: 'var(--radius-sm)',
                    textAlign: 'left',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-tertiary)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <RotateCcw size={15} /> Load Demo Data
                </button>

                <button
                  onClick={() => {
                    if (confirm('Clear all data to start completely fresh?')) {
                      clearAllData();
                      setMenuOpen(false);
                    }
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    width: '100%',
                    padding: '0.5rem 0.75rem',
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--danger)',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    borderRadius: 'var(--radius-sm)',
                    textAlign: 'left',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--danger-light)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  Clear All Data
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
