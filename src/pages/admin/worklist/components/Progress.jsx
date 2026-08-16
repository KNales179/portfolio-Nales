import {
    CheckCircle2,
    Circle,
} from "lucide-react";

const getTaskProgress = (task) => {
    if (!task) {
        return 0;
    }

    const subtasks = Array.isArray(
        task.subtasks
    )
        ? task.subtasks
        : [];

    if (subtasks.length === 0) {
        return task.status === "COMPLETED"
            ? 100
            : 0;
    }

    const completed =
        subtasks.filter(
            (subtask) =>
                subtask?.completed === true
        ).length;

    return Math.round(
        (completed /
            subtasks.length) *
        100
    );
};

function Progress({
    work,
    tasks = [],
}) {
    const safeTasks = Array.isArray(tasks)
        ? tasks
        : Array.isArray(work?.tasks)
            ? work.tasks
            : [];

    const taskProgresses =
        safeTasks.map(
            getTaskProgress
        );

    const progress =
        taskProgresses.length > 0
            ? Math.round(
                taskProgresses.reduce(
                    (sum, value) =>
                        sum + value,
                    0
                ) /
                taskProgresses.length
            )
            : 0;

    const completedTasks =
        taskProgresses.filter(
            (value) => value === 100
        ).length;

    const status =
        work?.status
            ? work.status.replace(
                /_/g,
                " "
            )
            : "UNKNOWN";

    return (
        <section className="border border-[var(--border)] bg-[var(--card)]">

            <div className="border-b border-[var(--border)] p-5">

                <div className="flex items-center justify-between gap-4">

                    <div>
                        <h2 className="text-base font-semibold">
                            Progress
                        </h2>

                        <p className="mt-0.5 text-xs text-[var(--muted)]">
                            Progress is calculated automatically from task completion.
                        </p>
                    </div>

                    <span className="text-2xl font-bold">
                        {progress}%
                    </span>

                </div>

                <div className="mt-5 h-3 overflow-hidden bg-[var(--surface)]">

                    <div
                        className={`h-full transition-all duration-500 ${
                            progress === 100
                                ? "bg-green-500"
                                : "bg-purple-500"
                        }`}
                        style={{
                            width: `${progress}%`,
                        }}
                    />

                </div>

                <div className="mt-3 flex justify-between gap-4 text-xs text-[var(--muted)]">

                    <span>
                        {completedTasks} of{" "}
                        {safeTasks.length}{" "}
                        tasks completed
                    </span>

                    <span>
                        {status}
                    </span>

                </div>

            </div>

            {safeTasks.length > 0 && (

                <div className="divide-y divide-[var(--border)]">

                    {safeTasks.map(
                        (task) => {
                            const value =
                                getTaskProgress(
                                    task
                                );

                            const completed =
                                value === 100;

                            return (
                                <div
                                    key={task._id}
                                    className="flex items-center gap-3 p-4"
                                >

                                    {completed ? (
                                        <CheckCircle2
                                            size={17}
                                            className="shrink-0 text-green-400"
                                        />
                                    ) : (
                                        <Circle
                                            size={17}
                                            className="shrink-0 text-[var(--muted)]"
                                        />
                                    )}

                                    <div className="min-w-0 flex-1">

                                        <div className="flex items-center justify-between gap-3">

                                            <p className="truncate text-sm font-medium">
                                                {task.title ||
                                                    "Untitled task"}
                                            </p>

                                            <span className="shrink-0 text-xs font-semibold text-[var(--muted)]">
                                                {value}%
                                            </span>

                                        </div>

                                        <div className="mt-2 h-1.5 overflow-hidden bg-[var(--surface)]">

                                            <div
                                                className={`h-full transition-all duration-300 ${
                                                    completed
                                                        ? "bg-green-400"
                                                        : "bg-purple-400"
                                                }`}
                                                style={{
                                                    width: `${value}%`,
                                                }}
                                            />

                                        </div>

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

export default Progress;