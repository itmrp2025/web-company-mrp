import { create } from "zustand";

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthState {
  user: AdminUser | null;
  isLoaded: boolean;
  setUser: (user: AdminUser | null) => void;
  isLogin: () => boolean;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoaded: false,
  setUser: (user) => set({ user, isLoaded: true }),
  isLogin: () => !!get().user,
  logout: () => set({ user: null }),
}));
