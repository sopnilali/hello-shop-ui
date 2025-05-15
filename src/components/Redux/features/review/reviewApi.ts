import { baseApi } from "../../api/baseApi";



const reviewApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createReview: builder.mutation({
            query: (data) => ({
                url: "/review/create-review",
                method: "POST",
                body: data
            }),
            invalidatesTags: ['review']
        }),

        getAllReview: builder.query({
            query: () => {
                return {
                    url: "/review",
                    method: "GET",
                };
            },
            transformResponse: (response: any) => {
                return {
                    data: response?.data || [],
                };
            },
            providesTags: ["review"],
        }),

        getAllReviewByContentId: builder.query({
            query: (productId) => {
                return {
                    url: `/review/${productId}`,
                    method: "GET",
                };
            },
            providesTags: ["review"],
            // transformResponse: (response: any) => {
            //     return {
            //         data: response?.data,
            //     }
            // }
        }),

        updateReview: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/review/${id}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["review"],
        }),

        deleteReview: builder.mutation({
            query: (id) => ({
                url: `/review/${id}`,
                method: "DELETE"
            }),
            invalidatesTags: ['review']
        }),
    })
});

export const {
    useCreateReviewMutation,
    useGetAllReviewQuery,
    useGetAllReviewByContentIdQuery,
    useUpdateReviewMutation,
    useDeleteReviewMutation
} = reviewApi