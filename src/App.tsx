import { useEffect, useMemo, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';
import { supabase } from './lib/supabase';
import type { Post } from './types';
import { ConstellationCanvas } from './components/ConstellationCanvas';
import { PostViewer } from './components/PostViewer';
import Login from './pages/Login';
import Admin from './pages/Admin';
import About from './pages/About';
import { buildPostPath, slugifyPostTitle } from './lib/postRoutes';
import { absoluteUrl, defaultSiteJsonLd, stripMarkdown, truncateDescription, updateSeo } from './lib/seo';

import ReactMarkdown from 'react-markdown';

function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [headline, setHeadline] = useState('Creative Technologist');
  const navigate = useNavigate();
  const { postId, slug } = useParams();

  useEffect(() => {
    fetchPosts();
    fetchHeadline();
  }, []);

  useEffect(() => {
    if (!postId) {
      updateSeo({
        title: 'Darrell Keller - Applied AI Design and Engineering',
        description: 'AI design and engineering by Darrell Keller, featuring projects, writing, and PostAustin.com work.',
        path: '/',
        jsonLd: defaultSiteJsonLd(),
      });
    }
  }, [postId]);

  const selectedPost = useMemo(
    () => posts.find((post) => post.id === postId) ?? null,
    [posts, postId],
  );

  useEffect(() => {
    if (!selectedPost) {
      return;
    }

    if (selectedPost.external_url) {
      window.location.assign(selectedPost.external_url);
      return;
    }

    const canonicalSlug = slugifyPostTitle(selectedPost.title);
    if (postId && slug !== canonicalSlug) {
      navigate(buildPostPath(selectedPost), { replace: true });
    }
  }, [navigate, postId, selectedPost, slug]);

  useEffect(() => {
    if (!selectedPost || selectedPost.external_url) {
      return;
    }

    const path = buildPostPath(selectedPost);
    const description = truncateDescription(stripMarkdown(selectedPost.content));

    updateSeo({
      title: `${selectedPost.title} | Darrell Keller`,
      description,
      path,
      image: selectedPost.media_url,
      type: 'article',
      publishedTime: selectedPost.created_at,
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'CreativeWork',
        headline: selectedPost.title,
        name: selectedPost.title,
        description,
        datePublished: selectedPost.created_at,
        url: absoluteUrl(path),
        image: selectedPost.media_url ? absoluteUrl(selectedPost.media_url) : undefined,
        author: {
          '@type': 'Person',
          name: 'Darrell Keller',
          url: 'https://postaustin.com',
        },
      },
    });
  }, [selectedPost]);

  async function fetchHeadline() {
    const { data } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'headline')
      .single();

    if (data) {
      setHeadline(data.value);
    }
  }

  async function fetchPosts() {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="h-screen bg-night text-white font-sans selection:bg-white selection:text-black flex flex-col overflow-hidden">
      <div className="absolute top-8 left-0 right-0 z-50 flex flex-col items-center pointer-events-none">
        <Link to="/about" className="block hover:opacity-80 transition-opacity pointer-events-auto">
          <img
            src="/NAME LOGO 1.png"
            alt="Darrell Keller Logo"
            className="h-24 md:h-32 w-auto"
          />
        </Link>
        <div className="mt-2 text-sm md:text-base font-mono tracking-widest text-gray-400 uppercase pointer-events-auto text-center">
          <ReactMarkdown
            components={{
              a: ({ ...props }) => <a {...props} className="text-blue-400 hover:text-blue-300 underline" target="_blank" rel="noopener noreferrer" />,
              p: ({ ...props }) => <span {...props} />
            }}
          >
            {headline}
          </ReactMarkdown>
        </div>
      </div>

      <main className="flex-1 relative">
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <div className="animate-pulse text-gray-500">Scanning the stars...</div>
          </div>
        ) : (
          <ConstellationCanvas
            posts={posts}
            onPostClick={(post) => navigate(buildPostPath(post))}
          />
        )}

        <PostViewer post={selectedPost} onClose={() => navigate('/')} />

        <nav className="sr-only" aria-label="Project pages">
          <h2>Projects and writing</h2>
          <ul>
            {posts
              .filter((post) => !post.external_url)
              .map((post) => (
                <li key={post.id}>
                  <Link to={buildPostPath(post)}>{post.title}</Link>
                </li>
              ))}
          </ul>
        </nav>
      </main>

      {/* Hidden login link for admin access */}
      <Link to="/login" className="fixed bottom-4 right-4 w-4 h-4 opacity-0 hover:opacity-50 cursor-default z-50" aria-label="Admin Login" />
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/stars/:slug/:postId" element={<Home />} />
        <Route path="/stars/:postId" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
}

export default App;
