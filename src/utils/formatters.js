import { CURRENCIES } from '../constants/currencies';

export const formatCurrency = (amount, currencyCode = 'USD') => {
  const num = typeof amount === 'number' ? amount : parseFloat(amount) || 0;
  const currObj = CURRENCIES.find((c) => c.code === currencyCode) || CURRENCIES[0];

  try {
    return new Intl.NumberFormat(currObj.locale, {
      style: 'currency',
      currency: currObj.code,
      maximumFractionDigits: currObj.code === 'VND' || currObj.code === 'JPY' ? 0 : 2,
      minimumFractionDigits: currObj.code === 'VND' || currObj.code === 'JPY' ? 0 : 2,
    }).format(num);
  } catch {
    return `${currObj.symbol}${num.toLocaleString()}`;
  }
};

export const formatDate = (dateString, formatType = 'medium') => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;

  if (formatType === 'short') {
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date);
  }
  if (formatType === 'monthYear') {
    return new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' }).format(date);
  }
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
};

export const getMonthKey = (date = new Date()) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
};
