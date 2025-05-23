import { baseApi } from "../../api/baseApi";

const shopApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createShop: builder.mutation({
            query: (data) => ({
                url: '/shop',
                method: "POST",
                body: data
            }),
            invalidatesTags: ['shop']
        }),
        allShop: builder.query({
            query: () => ({
                url: '/shop',
                method: "GET",
            }),
            providesTags: ['shop']
        }),
        deleteShop: builder.mutation({
            query: (id) => ({
                url: `/shop/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ['shop']
        }),
        updateShop: builder.mutation({
            query: ({ id, data }) => ({
                url: `/shop/${id}`,
                method: "PATCH",
                body: data
            }),
            invalidatesTags: ['shop']
        }),


    })
})

export const { useAllShopQuery, useDeleteShopMutation, useUpdateShopMutation, useCreateShopMutation } = shopApi;