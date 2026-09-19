# BÀI TẬP TUẦN 3 - LẬP TRÌNH WEB NÂNG CAO (LTWNC)

## Module Giỏ Hàng Hoàn Chỉnh với Redux Toolkit & RTK Query

- **Sinh viên thực hiện:** Đỗ Đức Phong
- **Môn học:** Lập trình Web Nâng cao (LTWNC)
- **Học viện:** Học viện Công nghệ Bưu chính Viễn thông (PTIT)
- **Công nghệ:** React 19, Redux Toolkit 2.x, React-Redux, TypeScript, Vite, Vitest

---

## 🎯 Bảng tổng hợp tính năng kỹ thuật

| Thành phần kỹ thuật                                           | Giải pháp hiện thực                                                                                                                                                                                                                                                                      | File mã nguồn                                                                                                            |
| :------------------------------------------------------------ | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------- |
| **1. Module giỏ hàng gồm `cartSlice` & `productsSlice`**      | • Khởi tạo 2 slice độc lập quản lý trạng thái sản phẩm và giỏ hàng.<br>• Kết hợp tại root store bằng `configureStore`.                                                                                                                                                                   | `src/features/products/productsSlice.ts`<br>`src/features/cart/cartSlice.ts`<br>`src/app/store.ts`                       |
| **2. Quản lý bất đồng bộ với `createAsyncThunk` & RTK Query** | • Dùng `createAsyncThunk` xử lý gọi API giả lập với 3 trạng thái (`pending`, `fulfilled`, `rejected`).<br>• Tích hợp mở rộng `productsApi` bằng **RTK Query** (`fakeBaseQuery`), có nút chuyển đổi linh hoạt trên giao diện.                                                             | `src/features/products/productsSlice.ts`<br>`src/features/products/productsApi.ts`<br>`src/features/products/mockApi.ts` |
| **3. `cartSlice` hỗ trợ thêm, xoá, cập nhật số lượng**        | • `addToCart`: Thêm mới hoặc tự cộng dồn nếu sản phẩm đã có.<br>• `removeFromCart`: Xoá sản phẩm theo ID.<br>• `updateQuantity`: Tăng giảm số lượng (tự xoá khi số lượng &le; 0).<br>• `clearCart`: Làm trống toàn bộ giỏ hàng.<br>• Selectors tính tổng tiền và tổng số lượng tức thời. | `src/features/cart/cartSlice.ts`<br>`src/features/cart/CartDrawer.tsx`<br>`src/features/cart/CartItemRow.tsx`            |
| **4. Toàn bộ component dùng Typed Hooks**                     | • Định nghĩa `useAppDispatch` và `useAppSelector` chuẩn Redux Toolkit 2.x (`withTypes`).<br>• 100% component không gọi trực tiếp hook thô từ `react-redux`.                                                                                                                              | `src/app/hooks.ts`                                                                                                       |
| **5. Cấu trúc thư mục Feature-based**                         | • Tổ chức chuẩn mực theo kiến trúc module:<br>&nbsp;&nbsp;+ `app/`: `store.ts`, `hooks.ts`<br>&nbsp;&nbsp;+ `features/products/`: slice, api, components<br>&nbsp;&nbsp;+ `features/cart/`: slice, components                                                                            | `src/app/`<br>`src/features/products/`<br>`src/features/cart/`                                                           |

---

## 🏛️ 1. Cấu trúc thư mục (Feature-based Architecture)

Dự án tuân thủ nghiêm ngặt nguyên tắc **Co-location** (gộp mã nguồn liên quan về cùng một thư mục tính năng):

```text
ltw-tuan3/
├── src/
│   ├── app/
│   │   ├── store.ts              # Redux Store cấu hình reducer & middleware
│   │   └── hooks.ts              # useAppDispatch, useAppSelector đã gõ kiểu
│   ├── features/
│   │   ├── products/
│   │   │   ├── types.ts          # Interface Product, ProductsState
│   │   │   ├── mockApi.ts        # API giả lập có độ trễ mạng
│   │   │   ├── productsSlice.ts  # createAsyncThunk fetchProducts, reducers & selectors
│   │   │   ├── productsApi.ts    # RTK Query service (lấy điểm cộng)
│   │   │   ├── ProductCard.tsx   # Thẻ sản phẩm với nút thêm giỏ & badge số lượng
│   │   │   └── ProductList.tsx   # Danh sách lưới sản phẩm, bộ lọc, switcher Thunk/RTKQ
│   │   └── cart/
│   │       ├── types.ts          # Interface CartItem, CartState
│   │       ├── cartSlice.ts      # Reducers: addToCart, removeFromCart, updateQuantity, clearCart
│   │       ├── CartDrawer.tsx    # Slide-over Drawer giỏ hàng, tổng tiền & thanh toán
│   │       └── CartItemRow.tsx   # Hàng sản phẩm trong giỏ kèm bộ tăng giảm số lượng
│   ├── components/
│   │   ├── Header.tsx            # Navbar, tìm kiếm, lọc danh mục, badge giỏ hàng
│   │   └── Toast.tsx             # Thông báo toast phản hồi người dùng
│   ├── __tests__/
│   │   ├── cartSlice.test.ts     # 12 unit tests cho cartSlice
│   │   └── productsSlice.test.ts # 11 unit tests cho productsSlice
│   ├── App.tsx                   # Bố cục chính của ứng dụng
│   ├── index.css                 # Giao diện hiện đại, glassmorphism, responsive
│   └── main.tsx                  # Entry point bọc Redux Provider
├── package.json
└── README.md
```

