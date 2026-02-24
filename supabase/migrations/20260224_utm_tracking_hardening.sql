-- UTM tracking hardening: idempotency, no public reads, retention

-- Ensure created_at exists for retention
alter table if exists public.utm_tracking
  add column if not exists created_at timestamptz default now();

-- Idempotency on attribution_id
create unique index if not exists utm_tracking_attribution_id_uk
  on public.utm_tracking (attribution_id);

-- Enforce RLS and remove public reads
alter table public.utm_tracking enable row level security;

-- Remove any broad SELECT privileges
revoke select on public.utm_tracking from anon, authenticated;

-- Insert-only policy for anon/authenticated
drop policy if exists utm_tracking_insert_anon on public.utm_tracking;
create policy utm_tracking_insert_anon
  on public.utm_tracking
  for insert
  to anon, authenticated
  with check (true);

-- Retention: delete rows older than 90 days
create extension if not exists pg_cron;

do $$
begin
  delete from cron.job where jobname = 'utm_tracking_prune_daily';
  perform cron.schedule(
    'utm_tracking_prune_daily',
    '0 3 * * *',
    $$delete from public.utm_tracking where created_at < now() - interval '90 days';$$
  );
exception when undefined_table then
  -- pg_cron not available in this environment
  null;
end $$;
