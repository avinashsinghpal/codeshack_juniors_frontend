'use client';

import { useState } from 'react';

export default function ConfirmDialog({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', cancelText = 'Cancel', type = 'danger' }) {
    const [isLoading, setIsLoading] = useState(false);

    if (!isOpen) return null;

    const handleConfirm = async () => {
        setIsLoading(true);
        await onConfirm();
        setIsLoading(false);
        onClose();
    };

    const buttonClass = type === 'danger'
        ? 'bg-red-500 hover:bg-red-600 text-white'
        : 'bg-x-blue hover:bg-x-blue/90 text-white';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-x-card border border-x-border rounded-xl p-6 max-w-md w-full shadow-2xl">
                <h3 className="text-xl font-bold text-x-text mb-2">{title}</h3>
                <p className="text-x-text-secondary mb-6">{message}</p>

                <div className="flex gap-3 justify-end">
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="px-4 py-2 rounded-lg border border-x-border text-x-text hover:bg-x-hover transition-colors disabled:opacity-50"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={isLoading}
                        className={`px-4 py-2 rounded-lg font-semibold transition-colors disabled:opacity-50 ${buttonClass}`}
                    >
                        {isLoading ? 'Processing...' : confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
