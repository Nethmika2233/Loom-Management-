import { Navigate, Outlet } from "react-router-dom";
import { useUserStore } from "@/store/userStore";

export function ProtectedRoute() {
  const isAuthenticated = useUserStore((s) => s.isAuthenticated);
  if (!isAuthenticated) return <Navigate to="/auth/login" replace />;
  return <Outlet />;
}
