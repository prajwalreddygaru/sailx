# Rippleport

> The operating system for cross-border procurement. Source from verified Chinese suppliers through trusted agents — with full visibility from RFQ to delivery.

A modern, enterprise-grade B2B global sourcing & import management platform built for Indian businesses. Inspired by Stripe, Linear, Ramp, Flexport, and SAP Ariba.

![Stack](https://img.shields.io/badge/Next.js-15-black) ![React](https://img.shields.io/badge/React-19-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Tailwind](https://img.shields.io/badge/Tailwind-3.4-cyan) ![Prisma](https://img.shields.io/badge/Prisma-5-2D3748)

---

## ✨ Features

- **Public marketing site** — Premium home page, about, how-it-works, categories, become-an-agent, contact, pricing
- **Authentication** — NextAuth (Google OAuth + Email/Password), role-based redirect, JWT sessions
- **Buyer dashboard** — RFQ creation, quotation comparison, supplier discovery, sample tracking, orders, shipments, real-time chat, Google Meet, notifications, settings
- **Agent dashboard** — Assigned RFQs, supplier sourcing, factory verification, quotation creation, commissions
- **Supplier dashboard** — Product catalog, certifications, orders, shipments
- **Admin panel** — Global analytics, user management, RFQ assignment, dispute resolution, fraud monitoring
- **Real-time** — Socket.io chat, typing indicators, presence
- **Email** — SMTP via Nodemailer (welcome, quotation, shipment, password reset)
- **Theming** — Dark/light mode with `next-themes`
- **Animations** — Framer Motion across hero, cards, lists
- **Charts** — Recharts (area, bar, pie)

## 🧱 Tech Stack

| Layer | Tech |
| --- | --- |
| Framework | Next.js 15 App Router, React 19, TypeScript |
| Styling | TailwindCSS, ShadCN-style UI primitives, Framer Motion, Lucide |
| State | Zustand, TanStack Query |
| DB | PostgreSQL + Prisma ORM |
| Auth | NextAuth (Google + Credentials) + JWT sessions |
| Email | Nodemailer + SMTP |
| Realtime | Socket.io (client-ready), WebRTC for meetings |
| Storage | AWS S3 / Cloudinary (env-driven) |
| Forms | React Hook Form + Zod |

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# → fill in DATABASE_URL, NEXTAUTH_SECRET, GOOGLE_*, SMTP_*

# 3. Set up the database
npx prisma generate
npx prisma migrate dev --name init

# 4. Run dev server
npm run dev
```

The app boots at **http://localhost:3000**.

> The dashboards run with mock data out of the box. Plug in your `DATABASE_URL` and the API routes (`/api/rfqs`, `/api/quotations`, `/api/messages`, `/api/auth/*`) become live.

## 🔐 Environment variables

Paste your credentials into `.env`:

```env
# Database (PostgreSQL)
DATABASE_URL="postgresql://user:password@localhost:5432/rippleport?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with: openssl rand -base64 32"

# Google OAuth (https://console.cloud.google.com/apis/credentials)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# SMTP (Gmail / SendGrid / Postmark)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER=""
SMTP_PASSWORD=""
SMTP_FROM="Rippleport <no-reply@rippleport.app>"

# AWS S3 (file uploads — optional)
AWS_REGION=""
AWS_ACCESS_KEY_ID=""
AWS_SECRET_ACCESS_KEY=""
AWS_S3_BUCKET=""

# Realtime
NEXT_PUBLIC_SOCKET_URL="http://localhost:4000"
```

## 🗂️ Project structure

```
src/
├── app/
│   ├── (marketing)/        # Public site (home, about, how-it-works, …)
│   ├── (auth)/             # Login, register, forgot-password
│   ├── dashboard/
│   │   ├── buyer/          # Buyer pages (RFQs, quotations, suppliers, …)
│   │   ├── agent/          # Agent pages (sourcing, verification, …)
│   │   ├── supplier/       # Supplier pages (catalog, certifications, …)
│   │   └── admin/          # Admin (users, assignments, disputes, fraud)
│   ├── api/
│   │   ├── auth/           # NextAuth + register
│   │   ├── rfqs/           # CRUD
│   │   ├── quotations/
│   │   ├── messages/
│   │   └── health/
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/                 # Button, Card, Input, Dialog, Tabs, …
│   ├── marketing/          # Navbar, Footer
│   ├── dashboard/          # Sidebar, Topbar, charts, status badges
│   ├── brand/              # Logo
│   └── providers/          # Theme, Query
├── lib/
│   ├── auth.ts             # NextAuth config
│   ├── prisma.ts           # Prisma singleton
│   ├── mailer.ts           # SMTP transport + templates
│   ├── mock-data.ts        # Demo data for dashboards
│   ├── store.ts            # Zustand stores
│   ├── types.ts            # Shared types
│   └── utils.ts            # cn, formatCurrency, formatDate, …
└── types/
    └── next-auth.d.ts      # Session typing
prisma/
└── schema.prisma
```

## 👥 Roles

The platform supports four roles, each with a dedicated dashboard:

- **Buyer** — Indian businesses importing products
- **Agent** — China-based sourcing agents
- **Supplier** — Chinese factories and brands
- **Admin** — Platform operators

Switching roles is available in the topbar avatar menu.

## 🧭 Key pages

| Route | Description |
| --- | --- |
| `/` | Marketing home (hero, features, categories, testimonials, CTA) |
| `/how-it-works` | 8-step sourcing workflow |
| `/categories` + `/categories/[slug]` | Product category browser |
| `/pricing` | Plans + sourcing fee tiers |
| `/become-agent` | Agent application form |
| `/login` `/register` `/forgot-password` | Auth |
| `/dashboard/buyer` | Buyer home with KPIs, charts, RFQs, notifications |
| `/dashboard/buyer/rfqs/new` | Create RFQ wizard with file uploads |
| `/dashboard/buyer/quotations` | Side-by-side quotation comparison |
| `/dashboard/buyer/shipments` | World-map view + container tracking |
| `/dashboard/buyer/chat` | Real-time chat shell |
| `/dashboard/buyer/meetings` | Google Meet scheduling |
| `/dashboard/agent` | Agent dashboard |
| `/dashboard/supplier` | Supplier dashboard |
| `/dashboard/admin` | Admin global view |

## 🎨 Design system

- **Palette** — Dark navy + electric brand-blue, success green, warning amber
- **Typography** — Inter (sans) + Space Grotesk (display)
- **Surfaces** — Glassmorphism + grid-bg + soft radial fades
- **Components** — All shadcn-style: Button, Card, Input, Dialog, Tabs, Select, Switch, ScrollArea, Table, Tooltip, Dropdown, Avatar, Progress, Badge, Checkbox, Separator, Textarea, Label

## 🛠️ Scripts

```bash
npm run dev               # Start Next.js dev server
npm run build             # Production build
npm run start             # Production server
npm run lint              # ESLint
npm run prisma:generate   # Regenerate Prisma client
npm run prisma:migrate    # Run dev migration
```

## 📦 Deploy

Optimized for **Vercel**:

```bash
vercel
```

Make sure to set the env vars in your Vercel dashboard.

## 📄 License

© Rippleport Inc. — proprietary, all rights reserved.

---

**Built to feel like a billion-dollar procurement-tech product.**
