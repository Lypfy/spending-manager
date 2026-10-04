import React, { useState } from 'react';
import { useSpending } from '../context/SpendingContext';
import { formatCurrency, getMonthKey } from '../utils/formatters';
import { DynamicIcon } from './DynamicIcon';
import { BudgetModal } from './BudgetModal';
import {
  Target,
  Plus,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Sparkles,
  Edit2,
  TrendingUp,
} from 'lucide-react';

export const BudgetsView = () => {
  const { categories, budgets, categorySpend, currency } = useSpending();
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const currentMonthKey = getMonthKey();
  const currentBudgets = budgets.filter((b) => !b.month || b.month === currentMonthKey);

  // Time calculations
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const totalDays = new Date(year, month + 1, 0).getDate();
  const currentDay = now.getDate();
  const daysLeft = Math.max(totalDays - currentDay, 1);

  // Totals
  const totalBudgeted = currentBudgets.reduce((acc, b) => acc + b.limit, 0);
  const totalSpent = currentBudgets.reduce((acc, b) => acc + (categorySpend[b.categoryId] || 0), 0);
  const remainingBudget = Math.max(totalBudgeted - totalSpent, 0);
  const dailySafeSpend = totalBudgeted > totalSpent ? remainingBudget / daysLeft : 0;
  const overallUsagePct = totalBudgeted > 0 ? Math.round((totalSpent / totalBudgeted) * 100) : 0;

  const overBudgetCategories = currentBudgets.filter((b) => (categorySpend[b.categoryId] || 0) > b.limit);

  const getCategory = (catId) => categories.find((c) => c.id === catId);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Monthly Budgets & Limits</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Track category spending goals and stay within your financial targets
          </p>
        </div>
        <button
          className="btn-primary"
          onClick={() => {
            setSelectedBudget(null);
            setIsModalOpen(true);
          }}
        >
          <Plus size={16} /> Set Category Budget
        </button>
      </div>

      {/* Overview Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
        {/* Total Budgeted */}
        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Total Planned Budget</span>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.25rem' }}>
            {formatCurrency(totalBudgeted, currency)}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Across {currentBudgets.length} allocated categories
          </div>
        </div>

        {/* Total Spent */}
        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Total Spent Against Budgets</span>
          <div
            style={{
              fontSize: '1.6rem',
              fontWeight: 800,
              color: overallUsagePct > 100 ? 'var(--danger)' : 'var(--text-primary)',
              marginTop: '0.25rem',
            }}
          >
            {formatCurrency(totalSpent, currency)}
            <span style={{ fontSize: '0.85rem', fontWeight: 600, marginLeft: '0.35rem', color: 'var(--text-muted)' }}>
              ({overallUsagePct}%)
            </span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            {remainingBudget > 0 ? `${formatCurrency(remainingBudget, currency)} remaining` : 'Limit exceeded'}
          </div>
        </div>

        {/* Safe Daily Spend */}
        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Safe Daily Spend Guide</span>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#10b981', marginTop: '0.25rem' }}>
            {formatCurrency(dailySafeSpend, currency)}
            <span style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-muted)', marginLeft: '0.25rem' }}>/ day</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            For the next {daysLeft} remaining days in the month
          </div>
        </div>
      </div>

      {/* Alert Banner if over budget */}
      {overBudgetCategories.length > 0 && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '1rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            background: 'var(--danger-light)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: 'var(--danger)',
            fontSize: '0.9rem',
            fontWeight: 600,
          }}
        >
          <AlertTriangle size={20} style={{ flexShrink: 0 }} />
          <div>
            <span>
              Spending alert: {overBudgetCategories.length} category limit(s) exceeded! (
              {overBudgetCategories.map((b) => getCategory(b.categoryId)?.name || b.categoryId).join(', ')})
            </span>
          </div>
        </div>
      )}

      {/* Category Budgets Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.25rem' }}>
        {currentBudgets.map((b) => {
          const cat = getCategory(b.categoryId);
          const spent = categorySpend[b.categoryId] || 0;
          const usagePct = Math.round((spent / b.limit) * 100);
          const isOver = spent > b.limit;
          const isWarning = usagePct >= 80 && !isOver;

          return (
            <div
              key={b.categoryId}
              className="glass-card"
              style={{
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                border: isOver ? '1px solid rgba(239, 68, 68, 0.4)' : undefined,
              }}
            >
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: 'var(--radius-sm)',
                      background: cat ? `${cat.color}25` : 'var(--primary-light)',
                      color: cat?.color || 'var(--primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <DynamicIcon name={cat?.icon || 'Tag'} size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 700 }}>{cat?.name || b.categoryId}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Target: {formatCurrency(b.limit, currency)}
                    </div>
                  </div>
                </div>

                <button
                  className="icon-btn"
                  onClick={() => {
                    setSelectedBudget(b);
                    setIsModalOpen(true);
                  }}
                  title="Edit Budget"
                  style={{ width: '32px', height: '32px' }}
                >
                  <Edit2 size={14} />
                </button>
              </div>

              {/* Progress Bar */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                  <span style={{ fontWeight: 600, color: isOver ? 'var(--danger)' : 'var(--text-secondary)' }}>
                    {formatCurrency(spent, currency)} spent
                  </span>
                  <span
                    style={{
                      fontWeight: 700,
                      color: isOver ? 'var(--danger)' : isWarning ? 'var(--warning)' : 'var(--success)',
                    }}
                  >
                    {usagePct}%
                  </span>
                </div>
                <div style={{ height: '8px', width: '100%', background: 'var(--bg-tertiary)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${Math.min(usagePct, 100)}%`,
                      background: isOver ? 'var(--danger)' : isWarning ? 'var(--warning)' : cat?.color || 'var(--primary)',
                      borderRadius: '4px',
                      transition: 'width 0.4s ease',
                    }}
                  />
                </div>
              </div>

              {/* Footer status text */}
              <div style={{ fontSize: '0.8rem', color: isOver ? 'var(--danger)' : 'var(--text-muted)' }}>
                {isOver ? (
                  <span>Exceeded by {formatCurrency(spent - b.limit, currency)}</span>
                ) : (
                  <span>{formatCurrency(b.limit - spent, currency)} left ({Math.round((b.limit - spent) / daysLeft)}/day)</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <BudgetModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedBudget(null);
        }}
        initialBudget={selectedBudget}
      />
    </div>
  );
};
