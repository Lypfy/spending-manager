# SpendFlow — Smart Personal Finance & Spending Manager

SpendFlow is a modern, responsive, and local-first personal financial management application designed with a sleek glassmorphic UI, rich interactive charts, multi-account tracking, category budgeting, savings milestone goals, and automated data backups.

---

## 🌟 Key Features

### 1. 📊 Financial Dashboard
- **Real-time Overview**: Total Net Worth, Monthly Income, Monthly Expenses, and Savings Rate.
- **Visual Insights**: Expense category breakdown donut chart and 6-month cashflow velocity bar chart.
- **Recent Activity**: Quick access to recent transactions with one-click inline editing.

### 2. 💸 Multi-Account / Wallet Management
- Support for multiple accounts: **Bank Accounts**, **Cash Wallets**, **Credit Cards**, and **Savings Vaults**.
- **Internal Transfers**: Transfer funds between accounts with automatic transaction logging.

### 3. 🎯 Budgets & Daily Spend Velocity
- Monthly spending targets per category.
- Visual warning indicators (Green `<80%`, Amber `80–99%`, Red `>100%`).
- **Safe Daily Spend Guide**: Real-time calculation of remaining daily budget for the rest of the month.

### 4. 🏆 Savings Goals & Milestones
- Set financial milestones (e.g. *Emergency Fund*, *New Laptop*, *Vacation*).
- Interactive progress dials and deposit modal with celebratory confetti animations upon completion.

### 5. 📈 Deep Financial Analytics
- **Donut Chart**: Interactive SVG category distribution with slice hovering and legend.
- **Cashflow Bar Chart**: Income vs. Expense monthly trajectories.
- **Trend Curve**: Smooth SVG bezier daily spending curves highlighting expense spikes.
- **Key Metrics**: Highest spend category, average daily spend velocity, and expense-to-income ratio.

### 6. 🔍 Transactions & Advanced Filters
- Search by note, category name, or amount.
- Multi-filter by Transaction Type (Income, Expense, Transfer), Category, Account, and Date Period (This Month, Last Month, This Year, All Time).
- Sort by Date or Amount.

### 7. 💾 Local-First Persistence & Portability
- **Auto-Sync**: Automatically persists state to browser `LocalStorage`.
- **Export to CSV**: Export transaction logs for Excel or Google Sheets.
- **Backup & Restore**: Export and import full app state in JSON format.
- **Multi-Currency Support**: Switch dynamically between USD (`$`), EUR (`€`), GBP (`£`), VND (`₫`), JPY (`¥`), CAD (`CA$`), AUD (`A$`), INR (`₹`), and SGD (`S$`).
- **Dark / Light Mode**: Sleek dark mode by default with one-click theme switcher.
- **Demo Data Generator**: Instant 1-click sample data reset for quick exploration.

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18+ or 20+ recommended)
- `npm`

### Installation & Run

1. Clone or open the project folder:
   ```bash
   cd spending-manager
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Launch the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```
   http://127.0.0.1:5173/
   ```

---

## 📂 Project Architecture

```
spending-manager/
├── index.html                 # App shell with Plus Jakarta Sans & metadata
├── src/
│   ├── constants/
│   │   ├── categories.js      # Default income & expense categories
│   │   ├── currencies.js      # Supported currency definitions & locales
│   │   └── wallets.js         # Default accounts configuration
│   ├── context/
│   │   └── SpendingContext.jsx # Central state management & localStorage sync
│   ├── components/
│   │   ├── Navbar.jsx         # Navigation tabs, theme toggle & data menu
│   │   ├── Dashboard.jsx      # Overview stat cards & mini charts
│   │   ├── TransactionsView.jsx # Search, filter & transactions table
│   │   ├── AnalyticsView.jsx  # Category donut, trajectory & trend charts
│   │   ├── BudgetsView.jsx    # Monthly category limits & safe daily spend
│   │   ├── GoalsView.jsx      # Savings milestones & deposit modal
│   │   ├── WalletsView.jsx    # Accounts overview & custom category manager
│   │   ├── TransactionModal.jsx # Modal for adding/editing income, expense & transfer
│   │   ├── BudgetModal.jsx    # Modal for category budget limits
│   │   ├── GoalModal.jsx      # Modal for savings goals & deposits
│   │   ├── WalletModal.jsx    # Modal for creating/editing accounts
│   │   ├── CategoryModal.jsx  # Modal for custom categories & icon selection
│   │   ├── DynamicIcon.jsx    # Lucide icon helper
│   │   └── Charts/
│   │       ├── DonutChart.jsx
│   │       ├── CashflowBarChart.jsx
│   │       └── TrendLineChart.jsx
│   ├── utils/
│   │   ├── formatters.js      # Currency & date formatters
│   │   ├── exportImport.js    # CSV & JSON export/import handlers
│   │   └── mockData.js        # Sample data generator
│   ├── App.jsx                # Application root assembly
│   ├── index.css              # Glassmorphic design system & CSS variables
│   └── main.jsx               # React entrypoint
└── package.json
```
