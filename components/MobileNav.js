'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/utils/auth';
import { useEffect, useState } from 'react';

export default function MobileNav() {
    const pathname = usePathname();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const currentUser = getCurrentUser();
        setUser(currentUser);
    }, []);

    // Define navigation items based on user role
    const getNavItems = () => {
        const baseItems = [
            {
                name: 'Home',
                path: '/',
                icon: (
                    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
                        <path d="M12 3l-10 9h3v9h6v-6h2v6h6v-9h3l-10-9zm0 2.2l6 5.4v8.4h-2v-6h-8v6h-2v-8.4l6-5.4z" />
                    </svg>
                ),
                roles: ['junior', 'mentor', 'admin']
            },
            {
                name: 'Doubts',
                path: '/doubts',
                icon: (
                    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
                        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
                    </svg>
                ),
                roles: ['junior', 'mentor', 'admin']
            },
            {
                name: 'Ask',
                path: '/ask',
                icon: (
                    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                    </svg>
                ),
                roles: ['junior']
            },
            {
                name: 'Dashboard',
                path: '/dashboard',
                icon: (
                    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
                        <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
                    </svg>
                ),
                roles: ['junior', 'mentor', 'admin']
            },
            {
                name: 'Profile',
                path: '/profile',
                icon: (
                    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                ),
                roles: ['junior', 'mentor', 'admin']
            },
        ];

        if (!user) return baseItems.slice(0, 3); // Show limited items if not logged in

        return baseItems.filter(item => item.roles.includes(user.role));
    };

    const navItems = getNavItems();

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 glass-nav z-50">
            <div className="flex justify-around items-center h-16">
                {navItems.map((item) => (
                    <Link
                        key={item.path}
                        href={item.path}
                        className={`flex flex-col items-center justify-center flex-1 h-full transition-all duration-300 ${pathname === item.path
                            ? 'text-x-blue'
                            : 'text-x-text-secondary hover:text-x-text'
                            }`}
                    >
                        <span className="mb-1">{item.icon}</span>
                        <span className="text-xs font-medium">{item.name}</span>
                    </Link>
                ))}
            </div>
        </nav>
    );
}
