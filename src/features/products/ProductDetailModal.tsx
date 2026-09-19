import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Star,
  ShoppingCart,
  Sparkles,
  Plus,
  Minus,
  ShieldCheck,
  Truck,
  RotateCcw,
  PackageCheck,
  Box,
  CheckCircle2,
  Maximize2,
  RefreshCw,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectSelectedProduct, closeProductDetail } from './productsSlice';
import { addToCart, openCart, selectCartItemQuantity } from '../cart/cartSlice';
import { showToast } from '../../components/Toast';

export const ProductDetailModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const product = useAppSelector(selectSelectedProduct);
  const quantityInCart = useAppSelector(
    product ? selectCartItemQuantity(product.id) : () => 0
  );

  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [is3dMode, setIs3dMode] = useState(false);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [autoRotate, setAutoRotate] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0, glareX: 50, glareY: 50 });
  const [isHoveringImage, setIsHoveringImage] = useState(false);

  const imageCardRef = useRef<HTMLDivElement>(null);

  // Reset state khi mở modal cho sản phẩm mới
  useEffect(() => {
    if (product) {
      setQuantity(1);
      setActiveImageIndex(0);
      setIs3dMode(false);
      setRotationAngle(0);
      setAutoRotate(false);
      setTilt({ x: 0, y: 0, glareX: 50, glareY: 50 });
    }
  }, [product]);

  // Đóng modal khi nhấn phím Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && product) {
        dispatch(closeProductDetail());
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dispatch, product]);

  // Ngăn cuộn trang nền khi modal đang mở
  useEffect(() => {
    if (product) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [product]);

  // Vòng quay 3D tự động khi bật autoRotate
  useEffect(() => {
    if (!is3dMode || !autoRotate) return;
    const interval = setInterval(() => {
      setRotationAngle((prev) => (prev + 1) % 360);
    }, 30);
    return () => clearInterval(interval);
  }, [is3dMode, autoRotate]);

  if (!product) return null;

  const images = product.gallery && product.gallery.length > 0
    ? product.gallery
    : [product.image];
  const currentImage = images[activeImageIndex] || product.image;

  // Xử lý hiệu ứng nghiêng 3D theo chuyển động chuột
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (is3dMode || !imageCardRef.current) return;
    const rect = imageCardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -14;
    const rotateY = ((x - centerX) / centerX) * 14;
    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;

    setTilt({ x: rotateX, y: rotateY, glareX, glareY });
  };

  const handleMouseEnter = () => {
    if (!is3dMode) setIsHoveringImage(true);
  };

  const handleMouseLeave = () => {
    setIsHoveringImage(false);
    setTilt({ x: 0, y: 0, glareX: 50, glareY: 50 });
  };

  const handleIncrease = () => {
    if (quantity < product.stock) {
      setQuantity((q) => q + 1);
    } else {
      showToast(`Chỉ còn ${product.stock} sản phẩm trong kho`, 'info');
    }
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity((q) => q - 1);
    }
  };

  const handleAddToCart = () => {
    dispatch(addToCart({ product, quantity }));
    showToast(`Đã thêm ${quantity} x "${product.name}" vào giỏ hàng!`, 'success');
  };

  const handleBuyNow = () => {
    dispatch(addToCart({ product, quantity }));
    dispatch(closeProductDetail());
    dispatch(openCart());
  };

  const subtotal = product.price * quantity;

  return (
    <div
      className="product-modal-overlay"
      onClick={() => dispatch(closeProductDetail())}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-product-title"
    >
      <div className="product-modal" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="btn-close-modal"
          onClick={() => dispatch(closeProductDetail())}
          aria-label="Đóng chi tiết sản phẩm"
        >
          <X size={20} />
        </button>

        <div className="modal-grid">
          {/* Cột trái: Ảnh 3D & Thư viện ảnh mẫu */}
          <div className="modal-image-col">
            {/* Thanh điều khiển chế độ 3D / Thường */}
            <div className="modal-view-mode-bar">
              <button
                type="button"
                className={`btn-view-mode ${!is3dMode ? 'active' : ''}`}
                onClick={() => {
                  setIs3dMode(false);
                  setAutoRotate(false);
                }}
              >
                <Maximize2 size={13} />
                <span>Ảnh tương tác</span>
              </button>

              <button
                type="button"
                className={`btn-view-mode btn-3d-mode ${is3dMode ? 'active' : ''}`}
                onClick={() => setIs3dMode(true)}
              >
                <Box size={13} />
                <span>Không gian 3D</span>
              </button>

              {is3dMode && (
                <button
                  type="button"
                  className={`btn-auto-rotate ${autoRotate ? 'active' : ''}`}
                  onClick={() => setAutoRotate(!autoRotate)}
                  title="Tự động xoay 360 độ"
                >
                  <RefreshCw size={12} className={autoRotate ? 'spin-anim' : ''} />
                  <span>Xoay 360°</span>
                </button>
              )}
            </div>

            {/* Khung hiển thị ảnh chính với hỗ trợ 3D Tilt & 360 View */}
            <div
              ref={imageCardRef}
              className={`modal-image-stage ${is3dMode ? 'is-3d-active' : ''}`}
              onMouseMove={handleMouseMove}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              style={{
                perspective: '1000px',
              }}
            >
              <div
                className="modal-image-3d-card"
                style={
                  is3dMode
                    ? {
                        transform: `rotateY(${rotationAngle}deg) rotateX(8deg)`,
                        transition: autoRotate ? 'none' : 'transform 0.1s ease-out',
                      }
                    : {
                        transform: isHoveringImage
                          ? `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(1.03, 1.03, 1.03)`
                          : 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
                        transition: isHoveringImage ? 'none' : 'transform 0.4s ease-out',
                      }
                }
              >
                <img
                  src={currentImage}
                  alt={product.name}
                  className="modal-image"
                />

                {/* Ánh sáng phản chiếu động (Dynamic Glare Sheen) khi di chuột */}
                {!is3dMode && isHoveringImage && (
                  <div
                    className="image-glare-overlay"
                    style={{
                      background: `radial-gradient(circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(255, 255, 255, 0.45) 0%, transparent 65%)`,
                    }}
                  />
                )}

                <span className="modal-category-tag">{product.category}</span>

                {is3dMode && (
                  <div className="badge-3d-indicator">
                    <Box size={13} /> Chế độ 3D Perspective ({rotationAngle}°)
                  </div>
                )}
              </div>

              {/* Slider điều chỉnh góc xoay khi ở chế độ 3D */}
              {is3dMode && (
                <div className="rotation-slider-wrap">
                  <span className="slider-label">Góc xoay:</span>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    value={rotationAngle}
                    onChange={(e) => {
                      setAutoRotate(false);
                      setRotationAngle(Number(e.target.value));
                    }}
                    className="rotation-slider"
                  />
                  <span className="slider-val">{rotationAngle}°</span>
                </div>
              )}
            </div>

            {/* Thư viện ảnh ví dụ (Gallery Thumbnails) */}
            {images.length > 1 && (
              <div className="modal-gallery-strip">
                <span className="gallery-label">Bộ sưu tập các góc chụp:</span>
                <div className="gallery-thumbnails">
                  {images.map((imgUrl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className={`gallery-thumb-btn ${idx === activeImageIndex ? 'active' : ''}`}
                      onClick={() => setActiveImageIndex(idx)}
                      title={`Xem góc nhìn ${idx + 1}`}
                    >
                      <img
                        src={imgUrl}
                        alt={`${product.name} - góc ${idx + 1}`}
                        className="thumb-img"
                        loading="lazy"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Các cam kết chính hãng */}
            <div className="modal-guarantees">
              <div className="guarantee-item">
                <ShieldCheck size={16} className="text-primary" />
                <span>Bảo hành chính hãng 24 tháng tận nơi</span>
              </div>
              <div className="guarantee-item">
                <Truck size={16} className="text-primary" />
                <span>Giao hàng miễn phí toàn quốc (1-2 ngày)</span>
              </div>
              <div className="guarantee-item">
                <RotateCcw size={16} className="text-primary" />
                <span>1 đổi 1 trong 30 ngày nếu có lỗi phần cứng</span>
              </div>
            </div>
          </div>

          {/* Cột phải: Thông tin chi tiết & Mua sắm */}
          <div className="modal-info-col">
            <div className="modal-rating">
              <div className="stars-group">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    fill={i < Math.floor(product.rating.rate) ? '#f59e0b' : 'none'}
                    color="#f59e0b"
                  />
                ))}
              </div>
              <span className="modal-rate-num">{product.rating.rate} / 5.0</span>
              <span className="modal-rate-count">
                ({product.rating.count} đánh giá khách hàng)
              </span>
            </div>

            <h2 id="modal-product-title" className="modal-title">
              {product.name}
            </h2>

            <div className="modal-price-row">
              <div className="modal-price">${product.price.toLocaleString()}</div>
              <div className="stock-badge in-stock">
                <PackageCheck size={15} />
                <span>Còn {product.stock} sản phẩm trong kho</span>
              </div>
              {quantityInCart > 0 && (
                <div className="in-cart-pill">
                  Đã có {quantityInCart} trong giỏ hàng
                </div>
              )}
            </div>

            {/* Mô tả sản phẩm */}
            <div className="modal-desc-box">
              <h4 className="desc-heading">Mô tả sản phẩm</h4>
              <p className="modal-desc-text">{product.description}</p>
            </div>

            {/* Đặc điểm công nghệ nổi bật (Features) */}
            {product.features && product.features.length > 0 && (
              <div className="modal-features-box">
                <h4 className="desc-heading">Thông số kỹ thuật &amp; Tính năng nổi bật</h4>
                <ul className="features-list">
                  {product.features.map((feat, idx) => (
                    <li key={idx} className="feature-bullet">
                      <CheckCircle2 size={15} className="text-primary" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Bộ chọn số lượng */}
            <div className="modal-quantity-row">
              <span className="quantity-label">Số lượng mua:</span>
              <div className="modal-stepper">
                <button
                  type="button"
                  className="modal-step-btn"
                  onClick={handleDecrease}
                  disabled={quantity <= 1}
                  aria-label="Giảm số lượng"
                >
                  <Minus size={16} />
                </button>
                <span className="modal-step-num">{quantity}</span>
                <button
                  type="button"
                  className="modal-step-btn"
                  onClick={handleIncrease}
                  disabled={quantity >= product.stock}
                  aria-label="Tăng số lượng"
                >
                  <Plus size={16} />
                </button>
              </div>

              <div className="modal-subtotal">
                Tạm tính: <strong>${subtotal.toLocaleString()}</strong>
              </div>
            </div>

            {/* Nút hành động thêm giỏ & mua ngay */}
            <div className="modal-actions-row">
              <button
                type="button"
                className="btn-modal-add-cart"
                onClick={handleAddToCart}
              >
                <ShoppingCart size={18} />
                <span>Thêm vào giỏ ({quantity})</span>
              </button>

              <button
                type="button"
                className="btn-modal-buy-now"
                onClick={handleBuyNow}
              >
                <Sparkles size={16} />
                <span>Mua ngay</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
