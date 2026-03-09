import { baseApi } from '@/store/api/baseApi';

export interface Department {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
}

export interface CreateDepartmentRequest {
  name: string;
  description?: string;
}

export interface UpdateDepartmentRequest {
  name?: string;
  description?: string;
  isActive?: boolean;
}

export const departmentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDepartments: builder.query<Department[], void>({
      query: () => '/v1/departments',
      providesTags: ['Department'],
    }),
    getDepartmentById: builder.query<Department, string>({
      query: (id) => `/v1/departments/${id}`,
    }),
    createDepartment: builder.mutation<Department, CreateDepartmentRequest>({
      query: (body) => ({
        url: '/v1/departments',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Department'],
    }),
    updateDepartment: builder.mutation<Department, { id: string } & UpdateDepartmentRequest>({
      query: ({ id, ...body }) => ({
        url: `/v1/departments/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Department'],
    }),
    deleteDepartment: builder.mutation<void, string>({
      query: (id) => ({
        url: `/v1/departments/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Department'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetDepartmentsQuery,
  useGetDepartmentByIdQuery,
  useCreateDepartmentMutation,
  useUpdateDepartmentMutation,
  useDeleteDepartmentMutation,
} = departmentsApi;
