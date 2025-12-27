'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { getCurrentUser, logout, isMentor } from '@/utils/auth';
import MentorBadge from './MentorBadge';
import VerifiedBadge from './VerifiedBadge';
import AdminBadge from './AdminBadge';

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const popupRef = useRef(null);
    const mobileMenuRef = useRef(null);

    useEffect(() => {
        const currentUser = getCurrentUser();
        setUser(currentUser);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                setShowPopup(false);
            }
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
                setShowMobileMenu(false);
            }
        };

        if (showPopup || showMobileMenu) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showPopup, showMobileMenu]);

    const handleLogout = () => {
        logout();
        router.push('/landing');
    };

    // All navigation items with SVG icons
    const allNavItems = [
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
            name: 'Ask a Doubt',
            path: '/ask',
            icon: (
                <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                </svg>
            ),
            roles: ['junior']
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
            name: 'Junior Space',
            path: '/space',
            icon: (
                <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
                    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
                </svg>
            ),
            roles: ['junior']
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
        {
            name: 'Admin Dashboard',
            path: '/admin',
            icon: (
                <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
                    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
                </svg>
            ),
            roles: ['admin']
        },
        {
            name: 'Mentor Approvals',
            path: '/admin/mentors',
            icon: (
                <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
            ),
            roles: ['admin']
        },
        {
            name: 'User Management',
            path: '/admin/users',
            icon: (
                <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
            ),
            roles: ['admin']
        },
        {
            name: 'Activity Log',
            path: '/admin/activity',
            icon: (
                <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
            ),
            roles: ['admin']
        },
    ];

    // Filter navigation items based on user role
    const navItems = user
        ? allNavItems.filter(item => item.roles.includes(user.role))
        : allNavItems;

    return (
        <>
            {/* Mobile Header with Hamburger */}
            <div className="md:hidden fixed top-0 left-0 right-0 glass-nav z-40 px-4 py-3">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-bold text-x-blue">CodeShack</h1>
                    <button
                        onClick={() => setShowMobileMenu(!showMobileMenu)}
                        className="p-2 rounded-lg hover:bg-x-hover transition-all duration-300 text-x-text scale-hover"
                        aria-label="Toggle menu"
                    >
                        <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
                            {showMobileMenu ? (
                                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                            ) : (
                                <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
                            )}
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Menu Drawer */}
            <div
                ref={mobileMenuRef}
                className={`md:hidden fixed top-0 left-0 h-full w-64 glass-sidebar z-50 transform transition-transform duration-300 ease-in-out ${showMobileMenu ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="flex flex-col h-full p-4">
                    <div className="mb-8 mt-2">
                        <h1 className="text-2xl font-bold text-x-blue">CodeShack</h1>
                    </div>

                    <nav className="space-y-2 flex-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                href={item.path}
                                onClick={() => setShowMobileMenu(false)}
                                className={`flex items-center gap-4 px-4 py-3 rounded-full transition-all duration-300 gradient-overlay ${pathname === item.path
                                    ? 'bg-x-blue/10 text-x-blue font-semibold'
                                    : 'text-x-text hover:bg-x-hover'
                                    }`}
                            >
                                <span className="flex-shrink-0">{item.icon}</span>
                                <span className="text-lg">{item.name}</span>
                            </Link>
                        ))}
                    </nav>

                    {/* Mobile Profile Section */}
                    {user && (
                        <div className="mt-auto">
                            <div className="border-t border-x-border pt-4">
                                <div className="flex items-center gap-3 px-4 py-3">
                                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-x-blue/20 flex items-center justify-center text-lg font-semibold text-x-text">
                                        {user.name.charAt(0)}
                                    </div>
                                    <div className="flex-1 overflow-hidden">
                                        <div className="flex items-center gap-2">
                                            <p className="text-sm font-semibold text-x-text truncate">{user.name}</p>
                                            {user.role === 'mentor' && <MentorBadge />}
                                            {user.role === 'admin' && <AdminBadge />}
                                        </div>
                                        <p className="text-xs text-x-text-secondary truncate">@{user.name.replace(' ', '').toLowerCase()}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="w-full px-4 py-3 text-left text-x-text hover:bg-x-hover transition-colors font-semibold rounded-lg"
                                >
                                    Log out
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Overlay for mobile menu */}
            {showMobileMenu && (
                <div
                    className="md:hidden fixed inset-0 bg-black/50 z-40"
                    onClick={() => setShowMobileMenu(false)}
                />
            )}

            {/* Desktop Sidebar */}
            <aside className="hidden md:flex w-64 h-screen sticky top-0 flex-col glass-sidebar p-4">
                <div className="flex-1">
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-x-blue">CodeShack</h1>
                    </div>

                    <nav className="space-y-2">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                href={item.path}
                                className={`flex items-center gap-4 px-4 py-3 rounded-full transition-all duration-300 gradient-overlay ${pathname === item.path
                                    ? 'bg-x-blue/10 text-x-blue font-semibold'
                                    : 'text-x-text hover:bg-x-hover'
                                    }`}
                            >
                                <span className="flex-shrink-0">{item.icon}</span>
                                <span className="text-lg">{item.name}</span>
                            </Link>
                        ))}
                    </nav>
                </div>

                {/* Profile Section at Bottom */}
                {user && (
                    <div className="relative" ref={popupRef}>
                        {/* Popup Menu */}
                        {showPopup && (
                            <div className="absolute bottom-full left-0 mb-2 w-full glass-card rounded-xl shadow-2xl overflow-hidden animate-slide-up">
                                <button
                                    onClick={handleLogout}
                                    className="w-full px-4 py-3 text-left text-x-text hover:bg-x-hover transition-all duration-300 font-semibold"
                                >
                                    Log out @{user.name.replace(' ', '').toLowerCase()}
                                </button>
                            </div>
                        )}

                        {/* Profile Button */}
                        <button
                            onClick={() => setShowPopup(!showPopup)}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-full hover:bg-x-hover transition-colors"
                        >
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-x-blue/20 flex items-center justify-center text-lg font-semibold text-x-text">
                                {user.name.charAt(0)}
                            </div>

                            <div className="flex-1 text-left overflow-hidden">
                                <div className="flex items-center gap-2">
                                    <p className="text-sm font-semibold text-x-text truncate">{user.name}</p>
                                    {user.role === 'mentor' && <MentorBadge />}
                                    {user.role === 'admin' && <AdminBadge />}
                                </div>
                                <p className="text-xs text-x-text-secondary truncate">@{user.name.replace(' ', '').toLowerCase()}</p>
                            </div>

                            <span className="text-x-text">•••</span>
                        </button>
                    </div>
                )}
            </aside>
        </>
    );
}
