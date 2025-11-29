import React, { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import type { Post } from '../types';
import { motion } from 'framer-motion';

interface PostViewerProps {
    post: Post | null;
}

export const PostViewer: React.FC<PostViewerProps> = ({ post }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (post && containerRef.current) {
            containerRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [post]);

    if (!post) return <div className="h-20" />; // Spacer

    return (
        <div ref={containerRef} className="min-h-screen bg-night text-white py-20 px-4 md:px-20 flex justify-center">
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                key={post.id}
                className="max-w-3xl w-full space-y-8"
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

                <div className="prose prose-invert prose-lg max-w-none">
                    <ReactMarkdown>{post.content}</ReactMarkdown>
                </div>
            </motion.div>
        </div>
    );
};
