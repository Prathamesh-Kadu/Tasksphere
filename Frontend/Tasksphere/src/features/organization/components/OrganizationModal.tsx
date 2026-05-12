import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import ButtonLoader from "../../../components/loader/ButtonLoader";
import { AppModal } from "../../../components/modals/AppModal";
import { organizationSchema } from "../schemas/organization.schema";
import { createOrganization, updateOrganization } from "../services/organizationService";
import type { OrganizationRequest } from "../types/organization.types";


interface OrganizationModalProps {
    show: boolean;
    handleClose: () => void;
    initialData?: any;
}


export const OrganizationModal = ({ show, handleClose, initialData }: OrganizationModalProps) => {

    const queryClient = useQueryClient();

    const { register, handleSubmit, reset, formState: { errors } } = useForm<OrganizationRequest>({
        values: initialData || { name: '', description: '' },
        resolver: zodResolver(organizationSchema)
    })

    const mutation = useMutation({
        mutationFn: (formData: OrganizationRequest) => initialData ? updateOrganization(initialData.id, formData) : createOrganization(formData),
        onSuccess: (updatedData) => {
            queryClient.invalidateQueries({ queryKey: ['organizations'] });
            queryClient.invalidateQueries({ queryKey: ['organization', updatedData.id] });
            handleClose();
            reset();
        }
    })

    return (
        <AppModal
            show={show}
            handleClose={handleClose}
            title={initialData ? "Edit Organization" : "Create Organization"}
        >
                <form onSubmit={handleSubmit((data) => mutation.mutate(data))}>
                <div className="mb-3">
                    <label className="form-label">Organization Name</label>
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
                                initialData ? "Update Organization" : "Add Organization"
                            )
                        }
                    </button>
                </div>
            </form>
        </AppModal>
    );
}