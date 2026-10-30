# AvinayStudio • Agency Portfolio & Operations Suite

> **“We Build Digital Presence That Brings Customers”**  
> *Tagline: Build • Create • Grow*

AvinayStudio is a bespoke, cinematic dark-themed agency portfolio platform engineered with Next.js, Tailwind CSS, Framer Motion, and a Supabase-powered Admin Operations Suite.

---

## 🎨 Key Features

- **Cinematic Visual Identity**: Rich dark theme (`#050505`, charcoal, warm beige, and subtle gold accents).
- **Hero & About Visual Blending**: Ambient backlight halo, radial vignette, and custom responsive frame blending.
- **Agency Showcase**:
  - Hero Section with high-conversion messaging
  - Trust section highlighting regional commercial projects in Assam (Maa Radio Mart, Sharma Medicos, The Beauty Parlour, Computer science)
  - 3 Core Services (Basic Website, Business Website, Advanced Online Store)
  - Founder Story & Direct Access
  - Portfolio Case Studies Gallery with live filters
  - Transparent Pricing (₹7,999 / ₹14,999–₹19,999 / ₹39,999–₹49,999)
  - 4-Step Delivery Process
  - Direct WhatsApp & Inquiry Conversion Engine
- **Admin Control Suite (`/admin`)**:
  - Supabase Authentication
  - Portfolio CMS (Full Add/Edit/Delete CRUD)
  - Client Directory & CRM with instant WhatsApp chat trigger
  - Payment & Milestone Tracking
  - Dynamic Invoice Builder & Instant Branded PDF Download

---

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router) + React 19 + TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Database & Auth**: Supabase
- **Invoicing**: jsPDF

---

## 🚀 Getting Started

1. **Clone repository**:
   ```bash
   git clone https://github.com/avinay22/AvinayStudio.git
   cd AvinayStudio
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

## Database setup

1. Create a Supabase project. Copy the Project URL and anon key into `.env.local` using [.env.example](./.env.example) as a template.
2. Run [`supabase/migrations/001_init.sql`](./supabase/migrations/001_init.sql) in the Supabase SQL Editor. On a fresh project, the “destructive operation” warning is expected because the migration uses `drop policy if exists`.
3. Create the admin user in **Authentication > Users > Add user** and tick **Auto Confirm**.
4. Promote the user to admin in the SQL Editor:
   ```sql
   update auth.users
   set raw_app_meta_data = raw_app_meta_data || '{"role":"admin"}'::jsonb
   where email = 'YOUR_EMAIL';
   ```
5. The role lives in `app_metadata`, which users cannot edit. Log out and back in after promotion so the new JWT contains the role.

## Security notes

- RLS is enabled on every table.
- The public can only read featured projects and insert leads.
- Never commit `.env` files. Rotate Supabase keys if they were ever committed.

## Run the development server

   ```bash
   npm run dev
   ```
   Open [http://localhost:3001](http://localhost:3001) in your browser.
