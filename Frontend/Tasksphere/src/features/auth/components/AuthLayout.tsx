import type { ReactNode } from "react";


interface AuthLayoutProps {
    title: string,
    children: ReactNode
}

export default function AuthLayout({ title = "Form", children }: AuthLayoutProps) {
    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-12 col-md-6 col-lg-4 mx-auto">
                        <div className="card p-4 shadow">
                            
                            <h3 className="text-center mb-4">
                                {title}
                            </h3>

                            {children}

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}