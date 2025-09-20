import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://localhost:7240/api';

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

    // Login user using localStorage (mock authentication)
    login: async (credentials) => {
      set({ isLoading: true, error: null });
      try {
        // Retrieve users from localStorage
        // const users = JSON.parse(localStorage.getItem('users')) || [];
        // const foundUser = users.find(
        // (u) => u.email === credentials.email && u.password === credentials.password
        // );

        // if (foundUser) {
        // // Simulate a token
        // const token = btoa(`${foundUser.email}:${foundUser.password}`);
        // set({
        //   user: foundUser,
        //   token,
        //   isLoggedIn: true,
        //   isLoading: false
        // });
        // // Setup default auth header for future requests
        // axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        return { success: true };
        // } else {
        // throw new Error('Invalid credentials');
        // }
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

      // Check authentication status
      checkAuth: async () => {
        const { token } = get();
        if (!token) return false;

        try {
          // Set default auth header
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // Verify token is valid by making a request to get user data
          const response = await axios.get(`${API_URL}/users/me`);
          set({ user: response.data, isLoggedIn: true });
          return true;
        } catch (error) {
          // If token is invalid, logout the user
          get().logout();
          return false;
        }
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
