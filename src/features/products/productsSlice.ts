import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";
import { fetchProductsApi } from "./mockApi";
import type { Product, ProductsState } from "./types";

const initialState: ProductsState = {
  items: [],
  status: "idle",
  error: null,
  selectedCategory: "All",
  searchQuery: "",
  isSearching: false,
  dataSourceMode: "thunk",
  selectedProduct: null,
};

/**
 * Async Thunk: Lấy danh sách sản phẩm từ API giả lập
 * Xử lý đủ 3 trạng thái của Promise: pending, fulfilled, rejected
 */
export const fetchProducts = createAsyncThunk<
  Product[],
  boolean | undefined,
  { rejectValue: string }
>("products/fetchProducts", async (shouldFail = false, { rejectWithValue }) => {
  try {
    const data = await fetchProductsApi(shouldFail);
    return data;
  } catch (err: unknown) {
    if (err instanceof Error) {
      return rejectWithValue(err.message);
    }
    return rejectWithValue("Đã xảy ra lỗi không xác định khi tải sản phẩm.");
  }
});

export const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setSelectedCategory: (state, action: PayloadAction<string>) => {
      state.selectedCategory = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setIsSearching: (state, action: PayloadAction<boolean>) => {
      state.isSearching = action.payload;
    },
    setDataSourceMode: (
      state,
      action: PayloadAction<"thunk" | "rtk-query">,
    ) => {
      state.dataSourceMode = action.payload;
    },
    openProductDetail: (state, action: PayloadAction<Product>) => {
      state.selectedProduct = action.payload;
    },
    closeProductDetail: (state) => {
      state.selectedProduct = null;
    },
    resetProductsState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        fetchProducts.fulfilled,
        (state, action: PayloadAction<Product[]>) => {
          state.status = "succeeded";
          state.items = action.payload;
          state.error = null;
        },
      )
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Không thể tải danh sách sản phẩm.";
      });
  },
});

export const {
  setSelectedCategory,
  setSearchQuery,
  setIsSearching,
  setDataSourceMode,
  openProductDetail,
  closeProductDetail,
  resetProductsState,
} = productsSlice.actions;

// Selectors
export const selectProducts = (state: RootState) => state.products.items;
export const selectProductsStatus = (state: RootState) => state.products.status;
export const selectProductsError = (state: RootState) => state.products.error;
export const selectSelectedCategory = (state: RootState) =>
  state.products.selectedCategory;
export const selectSearchQuery = (state: RootState) =>
  state.products.searchQuery;
export const selectIsSearching = (state: RootState) =>
  state.products.isSearching;
export const selectDataSourceMode = (state: RootState) =>
  state.products.dataSourceMode;
export const selectSelectedProduct = (state: RootState) =>
  state.products.selectedProduct;

/**
 * Selector lọc sản phẩm theo category và search query
 */
export const selectFilteredProducts = (state: RootState) => {
  const { items, selectedCategory, searchQuery } = state.products;
  return items.filter((product) => {
    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });
};

/**
 * Selector lấy danh sách danh mục phân loại không trùng lặp
 */
export const selectCategories = (state: RootState) => {
  const categories = state.products.items.map((p) => p.category);
  return ["All", ...Array.from(new Set(categories))];
};

export default productsSlice.reducer;
