import { describe, it, expect } from 'vitest';
import productsReducer, {
  setSelectedCategory,
  setSearchQuery,
  setDataSourceMode,
  openProductDetail,
  closeProductDetail,
  fetchProducts,
  selectFilteredProducts,
  selectCategories,
  selectSelectedProduct,
} from '../features/products/productsSlice';
import type { ProductsState, Product } from '../features/products/types';
import type { RootState } from '../app/store';

const mockProducts: Product[] = [
  {
    id: 'prod-1',
    name: 'MacBook Pro 16"',
    price: 3000,
    description: 'Apple Laptop M3',
    category: 'Laptop',
    image: 'https://example.com/mac.jpg',
    rating: { rate: 4.9, count: 100 },
    stock: 10,
  },
  {
    id: 'prod-2',
    name: 'iPhone 16 Pro',
    price: 1200,
    description: 'Apple Smartphone Titan',
    category: 'Điện thoại',
    image: 'https://example.com/iphone.jpg',
    rating: { rate: 4.8, count: 80 },
    stock: 15,
  },
  {
    id: 'prod-3',
    name: 'Dell XPS 15',
    price: 2200,
    description: 'Windows Ultrabook',
    category: 'Laptop',
    image: 'https://example.com/dell.jpg',
    rating: { rate: 4.6, count: 50 },
    stock: 8,
  },
];

describe('productsSlice - Reducers & Actions', () => {
  const initialState: ProductsState = {
    items: [],
    status: 'idle',
    error: null,
    selectedCategory: 'All',
    searchQuery: '',
    dataSourceMode: 'thunk',
    selectedProduct: null,
  };

  it('trả về initialState khi action không xác định', () => {
    expect(productsReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('cập nhật selectedCategory', () => {
    const nextState = productsReducer(initialState, setSelectedCategory('Laptop'));
    expect(nextState.selectedCategory).toBe('Laptop');
  });

  it('cập nhật searchQuery', () => {
    const nextState = productsReducer(initialState, setSearchQuery('Apple'));
    expect(nextState.searchQuery).toBe('Apple');
  });

  it('cập nhật dataSourceMode', () => {
    const nextState = productsReducer(initialState, setDataSourceMode('rtk-query'));
    expect(nextState.dataSourceMode).toBe('rtk-query');
  });

  it('cập nhật selectedProduct khi gọi openProductDetail', () => {
    const nextState = productsReducer(initialState, openProductDetail(mockProducts[0]));
    expect(nextState.selectedProduct).toEqual(mockProducts[0]);
  });

  it('xoá selectedProduct về null khi gọi closeProductDetail', () => {
    const stateWithSelected = {
      ...initialState,
      selectedProduct: mockProducts[0],
    };
    const nextState = productsReducer(stateWithSelected, closeProductDetail());
    expect(nextState.selectedProduct).toBeNull();
  });
});

describe('productsSlice - Async Thunk extraReducers', () => {
  const initialState: ProductsState = {
    items: [],
    status: 'idle',
    error: null,
    selectedCategory: 'All',
    searchQuery: '',
    dataSourceMode: 'thunk',
    selectedProduct: null,
  };

  it('chuyển status sang "loading" khi pending', () => {
    const action = { type: fetchProducts.pending.type };
    const nextState = productsReducer(initialState, action);
    expect(nextState.status).toBe('loading');
    expect(nextState.error).toBeNull();
  });

  it('cập nhật items và status sang "succeeded" khi fulfilled', () => {
    const action = {
      type: fetchProducts.fulfilled.type,
      payload: mockProducts,
    };
    const nextState = productsReducer(
      { ...initialState, status: 'loading' },
      action
    );
    expect(nextState.status).toBe('succeeded');
    expect(nextState.items).toEqual(mockProducts);
    expect(nextState.error).toBeNull();
  });

  it('chuyển status sang "failed" và lưu error khi rejected', () => {
    const action = {
      type: fetchProducts.rejected.type,
      payload: 'Lỗi mạng 500',
    };
    const nextState = productsReducer(
      { ...initialState, status: 'loading' },
      action
    );
    expect(nextState.status).toBe('failed');
    expect(nextState.error).toBe('Lỗi mạng 500');
  });
});

describe('productsSlice - Selectors', () => {
  const mockStateWithProducts = {
    products: {
      items: mockProducts,
      status: 'succeeded',
      error: null,
      selectedCategory: 'All',
      searchQuery: '',
      dataSourceMode: 'thunk',
    },
  } as unknown as RootState;

  it('selectFilteredProducts trả về toàn bộ khi không có bộ lọc', () => {
    const result = selectFilteredProducts(mockStateWithProducts);
    expect(result).toHaveLength(3);
  });

  it('selectFilteredProducts lọc chính xác theo danh mục', () => {
    const filteredState = {
      products: {
        ...mockStateWithProducts.products,
        selectedCategory: 'Laptop',
      },
    } as unknown as RootState;

    const result = selectFilteredProducts(filteredState);
    expect(result).toHaveLength(2);
    expect(result.every((p) => p.category === 'Laptop')).toBe(true);
  });

  it('selectFilteredProducts lọc chính xác theo searchQuery', () => {
    const filteredState = {
      products: {
        ...mockStateWithProducts.products,
        searchQuery: 'Titan',
      },
    } as unknown as RootState;

    const result = selectFilteredProducts(filteredState);
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('iPhone 16 Pro');
  });

  it('selectCategories trả về danh sách phân loại độc nhất kèm "All"', () => {
    const categories = selectCategories(mockStateWithProducts);
    expect(categories).toEqual(['All', 'Laptop', 'Điện thoại']);
  });

  it('selectSelectedProduct trả về đúng sản phẩm đang được chọn', () => {
    const stateWithSelected = {
      products: {
        ...mockStateWithProducts.products,
        selectedProduct: mockProducts[1],
      },
    } as unknown as RootState;

    const selected = selectSelectedProduct(stateWithSelected);
    expect(selected).toEqual(mockProducts[1]);
  });
});
