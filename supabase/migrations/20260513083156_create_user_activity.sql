-- Foydalanuvchilar faolligini saqlash uchun jadval
create table if not exists public.user_activity (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id),
  action text not null, -- 'page_view', 'click', 'search'
  page text, -- '/home', '/auth', etc.
  details jsonb, -- qo'shimcha ma'lumotlar
  created_at timestamp with time zone default now()
);

-- Hamma ko'rishi/yozishi uchun ruxsat (oddiyroq bo'lishi uchun)
alter table public.user_activity enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where policyname = 'Allow anonymous inserts' and tablename = 'user_activity') then
    create policy "Allow anonymous inserts" on public.user_activity for insert with check (true);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'Allow public select' on public.user_activity) then
    create policy "Allow public select" on public.user_activity for select using (true);
  end if;
end
$$;
