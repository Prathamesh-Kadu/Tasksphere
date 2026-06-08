import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/Topbar";
import { BiRefresh, BiLogOut } from "react-icons/bi";
import "./../styles/Sidebar.css";
import useAuth from "../../../hooks/useAuth";

const PendingWorkspace = () => {
    const { logout, user } = useAuth();

    const handleRefresh = () => {
        window.location.reload();
    };

    return (
        <div className="d-flex align-items-center justify-content-center flex-grow-1 p-2 py-5" style={{ minHeight: "65vh" }}>
            <div className="text-center p-5 bg-white shadow-sm rounded-4 border w-100" style={{ maxWidth: "500px" }}>
                <div className="mb-4">
                    <div className="spinner-grow text-primary opacity-25" role="status" style={{ width: "3rem", height: "3rem" }}></div>
                    <div className="text-primary fw-bold" style={{ fontSize: "1.8rem", marginTop: "-2.8rem" }}>⏳</div>
                </div>

                <h4 className="fw-bold text-dark mb-2">Welcome, {user?.name || "Team Member"}!</h4>
                <p className="text-muted small px-2">
                    Your account profile is ready, but you haven't been linked to an organization workspace yet.
                    Please contact your manager or platform administrator to get added to your team.
                </p>

                <div className="d-flex justify-content-center gap-3 mt-4">
                    <button onClick={handleRefresh} className="btn btn-primary d-inline-flex align-items-center gap-2 px-4 py-2 rounded-pill shadow-sm fw-medium btn-sm">
                        <BiRefresh size={18} /> Check Access Again
                    </button>
                    <button onClick={logout} className="btn btn-outline-danger d-inline-flex align-items-center gap-2 px-4 py-2 rounded-pill fw-medium btn-sm">
                        <BiLogOut size={14} /> Logout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default function DashboardPage() {
    const { user, role } = useAuth();

    const isUnassigned = (role === "MEMBER" || role === "ADMIN") && !user?.organizationName;

    return (
        <div className="d-flex w-100">

            <Sidebar hideNavLinks={isUnassigned} />

            <div className="content-wrapper flex-grow-1 d-flex flex-column bg-light" style={{ minWidth: 0 }}>
                <TopBar />
                <main className="p-4 flex-grow-1">
                    {isUnassigned ? <PendingWorkspace /> : <Outlet />}
                </main>
            </div>
        </div>
    );
}