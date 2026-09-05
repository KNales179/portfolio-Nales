// ============================================================
// WORK API
// ============================================================
//
// Centralized API communication for the Work System.
//
// IMPORTANT:
// - Authentication is handled through the existing admin token.
// - Authorization is enforced by the backend.
// - This file should NOT decide whether an admin is actually
//   allowed to perform a sensitive operation.
// - workPermissions.js is for frontend UI capability checks.
// - The backend remains the final authority.
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
            data?.error?.code ||
            data?.code ||
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

export const getWorks = async ({
    includeArchived = false,
} = {}) => {
    const query =
        includeArchived
            ? "?includeArchived=true"
            : "";

    return apiRequest(
        `/api/work${query}`
    );
};


export const getWorkById = async (
    workId
) => {
    return apiRequest(
        `/api/work/${encodeURIComponent(
            workId
        )}`
    );
};


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


export const updateWork = async (
    workId,
    payload
) => {
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
// WORK STATUS
// ============================================================

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


export const lockWork = async (
    workId
) => {
    return apiRequest(
        `/api/work/${encodeURIComponent(
            workId
        )}/lock`,
        {
            method: "POST",
        }
    );
};


export const unlockWork = async (
    workId
) => {
    return apiRequest(
        `/api/work/${encodeURIComponent(
            workId
        )}/unlock`,
        {
            method: "POST",
        }
    );
};


// ============================================================
// WORK ORDER
// ============================================================

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
// PARTICIPANTS
// ============================================================

export const getWorkParticipants = async (
    workId
) => {
    return apiRequest(
        `/api/work/${encodeURIComponent(
            workId
        )}/participants`
    );
};


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


export const transferWorkOwnership = async (
    workId,
    adminId
) => {
    return apiRequest(
        `/api/work/${encodeURIComponent(
            workId
        )}/ownership`,
        {
            method: "PATCH",

            body: JSON.stringify({
                adminId,
            }),
        }
    );
};


// ============================================================
// TASKS
// ============================================================

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


export const updateTask = async (
    taskId,
    payload
) => {
    return apiRequest(
        `/api/work/tasks/${encodeURIComponent(
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


export const completeTask = async (
    taskId
) => {
    return apiRequest(
        `/api/work/tasks/${encodeURIComponent(
            taskId
        )}/complete`,
        {
            method: "POST",
        }
    );
};


export const reopenTask = async (
    taskId
) => {
    return apiRequest(
        `/api/work/tasks/${encodeURIComponent(
            taskId
        )}/reopen`,
        {
            method: "POST",
        }
    );
};


export const archiveTask = async (
    taskId
) => {
    return apiRequest(
        `/api/work/tasks/${encodeURIComponent(
            taskId
        )}/archive`,
        {
            method: "POST",
        }
    );
};


export const restoreTask = async (
    taskId
) => {
    return apiRequest(
        `/api/work/tasks/${encodeURIComponent(
            taskId
        )}/restore`,
        {
            method: "POST",
        }
    );
};


// ============================================================
// TASK ORDER
// ============================================================

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

export const createSubtask = async (
    taskId,
    payload
) => {
    return apiRequest(
        `/api/work/tasks/${encodeURIComponent(
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


export const updateSubtask = async (
    subtaskId,
    payload
) => {
    return apiRequest(
        `/api/work/subtasks/${encodeURIComponent(
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


export const completeSubtask = async (
    subtaskId
) => {
    return apiRequest(
        `/api/work/subtasks/${encodeURIComponent(
            subtaskId
        )}/complete`,
        {
            method: "POST",
        }
    );
};


export const reopenSubtask = async (
    subtaskId
) => {
    return apiRequest(
        `/api/work/subtasks/${encodeURIComponent(
            subtaskId
        )}/reopen`,
        {
            method: "POST",
        }
    );
};


export const archiveSubtask = async (
    subtaskId
) => {
    return apiRequest(
        `/api/work/subtasks/${encodeURIComponent(
            subtaskId
        )}/archive`,
        {
            method: "POST",
        }
    );
};


export const restoreSubtask = async (
    subtaskId
) => {
    return apiRequest(
        `/api/work/subtasks/${encodeURIComponent(
            subtaskId
        )}/restore`,
        {
            method: "POST",
        }
    );
};


// ============================================================
// SUBTASK ORDER
// ============================================================

export const reorderSubtasks = async (
    taskId,
    orderedIds
) => {
    return apiRequest(
        `/api/work/tasks/${encodeURIComponent(
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
// ACTIVITIES
// ============================================================

export const getWorkActivities = async (
    workId
) => {
    return apiRequest(
        `/api/work/${encodeURIComponent(
            workId
        )}/activities`
    );
};


// ============================================================
// COMMENTS
// ============================================================

export const getWorkComments = async (
    workId
) => {
    return apiRequest(
        `/api/work/${encodeURIComponent(
            workId
        )}/comments`
    );
};


export const createWorkComment = async (
    workId,
    payload
) => {
    return apiRequest(
        `/api/work/${encodeURIComponent(
            workId
        )}/comments`,
        {
            method: "POST",

            body: JSON.stringify(
                payload
            ),
        }
    );
};


export const updateWorkComment = async (
    commentId,
    payload
) => {
    return apiRequest(
        `/api/work/comments/${encodeURIComponent(
            commentId
        )}`,
        {
            method: "PATCH",

            body: JSON.stringify(
                payload
            ),
        }
    );
};


export const deleteWorkComment = async (
    commentId
) => {
    return apiRequest(
        `/api/work/comments/${encodeURIComponent(
            commentId
        )}`,
        {
            method: "DELETE",
        }
    );
};


// ============================================================
// LINKS
// ============================================================

export const getWorkLinks = async (
    workId
) => {
    return apiRequest(
        `/api/work/${encodeURIComponent(
            workId
        )}/links`
    );
};


export const createWorkLink = async (
    workId,
    payload
) => {
    return apiRequest(
        `/api/work/${encodeURIComponent(
            workId
        )}/links`,
        {
            method: "POST",

            body: JSON.stringify(
                payload
            ),
        }
    );
};


export const updateWorkLink = async (
    linkId,
    payload
) => {
    return apiRequest(
        `/api/work/links/${encodeURIComponent(
            linkId
        )}`,
        {
            method: "PATCH",

            body: JSON.stringify(
                payload
            ),
        }
    );
};


export const deleteWorkLink = async (
    linkId
) => {
    return apiRequest(
        `/api/work/links/${encodeURIComponent(
            linkId
        )}`,
        {
            method: "DELETE",
        }
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

    lockWork,
    unlockWork,

    reorderWorks,

    getWorkParticipants,
    addWorkParticipant,
    removeWorkParticipant,
    transferWorkOwnership,

    createTask,
    updateTask,
    completeTask,
    reopenTask,
    archiveTask,
    restoreTask,
    reorderTasks,

    createSubtask,
    updateSubtask,
    completeSubtask,
    reopenSubtask,
    archiveSubtask,
    restoreSubtask,
    reorderSubtasks,

    getWorkActivities,

    getWorkComments,
    createWorkComment,
    updateWorkComment,
    deleteWorkComment,

    getWorkLinks,
    createWorkLink,
    updateWorkLink,
    deleteWorkLink,
};

export default workApi;