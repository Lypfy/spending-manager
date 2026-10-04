import React, { useState, useEffect } from 'react';
import { useSpending } from '../context/SpendingContext';
import { X, Trophy, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export const GoalModal = ({ isOpen, onClose, initialGoal = null, isDepositMode = false }) => {
  const { addGoal, editGoal, deleteGoal, depositToGoal } = useSpending();

  const [title, setTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [color, setColor] = useState('#6366f1');
  const [depositAmount, setDepositAmount] = useState('');

  const COLOR_OPTIONS = ['#6366f1', '#10b981', '#ec4899', '#f59e0b', '#06b6d4', '#8b5cf6', '#ef4444'];

  useEffect(() => {
    if (initialGoal) {
      setTitle(initialGoal.title || '');
      setTargetAmount(initialGoal.targetAmount || '');
      setCurrentAmount(initialGoal.currentAmount || 0);
      setTargetDate(initialGoal.targetDate || '');
      setColor(initialGoal.color || '#6366f1');
    } else {
      setTitle('');
      setTargetAmount('');
      setCurrentAmount(0);
      setTargetDate('');
      setColor('#6366f1');
    }
    setDepositAmount('');
  }, [initialGoal, isOpen, isDepositMode]);

  if (!isOpen) return null;

  const handleDepositSubmit = (e) => {
    e.preventDefault();
    const amt = parseFloat(depositAmount);
    if (!amt || amt <= 0) {
      alert('Please enter a valid deposit amount.');
      return;
    }

    depositToGoal(initialGoal.id, amt);

    if ((initialGoal.currentAmount || 0) + amt >= initialGoal.targetAmount) {
      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (err) {
        console.log('Confetti triggered');
      }
    }

    onClose();
  };

  const handleGoalSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Please enter a goal title.');
      return;
    }
    if (!targetAmount || parseFloat(targetAmount) <= 0) {
      alert('Please enter a valid target amount.');
      return;
    }

    const payload = {
      title,
      targetAmount: parseFloat(targetAmount),
      currentAmount: parseFloat(currentAmount) || 0,
      targetDate,
      color,
    };

    if (initialGoal && initialGoal.id) {
      editGoal(initialGoal.id, payload);
    } else {
      addGoal(payload);
    }

    onClose();
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to remove this savings goal?')) {
      deleteGoal(initialGoal.id);
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Trophy size={20} color="var(--primary)" />
            <h3 className="modal-title">
              {isDepositMode ? `Add Savings to "${initialGoal?.title}"` : initialGoal ? 'Edit Savings Goal' : 'Create Savings Goal'}
            </h3>
          </div>
          <button className="icon-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {isDepositMode ? (
          <form onSubmit={handleDepositSubmit}>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Deposit Amount</label>
                <input
                  type="number"
                  step="any"
                  min="0.01"
                  placeholder="e.g. 100"
                  className="form-input"
                  style={{ fontSize: '1.3rem', fontWeight: 800 }}
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  autoFocus
                  required
                />
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                <Sparkles size={16} /> Confirm Deposit
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleGoalSubmit}>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Goal Title</label>
                <input
                  type="text"
                  placeholder="e.g. Emergency Fund, New Laptop, Holiday Trip"
                  className="form-input"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="form-group">
                  <label className="form-label">Target Amount</label>
                  <input
                    type="number"
                    step="any"
                    min="1"
                    placeholder="0.00"
                    className="form-input"
                    value={targetAmount}
                    onChange={(e) => setTargetAmount(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Current Saved</label>
                  <input
                    type="number"
                    step="any"
                    min="0"
                    placeholder="0.00"
                    className="form-input"
                    value={currentAmount}
                    onChange={(e) => setCurrentAmount(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Target Date (Optional)</label>
                <input type="date" className="form-input" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Color Theme</label>
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
              {initialGoal && (
                <button type="button" className="btn-danger" onClick={handleDelete} style={{ marginRight: 'auto' }}>
                  Delete
                </button>
              )}
              <button type="button" className="btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                Save Goal
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
