import React from 'react';
import { useSpending } from '../context/SpendingContext';
import { formatCurrency, formatDate } from '../utils/formatters';
import { DynamicIcon } from './DynamicIcon';
import { DonutChart } from './Charts/DonutChart';
import { CashflowBarChart } from './Charts/CashflowBarChart';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  ArrowUpRight,
  ArrowDownLeft,
  ArrowRightLeft,
  ChevronRight,
  Plus,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

export const Dashboard = ({ onOpenAddTransaction, onEditTransaction, setActiveTab }) => {
  const {
    transactions,
    categories,
    walletsWithBalance,
    budgets,
    currency,
    netWorth,
    currentMonthIncome,
    currentMonthExpense,
    savingsRate,
    categorySpend,
  } = useSpending();

  // Top spending categories data for donut
  const topCategoriesData = categories
    .filter((c) => c.type === 'expense')
    .map((c) => ({
      id: c.id,
      name: c.name,
      amount: categorySpend[c.id] || 0,
      color: c.color,
    }))
    .filter((c) => c.amount > 0)
    .sort((a, b) => b.amount - a.amount);

  const recentTransactions = transactions.slice(0, 5);

  const getCategory = (catId) => categories.find((c) => c.id === catId);
  const getWallet = (wId) => walletsWithBalance.find((w) => w.id === wId);

  // Check budget health
  const totalBudgeted = budgets.reduce((acc, b) => acc + b.limit, 0);
  const totalBudgetSpent = budgets.reduce((acc, b) => acc + (categorySpend[b.categoryId] || 0), 0);
  const budgetUsagePercent = totalBudgeted > 0 ? Math.round((totalBudgetSpent / totalBudgeted) * 100) : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Top Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.25rem' }}>
        {/* Net Balance Card */}
        <div
          className="glass-card"
          style={{
            padding: '1.5rem',
            position: 'relative',
            overflow: 'hidden',
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(30, 41, 59, 0.7) 100%)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Total Net Balance</span>
            <div style={{ padding: '0.4rem', borderRadius: 'var(--radius-sm)', background: 'var(--primary-light)', color: 'var(--primary)' }}>
              <Wallet size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            {formatCurrency(netWorth, currency)}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Across {walletsWithBalance.length} accounts
          </div>
        </div>

        {/* Monthly Income Card */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>This Month's Income</span>
            <div style={{ padding: '0.4rem', borderRadius: 'var(--radius-sm)', background: 'var(--success-light)', color: 'var(--success)' }}>
              <TrendingUp size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--success)', letterSpacing: '-0.02em' }}>
            +{formatCurrency(currentMonthIncome, currency)}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Active revenue streams
          </div>
        </div>

        {/* Monthly Expenses Card */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>This Month's Expenses</span>
            <div style={{ padding: '0.4rem', borderRadius: 'var(--radius-sm)', background: 'var(--danger-light)', color: 'var(--danger)' }}>
              <TrendingDown size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--danger)', letterSpacing: '-0.02em' }}>
            -{formatCurrency(currentMonthExpense, currency)}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            {topCategoriesData.length} active spending categories
          </div>
        </div>

        {/* Savings Rate Card */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Savings Rate</span>
            <div style={{ padding: '0.4rem', borderRadius: 'var(--radius-sm)', background: 'rgba(236, 72, 153, 0.15)', color: '#ec4899' }}>
              <PiggyBank size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#ec4899', letterSpacing: '-0.02em' }}>
            {savingsRate}%
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            {savingsRate >= 20 ? '🎉 Excellent savings discipline' : '🎯 Target 20%+ for financial safety'}
          </div>
        </div>
      </div>

      {/* Charts & Quick Insights Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '1.5rem' }}>
        {/* Donut Chart: Spending by Category */}
        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Expense Breakdown</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Current month category share</p>
            </div>
            <button className="icon-btn" onClick={() => setActiveTab('analytics')} title="View Full Analytics">
              <ChevronRight size={18} />
            </button>
          </div>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <DonutChart data={topCategoriesData} currency={currency} totalExpense={currentMonthExpense} />
          </div>
        </div>

        {/* Cashflow Bar Chart */}
        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Income vs Expenses</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>6-month financial trajectory</p>
            </div>
            <button className="icon-btn" onClick={() => setActiveTab('analytics')} title="View Full Analytics">
              <ChevronRight size={18} />
            </button>
          </div>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
            <CashflowBarChart transactions={transactions} currency={currency} />
          </div>
        </div>
      </div>

      {/* Wallets & Quick Budgets Widget */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {/* Accounts Summary */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Your Accounts</h3>
            <button
              onClick={() => setActiveTab('wallets')}
              style={{
                fontSize: '0.8rem',
                color: 'var(--primary)',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              Manage &rarr;
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {walletsWithBalance.map((w) => (
              <div
                key={w.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: 'var(--radius-sm)',
                      background: `${w.color}20`,
                      color: w.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <DynamicIcon name={w.icon || 'Wallet'} size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{w.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                      {w.type}
                    </div>
                  </div>
                </div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: w.currentBalance < 0 ? 'var(--danger)' : 'var(--text-primary)' }}>
                  {formatCurrency(w.currentBalance, currency)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Budget Health Tracker */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Monthly Budget Health</h3>
            <button
              onClick={() => setActiveTab('budgets')}
              style={{
                fontSize: '0.8rem',
                color: 'var(--primary)',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              Budgets &rarr;
            </button>
          </div>

          {budgets.length === 0 ? (
            <div style={{ padding: '1.5rem 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              No monthly category budgets set yet.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Budget Used</span>
                  <span style={{ fontWeight: 700 }}>
                    {formatCurrency(totalBudgetSpent, currency)} / {formatCurrency(totalBudgeted, currency)} ({budgetUsagePercent}%)
                  </span>
                </div>
                <div style={{ height: '8px', width: '100%', background: 'var(--bg-tertiary)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${Math.min(budgetUsagePercent, 100)}%`,
                      background: budgetUsagePercent > 100 ? 'var(--danger)' : budgetUsagePercent > 80 ? 'var(--warning)' : 'var(--success)',
                      borderRadius: '4px',
                      transition: 'width 0.4s ease',
                    }}
                  />
                </div>
              </div>

              {/* Status Note */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-md)',
                  background: budgetUsagePercent > 100 ? 'var(--danger-light)' : 'var(--success-light)',
                  color: budgetUsagePercent > 100 ? 'var(--danger)' : 'var(--success)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                }}
              >
                {budgetUsagePercent > 100 ? (
                  <>
                    <AlertCircle size={16} /> Budget exceeded by {formatCurrency(totalBudgetSpent - totalBudgeted, currency)}
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={16} /> {formatCurrency(totalBudgeted - totalBudgetSpent, currency)} safe spending remaining this month
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recent Transactions Feed */}
      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Recent Transactions</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Latest activity</p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="btn-secondary" onClick={() => setActiveTab('transactions')}>
              View All ({transactions.length})
            </button>
            <button className="btn-primary" onClick={onOpenAddTransaction}>
              <Plus size={16} /> Add New
            </button>
          </div>
        </div>

        {recentTransactions.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            No transactions yet. Click "+ Add New" to record your first transaction!
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {recentTransactions.map((tx) => {
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
                    padding: '0.85rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-subtle)',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.4)')}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border-subtle)')}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
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
                      }}
                    >
                      {isTransfer ? (
                        <ArrowRightLeft size={18} />
                      ) : (
                        <DynamicIcon name={cat?.icon || 'Tag'} size={18} />
                      )}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {isTransfer ? `Transfer: ${wallet?.name} → ${toWallet?.name}` : cat?.name || 'Uncategorized'}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {formatDate(tx.date)} &bull; {tx.note || (wallet ? wallet.name : '')}
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      fontSize: '1rem',
                      fontWeight: 800,
                      color: isTransfer ? 'var(--primary)' : isIncome ? 'var(--success)' : 'var(--danger)',
                    }}
                  >
                    {isTransfer ? '' : isIncome ? '+' : '-'}
                    {formatCurrency(tx.amount, currency)}
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
