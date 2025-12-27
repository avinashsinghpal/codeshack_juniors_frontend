'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import RightSidebar from '@/components/RightSidebar';
import DoubtCard from '@/components/DoubtCard';
import PageLoadingAnimation from '@/components/PageLoadingAnimation';
import { getCurrentUser } from '@/utils/auth';
import { api } from '@/utils/api';

export default function DashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [userDoubts, setUserDoubts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const currentUser = getCurrentUser();
        setUser(currentUser);

        if (!currentUser) {
            router.push('/login');
        } else {
            fetchDoubts(currentUser);
        }
    }, [router]);

    const fetchDoubts = async (currentUser) => {
        try {
            setLoading(true);
            setError(null);

            if (currentUser.role === 'junior') {
                // Fetch user's own doubts
                const response = await api.getDoubts(1, 20);
                if (response.success) {
                    // Filter doubts by current user's ID
                    const myDoubts = response.data.filter(
                        doubt => doubt.juniorId?._id === currentUser.id ||
                            doubt.juniorId?.email === currentUser.email
                    );
                    setUserDoubts(myDoubts);
                }
            } else {
                // Fetch open/unanswered doubts for mentors
                const response = await api.getDoubts(1, 20);
                if (response.success) {
                    const openDoubts = response.data.filter(
                        doubt => doubt.status === 'open' || doubt.status === 'answered'
                    );
                    setUserDoubts(openDoubts);
                }
            }
        } catch (err) {
            console.error('Error fetching doubts:', err);
            setError(err.message || 'Failed to load doubts');
        } finally {
            setLoading(false);
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
                    <h1 className="text-xl font-bold text-x-text">Dashboard</h1>
                </div>

                <div className="p-6">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-x-text mb-2">
                            Welcome back, {user.name}! 👋
                        </h2>
                        <p className="text-x-text-secondary">
                            {user.role === 'junior'
                                ? 'Here are your posted doubts'
                                : 'Here are doubts that need your expertise'}
                        </p>
                    </div>

                    {user.role === 'junior' && (
                        <div className="mb-6">
                            <Link
                                href="/ask"
                                className="inline-block px-6 py-3 rounded-full bg-x-blue text-white font-semibold hover:bg-x-blue/90 transition-colors"
                            >
                                Ask a Doubt
                            </Link>
                        </div>
                    )}

                    {loading ? (
                        <div className="p-8 text-center">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-x-blue"></div>
                            <p className="text-x-text-secondary mt-4">Loading doubts...</p>
                        </div>
                    ) : error ? (
                        <div className="p-8 text-center">
                            <p className="text-red-500 mb-4">{error}</p>
                            <button
                                onClick={() => fetchDoubts(user)}
                                className="px-4 py-2 bg-x-blue text-white rounded-full hover:bg-x-blue/90 transition-colors"
                            >
                                Retry
                            </button>
                        </div>
                    ) : (
                        <div className="bg-x-card rounded-xl border border-x-border overflow-hidden">
                            {userDoubts.length > 0 ? (
                                userDoubts.map((doubt) => (
                                    <DoubtCard key={doubt._id} doubt={doubt} />
                                ))
                            ) : (
                                <div className="p-8 text-center">
                                    <p className="text-x-text-secondary">
                                        {user.role === 'junior'
                                            ? 'You haven\'t posted any doubts yet. Ask your first question!'
                                            : 'All doubts have been answered! Great work! 🎉'}
                                    </p>
                                    {user.role === 'junior' && (
                                        <Link
                                            href="/ask"
                                            className="inline-block mt-4 px-6 py-3 rounded-full bg-x-blue text-white font-semibold hover:bg-x-blue/90 transition-colors"
                                        >
                                            Ask Your First Doubt
                                        </Link>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>

            <RightSidebar />
        </div>
    );
}
