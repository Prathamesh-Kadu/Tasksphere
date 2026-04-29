import { createBrowserRouter } from "react-router-dom";
import LoginPage from "../features/auth/pages/LoginPage";
import RegisterPage from "../features/auth/pages/RegisterPage";
import DashboardPage from "../features/dashboard/pages/DashboardPage";
import ProtectedRoute from "./ProtectedRoute";
import OrganizationPage from "../features/organization/pages/OrganizationPage";
import { AppModal } from "../components/modals/AppModal";
import { OrganizationModal } from "../features/organization/components/OrganizationModal";
import { OrganizationDetailPage } from "../features/organization/pages/OrganizationDetailPage";

const router = createBrowserRouter([
    // { path: "/", element:  },
    { path: "/login", element: <LoginPage /> },
    { path: "/register", element: <RegisterPage /> },
    { path: "/dashboard", element: <DashboardPage /> },

    // --- 3. Super Admin Only Group ---
    {
        path: "/dashboard",
        element: <DashboardPage />,
        children: [
            { index: true, element: null },
            {
                element: <ProtectedRoute allowedRoles={['SUPER_ADMIN']} />,
                children: [
                    { path: "org", element: <OrganizationPage /> },
                    { path: "org/:id", element: <OrganizationDetailPage /> },
                ]
            },
        ]
    },
    // --- 2. Protected Group (Everyone Logged In) ---
    //   {
    //     /* We DON'T give this a 'path'. 
    //        It is just a 'Gatekeeper' for the children below.
    //     */
    //     element: <ProtectedRoute />, 
    //     children: [
    //       { path: "/dashboard", element: <DashboardPage /> },
    //       { path: "/profile", element: <ProfilePage /> },
    //     ]
    //   },

    //   // --- 3. Role-Specific Group (Admins/Managers Only) ---
    //   {
    //     /* HERE is where you put allowedRoles. 
    //        Only children of THIS object will be checked for these roles.
    //     */
    //     element: <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER']} />,
    //     children: [
    //       { path: "/inventory", element: <InventoryPage /> },
    //     ]
    //   },

    //   // --- 4. The Fallback (The "Catch-All") ---
    //   { 
    //     path: "*", 
    //     element: <Navigate to="/login" replace /> 
    //   }

]);

export default router;