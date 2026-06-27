# Aether-Lang.org — Deployment Guide

Next.js 14 (App Router) → GitHub → Vercel · Supabase · aether-lang.org

---

## Stack

| Layer       | Service                                      |
|-------------|----------------------------------------------|
| Framework   | Next.js 14 App Router (TypeScript)           |
| Hosting     | Vercel (auto-deploy from GitHub main branch) |
| Database    | Supabase (PostgreSQL + RLS)                  |
| Auth        | Supabase Auth (magic link email)             |
| Storage     | Supabase Storage (private bucket)            |
| Email       | Resend (contact form)                        |
| Domain      | aether-lang.org                              |

---

## Step 1 — Supabase setup

### 1a. Run the migration

In Supabase dashboard → SQL Editor, run:
```
supabase/migrations/001_initial.sql
```

### 1b. Create storage bucket

In Supabase dashboard → Storage → New bucket:
- Name: `documents`
- Public: **NO** (private)
- File size limit: 50MB

### 1c. Upload documents

Upload these files to the `documents` bucket:
- `Aether_v73_Complete_Reference.docx`
- `Aether_v73_Capability_Log.docx`
- `Aether_v73_Patent_Counsel_Briefing.docx`
- `Aether_v73_Universal_IO_Patent_Memo.docx`
- `Aether_v73_Verifier_Manual.docx`
- `Aether_v73_DIANA_ShortForm.docx`
- `Aether_Provisional_Patent_with_Drawings.docx`

### 1d. Get your service role key

Supabase dashboard → Settings → API → `service_role` key (secret)

### 1e. Configure email redirect

Supabase dashboard → Authentication → URL Configuration:
- Site URL: `https://aether-lang.org`
- Redirect URLs: `https://aether-lang.org/api/auth`

---

## Step 2 — Vercel setup

### 2a. Connect repo

Vercel dashboard → New Project → Import `ominoussprophecies/aether-lang-org`

Settings:
- Framework: Next.js
- Build command: `next build`
- Root directory: `/` (or wherever this README lives)

### 2b. Add environment variables

In Vercel → Project → Settings → Environment Variables:

```
NEXT_PUBLIC_SUPABASE_URL        = https://vqvisoqjpkvhwkadljjh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY   = sb_publishable_UDnYsI6w7CGtA-KgL2UWmQ_RBE1f1kS
SUPABASE_SERVICE_ROLE_KEY       = [from step 1d — keep secret]
AUTH_SECRET                     = [run: openssl rand -hex 32]
RESEND_API_KEY                  = [from resend.com — optional but recommended]
CONTACT_EMAIL_TO                = info@bruno-protocol.org
```

### 2c. Deploy

Push to `main` → Vercel auto-deploys. Check build logs at vercel.com.

---

## Step 3 — DNS (aether-lang.org)

In your domain registrar (Namecheap / wherever aether-lang.org is registered):

| Type  | Host | Value                      |
|-------|------|----------------------------|
| A     | @    | 76.76.21.21                |
| CNAME | www  | cname.vercel-dns.com       |

In Vercel → Project → Settings → Domains:
- Add `aether-lang.org`
- Add `www.aether-lang.org` (redirect to apex)

Vercel auto-provisions SSL (Let's Encrypt). Allow 5–30 mins for DNS propagation.

---

## Step 4 — Create users

### Internal access

In Supabase → Authentication → Users → Invite user:
- Enter the email of each internal team member
- They receive a magic link — no password required

### VIP access

Run this in Supabase SQL Editor for each VIP user:

```sql
-- First invite via dashboard, then set vip role:
update auth.users
set raw_user_meta_data = raw_user_meta_data || '{"role":"vip"}'::jsonb
where email = 'their@email.com';
```

---

## Step 5 — Resend email setup (optional)

1. Create account at resend.com
2. Add domain `aether-lang.org` → follow DNS verification
3. Copy API key → add to Vercel env vars as `RESEND_API_KEY`
4. Contact form emails will go to `CONTACT_EMAIL_TO`

---

## Routes

| Route              | Access    | Description                    |
|--------------------|-----------|--------------------------------|
| `/`                | Public    | Main marketing site            |
| `/internal/login`  | Public    | Magic link login               |
| `/internal`        | Auth only | Internal portal + doc downloads|
| `/vip/login`       | Public    | VIP magic link login           |
| `/vip`             | VIP only  | Evidence generator + all docs  |
| `/api/contact`     | Public    | Contact form → Supabase+Resend |
| `/api/docs`        | Auth only | Signed URL doc downloads       |
| `/api/auth`        | Public    | Supabase auth callback         |

---

## Local development

```bash
cp .env.local.example .env.local
# Fill in your values

npm install
npm run dev
# → http://localhost:3000
```

---

## Deployment checklist

- [ ] Migration 001_initial.sql run in Supabase
- [ ] `documents` storage bucket created (private)
- [ ] .docx files uploaded to bucket
- [ ] All env vars set in Vercel
- [ ] Supabase Auth redirect URL set to https://aether-lang.org/api/auth
- [ ] DNS A record → 76.76.21.21
- [ ] DNS CNAME www → cname.vercel-dns.com
- [ ] Domain added in Vercel project settings
- [ ] SSL provisioned (auto — check Vercel dashboard)
- [ ] Internal users invited via Supabase Auth
- [ ] VIP users tagged with `{"role":"vip"}` in user_metadata
- [ ] Contact form tested end-to-end
- [ ] `/internal` and `/vip` redirects tested (unauthenticated → login)

---

© 2026 Emilio R. Bruno · Aether-Lang.org Inc. (CBCA federal) · Kamloops, BC, Canada
