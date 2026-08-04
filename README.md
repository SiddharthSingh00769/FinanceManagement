# 🌟 FinAura — AI-Powered Personal Finance & Wealth Management Platform

<div align="center">

**An intelligent full-stack personal finance platform powered by AI to help users manage accounts, track spending, automate recurring transactions, and receive personalized financial insights.**

**Built with:** Next.js 15 • React 19 • Tailwind CSS v4 • Prisma • PostgreSQL • Gemini AI • Clerk • Inngest • Arcjet

</div>

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
  - [🤖 AI Financial Assistant (Aura)](#-ai-financial-assistant-aura)
  - [🧾 Smart Receipt Scanner](#-smart-receipt-scanner)
  - [📊 Wealth & Multi-Account Dashboard](#-wealth--multi-account-dashboard)
  - [⏱️ Automated Recurring Transactions](#️-automated-recurring-transactions)
  - [⚡ Budget Alerts & AI Monthly Reports](#-budget-alerts--ai-monthly-reports)
  - [🔥 Gamified No-Spend Streak Tracker](#-gamified-no-spend-streak-tracker)
  - [📁 Data Export & Reports](#-data-export--reports)
  - [🔒 Security & Rate Limiting](#-security--rate-limiting)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Installation](#-installation)
- [Running the Application](#-running-the-application)
- [Background Services](#-background-services)
- [License](#-license)

---

# 🚀 Overview

**FinAura** is an AI-powered personal finance and wealth management platform that helps users take complete control of their finances.

Built using **Next.js 15**, **Google Gemini 2.5 Flash**, **Prisma**, **PostgreSQL**, **Clerk**, **Inngest**, **Arcjet**, and **Resend**, FinAura combines intelligent budgeting, AI-powered financial assistance, receipt OCR, recurring payment automation, and insightful analytics into a seamless modern experience.

Whether you're tracking daily expenses, managing multiple accounts, scanning receipts, or asking AI for personalized financial advice, FinAura makes personal finance simple and intelligent.

---

# ✨ Key Features

## 🤖 AI Financial Assistant (Aura)

Your personal AI-powered finance advisor.

### Features

- 💬 Voice & Text conversations
- 🧠 Context-aware financial insights
- 📈 Budget and spending recommendations
- 💰 Balance-aware suggestions
- 📝 Reviews last 30 days of transactions
- ⚡ Smart Tool Calling (`add_transaction`)
- ✅ Confirmation before modifying financial data

---

## 🧾 Smart Receipt Scanner

Upload receipts and let AI do the work.

### Features

- 📸 AI-powered OCR using Gemini Vision
- 🏪 Merchant name extraction
- 💵 Total amount detection
- 📅 Purchase date recognition
- 📝 Description generation
- 🏷️ Smart category suggestion
- ⚡ Automatically pre-fills transaction forms

---

## 📊 Wealth & Multi-Account Dashboard

Manage all your finances from one place.

### Features

- 🏦 Multiple account support
- ⭐ Default account selection
- 📈 Income vs Expense analytics
- 🥧 Category-wise expense charts
- 💹 Interactive Recharts visualizations
- 💰 Real-time balance updates
- 📊 Wealth overview dashboard

---

## ⏱️ Automated Recurring Transactions

Never manually enter recurring expenses again.

### Features

- 🔄 Daily
- 📅 Weekly
- 🗓️ Monthly
- 📆 Yearly recurring transactions

Powered by **Inngest CRON Jobs**, FinAura automatically:

- Creates recurring transactions
- Updates account balances
- Calculates next recurring date
- Runs entirely in the background

---

## ⚡ Budget Alerts & AI Monthly Reports

Stay informed about your financial health.

### Budget Monitoring

- Runs every **6 hours**
- Detects overspending
- Configurable spending thresholds
- Email alerts at 80% (or custom) budget usage

### AI Monthly Digest

Automatically generates:

- Monthly financial summaries
- Spending insights
- Saving recommendations
- Personalized AI-generated advice

Delivered as beautifully designed HTML emails using **React Email** + **Resend**.

---

## 🔥 Gamified No-Spend Streak Tracker

Build healthier spending habits.

### Features

- 📆 Tracks consecutive no-spend days
- 🎯 Encourages disciplined spending
- 📊 Current streak
- 🏆 Longest streak (last 90 days)

### Smart Expense Filtering

Essential expenses **do not** break your streak:

- Housing
- Groceries
- Healthcare
- Utilities
- Insurance
- Bills
- Education
- Transportation

---

## 📁 Data Export & Reports

Export your financial records anytime.

### CSV Export

Includes:

- Transactions
- Summary totals
- Income
- Expenses
- Net balance
- Metadata

### Printable Reports

- Print-friendly transaction statements
- PDF-ready layouts
- Clean formatting for sharing or archiving

---

## 🔒 Security & Rate Limiting

Built with security as a priority.

### Authentication

- Clerk Authentication
- Protected Routes
- Middleware Security
- Secure Server Actions

### Abuse Protection

Powered by Arcjet:

- Rate limiting
- Bot detection
- API protection
- Server Action protection

---

# 🛠 Tech Stack

| Category | Technology |
|-----------|------------|
| Framework | Next.js 15 (App Router, Server Actions, Turbopack) |
| Frontend | React 19 |
| Styling | Tailwind CSS v4 |
| UI Components | Shadcn UI |
| Animations | Framer Motion |
| Forms | React Hook Form + Zod |
| Database | PostgreSQL |
| ORM | Prisma ORM 6 |
| Authentication | Clerk |
| AI | Google Gemini 2.5 Flash |
| Background Jobs | Inngest |
| Emails | Resend + React Email |
| Charts | Recharts |
| Notifications | Sonner |
| Security | Arcjet |

---

# 🏗 Architecture

```text
                        User
                          │
                          ▼
                 Next.js 15 App Router
                          │
      ┌───────────────────┼───────────────────┐
      │                   │                   │
      ▼                   ▼                   ▼
  Clerk Auth         Server Actions       API Routes
      │                   │                   │
      └───────────────┬───┴───────────────────┘
                      ▼
                Prisma ORM
                      │
                      ▼
                PostgreSQL Database

         ┌────────────┼─────────────┐
         ▼            ▼             ▼
     Gemini AI     Inngest       Arcjet
         │       Background Jobs   │
         ▼            │             ▼
   AI Assistant    Recurring Jobs  Rate Limiting
   Receipt OCR     Budget Alerts   Bot Protection
                   Monthly Reports

                      ▼
                   Resend
               Transactional Emails
```

---

# 📂 Project Structure

```bash
finaura/
├── actions/
│   ├── accounts.js
│   ├── ai-chat.js
│   ├── budget.js
│   ├── dashboard.js
│   ├── seed.js
│   ├── send-email.js
│   ├── streak.js
│   └── transaction.js
│
├── app/
│   ├── (auth)/
│   ├── (main)/
│   │   ├── account/
│   │   ├── dashboard/
│   │   └── transaction/
│   ├── api/
│   │   └── inngest/
│   ├── globals.css
│   ├── layout.js
│   └── page.jsx
│
├── components/
│   ├── ai-chat-widget.jsx
│   ├── create-account-drawer.jsx
│   ├── header.jsx
│   ├── hero.jsx
│   └── ui/
│
├── emails/
│   └── template.jsx
│
├── lib/
│   ├── arcjet.js
│   ├── checkUser.js
│   ├── currency.js
│   ├── export.js
│   ├── inngest/
│   └── prisma.js
│
├── prisma/
│   └── schema.prisma
│
├── middleware.js
├── package.json
└── README.md
```

---

# 🚀 Getting Started

## Prerequisites

Make sure you have installed:

- Node.js **v18+**
- npm / yarn / pnpm
- PostgreSQL Database

Examples:

- Neon
- Supabase
- Railway
- Local PostgreSQL

---

# 🔑 Environment Variables

Create a `.env` file in the project root.

```env
# ===============================
# Database
# ===============================

DATABASE_URL="postgresql://user:password@localhost:5432/finaura?schema=public"
DIRECT_URL="postgresql://user:password@localhost:5432/finaura?schema=public"

# ===============================
# Clerk Authentication
# ===============================

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# ===============================
# Google Gemini
# ===============================

GEMINI_API_KEY=AIzaSy...

# ===============================
# Inngest
# ===============================

INNGEST_EVENT_KEY=...
INNGEST_SIGNING_KEY=...

# ===============================
# Resend
# ===============================

RESEND_API_KEY=re_...

# ===============================
# Arcjet
# ===============================

ARCJET_KEY=ajkey_...
```

---

# ⚙ Installation

### Clone the Repository

```bash
git clone https://github.com/SiddharthSingh00769/FinanceManagement.git

cd FinanceManagement
```

### Install Dependencies

```bash
npm install
```

### Generate Prisma Client

```bash
npx prisma generate
```

### Run Database Migrations

```bash
npx prisma migrate dev --name init
```

---

# ▶ Running the Application

Start the development server.

```bash
npm run dev
```

Open your browser and visit:

```
http://localhost:3000
```

---

# ⚡ Background Services

## Inngest Dev Server

Run local background jobs.

```bash
npx inngest-cli@latest dev
```

Dashboard:

```
http://localhost:8288
```

Used for:

- Recurring Transactions
- Budget Alerts
- Monthly AI Reports

---

## React Email Preview

Preview email templates locally.

```bash
npm run email
```

Open:

```
http://localhost:3000
```

(or the port shown by React Email)

---

# 📌 Future Improvements

- 📱 Mobile App
- 🌍 Multi-Currency Support
- 📈 Investment Portfolio Tracking
- 🏦 Bank Account Aggregation
- 💳 UPI & Card Integration
- 🔔 Push Notifications
- 🤝 Shared Family Accounts
- 📊 AI Spending Forecasts
- 📥 Import Bank Statements

---

# 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create your feature branch

```bash
git checkout -b feature/amazing-feature
```

3. Commit your changes

```bash
git commit -m "Add amazing feature"
```

4. Push to the branch

```bash
git push origin feature/amazing-feature
```

5. Open a Pull Request

---

# 📄 License

This project is licensed under the **MIT License**.

Feel free to use, modify, and distribute this project.

---

<div align="center">

### ⭐ If you found this project useful, consider giving it a star!

Made with ❤️ using **Next.js**, **Gemini AI**, **Prisma**, **Clerk**, **Inngest**, and **Arcjet**.

</div>
