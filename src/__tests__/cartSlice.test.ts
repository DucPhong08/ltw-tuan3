import { describe, it, expect } from 'vitest';
import cartReducer, {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  openCart,
  closeCart,
  toggleCart,
  selectCartTotalQuantity,
  selectCartTotalPrice,
  selectCartItemQuantity,
} from '../features/cart/cartSlice';
import type { CartState } from '../features/cart/types';
import type { Product } from '../features/products/types';
import type { RootState } from '../app/store';

const mockProductA: Product = {
  id: 'prod-1',
  name: 'MacBook Pro',
  price: 2000,
  description: 'Laptop Apple',
  category: 'Laptop',
  image: 'https://example.com/mac.jpg',
  rating: { rate: 5, count: 10 },
  stock: 5,
};

const mockProductB: Product = {
  id: 'prod-2',
  name: 'Sony Headphones',
  price: 300,
  description: 'Tai nghe',
  category: 'Audio',
  image: 'https://example.com/sony.jpg',
  rating: { rate: 4.5, count: 20 },
  stock: 10,
};

describe('cartSlice - Reducers & Actions', () => {
  const initialState: CartState = {
    items: [],
    isOpen: false,
  };

  it('trả về initial state khi truyền action không xác định', () => {
    expect(cartReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('thêm sản phẩm mới vào giỏ hàng với số lượng mặc định là 1', () => {
    const nextState = cartReducer(initialState, addToCart(mockProductA));
    expect(nextState.items).toHaveLength(1);
    expect(nextState.items[0]).toEqual({
      product: mockProductA,
      quantity: 1,
    });
  });

  it('tăng số lượng khi thêm sản phẩm đã có trong giỏ', () => {
    const stateWithOne: CartState = {
      items: [{ product: mockProductA, quantity: 1 }],
      isOpen: false,
    };
    const nextState = cartReducer(stateWithOne, addToCart(mockProductA));
    expect(nextState.items).toHaveLength(1);
    expect(nextState.items[0].quantity).toBe(2);
  });

  it('hỗ trợ thêm kèm số lượng tuỳ chọn', () => {
    const nextState = cartReducer(
      initialState,
      addToCart({ product: mockProductB, quantity: 3 })
    );
    expect(nextState.items).toHaveLength(1);
    expect(nextState.items[0].quantity).toBe(3);
  });

  it('cập nhật đúng số lượng sản phẩm bằng updateQuantity', () => {
    const stateWithOne: CartState = {
      items: [{ product: mockProductA, quantity: 2 }],
      isOpen: false,
    };
    const nextState = cartReducer(
      stateWithOne,
      updateQuantity({ id: mockProductA.id, quantity: 5 })
    );
    expect(nextState.items[0].quantity).toBe(5);
  });

  it('tự động xoá sản phẩm khỏi giỏ nếu updateQuantity với số lượng <= 0', () => {
    const stateWithOne: CartState = {
      items: [{ product: mockProductA, quantity: 2 }],
      isOpen: false,
    };
    const nextState = cartReducer(
      stateWithOne,
      updateQuantity({ id: mockProductA.id, quantity: 0 })
    );
    expect(nextState.items).toHaveLength(0);
  });

  it('xoá đúng sản phẩm theo ID bằng removeFromCart', () => {
    const stateWithTwo: CartState = {
      items: [
        { product: mockProductA, quantity: 1 },
        { product: mockProductB, quantity: 2 },
      ],
      isOpen: false,
    };
    const nextState = cartReducer(stateWithTwo, removeFromCart(mockProductA.id));
    expect(nextState.items).toHaveLength(1);
    expect(nextState.items[0].product.id).toBe(mockProductB.id);
  });

  it('xoá sạch toàn bộ giỏ hàng bằng clearCart', () => {
    const stateWithTwo: CartState = {
      items: [
        { product: mockProductA, quantity: 1 },
        { product: mockProductB, quantity: 2 },
      ],
      isOpen: false,
    };
    const nextState = cartReducer(stateWithTwo, clearCart());
    expect(nextState.items).toHaveLength(0);
  });

  it('điều khiển trạng thái đóng/mở Drawer giỏ hàng', () => {
    let state = cartReducer(initialState, openCart());
    expect(state.isOpen).toBe(true);

    state = cartReducer(state, closeCart());
    expect(state.isOpen).toBe(false);

    state = cartReducer(state, toggleCart());
    expect(state.isOpen).toBe(true);
  });
});

describe('cartSlice - Selectors', () => {
  const mockRootState = {
    cart: {
      items: [
        { product: mockProductA, quantity: 2 },
        { product: mockProductB, quantity: 3 },
      ],
      isOpen: true,
    },
  } as unknown as RootState;

  it('selectCartTotalQuantity tính đúng tổng số lượng món hàng', () => {
    expect(selectCartTotalQuantity(mockRootState)).toBe(5);
  });

  it('selectCartTotalPrice tính đúng tổng giá trị tiền', () => {
    expect(selectCartTotalPrice(mockRootState)).toBe(4900);
  });

  it('selectCartItemQuantity lấy đúng số lượng của một mặt hàng cụ thể', () => {
    expect(selectCartItemQuantity(mockProductA.id)(mockRootState)).toBe(2);
    expect(selectCartItemQuantity(mockProductB.id)(mockRootState)).toBe(3);
    expect(selectCartItemQuantity('non-existent-id')(mockRootState)).toBe(0);
  });
});
