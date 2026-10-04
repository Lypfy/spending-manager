import React, { useState } from 'react';
import { formatCurrency } from '../../utils/formatters';

export const TrendLineChart = ({ transactions, currency }) => {
  const [hoveredDay, setHoveredDay] = useState(null);

  // Group current month daily expenses
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const dailySpend = Array.from({ length: daysInMonth }, (_, idx) => {
    const day = idx + 1;
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return { day, dateStr, spend: 0 };
  });

  transactions.forEach((tx) => {
    if (tx.type === 'expense' && tx.date) {
      const txDay = parseInt(tx.date.split('-')[2], 10);
      const txMonth = parseInt(tx.date.split('-')[1], 10) - 1;
      const txYear = parseInt(tx.date.split('-')[0], 10);

      if (txYear === year && txMonth === month && txDay >= 1 && txDay <= daysInMonth) {
        dailySpend[txDay - 1].spend += tx.amount;
      }
    }
  });

  const maxDaily = Math.max(...dailySpend.map((d) => d.spend), 50);

  // Generate SVG path coordinates
  const width = 500;
  const height = 180;
  const paddingX = 20;
  const paddingY = 25;

  const getX = (idx) => paddingX + (idx / (daysInMonth - 1)) * (width - paddingX * 2);
  const getY = (val) => height - paddingY - (val / maxDaily) * (height - paddingY * 2);

  const points = dailySpend.map((d, i) => `${getX(i)},${getY(d.spend)}`).join(' ');
  const areaPoints = `${paddingX},${height - paddingY} ${points} ${width - paddingX},${height - paddingY}`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%' }}>
      <div style={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
        <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: 'auto', overflow: 'visible' }}>
          <defs>
            <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line x1={paddingX} y1={paddingY} x2={width - paddingX} y2={paddingY} stroke="var(--border-subtle)" strokeDasharray="3 3" />
          <line x1={paddingX} y1={height / 2} x2={width - paddingX} y2={height / 2} stroke="var(--border-subtle)" strokeDasharray="3 3" />
          <line x1={paddingX} y1={height - paddingY} x2={width - paddingX} y2={height - paddingY} stroke="var(--border-subtle)" />

          {/* Area fill */}
          <polygon points={areaPoints} fill="url(#trendGradient)" />

          {/* Trend line */}
          <polyline
            fill="none"
            stroke="#6366f1"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={points}
          />

          {/* Points */}
          {dailySpend.map((d, i) => {
            if (d.spend === 0 && daysInMonth > 15) return null; // keep clean
            const cx = getX(i);
            const cy = getY(d.spend);
            const isHovered = hoveredDay && hoveredDay.day === d.day;

            return (
              <circle
                key={d.day}
                cx={cx}
                cy={cy}
                r={isHovered ? 6 : d.spend > 0 ? 4 : 2}
                fill={isHovered ? '#ec4899' : '#6366f1'}
                stroke="var(--bg-secondary)"
                strokeWidth="2"
                style={{ cursor: 'pointer', transition: 'all 0.15s ease' }}
                onMouseEnter={() => setHoveredDay(d)}
                onMouseLeave={() => setHoveredDay(null)}
              />
            );
          })}
        </svg>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem' }}>
        <span style={{ color: 'var(--text-muted)' }}>Day 1</span>
        {hoveredDay ? (
          <span style={{ fontWeight: 700, color: 'var(--primary)' }}>
            Day {hoveredDay.day}: {formatCurrency(hoveredDay.spend, currency)}
          </span>
        ) : (
          <span style={{ color: 'var(--text-secondary)' }}>Daily spending distribution</span>
        )}
        <span style={{ color: 'var(--text-muted)' }}>Day {daysInMonth}</span>
      </div>
    </div>
  );
};
