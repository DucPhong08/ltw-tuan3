import type { Product } from "./types";

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "prod-1",
    name: 'MacBook Pro 16" M3 Max',
    price: 3499,
    description:
      "Chip M3 Max 16-core CPU, 40-core GPU, 48GB Unified Memory, 1TB SSD Storage.",
    category: "Laptop",
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&w=800&q=80",
    ],
    features: ["Liquid Retina XDR 120Hz", "Thời lượng pin 22 giờ", "Cổng sạc MagSafe 3", "3 cổng Thunderbolt 4"],
    rating: { rate: 4.9, count: 128 },
    stock: 12,
  },
  {
    id: "prod-2",
    name: "Sony WH-1000XM5 Wireless",
    price: 399,
    description:
      "Tai nghe chống ồn chủ động hàng đầu, âm thanh Hi-Res, thời lượng pin 30 giờ.",
    category: "Audio",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80",
    ],
    features: ["Bộ xử lý V1 + QN1 độc quyền", "Khử tiếng ồn 8 micro", "Đàm thoại AI siêu nét", "Sạc nhanh 3 phút dùng 3 giờ"],
    rating: { rate: 4.8, count: 256 },
    stock: 25,
  },
  {
    id: "prod-3",
    name: "iPhone 16 Pro Max 256GB",
    price: 1199,
    description:
      "Thiết kế Titan sa mạc sang trọng, nút Camera Control mới, chip A18 Pro siêu mạnh.",
    category: "Điện thoại",
    image:
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1512054502232-10a0a035d672?auto=format&fit=crop&w=800&q=80",
    ],
    features: ["Khung viền Titan Cấp 5", "Camera Fusion 48MP zoom 5x", "Màn hình Super Retina XDR 6.9 inch", "Apple Intelligence Ready"],
    rating: { rate: 4.9, count: 412 },
    stock: 18,
  },
  {
    id: "prod-4",
    name: "Bàn phím cơ Keychron Q1 Pro",
    price: 199,
    description:
      "Bàn phím custom cơ không dây CNC Aluminum, switch Gateron Jupiter, hỗ trợ QMK/VIA.",
    category: "Phụ kiện",
    image:
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1561557944-6e7860d1a7eb?auto=format&fit=crop&w=800&q=80",
    ],
    features: ["Thân nhôm CNC nguyên khối", "Kết nối Bluetooth 5.1 & Type-C", "Hot-swappable 5-pin", "Đệm Double-Gasket êm ái"],
    rating: { rate: 4.7, count: 89 },
    stock: 30,
  },
  {
    id: "prod-5",
    name: "Chuột công thái học Logitech MX Master 3S",
    price: 99,
    description:
      "Cảm biến Darkfield 8K DPI lướt trên mọi bề mặt, con lăn MagSpeed siêu tốc cực êm.",
    category: "Phụ kiện",
    image:
      "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1626218174358-7769486c4b79?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80",
    ],
    features: ["Click yên tĩnh giảm 90% tiếng ồn", "Con lăn MagSpeed cuộn 1000 dòng/giây", "Logitech Flow liên kết 3 thiết bị", "Pin dùng 70 ngày"],
    rating: { rate: 4.9, count: 320 },
    stock: 45,
  },
  {
    id: "prod-6",
    name: 'Màn hình Dell UltraSharp 27" 4K',
    price: 629,
    description:
      "Độ phân giải 4K IPS Black chuẩn màu đồ họa 98% DCI-P3, tích hợp cổng USB-C 90W PD.",
    category: "Màn hình",
    image:
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1585792180666-f75a794f887c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=800&q=80",
    ],
    features: ["Công nghệ IPS Black tương phản 2000:1", "Hub kết nối USB-C 90W & RJ45", "Delta E < 2 chuẩn màu tuyệt đối", "ComfortView Plus bảo vệ mắt"],
    rating: { rate: 4.6, count: 95 },
    stock: 8,
  },
  {
    id: "prod-7",
    name: 'iPad Pro 13" M4 OLED',
    price: 1299,
    description:
      "Màn hình Ultra Retina XDR Tandem OLED đột phá, siêu mỏng 5.1mm, hỗ trợ Apple Pencil Pro.",
    category: "Tablet",
    image:
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1561154464-82e9adf32764?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1589739900243-4b52cd9b104e?auto=format&fit=crop&w=800&q=80",
    ],
    features: ["Chip Apple M4 tiến trình 3nm", "Độ sáng đỉnh 1600 nits XDR", "Hỗ trợ Magic Keyboard haptic", "Camera 12MP LiDAR Scanner"],
    rating: { rate: 4.8, count: 140 },
    stock: 14,
  },
  {
    id: "prod-8",
    name: "Apple Watch Ultra 2 Titanium",
    price: 799,
    description:
      "Vỏ titan 49mm siêu bền, GPS tần số kép chuẩn xác, pin 72 giờ ở chế độ tiết kiệm năng lượng.",
    category: "Đồng hồ",
    image:
      "https://images.unsplash.com/photo-1510017803434-a899398421b3?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1510017803434-a899398421b3?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?auto=format&fit=crop&w=800&q=80",
    ],
    features: ["Màn hình 3000 nits sáng nhất Apple", "Kháng nước 100m, chuẩn lặn EN13319", "Cảm biến đo độ sâu & nhiệt độ nước", "Nút Action tùy biến đa năng"],
    rating: { rate: 4.9, count: 110 },
    stock: 20,
  },
];

export const fetchProductsApi = async (
  shouldFail = false,
  delayMs = 600,
): Promise<Product[]> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail) {
        reject(
          new Error(
            "Lỗi máy chủ: Không thể tải danh sách sản phẩm (Mô phỏng lỗi mạng 500)",
          ),
        );
      } else {
        // Trả về bản sao tránh mutate dữ liệu gốc
        resolve(JSON.parse(JSON.stringify(MOCK_PRODUCTS)));
      }
    }, delayMs);
  });
};
