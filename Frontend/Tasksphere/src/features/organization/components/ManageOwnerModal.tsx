import { AppModal } from "../../../components/modals/AppModal";
import type { OrganizationResponse, UserResponse } from "../types/organization.types";
import { TbLoader2, TbSearch, TbX } from "react-icons/tb";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { assignOwner, getUsersBySearch } from "../services/organizationService";
import ButtonLoader from "../../../components/loader/ButtonLoader";

interface ManageOwnerModalProps {
    show: boolean;
    handleClose: () => void;
    organization: OrganizationResponse;
}

export const ManageOwnerModal = ({ show, handleClose, organization: org }: ManageOwnerModalProps) => {
    const [search, setSearch] = useState("");
    const [selectedUsers, setSelectedUsers] = useState<UserResponse[]>(org.owners || []);
    const queryClient = useQueryClient();

    // ------------ Get User By Search -------------
    const { data, isFetching } = useQuery({
        queryKey: ['users-search', search],
        queryFn: () => getUsersBySearch(search, 0, 5),
        enabled: search.length >= 2,
    });

    // ------------ Assigne Owner ----------------
    const { mutate, isPending } = useMutation({
        mutationFn: () => {
            const ids = selectedUsers.map(u => u.id);
            return assignOwner(org.id, ids);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["organization", org.id] });
            handleClose();
        },
        onError: (err) => {
            console.error("Delete failed", err);
        }
    })

    //------------ Add users -----------------
    const handleSelectUser = (user: UserResponse) => {
        if (!selectedUsers.some(u => u.id === user.id)) {
            setSelectedUsers(prev => [...prev, user]);
        }
        setSearch("");
    };
    //---------------- Remove users ----------------
    const handleRemoveUser = (userId: string) => {
        setSelectedUsers(prev => prev.filter(u => u.id !== userId));
    };

    return (
        <AppModal show={show} handleClose={handleClose} title="Manage Owners">

            <div className="position-relative mb-3">
                {/* Search Bar */}
                <div className="input-group">
                    <span className="input-group-text bg-white border-end-0">
                        {isFetching ? <TbLoader2 className="animate-spin" /> : <TbSearch />}
                    </span>
                    <input
                        type="text"
                        className="form-control border-start-0"
                        placeholder="Search for new owners..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                {/* Dropdown search */}
                {search.length >= 2 && data?.content && (
                    <div className="list-group position-absolute w-100 shadow-lg" style={{ zIndex: 1050 }}>
                        {data.content.map((user: UserResponse) => (
                            <button
                                key={user.id}
                                type="button"
                                className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                                onClick={() => handleSelectUser(user)}
                            >
                                <div>
                                    <div className="fw-bold text-dark">{user.name}</div>
                                    <small className="text-muted">{user.email}</small>
                                </div>
                                <span className="badge bg-primary-subtle text-primary">Add</span>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* CHIPS SECTION (THE OWNERS) */}
            <div className="mt-4">
                <label className="form-label small text-muted text-uppercase fw-bold">Current & Pending Owners</label>
                <div className="d-flex flex-wrap gap-2 border rounded p-3 bg-light-subtle" style={{ minHeight: '60px' }}>
                    {selectedUsers.length > 0 ? (
                        selectedUsers.map((user) => (
                            <div
                                key={user.id}
                                className="badge bg-white border text-dark p-2 d-flex align-items-center rounded-pill shadow-sm"
                                style={{ fontSize: '0.85rem' }}
                            >
                                <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-2"
                                    style={{ width: '20px', height: '20px', fontSize: '10px' }}>
                                    {user.name.charAt(0)}
                                </div>
                                <span className="me-2">{user.name}</span>
                                <TbX
                                    className="text-danger"
                                    style={{ cursor: "pointer" }}
                                    onClick={() => handleRemoveUser(user.id)}
                                />
                            </div>
                        ))
                    ) : (
                        <span className="text-muted small italic">No owners selected. Assign at least one.</span>
                    )}
                </div>
            </div>

            <div className="mt-4 d-flex justify-content-between">
                <button className="btn btn-secondary" onClick={handleClose}>Cancel</button>
                <button
                    className="btn btn-primary px-4"
                    onClick={() => mutate()}
                    disabled={selectedUsers.length === 0}
                >
                    {isPending ? (
                        <>
                            Saving <ButtonLoader />
                        </>
                    ) : (
                        "Save Changes"
                    )}
                </button>
            </div>
        </AppModal>
    );
}