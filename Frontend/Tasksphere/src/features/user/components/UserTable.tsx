import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Badge } from "react-bootstrap";
import { FaUserShield } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import ButtonLoader from "../../../components/loader/ButtonLoader";
import { AppModal } from "../../../components/modals/AppModal";
import { removeUserFromOrg } from "../services/userService";

interface UserTableProps {
    users: any[];
    loggedUserRole: string;
}

export const UserTable = ({ users, loggedUserRole }: UserTableProps) => {

    const queryClient = useQueryClient();

    const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

    const deleteMutation = useMutation({
        mutationFn: (userId: string) => removeUserFromOrg(userId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
            setDeleteTargetId(null); // Close modal
        },
        onError: (error) => {
            console.error("Failed to remove member", error);
        },
    });

    return (
        <div className="container">
            <div className="row">
                <div className="col-12 pt-3">
                    {users.length == 0 ? <div className="text-center bg-white p-3 shadow">No member found</div> :
                        <table className="table table-bordered text-center" style={{ borderColor: "#dee2e6" }}>
                            <thead className="table-light">
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    {loggedUserRole === "SUPER_ADMIN" && <th>Organization</th>}
                                    {loggedUserRole === "OWNER" && <th>Actions</th>}
                                </tr>
                            </thead>

                            <tbody>
                                {users.map((user) => (
                                    <tr key={user.id}>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>
                                            <Badge bg="primary">{user.role}</Badge>
                                        </td>
                                        {loggedUserRole === "SUPER_ADMIN" && (
                                            <td>{user.organizationName || "N/A"}</td>
                                        )}
                                        {loggedUserRole === "OWNER" && (
                                            <td>
                                                <MdDelete
                                                    onClick={() => setDeleteTargetId(user.id)}
                                                    size={24}
                                                    style={{ cursor: "pointer" }}
                                                    className="text-danger"
                                                />
                                                <FaUserShield
                                                    size={21}
                                                    style={{ cursor: "pointer", color:"#002141", marginLeft:"0.3rem"}}
                                                />
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>}
                </div>
            </div>

            {deleteTargetId && (
                <AppModal
                    show={!!deleteTargetId}
                    handleClose={() => setDeleteTargetId(null)}
                    title="Confirm Removal"
                >
                    <div className="text-center py-2">
                        <p className="fw-bold text-danger">Remove member from organization?</p>
                        <p className="text-muted small">
                            This user will lose access to all <strong>projects and tasks</strong>.
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
                            className="btn btn-danger"
                            onClick={() => deleteMutation.mutate(deleteTargetId)}
                            disabled={deleteMutation.isPending}
                        >
                            {deleteMutation.isPending ? <>"Removing"<ButtonLoader /></> : "Remove Member"}
                        </button>
                    </div>
                </AppModal>
            )}
        </div>
    );
};