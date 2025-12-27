'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import RightSidebar from '@/components/RightSidebar';
import Tag from '@/components/Tag';
import PageLoadingAnimation from '@/components/PageLoadingAnimation';
import { availableTags } from '@/data/mockData';
import { getCurrentUser } from '@/utils/auth';
import { api } from '@/utils/api';

export default function AskPage() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [selectedTags, setSelectedTags] = useState([]);
    const [isPosting, setIsPosting] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const currentUser = getCurrentUser();
        setUser(currentUser);

        if (!currentUser) {
            router.push('/landing');
        }
    }, [router]);

    const toggleTag = (tag) => {
        if (selectedTags.includes(tag)) {
            setSelectedTags(selectedTags.filter(t => t !== tag));
        } else {
            if (selectedTags.length < 5) {
                setSelectedTags([...selectedTags, tag]);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        // Validation
        if (!title.trim()) {
            setError('Please enter a title for your doubt');
            return;
        }

        if (title.trim().length < 10) {
            setError('Title must be at least 10 characters');
            return;
        }

        if (!description.trim()) {
            setError('Please enter a description for your doubt');
            return;
        }

        if (description.trim().length < 20) {
            setError('Description must be at least 20 characters');
            return;
        }

        if (selectedTags.length === 0) {
            setError('Please select at least one tag');
            return;
        }

        try {
            setIsPosting(true);
            console.log('Posting doubt:', { title, description, tags: selectedTags });

            const response = await api.createDoubt(
                title.trim(),
                description.trim(),
                selectedTags
            );

            console.log('Response:', response);

            if (response.success) {
                // Redirect to doubts page
                router.push('/doubts');
            } else {
                setError(response.message || 'Failed to post doubt');
            }
        } catch (err) {
            console.error('Error posting doubt:', err);
            setError(err.message || 'Failed to post doubt. Please try again.');
        } finally {
            setIsPosting(false);
        }
    };

    const isFormValid = title.trim() && description.trim() && selectedTags.length > 0;

    if (!user) {
        return null; // Will redirect
    }

    return (
        <div className="flex bg-x-black min-h-screen justify-center">
            <Sidebar />

            <main className="flex-1 border-r border-x-border max-w-2xl relative">
                <PageLoadingAnimation />
                <div className="sticky top-0 z-10 bg-x-black/80 backdrop-blur-md border-b border-x-border px-4 py-4">
                    <h1 className="text-xl font-bold text-x-text">Ask a Doubt</h1>
                </div>

                <div className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="What's your doubt? (min 10 characters)"
                                maxLength={200}
                                className="w-full px-4 py-3 text-xl bg-transparent border-b border-x-border text-x-text placeholder-x-text-secondary focus:outline-none focus:border-x-blue transition-colors"
                            />
                            <p className="text-xs text-x-text-secondary mt-1">
                                {title.length}/200 characters
                            </p>
                        </div>

                        <div>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Describe your doubt in detail (min 20 characters)..."
                                rows={8}
                                maxLength={5000}
                                className="w-full px-4 py-3 bg-transparent border border-x-border rounded-xl text-x-text placeholder-x-text-secondary focus:outline-none focus:border-x-blue transition-colors resize-none"
                            />
                            <p className="text-xs text-x-text-secondary mt-1">
                                {description.length}/5000 characters
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-x-text mb-3">
                                Select Tags (max 5)
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {availableTags.map((tag) => (
                                    <button
                                        key={tag}
                                        type="button"
                                        onClick={() => toggleTag(tag)}
                                        disabled={!selectedTags.includes(tag) && selectedTags.length >= 5}
                                        className={`px-3 py-1.5 rounded-full text-sm transition-colors ${selectedTags.includes(tag)
                                            ? 'bg-x-blue text-white'
                                            : selectedTags.length >= 5
                                                ? 'bg-x-card border border-x-border text-x-text-secondary/50 cursor-not-allowed'
                                                : 'bg-x-card border border-x-border text-x-text-secondary hover:border-x-blue'
                                            }`}
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                                <p className="text-red-500 text-sm">{error}</p>
                            </div>
                        )}

                        <div className="flex justify-between items-center pt-4 border-t border-x-border">
                            <p className="text-sm text-x-text-secondary">
                                {selectedTags.length} tag{selectedTags.length !== 1 ? 's' : ''} selected
                            </p>
                            <button
                                type="submit"
                                disabled={!isFormValid || isPosting}
                                className={`px-8 py-3 rounded-full font-semibold transition-colors ${isFormValid && !isPosting
                                    ? 'bg-x-blue text-white hover:bg-x-blue/90'
                                    : 'bg-x-card text-x-text-secondary cursor-not-allowed'
                                    }`}
                            >
                                {isPosting ? 'Posting...' : 'Post Doubt'}
                            </button>
                        </div>
                    </form>
                </div>
            </main>

            <RightSidebar />
        </div>
    );
}
