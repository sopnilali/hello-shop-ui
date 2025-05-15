
import { getCookie } from 'cookies-next';
import { baseApi } from '../../api/baseApi';

const orderApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createOrder: builder.mutation({
            query: (orderData) => ({
                url: '/order/create',
                method: "POST",
                body: orderData,
            }),
            invalidatesTags: ["order"]
        }),
        getAllOrder: builder.query({
            query: () => ({
                url: '/order/',
                method: "GET",
            }),
            providesTags: ["order"]
        }),
        getOrderById: builder.query({
            query: (id) => ({
                url: `/order/${id}`,
                method: "GET",
            }),
            providesTags: ["order"]
        }),
        getorderHistory: builder.query({
            query: () => ({
                url: `/order/orderHistory`,
                method: "GET",
            }),
            providesTags: ["order"]
        }),
        updateOrder: builder.mutation({
            query: ({ id, orderData }) => ({
                url: `/order/${id}`,
                method: "PUT",
                body: orderData,
            }),
            invalidatesTags: ["order"]
        })
    })  
})

export const { useCreateOrderMutation, useGetAllOrderQuery, useGetOrderByIdQuery, useUpdateOrderMutation, useGetorderHistoryQuery } = orderApi;