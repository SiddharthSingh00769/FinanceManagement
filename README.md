<div align="center">

# ✨ FinAura — Personal Finance Management

[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com)
[![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=prisma&logoColor=white)](https://prisma.io)
[![Clerk](https://img.shields.io/badge/Clerk-6C47FF?style=for-the-badge&logo=clerk&logoColor=white)](https://clerk.com)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org)
[![Tailwind](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Inngest](https://img.shields.io/badge/Inngest-161616?style=for-the-badge)](https://www.inngest.com)
[![Resend](https://img.shields.io/badge/Resend-000?style=for-the-badge)](https://resend.com)

_A modern full‑stack app that makes personal finance fast, secure, and delightful._

</div>

<p align="center">
  <img width="900" alt="FinAura screenshot" src="https://github.com/user-attachments/assets/2046cc4c-81ea-4473-8fe2-0d8c408bd8c0">
</p>

## 🚀 Introduction

FinAura helps you track accounts, budgets, and transactions with zero‑trust data access and optional AI‑powered receipt scanning. It’s built with the **App Router** (Next.js 14), **Clerk** for auth, **Postgres** via **Prisma**, and production niceties like **Inngest** background jobs and **Resend** emails.

## ✨ Key Features

- **Comprehensive Dashboard** – Quick glances at balances, budgets, and spend.
- **Accounts & Budgets** – Create multiple accounts and monthly/categorical budgets.
- **Transactions** – Log merchant, category, amount, and date.
- **🤖 AI Receipt Scanner** – Upload an image; Vision OCR (or fallback) extracts key fields.
- **Asynchronous Email Alerts** – Welcome emails via Inngest + Resend.
- **Secure Authentication** – Clerk-powered sessions & MFA.
- **Responsive UI** – Tailwind + modern cards & components.

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Auth**: Clerk
- **Database**: Postgres / Supabase
- **ORM**: Prisma
- **Jobs**: Inngest
- **Email**: React Email & Resend
- **AI / OCR**: Google Cloud Vision (stub included)
- **Storage**: Vercel Blob (stub included)

## 🔐 Security Model

- **Authentication (Clerk)**: Manages identity, sessions, and MFA.
- **Authorization (RLS)**: If deploying on Supabase, enable **Row Level Security** (see `supabase/policies.sql`) so every query is authorized at the DB layer via your JWT claims.
- **Handshake**: Clerk issues a JWT; Supabase verifies and enforces RLS using the embedded `sub` (user id).

> ℹ️ This starter ships with a Prisma schema and a separate `supabase/policies.sql` guide you can adapt if you host on Supabase.

## 🧪 Getting Started

### 1) Prerequisites

- Node.js 18+
- Postgres (local or Supabase)
- Clerk account (publishable + secret keys)
- Resend (optional but recommended for emails)

### 2) Clone & Install

```bash
git clone https://github.com/your-username/finaura.git
cd finaura
npm install
```

### 3) Configure Environment

Copy `.env.example` → `.env.local` and fill values:

```bash
cp .env.example .env.local
```

- `DATABASE_URL` – local Postgres or Supabase pooled URL
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` / `CLERK_SECRET_KEY`
- `RESEND_API_KEY` / `EMAIL_FROM`
- (Optional) `GOOGLE_APPLICATION_CREDENTIALS_JSON` for Vision
- (Optional) `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- (Optional) `BLOB_READ_WRITE_TOKEN`

### 4) Database

Push schema:

```bash
npm run db:push
```

Open Prisma Studio (optional):

```bash
npm run db:studio
```

### 5) Run the Dev Server

```bash
npm run dev
```

Open **http://localhost:3000**

### 6) Inngest (optional)

```bash
npm run inngest:dev
# In a separate terminal, run `npm run dev` as usual
```

## 📦 Project Structure

```
finaura/
├─ prisma/
│  └─ schema.prisma
├─ src/
│  ├─ app/            # Next.js App Router
│  │  ├─ api/
│  │  │  ├─ receipt/route.ts     # AI receipt parse (Vision or stub)
│  │  │  └─ inngest/route.ts     # Inngest handler
│  │  ├─ sign-in/[[...sign-in]]/page.tsx
│  │  ├─ sign-up/[[...sign-up]]/page.tsx
│  │  ├─ layout.tsx
│  │  └─ page.tsx
│  ├─ components/     # UI components
│  ├─ emails/         # React Email templates
│  ├─ inngest/        # Background functions
│  ├─ lib/            # Prisma & Supabase helpers
│  └─ utils/vision.ts # Vision OCR + fallback parser
├─ supabase/          # RLS policy examples
└─ ...
```

## 🧰 Notes & Customization

- **OCR**: The Vision integration reads `GOOGLE_APPLICATION_CREDENTIALS_JSON`. If not provided, a simple heuristic parser runs (stub). Replace with your own OCR/LLM logic for production.
- **RLS**: When deploying on Supabase, enable RLS per table and attach policies based on Clerk JWT claims.
- **Emails**: Update `EMAIL_FROM` with your verified sender in Resend.
- **Storage**: Swap the receipt upload with Vercel Blob if desired.

## 📝 License

MIT © Your Name
