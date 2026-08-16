import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    ArrowLeft,
    Archive,
    ArchiveRestore,
    ChevronDown,
    ChevronRight,
    Edit3,
    ExternalLink,
    Lock,
    LockOpen,
    MessageSquare,
    Plus,
    RefreshCw,
    ShieldCheck,
    Users,
} from "lucide-react";

import AdminNavbar from "../../../components/admin/AdminNavbar";
import AdminSidebar from "../../../components/admin/AdminSidebar";

import {
    getWorkById,
    updateWork,
    archiveWork,
    restoreWork,
    lockWork,
    unlockWork,
    createTask,
    updateTask,
    archiveTask,
    restoreTask,
    createSubtask,
    updateSubtask,
    archiveSubtask,
    restoreSubtask,
    completeTask,
    reopenTask,
    completeSubtask,
    reopenSubtask,
    getWorkActivities,
} from "../../../services/workApi";

import {
    canEditWork,
    canManageParticipants,
    canManageWork,
    canModifyWorkStructure,
} from "../../../utils/workPermissions";


// ============================================================
// HELPERS
// ============================================================

const getAdminId = () => {
    try {
        const admin =
            JSON.parse(
                localStorage.getItem("admin") ||
                localStorage.getItem("user") ||
                "null"
            );

        return (
            admin?._id ||
            admin?.id ||
            null
        );
    } catch {
        return null;
    }
};


const getAuthAdmin = () => {
    try {
        return (
            JSON.parse(
                localStorage.getItem("admin") ||
                localStorage.getItem("user") ||
                "null"
            ) || null
        );
    } catch {
        return null;
    }
};


const getProgress = (work) => {
    if (!work) {
        return 0;
    }

    const tasks =
        Array.isArray(work.tasks)
            ? work.tasks
            : [];

    if (!tasks.length) {
        return 0;
    }

    const completed =
        tasks.filter(
            (task) =>
                task.status === "COMPLETED"
        ).length;

    return Math.round(
        (completed / tasks.length) * 100
    );
};


const getTaskProgress = (task) => {
    if (!task) {
        return 0;
    }

    const subtasks =
        Array.isArray(task.subtasks)
            ? task.subtasks
            : [];

    if (!subtasks.length) {
        return task.status === "COMPLETED"
            ? 100
            : 0;
    }

    const completed =
        subtasks.filter(
            (subtask) =>
                subtask.completed
        ).length;

    return Math.round(
        (completed / subtasks.length) * 100
    );
};


const formatDate = (value) => {
    if (!value) {
        return "Unknown";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "Unknown";
    }

    return date.toLocaleDateString(
        "en-US",
        {
            month: "long",
            day: "numeric",
            year: "numeric",
        }
    );
};


const getStatusLabel = (status) => {
    switch (status) {
        case "PLANNED":
            return "Planned";

        case "IN_PROGRESS":
            return "In progress";

        case "COMPLETED":
            return "Completed";

        case "ARCHIVED":
            return "Archived";

        case "PENDING":
            return "Pending";

        case "BLOCKED":
            return "Blocked";

        default:
            return status || "Unknown";
    }
};


// ============================================================
// COMPONENT
// ============================================================

