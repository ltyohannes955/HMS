import { baseApi } from '@/store/api/baseApi';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    mustChangePassword: boolean;
    isActive: boolean;
  };
}

export interface ChangePasswordRequest {
  userId: string;
  currentPassword: string;
  newPassword: string;
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/v1/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    changePassword: builder.mutation<void, ChangePasswordRequest>({
      query: (body) => ({
        url: '/v1/users/change-password',
        method: 'POST',
        body,
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useLoginMutation, useChangePasswordMutation } = authApi;
