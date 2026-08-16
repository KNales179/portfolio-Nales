import {
    Plus,
    Pencil,
    Trash2,
    Check,
    RotateCcw,
    Archive,
    Lock,
    Unlock,
    Shield,
    Circle,
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

    WORK_DELETED: {
        label: "permanently deleted the work",
        icon: Trash2,
    },

    WORK_STATUS_CHANGED: {
        label: "changed the work status",
        icon: Circle,
    },

    TASK_CREATED: {
        label: "created a task",
        icon: Plus,
    },

    TASK_UPDATED: {
        label: "updated a task",
        icon: Pencil,
    },

    TASK_DELETED: {
        label: "archived a task",
        icon: Archive,
    },

    TASK_STATUS_CHANGED: {
        label: "changed a task status",
        icon: Circle,
    },

    SUBTASK_CREATED: {
        label: "created a subtask",
        icon: Plus,
    },

    SUBTASK_UPDATED: {
        label: "updated a subtask",
        icon: Pencil,
    },

    SUBTASK_DELETED: {
        label: "archived a subtask",
        icon: Archive,
    },

    SUBTASK_COMPLETED: {
        label: "completed a subtask",
        icon: Check,
    },

    SUBTASK_UNCOMPLETED: {
        label: "reopened a subtask",
        icon: RotateCcw,
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

    PARTICIPANT_ADDED: {
        label: "added a participant",
        icon: Shield,
    },

    PARTICIPANT_REMOVED: {
        label: "removed a participant",
        icon: Shield,
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

    return date.toLocaleString(
        "en-US",
        {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
        }
    );
};

const getAdminName = (activity) => {
    if (!activity?.admin) {
        return "Unknown admin";
    }

    return (
        activity.admin.fullName ||
        activity.admin.username ||
        "Unknown admin"
    );
};

function Activity({
    activities = [],
    loading = false,
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

            {activities.length === 0 ? (
                <div className="p-10 text-center">
                    <p className="text-sm text-[var(--muted)]">
                        No activity recorded yet.
                    </p>
                </div>
            ) : (
                <div className="divide-y divide-[var(--border)]">
                    {activities.map(
                        (activity, index) => {
                            const config =
                                ACTION_CONFIG[
                                    activity.action
                                ] || {
                                    label:
                                        "performed an action",
                                    icon: Circle,
                                };

                            const Icon =
                                config.icon;

                            return (
                                <div
                                    key={
                                        activity._id ||
                                        `${activity.action}-${index}`
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
                                            </span>{" "}
                                            <span className="text-[var(--muted)]">
                                                {
                                                    config.label
                                                }
                                            </span>
                                        </p>

                                        {activity.description && (
                                            <p className="mt-1 text-sm leading-6 text-[var(--muted)]">
                                                {
                                                    activity.description
                                                }
                                            </p>
                                        )}

                                        {activity.metadata
                                            ?.before ||
                                        activity.metadata
                                            ?.after ? (
                                            <div className="mt-3 border border-[var(--border)] bg-[var(--surface)] p-3 text-xs">
                                                {activity
                                                    .metadata
                                                    ?.before && (
                                                    <div>
                                                        <span className="font-semibold">
                                                            Before:
                                                        </span>{" "}
                                                        {
                                                            typeof activity
                                                                .metadata
                                                                .before ===
                                                            "object"
                                                                ? JSON.stringify(
                                                                    activity
                                                                        .metadata
                                                                        .before
                                                                )
                                                                : activity
                                                                    .metadata
                                                                    .before
                                                        }
                                                    </div>
                                                )}

                                                {activity
                                                    .metadata
                                                    ?.after && (
                                                    <div className="mt-2">
                                                        <span className="font-semibold">
                                                            After:
                                                        </span>{" "}
                                                        {
                                                            typeof activity
                                                                .metadata
                                                                .after ===
                                                            "object"
                                                                ? JSON.stringify(
                                                                    activity
                                                                        .metadata
                                                                        .after
                                                                )
                                                                : activity
                                                                    .metadata
                                                                    .after
                                                        }
                                                    </div>
                                                )}
                                            </div>
                                        ) : null}

                                        <p className="mt-2 text-xs text-[var(--muted)]">
                                            {formatDate(
                                                activity.createdAt
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