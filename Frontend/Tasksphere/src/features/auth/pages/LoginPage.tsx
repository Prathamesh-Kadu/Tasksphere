import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import AuthButton from "../components/AuthButton";
import AuthInput from "../components/AuthInput";
import AuthLayout from "../components/AuthLayout";
import { loginSchema } from "../Schema/auth.schema";
import { login } from "../services/authService";
import type { LoginRequest } from "../types/auth.types";
import { saveToken } from "../../../utils/tokenStorage";
import useCancelableRequest from "../hooks/useCancelableRequest";

export default function LoginPage() {

    const { register, handleSubmit,reset, formState: { errors, isSubmitting } } = useForm<LoginRequest>({
        resolver: zodResolver(loginSchema)
    })

    const { createSignal } = useCancelableRequest();

    const onLoginSubmit = async (data: LoginRequest) => {
        try {
            const response = await login(data, createSignal());
            saveToken(response.token);
            reset();
            console.log(response);
        } catch (error: any) {
            console.error("Login failed:", error);
        }
    }
    return (
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
                    isLoading={isSubmitting}
                    label="Login"
                    loadingLabel="Logging in"
                />
            </form>
        </AuthLayout>
    );
}