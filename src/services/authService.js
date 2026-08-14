const API_URL = "https://portfolio-nales-backend.onrender.com/api";

// ============================================================
// TOKEN HELPERS
// ============================================================

const getToken = () => {
    return localStorage.getItem("token");
};

const saveToken = (token) => {
    localStorage.setItem("token", token);
};

const removeToken = () => {
    localStorage.removeItem("token");
};

// ============================================================
// REQUEST HELPER
// ============================================================

const request = async (
    endpoint,
    options = {}
) => {
    const token = getToken();

    const response = await fetch(
        `${API_URL}${endpoint}`,
        {
            ...options,

            headers: {
                "Content-Type": "application/json",

                ...(token
                    ? {
                          Authorization:
                              `Bearer ${token}`,
                      }
                    : {}),

                ...(options.headers || {}),
            },
        }
    );

    let data;

    try {
        data = await response.json();
    } catch {
        data = {
            message:
                "Invalid server response.",
        };
    }

    // ========================================================
    // AUTHENTICATION FAILURE
    // ========================================================

    if (
        response.status === 401 &&
        token
    ) {
        removeToken();

        window.dispatchEvent(
            new CustomEvent(
                "auth:expired",
                {
                    detail: {
                        message:
                            data.message ||
                            "Your session has expired. Please login again.",
                    },
                }
            )
        );
    }

    // ========================================================
    // REQUEST ERROR
    // ========================================================

    if (!response.ok) {
        const error = new Error(
            data.message ||
                "Something went wrong"
        );

        error.status =
            response.status;

        error.data = data;

        throw error;
    }

    return data;
};

// ============================================================
// LOGIN
// ============================================================

export const login = async (
    username,
    password
) => {
    const data = await request(
        "/auth/login",
        {
            method: "POST",

            body: JSON.stringify({
                username,
                password,
            }),
        }
    );

    // ========================================================
    // NORMAL LOGIN
    // ========================================================

    if (data.data?.token) {
        saveToken(
            data.data.token
        );
    }

    // ========================================================
    // 2FA REQUIRED
    // ========================================================
    //
    // The challengeToken is intentionally NOT stored.
    //

    return data;
};

// ============================================================
// VERIFY LOGIN 2FA
// ============================================================

export const verifyLoginTwoFactor = async (
    challengeToken,
    code
) => {
    const response =
        await fetch(
            `${API_URL}/auth/login/2fa`,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json",
                },

                body: JSON.stringify({
                    challengeToken,
                    code,
                }),
            }
        );

    let data;

    try {
        data =
            await response.json();
    } catch {
        data = {
            message:
                "Invalid server response.",
        };
    }

    if (!response.ok) {
        const error =
            new Error(
                data.message ||
                    "Invalid authentication code."
            );

        error.status =
            response.status;

        error.data = data;

        throw error;
    }

    // ========================================================
    // ONLY SAVE REAL JWT AFTER 2FA
    // ========================================================

    if (data.data?.token) {
        saveToken(
            data.data.token
        );
    }

    return data;
};

// ============================================================
// GET CURRENT ADMIN
// ============================================================

export const getCurrentAdmin =
    async () => {
        return request(
            "/auth/me"
        );
    };

// ============================================================
// LOGOUT
// ============================================================

export const logout = async () => {
    try {
        if (getToken()) {
            await request(
                "/auth/logout",
                {
                    method: "POST",
                }
            );
        }
    } finally {
        removeToken();
    }
};

// ============================================================
// CHECK TOKEN
// ============================================================

export const isAuthenticated =
    () => {
        return Boolean(
            getToken()
        );
    };

// ============================================================
// GET TOKEN
// ============================================================

export const getAuthToken = () => {
    return getToken();
};

// ============================================================
// REMOVE TOKEN
// ============================================================

export const clearAuth = () => {
    removeToken();
};

// ============================================================
// TWO-FACTOR AUTHENTICATION
// ============================================================

export const setupTwoFactor =
    async () => {
        return request(
            "/auth/2fa/setup",
            {
                method: "POST",
            }
        );
    };

// ============================================================
// ENABLE 2FA
// ============================================================

export const enableTwoFactor =
    async (code) => {
        return request(
            "/auth/2fa/enable",
            {
                method: "POST",

                body: JSON.stringify({
                    code,
                }),
            }
        );
    };

// ============================================================
// DISABLE 2FA
// ============================================================

export const disableTwoFactor =
    async (
        code,
        password
    ) => {
        return request(
            "/auth/2fa/disable",
            {
                method: "POST",

                body: JSON.stringify({
                    code,
                    password,
                }),
            }
        );
    };

    