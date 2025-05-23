import { baseApi } from "../../api/baseApi";

const couponApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        addCoupon: builder.mutation({
            query: (data) => ({
                url: '/coupon',
                method: "POST",
                body: data
            }),
            invalidatesTags: ["coupon"]
        }),
        verifyCoupon: builder.mutation({
            query: (data) => ({
                url: '/coupon/validate',
                method: "POST",
                body: data
            }),
            invalidatesTags: ["coupon"]
        }),
        getAllCoupons: builder.query({
            query: () => ({
                url: '/coupon',
                method: "GET",
            }),
            providesTags: ["coupon"]
        }),
        createCoupon: builder.mutation({
            query: (data) => ({
                url: '/coupon',
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["coupon"]
        }),
        deleteCoupon: builder.mutation({
            query: (id) => ({
                url: `/coupon/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["coupon"]
        }),
        updateCoupon: builder.mutation({
            query: ({ id, data }) => ({
                url: `/coupon/${id}`,
                method: "PATCH",
                body: data
            }),
            invalidatesTags: ['coupon']
        }),

        getCouponById: builder.query({
            query: (id) => ({
                url: `/coupon/${id}`,
                method: "GET",
            }),
            providesTags: ['coupon']
        }),
        validateCoupon: builder.query({
            query: (data) => ({
                url: `/coupon/validate`,
                method: "POST",
                body: data
            }),
        }),


    })
})

export const { 
    useVerifyCouponMutation,
    useGetAllCouponsQuery,
    useCreateCouponMutation,
    useDeleteCouponMutation,
    useUpdateCouponMutation,
    useAddCouponMutation
} = couponApi;