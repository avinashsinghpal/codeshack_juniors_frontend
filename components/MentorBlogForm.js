import { useState } from 'react';
import Tag from './Tag';

export default function MentorBlogForm({ user, availableTags }) {
    const [postTitle, setPostTitle] = useState('');
    const [blogExcerpt, setBlogExcerpt] = useState('');
    const [postContent, setPostContent] = useState('');
    const [selectedTags, setSelectedTags] = useState([]);
    const [showTagSelector, setShowTagSelector] = useState(false);
    const [blogCategory, setBlogCategory] = useState('guidance');
    const [isPosting, setIsPosting] = useState(false);
    const [postError, setPostError] = useState(null);

    const blogCategories = [
        { value: 'guidance', label: '📚 Guidance', color: 'bg-blue-500/20 text-blue-400' },
        { value: 'tutorial', label: '💡 Tutorial', color: 'bg-purple-500/20 text-purple-400' },
        { value: 'career', label: '🎯 Career Advice', color: 'bg-green-500/20 text-green-400' },
        { value: 'resources', label: '🔗 Resources', color: 'bg-orange-500/20 text-orange-400' },
        { value: 'experience', label: '✨ Experience', color: 'bg-pink-500/20 text-pink-400' },
    ];

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
        setPostError(null);

        // Validation
        if (!postTitle.trim()) {
            setPostError('Please enter a title for your blog');
            return;
        }

        if (postTitle.trim().length < 10) {
            setPostError('Title must be at least 10 characters');
            return;
        }

        if (!blogExcerpt.trim()) {
            setPostError('Please enter a brief excerpt/summary');
            return;
        }

        if (blogExcerpt.trim().length < 20) {
            setPostError('Excerpt must be at least 20 characters');
            return;
        }

        if (!postContent.trim()) {
            setPostError('Please enter the blog content');
            return;
        }

        if (postContent.trim().length < 50) {
            setPostError('Blog content must be at least 50 characters');
            return;
        }

        try {
            setIsPosting(true);

            // TODO: Replace with actual blog API call when backend is ready
            console.log('Blog post data:', {
                title: postTitle.trim(),
                excerpt: blogExcerpt.trim(),
                content: postContent.trim(),
                category: blogCategory,
                tags: selectedTags
            });

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Clear form
            setPostTitle('');
            setBlogExcerpt('');
            setPostContent('');
            setSelectedTags([]);
            setBlogCategory('guidance');
            setShowTagSelector(false);

            alert('Blog posted successfully! (Frontend only - backend integration pending)');
        } catch (err) {
            console.error('Error posting blog:', err);
            setPostError(err.message || 'Failed to post blog. Please try again.');
        } finally {
            setIsPosting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="flex gap-2 md:gap-3">
                <div className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full bg-x-blue/20 flex items-center justify-center text-base md:text-lg">
                    {user ? user.name.charAt(0).toUpperCase() : 'M'}
                </div>

                <div className="flex-1">
                    {/* Category Selection */}
                    <div className="mb-3">
                        <label className="text-xs text-x-text-secondary mb-1 block">
                            Blog Category
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {blogCategories.map((cat) => (
                                <button
                                    key={cat.value}
                                    type="button"
                                    onClick={() => setBlogCategory(cat.value)}
                                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${blogCategory === cat.value
                                            ? cat.color + ' border-2 border-current'
                                            : 'bg-x-card text-x-text-secondary border border-x-border hover:border-x-blue'
                                        }`}
                                >
                                    {cat.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Blog Title */}
                    <input
                        type="text"
                        value={postTitle}
                        onChange={(e) => setPostTitle(e.target.value)}
                        placeholder="Blog title (min 10 characters)..."
                        maxLength={200}
                        className="w-full bg-transparent text-x-text text-lg md:text-xl font-bold placeholder-x-text-secondary focus:outline-none mb-3 border-b border-x-border pb-2"
                    />

                    {/* Blog Excerpt */}
                    <textarea
                        value={blogExcerpt}
                        onChange={(e) => setBlogExcerpt(e.target.value)}
                        placeholder="Brief summary/excerpt (min 20 characters)..."
                        rows={2}
                        maxLength={300}
                        className="w-full bg-transparent text-x-text text-sm placeholder-x-text-secondary focus:outline-none resize-none mb-3 border-b border-x-border pb-2"
                    />

                    {/* Blog Content */}
                    <textarea
                        value={postContent}
                        onChange={(e) => setPostContent(e.target.value)}
                        placeholder="Write your blog content here (min 50 characters)... Share guidance, tutorials, career advice, or your experiences to help juniors."
                        rows={6}
                        maxLength={10000}
                        className="w-full bg-transparent text-x-text text-sm md:text-base placeholder-x-text-secondary focus:outline-none resize-none"
                    />

                    {/* Tag Selector */}
                    {showTagSelector && (
                        <div className="mt-3 p-3 border border-x-border rounded-xl bg-x-card">
                            <p className="text-sm text-x-text-secondary mb-2">
                                Add tags (max 5):
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {availableTags.slice(0, 12).map((tag) => (
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

                    {/* Selected Tags */}
                    {selectedTags.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                            {selectedTags.map((tag) => (
                                <Tag key={tag}>{tag}</Tag>
                            ))}
                        </div>
                    )}

                    {/* Error Message */}
                    {postError && (
                        <div className="mt-2 p-2 bg-red-500/10 border border-red-500/30 rounded-lg">
                            <p className="text-red-500 text-sm">{postError}</p>
                        </div>
                    )}

                    {/* Actions */}
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
                                Title: {postTitle.length}/200 · Excerpt: {blogExcerpt.length}/300 · Content: {postContent.length}/10000
                            </span>
                        </div>

                        <button
                            type="submit"
                            disabled={isPosting || !postTitle.trim() || !blogExcerpt.trim() || !postContent.trim()}
                            className={`px-4 md:px-6 py-2 rounded-full font-semibold transition-colors tap-target ${isPosting || !postTitle.trim() || !blogExcerpt.trim() || !postContent.trim()
                                    ? 'bg-x-blue/50 text-white/50 cursor-not-allowed'
                                    : 'bg-x-blue text-white hover:bg-x-blue/90'
                                }`}
                        >
                            {isPosting ? 'Publishing...' : 'Publish Blog'}
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
}
