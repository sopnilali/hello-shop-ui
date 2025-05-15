import { baseApi } from "../../api/baseApi";

const categoryApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        allcategories: builder.query({
            query: () => ({
                url: '/category/',
                method: "GET",
            }),
            providesTags: ['category']
        }),
        deletecategory: builder.mutation({
            query: (id) => ({
                url: `/category/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ['category']
        }),
        updatecategory: builder.mutation({
            query: ({ id, data }) => ({
                url: `/category/${id}`,
                method: "PATCH",
                body: data
            }),
            invalidatesTags: ['category']
        }),
        createcategory: builder.mutation({
            query: (data) => ({
                url: '/category/create-category',
                method: "POST",
                body: data
            }),
            invalidatesTags: ['category']
        })

    })
})

export const { useAllcategoriesQuery, useDeletecategoryMutation, useUpdatecategoryMutation, useCreatecategoryMutation } = categoryApi;