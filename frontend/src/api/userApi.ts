import { axiosClient } from "./axiosClient"; // Đảm bảo gọi qua client đã có Interceptor cấu hình token

export const userApi = {
  // Hàm xử lý đăng nhập
  signIn: async (credentials: any) => {
    const response = await axiosClient.post("/user/login", credentials);
    return response.data; // 🌟 QUAN TRỌNG: Phải bóc .data để lấy dữ liệu thô từ Backend trả về
  },

  // Hàm xử lý đăng ký
  signUp: async (userData: any) => {
    const response = await axiosClient.post("/user/register", userData);
    return response.data;
  },

  // Hàm cập nhật thông tin thành viên
  updateUser: async (id: string, data: any) => {
    const response = await axiosClient.put(`/user/update/${id}`, data);
    return response.data;
  }
};

export default userApi;