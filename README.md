# Constellation Portfolio

A unique, constellation-themed portfolio website where projects are represented as stars in a night sky. Built with React, TypeScript, TailwindCSS, and Supabase.

![Constellation Portfolio Preview](https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop)

## Features

-   **Interactive Constellation**: Stars represent projects/posts. Their position is calculated based on the date and time of the post, creating a unique "sky map" of your work history.
-   **Immersive UI**: Dark mode "Night Sky" theme with smooth animations and hover effects.
-   **Markdown Blog**: Full markdown support for project descriptions and blog posts.
-   **Admin Dashboard**: Secure admin area to create, edit, and delete posts.
-   **Site Settings**: Manage global site settings (Headline, About Me content) directly from the admin panel.

## Tech Stack

-   **Frontend**: React, TypeScript, Vite
-   **Styling**: TailwindCSS, Framer Motion
-   **Backend**: Supabase (PostgreSQL, Auth)
-   **Icons**: Lucide React

## Prerequisites

-   Node.js (v18 or higher)
-   A [Supabase](https://supabase.com/) account

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd darrell-portfolio
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Supabase Setup

1.  Create a new project in Supabase.
2.  Go to the **SQL Editor** in your Supabase dashboard.
3.  Copy the contents of `supabase/schema.sql` from this project and run it. This will:
    -   Create the `posts` and `site_settings` tables.
    -   Enable Row Level Security (RLS).
    -   Set up access policies.
    -   Insert some dummy data to get you started.

### 4. Environment Variables

Create a `.env` file in the root of the project and add your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

You can find these in your Supabase Dashboard under **Project Settings > API**.

### 5. Run Locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Usage

### Admin Access
1.  Navigate to `/login`.
2.  Since the current auth implementation uses Supabase Auth, you will need to create a user in your Supabase Authentication dashboard manually (or enable signups temporarily).
3.  Once logged in, you will be redirected to `/admin`.

### Managing Content
-   **Add Star**: Click "Create New Star" in the admin dashboard.
-   **Edit Star**: Click "Edit" on any existing post.
-   **Site Settings**: Update your Headline, About Me content, and media URLs in the "Site Settings" section of the admin dashboard.

### Customization
-   **Theme**: Edit `tailwind.config.js` to adjust colors.
-   **Constellation Logic**: Modify `src/components/ConstellationCanvas.tsx` to change how star positions are calculated.

## License

MIT
