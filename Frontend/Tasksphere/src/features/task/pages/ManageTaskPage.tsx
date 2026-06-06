import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { getMembers } from "../../../services/commonService";
import { getProjects } from "../../project/services/projectService";
import { taskSchema } from "../schemas/task.schema";
import type { TaskRequest } from "../types/task.types";
// 🔑 Added updateTask import
import { createTask, getTask, updateTask } from "../service/taskService"; 

export const ManageTaskPage = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { id } = useParams<{ id: string }>();
    const isEditMode = Boolean(id);

    const { register, handleSubmit, reset, formState: { errors } } = useForm<TaskRequest>({
        defaultValues: {
            title: "",
            description: "",
            dueDate: "",
            projectId: "",
            assignedTo: "",
            status: "TODO"
        },
        resolver: zodResolver(taskSchema)
    });

    // 1. Fetch Task Details 
    const { data: taskData, isLoading: isTaskLoading } = useQuery({
        queryKey: ['task', id],
        queryFn: () => getTask(id!),
        enabled: isEditMode,
    });

    // 2. Fetch Projects Dropdown Cache
    const { data: projectData, isLoading: isProjectsLoading } = useQuery({
        queryKey: ['projects', '', 0],
        queryFn: () => getProjects(0, 100, ""),
    });

    // 3. Fetch Members Dropdown Cache
    const { data: userData, isLoading: isUsersLoading } = useQuery({
        queryKey: ['users', '', 0],
        queryFn: () => getMembers(0, 100, ""),
    });

    const projectList = projectData
        ? (Array.isArray(projectData) ? projectData : projectData.content || [])
        : [];

    const userList = userData
        ? (Array.isArray(userData) ? userData : (userData as any).content || [])
            .filter((user: any) => user.role !== "ADMIN" && user.role !== "ROLE_ADMIN")
        : [];

    useEffect(() => {
        if (isEditMode && taskData && projectList.length > 0 && userList.length > 0) {
            const matchedProject = projectList.find(
                (p: any) => p.name === taskData.projectName
            );

            const matchedUser = userList.find(
                (u: any) => (u.name || u.username) === taskData.assignedToUser
            );

            reset({
                title: taskData.title || "",
                description: taskData.description || "",
                dueDate: taskData.dueDate ? taskData.dueDate.substring(0, 16) : "",
                projectId: matchedProject?.id || "",
                assignedTo: matchedUser?.id || "",
                status: taskData.status || "TODO"
            });
        }
    }, [taskData, isEditMode, projectList.length, userList.length, reset]);

    // Create Task Mutation Logic
    const createTaskMutation = useMutation({
        mutationFn: (formData: TaskRequest) => createTask(formData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tasks"], exact: false });
            navigate("/dashboard/tasks");
        },
        onError: (error) => console.error("Task creation error:", error)
    });

    // 🔑 2. ADDED: Update Task Mutation Logic
    const updateTaskMutation = useMutation({
        mutationFn: (formData: TaskRequest) => updateTask(id!, formData),
        onSuccess: () => {
            // Clear out stale cache metrics instantly
            queryClient.invalidateQueries({ queryKey: ["tasks"], exact: false });
            queryClient.invalidateQueries({ queryKey: ["task", id] });
            navigate("/dashboard/tasks");
        },
        onError: (error) => console.error("Task update error:", error)
    });

    const onSubmit = (formData: TaskRequest) => {
        const finalPayload = {
            ...formData,
            dueDate: formData.dueDate && formData.dueDate.split(":").length === 2
                ? `${formData.dueDate}:00`
                : formData.dueDate
        };

        // 🔑 3. BRANCHING OPERATION ACCORDING TO THE MODECONTEXT
        if (isEditMode) {
            updateTaskMutation.mutate(finalPayload);
        } else {
            createTaskMutation.mutate(finalPayload);
        }
    };

    // 🔑 FIXED SKELETON LOAD CONDITIONS: Only stall layouts if we are loading an existing task record
    if (isEditMode && isTaskLoading) {
        return (
            <div className="d-flex flex-column align-items-center justify-content-center p-5 min-vh-50">
                <div className="spinner-border text-primary mb-2" role="status" />
                <span className="text-muted">Pre-populating layout metrics...</span>
            </div>
        );
    }

    return (
        <div className="container-fluid ">
            <div className="mb-3">
                <button
                    type="button"
                    onClick={() => navigate("/dashboard/tasks")}
                    className="btn btn-link text-decoration-none p-0 d-flex align-items-center gap-1 text-muted"
                >
                    <FaArrowLeft /> Back to Tasks
                </button>
            </div>

            <div className="row mb-2">
                <div className="col-12 d-flex align-items-center">
                    <h4 className="m-0 fw-bold text-dark">
                        {isEditMode ? "Edit Task Details" : "Add Task Details"}
                    </h4>
                </div>
            </div>

            <div className="row mt-3 p-3 bg-white mx-1" style={{ borderRadius: "0.3rem", boxShadow: "0 10px 25px 1px rgba(0, 0, 0, 0.15)" }}>
                <div className="col-12">
                    <form onSubmit={handleSubmit(onSubmit)} noValidate>

                        <div className="row g-3 mb-3">
                            <div className="col-md-6">
                                <label htmlFor="title" className="form-label text-muted text-uppercase fw-bold" style={{ fontSize: "0.8rem" }}>Task Name</label>
                                <input
                                    id="title"
                                    type="text"
                                    placeholder="Enter task name"
                                    className={`form-control form-control-sm ${errors.title ? "is-invalid" : ""}`}
                                    {...register("title")}
                                />
                                {errors.title && <div className="invalid-feedback">{errors.title.message}</div>}
                            </div>

                            <div className="col-md-6">
                                <label htmlFor="status" className="form-label text-muted text-uppercase fw-bold" style={{ fontSize: "0.8rem" }}>Status</label>
                                <select
                                    id="status"
                                    style={{ cursor: "pointer" }}
                                    className={`form-select form-select-sm ${errors.status ? "is-invalid" : ""}`}
                                    {...register("status")}
                                >
                                    <option value="TODO">To Do</option>
                                    <option value="IN_PROGRESS">In Progress</option>
                                    <option value="DONE">Done</option>
                                </select>
                                {errors.status && <div className="invalid-feedback">{errors.status.message}</div>}
                            </div>
                        </div>

                        <div className="row g-3 mb-3">
                            <div className="col-md-6">
                                <label htmlFor="description" className="form-label text-muted text-uppercase fw-bold" style={{ fontSize: "0.8rem" }}>Description</label>
                                <textarea
                                    id="description"
                                    rows={3}
                                    placeholder="Enter description"
                                    className={`form-control form-control-sm ${errors.description ? "is-invalid" : ""}`}
                                    {...register("description")}
                                />
                                {errors.description && <div className="invalid-feedback">{errors.description.message}</div>}
                            </div>

                            <div className="col-md-6">
                                <label htmlFor="dueDate" className="form-label text-muted text-uppercase fw-bold" style={{ fontSize: "0.8rem" }}>Due Date & Time</label>
                                <input
                                    id="dueDate"
                                    type="datetime-local"
                                    // 🔑 NATIVE FIX: Only block past choices visually when creating a brand new item!
                                    min={!isEditMode ? new Date().toISOString().substring(0, 16) : undefined}
                                    className={`form-control form-control-sm ${errors.dueDate ? "is-invalid" : ""}`}
                                    {...register("dueDate")}
                                />
                                {errors.dueDate && <div className="invalid-feedback">{errors.dueDate.message}</div>}
                            </div>
                        </div>

                        <div className="row g-3 mb-4">
                            <div className="col-md-6">
                                <label htmlFor="projectId" className="form-label text-muted text-uppercase fw-bold" style={{ fontSize: "0.8rem" }}>Projects</label>
                                <select
                                    id="projectId"
                                    style={{ cursor: "pointer" }}
                                    className={`form-select form-select-sm ${errors.projectId ? "is-invalid" : ""}`}
                                    {...register("projectId")}
                                    disabled={isProjectsLoading}
                                >
                                    <option value="">-- Select target project --</option>
                                    {projectList.map((project: any) => (
                                        <option key={project.id} value={project.id}>
                                            {project.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.projectId && <div className="invalid-feedback">{errors.projectId.message}</div>}
                            </div>

                            <div className="col-md-6">
                                <label htmlFor="assignedTo" className="form-label text-muted text-uppercase fw-bold" style={{ fontSize: "0.8rem" }}>Users</label>
                                <select
                                    id="assignedTo"
                                    style={{ cursor: "pointer" }}
                                    className={`form-select form-select-sm ${errors.assignedTo ? "is-invalid" : ""}`}
                                    {...register("assignedTo")}
                                    disabled={isUsersLoading}
                                >
                                    <option value="">-- Select assigned user --</option>
                                    {userList.map((user: any) => (
                                        <option key={user.id} value={user.id}>
                                            {user.name || user.username} ({user.email || "No Email"})
                                        </option>
                                    ))}
                                </select>
                                {errors.assignedTo && <div className="invalid-feedback">{errors.assignedTo.message}</div>}
                            </div>
                        </div>

                        <div className="d-flex justify-content-end gap-2 border-top pt-3 mt-4">
                            <button
                                type="button"
                                className="btn btn-sm btn-light border px-4"
                                onClick={() => navigate("/dashboard/tasks")}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn btn-sm btn-primary px-4"
                                disabled={createTaskMutation.isPending || updateTaskMutation.isPending}
                            >
                                {isEditMode ? "Update Task" : "Save Task"}
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
};