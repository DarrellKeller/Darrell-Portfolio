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

-- Create site_settings table
create table public.site_settings (
  key text primary key,
  value text
);

-- Enable Row Level Security
alter table public.posts enable row level security;
alter table public.site_settings enable row level security;

-- Create policy to allow public read access
create policy "Public posts are viewable by everyone"
  on public.posts for select
  using ( true );

create policy "Public settings are viewable by everyone"
  on public.site_settings for select
  using ( true );

-- Create policy to allow authenticated users (admin) to insert/update/delete
create policy "Authenticated users can manage posts"
  on public.posts for all
  using ( auth.role() = 'authenticated' );

create policy "Authenticated users can manage settings"
  on public.site_settings for all
  using ( auth.role() = 'authenticated' );

-- Insert Dummy Data
insert into public.posts (title, content, created_at, media_url, video_url) values
(
  'Project Alpha: The Beginning',
  '# The Start of Something New\n\nThis was my very first project. I learned a lot about **React** and **TypeScript**.\n\nIt was a challenging journey but well worth it.',
  '2020-01-15 10:00:00-00',
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop',
  null
),
(
  'Nebula Blog Engine',
  '# Building a Blog Engine\n\nI wanted to build something that could handle markdown and render it beautifully.\n\nCheck out this video of the process:',
  '2022-06-20 14:30:00-00',
  null,
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
),
(
  'Orion Design System',
  '# A Design System for the Stars\n\nCreating a consistent look and feel is crucial. \n\nI used TailwindCSS to create a dark-mode first design system.',
  '2024-11-28 09:00:00-00',
  'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?q=80&w=2071&auto=format&fit=crop',
  null
);

-- Insert Default Settings
insert into public.site_settings (key, value) values
('headline', 'Creative Technologist'),
('about_content', '# About Me\n\nHello! I''m Darrell Keller, a Creative Technologist passionate about building immersive digital experiences.\n\nThis portfolio is a representation of my journey through code and design, visualized as a constellation of projects.'),
('about_media_url', ''),
('about_video_url', '');
