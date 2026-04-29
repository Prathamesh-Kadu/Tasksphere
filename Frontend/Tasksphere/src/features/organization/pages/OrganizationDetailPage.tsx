import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { TbEdit, TbSettings } from "react-icons/tb";
import { useNavigate, useParams } from "react-router-dom";
import { ManageOwnerModal } from "../components/ManageOwnerModal";
import { OrganizationModal } from "../components/OrganizationModal";
import { getOrganizationById } from "../services/organizationService";
import "./../styles/OrganizationDetailPage.css";

export const OrganizationDetailPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isOwnerManageModal, setIsOwnerManageModal] = useState(false);
    const navigate = useNavigate();


    // ----------- Get Organization Id from URL -----------
    const { id } = useParams<{ id: string }>();


    // ------------ Get Organization By Id -------------
    const { data: org, isLoading, isError } = useQuery({
        queryKey: ["organization", id],
        queryFn: () => getOrganizationById(id!),
        enabled: !!id,
    })

    if (isLoading) return <div className="p-5 text-center">Loading details...</div>;
    if (isError || !org) return <div className="p-5 text-center text-danger">Organization not found.</div>;

    // ---------- Date formatter ------------
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        }).format(date);
    };


    return (
        <div className="container-fluid">
            <div className="mb-3">
                <button
                    onClick={() => navigate("/dashboard/org")}
                    className="btn btn-link text-decoration-none p-0 d-flex align-items-center gap-1 text-muted hover-primary"
                >
                    <FaArrowLeft /> Back to Organizations
                </button>
            </div>
            {/* Header & Edit button */}
            <div className="row">
                <div className="col-8 d-flex align-items-center">
                    <h4 className="m-0">Organization Details</h4>
                </div>
                <div className="col-4 d-flex justify-content-end">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="btn fw-medium hover-btn gap-2"
                    >
                        <TbEdit size={22} />
                        <span className="d-none d-md-inline">Edit Organization</span>
                    </button>
                </div>
            </div>
            
            {/* Organization Details */}
            <div className="row mt-4 p-2" style={{ borderRadius: "0.3rem", boxShadow: "0 10px 25px 1px rgba(0, 0, 0, 0.15)" }}>
                <div className="col-12">
                    <div className="row mt-3 p-2">
                        <div className="col-md-6">
                            <label className="text-muted text-uppercase" style={{ fontSize: "0.8rem" }}>Organization Name</label>
                            <p className="fw-medium">{org?.name}</p>
                        </div>
                        <div className="col-md-6">
                            <label className="text-muted text-uppercase" style={{ fontSize: "0.8rem" }}>{org.owners.length > 1 ? "Owners" : "Owner"}</label>
                            <p className="fw-medium d-flex align-items-center gap-2 lh-1">
                                {org.owners.map((o) =>
                                    o.name
                                ).join(", ")}
                                <button
                                    title="Manage Owners"
                                    className="btn btn-sm btn-secondary d-flex align-items-center"
                                    onClick={() => setIsOwnerManageModal(true)}
                                >
                                    <TbSettings className="me-1" size={18} />
                                    <span className="d-none d-md-inline">Manage</span>
                                </button>
                            </p>
                        </div>
                    </div>
                    <div className="row mt-3 p-2">
                        <div className="col-md-12">
                            <label className="text-muted text-uppercase" style={{ fontSize: "0.8rem" }}>Description</label>
                            <p className="fw-medium">{org?.description}</p>
                        </div>
                    </div>
                    <div className="row mt-3 p-2">
                        <div className="col-md-4">
                            <label className="text-muted text-uppercase" style={{ fontSize: "0.8rem" }}>Created On</label>
                            <p className="fw-medium">{formatDate(org.createdAt)}</p>
                        </div>
                        <div className="col-md-4">
                            <label className="text-muted text-uppercase" style={{ fontSize: "0.8rem" }}>Active Projects</label>
                            <p className="fw-medium">{org?.projectCount}</p>
                        </div>
                        <div className="col-md-4">
                            <label className="text-muted text-uppercase" style={{ fontSize: "0.8rem" }}>Total Members</label>
                            <p className="fw-medium">{org?.userCount}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Update Modal */}
            {isModalOpen && <OrganizationModal
                show={isModalOpen}
                handleClose={() => setIsModalOpen(false)}
                initialData={org}
            />}

            {/* Assign Owner Modal */}
            {isOwnerManageModal && <ManageOwnerModal
                show={isOwnerManageModal}
                handleClose={() => setIsOwnerManageModal(false)}
                organization={org}
            />}

        </div>
    );
}