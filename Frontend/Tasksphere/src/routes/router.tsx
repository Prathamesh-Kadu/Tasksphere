import { createBrowserRouter } from "react-router-dom";
import LoginPage from "../features/auth/pages/LoginPage";
import RegisterPage from "../features/auth/pages/RegisterPage";
import DashboardPage from "../features/dashboard/pages/DashboardPage";

const router = createBrowserRouter([

    { path: "/login", element: <LoginPage /> },
    { path: "/register", element: <RegisterPage /> },
    { path: "/dashboard", element: <DashboardPage /> }


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