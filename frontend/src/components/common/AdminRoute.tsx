import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";

export function AdminRoute() {
  const user = useAuthStore((state) => state.user);
  if (!user || user.role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
}
export default AdminRoute;
