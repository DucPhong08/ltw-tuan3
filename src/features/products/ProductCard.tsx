import React from 'react';
import { ShoppingCart, Star, Check, Sparkles, Eye } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { addToCart, openCart, selectCartItemQuantity } from '../cart/cartSlice';
import { openProductDetail } from './productsSlice';
import { showToast } from '../../components/Toast';
import type { Product } from './types';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const dispatch = useAppDispatch();
  const quantityInCart = useAppSelector(selectCartItemQuantity(product.id));

  const handleOpenDetail = () => {
    dispatch(openProductDetail(product));
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(addToCart(product));
    showToast(`Đã thêm "${product.name}" vào giỏ hàng!`, 'success');
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(addToCart(product));
    dispatch(openCart());
  };

  return (
    <article className="product-card" onClick={handleOpenDetail}>
      <div className="product-image-wrap">
        <img
          src={product.image}
          alt={product.name}
          className="product-image"
          loading="lazy"
        />
        <span className="product-category-tag">{product.category}</span>
        {quantityInCart > 0 && (
          <span className="product-in-cart-badge">
            <Check size={12} strokeWidth={3} /> {quantityInCart} trong giỏ
          </span>
        )}
        <div className="product-quick-view-overlay">
          <span className="quick-view-label">
            <Eye size={14} /> Xem chi tiết
          </span>
        </div>
      </div>

      <div className="product-content">
        <div className="product-rating">
          <Star size={14} className="star-icon" fill="#f59e0b" color="#f59e0b" />
          <span className="rate-num">{product.rating.rate}</span>
          <span className="rate-count">({product.rating.count} đánh giá)</span>
        </div>

        <h3 className="product-title" title={product.name}>
          {product.name}
        </h3>

        <p className="product-desc" title={product.description}>
          {product.description}
        </p>

        <div className="product-footer">
          <div className="product-price-box">
            <span className="price-label">Giá bán</span>
            <span className="price-value">${product.price.toLocaleString()}</span>
          </div>

          <div className="product-actions">
            <button
              type="button"
              className="btn-add-cart"
              onClick={handleAddToCart}
              aria-label={`Thêm ${product.name} vào giỏ`}
            >
              <ShoppingCart size={16} />
              <span>Thêm giỏ</span>
            </button>
            <button
              type="button"
              className="btn-buy-now"
              onClick={handleBuyNow}
              title="Mua ngay và mở giỏ hàng"
            >
              <Sparkles size={14} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};
