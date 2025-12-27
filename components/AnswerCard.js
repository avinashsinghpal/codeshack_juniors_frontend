'use client';

import { useState } from 'react';
import MentorBadge from './MentorBadge';

export default function AnswerCard({ answer }) {
    const [upvoted, setUpvoted] = useState(false);
    const [upvoteCount, setUpvoteCount] = useState(answer.upvotes);

    const handleUpvote = () => {
        if (upvoted) {
            setUpvoteCount(upvoteCount - 1);
            setUpvoted(false);
        } else {
            setUpvoteCount(upvoteCount + 1);
            setUpvoted(true);
        }
    };

    return (
        <div className="p-4 border-b border-x-border">
            <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-x-blue/20 flex items-center justify-center text-lg">
                    {answer.authorName.charAt(0)}
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold text-x-text">{answer.authorName}</span>
                        {answer.authorRole === 'mentor' && <MentorBadge />}
                        <span className="text-x-text-secondary text-sm">
                            · {new Date(answer.createdAt).toLocaleDateString()}
                        </span>
                    </div>

                    <p className="text-x-text whitespace-pre-wrap mb-3">{answer.content}</p>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleUpvote}
                            className={`flex items-center gap-1 px-3 py-1.5 rounded-full transition-colors ${upvoted
                                ? 'bg-x-success/10 text-x-success'
                                : 'text-x-text-secondary hover:bg-x-success/10 hover:text-x-success'
                                }`}
                        >
                            <span className="text-lg">↑</span>
                            <span className="text-sm font-medium">{upvoteCount}</span>
                        </button>

                        <button className="flex items-center gap-2 text-x-text-secondary hover:text-x-blue text-sm transition-all duration-200 group">
                            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            <span>Reply</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
