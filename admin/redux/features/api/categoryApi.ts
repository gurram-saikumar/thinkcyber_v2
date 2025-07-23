import { apiSlice } from "./apiSlice";

export const categoryApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getCategories: builder.query<any, void>({
      query: () => ({
        url: "/categories",
        method: "GET",
      }),
    }),
    createCategory: builder.mutation<any, { title: string }>({
      query: (body) => ({
        url: "/admin/categories",
        method: "POST",
        body,
      }),
    }),
    updateCategory: builder.mutation<any, { id: number | string; title: string }>({
      query: ({ id, ...body }) => ({
        url: `/admin/categories/${id}`,
        method: "PUT",
        body,
      }),
    }),
    deleteCategory: builder.mutation<any, { id: number | string }>({
      query: ({ id }) => ({
        url: `/admin/categories/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApi;
