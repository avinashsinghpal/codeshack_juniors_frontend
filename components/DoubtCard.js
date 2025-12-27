import Link from 'next/link';
import Tag from './Tag';

export default function DoubtCard({ doubt }) {
    // Handle backend data structure
    const doubtId = doubt._id || doubt.id;
    const authorName = doubt.juniorId?.name || 'Anonymous';
    const commentCount = doubt.commentCount || 0;

    return (
        <Link href={`/doubts/${doubtId}`}>
            <div className="p-3 md:p-4 border-b border-x-border hover:bg-x-hover transition-colors cursor-pointer">
                <div className="flex items-start gap-2 md:gap-3">
                    <div className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full bg-x-blue/20 flex items-center justify-center text-base md:text-lg">
                        {authorName.charAt(0).toUpperCase()}
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-x-text text-sm md:text-base">{authorName}</span>
                            <span className="text-x-text-secondary text-xs md:text-sm">
                                · {new Date(doubt.createdAt).toLocaleDateString()}
                            </span>
                        </div>

                        <h3 className="text-base md:text-lg font-bold text-x-text mb-2">{doubt.title}</h3>

                        <p className="text-sm md:text-base text-x-text-secondary mb-3 line-clamp-2">
                            {doubt.description}
                        </p>

                        <div className="flex items-center gap-2 flex-wrap mb-2">
                            {doubt.tags?.map((tag, index) => (
                                <Tag key={index}>{tag}</Tag>
                            ))}
                        </div>

                        <div className="flex items-center gap-3 md:gap-4 text-x-text-secondary text-xs md:text-sm">
                            <span className="flex items-center gap-1.5">
                                <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                                {commentCount} {commentCount === 1 ? 'comment' : 'comments'}
                            </span>
                            {doubt.status === 'answered' && (
                                <span className="text-x-success">✓ Answered</span>
                            )}
                            {doubt.status === 'resolved' && (
                                <span className="text-x-success">✓ Resolved</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
