'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function PageLoadingAnimation() {
    const pathname = usePathname();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        const timer = setTimeout(() => setLoading(false), 500);
        return () => clearTimeout(timer);
    }, [pathname]);

    if (!loading) return null;

    return (
        <div className="absolute inset-0 bg-x-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="relative">
                {/* Coding-themed loader: Brackets animation */}
                <div className="flex items-center gap-2 text-x-blue text-4xl font-mono animate-pulse">
                    <span className="animate-bounce" style={{ animationDelay: '0ms' }}>{'<'}</span>
                    <span className="animate-bounce" style={{ animationDelay: '150ms' }}>/</span>
                    <span className="animate-bounce" style={{ animationDelay: '300ms' }}>{'>'}</span>
                </div>

                {/* Loading text */}
                <p className="text-x-text-secondary text-sm mt-4 text-center font-mono">
                    Loading...
                </p>
            </div>
        </div>
    );
}
