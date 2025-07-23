import { apiSlice } from "./apiSlice";

export const subcategoryApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getSubCategories: builder.query<any[], void>({
      query: () => "/subcategories",
    }),
    createSubCategory: builder.mutation<any, { title: string; categoryId: number | string }>({
      query: (body) => ({
        url: "/admin/subcategories",
        method: "POST",
        body: {
          ...body,
          categoryId: typeof body.categoryId === 'string' ? parseInt(body.categoryId, 10) : body.categoryId
        },
      }),
    }),
    updateSubCategory: builder.mutation<any, { id: number | string; title: string; categoryId: number | string }>({
      query: ({ id, ...body }) => ({
        url: `/admin/subcategories/${id}`,
        method: "PUT",
        body: {
          ...body,
          categoryId: typeof body.categoryId === 'string' ? parseInt(body.categoryId, 10) : body.categoryId
        },
      }),
    }),
    deleteSubCategory: builder.mutation<any, { id: number | string }>({
      query: ({ id }) => ({
        url: `/admin/subcategories/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetSubCategoriesQuery,
  useCreateSubCategoryMutation,
  useUpdateSubCategoryMutation,
  useDeleteSubCategoryMutation,
} = subcategoryApi;
