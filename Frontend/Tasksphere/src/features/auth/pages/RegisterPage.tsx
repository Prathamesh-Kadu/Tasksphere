import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import AuthButton from "../components/AuthButton";
import AuthInput from "../components/AuthInput";
import AuthLayout from "../components/AuthLayout";
import { registerSchema } from "../Schema/auth.schema";
import type { RegisterRequest } from "../types/auth.types";
import { registerUser } from "../services/authService";
import useCancelableRequest from "../hooks/useCancelableRequest";

export default function RegisterPage() {
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<RegisterRequest>({
        resolver: zodResolver(registerSchema)
    })

    const { createSignal } = useCancelableRequest();

    const onRegisterSubmit = async (data: RegisterRequest) => {
        try {
            const response = await registerUser(data, createSignal());
            reset();
            console.log(response);
        } catch (error: any) {
            console.error("Register failed:", error);
        }
    }

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
                    isLoading={isSubmitting}
                    label="Register"
                    loadingLabel="Registering"
                />
            </form>
        </AuthLayout>
    );
}