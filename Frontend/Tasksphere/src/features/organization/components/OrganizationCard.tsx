import type { Organization } from "../types/organization.types";
import "./../../../styles/BoxEffect.css";

interface OrganizationCardProps {
    id: string;
    name: string;
    description?: string;
    onEdit?: (org: Organization) => void;
    onDelete?: (id: string) => void;
    onView?: (id: string) => void;
}

const OrganizationCard = ({ id, name, description, onEdit, onDelete, onView }: OrganizationCardProps) => {

    return (
        <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4 ">
            <div className="card h-100 shadow-sm border-0 hover-elevate" onClick={() => onView?.(id)}>
                <div className="card-body d-flex flex-column ">
                    <div className="d-flex justify-content-between align-items-start ">
                        <h5 className="card-title mb-1">{name}</h5>
                        {/* Menu */}
                        <div className="dropdown">
                            <button
                                className="btn btn-sm btn-light"
                                data-bs-toggle="dropdown"
                                onClick={(e) => e.stopPropagation()}
                            >
                                ⋮
                            </button>

                            <ul className="dropdown-menu dropdown-menu-end">
                                <li>
                                    <button className="dropdown-item"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onEdit?.({ id, name, description });
                                        }}
                                    >
                                        Edit
                                    </button>
                                </li>
                                <li>
                                    <button className="dropdown-item text-danger"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onDelete?.(id);
                                        }}
                                    >
                                        Delete
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Description */}
                    <p className="text-muted mt-2 mb-0 text-truncate">
                        {description || "No description"}
                    </p>

                </div>
            </div>
        </div>
    );
};

export default OrganizationCard;
