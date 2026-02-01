import { create } from 'zustand';
import api from '../services/api';

interface User {
    _id: string;
    email: string;
    role: 'STUDENT' | 'ENTERPRISE' | 'ADMIN';
    name?: string;
    profileImage?: string;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (userData: User) => void;
    logout: () => void;
    checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    login: (userData) => set({ user: userData, isAuthenticated: true }),
    logout: async () => {
        try {
            await api.post('/auth/logout');
        } catch (e) {
            console.error(e);
        }
        set({ user: null, isAuthenticated: false });
    },
    checkAuth: async () => {
        try {
            const { data } = await api.get('/auth/me');
            set({ user: data, isAuthenticated: true, isLoading: false });
        } catch (error) {
            set({ user: null, isAuthenticated: false, isLoading: false });
            // Clear invalid cookie on server side to prevent middleware redirect loops
            try {
                await api.post('/auth/logout');
            } catch (e) {
                console.error("Logout failed during auth check", e);
            }
        }
    },
}));
