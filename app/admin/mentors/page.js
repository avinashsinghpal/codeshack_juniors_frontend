'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import RightSidebar from '@/components/RightSidebar';
import ConfirmDialog from '@/components/ConfirmDialog';
import PageLoadingAnimation from '@/components/PageLoadingAnimation';
import { getCurrentUser } from '@/utils/auth';
import { api } from '@/utils/api';

export default function MentorApprovalsPage() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [mentors, setMentors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, type: null, mentorId: null, mentorName: '' });

    useEffect(() => {
        const currentUser = getCurrentUser();
        if (!currentUser || currentUser.role !== 'admin') {
            router.push('/');
            return;
        }
        setUser(currentUser);
        fetchPendingMentors();
    }, []);

    const fetchPendingMentors = async () => {
        try {
            setLoading(true);
            const response = await api.getUnverifiedMentors(1, 50);
            if (response.success) {
                setMentors(response.data || []);
            }
        } catch (err) {
            console.error('Error fetching unverified mentors:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async () => {
        try {
            const response = await api.approveMentor(confirmDialog.mentorId);
            if (response.success) {
                // Remove from list
                setMentors(mentors.filter(m => m._id !== confirmDialog.mentorId));
            }
        } catch (err) {
            console.error('Error approving mentor:', err);
            alert('Failed to approve mentor');
        }
    };

    const handleReject = async () => {
        try {
            const response = await api.rejectMentor(confirmDialog.mentorId);
            if (response.success) {
                // Remove from list
                setMentors(mentors.filter(m => m._id !== confirmDialog.mentorId));
            }
        } catch (err) {
            console.error('Error rejecting mentor:', err);
            alert('Failed to reject mentor');
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
                    <h1 className="text-xl font-bold text-x-text">Mentor Approvals</h1>
                    <p className="text-sm text-x-text-secondary mt-1">
                        {mentors.length} pending approval{mentors.length !== 1 ? 's' : ''}
                    </p>
                </div>

                <div className="p-6">
                    {loading ? (
                        <div className="text-center py-12">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-x-blue"></div>
                        </div>
                    ) : mentors.length === 0 ? (
                        <div className="text-center py-12">
                            <svg className="w-16 h-16 mx-auto text-x-text-secondary mb-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <h3 className="text-lg font-semibold text-x-text mb-2">All caught up!</h3>
                            <p className="text-x-text-secondary">No pending mentor approvals at the moment.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {mentors.map((mentor) => (
                                <div key={mentor._id} className="bg-x-card rounded-xl p-6 border border-x-border">
                                    <div className="flex items-start gap-4">
                                        {/* Avatar */}
                                        <div className="flex-shrink-0 w-16 h-16 rounded-full bg-x-blue/20 flex items-center justify-center text-2xl font-semibold text-x-text">
                                            {mentor.name?.charAt(0).toUpperCase() || 'M'}
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1">
                                            <h3 className="text-lg font-bold text-x-text mb-1">{mentor.name || 'Unknown'}</h3>
                                            <p className="text-sm text-x-text-secondary mb-3">{mentor.email || 'No email'}</p>

                                            {mentor.bio && (
                                                <p className="text-sm text-x-text mb-3">{mentor.bio}</p>
                                            )}

                                            {/* Action Buttons */}
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => setConfirmDialog({
                                                        isOpen: true,
                                                        type: 'approve',
                                                        mentorId: mentor._id,
                                                        mentorName: mentor.name
                                                    })}
                                                    className="px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white font-semibold transition-colors"
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => setConfirmDialog({
                                                        isOpen: true,
                                                        type: 'reject',
                                                        mentorId: mentor._id,
                                                        mentorName: mentor.name
                                                    })}
                                                    className="px-4 py-2 rounded-lg border border-red-500/50 text-red-400 hover:bg-red-500/10 font-semibold transition-colors"
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        </div>
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
                isOpen={confirmDialog.isOpen && confirmDialog.type === 'approve'}
                onClose={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
                onConfirm={handleApprove}
                title="Approve Mentor"
                message={`Are you sure you want to approve ${confirmDialog.mentorName} as a mentor? They will be able to answer doubts and access mentor features.`}
                confirmText="Approve"
                type="success"
            />

            <ConfirmDialog
                isOpen={confirmDialog.isOpen && confirmDialog.type === 'reject'}
                onClose={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
                onConfirm={handleReject}
                title="Reject Mentor"
                message={`Are you sure you want to reject ${confirmDialog.mentorName}'s mentor application? This will delete their mentor profile.`}
                confirmText="Reject"
                type="danger"
            />
        </div>
    );
}
