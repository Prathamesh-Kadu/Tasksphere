import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { BiSolidEdit } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import { AppModal } from "../../../components/modals/AppModal";
import { deleteProject } from "../services/projectService";
import type { Project, ProjectReponse } from "../types/project.types";
import { FaUserShield } from "react-icons/fa";
import { AssignAdminModal } from "./AssignAdminModal";
import { Badge } from "react-bootstrap";
import { toastError, toastSuccess } from "../../../components/toast/toast";

interface ProjectTableProps {
    projects: ProjectReponse[];
    loggedUserRole: string;
    onEdit?: (org: Project) => void;
}

export const ProjectTable = ({ projects, loggedUserRole, onEdit }: ProjectTableProps) => {
    const queryClient = useQueryClient();
    const [selectedProject, setSelectedProject] = useState<ProjectReponse | null>(null);
    const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const deleteMutation = useMutation({
        mutationFn: (id: string) => deleteProject(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'], exact: false });
            toastSuccess("Project deleted successfully");
        },
        onError: () => {
            toastError("Failed to delete project.");
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

    const handleDelete = (id: string) => {
        setDeleteTargetId(id);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedProject(null);
    };

    const confirmDelete = () => {
        if (deleteTargetId) {
            deleteMutation.mutate(deleteTargetId);
        }
        setDeleteTargetId(null);
    };

    return (
        <div className="container">
            <div className="row">
                <div className="col-12 pt-3">
                    {projects.length === 0 ? (
                        <div className="text-center bg-white p-3 shadow">No project found</div>
                    ) : (
                        <table className="table table-bordered text-center" style={{ borderColor: "#dee2e6" }}>
                            <thead className="table-light">
                                <tr>
                                    <th>Name</th>
                                    <th>Description</th>
                                    <th>Assigned Admins</th>
                                    {loggedUserRole === "SUPER_ADMIN" && <th>Organization</th>}
                                    <th>Created On</th>
                                    {loggedUserRole === "OWNER" && <th>Actions</th>}
                                </tr>
                            </thead>

                            <tbody>
                                {projects.map((p) => (
                                    <tr key={p.id}>
                                        <td>{p.name}</td>
                                        <td>{p.description}</td>
                                        <td>
                                            {p.admins && p.admins.length > 0 ? (
                                                <Badge bg="primary">{p.admins.join(", ")}</Badge>
                                            ) : (
                                                <span className="text-muted small">None Assigned</span>
                                            )}
                                        </td>
                                        {loggedUserRole === "SUPER_ADMIN" && (
                                            <td>{p.organizationName || "N/A"}</td>
                                        )}
                                        <td>{formatDate(p.createdAt)}</td>
                                        {loggedUserRole === "OWNER" && (
                                            <td style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                <MdDelete
                                                    size={24}
                                                    style={{ cursor: "pointer" }}
                                                    className="text-danger"
                                                    onClick={() => handleDelete(p.id)}
                                                />
                                                <BiSolidEdit
                                                    size={20}
                                                    style={{ cursor: "pointer" }}
                                                    onClick={() => onEdit?.(p as unknown as Project)}
                                                />
                                                <FaUserShield
                                                    size={20}
                                                    style={{ cursor: "pointer", color: "#002141" }}
                                                    title="Manage Admins"
                                                    onClick={() => {
                                                        setSelectedProject(p);
                                                        setIsModalOpen(true);
                                                    }}
                                                />
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* --- Admin Assign Modal */}
            {isModalOpen && selectedProject && (
                <AssignAdminModal
                    show={isModalOpen}
                    handleClose={handleCloseModal}
                    projectId={selectedProject.id}
                    currentAdmins={selectedProject.admins || []} // Injected safely here!
                />
            )}

            {/* Delete Project Modal */}
            {deleteTargetId && (
                <AppModal
                    show={!!deleteTargetId}
                    handleClose={() => setDeleteTargetId(null)}
                    title="Delete Project"
                >
                    <div className="text-center py-2">
                        <i className="bi bi-exclamation-triangle text-danger" style={{ fontSize: "2rem" }}></i>
                        <p className="fw-bold text-danger mt-2">Permanently delete this project?</p>
                        <p className="text-muted small">
                            You are about to remove this project and all <strong>associated tasks</strong>.
                            This action cannot be undone.
                        </p>
                        <div className="alert alert-info py-2 small border-0">
                            <i className="bi bi-info-circle me-2"></i>
                            Project members will lose access to these tasks but their accounts will remain active.
                        </div>
                    </div>

                    <div className="d-flex justify-content-between gap-2 mt-4">
                        <button
                            className="btn btn-secondary border"
                            onClick={() => setDeleteTargetId(null)}
                            disabled={deleteMutation.isPending}
                        >
                            Keep Project
                        </button>
                        <button
                            className="btn btn-danger"
                            onClick={confirmDelete}
                            disabled={deleteMutation.isPending}
                        >
                            {deleteMutation.isPending ? (
                                <><span className="spinner-border spinner-border-sm me-2"></span>Deleting...</>
                            ) : (
                                "Confirm Delete"
                            )}
                        </button>
                    </div>
                </AppModal>
            )}
        </div>
    );
};