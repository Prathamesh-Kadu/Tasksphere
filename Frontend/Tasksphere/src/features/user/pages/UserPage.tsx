import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react"; // Added useState and useEffect
import { useSearchParams } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import { UserTable } from "../components/UserTable";
import { getMembers } from "../services/userService";
import { AddMemberModal } from "../components/AddMemberModal";

export const UserPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();


    // 1. Get initial values from URL
    const nameFromUrl = searchParams.get("name") || "";
    const page = parseInt(searchParams.get("page") || "0");
    const size = 10;

    // 2. LOCAL STATE for the input (This prevents focus loss)
    const [searchTerm, setSearchTerm] = useState(nameFromUrl);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const { role, loading: authLoading } = useAuth();


    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (searchTerm !== nameFromUrl) {
                setSearchParams({ name: searchTerm, page: "0" });
            }
        }, 1000);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, setSearchParams, nameFromUrl]);

    const { data, isLoading: dataLoading } = useQuery({
        queryKey: ['users', nameFromUrl, page],
        queryFn: () => getMembers(page, size, nameFromUrl),
        enabled: !!role,
    });


    if (authLoading) return <div className="p-10 text-center">Loading Auth...</div>;


    const handleAdd = () => {
        setIsAddModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsAddModalOpen(false);
    };



    return (
        <div className="container-fluid">

            <div className="d-flex justify-content-between align-items-center mb-4 p-2">
                <h4 className="mb-0">Users</h4>
                {(role === "OWNER" || role === "ADMIN") &&
                    <button className="btn btn-primary" onClick={handleAdd}>
                        + Add Members
                    </button>
                }
            </div>
            <div className="row mb-4">
                <div className="col-12 col-md-6">
                    <div className="input-group">
                        <input
                            type="text"
                            placeholder="Search by name"
                            className="form-control w-50"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {dataLoading ? (
                <div className="text-center p-5">Searching...</div>
            ) : (
                <UserTable
                    users={data?.content || []}
                    loggedUserRole={role || "MEMBER"}
                />
            )}

            <div className="mt-4 d-flex justify-content-center align-items-center gap-4">
                <button
                    className="btn btn-sm px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                    disabled={page === 0}
                    onClick={() => setSearchParams({ name: nameFromUrl, page: (page - 1).toString() })}
                >
                    Previous
                </button>
                <span className="py-2">Page {page + 1} of {data?.totalPages || 1}</span>
                <button
                    className="btn btn-sm px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                    disabled={page >= (data?.totalPages || 1) - 1}
                    onClick={() => setSearchParams({ name: nameFromUrl, page: (page + 1).toString() })}
                >
                    Next
                </button>
            </div>



            {/* Add user to organization modal */}
            {isAddModalOpen && <AddMemberModal
                show={isAddModalOpen}
                handleClose={handleCloseModal}
            />}
        </div>
    );
};