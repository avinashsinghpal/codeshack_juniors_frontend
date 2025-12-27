'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import RightSidebar from '@/components/RightSidebar';
import PageLoadingAnimation from '@/components/PageLoadingAnimation';
import { getCurrentUser } from '@/utils/auth';
import { api } from '@/utils/api';

export default function SpacePage() {
    const router = useRouter();
    const [newPost, setNewPost] = useState('');
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isPosting, setIsPosting] = useState(false);
    const [postError, setPostError] = useState(null);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const currentUser = getCurrentUser();
        setUser(currentUser);

        if (!currentUser) {
            router.push('/login');
        } else if (currentUser.role !== 'junior') {
            // Only juniors can access this space
            router.push('/');
        } else {
            fetchPosts();
        }
    }, [router]);

    const fetchPosts = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.getJuniorSpacePosts(1, 20);

            if (response.success) {
                setPosts(response.data);
            }
        } catch (err) {
            console.error('Error fetching posts:', err);
            setError(err.message || 'Failed to load posts');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setPostError(null);

        if (!newPost.trim()) {
            setPostError('Post content cannot be empty');
            return;
        }

        if (newPost.trim().length > 3000) {
            setPostError('Post content cannot exceed 3000 characters');
            return;
        }

        try {
            setIsPosting(true);
            const response = await api.createJuniorSpacePost(newPost.trim());

            if (response.success) {
                setNewPost('');
                // Refresh posts to show the new one
                await fetchPosts();
            }
        } catch (err) {
            console.error('Error creating post:', err);
            setPostError(err.message || 'Failed to create post. Please try again.');
        } finally {
            setIsPosting(false);
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-x-black">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-x-blue"></div>
            </div>
        );
    }

    return (
        <div className="flex bg-x-black min-h-screen justify-center">
            <Sidebar />

            <main className="flex-1 border-r border-x-border max-w-2xl relative">
                <PageLoadingAnimation />
                <div className="sticky top-0 z-10 bg-x-black/80 backdrop-blur-md border-b border-x-border px-4 py-4">
                    <h1 className="text-xl font-bold text-x-text">Junior Space</h1>
                    <p className="text-sm text-x-text-secondary mt-1">A safe space for juniors only 🚀</p>
                </div>

                {/* Post Compose */}
                <div className="p-4 border-b border-x-border bg-x-card">
                    <form onSubmit={handleSubmit}>
                        <textarea
                            value={newPost}
                            onChange={(e) => setNewPost(e.target.value)}
                            placeholder="What's on your mind? Share your thoughts, achievements, or questions..."
                            rows={3}
                            maxLength={3000}
                            className="w-full px-4 py-3 bg-x-black border border-x-border rounded-xl text-x-text placeholder-x-text-secondary focus:outline-none focus:border-x-blue transition-colors resize-none mb-3"
                        />

                        {postError && (
                            <div className="mb-3 p-2 bg-red-500/10 border border-red-500/30 rounded-lg">
                                <p className="text-red-500 text-sm">{postError}</p>
                            </div>
                        )}

                        <div className="flex items-center justify-between">
                            <span className="text-xs text-x-text-secondary">
                                {newPost.length}/3000 characters
                            </span>
                            <button
                                type="submit"
                                disabled={isPosting || !newPost.trim()}
                                className={`px-6 py-2 rounded-full font-semibold transition-colors ${isPosting || !newPost.trim()
                                    ? 'bg-x-card text-x-text-secondary cursor-not-allowed border border-x-border'
                                    : 'bg-x-blue text-white hover:bg-x-blue/90'
                                    }`}
                            >
                                {isPosting ? 'Posting...' : 'Post'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Discussion Feed */}
                {loading ? (
                    <div className="p-8 text-center">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-x-blue"></div>
                        <p className="text-x-text-secondary mt-4">Loading posts...</p>
                    </div>
                ) : error ? (
                    <div className="p-8 text-center">
                        <p className="text-red-500 mb-4">{error}</p>
                        <button
                            onClick={fetchPosts}
                            className="px-4 py-2 bg-x-blue text-white rounded-full hover:bg-x-blue/90 transition-colors"
                        >
                            Retry
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="bg-x-card">
                            {posts.map((post) => {
                                const authorName = post.juniorId?.name || 'Anonymous';
                                return (
                                    <div key={post._id} className="p-4 border-b border-x-border hover:bg-x-hover transition-colors">
                                        <div className="flex items-start gap-3">
                                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-x-success/20 flex items-center justify-center text-lg">
                                                {authorName.charAt(0).toUpperCase()}
                                            </div>

                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="font-semibold text-x-text">{authorName}</span>
                                                    <span className="text-x-text-secondary text-sm">
                                                        · {new Date(post.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>

                                                <p className="text-x-text mb-3 whitespace-pre-wrap">{post.content}</p>

                                                <div className="flex items-center gap-4 text-x-text-secondary text-sm">
                                                    <button className="flex items-center gap-2 hover:text-x-blue transition-all duration-200 group">
                                                        <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                                        </svg>
                                                        <span>Reply</span>
                                                    </button>
                                                    <button className="flex items-center gap-2 hover:text-red-500 transition-all duration-200 group">
                                                        <svg className="w-5 h-5 group-hover:scale-110 group-hover:fill-red-500 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                                        </svg>
                                                        <span>Like</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {posts.length === 0 && (
                            <div className="p-8 text-center">
                                <p className="text-x-text-secondary">No discussions yet. Start the conversation!</p>
                            </div>
                        )}
                    </>
                )}
            </main>

            <RightSidebar />
        </div>
    );
}
