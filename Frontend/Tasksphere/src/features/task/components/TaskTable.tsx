import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { BiSolidEdit } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import type { TaskResponse } from "../types/task.types";
import { deleteTask, updateStatus } from "../service/taskService";
import { AppModal } from "../../../components/modals/AppModal";

interface TaskTableProps {
    tasks: TaskResponse[];
    loggedUserRole: string;
}

export const TaskTable = ({ tasks, loggedUserRole }: TaskTableProps) => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
    
    // 🔑 State monitoring for tracking which task is currently having its status changed
    const [statusTargetTask, setStatusTargetTask] = useState<{ id: string; currentStatus: string } | null>(null);
    const [selectedStatus, setSelectedStatus] = useState<string>("");

    // Deletion Mutation
    const deleteMutation = useMutation({
        mutationFn: (id: string) => deleteTask(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'], exact: false });
            setDeleteTargetId(null);
        },
        onError: (error) => {
            console.error("Failed to delete task:", error);
        }
    });

    // 🔑 Lightweight Status Update Mutation Flow
    const statusMutation = useMutation({
        mutationFn: ({ id, status }: { id: string; status: string }) => updateStatus(id, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'], exact: false });
            setStatusTargetTask(null);
        },
        onError: (error) => {
            console.error("Failed to alter status code state:", error);
        }
    });

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        }).format(date);
    };

    const handleDeleteClick = (id: string) => {
        setDeleteTargetId(id);
    };

    // 🔑 Triggers when a MEMBER clicks directly on a row's status badge
    const handleStatusClick = (id: string, currentStatus: string) => {
        if (loggedUserRole === "MEMBER") {
            setStatusTargetTask({ id, currentStatus });
            setSelectedStatus(currentStatus);
        }
    };

    const confirmDelete = () => {
        if (deleteTargetId) {
            deleteMutation.mutate(deleteTargetId);
        }
    };

    // 🔑 Triggers execution for the inline patch state payload
    const handleStatusUpdateSubmit = () => {
        if (statusTargetTask) {
            statusMutation.mutate({ id: statusTargetTask.id, status: selectedStatus });
        }
    };

    return (
        <div className="container">
            <div className="row">
                <div className="col-12 pt-3">
                    {tasks.length === 0 ? (
                        <div className="text-center bg-white p-3 shadow-sm rounded">No tasks found</div>
                    ) : (
                        <table className="table table-bordered text-center align-middle" style={{ borderColor: "#dee2e6" }}>
                            <thead className="table-light">
                                <tr>
                                    <th>Name</th>
                                    {loggedUserRole !== "SUPER_ADMIN" && <th>Description</th>}
                                    {loggedUserRole !== "SUPER_ADMIN" && loggedUserRole !== "OWNER" && <th>Status</th>}
                                    <th>Due Date</th>
                                    {loggedUserRole === "SUPER_ADMIN" && <th>Organization</th>}
                                    {loggedUserRole !== "MEMBER" && <th>Project</th>}
                                    {loggedUserRole !== "MEMBER" && <th>Assigned</th>}
                                    {/* 🔑 Opened column context layer up so MEMBER can access simple updates */}
                                    {(loggedUserRole === "ADMIN" || loggedUserRole === "MEMBER") && <th>Actions</th>}
                                </tr>
                            </thead>

                            <tbody>
                                {tasks.map((task) => (
                                    <tr key={task.id}>
                                        <td className="fw-semibold">{task.title}</td>
                                        {loggedUserRole !== "SUPER_ADMIN" && <td>{task.description || "N/A"}</td>}
                                        {loggedUserRole !== "SUPER_ADMIN" && loggedUserRole !== "OWNER" && (
                                            <td>
                                                <span 
                                                    className={`badge bg-${task.status === 'DONE' ? 'success' : task.status === 'IN_PROGRESS' ? 'warning text-dark' : 'secondary'}`}
                                                    // 🔑 Changes pointer and adds click trigger explicitly for MEMBER roles
                                                    style={{ cursor: loggedUserRole === "MEMBER" ? "pointer" : "default" }}
                                                    onClick={() => handleStatusClick(task.id, task.status)}
                                                    title={loggedUserRole === "MEMBER" ? "Click to change status" : ""}
                                                >
                                                    {task.status} {loggedUserRole === "MEMBER" && "✍️"}
                                                </span>
                                            </td>
                                        )}
                                        <td>{task.dueDate ? formatDate(task.dueDate) : "N/A"}</td>
                                        {loggedUserRole === "SUPER_ADMIN" && (
                                            <td>{task.organizationName || "N/A"}</td>
                                        )}
                                        {loggedUserRole !== "MEMBER" && <td>{task.projectName}</td>}
                                        {loggedUserRole !== "MEMBER" && <td>{task.assignedToUser || "Unassigned"}</td>}
                                        
                                        {/* 🔑 Managed execution paths dynamically based on active user scopes */}
                                        {(loggedUserRole === "ADMIN" || loggedUserRole === "MEMBER") && (
                                            <td>
                                                <div className="d-flex justify-content-center gap-3">
                                                    {loggedUserRole === "ADMIN" && (
                                                        <>
                                                            <MdDelete
                                                                size={22}
                                                                style={{ cursor: "pointer" }}
                                                                className="text-danger"
                                                                onClick={() => handleDeleteClick(task.id)}
                                                            />
                                                            <BiSolidEdit
                                                                size={20}
                                                                style={{ cursor: "pointer" }}
                                                                className="text-primary"
                                                                onClick={() => navigate(`/dashboard/tasks/manage/${task.id}`)}
                                                            />
                                                        </>
                                                    )}
                                                    {loggedUserRole === "MEMBER" && (
                                                        <button 
                                                            className="btn btn-sm btn-outline-primary py-0 px-2"
                                                            onClick={() => handleStatusClick(task.id, task.status)}
                                                        >
                                                            Update Status
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* --- ADMIN DELETION CONFIRMATION MODAL --- */}
            {deleteTargetId && (
                <AppModal
                    show={!!deleteTargetId}
                    handleClose={() => setDeleteTargetId(null)}
                    title="Delete Task"
                >
                    <div className="text-center py-2">
                        <i className="bi bi-exclamation-triangle text-danger" style={{ fontSize: "2rem" }}></i>
                        <p className="fw-bold text-danger mt-2">Permanently delete this task?</p>
                        <p className="text-muted small">This action cannot be undone.</p>
                    </div>
                    <div className="d-flex justify-content-between gap-2 mt-4">
                        <button type="button" className="btn btn-sm btn-light border px-3" onClick={() => setDeleteTargetId(null)}>Cancel</button>
                        <button type="button" className="btn btn-sm btn-danger px-3" onClick={confirmDelete} disabled={deleteMutation.isPending}>
                            {deleteMutation.isPending ? "Deleting..." : "Confirm Delete"}
                        </button>
                    </div>
                </AppModal>
            )}

            {/* 🔑 MEMBER STATUS QUICK UPDATE DROPDOWN POPUP */}
            {statusTargetTask && (
                <AppModal
                    show={!!statusTargetTask}
                    handleClose={() => setStatusTargetTask(null)}
                    title="Update Task Status"
                >
                    <div className="py-2">
                        <label htmlFor="statusSelect" className="form-label small fw-bold text-muted">Select Task Progress Status:</label>
                        <select 
                            id="statusSelect"
                            className="form-select"
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                        >
                            <option value="TODO">To Do</option>
                            <option value="IN_PROGRESS">In Progress</option>
                            <option value="DONE">Done</option>
                        </select>
                        <p className="text-muted small mt-2">
                            As a project member, you can modify the progress track metrics of your assigned tasks.
                        </p>
                    </div>

                    <div className="d-flex justify-content-end gap-2 mt-4">
                        <button
                            type="button"
                            className="btn btn-sm btn-light border px-3"
                            onClick={() => setStatusTargetTask(null)}
                            disabled={statusMutation.isPending}
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            className="btn btn-sm btn-primary px-3"
                            onClick={handleStatusUpdateSubmit}
                            disabled={statusMutation.isPending}
                        >
                            {statusMutation.isPending ? (
                                <><span className="spinner-border spinner-border-sm me-2"></span>Saving...</>
                            ) : (
                                "Save Status"
                            )}
                        </button>
                    </div>
                </AppModal>
            )}
        </div>
    );
};