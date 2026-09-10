// ============================================================
// MESSAGES API
// ============================================================
//
// Admin-side reads/writes for the "Messages" inbox — the
// contact-form submissions saved by the backend. Same fetch
// conventions as the other admin service modules.
// ============================================================

const API_BASE_URL =
    import.meta.env.VITE_API_URL ||
    "https://portfolio-nales-backend.onrender.com";


const getToken = () =>
    localStorage.getItem("token") ||
    localStorage.getItem("authToken");


const request = async (path, options = {}) => {
    const token = getToken();

    const response = await fetch(
        `${API_BASE_URL}/api/contact${path}`,
        {
            ...options,
            headers: {
                ...(options.body
                    ? { "Content-Type": "application/json" }
                    : {}),
                ...(token
                    ? { Authorization: `Bearer ${token}` }
                    : {}),
                ...(options.headers || {}),
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
        const error = new Error(
            data?.message || "Request failed."
        );
        error.status = response.status;
        throw error;
    }

    return data?.data ?? data;
};


export const fetchMessages = async ({
    box = "inbox",
    status = "all",
    q = "",
    page = 1,
    limit = 20,
} = {}) => {
    const params = new URLSearchParams();
    params.set("box", box);
    params.set("page", String(page));
    params.set("limit", String(limit));
    if (status && status !== "all") {
        params.set("status", status);
    }
    if (q) {
        params.set("q", q);
    }

    return request(`/messages?${params.toString()}`);
};


export const fetchUnreadCount = async () => {
    const data = await request("/messages/unread-count");
    return data?.count ?? 0;
};


export const setMessageStatus = (id, status) =>
    request(`/messages/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
    });


export const archiveMessage = (id) =>
    request(`/messages/${id}/archive`, { method: "POST" });


export const restoreMessage = (id) =>
    request(`/messages/${id}/restore`, { method: "POST" });


export const deleteMessage = (id) =>
    request(`/messages/${id}`, { method: "DELETE" });
