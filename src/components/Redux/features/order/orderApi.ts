
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
            query: (args) => {
                const params = new URLSearchParams();

                if (args) {
                    args?.forEach((item: any) => {
                        params?.append(item?.name, item?.value as string);
                    });
                }

                return {
                    url: "/order",
                    method: "GET",
                    params: params,
                };
            },
            providesTags: ["order"],
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
        updateOrderStatus : builder.mutation({
            query: ({ id, statusData }) => ({
                url: `/order/${id}/status`,
                method: "PATCH",
                body: statusData,
            }),
            invalidatesTags: ["order"]
        }),
        deleteOrder : builder.mutation({
            query: (id) => ({
                url: `/order/${id}`,
                method: "DELETE",
            }),
        })
    })  
})

export const { useCreateOrderMutation, useGetAllOrderQuery, useGetOrderByIdQuery, useUpdateOrderStatusMutation, useGetorderHistoryQuery, useDeleteOrderMutation } = orderApi;