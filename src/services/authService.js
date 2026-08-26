import {
    getDeviceInfo,
} from "../utils/deviceInfo";

const API_URL =
    "https://portfolio-nales-backend.onrender.com/api";

// ============================================================
// TOKEN HELPERS
// ============================================================

const getToken = () => {
    return localStorage.getItem("token");
};

const saveToken = (token) => {
    localStorage.setItem(
        "token",
        token
    );
};

const removeToken = () => {
    localStorage.removeItem(
        "token"
    );
};


// ============================================================
// AUTH ERROR HELPERS
// ============================================================

const getErrorCode = (
    data
) => {
    return (
        data?.code ||
        data?.errorCode ||
        data?.error ||
        null
    );
};


const isTokenAuthenticationFailure = (
    status,
    data
) => {
    if (status !== 401) {
        return false;
    }

    const code =
        getErrorCode(data);

    // Prefer explicit backend error codes.
    if (
        code ===
            "TOKEN_EXPIRED" ||
        code ===
            "TOKEN_INVALID" ||
        code ===
            "INVALID_TOKEN" ||
        code ===
            "JWT_EXPIRED"
    ) {
        return true;
    }

    // Temporary compatibility with the
    // current backend if it only returns messages.
    const message =
        String(
            data?.message ||
            ""
        ).toLowerCase();  

    return (
        message.includes(
            "token expired"
        ) ||
        message.includes(
            "jwt expired"
        ) ||
        message.includes(
            "expired token"
        ) ||
        message.includes(
            "invalid token"
        ) ||
        message.includes(
            "jwt malformed"
        ) ||
        message.includes(
            "invalid jwt"
        )
    );
};


// ============================================================
// REQUEST HELPER
// ============================================================

const request = async (
    endpoint,
    options = {}
) => {
    const token =
        getToken();

    let response;

    try {
        response =
            await fetch(
                `${API_URL}${endpoint}`,
                {
                    ...options,

                    headers: {
                        "Content-Type":
                            "application/json",

                        ...(token
                            ? {
                                  Authorization:
                                      `Bearer ${token}`,
                              }
                            : {}),

                        ...(options.headers ||
                            {}),
                    },
                }
            );
    } catch (error) {
        console.error(
            "Network request failed:",
            {
                endpoint,
                error,
            }
        );

        const networkError =
            new Error(
                "Unable to connect to the server."
            );

        networkError.status =
            0;

        networkError.endpoint =
            endpoint;

        networkError.originalError =
            error;

        throw networkError;
    }


    // ========================================================
    // PARSE RESPONSE
    // ========================================================

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


    // ========================================================
    // SUCCESS
    // ========================================================

    if (response.ok) {
        return data;
    }


    // ========================================================
    // AUTHENTICATION FAILURE
    // ========================================================

    if (
        response.status === 401 &&
        token
    ) {
        const tokenFailure =
            isTokenAuthenticationFailure(
                response.status,
                data
            );

        if (tokenFailure) {
            const message =
                data?.message ||
                "Authentication token is no longer valid.";

            console.warn(
                "Authentication token rejected:",
                {
                    endpoint,
                    status:
                        response.status,
                    code:
                        getErrorCode(data),
                    message,
                    response:
                        data,
                }
            );

            removeToken();

            window.dispatchEvent(
                new CustomEvent(
                    "auth:expired",
                    {
                        detail: {
                            message,
                            code:
                                getErrorCode(
                                    data
                                ),
                            endpoint,
                            status:
                                response.status,
                        },
                    }
                )
            );
        } else {
            // IMPORTANT:
            // Do NOT remove the token here.
            //
            // A 401 does not automatically mean
            // the JWT is expired.
            console.warn(
                "Authentication rejected:",
                {
                    endpoint,
                    status:
                        response.status,
                    code:
                        getErrorCode(data),
                    message:
                        data?.message ||
                        "Unauthorized request.",
                    response:
                        data,
                }
            );
        }
    }


    // ========================================================
    // FORBIDDEN
    // ========================================================

    if (
        response.status === 403
    ) {
        console.warn(
            "Permission denied:",
            {
                endpoint,
                status:
                    response.status,
                code:
                    getErrorCode(data),
                message:
                    data?.message ||
                    "You do not have permission to perform this action.",
                response:
                    data,
            }
        );
    }


    // ========================================================
    // NOT FOUND
    // ========================================================

    if (
        response.status === 404
    ) {
        console.warn(
            "API resource not found:",
            {
                endpoint,
                status:
                    response.status,
                message:
                    data?.message ||
                    "Resource not found.",
            }
        );
    }


    // ========================================================
    // SERVER ERROR
    // ========================================================

    if (
        response.status >= 500
    ) {
        console.error(
            "Backend server error:",
            {
                endpoint,
                status:
                    response.status,
                message:
                    data?.message ||
                    "Internal server error.",
                response:
                    data,
            }
        );
    }


    // ========================================================
    // CREATE ERROR
    // ========================================================

    const error =
        new Error(
            data?.message ||
                `Request failed with status ${response.status}`
        );

    error.status =
        response.status;

    error.code =
        getErrorCode(data);

    error.data =
        data;

    error.endpoint =
        endpoint;

    throw error;
};


