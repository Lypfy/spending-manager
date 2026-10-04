export const exportToCSV = (transactions, categories, wallets, filename = 'spendflow_transactions.csv') => {
  if (!transactions || transactions.length === 0) {
    alert('No transactions to export.');
    return;
  }

  const getCategoryName = (id) => categories.find((c) => c.id === id)?.name || id;
  const getWalletName = (id) => wallets.find((w) => w.id === id)?.name || id;

  const headers = ['ID', 'Date', 'Type', 'Category', 'Amount', 'Wallet', 'To Wallet', 'Note'];
  
  const rows = transactions.map((t) => [
    t.id,
    t.date,
    t.type,
    `"${getCategoryName(t.categoryId).replace(/"/g, '""')}"`,
    t.amount,
    `"${getWalletName(t.walletId).replace(/"/g, '""')}"`,
    t.toWalletId ? `"${getWalletName(t.toWalletId).replace(/"/g, '""')}"` : '',
    `"${(t.note || '').replace(/"/g, '""')}"`,
  ]);

  const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToJSON = (data, filename = 'spendflow_backup.json') => {
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const importFromJSON = (file, onSuccess, onError) => {
  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const parsed = JSON.parse(event.target.result);
      if (!parsed.transactions || !Array.isArray(parsed.transactions)) {
        throw new Error('Invalid SpendFlow backup format.');
      }
      onSuccess(parsed);
    } catch (err) {
      if (onError) onError(err);
    }
  };
  reader.onerror = (err) => {
    if (onError) onError(err);
  };
  reader.readAsText(file);
};
