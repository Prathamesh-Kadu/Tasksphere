import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/Topbar";
import "./../styles/Sidebar.css";

export default function DashboardPage() {
    return (
        <>
            <div className="d-flex w-100">
                <Sidebar />
                <div className="content-wrapper flex-grow-1 d-flex flex-column bg-light " style={{ minWidth: 0 }}>
                    <TopBar />
                    <main className="p-4">
                        <Outlet />
                    </main>
                </div>
            </div>
        </>
    );
}