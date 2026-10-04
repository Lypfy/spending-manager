import React, { useState } from 'react';
import { useSpending } from '../context/SpendingContext';
import { formatCurrency, getMonthKey } from '../utils/formatters';
import { DonutChart } from './Charts/DonutChart';
import { CashflowBarChart } from './Charts/CashflowBarChart';
import { TrendLineChart } from './Charts/TrendLineChart';
import { DynamicIcon } from './DynamicIcon';
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Flame,
  Calendar,
  Layers,
  Award,
} from 'lucide-react';

export const AnalyticsView = () => {
  const { transactions, categories, currency, currentMonthIncome, currentMonthExpense, categorySpend } = useSpending();

  // Category expense breakdown
  const categoryData = categories
    .filter((c) => c.type === 'expense')
    .map((c) => ({
      id: c.id,
      name: c.name,
      amount: categorySpend[c.id] || 0,
      color: c.color,
      icon: c.icon,
    }))
    .filter((c) => c.amount > 0)
    .sort((a, b) => b.amount - a.amount);

  // Highest spending category
  const topCategory = categoryData[0];

  // Average daily spend calculation (days passed so far in current month)
  const now = new Date();
  const dayOfMonth = Math.max(now.getDate(), 1);
  const avgDailySpend = currentMonthExpense / dayOfMonth;

  // Current month expense count
  const currentMonthKey = getMonthKey(now);
  const monthTransactions = transactions.filter((tx) => getMonthKey(tx.date) === currentMonthKey);
  const monthExpenseCount = monthTransactions.filter((tx) => tx.type === 'expense').length;
  const avgTxAmount = monthExpenseCount > 0 ? currentMonthExpense / monthExpenseCount : 0;

  // Expense to income ratio
  const expenseRatio = currentMonthIncome > 0 ? Math.min(Math.round((currentMonthExpense / currentMonthIncome) * 100), 100) : 100;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Top Header */}
      <div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Financial Analytics & Insights</h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Detailed breakdown of your spending behaviors and cashflow velocity
        </p>
      </div>

      {/* Intelligence Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
        {/* Top Spend Category */}
        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Highest Spend Area</span>
            <Flame size={18} color="#f97316" />
          </div>
          {topCategory ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.25rem' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: 'var(--radius-sm)',
                  background: `${topCategory.color}25`,
                  color: topCategory.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <DynamicIcon name={topCategory.icon} size={18} />
              </div>
              <div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>{topCategory.name}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {formatCurrency(topCategory.amount, currency)} ({Math.round((topCategory.amount / currentMonthExpense) * 100)}%)
                </div>
              </div>
            </div>
          ) : (
            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>No expense data yet</div>
          )}
        </div>

        {/* Average Daily Spend */}
        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Daily Spend Velocity</span>
            <Activity size={18} color="#0ea5e9" />
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {formatCurrency(avgDailySpend, currency)}
            <span style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-muted)', marginLeft: '0.25rem' }}>/ day</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Based on {dayOfMonth} days this month
          </div>
        </div>

        {/* Average per Transaction */}
        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Avg. Expense Size</span>
            <Layers size={18} color="#8b5cf6" />
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {formatCurrency(avgTxAmount, currency)}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Across {monthExpenseCount} expense transactions
          </div>
        </div>

        {/* Expense to Income Ratio */}
        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Spend-to-Income Ratio</span>
            <Award size={18} color={expenseRatio > 85 ? '#ef4444' : '#10b981'} />
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: expenseRatio > 85 ? 'var(--danger)' : 'var(--success)' }}>
            {expenseRatio}%
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            {expenseRatio <= 70 ? 'Healthy cash retention' : 'High spending pressure'}
          </div>
        </div>
      </div>

      {/* Visual Analytics Sections */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '1.5rem' }}>
        {/* Category Share Donut */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.25rem' }}>Category Distribution</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            Interactive pie view of where your money goes
          </p>
          <DonutChart data={categoryData} currency={currency} totalExpense={currentMonthExpense} />
        </div>

        {/* 6-Month Trajectory */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.25rem' }}>Monthly Cashflow Trajectory</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            Income versus expenditure comparison
          </p>
          <CashflowBarChart transactions={transactions} currency={currency} />
        </div>
      </div>

      {/* Daily Spending Trend */}
      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.25rem' }}>Daily Spending Trajectory (This Month)</h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
          Day-by-day expenditure curves highlighting high-spend spikes
        </p>
        <TrendLineChart transactions={transactions} currency={currency} />
      </div>

      {/* Comprehensive Category Table */}
      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>Expense Breakdown by Category</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {categoryData.map((c) => {
            const pct = currentMonthExpense > 0 ? Math.round((c.amount / currentMonthExpense) * 100) : 0;
            return (
              <div key={c.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <div
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: 'var(--radius-sm)',
                        background: `${c.color}25`,
                        color: c.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <DynamicIcon name={c.icon} size={15} />
                    </div>
                    <span style={{ fontWeight: 600 }}>{c.name}</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontWeight: 700 }}>{formatCurrency(c.amount, currency)}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>({pct}%)</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div style={{ height: '6px', width: '100%', background: 'var(--bg-tertiary)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${pct}%`,
                      background: c.color,
                      borderRadius: '3px',
                      transition: 'width 0.4s ease',
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
