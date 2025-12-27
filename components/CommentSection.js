'use client';

import { useState, useEffect } from 'react';
import { api } from '@/utils/api';
import { getCurrentUser } from '@/utils/auth';

export default function CommentSection({ doubtId, doubt }) {
    const [comments, setComments] = useState([]);
    const [commentContent, setCommentContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const user = getCurrentUser();

    useEffect(() => {
        if (doubtId) {
            fetchComments();
        }
    }, [doubtId]);

    const fetchComments = async () => {
        try {
            setLoading(true);
            const response = await api.getCommentsByDoubt(doubtId);
            if (response.success) {
                setComments(response.data || []);
            }
        } catch (err) {
            console.error('Error fetching comments:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitComment = async (e) => {
        e.preventDefault();
        setError(null);

        if (!commentContent.trim()) {
            setError('Please enter a comment');
            return;
        }

        try {
            setIsSubmitting(true);
            const response = await api.createComment(doubtId, commentContent.trim());

            if (response.success) {
                setCommentContent('');
                await fetchComments();
            }
        } catch (err) {
            console.error('Error posting comment:', err);
            setError(err.message || 'Failed to post comment');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSubmitAnswerReply = async (answerId, content) => {
        try {
            const response = await api.createAnswerReply(doubtId, answerId, content);
            if (response.success) {
                await fetchComments();
            }
        } catch (err) {
            console.error('Error posting answer reply:', err);
            throw err;
        }
    };

    if (loading) {
        return (
            <div className="p-4 text-center">
                <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-x-blue"></div>
            </div>
        );
    }

    return (
        <div className="border-b-4 border-x-border">
            <div className="px-4 py-3 bg-x-card border-b border-x-border">
                <h3 className="text-lg font-bold text-x-text">
                    Discussion ({comments.length})
                </h3>
            </div>

            {/* Comment Form */}
            <div className="p-4 border-b border-x-border">
                <form onSubmit={handleSubmitComment}>
                    <div className="flex gap-3">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-x-blue/20 flex items-center justify-center text-lg">
                            {user?.name?.charAt(0).toUpperCase() || 'U'}
                        </div>

                        <div className="flex-1">
                            <textarea
                                value={commentContent}
                                onChange={(e) => setCommentContent(e.target.value)}
                                placeholder="Add a comment to this doubt..."
                                rows={3}
                                maxLength={2000}
                                className="w-full bg-transparent text-x-text placeholder-x-text-secondary focus:outline-none resize-none border border-x-border rounded-lg p-3"
                            />

                            {error && (
                                <div className="mt-2 p-2 bg-red-500/10 border border-red-500/30 rounded-lg">
                                    <p className="text-red-500 text-sm">{error}</p>
                                </div>
                            )}

                            <div className="flex items-center justify-between mt-2">
                                <span className="text-xs text-x-text-secondary">
                                    {commentContent.length}/2000 characters
                                </span>
                                <button
                                    type="submit"
                                    disabled={isSubmitting || !commentContent.trim()}
                                    className={`px-6 py-2 rounded-full font-semibold transition-colors ${isSubmitting || !commentContent.trim()
                                        ? 'bg-x-blue/50 text-white/50 cursor-not-allowed'
                                        : 'bg-x-blue text-white hover:bg-x-blue/90'
                                        }`}
                                >
                                    {isSubmitting ? 'Posting...' : 'Comment'}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>

            {/* Comments List */}
            {comments.length === 0 ? (
                <div className="p-8 text-center">
                    <p className="text-x-text-secondary">No comments yet. Be the first to comment!</p>
                </div>
            ) : (
                <div>
                    {comments.map((comment) => (
                        <CommentItem
                            key={comment._id}
                            comment={comment}
                            doubt={doubt}
                            onReplySubmit={handleSubmitAnswerReply}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

function CommentItem({ comment, doubt, onReplySubmit }) {
    const user = getCurrentUser();
    const commenterName = comment.userId?.name || 'Anonymous';
    const isDoubtPoster = user?.userId === doubt?.juniorId?._id;

    return (
        <div className="p-4 border-b border-x-border hover:bg-x-card/30 transition-colors">
            <div className="flex gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-x-blue/20 flex items-center justify-center text-lg">
                    {commenterName.charAt(0).toUpperCase()}
                </div>

                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-x-text">{commenterName}</span>
                        <span className="text-x-text-secondary text-sm">
                            · {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                    </div>

                    <p className="text-x-text text-base whitespace-pre-wrap">{comment.content}</p>

                    {/* Show replies if any */}
                    {comment.replies && comment.replies.length > 0 && (
                        <div className="mt-3 ml-6 space-y-3">
                            {comment.replies.map((reply) => {
                                const replyName = reply.userId?.name || 'Anonymous';
                                return (
                                    <div key={reply._id} className="flex gap-2">
                                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-x-blue/20 flex items-center justify-center text-sm">
                                            {replyName.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-semibold text-x-text text-sm">{replyName}</span>
                                                <span className="text-x-text-secondary text-xs">
                                                    · {new Date(reply.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <p className="text-x-text text-sm whitespace-pre-wrap">{reply.content}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
