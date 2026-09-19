import React from 'react';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { useAppDispatch } from '../../app/hooks';
import { updateQuantity, removeFromCart } from './cartSlice';
import { openProductDetail } from '../products/productsSlice';
import { showToast } from '../../components/Toast';
import type { CartItem } from './types';

interface CartItemRowProps {
  item: CartItem;
}

export const CartItemRow: React.FC<CartItemRowProps> = ({ item }) => {
  const dispatch = useAppDispatch();
  const { product, quantity } = item;

  const handleOpenDetail = () => {
    dispatch(openProductDetail(product));
  };

  const handleIncrease = () => {
    dispatch(updateQuantity({ id: product.id, quantity: quantity + 1 }));
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      dispatch(updateQuantity({ id: product.id, quantity: quantity - 1 }));
    } else {
      dispatch(removeFromCart(product.id));
      showToast(`Đã xoá "${product.name}" khỏi giỏ hàng`, 'info');
    }
  };

  const handleRemove = () => {
    dispatch(removeFromCart(product.id));
    showToast(`Đã xoá "${product.name}" khỏi giỏ hàng`, 'info');
  };

  const subtotal = product.price * quantity;

  return (
    <div className="cart-item-row">
      <img
        src={product.image}
        alt={product.name}
        className="cart-item-img clickable"
        onClick={handleOpenDetail}
        title="Bấm để xem chi tiết sản phẩm"
        loading="lazy"
      />

      <div className="cart-item-details">
        <h4
          className="cart-item-title clickable"
          onClick={handleOpenDetail}
          title="Bấm để xem chi tiết sản phẩm"
        >
          {product.name}
        </h4>
        <div className="cart-item-unit-price">
          Đơn giá: <strong>${product.price.toLocaleString()}</strong>
        </div>

        <div className="cart-item-controls">
          <div className="quantity-stepper">
            <button
              type="button"
              className="btn-step"
              onClick={handleDecrease}
              aria-label="Giảm số lượng"
            >
              <Minus size={14} />
            </button>
            <span className="step-value" aria-label={`Số lượng: ${quantity}`}>
              {quantity}
            </span>
            <button
              type="button"
              className="btn-step"
              onClick={handleIncrease}
              aria-label="Tăng số lượng"
            >
              <Plus size={14} />
            </button>
          </div>

          <div className="cart-item-subtotal">
            ${subtotal.toLocaleString()}
          </div>

          <button
            type="button"
            className="btn-remove-item"
            onClick={handleRemove}
            title="Xoá khỏi giỏ hàng"
            aria-label={`Xoá ${product.name}`}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
