import ButtonLoader from "../../../components/loader/ButtonLoader";

interface LoadingButtonProps {
    isLoading: boolean;
    label: string;
    loadingLabel?: string;
    type?: "button" | "submit" | "reset";
    className?: string;
}

export default function AuthButton({ isLoading, label, loadingLabel = "Loading", type = "submit", className = "btn btn-primary w-100" }: LoadingButtonProps) {
    return (
        <button type={type} className={className} disabled={isLoading}>
            {isLoading ? (
                <div className="d-flex align-items-center justify-content-center">
                    <span className="ms-2 fw-medium">{loadingLabel}</span>
                    <ButtonLoader />
                </div>
            ) : (
                label
            )}
        </button>
    );
}