// ============================================================
// LOGIN
// ============================================================

export const login = async (
    username,
    password
) => {
    const deviceInfo =
        getDeviceInfo();

    const data =
        await request(
            "/auth/login",
            {
                method: "POST",

                headers: {
                    "x-device-id":
                        deviceInfo.deviceId,

                    "x-device-name":
                        deviceInfo.deviceName,

                    "x-browser":
                        deviceInfo.browser,

                    "x-operating-system":
                        deviceInfo.operatingSystem,
                },

                body: JSON.stringify({
                    username,
                    password,
                }),
            }
        );

    // ========================================================
    // SAVE JWT
    // ========================================================

    if (
        data?.data?.token
    ) {
        saveToken(
            data.data.token
        );
    }

    return data;
};


// ============================================================
// VERIFY LOGIN 2FA
// ============================================================

export const verifyLoginTwoFactor =
    async (
        challengeToken,
        code
    ) => {
        let response;

        try {
            response =
                await fetch(
                    `${API_URL}/auth/login/2fa`,
                    {
                        method:
                            "POST",

                        headers: {
                            "Content-Type":
                                "application/json",
                        },

                        body:
                            JSON.stringify(
                                {
                                    challengeToken,
                                    code,
                                }
                            ),
                    }
                );
        } catch (error) {
            console.error(
                "2FA network request failed:",
                error
            );

            const networkError =
                new Error(
                    "Unable to connect to the server."
                );

            networkError.status =
                0;

            networkError.endpoint =
                "/auth/login/2fa";

            networkError.originalError =
                error;

            throw networkError;
        }


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


        if (
            !response.ok
        ) {
            const error =
                new Error(
                    data?.message ||
                        "Invalid authentication code."
                );

            error.status =
                response.status;

            error.code =
                getErrorCode(data);

            error.data =
                data;

            error.endpoint =
                "/auth/login/2fa";

            console.error(
                "2FA verification failed:",
                {
                    status:
                        response.status,
                    code:
                        getErrorCode(
                            data
                        ),
                    message:
                        data?.message,
                    response:
                        data,
                }
            );

            throw error;
        }


        // ====================================================
        // ONLY SAVE REAL JWT AFTER 2FA
        // ====================================================

        if (
            data?.data?.token
        ) {
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

export const logout =
    async () => {
        try {
            if (
                getToken()
            ) {
                await request(
                    "/auth/logout",
                    {
                        method:
                            "POST",
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

export const getAuthToken =
    () => {
        return getToken();
    };


// ============================================================
// REMOVE TOKEN
// ============================================================

export const clearAuth =
    () => {
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
                method:
                    "POST",
            }
        );
    };


// ============================================================
// ENABLE 2FA
// ============================================================

export const enableTwoFactor =
    async (
        code
    ) => {
        return request(
            "/auth/2fa/enable",
            {
                method:
                    "POST",

                body:
                    JSON.stringify({
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
                method:
                    "POST",

                body:
                    JSON.stringify({
                        code,
                        password,
                    }),
            }
        );
    };


// ============================================================
// EXPORT API URL
// ============================================================

export {
    API_URL,
};