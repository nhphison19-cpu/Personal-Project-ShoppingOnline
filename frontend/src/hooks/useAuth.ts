import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../stores/authStore";
import { userApi } from "../api/userApi";

export function useAuth() {
  const queryClient = useQueryClient();
  const { user, token, setAuth, clearAuth, updateUser: updateLocalUser } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: userApi.signIn,
    onSuccess: (res) => {
      if (res.status === "OK" && res.data && res.access_token) {
        setAuth(res.data, res.access_token);
      }
    }
  });

  const registerMutation = useMutation({
    mutationFn: userApi.signUp
  });

  const updateProfileMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: { name?: string; avatar?: string } }) =>
      userApi.updateUser(id, data),
    onSuccess: (res) => {
      if (res.status === "OK" && res.data) {
        updateLocalUser(res.data);
      }
    }
  });

  const isAuthenticated = !!token;
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
      queryClient.clear();
    }
  };
}
export default useAuth;
