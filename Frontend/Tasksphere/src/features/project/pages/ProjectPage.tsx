import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import { ProjectModal } from "../components/ProjectModal";
import { ProjectTable } from "../components/ProjectTable";
import { getProjects } from "../services/projectService";
import type { Project } from "../types/project.types";

export const ProjectPage = () => {

    const [searchParams, setSearchParams] = useSearchParams();
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);



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
        queryKey: ['projects', nameFromUrl, page],
        queryFn: () => getProjects(page, size, nameFromUrl),
        enabled: !!role,
    });


    const handleAdd = () => {
        setSelectedProject(null);
        setIsModalOpen(true);
    };
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedProject(null);
    };

    const handleEdit = (org: Project) => {
        setSelectedProject(org);
        setIsModalOpen(true);
    };

    return (
        <div className="container-fluid">
            <div className="row ">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="mb-0">Projects</h4>
                    {role === "OWNER" && (
                        <button className="btn btn-primary" onClick={handleAdd}>
                            + Create Project
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
                            placeholder="Search project..."
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
                    <ProjectTable
                        onEdit={handleEdit}
                        loggedUserRole={role || "MEMBER"}
                        projects={data?.content || []}
                    />
                )}
            </div>


            {/* Add and Update Modal */}
            {isModalOpen && <ProjectModal
                show={isModalOpen}
                handleClose={handleCloseModal}
                initialData={selectedProject}
            />}
        </div>
    );
};