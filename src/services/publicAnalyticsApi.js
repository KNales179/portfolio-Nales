// ============================================================
// PUBLIC ANALYTICS API
// ============================================================
//
// Unauthenticated. Returns the sanitized, aggregated snapshot
// shown on the public insights page. No token, no PII.
// ============================================================

const API_BASE_URL =
    import.meta.env.VITE_API_URL ||
    "https://portfolio-nales-backend.onrender.com";


export const getPublicAnalytics = async () => {
    const response = await fetch(
        `${API_BASE_URL}/api/analytics/public`
    );

    let data;

    try {
        data = await response.json();
    } catch {
        data = null;
    }

    if (!response.ok) {
        throw new Error(
            data?.message || "Unable to load insights."
        );
    }

    return data?.data || null;
};
