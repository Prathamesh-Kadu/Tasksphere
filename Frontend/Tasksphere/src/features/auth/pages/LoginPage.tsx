import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import AuthButton from "../components/AuthButton";
import AuthInput from "../components/AuthInput";
import AuthLayout from "../components/AuthLayout";
import { login } from "../services/authService";
import type { LoginRequest } from "../types/auth.types";
import { saveToken } from "../../../utils/tokenStorage";
import useCancelableRequest from "../hooks/useCancelableRequest";
import { loginSchema } from "../schema/auth.schema";
import useAuth from "../../../hooks/useAuth";
import { BiArrowBack } from "react-icons/bi";
import { toastError, toastSuccess } from "../../../components/toast/toast";

export default function LoginPage() {
    const navigate = useNavigate();
    const { createSignal } = useCancelableRequest();
    const { refreshUser } = useAuth();

    const { register, handleSubmit, reset, formState: { errors } } = useForm<LoginRequest>({
        resolver: zodResolver(loginSchema)
    });

    const loginMutation = useMutation({
        mutationFn: (data: LoginRequest) => {
            return login(data, createSignal());
        },
        onSuccess: async (response) => {
            saveToken(response.token);
            try {
                await refreshUser();
                toastSuccess("Login Success");
                reset();
                navigate("/dashboard");
            } catch (err) {
                console.error("Failed to update context user state:", err);
            }
        },
        onError: () => {
            toastError("Login failed");
        }
    });

    const onLoginSubmit = (data: LoginRequest) => {
        loginMutation.mutate(data);
    };

    return (
        // Form
        <AuthLayout title="Login">
            <form onSubmit={handleSubmit(onLoginSubmit)}>
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
                    autocomplete="current-password"
                />

                <AuthButton
                    isLoading={loginMutation.isPending}
                    label="Login"
                    loadingLabel="Logging in"
                />
            </form>
            {/* Register Link */}
            <div className="text-center mt-3 small text-muted">
                New user?{" "}
                <Link
                    to="/register"
                    className="text-primary text-decoration-none fw-semibold"
                >
                    Register here
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