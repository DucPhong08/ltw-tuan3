import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { fetchProductsApi } from "./mockApi";
import type { Product } from "./types";

/**
 * RTK Query: API Service quản lý truy vấn và caching danh sách sản phẩm
 */
export const productsApi = createApi({
  reducerPath: "productsApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["Products"],
  endpoints: (builder) => ({
    getProducts: builder.query<Product[], void>({
      async queryFn() {
        try {
          const data = await fetchProductsApi(false, 400);
          return { data };
        } catch (error: unknown) {
          const message =
            error instanceof Error ? error.message : "Không thể kết nối API";
          return { error: { status: 500, data: message } };
        }
      },
      providesTags: ["Products"],
    }),
  }),
});

export const { useGetProductsQuery } = productsApi;
