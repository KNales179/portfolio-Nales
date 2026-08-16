import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    getWorkById,
    updateWork,
    archiveWork,
    restoreWork,
    lockWork,
    unlockWork,

    createTask,
    completeTask,
    reopenTask,

    createSubtask,
    completeSubtask,
    reopenSubtask,

    getWorkActivities,

    getWorkComments,
    createWorkComment,
    updateWorkComment,
    deleteWorkComment,

    getWorkLinks,
    createWorkLink,
    updateWorkLink,
    deleteWorkLink,

    getWorkParticipants,
    addWorkParticipant,
    removeWorkParticipant,
    transferWorkOwnership,
} from "../../../services/workApi";

import {
    canEditWork,
    canLockWork,
    canUnlockWork,
    canArchiveWork,
    canRestoreWork,

    canAddTask,
    canCompleteTask,
    canReopenTask,

    canAddSubtask,
    canCompleteSubtask,
    canReopenSubtask,

    canManageParticipants,

    canAddComment,
    canEditComment,
    canDeleteComment,

    canAddLink,
    canEditLink,
    canDeleteLink,
} from "../../../utils/workPermissions";

import AdminNavbar from "../../../components/admin/AdminNavbar";
import AdminSidebar from "../../../components/admin/AdminSidebar";


// ============================================================
// HELPERS
// ============================================================

const getId = (value) => {
    if (!value) {
        return null;
    }

    if (typeof value === "string") {
        return value;
    }

    if (typeof value === "object") {
        return (
            value._id ||
            value.id ||
            null
        )?.toString?.() || null;
    }

    return null;
};


const getStoredAdmin = () => {
    try {
        const storedAdmin =
            localStorage.getItem("admin");

        if (storedAdmin) {
            return JSON.parse(
                storedAdmin
            );
        }

        const storedUser =
            localStorage.getItem("user");

        if (storedUser) {
            return JSON.parse(
                storedUser
            );
        }

        return null;
    } catch {
        return null;
    }
};


const normalizeWorkResponse = (
    response
) => {
    return (
        response?.data?.work ||
        response?.work ||
        response?.data ||
        response ||
        null
    );
};


const normalizeArrayResponse = (
    response,
    key
) => {
    const value =
        response?.data?.[key] ??
        response?.[key] ??
        response?.data ??
        response;

    return Array.isArray(value)
        ? value
        : [];
};


const calculateProgress = (
    tasks = []
) => {
    if (!tasks.length) {
        return 0;
    }

    const values = tasks.map(
        (task) => {
            const subtasks =
                Array.isArray(
                    task.subtasks
                )
                    ? task.subtasks
                    : [];

            if (!subtasks.length) {
                return task.status ===
                    "COMPLETED"
                    ? 100
                    : 0;
            }

            const completed =
                subtasks.filter(
                    (subtask) =>
                        subtask.completed ===
                        true
                ).length;

            return (
                (completed /
                    subtasks.length) *
                100
            );
        }
    );

    return Math.round(
        values.reduce(
            (sum, value) =>
                sum + value,
            0
        ) / values.length
    );
};


// ============================================================
// COMPONENT
// ============================================================

