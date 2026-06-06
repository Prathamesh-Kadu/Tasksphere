import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BiArrowBack } from "react-icons/bi";

export const NotFoundPage = () => {
    const navigate = useNavigate();
    const [countdown, setCountdown] = useState(10);

    // Smart fallback: Send to dashboard if logged in, otherwise to login
    const token = localStorage.getItem("token"); 
    const fallbackRoute = token ? "/dashboard" : "/login";

    const handleGoBack = () => {
        // 🔑 Checks if there is a history stack to pop back into
        if (window.history.length > 2) {
            navigate(-1); // Takes them exactly one step back to their last valid page
        } else {
            navigate(fallbackRoute, { replace: true });
        }
    };

    // Auto-redirect handling
    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleGoBack(); // 🔑 Triggers the smart back navigation automatically
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [navigate, fallbackRoute]);

    return (
        <div className="container-fluid vh-100 d-flex align-items-center justify-content-center bg-light">
            <div className="text-center p-5 bg-white shadow-sm rounded-4" style={{ maxWidth: "520px" }}>
                
                <div className="mb-4">
                    <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="1" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        className="text-primary opacity-75"
                        style={{ width: "120px", height: "120px" }}
                    >
                        <circle cx="12" cy="12" r="10" strokeDasharray="4 4" />
                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                        <path d="M2 12h20" />
                    </svg>
                </div>

                <h1 className="fw-black text-secondary display-1 m-0" style={{ lineHeight: 1 }}>404</h1>
                <h3 className="fw-bold text-dark mt-2">Task Out of Orbit!</h3>
                
                <p className="text-muted my-3 px-3">
                    The workspace page you are looking for doesn't exist, has been archived, or moved out of the system workspace.
                </p>

                <div className="bg-light p-2 rounded-3 mb-4 border">
                    <span className="text-muted small">
                        Returning to your workspace in <strong className="text-primary">{countdown}s</strong>
                    </span>
                </div>

                <button 
                    onClick={handleGoBack}
                    className="btn btn-primary d-inline-flex align-items-center gap-2 px-4 py-2 rounded-pill shadow-sm"
                >
                    <BiArrowBack size={18} />
                    Go to Previous Page
                </button>
            </div>
        </div>
    );
};