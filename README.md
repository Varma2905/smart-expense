# SmartExpense - Modern Full-Stack Financial Intelligence Platform

SmartExpense is a production-grade, SaaS-style Expense Tracker web application built with Node.js, Express.js, MongoDB, React, Vite, and Tailwind CSS. It features a dark navy glassmorphic dashboard, complete JWT authentication, detailed financial analytics, income/expense/recurring management, budgeting with real-time limit alerts, PDF/CSV report generation, user settings, and modular AI financial insights.

---

## 🌟 Features

- **🎨 Modern Dark Navy SaaS UI**: Glassmorphism cards, smooth animations, responsive layout with collapsible sidebar.
- **🔐 Secure Authentication**: JWT authentication with bcryptjs password hashing, session persistence, and password strength indicator.
- **📊 Comprehensive Financial Dashboard**: Real-time KPI summary cards (Balance, Income, Expenses, Savings with % changes vs prior month), interactive Recharts line/area spending trend chart, expense category donut breakdown, recent transactions feed, and budget overview.
- **💳 Complete Transaction Management**: Full CRUD operations for income and expenses, debounced search, filtering by type/category/payment method/date, column sorting, pagination, and CSV export.
- **🎯 Budget Management**: Category-level & overall monthly budget caps with live status badges (`Under Budget`, `Near Limit 80%`, `Over Budget`).
- **📈 Advanced Analytics**: Multi-chart analytics suite featuring Income vs Expense bar charts, daily spending line chart, top categories horizontal bar chart, and key metrics (Avg Daily Spend, Highest Spend Day, Top Expense Category, Total Transactions, Savings Rate).
- **🔁 Recurring Transactions**: Automated tracking for subscriptions, rent, salaries, and utility bills with frequency intervals and next due date tracking.
- **📄 Professional Reports & Exports**: Generate custom statements filtered by date, category, and type. Export formatted PDF documents or CSV files.
- **🤖 AI Financial Insights**: Modular AI advisor that interprets backend-calculated financial stats to provide actionable budget suggestions and spending breakdowns (supports Gemini API with intelligent built-in rule fallback).
- **⚙️ User Settings**: Customize user profile, select avatar, set default currency (`INR ₹`, `USD $`, `EUR €`, `GBP £`), switch themes, change password, and toggle notification preferences.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 + Vite (JavaScript / JSX)
- **Styling**: Tailwind CSS (Dark navy glassmorphism design system)
- **Routing**: React Router DOM v6
- **Charts**: Recharts
- **Icons**: Lucide React
- **HTTP Client**: Axios with Bearer token interceptor
- **State & Context**: React Context API (`AuthContext`, `ToastContext`, `ThemeContext`)
- **PDF Generation**: `jspdf` & `jspdf-autotable`

### Backend
- **Runtime**: Node.js & Express.js (ES Modules)
- **Database**: MongoDB & Mongoose ODM (with automatic fallback to `mongodb-memory-server` if local MongoDB is unavailable)
- **Authentication**: JSON Web Tokens (JWT) & `bcryptjs`
- **Validation**: Zod schema validation
- **Security & Performance**: `cors`, `express-rate-limit`, MongoDB indexes

---

## 📂 Project Structure

```
smart-expense/
├── frontend/
│   ├── public/
│   │   └── favicon.svg
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/       (StatCard, Modal, ConfirmDialog, EmptyState, LoadingSkeleton)
│   │   │   ├── layout/       (Layout, Sidebar, Navbar)
│   │   │   ├── dashboard/    (KPISection, SpendingChart, CategoryPieChart, RecentTransactions, BudgetOverviewCard)
│   │   │   ├── transactions/ (TransactionTable, TransactionFilters, TransactionModal)
│   │   │   ├── budgets/      (BudgetCard, BudgetModal)
│   │   │   ├── analytics/    (AnalyticsCharts, StatsGrid)
│   │   │   ├── recurring/    (RecurringTable, RecurringModal)
│   │   │   ├── reports/      (ReportGenerator)
│   │   │   └── ai/           (AIInsightCard)
│   │   ├── context/          (AuthContext, ToastContext, ThemeContext)
│   │   ├── pages/            (Dashboard, Transactions, Budgets, Analytics, Recurring, Reports, AIInsights, Settings, Login, Register, NotFound)
│   │   ├── services/         (api, authService, transactionService, budgetService, analyticsService, recurringService, reportService, aiService, settingsService)
│   │   ├── utils/            (formatters, validators, constants, exportUtils)
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── backend/
│   ├── src/
│   │   ├── config/           (db.js)
│   │   ├── controllers/      (authController, transactionController, dashboardController, budgetController, analyticsController, recurringController, reportController, aiController, settingsController)
│   │   ├── middleware/       (authMiddleware, validateMiddleware, errorMiddleware, rateLimiter)
│   │   ├── models/           (User, Transaction, Budget, RecurringTransaction)
│   │   ├── routes/           (authRoutes, transactionRoutes, dashboardRoutes, budgetRoutes, analyticsRoutes, recurringRoutes, reportRoutes, aiRoutes, settingsRoutes)
│   │   ├── services/         (financialCalculationService, aiInsightService)
│   │   ├── utils/            (jwtUtils, validators)
│   │   ├── scripts/          (seed.js)
│   │   └── server.js
│   ├── package.json
│   └── .env
├── README.md
└── .gitignore
```

---

## 🔑 Environment Variables

Create `.env` in `backend/`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/smartexpense
JWT_SECRET=smartexpense_super_secret_jwt_key_2026_production_quality
NODE_ENV=development
AI_API_KEY=
```

---

## 🚀 Quick Start & Installation

### 1. Clone & Prerequisites
Ensure Node.js (v18+) is installed on your system.

### 2. Backend Setup
```bash
cd smart-expense/backend
npm install
npm run seed  # Seed realistic demo data
npm run dev   # Start server on http://localhost:5000
```

### 3. Frontend Setup
In a new terminal:
```bash
cd smart-expense/frontend
npm install
npm run dev   # Starts Vite dev server on http://localhost:3000
```

---

## 📡 API Documentation Summary

### Auth
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Authenticate & obtain JWT
- `GET /api/auth/me` - Get current user profile

### Transactions
- `GET /api/transactions` - Paginated transactions list with search & filters
- `POST /api/transactions` - Create transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction

### Dashboard & Analytics
- `GET /api/dashboard/summary` - KPI balance, income, expenses & savings
- `GET /api/dashboard/trends?timeframe=30d` - Cashflow trends
- `GET /api/dashboard/categories` - Expense category breakdown
- `GET /api/analytics/overview` - Aggregated financial metrics

### Budgets & Recurring
- `GET /api/budgets` - Get monthly budget progress
- `POST /api/budgets` - Set category or overall limit
- `GET /api/recurring` - Get recurring transactions

### AI & Reports
- `POST /api/ai/insights` - Get AI financial insights
- `GET /api/reports/summary` - Get aggregated statement data

---

## 🛡️ Financial Calculation Rules

All financial calculations (Balance, Income, Expenses, Savings, Savings Rate, Category Aggregations, Budget Usage, and Statistical Averages) are executed **strictly on the Express/MongoDB backend**. The AI engine is provided only with pre-calculated statistics to ensure 100% mathematical accuracy.

---

## 📄 License
MIT License. Free for educational and commercial portfolio use.
# smart-expense
