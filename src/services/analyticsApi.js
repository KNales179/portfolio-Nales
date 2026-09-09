// ============================================================
// ANALYTICS API
// ============================================================
//
// Admin-side reads for the analytics dashboard.
//
// - Auth is the existing admin token (same pattern as workApi).
// - The backend is the authority on what an admin may see.
// - Public event ingestion lives in src/analytics/, not here.
// ============================================================


// ============================================================
// CONFIG
// ============================================================

const API_BASE_URL =
    import.meta.env.VITE_API_URL ||
    "https://portfolio-nales-backend.onrender.com";


// ============================================================
// AUTH TOKEN
// ============================================================

const getAuthToken = () => {
    return (
        localStorage.getItem("token") ||
        localStorage.getItem("authToken")
    );
};


// ============================================================
// REQUEST HELPER
// ============================================================

const apiRequest = async (endpoint, options = {}) => {
    const token = getAuthToken();

    const headers = {
        "Content-Type": "application/json",

        ...(token
            ? { Authorization: `Bearer ${token}` }
            : {}),

        ...(options.headers || {}),
    };

    const response = await fetch(
        `${API_BASE_URL}${endpoint}`,
        {
            ...options,
            headers,
        }
    );

    let data;

    try {
        data = await response.json();
    } catch {
        data = null;
    }

    if (!response.ok) {
        const error = new Error(
            data?.message ||
            "Analytics request failed."
        );

        error.status = response.status;
        error.data = data;

        throw error;
    }

    return data;
};


// ============================================================
// PERIODS
// ============================================================

export const ANALYTICS_PERIODS = [
    { value: "today", label: "Today" },
    { value: "7d", label: "7 days" },
    { value: "30d", label: "30 days" },
    { value: "year", label: "Year" },
];


// ============================================================
// PAGE ANALYTICS
// ============================================================

export const getPageAnalytics = async (
    period = "7d"
) => {
    const query = encodeURIComponent(period);

    return apiRequest(
        `/api/analytics/pages?period=${query}`
    );
};


// ============================================================
// INTERACTION ANALYTICS
// ============================================================

export const getInteractionAnalytics = async (
    period = "7d"
) => {
    const query = encodeURIComponent(period);

    return apiRequest(
        `/api/analytics/interactions?period=${query}`
    );
};


// ============================================================
// AUDIENCE ANALYTICS
// ============================================================

export const getAudienceAnalytics = async (
    period = "7d"
) => {
    const query = encodeURIComponent(period);

    return apiRequest(
        `/api/analytics/audience?period=${query}`
    );
};


// ============================================================
// LABELS
// ============================================================

export const INTERACTION_ACTION_LABELS = {
    NAV_CLICK: "Navigation clicks",
    PROJECT_OPENED: "Projects opened",
    RESUME_DOWNLOAD: "Résumé downloads",
    EMAIL_CLICK: "Email clicks",
    GITHUB_CLICK: "GitHub clicks",
    EXTERNAL_LINK_CLICK: "External link clicks",
    CONTACT_FORM_OPENED: "Contact form opened",
    CONTACT_FORM_SUBMITTED: "Contact form submitted",
    SCROLL_DEPTH: "Scroll depth reached",
    COPY: "Copy to clipboard",
};


// ============================================================
// DEFAULT EXPORT
// ============================================================

const analyticsApi = {
    getPageAnalytics,
    getInteractionAnalytics,
    getAudienceAnalytics,
    ANALYTICS_PERIODS,
    INTERACTION_ACTION_LABELS,
};

export default analyticsApi;
