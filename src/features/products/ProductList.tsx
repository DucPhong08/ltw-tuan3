import React, { useEffect } from 'react';
import { Loader2, AlertTriangle, RefreshCw, Layers, Database, Zap } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  fetchProducts,
  selectFilteredProducts,
  selectProductsStatus,
  selectProductsError,
  selectDataSourceMode,
  setDataSourceMode,
  selectSelectedCategory,
  selectSearchQuery,
} from './productsSlice';
import { useGetProductsQuery } from './productsApi';
import { ProductCard } from './ProductCard';
import type { Product } from './types';

export const ProductList: React.FC = () => {
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectProductsStatus);
  const error = useAppSelector(selectProductsError);
  const thunkProducts = useAppSelector(selectFilteredProducts);
  const dataSourceMode = useAppSelector(selectDataSourceMode);
  const selectedCategory = useAppSelector(selectSelectedCategory);
  const searchQuery = useAppSelector(selectSearchQuery);

  // RTK Query hook (Bonus)
  const {
    data: rtkProducts,
    isLoading: isRtkLoading,
    isError: isRtkError,
    error: rtkErrorObj,
    refetch: refetchRtk,
  } = useGetProductsQuery(undefined, {
    skip: dataSourceMode !== 'rtk-query',
  });

  // Tự động fetch qua createAsyncThunk khi mount nếu đang ở chế độ thunk
  useEffect(() => {
    if (dataSourceMode === 'thunk' && status === 'idle') {
      dispatch(fetchProducts(false));
    }
  }, [dispatch, dataSourceMode, status]);

  const displayProducts: Product[] = React.useMemo(() => {
    if (dataSourceMode === 'thunk') {
      return thunkProducts;
    }
    const all = rtkProducts || [];
    return all.filter((product) => {
      const matchesCategory =
        selectedCategory === 'All' || product.category === selectedCategory;
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [dataSourceMode, thunkProducts, rtkProducts, selectedCategory, searchQuery]);

  const isLoading =
    dataSourceMode === 'thunk' ? status === 'loading' : isRtkLoading;
  const isError =
    dataSourceMode === 'thunk' ? status === 'failed' : isRtkError;
  const errorMessage =
    dataSourceMode === 'thunk'
      ? error
      : (rtkErrorObj as { data?: string })?.data || 'Lỗi khi gọi RTK Query';

  return (
    <section className="products-section" aria-labelledby="products-heading">
      <div className="section-toolbar">
        <div className="toolbar-info">
          <h2 id="products-heading" className="section-title">
            Danh mục thiết bị công nghệ
          </h2>
          <p className="section-subtitle">
            Khám phá những sản phẩm công nghệ tiên tiến nhất với trải nghiệm mua sắm hiện đại
          </p>
        </div>

        <div className="toolbar-actions">
          {/* Bộ chọn nguồn dữ liệu (createAsyncThunk / RTK Query) */}
          <div className="mode-toggle-group">
            <span className="mode-label">Chế độ API:</span>
            <button
              type="button"
              className={`btn-mode ${dataSourceMode === 'thunk' ? 'active' : ''}`}
              onClick={() => dispatch(setDataSourceMode('thunk'))}
              title="Sử dụng createAsyncThunk"
            >
              <Layers size={14} />
              <span>Async Thunk</span>
            </button>
            <button
              type="button"
              className={`btn-mode ${dataSourceMode === 'rtk-query' ? 'active' : ''}`}
              onClick={() => dispatch(setDataSourceMode('rtk-query'))}
              title="Sử dụng RTK Query Cache"
            >
              <Database size={14} />
              <span>RTK Query</span>
            </button>
          </div>

          {/* Nút Reload và Mô phỏng lỗi */}
          <div className="simulate-btn-group">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => {
                if (dataSourceMode === 'thunk') {
                  dispatch(fetchProducts(false));
                } else {
                  refetchRtk();
                }
              }}
              title="Tải lại danh sách sản phẩm"
            >
              <RefreshCw size={14} />
              <span>Tải lại</span>
            </button>
            {dataSourceMode === 'thunk' && (
              <button
                type="button"
                className="btn-outline-danger"
                onClick={() => dispatch(fetchProducts(true))}
                title="Mô phỏng lỗi phản hồi từ máy chủ"
              >
                <Zap size={14} />
                <span>Mô phỏng lỗi mạng</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Trạng thái Loading */}
      {isLoading && (
        <div className="status-container loading-state">
          <Loader2 className="spinner-icon" size={40} />
          <p className="status-text">Đang tải danh sách sản phẩm qua {dataSourceMode === 'thunk' ? 'createAsyncThunk' : 'RTK Query'}...</p>
          <span className="status-subtext">Đang mô phỏng độ trễ kết nối API...</span>
        </div>
      )}

      {/* Trạng thái Lỗi */}
      {!isLoading && isError && (
        <div className="status-container error-state">
          <div className="error-icon-box">
            <AlertTriangle className="error-icon" size={38} />
          </div>
          <h3 className="error-title">Đã xảy ra lỗi tải dữ liệu</h3>
          <p className="error-message">{errorMessage}</p>
          <div className="error-actions">
            <button
              type="button"
              className="btn-primary"
              onClick={() => dispatch(fetchProducts(false))}
            >
              <RefreshCw size={16} /> Thử lại với dữ liệu chuẩn
            </button>
          </div>
        </div>
      )}

      {/* Trạng thái Không tìm thấy kết quả */}
      {!isLoading && !isError && displayProducts.length === 0 && (
        <div className="status-container empty-state">
          <p className="empty-title">Không tìm thấy sản phẩm nào</p>
          <p className="empty-desc">
            Không có sản phẩm nào phù hợp với từ khóa &ldquo;{searchQuery}&rdquo; trong danh mục đã chọn.
          </p>
        </div>
      )}

      {/* Grid danh sách sản phẩm */}
      {!isLoading && !isError && displayProducts.length > 0 && (
        <div className="products-grid">
          {displayProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
};
