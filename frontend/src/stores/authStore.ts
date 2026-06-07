import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware"; // 🌟 Import middleware lưu trữ cứng

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
  updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setAuth: (user, token) => set({ 
        // Đảm bảo bạn lưu cả object user (bao gồm role) mà server trả về
        user: { ...user }, 
        token 
      }),
      // Hàm lưu thông tin khi đăng nhập thành công

      // Hàm xóa thông tin khi logout
      clearAuth : () => set({ user: null, token: null }),

      // Hàm cập nhật profile
      updateUser: (updatedUser) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updatedUser } : null,
        })),
    }),
    {
      name: "ecommerce-auth-storage", // 🌟 Tên định danh key lưu dưới localStorage
      storage: createJSONStorage(() => localStorage), // Chỉ định lưu vào bộ nhớ cứng localStorage
    }
  )
);

export default useAuthStore;