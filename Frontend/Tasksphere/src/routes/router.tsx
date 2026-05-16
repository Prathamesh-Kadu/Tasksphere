import { createBrowserRouter, Navigate } from "react-router-dom";
import LoginPage from "../features/auth/pages/LoginPage";
import RegisterPage from "../features/auth/pages/RegisterPage";
import DashboardPage from "../features/dashboard/pages/DashboardPage";
import ProtectedRoute from "./ProtectedRoute";
import OrganizationPage from "../features/organization/pages/OrganizationPage";
import { OrganizationDetailPage } from "../features/organization/pages/OrganizationDetailPage";
import { UserPage } from "../features/user/pages/UserPage";
import { ProjectPage } from "../features/project/pages/ProjectPage";

const router = createBrowserRouter([
    // --- Public Root Fallback ---
    { path: "/", element: <Navigate to="/login" replace /> },
    { path: "/login", element: <LoginPage /> },
    { path: "/register", element: <RegisterPage /> },

    // --- Unified Dashboard & Protected System Layout ---
    {
        path: "/dashboard",
        element: <DashboardPage />,
        children: [
            // This handles loading nothing when strictly visiting exactly "/dashboard"
            { index: true, element: null }, 
            
            // --- Super Admin Only Group ---
            {
                element: <ProtectedRoute allowedRoles={['SUPER_ADMIN']} />,
                children: [
                    { path: "organizations", element: <OrganizationPage /> },
                    { path: "organizations/:id", element: <OrganizationDetailPage /> },
                ]
            },
            
            // --- Shared Management Roles Group (Owner, Admin, Super Admin) ---
            {
                element: <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN', 'OWNER']} />,
                children: [
                    { path: "users", element: <UserPage /> },
                    { path: "projects", element: <ProjectPage /> }, // Placed together in one block
                ]
            },
        ]
    },

    // --- Catch-All Unmatched Routes Fallback ---
    { 
        path: "*", 
        element: <Navigate to="/login" replace /> 
    }
]);

export default router;