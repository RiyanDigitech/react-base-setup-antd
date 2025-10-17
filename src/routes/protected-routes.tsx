import { Navigate, Outlet, useLocation } from "react-router-dom";
import tokenService from "@/services/token.service";

// Yeh woh routes hain jahan user login kiye baghair ja sakta hai
const AUTH_ROUTES = [
  "/auth/login",
  "/admin/forgot-password",
  "/admin/reset-password/:token", // Dynamic route
];

// Function to check if the current URL is an auth route
const isAuthRoute = (pathname: string) => {
  return AUTH_ROUTES.some((route) => {
    if (route.includes(":")) {
      // Dynamic routes handle karne ke liye (e.g., /reset-password/xyz)
      const baseRoute = route.split(":")[0];
      return pathname.startsWith(baseRoute);
    }
    // Static routes ke liye direct match
    return route === pathname;
  });
};

const ProtectedRoute = () => {
  const { pathname } = useLocation();
  const accessToken = tokenService.getLocalAccessToken();

  // 1️⃣: Agar token NAHI hai aur user protected page par jana chah raha hai
  if (!accessToken && !isAuthRoute(pathname)) {
    // To usko login page par bhej do
    return <Navigate to="/auth/login" replace />;
  }

  // 2️⃣: Agar token HAI aur user login ya forgot password page par ja raha hai
  if (accessToken && isAuthRoute(pathname)) {
    // To usko dashboard par bhej do kyunke woh pehle se logged in hai
    return <Navigate to="/dashboard" replace />;
  }

  // Agar upar wali koi condition nahi hai, to user ko uski manzil par jane do
  // <Outlet /> ka matlab hai ke jo bhi child route match ho raha hai, usay render kar do
  return <Outlet />;
};

export default ProtectedRoute;