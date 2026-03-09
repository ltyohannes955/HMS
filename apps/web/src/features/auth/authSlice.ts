import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  mustChangePassword?: boolean;
  isActive?: boolean;
}

export interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  mustChangePassword: boolean;
}

const initialState: AuthState = {
  user: null,
  token: typeof window !== 'undefined' ? localStorage.getItem('hms_token') : null,
  isAuthenticated: false,
  mustChangePassword: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: AuthUser; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.mustChangePassword = action.payload.user.mustChangePassword || false;
      if (typeof window !== 'undefined') {
        localStorage.setItem('hms_token', action.payload.token);
        localStorage.setItem('hms_user', JSON.stringify(action.payload.user));
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.mustChangePassword = false;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('hms_token');
        localStorage.removeItem('hms_user');
      }
    },
    passwordChanged: (state) => {
      state.mustChangePassword = false;
      if (state.user) {
        state.user.mustChangePassword = false;
      }
    },
  },
});

export const { setCredentials, logout, passwordChanged } = authSlice.actions;
export default authSlice.reducer;
