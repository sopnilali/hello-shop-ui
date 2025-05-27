import { baseApi } from "../../api/baseApi";

const blogCategoryApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllBlogCategories: builder.query({
            query: () => ({
                url: '/blog-category/',
                method: 'GET'
            }),
            providesTags: ['blogCategory']
        }),
        getBlogCategory: builder.query({
            query: (id) => ({
                url: `/blog-category/${id}`,
                method: 'GET'
            }),
            providesTags: ['blogCategory']
        }),
        addBlogCategory: builder.mutation({
            query: (data) => ({
                url: '/blog-category',
                method: 'POST',
                body: data
            }),
            invalidatesTags: ['blogCategory']
        }),
        updateBlogCategory: builder.mutation({
            query: ({ id, data }) => ({
                url: `/blog-category/${id}`,
                method: 'PATCH',
                body: data
            }),
            invalidatesTags: ['blogCategory']
        }),
        deleteBlogCategory: builder.mutation({
            query: (id) => ({
                url: `/blog-category/${id}`,
                method: 'DELETE'
            }),
            invalidatesTags: ['blogCategory']
        }),
    })
});

export const {
    useGetAllBlogCategoriesQuery,
    useGetBlogCategoryQuery,
    useAddBlogCategoryMutation,
    useUpdateBlogCategoryMutation,
    useDeleteBlogCategoryMutation
} = blogCategoryApi;
