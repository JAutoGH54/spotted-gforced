-- Supabase Database Schema for Spotted Mobile App

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. PROFILES TABLE (linked to Auth Users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique not null,
  full_name text,
  avatar_url text,
  is_pro boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint username_length check (char_length(username) >= 3)
);

alter table public.profiles enable row level security;

-- 2. CAR SPOTS TABLE
create table public.spots (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  description text,
  image_url text not null,
  latitude double precision not null,
  longitude double precision not null,
  make text not null, -- e.g., Porsche
  model text not null, -- e.g., 911 GT3 RS
  year integer,
  moderation_status text default 'pending' check (moderation_status in ('pending', 'approved', 'flagged', 'blocked')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.spots enable row level security;

-- 3. SAVED SPOTS (Bookmark junction table)
create table public.saved_spots (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  spot_id uuid references public.spots(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (user_id, spot_id)
);

alter table public.saved_spots enable row level security;

-- 4. COMMENTS TABLE
create table public.comments (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  spot_id uuid references public.spots(id) on delete cascade not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.comments enable row level security;

-- 5. USER BLOCKS (Apple UGC Compliance)
create table public.user_blocks (
  id uuid default gen_random_uuid() primary key,
  blocker_id uuid references public.profiles(id) on delete cascade not null,
  blocked_id uuid references public.profiles(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (blocker_id, blocked_id)
);

alter table public.user_blocks enable row level security;

-- 6. CONTENT REPORTS (Apple UGC Compliance)
create table public.reports (
  id uuid default gen_random_uuid() primary key,
  reporter_id uuid references public.profiles(id) on delete cascade not null,
  reported_user_id uuid references public.profiles(id) on delete cascade not null,
  spot_id uuid references public.spots(id) on delete cascade,
  comment_id uuid references public.comments(id) on delete cascade,
  reason text not null,
  status text default 'pending' check (status in ('pending', 'resolved', 'dismissed')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.reports enable row level security;

--------------------------------------------------------------------------------
-- ROW LEVEL SECURITY POLICIES (RLS)
--------------------------------------------------------------------------------

-- Profiles RLS
create policy "Allow public read access to profiles" on public.profiles 
  for select using (true);

create policy "Allow users to update their own profile" on public.profiles 
  for update using (auth.uid() = id);

-- Spots RLS
-- Apple UGC compliance: Users should not see spots from users they blocked or who blocked them.
create policy "Allow public read access to spots" on public.spots
  for select using (
    moderation_status != 'blocked' 
    and not exists (
      select 1 from public.user_blocks 
      where (blocker_id = auth.uid() and blocked_id = user_id)
         or (blocker_id = user_id and blocked_id = auth.uid())
    )
  );

create policy "Allow authenticated users to insert spots" on public.spots
  for insert with check (auth.uid() = user_id);

create policy "Allow users to update their own spots" on public.spots
  for update using (auth.uid() = user_id);

create policy "Allow users to delete their own spots" on public.spots
  for delete using (auth.uid() = user_id);

-- Saved Spots RLS
create policy "Allow users to view their own saved spots" on public.saved_spots
  for select using (auth.uid() = user_id);

create policy "Allow users to bookmark spots" on public.saved_spots
  for insert with check (auth.uid() = user_id);

create policy "Allow users to delete their bookmarked spots" on public.saved_spots
  for delete using (auth.uid() = user_id);

-- Comments RLS
create policy "Allow public read access to comments" on public.comments
  for select using (
    not exists (
      select 1 from public.user_blocks 
      where (blocker_id = auth.uid() and blocked_id = user_id)
         or (blocker_id = user_id and blocked_id = auth.uid())
    )
  );

create policy "Allow authenticated users to comment" on public.comments
  for insert with check (auth.uid() = user_id);

create policy "Allow users to delete their comments" on public.comments
  for delete using (auth.uid() = user_id);

-- User Blocks RLS
create policy "Allow users to view their own blocks list" on public.user_blocks
  for select using (auth.uid() = blocker_id);

create policy "Allow users to block others" on public.user_blocks
  for insert with check (auth.uid() = blocker_id);

create policy "Allow users to unblock others" on public.user_blocks
  for delete using (auth.uid() = blocker_id);

-- Reports RLS
create policy "Allow users to file reports" on public.reports
  for insert with check (auth.uid() = reporter_id);

create policy "Allow users to view their filed reports" on public.reports
  for select using (auth.uid() = reporter_id);

--------------------------------------------------------------------------------
-- AUTOMATED PROFILE CREATION ON SIGNUP
--------------------------------------------------------------------------------

-- Trigger function to create profile record when a new user signs up in Auth schema
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, full_name, avatar_url, is_pro)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', 'user_' || substr(new.id::text, 1, 8)),
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    new.raw_user_meta_data->>'avatar_url',
    false
  );
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
