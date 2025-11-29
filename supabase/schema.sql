-- Create posts table
create table public.posts (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  content text not null, -- Markdown content
  created_at timestamptz default now() not null,
  media_url text, -- URL for image
  video_url text, -- URL for YouTube video
  x float, -- X position on the constellation canvas (0-100)
  y float  -- Y position on the constellation canvas (0-100)
);

-- Enable Row Level Security
alter table public.posts enable row level security;

-- Create policy to allow public read access
create policy "Public posts are viewable by everyone"
  on public.posts for select
  using ( true );

-- Create policy to allow authenticated users (admin) to insert/update/delete
create policy "Authenticated users can manage posts"
  on public.posts for all
  using ( auth.role() = 'authenticated' );

-- Insert Dummy Data
insert into public.posts (title, content, x, y, media_url, video_url) values
(
  'Project Alpha: The Beginning',
  '# The Start of Something New\n\nThis was my very first project. I learned a lot about **React** and **TypeScript**.\n\nIt was a challenging journey but well worth it.',
  10, 50,
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop',
  null
),
(
  'Nebula Blog Engine',
  '# Building a Blog Engine\n\nI wanted to build something that could handle markdown and render it beautifully.\n\nCheck out this video of the process:',
  40, 30,
  null,
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
),
(
  'Orion Design System',
  '# A Design System for the Stars\n\nCreating a consistent look and feel is crucial. \n\nI used TailwindCSS to create a dark-mode first design system.',
  70, 60,
  'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?q=80&w=2071&auto=format&fit=crop',
  null
);