function WorkDetails() {
    const navigate = useNavigate();
    const { workId } = useParams();

    const admin =
        getAuthAdmin();

    const adminId =
        getAdminId();

    const [sidebarOpen, setSidebarOpen] =
        useState(false);

    const [work, setWork] =
        useState(null);

    const [activities, setActivities] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [refreshing, setRefreshing] =
        useState(false);

    const [error, setError] =
        useState("");

    const [expandedTasks, setExpandedTasks] =
        useState({});

    const [showActivities, setShowActivities] =
        useState(true);

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
    // PERMISSIONS
    // ========================================================

    const isCreator =
        work?.createdBy &&
        (
            work.createdBy?._id ||
            work.createdBy
        ) === adminId;

    const isSuperAdmin =
        admin?.role === "SUPER_ADMIN";


    const canEdit =
        work
            ? canEditWork(
                work,
                admin
            )
            : false;


    const canManage =
        work
            ? canManageWork(
                work,
                admin
            )
            : false;


    const canManageStructure =
        work
            ? canModifyWorkStructure(
                work,
                admin
            )
            : false;


    const canParticipants =
        work
            ? canManageParticipants(
                work,
                admin
            )
            : false;


    const isArchived =
        work?.status === "ARCHIVED";


    const isLocked =
        Boolean(work?.locked);


    // ========================================================
    // FETCH
    // ========================================================

    const fetchWork = async (
        showRefreshLoader = false
    ) => {
        try {
            if (showRefreshLoader) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            setError("");

            const response =
                await getWorkById(
                    workId
                );

            const data =
                response?.data?.work ||
                response?.data ||
                response;

            setWork(data);

            setWorkTitle(
                data?.title || ""
            );

            setWorkDescription(
                data?.description || ""
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

        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };


    const fetchActivities = async () => {
        try {
            const response =
                await getWorkActivities(
                    workId
                );

            setActivities(
                response?.data?.activities ||
                response?.data ||
                response ||
                []
            );
        } catch (err) {
            console.error(
                "Failed to load work activity:",
                err
            );
        }
    };


    const refreshAll = async () => {
        setRefreshing(true);

        await Promise.all([
            fetchWork(true),
            fetchActivities(),
        ]);

        setRefreshing(false);
    };


    useEffect(() => {
        if (!workId) {
            return;
        }

        fetchWork();
        fetchActivities();
    }, [workId]);


    // ========================================================
    // TASK EXPANSION
    // ========================================================

    const toggleTask = (taskId) => {
        setExpandedTasks(
            (current) => ({
                ...current,
                [taskId]:
                    !current[taskId],
            })
        );
    };


    // ========================================================
    // WORK EDIT
    // ========================================================

    const handleSaveWork = async () => {
        if (!work) {
            return;
        }

        if (!workTitle.trim()) {
            return;
        }

        try {
            setSavingWork(true);

            await updateWork(
                workId,
                {
                    title:
                        workTitle.trim(),

                    description:
                        workDescription.trim(),
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
    // ARCHIVE / RESTORE
    // ========================================================

    const handleArchive = async () => {
        try {
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


    const handleRestore = async () => {
        try {
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
    // LOCK / UNLOCK
    // ========================================================

    const handleLock = async () => {
        try {
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


    const handleUnlock = async () => {
        try {
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
        if (!newTaskTitle.trim()) {
            return;
        }

        try {
            setSavingTask(true);

            await createTask(
                workId,
                {
                    title:
                        newTaskTitle.trim(),

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
        if (!newSubtaskTitle.trim()) {
            return;
        }

        try {
            setSavingSubtask(true);

            await createSubtask(
                taskId,
                {
                    title:
                        newSubtaskTitle.trim(),

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
    // TASK COMPLETION
    // ========================================================

    const handleTaskToggle = async (
        task
    ) => {
        try {
            if (
                task.status ===
                "COMPLETED"
            ) {
                await reopenTask(
                    task._id
                );
            } else {
                await completeTask(
                    task._id
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
    // SUBTASK COMPLETION
    // ========================================================

    const handleSubtaskToggle = async (
        subtask
    ) => {
        try {
            if (subtask.completed) {
                await reopenSubtask(
                    subtask._id
                );
            } else {
                await completeSubtask(
                    subtask._id
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
    // RENDER
    // ========================================================

    if (loading) {
        return (
            <div className="min-h-screen bg-[var(--surface)]">

                <AdminNavbar
                    onMenuToggle={() =>
                        setSidebarOpen(
                            (current) =>
                                !current
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

                        <div className="flex items-center gap-3 text-sm text-[var(--muted)]">

                            <RefreshCw
                                size={18}
                                className="animate-spin"
                            />

                            Loading work...

                        </div>

                    </div>

                </main>

            </div>
        );
    }


    if (!work) {
        return (
            <div className="min-h-screen bg-[var(--surface)]">

                <AdminNavbar
                    onMenuToggle={() =>
                        setSidebarOpen(
                            (current) =>
                                !current
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
                                    -1
                                )
                            }
                            className="mb-8 flex items-center gap-2 text-sm text-[var(--muted)] hover:text-[var(--text)]"
                        >
                            <ArrowLeft
                                size={16}
                            />

                            Back

                        </button>

                        <div className="border border-red-500/20 bg-red-500/5 p-6">

                            {error ||
                                "Work not found."}

                        </div>

                    </div>

                </main>

            </div>
        );
    }


    const progress =
        getProgress(work);


    return (
        <div className="min-h-screen bg-[var(--surface)]">

            <AdminNavbar
                onMenuToggle={() =>
                    setSidebarOpen(
                        (current) =>
                            !current
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


                    {/* ==================================================
                        TOP BAR
                    ================================================== */}

                    <div className="mb-8 flex flex-wrap items-center justify-between gap-3">

                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    -1
                                )
                            }
                            className="flex items-center gap-2 text-sm text-[var(--muted)] transition hover:text-[var(--text)]"
                        >
                            <ArrowLeft
                                size={16}
                            />

                            Back to work list

                        </button>


                        <button
                            type="button"
                            onClick={refreshAll}
                            disabled={refreshing}
                            className="flex items-center gap-2 border border-[var(--border)] px-4 py-2.5 text-sm font-semibold transition hover:bg-[var(--card)] disabled:opacity-50"
                        >

                            <RefreshCw
                                size={16}
                                className={
                                    refreshing
                                        ? "animate-spin"
                                        : ""
                                }
                            />

                            Refresh

                        </button>

                    </div>


                    {/* ==================================================
                        HEADER
                    ================================================== */}

                    <section className="border border-[var(--border)] bg-[var(--card)]">

                        <div className="p-6 md:p-8">

                            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">

                                <div className="min-w-0 flex-1">

                                    <div className="mb-3 flex flex-wrap items-center gap-2">

                                        <span className="bg-purple-500/10 px-2.5 py-1 text-xs font-semibold text-purple-400">
                                            {getStatusLabel(
                                                work.status
                                            )}
                                        </span>

                                        {isLocked && (
                                            <span className="flex items-center gap-1 bg-yellow-500/10 px-2.5 py-1 text-xs font-semibold text-yellow-400">
                                                <Lock
                                                    size={12}
                                                />
                                                Locked
                                            </span>
                                        )}

                                    </div>


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
                                                className="w-full border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-2xl font-bold outline-none focus:border-purple-400"
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
                                                rows={4}
                                                className="w-full resize-y border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm leading-6 outline-none focus:border-purple-400"
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
                                                    className="bg-purple-500 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
                                                >
                                                    Save
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setEditingWork(
                                                            false
                                                        );

                                                        setWorkTitle(
                                                            work.title
                                                        );

                                                        setWorkDescription(
                                                            work.description
                                                        );
                                                    }}
                                                    disabled={
                                                        savingWork
                                                    }
                                                    className="border border-[var(--border)] px-4 py-2.5 text-sm font-semibold"
                                                >
                                                    Cancel
                                                </button>

                                            </div>

                                        </div>

                                    ) : (

                                        <>
                                            <h1 className="heading-font text-3xl font-bold tracking-tight md:text-4xl">
                                                {work.title}
                                            </h1>

                                            <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--muted)]">
                                                {work.description}
                                            </p>
                                        </>

                                    )}


                                    <div className="mt-6 max-w-3xl">

                                        <div className="mb-2 flex items-center justify-between text-xs">

                                            <span className="font-semibold">
                                                Progress
                                            </span>

                                            <span className="font-semibold text-purple-400">
                                                {progress}%
                                            </span>

                                        </div>

                                        <div className="h-2 overflow-hidden bg-[var(--surface)]">

                                            <div
                                                className="h-full bg-purple-500 transition-all"
                                                style={{
                                                    width: `${progress}%`,
                                                }}
                                            />

                                        </div>

                                    </div>

                                </div>


                                {/* ACTIONS */}

                                <div className="flex flex-wrap gap-2">

                                    {canEdit && !isArchived && (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setEditingWork(
                                                    true
                                                )
                                            }
                                            className="flex items-center gap-2 border border-[var(--border)] px-4 py-2.5 text-sm font-semibold hover:bg-[var(--surface)]"
                                        >
                                            <Edit3
                                                size={16}
                                            />
                                            Edit
                                        </button>
                                    )}


                                    {canManage &&
                                        !isArchived && (
                                            isLocked ? (
                                                <button
                                                    type="button"
                                                    onClick={
                                                        handleUnlock
                                                    }
                                                    className="flex items-center gap-2 border border-yellow-500/30 px-4 py-2.5 text-sm font-semibold text-yellow-400 hover:bg-yellow-500/10"
                                                >
                                                    <LockOpen
                                                        size={16}
                                                    />
                                                    Unlock
                                                </button>
                                            ) : (
                                                <button
                                                    type="button"
                                                    onClick={
                                                        handleLock
                                                    }
                                                    className="flex items-center gap-2 border border-yellow-500/30 px-4 py-2.5 text-sm font-semibold text-yellow-400 hover:bg-yellow-500/10"
                                                >
                                                    <Lock
                                                        size={16}
                                                    />
                                                    Lock
                                                </button>
                                            )
                                        )}


                                    {canManage &&
                                        !isArchived && (
                                            <button
                                                type="button"
                                                onClick={
                                                    handleArchive
                                                }
                                                className="flex items-center gap-2 border border-red-500/30 px-4 py-2.5 text-sm font-semibold text-red-400 hover:bg-red-500/10"
                                            >
                                                <Archive
                                                    size={16}
                                                />
                                                Archive
                                            </button>
                                        )}


                                    {canManage &&
                                        isArchived && (
                                            <button
                                                type="button"
                                                onClick={
                                                    handleRestore
                                                }
                                                className="flex items-center gap-2 border border-green-500/30 px-4 py-2.5 text-sm font-semibold text-green-400 hover:bg-green-500/10"
                                            >
                                                <ArchiveRestore
                                                    size={16}
                                                />
                                                Restore
                                            </button>
                                        )}

                                </div>

                            </div>


                            {/* META */}

                            <div className="mt-8 grid gap-4 border-t border-[var(--border)] pt-6 sm:grid-cols-2 lg:grid-cols-4">

                                <div>

                                    <p className="text-xs uppercase tracking-wider text-[var(--muted)]">
                                        Created
                                    </p>

                                    <p className="mt-1 text-sm font-medium">
                                        {formatDate(
                                            work.createdAt
                                        )}
                                    </p>

                                </div>


                                <div>

                                    <p className="text-xs uppercase tracking-wider text-[var(--muted)]">
                                        Tasks
                                    </p>

                                    <p className="mt-1 text-sm font-medium">
                                        {
                                            work.tasks?.length ||
                                            0
                                        }
                                    </p>

                                </div>


                                <div>

                                    <p className="text-xs uppercase tracking-wider text-[var(--muted)]">
                                        Participants
                                    </p>

                                    <p className="mt-1 flex items-center gap-2 text-sm font-medium">
                                        <Users
                                            size={15}
                                        />

                                        {
                                            work.participants?.length ||
                                            0
                                        }
                                    </p>

                                </div>


                                <div>

                                    <p className="text-xs uppercase tracking-wider text-[var(--muted)]">
                                        Last updated
                                    </p>

                                    <p className="mt-1 text-sm font-medium">
                                        {formatDate(
                                            work.updatedAt
                                        )}
                                    </p>

                                </div>

                            </div>

                        </div>

                    </section>


                    {/* ==================================================
                        ERROR
                    ================================================== */}

                    {error && (
                        <div className="mt-6 border border-red-500/20 bg-red-500/5 p-5 text-sm text-red-400">
                            {error}
                        </div>
                    )}


                    {/* ==================================================
                        TASKS
                    ================================================== */}

                    <section className="mt-6 border border-[var(--border)] bg-[var(--card)]">

                        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border)] p-6">

                            <div>

                                <h2 className="text-lg font-semibold">
                                    Tasks
                                </h2>

                                <p className="mt-1 text-sm text-[var(--muted)]">
                                    Progress is calculated automatically from completed tasks.
                                </p>

                            </div>


                            {canManageStructure &&
                                !isArchived &&
                                !isLocked && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setNewTaskOpen(
                                                (current) =>
                                                    !current
                                            )
                                        }
                                        className="flex items-center gap-2 bg-purple-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-purple-600"
                                    >
                                        <Plus
                                            size={16}
                                        />

                                        Add task

                                    </button>
                                )}

                        </div>


                        {/* NEW TASK */}

                        {newTaskOpen && (
                            <div className="border-b border-[var(--border)] bg-[var(--surface)] p-6">

                                <div className="grid gap-4">

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
                                        className="border border-[var(--border)] bg-[var(--card)] px-4 py-3 text-sm outline-none focus:border-purple-400"
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
                                        placeholder="Task description"
                                        rows={3}
                                        className="resize-y border border-[var(--border)] bg-[var(--card)] px-4 py-3 text-sm outline-none focus:border-purple-400"
                                    />

                                    <div className="flex gap-2">

                                        <button
                                            type="button"
                                            onClick={
                                                handleCreateTask
                                            }
                                            disabled={
                                                savingTask ||
                                                !newTaskTitle.trim()
                                            }
                                            className="bg-purple-500 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
                                        >
                                            Create task
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setNewTaskOpen(
                                                    false
                                                )
                                            }
                                            className="border border-[var(--border)] px-4 py-2.5 text-sm font-semibold"
                                        >
                                            Cancel
                                        </button>

                                    </div>

                                </div>

                            </div>
                        )}


                        {/* TASK LIST */}

                        <div className="divide-y divide-[var(--border)]">

                            {(work.tasks || []).map(
                                (task) => {

                                    const taskProgress =
                                        getTaskProgress(
                                            task
                                        );

                                    const expanded =
                                        Boolean(
                                            expandedTasks[
                                                task._id
                                            ]
                                        );

                                    const taskCompleted =
                                        task.status ===
                                        "COMPLETED";

                                    return (
                                        <div
                                            key={
                                                task._id
                                            }
                                            className="p-6"
                                        >

                                            <div className="flex items-start gap-4">

                                                {/* CHECKBOX */}

                                                <button
                                                    type="button"
                                                    disabled={
                                                        isArchived ||
                                                        (
                                                            isLocked &&
                                                            !taskCompleted
                                                        )
                                                    }
                                                    onClick={() =>
                                                        handleTaskToggle(
                                                            task
                                                        )
                                                    }
                                                    className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center border transition ${
                                                        taskCompleted
                                                            ? "border-purple-500 bg-purple-500 text-white"
                                                            : "border-[var(--border)] hover:border-purple-400"
                                                    } disabled:cursor-not-allowed disabled:opacity-50`}
                                                    aria-label={
                                                        taskCompleted
                                                            ? "Reopen task"
                                                            : "Complete task"
                                                    }
                                                >
                                                    {taskCompleted &&
                                                        "✓"}
                                                </button>


                                                <div className="min-w-0 flex-1">

                                                    <div className="flex flex-wrap items-center gap-2">

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                toggleTask(
                                                                    task._id
                                                                )
                                                            }
                                                            className="flex items-center gap-1 text-left text-base font-semibold"
                                                        >

                                                            {expanded ? (
                                                                <ChevronDown
                                                                    size={17}
                                                                />
                                                            ) : (
                                                                <ChevronRight
                                                                    size={17}
                                                                />
                                                            )}

                                                            {
                                                                task.title
                                                            }

                                                        </button>

                                                        <span className="bg-[var(--surface)] px-2 py-1 text-[11px] font-semibold text-[var(--muted)]">
                                                            {getStatusLabel(
                                                                task.status
                                                            )}
                                                        </span>

                                                    </div>


                                                    <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                                                        {
                                                            task.description
                                                        }
                                                    </p>


                                                    <div className="mt-4 max-w-xl">

                                                        <div className="mb-1 flex justify-between text-[11px] text-[var(--muted)]">

                                                            <span>
                                                                Task progress
                                                            </span>

                                                            <span>
                                                                {
                                                                    taskProgress
                                                                }%
                                                            </span>

                                                        </div>

                                                        <div className="h-1.5 overflow-hidden bg-[var(--surface)]">

                                                            <div
                                                                className="h-full bg-purple-400 transition-all"
                                                                style={{
                                                                    width: `${taskProgress}%`,
                                                                }}
                                                            />

                                                        </div>

                                                    </div>


                                                    {/* SUBTASK AREA */}

                                                    {expanded && (
                                                        <div className="mt-5 border-l border-[var(--border)] pl-5">

                                                            <div className="mb-3 flex items-center justify-between">

                                                                <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                                                                    Subtasks
                                                                </p>


                                                                {canManageStructure &&
                                                                    !isArchived &&
                                                                    !isLocked && (
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => {
                                                                                setNewSubtaskFor(
                                                                                    task._id
                                                                                );

                                                                                setNewSubtaskTitle(
                                                                                    ""
                                                                                );

                                                                                setNewSubtaskDescription(
                                                                                    ""
                                                                                );
                                                                            }}
                                                                            className="flex items-center gap-1 text-xs font-semibold text-purple-400 hover:text-purple-300"
                                                                        >
                                                                            <Plus
                                                                                size={14}
                                                                            />

                                                                            Add subtask

                                                                        </button>
                                                                    )}

                                                            </div>


                                                            {(task.subtasks || []).map(
                                                                (
                                                                    subtask
                                                                ) => (

                                                                    <div
                                                                        key={
                                                                            subtask._id
                                                                        }
                                                                        className="flex items-start gap-3 border-b border-[var(--border)] py-3 last:border-b-0"
                                                                    >

                                                                        <button
                                                                            type="button"
                                                                            disabled={
                                                                                isArchived ||
                                                                                (
                                                                                    isLocked &&
                                                                                    subtask.completed
                                                                                )
                                                                            }
                                                                            onClick={() =>
                                                                                handleSubtaskToggle(
                                                                                    subtask
                                                                                )
                                                                            }
                                                                            className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center border text-[10px] ${
                                                                                subtask.completed
                                                                                    ? "border-purple-500 bg-purple-500 text-white"
                                                                                    : "border-[var(--border)] hover:border-purple-400"
                                                                            } disabled:cursor-not-allowed disabled:opacity-50`}
                                                                        >
                                                                            {subtask.completed &&
                                                                                "✓"}
                                                                        </button>


                                                                        <div className="min-w-0">

                                                                            <p
                                                                                className={`text-sm font-medium ${
                                                                                    subtask.completed
                                                                                        ? "text-[var(--muted)] line-through"
                                                                                        : ""
                                                                                }`}
                                                                            >
                                                                                {
                                                                                    subtask.title
                                                                                }
                                                                            </p>

                                                                            {subtask.description && (
                                                                                <p className="mt-1 text-xs leading-5 text-[var(--muted)]">
                                                                                    {
                                                                                        subtask.description
                                                                                    }
                                                                                </p>
                                                                            )}

                                                                        </div>

                                                                    </div>

                                                                )
                                                            )}


                                                            {/* NEW SUBTASK */}

                                                            {newSubtaskFor ===
                                                                task._id && (
                                                                <div className="mt-4 grid gap-3">

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
                                                                        className="border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm outline-none focus:border-purple-400"
                                                                    />

                                                                    <textarea
                                                                        value={
                                                                            newSubtaskDescription
                                                                        }
                                                                        onChange={(
                                                                            event
                                                                        ) =>
                                                                            setNewSubtaskDescription(
                                                                                event.target.value
                                                                            )
                                                                        }
                                                                        placeholder="Description"
                                                                        rows={2}
                                                                        className="resize-y border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm outline-none focus:border-purple-400"
                                                                    />

                                                                    <div className="flex gap-2">

                                                                        <button
                                                                            type="button"
                                                                            onClick={() =>
                                                                                handleCreateSubtask(
                                                                                    task._id
                                                                                )
                                                                            }
                                                                            disabled={
                                                                                savingSubtask ||
                                                                                !newSubtaskTitle.trim()
                                                                            }
                                                                            className="bg-purple-500 px-3 py-2 text-xs font-semibold text-white disabled:opacity-50"
                                                                        >
                                                                            Create
                                                                        </button>

                                                                        <button
                                                                            type="button"
                                                                            onClick={() =>
                                                                                setNewSubtaskFor(
                                                                                    null
                                                                                )
                                                                            }
                                                                            className="border border-[var(--border)] px-3 py-2 text-xs font-semibold"
                                                                        >
                                                                            Cancel
                                                                        </button>

                                                                    </div>

                                                                </div>
                                                            )}

                                                        </div>
                                                    )}

                                                </div>

                                            </div>

                                        </div>
                                    );
                                }
                            )}

                        </div>

                    </section>


                    {/* ==================================================
                        PARTICIPANTS
                    ================================================== */}

                    <section className="mt-6 border border-[var(--border)] bg-[var(--card)]">

                        <div className="border-b border-[var(--border)] p-6">

                            <div className="flex items-center gap-3">

                                <Users
                                    size={19}
                                    className="text-purple-400"
                                />

                                <div>

                                    <h2 className="text-lg font-semibold">
                                        Participants
                                    </h2>

                                    <p className="mt-1 text-sm text-[var(--muted)]">
                                        Administrators who can contribute to this work.
                                    </p>

                                </div>

                            </div>

                        </div>


                        <div className="divide-y divide-[var(--border)]">

                            {(work.participants || []).map(
                                (participant) => {

                                    const participantAdmin =
                                        participant.admin ||
                                        participant;

                                    const participantId =
                                        participantAdmin?._id ||
                                        participantAdmin?.id ||
                                        participantAdmin;

                                    return (
                                        <div
                                            key={
                                                participantId
                                            }
                                            className="flex items-center justify-between gap-4 p-5"
                                        >

                                            <div>

                                                <p className="text-sm font-semibold">
                                                    {
                                                        participantAdmin.fullName ||
                                                        participantAdmin.username ||
                                                        "Administrator"
                                                    }
                                                </p>

                                                <p className="mt-1 text-xs text-[var(--muted)]">
                                                    {
                                                        participantAdmin.email ||
                                                        "No email"
                                                    }
                                                </p>

                                            </div>

                                            {participantId ===
                                                (
                                                    work.createdBy?._id ||
                                                    work.createdBy
                                                ) && (
                                                    <span className="flex items-center gap-1 bg-purple-500/10 px-2 py-1 text-[11px] font-semibold text-purple-400">
                                                        <ShieldCheck
                                                            size={12}
                                                        />
                                                        Creator
                                                    </span>
                                                )}

                                        </div>
                                    );
                                }
                            )}

                        </div>

                    </section>


                    {/* ==================================================
                        ACTIVITY
                    ================================================== */}

                    <section className="mt-6 border border-[var(--border)] bg-[var(--card)]">

                        <button
                            type="button"
                            onClick={() =>
                                setShowActivities(
                                    (current) =>
                                        !current
                                )
                            }
                            className="flex w-full items-center justify-between border-b border-[var(--border)] p-6 text-left"
                        >

                            <div className="flex items-center gap-3">

                                <MessageSquare
                                    size={19}
                                    className="text-purple-400"
                                />

                                <div>

                                    <h2 className="text-lg font-semibold">
                                        Work activity
                                    </h2>

                                    <p className="mt-1 text-sm text-[var(--muted)]">
                                        Immutable history of changes made to this work.
                                    </p>

                                </div>

                            </div>


                            {showActivities ? (
                                <ChevronDown
                                    size={18}
                                />
                            ) : (
                                <ChevronRight
                                    size={18}
                                />
                            )}

                        </button>


                        {showActivities && (
                            <div className="divide-y divide-[var(--border)]">

                                {activities.length ===
                                0 ? (

                                    <div className="p-6 text-sm text-[var(--muted)]">
                                        No activity recorded yet.
                                    </div>

                                ) : (

                                    activities.map(
                                        (
                                            activity
                                        ) => (

                                            <div
                                                key={
                                                    activity._id
                                                }
                                                className="p-5"
                                            >

                                                <div className="flex flex-wrap items-center justify-between gap-2">

                                                    <p className="text-sm font-semibold">

                                                        {
                                                            activity.admin?.fullName ||
                                                            activity.admin?.username ||
                                                            "Administrator"
                                                        }

                                                    </p>

                                                    <time className="text-xs text-[var(--muted)]">
                                                        {formatDate(
                                                            activity.createdAt
                                                        )}
                                                    </time>

                                                </div>


                                                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                                                    {
                                                        activity.description
                                                    }
                                                </p>

                                            </div>

                                        )
                                    )

                                )}

                            </div>
                        )}

                    </section>


                    {/* ==================================================
                        ARCHIVED NOTICE
                    ================================================== */}

                    {isArchived && (
                        <div className="mt-6 flex items-start gap-3 border border-yellow-500/20 bg-yellow-500/5 p-5">

                            <Archive
                                size={19}
                                className="mt-0.5 shrink-0 text-yellow-400"
                            />

                            <div>

                                <p className="text-sm font-semibold">
                                    This work is archived.
                                </p>

                                <p className="mt-1 text-sm leading-6 text-[var(--muted)]">
                                    Archived work is read-only.
                                    Tasks, subtasks, participants,
                                    links, comments, and activity
                                    history remain preserved until
                                    the work is restored.
                                </p>

                            </div>

                        </div>
                    )}

                </div>

            </main>

        </div>
    );
}

export default WorkDetails;