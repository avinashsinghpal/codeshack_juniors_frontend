'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import RightSidebar from '@/components/RightSidebar';
import DoubtCard from '@/components/DoubtCard';
import Tag from '@/components/Tag';
import PageLoadingAnimation from '@/components/PageLoadingAnimation';
import MentorBlogForm from '@/components/MentorBlogForm';
import { availableTags } from '@/data/mockData';
import { getCurrentUser } from '@/utils/auth';
import { api } from '@/utils/api';

export default function HomePage() {
    const router = useRouter();
    const [postContent, setPostContent] = useState('');
    const [postTitle, setPostTitle] = useState('');
    const [selectedTags, setSelectedTags] = useState([]);
    const [showTagSelector, setShowTagSelector] = useState(false);
    const [user, setUser] = useState(null);
    const [doubts, setDoubts] = useState([]);
    const [isPosting, setIsPosting] = useState(false);
    const [isLoadingDoubts, setIsLoadingDoubts] = useState(true);
    const [error, setError] = useState(null);
    const [postError, setPostError] = useState(null);

    useEffect(() => {
        const currentUser = getCurrentUser();
        setUser(currentUser);

        // Redirect to landing if not authenticated
        if (!currentUser) {
            router.push('/landing');
        } else {
            fetchDoubts();
        }
    }, [router]);

    const fetchDoubts = async () => {
        try {
            setIsLoadingDoubts(true);
            setError(null);
            const response = await api.getDoubts(1, 10);

            if (response.success) {
                setDoubts(response.data);
            }
        } catch (err) {
            console.error('Error fetching doubts:', err);
            setError(err.message || 'Failed to load doubts');
        } finally {
            setIsLoadingDoubts(false);
        }
    };

    const toggleTag = (tag) => {
        if (selectedTags.includes(tag)) {
            setSelectedTags(selectedTags.filter(t => t !== tag));
        } else {
            if (selectedTags.length < 5) {
                setSelectedTags([...selectedTags, tag]);
            }
        }
    };

    const handlePost = async (e) => {
        e.preventDefault();
        setPostError(null);

        // Validation
        if (!postTitle.trim()) {
            setPostError('Please enter a title for your doubt');
            return;
        }

        if (postTitle.trim().length < 10) {
            setPostError('Title must be at least 10 characters');
            return;
        }

        if (!postContent.trim()) {
            setPostError('Please enter a description for your doubt');
            return;
        }

        if (postContent.trim().length < 20) {
            setPostError('Description must be at least 20 characters');
            return;
        }

        if (selectedTags.length === 0) {
            setPostError('Please select at least one tag');
            return;
        }

        try {
            setIsPosting(true);
            console.log('Posting doubt with:', {
                title: postTitle.trim(),
                description: postContent.trim(),
                tags: selectedTags
            });

            const response = await api.createDoubt(
                postTitle.trim(),
                postContent.trim(),
                selectedTags
            );

            console.log('Doubt post response:', response);

            if (response.success) {
                // Clear form
                setPostTitle('');
                setPostContent('');
                setSelectedTags([]);
                setShowTagSelector(false);

                // Refresh doubts feed
                await fetchDoubts();
            } else {
                setPostError(response.message || 'Failed to post doubt');
            }
        } catch (err) {
            console.error('Error posting doubt:', err);
            const errorMessage = err.message || 'Failed to post doubt. Please try again.';
            setPostError(errorMessage);

            // Show detailed error in console for debugging
            console.error('Full error details:', {
                error: err,
                message: err.message,
                stack: err.stack
            });
        } finally {
            setIsPosting(false);
        }
    };

    return (
        <>
            <div className="flex bg-x-black min-h-screen justify-center">
                <Sidebar />

                <main className="flex-1 border-r border-x-border max-w-2xl relative pb-16 md:pb-0">
                    <PageLoadingAnimation />

                    {/* Header */}
                    <div className="sticky top-0 md:top-0 mt-14 md:mt-0 z-10 bg-x-black/80 backdrop-blur-md border-b border-x-border">
                        <div className="flex items-center justify-between px-4 py-3">
                            <h1 className="text-xl font-bold text-x-text">
                                {(user?.role === 'mentor' || user?.role === 'admin') ? 'Share Your Knowledge' : 'Home'}
                            </h1>
                        </div>
                    </div>

                    {/* Post Composer - Role Based */}
                    <div className="border-b border-x-border p-3 md:p-4">
                        {(user?.role === 'mentor' || user?.role === 'admin') ? (
                            <MentorBlogForm user={user} availableTags={availableTags} />
                        ) : (
                            <form onSubmit={handlePost}>
                                <div className="flex gap-2 md:gap-3">
                                    <div className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full bg-x-blue/20 flex items-center justify-center text-base md:text-lg">
                                        {user ? user.name.charAt(0).toUpperCase() : 'U'}
                                    </div>

                                    <div className="flex-1">
                                        {/* Title Input */}
                                        <input
                                            type="text"
                                            value={postTitle}
                                            onChange={(e) => setPostTitle(e.target.value)}
                                            placeholder="Title of your doubt (min 10 characters)..."
                                            maxLength={200}
                                            className="w-full bg-transparent text-x-text text-base md:text-lg placeholder-x-text-secondary focus:outline-none mb-2 border-b border-x-border pb-2"
                                        />

                                        {/* Description Textarea */}
                                        <textarea
                                            value={postContent}
                                            onChange={(e) => setPostContent(e.target.value)}
                                            placeholder="Describe your doubt in detail (min 20 characters)..."
                                            rows={3}
                                            maxLength={5000}
                                            className="w-full bg-transparent text-x-text text-sm md:text-base placeholder-x-text-secondary focus:outline-none resize-none"
                                        />

                                        {showTagSelector && (
                                            <div className="mt-3 p-3 border border-x-border rounded-xl bg-x-card">
                                                <p className="text-sm text-x-text-secondary mb-2">
                                                    Select tags (max 5):
                                                </p>
                                                <div className="flex flex-wrap gap-2">
                                                    {availableTags.slice(0, 8).map((tag) => (
                                                        <button
                                                            key={tag}
                                                            type="button"
                                                            onClick={() => toggleTag(tag)}
                                                            className={`px-3 py-1 rounded-full text-sm transition-colors tap-target ${selectedTags.includes(tag)
                                                                ? 'bg-x-blue text-white'
                                                                : 'bg-x-black border border-x-border text-x-text-secondary hover:border-x-blue'
                                                                }`}
                                                        >
                                                            {tag}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {selectedTags.length > 0 && (
                                            <div className="mt-2 flex flex-wrap gap-2">
                                                {selectedTags.map((tag) => (
                                                    <Tag key={tag}>{tag}</Tag>
                                                ))}
                                            </div>
                                        )}

                                        {postError && (
                                            <div className="mt-2 p-2 bg-red-500/10 border border-red-500/30 rounded-lg">
                                                <p className="text-red-500 text-sm">{postError}</p>
                                            </div>
                                        )}

                                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-x-border">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => setShowTagSelector(!showTagSelector)}
                                                    className="p-2 rounded-full hover:bg-x-blue/10 text-x-blue transition-colors tap-target"
                                                    title="Add tags"
                                                >
                                                    <span className="text-lg">#</span>
                                                </button>
                                                <span className="text-xs text-x-text-secondary">
                                                    {postTitle.length}/200 · {postContent.length}/5000
                                                </span>
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={isPosting || !postTitle.trim() || !postContent.trim() || selectedTags.length === 0}
                                                className={`px-4 md:px-6 py-2 rounded-full font-semibold transition-colors tap-target ${isPosting || !postTitle.trim() || !postContent.trim() || selectedTags.length === 0
                                                    ? 'bg-x-blue/50 text-white/50 cursor-not-allowed'
                                                    : 'bg-x-blue text-white hover:bg-x-blue/90'
                                                    }`}
                                            >
                                                {isPosting ? 'Posting...' : 'Post Doubt'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        )}
                    </div>

                    {/* Doubts Feed */}
                    {isLoadingDoubts ? (
                        <div className="p-8 text-center">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-x-blue"></div>
                            <p className="text-x-text-secondary mt-4">Loading doubts...</p>
                        </div>
                    ) : error ? (
                        <div className="p-8 text-center">
                            <p className="text-red-500 mb-4">{error}</p>
                            <button
                                onClick={fetchDoubts}
                                className="px-4 py-2 bg-x-blue text-white rounded-full hover:bg-x-blue/90 transition-colors"
                            >
                                Retry
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="bg-x-card">
                                {doubts.map((doubt) => (
                                    <DoubtCard key={doubt._id} doubt={doubt} />
                                ))}
                            </div>

                            {doubts.length === 0 && (
                                <div className="p-8 text-center">
                                    <p className="text-x-text-secondary">No doubts posted yet. Be the first to ask!</p>
                                </div>
                            )}
                        </>
                    )}
                </main>

                <RightSidebar />
            </div>

        </>
    );
}
