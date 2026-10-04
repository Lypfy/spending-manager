export const generateSampleData = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0-indexed

  const makeDateStr = (dayOffset = 0, m = month, y = year) => {
    const d = new Date(y, m, dayOffset);
    return d.toISOString().split('T')[0];
  };

  const sampleTransactions = [
    // Current Month Transactions
    {
      id: 'tx_1',
      type: 'income',
      amount: 4500,
      categoryId: 'salary',
      walletId: 'w_bank',
      date: makeDateStr(1),
      note: 'Monthly Senior Engineer Salary',
    },
    {
      id: 'tx_2',
      type: 'income',
      amount: 850,
      categoryId: 'freelance',
      walletId: 'w_bank',
      date: makeDateStr(3),
      note: 'Frontend Dashboard UI Client Project',
    },
    {
      id: 'tx_3',
      type: 'expense',
      amount: 1200,
      categoryId: 'housing',
      walletId: 'w_bank',
      date: makeDateStr(2),
      note: 'Apartment Monthly Rent & Maintenance',
    },
    {
      id: 'tx_4',
      type: 'expense',
      amount: 145.5,
      categoryId: 'groceries',
      walletId: 'w_credit',
      date: makeDateStr(4),
      note: 'Whole Foods organic weekly supplies',
    },
    {
      id: 'tx_5',
      type: 'expense',
      amount: 42.8,
      categoryId: 'food',
      walletId: 'w_credit',
      date: makeDateStr(4),
      note: 'Sushi dinner with colleagues',
    },
    {
      id: 'tx_6',
      type: 'expense',
      amount: 35.0,
      categoryId: 'transport',
      walletId: 'w_cash',
      date: makeDateStr(5),
      note: 'Metro card refill & Taxi ride',
    },
    {
      id: 'tx_7',
      type: 'expense',
      amount: 89.99,
      categoryId: 'utilities',
      walletId: 'w_bank',
      date: makeDateStr(3),
      note: 'High-speed Fiber Internet & Electricity',
    },
    {
      id: 'tx_8',
      type: 'expense',
      amount: 65.0,
      categoryId: 'health',
      walletId: 'w_bank',
      date: makeDateStr(2),
      note: 'Gym monthly membership',
    },
    {
      id: 'tx_9',
      type: 'expense',
      amount: 120.0,
      categoryId: 'shopping',
      walletId: 'w_credit',
      date: makeDateStr(5),
      note: 'Mechanical keyboard & ergonomic mouse',
    },
    {
      id: 'tx_10',
      type: 'expense',
      amount: 28.5,
      categoryId: 'entertainment',
      walletId: 'w_credit',
      date: makeDateStr(1),
      note: 'Cinema tickets & popcorn',
    },
    {
      id: 'tx_11',
      type: 'transfer',
      amount: 600,
      walletId: 'w_bank',
      toWalletId: 'w_savings',
      date: makeDateStr(2),
      note: 'Monthly savings auto-deposit',
    },

    // Past Month Transactions (for trend/history)
    {
      id: 'tx_p1',
      type: 'income',
      amount: 4500,
      categoryId: 'salary',
      walletId: 'w_bank',
      date: makeDateStr(1, month - 1),
      note: 'Previous Month Salary',
    },
    {
      id: 'tx_p2',
      type: 'income',
      amount: 500,
      categoryId: 'freelance',
      walletId: 'w_bank',
      date: makeDateStr(15, month - 1),
      note: 'Consulting gig',
    },
    {
      id: 'tx_p3',
      type: 'expense',
      amount: 1200,
      categoryId: 'housing',
      walletId: 'w_bank',
      date: makeDateStr(2, month - 1),
      note: 'Rent',
    },
    {
      id: 'tx_p4',
      type: 'expense',
      amount: 450,
      categoryId: 'groceries',
      walletId: 'w_credit',
      date: makeDateStr(12, month - 1),
      note: 'Supermarket groceries',
    },
    {
      id: 'tx_p5',
      type: 'expense',
      amount: 230,
      categoryId: 'food',
      walletId: 'w_credit',
      date: makeDateStr(18, month - 1),
      note: 'Restaurants and delivery',
    },
    {
      id: 'tx_p6',
      type: 'expense',
      amount: 140,
      categoryId: 'transport',
      walletId: 'w_bank',
      date: makeDateStr(20, month - 1),
      note: 'Gas & parking',
    },
  ];

  const sampleBudgets = [
    { categoryId: 'food', limit: 400, month: `${year}-${String(month + 1).padStart(2, '0')}` },
    { categoryId: 'groceries', limit: 500, month: `${year}-${String(month + 1).padStart(2, '0')}` },
    { categoryId: 'housing', limit: 1300, month: `${year}-${String(month + 1).padStart(2, '0')}` },
    { categoryId: 'transport', limit: 150, month: `${year}-${String(month + 1).padStart(2, '0')}` },
    { categoryId: 'shopping', limit: 300, month: `${year}-${String(month + 1).padStart(2, '0')}` },
    { categoryId: 'entertainment', limit: 150, month: `${year}-${String(month + 1).padStart(2, '0')}` },
  ];

  const sampleGoals = [
    {
      id: 'g_1',
      title: 'Emergency Rainy Day Fund',
      targetAmount: 15000,
      currentAmount: 11200,
      targetDate: `${year + 1}-06-30`,
      color: '#10b981',
      category: 'Security',
    },
    {
      id: 'g_2',
      title: 'New M4 Max MacBook Pro',
      targetAmount: 3200,
      currentAmount: 2400,
      targetDate: `${year}-12-25`,
      color: '#6366f1',
      category: 'Work Tech',
    },
    {
      id: 'g_3',
      title: 'Tokyo Spring Vacation',
      targetAmount: 4000,
      currentAmount: 1800,
      targetDate: `${year + 1}-04-10`,
      color: '#ec4899',
      category: 'Travel',
    },
  ];

  return {
    transactions: sampleTransactions,
    budgets: sampleBudgets,
    goals: sampleGoals,
  };
};
