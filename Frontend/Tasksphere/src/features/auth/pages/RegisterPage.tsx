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
import { BiArrowBack } from "react-icons/bi";
import { toastError, toastSuccess } from "../../../components/toast/toast";

export default function RegisterPage() {
    const navigate = useNavigate();
    const { createSignal } = useCancelableRequest();

    const { register, handleSubmit, reset, formState: { errors } } = useForm<RegisterRequest>({
        resolver: zodResolver(registerSchema)
    });

    const registerMutation = useMutation({
        mutationFn: (data: RegisterRequest) => {
            return registerUser(data, createSignal());
        },
        onSuccess: () => {
            reset();
            navigate("/login");
            toastSuccess("Registration successfully");

        },
        onError: (error: any) => {
            console.error("Register failed:", error);
            toastError("Registration Failed");
        }
    });

    const onRegisterSubmit = (data: RegisterRequest) => {
        registerMutation.mutate(data);
    };

    return (
        // Form
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
                    isLoading={registerMutation.isPending}
                    label="Register"
                    loadingLabel="Registering"
                />
            </form>
            {/* Login Link */}
            <div className="text-center mt-3 small text-muted">
                Already have an account?{" "}
                <Link
                    to="/login"
                    className="text-primary text-decoration-none fw-semibold"
                >
                    Login here
                </Link>
            </div>
            {/* Back to home button */}
            <div className="text-center mt-2 pt-2 border-top border-light">
                <Link
                    to="/"
                    className="text-muted text-decoration-none small d-inline-flex align-items-center gap-1 hover-effect"
                >
                    <BiArrowBack size={14} /> Back to Home
                </Link>
            </div>
        </AuthLayout>
    );
}