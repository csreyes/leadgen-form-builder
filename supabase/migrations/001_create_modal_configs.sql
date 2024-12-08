-- Create the modal_configs table
create table if not exists modal_configs (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default now(),
  config jsonb not null,
  published boolean default false
);

-- Enable Row Level Security (RLS)
alter table modal_configs enable row level security;

-- Create a policy that allows anyone to read published configs
create policy "Anyone can read published configs"
  on modal_configs for select
  using (published = true);

-- Create a policy that allows anyone to insert configs
create policy "Anyone can insert configs"
  on modal_configs for insert
  with check (true);
 