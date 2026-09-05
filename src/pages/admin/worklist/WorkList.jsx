import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    Archive,
    CheckCircle2,
    ChevronRight,
    ClipboardList,
    Loader2,
    Lock,
    Plus,
    RefreshCw,
    RotateCcw,
    ShieldCheck,
    Unlock,
    Users,
    X,
} from "lucide-react";

import AdminNavbar from "../../../components/admin/AdminNavbar";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { useAuth } from "../../../context/AuthContext";

import {
    getWorks,
    createWork,
    archiveWork,
    restoreWork,
} from "../../../services/workApi";

import {
    canCreateWork,
    canArchiveWork,
    canRestoreWork,
} from "../../../utils/workPermissions";


// ============================================================
// HELPERS
// ============================================================

const getWorkId = (work) => {
    return (
        work?._id ||
        work?.id ||
        null
    );
};


const getWorkParticipants = (work) => {
    if (!Array.isArray(work?.participants)) {
        return [];
    }

    return work.participants;
};


const getProgress = (work) => {
    const directProgress = Number(
        work?.progress ??
        work?.progressPercentage
    );

    if (
        Number.isFinite(directProgress)
    ) {
        return Math.min(
            100,
            Math.max(
                0,
                Math.round(
                    directProgress
                )
            )
        );
    }

    const totalTasks = Array.isArray(
        work?.tasks
    )
        ? work.tasks.length
        : Number(
            work?.totalTasks ?? 0
        );

    const completedTasks = Array.isArray(
        work?.tasks
    )
        ? work.tasks.filter(
            (task) =>
                task?.status ===
                "COMPLETED"
        ).length
        : Number(
            work?.completedTasks ?? 0
        );

    if (
        !Number.isFinite(
            totalTasks
        ) ||
        totalTasks <= 0
    ) {
        return 0;
    }

    return Math.min(
        100,
        Math.max(
            0,
            Math.round(
                (completedTasks /
                    totalTasks) *
                100
            )
        )
    );
};


const getStatusLabel = (
    status
) => {
    switch (status) {
        case "PLANNED":
            return "Planned";

        case "IN_PROGRESS":
            return "In progress";

        case "COMPLETED":
            return "Completed";

        case "ARCHIVED":
            return "Archived";

        default:
            return "Unknown";
    }
};


const getStatusClasses = (
    status
) => {
    switch (status) {
        case "PLANNED":
            return "bg-blue-500/10 text-blue-400";

        case "IN_PROGRESS":
            return "bg-yellow-500/10 text-yellow-400";

        case "COMPLETED":
            return "bg-green-500/10 text-green-400";

        case "ARCHIVED":
            return "bg-zinc-500/10 text-zinc-400";

        default:
            return "bg-[var(--surface)] text-[var(--muted)]";
    }
};


// ============================================================
// COMPONENT
// ============================================================

