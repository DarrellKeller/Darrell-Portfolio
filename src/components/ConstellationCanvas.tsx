import React, { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Post } from '../types';

interface ConstellationCanvasProps {
    posts: Post[];
    onPostClick: (post: Post) => void;
}

export interface ProcessedPost extends Post {
    calculatedX: number;
    calculatedY: number;
}

export const ConstellationCanvas: React.FC<ConstellationCanvasProps> = ({ posts, onPostClick }) => {
    const [hoveredPost, setHoveredPost] = useState<Post | null>(null);
    const [mouseYear, setMouseYear] = useState<number | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Calculate positions based on date
    const processedPosts = useMemo(() => {
        if (posts.length === 0) return [];

        const sorted = [...posts].sort((a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );

        const timestamps = sorted.map(p => new Date(p.created_at).getTime());
        const minTime = Math.min(...timestamps);
        const maxTime = Math.max(...timestamps);
        const timeRange = maxTime - minTime || 1; // Avoid divide by zero

        return sorted.map(post => {
            const date = new Date(post.created_at);
            const time = date.getTime();

            // X Position: Chronological (5% to 95% padding)
            const x = 5 + ((time - minTime) / timeRange) * 90;

            // Y Position: Day of week (Sunday=0 to Saturday=6)
            // Sunday (0) -> Top (10%)
            // Saturday (6) -> Bottom (90%)
            const day = date.getDay(); // 0-6
            const hour = date.getHours();
            const minute = date.getMinutes();

            // Calculate base Y from day (0-6 mapped to 10-90)
            // 0 -> 10, 6 -> 90
            // Step size = (90 - 10) / 6 = 13.33
            const dayY = 10 + (day * (80 / 6));

            // Add time variation (up to ~10% of the gap between days)
            // 24 hours * 60 minutes = 1440 minutes
            const timeOfDay = (hour * 60 + minute) / 1440;
            const timeOffset = timeOfDay * 10;

            const y = dayY + timeOffset;

            return {
                ...post,
                calculatedX: x,
                calculatedY: y
            };
        });
    }, [posts]);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!containerRef.current || posts.length === 0) return;

        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percentage = x / rect.width;

        // Estimate year based on X position
        const timestamps = posts.map(p => new Date(p.created_at).getTime());
        const minTime = Math.min(...timestamps);
        const maxTime = Math.max(...timestamps);

        if (minTime === maxTime) {
            setMouseYear(new Date(minTime).getFullYear());
            return;
        }

        const estimatedTime = minTime + (percentage * (maxTime - minTime));
        setMouseYear(new Date(estimatedTime).getFullYear());
    };

    return (
        <div
            ref={containerRef}
            className="relative w-full h-full bg-night overflow-hidden"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setMouseYear(null)}
        >
            {/* Background Stars (Static or slowly moving) */}
            <div className="absolute inset-0 opacity-50 pointer-events-none">
                {[...Array(50)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute bg-white rounded-full"
                        style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            width: `${Math.random() * 2 + 1}px`,
                            height: `${Math.random() * 2 + 1}px`,
                            opacity: Math.random(),
                        }}
                    />
                ))}
            </div>

            {/* Year Indicator */}
            <AnimatePresence>
                {mouseYear && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 0.3, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="absolute bottom-10 right-10 text-9xl font-bold text-white pointer-events-none select-none"
                    >
                        {mouseYear}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Constellation SVG */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <polyline
                    points={processedPosts.map(p => `${p.calculatedX}%,${p.calculatedY}%`).join(' ')}
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.2)"
                    strokeWidth="1"
                />
            </svg>

            {/* Interactive Stars */}
            {processedPosts.map((post) => (
                <motion.div
                    key={post.id}
                    className="absolute cursor-pointer group"
                    style={{
                        left: `${post.calculatedX}%`,
                        top: `${post.calculatedY}%`,
                        transform: 'translate(-50%, -50%)' // Center the star on the coordinate
                    }}
                    whileHover={{ scale: 1.5 }}
                    onClick={() => onPostClick(post)}
                    onMouseEnter={() => setHoveredPost(post)}
                    onMouseLeave={() => setHoveredPost(null)}
                >
                    {/* The Star */}
                    <div className="w-4 h-4 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)] relative z-10" />

                    {/* Pulse Effect */}
                    <div className="absolute inset-0 bg-white rounded-full animate-ping opacity-75" />

                    {/* Tooltip */}
                    {hoveredPost?.id === post.id && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute top-6 left-1/2 -translate-x-1/2 bg-gray-900 border border-gray-700 p-3 rounded-lg w-48 z-20 pointer-events-none"
                        >
                            <h3 className="text-white font-bold text-sm">{post.title}</h3>
                            <p className="text-gray-400 text-xs mt-1">
                                {new Date(post.created_at).toLocaleDateString()}
                            </p>
                        </motion.div>
                    )}
                </motion.div>
            ))}

            <div className="absolute bottom-4 left-0 right-0 text-center text-gray-500 text-sm pointer-events-none">
                Click a star to explore the timeline
            </div>
        </div>
    );
};
