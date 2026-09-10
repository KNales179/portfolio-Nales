// ============================================================
// AUDIT LOG API
// ============================================================
//
// Admin-side reads for the "Audit Logs" page. SUPER_ADMIN only
// (the backend enforces it). Same fetch conventions as the other
// admin service modules.
// ============================================================

const API_BASE_URL =
    import.meta.env.VITE_API_URL ||
    "https://portfolio-nales-backend.onrender.com";


const getToken = () =>
    localStorage.getItem("token") ||
    localStorage.getItem("authToken");


// The content actions / resources the log records. Used for the
// filter dropdowns.
export const AUDIT_ACTIONS = ["CREATE", "UPDATE", "DELETE"];

export const AUDIT_RESOURCES = [
    { value: "PROJECT", label: "Projects" },
    { value: "CERTIFICATE", label: "Certificates" },
    { value: "SKILL", label: "Skills" },
    { value: "JOURNEY", label: "Journey" },
    { value: "AWARD", label: "Awards" },
    { value: "HOBBY", label: "Hobbies" },
    { value: "CONTACT", label: "Contact links" },
    { value: "PROFILE", label: "About / strengths" },
    { value: "HERO", label: "Hero" },
];


export const fetchAuditLogs = async ({
    page = 1,
    limit = 25,
    action = "",
    resource = "",
    adminId = "",
    q = "",
    scope = "content",
} = {}) => {
    const params = new URLSearchParams();

    params.set("page", String(page));
    params.set("limit", String(limit));

    if (action) params.set("action", action);
    if (resource) params.set("resource", resource);
    if (adminId) params.set("adminId", adminId);
    if (q) params.set("q", q);
    if (scope) params.set("scope", scope);

    const token = getToken();

    const response = await fetch(
        `${API_BASE_URL}/api/admin/audit-logs?${params.toString()}`,
        {
            headers: token
                ? { Authorization: `Bearer ${token}` }
                : {},
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
            data?.message || "Unable to load audit logs."
        );
        error.status = response.status;
        throw error;
    }

    return (
        data?.data || {
            logs: [],
            total: 0,
            page: 1,
            pages: 1,
            admins: [],
        }
    );
};
