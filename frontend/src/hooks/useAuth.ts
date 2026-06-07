// src/hooks/useAuth.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../stores/authStore";
import { userApi } from "../api/userApi";
import { toast } from "react-hot-toast";

export function useAuth() {
  const queryClient = useQueryClient();
  const { user, token, setAuth, clearAuth, updateUser: updateLocalUser } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: userApi.signIn,
    onSuccess: (res) => {
      // Kiểm tra status chuẩn
      if (res.status === "SUCCESS" || res.status === "OK") {
        const token = res.access_token;
        // Lấy thông tin user: lấy từ res.user hoặc res.data
        const userData = res.user || res.data ;

        if (token) {
          setAuth(userData, token);
          localStorage.setItem("token", token);
          toast.success("Đăng nhập thành công!");
        } else {
          toast.error("Thiếu Token trong phản hồi.");
        }
      } else {
        toast.error(res.message || "Đăng nhập thất bại.");
      }
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Lỗi đăng nhập.");
    }
  });

  // TỐI ƯU HÓA ROLE: .toUpperCase() để đảm bảo "admin" hay "ADMIN" đều đúng
  const isAuthenticated = !!token && !!user;
  const isAdmin = user?.role?.toUpperCase() === "ADMIN";

  return {
    user,
    token,
    isAuthenticated,
    isAdmin, // Giờ đây sẽ trả về true nếu role là "ADMIN"
    login: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    logout: () => {
      clearAuth();
      localStorage.removeItem("token");
      queryClient.clear();
    }
  };
}