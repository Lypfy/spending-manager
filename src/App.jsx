import React, { useState } from 'react';
import { SpendingProvider } from './context/SpendingContext';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { TransactionsView } from './components/TransactionsView';
import { AnalyticsView } from './components/AnalyticsView';
import { BudgetsView } from './components/BudgetsView';
import { GoalsView } from './components/GoalsView';
import { WalletsView } from './components/WalletsView';
import { TransactionModal } from './components/TransactionModal';

function MainApp() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  const handleOpenAddTransaction = () => {
    setEditingTransaction(null);
    setIsTransactionModalOpen(true);
  };

  const handleEditTransaction = (tx) => {
    setEditingTransaction(tx);
    setIsTransactionModalOpen(true);
  };

  const handleOpenTransfer = () => {
    setEditingTransaction({ type: 'transfer' });
    setIsTransactionModalOpen(true);
  };

  return (
    <div className="app-container">
      {/* Ambient background glows */}
      <div className="ambient-glow glow-top-left" />
      <div className="ambient-glow glow-bottom-right" />

      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAddTransaction={handleOpenAddTransaction}
      />

      {/* Main Content Area */}
      <main className="main-content">
        {activeTab === 'dashboard' && (
          <Dashboard
            onOpenAddTransaction={handleOpenAddTransaction}
            onEditTransaction={handleEditTransaction}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'transactions' && (
          <TransactionsView
            onOpenAddTransaction={handleOpenAddTransaction}
            onEditTransaction={handleEditTransaction}
          />
        )}

        {activeTab === 'analytics' && <AnalyticsView />}

        {activeTab === 'budgets' && <BudgetsView />}

        {activeTab === 'goals' && <GoalsView />}

        {activeTab === 'wallets' && <WalletsView onOpenTransfer={handleOpenTransfer} />}
      </main>

      {/* Transaction Modal (Add / Edit / Transfer) */}
      <TransactionModal
        isOpen={isTransactionModalOpen}
        onClose={() => {
          setIsTransactionModalOpen(false);
          setEditingTransaction(null);
        }}
        initialTransaction={editingTransaction}
      />
    </div>
  );
}

export default function App() {
  return (
    <SpendingProvider>
      <MainApp />
    </SpendingProvider>
  );
}
