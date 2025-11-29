import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';

export default function About() {
    const [content, setContent] = useState('');
    const [mediaUrl, setMediaUrl] = useState('');
    const [videoUrl, setVideoUrl] = useState('');

    useEffect(() => {
        fetchContent();
    }, []);

    async function fetchContent() {
        const { data: contentData } = await supabase
            .from('site_settings')
            .select('value')
            .eq('key', 'about_content')
            .single();

        if (contentData) setContent(contentData.value);

        const { data: mediaData } = await supabase
            .from('site_settings')
            .select('value')
            .eq('key', 'about_media_url')
            .single();

        if (mediaData) setMediaUrl(mediaData.value);

        const { data: videoData } = await supabase
            .from('site_settings')
            .select('value')
            .eq('key', 'about_video_url')
            .single();

        if (videoData) setVideoUrl(videoData.value);
    }

    return (
        <div className="min-h-screen bg-night text-white font-sans selection:bg-white selection:text-black">
            <div className="min-h-screen px-4 md:px-20 flex flex-col items-center">
                <nav className="sticky top-0 w-full p-6 flex justify-between items-center z-50 mix-blend-difference bg-night/95 backdrop-blur-sm mb-20">
                    <Link to="/" className="text-sm font-mono hover:opacity-80 transition-opacity text-white">
                        ← RETURN TO MAIN
                    </Link>
                    <Link to="/login" className="text-sm font-mono hover:opacity-80 transition-opacity text-white">
                        ADMIN LOGIN
                    </Link>
                </nav>

                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="max-w-3xl w-full space-y-8 relative"
                >
                    <header className="border-b border-gray-800 pb-8">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                            About Me
                        </h1>
                    </header>

                    {/* Media Section */}
                    {(mediaUrl || videoUrl) && (
                        <div className="rounded-xl overflow-hidden bg-gray-900 border border-gray-800">
                            {videoUrl ? (
                                <div className="aspect-video">
                                    <iframe
                                        src={videoUrl.replace('watch?v=', 'embed/')}
                                        className="w-full h-full"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    />
                                </div>
                            ) : (
                                <img
                                    src={mediaUrl}
                                    alt="About Me"
                                    className="w-full h-auto max-h-[600px] object-cover"
                                />
                            )}
                        </div>
                    )}

                    <div className="prose prose-invert prose-lg max-w-none">
                        <ReactMarkdown>{content}</ReactMarkdown>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
