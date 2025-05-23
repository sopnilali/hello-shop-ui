import { baseApi } from "../../api/baseApi";

const discountApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        allDiscounts: builder.query({
            query: () => ({
                url: '/discount/',
                method: "GET",
            }),
            providesTags: ['discount']
        }),
        deleteDiscount: builder.mutation({
            query: (id) => ({
                url: `/discount/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ['discount']
        }),
        updateDiscount: builder.mutation({
            query: ({ id, data }) => ({
                url: `/discount/${id}`,
                method: "PATCH",
                body: data
            }),
            invalidatesTags: ['discount']
        }),
        createDiscount: builder.mutation({
            query: (data) => ({
                url: '/discount',
                method: "POST",
                body: data
            }),
            invalidatesTags: ['discount']
        }),
        getActiveDiscounts: builder.query({
            query: () => ({
                url: '/discount/active',
                method: "GET",
            }),
            providesTags: ['discount']
        })

    })
})

export const { useAllDiscountsQuery, useDeleteDiscountMutation, useUpdateDiscountMutation, useCreateDiscountMutation, useGetActiveDiscountsQuery } = discountApi;