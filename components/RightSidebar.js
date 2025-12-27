'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getCurrentUser } from '@/utils/auth';
import { api } from '@/utils/api';

export default function RightSidebar() {
    const [user, setUser] = useState(null);
    const [trendingTags, setTrendingTags] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const currentUser = getCurrentUser();
        setUser(currentUser);
        fetchTrendingTags();
    }, []);

    const fetchTrendingTags = async () => {
        try {
            setLoading(true);
            const response = await api.getDoubtStats();
            if (response.success && response.data.topTags) {
                setTrendingTags(response.data.topTags.slice(0, 5)); // Top 5 tags
            }
        } catch (err) {
            console.error('Error fetching trending tags:', err);
        } finally {
            setLoading(false);
        }
    };

    const getCategoryForTag = (tag) => {
        const techTags = ['react', 'reactjs', 'vue', 'angular', 'svelte'];
        const programmingTags = ['dsa', 'algorithms', 'datastructures', 'python', 'java', 'javascript'];
        const developmentTags = ['nextjs', 'nodejs', 'backend', 'frontend', 'fullstack'];

        const lowerTag = tag.toLowerCase();
        if (techTags.some(t => lowerTag.includes(t))) return 'Tech';
        if (programmingTags.some(t => lowerTag.includes(t))) return 'Programming';
        if (developmentTags.some(t => lowerTag.includes(t))) return 'Development';
        return 'General';
    };

    return (
        <aside className="hidden lg:block w-80 p-4 space-y-4">
            {/* Search Bar */}
            <div className="relative">
                <input
                    type="text"
                    placeholder="Search"
                    className="w-full px-4 py-2 pl-10 rounded-full bg-x-card border border-x-border text-x-text placeholder-x-text-secondary focus:outline-none focus:border-x-blue transition-all duration-300"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-x-text-secondary">🔍</span>
            </div>

            {/* Login Prompt - Only show if user is NOT logged in */}
            {!user && (
                <div className="glass-card rounded-xl p-4">
                    <h2 className="text-xl font-bold text-x-text mb-2">Login to post your doubts</h2>
                    <p className="text-sm text-x-text-secondary mb-4">
                        Join CodeShack to ask questions and get answers from experienced mentors.
                    </p>
                    <Link
                        href="/login"
                        className="block w-full text-center px-4 py-2 rounded-full bg-x-blue text-white font-semibold hover:bg-x-blue/90 transition-all duration-300 hover-glow"
                    >
                        Login
                    </Link>
                </div>
            )}

            {/* What's happening */}
            <div className="glass-card rounded-xl p-4">
                <h2 className="text-lg font-bold text-x-text mb-3">What's happening</h2>

                {loading ? (
                    <div className="text-center py-4">
                        <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-x-blue"></div>
                    </div>
                ) : trendingTags.length > 0 ? (
                    <div className="space-y-4">
                        {trendingTags.map((tagData, index) => (
                            <div key={index} className="hover:bg-x-hover p-2 rounded-lg transition-all duration-300 cursor-pointer">
                                <p className="text-xs text-x-text-secondary">Trending in {getCategoryForTag(tagData._id)}</p>
                                <p className="text-sm font-semibold text-x-text">#{tagData._id}</p>
                                <p className="text-xs text-x-text-secondary">{tagData.count} {tagData.count === 1 ? 'post' : 'posts'}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-4">
                        <p className="text-sm text-x-text-secondary">No trending tags yet</p>
                    </div>
                )}
            </div>
        </aside>
    );
}
