import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import {
    login as loginRequest,
    logout as logoutRequest,
    getCurrentAdmin,
    isAuthenticated,
} from "../services/authService";

const AuthContext =
    createContext(null);

export const AuthProvider = ({
    children,
}) => {
    const [admin, setAdmin] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    // ========================================================
    // RESTORE LOGIN SESSION
    // ========================================================

    useEffect(() => {
        const restoreSession =
            async () => {
                if (!isAuthenticated()) {
                    setLoading(false);
                    return;
                }

                try {
                    const response =
                        await getCurrentAdmin();

                    setAdmin(
                        response.data
                    );
                } catch (error) {
                    console.error(
                        "Session restore failed:",
                        error
                    );

                    localStorage.removeItem(
                        "token"
                    );

                    setAdmin(null);
                } finally {
                    setLoading(false);
                }
            };

        restoreSession();
    }, []);

    // ========================================================
    // HANDLE EXPIRED JWT
    // ========================================================

    useEffect(() => {
        const handleAuthExpired =
            (event) => {
                console.warn(
                    "Authentication expired:",
                    event.detail?.message
                );

                localStorage.removeItem(
                    "token"
                );

                setAdmin(null);
            };

        window.addEventListener(
            "auth:expired",
            handleAuthExpired
        );

        return () => {
            window.removeEventListener(
                "auth:expired",
                handleAuthExpired
            );
        };
    }, []);

    // ========================================================
    // LOGIN
    // ========================================================

    const login = async (
        username,
        password
    ) => {
        const response =
            await loginRequest(
                username,
                password
            );

        // ====================================================
        // 2FA REQUIRED
        // ====================================================

        if (
            response.requiresTwoFactor ||
            response.data
                ?.requiresTwoFactor
        ) {
            return response;
        }

        // ====================================================
        // NORMAL LOGIN
        // ====================================================

        if (
            response.data?.admin
        ) {
            setAdmin(
                response.data.admin
            );
        }

        return response;
    };

    // ========================================================
    // LOGOUT
    // ========================================================

    const logout = async () => {
        try {
            await logoutRequest();
        } finally {
            setAdmin(null);
        }
    };

    // ========================================================
    // REFRESH ADMIN
    // ========================================================

    const refreshAdmin =
        async () => {
            const response =
                await getCurrentAdmin();

            setAdmin(
                response.data
            );

            return response.data;
        };

    // ========================================================
    // CONTEXT VALUE
    // ========================================================

    const value = {
        admin,

        loading,

        isAuthenticated:
            Boolean(admin),

        login,

        logout,

        refreshAdmin,

        setAdmin,
    };

    return (
        <AuthContext.Provider
            value={value}
        >
            {children}
        </AuthContext.Provider>
    );
};

// ============================================================
// USE AUTH
// ============================================================

export const useAuth = () => {
    const context =
        useContext(
            AuthContext
        );

    if (!context) {
        throw new Error(
            "useAuth must be used inside AuthProvider"
        );
    }

    return context;
};

export default AuthContext;