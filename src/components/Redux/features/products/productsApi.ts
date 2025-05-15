import { baseApi } from "../../api/baseApi";

const productsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        addProduct: builder.mutation({
            query: (data) => ({
                url: '/product/create-product',
                method: "POST",
                body: data,
            }),
            invalidatesTags: ['product']
        }),
        allProducts: builder.query({
            query: (args) => {
              const params = new URLSearchParams();
      
              if (args) {
                Object.entries(args).forEach(([key, value]) => {
                  if (value !== undefined && value !== null && value !== '') {
                    params.append(key, value.toString());
                  }
                });
              }
      
              return {
                url: "/product",
                method: "GET",
                params: params,
              };
            },
            providesTags: ["product"],
          }),
        singleProduct: builder.query({
            query: (id) => ({
                url: `/product/${id}`,
                method: "GET",
            }),
            providesTags: ['product']
        }),
        deleteProduct: builder.mutation({
            query: (id) => ({
                url: `/product/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ['product']
        }),
        updateProduct: builder.mutation({
            query: ({productId, formData}) => ({
                url: `/product/${productId}`,
                method: "PATCH",
                body: formData,
            }),
            invalidatesTags: ['product']
        }),
    })
})

export const { useAllProductsQuery, useSingleProductQuery, useAddProductMutation, useDeleteProductMutation, useUpdateProductMutation } = productsApi;