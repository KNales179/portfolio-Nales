// ============================================================
// CONTENT API
// ============================================================
//
// Public reads + authenticated writes for editable portfolio
// content. Same fetch conventions as workApi / analyticsApi.
// ============================================================

const API_BASE_URL =
    import.meta.env.VITE_API_URL ||
    "https://portfolio-nales-backend.onrender.com";


const getToken = () =>
    localStorage.getItem("token") ||
    localStorage.getItem("authToken");


const request = async (endpoint, options = {}) => {
    const { auth, body, ...rest } = options;

    const headers = {
        "Content-Type": "application/json",
        ...(auth && getToken()
            ? { Authorization: `Bearer ${getToken()}` }
            : {}),
        ...(options.headers || {}),
    };

    const response = await fetch(
        `${API_BASE_URL}${endpoint}`,
        {
            ...rest,
            headers,
            ...(body
                ? { body: JSON.stringify(body) }
                : {}),
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
            data?.message || "Content request failed."
        );
        error.status = response.status;
        error.data = data;
        throw error;
    }

    return data;
};


// ============================================================
// PROJECTS
// ============================================================

export const fetchProjects = async () => {
    const data = await request("/api/projects");
    return data?.data?.projects || [];
};


export const fetchAllProjects = async () => {
    const data = await request("/api/projects/all", {
        auth: true,
    });
    return data?.data?.projects || [];
};


export const patchProject = async (id, patch) => {
    const data = await request(
        `/api/projects/${encodeURIComponent(id)}`,
        { method: "PATCH", auth: true, body: patch }
    );
    return data?.data?.project || null;
};


export const createProjectApi = async (payload) => {
    const data = await request("/api/projects", {
        method: "POST",
        auth: true,
        body: payload,
    });
    return data?.data?.project || null;
};


export const archiveProjectApi = async (id) => {
    const data = await request(
        `/api/projects/${encodeURIComponent(id)}/archive`,
        { method: "POST", auth: true }
    );
    return data?.data?.project || null;
};


export const restoreProjectApi = async (id) => {
    const data = await request(
        `/api/projects/${encodeURIComponent(id)}/restore`,
        { method: "POST", auth: true }
    );
    return data?.data?.project || null;
};


export const reorderProjectsApi = async (orderedIds) => {
    return request("/api/projects/reorder", {
        method: "PATCH",
        auth: true,
        body: { orderedIds },
    });
};


// ============================================================
// PORTFOLIO CONTENT  (skills, journey, awards, hobbies,
// certificates, contact links, strengths, section text)
// ============================================================

export const fetchAllContent = async () => {
    const data = await request("/api/content");
    return data?.data || {};
};


export const fetchContentAll = async (type) => {
    const data = await request(
        `/api/content/${type}/all`,
        { auth: true }
    );
    return data?.data?.items || [];
};


export const patchContentItem = async (type, id, patch) => {
    const data = await request(
        `/api/content/${type}/${encodeURIComponent(id)}`,
        { method: "PATCH", auth: true, body: patch }
    );
    return data?.data?.item || null;
};


export const createContentItem = async (type, payload) => {
    const data = await request(`/api/content/${type}`, {
        method: "POST",
        auth: true,
        body: payload,
    });
    return data?.data?.item || null;
};


export const archiveContentItem = async (type, id) => {
    const data = await request(
        `/api/content/${type}/${encodeURIComponent(
            id
        )}/archive`,
        { method: "POST", auth: true }
    );
    return data?.data?.item || null;
};


export const restoreContentItem = async (type, id) => {
    const data = await request(
        `/api/content/${type}/${encodeURIComponent(
            id
        )}/restore`,
        { method: "POST", auth: true }
    );
    return data?.data?.item || null;
};


export const reorderContentItems = async (type, orderedIds) => {
    return request(`/api/content/${type}/reorder`, {
        method: "PATCH",
        auth: true,
        body: { orderedIds },
    });
};


export const patchSiteText = async (key, patch) => {
    const data = await request(
        `/api/content/text/${encodeURIComponent(key)}`,
        { method: "PATCH", auth: true, body: patch }
    );
    return data?.data?.values || {};
};


// ============================================================
// FILE UPLOADS  (multipart — bypasses the JSON `request` helper)
// ============================================================

const uploadFile = async (endpoint, formData, errorLabel) => {
    const token = getToken();

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: token
            ? { Authorization: `Bearer ${token}` }
            : {},
        body: formData,
    });

    let data;
    try {
        data = await response.json();
    } catch {
        data = null;
    }

    if (!response.ok) {
        const error = new Error(data?.message || errorLabel);
        error.status = response.status;
        error.data = data;
        throw error;
    }

    return data?.data || {};
};


export const uploadResume = async (file) => {
    const form = new FormData();
    form.append("resume", file);

    const data = await uploadFile(
        "/api/content/resume",
        form,
        "Résumé upload failed."
    );

    return data.resumeUrl || "";
};


export const uploadImageAsset = async (file, type = "OTHER") => {
    const form = new FormData();
    form.append("image", file);
    form.append("type", type);

    const data = await uploadFile(
        "/api/upload",
        form,
        "Image upload failed."
    );

    return data.secureUrl || data.url || "";
};