function WorkList() {
    const navigate = useNavigate();
    const { admin: currentAdmin } = useAuth();

    const [sidebarOpen, setSidebarOpen] =
        useState(false);

    const [works, setWorks] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [refreshing, setRefreshing] =
        useState(false);

    const [pageError, setPageError] =
        useState("");

    const [showArchived, setShowArchived] =
        useState(false);

    const [createModalOpen, setCreateModalOpen] =
        useState(false);

    const [createLoading, setCreateLoading] =
        useState(false);

    const [createError, setCreateError] =
        useState("");

    const [newWorkTitle, setNewWorkTitle] =
        useState("");

    const [newWorkDescription, setNewWorkDescription] =
        useState("");

    const [accessMode, setAccessMode] =
        useState("COLLABORATIVE");

    const [workPassword, setWorkPassword] =
        useState("");

    const [actionLoadingId, setActionLoadingId] =
        useState(null);


    // ========================================================
    // PERMISSIONS
    // ========================================================

    const canCreate =
        canCreateWork(
            currentAdmin
        );


    // ========================================================
    // FETCH WORKS
    // ========================================================

    const fetchWorks = useCallback(
        async (
            showRefreshLoader = false
        ) => {
            try {
                if (showRefreshLoader) {
                    setRefreshing(true);
                } else {
                    setLoading(true);
                }

                setPageError("");

                const response =
                    await getWorks({
                        includeArchived:
                            showArchived,
                    });

                const fetchedWorks =
                    response?.data?.works ??
                    response?.works ??
                    response?.data ??
                    [];

                setWorks(
                    Array.isArray(
                        fetchedWorks
                    )
                        ? fetchedWorks
                        : []
                );

            } catch (error) {
                console.error(
                    "Failed to fetch works:",
                    error
                );

                setPageError(
                    error?.response?.data
                        ?.message ||
                    error?.message ||
                    "Unable to load works."
                );

            } finally {
                setLoading(false);
                setRefreshing(false);
            }
        },
        [
            showArchived,
        ]
    );


    // ========================================================
    // INITIAL / FILTER FETCH
    // ========================================================

    useEffect(() => {
        fetchWorks();
    }, [
        fetchWorks,
    ]);


    // ========================================================
    // FILTERED WORKS
    // ========================================================

    const visibleWorks =
        useMemo(() => {
            if (showArchived) {
                return works;
            }

            return works.filter(
                (work) =>
                    work?.status !==
                    "ARCHIVED"
            );
        }, [
            works,
            showArchived,
        ]);


    // ========================================================
    // CREATE WORK
    // ========================================================

    const openCreateModal = () => {
        if (!canCreate) {
            return;
        }

        setNewWorkTitle("");
        setNewWorkDescription("");
        setAccessMode("COLLABORATIVE");
        setWorkPassword("");
        setCreateError("");
        setCreateModalOpen(true);
    };


    const closeCreateModal = () => {
        if (createLoading) {
            return;
        }

        setCreateModalOpen(false);
        setNewWorkTitle("");
        setNewWorkDescription("");
        setAccessMode("COLLABORATIVE");
        setWorkPassword("");
        setCreateError("");
    };


    const handleAccessModeChange = (
        nextAccessMode
    ) => {
        setAccessMode(nextAccessMode);

        if (nextAccessMode !== "PASSWORD_PROTECTED") {
            setWorkPassword("");
        }

        setCreateError("");
    };


    const handleCreateWork = async (
        event
    ) => {
        event.preventDefault();

        if (!canCreate) {
            return;
        }

        const title =
            newWorkTitle.trim();

        const description =
            newWorkDescription.trim();

        if (!title) {
            setCreateError(
                "Work title is required."
            );

            return;
        }

        if (!description) {
            setCreateError(
                "Work description is required."
            );

            return;
        }

        const trimmedPassword =
            workPassword.trim();

        if (
            accessMode === "PASSWORD_PROTECTED" &&
            !trimmedPassword
        ) {
            setCreateError(
                "A work password is required for password-protected access."
            );

            return;
        }

        if (
            accessMode === "PASSWORD_PROTECTED" &&
            trimmedPassword.length < 8
        ) {
            setCreateError(
                "The work password must contain at least 8 characters."
            );

            return;
        }

        try {
            setCreateLoading(true);
            setCreateError("");

            await createWork({
                title,
                description,
                accessMode,
                ...(accessMode === "PASSWORD_PROTECTED"
                    ? { password: trimmedPassword }
                    : {}),
            });

            setCreateModalOpen(false);
            setNewWorkTitle("");
            setNewWorkDescription("");
            setAccessMode("COLLABORATIVE");
            setWorkPassword("");

            await fetchWorks(true);

        } catch (error) {
            console.error(
                "Failed to create work:",
                error
            );

            setCreateError(
                error?.response?.data
                    ?.message ||
                error?.message ||
                "Unable to create work."
            );

        } finally {
            setCreateLoading(false);
        }
    };


    // ========================================================
    // ARCHIVE
    // ========================================================

    const handleArchive = async (
        work
    ) => {
        const workId =
            getWorkId(work);

        if (!workId) {
            return;
        }

        if (
            !canArchiveWork(
                currentAdmin,
                work
            )
        ) {
            return;
        }

        try {
            setActionLoadingId(
                workId
            );

            setPageError("");

            await archiveWork(
                workId
            );

            await fetchWorks(true);

        } catch (error) {
            console.error(
                "Failed to archive work:",
                error
            );

            setPageError(
                error?.response?.data
                    ?.message ||
                error?.message ||
                "Unable to archive work."
            );

        } finally {
            setActionLoadingId(null);
        }
    };


    // ========================================================
    // RESTORE
    // ========================================================

    const handleRestore = async (
        work
    ) => {
        const workId =
            getWorkId(work);

        if (!workId) {
            return;
        }

        if (
            !canRestoreWork(
                currentAdmin,
                work
            )
        ) {
            return;
        }

        try {
            setActionLoadingId(
                workId
            );

            setPageError("");

            await restoreWork(
                workId
            );

            await fetchWorks(true);

        } catch (error) {
            console.error(
                "Failed to restore work:",
                error
            );

            setPageError(
                error?.response?.data
                    ?.message ||
                error?.message ||
                "Unable to restore work."
            );

        } finally {
            setActionLoadingId(null);
        }
    };


    // ========================================================
    // WORK NAVIGATION
    // ========================================================

    const openWork = (
        work
    ) => {
        const workId =
            getWorkId(work);

        if (!workId) {
            return;
        }

        navigate(
            `/admin/worklist/${workId}`
        );
    };


    // ========================================================
    // RENDER
    // ========================================================

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
                        HEADER
                    ================================================== */}

                    <motion.div
                        initial={{
                            opacity: 0,
                            y: 15,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                        }}
                        transition={{
                            duration: 0.4,
                        }}
                    >

                        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">

                            <div>

                                <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-purple-400">
                                    Administration
                                </p>

                                <h1 className="heading-font text-3xl font-bold tracking-tight md:text-4xl">
                                    Work list.
                                </h1>

                                <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)]">
                                    Manage shared work, tasks,
                                    contributions, progress, and
                                    activity across the administrator
                                    team.
                                </p>

                            </div>

                            <div className="flex flex-col gap-2 sm:flex-row">

                                <button
                                    type="button"
                                    onClick={() =>
                                        fetchWorks(true)
                                    }
                                    disabled={
                                        loading ||
                                        refreshing
                                    }
                                    className="flex items-center justify-center gap-2 border border-[var(--border)] px-4 py-2.5 text-sm font-semibold transition hover:bg-[var(--card)] disabled:cursor-not-allowed disabled:opacity-50"
                                >

                                    {refreshing ? (
                                        <Loader2
                                            size={16}
                                            className="animate-spin"
                                        />
                                    ) : (
                                        <RefreshCw
                                            size={16}
                                        />
                                    )}

                                    Refresh

                                </button>

                                {canCreate && (
                                    <button
                                        type="button"
                                        onClick={
                                            openCreateModal
                                        }
                                        className="flex items-center justify-center gap-2 bg-purple-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-600"
                                    >

                                        <Plus
                                            size={17}
                                        />

                                        New work

                                    </button>
                                )}

                            </div>

                        </div>

                    </motion.div>


                    {/* ==================================================
                        TOOLBAR
                    ================================================== */}

                    <motion.div
                        initial={{
                            opacity: 0,
                            y: 15,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                        }}
                        transition={{
                            duration: 0.4,
                            delay: 0.05,
                        }}
                        className="mt-8 flex flex-col gap-4 border border-[var(--border)] bg-[var(--card)] p-4 sm:flex-row sm:items-center sm:justify-between"
                    >

                        <div className="flex items-center gap-3">

                            <ClipboardList
                                size={18}
                                className="text-purple-400"
                            />

                            <div>

                                <p className="text-sm font-semibold">
                                    {visibleWorks.length} work
                                    {visibleWorks.length ===
                                        1
                                        ? ""
                                        : "s"}
                                </p>

                                <p className="text-xs text-[var(--muted)]">
                                    Progress is calculated from
                                    task completion.
                                </p>

                            </div>

                        </div>

                        <button
                            type="button"
                            onClick={() =>
                                setShowArchived(
                                    (current) =>
                                        !current
                                )
                            }
                            className={`flex items-center justify-center gap-2 border px-4 py-2 text-sm font-semibold transition ${showArchived
                                    ? "border-purple-500/30 bg-purple-500/10 text-purple-400"
                                    : "border-[var(--border)] hover:bg-[var(--surface)]"
                                }`}
                        >

                            <Archive
                                size={16}
                            />

                            {showArchived
                                ? "Showing archive"
                                : "Show archive"}

                        </button>

                    </motion.div>


                    {/* ==================================================
                        ERROR
                    ================================================== */}

                    {pageError && (
                        <motion.div
                            initial={{
                                opacity: 0,
                                y: 10,
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                            }}
                            className="mt-6 border border-red-500/20 bg-red-500/5 p-5"
                        >

                            <p className="text-sm font-semibold text-red-400">
                                Unable to load works
                            </p>

                            <p className="mt-1 text-sm text-[var(--muted)]">
                                {pageError}
                            </p>

                        </motion.div>
                    )}


                    {/* ==================================================
                        CONTENT
                    ================================================== */}

                    {loading ? (

                        <div className="mt-6 flex items-center justify-center border border-[var(--border)] bg-[var(--card)] p-14">

                            <div className="flex items-center gap-3 text-sm text-[var(--muted)]">

                                <Loader2
                                    size={20}
                                    className="animate-spin"
                                />

                                Loading works...

                            </div>

                        </div>

                    ) : visibleWorks.length === 0 ? (

                        <motion.div
                            initial={{
                                opacity: 0,
                                y: 10,
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                            }}
                            className="mt-6 border border-[var(--border)] bg-[var(--card)] p-12 text-center"
                        >

                            <ClipboardList
                                size={32}
                                className="mx-auto text-[var(--muted)]"
                            />

                            <h2 className="mt-4 text-lg font-semibold">
                                {showArchived
                                    ? "No archived works"
                                    : "No works yet"}
                            </h2>

                            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[var(--muted)]">
                                {showArchived
                                    ? "Archived work will remain available here and can be restored."
                                    : "Create the first work to start organizing tasks and contributions."}
                            </p>

                            {!showArchived &&
                                canCreate && (
                                    <button
                                        type="button"
                                        onClick={
                                            openCreateModal
                                        }
                                        className="mt-6 inline-flex items-center gap-2 bg-purple-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-purple-600"
                                    >

                                        <Plus
                                            size={17}
                                        />

                                        Create work

                                    </button>
                                )}

                        </motion.div>

                    ) : (

                        <motion.section
                            initial={{
                                opacity: 0,
                                y: 10,
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                            }}
                            transition={{
                                duration: 0.4,
                            }}
                            className="mt-6"
                        >

                            <div className="space-y-4">

                                <AnimatePresence>
                                    {visibleWorks.map(
                                        (
                                            work,
                                            index
                                        ) => {

                                            const workId =
                                                getWorkId(
                                                    work
                                                );

                                            const progress =
                                                getProgress(
                                                    work
                                                );

                                            const participants =
                                                getWorkParticipants(
                                                    work
                                                );

                                            const isArchived =
                                                work?.status ===
                                                "ARCHIVED";

                                            const isCompleted =
                                                work?.status ===
                                                "COMPLETED";

                                            const actionLoading =
                                                actionLoadingId ===
                                                workId;

                                            const canArchive =
                                                canArchiveWork(
                                                    currentAdmin,
                                                    work
                                                );

                                            const canRestore =
                                                canRestoreWork(
                                                    currentAdmin,
                                                    work
                                                );

                                            const creator =
                                                work?.createdBy;

                                            const creatorName =
                                                creator?.fullName ||
                                                creator?.username ||
                                                "Unknown admin";

                                            return (
                                                <motion.article
                                                    key={
                                                        workId ||
                                                        `work-${index}`
                                                    }
                                                    layout
                                                    initial={{
                                                        opacity: 0,
                                                        y: 12,
                                                    }}
                                                    animate={{
                                                        opacity: 1,
                                                        y: 0,
                                                    }}
                                                    exit={{
                                                        opacity: 0,
                                                        y: -10,
                                                    }}
                                                    transition={{
                                                        duration:
                                                            0.3,
                                                        delay:
                                                            index *
                                                            0.03,
                                                    }}
                                                    className={`border bg-[var(--card)] ${isArchived
                                                            ? "border-zinc-500/20"
                                                            : "border-[var(--border)]"
                                                        }`}
                                                >

                                                    <div className="p-6">

                                                        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">

                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    openWork(
                                                                        work
                                                                    )
                                                                }
                                                                className="min-w-0 flex-1 text-left"
                                                            >

                                                                <div className="flex flex-wrap items-center gap-2">

                                                                    <h2 className="text-lg font-semibold transition hover:text-purple-400">
                                                                        {
                                                                            work?.title
                                                                        }
                                                                    </h2>

                                                                    <span
                                                                        className={`px-2 py-1 text-[11px] font-semibold ${getStatusClasses(
                                                                            work?.status
                                                                        )}`}
                                                                    >
                                                                        {
                                                                            getStatusLabel(
                                                                                work?.status
                                                                            )
                                                                        }
                                                                    </span>

                                                                    {isCompleted &&
                                                                        !isArchived && (
                                                                            <span className="flex items-center gap-1 bg-green-500/10 px-2 py-1 text-[11px] font-semibold text-green-400">

                                                                                <CheckCircle2
                                                                                    size={12}
                                                                                />

                                                                                Complete

                                                                            </span>
                                                                        )}

                                                                </div>

                                                                <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--muted)]">
                                                                    {
                                                                        work?.description
                                                                    }
                                                                </p>

                                                                <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-[var(--muted)]">

                                                                    <span>
                                                                        Created by{" "}
                                                                        <span className="font-medium text-[var(--text)]">
                                                                            {
                                                                                creatorName
                                                                            }
                                                                        </span>
                                                                    </span>

                                                                    <span className="flex items-center gap-1.5">

                                                                        <Users
                                                                            size={14}
                                                                        />

                                                                        {
                                                                            participants.length
                                                                        }{" "}
                                                                        participant
                                                                        {participants.length ===
                                                                            1
                                                                            ? ""
                                                                            : "s"}

                                                                    </span>

                                                                </div>

                                                            </button>

                                                            <div className="flex shrink-0 flex-wrap items-center gap-2">

                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        openWork(
                                                                            work
                                                                        )
                                                                    }
                                                                    className="flex items-center gap-2 border border-[var(--border)] px-4 py-2.5 text-sm font-semibold transition hover:bg-[var(--surface)]"
                                                                >

                                                                    Open

                                                                    <ChevronRight
                                                                        size={16}
                                                                    />

                                                                </button>

                                                                {!isArchived &&
                                                                    canArchive && (
                                                                        <button
                                                                            type="button"
                                                                            onClick={() =>
                                                                                handleArchive(
                                                                                    work
                                                                                )
                                                                            }
                                                                            disabled={
                                                                                actionLoading
                                                                            }
                                                                            className="flex items-center gap-2 border border-yellow-500/30 px-4 py-2.5 text-sm font-semibold text-yellow-400 transition hover:bg-yellow-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                                                                        >

                                                                            {actionLoading ? (
                                                                                <Loader2
                                                                                    size={16}
                                                                                    className="animate-spin"
                                                                                />
                                                                            ) : (
                                                                                <Archive
                                                                                    size={16}
                                                                                />
                                                                            )}

                                                                            Archive

                                                                        </button>
                                                                    )}

                                                                {isArchived &&
                                                                    canRestore && (
                                                                        <button
                                                                            type="button"
                                                                            onClick={() =>
                                                                                handleRestore(
                                                                                    work
                                                                                )
                                                                            }
                                                                            disabled={
                                                                                actionLoading
                                                                            }
                                                                            className="flex items-center gap-2 border border-green-500/30 px-4 py-2.5 text-sm font-semibold text-green-400 transition hover:bg-green-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                                                                        >

                                                                            {actionLoading ? (
                                                                                <Loader2
                                                                                    size={16}
                                                                                    className="animate-spin"
                                                                                />
                                                                            ) : (
                                                                                <RotateCcw
                                                                                    size={16}
                                                                                />
                                                                            )}

                                                                            Restore

                                                                        </button>
                                                                    )}

                                                            </div>

                                                        </div>

                                                        <div className="mt-6">

                                                            <div className="mb-2 flex items-center justify-between gap-4">

                                                                <div className="flex items-center gap-2">

                                                                    <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
                                                                        Progress
                                                                    </span>

                                                                    {work?.totalTasks !==
                                                                        undefined && (
                                                                            <span className="text-xs text-[var(--muted)]">
                                                                                {
                                                                                    work?.completedTasks ??
                                                                                    0
                                                                                }{" "}
                                                                                /{" "}
                                                                                {
                                                                                    work?.totalTasks ??
                                                                                    0
                                                                                }{" "}
                                                                                tasks
                                                                            </span>
                                                                        )}

                                                                </div>

                                                                <span className="text-sm font-semibold">
                                                                    {
                                                                        progress
                                                                    }
                                                                    %
                                                                </span>

                                                            </div>

                                                            <div className="h-2 overflow-hidden bg-[var(--surface)]">

                                                                <motion.div
                                                                    initial={{
                                                                        width: 0,
                                                                    }}
                                                                    animate={{
                                                                        width: `${progress}%`,
                                                                    }}
                                                                    transition={{
                                                                        duration:
                                                                            0.55,
                                                                    }}
                                                                    className={`h-full ${isArchived
                                                                            ? "bg-zinc-500"
                                                                            : progress ===
                                                                                100
                                                                                ? "bg-green-500"
                                                                                : "bg-purple-500"
                                                                        }`}
                                                                />

                                                            </div>

                                                        </div>

                                                    </div>

                                                </motion.article>
                                            );
                                        }
                                    )}
                                </AnimatePresence>

                            </div>

                        </motion.section>

                    )}

                </div>

            </main>


            {/* ========================================================
                CREATE WORK MODAL
            ======================================================== */}

            {createModalOpen && (

                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-5">

                    <motion.div
                        initial={{
                            opacity: 0,
                            scale: 0.96,
                            y: 10,
                        }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                            y: 0,
                        }}
                        className="w-full max-w-lg border border-[var(--border)] bg-[var(--card)] shadow-2xl max-h-[90vh] overflow-y-auto"
                    >

                        <div className="flex items-start justify-between border-b border-[var(--border)] p-6">

                            <div>

                                <p className="text-xs font-medium uppercase tracking-[0.15em] text-purple-400">
                                    New work
                                </p>

                                <h2 className="mt-1 text-xl font-semibold">
                                    Create work
                                </h2>

                                <p className="mt-1 text-sm text-[var(--muted)]">
                                    Create the work container first.
                                    Tasks and participants can be
                                    managed afterward.
                                </p>

                            </div>

                            <button
                                type="button"
                                onClick={
                                    closeCreateModal
                                }
                                disabled={
                                    createLoading
                                }
                                className="text-[var(--muted)] transition hover:text-[var(--text)] disabled:opacity-50"
                            >

                                <X
                                    size={19}
                                />

                            </button>

                        </div>

                        <form
                            onSubmit={
                                handleCreateWork
                            }
                            className="p-6"
                        >

                            <div>

                                <label
                                    htmlFor="workTitle"
                                    className="mb-2 block text-sm font-medium"
                                >
                                    Work title
                                </label>

                                <input
                                    id="workTitle"
                                    type="text"
                                    value={
                                        newWorkTitle
                                    }
                                    onChange={(
                                        event
                                    ) => {
                                        setNewWorkTitle(
                                            event.target.value
                                        );
                                        setCreateError(
                                            ""
                                        );
                                    }}
                                    maxLength={200}
                                    disabled={
                                        createLoading
                                    }
                                    placeholder="e.g. Authentication system"
                                    className="w-full border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm outline-none transition focus:border-purple-400 disabled:opacity-60"
                                />

                            </div>

                            <div className="mt-5">

                                <label
                                    htmlFor="workDescription"
                                    className="mb-2 block text-sm font-medium"
                                >
                                    Description
                                </label>

                                <textarea
                                    id="workDescription"
                                    value={
                                        newWorkDescription
                                    }
                                    onChange={(
                                        event
                                    ) => {
                                        setNewWorkDescription(
                                            event.target.value
                                        );
                                        setCreateError(
                                            ""
                                        );
                                    }}
                                    maxLength={2000}
                                    rows={5}
                                    disabled={
                                        createLoading
                                    }
                                    placeholder="Describe what this work is for..."
                                    className="w-full resize-y border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm leading-6 outline-none transition focus:border-purple-400 disabled:opacity-60"
                                />

                            </div>

                            <div className="mt-5">

                                <label className="mb-2 block text-sm font-medium">
                                    Access
                                </label>

                                <div className="space-y-3">

                                    <label className="flex cursor-pointer items-start gap-3 border border-[var(--border)] p-3 transition hover:bg-[var(--surface)]">

                                        <input
                                            type="radio"
                                            name="accessMode"
                                            value="OPEN_VIEW"
                                            checked={accessMode === "OPEN_VIEW"}
                                            onChange={() =>
                                                handleAccessModeChange("OPEN_VIEW")
                                            }
                                            disabled={createLoading}
                                            className="mt-1"
                                        />

                                        <div className="min-w-0">
                                            <p className="flex items-center gap-2 text-sm font-semibold">
                                                <Unlock size={15} className="text-green-400" />
                                                Open view
                                            </p>
                                            <p className="mt-1 text-xs leading-5 text-[var(--muted)]">
                                                Any admin can view this work.
                                            </p>
                                        </div>

                                    </label>

                                    <label className="flex cursor-pointer items-start gap-3 border border-[var(--border)] p-3 transition hover:bg-[var(--surface)]">

                                        <input
                                            type="radio"
                                            name="accessMode"
                                            value="COLLABORATIVE"
                                            checked={accessMode === "COLLABORATIVE"}
                                            onChange={() =>
                                                handleAccessModeChange("COLLABORATIVE")
                                            }
                                            disabled={createLoading}
                                            className="mt-1"
                                        />

                                        <div className="min-w-0">
                                            <p className="flex items-center gap-2 text-sm font-semibold">
                                                <ShieldCheck size={15} className="text-purple-400" />
                                                Collaborative
                                            </p>
                                            <p className="mt-1 text-xs leading-5 text-[var(--muted)]">
                                                Authorized admins can contribute.
                                            </p>
                                        </div>

                                    </label>

                                    <label className="flex cursor-pointer items-start gap-3 border border-[var(--border)] p-3 transition hover:bg-[var(--surface)]">

                                        <input
                                            type="radio"
                                            name="accessMode"
                                            value="PASSWORD_PROTECTED"
                                            checked={accessMode === "PASSWORD_PROTECTED"}
                                            onChange={() =>
                                                handleAccessModeChange("PASSWORD_PROTECTED")
                                            }
                                            disabled={createLoading}
                                            className="mt-1"
                                        />

                                        <div className="min-w-0 flex-1">
                                            <p className="flex items-center gap-2 text-sm font-semibold">
                                                <Lock size={15} className="text-yellow-400" />
                                                Password protected
                                            </p>
                                            <p className="mt-1 text-xs leading-5 text-[var(--muted)]">
                                                Requires a password to access this work.
                                            </p>

                                            {accessMode === "PASSWORD_PROTECTED" && (
                                                <input
                                                    type="password"
                                                    value={workPassword}
                                                    onChange={(event) => {
                                                        setWorkPassword(event.target.value);
                                                        setCreateError("");
                                                    }}
                                                    minLength={8}
                                                    maxLength={128}
                                                    placeholder="Work password"
                                                    disabled={createLoading}
                                                    className="mt-3 w-full border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm outline-none focus:border-purple-400"
                                                />
                                            )}

                                        </div>

                                    </label>

                                </div>

                            </div>

                            {createError && (
                                <p
                                    className="mt-4 text-sm text-red-400"
                                    role="alert"
                                >
                                    {
                                        createError
                                    }
                                </p>
                            )}

                            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

                                <button
                                    type="button"
                                    onClick={
                                        closeCreateModal
                                    }
                                    disabled={
                                        createLoading
                                    }
                                    className="border border-[var(--border)] px-5 py-3 text-sm font-semibold transition hover:bg-[var(--surface)] disabled:opacity-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={
                                        createLoading ||
                                        !newWorkTitle.trim() ||
                                        !newWorkDescription.trim() ||
                                        (
                                            accessMode === "PASSWORD_PROTECTED" &&
                                            (
                                                !workPassword.trim() ||
                                                workPassword.trim().length < 8
                                            )
                                        )
                                    }
                                    className="flex items-center justify-center gap-2 bg-purple-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-purple-600 disabled:cursor-not-allowed disabled:opacity-50"
                                >

                                    {createLoading ? (
                                        <Loader2
                                            size={17}
                                            className="animate-spin"
                                        />
                                    ) : (
                                        <Plus
                                            size={17}
                                        />
                                    )}

                                    Create work

                                </button>

                            </div>

                        </form>

                    </motion.div>

                </div>
            )}

        </div>
    );
}

export default WorkList;