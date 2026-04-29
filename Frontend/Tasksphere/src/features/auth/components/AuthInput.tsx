import { useId } from "react";
import type { FieldError } from "react-hook-form"

interface AuthInputProps {
    label: string,
    type: string,
    placeholder?: string,
    register: any,
    error?: FieldError,
    autocomplete?: string
}

export default function AuthInput({ label, type, placeholder, register, error, autocomplete }: AuthInputProps) {
    const id = useId();
    return (
        <>
            <div className="mb-3">
                <label htmlFor={id} className="form-label small text-muted">{label}</label>
                <input
                    id={id}
                    type={type}
                    placeholder={placeholder}
                    className={` form-control ${error ? "is-invalid" : ""}`}
                    autoComplete={autocomplete}
                    {...register}
                />
                {error && <div className="invalid-feedback">{error.message}</div>}
            </div>
        </>
    );
}