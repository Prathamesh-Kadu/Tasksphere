import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Badge } from "react-bootstrap";
import { MdDelete } from "react-icons/md";
import ButtonLoader from "../../../components/loader/ButtonLoader";
import { AppModal } from "../../../components/modals/AppModal";
import { removeUserFromOrg, removeUserFromProject } from "../services/userService";
import type { UserResponse } from "../../../types/common.types";

interface UserTableProps {
    users: UserResponse[];
    loggedUserRole: string;
}

export const UserTable = ({ users, loggedUserRole }: UserTableProps) => {
    const queryClient = useQueryClient();
    const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

    // Dynamic checks to keep JSX cleaner
    const isOwner = loggedUserRole === "OWNER";
    const isAdmin = loggedUserRole === "ADMIN";
    const isSuperAdmin = loggedUserRole === "SUPER_ADMIN";
    const canModify = isOwner || isAdmin;

    const deleteMutation = useMutation({
        mutationFn: (userId: string) => {
            return isOwner ? removeUserFromOrg(userId) : removeUserFromProject(userId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
            setDeleteTargetId(null);
        },
        onError: (error) => {
            console.error(`Failed to remove member from ${isOwner ? 'organization' : 'project'}`, error);
        },
    });

    return (
        <>
            <div className="row">
                <div className="col-12 pt-3">
                    {users.length === 0 ? (
                        <div className="text-center bg-white shadow p-4 rounded text-muted">No members found</div>
                    ) : (
                        <table className="table table-bordered text-center align-middle" style={{ borderColor: "#dee2e6" }}>
                            <thead className="table-light">
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    {isSuperAdmin && <th>Organization</th>}
                                    {loggedUserRole !== "ADMIN" && <th>Projects</th>}
                                    {canModify && <th>Actions</th>}
                                </tr>
                            </thead>

                            <tbody>
                                {users.map((user) => {
                                    const isRowUserAdmin = user.role === "ADMIN";

                                    return (
                                        <tr key={user.id}>
                                            <td>{user.name}</td>
                                            <td>{user.email}</td>
                                            <td>
                                                <Badge bg="primary">{user.role}</Badge>
                                            </td>
                                            {isSuperAdmin && (
                                                <td>{user.organizationName || "N/A"}</td>
                                            )}
                                            {loggedUserRole !== "ADMIN" && (
                                                <td>
                                                    {user.projectNames && user.projectNames.length > 0
                                                        ? user.projectNames.join(", ")
                                                        : "N/A"}
                                                </td>
                                            )}
                                            {canModify && (
                                                <td>
                                                    <MdDelete
                                                        onClick={() => {
                                                            if (!isRowUserAdmin) {
                                                                setDeleteTargetId(user.id);
                                                            }
                                                        }}
                                                        size={24}
                                                        style={{
                                                            cursor: isRowUserAdmin ? "not-allowed" : "pointer",
                                                            opacity: isRowUserAdmin ? 0.4 : 1
                                                        }}
                                                        className={isRowUserAdmin ? "text-secondary" : "text-danger"}
                                                        title={
                                                            isRowUserAdmin
                                                                ? "Administrators cannot be removed"
                                                                : (isOwner ? "Remove from Organization" : "Remove from Project")
                                                        }
                                                    />
                                                </td>
                                            )}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Dynamic Confirmation Modal */}
            {deleteTargetId && (
                <AppModal
                    show={!!deleteTargetId}
                    handleClose={() => setDeleteTargetId(null)}
                    title={isOwner ? "Confirm Organization Removal" : "Confirm Project Removal"}
                >
                    <div className="text-center py-2">
                        <p className="fw-bold text-danger">
                            {isOwner ? "Remove member from organization?" : "Remove member from project?"}
                        </p>
                        <p className="text-muted small">
                            {isOwner ? (
                                <>This user will completely lose access to the organization, including all its <strong>projects and tasks</strong>.</>
                            ) : (
                                <>This user will lose access to this project, and all their <strong>assigned tasks within this project</strong> will be deleted. They will remain in the organization.</>
                            )}
                        </p>
                    </div>

                    <div className="d-flex justify-content-between gap-2 mt-4">
                        <button
                            className="btn btn-outline-secondary"
                            onClick={() => setDeleteTargetId(null)}
                            disabled={deleteMutation.isPending}
                        >
                            Cancel
                        </button>
                        <button
                            className="btn btn-danger px-4"
                            onClick={() => deleteMutation.mutate(deleteTargetId)}
                            disabled={deleteMutation.isPending}
                        >
                            {deleteMutation.isPending ? (
                                <><ButtonLoader /> Removing...</>
                            ) : (
                                isOwner ? "Remove Member" : "Remove from Project"
                            )}
                        </button>
                    </div>
                </AppModal>
            )}
        </>
    );
};