import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import { TaskTable } from "../components/TaskTable";
import { getAllTasks } from "../service/taskService";

export const TaskPage = () => {

    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();



    const nameFromUrl = searchParams.get("name") || "";
    const page = parseInt(searchParams.get("page") || "0");
    const size = 10;

    const [searchTerm, setSearchTerm] = useState(nameFromUrl);
    const { role } = useAuth();

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {

            if (searchTerm !== nameFromUrl) {
                setSearchParams({ name: searchTerm, page: "0" });
            }
        }, 1000);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, setSearchParams, nameFromUrl]);

    const { data, isLoading } = useQuery({
        queryKey: ['tasks', nameFromUrl, page],
        queryFn: () => getAllTasks(page, size, nameFromUrl),
        enabled: !!role,
    });



    return (
        <div className="container-fluid">
            <div className="row ">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="mb-0">Tasks</h4>
                    {role === "ADMIN" && (
                        <button className="btn btn-primary" onClick={() => navigate("/dashboard/tasks/manage")}>
                            + Create Task
                        </button>
                    )}
                </div>
            </div>

            <div className="row mb-3">
                <div className="col-12 col-md-6">
                    <div className="input-group">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search task..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="row">
                {isLoading ? (
                    <div className="text-center">Loading...</div>
                ) : (
                    <TaskTable
                        loggedUserRole={role || "MEMBER"}
                        tasks={data?.content || []}
                    />
                )}
            </div>


            {/* Add and Update Modal */}
            {/* {isModalOpen && <ProjectModal
                show={isModalOpen}
                handleClose={handleCloseModal}
                initialData={selectedProject}
            />} */}
        </div>
    );
};