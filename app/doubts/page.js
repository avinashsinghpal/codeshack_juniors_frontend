'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import RightSidebar from '@/components/RightSidebar';
import DoubtCard from '@/components/DoubtCard';
import PageLoadingAnimation from '@/components/PageLoadingAnimation';
import { api } from '@/utils/api';

export default function DoubtsPage() {
    const [doubts, setDoubts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchDoubts();
    }, [page]);

    const fetchDoubts = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.getDoubts(page, 10);

            if (response.success) {
                setDoubts(response.data);
                setTotalPages(response.pagination?.pages || 1);
            }
        } catch (err) {
            console.error('Error fetching doubts:', err);
            setError(err.message || 'Failed to load doubts');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex bg-x-black min-h-screen justify-center">
            <Sidebar />

            <main className="flex-1 border-r border-x-border max-w-2xl relative">
                <PageLoadingAnimation />
                <div className="sticky top-0 z-10 bg-x-black/80 backdrop-blur-md border-b border-x-border px-4 py-4">
                    <h1 className="text-xl font-bold text-x-text">Doubts</h1>
                </div>

                {loading ? (
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

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-center gap-4 p-4 border-t border-x-border">
                                <button
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className={`px-4 py-2 rounded-full transition-colors ${page === 1
                                            ? 'bg-x-card text-x-text-secondary cursor-not-allowed'
                                            : 'bg-x-blue text-white hover:bg-x-blue/90'
                                        }`}
                                >
                                    Previous
                                </button>
                                <span className="text-x-text">
                                    Page {page} of {totalPages}
                                </span>
                                <button
                                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                    disabled={page === totalPages}
                                    className={`px-4 py-2 rounded-full transition-colors ${page === totalPages
                                            ? 'bg-x-card text-x-text-secondary cursor-not-allowed'
                                            : 'bg-x-blue text-white hover:bg-x-blue/90'
                                        }`}
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}
            </main>

            <RightSidebar />
        </div>
    );
}
