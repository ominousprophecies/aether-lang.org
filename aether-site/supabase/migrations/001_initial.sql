-- ── CONTACTS TABLE ────────────────────────────────────────────────────────────
create table if not exists contacts (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz default now(),
  name        text not null,
  email       text not null,
  org         text,
  message     text not null,
  source      text default 'aether-lang.org',
  ip          text,
  status      text default 'new' check (status in ('new','replied','archived'))
);

-- Only admins can read contacts
alter table contacts enable row level security;
create policy "service role only" on contacts
  using (false)
  with check (false);

-- ── DOCUMENTS TABLE ────────────────────────────────────────────────────────────
create table if not exists documents (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz default now(),
  name        text not null,
  description text,
  filename    text not null,          -- storage path
  category    text not null,          -- 'internal' | 'vip' | 'public'
  version     text default 'v7.3',
  size_bytes  bigint,
  mime_type   text default 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
);

alter table documents enable row level security;

-- Authenticated users can see internal docs
create policy "internal users see internal docs" on documents
  for select using (
    auth.role() = 'authenticated'
    and (
      category = 'internal'
      or (category = 'vip' and auth.jwt() -> 'user_metadata' ->> 'role' = 'vip')
      or category = 'public'
    )
  );

-- ── STORAGE BUCKET ─────────────────────────────────────────────────────────────
-- Run this in Supabase dashboard: Storage > New bucket > "documents" (private)
-- insert into storage.buckets (id, name, public) values ('documents', 'documents', false);

-- Storage policy: authenticated can download, service role manages uploads
create policy "authenticated download" on storage.objects
  for select using (
    bucket_id = 'documents'
    and auth.role() = 'authenticated'
  );

-- ── SEED DOCUMENTS ─────────────────────────────────────────────────────────────
insert into documents (name, description, filename, category, size_bytes) values
  ('Complete Reference', 'Full technical spec: 46 tracks, 39 manifests, pipeline, standards, roadmap', 'Aether_v73_Complete_Reference.docx', 'internal', null),
  ('Capability Log', 'Complete capability inventory: language features, type system, track table', 'Aether_v73_Capability_Log.docx', 'internal', null),
  ('Patent Counsel Briefing', 'For Max (Oyen Wiggs). Filing order, Universal I/O, non-dilutive funding', 'Aether_v73_Patent_Counsel_Briefing.docx', 'vip', null),
  ('Universal I/O Patent Memo', 'Three-tier I/O architecture, 7 new claim directions UI-1–4, UO-1–2, UC-1', 'Aether_v73_Universal_IO_Patent_Memo.docx', 'vip', null),
  ('Human Verifier Manual', 'Complete sign-off workflow for engineer, compliance officer, procurement/legal', 'Aether_v73_Verifier_Manual.docx', 'internal', null),
  ('DIANA Short-Form', 'NATO DIANA 2027 Challenge Call. Deadline July 3 2026.', 'Aether_v73_DIANA_ShortForm.docx', 'vip', null),
  ('Provisional Patent Draft', 'Claims and drawings, Tracks A–E. For attorney review. Not filed.', 'Aether_Provisional_Patent_with_Drawings.docx', 'vip', null)
on conflict do nothing;
