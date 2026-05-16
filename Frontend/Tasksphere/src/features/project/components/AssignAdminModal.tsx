import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { TbLoader2, TbSearch, TbX } from "react-icons/tb";
import ButtonLoader from "../../../components/loader/ButtonLoader";
import { AppModal } from "../../../components/modals/AppModal";
import { getMembers, getUsersBySearch } from "../../../services/commonService";
import type { UserResponse } from "../../../types/common.types";
import { assignProjectAdmin } from "../services/projectService"; // Ensure this path is correct
import { useDebounce } from "use-debounce";
import useAuth from "../../../hooks/useAuth";

interface AssignAdminModalProps {
    show: boolean;
    handleClose: () => void;
    projectId: string;
    initialMembers?: UserResponse[];
}

export const AssignAdminModal = ({ show, handleClose, projectId, initialMembers }: AssignAdminModalProps) => {
    const [search, setSearch] = useState("");
    const [selectedUsers, setSelectedUsers] = useState<UserResponse[]>(initialMembers || []);
    const queryClient = useQueryClient();
    const [debouncedSearch] = useDebounce(search, 1000);
    const { role } = useAuth();
    const [showDropdown, setShowDropdown] = useState<boolean>(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // ------------ Get User By Search ------------
    const { data, isFetching } = useQuery({
        queryKey: ['users-search', debouncedSearch],
        queryFn: () => getMembers(0, 5, debouncedSearch || ""),
        enabled: !!role,
    });

    // ------------ Assign Project Admins ----------------
    const { mutate, isPending } = useMutation({
        mutationFn: () => {
            const ids = selectedUsers.map(u => u.id);
            return assignProjectAdmin(projectId, ids);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'], exact: false });
            handleClose();
        },
        onError: (err) => {
            console.error("Assignment failed", err);
        }
    });

    const handleSelectUser = (user: UserResponse) => {
        if (!selectedUsers.some(u => u.id === user.id)) {
            setSelectedUsers(prev => [...prev, user]);
        }
        setSearch("");
        setShowDropdown(false);
    };

    const handleRemoveUser = (userId: string) => {
        setSelectedUsers(prev => prev.filter(u => u.id !== userId));
    };

    return (
        <AppModal show={show} handleClose={handleClose} title="Manage Project Admins">
            <div className="position-relative mb-3" ref={dropdownRef}>
                <div className="input-group">
                    <span className="input-group-text bg-white border-end-0">
                        {isFetching ? <TbLoader2 className="animate-spin" /> : <TbSearch />}
                    </span>
                    <input
                        type="text"
                        className="form-control border-start-0"
                        placeholder="Search for users in organization..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onFocus={(e)=>{
                            setSearch(e.target.value);
                            setShowDropdown(true);
                        }}
                    />
                </div>

                {showDropdown && data?.content && (
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

            <div className="mt-4">
                <label className="form-label small text-muted text-uppercase fw-bold">Selected Admins</label>
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
                        <span className="text-muted small italic">Select users to assign as project admins.</span>
                    )}
                </div>
            </div>

            <div className="mt-4 d-flex justify-content-between">
                <button className="btn btn-secondary" onClick={handleClose} disabled={isPending}>Cancel</button>
                <button
                    className="btn btn-primary px-4"
                    onClick={() => mutate()}
                    disabled={selectedUsers.length === 0 || isPending}
                >
                    {isPending ? (
                        <>Saving <ButtonLoader /></>
                    ) : (
                        "Assign Admins"
                    )}
                </button>
            </div>
        </AppModal>
    );
};