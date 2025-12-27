'use client';

import { Suspense } from 'react';


import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { signup } from '@/utils/auth';
import { api } from '@/utils/api';

function SignupContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('junior');
    const [secretKey, setSecretKey] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Get role from URL params if present
        const roleParam = searchParams.get('role');
        if (roleParam === 'mentor' || roleParam === 'junior' || roleParam === 'admin') {
            setRole(roleParam);
        }
    }, [searchParams]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (role === 'admin') {
                // Admin registration requires secret key
                if (!secretKey) {
                    setError('Admin secret key is required');
                    setLoading(false);
                    return;
                }

                const response = await api.registerAdmin(name, email, password, secretKey);
                if (response.success) {
                    // Store token and user data
                    localStorage.setItem('authToken', response.token);
                    const userData = {
                        id: response.data.userId,
                        name: response.data.name,
                        email: response.data.email,
                        role: response.data.role,
                    };
                    localStorage.setItem('user', JSON.stringify(userData));
                    router.push('/admin');
                } else {
                    setError(response.message || 'Admin registration failed');
                }
            } else if (role === 'mentor') {
                // Mentor registration requires secret key
                if (!secretKey) {
                    setError('Mentor secret key is required');
                    setLoading(false);
                    return;
                }

                const response = await api.registerMentor(name, email, password, '', secretKey);
                if (response.success) {
                    // Store token and user data
                    localStorage.setItem('authToken', response.token);
                    const userData = {
                        id: response.data.userId,
                        name: response.data.name,
                        email: response.data.email,
                        role: response.data.role,
                        isMentorApproved: response.data.isMentorApproved || false,
                    };
                    localStorage.setItem('user', JSON.stringify(userData));
                    router.push('/');
                } else {
                    setError(response.message || 'Mentor registration failed');
                }
            } else {
                // Junior registration (no secret key)
                const result = await signup(name, email, password, role);
                if (result.success) {
                    router.push('/');
                } else {
                    setError(result.error || 'Signup failed');
                }
            }
        } catch (err) {
            setError(err.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-x-black px-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-x-blue mb-2">CodeShack</h1>
                    <p className="text-x-text-secondary">Create your account</p>
                </div>

                <div className="bg-x-card rounded-xl p-8 border border-x-border">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                                {error}
                            </div>
                        )}

                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-x-text mb-2">
                                Full Name
                            </label>
                            <input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg bg-x-black border border-x-border text-x-text focus:outline-none focus:border-x-blue transition-colors"
                                placeholder="John Doe"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-x-text mb-2">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg bg-x-black border border-x-border text-x-text focus:outline-none focus:border-x-blue transition-colors"
                                placeholder="you@example.com"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-x-text mb-2">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg bg-x-black border border-x-border text-x-text focus:outline-none focus:border-x-blue transition-colors"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-x-text mb-3">
                                I am a...
                            </label>
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setRole('junior')}
                                    className={`flex-1 py-3 px-4 rounded-full font-medium transition-colors ${role === 'junior'
                                        ? 'bg-x-blue text-white'
                                        : 'bg-x-black border border-x-border text-x-text-secondary hover:border-x-blue'
                                        }`}
                                >
                                    Junior
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setRole('mentor')}
                                    className={`flex-1 py-3 px-4 rounded-full font-medium transition-colors ${role === 'mentor'
                                        ? 'bg-x-blue text-white'
                                        : 'bg-x-black border border-x-border text-x-text-secondary hover:border-x-blue'
                                        }`}
                                >
                                    Mentor
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setRole('admin')}
                                    className={`flex-1 py-3 px-4 rounded-full font-medium transition-colors ${role === 'admin'
                                        ? 'bg-red-500 text-white'
                                        : 'bg-x-black border border-red-500/50 text-red-400 hover:border-red-500'
                                        }`}
                                >
                                    Admin
                                </button>
                            </div>
                        </div>

                        {/* Secret Key field for Admin and Mentor */}
                        {(role === 'admin' || role === 'mentor') && (
                            <div>
                                <label htmlFor="secretKey" className="block text-sm font-medium text-x-text mb-2">
                                    {role === 'admin' ? 'Admin' : 'Mentor'} Secret Key
                                </label>
                                <input
                                    id="secretKey"
                                    type="password"
                                    value={secretKey}
                                    onChange={(e) => setSecretKey(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg bg-x-black border border-x-border text-x-text focus:outline-none focus:border-x-blue transition-colors"
                                    placeholder={`Enter ${role} secret key`}
                                    required
                                />
                                <p className="text-xs text-x-text-secondary mt-2">
                                    {role === 'admin'
                                        ? 'Contact the system administrator to get the admin secret key.'
                                        : 'Contact the system administrator to get the mentor secret key. Your account will be pending approval after registration.'}
                                </p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-3 rounded-full font-semibold transition-colors ${loading
                                ? 'bg-x-blue/50 text-white/50 cursor-not-allowed'
                                : role === 'admin'
                                    ? 'bg-red-500 text-white hover:bg-red-600'
                                    : 'bg-x-blue text-white hover:bg-x-blue/90'
                                }`}
                        >
                            {loading ? 'Creating account...' : 'Sign Up'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-x-text-secondary text-sm">
                            Already have an account?{' '}
                            <Link href="/login" className="text-x-blue hover:underline">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
        
    );
}
export default function SignupPage() {
  return (
    <Suspense fallback={<div className="text-white text-center">Loading...</div>}>
      <SignupContent />
    </Suspense>
  );
}