import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Post } from '../types';
import { useNavigate } from 'react-router-dom';

export default function Admin() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingPost, setEditingPost] = useState<Partial<Post>>({});
    const [isEditing, setIsEditing] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        checkUser();
        fetchPosts();
    }, []);

    async function checkUser() {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            navigate('/login');
        }
    }

    async function fetchPosts() {
        try {
            const { data, error } = await supabase
                .from('posts')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setPosts(data || []);
        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            setLoading(false);
        }
    }

    async function handleSave(e: React.FormEvent) {
        e.preventDefault();
        try {
            const postData = {
                title: editingPost.title,
                content: editingPost.content,
                media_url: editingPost.media_url || null,
                video_url: editingPost.video_url || null,
                created_at: editingPost.created_at || new Date().toISOString(),
                x: 0, // Legacy field, ignored by frontend
                y: 0, // Legacy field, ignored by frontend
            };

            if (editingPost.id) {
                const { error } = await supabase
                    .from('posts')
                    .update(postData)
                    .eq('id', editingPost.id);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('posts')
                    .insert([postData]);
                if (error) throw error;
            }

            setIsEditing(false);
            setEditingPost({});
            fetchPosts();
        } catch (error: any) {
            alert('Error saving post: ' + error.message);
        }
    }

    async function handleDelete(id: string) {
        if (!confirm('Are you sure you want to delete this star?')) return;
        try {
            const { error } = await supabase.from('posts').delete().eq('id', id);
            if (error) throw error;
            fetchPosts();
        } catch (error: any) {
            alert('Error deleting post: ' + error.message);
        }
    }

    async function handleLogout() {
        await supabase.auth.signOut();
        navigate('/');
    }

    if (loading) return <div className="text-white text-center mt-20">Loading...</div>;

    return (
        <div className="min-h-screen bg-night text-white p-8">
            <div className="max-w-4xl mx-auto">
                <header className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">Mission Control</h1>
                    <div className="space-x-4">
                        <button onClick={() => navigate('/')} className="text-gray-400 hover:text-white">View Site</button>
                        <button onClick={handleLogout} className="text-red-400 hover:text-red-300">Logout</button>
                    </div>
                </header>

                {isEditing ? (
                    <div className="bg-gray-900 p-6 rounded-lg border border-gray-700">
                        <h2 className="text-xl font-bold mb-4">{editingPost.id ? 'Edit Star' : 'New Star'}</h2>
                        <form onSubmit={handleSave} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400">Title</label>
                                <input
                                    type="text"
                                    required
                                    className="mt-1 block w-full bg-gray-800 border-gray-700 rounded-md text-white px-3 py-2"
                                    value={editingPost.title || ''}
                                    onChange={e => setEditingPost({ ...editingPost, title: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400">Date & Time</label>
                                <input
                                    type="datetime-local"
                                    required
                                    className="mt-1 block w-full bg-gray-800 border-gray-700 rounded-md text-white px-3 py-2"
                                    value={editingPost.created_at ? new Date(editingPost.created_at).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16)}
                                    onChange={e => setEditingPost({ ...editingPost, created_at: new Date(e.target.value).toISOString() })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400">Content (Markdown)</label>
                                <textarea
                                    required
                                    rows={10}
                                    className="mt-1 block w-full bg-gray-800 border-gray-700 rounded-md text-white px-3 py-2 font-mono"
                                    value={editingPost.content || ''}
                                    onChange={e => setEditingPost({ ...editingPost, content: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400">Image URL (Optional)</label>
                                <input
                                    type="url"
                                    className="mt-1 block w-full bg-gray-800 border-gray-700 rounded-md text-white px-3 py-2"
                                    value={editingPost.media_url || ''}
                                    onChange={e => setEditingPost({ ...editingPost, media_url: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400">YouTube URL (Optional)</label>
                                <input
                                    type="url"
                                    className="mt-1 block w-full bg-gray-800 border-gray-700 rounded-md text-white px-3 py-2"
                                    value={editingPost.video_url || ''}
                                    onChange={e => setEditingPost({ ...editingPost, video_url: e.target.value })}
                                />
                            </div>

                            <div className="flex justify-end space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => { setIsEditing(false); setEditingPost({}); }}
                                    className="px-4 py-2 border border-gray-600 rounded-md text-gray-300 hover:bg-gray-800"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-white text-black rounded-md hover:bg-gray-200 font-medium"
                                >
                                    Save Star
                                </button>
                            </div>
                        </form>
                    </div>
                ) : (
                    <div>
                        <button
                            onClick={() => setIsEditing(true)}
                            className="mb-6 px-4 py-2 bg-white text-black rounded-md hover:bg-gray-200 font-medium"
                        >
                            + Create New Star
                        </button>

                        <div className="grid gap-4">
                            {posts.map(post => (
                                <div key={post.id} className="bg-gray-900 p-4 rounded-lg border border-gray-800 flex justify-between items-center group hover:border-gray-600 transition-colors">
                                    <div>
                                        <h3 className="font-bold text-lg">{post.title}</h3>
                                        <p className="text-gray-500 text-sm">
                                            {new Date(post.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => { setEditingPost(post); setIsEditing(true); }}
                                            className="px-3 py-1 bg-gray-800 rounded hover:bg-gray-700"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(post.id)}
                                            className="px-3 py-1 bg-red-900/50 text-red-400 rounded hover:bg-red-900"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
