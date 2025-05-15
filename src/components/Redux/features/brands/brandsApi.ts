import { baseApi } from "../../api/baseApi";

const brandsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        allbrands: builder.query({
            query: () => ({
                url: '/brand/',
                method: "GET",
            }),
            providesTags: ['brand']
        }),
        deleteBrand: builder.mutation({
            query: (id) => ({
                url: `/brand/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ['brand']
        }),
        updateBrand: builder.mutation({
            query: ({ id, data }) => ({
                url: `/brand/${id}`,
                method: "PATCH",
                body: data
            }),
            invalidatesTags: ['brand']
        }),
        createBrand: builder.mutation({
            query: (data) => ({
                url: '/brand/create-brand',
                method: "POST",
                body: data
            }),
            invalidatesTags: ['brand']
        })  
    })
})

export const { useAllbrandsQuery, useDeleteBrandMutation, useUpdateBrandMutation, useCreateBrandMutation } = brandsApi;