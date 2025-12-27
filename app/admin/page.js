'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import RightSidebar from '@/components/RightSidebar';
import StatCard from '@/components/StatCard';
import PageLoadingAnimation from '@/components/PageLoadingAnimation';
import { getCurrentUser } from '@/utils/auth';
import { api } from '@/utils/api';

export default function AdminDashboard() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [stats, setStats] = useState(null);
    const [platformStats, setPlatformStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const currentUser = getCurrentUser();
        if (!currentUser || currentUser.role !== 'admin') {
            router.push('/');
            return;
        }
        setUser(currentUser);
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            setLoading(true);

            // Fetch admin stats
            try {
                const adminStatsRes = await api.getAdminStats();
                console.log('Admin Stats Response:', adminStatsRes);
                if (adminStatsRes.success) {
                    setStats(adminStatsRes.data);
                }
            } catch (err) {
                console.error('Error fetching admin stats:', err);
            }

            // Fetch platform stats with individual try-catch for each
            let totalDoubts = 0;
            let totalJuniors = 0;
            let totalMentors = 0;
            let pendingMentors = 0;

            // Get doubts count
            try {
                const doubtsRes = await api.getDoubts(1, 1);
                console.log('Doubts Response:', doubtsRes);
                totalDoubts = doubtsRes.pagination?.total || 0;
            } catch (err) {
                console.error('Error fetching doubts:', err);
            }

            // Get juniors count
            try {
                const usersRes = await api.getUsersByRole('junior', 1, 1);
                console.log('Juniors Response:', usersRes);
                totalJuniors = usersRes.pagination?.total || 0;
            } catch (err) {
                console.error('Error fetching juniors:', err);
            }

            // Get mentors count (all mentors with role='mentor')
            try {
                const allMentorsRes = await api.getUsersByRole('mentor', 1, 1);
                console.log('All Mentors Response:', allMentorsRes);
                totalMentors = allMentorsRes.pagination?.total || 0;
            } catch (err) {
                console.error('Error fetching all mentors:', err);
            }

            // Get pending mentors count (try the unverified mentors endpoint)
            try {
                const pendingMentorsRes = await api.getUnverifiedMentors(1, 1);
                console.log('Pending Mentors Response:', pendingMentorsRes);
                pendingMentors = pendingMentorsRes.pagination?.total || 0;
            } catch (err) {
                console.error('Error fetching pending mentors (non-critical):', err);
                // This is non-critical, so we continue with 0
            }

            const platformData = {
                totalDoubts,
                totalJuniors,
                totalMentors,
                pendingMentors,
            };

            console.log('Platform Stats:', platformData);
            setPlatformStats(platformData);
        } catch (err) {
            console.error('Error fetching stats:', err);
            console.error('Error details:', {
                message: err.message,
                stack: err.stack
            });
        } finally {
            setLoading(false);
        }
    };

    if (!user || user.role !== 'admin') {
        return null;
    }

    return (
        <div className="flex bg-x-black min-h-screen justify-center">
            <Sidebar />

            <main className="flex-1 border-r border-x-border max-w-4xl relative">
                <PageLoadingAnimation />

                {/* Header */}
                <div className="sticky top-0 z-10 bg-x-black/80 backdrop-blur-md border-b border-x-border px-4 py-4">
                    <h1 className="text-xl font-bold text-x-text">Admin Dashboard</h1>
                </div>

                <div className="p-6">
                    {loading ? (
                        <div className="text-center py-12">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-x-blue"></div>
                        </div>
                    ) : (
                        <>
                            {/* Platform Statistics */}
                            <div className="mb-8">
                                <h2 className="text-lg font-bold text-x-text mb-4">Platform Overview</h2>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <StatCard
                                        title="Total Juniors"
                                        value={platformStats?.totalJuniors || 0}
                                        color="blue"
                                        icon={
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                                            </svg>
                                        }
                                    />
                                    <StatCard
                                        title="Total Mentors"
                                        value={platformStats?.totalMentors || 0}
                                        color="green"
                                        icon={
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                                            </svg>
                                        }
                                    />
                                    <StatCard
                                        title="Total Doubts"
                                        value={platformStats?.totalDoubts || 0}
                                        color="purple"
                                        icon={
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                                                <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                                            </svg>
                                        }
                                    />
                                    <StatCard
                                        title="Pending Mentors"
                                        value={platformStats?.pendingMentors || 0}
                                        color="yellow"
                                        icon={
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                            </svg>
                                        }
                                    />
                                </div>
                            </div>

                            {/* Admin Actions Summary */}
                            {stats && (
                                <div className="mb-8">
                                    <h2 className="text-lg font-bold text-x-text mb-4">Your Admin Activity</h2>
                                    <div className="bg-x-card rounded-xl p-6 border border-x-border">
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="text-x-text-secondary">Total Actions</span>
                                            <span className="text-2xl font-bold text-x-blue">{stats.totalActions}</span>
                                        </div>
                                        {stats.actionBreakdown && stats.actionBreakdown.length > 0 && (
                                            <div className="space-y-2">
                                                {stats.actionBreakdown.map((action) => (
                                                    <div key={action._id} className="flex items-center justify-between text-sm">
                                                        <span className="text-x-text capitalize">{action._id.replace(/_/g, ' ')}</span>
                                                        <span className="text-x-text-secondary">{action.count}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Quick Actions */}
                            <div>
                                <h2 className="text-lg font-bold text-x-text mb-4">Quick Actions</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Link href="/admin/mentors">
                                        <div className="bg-x-card rounded-xl p-6 border border-x-border hover:border-x-blue transition-colors cursor-pointer">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-lg bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center text-yellow-400">
                                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                                                        <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-x-text">Approve Mentors</h3>
                                                    <p className="text-sm text-x-text-secondary">{platformStats?.pendingMentors || 0} pending</p>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>

                                    <Link href="/admin/users">
                                        <div className="bg-x-card rounded-xl p-6 border border-x-border hover:border-x-blue transition-colors cursor-pointer">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-x-text">Manage Users</h3>
                                                    <p className="text-sm text-x-text-secondary">View all users</p>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>

                                    <Link href="/admin/content">
                                        <div className="bg-x-card rounded-xl p-6 border border-x-border hover:border-x-blue transition-colors cursor-pointer">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
                                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-x-text">Content Moderation</h3>
                                                    <p className="text-sm text-x-text-secondary">Manage content</p>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>

                                    <Link href="/admin/activity">
                                        <div className="bg-x-card rounded-xl p-6 border border-x-border hover:border-x-blue transition-colors cursor-pointer">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-x-text">Activity Log</h3>
                                                    <p className="text-sm text-x-text-secondary">View admin actions</p>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </main>

            <RightSidebar />
        </div>
    );
}
