import React, { useState, useEffect } from 'react';
import { ShoppingCart, Search, Cpu, Sparkles, X } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { openCart, selectCartTotalQuantity } from '../features/cart/cartSlice';
import {
  selectCategories,
  selectSelectedCategory,
  selectSearchQuery,
  setSelectedCategory,
  setSearchQuery,
} from '../features/products/productsSlice';
import { useDebounce } from '../hooks/useDebounce';

export const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const totalQuantity = useAppSelector(selectCartTotalQuantity);
  const categories = useAppSelector(selectCategories);
  const selectedCategory = useAppSelector(selectSelectedCategory);
  const reduxSearchQuery = useAppSelector(selectSearchQuery);

  const [localSearch, setLocalSearch] = useState(reduxSearchQuery);
  const debouncedSearch = useDebounce(localSearch, 300);

  // Đồng bộ giá trị đã debounce vào Redux store sau 300ms người dùng ngừng gõ
  useEffect(() => {
    dispatch(setSearchQuery(debouncedSearch));
  }, [debouncedSearch, dispatch]);

  const handleClear = () => {
    setLocalSearch('');
    dispatch(setSearchQuery(''));
  };

  return (
    <header className="site-header">
      {/* Top Notification Bar */}
      <div className="top-bar">
        <div className="container top-bar-content">
          <div className="top-promo">
            <Sparkles size={14} className="text-amber" />
            <span>Miễn phí giao hàng tiêu chuẩn cho mọi đơn hàng công nghệ trong hôm nay</span>
          </div>
          <div className="student-tag">
            <span>Sinh viên: <strong>Đỗ Đức Phong</strong> &bull; LTWNC</span>
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="main-header">
        <div className="container header-container">
          {/* Brand Logo */}
          <div className="brand-logo">
            <div className="logo-icon-wrap">
              <Cpu size={26} className="logo-icon" />
            </div>
            <div className="logo-text-group">
              <h1 className="logo-title">NovaTech</h1>
              <span className="logo-tagline">Redux Storefront</span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="search-bar-wrap">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Tìm kiếm sản phẩm, thương hiệu, tính năng..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
            />
            {localSearch && (
              <button
                type="button"
                className="search-clear"
                onClick={handleClear}
                aria-label="Xoá tìm kiếm"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Cart Button with Animated Badge */}
          <div className="header-actions">
            <button
              type="button"
              className="btn-cart"
              onClick={() => dispatch(openCart())}
              aria-label={`Xem giỏ hàng, hiện có ${totalQuantity} món`}
            >
              <div className="cart-icon-wrap">
                <ShoppingCart size={20} />
                {totalQuantity > 0 && (
                  <span className="cart-badge" key={totalQuantity}>
                    {totalQuantity > 99 ? '99+' : totalQuantity}
                  </span>
                )}
              </div>
              <span className="cart-btn-label">Giỏ hàng</span>
            </button>
          </div>
        </div>
      </div>

      {/* Category Navigation Bar */}
      <nav className="category-nav" aria-label="Phân loại danh mục sản phẩm">
        <div className="container category-container">
          <div className="category-list">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`category-pill ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => dispatch(setSelectedCategory(cat))}
              >
                {cat === 'All' ? 'Tất cả sản phẩm' : cat}
              </button>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
};
