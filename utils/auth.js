// Authentication utilities using real backend API

import { api } from './api';

export const login = async (email, password) => {
    try {
        const response = await api.login(email, password);

        if (response.success) {
            // Store token
            localStorage.setItem('authToken', response.token);

            // Store user data including mentor approval status
            const userData = {
                id: response.data.userId,
                name: response.data.name,
                email: response.data.email,
                role: response.data.role,
                isMentorApproved: response.data.isMentorApproved || false,
            };
            localStorage.setItem('user', JSON.stringify(userData));

            return { success: true, user: userData };
        }

        return { success: false, error: response.message };
    } catch (error) {
        return { success: false, error: error.message || 'Login failed' };
    }
};

export const signup = async (name, email, password, role) => {
    try {
        const response = await api.register(name, email, password, role);

        if (response.success) {
            // Store token
            localStorage.setItem('authToken', response.token);

            // Store user data including mentor approval status
            const userData = {
                id: response.data.userId,
                name: response.data.name,
                email: response.data.email,
                role: response.data.role,
                isMentorApproved: response.data.isMentorApproved || false,
            };
            localStorage.setItem('user', JSON.stringify(userData));

            return { success: true, user: userData };
        }

        return { success: false, error: response.message };
    } catch (error) {
        return { success: false, error: error.message || 'Signup failed' };
    }
};

export const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
};

export const getCurrentUser = () => {
    if (typeof window === 'undefined') return null;

    const userStr = localStorage.getItem('user');
    if (!userStr) return null;

    try {
        return JSON.parse(userStr);
    } catch (e) {
        return null;
    }
};

export const getAuthToken = () => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('authToken');
};

export const isAuthenticated = () => {
    return getCurrentUser() !== null && getAuthToken() !== null;
};

export const isMentor = () => {
    const user = getCurrentUser();
    return user?.role === 'mentor';
};

export const isJunior = () => {
    const user = getCurrentUser();
    return user?.role === 'junior';
};

export const isAdmin = () => {
    const user = getCurrentUser();
    return user?.role === 'admin';
};

export const isMentorApproved = () => {
    const user = getCurrentUser();
    return user?.role === 'mentor' && user?.isMentorApproved === true;
};
