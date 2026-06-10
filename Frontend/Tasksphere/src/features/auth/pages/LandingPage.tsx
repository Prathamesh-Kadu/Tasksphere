import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { BiTask, BiShieldQuarter, BiRocket, BiLayerPlus } from "react-icons/bi";

export default function LandingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  return (
    <div className="d-flex flex-column min-vh-100 bg-white text-dark">
      
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom py-3 fixed-top shadow-sm">
        <div className="container">
          <Link to="/" className="navbar-brand d-flex align-items-center gap-2 fw-bold text-primary fs-4">
            <BiTask size={28} />
            <span>TaskSphere</span>
          </Link>
          <div className="d-flex gap-2">
            <Link to="/login" className="btn btn-link text-decoration-none fw-medium text-secondary btn-sm px-3">
              Sign In
            </Link>
            <Link to="/register" className="btn btn-primary rounded-pill fw-medium btn-sm px-4 shadow-sm">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Tag Line */}
      <main className="flex-grow-1" style={{ paddingTop: "100px" }}>
        <section className="py-5 text-center bg-light border-bottom">
          <div className="container py-5" style={{ maxWidth: "800px" }}>
            <div className="badge bg-primary bg-opacity-10 text-primary rounded-pill px-3 py-2 fw-semibold mb-3">
              <BiRocket className="me-1" /> Next-Gen Workspace Management
            </div>
            <h1 className="display-4 fw-extrabold text-dark tracking-tight mb-3">
              Orchestrate your workspace.<br />Elevate team velocity.
            </h1>
            <p className="lead text-muted px-md-5 mb-4 fs-5">
              A high-performance multi-tenant task and project ecosystem. Keep members aligned, admins organized, and operations secure.
            </p>
            <div className="d-flex justify-content-center gap-3">
              <Link to="/register" className="btn btn-primary btn-lg px-4 py-3 rounded-pill shadow fw-medium fs-6">
                Create Free Workspace
              </Link>
              <Link to="/login" className="btn btn-outline-dark btn-lg px-4 py-3 rounded-pill fw-medium fs-6">
                Access Account
              </Link>
            </div>
          </div>
        </section>

        {/*  Core features */}
        <section className="py-5 container">
          <div className="row g-4 py-4">
            <div className="col-md-4 text-center">
              <div className="p-3 bg-primary bg-opacity-10 text-primary rounded-circle d-inline-flex mb-3">
                <BiLayerPlus size={28} />
              </div>
              <h5 className="fw-bold">Multi-Tenant Isolation</h5>
              <p className="text-muted small px-3">
                Organizations, projects, and users are safely ring-fenced to safeguard workspace operational data integrity.
              </p>
            </div>
            <div className="col-md-4 text-center">
              <div className="p-3 bg-success bg-opacity-10 text-success rounded-circle d-inline-flex mb-3">
                <BiTask size={28} />
              </div>
              <h5 className="fw-bold">Granular Execution</h5>
              <p className="text-muted small px-3">
                Track personal task lines effortlessly while keeping project management cycles updated live.
              </p>
            </div>
            <div className="col-md-4 text-center">
              <div className="p-3 bg-warning bg-opacity-10 text-warning rounded-circle d-inline-flex mb-3">
                <BiShieldQuarter size={28} />
              </div>
              <h5 className="fw-bold">Role-Scoped Boundaries</h5>
              <p className="text-muted small px-3">
                Strict access enforcement ensures Super Admins, Owners, Admins, and Members see exactly what they own.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-dark text-white-50 py-5 mt-auto border-top border-secondary">
        <div className="container">
          <div className="row align-items-center justify-content-between g-3">
            <div className="col-12 col-md-4 text-center text-md-start">
              <span className="fw-bold text-white fs-5 d-flex align-items-center justify-content-center justify-content-md-start gap-2">
                <BiTask size={22} className="text-primary" /> TaskSphere
              </span>
              <p className="small text-muted mt-2 mb-0">© 2026 TaskSphere Engineering. All rights reserved.</p>
            </div>
            <div className="col-12 col-md-6 text-center text-md-end">
              <div className="d-flex justify-content-center justify-content-md-end gap-4 mb-0 small">
                <Link to="/login" className="text-white-50 text-decoration-none hover-white">Sign In</Link>
                <Link to="/register" className="text-white-50 text-decoration-none hover-white">Sign Up</Link>
                <span className="text-muted">|</span>
                <span className="text-muted">Stack: React + BootStrap + Spring Boot</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}