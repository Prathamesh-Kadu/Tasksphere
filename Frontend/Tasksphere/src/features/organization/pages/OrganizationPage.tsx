import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import OrganizationList from "../components/OrganizationList";
import { OrganizationModal } from "../components/OrganizationModal";
import { deleteOrganization, getOrganizations } from "../services/organizationService";
import type { Organization } from "../types/organization.types";
import { AppModal } from "../../../components/modals/AppModal";
import { useNavigate } from "react-router-dom";


export default function OrganizationPage() {
    const [search, setSearch] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
    const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
    const navigate = useNavigate();

    const queryClient = useQueryClient();

    // ------------ Get All Organizations ------------
    const { data, isLoading } = useQuery({
        queryKey: ['organizations'],
        queryFn: getOrganizations,
    });

    // ------------ Filter Organization based on search ------------
    const filtered = (data || []).filter((org) =>
        org.name.toLowerCase().includes(search.toLowerCase())
    );

    // ----------- Menu Actions handlers ------------
    const handleAdd = () => {
        setSelectedOrg(null);
        setIsModalOpen(true);
    };
    const handleEdit = (org: Organization) => {
        setSelectedOrg(org);
        setIsModalOpen(true);
    };
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedOrg(null);
    };
    const handleDelete = (id: string) => {
        setDeleteTargetId(id);
    };
    const confirmDelete = () => {
        if (deleteTargetId) {
            deleteMutation.mutate(deleteTargetId);
        }
        setDeleteTargetId(null)
    };

    // ------------ Delete Organization -------------
    const deleteMutation = useMutation({
        mutationFn: (id: string) => deleteOrganization(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['organizations'] });
        },
        onError: (err) => {
            console.error("Delete failed", err);
        }
    })

    // ----------- View Organization Details ---------------
    const handleView = (id: string) => {
        navigate(`/dashboard/org/${id}`);
    }

    return (
        <div className="container-fluid">

            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="mb-0">Organizations</h4>
                <button className="btn btn-primary" onClick={handleAdd}>
                    + Create Organization
                </button>
            </div>

            {/* Search */}
            <div className="row mb-4">
                <div className="col-12 col-md-6">
                    <div className="input-group">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search organization"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* List */}
            {isLoading ? (
                <div>Loading...</div>
            ) : (
                <OrganizationList
                    organizations={filtered}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onView={handleView}
                />
            )}

            {/* Add and Update Modal */}
            {isModalOpen && <OrganizationModal
                show={isModalOpen}
                handleClose={handleCloseModal}
                initialData={selectedOrg}
            />}

            {/* Delete Modal */}
            {deleteTargetId && (
                <AppModal
                    show={!!deleteTargetId}
                    handleClose={() => setDeleteTargetId(null)}
                    title="Confirm Deletion"
                >
                    <div className="text-center py-2">
                        <p className="fw-bold text-danger">Are you sure you want to delete this organization?</p>
                        <p className="text-muted small">
                            This will permanently delete all associated <strong>projects and tasks</strong>.
                        </p>
                        <div className="alert alert-warning py-2 small">
                            Users will be detached but their accounts will not be deleted.
                        </div>
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
                            onClick={confirmDelete}
                            disabled={deleteMutation.isPending}
                        >
                            {deleteMutation.isPending ? "Deleting..." : "Delete Organization"}
                        </button>
                    </div>
                </AppModal>
            )}

        </div>
    );
}