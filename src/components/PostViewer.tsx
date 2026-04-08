import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import type { Post } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

interface PostViewerProps {
    post: Post | null;
    onClose: () => void;
}

export const PostViewer: React.FC<PostViewerProps> = ({ post, onClose }) => {
    const [shareLabel, setShareLabel] = useState('Share This Star');

    useEffect(() => {
        if (post) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [post]);

    useEffect(() => {
        setShareLabel('Share This Star');
    }, [post?.id]);

    async function handleShare() {
        if (!post) return;

        const shareData = {
            title: post.title,
            text: `Take a look at ${post.title}`,
            url: window.location.href,
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
                return;
            }

            await navigator.clipboard.writeText(window.location.href);
            setShareLabel('Link Copied');
        } catch (error) {
            console.error('Error sharing post:', error);
            setShareLabel('Copy Failed');
        }
    }

    return (
        <AnimatePresence>
            {post && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 bg-night/95 backdrop-blur-sm overflow-y-auto"
                >
                    <div className="min-h-screen px-4 md:px-20 flex flex-col items-center">
                        <nav className="sticky top-0 w-full p-6 flex justify-between items-center z-50 mix-blend-difference bg-night/95 backdrop-blur-sm mb-20">
                            <button onClick={onClose} className="text-sm font-mono hover:opacity-80 transition-opacity text-white">
                                ← RETURN TO MAIN
                            </button>
                            <Link to="/login" className="text-sm font-mono hover:opacity-80 transition-opacity text-white">
                                ADMIN LOGIN
                            </Link>
                        </nav>

                        <motion.div
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 50, opacity: 0 }}
                            className="max-w-3xl w-full space-y-8 relative"
                        >

                            <header className="border-b border-gray-800 pb-8">
                                <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                                    {post.title}
                                </h1>
                                <time className="text-gray-500 font-mono">
                                    {new Date(post.created_at).toLocaleDateString(undefined, {
                                        year: 'numeric', month: 'long', day: 'numeric'
                                    })}
                                </time>
                            </header>

                            {post.media_url && (
                                <div className="rounded-xl overflow-hidden border border-gray-800 shadow-2xl">
                                    <img src={post.media_url} alt={post.title} className="w-full h-auto object-cover" />
                                </div>
                            )}

                            {post.video_url && (
                                <div className="aspect-video rounded-xl overflow-hidden border border-gray-800 shadow-2xl">
                                    <iframe
                                        width="100%"
                                        height="100%"
                                        src={post.video_url.replace('watch?v=', 'embed/')}
                                        title="YouTube video player"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    ></iframe>
                                </div>
                            )}

                            <div className="prose prose-invert prose-lg max-w-none pb-20">
                                <ReactMarkdown>{post.content}</ReactMarkdown>
                            </div>

                            <div className="border-t border-gray-800 pt-8 pb-20 flex justify-center">
                                {post.external_url ? (
                                    <a
                                        href={post.external_url}
                                        target={post.new_tab !== false ? '_blank' : undefined}
                                        rel={post.new_tab !== false ? 'noopener noreferrer' : undefined}
                                        className="inline-flex items-center rounded-full border border-white/20 px-6 py-3 text-sm font-mono uppercase tracking-[0.2em] text-white transition hover:border-white hover:bg-white hover:text-black"
                                    >
                                        Visit Linked Project
                                    </a>
                                ) : (
                                    <button
                                        onClick={handleShare}
                                        className="inline-flex items-center rounded-full border border-white/20 px-6 py-3 text-sm font-mono uppercase tracking-[0.2em] text-white transition hover:border-white hover:bg-white hover:text-black"
                                    >
                                        {shareLabel}
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
