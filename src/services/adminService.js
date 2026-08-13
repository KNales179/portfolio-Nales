const API_URL = "http://localhost:5000/api";

// ============================================================
// REQUEST HELPER
// ============================================================

const request = async (
    endpoint,
    options = {}
) => {
    const token =
        localStorage.getItem("token");

    const response = await fetch(
        `${API_URL}${endpoint}`,
        {
            ...options,

            headers: {
                "Content-Type":
                    "application/json",

                Authorization:
                    `Bearer ${token}`,

                ...(options.headers || {}),
            },
        }
    );

    const data =
        await response.json();

    if (!response.ok) {
        throw new Error(
            data.message ||
                "Something went wrong"
        );
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
// ADMIN MANAGEMENT
// ============================================================

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

                body: JSON.stringify({
                    status,
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