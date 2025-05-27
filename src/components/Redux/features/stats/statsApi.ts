import { baseApi } from "../../api/baseApi";

const statsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        allStats: builder.mutation({
            query: (data) => ({
                url: '/stats',
                method: "POST",
                body: data
            }),
            invalidatesTags: ['shop']
        }),
        allUsersStats: builder.query({
            query: () => ({
                url: '/stats/users',
                method: "GET",
            }),
            providesTags: ['stats']
        }),
        
        allOrdersStats: builder.query({
            query: () => ({
                url: '/stats/orders',
                method: "GET",
            }),
            providesTags: ['stats']
        }),
        allProductsStats: builder.query({
            query: () => ({
                url: '/stats/products',
                method: "GET",
            }),
            providesTags: ['stats']
        }),


    })
})

export const { useAllStatsMutation, useAllUsersStatsQuery, useAllOrdersStatsQuery, useAllProductsStatsQuery } = statsApi;