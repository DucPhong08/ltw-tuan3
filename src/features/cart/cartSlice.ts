import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";
import type { Product } from "../products/types";
import type { CartItem, CartState } from "./types";

const initialState: CartState = {
  items: [],
  isOpen: false,
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    /**
     * Thêm sản phẩm vào giỏ hàng:
     * - Nếu sản phẩm đã tồn tại: tăng số lượng
     * - Nếu chưa có: tạo mới CartItem với số lượng mặc định là 1 (hoặc số lượng truyền vào)
     */
    addToCart: (
      state,
      action: PayloadAction<{ product: Product; quantity?: number } | Product>,
    ) => {
      const product =
        "product" in action.payload ? action.payload.product : action.payload;
      const quantityToAdd =
        "quantity" in action.payload && action.payload.quantity !== undefined
          ? action.payload.quantity
          : 1;

      const existingIndex = state.items.findIndex(
        (item) => item.product.id === product.id,
      );

      if (existingIndex >= 0) {
        state.items[existingIndex].quantity += quantityToAdd;
      } else {
        state.items.push({
          product,
          quantity: quantityToAdd,
        });
      }
    },

    /**
     * Xoá hoàn toàn một sản phẩm ra khỏi giỏ hàng theo id
     */
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(
        (item) => item.product.id !== action.payload,
      );
    },

    /**
     * Cập nhật số lượng của sản phẩm trong giỏ:
     * - Nếu quantity <= 0: tự động xoá sản phẩm khỏi giỏ
     * - Ngược lại: gán số lượng mới
     */
    updateQuantity: (
      state,
      action: PayloadAction<{ id: string; quantity: number }>,
    ) => {
      const { id, quantity } = action.payload;
      if (quantity <= 0) {
        state.items = state.items.filter((item) => item.product.id !== id);
      } else {
        const item = state.items.find((item) => item.product.id === id);
        if (item) {
          item.quantity = quantity;
        }
      }
    },

    /**
     * Xoá sạch toàn bộ sản phẩm trong giỏ hàng
     */
    clearCart: (state) => {
      state.items = [];
    },

    openCart: (state) => {
      state.isOpen = true;
    },
    closeCart: (state) => {
      state.isOpen = false;
    },
    toggleCart: (state) => {
      state.isOpen = !state.isOpen;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  openCart,
  closeCart,
  toggleCart,
} = cartSlice.actions;

// Selectors
export const selectCartItems = (state: RootState): CartItem[] =>
  state.cart.items;
export const selectIsCartOpen = (state: RootState): boolean =>
  state.cart.isOpen;

/**
 * Selector tính tổng số lượng sản phẩm trong giỏ hàng
 */
export const selectCartTotalQuantity = (state: RootState): number =>
  state.cart.items.reduce((total, item) => total + item.quantity, 0);

/**
 * Selector tính tổng giá trị tiền của giỏ hàng
 */
export const selectCartTotalPrice = (state: RootState): number =>
  state.cart.items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0,
  );

/**
 * Selector kiểm tra xem một sản phẩm đã có trong giỏ hàng chưa và số lượng là bao nhiêu
 */
export const selectCartItemQuantity =
  (productId: string) =>
  (state: RootState): number => {
    const item = state.cart.items.find((item) => item.product.id === productId);
    return item ? item.quantity : 0;
  };

export default cartSlice.reducer;
