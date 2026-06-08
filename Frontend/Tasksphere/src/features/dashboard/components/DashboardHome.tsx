import useAuth from "../../../hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import {
    BiCheckSquare,
    BiLoaderAlt,
    BiFolder,
    BiGroup,
    BiBuildings,
    BiTask
} from "react-icons/bi";
import { getDashboardStats } from "../services/dashboardService";

export default function DashboardHome() {
    const { user, role } = useAuth();

    const { data: stats, isLoading, isError, error } = useQuery({
        queryKey: ["dashboardStats", user?.id],
        queryFn: getDashboardStats,
        staleTime: 5 * 60 * 1000,
        enabled: !!user?.id,
    });

    if (isLoading) {
        return (
            <div className="d-flex justify-content-center align-items-center py-5 flex-grow-1" style={{ minHeight: "50vh" }}>
                <BiLoaderAlt size={32} className="text-primary spinner-border border-0 bg-transparent animate-spin" />
                <span className="ms-2 fw-medium text-secondary">Loading statistics...</span>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="alert alert-danger rounded-3 m-2" role="alert">
                ⚠️ {error instanceof Error ? error.message : "Failed to load dashboard metrics"}. Please try refreshing the page.
            </div>
        );
    }
    const StatCard = ({ title, count, icon: Icon, colorClass }: { title: string; count?: number; icon: any; colorClass: string }) => (
        <div className="col-12 col-sm-6 col-xl-3 mb-4">
            <div className="card h-100 border-0 shadow-sm rounded-3 p-3">
                <div className="d-flex align-items-center justify-content-between">
                    <div>
                        <span className="text-muted small fw-medium text-uppercase tracking-wider">{title}</span>
                        <h3 className="fw-bold text-dark mt-1 mb-0">{count ?? 0}</h3>
                    </div>
                    <div className={`p-3 rounded-circle bg-opacity-10 bg-${colorClass} text-${colorClass}`}>
                        <Icon size={24} />
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="container-fluid px-1 animate-fade-in">
            {/* Welcome Note */}
            <div className="mb-4">
                <h4 className="fw-bold text-dark mb-1">Welcome back, {user?.name}!</h4>
                <p className="text-muted small mb-0">Here's what is happening across your workspace tracks today.</p>
            </div>

            {/* Metrics as per role */}
            <div className="row">

                {/* --- SUPER ADMIN CARDS --- */}
                {role === "SUPER_ADMIN" && (
                    <>
                        <StatCard title="Total Organizations" count={stats?.totalOrganizations} icon={BiBuildings} colorClass="primary" />
                        <StatCard title="Total System Users" count={stats?.totalUsers} icon={BiGroup} colorClass="info" />
                        <StatCard title="Global Projects" count={stats?.totalProjects} icon={BiFolder} colorClass="warning" />
                        <StatCard title="Global Tasks Tracked" count={stats?.totalTasks} icon={BiTask} colorClass="success" />
                    </>
                )}

                {/* --- OWNER CARDS --- */}
                {role === "OWNER" && (
                    <>
                        <StatCard title="Total Projects" count={stats?.totalProjects} icon={BiFolder} colorClass="primary" />
                        <StatCard title="Workspace Members" count={stats?.totalUsers} icon={BiGroup} colorClass="info" />
                        <StatCard title="Pending Tasks" count={stats?.pendingTasks} icon={BiTask} colorClass="warning" />
                        <StatCard title="Completed Tasks" count={stats?.completedTasks} icon={BiCheckSquare} colorClass="success" />
                    </>
                )}

                {/* --- ADMIN CARDS --- */}
                {role === "ADMIN" && (
                    <>
                        <StatCard title="Managed Projects" count={stats?.totalProjects} icon={BiFolder} colorClass="primary" />
                        <StatCard title="Assigned Team Members" count={stats?.totalUsers} icon={BiGroup} colorClass="info" />
                        <StatCard title="Open Tasks" count={stats?.pendingTasks} icon={BiTask} colorClass="warning" />
                        <StatCard title="Tasks Completed" count={stats?.completedTasks} icon={BiCheckSquare} colorClass="success" />
                    </>
                )}

                {/* --- MEMBER CARDS --- */}
                {role === "MEMBER" && (
                    <>
                        <StatCard title="My Total Tasks" count={stats?.totalTasks} icon={BiTask} colorClass="primary" />
                        <StatCard title="Tasks To Do / In Progress" count={stats?.pendingTasks} icon={BiLoaderAlt} colorClass="warning" />
                        <StatCard title="Tasks I Finished" count={stats?.completedTasks} icon={BiCheckSquare} colorClass="success" />
                    </>
                )}
            </div>
        </div>
    );
}