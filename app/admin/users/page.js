'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import RightSidebar from '@/components/RightSidebar';
import MentorBadge from '@/components/MentorBadge';
import AdminBadge from '@/components/AdminBadge';
import ConfirmDialog from '@/components/ConfirmDialog';
import PageLoadingAnimation from '@/components/PageLoadingAnimation';
import { getCurrentUser } from '@/utils/auth';
import { api } from '@/utils/api';

export default function UsersManagementPage() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, junior, mentor
    const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, action: null, userId: null, userName: '' });

    useEffect(() => {
        const currentUser = getCurrentUser();
        if (!currentUser || currentUser.role !== 'admin') {
            router.push('/');
            return;
        }
        setUser(currentUser);
        fetchUsers();
    }, [filter]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            let allUsers = [];

            if (filter === 'all') {
                const juniorsRes = await api.getUsersByRole('junior', 1, 100);
                const mentorsRes = await api.getUsersByRole('mentor', 1, 100);
                allUsers = [
                    ...(juniorsRes.data || []),
                    ...(mentorsRes.data || [])
                ];
            } else {
                const response = await api.getUsersByRole(filter, 1, 100);
                allUsers = response.data || [];
            }

            setUsers(allUsers);
        } catch (err) {
            console.error('Error fetching users:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleBanUser = async () => {
        try {
            const response = await api.banUser(confirmDialog.userId);
            if (response.success) {
                alert(`User ${confirmDialog.userName} has been banned`);
                fetchUsers();
            }
        } catch (err) {
            console.error('Error banning user:', err);
            alert('Failed to ban user');
        }
    };

    const handleUnbanUser = async () => {
        try {
            const response = await api.unbanUser(confirmDialog.userId);
            if (response.success) {
                alert(`User ${confirmDialog.userName} has been unbanned`);
                fetchUsers();
            }
        } catch (err) {
            console.error('Error unbanning user:', err);
            alert('Failed to unban user');
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
                    <h1 className="text-xl font-bold text-x-text">User Management</h1>
                    <p className="text-sm text-x-text-secondary mt-1">{users.length} users</p>
                </div>

                <div className="p-6">
                    {/* Filter Tabs */}
                    <div className="flex gap-2 mb-6">
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${filter === 'all'
                                    ? 'bg-x-blue text-white'
                                    : 'bg-x-card text-x-text-secondary hover:bg-x-hover border border-x-border'
                                }`}
                        >
                            All Users
                        </button>
                        <button
                            onClick={() => setFilter('junior')}
                            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${filter === 'junior'
                                    ? 'bg-x-blue text-white'
                                    : 'bg-x-card text-x-text-secondary hover:bg-x-hover border border-x-border'
                                }`}
                        >
                            Juniors
                        </button>
                        <button
                            onClick={() => setFilter('mentor')}
                            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${filter === 'mentor'
                                    ? 'bg-x-blue text-white'
                                    : 'bg-x-card text-x-text-secondary hover:bg-x-hover border border-x-border'
                                }`}
                        >
                            Mentors
                        </button>
                    </div>

                    {loading ? (
                        <div className="text-center py-12">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-x-blue"></div>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {users.map((u) => (
                                <div key={u._id} className="bg-x-card rounded-xl p-4 border border-x-border hover:border-x-blue/50 transition-colors">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            {/* Avatar */}
                                            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-x-blue/20 flex items-center justify-center text-lg font-semibold text-x-text">
                                                {u.name?.charAt(0).toUpperCase() || 'U'}
                                            </div>

                                            {/* Info */}
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="font-semibold text-x-text">{u.name}</span>
                                                    {u.role === 'mentor' && <MentorBadge />}
                                                    {u.role === 'admin' && <AdminBadge />}
                                                </div>
                                                <p className="text-sm text-x-text-secondary">{u.email}</p>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        {u.role !== 'admin' && (
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => setConfirmDialog({
                                                        isOpen: true,
                                                        action: 'ban',
                                                        userId: u._id,
                                                        userName: u.name
                                                    })}
                                                    className="px-3 py-1.5 rounded-lg border border-red-500/50 text-red-400 hover:bg-red-500/10 text-sm font-semibold transition-colors"
                                                >
                                                    Ban
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            <RightSidebar />

            {/* Confirmation Dialogs */}
            <ConfirmDialog
                isOpen={confirmDialog.isOpen && confirmDialog.action === 'ban'}
                onClose={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
                onConfirm={handleBanUser}
                title="Ban User"
                message={`Are you sure you want to ban ${confirmDialog.userName}? This action will be logged.`}
                confirmText="Ban User"
                type="danger"
            />
        </div>
    );
}
