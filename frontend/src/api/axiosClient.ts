import axios from "axios";
import { useAuthStore } from "../stores/authStore";
import { API_BASE_URL } from "../utils/constants";

export const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.request.use(
  (config) => {
    let token = useAuthStore.getState().token;
    
    if (token) {
      // 🛠️ XỬ LÝ AN TOÀN: Nếu token trong store chưa có chữ 'Bearer ', ta tự động thêm vào.
      // Nếu đã có sẵn chữ 'Bearer ' rồi thì giữ nguyên, tránh bị nhân đôi chuỗi (Bearer Bearer)
      const formattedToken = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
      
      // Đồng bộ gửi cả 2 header để chiều lòng mọi loại middleware cũ/mới của backend
      config.headers["token"] = formattedToken;
      config.headers["Authorization"] = formattedToken;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Chỉ xử lý kick người dùng khi họ đang truy cập các trang nội bộ (yêu cầu quyền hạn)
    // Nếu lỗi 401 xảy ra ngay tại API /login hoặc /register, THẢ RA để giao diện bắt lỗi hiển thị Toast
    const isAuthRoute = error.config?.url?.includes("/login") || error.config?.url?.includes("/register");

    if (error.response && error.response.status === 401 && !isAuthRoute) {
      useAuthStore.getState().clearAuth();
      
      // Kiểm tra an toàn xem có đang ở trang login/register không trước khi chuyển hướng
      const isAuthPage = window.location.pathname.includes("/login") || window.location.pathname.includes("/register");
      
      if (!isAuthPage) {
        window.location.href = "/login?redirected=1";
      }
    }
    return Promise.reject(error);
  }
);

export default axiosClient;