import { createBrowserRouter, Navigate } from "react-router-dom";
import DashboardLayout from "@/components/layouts/dashboard-layout";
import ProtectedRoute from "./protected-routes";

// Auth Pages (Public)
import LoginPage from "@/pages/auth/login-page";
import ForGetPassword from "@/pages/auth/forget-password";
import ResetNewPassword from "@/pages/auth/reset-new-password";

// Protected Pages
import DashboardPage from "@/pages/dashboard";
import ChangePassword from "@/pages/auth/change-password";
import Pokemons from "@/pages/pokemons/pokemons";
import Teams from "@/pages/Teams/Teams";
import SignUpPage from "@/pages/auth/signup";
// import FranchiseDashboardPage from "@/pages/dashboard/dashboard"; // This seems like a duplicate of DashboardPage

const router = createBrowserRouter([
  // =================================================================
  //  ✅ PROTECTED ROUTES (Login ke baad walay pages)
  // =================================================================
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { path: "/", element: <Navigate to="/dashboard" replace /> },
          { path: "/dashboard", element: <DashboardPage /> },
          { path: "/admin/change-password", element: <ChangePassword /> },
          {path: "/pokemons", element: <Pokemons />},
           {path: "/teams", element: <Teams />},
          // ...yahan aur protected routes add karein
        ],
      },
    ],
  },

  // =================================================================
  //  📢 PUBLIC ROUTES (Login ke baghair walay pages)
  // =================================================================
  {
    path: "/auth/login",
    element: <LoginPage />,
  },
  {
    path: "/admin/forgot-password",
    element: <ForGetPassword />,
  },
  {
    path: "/admin/reset-password/:token",
    element: <ResetNewPassword />,
  },
{path: "/auth/signup", element: <SignUpPage />},

  // Optional: 404 Not Found Page ke liye
  // {
  //   path: "*",
  //   element: <div>Page Not Found!</div>,
  // },
]);

export default router;