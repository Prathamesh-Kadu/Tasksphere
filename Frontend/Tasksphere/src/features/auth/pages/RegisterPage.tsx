import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import AuthButton from "../components/AuthButton";
import AuthInput from "../components/AuthInput";
import AuthLayout from "../components/AuthLayout";
import { registerSchema } from "../schema/auth.schema";
import type { RegisterRequest } from "../types/auth.types";
import { registerUser } from "../services/authService";
import useCancelableRequest from "../hooks/useCancelableRequest";

export default function RegisterPage() {
    const navigate = useNavigate();
    const { createSignal } = useCancelableRequest();

    const { register, handleSubmit, reset, formState: { errors } } = useForm<RegisterRequest>({
        resolver: zodResolver(registerSchema)
    });

    // Handle account creation asynchronously via TanStack Query
    const registerMutation = useMutation({
        mutationFn: (data: RegisterRequest) => {
            return registerUser(data, createSignal());
        },
        onSuccess: (response) => {
            console.log("Registration successful:", response);

            // 1. Wipe out form inputs
            reset();

            // 2. Safely redirect the newly registered user to the login route
            navigate("/login");
        },
        onError: (error: any) => {
            // Feel free to connect a toast notification system here later
            console.error("Register failed:", error);
        }
    });

    const onRegisterSubmit = (data: RegisterRequest) => {
        registerMutation.mutate(data);
    };

    return (
        <AuthLayout title="Register">
            <form onSubmit={handleSubmit(onRegisterSubmit)}>
                <AuthInput
                    label="Name"
                    type="text"
                    placeholder="Enter your name"
                    register={register("name")}
                    error={errors.name}
                    autocomplete="name"
                />

                <AuthInput
                    label="Email"
                    type="email"
                    placeholder="Enter your email"
                    register={register("email")}
                    error={errors.email}
                    autocomplete="email"
                />

                <AuthInput
                    label="Password"
                    type="password"
                    placeholder="Enter your password"
                    register={register("password")}
                    error={errors.password}
                    autocomplete="new-password"
                />

                <AuthButton
                    // Control submission loaders using the mutation status tracking
                    isLoading={registerMutation.isPending}
                    label="Register"
                    loadingLabel="Registering"
                />
            </form>

            <div className="text-center mt-3 small text-muted">
                Already have an account?{" "}
                <Link
                    to="/login"
                    className="text-primary text-decoration-none fw-semibold"
                >
                    Login here
                </Link>
            </div>
        </AuthLayout>
    );
}