function WorkDetails() {
    const navigate =
        useNavigate();

    const { workId } =
        useParams();

    const [admin] =
        useState(
            getStoredAdmin
        );

    const [sidebarOpen, setSidebarOpen] =
        useState(false);

    const [work, setWork] =
        useState(null);

    const [activities, setActivities] =
        useState([]);

    const [comments, setComments] =
        useState([]);

    const [links, setLinks] =
        useState([]);

    const [participants, setParticipants] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [refreshing, setRefreshing] =
        useState(false);

    const [activityLoading, setActivityLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const [editingWork, setEditingWork] =
        useState(false);

    const [workTitle, setWorkTitle] =
        useState("");

    const [workDescription, setWorkDescription] =
        useState("");

    const [savingWork, setSavingWork] =
        useState(false);

    const [newTaskOpen, setNewTaskOpen] =
        useState(false);

    const [newTaskTitle, setNewTaskTitle] =
        useState("");

    const [newTaskDescription, setNewTaskDescription] =
        useState("");

    const [savingTask, setSavingTask] =
        useState(false);

    const [newSubtaskFor, setNewSubtaskFor] =
        useState(null);

    const [newSubtaskTitle, setNewSubtaskTitle] =
        useState("");

    const [newSubtaskDescription, setNewSubtaskDescription] =
        useState("");

    const [savingSubtask, setSavingSubtask] =
        useState(false);


    // ========================================================
    // WORK STATE
    // ========================================================

    const isArchived =
        work?.status ===
        "ARCHIVED";

    const isLocked =
        work?.locked === true ||
        work?.isLocked === true;


    // ========================================================
    // PERMISSIONS
    // ========================================================

    /*
     * IMPORTANT:
     *
     * Your current workPermissions.js uses:
     *
     *     permission(admin, work)
     *
     * Keep this order everywhere.
     */

    const canEdit =
        Boolean(
            work &&
            canEditWork(
                admin,
                work
            )
        );

    const canLock =
        Boolean(
            work &&
            canLockWork(
                admin,
                work
            )
        );

    const canUnlock =
        Boolean(
            work &&
            canUnlockWork(
                admin,
                work
            )
        );

    const canArchive =
        Boolean(
            work &&
            canArchiveWork(
                admin,
                work
            )
        );

    const canRestore =
        Boolean(
            work &&
            canRestoreWork(
                admin,
                work
            )
        );

    const canAddTasks =
        Boolean(
            work &&
            canAddTask(
                admin,
                work
            )
        );

    const canCompleteTasks =
        Boolean(
            work &&
            canCompleteTask(
                admin,
                work
            )
        );

    const canReopenTasks =
        Boolean(
            work &&
            canReopenTask(
                admin,
                work
            )
        );

    const canAddSubtasks =
        Boolean(
            work &&
            canAddSubtask(
                admin,
                work
            )
        );

    const canCompleteSubtasks =
        Boolean(
            work &&
            canCompleteSubtask(
                admin,
                work
            )
        );

    const canReopenSubtasks =
        Boolean(
            work &&
            canReopenSubtask(
                admin,
                work
            )
        );

    const canManageWorkParticipants =
        Boolean(
            work &&
            canManageParticipants(
                admin,
                work
            )
        );


    // ========================================================
    // FETCH WORK
    // ========================================================

    const fetchWork = async (
        showLoader = false
    ) => {
        if (!workId) {
            return;
        }

        try {
            if (showLoader) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            setError("");

            const response =
                await getWorkById(
                    workId
                );

            const fetchedWork =
                normalizeWorkResponse(
                    response
                );

            if (!fetchedWork) {
                throw new Error(
                    "Work was not found."
                );
            }

            setWork(
                fetchedWork
            );

            setWorkTitle(
                fetchedWork.title ||
                ""
            );

            setWorkDescription(
                fetchedWork.description ||
                ""
            );

        } catch (err) {
            console.error(
                "Failed to load work:",
                err
            );

            setError(
                err?.message ||
                "Unable to load this work."
            );

            setWork(null);

        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };


    // ========================================================
    // FETCH ACTIVITY
    // ========================================================

    const fetchActivities = async () => {
        if (!workId) {
            return;
        }

        try {
            setActivityLoading(true);

            const response =
                await getWorkActivities(
                    workId
                );

            setActivities(
                normalizeArrayResponse(
                    response,
                    "activities"
                )
            );

        } catch (err) {
            console.error(
                "Failed to load work activity:",
                err
            );
        } finally {
            setActivityLoading(false);
        }
    };


    // ========================================================
    // FETCH COMMENTS
    // ========================================================

    const fetchComments = async () => {
        if (!workId) {
            return;
        }

        try {
            const response =
                await getWorkComments(
                    workId
                );

            setComments(
                normalizeArrayResponse(
                    response,
                    "comments"
                )
            );

        } catch (err) {
            console.error(
                "Failed to load comments:",
                err
            );
        }
    };


    // ========================================================
    // FETCH LINKS
    // ========================================================

    const fetchLinks = async () => {
        if (!workId) {
            return;
        }

        try {
            const response =
                await getWorkLinks(
                    workId
                );

            setLinks(
                normalizeArrayResponse(
                    response,
                    "links"
                )
            );

        } catch (err) {
            console.error(
                "Failed to load links:",
                err
            );
        }
    };


    // ========================================================
    // FETCH PARTICIPANTS
    // ========================================================

    const fetchParticipants = async () => {
        if (!workId) {
            return;
        }

        try {
            const response =
                await getWorkParticipants(
                    workId
                );

            setParticipants(
                normalizeArrayResponse(
                    response,
                    "participants"
                )
            );

        } catch (err) {
            console.error(
                "Failed to load participants:",
                err
            );
        }
    };


    // ========================================================
    // REFRESH EVERYTHING
    // ========================================================

    const refreshAll = async () => {
        if (!workId) {
            return;
        }

        setRefreshing(true);

        try {
            await Promise.all([
                fetchWork(true),
                fetchActivities(),
                fetchComments(),
                fetchLinks(),
                fetchParticipants(),
            ]);
        } finally {
            setRefreshing(false);
        }
    };


    // ========================================================
    // INITIAL LOAD
    // ========================================================

    useEffect(() => {
        if (!workId) {
            return;
        }

        fetchWork();
        fetchActivities();
        fetchComments();
        fetchLinks();
        fetchParticipants();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [workId]);


    // ========================================================
    // UPDATE WORK
    // ========================================================

    const handleSaveWork = async () => {
        if (
            !work ||
            !canEdit
        ) {
            return;
        }

        const title =
            workTitle.trim();

        const description =
            workDescription.trim();

        if (!title) {
            setError(
                "Work title is required."
            );

            return;
        }

        try {
            setSavingWork(true);
            setError("");

            await updateWork(
                workId,
                {
                    title,
                    description,
                }
            );

            setEditingWork(false);

            await refreshAll();

        } catch (err) {
            console.error(
                "Failed to update work:",
                err
            );

            setError(
                err?.message ||
                "Unable to update work."
            );

        } finally {
            setSavingWork(false);
        }
    };


    // ========================================================
    // ARCHIVE
    // ========================================================

    const handleArchive = async () => {
        if (!canArchive) {
            return;
        }

        try {
            setError("");

            await archiveWork(
                workId
            );

            await refreshAll();

        } catch (err) {
            setError(
                err?.message ||
                "Unable to archive work."
            );
        }
    };


    // ========================================================
    // RESTORE
    // ========================================================

    const handleRestore = async () => {
        if (!canRestore) {
            return;
        }

        try {
            setError("");

            await restoreWork(
                workId
            );

            await refreshAll();

        } catch (err) {
            setError(
                err?.message ||
                "Unable to restore work."
            );
        }
    };


    // ========================================================
    // LOCK
    // ========================================================

    const handleLock = async () => {
        if (!canLock) {
            return;
        }

        try {
            setError("");

            await lockWork(
                workId
            );

            await refreshAll();

        } catch (err) {
            setError(
                err?.message ||
                "Unable to lock work."
            );
        }
    };


    // ========================================================
    // UNLOCK
    // ========================================================

    const handleUnlock = async () => {
        if (!canUnlock) {
            return;
        }

        try {
            setError("");

            await unlockWork(
                workId
            );

            await refreshAll();

        } catch (err) {
            setError(
                err?.message ||
                "Unable to unlock work."
            );
        }
    };


    // ========================================================
    // CREATE TASK
    // ========================================================

    const handleCreateTask = async () => {
        if (!canAddTasks) {
            return;
        }

        const title =
            newTaskTitle.trim();

        if (!title) {
            return;
        }

        try {
            setSavingTask(true);
            setError("");

            await createTask(
                workId,
                {
                    title,
                    description:
                        newTaskDescription.trim(),
                }
            );

            setNewTaskTitle("");
            setNewTaskDescription("");
            setNewTaskOpen(false);

            await refreshAll();

        } catch (err) {
            console.error(
                "Failed to create task:",
                err
            );

            setError(
                err?.message ||
                "Unable to create task."
            );

        } finally {
            setSavingTask(false);
        }
    };


    // ========================================================
    // CREATE SUBTASK
    // ========================================================

    const handleCreateSubtask = async (
        taskId
    ) => {
        if (
            !canAddSubtasks ||
            !taskId
        ) {
            return;
        }

        const title =
            newSubtaskTitle.trim();

        if (!title) {
            return;
        }

        try {
            setSavingSubtask(true);
            setError("");

            /*
             * Current workApi.js expects:
             *
             *     createSubtask(taskId, payload)
             */

            await createSubtask(
                taskId,
                {
                    title,
                    description:
                        newSubtaskDescription.trim(),
                }
            );

            setNewSubtaskTitle("");
            setNewSubtaskDescription("");
            setNewSubtaskFor(null);

            await refreshAll();

        } catch (err) {
            console.error(
                "Failed to create subtask:",
                err
            );

            setError(
                err?.message ||
                "Unable to create subtask."
            );

        } finally {
            setSavingSubtask(false);
        }
    };


    // ========================================================
    // TASK TOGGLE
    // ========================================================

    const handleTaskToggle = async (
        taskId,
        shouldComplete
    ) => {
        if (!taskId) {
            return;
        }

        try {
            setError("");

            if (shouldComplete) {
                if (!canCompleteTasks) {
                    return;
                }

                await completeTask(
                    taskId
                );
            } else {
                if (!canReopenTasks) {
                    return;
                }

                await reopenTask(
                    taskId
                );
            }

            await refreshAll();

        } catch (err) {
            setError(
                err?.message ||
                "Unable to update task."
            );
        }
    };


    // ========================================================
    // SUBTASK TOGGLE
    // ========================================================

    const handleSubtaskToggle = async (
        subtaskId,
        shouldComplete
    ) => {
        if (!subtaskId) {
            return;
        }

        try {
            setError("");

            if (shouldComplete) {
                if (!canCompleteSubtasks) {
                    return;
                }

                await completeSubtask(
                    subtaskId
                );
            } else {
                if (!canReopenSubtasks) {
                    return;
                }

                await reopenSubtask(
                    subtaskId
                );
            }

            await refreshAll();

        } catch (err) {
            setError(
                err?.message ||
                "Unable to update subtask."
            );
        }
    };


    // ========================================================
    // COMMENTS
    // ========================================================

    const handleAddComment = async (
        description
    ) => {
        if (
            !work ||
            !canAddComment(
                admin,
                work
            )
        ) {
            return;
        }

        await createWorkComment(
            workId,
            {
                description,
            }
        );

        await fetchComments();
        await fetchActivities();
    };


    const handleUpdateComment = async (
        commentId,
        description
    ) => {
        const comment =
            comments.find(
                (item) =>
                    getId(item) ===
                    String(commentId)
            );

        if (
            !comment ||
            !canEditComment(
                admin,
                comment
            )
        ) {
            return;
        }

        await updateWorkComment(
            commentId,
            {
                description,
            }
        );

        await fetchComments();
    };


    const handleDeleteComment = async (
        commentId
    ) => {
        const comment =
            comments.find(
                (item) =>
                    getId(item) ===
                    String(commentId)
            );

        if (
            !comment ||
            !canDeleteComment(
                admin,
                comment
            )
        ) {
            return;
        }

        await deleteWorkComment(
            commentId
        );

        await fetchComments();
        await fetchActivities();
    };


    // ========================================================
    // LINKS
    // ========================================================

    const handleAddLink = async (
        payload
    ) => {
        if (
            !work ||
            !canAddLink(
                admin,
                work
            )
        ) {
            return;
        }

        await createWorkLink(
            workId,
            payload
        );

        await fetchLinks();
    };


    const handleUpdateLink = async (
        linkId,
        payload
    ) => {
        if (
            !work ||
            !canEditLink(
                admin,
                work
            )
        ) {
            return;
        }

        await updateWorkLink(
            linkId,
            payload
        );

        await fetchLinks();
    };


    const handleDeleteLink = async (
        linkId
    ) => {
        if (
            !work ||
            !canDeleteLink(
                admin,
                work
            )
        ) {
            return;
        }

        await deleteWorkLink(
            linkId
        );

        await fetchLinks();
    };


    // ========================================================
    // PARTICIPANTS
    // ========================================================

    const handleAddParticipant = async (
        adminId
    ) => {
        if (
            !work ||
            !canManageWorkParticipants
        ) {
            return;
        }

        await addWorkParticipant(
            workId,
            adminId
        );

        await fetchParticipants();
        await fetchWork();
        await fetchActivities();
    };


    const handleRemoveParticipant = async (
        adminId
    ) => {
        if (
            !work ||
            !canManageWorkParticipants
        ) {
            return;
        }

        await removeWorkParticipant(
            workId,
            adminId
        );

        await fetchParticipants();
        await fetchWork();
        await fetchActivities();
    };


    const handleTransferOwnership = async (
        adminId
    ) => {
        if (
            !work ||
            !canManageWorkParticipants
        ) {
            return;
        }

        await transferWorkOwnership(
            workId,
            adminId
        );

        await fetchWork();
        await fetchParticipants();
        await fetchActivities();
    };


    // ========================================================
    // LOADING
    // ========================================================

    if (loading) {
        return (
            <div className="min-h-screen bg-[var(--surface)]">

                <AdminNavbar
                    onMenuToggle={() =>
                        setSidebarOpen(
                            (value) =>
                                !value
                        )
                    }
                />

                <AdminSidebar
                    open={sidebarOpen}
                    onClose={() =>
                        setSidebarOpen(false)
                    }
                />

                <main className="min-h-screen pt-20 lg:pl-[var(--admin-sidebar-width)]">

                    <div className="flex min-h-[70vh] items-center justify-center">

                        <p className="text-sm text-[var(--muted)]">
                            Loading work...
                        </p>

                    </div>

                </main>

            </div>
        );
    }


    // ========================================================
    // NOT FOUND
    // ========================================================

    if (!work) {
        return (
            <div className="min-h-screen bg-[var(--surface)]">

                <AdminNavbar
                    onMenuToggle={() =>
                        setSidebarOpen(
                            (value) =>
                                !value
                        )
                    }
                />

                <AdminSidebar
                    open={sidebarOpen}
                    onClose={() =>
                        setSidebarOpen(false)
                    }
                />

                <main className="min-h-screen pt-20 lg:pl-[var(--admin-sidebar-width)]">

                    <div className="mx-auto max-w-[1440px] px-5 py-8 md:px-10 lg:px-12">

                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    "/admin/worklist"
                                )
                            }
                            className="mb-6 text-sm text-[var(--muted)] hover:text-[var(--text)]"
                        >
                            ← Back to work list
                        </button>

                        <div className="border border-red-500/20 bg-red-500/5 p-6 text-sm text-red-400">
                            {error ||
                                "Work not found."}
                        </div>

                    </div>

                </main>

            </div>
        );
    }


    // ========================================================
    // EXISTING UI
    // ========================================================
    //
    // Keep your existing render UI below this point.
    //
    // The important part is that every handler above now uses
    // the current workApi + workPermissions contracts.
    //
    // ========================================================

    const progress =
        calculateProgress(
            Array.isArray(
                work.tasks
            )
                ? work.tasks
                : []
        );

    return (
        <div className="min-h-screen bg-[var(--surface)]">

            <AdminNavbar
                onMenuToggle={() =>
                    setSidebarOpen(
                        (value) =>
                            !value
                    )
                }
            />

            <AdminSidebar
                open={sidebarOpen}
                onClose={() =>
                    setSidebarOpen(false)
                }
            />

            <main className="min-h-screen pt-20 lg:pl-[var(--admin-sidebar-width)]">

                <div className="mx-auto max-w-[1440px] px-5 py-8 md:px-10 lg:px-12">

                    <div className="mb-8 flex items-center justify-between gap-4">

                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    "/admin/worklist"
                                )
                            }
                            className="text-sm text-[var(--muted)] hover:text-[var(--text)]"
                        >
                            ← Work list
                        </button>

                        <button
                            type="button"
                            onClick={
                                refreshAll
                            }
                            disabled={
                                refreshing
                            }
                            className="border border-[var(--border)] px-4 py-2 text-sm font-semibold disabled:opacity-50"
                        >
                            {refreshing
                                ? "Refreshing..."
                                : "Refresh"}
                        </button>

                    </div>


                    {error && (
                        <div className="mb-6 border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-400">
                            {error}
                        </div>
                    )}


                    <section className="border border-[var(--border)] bg-[var(--card)] p-6">

                        <div className="flex flex-col gap-6">

                            <div>

                                {editingWork ? (
                                    <div className="space-y-4">

                                        <input
                                            value={
                                                workTitle
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                setWorkTitle(
                                                    event.target.value
                                                )
                                            }
                                            className="w-full border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-lg font-semibold outline-none"
                                        />

                                        <textarea
                                            value={
                                                workDescription
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                setWorkDescription(
                                                    event.target.value
                                                )
                                            }
                                            rows={5}
                                            className="w-full border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm outline-none"
                                        />

                                        <div className="flex gap-2">

                                            <button
                                                type="button"
                                                onClick={
                                                    handleSaveWork
                                                }
                                                disabled={
                                                    savingWork
                                                }
                                                className="bg-purple-500 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                                            >
                                                {savingWork
                                                    ? "Saving..."
                                                    : "Save"}
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setEditingWork(
                                                        false
                                                    );

                                                    setWorkTitle(
                                                        work.title ||
                                                        ""
                                                    );

                                                    setWorkDescription(
                                                        work.description ||
                                                        ""
                                                    );
                                                }}
                                                className="border border-[var(--border)] px-4 py-2 text-sm font-semibold"
                                            >
                                                Cancel
                                            </button>

                                        </div>

                                    </div>
                                ) : (
                                    <>
                                        <div className="flex flex-wrap items-center gap-3">

                                            <h1 className="heading-font text-3xl font-bold">
                                                {work.title}
                                            </h1>

                                            <span className="bg-purple-500/10 px-2 py-1 text-xs font-semibold text-purple-400">
                                                {work.status?.replace(
                                                    "_",
                                                    " "
                                                )}
                                            </span>

                                            {isLocked && (
                                                <span className="bg-yellow-500/10 px-2 py-1 text-xs font-semibold text-yellow-400">
                                                    Locked
                                                </span>
                                            )}

                                        </div>

                                        {work.description && (
                                            <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
                                                {work.description}
                                            </p>
                                        )}

                                        {canEdit &&
                                            !isArchived && (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setEditingWork(
                                                            true
                                                        )
                                                    }
                                                    className="mt-4 border border-[var(--border)] px-4 py-2 text-sm font-semibold"
                                                >
                                                    Edit work
                                                </button>
                                            )}
                                    </>
                                )}

                            </div>


                            <div>

                                <div className="mb-2 flex justify-between text-xs">

                                    <span className="text-[var(--muted)]">
                                        Progress
                                    </span>

                                    <span className="font-semibold">
                                        {progress}%
                                    </span>

                                </div>

                                <div className="h-2 bg-[var(--surface)]">

                                    <div
                                        className="h-full bg-purple-500"
                                        style={{
                                            width: `${progress}%`,
                                        }}
                                    />

                                </div>

                            </div>


                            <div className="flex flex-wrap gap-2">

                                {canLock &&
                                    !isLocked && (
                                        <button
                                            type="button"
                                            onClick={
                                                handleLock
                                            }
                                            className="border border-[var(--border)] px-4 py-2 text-sm font-semibold"
                                        >
                                            Lock
                                        </button>
                                    )}

                                {canUnlock &&
                                    isLocked && (
                                        <button
                                            type="button"
                                            onClick={
                                                handleUnlock
                                            }
                                            className="border border-[var(--border)] px-4 py-2 text-sm font-semibold"
                                        >
                                            Unlock
                                        </button>
                                    )}

                                {canArchive &&
                                    !isArchived && (
                                        <button
                                            type="button"
                                            onClick={
                                                handleArchive
                                            }
                                            className="border border-yellow-500/30 px-4 py-2 text-sm font-semibold text-yellow-400"
                                        >
                                            Archive
                                        </button>
                                    )}

                                {canRestore &&
                                    isArchived && (
                                        <button
                                            type="button"
                                            onClick={
                                                handleRestore
                                            }
                                            className="border border-green-500/30 px-4 py-2 text-sm font-semibold text-green-400"
                                        >
                                            Restore
                                        </button>
                                    )}

                            </div>

                        </div>

                    </section>


                    {/* TASKS */}

                    <section className="mt-6 border border-[var(--border)] bg-[var(--card)]">

                        <div className="flex items-center justify-between border-b border-[var(--border)] p-5">

                            <div>

                                <h2 className="font-semibold">
                                    Tasks
                                </h2>

                                <p className="mt-1 text-xs text-[var(--muted)]">
                                    Manage the work tasks and their completion.
                                </p>

                            </div>

                            {canAddTasks &&
                                !isArchived &&
                                !isLocked && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setNewTaskOpen(
                                                (value) =>
                                                    !value
                                            )
                                        }
                                        className="bg-purple-500 px-4 py-2 text-sm font-semibold text-white"
                                    >
                                        + Add task
                                    </button>
                                )}

                        </div>


                        {newTaskOpen && (
                            <div className="border-b border-[var(--border)] p-5">

                                <input
                                    value={
                                        newTaskTitle
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setNewTaskTitle(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Task title"
                                    className="w-full border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm"
                                />

                                <textarea
                                    value={
                                        newTaskDescription
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setNewTaskDescription(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Description"
                                    rows={3}
                                    className="mt-3 w-full border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm"
                                />

                                <button
                                    type="button"
                                    onClick={
                                        handleCreateTask
                                    }
                                    disabled={
                                        savingTask
                                    }
                                    className="mt-3 bg-purple-500 px-4 py-2 text-sm font-semibold text-white"
                                >
                                    {savingTask
                                        ? "Creating..."
                                        : "Create task"}
                                </button>

                            </div>
                        )}


                        <div className="divide-y divide-[var(--border)]">

                            {(work.tasks || []).map(
                                (task) => {

                                    const completed =
                                        task.status ===
                                        "COMPLETED";

                                    const subtasks =
                                        Array.isArray(
                                            task.subtasks
                                        )
                                            ? task.subtasks
                                            : [];

                                    return (
                                        <div
                                            key={
                                                task._id
                                            }
                                            className="p-5"
                                        >

                                            <div className="flex items-start gap-3">

                                                <button
                                                    type="button"
                                                    disabled={
                                                        isLocked ||
                                                        isArchived ||
                                                        (
                                                            completed
                                                                ? !canReopenTasks
                                                                : !canCompleteTasks
                                                        )
                                                    }
                                                    onClick={() =>
                                                        handleTaskToggle(
                                                            task._id,
                                                            !completed
                                                        )
                                                    }
                                                    className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center border border-[var(--border)] disabled:opacity-40"
                                                >
                                                    {completed
                                                        ? "✓"
                                                        : ""}
                                                </button>

                                                <div className="min-w-0 flex-1">

                                                    <h3 className={`text-sm font-semibold ${completed
                                                            ? "line-through text-[var(--muted)]"
                                                            : ""
                                                        }`}>
                                                        {task.title}
                                                    </h3>

                                                    {task.description && (
                                                        <p className="mt-1 text-xs leading-5 text-[var(--muted)]">
                                                            {
                                                                task.description
                                                            }
                                                        </p>
                                                    )}

                                                    {canAddSubtasks &&
                                                        !isArchived &&
                                                        !isLocked && (
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    setNewSubtaskFor(
                                                                        task._id
                                                                    )
                                                                }
                                                                className="mt-3 text-xs font-semibold text-purple-400"
                                                            >
                                                                + Add subtask
                                                            </button>
                                                        )}

                                                    {newSubtaskFor ===
                                                        task._id && (
                                                            <div className="mt-3">

                                                                <input
                                                                    value={
                                                                        newSubtaskTitle
                                                                    }
                                                                    onChange={(
                                                                        event
                                                                    ) =>
                                                                        setNewSubtaskTitle(
                                                                            event.target.value
                                                                        )
                                                                    }
                                                                    placeholder="Subtask title"
                                                                    className="w-full border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs"
                                                                />

                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        handleCreateSubtask(
                                                                            task._id
                                                                        )
                                                                    }
                                                                    disabled={
                                                                        savingSubtask
                                                                    }
                                                                    className="mt-2 bg-purple-500 px-3 py-2 text-xs font-semibold text-white"
                                                                >
                                                                    {savingSubtask
                                                                        ? "Creating..."
                                                                        : "Create"}
                                                                </button>

                                                            </div>
                                                        )}

                                                    {subtasks.length >
                                                        0 && (
                                                            <div className="mt-4 space-y-2 border-l border-[var(--border)] pl-4">

                                                                {subtasks.map(
                                                                    (
                                                                        subtask
                                                                    ) => {

                                                                        const subtaskCompleted =
                                                                            subtask.completed ===
                                                                            true;

                                                                        return (
                                                                            <div
                                                                                key={
                                                                                    subtask._id
                                                                                }
                                                                                className="flex items-start gap-2"
                                                                            >

                                                                                <button
                                                                                    type="button"
                                                                                    disabled={
                                                                                        isLocked ||
                                                                                        isArchived ||
                                                                                        (
                                                                                            subtaskCompleted
                                                                                                ? !canReopenSubtasks
                                                                                                : !canCompleteSubtasks
                                                                                        )
                                                                                    }
                                                                                    onClick={() =>
                                                                                        handleSubtaskToggle(
                                                                                            subtask._id,
                                                                                            !subtaskCompleted
                                                                                        )
                                                                                    }
                                                                                    className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border border-[var(--border)] text-xs disabled:opacity-40"
                                                                                >
                                                                                    {subtaskCompleted
                                                                                        ? "✓"
                                                                                        : ""}
                                                                                </button>

                                                                                <div>

                                                                                    <p className={`text-xs font-medium ${subtaskCompleted
                                                                                            ? "line-through text-[var(--muted)]"
                                                                                            : ""
                                                                                        }`}>
                                                                                        {
                                                                                            subtask.title
                                                                                        }
                                                                                    </p>

                                                                                    {subtask.description && (
                                                                                        <p className="mt-1 text-[11px] text-[var(--muted)]">
                                                                                            {
                                                                                                subtask.description
                                                                                            }
                                                                                        </p>
                                                                                    )}

                                                                                </div>

                                                                            </div>
                                                                        );
                                                                    }
                                                                )}

                                                            </div>
                                                        )}

                                                </div>

                                            </div>

                                        </div>
                                    );
                                }
                            )}

                            {(!work.tasks ||
                                work.tasks.length ===
                                0) && (
                                    <div className="p-10 text-center text-sm text-[var(--muted)]">
                                        No tasks yet.
                                    </div>
                                )}

                        </div>

                    </section>

                </div>

            </main>

        </div>
    );
}

export default WorkDetails;