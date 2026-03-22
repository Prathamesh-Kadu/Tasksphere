import { Link, useLocation } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import { roleMenu } from "../config/roleMenu";

export default function Sidebar() {
    const location = useLocation();
    const { user } = useAuth();
    
    const currentRole = user?.role || "MEMBER";
    const menuItems = roleMenu[currentRole] || roleMenu["MEMBER"];

    const isActive = (path: string) => location.pathname === path;

    // HELPER: This avoids repeating the <ul> code twice
    const MenuList = () => (
        <ul className="nav mt-2 flex-column">
            {menuItems.map((item) => (
                <li key={item.path} className="nav-item w-100">
                    <Link
                        to={item.path}
                        data-bs-dismiss="offcanvas" 
                        className={`nav-link d-flex align-items-center px-4 py-3 
                            ${isActive(item.path) ? "bg-primary text-white" : "text-white-50 hover-effect"}`}
                    >
                        <item.icon size={18} className="me-3" />
                        <span className="fw-semibold">{item.label}</span>
                    </Link>
                </li>
            ))}
        </ul>
    );

    return (
        <>
            {/* --- 1. DESKTOP SIDEBAR  --- */}
            <div className="d-none d-lg-block flex-column vh-100 text-white shadow"
                style={{ width: "20%", background: "#002141", position: "fixed", top: 0, left: 0, zIndex:'9999'}}
            >
                <div className="px-4 py-4 d-flex align-items-center">
                    <span className="fs-4 fw-bold tracking-wider">TaskSphere</span>
                </div>
                <MenuList />
            </div>

            {/* --- 2. MOBILE SIDEBAR  --- */}
            <div 
                className="offcanvas offcanvas-start d-lg-none text-white" 
                id="mobileSidebar" 
                tabIndex={-1} 
                style={{ background: "#002141", width: "280px" }}
            >
                <div className="offcanvas-header px-4 py-4">
                    <h5 className="offcanvas-title fw-bold">TaskSphere</h5>
                    <button type="button" className="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div className="offcanvas-body p-0">
                    <MenuList />
                </div>
            </div>
        </>
    );
}