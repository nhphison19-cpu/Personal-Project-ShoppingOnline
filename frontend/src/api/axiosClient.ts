import axios from "axios";
import { useAuthStore } from "../stores/authStore";

export const axiosClient = axios.create({
  baseURL: "http://localhost:5000/api", // 🌟 Hãy đổi lại đúng cổng PORT Backend của bạn (5000 hoặc 8080)
  headers: {
    "Content-Type": "application/json",
  },
});

// 1. Cấu hình gửi Token lên Backend (Request Interceptor)
axiosClient.interceptors.request.use(
  (config) => {
    // Lấy token trực tiếp từ Zustand Store
    const token = useAuthStore.getState().token;
    
    if (token) {
      // 🌟 KIỂM TRA CHẮC CHẮN: Nếu token chưa có chữ Bearer thì mới cộng vào
      if (!token.startsWith("Bearer ")) {
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        config.headers.Authorization = token;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 2. Cấu hình xử lý khi Backend trả lỗi (Response Interceptor)
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthPage = window.location.pathname.includes("/login") || window.location.pathname.includes("/register");
    
    // Nếu bị lỗi 401 Unauthorized và không phải ở trang Login thì mới đá ra ngoài
    if (error.response && error.response.status === 401 && !isAuthPage) {
      useAuthStore.getState().clearAuth();
      localStorage.removeItem("token");
      window.location.href = "/login?redirected=1";
    }
    
    return Promise.reject(error);
  }
);

export default axiosClient;