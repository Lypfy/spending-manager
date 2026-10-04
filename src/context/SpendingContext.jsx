import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { DEFAULT_CATEGORIES } from '../constants/categories';
import { DEFAULT_WALLETS } from '../constants/wallets';
import { generateSampleData } from '../utils/mockData';
import { getMonthKey } from '../utils/formatters';

const SpendingContext = createContext(null);

const STORAGE_KEY = 'spendflow_data_v1';

export const SpendingProvider = ({ children }) => {
  // Initialize state from LocalStorage or default sample data
  const [data, setData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          transactions: parsed.transactions || [],
          categories: parsed.categories || DEFAULT_CATEGORIES,
          wallets: parsed.wallets || DEFAULT_WALLETS,
          budgets: parsed.budgets || [],
          goals: parsed.goals || [],
          currency: parsed.currency || 'USD',
          theme: parsed.theme || 'dark',
        };
      }
    } catch (e) {
      console.error('Failed to load from storage', e);
    }

    // Default with rich sample data so user immediately sees value
    const samples = generateSampleData();
    return {
      transactions: samples.transactions,
      categories: DEFAULT_CATEGORIES,
      wallets: DEFAULT_WALLETS,
      budgets: samples.budgets,
      goals: samples.goals,
      currency: 'USD',
      theme: 'dark',
    };
  });

  // Save to LocalStorage whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      document.documentElement.setAttribute('data-theme', data.theme);
    } catch (e) {
      console.error('Failed to save to storage', e);
    }
  }, [data]);

  // Transaction Actions
  const addTransaction = (transaction) => {
    const newTx = {
      ...transaction,
      id: transaction.id || `tx_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      amount: parseFloat(transaction.amount) || 0,
      date: transaction.date || new Date().toISOString().split('T')[0],
    };
    setData((prev) => ({
      ...prev,
      transactions: [newTx, ...prev.transactions],
    }));
  };

  const editTransaction = (id, updatedFields) => {
    setData((prev) => ({
      ...prev,
      transactions: prev.transactions.map((tx) =>
        tx.id === id ? { ...tx, ...updatedFields, amount: parseFloat(updatedFields.amount ?? tx.amount) || 0 } : tx
      ),
    }));
  };

  const deleteTransaction = (id) => {
    setData((prev) => ({
      ...prev,
      transactions: prev.transactions.filter((tx) => tx.id !== id),
    }));
  };

  // Category Actions
  const addCategory = (category) => {
    const newCat = {
      ...category,
      id: category.id || `cat_${Date.now()}`,
    };
    setData((prev) => ({
      ...prev,
      categories: [...prev.categories, newCat],
    }));
  };

  const deleteCategory = (id) => {
    setData((prev) => ({
      ...prev,
      categories: prev.categories.filter((c) => c.id !== id),
    }));
  };

  // Wallet Actions
  const addWallet = (wallet) => {
    const newWallet = {
      ...wallet,
      id: wallet.id || `w_${Date.now()}`,
      balance: parseFloat(wallet.balance) || 0,
    };
    setData((prev) => ({
      ...prev,
      wallets: [...prev.wallets, newWallet],
    }));
  };

  const editWallet = (id, updatedFields) => {
    setData((prev) => ({
      ...prev,
      wallets: prev.wallets.map((w) => (w.id === id ? { ...w, ...updatedFields } : w)),
    }));
  };

  const deleteWallet = (id) => {
    setData((prev) => ({
      ...prev,
      wallets: prev.wallets.filter((w) => w.id !== id),
    }));
  };

  // Budget Actions
  const setBudget = ({ categoryId, limit, month = getMonthKey() }) => {
    setData((prev) => {
      const existingIdx = prev.budgets.findIndex((b) => b.categoryId === categoryId && b.month === month);
      const newBudget = { categoryId, limit: parseFloat(limit) || 0, month };

      if (existingIdx >= 0) {
        const updated = [...prev.budgets];
        updated[existingIdx] = newBudget;
        return { ...prev, budgets: updated };
      }
      return { ...prev, budgets: [...prev.budgets, newBudget] };
    });
  };

  const deleteBudget = (categoryId, month = getMonthKey()) => {
    setData((prev) => ({
      ...prev,
      budgets: prev.budgets.filter((b) => !(b.categoryId === categoryId && b.month === month)),
    }));
  };

  // Goal Actions
  const addGoal = (goal) => {
    const newGoal = {
      ...goal,
      id: goal.id || `goal_${Date.now()}`,
      targetAmount: parseFloat(goal.targetAmount) || 0,
      currentAmount: parseFloat(goal.currentAmount) || 0,
    };
    setData((prev) => ({
      ...prev,
      goals: [...prev.goals, newGoal],
    }));
  };

  const editGoal = (id, updatedFields) => {
    setData((prev) => ({
      ...prev,
      goals: prev.goals.map((g) => (g.id === id ? { ...g, ...updatedFields } : g)),
    }));
  };

  const deleteGoal = (id) => {
    setData((prev) => ({
      ...prev,
      goals: prev.goals.filter((g) => g.id !== id),
    }));
  };

  const depositToGoal = (id, amount) => {
    const addAmt = parseFloat(amount) || 0;
    setData((prev) => ({
      ...prev,
      goals: prev.goals.map((g) =>
        g.id === id ? { ...g, currentAmount: Math.min(g.targetAmount, (g.currentAmount || 0) + addAmt) } : g
      ),
    }));
  };

  // Settings Actions
  const setCurrency = (curr) => {
    setData((prev) => ({ ...prev, currency: curr }));
  };

  const setTheme = (thm) => {
    setData((prev) => ({ ...prev, theme: thm }));
  };

  const resetToSampleData = () => {
    const samples = generateSampleData();
    setData({
      transactions: samples.transactions,
      categories: DEFAULT_CATEGORIES,
      wallets: DEFAULT_WALLETS,
      budgets: samples.budgets,
      goals: samples.goals,
      currency: data.currency,
      theme: data.theme,
    });
  };

  const clearAllData = () => {
    setData({
      transactions: [],
      categories: DEFAULT_CATEGORIES,
      wallets: DEFAULT_WALLETS,
      budgets: [],
      goals: [],
      currency: data.currency,
      theme: data.theme,
    });
  };

  const importData = (imported) => {
    setData((prev) => ({
      ...prev,
      ...imported,
      categories: imported.categories || prev.categories,
      wallets: imported.wallets || prev.wallets,
    }));
  };

  // Dynamic calculations & analytics for current month
  const currentMonth = getMonthKey();

  const metrics = useMemo(() => {
    let income = 0;
    let expense = 0;
    const categorySpend = {};

    data.transactions.forEach((tx) => {
      const txMonth = getMonthKey(tx.date);
      if (txMonth === currentMonth) {
        if (tx.type === 'income') {
          income += tx.amount;
        } else if (tx.type === 'expense') {
          expense += tx.amount;
          categorySpend[tx.categoryId] = (categorySpend[tx.categoryId] || 0) + tx.amount;
        }
      }
    });

    // Calculate real wallet balances
    const calculatedWallets = data.wallets.map((w) => {
      let balance = w.balance || 0;
      data.transactions.forEach((tx) => {
        if (tx.walletId === w.id) {
          if (tx.type === 'income') balance += tx.amount;
          else if (tx.type === 'expense') balance -= tx.amount;
          else if (tx.type === 'transfer') balance -= tx.amount;
        }
        if (tx.type === 'transfer' && tx.toWalletId === w.id) {
          balance += tx.amount;
        }
      });
      return { ...w, currentBalance: balance };
    });

    const netWorth = calculatedWallets.reduce((acc, w) => acc + (w.currentBalance || 0), 0);
    const netSavings = income - expense;
    const savingsRate = income > 0 ? Math.max(0, Math.round((netSavings / income) * 100)) : 0;

    return {
      currentMonthIncome: income,
      currentMonthExpense: expense,
      netWorth,
      netSavings,
      savingsRate,
      categorySpend,
      walletsWithBalance: calculatedWallets,
    };
  }, [data.transactions, data.wallets, currentMonth]);

  const value = {
    ...data,
    ...metrics,
    addTransaction,
    editTransaction,
    deleteTransaction,
    addCategory,
    deleteCategory,
    addWallet,
    editWallet,
    deleteWallet,
    setBudget,
    deleteBudget,
    addGoal,
    editGoal,
    deleteGoal,
    depositToGoal,
    setCurrency,
    setTheme,
    resetToSampleData,
    clearAllData,
    importData,
  };

  return <SpendingContext.Provider value={value}>{children}</SpendingContext.Provider>;
};

export const useSpending = () => {
  const context = useContext(SpendingContext);
  if (!context) {
    throw new Error('useSpending must be used within a SpendingProvider');
  }
  return context;
};
