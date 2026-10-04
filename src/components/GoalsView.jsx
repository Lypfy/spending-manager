import React, { useState } from 'react';
import { useSpending } from '../context/SpendingContext';
import { formatCurrency, formatDate } from '../utils/formatters';
import { GoalModal } from './GoalModal';
import { Trophy, Plus, Sparkles, CheckCircle, Edit2, Calendar } from 'lucide-react';

export const GoalsView = () => {
  const { goals, currency } = useSpending();
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [isDepositMode, setIsDepositMode] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const totalTarget = goals.reduce((acc, g) => acc + g.targetAmount, 0);
  const totalSaved = goals.reduce((acc, g) => acc + (g.currentAmount || 0), 0);
  const overallPct = totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Savings Goals & Dreams</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Allocate funds toward milestones and track progress over time
          </p>
        </div>
        <button
          className="btn-primary"
          onClick={() => {
            setSelectedGoal(null);
            setIsDepositMode(false);
            setIsModalOpen(true);
          }}
        >
          <Plus size={16} /> Create New Goal
        </button>
      </div>

      {/* Progress Summary Banner */}
      <div
        className="glass-card"
        style={{
          padding: '1.5rem',
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Total Milestone Progress</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0.25rem' }}>
              {formatCurrency(totalSaved, currency)} <span style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>/ {formatCurrency(totalTarget, currency)}</span>
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)' }}>
            {overallPct}%
          </div>
        </div>

        {/* Big Progress bar */}
        <div style={{ height: '10px', width: '100%', background: 'var(--bg-tertiary)', borderRadius: '5px', overflow: 'hidden' }}>
          <div
            style={{
              height: '100%',
              width: `${Math.min(overallPct, 100)}%`,
              background: 'var(--primary-gradient)',
              borderRadius: '5px',
              transition: 'width 0.5s ease',
            }}
          />
        </div>
      </div>

      {/* Goals Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
        {goals.map((goal) => {
          const current = goal.currentAmount || 0;
          const pct = Math.min(Math.round((current / goal.targetAmount) * 100), 100);
          const isCompleted = current >= goal.targetAmount;

          return (
            <div
              key={goal.id}
              className="glass-card"
              style={{
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.25rem',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <div
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: 'var(--radius-sm)',
                      background: `${goal.color || '#6366f1'}25`,
                      color: goal.color || '#6366f1',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Trophy size={18} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>{goal.title}</h4>
                    {goal.targetDate && (
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Calendar size={12} /> Target: {formatDate(goal.targetDate)}
                      </div>
                    )}
                  </div>
                </div>

                <button
                  className="icon-btn"
                  onClick={() => {
                    setSelectedGoal(goal);
                    setIsDepositMode(false);
                    setIsModalOpen(true);
                  }}
                  title="Edit Goal"
                  style={{ width: '32px', height: '32px' }}
                >
                  <Edit2 size={14} />
                </button>
              </div>

              {/* Progress info */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.4rem' }}>
                  <span style={{ fontSize: '1.25rem', fontWeight: 800 }}>{formatCurrency(current, currency)}</span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    of {formatCurrency(goal.targetAmount, currency)} ({pct}%)
                  </span>
                </div>
                <div style={{ height: '8px', width: '100%', background: 'var(--bg-tertiary)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${pct}%`,
                      background: isCompleted ? '#10b981' : goal.color || 'var(--primary)',
                      borderRadius: '4px',
                      transition: 'width 0.4s ease',
                    }}
                  />
                </div>
              </div>

              {/* Actions Footer */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.5rem', borderTop: '1px solid var(--border-subtle)' }}>
                {isCompleted ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--success)', fontWeight: 700, fontSize: '0.85rem' }}>
                    <CheckCircle size={16} /> Goal Reached!
                  </div>
                ) : (
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    {formatCurrency(goal.targetAmount - current, currency)} left to save
                  </span>
                )}

                <button
                  className="btn-secondary"
                  onClick={() => {
                    setSelectedGoal(goal);
                    setIsDepositMode(true);
                    setIsModalOpen(true);
                  }}
                  style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
                >
                  <Sparkles size={14} color="var(--primary)" /> + Deposit
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <GoalModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedGoal(null);
        }}
        initialGoal={selectedGoal}
        isDepositMode={isDepositMode}
      />
    </div>
  );
};
