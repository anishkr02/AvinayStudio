-- Run in Supabase SQL Editor. Then promote the admin user: see README (Database setup).

-- 1. PORTFOLIO PROJECTS TABLE
create table if not exists public.projects (
    id uuid primary key default gen_random_uuid(),
    title text not null,
    client_name text not null,
    category text not null, -- 'E-Commerce', 'Local Business', 'Healthcare', 'Salon & Lifestyle'
    description text not null,
    image_url text not null,
    live_url text,
    tags text[] default '{}',
    results_metric text, -- e.g. "3.8x Lead Increase", "10,000+ Monthly Visitors"
    featured boolean default true,
    order_index int default 0,
    created_at timestamptz default timezone('utc'::text, now()) not null
);

-- 2. CLIENT CRM TABLE
create table if not exists public.clients (
    id uuid primary key default gen_random_uuid(),
    business_name text not null,
    contact_name text not null,
    phone text not null,
    email text,
    location text default 'Assam, India',
    package_selected text default 'Business Website', -- 'Basic Website', 'Business Website', 'Advanced Online Store'
    status text default 'Active', -- 'Lead', 'In Progress', 'Active', 'Completed'
    total_billed numeric default 0,
    notes text,
    created_at timestamptz default timezone('utc'::text, now()) not null
);

-- 3. PAYMENTS TRACKER TABLE
create table if not exists public.payments (
    id uuid primary key default gen_random_uuid(),
    client_id uuid references public.clients(id) on delete set null,
    client_name text not null,
    project_title text not null,
    invoice_number text not null,
    total_amount numeric not null,
    paid_amount numeric default 0,
    due_date date,
    payment_method text default 'UPI / Bank Transfer',
    status text default 'Pending', -- 'Paid', 'Partial', 'Pending'
    created_at timestamptz default timezone('utc'::text, now()) not null
);

-- 4. INVOICES TABLE (For PDF Generation & Records)
create table if not exists public.invoices (
    id uuid primary key default gen_random_uuid(),
    invoice_number text not null unique,
    client_name text not null,
    client_phone text,
    client_email text,
    client_address text default 'Assam, India',
    issue_date date default current_date,
    due_date date,
    items jsonb not null default '[]'::jsonb,
    subtotal numeric not null default 0,
    discount numeric not null default 0,
    total_amount numeric not null default 0,
    status text default 'Issued', -- 'Draft', 'Issued', 'Paid', 'Cancelled'
    notes text default 'Thank you for choosing AvinayStudio. Bank transfer / UPI details provided on invoice.',
    created_at timestamptz default timezone('utc'::text, now()) not null
);

create table if not exists public.leads (
    id uuid primary key default gen_random_uuid(),
    name text not null check (char_length(name) between 1 and 100),
    phone text not null check (char_length(phone) between 5 and 20),
    business text check (char_length(business) <= 150),
    package text check (char_length(package) <= 100),
    message text check (char_length(message) <= 1000),
    status text not null default 'New' check (status in ('New', 'Contacted', 'Converted', 'Dismissed')),
    converted_client_id uuid references public.clients(id) on delete set null,
    created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
    select coalesce((select auth.jwt()) -> 'app_metadata' ->> 'role', '') = 'admin';
$$;

alter table public.projects enable row level security;
alter table public.clients enable row level security;
alter table public.payments enable row level security;
alter table public.invoices enable row level security;
alter table public.leads enable row level security;

revoke all on all tables in schema public from anon, authenticated;
grant select on public.projects to anon;
grant insert on public.leads to anon;
grant all on all tables in schema public to authenticated;

drop policy if exists "public read featured" on public.projects;
create policy "public read featured"
    on public.projects for select
    to anon, authenticated
    using (featured = true);

drop policy if exists "admin all" on public.projects;
create policy "admin all"
    on public.projects for all
    to authenticated
    using (public.is_admin())
    with check (public.is_admin());

drop policy if exists "admin all" on public.clients;
create policy "admin all"
    on public.clients for all
    to authenticated
    using (public.is_admin())
    with check (public.is_admin());

drop policy if exists "admin all" on public.payments;
create policy "admin all"
    on public.payments for all
    to authenticated
    using (public.is_admin())
    with check (public.is_admin());

drop policy if exists "admin all" on public.invoices;
create policy "admin all"
    on public.invoices for all
    to authenticated
    using (public.is_admin())
    with check (public.is_admin());

drop policy if exists "public insert" on public.leads;
create policy "public insert"
    on public.leads for insert
    to anon, authenticated
    with check (status = 'New' and converted_client_id is null);

drop policy if exists "admin all" on public.leads;
create policy "admin all"
    on public.leads for all
    to authenticated
    using (public.is_admin())
    with check (public.is_admin());

create index if not exists projects_order_index_idx on public.projects (order_index);
create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists payments_client_id_idx on public.payments (client_id);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
    'portfolio',
    'portfolio',
    true,
    5242880,
    array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update
set
    name = excluded.name,
    public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "admin insert portfolio objects" on storage.objects;
create policy "admin insert portfolio objects"
    on storage.objects for insert
    to authenticated
    with check (bucket_id = 'portfolio' and public.is_admin());

drop policy if exists "admin update portfolio objects" on storage.objects;
create policy "admin update portfolio objects"
    on storage.objects for update
    to authenticated
    using (bucket_id = 'portfolio' and public.is_admin())
    with check (bucket_id = 'portfolio' and public.is_admin());

drop policy if exists "admin delete portfolio objects" on storage.objects;
create policy "admin delete portfolio objects"
    on storage.objects for delete
    to authenticated
    using (bucket_id = 'portfolio' and public.is_admin());

drop policy if exists "admin select portfolio objects" on storage.objects;
create policy "admin select portfolio objects"
    on storage.objects for select
    to authenticated
    using (bucket_id = 'portfolio' and public.is_admin());
