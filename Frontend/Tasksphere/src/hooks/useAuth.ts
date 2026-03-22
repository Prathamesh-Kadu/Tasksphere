import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }

    return {
        user: context.user,
        role: context.role,
        loading: context.loading,
        isAuthenticated: !!context.user,
        logout: context.logout,
        refreshUser: context.refreshUser
    };
}