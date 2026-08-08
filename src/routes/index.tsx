import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ProtectedRoute } from "@/components/common/protected-route";
import { AdminRoute } from "@/components/common/admin-route";
import { PageLoader } from "@/components/common/page-loader";

const AuthLayout = lazy(() => import("@/layouts/AuthLayout"));
const AppLayout = lazy(() => import("@/layouts/AppLayout"));
const AdminLayout = lazy(() => import("@/layouts/AdminLayout"));

const Login = lazy(() => import("@/pages/auth/Login"));
const Register = lazy(() => import("@/pages/auth/Register"));
const ForgotPassword = lazy(() => import("@/pages/auth/ForgotPassword"));
const OtpVerification = lazy(() => import("@/pages/auth/OtpVerification"));

const Dashboard = lazy(() => import("@/pages/Dashboard"));
const AdminDashboard = lazy(() => import("@/pages/AdminDashboard"));
const Boards = lazy(() => import("@/pages/Boards"));
const BoardDetails = lazy(() => import("@/pages/BoardDetails"));
const Calendar = lazy(() => import("@/pages/Calendar"));
const Analytics = lazy(() => import("@/pages/Analytics"));
const Team = lazy(() => import("@/pages/Team"));
const Profile = lazy(() => import("@/pages/Profile"));
const Notifications = lazy(() => import("@/pages/Notifications"));
const Settings = lazy(() => import("@/pages/Settings"));
const HelpCenter = lazy(() => import("@/pages/HelpCenter"));
const NotFound = lazy(() => import("@/pages/NotFound"));

function withSuspense(node: React.ReactNode) {
  return <Suspense fallback={<PageLoader />}>{node}</Suspense>;
}

const router = createBrowserRouter([
  {
    path: "/auth",
    element: withSuspense(<AuthLayout />),
    children: [
      { path: "login", element: withSuspense(<Login />) },
      { path: "register", element: withSuspense(<Register />) },
      { path: "forgot-password", element: withSuspense(<ForgotPassword />) },
      { path: "otp", element: withSuspense(<OtpVerification />) },
    ],
  },
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      {
        element: withSuspense(<AppLayout />),
        children: [
          { index: true, element: withSuspense(<Dashboard />) },
          { path: "boards", element: withSuspense(<Boards />) },
          { path: "boards/:boardId", element: withSuspense(<BoardDetails />) },
          { path: "calendar", element: withSuspense(<Calendar />) },
          { path: "analytics", element: withSuspense(<Analytics />) },
          { path: "team", element: withSuspense(<Team />) },
          { path: "profile", element: withSuspense(<Profile />) },
          { path: "notifications", element: withSuspense(<Notifications />) },
          { path: "settings/*", element: withSuspense(<Settings />) },
          { path: "help", element: withSuspense(<HelpCenter />) },
        ],
      },
      {
        element: <AdminRoute />,
        children: [
          {
            path: "admin",
            element: withSuspense(<AdminLayout />),
            children: [{ index: true, element: withSuspense(<AdminDashboard />) }],
          },
        ],
      },
    ],
  },
  { path: "*", element: withSuspense(<NotFound />) },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
