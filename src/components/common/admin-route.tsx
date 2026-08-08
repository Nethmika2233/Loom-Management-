import { Navigate, Outlet } from "react-router-dom";
import { useUserStore } from "@/store/userStore";

export function AdminRoute() {
  const user = useUserStore((s) => s.user);
  if (user?.role !== "admin") return <Navigate to="/" replace />;
  return <Outlet />;
}
