'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import RightSidebar from '@/components/RightSidebar';
import MentorBadge from '@/components/MentorBadge';
import VerifiedBadge from '@/components/VerifiedBadge';
import Tag from '@/components/Tag';
import CommentSection from '@/components/CommentSection';
import ConfirmDialog from '@/components/ConfirmDialog';
import { getCurrentUser, isMentor, isJunior, isAdmin } from '@/utils/auth';
import { api } from '@/utils/api';

// Separate component for Answer Item to avoid hooks in map
function AnswerItem({ answer, doubt, user, doubtId, onRefresh, onDeleteAnswer }) {
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [replyContent, setReplyContent] = useState('');
    const [isSubmittingReply, setIsSubmittingReply] = useState(false);
    const [replyError, setReplyError] = useState(null);
    const [answerReplies, setAnswerReplies] = useState([]);
    const [loadingReplies, setLoadingReplies] = useState(true);

    // Upvote state
    const [isUpvoted, setIsUpvoted] = useState(false);
    const [upvoteCount, setUpvoteCount] = useState(answer.upvoteCount || 0);
    const [isUpvoting, setIsUpvoting] = useState(false);

    const mentorName = answer.mentorId?.name || 'Anonymous Mentor';
    const mentorId = answer.mentorId?._id || answer.mentorId;
    // Fix: Check both possible ID structures
    const doubtPosterId = doubt?.juniorId?._id || doubt?.juniorId;
    const currentUserId = user?.id || user?.userId || user?._id;
    const isDoubtPoster = currentUserId === doubtPosterId;
    const isMentorOfAnswer = currentUserId === mentorId;

    // Fetch replies for this specific answer
    useEffect(() => {
        fetchAnswerReplies();
        checkUpvoteStatus();
    }, [answer._id]);

    const checkUpvoteStatus = async () => {
        if (!currentUserId) return;

        try {
            const response = await api.checkIfUpvoted(answer._id, currentUserId);
            if (response.success) {
                setIsUpvoted(response.data.isUpvoted);
            }
        } catch (err) {
            console.error('Error checking upvote status:', err);
        }
    };

    const fetchAnswerReplies = async () => {
        try {
            setLoadingReplies(true);
            const response = await api.getCommentsByAnswer(answer._id);
            if (response.success) {
                setAnswerReplies(response.data || []);
            }
        } catch (err) {
            console.error('Error fetching answer replies:', err);
        } finally {
            setLoadingReplies(false);
        }
    };

    const handleUpvoteToggle = async () => {
        if (isUpvoting) return;

        // Optimistic update
        const previousUpvoted = isUpvoted;
        const previousCount = upvoteCount;

        setIsUpvoted(!isUpvoted);
        setUpvoteCount(isUpvoted ? upvoteCount - 1 : upvoteCount + 1);
        setIsUpvoting(true);

        try {
            const response = isUpvoted
                ? await api.removeUpvote(answer._id)
                : await api.upvoteAnswer(answer._id);

            if (response.success) {
                // Update with actual count from server
                setUpvoteCount(response.data.upvoteCount);
            } else {
                // Revert on failure
                setIsUpvoted(previousUpvoted);
                setUpvoteCount(previousCount);
            }
        } catch (err) {
            console.error('Error toggling upvote:', err);
            // Revert on error
            setIsUpvoted(previousUpvoted);
            setUpvoteCount(previousCount);
        } finally {
            setIsUpvoting(false);
        }
    };

    const handleReplyToMentor = async (e) => {
        e.preventDefault();
        setReplyError(null);

        if (!replyContent.trim()) {
            setReplyError('Please enter your reply');
            return;
        }

        try {
            setIsSubmittingReply(true);
            const response = await api.createAnswerReply(
                doubtId,
                answer._id,
                replyContent.trim()
            );

            if (response.success) {
                setReplyContent('');
                setShowReplyForm(false);
                // Refresh answer replies
                await fetchAnswerReplies();
            }
        } catch (err) {
            console.error('Error posting reply:', err);
            setReplyError(err.message || 'Failed to post reply');
        } finally {
            setIsSubmittingReply(false);
        }
    };

    return (
        <div className="p-4 border-b border-x-border bg-x-card/30">
            <div className="flex gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-x-blue/20 flex items-center justify-center text-lg">
                    {mentorName.charAt(0).toUpperCase()}
                </div>

                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold text-x-text">{mentorName}</span>
                        <MentorBadge />
                        <VerifiedBadge />
                        <span className="text-x-text-secondary text-sm">
                            · {new Date(answer.createdAt).toLocaleDateString()}
                        </span>
                    </div>

                    <p className="text-x-text text-base mb-3 whitespace-pre-wrap">{answer.content}</p>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleUpvoteToggle}
                            disabled={isUpvoting}
                            className={`flex items-center gap-1 transition-all ${isUpvoted
                                ? 'text-x-success hover:text-x-success/80'
                                : 'text-x-text-secondary hover:text-x-success'
                                } ${isUpvoting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                        >
                            <span className={`text-xl ${isUpvoted ? 'scale-110' : ''}`}>↑</span>
                            <span className="font-semibold">{upvoteCount}</span>
                        </button>

                        {isDoubtPoster && (
                            <button
                                onClick={() => setShowReplyForm(!showReplyForm)}
                                className="text-sm text-x-blue hover:text-x-blue/80 transition-colors"
                            >
                                {showReplyForm ? 'Cancel' : 'Reply to Mentor'}
                            </button>
                        )}

                        {user?.role === 'admin' && (
                            <button
                                onClick={() => onDeleteAnswer(answer._id)}
                                className="text-sm text-red-400 hover:text-red-300 transition-colors flex items-center gap-1"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Delete
                            </button>
                        )}
                    </div>

                    {/* Reply Form - Only for Doubt Poster */}
                    {isDoubtPoster && showReplyForm && (
                        <div className="mt-4 p-3 border border-x-border rounded-lg bg-x-black/50">
                            <form onSubmit={handleReplyToMentor}>
                                <textarea
                                    value={replyContent}
                                    onChange={(e) => setReplyContent(e.target.value)}
                                    placeholder="Reply to the mentor's answer..."
                                    rows={3}
                                    maxLength={2000}
                                    className="w-full bg-transparent text-x-text placeholder-x-text-secondary focus:outline-none resize-none border border-x-border rounded-lg p-2"
                                />

                                {replyError && (
                                    <div className="mt-2 p-2 bg-red-500/10 border border-red-500/30 rounded-lg">
                                        <p className="text-red-500 text-sm">{replyError}</p>
                                    </div>
                                )}

                                <div className="flex items-center justify-between mt-2">
                                    <span className="text-xs text-x-text-secondary">
                                        {replyContent.length}/2000
                                    </span>
                                    <button
                                        type="submit"
                                        disabled={isSubmittingReply || !replyContent.trim()}
                                        className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${isSubmittingReply || !replyContent.trim()
                                            ? 'bg-x-blue/50 text-white/50 cursor-not-allowed'
                                            : 'bg-x-blue text-white hover:bg-x-blue/90'
                                            }`}
                                    >
                                        {isSubmittingReply ? 'Posting...' : 'Post Reply'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Reply Thread - Separate from general discussion */}
                    {answerReplies.length > 0 && (
                        <div className="mt-4 ml-0 border-l-2 border-x-blue/30 pl-4">
                            <p className="text-xs font-semibold text-x-text-secondary mb-3 uppercase">
                                Reply Thread ({answerReplies.length})
                            </p>
                            {answerReplies.map((reply) => {
                                const replyAuthorName = reply.userId?.name || 'Anonymous';
                                const isReplyFromMentor = (reply.userId?._id || reply.userId) === mentorId;
                                const isReplyFromPoster = (reply.userId?._id || reply.userId) === doubtPosterId;

                                return (
                                    <div key={reply._id} className="mb-3 p-3 bg-x-black/30 rounded-lg border border-x-border/50">
                                        <div className="flex gap-2">
                                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-x-blue/20 flex items-center justify-center text-sm">
                                                {replyAuthorName.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="font-semibold text-x-text text-sm">{replyAuthorName}</span>
                                                    {isReplyFromMentor && <MentorBadge />}
                                                    {isReplyFromMentor && <VerifiedBadge />}
                                                    {isReplyFromPoster && (
                                                        <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400">
                                                            Doubt Poster
                                                        </span>
                                                    )}
                                                    <span className="text-x-text-secondary text-xs">
                                                        · {new Date(reply.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <p className="text-x-text text-sm whitespace-pre-wrap">{reply.content}</p>
                                            </div>
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

export default function DoubtDetailPage({ params }) {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [doubt, setDoubt] = useState(null);
    const [answers, setAnswers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [answerContent, setAnswerContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);
    const [deleteDialog, setDeleteDialog] = useState({
        isOpen: false,
        type: null, // 'doubt' or 'answer'
        id: null,
        title: ''
    });
    const doubtId = params.id;

    useEffect(() => {
        const currentUser = getCurrentUser();
        setUser(currentUser);

        if (!currentUser) {
            router.push('/landing');
        } else {
            fetchDoubtDetails();
        }
    }, [router, doubtId]);

    const fetchDoubtDetails = async () => {
        try {
            setLoading(true);
            setError(null);

            // Fetch doubt details
            const doubtResponse = await api.getDoubtById(doubtId);

            if (doubtResponse.success) {
                setDoubt(doubtResponse.data);
                // Answers are included in the doubt response
                if (doubtResponse.data.answers) {
                    setAnswers(doubtResponse.data.answers);
                }
            }
        } catch (err) {
            console.error('Error fetching doubt details:', err);
            setError(err.message || 'Failed to load doubt details');
        } finally {
            setLoading(false);
        }
    };

    const handleAnswerSubmit = async (e) => {
        e.preventDefault();
        setSubmitError(null);

        if (!answerContent.trim()) {
            setSubmitError('Please enter your answer');
            return;
        }

        if (answerContent.trim().length < 20) {
            setSubmitError('Answer must be at least 20 characters');
            return;
        }

        if (!isMentor()) {
            setSubmitError('Only mentors can post answers');
            return;
        }

        try {
            setIsSubmitting(true);
            const response = await api.createAnswer(doubtId, answerContent.trim());

            if (response.success) {
                setAnswerContent('');
                // Refresh doubt details to show new answer
                await fetchDoubtDetails();
            }
        } catch (err) {
            console.error('Error posting answer:', err);
            setSubmitError(err.message || 'Failed to post answer. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteDoubt = async () => {
        try {
            const response = await api.adminDeleteDoubt(doubtId);
            if (response.success) {
                router.push('/'); // Redirect to home after deletion
            }
        } catch (err) {
            console.error('Error deleting doubt:', err);
            alert('Failed to delete doubt: ' + (err.message || 'Unknown error'));
        } finally {
            setDeleteDialog({ ...deleteDialog, isOpen: false });
        }
    };

    const handleDeleteAnswer = async () => {
        try {
            const response = await api.adminDeleteAnswer(deleteDialog.id);
            if (response.success) {
                await fetchDoubtDetails(); // Refresh to remove deleted answer
            }
        } catch (err) {
            console.error('Error deleting answer:', err);
            alert('Failed to delete answer: ' + (err.message || 'Unknown error'));
        } finally {
            setDeleteDialog({ ...deleteDialog, isOpen: false });
        }
    };

    if (loading) {
        return (
            <div className="flex bg-x-black min-h-screen justify-center items-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-x-blue"></div>
                    <p className="text-x-text-secondary mt-4">Loading doubt...</p>
                </div>
            </div>
        );
    }

    if (error || !doubt) {
        return (
            <div className="flex bg-x-black min-h-screen justify-center items-center">
                <div className="text-center">
                    <p className="text-red-500 mb-4">{error || 'Doubt not found'}</p>
                    <button
                        onClick={() => router.back()}
                        className="px-4 py-2 bg-x-blue text-white rounded-full hover:bg-x-blue/90 transition-colors"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    if (!user) {
        return null; // Will redirect
    }

    const authorName = doubt.juniorId?.name || 'Anonymous';

    return (
        <div className="flex bg-x-black min-h-screen justify-center">
            <Sidebar />

            <main className="flex-1 border-r border-x-border max-w-2xl">
                {/* Header */}
                <div className="sticky top-0 z-10 bg-x-black/80 backdrop-blur-md border-b border-x-border px-4 py-4">
                    <h1 className="text-xl font-bold text-x-text">Doubt</h1>
                </div>

                {/* Doubt Question */}
                <div className="border-b-8 border-x-border p-4">
                    <div className="flex gap-3">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-x-blue/20 flex items-center justify-center text-lg">
                            {authorName.charAt(0).toUpperCase()}
                        </div>

                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold text-x-text">{authorName}</span>
                                <span className="text-x-text-secondary text-sm">
                                    · {new Date(doubt.createdAt).toLocaleDateString()}
                                </span>
                                {doubt.status && (
                                    <span className={`text-xs px-2 py-1 rounded-full ${doubt.status === 'resolved' ? 'bg-green-500/20 text-green-400' :
                                        doubt.status === 'answered' ? 'bg-blue-500/20 text-blue-400' :
                                            'bg-orange-500/20 text-orange-400'
                                        }`}>
                                        {doubt.status}
                                    </span>
                                )}
                            </div>

                            <h2 className="text-2xl font-bold text-x-text mb-3">{doubt.title}</h2>

                            <p className="text-x-text text-base mb-3 whitespace-pre-wrap">{doubt.description}</p>

                            <div className="flex flex-wrap gap-2 mb-3">
                                {doubt.tags?.map((tag, index) => (
                                    <Tag key={index}>{tag}</Tag>
                                ))}
                            </div>

                            {isAdmin() && (
                                <button
                                    onClick={() => setDeleteDialog({
                                        isOpen: true,
                                        type: 'doubt',
                                        id: doubtId,
                                        title: doubt.title
                                    })}
                                    className="mt-2 px-3 py-1.5 rounded-lg border border-red-500/50 text-red-400 hover:bg-red-500/10 text-sm font-semibold transition-colors flex items-center gap-2"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    Delete Doubt (Admin)
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Mentor Answers Section */}
                <div className="border-b-4 border-x-border">
                    <div className="px-4 py-3 bg-x-card border-b border-x-border">
                        <h3 className="text-lg font-bold text-x-text">
                            Answers by Mentors ({answers.length})
                        </h3>
                    </div>

                    {answers.length === 0 && (
                        <div className="p-8 text-center">
                            <p className="text-x-text-secondary">No answers yet. Be the first mentor to answer!</p>
                        </div>
                    )}

                    {answers.map((answer) => (
                        <AnswerItem
                            key={answer._id}
                            answer={answer}
                            doubt={doubt}
                            user={user}
                            doubtId={doubtId}
                            onRefresh={fetchDoubtDetails}
                            onDeleteAnswer={(answerId) => setDeleteDialog({
                                isOpen: true,
                                type: 'answer',
                                id: answerId,
                                title: 'this answer'
                            })}
                        />
                    ))}

                    {/* Answer Form - Only for Mentors */}
                    {isMentor() && (
                        <div className="p-4 border-b border-x-border">
                            <form onSubmit={handleAnswerSubmit}>
                                <div className="flex gap-3">
                                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-x-blue/20 flex items-center justify-center text-lg">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>

                                    <div className="flex-1">
                                        <textarea
                                            value={answerContent}
                                            onChange={(e) => setAnswerContent(e.target.value)}
                                            placeholder="Write your answer as a mentor (min 20 characters)..."
                                            rows={4}
                                            maxLength={10000}
                                            className="w-full bg-transparent text-x-text placeholder-x-text-secondary focus:outline-none resize-none border border-x-border rounded-lg p-3"
                                        />

                                        {submitError && (
                                            <div className="mt-2 p-2 bg-red-500/10 border border-red-500/30 rounded-lg">
                                                <p className="text-red-500 text-sm">{submitError}</p>
                                            </div>
                                        )}

                                        <div className="flex items-center justify-between mt-2">
                                            <span className="text-xs text-x-text-secondary">
                                                {answerContent.length}/10000 characters
                                            </span>
                                            <button
                                                type="submit"
                                                disabled={isSubmitting || !answerContent.trim()}
                                                className={`px-6 py-2 rounded-full font-semibold transition-colors ${isSubmitting || !answerContent.trim()
                                                    ? 'bg-x-blue/50 text-white/50 cursor-not-allowed'
                                                    : 'bg-x-blue text-white hover:bg-x-blue/90'
                                                    }`}
                                            >
                                                {isSubmitting ? 'Posting...' : 'Post Answer'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    )}
                </div>

                {/* Comments Section */}
                <CommentSection doubtId={doubtId} doubt={doubt} />
            </main>

            <RightSidebar />

            {/* Admin Delete Confirmation Dialogs */}
            <ConfirmDialog
                isOpen={deleteDialog.isOpen && deleteDialog.type === 'doubt'}
                onClose={() => setDeleteDialog({ ...deleteDialog, isOpen: false })}
                onConfirm={handleDeleteDoubt}
                title="Delete Doubt"
                message={`Are you sure you want to delete "${deleteDialog.title}"? This will also delete all answers and comments. This action cannot be undone.`}
                confirmText="Delete Doubt"
                type="danger"
            />

            <ConfirmDialog
                isOpen={deleteDialog.isOpen && deleteDialog.type === 'answer'}
                onClose={() => setDeleteDialog({ ...deleteDialog, isOpen: false })}
                onConfirm={handleDeleteAnswer}
                title="Delete Answer"
                message="Are you sure you want to delete this answer? This action cannot be undone."
                confirmText="Delete Answer"
                type="danger"
            />
        </div>
    );
}
