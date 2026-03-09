import { configureStore } from '@reduxjs/toolkit';
import { baseApi } from './api/baseApi';
import authSlice, { type AuthUser } from '@/features/auth/authSlice';

const preloadedAuth = (() => {
  if (typeof window === 'undefined') {
    return { isAuthenticated: false, user: null, token: null, mustChangePassword: false };
  }

  const token = localStorage.getItem('hms_token');
  const userStr = localStorage.getItem('hms_user');

  if (token && userStr) {
    try {
      const user = JSON.parse(userStr) as AuthUser;
      return {
        isAuthenticated: true,
        user,
        token,
        mustChangePassword: user.mustChangePassword || false,
      };
    } catch {
      return { isAuthenticated: false, user: null, token: null, mustChangePassword: false };
    }
  }

  return { isAuthenticated: false, user: null, token: null, mustChangePassword: false };
})();

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    auth: authSlice,
  },
  preloadedState: {
    auth: preloadedAuth,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseApi.middleware),
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
