import { configureStore } from "@reduxjs/toolkit";
import productsReducer from "../features/products/productsSlice";
import cartReducer from "../features/cart/cartSlice";
import { productsApi } from "../features/products/productsApi";

/**
 * Redux Store trung tâm của ứng dụng:
 * - products: Quản lý danh sách sản phẩm, bộ lọc, async thunk
 * - cart: Quản lý giỏ hàng, số lượng, trạng thái drawer
 */
export const store = configureStore({
  reducer: {
    products: productsReducer,
    cart: cartReducer,
    [productsApi.reducerPath]: productsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(productsApi.middleware),
});

// Xuất các Type chuẩn của Redux Toolkit
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
