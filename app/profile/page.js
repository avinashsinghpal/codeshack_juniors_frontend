'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import RightSidebar from '@/components/RightSidebar';
import MentorBadge from '@/components/MentorBadge';
import VerifiedBadge from '@/components/VerifiedBadge';
import PageLoadingAnimation from '@/components/PageLoadingAnimation';
import { getCurrentUser, logout } from '@/utils/auth';
import { api } from '@/utils/api';

export default function ProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const currentUser = getCurrentUser();
        setUser(currentUser);

        if (currentUser) {
            fetchUserStats(currentUser.id);
        } else {
            setLoading(false);
        }
    }, []);

    const fetchUserStats = async (userId) => {
        try {
            const response = await api.getUserStats(userId);
            if (response.success) {
                setStats(response.data);
            }
        } catch (err) {
            console.error('Error fetching user stats:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        router.push('/landing');
    };

    if (!user) {
        return (
            <div className="flex bg-x-black min-h-screen">
                <Sidebar />
                <main className="flex-1 p-8 text-center">
                    <p className="text-x-text-secondary">Please log in to view your profile</p>
                </main>
            </div>
        );
    }

    return (
        <div className="flex bg-x-black min-h-screen justify-center">
            <Sidebar />

            <main className="flex-1 border-r border-x-border max-w-2xl relative">
                <PageLoadingAnimation />
                <div className="sticky top-0 z-10 bg-x-black/80 backdrop-blur-md border-b border-x-border px-4 py-4">
                    <h1 className="text-xl font-bold text-x-text">Profile</h1>
                </div>

                <div className="p-6">
                    {/* Profile Header */}
                    <div className="bg-x-card rounded-xl p-6 border border-x-border mb-6">
                        <div className="flex items-start gap-4 mb-4">
                            <div className="w-20 h-20 rounded-full bg-x-blue/20 flex items-center justify-center text-3xl">
                                {user.name.charAt(0)}
                            </div>

                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <h2 className="text-2xl font-bold text-x-text">{user.name}</h2>
                                    {user.role === 'mentor' && <MentorBadge />}
                                    {user.role === 'mentor' && (user.isMentorApproved || stats?.isVerified) && (
                                        <VerifiedBadge />
                                    )}
                                    {user.role === 'mentor' && !user.isMentorApproved && !stats?.isVerified && (
                                        <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                                            Pending Approval
                                        </span>
                                    )}
                                </div>
                                <p className="text-x-text-secondary">{user.email}</p>
                                <p className="text-x-blue capitalize mt-1">{user.role}</p>
                            </div>
                        </div>

                        {/* Logout Button */}
                        <button
                            onClick={handleLogout}
                            className="w-full py-3 px-6 rounded-full border border-red-500/50 text-red-400 font-semibold hover:bg-red-500/10 transition-colors"
                        >
                            Logout
                        </button>
                    </div>

                    {/* Stats */}
                    {loading ? (
                        <div className="text-center py-8">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-x-blue"></div>
                        </div>
                    ) : stats && (
                        <div className="grid grid-cols-2 gap-4">
                            {user.role === 'junior' && (
                                <>
                                    <div className="bg-x-card rounded-xl p-6 border border-x-border text-center">
                                        <div className="text-3xl font-bold text-x-blue mb-2">{stats.doubtsAsked || 0}</div>
                                        <div className="text-sm text-x-text-secondary">Doubts Asked</div>
                                    </div>

                                    <div className="bg-x-card rounded-xl p-6 border border-x-border text-center">
                                        <div className="text-3xl font-bold text-x-success mb-2">{stats.doubtsSolved || 0}</div>
                                        <div className="text-sm text-x-text-secondary">Doubts Solved</div>
                                    </div>
                                </>
                            )}

                            {user.role === 'mentor' && (
                                <>
                                    <div className="bg-x-card rounded-xl p-6 border border-x-border text-center">
                                        <div className="text-3xl font-bold text-x-blue mb-2">{stats.answersGiven || 0}</div>
                                        <div className="text-sm text-x-text-secondary">Doubts Answered</div>
                                    </div>

                                    <div className="bg-x-card rounded-xl p-6 border border-x-border text-center">
                                        <div className="text-3xl font-bold text-x-success mb-2">{stats.upvotesReceived || 0}</div>
                                        <div className="text-sm text-x-text-secondary">Upvotes Received</div>
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {/* Activity Section */}
                    <div className="mt-6 bg-x-card rounded-xl p-6 border border-x-border">
                        <h3 className="text-lg font-bold text-x-text mb-4">Recent Activity</h3>
                        <p className="text-x-text-secondary text-sm">
                            {user.role === 'junior'
                                ? 'Your recent doubts and interactions will appear here.'
                                : 'Your recent answers and mentorship activities will appear here.'}
                        </p>
                    </div>
                </div>
            </main>

            <RightSidebar />
        </div>
    );
}
