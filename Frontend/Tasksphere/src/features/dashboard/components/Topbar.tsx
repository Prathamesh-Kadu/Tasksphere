import { BiLogOut } from "react-icons/bi";
import useAuth from "../../../hooks/useAuth";
import { AiOutlineMenu } from "react-icons/ai";
import "./../styles/Sidebar.css";

const TopBar = () => {
  const { user, role, logout } = useAuth();

  const getInitial = () => {
    if (user?.name) return user.name.charAt(0).toUpperCase();
    return "U";
  };

  return (
    <nav className="navbar navbar-expand bg-white border-bottom px-2 py-2 sticky-top shadow-sm">
      <div className="container-fluid d-flex justify-content-between align-items-center">
        <button
          className="btn d-lg-none me-3 border-0 p-0 hamburger-btn"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#mobileSidebar"
          aria-controls="mobileSidebar"
        >
          <AiOutlineMenu size={24} />
        </button>
        <span className="navbar-brand d-lg-none fw-bold" style={{ color: "#002141" }}>
          TaskSphere
        </span>

        <div className="dropdown ms-auto py-2">
          <div
            className="d-flex align-items-center dropdown-toggle border-0"
            data-bs-toggle="dropdown"
            style={{ cursor: 'pointer', background: 'none' }}
          >
            <div
              className="d-flex d-md-none rounded-circle bg-primary text-white align-items-center justify-content-center fw-bold shadow-sm"
              style={{ width: '35px', height: '35px', fontSize: '0.9rem' }}
            >
              {getInitial()}
            </div>

            {/* Desktop View: Dynamic Name and Role */}
            <div className="d-none d-md-block text-end me-2">
              <div className="fw-bold text-dark mb-0" style={{ fontSize: '14px' }}>
                {user?.name || "Loading..."}
              </div>
              <div className="text-dark opacity-75 fw-medium text-uppercase" style={{ fontSize: '10px', marginTop: '-2px', letterSpacing: '0.5px' }}>
                {role || "Guest"}
              </div>
            </div>
          </div>

          {/* Dropdown Menu */}
          <ul className="dropdown-menu dropdown-menu-end shadow border-0 mt-2">
            {/* Mobile-only header inside dropdown */}
            <li className="px-3 py-2 d-md-none border-bottom mb-1">
              <div className="fw-bold small">{user?.name}</div>
              <div className="text-muted" style={{ fontSize: '10px' }}>{role}</div>
            </li>

            <li>
              <button
                className="dropdown-item d-flex align-items-center py-2 text-danger fw-medium"
                onClick={logout}
              >
                <BiLogOut size={16} className="me-2" /> Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default TopBar;