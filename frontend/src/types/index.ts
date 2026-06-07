export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'USER' | 'ADMIN';
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image?: string;
}

export interface Brand {
  id: string;
  name: string;
  logo?: string;
}

export interface ProductImage {
  id: string;
  url: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  discountPrice?: number;
  stock: number;
  sold: number;
  categoryId: string;
  brandId: string;
  category: Category;
  brand: Brand;
  images: ProductImage[];
  reviews: Review[];
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  quantity: number;
  product: Product;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
}

export type OrderStatus = 'PENDING' | 'PROCESSING' | 'SHIPPING' | 'DELIVERED' | 'CANCELLED';

// 🌟 ĐỒNG BỘ: Thêm 'MOMO' vào danh sách các phương thức thanh toán hợp lệ ở Frontend
export type PaymentMethod = 'COD' | 'STRIPE' | 'VNPAY' | 'MOMO';

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  product: Product;
}

export interface Order {
  id: string;
  userId: string;
  totalPrice: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  shippingAddress: string;
  orderItems: OrderItem[];
  user?: User;
  createdAt: string;
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  userId: string;
  productId: string;
  user: User;
  createdAt: string;
}

export interface Address {
  id: string;
  fullName: string;
  phone: string;
  city: string;
  district: string;
  ward: string;
  detail: string;
}

export interface Wishlist {
  id: string;
  userId: string;
  productId: string;
  product: Product;
}

// 🌟 ĐỒNG BỘ: Mở rộng status nhận cả 'SUCCESS', 'ERROR' hoặc 'FAILED' từ Backend mới viết
export interface ApiResponse<T = any> {
  status: 'OK' | 'ERR' | 'SUCCESS' | 'ERROR' | 'FAILED';
  message: string;
  data?: T;
  access_token?: string;
  refresh_token?: string; // Bổ sung thêm trường này nếu bạn lưu cả refresh token ở FE
}

export interface AuthTokens {
  access_token: string;
  refresh_token?: string;
}