import type { Organization, OrganizationResponse } from "../types/organization.types";
import OrganizationCard from "./OrganizationCard";



export interface OrganizationListProps {
    organizations: OrganizationResponse[];
    onEdit?: (org: Organization) => void;
    onDelete?: (id: string) => void;
    onView?: (id: string) => void;
}
const OrganizationList = ({ organizations, onEdit, onDelete, onView }: OrganizationListProps) => {

    if (!organizations.length) {
        return (
            <div className="text-center py-5 text-muted">
                No organizations found
            </div>
        );
    }

    return (
        <div className="row">
            {organizations.map((org) => (
                <OrganizationCard
                    key={org.id}
                    id={org.id}
                    name={org.name}
                    description={org.description}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onView={onView}
                />
            ))}
        </div>
    );
};

export default OrganizationList;