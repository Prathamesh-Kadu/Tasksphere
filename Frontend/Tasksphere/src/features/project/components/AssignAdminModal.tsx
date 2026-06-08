import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { TbLoader2, TbSearch, TbX } from "react-icons/tb";
import ButtonLoader from "../../../components/loader/ButtonLoader";
import { AppModal } from "../../../components/modals/AppModal";
import { getMembers } from "../../../services/commonService";
import type { UserResponse } from "../../../types/common.types";
import { assignProjectAdmin } from "../services/projectService";
import { useDebounce } from "use-debounce";
import useAuth from "../../../hooks/useAuth";
import { toastError, toastSuccess } from "../../../components/toast/toast";

interface AssignAdminModalProps {
    show: boolean;
    handleClose: () => void;
    projectId: string;
    currentAdmins?: string[];
}

export const AssignAdminModal = ({ show, handleClose, projectId, currentAdmins = [] }: AssignAdminModalProps) => {
    const queryClient = useQueryClient();
    const { role } = useAuth();

    const [search, setSearch] = useState("");
    const [debouncedSearch] = useDebounce(search, 500);
    const [showDropdown, setShowDropdown] = useState<boolean>(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const [selectedUsers, setSelectedUsers] = useState<UserResponse[]>([]);


    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // ------------ Get Users ------------
    const { data, isFetching } = useQuery({
        queryKey: ['users-search', debouncedSearch],
        queryFn: () => getMembers(0, 10, debouncedSearch || ""),
        enabled: !!role && show,
    });


    useEffect(() => {
        if (data?.content && selectedUsers.length === 0 && currentAdmins.length > 0) {
            const matchedFromCurrentSearch = data.content.filter((u: UserResponse) =>
                currentAdmins.includes(u.name)
            );

            const fallbackShells = currentAdmins
                .filter(name => !matchedFromCurrentSearch.some((u: UserResponse) => u.name === name))
                .map(name => ({ id: `assigned-${name}`, name, email: "Assigned Administrator", role: "ADMIN" }));

            setSelectedUsers([...matchedFromCurrentSearch, ...fallbackShells]);
        }
    }, [data?.content, currentAdmins]);

    // ------------ Filter Selected Users ------------
    const availableUsersToSelect = data?.content?.filter((user: UserResponse) => {

        const isAlreadySelected = selectedUsers.some(
            selected => selected.id === user.id || selected.name === user.name
        );
        const isNormalMember = user.role === "MEMBER";
        return !isAlreadySelected && isNormalMember;
    }) || [];

    // ------------ Assign Project Admins Mutation ------------
    const { mutate, isPending } = useMutation({
        mutationFn: () => {
            const realIds = selectedUsers
                .filter(u => !u.id.startsWith("assigned-"))
                .map(u => u.id);
            return assignProjectAdmin(projectId, realIds);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'], exact: false });
            handleClose();
            toastSuccess("Project admins updated successfully");
        },
        onError: (err) => {
            console.error("Assignment failed", err);
            toastError("Failed to update project admins.");
        }
    });

    const handleSelectUser = (user: UserResponse) => {
        if (!selectedUsers.some(u => u.id === user.id || u.name === user.name)) {
            setSelectedUsers(prev => [
                ...prev.filter(p => p.name !== user.name),
                user
            ]);
        }
        setSearch("");
        setShowDropdown(false);
    };

    const handleRemoveUser = (userToRemove: UserResponse) => {
        setSelectedUsers(prev => prev.filter(u => u.id !== userToRemove.id && u.name !== userToRemove.name));
    };

    return (
        <AppModal show={show} handleClose={handleClose} title="Manage Project Admins">
            <div className="position-relative mb-3" ref={dropdownRef}>
                <label className="form-label small text-muted text-uppercase fw-bold">Search Users</label>
                <div className="input-group">
                    <span className="input-group-text bg-white border-end-0">
                        {isFetching ? <TbLoader2 className="spinner-border spinner-border-sm text-primary border-0 animate-spin" style={{ animation: "spin 1s linear infinite" }} /> : <TbSearch />}
                    </span>
                    <input
                        type="text"
                        className="form-control border-start-0"
                        placeholder="Type name to lookup and add new admins..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onFocus={() => setShowDropdown(true)}
                    />
                </div>

                {/* Dropdown list displaying available filtered users */}
                {showDropdown && availableUsersToSelect.length > 0 && (
                    <div className="list-group position-absolute w-100 shadow-lg" style={{ zIndex: 1050, maxHeight: "220px", overflowY: "auto" }}>
                        {availableUsersToSelect.map((user: UserResponse) => (
                            <button
                                key={user.id}
                                type="button"
                                className="list-group-item list-group-item-action d-flex justify-content-between align-items-center py-2"
                                onClick={() => handleSelectUser(user)}
                            >
                                <div>
                                    <div className="fw-bold text-dark small">{user.name}</div>
                                    <small className="text-muted" style={{ fontSize: "0.75rem" }}>{user.email}</small>
                                </div>
                                <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill">Add Admin</span>
                            </button>
                        ))}
                    </div>
                )}

                {showDropdown && search && availableUsersToSelect.length === 0 && !isFetching && (
                    <div className="list-group position-absolute w-100 shadow" style={{ zIndex: 1050 }}>
                        <div className="list-group-item small text-muted italic text-center py-2 bg-light">No additional matches found</div>
                    </div>
                )}
            </div>

            <div className="mt-4">
                <label className="form-label small text-muted text-uppercase fw-bold">Assigned Admins</label>
                <div className="d-flex flex-wrap gap-2 border rounded p-3 bg-light-subtle" style={{ minHeight: '60px' }}>
                    {selectedUsers.length > 0 ? (
                        selectedUsers.map((user) => (
                            <div
                                key={user.id}
                                className="badge bg-white border text-dark p-2 d-flex align-items-center rounded-pill shadow-sm animate-fade-in"
                                style={{ fontSize: '0.85rem', fontWeight: "normal" }}
                            >
                                <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-2 fw-bold"
                                    style={{ width: '20px', height: '20px', fontSize: '10px' }}>
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                                <span className="me-2">{user.name}</span>
                                <TbX
                                    className="text-danger hover-scale"
                                    style={{ cursor: "pointer" }}
                                    onClick={() => handleRemoveUser(user)}
                                />
                            </div>
                        ))
                    ) : (
                        <span className="text-muted small italic my-auto">No administrators assigned yet. Use the search bar above to map project authority.</span>
                    )}
                </div>
            </div>

            <div className="mt-4 d-flex justify-content-between gap-2">
                <button className="btn btn-secondary border px-3" onClick={handleClose} disabled={isPending}>Cancel</button>
                <button
                    className="btn btn-primary px-4"
                    onClick={() => mutate()}
                    disabled={isPending}
                >
                    {isPending ? (
                        <div className="d-flex align-items-center gap-1">Saving <ButtonLoader /></div>
                    ) : (
                        "Save Updates"
                    )}
                </button>
            </div>
        </AppModal>
    );
};