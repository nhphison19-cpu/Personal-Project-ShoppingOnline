import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../stores/authStore";
import { userApi } from "../api/userApi";
import { toast } from "react-hot-toast";        

export function useAuth() {
  const queryClient = useQueryClient();
  const { user, token, setAuth, clearAuth, updateUser: updateLocalUser } = useAuthStore();

  // 1. Xử lý đột biến Đăng nhập
  const loginMutation = useMutation({
    mutationFn: userApi.signIn,
    onSuccess: (res) => {
    // Kiểm tra trạng thái thành công
    if (res.status === "SUCCESS" || res.status === "OK") {
      
      // Nếu Backend trả về thông tin user trong res.data thì lấy ra, 
      // nếu không thì có thể chính đối tượng 'res' đã chứa thông tin user.
      // Dựa trên log của bạn, hãy thử lấy thông tin user từ res trực tiếp 
      // hoặc kiểm tra xem Backend có gửi object user nào không.
      const userData = res.user || res.data || { email: "user@store.com", role: "USER" }; // Fallback nếu thiếu
      const token = res.access_token;

      if (token) {
        setAuth(userData, token);
        localStorage.setItem("token", token);
        toast.success("Đăng nhập thành công!");
      } else {
        toast.error("Đăng nhập thành công nhưng thiếu token.");
      }
    } else {
      toast.error(res.message || "Đăng nhập thất bại.");
    }
  },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Mật khẩu hoặc tài khoản không chính xác.");
    }
  });

  // 2. Xử lý đột biến Đăng ký
  const registerMutation = useMutation({
    mutationFn: userApi.signUp
  });

  // 3. Xử lý đột biến Cập nhật thông tin cá nhân
  const updateProfileMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: { name?: string; avatar?: string } }) =>
      userApi.updateUser(id, data),
    onSuccess: (res) => {
      // 🛠️ ĐÃ SỬA: Đồng bộ hóa status kiểm tra cập nhật profile
      if ((res.status === "SUCCESS" || res.status === "OK") && res.data) {
        updateLocalUser(res.data);
        toast.success("Cập nhật tài khoản thành công!");
      }
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Không thể cập nhật hồ sơ.");
    }
  });

  // 🛠️ ĐÃ SỬA: Trạng thái xác thực tối ưu cần có cả token hợp lệ và thông tin người dùng cụ thể
  const isAuthenticated = !!token && !!user;
  const isAdmin = user?.role === "ADMIN";

  return {
    user,
    token,
    isAuthenticated,
    isAdmin,
    login: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    register: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,
    updateProfile: updateProfileMutation.mutateAsync,
    isUpdatingProfile: updateProfileMutation.isPending,
    logout: () => {
      clearAuth();
      localStorage.removeItem("token");
      queryClient.clear(); // Xóa sạch dữ liệu cache cũ của React Query tránh lộ thông tin người dùng cũ
      toast.success("Đã đăng xuất khỏi hệ thống.");
    }
  };
}

export default useAuth;