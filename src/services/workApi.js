// ============================================================
// WORK API
// ============================================================
//
// Centralized API communication for the Work System.
//
// IMPORTANT:
// - Authentication is handled through the existing admin token.
// - Authorization is enforced by the backend.
// - This file does NOT decide permissions.
// - workPermissions.js is for frontend UI capability checks.
// - The backend remains the final authority.
//
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

const apiRequest = async (
    endpoint,
    options = {}
) => {
    const token = getAuthToken();

    const headers = {
        "Content-Type": "application/json",

        ...(token
            ? {
                Authorization:
                    `Bearer ${token}`,
            }
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

    let data = null;

    try {
        data = await response.json();
    } catch {
        data = null;
    }

    if (!response.ok) {
        const error = new Error(
            data?.message ||
            "Work request failed."
        );

        error.status =
            response.status;

        error.code =
            data?.code ||
            data?.error?.code ||
            null;

        error.data =
            data;

        throw error;
    }

    return data;
};


// ============================================================
// WORKS
// ============================================================

// GET /api/work
//
// Returns active works.

export const getWorks = async ({
    includeArchived = false,
} = {}) => {
    if (includeArchived) {
        return apiRequest(
            "/api/work/archived"
        );
    }

    return apiRequest(
        "/api/work"
    );
};


// GET /api/work/:workId

export const getWorkById = async (
    workId
) => {
    if (!workId) {
        throw new Error(
            "Work ID is required."
        );
    }

    return apiRequest(
        `/api/work/${encodeURIComponent(
            workId
        )}`
    );
};


// POST /api/work

export const createWork = async (
    payload
) => {
    return apiRequest(
        "/api/work",
        {
            method: "POST",

            body: JSON.stringify(
                payload
            ),
        }
    );
};


// PATCH /api/work/:workId

export const updateWork = async (
    workId,
    payload
) => {
    if (!workId) {
        throw new Error(
            "Work ID is required."
        );
    }

    return apiRequest(
        `/api/work/${encodeURIComponent(
            workId
        )}`,
        {
            method: "PATCH",

            body: JSON.stringify(
                payload
            ),
        }
    );
};


// ============================================================
// WORK LIFECYCLE
// ============================================================


// POST /api/work/:workId/archive

export const archiveWork = async (
    workId
) => {
    return apiRequest(
        `/api/work/${encodeURIComponent(
            workId
        )}/archive`,
        {
            method: "POST",
        }
    );
};


// POST /api/work/:workId/restore

export const restoreWork = async (
    workId
) => {
    return apiRequest(
        `/api/work/${encodeURIComponent(
            workId
        )}/restore`,
        {
            method: "POST",
        }
    );
};


// ============================================================
// WORK PARTICIPANTS
// ============================================================


// POST /api/work/:workId/participants

export const addWorkParticipant = async (
    workId,
    adminId
) => {
    return apiRequest(
        `/api/work/${encodeURIComponent(
            workId
        )}/participants`,
        {
            method: "POST",

            body: JSON.stringify({
                adminId,
            }),
        }
    );
};


// DELETE /api/work/:workId/participants/:adminId

export const removeWorkParticipant = async (
    workId,
    adminId
) => {
    return apiRequest(
        `/api/work/${encodeURIComponent(
            workId
        )}/participants/${encodeURIComponent(
            adminId
        )}`,
        {
            method: "DELETE",
        }
    );
};


// POST /api/work/:workId/transfer-ownership

export const transferWorkOwnership = async (
    workId,
    adminId
) => {
    return apiRequest(
        `/api/work/${encodeURIComponent(
            workId
        )}/transfer-ownership`,
        {
            method: "POST",

            body: JSON.stringify({
                adminId,
            }),
        }
    );
};


// ============================================================
// WORK ORDER
// ============================================================


// PATCH /api/work/reorder
//
// Body:
//
// {
//     orderedIds: []
// }

export const reorderWorks = async (
    orderedIds
) => {
    return apiRequest(
        "/api/work/reorder",
        {
            method: "PATCH",

            body: JSON.stringify({
                orderedIds,
            }),
        }
    );
};


// ============================================================
// TASKS
// ============================================================


// POST /api/work/:workId/tasks

export const createTask = async (
    workId,
    payload
) => {
    return apiRequest(
        `/api/work/${encodeURIComponent(
            workId
        )}/tasks`,
        {
            method: "POST",

            body: JSON.stringify(
                payload
            ),
        }
    );
};


// PATCH /api/work/:workId/tasks/:taskId

export const updateTask = async (
    workId,
    taskId,
    payload
) => {
    return apiRequest(
        `/api/work/${encodeURIComponent(
            workId
        )}/tasks/${encodeURIComponent(
            taskId
        )}`,
        {
            method: "PATCH",

            body: JSON.stringify(
                payload
            ),
        }
    );
};


// POST /api/work/:workId/tasks/:taskId/complete

export const completeTask = async (
    workId,
    taskId
) => {
    return apiRequest(
        `/api/work/${encodeURIComponent(
            workId
        )}/tasks/${encodeURIComponent(
            taskId
        )}/complete`,
        {
            method: "POST",
        }
    );
};


// POST /api/work/:workId/tasks/:taskId/reopen

export const reopenTask = async (
    workId,
    taskId
) => {
    return apiRequest(
        `/api/work/${encodeURIComponent(
            workId
        )}/tasks/${encodeURIComponent(
            taskId
        )}/reopen`,
        {
            method: "POST",
        }
    );
};


// POST /api/work/:workId/tasks/:taskId/archive

export const archiveTask = async (
    workId,
    taskId
) => {
    return apiRequest(
        `/api/work/${encodeURIComponent(
            workId
        )}/tasks/${encodeURIComponent(
            taskId
        )}/archive`,
        {
            method: "POST",
        }
    );
};


// ============================================================
// TASK ORDER
// ============================================================


// PATCH /api/work/:workId/tasks/reorder
//
// Body:
//
// {
//     orderedIds: []
// }

export const reorderTasks = async (
    workId,
    orderedIds
) => {
    return apiRequest(
        `/api/work/${encodeURIComponent(
            workId
        )}/tasks/reorder`,
        {
            method: "PATCH",

            body: JSON.stringify({
                orderedIds,
            }),
        }
    );
};


// ============================================================
// SUBTASKS
// ============================================================


// POST /api/work/:workId/tasks/:taskId/subtasks

export const createSubtask = async (
    workId,
    taskId,
    payload
) => {
    return apiRequest(
        `/api/work/${encodeURIComponent(
            workId
        )}/tasks/${encodeURIComponent(
            taskId
        )}/subtasks`,
        {
            method: "POST",

            body: JSON.stringify(
                payload
            ),
        }
    );
};


// PATCH /api/work/:workId/tasks/:taskId/subtasks/:subtaskId

export const updateSubtask = async (
    workId,
    taskId,
    subtaskId,
    payload
) => {
    return apiRequest(
        `/api/work/${encodeURIComponent(
            workId
        )}/tasks/${encodeURIComponent(
            taskId
        )}/subtasks/${encodeURIComponent(
            subtaskId
        )}`,
        {
            method: "PATCH",

            body: JSON.stringify(
                payload
            ),
        }
    );
};


// POST /api/work/:workId/tasks/:taskId/subtasks/:subtaskId/complete

export const completeSubtask = async (
    workId,
    taskId,
    subtaskId
) => {
    return apiRequest(
        `/api/work/${encodeURIComponent(
            workId
        )}/tasks/${encodeURIComponent(
            taskId
        )}/subtasks/${encodeURIComponent(
            subtaskId
        )}/complete`,
        {
            method: "POST",
        }
    );
};


// POST /api/work/:workId/tasks/:taskId/subtasks/:subtaskId/reopen

export const reopenSubtask = async (
    workId,
    taskId,
    subtaskId
) => {
    return apiRequest(
        `/api/work/${encodeURIComponent(
            workId
        )}/tasks/${encodeURIComponent(
            taskId
        )}/subtasks/${encodeURIComponent(
            subtaskId
        )}/reopen`,
        {
            method: "POST",
        }
    );
};


// POST /api/work/:workId/tasks/:taskId/subtasks/:subtaskId/archive

export const archiveSubtask = async (
    workId,
    taskId,
    subtaskId
) => {
    return apiRequest(
        `/api/work/${encodeURIComponent(
            workId
        )}/tasks/${encodeURIComponent(
            taskId
        )}/subtasks/${encodeURIComponent(
            subtaskId
        )}/archive`,
        {
            method: "POST",
        }
    );
};


// ============================================================
// SUBTASK ORDER
// ============================================================


// PATCH /api/work/:workId/tasks/:taskId/subtasks/reorder
//
// Body:
//
// {
//     orderedIds: []
// }

export const reorderSubtasks = async (
    workId,
    taskId,
    orderedIds
) => {
    return apiRequest(
        `/api/work/${encodeURIComponent(
            workId
        )}/tasks/${encodeURIComponent(
            taskId
        )}/subtasks/reorder`,
        {
            method: "PATCH",

            body: JSON.stringify({
                orderedIds,
            }),
        }
    );
};


// ============================================================
// WORK ACTIVITY
// ============================================================


// GET /api/work/:workId/activity

export const getWorkActivities = async (
    workId
) => {
    return apiRequest(
        `/api/work/${encodeURIComponent(
            workId
        )}/activity`
    );
};


// ============================================================
// DEFAULT EXPORT
// ============================================================

const workApi = {
    getWorks,
    getWorkById,

    createWork,
    updateWork,

    archiveWork,
    restoreWork,

    reorderWorks,

    addWorkParticipant,
    removeWorkParticipant,
    transferWorkOwnership,

    createTask,
    updateTask,
    completeTask,
    reopenTask,
    archiveTask,
    reorderTasks,

    createSubtask,
    updateSubtask,
    completeSubtask,
    reopenSubtask,
    archiveSubtask,
    reorderSubtasks,

    getWorkActivities,
};

export default workApi;