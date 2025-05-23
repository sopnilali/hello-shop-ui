import { baseApi } from "../../api/baseApi";

const paymentApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getPaymentWithVerify: builder.query({
            query: (id) => ({
                url: `/payment/verify?tran_id=${id}`,
                method: "GET",
            }),
            providesTags: ['payment']
        }),

    })
})

export const { useGetPaymentWithVerifyQuery } = paymentApi;