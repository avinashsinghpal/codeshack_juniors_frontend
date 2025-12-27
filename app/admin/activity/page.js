'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import RightSidebar from '@/components/RightSidebar';
import PageLoadingAnimation from '@/components/PageLoadingAnimation';
import { getCurrentUser } from '@/utils/auth';
import { api } from '@/utils/api';

export default function ActivityLogPage() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [actions, setActions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState(null);

    useEffect(() => {
        const currentUser = getCurrentUser();
        if (!currentUser || currentUser.role !== 'admin') {
            router.push('/');
            return;
        }
        setUser(currentUser);
        fetchActions();
    }, [filter]);

    const fetchActions = async () => {
        try {
            setLoading(true);
            const response = await api.getAdminActions(1, 50, filter);
            if (response.success) {
                setActions(response.data || []);
            }
        } catch (err) {
            console.error('Error fetching actions:', err);
        } finally {
            setLoading(false);
        }
    };

    const getActionIcon = (actionType) => {
        switch (actionType) {
            case 'approve_mentor':
                return <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>;
            case 'reject_mentor':
                return <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>;
            case 'delete_doubt':
            case 'delete_answer':
            case 'delete_comment':
            case 'delete_junior_post':
                return <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>;
            case 'ban_user':
                return <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" /></svg>;
            case 'unban_user':
                return <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>;
            default:
                return <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>;
        }
    };

    const getActionColor = (actionType) => {
        if (actionType.includes('approve')) return 'text-green-400';
        if (actionType.includes('reject') || actionType.includes('delete') || actionType.includes('ban')) return 'text-red-400';
        if (actionType.includes('unban')) return 'text-blue-400';
        return 'text-x-text-secondary';
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
                    <h1 className="text-xl font-bold text-x-text">Activity Log</h1>
                    <p className="text-sm text-x-text-secondary mt-1">Your admin actions history</p>
                </div>

                <div className="p-6">
                    {/* Filter */}
                    <div className="mb-6">
                        <select
                            value={filter || ''}
                            onChange={(e) => setFilter(e.target.value || null)}
                            className="px-4 py-2 rounded-lg bg-x-card border border-x-border text-x-text focus:outline-none focus:border-x-blue"
                        >
                            <option value="">All Actions</option>
                            <option value="approve_mentor">Approve Mentor</option>
                            <option value="reject_mentor">Reject Mentor</option>
                            <option value="delete_doubt">Delete Doubt</option>
                            <option value="delete_answer">Delete Answer</option>
                            <option value="delete_comment">Delete Comment</option>
                            <option value="delete_junior_post">Delete Post</option>
                            <option value="ban_user">Ban User</option>
                            <option value="unban_user">Unban User</option>
                        </select>
                    </div>

                    {loading ? (
                        <div className="text-center py-12">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-x-blue"></div>
                        </div>
                    ) : actions.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-x-text-secondary">No actions found</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {actions.map((action) => (
                                <div key={action._id} className="bg-x-card rounded-xl p-4 border border-x-border">
                                    <div className="flex items-start gap-3">
                                        <div className={`flex-shrink-0 w-10 h-10 rounded-lg bg-x-black/50 border border-x-border flex items-center justify-center ${getActionColor(action.actionType)}`}>
                                            {getActionIcon(action.actionType)}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-x-text capitalize mb-1">
                                                {action.actionType.replace(/_/g, ' ')}
                                            </h3>
                                            <p className="text-sm text-x-text-secondary mb-2">
                                                {new Date(action.createdAt).toLocaleString()}
                                            </p>
                                            <p className="text-xs text-x-text-secondary font-mono">
                                                Target ID: {action.targetId}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            <RightSidebar />
        </div>
    );
}
