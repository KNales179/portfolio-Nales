import {
    Archive,
    Check,
    Circle,
    Lock,
    MessageSquare,
    Pencil,
    Plus,
    RotateCcw,
    Shield,
    Trash2,
    Unlock,
    UserCog,
    Link as LinkIcon,
    ArrowUpDown,
} from "lucide-react";

const ACTION_CONFIG = {
    WORK_CREATED: {
        label: "created the work",
        icon: Plus,
    },

    WORK_UPDATED: {
        label: "updated the work",
        icon: Pencil,
    },

    WORK_LOCKED: {
        label: "locked the work",
        icon: Lock,
    },

    WORK_UNLOCKED: {
        label: "unlocked the work",
        icon: Unlock,
    },

    WORK_ARCHIVED: {
        label: "archived the work",
        icon: Archive,
    },

    WORK_RESTORED: {
        label: "restored the work",
        icon: RotateCcw,
    },

    WORK_REORDERED: {
        label: "reordered the work",
        icon: ArrowUpDown,
    },

    WORK_OWNER_CHANGED: {
        label: "transferred ownership",
        icon: UserCog,
    },

    PARTICIPANT_ADDED: {
        label: "added a participant",
        icon: Shield,
    },

    PARTICIPANT_REMOVED: {
        label: "removed a participant",
        icon: Shield,
    },

    TASK_CREATED: {
        label: "created a task",
        icon: Plus,
    },

    TASK_UPDATED: {
        label: "updated a task",
        icon: Pencil,
    },

    TASK_COMPLETED: {
        label: "completed a task",
        icon: Check,
    },

    TASK_REOPENED: {
        label: "reopened a task",
        icon: RotateCcw,
    },

    TASK_ARCHIVED: {
        label: "archived a task",
        icon: Archive,
    },

    TASK_RESTORED: {
        label: "restored a task",
        icon: RotateCcw,
    },

    TASK_REORDERED: {
        label: "reordered tasks",
        icon: ArrowUpDown,
    },

    SUBTASK_CREATED: {
        label: "created a subtask",
        icon: Plus,
    },

    SUBTASK_UPDATED: {
        label: "updated a subtask",
        icon: Pencil,
    },

    SUBTASK_COMPLETED: {
        label: "completed a subtask",
        icon: Check,
    },

    SUBTASK_REOPENED: {
        label: "reopened a subtask",
        icon: RotateCcw,
    },

    SUBTASK_ARCHIVED: {
        label: "archived a subtask",
        icon: Archive,
    },

    SUBTASK_RESTORED: {
        label: "restored a subtask",
        icon: RotateCcw,
    },

    SUBTASK_REORDERED: {
        label: "reordered subtasks",
        icon: ArrowUpDown,
    },

    COMMENT_CREATED: {
        label: "added a comment",
        icon: MessageSquare,
    },

    COMMENT_UPDATED: {
        label: "edited a comment",
        icon: Pencil,
    },

    COMMENT_DELETED: {
        label: "deleted a comment",
        icon: Trash2,
    },

    LINK_CREATED: {
        label: "added a link",
        icon: LinkIcon,
    },

    LINK_UPDATED: {
        label: "edited a link",
        icon: Pencil,
    },

    LINK_DELETED: {
        label: "removed a link",
        icon: Trash2,
    },
};

const formatDate = (value) => {
    if (!value) {
        return "Unknown date";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "Unknown date";
    }

    return date.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
    });
};

const getAdminName = (activity) => {
    const admin = activity?.admin;

    if (!admin) {
        return "Unknown admin";
    }

    return (
        admin.fullName ||
        admin.username ||
        "Unknown admin"
    );
};

const formatMetadataValue = (value) => {
    if (
        value === null ||
        value === undefined
    ) {
        return "";
    }

    if (
        typeof value === "object"
    ) {
        try {
            return JSON.stringify(
                value,
                null,
                2
            );
        } catch {
            return String(value);
        }
    }

    return String(value);
};

function Activity({
    activities = [],
    loading = false,
    error = "",
}) {
    if (loading) {
        return (
            <section className="border border-[var(--border)] bg-[var(--card)]">
                <div className="border-b border-[var(--border)] p-5">
                    <h2 className="text-base font-semibold">
                        Activity
                    </h2>
                </div>

                <div className="flex items-center justify-center p-10">
                    <p className="text-sm text-[var(--muted)]">
                        Loading activity...
                    </p>
                </div>
            </section>
        );
    }

    return (
        <section className="border border-[var(--border)] bg-[var(--card)]">
            <div className="border-b border-[var(--border)] p-5">
                <h2 className="text-base font-semibold">
                    Activity
                </h2>

                <p className="mt-1 text-sm text-[var(--muted)]">
                    Immutable history of changes made to
                    this work.
                </p>
            </div>

            {error && (
                <div className="border-b border-red-500/20 bg-red-500/5 p-5">
                    <p className="text-sm text-red-400">
                        {error}
                    </p>
                </div>
            )}

            {activities.length === 0 ? (
                <div className="p-10 text-center">
                    <Circle
                        size={24}
                        className="mx-auto text-[var(--muted)]"
                    />

                    <p className="mt-3 text-sm text-[var(--muted)]">
                        No activity recorded yet.
                    </p>
                </div>
            ) : (
                <div className="divide-y divide-[var(--border)]">
                    {activities.map(
                        (activity, index) => {
                            const config =
                                ACTION_CONFIG[
                                    activity?.action
                                ] || {
                                    label:
                                        "performed an action",
                                    icon: Circle,
                                };

                            const Icon =
                                config.icon;

                            const metadata =
                                activity?.metadata || {};

                            return (
                                <div
                                    key={
                                        activity?._id ||
                                        activity?.id ||
                                        `${activity?.action}-${index}`
                                    }
                                    className="flex gap-4 p-5"
                                >
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-purple-500/10 text-purple-400">
                                        <Icon size={16} />
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm leading-6">
                                            <span className="font-semibold">
                                                {getAdminName(
                                                    activity
                                                )}
                                            </span>

                                            {" "}

                                            <span className="text-[var(--muted)]">
                                                {config.label}
                                            </span>
                                        </p>

                                        {activity?.description && (
                                            <p className="mt-1 text-sm leading-6 text-[var(--muted)]">
                                                {
                                                    activity.description
                                                }
                                            </p>
                                        )}

                                        {(metadata.before !==
                                            undefined ||
                                            metadata.after !==
                                                undefined) && (
                                            <div className="mt-3 border border-[var(--border)] bg-[var(--surface)] p-3 text-xs">
                                                {metadata.before !==
                                                    undefined && (
                                                    <div>
                                                        <span className="font-semibold">
                                                            Before:
                                                        </span>

                                                        <pre className="mt-1 whitespace-pre-wrap break-words text-[var(--muted)]">
                                                            {formatMetadataValue(
                                                                metadata.before
                                                            )}
                                                        </pre>
                                                    </div>
                                                )}

                                                {metadata.after !==
                                                    undefined && (
                                                    <div className="mt-3">
                                                        <span className="font-semibold">
                                                            After:
                                                        </span>

                                                        <pre className="mt-1 whitespace-pre-wrap break-words text-[var(--muted)]">
                                                            {formatMetadataValue(
                                                                metadata.after
                                                            )}
                                                        </pre>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        <p className="mt-2 text-xs text-[var(--muted)]">
                                            {formatDate(
                                                activity?.createdAt
                                            )}
                                        </p>
                                    </div>
                                </div>
                            );
                        }
                    )}
                </div>
            )}
        </section>
    );
}

export default Activity;