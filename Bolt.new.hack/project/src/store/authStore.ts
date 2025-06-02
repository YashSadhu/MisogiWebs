import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { AuthState, LoginFormValues, RegisterFormValues, ProfileFormValues } from '../types';

interface AuthStore extends AuthState {
  login: (data: LoginFormValues) => Promise<void>;
  register: (data: RegisterFormValues) => Promise<void>;
  logout: () => void;
  updateProfile: (data: ProfileFormValues) => Promise<void>;
}

// Mock API for demonstration
const API_URL = 'https://api.example.com'; // Replace with your actual API URL

const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (data) => {
        set({ isLoading: true, error: null });
        try {
          // In a real app, this would be an API call
          // For demo purposes, we'll simulate a successful login
          const mockResponse = {
            token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
            user: {
              id: '1',
              name: 'John Doe',
              email: data.email,
              bio: 'Full-stack developer with a passion for hackathons',
              skills: [
                { name: 'JavaScript', level: 'advanced' },
                { name: 'React', level: 'advanced' },
                { name: 'Node.js', level: 'intermediate' }
              ],
              interests: ['Web Development', 'AI', 'Mobile Apps'],
              avatarUrl: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
              createdAt: new Date().toISOString()
            }
          };
          
          set({
            token: mockResponse.token,
            user: mockResponse.user,
            isAuthenticated: true,
            isLoading: false
          });
        } catch (error) {
          set({ 
            error: 'Invalid credentials', 
            isLoading: false 
          });
          throw error;
        }
      },

      register: async (data) => {
        set({ isLoading: true, error: null });
        try {
          // In a real app, this would be an API call
          // For demo purposes, we'll simulate a successful registration
          const mockResponse = {
            token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
            user: {
              id: '1',
              name: data.name,
              email: data.email,
              skills: [],
              interests: [],
              createdAt: new Date().toISOString()
            }
          };
          
          set({
            token: mockResponse.token,
            user: mockResponse.user,
            isAuthenticated: true,
            isLoading: false
          });
        } catch (error) {
          set({ 
            error: 'Registration failed', 
            isLoading: false 
          });
          throw error;
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null
        });
      },

      updateProfile: async (data) => {
        set({ isLoading: true, error: null });
        try {
          // In a real app, this would be an API call
          // For demo purposes, we'll simulate a successful profile update
          set((state) => ({
            user: state.user ? { 
              ...state.user, 
              name: data.name,
              bio: data.bio,
              skills: data.skills,
              interests: data.interests
            } : null,
            isLoading: false
          }));
        } catch (error) {
          set({ 
            error: 'Profile update failed', 
            isLoading: false 
          });
          throw error;
        }
      },

      clearError: () => set({ error: null })
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated
      }),
    }
  )
);

export default useAuthStore;