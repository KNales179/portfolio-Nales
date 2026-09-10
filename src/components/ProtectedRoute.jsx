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

    const path = location.pathname;
    const onRegisterPage = path === "/admin/register";
    // The 2FA-enrolment pages an un-enrolled admin is allowed to
    // sit on (the QR setup lives on /two-factor; /security is its
    // sibling).
    const onTwoFactorSetupPage =
        path === "/admin/settings/two-factor" ||
        path === "/admin/settings/security" ||
        path === "/admin/settings";

    // ============================================================
    // FIRST LOGIN — finish account setup before anything else
    // ============================================================

    if (admin.mustChangePassword && !onRegisterPage) {
        return (
            <Navigate to="/admin/register" replace />
        );
    }

    // Setup already done — no reason to sit on the register page.
    if (!admin.mustChangePassword && onRegisterPage) {
        return (
            <Navigate to="/admin/dashboard" replace />
        );
    }

    // ============================================================
    // 2FA NOT ENABLED — force enrolment on the security page
    // ============================================================

    if (
        !admin.mustChangePassword &&
        !admin.twoFactorEnabled &&
        !onTwoFactorSetupPage
    ) {
        return (
            <Navigate
                to="/admin/settings/two-factor"
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