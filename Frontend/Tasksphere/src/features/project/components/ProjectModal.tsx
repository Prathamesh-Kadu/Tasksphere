import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import ButtonLoader from "../../../components/loader/ButtonLoader";
import { AppModal } from "../../../components/modals/AppModal";
import { projectSchema } from "../schemas/project.schema";
import { createProject, updateProject } from "../services/projectService";
import type { ProjectRequest } from "../types/project.types";
import { toastError, toastSuccess } from "../../../components/toast/toast";


interface ProjectModalProps {
    show: boolean;
    handleClose: () => void;
    initialData?: any;
}


export const ProjectModal = ({ show, handleClose, initialData }: ProjectModalProps) => {

    const queryClient = useQueryClient();

    const { register, handleSubmit, reset, formState: { errors } } = useForm<ProjectRequest>({
        values: initialData || { name: '', description: '' },
        resolver: zodResolver(projectSchema)
    })

    const mutation = useMutation({
        mutationFn: (formData: ProjectRequest) => initialData ? updateProject(initialData.id, formData) : createProject(formData),
        onSuccess: (updatedData) => {
            if (initialData) {
                toastSuccess("Project updated successfully");
            } else {
                toastSuccess("Project created successfullly");
            }
            queryClient.invalidateQueries({ queryKey: ['projects'], exact: false });
            queryClient.invalidateQueries({ queryKey: ['projects', updatedData.id] });
            handleClose();
            reset();
        },
        onError:()=>{
             if (initialData) {
                 toastError("Failed to update project");
            } else {
                 toastError("Failed to update project");
            }
        }
    })

    return (
        <AppModal
            show={show}
            handleClose={handleClose}
            title={initialData ? "Edit Project" : "Create Project"}
        >
            <form onSubmit={handleSubmit((data) => mutation.mutate(data))}>
                <div className="mb-3">
                    <label className="form-label">Project Name</label>
                    <input
                        {...register("name")}
                        autoComplete="off"
                        className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                        maxLength={255}
                    />
                    <div className="invalid-feedback">{errors.name?.message}</div>
                </div>
                <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                        {...register("description")}
                        autoComplete="off"
                        className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                        maxLength={255}
                    />
                    <div className="invalid-feedback">{errors.description?.message}</div>
                </div>
                <div className="d-flex justify-content-between gap-2 mt-4">
                    <button type="button" className="btn btn-outline-secondary" onClick={handleClose}>
                        Cancel
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={mutation.isPending}>
                        {mutation.isPending ?
                            (
                                <>
                                    <span className="ms-2 fw-medium">{initialData ? "Updating" : "Adding"}</span>
                                    <ButtonLoader />
                                </>
                            ) : (
                                initialData ? "Update Project" : "Add Project"
                            )
                        }
                    </button>
                </div>
            </form>
        </AppModal>
    );
}