---

## 🔄 2. Sơ đồ Luồng Dữ Liệu Redux (Redux Data Flow)

```
[UI Component: ProductCard / CartDrawer]
        │
        │ 1. dispatch(addToCart(product)) hoặc dispatch(fetchProducts())
        ▼
   [Middleware] ── (RTK Query / Async Thunk xử lý gọi API bất đồng bộ)
        │
        │ 2. Chuyển Action vào Store
        ▼
 [Redux Root Store]
   ├── productsReducer (Cập nhật status: 'loading' | 'succeeded' | 'failed')
   └── cartReducer     (Immer JS cập nhật bất biến state.items)
        │
        │ 3. State mới được lưu trữ an toàn
        ▼
 [Typed Selectors]
   ├── selectCartTotalQuantity -> Bảng điện tử badge giỏ hàng
   ├── selectCartTotalPrice    -> Tổng tiền thanh toán
   └── selectFilteredProducts  -> Grid hiển thị sản phẩm
        │
        │ 4. Chỉ re-render những component có dữ liệu bị thay đổi
        ▼
   [UI cập nhật tức thời]
```

### 💡 Câu chuyện minh họa thực tế (Story Analogy)

> Bạn bước vào một tòa nhà bách hóa cao cấp với một cuốn sổ kiểm kê trung tâm (**Redux Store**). Khi bạn muốn chọn mua một chiếc laptop, bạn không được tự ý cầm bút vào kho sửa số liệu, mà bạn ghi vào một phiếu yêu cầu (_dispatch một Action_) gửi tới quầy thủ kho (**Reducer**).
>
> Người thủ kho kiểm tra sổ sách, dùng bút mực đặc biệt ghi đè dữ liệu một cách an toàn và bất biến (_Immer JS_). Ngay khi phiếu được xử lý xong, bảng điện tử ngoài sảnh (_useAppSelector_) lập tức nhảy số tiền và tổng mặt hàng mới để bạn nhìn thấy ngay tức thì.
>
> Khi hàng hết cần nhập thêm từ nhà máy, nhân viên sẽ gửi lệnh điều chuyển đặc biệt (_`createAsyncThunk`_ hoặc _`RTK Query`_): sổ ghi chú trạng thái "đang vận chuyển" (_pending_), khi xe tải về tới nơi (_fulfilled_) thì mới chính thức cập nhật danh sách vào kệ bán hàng.

---

## ⚖️ 3. So sánh: `createAsyncThunk` vs `RTK Query`

| Tiêu chí               | `createAsyncThunk` (productsSlice)                                                        | `RTK Query` (productsApi)                                                              |
| :--------------------- | :---------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------- |
| **Mục đích chính**     | Tự quản lý luồng action bất đồng bộ theo ý muốn.                                          | Giải pháp trọn gói cho Data Fetching & Caching.                                        |
| **Boilerplate code**   | Cần khai báo thunk, extraReducers (`pending`, `fulfilled`, `rejected`) và state thủ công. | Tự động sinh action, reducer và các custom hook (`useGetProductsQuery`).               |
| **Cơ chế Caching**     | Phải tự xây dựng logic cache trong state nếu cần.                                         | Tự động cache theo tham số, tự loại bỏ khi không dùng, tự re-fetch khi tag invalidate. |
| **Độ linh hoạt**       | Rất cao: Có thể dispatch nhiều action phụ, can thiệp logic trung gian.                    | Tối ưu hóa tối đa cho các hoạt động CRUD qua API tiêu chuẩn.                           |
| **Tình huống sử dụng** | Khi cần kiểm soát toàn diện luồng dispatch và state nội bộ.                               | Khi ưu tiên tối giản code, tự động quản lý cache và deduping request.                  |

---

## 🧪 4. Hướng dẫn chạy & Kiểm thử

### 4.1. Cài đặt các gói phụ thuộc

```bash
npm install
```

### 4.2. Khởi chạy ứng dụng (Development Mode)

```bash
npm run dev
```
