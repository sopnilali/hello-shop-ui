import { baseApi } from "../../api/baseApi";
import { getCookie } from 'cookies-next';


const userApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        register: builder.mutation({
            query: (userData) => ({
                url: '/user/register',
                method: "POST",
                body: userData
            }),
            invalidatesTags: ["user"]
        }),
        getAllUser: builder.query({
            query: (args) => {
                const params = new URLSearchParams();

                if (args) {
                    args?.forEach((item: any) => {
                        params?.append(item?.name, item?.value as string);
                    });
                }

                return {
                    url: "/user",
                    method: "GET",
                    params: params,
                };
            },
            providesTags: ["user"],
        }),
        getUser: builder.query({
            query: (id) => ({
              url: `/user/${id}`,
              method: "GET",
            }),
            providesTags: ["user"],
          }),
        updateUser: builder.mutation({
            query: ({ userId, formData }) => ({
                url: `/user/${userId}`,
                method: "PATCH",
                body: formData
            }),
            invalidatesTags: ["user"],
        }),
        deleteUser: builder.mutation({
            query: (id) => ({
                url: `/user/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["user"],
        }),
    }),
});

export const {
    // useGetAllUserQuery,
    useGetUserQuery,
    useRegisterMutation,
    useUpdateUserMutation,
    useDeleteUserMutation,
    useGetAllUserQuery,
} = userApi;
