✨ FinAura - Personal Finance Management
<p align="center">
<img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js"/>
<img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React"/>
<img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase"/>
<img src="https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma"/>
<img src="https://img.shields.io/badge/Clerk-6C47FF?style=for-the-badge&logo=clerk&logoColor=white" alt="Clerk"/>
<img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL"/>
<img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS"/>
</p>

<p align="center">
A full-stack personal finance application designed to provide a secure, fast, and intuitive user experience for managing your financial health.
</p>

<p align="center">
<a href="#-introduction"><strong>Introduction</strong></a> •
<a href="#-key-features"><strong>Key Features</strong></a> •
<a href="#-tech-stack"><strong>Tech Stack</strong></a> •
<a href="#-security-model"><strong>Security</strong></a> •
<a href="#-getting-started"><strong>Getting Started</strong></a>
</p>

<p align="center">
<img width="1901" height="916" alt="Screenshot 2025-08-15 000101" src="https://github.com/user-attachments/assets/2046cc4c-81ea-4473-8fe2-0d8c408bd8c0" />
</p>


🚀 Introduction
FinAura was born from the idea that managing your finances should feel empowering, not overwhelming. It’s a modern web application designed to be incredibly fast, secure, and genuinely easy to use. It provides a comprehensive dashboard for a bird's-eye view of your accounts and budgets, detailed transaction tracking, and intelligent features like an AI-powered receipt scanner to eliminate tedious data entry.

✨ Key Features
Comprehensive Dashboard: A single-pane view of your financial health, including account balances, budget progress, and spending overviews.

Account & Budget Management: Easily create and manage multiple financial accounts and set monthly or categorical budgets.

Detailed Transaction Tracking: Log all your transactions with details like category, merchant, and date.

🤖 AI Receipt Scanner: Simply upload a photo of a receipt, and our AI assistant (powered by Google Vision AI) will automatically extract the merchant, date, and total amount to pre-fill the form.

Asynchronous Email Alerts: Receive timely notifications (e.g., a welcome email upon sign-up) without ever blocking the user interface, powered by a robust background job runner.

Secure Authentication: User authentication is handled by Clerk, providing enterprise-grade security features like multi-factor authentication (MFA).

Responsive Design: A beautiful and consistent user experience across desktop, tablet, and mobile devices.

🛠️ Tech Stack
FinAura is built with a modern, integrated tech stack chosen for performance, security, and developer experience.

Framework: 🚀 Next.js (with App Router)

Styling: 🎨 Tailwind CSS

Authentication: 🔐 Clerk

Database: 🐘 Supabase (PostgreSQL) with Row-Level Security

ORM: prisma Prisma

Asynchronous Jobs: 🕒 Inngest

Email: ✉️ React Email & Resend

AI / OCR: 🧠 Google Cloud Vision AI

File Storage: ☁️ Vercel Blob

🔐 Security Model
Security is the highest priority in FinAura. Our model is built on a robust, multi-layered approach to ensure user data is always protected.

Authentication (Clerk): Manages who users are. Clerk handles secure sign-up, sign-in, session management, and provides easy integration for Multi-Factor Authentication (MFA).

Authorization (Supabase RLS): Manages what users can see. We use Supabase's powerful Row-Level Security (RLS) on every table. This means every single data request is verified at the database level, ensuring it's impossible for a user to access another user's data.

The Handshake: Clerk generates a secure JWT for each user session. Supabase verifies this token on every request and uses the embedded user_id to enforce the RLS policies. This creates a zero-trust environment where every action is authenticated and authorized.

🚀 Getting Started
To get a local copy up and running, follow these simple steps.

Prerequisites
Node.js (v18 or later)

npm / yarn / pnpm

A Supabase account for the database

A Clerk account for authentication

Installation
Clone the repo

git clone https://github.com/your-username/finaura.git

Install NPM packages

npm install

Set up environment variables
Create a .env.local file in the root of your project and add your keys from Supabase and Clerk.

# Supabase
NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=YOUR_CLERK_PUBLISHABLE_KEY
CLERK_SECRET_KEY=YOUR_CLERK_SECRET_KEY

Push the database schema
Use Prisma to migrate your database schema to your Supabase instance.

npx prisma db push

Run the development server

npm run dev

Open http://localhost:3000 with your browser to see the result.
