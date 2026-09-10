const API_URL = "https://portfolio-nales-backend.onrender.com/api";


// ============================================================
// STEP-UP 2FA TOKEN  (admin management)
// ============================================================
//
// Kept per browser tab. Sensitive admin-management calls send it
// in the X-Step-Up header; when the server rejects it as
// missing/expired the token is cleared so the UI re-locks.
// ============================================================

const STEP_UP_KEY = "adminStepUpToken";

export const getStepUpToken = () => {
    try {
        return sessionStorage.getItem(STEP_UP_KEY) || "";
    } catch {
        return "";
    }
};

// True only while a stored step-up token is present and unexpired
// (a ~30s skew keeps a token that's about to lapse from being
// treated as live).
export const hasValidStepUp = () => {
    const token = getStepUpToken();
    if (!token) {
        return false;
    }
    try {
        const [, payload] = token.split(".");
        const { exp } = JSON.parse(atob(payload));
        return (
            typeof exp === "number" &&
            exp * 1000 - Date.now() > 30_000
        );
    } catch {
        return false;
    }
};

export const setStepUpToken = (token) => {
    try {
        sessionStorage.setItem(STEP_UP_KEY, token);
    } catch {
        // sessionStorage unavailable — the page just re-prompts.
    }
};

export const clearStepUpToken = () => {
    try {
        sessionStorage.removeItem(STEP_UP_KEY);
    } catch {
        // ignore
    }
};


// ============================================================
// REQUEST HELPER
// ============================================================

const request = async (
    endpoint,
    options = {}
) => {
    const { stepUp, ...rest } = options;

    const token =
        localStorage.getItem("token");

    const response = await fetch(
        `${API_URL}${endpoint}`,
        {
            ...rest,

            headers: {
                "Content-Type":
                    "application/json",

                Authorization:
                    `Bearer ${token}`,

                ...(stepUp && getStepUpToken()
                    ? { "X-Step-Up": getStepUpToken() }
                    : {}),

                ...(rest.headers || {}),
            },
        }
    );

    let data;
    try {
        data = await response.json();
    } catch {
        data = null;
    }

    if (!response.ok) {
        if (data?.code === "STEP_UP_REQUIRED") {
            clearStepUpToken();
        }

        const error = new Error(
            data?.message ||
                "Something went wrong"
        );
        error.code = data?.code;
        error.status = response.status;
        throw error;
    }

    return data;
};

// ============================================================
// PROFILE
// ============================================================

export const getMyProfile = async () => {
    return request(
        "/admin/profile"
    );
};

export const updateMyProfile = async (
    profileData
) => {
    return request(
        "/admin/profile",
        {
            method: "PUT",

            body: JSON.stringify(
                profileData
            ),
        }
    );
};

// ============================================================
// USERNAME
// ============================================================

export const changeUsername = async (
    username
) => {
    return request(
        "/admin/profile/username",
        {
            method: "PATCH",

            body: JSON.stringify({
                username,
            }),
        }
    );
};

// ============================================================
// PASSWORD
// ============================================================

export const changePassword = async (
    currentPassword,
    newPassword
) => {
    return request(
        "/admin/profile/password",
        {
            method: "PATCH",

            body: JSON.stringify({
                currentPassword,
                newPassword,
            }),
        }
    );
};

// ============================================================
// FIRST LOGIN
// ============================================================

export const completeFirstLogin = async ({
    username,
    fullName,
    email,
    phone,
    newPassword,
}) => {
    return request(
        "/admin/profile/complete-first-login",
        {
            method: "PATCH",

            body: JSON.stringify({
                username,
                fullName,
                email,
                phone,
                newPassword,
            }),
        }
    );
};

// ============================================================
// PROFILE IMAGE
// ============================================================

export const uploadProfileImage = async (
    file
) => {
    const token =
        localStorage.getItem("token");

    const formData =
        new FormData();

    formData.append(
        "profileImage",
        file
    );

    const response =
        await fetch(
            `${API_URL}/upload/profile-image`,
            {
                method: "POST",

                headers: {
                    Authorization:
                        `Bearer ${token}`,
                },

                body: formData,
            }
        );

    const data =
        await response.json();

    if (!response.ok) {
        throw new Error(
            data.message ||
                "Failed to upload profile image"
        );
    }

    return data;
};

// ============================================================
// DELETE PROFILE IMAGE
// ============================================================

export const deleteProfileImage =
    async () => {
        return request(
            "/upload/profile-image",
            {
                method: "DELETE",
            }
        );
    };

// ============================================================
// ADMIN MANAGEMENT  (SUPER_ADMIN, writes require step-up 2FA)
// ============================================================

// Exchange a fresh 6-digit code for a step-up token that unlocks
// the management writes for a short window.
export const verifyAdminTwoFactor = async (code) => {
    const data = await request("/admin/verify-2fa", {
        method: "POST",
        body: JSON.stringify({ code }),
    });

    if (data?.data?.stepUpToken) {
        setStepUpToken(data.data.stepUpToken);
    }

    return data;
};

export const getAdmins = async () => {
    return request("/admin");
};

export const getAdminById = async (
    id
) => {
    return request(
        `/admin/${id}`
    );
};

export const createAdmin = async (
    adminData
) => {
    return request(
        "/admin",
        {
            method: "POST",
            stepUp: true,
            body: JSON.stringify(
                adminData
            ),
        }
    );
};

export const updateAdmin = async (
    id,
    adminData
) => {
    return request(
        `/admin/${id}`,
        {
            method: "PUT",
            stepUp: true,
            body: JSON.stringify(
                adminData
            ),
        }
    );
};

export const updateAdminStatus =
    async (
        id,
        status
    ) => {
        return request(
            `/admin/${id}/status`,
            {
                method: "PATCH",
                stepUp: true,
                body: JSON.stringify({
                    status,
                }),
            }
        );
    };

export const setAdminPassword = async (
    id,
    newPassword
) => {
    return request(
        `/admin/${id}/password`,
        {
            method: "PATCH",
            stepUp: true,
            body: JSON.stringify({
                newPassword,
            }),
        }
    );
};

export const deleteAdmin = async (
    id
) => {
    return request(
        `/admin/${id}`,
        {
            method: "DELETE",
            stepUp: true,
        }
    );
};

// ============================================================
// TWO-FACTOR AUTHENTICATION
// ============================================================

export const setupTwoFactor = async () => {
    return request("/auth/2fa/setup", {
        method: "POST",
    });
};

export const enableTwoFactor = async (code) => {
    return request("/auth/2fa/enable", {
        method: "POST",
        body: JSON.stringify({
            code,
        }),
    });
};

export const disableTwoFactor = async (
    code,
    password
) => {
    return request("/auth/2fa/disable", {
        method: "POST",
        body: JSON.stringify({
            code,
            password,
        }),
    });
};

// ============================================================
// RESET PASSWORD USING 2FA
// ============================================================

export const resetPasswordWithTwoFactor =
    async (
        code,
        newPassword
    ) => {
        return request(
            "/admin/password/reset-2fa",
            {
                method: "POST",

                body: JSON.stringify({
                    code,
                    newPassword,
                }),
            }
        );
    };