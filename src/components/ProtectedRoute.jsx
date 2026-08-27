import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children }) {
    const { admin, loading } = useAuth();
    const location = useLocation();

    // ============================================================
    // WAIT FOR AUTH CONTEXT
    // ============================================================

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <p>Loading...</p>
            </div>
        );
    }

    // ============================================================
    // NOT LOGGED IN
    // ============================================================

    if (!admin) {
        return (
            <Navigate
                to="/login"
                state={{
                    from: location,
                }}
                replace
            />
        );
    }

    // ============================================================
    // 2FA NOT ENABLED
    // ============================================================

    const isSecurityPage =
        location.pathname ===
        "/admin/security";

    if (
        !admin.twoFactorEnabled &&
        !isSecurityPage
    ) {
        return (
            <Navigate
                to="/admin/security"
                replace
            />
        );
    }

    // ============================================================
    // AUTHENTICATED + ALLOWED
    // ============================================================

    return children;
}

export default ProtectedRoute;