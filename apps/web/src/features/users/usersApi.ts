import { baseApi } from '@/store/api/baseApi';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  mustChangePassword: boolean;
  createdAt: string;
  role?: {
    id: string;
    name: string;
  };
  department?: {
    id: string;
    name: string;
  };
}

export interface CreateUserRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  roleId?: string;
  departmentId?: string;
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  roleId?: string;
  departmentId?: string;
}

export interface ResetPasswordRequest {
  newPassword: string;
}

export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<User[], void>({
      query: () => '/v1/users',
      providesTags: ['User'],
    }),
    getUserById: builder.query<User, string>({
      query: (id) => `/v1/users/${id}`,
    }),
    createUser: builder.mutation<User, CreateUserRequest>({
      query: (body) => ({
        url: '/v1/users',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['User'],
    }),
    updateUser: builder.mutation<User, { id: string } & UpdateUserRequest>({
      query: ({ id, ...body }) => ({
        url: `/v1/users/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['User'],
    }),
    toggleUserStatus: builder.mutation<User, string>({
      query: (id) => ({
        url: `/v1/users/${id}/toggle-status`,
        method: 'PATCH',
      }),
      invalidatesTags: ['User'],
    }),
    resetUserPassword: builder.mutation<void, { id: string; newPassword: string }>({
      query: ({ id, newPassword }) => ({
        url: `/v1/users/${id}/reset-password`,
        method: 'POST',
        body: { newPassword },
      }),
    }),
    getRoles: builder.query<{ id: string; name: string }[], void>({
      query: () => '/v1/roles',
    }),
    getDepartments: builder.query<{ id: string; name: string }[], void>({
      query: () => '/v1/departments',
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useToggleUserStatusMutation,
  useResetUserPasswordMutation,
  useGetRolesQuery,
  useGetDepartmentsQuery,
} = usersApi;
