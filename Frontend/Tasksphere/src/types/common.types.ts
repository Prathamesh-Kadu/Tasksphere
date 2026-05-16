export interface PageResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
}

export interface UserResponse {
    id: string;
    name: string;
    email: string;
    role: string;
    organizationName?: string;
    projectNames?: string[];
}