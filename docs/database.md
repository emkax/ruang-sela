# Database Placeholder

```sql
create table public.examples (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(title) between 3 and 100),
  description text check (char_length(description) <= 500),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.examples enable row level security;

create policy "Users read own examples"
on public.examples for select
using (auth.uid() = user_id);

create policy "Users create own examples"
on public.examples for insert
with check (auth.uid() = user_id);
```

Tambahkan policy update dan delete hanya jika fitur membutuhkannya.
