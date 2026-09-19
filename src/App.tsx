import React from 'react';
import { Header } from './components/Header';
import { ProductList } from './features/products/ProductList';
import { CartDrawer } from './features/cart/CartDrawer';
import { ToastContainer } from './components/Toast';
import { ProductDetailModal } from './features/products/ProductDetailModal';
import { CheckCircle, Layers, Cpu, Heart, Sparkles } from 'lucide-react';

export const App: React.FC = () => {
  return (
    <div className="app-layout">
      {/* Toast thông báo toàn cục */}
      <ToastContainer />

      {/* Header thanh điều hướng & giỏ hàng */}
      <Header />

      {/* Main Content */}
      <main className="main-content">
        {/* Hero Banner giới thiệu cửa hàng */}
        <div className="container">
          <section className="hero-banner" aria-labelledby="banner-heading">
            <div className="hero-content">
              <div className="hero-tag">
                <Sparkles size={14} className="text-amber" />
                <span>NovaTech Official Store 2026</span>
              </div>
              <h2 id="banner-heading" className="hero-title">
                Thiết Bị Công Nghệ Tiên Phong &amp; Trải Nghiệm Mua Sắm Đỉnh Cao
              </h2>
              <p className="hero-desc">
                Tuyển chọn những sản phẩm phần cứng, âm thanh và phụ kiện thông minh hàng đầu.
                Khám phá danh mục thiết bị và trải nghiệm tính năng giỏ hàng cập nhật theo thời gian thực.
              </p>

              <div className="hero-features">
                <div className="hero-feature-item">
                  <CheckCircle size={18} className="feature-icon" />
                  <span>100% Hàng chính hãng</span>
                </div>
                <div className="hero-feature-item">
                  <CheckCircle size={18} className="feature-icon" />
                  <span>Bảo hành 24 tháng tận nơi</span>
                </div>
                <div className="hero-feature-item">
                  <CheckCircle size={18} className="feature-icon" />
                  <span>Giao hàng miễn phí toàn quốc</span>
                </div>
              </div>
            </div>

            <div className="hero-aside">
              <div className="hero-stat-card">
                <div className="stat-icon-wrap">
                  <Cpu size={22} />
                </div>
                <div className="stat-info">
                  <span className="stat-value">Top Tier</span>
                  <span className="stat-label">Công nghệ thế hệ mới</span>
                </div>
              </div>
              <div className="hero-stat-card">
                <div className="stat-icon-wrap">
                  <Layers size={22} />
                </div>
                <div className="stat-info">
                  <span className="stat-value">Realtime</span>
                  <span className="stat-label">Đồng bộ giỏ hàng tức thời</span>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Danh sách sản phẩm */}
        <div className="container">
          <ProductList />
        </div>
      </main>

      {/* Cart Drawer trượt từ bên phải */}
      <CartDrawer />

      {/* Product Detail Modal xem chi tiết sản phẩm */}
      <ProductDetailModal />

      {/* Footer */}
      <footer className="site-footer">
        <div className="container footer-content">
          <div className="footer-left">
            <div className="footer-brand">
              <Cpu size={20} />
              <span>NovaTech Storefront</span>
            </div>
            <p className="footer-copyright">
              Hệ thống cửa hàng thiết bị công nghệ hiện đại. Bản quyền &copy; 2026 NovaTech.
            </p>
          </div>
          <div className="footer-right">
            <span className="student-tag">Phát triển bởi <strong>Đỗ Đức Phong</strong> (LTWNC)</span>
            <Heart size={14} className="text-danger" fill="#ef4444" />
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
