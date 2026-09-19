import React, { useEffect } from 'react';
import { X, ShoppingBag, Trash2, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  selectCartItems,
  selectCartTotalPrice,
  selectCartTotalQuantity,
  selectIsCartOpen,
  closeCart,
  clearCart,
} from './cartSlice';
import { CartItemRow } from './CartItemRow';
import { showToast } from '../../components/Toast';

export const CartDrawer: React.FC = () => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector(selectIsCartOpen);
  const items = useAppSelector(selectCartItems);
  const totalQuantity = useAppSelector(selectCartTotalQuantity);
  const totalPrice = useAppSelector(selectCartTotalPrice);

  // Đóng giỏ hàng khi nhấn phím Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        dispatch(closeCart());
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dispatch, isOpen]);

  // Ngăn cuộn trang body khi drawer đang mở
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleClearCart = () => {
    if (window.confirm('Bạn có chắc chắn muốn xoá toàn bộ giỏ hàng không?')) {
      dispatch(clearCart());
      showToast('Đã làm trống giỏ hàng!', 'info');
    }
  };

  const handleCheckout = () => {
    showToast(
      `Đặt hàng thành công ${totalQuantity} sản phẩm với tổng giá trị $${totalPrice.toLocaleString()}!`,
      'success'
    );
    dispatch(clearCart());
    dispatch(closeCart());
  };

  if (!isOpen) return null;

  return (
    <div className="cart-drawer-overlay" onClick={() => dispatch(closeCart())}>
      <aside
        className="cart-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-drawer-title"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header của Drawer */}
        <div className="drawer-header">
          <div className="drawer-title-group">
            <ShoppingBag size={22} className="text-primary" />
            <h2 id="cart-drawer-title" className="drawer-title">
              Giỏ hàng của bạn
            </h2>
            <span className="drawer-badge">{totalQuantity} món</span>
          </div>

          <button
            type="button"
            className="btn-close-drawer"
            onClick={() => dispatch(closeCart())}
            aria-label="Đóng giỏ hàng"
          >
            <X size={20} />
          </button>
        </div>

        {/* Nội dung danh sách sản phẩm */}
        <div className="drawer-body">
          {items.length === 0 ? (
            <div className="cart-empty-state">
              <div className="empty-icon-wrap">
                <ShoppingBag size={48} strokeWidth={1.5} />
              </div>
              <h3 className="empty-heading">Giỏ hàng đang trống</h3>
              <p className="empty-subtext">
                Bạn chưa thêm sản phẩm nào. Hãy lựa chọn những thiết bị yêu thích nhé!
              </p>
              <button
                type="button"
                className="btn-primary"
                onClick={() => dispatch(closeCart())}
              >
                Tiếp tục mua sắm
              </button>
            </div>
          ) : (
            <div className="cart-items-list">
              {items.map((item) => (
                <CartItemRow key={item.product.id} item={item} />
              ))}
            </div>
          )}
        </div>

        {/* Footer tổng tiền & thanh toán */}
        {items.length > 0 && (
          <div className="drawer-footer">
            <div className="summary-row">
              <span className="summary-label">Tạm tính:</span>
              <span className="summary-val">${totalPrice.toLocaleString()}</span>
            </div>
            <div className="summary-row">
              <span className="summary-label">Vận chuyển:</span>
              <span className="summary-val text-success">Miễn phí giao hàng</span>
            </div>
            <div className="summary-divider" />
            <div className="summary-row total-row">
              <span className="summary-total-label">Tổng thanh toán:</span>
              <span className="summary-total-val">${totalPrice.toLocaleString()}</span>
            </div>

            <div className="drawer-actions">
              <button
                type="button"
                className="btn-checkout"
                onClick={handleCheckout}
              >
                <span>Tiến hành thanh toán</span>
                <ArrowRight size={18} />
              </button>

              <button
                type="button"
                className="btn-clear-cart"
                onClick={handleClearCart}
              >
                <Trash2 size={16} />
                <span>Xoá sạch giỏ</span>
              </button>
            </div>

            <div className="security-notice">
              <ShieldCheck size={14} />
              <span>Giao dịch bảo mật chuẩn mã hoá SSL 256-bit</span>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
};
