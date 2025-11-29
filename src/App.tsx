import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { supabase } from './lib/supabase';
import type { Post } from './types';
import { ConstellationCanvas } from './components/ConstellationCanvas';
import { PostViewer } from './components/PostViewer';
import Login from './pages/Login';
import Admin from './pages/Admin';

function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

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
      <div className="absolute top-8 left-0 right-0 z-50 flex justify-center pointer-events-none">
        <img
          src="/NAME LOGO 1.png"
          alt="DARRELL KELLER"
          className="h-12 md:h-16 object-contain opacity-90"
        />
      </div>

      <main className="flex-1 relative">
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <div className="animate-pulse text-gray-500">Scanning the stars...</div>
          </div>
        ) : (
          <ConstellationCanvas posts={posts} onPostClick={setSelectedPost} />
        )}

        <PostViewer post={selectedPost} />
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
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
}

export default App;
