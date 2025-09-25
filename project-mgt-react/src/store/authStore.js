import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://localhost:7240/api';

// Mock users for local development
const mockUsers = [
  {
    id: 1,
    firstName: 'John',
    lastName: 'Tenant',
    email: 'tenant@example.com',
    password: 'password123',
    userType: 'Tenant',
    phoneNumber: '123-456-7890',
    propertyId: 1,
    unitId: 101
  },
  {
    id: 2,
    firstName: 'Jane',
    lastName: 'Admin',
    email: 'admin@example.com',
    password: 'password123',
    userType: 'Admin',
    phoneNumber: '123-456-7891'
  }
];

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoggedIn: false,
      isLoading: false,
      error: null,

      // Register a new user
      register: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axios.post(`${API_URL}/users/register`, userData);
          set({ 
            user: response.data.user,
            token: response.data.token, 
            isLoggedIn: true,
            isLoading: false
          });
          return { success: true };
        } catch (error) {
          const errorMessage = error.response?.data?.message || 'Registration failed';
          set({ error: errorMessage, isLoading: false });
          return { success: false, error: errorMessage };
        }
      },

    // Login user (mock authentication)
    login: async (credentials) => {
      set({ isLoading: true, error: null });
      try {
        // Look up in mock users first
        let foundUser = mockUsers.find(
          (u) => u.email.toLowerCase() === credentials.email.toLowerCase() && u.password === credentials.password
        );

        // Optionally, also check any locally-registered users stored in localStorage
        if (!foundUser) {
          const stored = JSON.parse(localStorage.getItem('users') || '[]');
          foundUser = stored.find(
            (u) => u.email?.toLowerCase() === credentials.email.toLowerCase() && u.password === credentials.password
          );
        }

        if (!foundUser) {
          throw new Error('Invalid credentials');
        }

        // Simulate a token
        const token = btoa(`${foundUser.email}:${foundUser.password}`);

        // Persist axios auth header for subsequent requests (optional in mock mode)
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        set({
          user: { ...foundUser, password: undefined },
          token,
          isLoggedIn: true,
          isLoading: false
        });

        return { success: true };
      } catch (error) {
        const errorMessage = error.message || 'Invalid credentials';
        set({ error: errorMessage, isLoading: false });
        return { success: false, error: errorMessage };
      }
    },

      // Logout user
      logout: () => {
        // Remove auth header
        delete axios.defaults.headers.common['Authorization'];
        
        set({ 
          user: null, 
          token: null, 
          isLoggedIn: false, 
          error: null 
        });
      },

      // Update user profile
      updateProfile: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axios.put(`${API_URL}/users/${get().user.id}`, userData, {
            headers: { Authorization: `Bearer ${get().token}` }
          });
          set({ 
            user: { ...get().user, ...response.data },
            isLoading: false
          });
          return { success: true };
        } catch (error) {
          const errorMessage = error.response?.data?.message || 'Profile update failed';
          set({ error: errorMessage, isLoading: false });
          return { success: false, error: errorMessage };
        }
      },

      // Check authentication status (offline mock): rely on persisted token+user
      checkAuth: async () => {
        const { token, user } = get();
        if (token && user) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          set({ isLoggedIn: true });
          return true;
        }
        return false;
      },

      // Clear any errors
      clearError: () => set({ error: null })
    }),
    {
      name: 'auth-storage', // Name for localStorage
      getStorage: () => localStorage, // Use localStorage for persistence
    }
  )
);

// Seed mock users into localStorage (if not already present)
try {
  const existing = JSON.parse(localStorage.getItem('users') || '[]');
  if (!Array.isArray(existing) || existing.length === 0) {
    localStorage.setItem('users', JSON.stringify(mockUsers));
  }
} catch {
  // ignore
}

// Set up axios interceptor to add token to all requests
axios.interceptors.request.use(
  (config) => {
    const { token } = useAuthStore.getState();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default useAuthStore;
