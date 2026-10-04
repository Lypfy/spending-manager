import React, { useState } from 'react';
import { formatCurrency } from '../../utils/formatters';

export const CashflowBarChart = ({ transactions, currency }) => {
  const [hoveredData, setHoveredData] = useState(null);

  // Group transactions for the last 6 calendar months
  const now = new Date();
  const monthsList = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const label = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(d);
    monthsList.push({ key, label, income: 0, expense: 0 });
  }

  transactions.forEach((tx) => {
    if (!tx.date) return;
    const txKey = tx.date.substring(0, 7);
    const mObj = monthsList.find((m) => m.key === txKey);
    if (mObj) {
      if (tx.type === 'income') mObj.income += tx.amount;
      if (tx.type === 'expense') mObj.expense += tx.amount;
    }
  });

  const maxVal = Math.max(...monthsList.map((m) => Math.max(m.income, m.expense)), 100);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
      {/* Chart Canvas */}
      <div style={{ position: 'relative', height: '220px', display: 'flex', alignItems: 'flex-end', gap: '1rem', paddingTop: '1.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
        {monthsList.map((m) => {
          const incomeHeight = (m.income / maxVal) * 160;
          const expenseHeight = (m.expense / maxVal) * 160;

          return (
            <div
              key={m.key}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                height: '100%',
                justifyContent: 'flex-end',
                cursor: 'pointer',
                position: 'relative',
              }}
              onMouseEnter={() => setHoveredData(m)}
              onMouseLeave={() => setHoveredData(null)}
            >
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', height: '170px' }}>
                {/* Income Bar */}
                <div
                  style={{
                    width: '14px',
                    height: `${Math.max(incomeHeight, 4)}px`,
                    borderRadius: '4px 4px 0 0',
                    background: 'linear-gradient(180deg, #10b981 0%, rgba(16, 185, 129, 0.4) 100%)',
                    transition: 'height 0.4s ease, opacity 0.2s ease',
                    opacity: hoveredData && hoveredData.key !== m.key ? 0.4 : 1,
                  }}
                />
                {/* Expense Bar */}
                <div
                  style={{
                    width: '14px',
                    height: `${Math.max(expenseHeight, 4)}px`,
                    borderRadius: '4px 4px 0 0',
                    background: 'linear-gradient(180deg, #ef4444 0%, rgba(239, 68, 68, 0.4) 100%)',
                    transition: 'height 0.4s ease, opacity 0.2s ease',
                    opacity: hoveredData && hoveredData.key !== m.key ? 0.4 : 1,
                  }}
                />
              </div>

              {/* Month Label */}
              <span style={{ marginTop: '0.5rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                {m.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Tooltip & Legend */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#10b981' }} />
            Income
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#ef4444' }} />
            Expense
          </div>
        </div>

        {hoveredData ? (
          <div style={{ fontSize: '0.825rem', fontWeight: 600 }}>
            <span style={{ color: 'var(--text-secondary)', marginRight: '0.5rem' }}>{hoveredData.label}:</span>
            <span style={{ color: '#10b981', marginRight: '0.5rem' }}>+{formatCurrency(hoveredData.income, currency)}</span>
            <span style={{ color: '#ef4444' }}>-{formatCurrency(hoveredData.expense, currency)}</span>
          </div>
        ) : (
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Hover over bars for monthly details</span>
        )}
      </div>
    </div>
  );
};
