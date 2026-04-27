-- Run in Supabase SQL editor or via CLI: `supabase db push` (if using Supabase CLI).
-- Application uses the service role from Next.js API routes; RLS is not relied on (service role bypasses RLS).
-- Tighten with RLS if you add a Supabase-authenticated or edge path later.

create table if not exists public.user_checkpoint_progress (
  clerk_user_id text primary key,
  checkpoint_data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

comment on table public.user_checkpoint_progress is
  'Stores checkpoint progress JSON: { "checkpointProgress": { "v1": { "tracks": ... } } }';

create table if not exists public.architecture_designs (
  id text not null,
  clerk_user_id text not null,
  title text not null,
  flow_data jsonb not null,
  last_opened_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (clerk_user_id, id)
);

create index if not exists architecture_designs_clerk_user_id_idx
  on public.architecture_designs (clerk_user_id);

comment on table public.architecture_designs is
  'Named architecture lab diagrams; flow_data matches ArchitectureFlowDocumentV1.';

-- Optional: RLS (deny public by default). Service role bypasses RLS.
alter table public.user_checkpoint_progress enable row level security;
alter table public.architecture_designs enable row level security;
