import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { TbLoader2, TbSearch, TbUserPlus, TbX } from "react-icons/tb";
import { useDebounce } from "use-debounce";
import ButtonLoader from "../../../components/loader/ButtonLoader";
import { AppModal } from "../../../components/modals/AppModal";
import useAuth from "../../../hooks/useAuth";
import { getUsersBySearch } from "../../../services/commonService";
import type { UserResponse } from "../../../types/common.types";
import { addUserToOrg, addUserToProject } from "../services/userService";

interface AddMemberModalProps {
    show: boolean;
    handleClose: () => void;
    existingMembers: any[];
}

export const AddMemberModal = ({ show, handleClose, existingMembers }: AddMemberModalProps) => {
    const [search, setSearch] = useState("");
    const [selectedUsers, setSelectedUsers] = useState<UserResponse[]>([]);
    const queryClient = useQueryClient();
    const [showUserList, setShowUserList] = useState<boolean>(false);
    const [debouncedSearch] = useDebounce(search, 1000);
    const { role } = useAuth();


    // ------------ Dynamic User Search -------------
    const { data, isFetching } = useQuery({

        queryKey: [role === "ADMIN" ? 'org-members-search' : 'global-users-search', debouncedSearch],

        queryFn: () =>
            getUsersBySearch(debouncedSearch || " ", 0, 5),

        enabled: show && showUserList && !!role,
    });

    const { mutate, isPending } = useMutation({
        mutationFn: () => {
            const userIds = selectedUsers.map(u => u.id);

            if (role === "ADMIN") {
                // Admin adds to specific project
                return addUserToProject(userIds);
            } else {
                return addUserToOrg(userIds);
            }
        },
        onSuccess: () => {
            if (role === "ADMIN") {
                queryClient.invalidateQueries({ queryKey: ["projects"] });
            }
            queryClient.invalidateQueries({ queryKey: ["users"] });

            handleClose();
            setSelectedUsers([]);
        },
        onError: (err) => {
            console.error("Failed to add members", err);
        }
    });

    const handleSelectUser = (user: UserResponse) => {
        if (!selectedUsers.some(u => u.id === user.id)) {
            setSelectedUsers(prev => [...prev, user]);
        }
        setSearch("");
        setShowUserList(false);
    };

    const handleRemoveUser = (userId: string) => {
        setSelectedUsers(prev => prev.filter(u => u.id !== userId));
    };


    const visibleFilteredUsers = data?.content?.filter((user: UserResponse) => {
        const isSelected = selectedUsers.some(s => s.id === user.id);
        const isAlreadyMember = existingMembers.some(m => m.id === user.id);
        const isOwner = user.role === "OWNER";

        return !isSelected && !isAlreadyMember && !isOwner;
    }) || [];

    const isSearchEmpty = !isFetching && search === "" && data?.totalElements === 0;
    return (
        <AppModal show={show} handleClose={handleClose} title={role === "ADMIN" ? "Add Members to Project" : "Add Members to Organization"}>

            {/* Search Input */}
            <div className="position-relative mb-3">
                <div className="input-group">
                    <span className="input-group-text bg-white border-end-0">
                        {isFetching ? <TbLoader2 className="animate-spin" /> : <TbSearch />}
                    </span>
                    <input
                        type="text"
                        className="form-control border-start-0"
                        placeholder={isSearchEmpty ? "No available users to add" : "Search users by name"}
                        disabled={isSearchEmpty}
                        value={search}
                        onFocus={() => setShowUserList(true)}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setShowUserList(true);
                        }}
                    />
                </div>

                {/* Dropdown Results */}
                {showUserList && data?.content && (
                    <div className="list-group position-absolute w-100 shadow-lg mt-1" style={{ zIndex: 1050, maxHeight: '200px', overflowY: 'auto' }}>

                        {visibleFilteredUsers.map((user: UserResponse) => (
                            <button
                                key={user.id}
                                type="button"
                                className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                                onClick={() => handleSelectUser(user)}
                            >
                                <div>
                                    <div className="fw-bold">{user.name}</div>
                                    <small className="text-muted">{user.email}</small>
                                </div>
                                <TbUserPlus className="text-primary" size={20} />
                            </button>
                        ))}

                        {visibleFilteredUsers.length === 0 && !isFetching && (
                            <div className="list-group-item small text-center text-muted py-3">
                                {search ? "No new matching users found" : "All fetched users are already added"}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Selected Users Chips */}
            <div className="mt-4">
                <label className="form-label small text-muted text-uppercase fw-bold">Selected Members to Add</label>
                <div className="d-flex flex-wrap gap-2 border rounded p-3 bg-light" style={{ minHeight: '80px' }}>
                    {selectedUsers.map((user) => (
                        <div key={user.id} className="badge bg-white border text-dark p-2 d-flex align-items-center rounded-pill shadow-sm">
                            <span className="me-2">{user.name}</span>
                            <TbX className="text-danger" style={{ cursor: "pointer" }} onClick={() => handleRemoveUser(user.id)} />
                        </div>
                    ))}
                    {selectedUsers.length === 0 && <span className="text-muted small">Select users from the search above...</span>}
                </div>
            </div>

            <div className="mt-4 d-flex justify-content-between">
                <button className="btn btn-outline-secondary" onClick={handleClose} disabled={isPending}>Cancel</button>
                <button
                    className="btn btn-primary px-4"
                    onClick={() => mutate()}
                    disabled={selectedUsers.length === 0 || isPending}
                >
                    {isPending ? <><ButtonLoader /> Adding...</> : (role === "OWNER"? "Add to Organization" : "Add to Project")}
                </button>
            </div>
        </AppModal>
    );
};