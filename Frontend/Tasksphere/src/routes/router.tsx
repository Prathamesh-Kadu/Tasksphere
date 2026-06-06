import { createBrowserRouter, Navigate } from "react-router-dom";
import LoginPage from "../features/auth/pages/LoginPage";
import RegisterPage from "../features/auth/pages/RegisterPage";
import DashboardPage from "../features/dashboard/pages/DashboardPage";
import ProtectedRoute from "./ProtectedRoute";
import OrganizationPage from "../features/organization/pages/OrganizationPage";
import { OrganizationDetailPage } from "../features/organization/pages/OrganizationDetailPage";
import { UserPage } from "../features/user/pages/UserPage";
import { ProjectPage } from "../features/project/pages/ProjectPage";
import { TaskPage } from "../features/task/pages/TaskPage";
import { ManageTaskPage } from "../features/task/pages/ManageTaskPage";
import { NotFoundPage } from "../pages/NotFoundPage";

const router = createBrowserRouter([
    { path: "/", element: <Navigate to="/login" replace /> },
    { path: "/login", element: <LoginPage /> },
    { path: "/register", element: <RegisterPage /> },

    {
        path: "/dashboard",
        element: <DashboardPage />,
        children: [
            { index: true, element: null },

            {
                element: <ProtectedRoute allowedRoles={['SUPER_ADMIN']} />,
                children: [
                    { path: "organizations", element: <OrganizationPage /> },
                    { path: "organizations/:id", element: <OrganizationDetailPage /> },
                ]
            },

            {
                element: <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN', 'OWNER']} />,
                children: [
                    { path: "users", element: <UserPage /> },
                    { path: "projects", element: <ProjectPage /> },
                ]
            },
            {
                element: <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN', 'OWNER', 'MEMBER']} />,
                children: [
                    { path: "tasks", element: <TaskPage /> },
                ]
            },
            {
                element: <ProtectedRoute allowedRoles={['ADMIN']} />,
                children: [
                    { path: "tasks/manage", element: <ManageTaskPage /> },
                    { path: "tasks/manage/:id", element: <ManageTaskPage /> },
                ]
            },
        ]
    },
    {
        path: "*",
        element: <NotFoundPage />
    }
]);

export default router;